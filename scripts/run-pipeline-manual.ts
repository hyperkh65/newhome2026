import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

type ManualRunLock = {
  pid: number;
  startedAt: string;
  triggeredBy: string;
  status: "running" | "finished" | "failed";
  finishedAt?: string;
  exitCode?: number | null;
};

const historyDir = path.join(process.cwd(), "data", "history");
const lockPath = path.join(historyDir, "manual-run-lock.json");
const statusPath = path.join(historyDir, "manual-run-status.json");
const logPath = path.join(historyDir, "manual-run.log");

async function writeJson(filePath: string, payload: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

async function removeFile(filePath: string) {
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore
  }
}

async function main() {
  const startedAt = new Date().toISOString();
  const triggeredBy = process.env.DATAHUB_TRIGGER ?? "manual-api";
  const logFile = await fs.open(logPath, "a");

  const runningState: ManualRunLock = {
    pid: process.pid,
    startedAt,
    triggeredBy,
    status: "running",
  };

  await writeJson(lockPath, runningState);
  await writeJson(statusPath, runningState);

  const child = spawn(process.execPath, ["--import", "tsx", "scripts/run-pipeline.ts"], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", logFile.fd, logFile.fd],
  });

  child.on("error", async () => {
    const failedAt = new Date().toISOString();
    await writeJson(statusPath, {
      ...runningState,
      status: "failed",
      finishedAt: failedAt,
      exitCode: null,
    } satisfies ManualRunLock);
    await removeFile(lockPath);
    await logFile.close();
    process.exit(1);
  });

  child.on("exit", async (code) => {
    const finishedAt = new Date().toISOString();
    const success = code === 0;
    await writeJson(statusPath, {
      ...runningState,
      status: success ? "finished" : "failed",
      finishedAt,
      exitCode: code,
    } satisfies ManualRunLock);
    await removeFile(lockPath);
    await logFile.close();
    process.exit(success ? 0 : 1);
  });
}

main().catch(async (error) => {
  const failedAt = new Date().toISOString();
  await writeJson(statusPath, {
    pid: process.pid,
    startedAt: failedAt,
    triggeredBy: process.env.DATAHUB_TRIGGER ?? "manual-api",
    status: "failed",
    finishedAt: failedAt,
    exitCode: 1,
    error: error instanceof Error ? error.message : String(error),
  });
  await removeFile(lockPath);
  process.exit(1);
});
