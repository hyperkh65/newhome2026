import type { Metadata } from "next";

import { BusinessEnglishStudio } from "@/components/english/BusinessEnglishStudio";
import { LightExpressionBrowser } from "@/components/english/LightExpressionBrowser";
import { LIGHT_ENTRIES } from "@/lib/english/catalog";

export const metadata: Metadata = {
  title: "Business English Study Lab",
  description:
    "Business phrasal verbs and patterns with self-study drills, Remotion learning cards, and local progress tracking.",
};

export default function EnglishPage() {
  return (
    <>
      <BusinessEnglishStudio />
      <div style={{
        maxWidth: 1400, margin: "0 auto", padding: "48px 24px",
        borderTop: "1px solid #1e293b",
      }}>
        <LightExpressionBrowser totalCount={LIGHT_ENTRIES.length} />
      </div>
    </>
  );
}
