'use client';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { AnimatedCounter, ScrollReveal } from '@/components/LuminaAnimation';
import RemotionHero from '@/components/RemotionHero';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
  { id: 'smart', labelKey: 'smart', icon: '☁️', descKey: 'desc_smart' },
  { id: 'indoor', labelKey: 'indoor', icon: '🏢', descKey: 'desc_indoor' },
  { id: 'commercial', labelKey: 'commercial', icon: '🏪', descKey: 'desc_commercial' },
  { id: 'outdoor', labelKey: 'outdoor', icon: '🏭', descKey: 'desc_outdoor' },
  { id: 'landscape', labelKey: 'landscape', icon: '🌉', descKey: 'desc_landscape' },
  { id: 'special', labelKey: 'special', icon: '🔬', descKey: 'desc_special' },
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const { t } = useI18n();
  
  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase.from('products').select('*').eq('featured', true).limit(8);
      if (data) setProducts(data);
    }
    fetchFeatured();
  }, []);

  const featured = products;
  const allProducts = products.slice(0, 6);

  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{ 
        position: 'relative', height: '100vh', minHeight: 700, 
        overflow: 'hidden', background: '#0f172a'
      }}>
        {/* Absolute Remotion Hero */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <RemotionHero />
        </div>
        
        {/* Overlay Content removed as it is now integrated into RemotionHero */}


        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 10 }}>
          <span style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Scroll</span>
          <div style={{ width: 1.5, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)', animation: 'float 2s ease-in-out infinite' }} />
        </div>

        {/* 섹션 전환 페이드 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, #ffffff 0%, transparent 100%)', zIndex: 5 }} />
      </section>

      {/* STATS SECTION */}
      <section style={{ padding: '80px 24px', background: 'var(--white)', borderBottom: '1px solid var(--gray-100)', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, textAlign: 'center' }}>
          {[
            { value: 100, suffix: '+', label: t('stat_partners') },
            { value: 98, suffix: '%', label: t('stat_cert') },
            { value: 5000, suffix: '+', label: t('stat_export') },
            { value: 24, suffix: '/7', label: t('stat_tracking') },
          ].map((stat) => (
            <ScrollReveal key={stat.label}>
              <div>
                <div style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8, color: 'var(--primary)' }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 15, color: 'var(--gray-600)', fontWeight: 600 }}>{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section style={{ padding: '120px 24px', background: 'var(--gray-50)' }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p className="section-label" style={{ marginBottom: 16 }}>PRODUCT CATEGORIES</p>
              <h2 className="section-title">{t('home_solutions_title')}</h2>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {CATEGORIES.map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 100}>
                <Link href={`/shop?cat=${cat.id}`} style={{ textDecoration: 'none' }}>
                  <div className="glass-panel" style={{
                    padding: '40px 32px', textAlign: 'center',
                    background: 'var(--white)', border: '1px solid var(--gray-200)',
                    transition: 'all 0.3s ease', cursor: 'pointer', height: '100%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 40px rgba(14,165,233,0.1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)'; }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 20 }}>{cat.icon}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--gray-900)' }}>{t(cat.labelKey)}</div>
                    <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.5 }}>{t(cat.descKey)}</div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: '120px 24px', background: 'var(--white)' }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p className="section-label" style={{ marginBottom: 16 }}>FEATURED</p>
                <h2 className="section-title">{t('featured')}</h2>
              </div>
              <Link href="/shop" className="btn-secondary">{t('viewMore')} →</Link>
            </div>
          </ScrollReveal>
          <div className="products-grid">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* TRADE & COMPLIANCE BANNER */}
      <section style={{ padding: '60px 24px', background: 'var(--gray-50)' }}>
        <div className="container">
          <ScrollReveal>
            <div style={{
              padding: '60px', borderRadius: 32,
              background: 'linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%)',
              color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 40, position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
              
              <div style={{ maxWidth: 640, position: 'relative', zIndex: 2 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary-light)', letterSpacing: 2, marginBottom: 16 }}>COMPLIANCE & LOGISTICS</p>
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: 24, lineHeight: 1.2, whiteSpace: 'pre-line' }}>
                  {t('home_trade_title')}
                </h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 32 }}>
                  {t('home_trade_desc')}
                </p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Link href="/trade-info" className="btn-primary">{t('home_trade_btn1')}</Link>
                  <Link href="/tracking" style={{ color: 'var(--white)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>{t('home_trade_btn2')}</Link>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 300, position: 'relative', zIndex: 2 }}>
                {/* mockup styling for logistics card */}
                <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: 24, borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>SHIPMENT ID</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>TRK-2026-0492</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>STATUS</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399' }}>● IN TRANSIT</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>CURRENT LOCATION</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>Incheon Port, South Korea</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>ETA: 2 Days</div>
                  </div>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
