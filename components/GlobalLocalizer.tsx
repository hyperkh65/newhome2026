'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useI18n, Language } from '@/lib/i18n';

// 정보/지원 페이지에 남아 있는 공통 UI 문구를 한 곳에서 관리한다.
// 제품 상세·제품 목록은 제품명/사양의 원문을 보존하기 위해 의도적으로 제외한다.
const COPY: Record<string, Record<Language, string>> = {
  '회사소개': { ko: '회사소개', en: 'Company', zh: '关于我们', ja: '会社概要' },
  '제품소개': { ko: '제품소개', en: 'Products', zh: '产品介绍', ja: '製品紹介' },
  '시장현황': { ko: '시장현황', en: 'Market', zh: '市场动态', ja: '市場動向' },
  'HS코드': { ko: 'HS코드', en: 'HS Code', zh: 'HS编码', ja: 'HSコード' },
  '무역/인증': { ko: '무역/인증', en: 'Trade/Cert.', zh: '贸易/认证', ja: '貿易/認証' },
  '물류조회': { ko: '물류조회', en: 'Tracking', zh: '物流查询', ja: '物流照会' },
  '시장보고서': { ko: '시장보고서', en: 'Market Reports', zh: '市场报告', ja: '市場レポート' },
  '게시판': { ko: '게시판', en: 'Board', zh: '公告栏', ja: '掲示板' },
  '블로그': { ko: '블로그', en: 'Blog', zh: '博客', ja: 'ブログ' },
  '고객센터': { ko: '고객센터', en: 'Support', zh: '客户中心', ja: 'サポート' },
  '학습실': { ko: '학습실', en: 'Learning Lab', zh: '学习中心', ja: '学習室' },
  '회사 소개': { ko: '회사 소개', en: 'About Us', zh: '公司介绍', ja: '会社紹介' },
  '회사 위치 / 오시는 길': { ko: '회사 위치 / 오시는 길', en: 'Location & Directions', zh: '公司位置 / 交通指南', ja: '所在地・アクセス' },
  '시장 보고서': { ko: '시장 보고서', en: 'Market Reports', zh: '市场报告', ja: '市場レポート' },
  '자료 공유 게시판': { ko: '자료 공유 게시판', en: 'Resource Board', zh: '资料共享公告栏', ja: '資料共有掲示板' },
  '고객 문의': { ko: '고객 문의', en: 'Contact Us', zh: '客户咨询', ja: 'お問い合わせ' },
  '자주 묻는 질문': { ko: '자주 묻는 질문', en: 'Frequently Asked Questions', zh: '常见问题', ja: 'よくある質問' },
  '설치 가이드': { ko: '설치 가이드', en: 'Installation Guide', zh: '安装指南', ja: '設置ガイド' },
  '데이터 출처': { ko: '데이터 출처', en: 'Data Sources', zh: '数据来源', ja: 'データソース' },
  '전자 카탈로그': { ko: '전자 카탈로그', en: 'Digital Catalogs', zh: '电子目录', ja: '電子カタログ' },
  '검색 결과': { ko: '검색 결과', en: 'Search Results', zh: '搜索结果', ja: '検索結果' },
  '업체 목록': { ko: '업체 목록', en: 'Company Directory', zh: '企业列表', ja: '企業一覧' },
  '조달시장': { ko: '조달시장', en: 'Public Procurement', zh: '公共采购市场', ja: '調達市場' },
  '민수시장': { ko: '민수시장', en: 'Private Market', zh: '民用市场', ja: '民需市場' },
  '잠금 게시글': { ko: '잠금 게시글', en: 'Locked Post', zh: '锁定帖子', ja: 'ロックされた投稿' },
  '열람 암호 입력': { ko: '열람 암호 입력', en: 'Enter access password', zh: '请输入访问密码', ja: '閲覧パスワードを入力' },
  '다운로드': { ko: '다운로드', en: 'Download', zh: '下载', ja: 'ダウンロード' },
  '저장': { ko: '저장', en: 'Save', zh: '保存', ja: '保存' },
  '닫기': { ko: '닫기', en: 'Close', zh: '关闭', ja: '閉じる' },
  '문의가 접수되었습니다': { ko: '문의가 접수되었습니다', en: 'Your inquiry has been submitted', zh: '您的咨询已提交', ja: 'お問い合わせを受け付けました' },
  'A/S 신청이 접수되었습니다': { ko: 'A/S 신청이 접수되었습니다', en: 'Your service request has been submitted', zh: '您的售后申请已提交', ja: '修理申請を受け付けました' },
  '시장 현황 · 원자재 시세': { ko: '시장 현황 · 원자재 시세', en: 'Market & Raw Material Prices', zh: '市场动态 · 原材料价格', ja: '市場動向・原材料価格' },
  'HS 코드 세율 조회': { ko: 'HS 코드 세율 조회', en: 'HS Code Tariff Lookup', zh: 'HS编码税率查询', ja: 'HSコード関税率照会' },
  '제품 필터': { ko: '제품 필터', en: 'Product Filters', zh: '产品筛选', ja: '製品フィルター' },
  '제품 목록': { ko: '제품 목록', en: 'Product List', zh: '产品列表', ja: '製品一覧' },
};

const ORIGINAL_TEXT = new WeakMap<Text, string>();

function isProductPath(pathname: string) {
  return pathname === '/shop' || pathname.startsWith('/shop/') || pathname === '/products' || pathname.startsWith('/products/');
}

export default function GlobalLocalizer() {
  const { lang } = useI18n();
  const pathname = usePathname() || '/';

  useEffect(() => {
    if (isProductPath(pathname)) return;
    const translate = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const text = node as Text;
        const raw = ORIGINAL_TEXT.get(text) ?? text.nodeValue ?? '';
        if (!ORIGINAL_TEXT.has(text)) ORIGINAL_TEXT.set(text, raw);
        const trimmed = raw.trim();
        const entry = COPY[trimmed];
        if (!entry) continue;
        const next = entry[lang];
        const start = raw.indexOf(trimmed);
        const end = start + trimmed.length;
        const value = raw.slice(0, start) + next + raw.slice(end);
        if (text.nodeValue !== value) text.nodeValue = value;
      }
    };
    translate();
    const observer = new MutationObserver(translate);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [lang, pathname]);

  return null;
}
