'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { AnimatedCounter, ScrollReveal } from '@/components/LuminaAnimation';
import { useAdminStore } from '@/lib/store';

const CATEGORIES = [
  { id: 'smart', label: '스마트조명시스템', icon: '☁️', desc: 'IoT 기반 무선 자동제어 솔루션' },
  { id: 'indoor', label: '실내조명', icon: '🏢', desc: '고효율 사무/상업용 LED 평판조명' },
  { id: 'outdoor', label: '산업/실외조명', icon: '🏭', desc: '공장등, 가로등 등 내구성 특화' },
  { id: 'special', label: '특수조명', icon: '🔬', desc: '의료/클린룸 방폭 살균등' },
];

export default function Home() {
  const products = useAdminStore((s) => s.products);
  const featured = products.filter((p) => p.featured).slice(0, 3);
  const allProducts = products.slice(0, 6);

  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{ 
        position: 'relative', height: '100vh', minHeight: 700, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)'
      }}>
        {/* Background Decorative Elements */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '0%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 900 }}>
          <div style={{ animation: 'fadeInUp 0.8s ease forwards' }}>
            <span style={{ 
              display: 'inline-block', padding: '6px 16px', borderRadius: 20, 
              background: 'rgba(14,165,233,0.1)', color: 'var(--primary-dark)',
              fontSize: 14, fontWeight: 700, marginBottom: 24, letterSpacing: 1
            }}>
              GLOBAL B2B LED TRADING PARTNER
            </span>
            <h1 style={{ 
              fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: 900, 
              lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 24,
              color: 'var(--gray-900)'
            }}>
              전 세계를 밝히는<br />
              <span className="text-gradient">혁신적 LED 조명 솔루션</span>
            </h1>
            <p style={{ 
              fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--gray-600)', 
              lineHeight: 1.6, marginBottom: 48, fontWeight: 500
            }}>
              글로벌 공급망을 통한 고품질 LED 조명, 빠르고 안전한 무역 및 물류망.<br />
              필요한 모든 인증서와 물류 추적 시스템을 한번에 제공합니다.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/shop" className="btn-primary" style={{ padding: '16px 36px', fontSize: 18 }}>제품 및 인증서 보기 →</Link>
              <Link href="/trade-info" className="btn-secondary" style={{ padding: '16px 36px', fontSize: 18 }}>무역 절차 안내</Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.6 }}>
          <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700 }}>Scroll</span>
          <div style={{ width: 2, height: 40, background: 'linear-gradient(to bottom, var(--primary), transparent)', animation: 'float 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{ padding: '80px 24px', background: 'var(--white)', borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)', position: 'relative', zIndex: 5, boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, textAlign: 'center' }}>
          {[
            { value: 100, suffix: '+', label: '글로벌 제조 파트너' },
            { value: 98, suffix: '%', label: '글로벌 인증 합격률' },
            { value: 5000, suffix: '+', label: '수출/수입 진행 건수' },
            { value: 24, suffix: '/7', label: '실시간 물류 추적' },
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
              <h2 className="section-title">산업별 맞춤 조명 솔루션</h2>
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
                    <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--gray-900)' }}>{cat.label}</div>
                    <div style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.5 }}>{cat.desc}</div>
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
                <h2 className="section-title">주요 취급 품목</h2>
              </div>
              <Link href="/shop" className="btn-secondary">전체 품목 보기 →</Link>
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
                <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: 24, lineHeight: 1.2 }}>
                  복잡한 무역 인증과 물류,<br />저희가 모두 관리합니다.
                </h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 32 }}>
                  KC, CE, RoHS 등 필수 인증 절차 지원부터 중국-인천항 물류 트래킹까지. B2B 고객사들이 오직 비즈니스에만 집중할 수 있도록 종합 무역 솔루션을 제공합니다.
                </p>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Link href="/trade-info" className="btn-primary">인증 안내서 스터디</Link>
                  <Link href="/tracking" style={{ color: 'var(--white)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>항만/물류 상황 조회 →</Link>
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

      {/* FOOTER */}
      <footer style={{ background: 'var(--white)', borderTop: '1px solid var(--gray-200)', padding: '80px 24px 40px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 60 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>GLOBAL TRADE</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.7 }}>
                글로벌 LED 스탠다드를 주도하는<br />신뢰할 수 있는 무역 파트너
              </p>
            </div>
            {[
              { title: '제품 및 인증 조회', links: ['스마트조명', '실내조명', '산업/실외조명', '특수조명'] },
              { title: '무역 파트너스', links: ['수입/수출 절차 안내', '필수 인증서 정보', '운송/물류 트래킹'] },
              { title: '고객지원', links: ['공지사항', 'B2B 견적 문의', '기업 제휴 안내'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: 'var(--gray-900)' }}>{col.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map((l) => (
                     <a key={l} href="#" style={{ fontSize: 14, color: 'var(--gray-500)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gray-500)'; }}>{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>© 2026 GLOBAL TRADE B2B LED. All rights reserved.</p>
            <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>무역업 등록번호: 123-45-78900 · 대표: 글로벌무역상사</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
