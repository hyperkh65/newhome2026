export type MarketType = "procurement" | "consumer";

export type DataStatus = "active" | "inactive" | "review" | "archived";

export type CompanyType = "manufacturer" | "supplier" | "seller" | "mixed";

export type FetchStatus = "success" | "partial" | "failed" | "skipped";

export interface Specifications {
  wattage?: number | null;
  luminousFlux?: number | null;
  efficacy?: number | null;
  colorTemperature?: number | null;
  cri?: number | null;
  powerFactor?: number | null;
  inputVoltage?: string | null;
  beamAngle?: number | null;
  ipRating?: string | null;
  dimensions?: string | null;
  weight?: string | null;
  material?: string | null;
  installationType?: string | null;
  hsCode?: string | null;
  countryOfOrigin?: string | null;
}

export interface Certification {
  type: string;
  number: string;
  issuer?: string | null;
  status?: string | null;
  issuedAt?: string | null;
  expiresAt?: string | null;
  sourceUrl?: string | null;
}

export interface SourceMetadata {
  sourceName: string;
  sourceType: MarketType | "manual" | "analytics";
  originalId: string;
  originalUrl?: string | null;
  collectedAt: string;
  updatedAt?: string | null;
  fetchStatus: FetchStatus;
  rawHash: string;
}

export interface Product {
  id: string;
  canonicalName: string;
  displayName: string;
  modelName?: string | null;
  brand?: string | null;
  manufacturerId?: string | null;
  supplierIds: string[];
  marketTypes: MarketType[];
  category: string;
  subcategory?: string | null;
  specifications: Specifications;
  certifications: Certification[];
  images: string[];
  sourceRecords: SourceMetadata[];
  firstSeenAt: string;
  lastSeenAt: string;
  status: DataStatus;
  dataQualityScore: number;
  demo?: boolean;
}

export interface Company {
  id: string;
  name: string;
  normalizedName: string;
  businessNumber?: string | null;
  companyType: CompanyType;
  address?: string | null;
  region?: string | null;
  website?: string | null;
  productCount: number;
  procurementProductCount: number;
  consumerProductCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  demo?: boolean;
}

export interface Listing {
  id: string;
  productId: string;
  source: string;
  sourceProductId: string;
  sellerName: string;
  title: string;
  price: number;
  shippingFee: number;
  totalPrice: number;
  rating?: number | null;
  reviewCount?: number | null;
  productUrl?: string | null;
  imageUrl?: string | null;
  availability: "available" | "ended" | "unknown";
  collectedAt: string;
  marketType: MarketType;
  demo?: boolean;
}

export interface PriceSnapshot {
  id: string;
  productId: string;
  listingId?: string | null;
  price: number;
  shippingFee: number;
  totalPrice: number;
  collectedAt: string;
  demo?: boolean;
}

export interface ProcurementRecord {
  id: string;
  productId: string;
  contractType?: string | null;
  registeredPrice?: number | null;
  contractPrice?: number | null;
  quantity?: number | null;
  amount?: number | null;
  buyer?: string | null;
  supplier?: string | null;
  contractDate?: string | null;
  sourceUrl?: string | null;
  demo?: boolean;
}

export interface CollectionRun {
  runId: string;
  startedAt: string;
  finishedAt: string;
  sourceName: string;
  success: boolean;
  fetchedCount: number;
  insertedCount: number;
  changedCount: number;
  errorCount: number;
  errorSummary?: string | null;
  outputFile?: string | null;
  durationMs?: number | null;
  status?: FetchStatus;
  demo?: boolean;
}

export interface PipelineStatusSnapshot {
  generatedAt: string;
  demo: boolean;
  latestRun: CollectionRun | null;
  lastSuccessfulBuildAt?: string | null;
  runs: CollectionRun[];
  historyCount?: number;
  latestChanges?: ChangeSummary["summary"] | null;
}

export interface ProductChangeEvent {
  productId: string;
  displayName: string;
  modelName?: string | null;
  companyName?: string | null;
  marketTypes: MarketType[];
  currentPrice?: number | null;
  previousPrice?: number | null;
  changeRate?: number | null;
}

export interface ChangeSummary {
  runId: string;
  generatedAt: string;
  previousGeneratedAt?: string | null;
  currentGeneratedAt: string;
  newProducts: ProductChangeEvent[];
  removedProducts: ProductChangeEvent[];
  priceIncreased: ProductChangeEvent[];
  priceDecreased: ProductChangeEvent[];
  companyChanged: ProductChangeEvent[];
  specificationChanged: ProductChangeEvent[];
  summary: {
    newProducts: number;
    removedProducts: number;
    priceIncreased: number;
    priceDecreased: number;
    companyChanged: number;
    specificationChanged: number;
  };
}

export interface DataIssue {
  issueId: string;
  productId?: string | null;
  issueType: string;
  severity: "low" | "medium" | "high";
  description: string;
  sourceName: string;
  detectedAt: string;
  resolved: boolean;
  demo?: boolean;
}

export interface AnalysisReport {
  id: string;
  createdAt: string;
  title: string;
  periodLabel: string;
  dataPoints: number;
  confidenceLabel: string;
  summary: string;
  details: string[];
  demo?: boolean;
}

export type ProcurementCategoryMode = "lighting" | "all";

export interface DashboardSummary {
  totalProducts: number;
  procurementProducts: number;
  consumerProducts: number;
  companies: number;
  recentNewProducts: number;
  lastUpdatedAt?: string | null;
  demo: boolean;
}

export interface CategoryStat {
  label: string;
  value: number;
}

export interface PriceDeltaRow {
  productId: string;
  displayName: string;
  modelName?: string | null;
  companyName?: string | null;
  marketType: MarketType;
  currentPrice: number | null;
  previousPrice: number | null;
  changeRate: number | null;
  collectedAt: string;
}

export interface MarketComparisonRow {
  productId: string;
  displayName: string;
  modelName?: string | null;
  procurementPrice: number | null;
  consumerMedianPrice: number | null;
  priceGapRate: number | null;
}

export interface SourceHealthRow {
  sourceName: string;
  marketType: MarketType | "manual" | "analytics";
  lastCollectedAt?: string | null;
  status: FetchStatus;
  issueCount: number;
  note: string;
}

export interface PublicDataBundle {
  generatedAt: string;
  demo: boolean;
  products: Product[];
  companies: Company[];
  listings: Listing[];
  priceHistory: PriceSnapshot[];
  procurementRecords: ProcurementRecord[];
  collectionRuns: CollectionRun[];
  dataIssues: DataIssue[];
  analysisReports: AnalysisReport[];
}

export interface FetchOptions {
  query?: string | null;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  pageLimit?: number;
  categoryMode?: ProcurementCategoryMode;
}

export interface NormalizedProductCandidate {
  displayName: string;
  canonicalName: string;
  modelName?: string | null;
  brand?: string | null;
  category?: string | null;
  specifications: Specifications;
}

export interface ValidationResult {
  valid: boolean;
  issues: string[];
}

export interface RawProductRecord extends Record<string, unknown> {
  sourceId: string;
  sourceName: string;
  marketType: MarketType;
}

export interface DataSourceAdapter {
  sourceId: string;
  sourceName: string;
  marketType: MarketType;
  fetch(options: FetchOptions): Promise<RawProductRecord[]>;
  normalize(record: RawProductRecord): Product;
  validate(record: RawProductRecord): ValidationResult;
}
