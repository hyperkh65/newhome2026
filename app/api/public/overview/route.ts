import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type MarketPayload = {
  success?: boolean;
  timestamp?: string;
  rates?: { usd: number; cny: number; jpy: number };
  metals?: Record<string, { price: number; changePct?: number }>;
  history?: Array<Record<string, unknown>>;
};

type PortPayload = {
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

type SourceItem = {
  key: string;
  label: string;
  status: 'live' | 'cached' | 'fallback';
  updatedAt?: string;
  note: string;
};

function countByCategory(rows: Array<{ category?: string | null }>) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const key = row.category?.trim();
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export async function GET(req: Request) {
  try {
    const base = new URL(req.url);
    const [marketRes, portRes, productsRes, reportsRes] = await Promise.all([
      fetch(new URL('/api/market', base).toString(), { cache: 'no-store' }),
      fetch(new URL('/api/port', base).toString(), { cache: 'no-store' }),
      supabase
        .from('products')
        .select('id,name,category,featured,stock,rating,price,cover_image,created_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('posts')
        .select('id,title,author,created_at,cover_image,is_locked,type')
        .eq('type', 'report')
        .order('created_at', { ascending: false })
        .limit(6),
    ]);

    const market = (await marketRes.json()) as MarketPayload;
    const port = (await portRes.json()) as PortPayload;
    const products = productsRes.data ?? [];
    const reports = reportsRes.data ?? [];

    const featuredProducts = products.filter((p: { featured?: boolean }) => p.featured).slice(0, 8);
    const fallbackProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);
    const topCategories = countByCategory(products);
    const marketUpdatedAt = market.timestamp;
    const portUpdatedAt = port.updatedAt;

    const sources: SourceItem[] = [
      {
        key: 'fx',
        label: '환율',
        status: market.success ? 'live' : 'fallback',
        updatedAt: marketUpdatedAt,
        note: 'manana.kr 실시간 환율',
      },
      {
        key: 'metals',
        label: '원자재',
        status: market.metals && Object.keys(market.metals).length > 0 ? 'live' : 'fallback',
        updatedAt: marketUpdatedAt,
        note: 'Stooq 시세 수집',
      },
      {
        key: 'port',
        label: '항만',
        status: port.demo ? 'fallback' : 'live',
        updatedAt: portUpdatedAt,
        note: 'Unipass 항만 목록',
      },
      {
        key: 'products',
        label: '제품 카탈로그',
        status: products.length > 0 ? 'cached' : 'fallback',
        note: 'Supabase products',
      },
      {
        key: 'reports',
        label: '시장 보고서',
        status: reports.length > 0 ? 'cached' : 'fallback',
        note: 'Supabase posts(type=report)',
      },
    ];

    return NextResponse.json({
      ok: true,
      updatedAt: new Date().toISOString(),
      market,
      port,
      stats: {
        products: products.length,
        featuredProducts: featuredProducts.length,
        reports: reports.length,
        topCategories: topCategories.length,
      },
      topCategories,
      latestReports: reports,
      products: fallbackProducts,
      sources,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
