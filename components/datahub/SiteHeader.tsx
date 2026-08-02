import Link from "next/link";

import { formatDateTime } from "@/lib/datahub/format";

const menu = [
  { href: "/search", label: "통합검색" },
  { href: "/procurement", label: "조달시장" },
  { href: "/consumer", label: "민수시장" },
  { href: "/products", label: "제품" },
  { href: "/companies", label: "업체" },
  { href: "/insights", label: "인사이트" },
  { href: "/sources", label: "데이터 출처" },
];

export function SiteHeader({ updatedAt }: { updatedAt?: string | null }) {
  return (
    <header className="dh-header">
      <div className="dh-container dh-header__inner">
        <div className="dh-brand">
          <Link href="/" className="dh-brand__logo" aria-label="LED 시장 데이터 홈">
            LED
          </Link>
          <div className="dh-brand__text">
            <Link href="/" className="dh-brand__name">
              LED 시장 데이터
            </Link>
            <p className="dh-brand__sub">조달·민수 LED 데이터 허브</p>
          </div>
        </div>

        <nav className="dh-nav" aria-label="주요 메뉴">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className="dh-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="dh-header__meta">
          <span className="dh-meta-label">최종 업데이트</span>
          <strong className="dh-meta-value">{formatDateTime(updatedAt)}</strong>
          <Link href="/admin" className="dh-admin-link">
            관리자
          </Link>
        </div>
      </div>
    </header>
  );
}
