import { BarList } from "@/components/datahub/BarList";
import { DataTable } from "@/components/datahub/DataTable";
import { PageFrame } from "@/components/datahub/PageFrame";
import { StatGrid } from "@/components/datahub/StatGrid";
import {
  buildMarketComparisonRows,
  buildPriceDeltaRows,
  categoryCounts,
  iqrOutliers,
  median,
} from "@/lib/datahub/analytics";
import { formatDateTime, formatPercent, formatWon } from "@/lib/datahub/format";
import { loadBundle } from "@/lib/datahub/repository";

export default async function InsightsPage() {
  const bundle = await loadBundle();
  const categoryStats = categoryCounts(bundle.products);
  const priceChanges = buildPriceDeltaRows(
    bundle.products,
    bundle.priceHistory,
    bundle.companies
  );
  const comparisons = buildMarketComparisonRows(
    bundle.products,
    bundle.listings,
    bundle.procurementRecords
  );
  const allPrices = bundle.listings.map((listing) => listing.totalPrice);
  const outliers = iqrOutliers(allPrices);

  return (
    <PageFrame updatedAt={bundle.generatedAt}>
      <section className="dh-hero">
        <div className="dh-hero__head">
          <div>
            <h1>인사이트</h1>
            <p>유료 AI 없이 계산 가능한 통계 분석 결과만 표시합니다.</p>
          </div>
        </div>
      </section>

      <StatGrid
        items={[
          { label: "분석 기준 기간", value: "최근 7일", helper: "예시 데이터 기준" },
          { label: "사용 데이터 수", value: bundle.listings.length, helper: "원본 판매 목록 수" },
          { label: "민수 중앙가격", value: formatWon(median(allPrices)), helper: "전체 총액 중앙값" },
          { label: "가격 이상치", value: outliers.length, helper: "IQR 1.5 기준" },
          { label: "누락 이슈", value: bundle.dataIssues.length, helper: "데이터 품질 검토 대상" },
          { label: "마지막 분석 시각", value: formatDateTime(bundle.generatedAt), helper: "분석 JSON 생성 시각" },
        ]}
      />

      <div className="dh-grid-2">
        <BarList title="카테고리별 제품 수 변화" items={categoryStats} />
        <BarList
          title="동일 규격 시장별 가격 차이"
          items={comparisons.map((row) => ({
            label: row.displayName,
            value: row.priceGapRate ? Math.abs(row.priceGapRate) : 0,
          }))}
        />
      </div>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>자동 분석 문장</h2>
            <p>계산 근거가 있는 문장만 생성합니다.</p>
          </div>
        </div>
        <ul className="dh-note-list">
          {bundle.analysisReports.flatMap((report) => report.details).map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </section>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>가격 변동 제품</h2>
            <p>직전 수집 대비 변동률 기준입니다.</p>
          </div>
        </div>
        <DataTable
          rows={priceChanges.filter((row) => row.changeRate !== null)}
          columns={[
            { key: "name", label: "제품명", render: (row) => row.displayName },
            { key: "current", label: "현재 가격", render: (row) => formatWon(row.currentPrice) },
            { key: "previous", label: "이전 가격", render: (row) => formatWon(row.previousPrice) },
            { key: "change", label: "변동률", render: (row) => formatPercent(row.changeRate) },
            { key: "date", label: "기준 시각", render: (row) => formatDateTime(row.collectedAt) },
          ]}
        />
      </section>
    </PageFrame>
  );
}
