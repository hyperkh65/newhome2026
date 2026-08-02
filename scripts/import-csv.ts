import { promises as fs } from "node:fs";
import path from "node:path";

import { CsvImportAdapter, parseCsv } from "../lib/datahub/sources/csv-import";

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    throw new Error("Usage: tsx scripts/import-csv.ts <csv-path>");
  }

  const csv = await fs.readFile(path.resolve(filePath), "utf8");
  const rows = parseCsv(csv);
  const adapter = new CsvImportAdapter();
  const invalid = rows
    .map((row, index) => ({ index: index + 2, validation: adapter.validate({ ...row, sourceId: "csv", sourceName: "CsvImportAdapter", marketType: "consumer" }) }))
    .filter((item) => !item.validation.valid);

  console.log(JSON.stringify({ total: rows.length, invalid }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
