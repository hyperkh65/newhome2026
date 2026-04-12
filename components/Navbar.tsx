'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useShopStore, useAdminStore } from '@/lib/store';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { useI18n, FLAG_ICONS, Language } from '@/lib/i18n';

const PRODUCT_CATEGORIES = [
  { href: '/shop?cat=smart', labelKey: 'smart', icon: '☁️', descKey: 'desc_smart' },
  { href: '/shop?cat=indoor', labelKey: 'indoor', icon: '🏢', descKey: 'desc_indoor' },
  { href: '/shop?cat=home_lighting', labelKey: 'home_lighting', icon: '🏠', descKey: 'desc_home' },
  { href: '/shop?cat=commercial', labelKey: 'commercial', icon: '🏪', descKey: 'desc_commercial' },
  { href: '/shop?cat=outdoor', labelKey: 'outdoor', icon: '🏭', descKey: 'desc_outdoor' },
  { href: '/shop?cat=industrial', labelKey: 'industrial', icon: '🏗️', descKey: 'desc_industrial' },
  { href: '/shop?cat=landscape', labelKey: 'landscape', icon: '🌉', descKey: 'desc_landscape' },
  { href: '/shop?cat=special', labelKey: 'special', icon: '🔬', descKey: 'desc_special' },
];

const SUPPORT_ITEMS = [
  { href: '/support/faq', label: 'FAQ', icon: '❓', desc: '자주 묻는 질문 모음' },
  { href: '/support/contact', label: '고객문의', icon: '📧', desc: '제품 문의 및 견적 요청' },
  { href: '/support/install-guide', label: '설치가이드', icon: '🎬', desc: '제품 설치 영상 가이드' },
  { href: '/support/as', label: 'A/S 신청', icon: '🔧', desc: '수리 및 교체 접수' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [supportMenuOpen, setSupportMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const productMenuRef = useRef<HTMLDivElement>(null);
  const supportMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = useShopStore((s) => s.cartCount());
  const settings = useSiteSettings();
  const { lang, setLang, t } = useI18n();

  const getMenuLabel = (href: string, defaultLabel: string) => {
    if (href === '/about') return t('company');
    if (href === '/trade-info') return t('trade');
    if (href === '/tracking') return t('logistics');
    if (href === '/board') return t('board');
    if (href === '/blog') return t('blog');
    return settings?.menus.find(m => m.href === href)?.label || defaultLabel;
  };

  const companyName = settings?.company.name || '(주)와이앤케이';

  useEffect(() => {
    const handler = () => { setScrolled(window.scrollY > 40); };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (productMenuRef.current && !productMenuRef.current.contains(e.target as Node)) setProductMenuOpen(false);
      if (supportMenuRef.current && !supportMenuRef.current.contains(e.target as Node)) setSupportMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navItemStyle = (isActive: boolean = false) => ({
    fontSize: 14, fontWeight: 700,
    color: isActive ? 'var(--primary)' : '#ffffff',
    textDecoration: 'none', padding: '10px 18px', borderRadius: '50px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex', alignItems: 'center', gap: 6,
    background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
    border: '1px solid transparent',
  });

  const isSupport = pathname?.startsWith('/support');

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: scrolled ? '12px 0' : '20px 0',
        background: (scrolled || !isHome) ? 'rgba(10, 10, 11, 0.95)' : 'transparent',
        backdropFilter: (scrolled || !isHome) ? 'blur(20px)' : 'none',
        borderBottom: (scrolled || !isHome) ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        boxShadow: (scrolled || !isHome) ? '0 10px 40px rgba(0,0,0,0.5)' : 'none',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              boxShadow: '0 8px 20px rgba(212, 175, 55, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: scrolled ? 'scale(0.92)' : 'scale(1)', transition: 'transform 0.3s',
            }}>
              <span style={{ color: '#fff', fontWeight: 950, fontSize: 16 }}>YnK</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1 }}>
                <span style={{ color: 'var(--primary)' }}>{companyName}</span>
              </span>
              <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginTop: 4 }}>GLOBAL LED TRADING</span>
            </div>
          </Link>

          <div className="desktop-nav" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <Link href="/about" style={navItemStyle()}>{getMenuLabel('/about', '회사소개')}</Link>

            {/* 제품 드롭다운 */}
            <div ref={productMenuRef} style={{ position: 'relative' }}>
              <button onClick={() => { setProductMenuOpen(!productMenuOpen); setSupportMenuOpen(false); }} style={navItemStyle(productMenuOpen)}>
                {getMenuLabel('/shop', '제품소개')}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                  style={{ transform: productMenuOpen ? 'rotate(180deg)' : '0', transition: '0.3s' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {productMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 16px)', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(12, 12, 18, 0.97)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 30px 90px rgba(0,0,0,0.8)', padding: '24px', width: 620, zIndex: 2000,
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link key={cat.href} href={cat.href} onClick={() => setProductMenuOpen(false)}
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: '18px', transition: '0.2s' }}>
                        <div style={{ fontSize: 28, width: 52, height: 52, borderRadius: '14px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cat.icon}</div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', marginBottom: 2 }}>{t(cat.labelKey)}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{t(cat.descKey)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <Link href="/shop" style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', textDecoration: 'none' }}>{t('shop-all')}</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/#market" style={navItemStyle()}>시장현황</Link>
            <Link href="/hscode" style={navItemStyle(pathname==='/hscode')}>HS코드</Link>
            <Link href="/trade-info" style={navItemStyle()}>{t('trade')}</Link>
            <Link href="/tracking" style={navItemStyle()}>{t('logistics')}</Link>
            <Link href="/market-report" style={navItemStyle(pathname==='/market-report')}>시장보고서</Link>
            <Link href="/board" style={navItemStyle()}>{t('board')}</Link>
            <Link href="/blog" style={navItemStyle()}>{t('blog')}</Link>
            <Link href="/catalog" style={navItemStyle(pathname==='/catalog' || pathname.startsWith('/catalog/'))}>📚 카탈로그</Link>

            {/* 고객센터 드롭다운 */}
            <div ref={supportMenuRef} style={{ position: 'relative' }}>
              <button onClick={() => { setSupportMenuOpen(!supportMenuOpen); setProductMenuOpen(false); }}
                style={navItemStyle(supportMenuOpen || isSupport)}>
                고객센터
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                  style={{ transform: supportMenuOpen ? 'rotate(180deg)' : '0', transition: '0.3s' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {supportMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 16px)', right: 0,
                  background: 'rgba(12, 12, 18, 0.97)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 30px 90px rgba(0,0,0,0.8)', padding: '16px', width: 280, zIndex: 2000,
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                }}>
                  {SUPPORT_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setSupportMenuOpen(false)}
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: '14px', transition: '0.2s',
                        background: pathname === item.href ? 'rgba(255,255,255,0.07)' : 'transparent' }}>
                      <div style={{ fontSize: 24, width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', marginBottom: 2 }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setLangMenuOpen(!langMenuOpen)}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', height: 44, padding: '0 12px', borderRadius: '22px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6, transition: '0.3s' }}>
                <span style={{ fontSize: 20 }}>{FLAG_ICONS[lang]}</span>
                <span style={{ fontSize: 12, fontWeight: 800 }}>{lang.toUpperCase()}</span>
              </button>
              {langMenuOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 10, background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 100, minWidth: 140 }}>
                  {(Object.keys(FLAG_ICONS) as Language[]).map((l) => (
                    <button key={l} onClick={() => { setLang(l); setLangMenuOpen(false); }}
                      style={{ width: '100%', padding: '12px 16px', border: 'none', background: lang === l ? 'rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: '0.2s', textAlign: 'left' }}>
                      <span style={{ fontSize: 18 }}>{FLAG_ICONS[l]}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                        {l === 'ko' ? '한국어' : l === 'en' ? 'English' : l === 'zh' ? '中文' : '日本語'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/cart" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', width: 44, height: 44, borderRadius: '50%', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: '0.3s', textDecoration: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 900, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>{cartCount}</span>}
            </Link>

            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff', display: 'none' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-dark)', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/about" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>{t('company')}</Link>
            <Link href="/shop" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>{t('products')}</Link>
            <Link href="/hscode" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>HS코드</Link>
            <Link href="/market" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>시장현황</Link>
            <Link href="/trade-info" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>{t('trade')}</Link>
            <Link href="/tracking" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>{t('logistics')}</Link>
            <Link href="/market-report" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>시장보고서</Link>
            <Link href="/board" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>{t('board')}</Link>
            <Link href="/blog" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>{t('blog')}</Link>
            <Link href="/catalog" onClick={()=>setMenuOpen(false)} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, fontWeight: 700 }}>📚 전자카탈로그</Link>
            <div style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5, textTransform: 'uppercase' }}>고객센터</div>
            {SUPPORT_ITEMS.map(item => (
              <Link key={item.href} href={item.href} onClick={()=>setMenuOpen(false)}
                style={{ padding: '16px', borderRadius: '12px', background: 'rgba(14,165,233,0.05)', color: '#ffffff', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(14,165,233,0.1)' }}>
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <style jsx>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
