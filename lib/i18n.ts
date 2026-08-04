'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ko' | 'en' | 'zh' | 'ja';

interface I18nState {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: 'ko',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'i18n-storage' }
  )
);

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  home: { ko: '홈', en: 'Home', zh: '首页', ja: 'ホーム' },
  company: { ko: '회사소개', en: 'Company', zh: '关于我们', ja: '会社概要' },
  products: { ko: '제품소개', en: 'Products', zh: '产品列表', ja: '製品紹介' },
  trade: { ko: '무역/인증', en: 'Trade/Cert.', zh: '贸易/认证', ja: '貿易/認証' },
  logistics: { ko: '물류조회', en: 'Tracking', zh: '物流查询', ja: '物流問合' },
  board: { ko: '게시판', en: 'Board', zh: '公告栏', ja: '掲시판' },
  blog: { ko: '블로그', en: 'Blog', zh: '博客', ja: 'ブログ' },
  contact: { ko: '문의하기', en: 'Contact', zh: '联系我们', ja: 'お問い合わせ' },
  cart: { ko: '장바구니', en: 'Cart', zh: '购物车', ja: 'カート' },
  featured: { ko: '주요 취급 품목', en: 'Featured Products', zh: '主要产品', ja: '主な取扱品目' },
  viewMore: { ko: '전체 품목 보기', en: 'View All Products', zh: '查看全部', ja: '全品目を見る' },
  specs: { ko: '스펙', en: 'Specs', zh: '规格', ja: '仕様' },
  stock: { ko: '재고', en: 'Stock', zh: '库存', ja: '在庫' },
  buy: { ko: '구매하기', en: 'Buy Now', zh: '立即购买', ja: '購入する' },
  addToCart: { ko: '장바구니 담기', en: 'Add to Cart', zh: '加入购物车', ja: 'カートに入れる' },
  related: { ko: '함께 보면 좋아요', en: 'Related Products', zh: '相关产品', ja: 'こちらもおすすめ' },
  footerAbout: { ko: '종합 LED 무역 솔루션', en: 'Combined LED Trade Solution', zh: '综合LED贸易解决方案', ja: '総合LED貿易ソリューション' },
  address: { ko: '주소', en: 'Address', zh: '地址', ja: '住所' },
  tel: { ko: '전화', en: 'Tel', zh: '电话', ja: '電話' },
  fax: { ko: '팩스', en: 'Fax', zh: '传真', ja: 'ファックス' },
  email: { ko: '이메일', en: 'Email', zh: '电子邮件', ja: 'メール' },
  bizNum: { ko: '사업자번호', en: 'Business ID', zh: '营业执照', ja: '事業者番号' },
  allModels: { ko: '전체 모델', en: 'All Models', zh: '所有型号', ja: '全モデル' },
  modelsListed: { ko: '개의 모델이 등록되어 있습니다.', en: 'models available.', zh: '个型号可用。', ja: '個のモデルがあります。' },
  searchPlaceholder: { ko: '모델명 검색', en: 'Search models', zh: '搜索型号', ja: 'モデルを検索' },
  category: { ko: '제품 분류', en: 'Categories', zh: '产品分类', ja: '製品カテゴリ' },
  all: { ko: '전체', en: 'All', zh: '全部', ja: 'すべて' },
  smart: { ko: '스마트조명', en: 'Smart Lighting', zh: '智能照明', ja: 'スマート照明' },
  indoor: { ko: '실내조명', en: 'Indoor', zh: '室内照明', ja: '室内照明' },
  commercial: { ko: '상업조명', en: 'Commercial', zh: '商业照明', ja: '商業照明' },
  outdoor: { ko: '실외조명', en: 'Outdoor', zh: '室外照明', ja: '屋外照明' },
  landscape: { ko: '경관조명', en: 'Landscape', zh: '景观照明', ja: '景観照明' },
  special: { ko: '특수조명', en: 'Specialty', zh: '特殊照明', ja: '特殊照明' },
  industrial: { ko: '산업조명', en: 'Industrial', zh: '工业照明', ja: '産業照明' },
  home_lighting: { ko: '홈조명', en: 'Home Lighting', zh: '家居照明', ja: 'ホーム照明' },
  'price-asc': { ko: '가격 낮은순', en: 'Price: Low to High', zh: '价格：从低到高', ja: '価格の安い順' },
  'price-desc': { ko: '가격 높은순', en: 'Price: High to Low', zh: '价格：从高到低', ja: '価格の高い順' },
  rating: { ko: '평점순', en: 'Rating', zh: '评分', ja: '評価順' },
  newest: { ko: '최신순', en: 'Newest', zh: '最新', ja: '最新順' },
  'shop-all': { ko: '전체 라인업 카탈로그 보기 →', en: 'View all lineup catalogs →', zh: '查看所有阵容目录 →', ja: 'すべてのラインナップカタログを見る →' },
  desc_smart: { ko: 'IoT 기반 무선 자동제어', en: 'IoT-based wireless control', zh: '基于IoT的无线自动控制', ja: 'IoTベースの無線自動制御' },
  desc_indoor: { ko: '사무·상업용 고효율 LED', en: 'High efficiency office/comm LED', zh: '办公室/商业高效LED', ja: '事務・商業用高効率LED' },
  desc_commercial: { ko: '쇼핑몰·매장 프리미엄 라인', en: 'Premium retail lighting', zh: '商场/店铺高端系列', ja: 'ショッピングモール・店舗プレミアムライン' },
  desc_outdoor: { ko: '공장등·가로등 내구성 특화', en: 'Industrial/Street lighting', zh: '工厂灯/路灯耐用型', ja: '工場灯・街路灯耐久性特化' },
  desc_landscape: { ko: '건축물·랜드마크 특화', en: 'Architectural landscape', zh: '建筑/地标特色照明', ja: '建物・ランドマーク特化' },
  desc_special: { ko: '의료·클린룸·방폭·살균', en: 'Medical/Cleanroom/Special', zh: '医疗/无尘室/防爆/杀菌', ja: '医療・クリーンルーム・防爆・殺菌' },
  desc_industrial: { ko: '공장, 거대 물류창고 특화', en: 'Factory & Warehouse', zh: '工厂与仓库', ja: '工場・倉庫特化' },
  desc_home: { ko: '고품격 주거 공간 스타일링', en: 'Premium Residential', zh: '高端住宅', ja: 'プレミアム住宅' },
  footer_products: { ko: '제품 및 인증 조회', en: 'Products & Certs', zh: '产品与认证', ja: '製品と認証' },
  footer_trade: { ko: '무역 파트너스', en: 'Trade Partners', zh: '贸易伙伴', ja: '貿易パートナー' },
  footer_support: { ko: '고객지원', en: 'Support', zh: '客户支持', ja: 'カスタマーサポート' },
  search_hint: { ko: '예: SMPS, 패널...', en: 'e.g. SMPS, Panel...', zh: '例如：SMPS, 面板...', ja: '例：SMPS, パネル...' },
  price_limit: { ko: '가격 상한', en: 'Price Limit', zh: '价格上限', ja: '価格上限' },
  won: { ko: '원', en: 'KRW', zh: '韩元', ja: 'ウォン' },
  results_none: { ko: '검색 결과가 없습니다', en: 'No results found', zh: '没有找到结果', ja: '検索結果がありません' },
  filter_reset: { ko: '필터 초기화', en: 'Reset Filters', zh: '重置过滤器', ja: 'フィルター初期化' },
  stat_partners: { ko: '글로벌 제조 파트너', en: 'Global MFG Partners', zh: '全球制造伙伴', ja: 'グローバル製造パートナー' },
  stat_cert: { ko: '글로벌 인증 합격률', en: 'Global Cert Rate', zh: '全球认证率', ja: 'グローバル認証率' },
  stat_export: { ko: '수출/수입 진행 건수', en: 'Export/Import Cases', zh: '进出口案例', ja: '輸出入進捗件수' },
  stat_tracking: { ko: '실시간 물류 추적', en: 'Real-time Tracking', zh: '实时物流查询', ja: 'リアルタイム物流追跡' },
  home_solutions_title: { ko: '맞춤 조명 솔루션', en: 'Custom Lighting Solutions', zh: '定制照明方案', ja: 'カスタム照明ソリューション' },
  wattage: { ko: '소비전력', en: 'Wattage', zh: '瓦数', ja: '消費電力' },
  power: { ko: '소비전력', en: 'Power', zh: '功率', ja: '電力' },
  color_temp: { ko: '색온도', en: 'Color Temp', zh: '色温', ja: '色温度' },
  luminous_flux: { ko: '광속', en: 'Luminous Flux', zh: '光束', ja: '光束' },
  beam_angle: { ko: '배광각도', en: 'Beam Angle', zh: '光束角', ja: '配光角度' },
  dimming: { ko: '조광여부', en: 'Dimming', zh: '调光', ja: '調光' },
  dimmable: { ko: '조광여부', en: 'Dimmable', zh: '可调光', ja: '調光' },
  ip_rating: { ko: '방수방진', en: 'IP Rating', zh: 'IP等级', ja: '防水防塵' },
  size: { ko: '제품 크기', en: 'Size', zh: '尺寸', ja: 'サイズ' },
  home_trade_title: { ko: '복잡한 무역 인증과 물류,\n저희가 모두 관리합니다.', en: 'Complex Trade & Logistics,\nWe Handle It All.', zh: '复杂的贸易认证与物流，\n我们全权负责。', ja: '複雑な貿易認証と物流、\n私たちがすべて管理します。' },
  home_trade_desc: { ko: 'KC, CE, RoHS 등 필수 인증 절차 지원부터 중국-인천항 물류 트래킹까지. B2B 고객사들이 오직 비즈니스에만 집중할 수 있도록 종합 무역 솔루션을 제공합니다.', en: 'Comprehensive trade solutions from certification support (KC, CE, RoHS) to logistics tracking. We handle the complexity so you can focus on your business.', zh: '提供从必要认证手续（KC, CE, RoHS）到物流跟踪的综合贸易解决方案。让B2B客户专注于业务本身。', ja: 'KC, CE, RoHSなどの必須認証手続きのサポートから、中韓物流トラッキングまで。B2B顧客がビジネスのみ에 집중할 수 있도록 종합 무역 솔루션을 제공합니다.' },
  home_trade_btn1: { ko: '인증 안내서 확인', en: 'View Cert Guide', zh: '查看认证指南', ja: '認証案内書の確認' },
  home_trade_btn2: { ko: '물류 상황 조회 →', en: 'Check Logistics →', zh: '查询物流状况 →', ja: '物流状況の照会 →' },
};

export const FLAG_ICONS: Record<Language, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
};

export const useI18n = () => {
  const { lang, setLang } = useI18nStore();
  const t = (key: string): string => {
    return TRANSLATIONS[key]?.[lang] || key;
  };
  return { lang, setLang, t };
};
