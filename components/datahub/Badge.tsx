import type { ReactNode } from "react";

type Tone =
  | "default"
  | "procurement"
  | "consumer"
  | "positive"
  | "negative"
  | "muted"
  | "warning";

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return <span className={`dh-badge dh-badge--${tone}`}>{children}</span>;
}
