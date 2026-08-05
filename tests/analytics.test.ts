import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateChangeRate,
  iqrOutliers,
  median,
} from "../lib/datahub/analytics";

test("중앙값 계산", () => {
  assert.equal(median([1, 3, 5]), 3);
  assert.equal(median([1, 3, 5, 7]), 4);
});

test("가격 변동률 계산", () => {
  assert.equal(calculateChangeRate(110, 100), 10);
});

test("IQR 이상치 탐지", () => {
  const outliers = iqrOutliers([100, 101, 99, 103, 102, 300]);
  assert.deepEqual(outliers, [300]);
});
