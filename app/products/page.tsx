import Link from "next/link";

import { Badge } from "@/components/datahub/Badge";
import { DataTable } from "@/components/datahub/DataTable";
import { PageFrame } from "@/components/datahub/PageFrame";
import { SearchHero } from "@/components/datahub/SearchHero";
import { formatDateTime, formatWon } from "@/lib/datahub/format";
import {
  buildCategoryOptions,
  buildColorTemperatureOptions,
  buildWattageOptions,
  filterProducts,
} from "@/lib/datahub/filters";
import { getConsumerMedian, loadBundle, loadProductsPageSnapshot } from "@/lib/datahub/repository";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const snapshot = await loadProductsPageSnapshot();
  const bundle = snapshot ? null : await loadBundle();
  const products = snapshot?.rows ?? bundle!.products;
  const query = (params.q as string) || "";
  const market = (params.market as string) || "all";
  const filtered = filterProducts(products, {
    q: query,
    market,
    category: (params.category as string) || "",
    wattage: (params.wattage as string) || "",
    efficacyMin: (params.efficacyMin as string) || "",
    colorTemperature: (params.colorTemperature as string) || "",
    cert: (params.cert as string) || "",
    updatedWithinDays: (params.updatedWithinDays as string) || "",
  });

  const categories = snapshot?.categories ?? buildCategoryOptions(products);
  const wattages = snapshot?.wattages ?? buildWattageOptions(products);
  const colorTemperatures = snapshot?.colorTemperatures ?? buildColorTemperatureOptions(products);

  return (
    <PageFrame updatedAt={snapshot?.generatedAt ?? bundle!.generatedAt}>
      <SearchHero action="/products" scope={market} query={query} demo={snapshot?.demo ?? bundle!.demo} />

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>제품 필터</h2>
            <p>필터 상태는 URL에 유지됩니다.</p>
          </div>
        </div>
        <form className="dh-filter-form" method="get">
          <input type="hidden" name="q" defaultValue={query} />
          <div className="dh-field">
            <label htmlFor="market">시장</label>
            <select id="market" name="market" defaultValue={market}>
              <option value="all">전체</option>
              <option value="procurement">조달</option>
              <option value="consumer">민수</option>
            </select>
          </div>
          <div className="dh-field">
            <label htmlFor="category">제품 분류</label>
            <select id="category" name="category" defaultValue={(params.category as string) || ""}>
              <option value="">전체</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="dh-field">
            <label htmlFor="wattage">소비전력</label>
            <select id="wattage" name="wattage" defaultValue={(params.wattage as string) || ""}>
              <option value="">전체</option>
              {wattages.map((wattage) => (
                <option key={wattage} value={wattage}>
                  {wattage}W
                </option>
              ))}
            </select>
          </div>
          <div className="dh-field">
            <label htmlFor="efficacyMin">광효율 이상</label>
            <select
              id="efficacyMin"
              name="efficacyMin"
              defaultValue={(params.efficacyMin as string) || ""}
            >
              <option value="">전체</option>
              <option value="100">100lm/W</option>
              <option value="120">120lm/W</option>
              <option value="140">140lm/W</option>
            </select>
          </div>
          <div className="dh-field">
            <label htmlFor="colorTemperature">색온도</label>
            <select
              id="colorTemperature"
              name="colorTemperature"
              defaultValue={(params.colorTemperature as string) || ""}
            >
              <option value="">전체</option>
              {colorTemperatures.map((colorTemperature) => (
                <option key={colorTemperature} value={colorTemperature}>
                  {colorTemperature}K
                </option>
              ))}
            </select>
          </div>
          <div className="dh-field">
            <label htmlFor="cert">인증 여부</label>
            <select id="cert" name="cert" defaultValue={(params.cert as string) || ""}>
              <option value="">전체</option>
              <option value="yes">인증 있음</option>
              <option value="no">인증 없음</option>
            </select>
          </div>
          <div className="dh-field">
            <label htmlFor="updatedWithinDays">업데이트 기간</label>
            <select
              id="updatedWithinDays"
              name="updatedWithinDays"
              defaultValue={(params.updatedWithinDays as string) || ""}
            >
              <option value="">전체</option>
              <option value="7">최근 7일</option>
              <option value="30">최근 30일</option>
              <option value="90">최근 90일</option>
            </select>
          </div>
          <div className="dh-field" style={{ alignSelf: "end" }}>
            <button className="dh-button" type="submit">
              적용
            </button>
          </div>
        </form>
      </section>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>제품 목록</h2>
            <p>{filtered.length}건</p>
          </div>
          <Link href="/search" className="dh-admin-link">
            통합검색으로 이동
          </Link>
        </div>
        <DataTable
          rows={filtered}
          columns={[
            {
              key: "market",
              label: "시장",
              render: (row) => (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {row.marketTypes.map((marketType) => (
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
              key: "name",
              label: "제품명",
              href: (row) => `/products/${row.id}`,
              render: (row) => (
                <div>
                  <strong>{row.displayName}</strong>
                  <div className="dh-muted">{row.modelName || "-"}</div>
                </div>
              ),
            },
            { key: "category", label: "분류", render: (row) => row.category },
            { key: "wattage", label: "소비전력", render: (row) => row.specifications.wattage ? `${row.specifications.wattage}W` : "-" },
            { key: "efficacy", label: "광효율", render: (row) => row.specifications.efficacy ? `${row.specifications.efficacy}lm/W` : "-" },
            { key: "colorTemperature", label: "색온도", render: (row) => row.specifications.colorTemperature ? `${row.specifications.colorTemperature}K` : "-" },
            { key: "cert", label: "인증", render: (row) => row.certifications.length ? row.certifications[0].type : <Badge tone="muted">없음</Badge> },
            { key: "price", label: "민수 중앙가격", render: (row) => formatWon(bundle ? getConsumerMedian(bundle.listings, row.id) : null) },
            { key: "quality", label: "품질점수", render: (row) => row.dataQualityScore },
            { key: "updated", label: "최종 확인일", render: (row) => formatDateTime(row.lastSeenAt) },
          ]}
        />
      </section>
    </PageFrame>
  );
}
