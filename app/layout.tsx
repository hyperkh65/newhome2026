import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import ClientWidgets from '@/components/ClientWidgets';
import GlobalLocalizer from '@/components/GlobalLocalizer';

export const metadata: Metadata = {
  title: "YNK 홈페이지",
  description: "조달 등록정보와 민수 판매정보를 검색하고 비교합니다.",
  metadataBase: new URL('https://www.ynk2014.com'),
  openGraph: {
    type: 'website',
    url: 'https://www.ynk2014.com/',
    siteName: 'YNK 홈페이지',
    title: 'YNK 홈페이지 | LED 조명 무역·인증·물류',
    description: '검증된 LED 조명과 무역·인증·물류 정보를 제공하는 YNK 홈페이지입니다.',
    images: [{ url: '/hero-main.png', width: 640, height: 640, alt: 'YNK LED Lighting' }],
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YNK 홈페이지 | LED 조명 무역·인증·물류',
    description: '검증된 LED 조명과 무역·인증·물류 정보를 제공하는 YNK 홈페이지입니다.',
    images: ['/hero-main.png'],
  },
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
        <GlobalLocalizer />
        <ClientWidgets />
      </body>
    </html>
  );
}
