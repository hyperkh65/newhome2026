import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCanonicalName,
  extractSpecifications,
  normalizeCompanyName,
  normalizeProductName,
} from "../lib/datahub/normalizers";

test("제품명 정규화는 홍보 문구와 공백을 정리한다", () => {
  assert.equal(
    normalizeProductName("정품 LED 공장등  100 W 무료배송"),
    "LED 공장등 100W"
  );
});

test("업체명 정규화는 법인 표기를 제거한다", () => {
  assert.equal(normalizeCompanyName("주식회사 씨피엔텍"), "씨피엔텍");
  assert.equal(normalizeCompanyName("(주) 와이앤케이"), "와이앤케이");
  assert.equal(normalizeCompanyName("&#40;주&#41; 한국경관조명이엔지"), "한국경관조명이엔지");
});

test("정규화 이름은 비교 가능한 canonical string을 만든다", () => {
  assert.equal(buildCanonicalName("LED 공장등 UFO-AM6-150W 5700K"), "led 공장등 ufo am6 150w 5700k");
});

test("사양 추출은 전력과 색온도를 찾는다", () => {
  const specs = extractSpecifications("LED 공장등 UFO-AM6-150W 5700K IP65 320x180");
  assert.equal(specs.wattage, 150);
  assert.equal(specs.colorTemperature, 5700);
  assert.equal(specs.ipRating, "IP65");
});
