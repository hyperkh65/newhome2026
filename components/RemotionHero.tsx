'use client';
import { Player } from '@remotion/player';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, spring, interpolate, Sequence, Img, Easing } from 'remotion';
import React, { useState, useEffect } from 'react';

const ParticleLayer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const orbs = Array.from({ length: 4 }).map((_, i) => {
    const startOffset = i * 20;
    const progress = Math.max(0, frame - startOffset) / fps;
    const y = interpolate(Math.sin(progress * 0.4 + i), [-1, 1], [10, 90]);
    const x = interpolate(Math.cos(progress * 0.3 + i), [-1, 1], [10, 90]);
    const scale = interpolate(Math.sin(progress * 0.2 + i), [-1, 1], [1, 2]);
    const opacity = interpolate(Math.sin(progress * 0.5 + i), [-1, 1], [0.1, 0.4]);
    
    const colors = ['#bae6fd', '#e0f2fe', '#7dd3fc', '#f0f9ff'];
    const color = colors[i % colors.length];
    
    return (
      <div key={i} style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: 800 + (i * 100),
        height: 800 + (i * 100),
        backgroundColor: color,
        borderRadius: '50%',
        opacity: opacity,
        filter: 'blur(150px)',
        transform: `scale(${scale}) translate(-50%, -50%)`,
        mixBlendMode: 'normal'
      }} />
    );
  });

  return <AbsoluteFill style={{ overflow: 'hidden' }}>{orbs}</AbsoluteFill>;
};

const ImageMarqueeLayer = () => {
  const frame = useCurrentFrame();
  
  const images = [
    'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80',
    'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    'https://images.unsplash.com/photo-1556379092-dca659792591?w=600&q=80',
    'https://images.unsplash.com/photo-1588607593683-16a7384ec6f5?w=600&q=80',
  ];

  // Slow continuous horizontal movement
  const xOffset1 = interpolate(frame % 1200, [0, 1200], [0, -2000]);
  const xOffset2 = interpolate(frame % 1500, [0, 1500], [0, -2000]);

  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', gap: '50px', justifyContent: 'center', opacity: 0.15, transform: 'rotate(-5deg) scale(1.2)', filter: 'blur(1px)', pointerEvents: 'none' }}>
      {/* Row 1 moving left */}
      <div style={{ display: 'flex', gap: '30px', transform: `translateX(${xOffset1}px)` }}>
        {[...images, ...images, ...images].map((src, i) => (
          <Img key={`r1-${i}`} src={src} style={{ width: 400, height: 260, objectFit: 'cover', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
        ))}
      </div>
      {/* Row 2 moving left at different speed with offset */}
      <div style={{ display: 'flex', gap: '30px', transform: `translateX(${xOffset2 - 500}px)` }}>
        {[...images, ...images, ...images].reverse().map((src, i) => (
          <Img key={`r2-${i}`} src={src} style={{ width: 400, height: 260, objectFit: 'cover', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const TitleSequence = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Cinematic Impactful Animation: Blur + Scale down
  const phase1 = interpolate(frame, [0, 30], [0, 1], { easing: Easing.bezier(0.1, 0.9, 0.2, 1), extrapolateRight: 'clamp' });
  const phase2 = interpolate(frame, [15, 45], [0, 1], { easing: Easing.bezier(0.1, 0.9, 0.2, 1), extrapolateRight: 'clamp' });
  const phase3 = interpolate(frame, [30, 60], [0, 1], { easing: Easing.bezier(0.1, 0.9, 0.2, 1), extrapolateRight: 'clamp' });

  // Blur values
  const blur1 = interpolate(phase1, [0, 1], [30, 0]);
  const blur2 = interpolate(phase2, [0, 1], [30, 0]);
  const blur3 = interpolate(phase3, [0, 1], [20, 0]);

  // Scale values (large to small)
  const scale1 = interpolate(phase1, [0, 1], [1.3, 1]);
  const scale2 = interpolate(phase2, [0, 1], [1.3, 1]);
  const scale3 = interpolate(phase3, [0, 1], [1.1, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 24px', zIndex: 10 }}>
        
        {/* Subtle Corporate Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: 12, 
          padding: '8px 20px', 
          background: 'rgba(255,255,255,0.7)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: 40, 
          border: '1px solid rgba(255,255,255,0.8)',
          marginBottom: 32,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
          opacity: phase1,
          filter: `blur(${blur1}px)`,
          transform: `scale(${scale1})`
        }}>
           <span style={{ fontSize: 13, fontWeight: 800, color: '#0369a1', letterSpacing: 1 }}>(주)와이앤케이</span>
           <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#0284c7' }} />
           <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', letterSpacing: 1 }}>GLOBAL B2B LED NETWORK</span>
        </div>

        {/* Sophisticated & Impactful Typography */}
        <h1 style={{
          fontSize: 'clamp(44px, 5vw, 88px)',
          fontWeight: 900,
          color: '#0f172a',
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          opacity: phase2,
          filter: `blur(${blur2}px)`,
          transform: `scale(${scale2})`
        }}>
          지속 가능한 미래를 밝히는<br />
          <span style={{ 
            color: '#0284c7',
            display: 'inline-block',
          }}>글로벌 파트너스</span>
        </h1>
        
        {/* Minimalist Subtext */}
        <p style={{
          marginTop: 32,
          fontSize: 'clamp(17px, 1.5vw, 22px)',
          color: '#475569',
          fontWeight: 500,
          maxWidth: 700,
          margin: '32px auto 0',
          lineHeight: 1.7,
          opacity: phase3,
          filter: `blur(${blur3}px)`,
          transform: `scale(${scale3})`
        }}>
          혁신적인 품질의 프리미엄 LED 시스템과 무역 인프라로 <br className="hidden md:block"/>
          가장 안정적이고 투명한 B2B 솔루션을 제공합니다.
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const LuminaComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ 
      background: '#ffffff',
      overflow: 'hidden' 
    }}>
      <ParticleLayer />
      <Sequence from={0}>
        <ImageMarqueeLayer />
      </Sequence>
      <Sequence from={15}>
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

  if (!mounted) return <div style={{ width: '100%', height: '100vh', background: '#ffffff' }} />;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Player
        component={LuminaComposition}
        durationInFrames={1200}
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
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, #ffffff, transparent)', zIndex: 20 }} />
      {/* Top gradient for navbar blending */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, #ffffff, transparent)', zIndex: 20 }} />
    </div>
  );
}
