import { normalizeBusinessNumber, normalizeCompanyName } from "@/lib/datahub/normalizers";
import { ProcurementAdapter } from "@/lib/datahub/sources/procurement";
import type { Company, Product, RawProductRecord } from "@/types/datahub";

function createCompanyId(name: string, bizno?: string | null) {
  const normalizedBizno = normalizeBusinessNumber(bizno || "");
  if (normalizedBizno) return `cmp-${normalizedBizno.replace(/-/g, "")}`;
  return `cmp-${normalizeCompanyName(name).toLowerCase().replace(/[^a-z0-9가-힣]+/giu, "-")}`;
}

export interface LiveProcurementSearchResult {
  companies: Company[];
  products: Product[];
}

export async function searchLiveProcurement(query: string): Promise<LiveProcurementSearchResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { companies: [], products: [] };
  }

  const adapter = new ProcurementAdapter();
  const rows = await adapter.fetch({
    query: trimmed,
    limit: 40,
    pageLimit: 5,
    categoryMode: "all",
  });

  const productMap = new Map<string, Product>();
  const companyMap = new Map<string, Company>();
  const companyProductIds = new Map<string, Set<string>>();

  for (const row of rows) {
    const supplierName = normalizeCompanyName(
      String(row.supplierName ?? row.brand ?? "미상")
    );
    const supplierBizno = normalizeBusinessNumber(String(row.supplierBizno ?? ""));
    const companyId = createCompanyId(supplierName, supplierBizno);
    const product = adapter.normalize(row as RawProductRecord);
    product.brand = supplierName || product.brand;
    product.supplierIds = [companyId];
    productMap.set(product.id, product);
    const existing = companyMap.get(companyId);
    const company =
      existing ?? {
        id: companyId,
        name: supplierName,
        normalizedName: normalizeCompanyName(supplierName),
        businessNumber: supplierBizno || null,
        companyType: "supplier",
        address: typeof row.supplierRegion === "string" ? row.supplierRegion : null,
        region: typeof row.supplierRegion === "string" ? row.supplierRegion : null,
        website: null,
        productCount: 0,
        procurementProductCount: 0,
        consumerProductCount: 0,
        firstSeenAt: product.firstSeenAt,
        lastSeenAt: product.lastSeenAt,
        demo: false,
      };

    const seenProductIds = companyProductIds.get(companyId) ?? new Set<string>();
    if (!seenProductIds.has(product.id)) {
      seenProductIds.add(product.id);
      company.productCount += 1;
      company.procurementProductCount += 1;
      companyProductIds.set(companyId, seenProductIds);
    }

    if (company.firstSeenAt > product.firstSeenAt) company.firstSeenAt = product.firstSeenAt;
    if (company.lastSeenAt < product.lastSeenAt) company.lastSeenAt = product.lastSeenAt;
    companyMap.set(companyId, company);
  }

  return {
    companies: Array.from(companyMap.values()).sort(
      (a, b) => b.procurementProductCount - a.procurementProductCount
    ),
    products: Array.from(productMap.values()).sort((a, b) =>
      b.lastSeenAt.localeCompare(a.lastSeenAt)
    ),
  };
}
