import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import ClientWidgets from '@/components/ClientWidgets';

export const metadata: Metadata = {
  title: "YNK 홈페이지",
  description: "조달 등록정보와 민수 판매정보를 검색하고 비교합니다.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  keywords: [
    "LED",
    "조달시장",
    "민수시장",
    "제품 데이터",
    "가격 비교",
    "조명 데이터",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <ClientWidgets />
      </body>
    </html>
  );
}
