'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useAdminStore } from '@/lib/store';

const CATS = [
  { id: 'all', label: '전체' },
  { id: 'smart', label: '스마트조명시스템' },
  { id: 'indoor', label: '실내조명' },
  { id: 'commercial', label: '상업조명' },
  { id: 'outdoor', label: '산업/실외조명' },
  { id: 'landscape', label: '경관조명' },
  { id: 'special', label: '특수조명' },
];

const SORTS = [
  { id: 'featured', label: '추천순' },
  { id: 'price-asc', label: '가격 낮은순' },
  { id: 'price-desc', label: '가격 높은순' },
  { id: 'rating', label: '평점순' },
  { id: 'newest', label: '최신순' },
];

export default function ShopContent() {
  const searchParams = useSearchParams();
  const initCat = searchParams.get('cat') || 'all';
  const [cat, setCat] = useState(initCat);
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(500000);
  const products = useAdminStore((s) => s.products);

  useEffect(() => { setCat(searchParams.get('cat') || 'all'); }, [searchParams]);

  const filtered = products
    .filter((p) => (cat === 'all' || p.category === cat) && p.price <= maxPrice && (search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.includes(search)))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  return (
    <main style={{ background: '#f9fafb', minHeight: '100vh', color: '#111827', paddingTop: 64 }}>
      <Navbar />
      <div style={{ padding: '60px 24px 40px', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 13, letterSpacing: 2, fontWeight: 700, color: 'var(--primary)', marginBottom: 12 }}>SHOP LOGISTICS</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>전체 취급 모델 (Global Models)</h1>
          <p style={{ fontSize: 15, color: '#6b7280', fontWeight: 500 }}>현재 {filtered.length}개의 모델이 등록되어 있습니다.</p>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px', display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        <aside style={{ width: 220, flexShrink: 0, position: 'sticky', top: 84 }}>
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 12 }}>모델명 검색</label>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="예: SMPS, 패널..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', background: '#fff' }} />
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
          </div>
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 12 }}>제품 분류</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {CATS.map((c) => (
                <button key={c.id} onClick={() => setCat(c.id)} style={{ background: cat === c.id ? '#e0f2fe' : 'transparent', border: 'none', borderRadius: 8, color: cat === c.id ? '#0369a1' : '#4b5563', padding: '10px 14px', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: cat === c.id ? 700 : 500, fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {c.label} <span style={{ float: 'right', fontSize: 12, color: cat === c.id ? '#0284c7' : '#9ca3af', fontWeight: 600 }}>{c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 12 }}>가격 상한</label>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', marginBottom: 10, fontWeight: 500 }}>
              <span>0원</span><span>{(maxPrice/10000)}만 원</span>
            </div>
            <input type="range" min={0} max={500000} step={10000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>
        </aside>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {SORTS.map((s) => (
              <button key={s.id} onClick={() => setSort(s.id)} style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid', borderColor: sort === s.id ? '#0369a1' : '#d1d5db', background: sort === s.id ? '#e0f2fe' : '#fff', color: sort === s.id ? '#0369a1' : '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>{s.label}</button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
              <p style={{ fontSize: 18, color: '#4b5563', fontWeight: 600 }}>검색 결과가 없습니다</p>
              <button onClick={() => { setCat('all'); setSearch(''); setMaxPrice(500000); }} style={{ marginTop: 24, background: '#fff', border: '1px solid #d1d5db', color: '#374151', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>필터 초기화</button>
            </div>
          ) : (
            <div className="products-grid">{filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          )}
        </div>
      </div>
    </main>
  );
}
