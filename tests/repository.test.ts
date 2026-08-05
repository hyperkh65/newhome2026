import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";

import { loadBundle } from "../lib/datahub/repository";

test("공개 데이터가 없으면 demo bundle을 fallback 한다", async () => {
  const bundlePath = path.join(process.cwd(), "data", "public", "bundle.json");
  const backupPath = path.join(process.cwd(), "data", "public", "bundle.test-backup.json");

  await fs.rename(bundlePath, backupPath);

  try {
    const bundle = await loadBundle();
    assert.equal(bundle.demo, true);
    assert.ok(bundle.products.length > 0);
  } finally {
    await fs.rename(backupPath, bundlePath);
  }
});
