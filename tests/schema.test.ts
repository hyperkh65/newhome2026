import test from "node:test";
import assert from "node:assert/strict";

import { demoBundle } from "../lib/datahub/demo-seed";

test("public bundle 최소 스키마를 만족한다", () => {
  assert.equal(typeof demoBundle.generatedAt, "string");
  assert.equal(Array.isArray(demoBundle.products), true);
  assert.equal(Array.isArray(demoBundle.companies), true);
  assert.equal(Array.isArray(demoBundle.listings), true);
});
