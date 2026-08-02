import { DataTable } from "@/components/datahub/DataTable";
import { PageFrame } from "@/components/datahub/PageFrame";
import { formatDateTime } from "@/lib/datahub/format";
import { loadDashboardData } from "@/lib/datahub/repository";

export default async function SourcesPage() {
  const { bundle, sourceHealth } = await loadDashboardData();

  return (
    <PageFrame updatedAt={bundle.generatedAt}>
      <section className="dh-hero">
        <div className="dh-hero__head">
          <div>
            <h1>데이터 출처</h1>
            <p>모든 데이터는 출처와 마지막 확인 시각을 함께 표시합니다.</p>
          </div>
        </div>
      </section>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>수집 상태</h2>
            <p>자동 수집, 수동 입력, 분석 생성 여부를 분리해 표시합니다.</p>
          </div>
        </div>
        <DataTable
          rows={sourceHealth}
          columns={[
            { key: "name", label: "출처", render: (row) => row.sourceName },
            { key: "market", label: "시장", render: (row) => row.marketType },
            { key: "status", label: "상태", render: (row) => row.status },
            { key: "issues", label: "이슈 수", render: (row) => row.issueCount },
            { key: "updated", label: "마지막 확인", render: (row) => formatDateTime(row.lastCollectedAt) },
            { key: "note", label: "설명", render: (row) => row.note },
          ]}
        />
      </section>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>원칙</h2>
          </div>
        </div>
        <ul className="dh-bullet-list">
          <li>공식 API, 제휴 데이터, 공식 다운로드, CSV 업로드, 수동 입력 순으로 우선합니다.</li>
          <li>허용 여부가 불명확한 HTML 크롤링은 기본적으로 비활성화합니다.</li>
          <li>사이트는 생성된 JSON을 우선 읽고, 수집 실패 시 마지막 정상 데이터를 유지합니다.</li>
          <li>예시 데이터는 demo 플래그와 배지로 분리합니다.</li>
        </ul>
      </section>
    </PageFrame>
  );
}
