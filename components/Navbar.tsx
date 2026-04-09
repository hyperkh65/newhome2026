'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useShopStore, useAdminStore } from '@/lib/store';

const PRODUCT_CATEGORIES = [
  { href: '/shop?cat=smart', label: '스마트조명시스템', icon: '☁️', desc: 'IoT 기반 무선 자동제어' },
  { href: '/shop?cat=indoor', label: '실내조명', icon: '🏢', desc: '사무·상업용 고효율 LED' },
  { href: '/shop?cat=commercial', label: '상업조명', icon: '🏪', desc: '쇼핑몰·매장 프리미엄 라인' },
  { href: '/shop?cat=outdoor', label: '산업/실외조명', icon: '🏭', desc: '공장등·가로등 내구성 특화' },
  { href: '/shop?cat=landscape', label: '경관조명', icon: '🌉', desc: '건축물·랜드마크 특화' },
  { href: '/shop?cat=special', label: '특수조명', icon: '🔬', desc: '의료·클린룸·방폭·살균' },
];

const EXTRA_LINKS = [
  { href: '/board', label: '제품 게시판' },
  { href: '/blog', label: '블로그' },
];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const productMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = useShopStore((s) => s.cartCount());
  const cart = useShopStore((s) => s.cart);
  const removeFromCart = useShopStore((s) => s.removeFromCart);
  const isAdmin = useAdminStore((s) => s.isLoggedIn);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (productMenuRef.current && !productMenuRef.current.contains(e.target as Node)) {
        setProductMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navItemStyle = (isActive: boolean = false) => ({
    fontSize: 14,
    fontWeight: 700,
    color: scrolled ? (isActive ? '#0284c7' : '#334155') : '#ffffff',
    textDecoration: 'none',
    padding: '10px 18px',
    borderRadius: '50px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: isActive ? (scrolled ? 'rgba(2, 132, 199, 0.08)' : 'rgba(255, 255, 255, 0.15)') : 'transparent',
    border: isActive ? (scrolled ? '1px solid rgba(2, 132, 199, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)') : '1px solid transparent',
  });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
        boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo Section */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: scrolled ? 'scale(0.92)' : 'scale(1)',
              transition: 'transform 0.3s'
            }}>
              <span style={{ color: '#fff', fontWeight: 950, fontSize: 16 }}>YnK</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ 
                fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', 
                color: scrolled ? '#0f172a' : '#ffffff',
                lineHeight: 1
              }}>
                <span style={{ color: scrolled ? '#0284c7' : '#38bdf8' }}>(주)와이앤케이</span>
              </span>

              <span style={{ fontSize: 9, fontWeight: 800, color: scrolled ? '#64748b' : 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginTop: 4 }}>GLOBAL LED TRADING</span>
            </div>
          </Link>

          {/* Desktop Navigation Pill */}
          <div className="desktop-nav" style={{ 
            display: 'flex', alignItems: 'center', gap: 6, 
            background: scrolled ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
            padding: '6px', borderRadius: '50px',
            border: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.1)',
          }}>
            <Link href="/about" style={navItemStyle()} onMouseEnter={e => { (e.currentTarget as any).style.background = scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'; }}>회사소개</Link>
            
            <div ref={productMenuRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setProductMenuOpen(!productMenuOpen)}
                style={navItemStyle(productMenuOpen)}
                onMouseEnter={e => { if(!productMenuOpen) (e.currentTarget as any).style.background = scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'; }}
              >
                제품소개
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: productMenuOpen ? 'rotate(180deg)' : '0', transition: '0.3s' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {/* Mega Dropdown */}
              {productMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 16px)', left: '50%', transform: 'translateX(-50%)',
                  background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0',
                  boxShadow: '0 30px 90px rgba(0,0,0,0.15)', padding: '24px', width: 560, zIndex: 2000,
                  animation: 'dropdownIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link key={cat.href} href={cat.href} onClick={() => setProductMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: '18px', transition: '0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as any).style.background = '#f8fafc'; (e.currentTarget as any).style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { (e.currentTarget as any).style.background = 'transparent'; (e.currentTarget as any).style.transform = 'none'; }}
                      >
                        <div style={{ fontSize: 28, width: 52, height: 52, borderRadius: '14px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cat.icon}</div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{cat.label}</div>
                          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{cat.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <Link href="/shop" style={{ fontSize: 14, fontWeight: 800, color: '#0284c7', textDecoration: 'none' }}>전체 라인업 카탈로그 보기 →</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/trade-info" style={navItemStyle()} onMouseEnter={e => { (e.currentTarget as any).style.background = scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'; }}>무역/인증</Link>
            <Link href="/tracking" style={navItemStyle()} onMouseEnter={e => { (e.currentTarget as any).style.background = scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'; }}>물류조회</Link>
            
            {EXTRA_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={navItemStyle()} onMouseEnter={e => { (e.currentTarget as any).style.background = scrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'; }}>
                {link.label}
              </Link>
            ))}

          </div>

          {/* Icon Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setCartOpen(true)} style={{ 
              background: scrolled ? '#f1f5f9' : 'rgba(255,255,255,0.1)', 
              border: 'none', cursor: 'pointer', width: 44, height: 44, borderRadius: '50%',
              color: scrolled ? '#334155' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: '0.3s'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
              {cartCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 900, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>{cartCount}</span>}
            </button>
            
            <Link href="/admin/login" style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: scrolled ? '#0f172a' : '#ffffff', 
                color: scrolled ? '#ffffff' : '#0f172a',
                padding: '10px 22px', borderRadius: '50px', fontSize: 14, fontWeight: 800, transition: '0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                B2B 로그인
              </div>
            </Link>

            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: scrolled ? '#0f172a' : '#ffffff', display: 'none' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#ffffff', padding: '24px', borderTop: '1px solid #f1f5f9', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 10 }}>
             <Link href="/about" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', color: '#0f172a', textDecoration: 'none', fontWeight: 700 }}>회사소개</Link>
             <Link href="/shop" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', color: '#0f172a', textDecoration: 'none', fontWeight: 700 }}>제품소개</Link>
             <Link href="/trade-info" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', color: '#0f172a', textDecoration: 'none', fontWeight: 700 }}>무역/인증 안내</Link>
             <Link href="/tracking" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', color: '#0f172a', textDecoration: 'none', fontWeight: 700 }}>물류조회</Link>
             <Link href="/board" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', color: '#0f172a', textDecoration: 'none', fontWeight: 700 }}>제품 게시판</Link>
             <Link href="/blog" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', color: '#0f172a', textDecoration: 'none', fontWeight: 700 }}>블로그</Link>

          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
