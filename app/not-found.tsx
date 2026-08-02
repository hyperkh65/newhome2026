import Link from "next/link";

import { PageFrame } from "@/components/datahub/PageFrame";

export default function NotFound() {
  return (
    <PageFrame>
      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>페이지를 찾을 수 없습니다.</h2>
            <p>요청한 제품 또는 업체가 현재 데이터에 없습니다.</p>
          </div>
        </div>
        <Link href="/" className="dh-admin-link">
          메인으로 이동
        </Link>
      </section>
    </PageFrame>
  );
}
