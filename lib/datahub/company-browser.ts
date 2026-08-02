import { median } from "@/lib/datahub/analytics";
import { normalizeCompanyName } from "@/lib/datahub/normalizers";
import type { Company, Listing, ProcurementRecord, Product } from "@/types/datahub";

export type CompanySortKey =
  | "relevance"
  | "products-desc"
  | "procurement-desc"
  | "consumer-desc"
  | "recent-desc"
  | "name-asc"
  | "region-asc";

export const COMPANY_SORT_OPTIONS: Array<{ value: CompanySortKey; label: string }> = [
  { value: "relevance", label: "검색 정확도" },
  { value: "products-desc", label: "전체 제품 수 많은 순" },
  { value: "procurement-desc", label: "조달 제품 수 많은 순" },
  { value: "consumer-desc", label: "민수 제품 수 많은 순" },
  { value: "recent-desc", label: "최근 확인일 최신순" },
  { value: "name-asc", label: "업체명 가나다순" },
  { value: "region-asc", label: "지역 가나다순" },
];

export const COMPANY_PER_PAGE_OPTIONS = [20, 50, 100, 200];
export const DETAIL_PRODUCT_PER_PAGE_OPTIONS = [20, 50, 100];

export function parseCompanySort(value?: string | null, hasQuery = false): CompanySortKey {
  const fallback: CompanySortKey = hasQuery ? "relevance" : "products-desc";
  return COMPANY_SORT_OPTIONS.some((option) => option.value === value)
    ? (value as CompanySortKey)
    : fallback;
}

export function parsePage(value?: string | null) {
  const page = Number(value || "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export function parsePerPage(
  value: string | null | undefined,
  allowed: number[],
  fallback: number
) {
  const perPage = Number(value || fallback);
  return allowed.includes(perPage) ? perPage : fallback;
}

function companyRelevanceScore(company: Company, query: string) {
  if (!query) return 0;

  const normalizedQuery = normalizeCompanyName(query).trim().toLowerCase();
  const name = normalizeCompanyName(company.name).toLowerCase();
  const normalizedName = normalizeCompanyName(company.normalizedName).toLowerCase();
  const businessNumber = (company.businessNumber || "").toLowerCase();
  const region = (company.region || "").toLowerCase();

  let score = 0;

  if (name === normalizedQuery || normalizedName === normalizedQuery) score += 1000;
  if (businessNumber === normalizedQuery) score += 900;
  if (name.startsWith(normalizedQuery) || normalizedName.startsWith(normalizedQuery)) score += 300;
  if (name.includes(normalizedQuery) || normalizedName.includes(normalizedQuery)) score += 180;
  if (businessNumber.includes(normalizedQuery)) score += 140;
  if (region.includes(normalizedQuery)) score += 70;

  score += Math.min(company.productCount, 500);
  score += Math.min(company.procurementProductCount * 2, 400);
  score += Math.min(company.consumerProductCount * 2, 200);

  return score;
}

export function sortCompanies<T extends Company>(companies: T[], sort: CompanySortKey, query = "") {
  const collator = new Intl.Collator("ko-KR", { numeric: true, sensitivity: "base" });

  return [...companies].sort((left, right) => {
    switch (sort) {
      case "relevance": {
        const scoreDiff = companyRelevanceScore(right, query) - companyRelevanceScore(left, query);
        if (scoreDiff !== 0) return scoreDiff;
        break;
      }
      case "products-desc":
        if (right.productCount !== left.productCount) {
          return right.productCount - left.productCount;
        }
        break;
      case "procurement-desc":
        if (right.procurementProductCount !== left.procurementProductCount) {
          return right.procurementProductCount - left.procurementProductCount;
        }
        break;
      case "consumer-desc":
        if (right.consumerProductCount !== left.consumerProductCount) {
          return right.consumerProductCount - left.consumerProductCount;
        }
        break;
      case "recent-desc":
        if (right.lastSeenAt !== left.lastSeenAt) {
          return right.lastSeenAt.localeCompare(left.lastSeenAt);
        }
        break;
      case "region-asc": {
        const regionCompare = collator.compare(left.region || "", right.region || "");
        if (regionCompare !== 0) return regionCompare;
        break;
      }
      case "name-asc": {
        const nameCompare = collator.compare(left.name, right.name);
        if (nameCompare !== 0) return nameCompare;
        break;
      }
      default:
        break;
    }

    const nameCompare = collator.compare(left.name, right.name);
    if (nameCompare !== 0) return nameCompare;
    return right.productCount - left.productCount;
  });
}

export function paginateRows<Row>(rows: Row[], page: number, perPage: number) {
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const start = total === 0 ? 0 : (safePage - 1) * perPage;
  const end = Math.min(start + perPage, total);

  return {
    page: safePage,
    perPage,
    total,
    pageCount,
    start,
    end,
    rows: rows.slice(start, end),
  };
}

export function companyTypeLabel(companyType: Company["companyType"]) {
  switch (companyType) {
    case "manufacturer":
      return "제조사";
    case "supplier":
      return "공급사";
    case "seller":
      return "판매사";
    case "mixed":
      return "제조·공급 겸업";
    default:
      return companyType;
  }
}

export function summarizeCompanyCatalog(
  company: Company,
  products: Product[],
  listings: Listing[],
  procurementRecords: ProcurementRecord[]
) {
  const companyProducts = products.filter(
    (product) =>
      product.manufacturerId === company.id || product.supplierIds.includes(company.id)
  );
  const productIds = new Set(companyProducts.map((product) => product.id));
  const companyListings = listings.filter((listing) => productIds.has(listing.productId));
  const companyRecords = procurementRecords.filter((record) => productIds.has(record.productId));
  const categories = new Map<string, number>();

  for (const product of companyProducts) {
    categories.set(product.category, (categories.get(product.category) ?? 0) + 1);
  }

  const topCategories = [...categories.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));

  const consumerPrices = companyListings
    .filter((listing) => listing.marketType === "consumer")
    .map((listing) => listing.totalPrice)
    .filter((price) => price > 0);

  const procurementPrices = companyRecords
    .map((record) => record.registeredPrice ?? record.contractPrice ?? 0)
    .filter((price) => price > 0);

  const certificationCount = companyProducts.reduce(
    (sum, product) => sum + product.certifications.length,
    0
  );

  const lastProductSeenAt = companyProducts
    .map((product) => product.lastSeenAt)
    .sort()
    .at(-1);

  return {
    products: companyProducts,
    listings: companyListings,
    procurementRecords: companyRecords,
    topCategories,
    consumerMedianPrice: median(consumerPrices),
    procurementMedianPrice: median(procurementPrices),
    consumerPriceRange:
      consumerPrices.length > 0
        ? { min: Math.min(...consumerPrices), max: Math.max(...consumerPrices) }
        : null,
    procurementPriceRange:
      procurementPrices.length > 0
        ? { min: Math.min(...procurementPrices), max: Math.max(...procurementPrices) }
        : null,
    certificationCount,
    lastProductSeenAt: lastProductSeenAt ?? company.lastSeenAt,
    sourceCount: new Set(
      companyProducts.flatMap((product) => product.sourceRecords.map((record) => record.sourceName))
    ).size,
  };
}
