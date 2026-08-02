import Link from "next/link";

function toQueryString(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) searchParams.set(key, value);
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function PaginationControls({
  pathname,
  page,
  pageCount,
  total,
  start,
  end,
  params,
  pageParam = "page",
}: {
  pathname: string;
  page: number;
  pageCount: number;
  total: number;
  start: number;
  end: number;
  params: Record<string, string | undefined>;
  pageParam?: string;
}) {
  if (total === 0) return null;

  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (value) =>
      value === 1 ||
      value === pageCount ||
      Math.abs(value - page) <= 2
  );

  const compactPageNumbers = pageNumbers.reduce<number[]>((acc, value) => {
    if (acc.at(-1) !== value) acc.push(value);
    return acc;
  }, []);

  const buildHref = (nextPage: number) =>
    `${pathname}${toQueryString({
      ...params,
      [pageParam]: String(nextPage),
    })}`;

  return (
    <div className="dh-pagination" aria-label="페이지 이동">
      <div className="dh-pagination__summary">
        {start + 1} - {end} / {total}
      </div>
      <div className="dh-pagination__links">
        <Link
          href={buildHref(Math.max(1, page - 1))}
          className={`dh-page-link${page <= 1 ? " is-disabled" : ""}`}
          aria-disabled={page <= 1}
          tabIndex={page <= 1 ? -1 : undefined}
        >
          이전
        </Link>
        {compactPageNumbers.map((value, index) => {
          const previous = compactPageNumbers[index - 1];
          const gap = previous && value - previous > 1;
          return (
            <span key={value} className="dh-page-link-group">
              {gap ? <span className="dh-page-gap">…</span> : null}
              <Link
                href={buildHref(value)}
                className={`dh-page-link${value === page ? " is-active" : ""}`}
                aria-current={value === page ? "page" : undefined}
              >
                {value}
              </Link>
            </span>
          );
        })}
        <Link
          href={buildHref(Math.min(pageCount, page + 1))}
          className={`dh-page-link${page >= pageCount ? " is-disabled" : ""}`}
          aria-disabled={page >= pageCount}
          tabIndex={page >= pageCount ? -1 : undefined}
        >
          다음
        </Link>
      </div>
    </div>
  );
}
