'use client';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { ScrollReveal } from '@/components/LuminaAnimation';
import { supabase } from '@/lib/supabase';
import { useSiteSettings } from '@/lib/useSiteSettings';

const VIDEOS = ['/hero-bg-4.mp4', '/hero-bg-3.mp4', '/hero-bg-2.mp4', '/hero-bg-1.mp4'];

export default function AboutPage() {
  const [vidIndex, setVidIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [brochureUrl, setBrochureUrl] = useState('');
  const siteSettings = useSiteSettings();
  const c = siteSettings?.company || {
    name: '(주)와이앤케이', address: '인천광역시 미추홀구 경인로112 4층',
    tel: '032-862-1350', fax: '032-863-1351', email: 'sales@ynk2014.com',
    business_id: '131-86-67779', about_text: '글로벌 LED 조명 무역회사',
  };

  // 역순 동영상 로테이션
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => setVidIndex((prev) => (prev + 1) % VIDEOS.length);
    video.addEventListener('ended', onEnded);
    const adjust = () => { video.currentTime = 6; video.play().catch(() => {}); };
    video.addEventListener('loadedmetadata', adjust);
    if (video.readyState >= 1) adjust();
    return () => {
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('loadedmetadata', adjust);
    };
  }, [vidIndex]);

  // 회사소개서 URL 로드
  useEffect(() => {
    supabase.from('site_settings').select('config').eq('category', 'brochure').single()
      .then(({ data }) => { if (data?.config?.url) setBrochureUrl(data.config.url); });
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <Navbar />

      {/* Hero with Video Background */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        {/* 배경 동영상 */}
        <video
          ref={videoRef}
          key={VIDEOS[vidIndex]}
          muted
          playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        >
          <source src={VIDEOS[vidIndex]} type="video/mp4" />
        </video>

        {/* 어두운 오버레이 */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.7) 100%)', zIndex: 1 }} />

        {/* 텍스트 */}
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, color: '#ffffff', marginBottom: 20, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              {c.name}
            </h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.85)', fontWeight: 700, marginBottom: 16, letterSpacing: 1 }}>
              {c.about_text}
            </p>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 700, margin: '0 auto', lineHeight: 1.8 }}>
              {c.name}는 전 세계의 고품질 LED 조명 시스템을 발굴하고,<br />
              국내외 B2B 파트너들에게 안전하고 신속하게 공급하는 빛의 무역 허브입니다.
            </p>
          </div>
        </div>

        {/* 하단 페이드 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, var(--white), transparent)', zIndex: 3 }} />
      </section>

      {/* Info Cards */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>

            <ScrollReveal delay={100}>
              <div style={{ background: 'var(--gray-50)', padding: 40, borderRadius: 24, border: '1px solid var(--gray-200)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 40, marginBottom: 24 }}>🏢</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, color: 'var(--gray-900)' }}>회사 소개</h3>
                <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.7, flex: 1 }}>
                  우리는 단순한 제품 공급을 넘어, 공간의 가치를 높이는 빛을 전달합니다. 수년 간의 글로벌 소싱 경험과 국제 무역 및 인증 노하우를 바탕으로 가장 혁신적이고 안정적인 LED 조명 솔루션을 제안합니다. 스마트 조명부터 산업용 특수 조명까지, {c.name}가 귀사의 든든한 무역 파트너가 되겠습니다.
                </p>
                {/* 회사소개서 다운로드 버튼 */}
                {brochureUrl ? (
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      marginTop: 28, padding: '14px 24px', borderRadius: 12,
                      background: 'var(--primary)', color: '#ffffff',
                      fontWeight: 700, fontSize: 15, textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(14,165,233,0.25)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}
                  >
                    📥 최신 회사소개서 다운받기
                  </a>
                ) : (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    marginTop: 28, padding: '14px 24px', borderRadius: 12,
                    background: '#e5e7eb', color: '#9ca3af',
                    fontWeight: 700, fontSize: 15, cursor: 'not-allowed',
                  }}>
                    📥 회사소개서 준비 중
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div style={{ background: 'var(--gray-50)', padding: 40, borderRadius: 24, border: '1px solid var(--gray-200)', height: '100%' }}>
                <div style={{ fontSize: 40, marginBottom: 24 }}>📍</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, color: 'var(--gray-900)' }}>회사 위치 / 오시는 길</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <li style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--primary)' }}>•</span>
                    <span><strong>주소:</strong> {c.address} {c.name}</span>
                  </li>
                  <li style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--primary)' }}>•</span>
                    <span><strong>지하철:</strong> 제물포역(1호선) 1번 출구 도보 5분 거리</span>
                  </li>
                  <li style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--primary)' }}>•</span>
                    <span><strong>차량/주차:</strong> 본 건물 후면 지정 주차장 이용 및 주변 공영 주차장 이용 가능</span>
                  </li>
                  <li style={{ display: 'flex', gap: 12 }}>
                    <span style={{ color: 'var(--primary)' }}>•</span>
                    <span><strong>운영시간:</strong> 평일 09:00 - 18:00 (주말/공휴일 휴무)</span>
                  </li>
                </ul>

                {/* Google Maps Embed */}
                <div style={{ marginTop: 24, width: '100%', borderRadius: 16, overflow: 'hidden', border: '1px solid #d1d5db', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                  <iframe
                    src="https://maps.google.com/maps?q=인천광역시+미추홀구+경인로112&t=&z=17&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="300"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="와이앤케이 위치"
                  />
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </main>
  );
}
