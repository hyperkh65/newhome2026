import { promises as fs } from "node:fs";
import path from "node:path";

import { ProcurementAdapter } from "../lib/datahub/sources/procurement";
import type { RawProductRecord } from "../types/datahub";

async function readJsonArray(filePath: string) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RawProductRecord[]) : [];
  } catch {
    return [];
  }
}

async function main() {
  const query = process.argv.slice(2).join(" ").trim();
  if (!query) {
    throw new Error("검색어를 전달하세요. 예: node --import tsx scripts/collect-procurement-query.ts 씨피엔텍");
  }

  const adapter = new ProcurementAdapter();
  const rows = await adapter.fetch({
    query,
    limit: Number(process.env.PROCUREMENT_QUERY_LIMIT ?? "200"),
    pageLimit: Number(process.env.PROCUREMENT_QUERY_PAGE_LIMIT ?? "10"),
    categoryMode: "all",
  });

  const outDir = path.join(process.cwd(), "data", "raw");
  const file = path.join(outDir, `procurement-${new Date().toISOString().slice(0, 10)}.json`);
  const existing = await readJsonArray(file);
  const merged = new Map<string, RawProductRecord>();

  for (const row of existing) {
    merged.set(String(row.productId ?? row.sourceId), row);
  }

  for (const row of rows) {
    merged.set(String(row.productId ?? row.sourceId), row);
  }

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(Array.from(merged.values()), null, 2), "utf8");

  console.log(
    `Merged ${rows.length} rows for "${query}" into ${file}. Total rows: ${merged.size}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
