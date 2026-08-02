import Link from "next/link";

import { Badge } from "@/components/datahub/Badge";

const scopes = [
  { value: "all", label: "전체" },
  { value: "procurement", label: "조달" },
  { value: "consumer", label: "민수" },
  { value: "companies", label: "업체" },
];

export function SearchHero({
  scope = "all",
  action = "/search",
  query = "",
  demo = false,
}: {
  scope?: string;
  action?: string;
  query?: string;
  demo?: boolean;
}) {
  return (
    <section className="dh-hero">
      <div className="dh-hero__head">
        <div>
          <h1>LED 제품 시장 데이터</h1>
          <p>조달 등록정보와 민수 판매정보를 검색하고 비교합니다.</p>
        </div>
        {demo ? <Badge tone="warning">예시 데이터</Badge> : null}
      </div>

      <form action={action} className="dh-search-form" role="search">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="제품명, 모델명, 업체명, 규격, 인증번호 검색"
          aria-label="통합 검색"
          list="search-suggestions"
        />
        <button type="submit">검색</button>
        <datalist id="search-suggestions">
          <option value="공장등 150W" />
          <option value="UFO 하이베이" />
          <option value="씨피엔텍" />
          <option value="고효율기자재" />
        </datalist>
      </form>

      <div className="dh-scope-tabs" role="tablist" aria-label="검색 범위">
        {scopes.map((item) => (
          <Link
            key={item.value}
            href={`${action}?scope=${item.value}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
            className={`dh-scope-tab${scope === item.value ? " is-active" : ""}`}
            role="tab"
            aria-selected={scope === item.value}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
