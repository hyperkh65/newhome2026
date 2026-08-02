import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/datahub/Badge";
import { DataTable } from "@/components/datahub/DataTable";
import { PaginationControls } from "@/components/datahub/PaginationControls";
import { PageFrame } from "@/components/datahub/PageFrame";
import {
  DETAIL_PRODUCT_PER_PAGE_OPTIONS,
  companyTypeLabel,
  paginateRows,
  parsePage,
  parsePerPage,
  summarizeCompanyCatalog,
} from "@/lib/datahub/company-browser";
import { formatDate, formatDateTime, formatNumber, formatWon, rangeLabel } from "@/lib/datahub/format";
import { searchLiveProcurement } from "@/lib/datahub/live-search";
import { getCompanyById, loadBundle } from "@/lib/datahub/repository";

export default async function CompanyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const bundle = await loadBundle();
  let company = getCompanyById(bundle.companies, id);

  if (!company && query.source === "live" && typeof query.q === "string" && query.q.trim()) {
    const live = await searchLiveProcurement(query.q);
    company = live.companies.find((item) => item.id === id) ?? null;
  }

  if (!company) notFound();

  const isLiveOnly = !bundle.companies.some((item) => item.id === company.id);
  const liveCatalog = isLiveOnly && typeof query.q === "string" && query.q.trim()
    ? await searchLiveProcurement(query.q)
    : null;

  const summary = summarizeCompanyCatalog(
    company,
    isLiveOnly ? (liveCatalog?.products ?? []) : bundle.products,
    isLiveOnly ? [] : bundle.listings,
    isLiveOnly ? [] : bundle.procurementRecords
  );
  const productPerPage = parsePerPage(
    (query.productPerPage as string) || "",
    DETAIL_PRODUCT_PER_PAGE_OPTIONS,
    20
  );
  const productPage = parsePage((query.productPage as string) || "1");
  const sortedProducts = [...summary.products].sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));
  const pagedProducts = paginateRows(sortedProducts, productPage, productPerPage);
  const visibleProductsLabel =
    pagedProducts.total === 0 ? "0" : `${pagedProducts.start + 1}-${pagedProducts.end}`;
  const liveProductSuffix =
    isLiveOnly && typeof query.q === "string" && query.q.trim()
      ? `?source=live&q=${encodeURIComponent(query.q)}`
      : "";

  return (
    <PageFrame updatedAt={company.lastSeenAt}>
      <section className="dh-hero">
        <div className="dh-hero__head">
          <div>
            <h1>{company.name}</h1>
            <p>{company.businessNumber || "사업자번호 미상"} · {companyTypeLabel(company.companyType)}</p>
          </div>
          <div className="dh-toolbar-meta">
            <Badge tone="default">전체 제품 {formatNumber(company.productCount)}</Badge>
            <Badge tone="procurement">조달 {formatNumber(company.procurementProductCount)}</Badge>
            <Badge tone="consumer">민수 {formatNumber(company.consumerProductCount)}</Badge>
          </div>
        </div>
      </section>

      <div className="dh-grid-2">
        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>업체 정보</h2>
            </div>
          </div>
          <div className="dh-kv">
            {[
              ["업체명", company.name],
              ["사업자번호", company.businessNumber || "-"],
              ["구분", companyTypeLabel(company.companyType)],
              ["주소", company.address || "-"],
              ["지역", company.region || "-"],
              ["홈페이지", company.website || "-"],
              ["조달 등록 제품 수", company.procurementProductCount],
              ["민수 판매 제품 수", company.consumerProductCount],
              ["전체 제품 수", company.productCount],
              ["최초 확인일", formatDate(company.firstSeenAt)],
              ["최종 확인일", formatDateTime(company.lastSeenAt)],
            ].map(([label, value]) => (
              <div className="dh-kv__row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>요약</h2>
            </div>
          </div>
          <div className="dh-kv">
            {[
              [
                "주요 카테고리",
                summary.topCategories.length
                  ? summary.topCategories.map((item) => `${item.label} ${formatNumber(item.count)}`).join(", ")
                  : "-",
              ],
              ["민수 중앙가격", formatWon(summary.consumerMedianPrice)],
              ["민수 가격 범위", rangeLabel(summary.consumerPriceRange?.min, summary.consumerPriceRange?.max)],
              ["조달 기준가격 중앙값", formatWon(summary.procurementMedianPrice)],
              ["조달 가격 범위", rangeLabel(summary.procurementPriceRange?.min, summary.procurementPriceRange?.max)],
              ["인증 수", formatNumber(summary.certificationCount)],
              ["조달 기록 수", formatNumber(summary.procurementRecords.length)],
              ["데이터 출처 수", formatNumber(summary.sourceCount)],
              ["연결 상품 최종 확인", formatDateTime(summary.lastProductSeenAt)],
            ].map(([label, value]) => (
              <div className="dh-kv__row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>보유 제품</h2>
            <p>
              {formatNumber(summary.products.length)}개 중 {visibleProductsLabel} 표시
            </p>
          </div>
          <form className="dh-toolbar dh-toolbar--inline" method="get">
            <input type="hidden" name="productPage" value="1" />
            <div className="dh-field">
              <label htmlFor="productPerPage">페이지당 표시 수</label>
              <select
                id="productPerPage"
                name="productPerPage"
                defaultValue={String(productPerPage)}
              >
                {DETAIL_PRODUCT_PER_PAGE_OPTIONS.map((value) => (
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
        </div>
        <DataTable
          rows={pagedProducts.rows}
          columns={[
            {
              key: "name",
              label: "제품명",
              href: (row) => `/products/${row.id}${liveProductSuffix}`,
              render: (row) => (
                <div>
                  <strong>{row.displayName}</strong>
                  <div className="dh-muted">{row.modelName || "-"}</div>
                </div>
              ),
            },
            { key: "category", label: "분류", render: (row) => row.category },
            { key: "market", label: "시장", render: (row) => row.marketTypes.join(", ") },
            { key: "quality", label: "품질점수", render: (row) => row.dataQualityScore },
            { key: "updated", label: "최종 확인일", render: (row) => formatDate(row.lastSeenAt) },
          ]}
        />
        <PaginationControls
          pathname={`/companies/${company.id}`}
          page={pagedProducts.page}
          pageCount={pagedProducts.pageCount}
          total={pagedProducts.total}
          start={pagedProducts.start}
          end={pagedProducts.end}
          params={{ productPerPage: String(productPerPage) }}
          pageParam="productPage"
        />
      </section>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>바로가기</h2>
            <p>업체 기준 검색과 제품 비교로 바로 이동합니다.</p>
          </div>
        </div>
        <div className="dh-action-row">
          <Link className="dh-button" href={`/search?q=${encodeURIComponent(company.name)}`}>
            통합검색에서 이 업체 보기
          </Link>
          <Link className="dh-button dh-button--line" href="/companies">
            업체 목록으로 돌아가기
          </Link>
        </div>
      </section>
    </PageFrame>
  );
}
