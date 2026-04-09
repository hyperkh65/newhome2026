'use client';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Easing } from 'remotion';
import React, { useState, useEffect, useRef } from 'react';

/**
 * 배경 영상 목록 — 무역/LED/글로벌 물류 분위기
 * HTML <video> 태그로 직접 재생 (Remotion Video 컴포넌트 X → CORS 이슈 방지)
 */
const VIDEO_CLIPS = [
  'https://assets.mixkit.co/videos/preview/mixkit-night-city-with-traffic-and-illuminated-buildings-33827-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-at-night-4714-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-city-traffic-from-above-at-night-4714-large.mp4',
];

/**
 * 타이틀 시퀀스 — 무역회사 정체성을 담은 카피
 */
const TitleSequence = () => {
  const frame = useCurrentFrame();

  const phase1 = interpolate(frame, [20, 80], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase2 = interpolate(frame, [60, 140], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase3 = interpolate(frame, [100, 190], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });

  const blur1 = interpolate(phase1, [0, 1], [30, 0]);
  const blur2 = interpolate(phase2, [0, 1], [30, 0]);
  const blur3 = interpolate(phase3, [0, 1], [20, 0]);

  const scale1 = interpolate(phase1, [0, 1], [1.08, 1]);
  const scale2 = interpolate(phase2, [0, 1], [1.08, 1]);
  const scale3 = interpolate(phase3, [0, 1], [1.04, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 24px', zIndex: 10, maxWidth: 900 }}>

        {/* 회사 뱃지 */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 24px',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(24px)',
          borderRadius: 40,
          border: '1px solid rgba(255,255,255,0.12)',
          marginBottom: 40,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          opacity: phase1,
          filter: `blur(${blur1}px)`,
          transform: `scale(${scale1})`,
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', letterSpacing: 2 }}>(주)와이앤케이</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', letterSpacing: 1.5 }}>GLOBAL LED TRADE PARTNER</span>
        </div>

        {/* 메인 헤드라인 */}
        <h1 style={{
          fontSize: 'clamp(40px, 5.5vw, 88px)',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.04em',
          lineHeight: 1.18,
          textShadow: '0 16px 48px rgba(0,0,0,0.6)',
          opacity: phase2,
          filter: `blur(${blur2}px)`,
          transform: `scale(${scale2})`,
          marginBottom: 0,
        }}>
          검증된 제품,<br />
          <span style={{
            background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>신뢰할 수 있는 공급</span>
        </h1>

        {/* 서브카피 */}
        <p style={{
          fontSize: 'clamp(15px, 1.4vw, 20px)',
          color: '#94a3b8',
          fontWeight: 400,
          maxWidth: 680,
          margin: '32px auto 0',
          lineHeight: 1.85,
          textShadow: '0 8px 24px rgba(0,0,0,0.5)',
          opacity: phase3,
          filter: `blur(${blur3}px)`,
          transform: `scale(${scale3})`,
        }}>
          글로벌 제조사로부터 직접 소싱한 KC · CE · RoHS 인증 완료 제품.<br />
          까다로운 검수와 안전한 물류로 귀사의 비즈니스를 지원합니다.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Remotion 컴포지션: 텍스트 애니메이션만 담당 (배경은 외부 video 태그)
export const LuminaComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: 'transparent', overflow: 'hidden' }}>
      <Sequence from={0}>
        <TitleSequence />
      </Sequence>
    </AbsoluteFill>
  );
};

// ─── 배경 비디오 컴포넌트 (순수 HTML <video>, 크로스페이드 전환) ───────────────
function BackgroundVideo() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const currentRef = useRef<HTMLVideoElement>(null);
  const nextRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // 20초마다 다음 클립으로 크로스페이드 전환
  useEffect(() => {
    const switchClip = () => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIdx(nextIdx);
        setNextIdx((nextIdx + 1) % VIDEO_CLIPS.length);
        setIsFading(false);
      }, 1500); // 1.5초 전환
    };

    timerRef.current = setTimeout(switchClip, 20000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentIdx, nextIdx]);

  const videoStyle: React.CSSProperties = {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(0.2) contrast(1.1)',
    transition: 'opacity 1.5s ease',
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* 현재 영상 */}
      <video
        ref={currentRef}
        key={`curr-${currentIdx}`}
        src={VIDEO_CLIPS[currentIdx]}
        autoPlay muted loop playsInline
        style={{ ...videoStyle, opacity: isFading ? 0 : 0.45 }}
      />
      {/* 다음 영상 (미리 로드 후 페이드인) */}
      <video
        ref={nextRef}
        key={`next-${nextIdx}`}
        src={VIDEO_CLIPS[nextIdx]}
        autoPlay muted loop playsInline
        style={{ ...videoStyle, opacity: isFading ? 0.45 : 0 }}
      />
      {/* 코퍼레이트 오버레이 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 60% 40%, rgba(2,132,199,0.15) 0%, rgba(6,13,26,0.82) 70%)',
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
    const updateDim = () => setDim({ w: window.innerWidth, h: Math.max(window.innerHeight, 700) });
    updateDim();
    window.addEventListener('resize', updateDim);
    return () => window.removeEventListener('resize', updateDim);
  }, []);

  if (!mounted) return <div style={{ width: '100%', height: '100vh', background: '#060d1a' }} />;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#060d1a' }}>
      {/* ① 배경 영상: 일반 HTML video 태그 (Remotion 외부) */}
      <BackgroundVideo />

      {/* ② 텍스트 애니메이션: Remotion Player (투명 배경) */}
      <Player
        component={LuminaComposition}
        durationInFrames={3600} /* 60초 @ 60fps */
        compositionWidth={dim.w}
        compositionHeight={dim.h}
        fps={60}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          background: 'transparent',
        }}
        autoPlay
        loop
      />

      {/* 하단 페이드 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 180,
        background: 'linear-gradient(to top, rgba(255,255,255,0.75) 0%, transparent 100%)',
        zIndex: 30,
      }} />
    </div>
  );
}
