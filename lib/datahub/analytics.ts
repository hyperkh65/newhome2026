import type {
  CategoryStat,
  Company,
  DashboardSummary,
  Listing,
  MarketComparisonRow,
  PriceDeltaRow,
  PriceSnapshot,
  Product,
  SourceHealthRow,
  CollectionRun,
  DataIssue,
} from "@/types/datahub";

function ascending(values: number[]) {
  return [...values].sort((a, b) => a - b);
}

export function median(values: number[]) {
  if (values.length === 0) return null;
  const sorted = ascending(values);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function quartile(values: number[], q: 0.25 | 0.75) {
  if (values.length === 0) return null;
  const sorted = ascending(values);
  const index = (sorted.length - 1) * q;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  const ratio = index - lower;
  return sorted[lower] + (sorted[upper] - sorted[lower]) * ratio;
}

export function standardDeviation(values: number[]) {
  if (values.length === 0) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function iqrOutliers(values: number[]) {
  const q1 = quartile(values, 0.25);
  const q3 = quartile(values, 0.75);
  if (q1 == null || q3 == null) return [];
  const iqr = q3 - q1;
  const lower = q1 - iqr * 1.5;
  const upper = q3 + iqr * 1.5;
  return values.filter((value) => value < lower || value > upper);
}

export function calculateChangeRate(current?: number | null, previous?: number | null) {
  if (!current || !previous) return null;
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function buildDashboardSummary(
  products: Product[],
  companies: Company[]
): DashboardSummary {
  const procurementProducts = products.filter((product) =>
    product.marketTypes.includes("procurement")
  ).length;
  const consumerProducts = products.filter((product) =>
    product.marketTypes.includes("consumer")
  ).length;
  const recentThreshold = Date.now() - 1000 * 60 * 60 * 24 * 7;

  return {
    totalProducts: products.length,
    procurementProducts,
    consumerProducts,
    companies: companies.length,
    recentNewProducts: products.filter(
      (product) => new Date(product.firstSeenAt).getTime() >= recentThreshold
    ).length,
    lastUpdatedAt: products
      .map((product) => product.lastSeenAt)
      .sort()
      .at(-1),
    demo: products.some((product) => product.demo),
  };
}

export function categoryCounts(products: Product[]): CategoryStat[] {
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function buildPriceDeltaRows(
  products: Product[],
  snapshots: PriceSnapshot[],
  companies: Company[]
): PriceDeltaRow[] {
  const companyIndex = new Map(companies.map((company) => [company.id, company.name]));

  return products.map((product) => {
    const productSnapshots = snapshots
      .filter((snapshot) => snapshot.productId === product.id)
      .sort((a, b) => b.collectedAt.localeCompare(a.collectedAt));
    const current = productSnapshots[0];
    const previous = productSnapshots[1];

    return {
      productId: product.id,
      displayName: product.displayName,
      modelName: product.modelName,
      companyName: product.manufacturerId
        ? companyIndex.get(product.manufacturerId) || null
        : null,
      marketType: product.marketTypes.includes("procurement")
        ? "procurement"
        : "consumer",
      currentPrice: current?.totalPrice ?? null,
      previousPrice: previous?.totalPrice ?? null,
      changeRate: calculateChangeRate(current?.totalPrice, previous?.totalPrice),
      collectedAt: current?.collectedAt ?? product.lastSeenAt,
    };
  });
}

export function buildMarketComparisonRows(
  products: Product[],
  listings: Listing[],
  procurementRecords: Array<{ productId: string; registeredPrice?: number | null }>
): MarketComparisonRow[] {
  return products
    .filter(
      (product) =>
        product.marketTypes.includes("procurement") &&
        product.marketTypes.includes("consumer")
    )
    .map((product) => {
      const procurement = procurementRecords
        .filter((record) => record.productId === product.id)
        .map((record) => record.registeredPrice ?? 0)
        .filter((value) => value > 0);
      const consumer = listings
        .filter(
          (listing) =>
            listing.productId === product.id && listing.marketType === "consumer"
        )
        .map((listing) => listing.totalPrice)
        .filter((value) => value > 0);

      const procurementPrice = median(procurement);
      const consumerMedianPrice = median(consumer);
      return {
        productId: product.id,
        displayName: product.displayName,
        modelName: product.modelName,
        procurementPrice,
        consumerMedianPrice,
        priceGapRate: calculateChangeRate(consumerMedianPrice, procurementPrice),
      };
    });
}

export function buildSourceHealthRows(
  runs: CollectionRun[],
  issues: DataIssue[]
): SourceHealthRow[] {
  return runs.map((run) => ({
    sourceName: run.sourceName,
    marketType: run.sourceName.toLowerCase().includes("naver")
      ? "consumer"
      : run.sourceName.toLowerCase().includes("procurement")
        ? "procurement"
        : "analytics",
    lastCollectedAt: run.finishedAt,
    status: run.success ? (run.errorCount > 0 ? "partial" : "success") : "failed",
    issueCount: issues.filter((issue) => issue.sourceName === run.sourceName).length,
    note: run.errorSummary || (run.success ? "정상 수집" : "오류 발생"),
  }));
}
