import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type ProductRow = {
  id: string | number;
  name?: string | null;
  category?: string | null;
  price?: number | string | null;
  original_price?: number | string | null;
  description?: string | null;
  specs?: Record<string, string> | null;
  images?: string[] | null;
  image?: string | null;
  certificates?: string[] | null;
  badge?: string | null;
  stock?: number | string | null;
  rating?: number | string | null;
  reviews?: number | string | null;
  featured?: boolean | null;
  created_at?: string | null;
};

function toNumber(v: unknown): number {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function asText(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function dateTs(value: string): number {
  const ts = new Date(value).getTime();
  return Number.isFinite(ts) ? ts : 0;
}

function normalize(row: ProductRow) {
  const images = Array.isArray(row.images) ? row.images : [];
  return {
    id: String(row.id),
    name: asText(row.name) || '무제',
    category: asText(row.category) || '기타',
    price: toNumber(row.price),
    original_price: toNumber(row.original_price),
    description: asText(row.description) || '설명이 없습니다.',
    specs: row.specs || {},
    images,
    image: asText(row.image) || images[0] || '',
    certificates: Array.isArray(row.certificates) ? row.certificates : [],
    badge: asText(row.badge) || '',
    stock: toNumber(row.stock),
    rating: toNumber(row.rating),
    reviews: toNumber(row.reviews),
    featured: Boolean(row.featured),
    created_at: asText(row.created_at),
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const category = (url.searchParams.get('category') || '').trim();
    const sort = (url.searchParams.get('sort') || 'featured').trim();
    const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit') || 8)));
    const featuredOnly = url.searchParams.get('featured') === '1';
    const priceMax = Number(url.searchParams.get('priceMax') || 0);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const items = (data ?? []).map(normalize);

    const filtered = items.filter((item) => {
      if (featuredOnly && !item.featured) return false;
      if (category && item.category !== category) return false;
      if (priceMax > 0 && item.price > priceMax) return false;
      if (q) {
        const hay = [item.name, item.category, item.description, item.badge, item.created_at, ...(item.certificates ?? [])]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sorter = {
      featured: (a: ReturnType<typeof normalize>, b: ReturnType<typeof normalize>) =>
        Number(b.featured) - Number(a.featured) || dateTs(b.created_at) - dateTs(a.created_at),
      'price-asc': (a: ReturnType<typeof normalize>, b: ReturnType<typeof normalize>) => a.price - b.price,
      'price-desc': (a: ReturnType<typeof normalize>, b: ReturnType<typeof normalize>) => b.price - a.price,
      rating: (a: ReturnType<typeof normalize>, b: ReturnType<typeof normalize>) => b.rating - a.rating || b.reviews - a.reviews,
      newest: (a: ReturnType<typeof normalize>, b: ReturnType<typeof normalize>) =>
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime(),
    } as const;

    filtered.sort(sorter[sort as keyof typeof sorter] || sorter.featured);

    const categories = new Map<string, number>();
    for (const item of items) {
      const key = item.category || '기타';
      categories.set(key, (categories.get(key) ?? 0) + 1);
    }

    const facets = {
      categories: [...categories.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    };

    return NextResponse.json({
      ok: true,
      query: { q, category, sort, limit, featuredOnly, priceMax },
      stats: {
        total: items.length,
        filtered: filtered.length,
        available: items.length,
        featured: items.filter((item) => item.featured).length,
      },
      facets,
      items: filtered.slice(0, limit),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
