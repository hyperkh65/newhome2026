import test from "node:test";
import assert from "node:assert/strict";

import { scoreProductMatch, shouldAutoMerge } from "../lib/datahub/matching";
import { buildNormalizedCandidate } from "../lib/datahub/normalizers";

test("모델명이 같으면 높은 점수를 준다", () => {
  const left = buildNormalizedCandidate({
    displayName: "LED 공장등 UFO-AM6-150W 5700K",
    category: "공장등",
    brand: "YNK",
  });
  const right = buildNormalizedCandidate({
    displayName: "UFO-AM6-150W LED 하이베이",
    category: "공장등",
    brand: "YNK",
  });

  const result = scoreProductMatch(left, right);
  assert.ok(result.score >= 72);
  assert.equal(shouldAutoMerge(result.score), true);
});
