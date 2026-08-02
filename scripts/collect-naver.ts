import { promises as fs } from "node:fs";
import path from "node:path";

import { NaverShoppingAdapter } from "../lib/datahub/sources/naver-shopping";

async function main() {
  const query = process.argv[2] || "LED 공장등";
  const adapter = new NaverShoppingAdapter();
  const rows = await adapter.fetch({ query, limit: 40 });
  const outDir = path.join(process.cwd(), "data", "raw");
  await fs.mkdir(outDir, { recursive: true });
  const file = path.join(outDir, `naver-${new Date().toISOString().slice(0, 10)}.json`);
  await fs.writeFile(file, JSON.stringify(rows, null, 2), "utf8");
  console.log(`Saved ${rows.length} naver rows to ${file}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
