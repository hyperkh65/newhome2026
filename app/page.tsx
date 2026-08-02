import Link from "next/link";

import { Badge } from "@/components/datahub/Badge";
import { BarList } from "@/components/datahub/BarList";
import { DataTable } from "@/components/datahub/DataTable";
import { PageFrame } from "@/components/datahub/PageFrame";
import { SearchHero } from "@/components/datahub/SearchHero";
import { StatGrid } from "@/components/datahub/StatGrid";
import { formatDate, formatDateTime, formatPercent, formatWon } from "@/lib/datahub/format";
import {
  loadDashboardData,
  loadDashboardSnapshot,
  loadPipelineStatusSnapshot,
} from "@/lib/datahub/repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [snapshot, pipelineStatus] = await Promise.all([
    loadDashboardSnapshot(),
    loadPipelineStatusSnapshot(),
  ]);
  const fallback = snapshot ? null : await loadDashboardData();
  const summary = snapshot?.summary ?? fallback!.summary;
  const updatedAt = pipelineStatus?.lastSuccessfulBuildAt ?? summary.lastUpdatedAt;
  const categoryStats = snapshot?.categoryStats ?? fallback!.categoryStats;
  const priceChanges = snapshot?.priceChanges ?? fallback!.priceChanges;
  const sourceHealth = snapshot?.sourceHealth ?? fallback!.sourceHealth;
  const marketComparison = snapshot?.marketComparison ?? fallback!.marketComparison;
  const newProducts = snapshot?.newProducts ?? [...fallback!.bundle.products]
    .sort((a, b) => b.firstSeenAt.localeCompare(a.firstSeenAt))
    .slice(0, 5);
  const topCompanies = snapshot?.topCompanies ?? [...fallback!.bundle.companies]
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 5);
  const recentChanges = priceChanges
    .filter((row) => row.changeRate !== null)
    .sort((a, b) => Math.abs(b.changeRate ?? 0) - Math.abs(a.changeRate ?? 0))
    .slice(0, 6);
  const latestRun = pipelineStatus?.latestRun ?? null;
  const pipelineStatusTone =
    latestRun?.status === "success"
      ? "positive"
      : latestRun?.status === "partial"
        ? "warning"
        : latestRun?.status === "failed"
          ? "negative"
          : "muted";
  const pipelineStatusLabel =
    latestRun?.status === "success"
      ? "정상"
      : latestRun?.status === "partial"
        ? "부분 성공"
        : latestRun?.status === "failed"
          ? "실패"
          : "집계 전";

  return (
    <PageFrame updatedAt={updatedAt}>
      <SearchHero demo={summary.demo} />

      <StatGrid
        items={[
          { label: "전체 제품", value: summary.totalProducts, helper: "검색 가능한 전체 제품 수" },
          { label: "조달 제품", value: summary.procurementProducts, helper: "조달 등록 제품" },
          { label: "민수 제품", value: summary.consumerProducts, helper: "민수 판매 제품" },
          { label: "등록 업체", value: summary.companies, helper: "제조사·공급사·판매사" },
          { label: "최근 신규 등록", value: summary.recentNewProducts, helper: "최근 7일 기준" },
          { label: "최종 업데이트", value: formatDateTime(updatedAt), helper: "마지막 정상 데이터 생성 시각" },
        ]}
      />

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>데이터 수집 상태</h2>
            <p>2일 간격 자동 수집과 수동 실행 결과를 함께 표시합니다.</p>
          </div>
          <Badge tone={pipelineStatusTone}>{pipelineStatusLabel}</Badge>
        </div>
        <div className="dh-status-grid">
          <article className="dh-status-card">
            <span className="dh-status-card__label">마지막 수집 시도</span>
            <strong className="dh-status-card__value">
              {formatDateTime(latestRun?.finishedAt ?? null)}
            </strong>
            <span className="dh-status-card__helper">파이프라인 실행 완료 시각</span>
          </article>
          <article className="dh-status-card">
            <span className="dh-status-card__label">마지막 정상 생성</span>
            <strong className="dh-status-card__value">{formatDateTime(updatedAt)}</strong>
            <span className="dh-status-card__helper">사이트 데이터 기준 시각</span>
          </article>
          <article className="dh-status-card">
            <span className="dh-status-card__label">최근 실행 결과</span>
            <strong className="dh-status-card__value">
              {latestRun ? `${latestRun.insertedCount.toLocaleString("ko-KR")}건 반영` : "집계 전"}
            </strong>
            <span className="dh-status-card__helper">
              {latestRun?.errorSummary
                ? latestRun.errorSummary
                : "GitHub Actions 자동 실행 또는 관리자 수동 실행 결과"}
            </span>
          </article>
        </div>
      </section>

      <div className="dh-grid-3">
        <BarList title="시장 현황" items={categoryStats.slice(0, 6)} />
        <BarList
          title="최근 가격 변화"
          items={recentChanges.map((row) => ({
            label: row.displayName,
            value: row.changeRate ? Math.round(Math.abs(row.changeRate) * 10) : 0,
          }))}
        />
        <BarList
          title="데이터 수집 상태"
          items={sourceHealth.map((row) => ({
            label: row.sourceName,
            value: row.issueCount,
          }))}
        />
      </div>

      <div className="dh-grid-2">
        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>신규 등록 제품</h2>
              <p>최근 수집 기준으로 새로 들어온 제품입니다.</p>
            </div>
          </div>
          <DataTable
            rows={newProducts}
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
              { key: "category", label: "분류", render: (row) => row.category },
              { key: "date", label: "최초 수집일", render: (row) => formatDate(row.firstSeenAt) },
            ]}
          />
        </section>

        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>주요 업체</h2>
              <p>제품 수 기준 상위 업체입니다.</p>
            </div>
          </div>
          <DataTable
            rows={topCompanies}
            columns={[
              {
                key: "name",
                label: "업체",
                href: (row) => `/companies/${row.id}`,
                render: (row) => (
                  <div>
                    <strong>{row.name}</strong>
                    <div className="dh-muted">{row.region || "-"}</div>
                  </div>
                ),
              },
              { key: "procurement", label: "조달 제품", render: (row) => row.procurementProductCount },
              { key: "consumer", label: "민수 제품", render: (row) => row.consumerProductCount },
              { key: "products", label: "전체 제품", render: (row) => row.productCount },
            ]}
          />
        </section>
      </div>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>제품 데이터</h2>
            <p>메인 화면에서 바로 확인할 수 있는 대표 제품 목록입니다.</p>
          </div>
          <Link href="/products" className="dh-admin-link">
            전체 제품 보기
          </Link>
        </div>
        <DataTable
          rows={priceChanges.slice(0, 8)}
          columns={[
            {
              key: "market",
              label: "시장",
              render: (row) => (
                <Badge tone={row.marketType === "procurement" ? "procurement" : "consumer"}>
                  {row.marketType === "procurement" ? "조달" : "민수"}
                </Badge>
              ),
            },
            {
              key: "name",
              label: "제품명",
              href: (row) => `/products/${row.productId}`,
              render: (row) => (
                <div>
                  <strong>{row.displayName}</strong>
                  <div className="dh-muted">{row.modelName || "-"}</div>
                </div>
              ),
            },
            { key: "company", label: "업체", render: (row) => row.companyName || "-" },
            { key: "current", label: "현재 가격", render: (row) => formatWon(row.currentPrice) },
            { key: "previous", label: "이전 가격", render: (row) => formatWon(row.previousPrice) },
            {
              key: "delta",
              label: "변동률",
              render: (row) =>
                row.changeRate === null ? (
                  <Badge tone="muted">집계 전</Badge>
                ) : (
                  <Badge tone={row.changeRate > 0 ? "negative" : "positive"}>
                    {formatPercent(row.changeRate)}
                  </Badge>
                ),
            },
            { key: "date", label: "확인일", render: (row) => formatDateTime(row.collectedAt) },
          ]}
        />
      </section>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>조달·민수 비교</h2>
            <p>동일 제품이 두 시장에 모두 있는 경우 비교합니다.</p>
          </div>
        </div>
        <DataTable
          rows={marketComparison}
          columns={[
            {
              key: "name",
              label: "제품명",
              href: (row) => `/products/${row.productId}`,
              render: (row) => (
                <div>
                  <strong>{row.displayName}</strong>
                  <div className="dh-muted">{row.modelName || "-"}</div>
                </div>
              ),
            },
            { key: "procurement", label: "조달가격", render: (row) => formatWon(row.procurementPrice) },
            { key: "consumer", label: "민수 중앙가격", render: (row) => formatWon(row.consumerMedianPrice) },
            {
              key: "gap",
              label: "가격 차이",
              render: (row) =>
                row.priceGapRate === null ? (
                  <Badge tone="muted">집계 전</Badge>
                ) : (
                  <Badge tone={row.priceGapRate > 0 ? "negative" : "positive"}>
                    {formatPercent(row.priceGapRate)}
                  </Badge>
                ),
            },
          ]}
        />
      </section>
    </PageFrame>
  );
}
