import { formatNumber, formatWon } from "@/lib/datahub/format";

export function BarList({
  title,
  items,
  kind = "count",
}: {
  title: string;
  items: Array<{ label: string; value: number | null }>;
  kind?: "count" | "price";
}) {
  const max = Math.max(...items.map((item) => item.value ?? 0), 1);

  return (
    <section className="dh-panel">
      <div className="dh-section-head">
        <h2>{title}</h2>
      </div>
      <div className="dh-bar-list">
        {items.map((item) => (
          <div className="dh-bar-row" key={item.label}>
            <div className="dh-bar-row__meta">
              <span>{item.label}</span>
              <strong>
                {kind === "price" ? formatWon(item.value) : formatNumber(item.value ?? 0)}
              </strong>
            </div>
            <div className="dh-bar-track" aria-hidden="true">
              <div
                className="dh-bar-track__fill"
                style={{ width: `${((item.value ?? 0) / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
