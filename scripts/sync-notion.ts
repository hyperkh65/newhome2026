import { buildRawHash, queueNotionWrites } from "../lib/datahub/notion";
import { demoBundle } from "../lib/datahub/demo-seed";

async function main() {
  const databaseId = process.env.NOTION_PRODUCTS_DATABASE_ID;
  if (!process.env.NOTION_TOKEN || !databaseId) {
    console.log("Dry run: NOTION_TOKEN or NOTION_PRODUCTS_DATABASE_ID missing");
    return;
  }

  const tasks = demoBundle.products.slice(0, 3).map((product) => ({
    databaseId,
    payload: {
      title: {
        title: [{ text: { content: product.displayName } }],
      },
    },
    rawHash: buildRawHash(product),
  }));

  const results = await queueNotionWrites(tasks);
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
