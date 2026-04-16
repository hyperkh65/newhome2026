'use client';
import React, { useRef } from 'react';
import { 
  Zap, 
  Shield, 
  Cpu, 
  Layers, 
  Activity, 
  BarChart3, 
  Eye, 
  Maximize2,
  Database,
  Search,
  Tool,
  HardDrive,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import HighbayRemotion from './HighbayRemotion';

const S = {
  container: {
    background: '#000000',
    color: '#ffffff',
    fontFamily: '"Inter", sans-serif',
    overflowX: 'hidden' as const
  },
  glass: {
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 24
  },
  title: {
    fontSize: 'clamp(48px, 6vw, 92px)',
    fontWeight: 950,
    letterSpacing: '-0.04em',
    lineHeight: 0.9,
    margin: 0
  },
  sectionTitle: {
    fontSize: 48,
    fontWeight: 900,
    letterSpacing: '-0.02em',
    marginBottom: 24,
    color: '#f8fafc'
  },
  label: {
    display: 'inline-block',
    padding: '8px 16px',
    background: '#0ea5e9',
    color: '#000',
    fontSize: 12,
    fontWeight: 900,
    borderRadius: 100,
    marginBottom: 24,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em'
  },
  text: {
    fontSize: 18,
    lineHeight: 1.6,
    color: '#94a3b8',
    marginBottom: 40
  }
};

const ProductNukki = ({ src, size = 500, glowColor = 'rgba(14, 165, 233, 0.2)' }: { src: string, size?: number, glowColor?: string }) => (
  <div style={{ position: 'relative', width: size, height: size, zIndex: 5 }}>
    <motion.div 
      animate={{ 
        boxShadow: [`0 0 60px ${glowColor}`, `0 0 100px ${glowColor}`, `0 0 60px ${glowColor}`] 
      }}
      transition={{ duration: 4, repeat: Infinity }}
      style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: '85%', 
        height: '85%', 
        borderRadius: '50%', 
        background: '#000',
        zIndex: -1
      }}
    />
    <div style={{ 
      width: '100%', 
      height: '100%', 
      borderRadius: '50%', 
      overflow: 'hidden',
      position: 'relative',
      maskImage: 'radial-gradient(circle at center, black 45%, rgba(0,0,0,0.8) 65%, transparent 90%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 45%, rgba(0,0,0,0.8) 65%, transparent 90%)',
      boxShadow: '0 0 80px rgba(0,0,0,0.8) inset'
    }}>
      <img src={src} style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover',
        filter: 'contrast(1.05) brightness(1.02)'
       }} alt="Product" />
    </div>
    <motion.div 
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ 
        position: 'absolute', 
        bottom: -20, 
        left: '10%', 
        width: '80%', 
        height: 10, 
        background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.2) 0%, transparent 70%)',
        blur: '10px'
      }} 
    />
  </div>
);

export default function FactoryHighbayPromotion() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div style={S.container} ref={containerRef}>
      
      {/* 1. HERO SHOT (본체가 주인공) */}
      <section style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'relative',
        padding: '0 40px',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: '30%', height: '30%', background: 'radial-gradient(circle, #0ea5e922 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '40%', height: '40%', background: 'radial-gradient(circle, #0ea5e911 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', zIndex: 10, marginBottom: 60 }}
        >
          <h1 style={{ fontSize: '12vw', fontWeight: 950, letterSpacing: '-0.06em', margin: 0, color: '#f8fafc', lineHeight: 0.8 }}>
            UFO-AM6 <span style={{ color: '#0ea5e9' }}>150W</span>
          </h1>
          <p style={{ fontSize: 28, color: '#94a3b8', marginTop: 32, letterSpacing: '0.3em', fontWeight: 200, textTransform: 'uppercase' }}>
            The Apex of Industrial Lighting
          </p>
        </motion.div>

        {/* 메인 제품 누끼 */}
        <ProductNukki src="/promotion_assets/product_main.png" size={700} />

        <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 60, color: '#475569', fontSize: 13, letterSpacing: '0.2em', fontWeight: 600 }}>
          <span>SEOUL SEMICONDUCTOR</span>
          <span>PHILIPS XITANIUM</span>
          <span>IP65 CERTIFIED</span>
        </div>
      </section>

      {/* 2. 기술 브리핑 영상 통합 섹션 */}
      <section style={{ padding: '160px 0', background: '#050505', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100, alignItems: 'center' }}>
            <div style={{ order: 2 }}>
              <span style={S.label}>Field Analytics</span>
              <h2 style={S.sectionTitle}>현장의 데이터를 <br/>실시간으로 증명하다</h2>
              <p style={S.text}>
                단순한 제품 소개를 넘어, 실제 공장 환경에서의 조도 스캔과 
                에너지 효율 데이터를 리얼 타임으로 오버레이합니다. 
                18m 높이에서도 흔들림 없는 시인성을 확인하십시오.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ ...S.glass, padding: 24 }}>
                  <div style={{ color: '#0ea5e9', marginBottom: 12 }}><Activity size={24} /></div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>21,000 lm</div>
                  <div style={{ color: '#64748b', fontSize: 14 }}>Real Photometric Power</div>
                </div>
                <div style={{ ...S.glass, padding: 24 }}>
                  <div style={{ color: '#0ea5e9', marginBottom: 12 }}><Zap size={24} /></div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>140 lm/W</div>
                  <div style={{ color: '#64748b', fontSize: 14 }}>Efficacy Benchmark</div>
                </div>
              </div>
            </div>
            
            <div style={{ order: 1 }}>
              <div style={{ 
                borderRadius: 40, 
                overflow: 'hidden', 
                border: '1px solid #1e293b', 
                boxShadow: '0 40px 100px -20px rgba(14, 165, 233, 0.2)',
                background: '#000'
              }}>
                <HighbayRemotion />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 한국형 블랙 센서 캡 - 서브 포인트로 배치 */}
      <section style={{ padding: '160px 0', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
          <div style={{ marginBottom: 80 }}>
            <span style={{ color: '#0ea5e9', fontSize: 14, fontWeight: 900, letterSpacing: '0.1em' }}>K-EXCLUSIVE DESIGN</span>
            <h2 style={{ fontSize: 56, fontWeight: 900, marginTop: 16 }}>The Black Signature</h2>
            <p style={{ color: '#94a3b8', fontSize: 20, maxWidth: 700, margin: '24px auto 0' }}>
              글로벌 표준의 화이트 캡을 넘어, 한국 시장의 프리미엄 요구를 반영한 
              매트 블랙 센서 캡. 시각적 일체감과 엔지니어링의 정점을 완성합니다.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
             <ProductNukki src="/promotion_assets/black_cap_nukki.png" size={550} glowColor="rgba(255,255,255,0.05)" />
          </div>
        </div>
      </section>

      {/* 4. 고밀도 기술 갤러리 */}
      <section style={{ padding: '160px 0', background: '#050505' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ marginBottom: 60 }}>
            <h2 style={S.sectionTitle}>Technical Gallery</h2>
            <p style={{ color: '#64748b' }}>18개의 실제 데이터 셋과 설계 도면 아카이브</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {[...Array(18)].map((_, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02, y: -5 }}
                style={{ 
                  aspectRatio: '16/10', 
                  borderRadius: 24, 
                  overflow: 'hidden',
                  background: '#111',
                  border: '1px solid #222'
                }}
              >
                <img 
                  src={`/promotion_assets/gallery/gallery_${String(i + 1).padStart(3, '0')}.jpeg`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                  alt={`Gallery ${i+1}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: '120px 24px', textAlign: 'center', borderTop: '1px solid #111' }}>
         <h2 style={{ fontSize: 32, fontWeight: 950, marginBottom: 32 }}>YNK ENGINEERING LAB</h2>
         <p style={{ color: '#475569', fontSize: 14 }}>© 2026 YNK LIGHTING ARCHITECTURE. ALL RIGHTS RESERVED.</p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:weight@100..900&display=swap');
      `}</style>
    </div>
  );
}
