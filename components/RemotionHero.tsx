'use client';
import { Player } from '@remotion/player';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, spring, interpolate, Sequence, Img } from 'remotion';
import React from 'react';

const ParticleLayer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Make particles drift and glow (light theme, blue particles)
  const particles = Array.from({ length: 40 }).map((_, i) => {
    const startOffset = i * 15;
    const progress = Math.max(0, frame - startOffset) / fps;
    const y = interpolate(progress, [0, 5], [110, -20], { extrapolateRight: 'clamp' });
    const x = interpolate(progress, [0, 5], [(i * 137) % 100, ((i * 137) % 100) + (i % 2 === 0 ? 5 : -5)], { extrapolateRight: 'clamp' });
    const opacity = interpolate(Math.sin(progress * 2 + i), [-1, 1], [0.1, 0.4]);
    const scale = interpolate(progress, [0, 5], [0.5, 1.5], { extrapolateRight: 'clamp' });
    
    return (
      <div key={i} style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: 8 + (i % 8),
        height: 8 + (i % 8),
        backgroundColor: '#0369a1',
        borderRadius: '50%',
        opacity,
        boxShadow: '0 0 15px 4px rgba(3, 105, 161, 0.3)',
        transform: `scale(${scale})`
      }} />
    );
  });

  return <AbsoluteFill style={{ perspective: 1000, transformStyle: 'preserve-3d' }}>{particles}</AbsoluteFill>;
};

const TitleSequence = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const textY = interpolate(frame, [0, 30], [100, 0], { extrapolateRight: 'clamp' });
  const textZ = interpolate(frame, [0, 30], [-500, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1000 }}>
      {/* 3D Container */}
      <div style={{
        transform: `translate3d(0, ${textY}px, ${textZ}px) rotateX(${interpolate(frame, [0, 40], [20, 0])}deg)`,
        opacity: textOpacity,
        textAlign: 'center',
        padding: '0 24px',
        transformStyle: 'preserve-3d'
      }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 12, 
          padding: '8px 16px', 
          background: 'rgba(255,255,255,0.8)', 
          backdropFilter: 'blur(10px)', 
          borderRadius: 30, 
          border: '1px solid #e0f2fe',
          marginBottom: 24,
          boxShadow: '0 10px 25px -5px rgba(3, 105, 161, 0.1)',
          transform: 'translateZ(50px)'
        }}>
           <span style={{ fontSize: 14, fontWeight: 700, color: '#0369a1', letterSpacing: 1 }}>(주)와이앤케이</span>
           <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#bae6fd' }} />
           <span style={{ fontSize: 14, fontWeight: 600, color: '#6b7280' }}>글로벌 LED 무역 허브</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(48px, 6vw, 100px)',
          fontWeight: 900,
          color: '#111827',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          textShadow: '0px 20px 40px rgba(0,0,0,0.05)'
        }}>
          빛의 가치를 높이는 <br />
          <span style={{ 
            background: 'linear-gradient(to right, #0284c7, #38bdf8)', 
            WebkitBackgroundClip: 'text', 
            color: 'transparent',
            display: 'inline-block',
            transform: 'translateZ(30px)'
          }}>프로페셔널 파트너</span>
        </h1>
        
        <p style={{
          marginTop: 32,
          fontSize: 'clamp(18px, 2vw, 24px)',
          color: '#4b5563',
          fontWeight: 500,
          maxWidth: 700,
          margin: '32px auto 0',
          lineHeight: 1.6,
          transform: 'translateZ(20px)'
        }}>
          가장 혁신적인 LED 솔루션과 신뢰할 수 있는 글로벌 인증을 통해 
          성공적인 비즈니스를 지원합니다.
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const LuminaComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ 
      background: 'radial-gradient(ellipse at bottom, #f0f9ff 0%, #ffffff 100%)', 
      overflow: 'hidden' 
    }}>
      <Sequence from={0}>
        <ParticleLayer />
      </Sequence>
      <Sequence from={15}>
        <TitleSequence />
      </Sequence>
      {/* Dynamic Background Effects */}
      <AbsoluteFill style={{
        background: 'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.1) 0%, rgba(0,0,0,0) 40%)',
        mixBlendMode: 'multiply'
      }} />
      <AbsoluteFill style={{
        background: 'radial-gradient(circle at 80% 80%, rgba(2, 132, 199, 0.05) 0%, rgba(0,0,0,0) 40%)',
        mixBlendMode: 'multiply'
      }} />
    </AbsoluteFill>
  );
};

export default function RemotionHero() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: '0 0 40px 40px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}>
      <Player
        component={LuminaComposition}
        durationInFrames={300}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={60}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          objectFit: 'cover'
        }}
        autoPlay
        loop
      />
    </div>
  );
}
