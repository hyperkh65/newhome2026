import { demoBundle } from "../lib/datahub/demo-seed";
import { buildNormalizedCandidate } from "../lib/datahub/normalizers";

async function main() {
  const normalized = demoBundle.products.map((product) =>
    buildNormalizedCandidate({
      displayName: product.displayName,
      category: product.category,
      brand: product.brand,
    })
  );
  console.log(JSON.stringify(normalized, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
