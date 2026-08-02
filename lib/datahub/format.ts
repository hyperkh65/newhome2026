export function formatDateTime(value?: string | null) {
  if (!value) return "집계 전";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(date);
}

export function formatNumber(value?: number | null) {
  if (value == null || Number.isNaN(value)) return "0";
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function formatPercent(value?: number | null, digits = 1) {
  if (value == null || Number.isNaN(value)) return "-";
  return `${value.toFixed(digits)}%`;
}

export function formatWon(value?: number | null) {
  if (value == null || Number.isNaN(value) || value <= 0) return "-";
  return `${new Intl.NumberFormat("ko-KR").format(value)}원`;
}

export function rangeLabel(min?: number | null, max?: number | null) {
  if (!min && !max) return "-";
  if (min && max) return `${formatWon(min)} ~ ${formatWon(max)}`;
  return formatWon(min || max);
}
