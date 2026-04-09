'use client';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Easing } from 'remotion';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/**
 * 프리미엄 시네마틱 히로 섹션 - 4개 영상 로테이션 버전
 * - 20초마다 영상 자동 전환
 * - 텍스트 및 버튼 레이아웃 겹침 문제 완벽 해결 (통합 Flexbox)
 * - 고해상도 시각 디자인 및 반응형 최적화
 */

// ─── 타이틀 시퀀스 (Remotion: 텍스트 & UI 애니메이션 담당) ─────────────────────
const TitleSequence = () => {
  const frame = useCurrentFrame();

  // 애니메이션 페이즈
  const phase1 = interpolate(frame, [10, 60],  [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase2 = interpolate(frame, [40, 100], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase3 = interpolate(frame, [70, 140], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase4 = interpolate(frame, [100, 180],[0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });

  const translateY = (p: number) => interpolate(p, [0, 1], [30, 0]);
  const certifications = ['KC', 'KS', 'EMC', 'HEE', 'ECO-FRIENDLY'];


  return (
    <AbsoluteFill style={{ 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '40px 24px',
    }}>
      {/* 전체 통합 컨테이너 - 이 안의 모든 요소는 수직으로 정렬되어 절대 겹치지 않음 */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
        width: '100%',
        maxWidth: 1200,
        gap: 'clamp(24px, 4vh, 48px)', // 화면 높이에 비례한 유동적인 간격
      }}>

        {/* 1. 상단 브랜딩 & 뱃지 */}
        <div style={{
          opacity: phase1, 
          transform: `translateY(${translateY(phase1)}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            padding: '10px 28px', background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)', borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <span style={{ fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 900, color: '#38bdf8', letterSpacing: 2.5 }}>YnK</span>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 'clamp(10px, 1vw, 12px)', fontWeight: 700, color: '#38bdf8', letterSpacing: 1.5 }}>(주)와이앤케이</span>

          </div>
        </div>

        {/* 2. 메가 타이틀 (겹침 방지를 위한 마진 최적화) */}
        <div style={{ 
          opacity: phase2, 
          transform: `translateY(${translateY(phase2)}px)`,
        }}>
          <h1 style={{
            fontSize: 'clamp(34px, 7vw, 100px)', fontWeight: 950,
            color: '#ffffff', letterSpacing: '-0.05em', lineHeight: 1.05,
            textShadow: '0 15px 45px rgba(0,0,0,0.6)',
            marginBottom: 0,
            WebkitFontSmoothing: 'antialiased',
          }}>
            검증된 제품,<br />
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              fontWeight: 950,
              // 블러 현상 방지를 위해 filter: drop-shadow 대신 text-shadow 사용 고려 또는 최소화
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}>신뢰할 수 있는 공급</span>
          </h1>
        </div>

        {/* 3. 인증 배지 & 서브 텍스트 그룹 */}
        <div style={{
          opacity: phase3,
          transform: `translateY(${translateY(phase3)}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {certifications.map(cert => (
              <div key={cert} style={{
                padding: '8px 20px', background: 'rgba(255,255,255,0.1)',
                borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff', fontSize: 13, fontWeight: 800, letterSpacing: 1,
                backdropFilter: 'blur(10px)'
              }}>
                {cert}
              </div>
            ))}
            <div style={{
              padding: '8px 20px', background: 'rgba(3,105,161,0.25)',
              borderRadius: 12, border: '1px solid rgba(14,165,233,0.4)',
              color: '#7dd3fc', fontSize: 13, fontWeight: 800
            }}>
              글로벌 인증 제품
            </div>

          </div>

          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 24px)', color: 'rgba(255,255,255,0.85)', fontWeight: 500,
            maxWidth: 800, lineHeight: 1.6, margin: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            WebkitFontSmoothing: 'antialiased',
          }}>
            글로벌 제조사로부터 직접 소싱한 프리미엄 라인업.<br />
            까다로운 검수와 안전한 물류로 귀사의 비즈니스를 지원합니다.
          </p>
        </div>

        {/* 4. 액션 버튼 (통합 레이아웃 내부에 배치하여 절대 겹치지 않음) */}
        <div style={{
          opacity: phase4,
          transform: `translateY(${translateY(phase4)}px)`,
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: 8,
          pointerEvents: 'auto' // 클릭 가능하도록 설정
        }}>
          <a href="/shop" style={{
            padding: 'clamp(14px, 2vh, 20px) 40px',
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            color: '#ffffff',
            borderRadius: '50px',
            fontSize: 16,
            fontWeight: 800,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 15px 35px rgba(2,132,199,0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            제품 및 인증서 보기
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="/trade-info" style={{
            padding: 'clamp(14px, 2vh, 20px) 40px',
            background: 'rgba(255,255,255,0.06)',
            color: '#ffffff',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)',
            fontSize: 16,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.3s'
          }}>
            무역 절차 안내
          </a>
        </div>

      </div>
      
      {/* 5. 스크롤 유도 UI (독립적인 하단 브랜딩) */}
      <div style={{
        position: 'absolute',
        bottom: 20, // 위치를 조금 더 하단으로 조정하여 겹침 방지
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: 4,
        opacity: phase4 * 0.4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        pointerEvents: 'none',
        zIndex: 5
      }}>
        SCROLL
        <div style={{ width: 1.2, height: 36, background: 'linear-gradient(180deg, white, transparent)' }} />
      </div>

    </AbsoluteFill>
  );
};

export const LuminaComposition: React.FC = () => (
  <AbsoluteFill style={{ background: 'transparent', overflow: 'hidden' }}>
    <Sequence from={0}><TitleSequence /></Sequence>
  </AbsoluteFill>
);

// ─── 배경 영상 컴포넌트 (4개 로테이션 & 6초 컷) ───────────────────────
function BackgroundVideo() {
  const videoPaths = ['/hero-bg-1.mp4', '/hero-bg-2.mp4', '/hero-bg-3.mp4', '/hero-bg-4.mp4'];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % videoPaths.length);
        setFade(true);
      }, 1000);
    }, 20000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const adjust = () => { video.currentTime = 6; video.play().catch(() => {}); };
    video.addEventListener('loadedmetadata', adjust);
    if (video.readyState >= 1) adjust();
    return () => video.removeEventListener('loadedmetadata', adjust);
  }, [index]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#020617' }}>
      <video
        ref={videoRef}
        key={videoPaths[index]}
        autoPlay muted loop playsInline
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          opacity: fade ? 1 : 0, transition: 'opacity 1s ease-in-out',
          filter: 'contrast(1.08) brightness(0.7) saturate(1.1)', 
        }}
      >
        <source src={videoPaths[index]} type="video/mp4" />
      </video>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 30%, rgba(2,6,23,0.7) 100%)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,6,23,0.3) 0%, transparent 20%, transparent 80%, rgba(2,6,23,0.5) 100%)', zIndex: 1, pointerEvents: 'none' }} />
    </div>
  );
}

// ─── 메인 Export ────────────────────────────────────────────────────────────────
export default function RemotionHero() {
  const [dim, setDim] = useState({ w: 1920, h: 1080 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setDim({ w: window.innerWidth, h: Math.max(window.innerHeight, 700) });
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!mounted) return <div style={{ width: '100%', height: '100vh', background: '#020617' }} />;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#020617' }}>
      <BackgroundVideo />
      <Player
        component={LuminaComposition}
        durationInFrames={3600}
        compositionWidth={dim.w}
        compositionHeight={dim.h}
        fps={60}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', zIndex: 10 }}
        autoPlay
        loop
      />
    </div>
  );
}
