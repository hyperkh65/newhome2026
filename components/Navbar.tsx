'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useShopStore, useAdminStore } from '@/lib/store';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = useShopStore((s) => s.cartCount());
  const cart = useShopStore((s) => s.cart);
  const removeFromCart = useShopStore((s) => s.removeFromCart);
  const cartTotal = useShopStore((s) => s.cartTotal());
  const isAdmin = useAdminStore((s) => s.isLoggedIn);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

    const categories = [
    { href: '/shop?cat=smart', label: '스마트조명시스템' },
    { href: '/shop?cat=indoor', label: '실내조명' },
    { href: '/shop?cat=outdoor', label: '산업/실외조명' },
    { href: '/shop?cat=special', label: '특수조명' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.03)' : 'none',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 72, gap: 32 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: scrolled ? 'var(--gray-900)' : 'var(--gray-900)' }}>GLOBAL <span style={{ color: 'var(--primary)' }}>TRADE</span></span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: 16, flex: 1, alignItems: 'center' }} className="desktop-nav">
            <Link href="/about" className="nav-link" style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)', textDecoration: 'none', padding: '8px 12px' }}>회사소개</Link>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Link href="/shop" className="nav-link" style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)', textDecoration: 'none', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                제품소개
              </Link>
              <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                {categories.map((c) => (
                  <Link key={c.href} href={c.href} style={{ fontSize: 13, color: 'var(--gray-500)', textDecoration: 'none', padding: '4px 8px', background: 'var(--gray-100)', borderRadius: 6, fontWeight: 500 }}>
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/trade-info" className="nav-link" style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)', textDecoration: 'none', padding: '8px 12px' }}>무역/인증 안내</Link>
            <Link href="/tracking" className="nav-link" style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)', textDecoration: 'none', padding: '8px 12px' }}>물류조회</Link>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            {isAdmin && (
              <Link href="/admin" style={{ textDecoration: 'none' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', letterSpacing: 1, padding: '6px 12px', background: 'rgba(14,165,233,0.1)', borderRadius: 6 }}>ADMIN</span>
              </Link>
            )}
            
            {/* Quote Request Basket instead of classic cart */}
            <button onClick={() => setCartOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-700)', position: 'relative', display: 'flex', alignItems: 'center', padding: 8 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
              {cartCount > 0 && <span className="badge" style={{ position: 'absolute', top: -2, right: -2, fontSize: 10, background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: 10, fontWeight: 700 }}>{cartCount}</span>}
            </button>
            <Link href="/admin/login" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-600)', display: 'flex', alignItems: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Quote Drawer */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000 }}>
          <div onClick={() => setCartOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 440, maxWidth: '100vw',
            background: '#ffffff', borderLeft: '1px solid var(--gray-200)',
            display: 'flex', flexDirection: 'column', animation: 'slideInLeft 0.3s ease',
            boxShadow: '-10px 0 40px rgba(0,0,0,0.1)'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>견적 문의함 {cartCount > 0 && <span style={{ color: 'var(--gray-500)', fontSize: 15, fontWeight: 500 }}>({cartCount}건)</span>}</h2>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer', fontSize: 24 }}>×</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-400)' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                  <p style={{ fontSize: 15, fontWeight: 500 }}>담겨있는 제품이 없습니다</p>
                  <p style={{ fontSize: 13, marginTop: 8 }}>견적이 필요한 제품을 담아주세요.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {cart.map((item) => (
                    <div key={item.product.id} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16, background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-200)' }}>
                      <img src={item.product.images[0]} alt={item.product.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--gray-200)' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: 'var(--gray-900)' }}>{item.product.name}</p>
                        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>요청 수량: {item.quantity}개</p>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', fontSize: 20 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: 24, borderTop: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '16px' }}>종합 견적 문의하기</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 1024px) { .desktop-nav { display: none !important; } }
      `}</style>
    </>
  );
}
