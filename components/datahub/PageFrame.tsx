import type { ReactNode } from "react";

import { SiteHeader } from "@/components/datahub/SiteHeader";

export function PageFrame({
  updatedAt,
  children,
}: {
  updatedAt?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="dh-page">
      <SiteHeader updatedAt={updatedAt} />
      <main className="dh-main">
        <div className="dh-container dh-stack">{children}</div>
      </main>
      <footer className="dh-footer">
        <div className="dh-container">
          LED 제품 시장 데이터 · 조달 등록정보와 민수 판매정보를 검색하고 비교합니다.
        </div>
      </footer>
    </div>
  );
}
