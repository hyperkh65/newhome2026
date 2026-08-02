import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { loadPipelineStatusSnapshot } from "@/lib/datahub/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const historyDir = path.join(process.cwd(), "data", "history");
const lockPath = path.join(historyDir, "manual-run-lock.json");
const statusPath = path.join(historyDir, "manual-run-status.json");

type ManualRunState = {
  pid: number;
  startedAt: string;
  triggeredBy: string;
  status: "running" | "finished" | "failed";
  finishedAt?: string;
  exitCode?: number | null;
};

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isProcessAlive(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function readManualState() {
  const lock = await readJsonFile<ManualRunState>(lockPath);
  if (lock && isProcessAlive(lock.pid)) {
    return lock;
  }

  if (lock) {
    await fs.unlink(lockPath).catch(() => undefined);
  }

  return (await readJsonFile<ManualRunState>(statusPath)) ?? null;
}

function extractSecret(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  const headerSecret = request.headers.get("x-admin-secret");
  if (headerSecret) {
    return headerSecret.trim();
  }

  return null;
}

function isAuthorized(inputSecret: string | null, expectedSecret: string | undefined) {
  if (!inputSecret || !expectedSecret) return false;
  const left = Buffer.from(inputSecret);
  const right = Buffer.from(expectedSecret);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function GET() {
  const [pipelineStatus, manualRun] = await Promise.all([
    loadPipelineStatusSnapshot(),
    readManualState(),
  ]);

  return NextResponse.json({
    ok: true,
    pipelineStatus,
    manualRun,
  });
}

export async function POST(request: Request) {
  const expectedSecret = process.env.ADMIN_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_SECRET is not configured." },
      { status: 503 }
    );
  }

  if (!isAuthorized(extractSecret(request), expectedSecret)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  const running = await readJsonFile<ManualRunState>(lockPath);
  if (running && isProcessAlive(running.pid)) {
    return NextResponse.json(
      { ok: false, error: "Pipeline is already running.", manualRun: running },
      { status: 409 }
    );
  }

  await fs.mkdir(historyDir, { recursive: true });

  const child = spawn(
    process.execPath,
    ["--import", "tsx", "scripts/run-pipeline-manual.ts"],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DATAHUB_TRIGGER: "manual-api",
      },
      detached: true,
      stdio: "ignore",
    }
  );

  child.unref();

  const state: ManualRunState = {
    pid: child.pid ?? 0,
    startedAt: new Date().toISOString(),
    triggeredBy: "manual-api",
    status: "running",
  };

  await fs.writeFile(lockPath, JSON.stringify(state, null, 2), "utf8");

  return NextResponse.json(
    {
      ok: true,
      message: "Pipeline started.",
      manualRun: state,
    },
    { status: 202 }
  );
}
