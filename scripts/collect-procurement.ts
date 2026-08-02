import { promises as fs } from "node:fs";
import path from "node:path";

import { ProcurementAdapter } from "../lib/datahub/sources/procurement";

const BROAD_PROCUREMENT_TERMS = [
  "주식회사",
  "유한회사",
  "산업",
  "테크",
  "전자",
  "시스템",
  "건설",
  "개발",
  "엔지니어링",
  "정보통신",
  "전기",
  "가구",
  "기술",
  "사",
];
const MAX_CONSECUTIVE_FAILURES = 4;

const rawDir = path.join(process.cwd(), "data", "raw");
const historyDir = path.join(process.cwd(), "data", "history");

async function listProcurementFiles() {
  try {
    const entries = await fs.readdir(rawDir);
    return entries
      .filter((entry) => /^procurement-\d{4}-\d{2}-\d{2}\.json$/.test(entry))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

async function loadLatestFallbackRows() {
  const files = await listProcurementFiles();
  const latestFile = files[0];
  if (!latestFile) return null;

  const fullPath = path.join(rawDir, latestFile);
  const raw = await fs.readFile(fullPath, "utf8");
  return {
    file: latestFile,
    rows: JSON.parse(raw),
  };
}

async function writeFallbackStatus(payload: unknown) {
  await fs.mkdir(historyDir, { recursive: true });
  await fs.writeFile(
    path.join(historyDir, "procurement-fallback-status.json"),
    JSON.stringify(payload, null, 2),
    "utf8"
  );
}

async function main() {
  const adapter = new ProcurementAdapter();
  const limit = Number(process.env.PROCUREMENT_LIMIT ?? "200000");
  const pageLimit = Number(process.env.PROCUREMENT_PAGE_LIMIT ?? "500");
  const mode = (process.env.PROCUREMENT_MODE ?? "all-broad").trim();
  const categoryMode = mode === "all" ? "all" : "lighting";
  const todayFile = path.join(rawDir, `procurement-${new Date().toISOString().slice(0, 10)}.json`);

  try {
    const normalizedRows =
      mode === "all-broad"
        ? await (async () => {
            const rowsById = new Map();
            const failures: string[] = [];
            let consecutiveFailures = 0;

            for (const query of BROAD_PROCUREMENT_TERMS) {
              console.log(`Procurement query: ${query}`);
              try {
                const rows = await adapter.fetch({
                  query,
                  limit,
                  pageLimit,
                  categoryMode: "all",
                });
                for (const row of rows) {
                  rowsById.set(String(row.productId ?? row.sourceId), row);
                }
                consecutiveFailures = 0;
                console.log(
                  `Procurement query complete: ${query} (${rows.length} rows, total ${rowsById.size})`
                );
              } catch (error) {
                failures.push(`${query}:${error instanceof Error ? error.message : String(error)}`);
                consecutiveFailures += 1;
                console.warn(`Procurement query failed: ${query}`);
                if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES && rowsById.size === 0) {
                  break;
                }
              }
            }

            if (rowsById.size === 0) {
              throw new Error(failures.slice(0, 5).join(" | ") || "조달 실데이터를 찾지 못했습니다.");
            }

            if (failures.length > 0) {
              console.warn(`Procurement partial failures: ${failures.slice(0, 5).join(" | ")}`);
            }

            return Array.from(rowsById.values());
          })()
        : await adapter.fetch({
            query: mode === "all" ? "" : process.env.PROCUREMENT_QUERY?.trim() || "LED",
            limit,
            pageLimit,
            categoryMode,
          });

    await fs.mkdir(rawDir, { recursive: true });
    await fs.writeFile(todayFile, JSON.stringify(normalizedRows, null, 2), "utf8");
    await writeFallbackStatus({
      usedFallback: false,
      updatedAt: new Date().toISOString(),
      targetFile: path.basename(todayFile),
      rowCount: normalizedRows.length,
    });
    console.log(`Saved ${normalizedRows.length} procurement rows to ${todayFile}`);
  } catch (error) {
    const fallback = await loadLatestFallbackRows();
    if (!fallback) {
      throw error;
    }

    await fs.mkdir(rawDir, { recursive: true });
    await fs.writeFile(todayFile, JSON.stringify(fallback.rows, null, 2), "utf8");
    await writeFallbackStatus({
      usedFallback: true,
      updatedAt: new Date().toISOString(),
      targetFile: path.basename(todayFile),
      sourceFile: fallback.file,
      rowCount: Array.isArray(fallback.rows) ? fallback.rows.length : 0,
      reason: error instanceof Error ? error.message : String(error),
    });
    console.warn(
      `Procurement fetch failed. Reused fallback dataset from ${fallback.file} into ${path.basename(todayFile)}`
    );
    console.log(
      `Saved ${Array.isArray(fallback.rows) ? fallback.rows.length : 0} procurement rows to ${todayFile} (fallback)`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
