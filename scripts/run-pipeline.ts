import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  loadLatestChangeSummary,
  saveCollectionRunHistory,
  writeRunArtifact,
} from "@/lib/datahub/pipeline-history";
import type { CollectionRun, FetchStatus } from "@/types/datahub";

type StepResult = {
  name: string;
  sourceName: string;
  command: string;
  args: string[];
  optional: boolean;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  success: boolean;
  status: FetchStatus;
  stdout: string;
  stderr: string;
  outputFile: string | null;
  fetchedCount: number;
  insertedCount: number;
  changedCount: number;
  errorCount: number;
  errorSummary: string | null;
};

function tsxArgs(script: string, ...scriptArgs: string[]) {
  return ["--import", "tsx", script, ...scriptArgs];
}

function buildRunId() {
  return new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
}

async function snapshotExistingBundle(runId: string) {
  const bundlePath = path.join(process.cwd(), "data", "public", "bundle.json");
  const tempPath = path.join(os.tmpdir(), `datahub-bundle-${runId}.json`);
  try {
    await fs.copyFile(bundlePath, tempPath);
    return tempPath;
  } catch {
    return null;
  }
}

function inferOutputFile(stepName: string) {
  const today = new Date().toISOString().slice(0, 10);
  if (stepName === "procurement") return `data/raw/procurement-${today}.json`;
  if (stepName === "build-public") return "data/public/bundle.json";
  if (stepName === "detect-changes") return "data/analytics/change-summary.json";
  if (stepName === "analyze") return "data/analytics/python-analysis.json";
  return null;
}

function extractCount(output: string, label: "Saved" | "products") {
  if (label === "Saved") {
    const match = output.match(/Saved\s+(\d+)\s+/i);
    return match ? Number(match[1]) : 0;
  }
  const match = output.match(/products=(\d+)/i);
  return match ? Number(match[1]) : 0;
}

function summarizeError(stderr: string, stdout: string) {
  const message = `${stderr}\n${stdout}`.trim();
  if (!message) return null;
  return message.split("\n").find(Boolean)?.slice(0, 280) ?? null;
}

function toCollectionRun(runId: string, step: StepResult): CollectionRun {
  return {
    runId: `${runId}-${step.name}`,
    startedAt: step.startedAt,
    finishedAt: step.finishedAt,
    sourceName: step.sourceName,
    success: step.success,
    fetchedCount: step.fetchedCount,
    insertedCount: step.insertedCount,
    changedCount: step.changedCount,
    errorCount: step.errorCount,
    errorSummary: step.errorSummary,
    outputFile: step.outputFile,
    durationMs: step.durationMs,
    status: step.status,
    demo: false,
  };
}

function summarizePipelineRun(runId: string, steps: StepResult[]): CollectionRun {
  const startedAt = steps[0]?.startedAt ?? new Date().toISOString();
  const finishedAt = steps[steps.length - 1]?.finishedAt ?? startedAt;
  const failedRequired = steps.filter((step) => !step.optional && !step.success);
  const hasOptionalFailure = steps.some((step) => step.optional && !step.success);
  const status: FetchStatus =
    failedRequired.length > 0 ? "failed" : hasOptionalFailure ? "partial" : "success";

  return {
    runId,
    startedAt,
    finishedAt,
    sourceName: "DataPipeline",
    success: failedRequired.length === 0,
    fetchedCount: steps.reduce((sum, step) => sum + step.fetchedCount, 0),
    insertedCount: steps.reduce((sum, step) => sum + step.insertedCount, 0),
    changedCount: steps.reduce((sum, step) => sum + step.changedCount, 0),
    errorCount: steps.reduce((sum, step) => sum + step.errorCount, 0),
    errorSummary:
      failedRequired[0]?.errorSummary ??
      steps.find((step) => !step.success)?.errorSummary ??
      null,
    outputFile: "data/public/bundle.json",
    durationMs: steps.reduce((sum, step) => sum + (step.durationMs ?? 0), 0),
    status,
    demo: false,
  };
}

function runStep(
  name: string,
  sourceName: string,
  command: string,
  args: string[],
  optional = false
) {
  return new Promise<StepResult>((resolve) => {
    const startedAt = new Date().toISOString();
    const started = Date.now();
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      const text = String(chunk);
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = String(chunk);
      stderr += text;
      process.stderr.write(text);
    });

    child.on("exit", (code) => {
      const finishedAt = new Date().toISOString();
      const success = code === 0;
      const status: FetchStatus = success ? "success" : optional ? "partial" : "failed";
      const outputFile = inferOutputFile(name);
      const fetchedCount = name === "procurement" ? extractCount(stdout, "Saved") : 0;
      const insertedCount = name === "build-public" ? extractCount(stdout, "products") : fetchedCount;
      resolve({
        name,
        sourceName,
        command,
        args,
        optional,
        startedAt,
        finishedAt,
        durationMs: Date.now() - started,
        success,
        status,
        stdout,
        stderr,
        outputFile,
        fetchedCount,
        insertedCount,
        changedCount: 0,
        errorCount: success ? 0 : 1,
        errorSummary: success ? null : summarizeError(stderr, stdout),
      });
    });
  });
}

async function main() {
  const runId = buildRunId();
  const previousBundlePath = await snapshotExistingBundle(runId);
  const steps: StepResult[] = [];

  steps.push(
    await runStep(
      "procurement",
      "ProcurementAdapter",
      process.execPath,
      tsxArgs("scripts/collect-procurement.ts"),
      true
    )
  );

  const buildStep = await runStep(
    "build-public",
    "PublicDataBuilder",
    process.execPath,
    tsxArgs("scripts/build-public-data.ts"),
    false
  );
  steps.push(buildStep);
  if (!buildStep.success) {
    const runs = steps.map((step) => toCollectionRun(runId, step));
    await saveCollectionRunHistory(runs);
    await writeRunArtifact(runId, {
      runId,
      generatedAt: new Date().toISOString(),
      success: false,
      previousBundlePath,
      steps,
    });
    throw new Error(buildStep.errorSummary ?? "build-public step failed");
  }

  const changeStep = await runStep(
    "detect-changes",
    "ChangeDetector",
    process.execPath,
    tsxArgs(
      "scripts/detect-changes.ts",
      "--run-id",
      runId,
      ...(previousBundlePath ? ["--previous", previousBundlePath] : []),
      "--current",
      path.join(process.cwd(), "data", "public", "bundle.json")
    ),
    true
  );
  if (changeStep.success) {
    try {
      const summary = JSON.parse(
        await fs.readFile(path.join(process.cwd(), "data", "analytics", "change-summary.json"), "utf8")
      ) as {
        summary?: Record<string, number>;
      };
      changeStep.changedCount = Object.values(summary.summary ?? {}).reduce(
        (sum, value) => sum + (typeof value === "number" ? value : 0),
        0
      );
    } catch {
      // ignore parse failures and keep zero
    }
  }
  steps.push(changeStep);

  steps.push(await runStep("analyze", "AnalyticsEngine", "python3", ["scripts/analyze-data.py"], true));
  steps.push(
    await runStep(
      "sync-notion",
      "NotionSync",
      process.execPath,
      tsxArgs("scripts/sync-notion.ts"),
      true
    )
  );

  const runs = steps.map((step) => toCollectionRun(runId, step));
  await saveCollectionRunHistory(runs);
  await writeRunArtifact(runId, {
    runId,
    generatedAt: new Date().toISOString(),
    success: steps.every((step) => step.success || step.optional),
    previousBundlePath,
    steps,
  });

  const publicDir = path.join(process.cwd(), "data", "public");
  const latestChanges = await loadLatestChangeSummary();
  await fs.mkdir(publicDir, { recursive: true });
  const latestRun = summarizePipelineRun(runId, steps);
  await fs.writeFile(
    path.join(publicDir, "collection-runs.json"),
    JSON.stringify(runs, null, 2),
    "utf8"
  );
  await fs.writeFile(
    path.join(publicDir, "pipeline-status.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        demo: false,
        latestRun,
        lastSuccessfulBuildAt: buildStep.success ? buildStep.finishedAt : null,
        runs,
        latestChanges: latestChanges?.summary ?? null,
      },
      null,
      2
    ),
    "utf8"
  );
  if (latestChanges) {
    await fs.writeFile(
      path.join(publicDir, "change-summary.json"),
      JSON.stringify(latestChanges, null, 2),
      "utf8"
    );
  }

  const failedRequired = steps.filter((step) => !step.optional && !step.success);
  if (failedRequired.length > 0) {
    throw new Error(failedRequired.map((step) => `${step.name}: ${step.errorSummary}`).join("\n"));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
