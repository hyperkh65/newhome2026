'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useI18n } from '@/lib/i18n';

type ProductItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  description: string;
  specs: Record<string, string>;
  images: string[];
  image?: string;
  certificates?: string[];
  badge?: string;
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
  created_at: string;
};

type ProductsApiResponse = {
  ok: boolean;
  stats?: { total?: number; filtered?: number; available?: number; featured?: number };
  facets?: { categories?: Array<{ name: string; count: number }> };
  items?: ProductItem[];
  error?: string;
};

const SORTS = [
  { id: 'featured' },
  { id: 'price-asc' },
  { id: 'price-desc' },
  { id: 'rating' },
  { id: 'newest' },
] as const;

export default function ShopContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const initCat = searchParams.get('cat') || '';
  const [cat, setCat] = useState(initCat);
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([]);
  const [total, setTotal] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCat(searchParams.get('cat') || '');
  }, [searchParams]);

  useEffect(() => {
    let alive = true;
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (cat) params.set('category', cat);
        if (search.trim()) params.set('q', search.trim());
        if (sort) params.set('sort', sort);
        if (maxPrice > 0) params.set('priceMax', String(maxPrice));
        params.set('limit', '200');

        const res = await fetch(`/api/public/products?${params.toString()}`, { cache: 'no-store' });
        const data = (await res.json()) as ProductsApiResponse;
        if (!alive) return;

        setProducts(data.items ?? []);
        setCategories(data.facets?.categories ?? []);
        setTotal(data.stats?.total ?? 0);
        setFilteredTotal(data.stats?.filtered ?? data.stats?.total ?? 0);
      } catch {
        if (!alive) return;
        setProducts([]);
        setCategories([]);
        setTotal(0);
        setFilteredTotal(0);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      alive = false;
    };
  }, [cat, search, sort, maxPrice]);

  const filteredCount = useMemo(() => filteredTotal, [filteredTotal]);

  return (
    <main style={{ background: '#f9fafb', minHeight: '100vh', color: '#111827', paddingTop: 64 }}>
      <Navbar />
      <div style={{ padding: '60px 24px 40px', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 13, letterSpacing: 2, fontWeight: 700, color: 'var(--primary)', marginBottom: 12 }}>SHOP LOGISTICS</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>
            {t('allModels')}
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', fontWeight: 500 }}>
            {filteredCount} {t('modelsListed')}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px', display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        <aside style={{ width: 220, flexShrink: 0, position: 'sticky', top: 84 }}>
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 12 }}>{t('searchPlaceholder')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={t('search_hint')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', background: '#fff' }}
              />
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 12 }}>{t('category')}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button
                onClick={() => setCat('')}
                style={{
                  background: cat === '' ? '#e0f2fe' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  color: cat === '' ? '#0369a1' : '#4b5563',
                  padding: '10px 14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: cat === '' ? 700 : 500,
                  fontFamily: 'inherit',
                }}
              >
                {t('all')}
                <span style={{ float: 'right', fontSize: 12, color: cat === '' ? '#0284c7' : '#9ca3af', fontWeight: 600 }}>{total}</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setCat(c.name)}
                  style={{
                    background: cat === c.name ? '#e0f2fe' : 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    color: cat === c.name ? '#0369a1' : '#4b5563',
                    padding: '10px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: cat === c.name ? 700 : 500,
                    fontFamily: 'inherit',
                  }}
                >
                  {c.name}
                  <span style={{ float: 'right', fontSize: 12, color: cat === c.name ? '#0284c7' : '#9ca3af', fontWeight: 600 }}>{c.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 12 }}>{t('price_limit')}</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', marginBottom: 10, fontWeight: 500 }}>
              <span>0{t('won')}</span>
              <span>{maxPrice.toLocaleString('ko-KR')}{t('won')}</span>
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>
        </aside>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: sort === s.id ? '#0369a1' : '#d1d5db',
                  background: sort === s.id ? '#e0f2fe' : '#fff',
                  color: sort === s.id ? '#0369a1' : '#6b7280',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {t(s.id)}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '80px 0', color: '#64748b' }}>불러오는 중...</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
              <p style={{ fontSize: 18, color: '#4b5563', fontWeight: 600 }}>{t('results_none')}</p>
              <button
                onClick={() => {
                  setCat('');
                  setSearch('');
                  setMaxPrice(500000);
                  setSort('featured');
                }}
                style={{
                  marginTop: 24,
                  background: '#fff',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  padding: '10px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                }}
              >
                {t('filter_reset')}
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p, i) => <ProductCard key={p.id} product={p as any} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
