import Link from "next/link";

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
import { filterCompanies } from "@/lib/datahub/filters";
import { formatDateTime, formatNumber } from "@/lib/datahub/format";
import { loadBundle, loadCompaniesPageSnapshot } from "@/lib/datahub/repository";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = (params.q as string) || "";
  const snapshot = await loadCompaniesPageSnapshot();
  const bundle = snapshot ? null : await loadBundle();
  const allRows = snapshot?.rows ?? bundle!.companies;
  const filteredRows = filterCompanies(allRows, query);
  const sort = parseCompanySort((params.sort as string) || "", Boolean(query));
  const perPage = parsePerPage((params.perPage as string) || "", COMPANY_PER_PAGE_OPTIONS, 50);
  const page = parsePage((params.page as string) || "1");
  const sortedRows = sortCompanies(filteredRows, sort, query);
  const pagedRows = paginateRows(sortedRows, page, perPage);
  const visibleRangeLabel =
    pagedRows.total === 0 ? "0" : `${pagedRows.start + 1}-${pagedRows.end}`;
  const activeParams = {
    q: query || undefined,
    sort,
    perPage: String(perPage),
  };

  return (
    <PageFrame updatedAt={snapshot?.generatedAt ?? bundle!.generatedAt}>
      <SearchHero action="/companies" scope="companies" query={query} demo={snapshot?.demo ?? bundle!.demo} />

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>업체 목록</h2>
            <p>
              검색 결과 {formatNumber(filteredRows.length)}건
              {" · "}
              전체 업체 {formatNumber(allRows.length)}건
            </p>
          </div>
          <div className="dh-toolbar-meta">
            <Badge tone="default">페이지 {pagedRows.page} / {pagedRows.pageCount}</Badge>
            <Badge tone="muted">표시 {visibleRangeLabel}</Badge>
          </div>
        </div>

        <form className="dh-toolbar" method="get">
          <input type="hidden" name="q" value={query} />
          <input type="hidden" name="page" value="1" />
          <div className="dh-field">
            <label htmlFor="sort">정렬</label>
            <select id="sort" name="sort" defaultValue={sort}>
              {COMPANY_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="dh-field">
            <label htmlFor="perPage">페이지당 표시 수</label>
            <select id="perPage" name="perPage" defaultValue={String(perPage)}>
              {COMPANY_PER_PAGE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}개
                </option>
              ))}
            </select>
          </div>
          <div className="dh-field">
            <label htmlFor="q-meta">검색어</label>
            <input id="q-meta" type="text" value={query || "전체"} readOnly />
          </div>
          <div className="dh-toolbar__actions">
            <button className="dh-button" type="submit">
              적용
            </button>
            <Link href="/companies" className="dh-button dh-button--line">
              초기화
            </Link>
          </div>
        </form>

        <DataTable
          rows={pagedRows.rows}
          columns={[
            {
              key: "name",
              label: "업체명",
              href: (row) => `/companies/${row.id}`,
              render: (row) => (
                <div>
                  <strong>{row.name}</strong>
                  <div className="dh-muted">{row.businessNumber || "-"}</div>
                </div>
              ),
            },
            { key: "type", label: "구분", render: (row) => companyTypeLabel(row.companyType) },
            { key: "region", label: "지역", render: (row) => row.region || "-" },
            { key: "products", label: "전체 제품", render: (row) => row.productCount },
            { key: "proc", label: "조달", render: (row) => row.procurementProductCount },
            { key: "consumer", label: "민수", render: (row) => row.consumerProductCount },
            { key: "updated", label: "최종 확인일", render: (row) => formatDateTime(row.lastSeenAt) },
          ]}
        />
        <PaginationControls
          pathname="/companies"
          page={pagedRows.page}
          pageCount={pagedRows.pageCount}
          total={pagedRows.total}
          start={pagedRows.start}
          end={pagedRows.end}
          params={activeParams}
        />
      </section>
    </PageFrame>
  );
}
