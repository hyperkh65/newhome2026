import { Badge } from "@/components/datahub/Badge";
import { BarList } from "@/components/datahub/BarList";
import { DataTable } from "@/components/datahub/DataTable";
import { PageFrame } from "@/components/datahub/PageFrame";
import { StatGrid } from "@/components/datahub/StatGrid";
import { formatDate, formatWon } from "@/lib/datahub/format";
import { loadBundle, loadProcurementPageSnapshot } from "@/lib/datahub/repository";
import { median } from "@/lib/datahub/analytics";

export const dynamic = "force-dynamic";

export default async function ProcurementPage() {
  const snapshot = await loadProcurementPageSnapshot();
  const bundle = snapshot ? null : await loadBundle();
  const products = snapshot?.rows ?? bundle!.products.filter((product) =>
    product.marketTypes.includes("procurement")
  );
  const records = snapshot?.records ?? bundle!.procurementRecords;
  const recordPrices = records.map((record) => record.registeredPrice || 0).filter(Boolean);
  const medianPrice = median(recordPrices);
  const certifiedProducts = snapshot?.stats.certifiedProducts ?? products.filter((product) => product.certifications.length > 0).length;

  return (
    <PageFrame updatedAt={snapshot?.generatedAt ?? bundle!.generatedAt}>
      <section className="dh-hero">
        <div className="dh-hero__head">
          <div>
            <h1>조달시장</h1>
            <p>조달 등록 제품과 계약 기록을 정규화된 필드로 봅니다.</p>
          </div>
          <Badge tone="procurement">조달</Badge>
        </div>
      </section>

      <StatGrid
        items={[
          { label: "조달 등록 제품 수", value: snapshot?.stats.products ?? products.length, helper: "중복 정리 후 제품 기준" },
          { label: "공급 업체 수", value: snapshot?.stats.companies ?? bundle!.companies.filter((company) => company.procurementProductCount > 0).length, helper: "조달 제품 보유 업체" },
          { label: "등록가 중앙값", value: formatWon(medianPrice), helper: "평균 대신 중앙값" },
          { label: "계약 기록", value: snapshot?.stats.records ?? records.length, helper: "데모 포함" },
          { label: "인증 보유 제품", value: certifiedProducts, helper: "인증 배열 존재 기준" },
          { label: "최종 확인일", value: formatDate(snapshot?.generatedAt ?? bundle!.generatedAt), helper: "수집 파이프라인 기준" },
        ]}
      />

      <div className="dh-grid-2">
        <BarList
          title="카테고리별 제품 수"
          items={snapshot?.categoryStats ?? [
            ...new Map(products.map((product) => [product.category, 0])).keys(),
          ].map((category) => ({
            label: category,
            value: products.filter((product) => product.category === category).length,
          }))}
        />
        <BarList
          title="카테고리별 등록가"
          kind="price"
          items={[
            ...new Map(products.map((product) => [product.category, 0])).keys(),
          ].map((category) => {
            const categoryPrices = records
              .filter((record) => products.find((product) => product.id === record.productId)?.category === category)
              .map((record) => record.registeredPrice || 0)
              .filter(Boolean);
            return { label: category, value: median(categoryPrices) };
          })}
        />
      </div>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>조달 제품 테이블</h2>
            <p>원문이 아니라 정규화된 필드만 표시합니다.</p>
          </div>
        </div>
        <DataTable
          rows={products}
          columns={[
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
            { key: "cert", label: "인증", render: (row) => row.certifications.length ? row.certifications[0].type : <Badge tone="muted">없음</Badge> },
            {
              key: "registeredPrice",
              label: "조달 등록가",
              render: (row) =>
                formatWon(
                  median(
                    records
                      .filter((record) => record.productId === row.id)
                      .map((record) => record.registeredPrice || 0)
                      .filter(Boolean)
                  )
                ),
            },
            { key: "updated", label: "확인일", render: (row) => formatDate(row.lastSeenAt) },
          ]}
        />
      </section>
    </PageFrame>
  );
}
