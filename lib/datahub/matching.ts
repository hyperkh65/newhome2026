import type { NormalizedProductCandidate } from "@/types/datahub";

function tokenSet(value: string) {
  return new Set(value.split(" ").filter(Boolean));
}

function tokenSimilarity(left: string, right: string) {
  const leftSet = tokenSet(left);
  const rightSet = tokenSet(right);
  if (leftSet.size === 0 || rightSet.size === 0) return 0;

  let intersection = 0;
  for (const token of leftSet) {
    if (rightSet.has(token)) intersection += 1;
  }
  return intersection / Math.max(leftSet.size, rightSet.size);
}

export function scoreProductMatch(
  left: NormalizedProductCandidate,
  right: NormalizedProductCandidate
) {
  let score = 0;
  const reasons: string[] = [];

  if (left.modelName && right.modelName && left.modelName === right.modelName) {
    score += 45;
    reasons.push("모델명 일치");
  }

  if (left.brand && right.brand && left.brand === right.brand) {
    score += 20;
    reasons.push("제조사 일치");
  }

  if (
    left.specifications.wattage &&
    right.specifications.wattage &&
    left.specifications.wattage === right.specifications.wattage
  ) {
    score += 10;
    reasons.push("소비전력 일치");
  }

  if (
    left.specifications.colorTemperature &&
    right.specifications.colorTemperature &&
    left.specifications.colorTemperature === right.specifications.colorTemperature
  ) {
    score += 7;
    reasons.push("색온도 일치");
  }

  if (
    left.specifications.dimensions &&
    right.specifications.dimensions &&
    left.specifications.dimensions === right.specifications.dimensions
  ) {
    score += 8;
    reasons.push("규격 일치");
  }

  if (left.category && right.category && left.category === right.category) {
    score += 5;
    reasons.push("카테고리 일치");
  }

  const nameSimilarity = tokenSimilarity(left.canonicalName, right.canonicalName);
  score += Math.round(nameSimilarity * 20);
  if (nameSimilarity >= 0.5) reasons.push("제품명 토큰 유사");

  return { score, reasons };
}

export function shouldAutoMerge(score: number) {
  return score >= 72;
}
