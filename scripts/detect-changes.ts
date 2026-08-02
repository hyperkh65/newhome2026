import { promises as fs } from "node:fs";
import path from "node:path";

import { normalizeCompanyName } from "@/lib/datahub/normalizers";
import { saveChangeSummary, writeAnalyticsFile } from "@/lib/datahub/pipeline-history";
import type { ChangeSummary, PriceSnapshot, Product, PublicDataBundle } from "@/types/datahub";

function parseArg(flag: string) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

async function readBundle(filePath: string | null) {
  if (!filePath) return null;
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as PublicDataBundle;
  } catch {
    return null;
  }
}

function latestPriceByProduct(priceHistory: PriceSnapshot[]) {
  const latest = new Map<string, PriceSnapshot>();
  for (const snapshot of [...priceHistory].sort((a, b) => b.collectedAt.localeCompare(a.collectedAt))) {
    if (!latest.has(snapshot.productId)) {
      latest.set(snapshot.productId, snapshot);
    }
  }
  return latest;
}

function productEvent(product: Product, priceHistory: Map<string, PriceSnapshot>) {
  const latest = priceHistory.get(product.id);
  return {
    productId: product.id,
    displayName: product.displayName,
    modelName: product.modelName,
    companyName: product.brand ? normalizeCompanyName(product.brand) : null,
    marketTypes: product.marketTypes,
    currentPrice: latest?.totalPrice ?? null,
    previousPrice: null,
    changeRate: null,
  };
}

function createSummary(
  runId: string,
  previous: PublicDataBundle | null,
  current: PublicDataBundle
): ChangeSummary {
  const previousProducts = new Map((previous?.products ?? []).map((product) => [product.id, product]));
  const currentProducts = new Map(current.products.map((product) => [product.id, product]));
  const previousPrices = latestPriceByProduct(previous?.priceHistory ?? []);
  const currentPrices = latestPriceByProduct(current.priceHistory);

  const newProducts = current.products
    .filter((product) => !previousProducts.has(product.id))
    .map((product) => productEvent(product, currentPrices))
    .slice(0, 200);

  const removedProducts = (previous?.products ?? [])
    .filter((product) => !currentProducts.has(product.id))
    .map((product) => productEvent(product, previousPrices))
    .slice(0, 200);

  const priceIncreased: ChangeSummary["priceIncreased"] = [];
  const priceDecreased: ChangeSummary["priceDecreased"] = [];
  const companyChanged: ChangeSummary["companyChanged"] = [];
  const specificationChanged: ChangeSummary["specificationChanged"] = [];

  for (const product of current.products) {
    const previousProduct = previousProducts.get(product.id);
    if (!previousProduct) continue;

    const currentPrice = currentPrices.get(product.id)?.totalPrice ?? null;
    const previousPrice = previousPrices.get(product.id)?.totalPrice ?? null;
    const changeRate =
      currentPrice && previousPrice && previousPrice !== 0
        ? ((currentPrice - previousPrice) / previousPrice) * 100
        : null;

    const baseEvent = {
      productId: product.id,
      displayName: product.displayName,
      modelName: product.modelName,
      companyName: product.brand ? normalizeCompanyName(product.brand) : null,
      marketTypes: product.marketTypes,
      currentPrice,
      previousPrice,
      changeRate,
    };

    if (typeof currentPrice === "number" && typeof previousPrice === "number") {
      if (currentPrice > previousPrice) priceIncreased.push(baseEvent);
      if (currentPrice < previousPrice) priceDecreased.push(baseEvent);
    }

    const previousCompany = normalizeCompanyName(previousProduct.brand ?? "");
    const currentCompany = normalizeCompanyName(product.brand ?? "");
    if (previousCompany && currentCompany && previousCompany !== currentCompany) {
      companyChanged.push(baseEvent);
    }

    if (JSON.stringify(previousProduct.specifications) !== JSON.stringify(product.specifications)) {
      specificationChanged.push(baseEvent);
    }
  }

  return {
    runId,
    generatedAt: new Date().toISOString(),
    previousGeneratedAt: previous?.generatedAt ?? null,
    currentGeneratedAt: current.generatedAt,
    newProducts,
    removedProducts,
    priceIncreased: priceIncreased.slice(0, 200),
    priceDecreased: priceDecreased.slice(0, 200),
    companyChanged: companyChanged.slice(0, 200),
    specificationChanged: specificationChanged.slice(0, 200),
    summary: {
      newProducts: newProducts.length,
      removedProducts: removedProducts.length,
      priceIncreased: priceIncreased.length,
      priceDecreased: priceDecreased.length,
      companyChanged: companyChanged.length,
      specificationChanged: specificationChanged.length,
    },
  };
}

async function main() {
  const previousPath = parseArg("--previous");
  const currentPath = parseArg("--current") ?? path.join(process.cwd(), "data", "public", "bundle.json");
  const runId = parseArg("--run-id") ?? `run-${new Date().toISOString()}`;

  const previous = await readBundle(previousPath);
  const current = await readBundle(currentPath);

  if (!current) {
    throw new Error(`Current bundle not found: ${currentPath}`);
  }

  const summary = createSummary(runId, previous, current);
  await writeAnalyticsFile("change-summary.json", summary);
  await saveChangeSummary(summary);
  console.log(JSON.stringify(summary.summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
