import { promises as fs } from "node:fs";
import path from "node:path";

import { demoBundle } from "@/lib/datahub/demo-seed";
import {
  buildDashboardSummary,
  buildMarketComparisonRows,
  buildPriceDeltaRows,
  buildSourceHealthRows,
  categoryCounts,
  median,
} from "@/lib/datahub/analytics";
import type {
  CategoryStat,
  Company,
  DashboardSummary,
  Listing,
  MarketComparisonRow,
  PipelineStatusSnapshot,
  PriceDeltaRow,
  PriceSnapshot,
  Product,
  PublicDataBundle,
  SourceHealthRow,
} from "@/types/datahub";

const publicDir = path.join(process.cwd(), "data", "public");

async function readJsonFile<T>(filename: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(publicDir, filename), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function loadBundle(): Promise<PublicDataBundle> {
  const bundle = await readJsonFile<PublicDataBundle>("bundle.json");
  return bundle ?? demoBundle;
}

export async function loadDashboardSnapshot() {
  return await readJsonFile<{
    generatedAt: string;
    demo: boolean;
    summary: DashboardSummary;
    categoryStats: CategoryStat[];
    priceChanges: PriceDeltaRow[];
    sourceHealth: SourceHealthRow[];
    marketComparison: MarketComparisonRow[];
    newProducts: Product[];
    topCompanies: Company[];
  }>("dashboard.json");
}

export async function loadProductsPageSnapshot() {
  return await readJsonFile<{
    generatedAt: string;
    demo: boolean;
    total: number;
    categories: string[];
    wattages: number[];
    colorTemperatures: number[];
    rows: Product[];
  }>("products-page.json");
}

export async function loadCompaniesPageSnapshot() {
  return await readJsonFile<{
    generatedAt: string;
    demo: boolean;
    total: number;
    rows: Company[];
  }>("companies-page.json");
}

export async function loadProcurementPageSnapshot() {
  return await readJsonFile<{
    generatedAt: string;
    demo: boolean;
    stats: {
      products: number;
      companies: number;
      records: number;
      certifiedProducts: number;
    };
    categoryStats: CategoryStat[];
    rows: Product[];
    records: Array<{ productId: string; registeredPrice?: number | null }>;
  }>("procurement-page.json");
}

export async function loadPipelineStatusSnapshot() {
  return await readJsonFile<PipelineStatusSnapshot>("pipeline-status.json");
}

export async function loadProducts() {
  return (await readJsonFile<Product[]>("products.json")) ?? (await loadBundle()).products;
}

export async function loadCompanies() {
  return (await readJsonFile<Company[]>("companies.json")) ?? (await loadBundle()).companies;
}

export async function loadListings() {
  return (await readJsonFile<Listing[]>("listings.json")) ?? (await loadBundle()).listings;
}

export async function loadSnapshots() {
  return (await loadBundle()).priceHistory;
}

export async function loadDashboardData() {
  const bundle = await loadBundle();
  const summary = buildDashboardSummary(bundle.products, bundle.companies);
  const priceChanges = buildPriceDeltaRows(
    bundle.products,
    bundle.priceHistory,
    bundle.companies
  );
  const sourceHealth = buildSourceHealthRows(
    bundle.collectionRuns,
    bundle.dataIssues
  );
  const marketComparison = buildMarketComparisonRows(
    bundle.products,
    bundle.listings,
    bundle.procurementRecords
  );

  return {
    bundle,
    summary,
    categoryStats: categoryCounts(bundle.products),
    priceChanges,
    sourceHealth,
    marketComparison,
  };
}

export function getProductById(products: Product[], id: string) {
  return products.find((product) => product.id === id) ?? null;
}

export function getCompanyById(companies: Company[], id: string) {
  return companies.find((company) => company.id === id) ?? null;
}

export function getListingsForProduct(listings: Listing[], productId: string) {
  return listings.filter((listing) => listing.productId === productId);
}

export function getSnapshotsForProduct(
  snapshots: PriceSnapshot[],
  productId: string
) {
  return snapshots
    .filter((snapshot) => snapshot.productId === productId)
    .sort((a, b) => a.collectedAt.localeCompare(b.collectedAt));
}

export function getConsumerMedian(listings: Listing[], productId: string) {
  const prices = listings
    .filter((listing) => listing.productId === productId)
    .map((listing) => listing.totalPrice)
    .filter((price) => price > 0);
  return median(prices);
}
