import { Badge } from "@/components/datahub/Badge";
import { DataTable } from "@/components/datahub/DataTable";
import { PaginationControls } from "@/components/datahub/PaginationControls";
import { PageFrame } from "@/components/datahub/PageFrame";
import { SearchHero } from "@/components/datahub/SearchHero";
import {
  COMPANY_PER_PAGE_OPTIONS,
  COMPANY_SORT_OPTIONS,
  companyTypeLabel,
  paginateRows,
  parseCompanySort,
  parsePage,
  parsePerPage,
  sortCompanies,
} from "@/lib/datahub/company-browser";
import { formatNumber, formatWon } from "@/lib/datahub/format";
import { searchLiveProcurement } from "@/lib/datahub/live-search";
import {
  getConsumerMedian,
  loadCompanies,
  loadListings,
  loadProducts,
} from "@/lib/datahub/repository";
import { searchCompanies, searchProducts, type SearchScope } from "@/lib/datahub/search";
import type { Company, Product } from "@/types/datahub";

const labels: Record<SearchScope, string> = {
  all: "전체",
  procurement: "조달 제품",
  consumer: "민수 제품",
  companies: "업체",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const [products, companies, listings] = await Promise.all([
    loadProducts(),
    loadCompanies(),
    loadListings(),
  ]);
  const q = (params.q as string) || "";
  const scope = ((params.scope as string) || "all") as SearchScope;
  const baseProductResults = searchProducts(products, q, scope);
  const baseCompanyResults = searchCompanies(companies, q);

  let liveProducts: Product[] = [];
  let liveCompanies: Company[] = [];

  if (q && baseProductResults.length === 0 && baseCompanyResults.length === 0) {
    try {
      const live = await searchLiveProcurement(q);
      liveProducts = live.products;
      liveCompanies = live.companies;
    } catch {
      liveProducts = [];
      liveCompanies = [];
    }
  }

  const bundleProductIds = new Set(products.map((product) => product.id));
  const bundleCompanyIds = new Set(companies.map((company) => company.id));
  const liveProductResults = liveProducts.map((product) => ({
    product,
    matchScore: 0,
    tokenHits: 0,
    source: "live" as const,
  }));
  const liveCompanyCounts = new Map<
    string,
    { productCount: number; procurementProductCount: number; consumerProductCount: number }
  >();

  for (const product of liveProducts) {
    for (const supplierId of product.supplierIds) {
      const current = liveCompanyCounts.get(supplierId) ?? {
        productCount: 0,
        procurementProductCount: 0,
        consumerProductCount: 0,
      };
      current.productCount += 1;
      if (product.marketTypes.includes("procurement")) current.procurementProductCount += 1;
      if (product.marketTypes.includes("consumer")) current.consumerProductCount += 1;
      liveCompanyCounts.set(supplierId, current);
    }
  }

  const productResults = [
    ...baseProductResults.map((row) => ({ ...row, source: "bundle" as const })),
    ...liveProductResults.filter((row) => !bundleProductIds.has(row.product.id)),
  ];
  const companyResults = [
    ...baseCompanyResults.map((row) => ({ ...row, source: "bundle" as const })),
    ...liveCompanies
      .filter((row) => !bundleCompanyIds.has(row.id))
      .map((row) => {
        const counts = liveCompanyCounts.get(row.id);
        return {
          ...row,
          productCount: counts?.productCount ?? row.productCount,
          procurementProductCount:
            counts?.procurementProductCount ?? row.procurementProductCount,
          consumerProductCount: counts?.consumerProductCount ?? row.consumerProductCount,
          source: "live" as const,
        };
      }),
  ];
  const productPerPage = parsePerPage(
    (params.productPerPage as string) || "",
    COMPANY_PER_PAGE_OPTIONS,
    20
  );
  const productPage = parsePage((params.productPage as string) || "1");
  const pagedProductResults = paginateRows(productResults, productPage, productPerPage);
  const companySort = parseCompanySort((params.companySort as string) || "", Boolean(q));
  const companyPerPage = parsePerPage(
    (params.companyPerPage as string) || "",
    COMPANY_PER_PAGE_OPTIONS,
    20
  );
  const companyPage = parsePage((params.companyPage as string) || "1");
  const sortedCompanyResults = sortCompanies(companyResults, companySort, q);
  const pagedCompanyResults = paginateRows(sortedCompanyResults, companyPage, companyPerPage);

  return (
    <PageFrame>
      <SearchHero action="/search" scope={scope} query={q} demo={false} />

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>검색 결과</h2>
            <p>검색어와 정규화된 유사 제품명을 함께 비교합니다.</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Badge tone="muted">{labels[scope]}</Badge>
            <Badge tone="default">제품 {formatNumber(productResults.length)}</Badge>
            <Badge tone="muted">페이지 {pagedProductResults.page} / {pagedProductResults.pageCount}</Badge>
          </div>
        </div>
        <form className="dh-toolbar dh-toolbar--inline" method="get">
          <input type="hidden" name="q" value={q} />
          <input type="hidden" name="scope" value={scope} />
          <input type="hidden" name="productPage" value="1" />
          <div className="dh-field">
            <label htmlFor="productPerPage">페이지당 표시 수</label>
            <select id="productPerPage" name="productPerPage" defaultValue={String(productPerPage)}>
              {COMPANY_PER_PAGE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}개
                </option>
              ))}
            </select>
          </div>
          <div className="dh-toolbar__actions">
            <button className="dh-button" type="submit">
              적용
            </button>
          </div>
        </form>
        <DataTable
          rows={pagedProductResults.rows}
          emptyText="검색 결과가 없습니다."
          columns={[
            {
              key: "name",
              label: "제품명",
              href: (row) =>
                row.source === "bundle"
                  ? `/products/${row.product.id}`
                  : `/products/${row.product.id}?source=live&q=${encodeURIComponent(q)}`,
              render: (row) => (
                <div>
                  <strong>{row.product.displayName}</strong>
                  <div className="dh-muted">
                    {row.product.modelName || "-"}
                    {row.source === "live" ? " · 실시간 조달 조회" : ""}
                  </div>
                </div>
              ),
            },
            {
              key: "match",
              label: "매칭 근거",
              render: (row) =>
                q ? (
                  <div>
                    <strong>{row.matchScore}</strong>
                    <div className="dh-muted">
                      {row.product.modelName
                        ? "모델명/제품명 유사도 반영"
                        : "제품명 토큰 유사도 반영"}
                    </div>
                  </div>
                ) : (
                  "-"
                ),
            },
            { key: "category", label: "분류", render: (row) => row.product.category },
            {
              key: "market",
              label: "시장",
              render: (row) => (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {row.product.marketTypes.map((marketType) => (
                    <Badge
                      key={marketType}
                      tone={marketType === "procurement" ? "procurement" : "consumer"}
                    >
                      {marketType === "procurement" ? "조달" : "민수"}
                    </Badge>
                  ))}
                </div>
              ),
            },
            {
              key: "price",
              label: "민수 중앙가격",
              render: (row) => formatWon(getConsumerMedian(listings, row.product.id)),
            },
          ]}
        />
        <PaginationControls
          pathname="/search"
          page={pagedProductResults.page}
          pageCount={pagedProductResults.pageCount}
          total={pagedProductResults.total}
          start={pagedProductResults.start}
          end={pagedProductResults.end}
          params={{
            q,
            scope,
            productPerPage: String(productPerPage),
          }}
          pageParam="productPage"
        />
      </section>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>업체 결과</h2>
            <p>업체명, 사업자번호, 지역으로 검색합니다.</p>
          </div>
          <div className="dh-toolbar-meta">
            <Badge tone="default">업체 {formatNumber(companyResults.length)}</Badge>
            <Badge tone="muted">페이지 {pagedCompanyResults.page} / {pagedCompanyResults.pageCount}</Badge>
          </div>
        </div>
        <form className="dh-toolbar dh-toolbar--inline" method="get">
          <input type="hidden" name="q" value={q} />
          <input type="hidden" name="scope" value={scope} />
          <input type="hidden" name="companyPage" value="1" />
          <div className="dh-field">
            <label htmlFor="companySort">업체 정렬</label>
            <select id="companySort" name="companySort" defaultValue={companySort}>
              {COMPANY_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="dh-field">
            <label htmlFor="companyPerPage">페이지당 표시 수</label>
            <select id="companyPerPage" name="companyPerPage" defaultValue={String(companyPerPage)}>
              {COMPANY_PER_PAGE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}개
                </option>
              ))}
            </select>
          </div>
          <div className="dh-toolbar__actions">
            <button className="dh-button" type="submit">
              적용
            </button>
          </div>
        </form>
        <DataTable
          rows={pagedCompanyResults.rows}
          emptyText="업체 결과가 없습니다."
          columns={[
            {
              key: "name",
              label: "업체명",
              href: (row) =>
                row.source === "bundle"
                  ? `/companies/${row.id}`
                  : `/companies/${row.id}?source=live&q=${encodeURIComponent(q)}`,
              render: (row) => (
                <div>
                  <strong>{row.name}</strong>
                  <div className="dh-muted">
                    {row.businessNumber || "-"}
                    {row.source === "live" ? " · 실시간 조달 조회" : ""}
                  </div>
                </div>
              ),
            },
            { key: "type", label: "구분", render: (row) => companyTypeLabel(row.companyType) },
            { key: "region", label: "지역", render: (row) => row.region || "-" },
            { key: "products", label: "등록 제품 수", render: (row) => row.productCount },
            { key: "proc", label: "조달", render: (row) => row.procurementProductCount },
            { key: "consumer", label: "민수", render: (row) => row.consumerProductCount },
          ]}
        />
        <PaginationControls
          pathname="/search"
          page={pagedCompanyResults.page}
          pageCount={pagedCompanyResults.pageCount}
          total={pagedCompanyResults.total}
          start={pagedCompanyResults.start}
          end={pagedCompanyResults.end}
          params={{
            q: q || undefined,
            scope,
            companySort,
            companyPerPage: String(companyPerPage),
          }}
          pageParam="companyPage"
        />
      </section>
    </PageFrame>
  );
}
