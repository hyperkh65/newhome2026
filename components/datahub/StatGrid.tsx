import type { ReactNode } from "react";

export interface StatItem {
  label: string;
  value: ReactNode;
  helper?: string;
}

export function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="dh-stat-grid">
      {items.map((item) => (
        <article className="dh-stat-card" key={item.label}>
          <p className="dh-stat-card__label">{item.label}</p>
          <strong className="dh-stat-card__value">{item.value}</strong>
          {item.helper ? <p className="dh-stat-card__helper">{item.helper}</p> : null}
        </article>
      ))}
    </div>
  );
}
