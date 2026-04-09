'use client';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Easing } from 'remotion';
import React, { useState, useEffect } from 'react';

/**
 * 전용 로컬 영상 베이스 히로 섹션
 * - 유튜브 로딩 지연 및 저화질 현상을 해결하기 위해 /public/hero-bg.mp4를 직접 사용합니다.
 * - 텍스트의 번짐(blur/bur) 현상을 제거하여 날카로운 가독성을 확보했습니다.
 */

// ─── 타이틀 시퀀스 (Remotion: 텍스트 애니메이션 담당) ─────────────────────
const TitleSequence = () => {
  const frame = useCurrentFrame();

  const phase1 = interpolate(frame, [20, 80],  [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase2 = interpolate(frame, [60, 140], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase3 = interpolate(frame, [100, 190],[0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });

  const scale1 = interpolate(phase1, [0, 1], [1.02, 1], { easing: Easing.out(Easing.quad) });
  const scale2 = interpolate(phase2, [0, 1], [1.02, 1], { easing: Easing.out(Easing.quad) });
  const scale3 = interpolate(phase3, [0, 1], [1.01, 1], { easing: Easing.out(Easing.quad) });
  const translateY = (p: number) => interpolate(p, [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 24px', zIndex: 10, maxWidth: 900 }}>

        {/* 회사 뱃지 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '10px 28px', background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)', borderRadius: 40,
          border: '1px solid rgba(15,23,42,0.1)',
          marginBottom: 44, boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          opacity: phase1, 
          transform: `translateY(${translateY(phase1)}px) scale(${scale1}) translateZ(0)`,
        }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#0284c7', letterSpacing: 2 }}>(주)와이앤케이</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(2,132,199,0.2)' }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#334155', letterSpacing: 1.5 }}>GLOBAL LED TRADE PARTNER</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(46px, 6.8vw, 100px)', fontWeight: 900,
          color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1.15,
          textShadow: '0 4px 12px rgba(0,0,0,0.8)', // 깔끔한 섀도우로 변경 (bur 현상 방지)
          opacity: phase2, 
          transform: `translateY(${translateY(phase2)}px) scale(${scale2}) translateZ(0)`,
          marginBottom: 0,
          WebkitFontSmoothing: 'antialiased',
        }}>
          검증된 제품,<br />
          <span style={{
            background: 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)', // 번짐 없는 선명한 블루
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            fontWeight: 900,
          }}>신뢰할 수 있는 공급</span>
        </h1>

        {/* 서브카피 */}
        <p style={{
          fontSize: 'clamp(18px, 1.7vw, 23px)', color: '#f1f5f9', fontWeight: 600,
          maxWidth: 780, margin: '44px auto 0', lineHeight: 1.8,
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          opacity: phase3, 
          transform: `translateY(${translateY(phase3)}px) scale(${scale3}) translateZ(0)`,
          WebkitFontSmoothing: 'antialiased',
        }}>
          글로벌 제조사로부터 직접 소싱한 KC · CE · RoHS 인증 완료 제품.<br />
          까다로운 검수와 안전한 물류로 귀사의 비즈니스를 지원합니다.
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const LuminaComposition: React.FC = () => (
  <AbsoluteFill style={{ background: 'transparent', overflow: 'hidden' }}>
    <Sequence from={0}><TitleSequence /></Sequence>
  </AbsoluteFill>
);

// ─── 배경 영상 컴포넌트 (로컬 전용) ─────────────────────────────────────────────
function BackgroundVideo() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#020617' }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 1,
          filter: 'contrast(1.1) brightness(0.9)', 
        }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* 텍스트 대비를 위한 미세한 하단 그라데이션만 남김 (화이트워싱 없음) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(2,6,23,0.3) 0%, rgba(2,6,23,0.5) 100%)',
        zIndex: 2,
      }} />
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
      {/* ① 배경 영상 (로컬 소스) */}
      <BackgroundVideo />

      {/* ② 텍스트 엔진 (Remotion Player) */}
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

      {/* ③ 스크롤 유도 UI */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        color: 'white',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 4,
        opacity: 0.6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12
      }}>
        SCROLL
        <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, white, transparent)' }} />
      </div>
    </div>
  );
}
