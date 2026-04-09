'use client';
import { Player } from '@remotion/player';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, spring, interpolate, Sequence, Img } from 'remotion';
import React, { useState, useEffect } from 'react';

const ParticleLayer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Clean, elegant glowing orbs instead of chaotic particles
  const orbs = Array.from({ length: 4 }).map((_, i) => {
    const startOffset = i * 20;
    const progress = Math.max(0, frame - startOffset) / fps;
    
    // Slow, gentle floating movement
    const y = interpolate(Math.sin(progress * 0.4 + i), [-1, 1], [10, 90]);
    const x = interpolate(Math.cos(progress * 0.3 + i), [-1, 1], [10, 90]);
    const scale = interpolate(Math.sin(progress * 0.2 + i), [-1, 1], [1, 2]);
    const opacity = interpolate(Math.sin(progress * 0.5 + i), [-1, 1], [0.1, 0.4]);
    
    // Mix of soft blues
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


const TitleSequence = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Elegant fade ups
  const y1 = spring({ frame: frame - 10, fps, config: { damping: 14, mass: 0.8 } });
  const o1 = interpolate(frame - 10, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  
  const y2 = spring({ frame: frame - 20, fps, config: { damping: 14, mass: 0.8 } });
  const o2 = interpolate(frame - 20, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const y3 = spring({ frame: frame - 30, fps, config: { damping: 14, mass: 0.8 } });
  const o3 = interpolate(frame - 30, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

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
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          opacity: o1,
          transform: `translateY(${interpolate(y1, [0, 1], [30, 0])}px)`
        }}>
           <span style={{ fontSize: 13, fontWeight: 800, color: '#0369a1', letterSpacing: 1 }}>(주)와이앤케이</span>
           <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#bae6fd' }} />
           <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', letterSpacing: 1 }}>GLOBAL B2B LED NETWORK</span>
        </div>

        {/* Sophisticated Typography */}
        <h1 style={{
          fontSize: 'clamp(44px, 5vw, 88px)',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          opacity: o2,
          transform: `translateY(${interpolate(y2, [0, 1], [40, 0])}px)`
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
          opacity: o3,
          transform: `translateY(${interpolate(y3, [0, 1], [30, 0])}px)`
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
        durationInFrames={300}
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
    </div>
  );
}
