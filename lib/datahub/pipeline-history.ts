import { promises as fs } from "node:fs";
import path from "node:path";

import type { ChangeSummary, CollectionRun } from "@/types/datahub";

const dataDir = path.join(process.cwd(), "data");
const historyDir = path.join(dataDir, "history");
const runsDir = path.join(historyDir, "runs");
const analyticsDir = path.join(dataDir, "analytics");

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

async function writeJsonFile(filePath: string, payload: unknown) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

export function getHistoryPaths() {
  return {
    historyDir,
    runsDir,
    analyticsDir,
    latestRunFile: path.join(historyDir, "latest-run.json"),
    runHistoryFile: path.join(historyDir, "collection-runs-history.json"),
    latestChangesFile: path.join(analyticsDir, "change-summary.json"),
    changeHistoryFile: path.join(historyDir, "change-history.json"),
  };
}

export async function loadCollectionRunHistory(limit = 60) {
  const { runHistoryFile } = getHistoryPaths();
  const rows = (await readJsonFile<CollectionRun[]>(runHistoryFile)) ?? [];
  return rows.slice(0, limit);
}

export async function saveCollectionRunHistory(nextRuns: CollectionRun[], limit = 60) {
  const { latestRunFile, runHistoryFile } = getHistoryPaths();
  const existing = (await readJsonFile<CollectionRun[]>(runHistoryFile)) ?? [];
  const merged = [...nextRuns, ...existing].reduce<CollectionRun[]>((acc, run) => {
    if (acc.some((item) => item.runId === run.runId)) return acc;
    acc.push(run);
    return acc;
  }, []);
  await writeJsonFile(runHistoryFile, merged.slice(0, limit));
  await writeJsonFile(latestRunFile, {
    generatedAt: new Date().toISOString(),
    runs: nextRuns,
  });
}

export async function loadLatestCollectionRuns() {
  const { latestRunFile } = getHistoryPaths();
  const payload = await readJsonFile<{ generatedAt: string; runs: CollectionRun[] }>(latestRunFile);
  return payload?.runs ?? [];
}

export async function loadLatestChangeSummary() {
  const { latestChangesFile } = getHistoryPaths();
  return await readJsonFile<ChangeSummary>(latestChangesFile);
}

export async function saveChangeSummary(summary: ChangeSummary, limit = 60) {
  const { latestChangesFile, changeHistoryFile } = getHistoryPaths();
  const existing = (await readJsonFile<ChangeSummary[]>(changeHistoryFile)) ?? [];
  const merged = [summary, ...existing].reduce<ChangeSummary[]>((acc, item) => {
    if (acc.some((row) => row.runId === item.runId)) return acc;
    acc.push(item);
    return acc;
  }, []);
  await writeJsonFile(latestChangesFile, summary);
  await writeJsonFile(changeHistoryFile, merged.slice(0, limit));
}

export async function writeRunArtifact(runId: string, payload: unknown) {
  await writeJsonFile(path.join(runsDir, `${runId}.json`), payload);
}

export async function readBundleFile<T>(filePath: string) {
  return await readJsonFile<T>(filePath);
}

export async function writeAnalyticsFile(filename: string, payload: unknown) {
  await writeJsonFile(path.join(analyticsDir, filename), payload);
}
