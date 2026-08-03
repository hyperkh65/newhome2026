import Link from "next/link";

import { DataTable } from "@/components/datahub/DataTable";
import { PageFrame } from "@/components/datahub/PageFrame";
import { StatGrid } from "@/components/datahub/StatGrid";
import { formatDateTime } from "@/lib/datahub/format";
import { loadBundle } from "@/lib/datahub/repository";

export default async function AdminPage() {
  const bundle = await loadBundle();

  return (
    <PageFrame updatedAt={bundle.generatedAt}>
      <section className="dh-hero">
        <div className="dh-hero__head">
          <div>
            <h1>관리자</h1>
            <p>브라우저에서 직접 Notion을 수정하지 않고, 파이프라인과 입력 상태만 관리합니다.</p>
          </div>
        </div>
      </section>

      <StatGrid
        items={[
          { label: "최근 수집 실행", value: bundle.collectionRuns.length, helper: "Collection Runs 기준" },
          { label: "오류 목록", value: bundle.dataIssues.length, helper: "해결 전 이슈 포함" },
          { label: "병합 검토 후보", value: 1, helper: "모델명 유사도 기준 예시" },
          { label: "누락 필드 목록", value: 1, helper: "품질 점수 하락 제품" },
          { label: "CSV 템플릿", value: "지원", helper: "아래 다운로드 링크 제공" },
          { label: "수동 실행", value: "GitHub Actions", helper: "workflow_dispatch 지원" },
        ]}
      />

      <div className="dh-grid-2">
        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>관리 작업</h2>
            </div>
          </div>
          <ul className="dh-bullet-list">
            <li>
              <Link href="/admin/products">제품 관리 (스펙 테이블)</Link>
            </li>
            <li>
              <Link href="/admin/product-builder">AI 상품페이지 빌더 열기</Link>
            </li>
            <li>
              <Link href="/data/public/csv-template-led-market.csv">CSV 업로드 템플릿 다운로드</Link>
            </li>
            <li>`npm run pipeline` 또는 GitHub Actions `workflow_dispatch`로 수동 실행</li>
            <li>환경변수와 Notion DB ID가 없으면 dry-run 모드로 동작</li>
          </ul>
        </section>

        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>매칭 검토</h2>
            </div>
          </div>
          <ul className="dh-bullet-list">
            <li>모델명 불명확한 민수상품은 자동 병합하지 않습니다.</li>
            <li>점수가 낮은 병합 후보는 Data Issues에 `검토 필요`로 저장합니다.</li>
          </ul>
        </section>
      </div>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>최근 수집 실행 결과</h2>
          </div>
        </div>
        <DataTable
          rows={bundle.collectionRuns}
          columns={[
            { key: "id", label: "Run ID", render: (row) => row.runId },
            { key: "source", label: "소스", render: (row) => row.sourceName },
            { key: "started", label: "시작", render: (row) => formatDateTime(row.startedAt) },
            { key: "finished", label: "종료", render: (row) => formatDateTime(row.finishedAt) },
            { key: "success", label: "성공", render: (row) => (row.success ? "성공" : "실패") },
            { key: "counts", label: "조회/신규/변경", render: (row) => `${row.fetchedCount} / ${row.insertedCount} / ${row.changedCount}` },
            { key: "errors", label: "오류", render: (row) => row.errorCount },
          ]}
        />
      </section>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>오류 목록</h2>
          </div>
        </div>
        <DataTable
          rows={bundle.dataIssues}
          columns={[
            { key: "id", label: "Issue ID", render: (row) => row.issueId },
            { key: "type", label: "문제 유형", render: (row) => row.issueType },
            { key: "severity", label: "심각도", render: (row) => row.severity },
            { key: "desc", label: "설명", render: (row) => row.description },
            { key: "source", label: "출처", render: (row) => row.sourceName },
            { key: "resolved", label: "해결 여부", render: (row) => (row.resolved ? "완료" : "미해결") },
          ]}
        />
      </section>
    </PageFrame>
  );
}
