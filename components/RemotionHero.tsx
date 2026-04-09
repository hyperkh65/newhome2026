'use client';
import { Player } from '@remotion/player';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, Sequence, Easing, Video } from 'remotion';
import React, { useState, useEffect } from 'react';

const CinematicVideoLayer = () => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#0f172a' }}>
      {/* 
        A majestic, breathtaking placeholder video representing global infrastructure/lighting.
        (City traffic at night with illuminated buildings - perfectly captures LED impact & scale)
      */}
      <Video 
        src="https://assets.mixkit.co/videos/preview/mixkit-night-city-with-traffic-and-illuminated-buildings-33827-large.mp4"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.35, /* 희미한 처리 (Faint) */
          mixBlendMode: 'screen',
          filter: 'grayscale(0.4) contrast(1.2)'
        }}
        muted
        loop
      />
      {/* Deep blue majestic overlay for corporate trust and blending */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(2,132,199,0.2) 0%, #0f172a 100%)' }} />
    </AbsoluteFill>
  );
};

const TitleSequence = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig(); // default 60fps
  
  // 가슴 벅찬, 아주 느리고 장엄한 시네마틱 페이드인 (Breathtaking, slow cinematic fade)
  const phase1 = interpolate(frame, [30, 90], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase2 = interpolate(frame, [70, 150], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });
  const phase3 = interpolate(frame, [110, 200], [0, 1], { easing: Easing.bezier(0.2, 0.8, 0.4, 1), extrapolateRight: 'clamp' });

  // Blur values (아주 부드럽게 초점이 맞춰지는 효과)
  const blur1 = interpolate(phase1, [0, 1], [40, 0]);
  const blur2 = interpolate(phase2, [0, 1], [40, 0]);
  const blur3 = interpolate(phase3, [0, 1], [30, 0]);

  // 살짝만 앞으로 다가오는 은은한 줌인 (Subtle dramatic depth)
  const scale1 = interpolate(phase1, [0, 1], [1.1, 1]);
  const scale2 = interpolate(phase2, [0, 1], [1.1, 1]);
  const scale3 = interpolate(phase3, [0, 1], [1.05, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 24px', zIndex: 10 }}>
        
        {/* Subtle Corporate Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 12, 
          padding: '8px 24px', 
          background: 'rgba(255,255,255,0.05)', 
          backdropFilter: 'blur(24px)', 
          borderRadius: 40, 
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 36,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          opacity: phase1,
          filter: `blur(${blur1}px)`,
          transform: `scale(${scale1})`
        }}>
           <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', letterSpacing: 2 }}>(주)와이앤케이</span>
           <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#f8fafc' }} />
           <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', letterSpacing: 1 }}>PRECISION ENGINEERING</span>
        </div>

        {/* Breathtaking Typography */}
        <h1 style={{
          fontSize: 'clamp(44px, 5vw, 92px)',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          textShadow: '0 20px 40px rgba(0,0,0,0.5)',
          opacity: phase2,
          filter: `blur(${blur2}px)`,
          transform: `scale(${scale2})`
        }}>
          어둠을 가르고 빛어내는 <br />
          <span style={{ 
            color: '#38bdf8',
            display: 'inline-block',
          }}>위대한 혁신</span>
        </h1>
        
        {/* Minimalist Subtext */}
        <p style={{
          marginTop: 36,
          fontSize: 'clamp(18px, 1.5vw, 24px)',
          color: '#cbd5e1',
          fontWeight: 400,
          maxWidth: 750,
          margin: '36px auto 0',
          lineHeight: 1.8,
          textShadow: '0 10px 20px rgba(0,0,0,0.5)',
          opacity: phase3,
          filter: `blur(${blur3}px)`,
          transform: `scale(${scale3})`
        }}>
          설계부터 완공에 이르기까지 땀과 기술로 이루어낸 인프라.<br className="hidden md:block"/>
          우리는 가장 찬란하고 경이로운 LED의 역사를 쓰고 있습니다.
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const LuminaComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ 
      background: '#0f172a', /* Dark background bridging to cinematic */
      overflow: 'hidden' 
    }}>
      <CinematicVideoLayer />
      <Sequence from={0}>
        <TitleSequence />
      </Sequence>
    </AbsoluteFill>
  );
};

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

  if (!mounted) return <div style={{ width: '100%', height: '100vh', background: '#0f172a' }} />;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Player
        component={LuminaComposition}
        durationInFrames={1800} /* 30 seconds at 60fps */
        compositionWidth={dim.w}
        compositionHeight={dim.h}
        fps={60}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
        autoPlay
        loop
      />
      {/* Sleek bottom gradient to blend seamlessly into content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 250, background: 'linear-gradient(to top, #ffffff, transparent)', zIndex: 20 }} />
      {/* Top gradient for navbar blending */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to bottom, #ffffff, transparent)', zIndex: 20 }} />
    </div>
  );
}
