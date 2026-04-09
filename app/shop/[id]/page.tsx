'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAdminStore, useShopStore } from '@/lib/store';
import { ScrollReveal } from '@/components/LuminaAnimation';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const products = useAdminStore((s) => s.products);
  const product = products.find((p) => p.id === id);
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const wishlist = useShopStore((s) => s.wishlist);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const isWished = product ? wishlist.includes(product.id) : false;

  if (!product) return (
    <main style={{ background: '#f9fafb', minHeight: '100vh', color: '#111827', paddingTop: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 64, marginBottom: 20 }}>🔍</p>
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>제품을 찾을 수 없습니다</h1>
        <Link href="/shop" className="btn-primary">쇼핑 계속하기</Link>
      </div>
    </main>
  );

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <main style={{ background: '#f9fafb', minHeight: '100vh', color: '#111827', paddingTop: 64 }}>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#6b7280', fontWeight: 500 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
          <span>›</span>
          <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>취급 모델</Link>
          <span>›</span>
          <Link href={`/shop?cat=${product.category}`} style={{ color: 'inherit', textDecoration: 'none' }}>{product.category}</Link>
          <span>›</span>
          <span style={{ color: '#111827', fontWeight: 700 }}>{product.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'flex-start' }}>
        {/* Image */}
        <ScrollReveal direction="left">
          <div style={{ position: 'sticky', top: 84 }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', background: '#fff', aspectRatio: '1', position: 'relative', border: '1px solid #e5e7eb' }}>
              <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              {product.badge && (
                <div style={{ position: 'absolute', top: 20, left: 20, padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid #e5e7eb', fontSize: 12, fontWeight: 700, letterSpacing: 1, color: '#0369a1' }}>
                  {product.badge}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Info */}
        <ScrollReveal direction="right">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span className="tag" style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600 }}>{product.category}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: '#6b7280' }}>
                <span style={{ color: '#f5c518' }}>★</span>
                <span style={{ fontWeight: 600 }}>{product.rating}</span>
                <span>({product.reviews}개 리뷰)</span>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.2, color: '#111827' }}>
              {product.name}
            </h1>

            <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.8, marginBottom: 32 }}>
              {product.description}
            </p>

            {/* Price */}
            <div style={{ marginBottom: 36, padding: '24px', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              {product.originalPrice && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 16, color: '#9ca3af', textDecoration: 'line-through' }}>{product.originalPrice.toLocaleString()}원</span>
                  {discount && <span style={{ fontSize: 13, fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: 4 }}>-{discount}% B2B 할인가</span>}
                </div>
              )}
              <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: '#111827' }}>{product.price.toLocaleString()}원</div>
              <div style={{ fontSize: 14, color: '#6b7280', marginTop: 8, fontWeight: 600 }}>재고: {product.stock}개</div>
            </div>

            {/* Specs */}
            <div style={{ marginBottom: 36 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#4b5563', marginBottom: 16 }}>스펙</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} style={{ padding: '12px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, fontWeight: 600 }}>{key}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            {product.certificates && product.certificates.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#4b5563', marginBottom: 16 }}>인증서 및 문서</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {product.certificates.map((certUrl, index) => {
                    const certName = certUrl.split('/').pop() || `문서 ${index + 1}`;
                    return (
                      <a key={index} href={certUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', textDecoration: 'none', color: '#111827', transition: 'all 0.2s' }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#f3f4f6'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#fff'; }}>
                        <div style={{ width: 32, height: 32, background: '#e0f2fe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📄</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>{certName}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>문서 조회</div>
                        </div>
                        <div style={{ color: '#9ca3af' }}>↗</div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Qty + Cart */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #d1d5db', borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', color: '#111827', width: 44, height: 48, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ width: 44, textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#111827' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ background: 'none', border: 'none', color: '#111827', width: 44, height: 48, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <button onClick={handleAdd} className={added ? '' : 'btn-primary'} style={{
                flex: 1, padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.3s',
                background: added ? '#ecfdf5' : 'var(--primary)', color: added ? '#059669' : '#fff',
                border: `1px solid ${added ? '#6ee7b7' : 'transparent'}`,
              }}>
                {added ? '✓ 견적 문의함에 추가됨!' : '견적 문의함 담기'}
              </button>
              <button onClick={() => toggleWishlist(product.id)} style={{ width: 52, height: 52, borderRadius: 12, background: '#fff', border: '1px solid #d1d5db', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isWished ? '#ef4444' : '#6b7280', transition: 'all 0.2s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
            <button style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#f9fafb', border: '1px solid #d1d5db', color: '#374151', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f9fafb'; }}>
              바로 문의하기
            </button>
          </div>
        </ScrollReveal>
      </div>

      {/* Related products */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 40, letterSpacing: '-0.02em' }}>함께 보면 좋아요</h2>
          <div className="products-grid">
            {products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3).map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 100}>
                <Link href={`/shop/${p.id}`} style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s', color: '#fff' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; }}>
                  <img src={p.images[0]} alt={p.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{p.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{p.price.toLocaleString()}원</div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
