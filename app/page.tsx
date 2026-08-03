'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Building2,
  Database,
  Factory,
  FileText,
  Globe2,
  LineChart,
  PackageSearch,
  ShieldCheck,
  Truck,
  TrendingUp,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

type MarketOverview = {
  success?: boolean;
  timestamp?: string;
  rates?: { usd: number; cny: number; jpy: number };
  metals?: Record<string, { price: number; changePct?: number }>;
  history?: Array<Record<string, unknown>>;
};

type PortOverview = {
  level?: string;
  waiting?: number;
  berthed?: number;
  berthRate?: number;
  departed?: number;
  total?: number;
  updatedAt?: string;
  demo?: boolean;
  vessels?: Array<{ name: string; flag?: string; status?: string; eta?: string; etd?: string }>;
};

type Overview = {
  ok: boolean;
  updatedAt?: string;
  market?: MarketOverview;
  port?: PortOverview;
  stats?: {
    products?: number;
    featuredProducts?: number;
    reports?: number;
    topCategories?: number;
  };
  topCategories?: Array<{ category: string; count: number }>;
  latestReports?: Array<{ id: string; title: string; author?: string; created_at?: string; cover_image?: string; is_locked?: boolean }>;
  products?: Array<any>;
  sources?: Array<{ key: string; label: string; status: 'live' | 'cached' | 'fallback'; updatedAt?: string; note: string }>;
};

type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  description: string;
  image?: string;
  featured?: boolean;
  created_at?: string;
};

type CatalogResponse = {
  ok?: boolean;
  facets?: { categories?: Array<{ name: string; count: number }> };
  items?: CatalogProduct[];
};

const HERO_METRICS = [
  { label: '시장 데이터', value: 'FX + Metals + Port' },
  { label: '리포트', value: 'Market + Trade + Finance' },
  { label: '업체 등록', value: 'Approval Workflow' },
  { label: '제품 서류', value: 'KC / CE / RoHS' },
];

const MODULES = [
  {
    href: '/market',
    title: '시장 현황',
    desc: '환율, 비철금속, 항만 현황을 실시간 데이터로 확인합니다.',
    icon: TrendingUp,
    image: '/hero-main.png',
  },
  {
    href: '/hscode',
    title: 'HS 코드',
    desc: '조명/전원/부품 코드와 관세 정보를 품목별로 조회합니다.',
    icon: PackageSearch,
    image: '/panel-interior.png',
  },
  {
    href: '/market-report',
    title: '시장 보고서',
    desc: '조명 시장 조사, 가격 추이, 분석 리포트를 축적합니다.',
    icon: FileText,
    image: '/strip-glow.png',
  },
  {
    href: '/trade-info',
    title: '무역·인증',
    desc: '수입 절차, 인증서, 통관, 실무 가이드를 한 번에 보여줍니다.',
    icon: ShieldCheck,
    image: '/solar-controller.png',
  },
];

const PRODUCT_FALLBACKS: Record<string, string> = {
  smart: '/solar-controller.png',
  indoor: '/panel-interior.png',
  home_lighting: '/solar-light.png',
  commercial: '/panel-interior.png',
  industrial: '/hero-main.png',
  outdoor: '/solar-light.png',
  landscape: '/strip-glow.png',
  special: '/hero-main.png',
};

function money(v: number | string | null | undefined, unit = '원') {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n) || n <= 0) return '-';
  return `${n.toLocaleString('ko-KR')} ${unit}`;
}

function normalizeProduct(p: any) {
  const image =
    p.cover_image ||
    p.image ||
    (Array.isArray(p.images) ? p.images[0] : null) ||
    PRODUCT_FALLBACKS[p.category] ||
    '/hero-main.png';

  return {
    ...p,
    image,
    price: Number(p.price ?? 0),
    original_price: Number(p.original_price ?? p.originalPrice ?? 0),
    stock: Number(p.stock ?? 0),
    rating: Number(p.rating ?? 0),
    reviews: Number(p.reviews ?? 0),
    description: p.description || p.summary || '조명 산업 데이터를 연결하는 허브 제품입니다.',
  };
}

function SectionTitle({
  kicker,
  title,
  desc,
  action,
}: {
  kicker: string;
  title: string;
  desc: string;
  action?: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'end', flexWrap: 'wrap' }}>
      <div style={{ maxWidth: 860 }}>
        <div style={{ fontSize: 12, letterSpacing: 2.4, textTransform: 'uppercase', color: '#0f766e', fontWeight: 800, marginBottom: 10 }}>
          {kicker}
        </div>
        <h2 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.08, color: '#0f172a', letterSpacing: 0 }}>
          {title}
        </h2>
        <p style={{ margin: '14px 0 0', color: '#64748b', lineHeight: 1.7, fontSize: 16, maxWidth: 760 }}>
          {desc}
        </p>
      </div>
      {action}
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div style={{ border: '1px solid #d9e2ef', borderRadius: 8, background: '#fff', padding: 18, minHeight: 112, display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: 7, background: '#eff6ff', color: '#2563eb', display: 'grid', placeItems: 'center' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>{value}</div>
    </div>
  );
}

function LiveOverviewSection({ data }: { data: Overview | null }) {
  const rates = data?.market?.rates;
  const metals = data?.market?.metals;
  const port = data?.port;
  const updated = data?.updatedAt || data?.market?.timestamp || data?.port?.updatedAt;

  return (
    <section style={{ padding: '0 24px 32px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'end', flexWrap: 'wrap', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 2.2, textTransform: 'uppercase', color: '#0f766e', fontWeight: 800, marginBottom: 10 }}>
              Live Intelligence
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(26px, 4vw, 40px)', lineHeight: 1.1, color: '#0f172a' }}>
              실제 소스에서 가져온 숫자를 그대로 보여줍니다.
            </h2>
          </div>
          <div style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>
            업데이트 {updated ? new Date(updated).toLocaleString('ko-KR') : '로딩 중'}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
          <MetricCard label="USD / KRW" value={rates?.usd ? `${rates.usd.toFixed(2)} 원` : '로딩 중'} icon={<Globe2 size={16} />} />
          <MetricCard label="CNY / KRW" value={rates?.cny ? `${rates.cny.toFixed(2)} 원` : '로딩 중'} icon={<Building2 size={16} />} />
          <MetricCard label="항만 지표" value={port?.waiting != null ? `대기 ${port.waiting} / 접안 ${port.berthed}` : '로딩 중'} icon={<Truck size={16} />} />
          <MetricCard label="물류 혼잡도" value={port?.berthRate != null ? `${port.berthRate}%` : '로딩 중'} icon={<LineChart size={16} />} />
        </div>

        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', marginTop: 14 }}>
          <div style={{ border: '1px solid #d9e2ef', borderRadius: 8, background: '#fff', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 7, background: '#ecfeff', color: '#0891b2', display: 'grid', placeItems: 'center' }}>
                <TrendingUp size={16} />
              </div>
              <strong style={{ color: '#0f172a' }}>원자재 스냅샷</strong>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                ['알루미늄', metals?.aluminum?.price, metals?.aluminum?.changePct],
                ['구리', metals?.copper?.price, metals?.copper?.changePct],
                ['니켈', metals?.nickel?.price, metals?.nickel?.changePct],
              ].map(([label, price, change]) => (
                <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <span style={{ color: '#334155', fontWeight: 600 }}>{label as string}</span>
                  <span style={{ color: '#0f172a', fontWeight: 800 }}>
                    {price ? `$${Number(price).toLocaleString()}` : '-'}
                    {change != null && Number.isFinite(Number(change)) ? (
                      <span style={{ marginLeft: 8, color: Number(change) >= 0 ? '#16a34a' : '#dc2626', fontSize: 12 }}>
                        {Number(change) >= 0 ? '+' : ''}
                        {Number(change).toFixed(2)}%
                      </span>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ border: '1px solid #d9e2ef', borderRadius: 8, background: '#fff', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 7, background: '#eff6ff', color: '#2563eb', display: 'grid', placeItems: 'center' }}>
                <Truck size={16} />
              </div>
              <strong style={{ color: '#0f172a' }}>항만 상태</strong>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span>대기 선박</span><strong>{port?.waiting ?? '-'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span>접안 선박</span><strong>{port?.berthed ?? '-'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span>혼잡도</span><strong>{port?.berthRate != null ? `${port.berthRate}%` : '-'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span>데모 여부</span><strong>{port?.demo ? 'fallback' : 'live'}</strong></div>
            </div>
          </div>

          <div style={{ border: '1px solid #d9e2ef', borderRadius: 8, background: '#fff', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 7, background: '#f0fdf4', color: '#16a34a', display: 'grid', placeItems: 'center' }}>
                <Database size={16} />
              </div>
              <strong style={{ color: '#0f172a' }}>허브 규모</strong>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span>제품</span><strong>{data?.stats?.products ?? '-'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span>리포트</span><strong>{data?.stats?.reports ?? '-'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span>핵심 카테고리</span><strong>{data?.stats?.topCategories ?? '-'}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><span>업데이트</span><strong>{updated ? '실시간' : '대기 중'}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogExplorer() {
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function run() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('limit', '8');
        params.set('sort', sort);
        if (q.trim()) params.set('q', q.trim());
        if (category) params.set('category', category);
        const res = await fetch(`/api/public/products?${params.toString()}`, { cache: 'no-store' });
        const data = (await res.json()) as CatalogResponse;
        if (!alive) return;
        setItems(data.items ?? []);
        setCategories(data.facets?.categories ?? []);
      } catch {
        if (!alive) return;
        setItems([]);
        setCategories([]);
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => { alive = false; };
  }, [category, q, sort]);

  return (
    <section style={{ padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <SectionTitle
          kicker="Catalog Explorer"
          title="메뉴를 선택하면 API로 다시 그려집니다."
          desc="카테고리와 검색어를 바꾸면 서버 API가 결과와 facet을 다시 내려주고, 메인 페이지는 그 응답으로 즉시 업데이트됩니다."
        />

        <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr)', gap: 16, marginTop: 20, alignItems: 'start' }}>
          <div style={{ border: '1px solid #d9e2ef', borderRadius: 8, background: '#fff', padding: 16, display: 'grid', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>검색어</label>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="제품명, 업체명, 설명" style={{ width: '100%', border: '1px solid #d9e2ef', borderRadius: 8, padding: '10px 12px', font: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>카테고리</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', border: '1px solid #d9e2ef', borderRadius: 8, padding: '10px 12px', font: 'inherit' }}>
                <option value="">전체</option>
                {categories.map((c) => <option key={c.name} value={c.name}>{c.name} ({c.count})</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>정렬</label>
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} style={{ width: '100%', border: '1px solid #d9e2ef', borderRadius: 8, padding: '10px 12px', font: 'inherit' }}>
                <option value="featured">추천순</option>
                <option value="newest">최신순</option>
                <option value="price-asc">가격 낮은순</option>
                <option value="price-desc">가격 높은순</option>
                <option value="rating">평점순</option>
              </select>
            </div>
          </div>

          <div style={{ border: '1px solid #d9e2ef', borderRadius: 8, background: '#fff', padding: 16 }}>
            {loading ? (
              <div style={{ color: '#64748b' }}>불러오는 중...</div>
            ) : items.length === 0 ? (
              <div style={{ color: '#64748b' }}>검색 결과가 없습니다.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                {items.map((item) => (
                  <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                    <div style={{ aspectRatio: '4 / 3', background: '#0f172a', position: 'relative' }}>
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      ) : null}
                    </div>
                    <div style={{ padding: 14 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#0f766e', marginBottom: 6 }}>{item.category}</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', lineHeight: 1.35 }}>{item.name}</div>
                      <div style={{ marginTop: 8, color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const [overviewRes, featuredRes] = await Promise.all([
          fetch('/api/public/overview', { cache: 'no-store' }),
          fetch('/api/public/products?featured=1&sort=featured&limit=8', { cache: 'no-store' }),
        ]);

        if (alive) {
          const ov = (await overviewRes.json()) as Overview;
          setOverview(ov);

          const featuredJson = await featuredRes.json();
          const raw = featuredJson.items ?? [];
          const normalized = raw.map(normalizeProduct);
          setProducts(normalized.slice(0, 8));
        }
      } catch {
        if (alive) {
          setOverview(null);
          setProducts([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const topCategories = overview?.topCategories ?? [];
  const latestReports = overview?.latestReports ?? [];
  const market = overview?.market;
  const port = overview?.port;
  const sources = overview?.sources ?? [];

  const summaryItems = useMemo(() => ([
    { label: '실시간 환율', value: market?.rates?.usd ? `${market.rates.usd.toFixed(2)} KRW/USD` : '로딩 중' },
    { label: '항만 혼잡도', value: port?.berthRate != null ? `${port.berthRate}%` : '로딩 중' },
    { label: '등록 제품', value: overview?.stats?.products != null ? `${overview.stats.products}` : '로딩 중' },
    { label: '공개 리포트', value: overview?.stats?.reports != null ? `${overview.stats.reports}` : '로딩 중' },
  ]), [market, port, overview]);

  return (
    <main style={{ minHeight: '100vh', background: '#f3f6fb', color: '#111827' }}>
      <Navbar />

      <section style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'grid',
        alignItems: 'end',
        overflow: 'hidden',
        background: '#0f172a',
      }}>
        <Image
          src="/hero-main.png"
          alt="LED Data Hub hero"
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.76 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(2,6,23,.9) 0%, rgba(2,6,23,.72) 45%, rgba(2,6,23,.24) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, padding: '110px 24px 48px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ maxWidth: 760 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,.14)', background: 'rgba(255,255,255,.08)', color: '#dbeafe', fontSize: 12, fontWeight: 800, letterSpacing: 2.1, textTransform: 'uppercase' }}>
                LED Data Hub
              </div>
              <h1 style={{ margin: '18px 0 0', fontSize: 'clamp(42px, 6vw, 84px)', lineHeight: 0.98, color: '#fff', letterSpacing: 0 }}>
                조명 산업의 실제 데이터를
                <br />
                한 곳에 모읍니다.
              </h1>
              <p style={{ margin: '22px 0 0', fontSize: 'clamp(17px, 2vw, 22px)', lineHeight: 1.7, color: 'rgba(255,255,255,.78)', maxWidth: 700 }}>
                환율, 원자재, 항만, HS 코드, 시장 보고서, 제품 서류, 공급사 승인까지.
                공개 데이터와 내부 승인 데이터를 같은 기준으로 연결해 정확하게 보여줍니다.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30 }}>
                <Link href="/app/" style={{ minHeight: 46, padding: '0 18px', borderRadius: 8, background: '#22c55e', color: '#07111f', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                  포털 열기 <ArrowRight size={16} />
                </Link>
                <Link href="/market-report" style={{ minHeight: 46, padding: '0 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,.22)', background: 'rgba(255,255,255,.08)', color: '#fff', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                  시장 보고서
                </Link>
                <Link href="/app/?auth=signup" style={{ minHeight: 46, padding: '0 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,.22)', background: 'rgba(255,255,255,.04)', color: '#fff', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                  업체 가입
                </Link>
              </div>
            </div>

            <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
              {HERO_METRICS.map((m) => (
                <div key={m.label} style={{ border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, background: 'rgba(15, 23, 42, .55)', padding: 16, backdropFilter: 'blur(12px)' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.54)', fontWeight: 700, marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 16, color: '#fff', fontWeight: 800, lineHeight: 1.3 }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
              {summaryItems.map((item) => (
                <div key={item.label} style={{ border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, background: 'rgba(255,255,255,.06)', padding: 16 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.54)', fontWeight: 700, marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 18, color: '#fff', fontWeight: 900 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LiveOverviewSection data={overview} />
      <CatalogExplorer />

      <section style={{ padding: '24px 24px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: 16 }}>
          <SectionTitle
            kicker="Public Modules"
            title="들어오자마자 가치가 보이는 정보 구조"
            desc="시장 현황, HS 코드, 시장 보고서, 무역·인증 가이드를 분리해 보여주고, 포털에서는 업체 등록과 제품 등록으로 바로 연결합니다."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
            {MODULES.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.href} href={m.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ border: '1px solid #d9e2ef', borderRadius: 8, background: '#fff', overflow: 'hidden', minHeight: 330 }}>
                    <div style={{ position: 'relative', aspectRatio: '4 / 2.4', background: '#0f172a' }}>
                      <Image src={m.image} alt={m.title} fill style={{ objectFit: 'cover', opacity: 0.82 }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,.14), rgba(15,23,42,.75))' }} />
                      <div style={{ position: 'absolute', left: 16, bottom: 16, width: 42, height: 42, borderRadius: 8, background: 'rgba(255,255,255,.12)', color: '#fff', display: 'grid', placeItems: 'center', backdropFilter: 'blur(8px)' }}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <div style={{ padding: 18 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{m.title}</div>
                      <p style={{ margin: '10px 0 0', color: '#64748b', lineHeight: 1.65, fontSize: 14 }}>
                        {m.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionTitle
            kicker="Lighting Analysis"
            title="조명 품목 통계를 바로 볼 수 있게 만들었습니다."
            desc="실제 제품 데이터의 카테고리 분포를 기준으로 인기 품목을 보여주고, 나중에는 검색 로그와 거래량으로 확장할 수 있습니다."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, marginTop: 18 }}>
            {(topCategories.length > 0 ? topCategories : [
              { category: 'smart', count: 0 },
              { category: 'indoor', count: 0 },
              { category: 'industrial', count: 0 },
            ]).map((item, idx, arr) => {
              const max = Math.max(...arr.map((x) => x.count || 1), 1);
              const width = Math.max(8, Math.round(((item.count || 0) / max) * 100));
              return (
                <div key={item.category} style={{ border: '1px solid #d9e2ef', borderRadius: 8, background: '#fff', padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <strong style={{ color: '#0f172a', textTransform: 'capitalize' }}>{item.category}</strong>
                    <span style={{ color: '#0f766e', fontWeight: 900 }}>{item.count}</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ width: `${width}%`, height: '100%', background: idx === 0 ? '#0ea5e9' : idx === 1 ? '#22c55e' : '#f59e0b' }} />
                  </div>
                  <div style={{ marginTop: 10, color: '#64748b', fontSize: 13 }}>
                    현재 허브에서 많이 보이는 품목군
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: 18 }}>
          <SectionTitle
            kicker="Latest Reports"
            title="공개 보고서와 분석 자료"
            desc="리포트, 시장 조사, 무역 해설을 쌓아가며 방문자가 바로 읽을 수 있도록 구성합니다."
            action={<Link href="/market-report" style={{ minHeight: 40, padding: '0 14px', borderRadius: 8, background: '#0f766e', color: '#fff', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>전체 보기 <ArrowRight size={16} /></Link>}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
            {(latestReports.length > 0 ? latestReports : [
              { id: 'fallback-1', title: '시장 보고서가 아직 없습니다.', author: 'LED Data Hub', created_at: new Date().toISOString() },
            ]).map((post) => (
              <div key={post.id} style={{ border: '1px solid #d9e2ef', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
                <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#0f172a' }}>
                  <Image
                    src={post.cover_image || '/hero-main.png'}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover', opacity: 0.9 }}
                  />
                </div>
                <div style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <strong style={{ color: '#0f172a', fontSize: 17, lineHeight: 1.4 }}>{post.title}</strong>
                    {post.is_locked ? <span style={{ color: '#dc2626', fontSize: 12, fontWeight: 800 }}>LOCK</span> : null}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 13, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span>{post.author || 'Research Desk'}</span>
                    <span>·</span>
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('ko-KR') : '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionTitle
            kicker="Featured Catalog"
            title="실제 제품 데이터"
            desc="공개 홈에서도 실제 상품 이미지와 스펙 일부를 보여주고, 클릭하면 제품 페이지로 이어지게 합니다."
          />

          {loading ? (
            <div style={{ color: '#64748b', marginTop: 18 }}>불러오는 중...</div>
          ) : products.length > 0 ? (
            <div className="products-grid" style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
              {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <div style={{ marginTop: 18, padding: 18, border: '1px dashed #cbd5e1', borderRadius: 8, color: '#64748b' }}>
              등록된 제품이 아직 없습니다. 포털에서 제품을 올리면 이 영역이 자동으로 채워집니다.
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: 18 }}>
          <SectionTitle
            kicker="Data Provenance"
            title="데이터 출처와 갱신 상태"
            desc="실제 수집 소스와 갱신 시각을 함께 보여줘야 숫자를 신뢰할 수 있습니다. 자동 수집이 실패하면 fallback 상태를 그대로 노출합니다."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {(sources.length > 0 ? sources : [
              { key: 'none', label: '데이터 없음', status: 'fallback' as const, note: '연결된 소스가 아직 없습니다.' },
            ]).map((source) => (
              <div key={source.key} style={{ border: '1px solid #d9e2ef', borderRadius: 8, background: '#fff', padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                  <strong style={{ color: '#0f172a' }}>{source.label}</strong>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: source.status === 'live' ? '#16a34a' : source.status === 'cached' ? '#0f766e' : '#dc2626',
                    textTransform: 'uppercase',
                  }}>
                    {source.status}
                  </span>
                </div>
                <div style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{source.note}</div>
                {source.updatedAt ? (
                  <div style={{ marginTop: 10, color: '#0f172a', fontSize: 12, fontWeight: 700 }}>
                    {new Date(source.updatedAt).toLocaleString('ko-KR')}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 88px' }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          border: '1px solid #d9e2ef',
          borderRadius: 8,
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 100%)',
          color: '#fff',
          padding: 28,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
        }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ fontSize: 12, letterSpacing: 2.2, textTransform: 'uppercase', color: '#7dd3fc', fontWeight: 800, marginBottom: 10 }}>
              Portal Access
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1 }}>
              로그인하면 업체 등록, 제품 등록, 서류 제출을 바로 할 수 있습니다.
            </h2>
            <p style={{ margin: '14px 0 0', color: 'rgba(255,255,255,.72)', lineHeight: 1.7, fontSize: 16 }}>
              공개 홈은 시장 정보와 리포트, 포털은 승인 워크플로우와 문서 관리를 담당합니다. 두 화면을 분리해 방문자는 가치부터 보고, 실무자는 바로 작업합니다.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 240 }}>
            <Link href="/app/?auth=login" style={{ minHeight: 46, padding: '0 18px', borderRadius: 8, background: '#22c55e', color: '#07111f', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none' }}>
              로그인
            </Link>
            <Link href="/app/?auth=signup" style={{ minHeight: 46, padding: '0 18px', borderRadius: 8, background: 'rgba(255,255,255,.08)', color: '#fff', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,.16)' }}>
              공급사 가입 신청
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
