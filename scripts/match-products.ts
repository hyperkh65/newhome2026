import { demoBundle } from "../lib/datahub/demo-seed";
import { buildNormalizedCandidate } from "../lib/datahub/normalizers";
import { scoreProductMatch, shouldAutoMerge } from "../lib/datahub/matching";

async function main() {
  const [left, right] = demoBundle.products;
  const result = scoreProductMatch(
    buildNormalizedCandidate({
      displayName: left.displayName,
      category: left.category,
      brand: left.brand,
    }),
    buildNormalizedCandidate({
      displayName: right.displayName,
      category: right.category,
      brand: right.brand,
    })
  );

  console.log(JSON.stringify({ result, autoMerge: shouldAutoMerge(result.score) }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
