import type { Metadata } from "next";

import { BusinessEnglishStudio } from "@/components/english/BusinessEnglishStudio";

export const metadata: Metadata = {
  title: "Business English Study Lab",
  description:
    "Business phrasal verbs and patterns with self-study drills, Remotion learning cards, and local progress tracking.",
};

export default function EnglishPage() {
  return <BusinessEnglishStudio />;
}
