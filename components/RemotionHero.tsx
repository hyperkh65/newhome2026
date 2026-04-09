'use client';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Easing } from 'remotion';
import React, { useState, useEffect } from 'react';

/**
 * 배경 영상 전략:
 * 1순위: /public/hero-bg.mp4 (직접 업로드한 파일이 있으면 사용)
 * 2순위: YouTube iframe embed (항상 작동, CORS 없음)
 *
 * YouTube 영상 변경 방법: YOUTUBE_VIDEO_ID 상수를 바꾸면 됩니다.
 * 추천 검색어: "4K night city timelapse free" YouTube → 영상 ID 복사
 */
const YOUTUBE_CLIPS = [
  'mdbn70EMxH0', // Clip 1: Cityscape At Night ( 전문가급 고화질 야경)
  'vqlOpSQWk5Y', // Clip 2: Aerial View Of Cityscape (드론 항공 촬영)
  'weT2sgFARPg', // Clip 3: Night Traffic (역동적인 도시 도로)
];
const LOCAL_VIDEO_PATH = '/hero-bg.mp4';  // /public/hero-bg.mp4 파일 넣으면 자동 우선 적용

// ─── 타이틀 시퀀스 (Remotion: 텍스트 애니메이션만 담당) ─────────────────────
const TitleSequence = () => {
  const frame = useCurrentFrame();

  // 1단계: 0-1200프레임 (0-20초), 2단계: 1200-2400프레임 (20-40초), 3단계...
  // 텍스트는 계속 유지되거나 서서히 페이드 됨. 여기서는 초기 진입 애니메이션 위주.
  const phase1 = interpolate(frame, [20, 80],  [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase2 = interpolate(frame, [60, 140], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase3 = interpolate(frame, [100, 190],[0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });

  const blur1  = interpolate(phase1, [0, 1], [28, 0]);
  const blur2  = interpolate(phase2, [0, 1], [28, 0]);
  const blur3  = interpolate(phase3, [0, 1], [18, 0]);
  const scale1 = interpolate(phase1, [0, 1], [1.07, 1]);
  const scale2 = interpolate(phase2, [0, 1], [1.07, 1]);
  const scale3 = interpolate(phase3, [0, 1], [1.03, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 24px', zIndex: 10, maxWidth: 900 }}>

        {/* 회사 뱃지 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '8px 24px', background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px)', borderRadius: 40,
          border: '1px solid rgba(255,255,255,0.13)',
          marginBottom: 40, boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          opacity: phase1, filter: `blur(${blur1}px)`, transform: `scale(${scale1})`,
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', letterSpacing: 2 }}>(주)와이앤케이</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', letterSpacing: 1.5 }}>GLOBAL LED TRADE PARTNER</span>
        </div>

        {/* 메인 헤드라인 */}
        <h1 style={{
          fontSize: 'clamp(40px, 5.5vw, 88px)', fontWeight: 900,
          color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1.18,
          textShadow: '0 16px 48px rgba(0,0,0,0.6)',
          opacity: phase2, filter: `blur(${blur2}px)`, transform: `scale(${scale2})`,
          marginBottom: 0,
        }}>
          검증된 제품,<br />
          <span style={{
            background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>신뢰할 수 있는 공급</span>
        </h1>

        {/* 서브카피 */}
        <p style={{
          fontSize: 'clamp(15px, 1.4vw, 20px)', color: '#94a3b8', fontWeight: 400,
          maxWidth: 680, margin: '32px auto 0', lineHeight: 1.85,
          textShadow: '0 8px 24px rgba(0,0,0,0.5)',
          opacity: phase3, filter: `blur(${blur3}px)`, transform: `scale(${scale3})`,
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

// ─── 배경 영상 컴포넌트 ─────────────────────────────────────────────────────────
function BackgroundVideo() {
  const [useLocal, setUseLocal] = useState(true); // 로컬 파일 시도 후 실패 시 YouTube로
  const [clipIndex, setClipIndex] = useState(0);
  const [fadeout, setFadeout] = useState(false);

  // 20초마다 클립 전환 (전환 1.2초 전부터 페이드 시작하여 부드러운 교체)
  useEffect(() => {
    const timer = setInterval(() => {
      setFadeout(true);
      setTimeout(() => {
        setClipIndex((prev) => (prev + 1) % YOUTUBE_CLIPS.length);
        setFadeout(false);
      }, 1200); 
    }, 20000); 
    return () => clearInterval(timer);
  }, []);

  const handleVideoError = () => setUseLocal(false);

  const currentYoutubeId = YOUTUBE_CLIPS[clipIndex];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#060d1a' }}>
      {/* 영상 유닛 (로컬/유튜브 공용) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: fadeout ? 0 : 0.45,
        transition: 'opacity 1s ease-in-out',
        zIndex: 1,
      }}>
        {useLocal ? (
          <video
            autoPlay muted loop playsInline
            onError={handleVideoError}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(0.1) contrast(1.1)',
            }}
          >
            <source src={LOCAL_VIDEO_PATH} type="video/mp4" />
          </video>
        ) : (
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'max(100%, 177.78vh)',
            height: 'max(100%, 56.25vw)',
            filter: 'grayscale(0.15) contrast(1.1)',
            pointerEvents: 'none',
          }}>
            <iframe
              key={currentYoutubeId}
              src={`https://www.youtube.com/embed/${currentYoutubeId}?autoplay=1&mute=1&loop=1&playlist=${currentYoutubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&bg=060d1a`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; encrypted-media"
              title="background video"
            />
          </div>
        )}
      </div>

      {/* 코퍼레이트 오버레이 (영상 위에 덮어씌움) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 60% 40%, rgba(2,132,199,0.12) 0%, rgba(6,13,26,0.88) 75%)',
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
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!mounted) return <div style={{ width: '100%', height: '100vh', background: '#060d1a' }} />;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#060d1a' }}>
      {/* ① 배경 영상 */}
      <BackgroundVideo />

      {/* ② 텍스트 애니메이션 (Remotion, 투명 배경) */}
      <Player
        component={LuminaComposition}
        durationInFrames={3600}
        compositionWidth={dim.w}
        compositionHeight={dim.h}
        fps={60}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent' }}
        autoPlay
        loop
      />

      {/* 하단 페이드는 부모(page.tsx)에서 관리하므로 여기서는 제거하거나 아주 살짝만 유지 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
        background: 'linear-gradient(to top, rgba(15,23,42,0.4) 0%, transparent 100%)',
        zIndex: 30,
      }} />
    </div>
  );
}
