import type { Metadata } from "next";
import { EnglishHub } from "@/components/english/EnglishHub";

export const metadata: Metadata = {
  title: "Business English Hub",
  description: "비즈니스 영어 완전 정복 — 단어, 표현, 테스트, 진도 관리",
};

export default function EnglishPage() {
  return <EnglishHub />;
}
