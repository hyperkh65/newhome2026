'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Eye, 
  Settings, 
  Maximize, 
  Warehouse, 
  Cpu, 
  CheckCircle2, 
  Activity, 
  Thermometer,
  Layers,
  ArrowRight,
  Download,
  FileText,
  PlayCircle,
  Box,
  Cpu as ChipIcon,
  Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@remotion/player';
import { HighbaySequence } from './HighbayRemotion';


const S = {
  container: { background: '#020617', color: '#f8fafc', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' as const },
  hero: { 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column' as const,
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative' as const,
    overflow: 'hidden' as const
  },
  card: { background: 'rgba(15, 23, 42, 0.6)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', padding: 32, backdropFilter: 'blur(20px)' },
  accent: { color: '#0ea5e9' },
  glass: { background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20 },
};

const TECH_FILES = [
  { name: 'UFO-AM6-150W 공식 카탈로그', path: '/promotion_assets/UFO-AM6-150W 140LM(1).pdf', icon: <FileText size={18}/> },
  { name: 'Housing CAD 도면 (PDF)', path: '/promotion_assets/Housing CAD.pdf', icon: <Layers size={18}/> },
  { name: 'Philips Xitanium Driver Spec', path: '/promotion_assets/Xi_RHB_150W_0.52-0.84A_1-10V_WL_AUX_132S_929003459080(1).pdf', icon: <Cpu size={18}/> },
  { name: 'LED Chip LM-80 Report', path: '/promotion_assets/SZ2200910-55786E-10-10000\u00a0MTC\u00a0MKXWM-CX\u00a0LM-80\u00a0IAS\u00a0FINAL 3V180MA.pdf', icon: <Activity size={18}/> },
];

export default function FactoryHighbayPromotion() {
  const [mountHeight, setMountHeight] = useState(18);
  const [activeTab, setActiveTab] = useState('driver');
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={S.container}>
      {/* 1. CINEMATIC VIDEO HERO */}
      <section style={S.hero}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            loop 
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
          >
            <source src="/promotion_assets/KakaoTalk_Video_2026-04-16-09-17-15.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,6,23,0.8), rgba(2,6,23,0.4) 50%, rgba(2,6,23,0.9))' }} />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ zIndex: 10, textAlign: 'center', padding: '0 20px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', background: 'rgba(14, 165, 233, 0.15)', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: 100, color: '#38bdf8', fontSize: 13, fontWeight: 800, marginBottom: 24, letterSpacing: '0.05em' }}>
            <ShieldCheck size={14} /> KOREA-ORIGIN SMART SENSING ENGINE
          </div>
          <h1 style={{ fontSize: 'clamp(44px, 10vw, 100px)', fontWeight: 950, letterSpacing: '-0.06em', lineHeight: 1, marginBottom: 20 }}>
            UFO-AM6 <span style={{ ...S.accent, background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>150W</span>
          </h1>
          <p style={{ fontSize: 'clamp(18px, 2.2vw, 26px)', color: '#94a3b8', maxWidth: 900, margin: '0 auto 48px', fontWeight: 500, lineHeight: 1.5 }}>
            물류 창고의 운영 패러다임을 바꾸는 18M 초고천장 감지 기술.<br/>
            <span style={{ color: '#fff' }}>Philips Xitanium™ Driver</span>와 <span style={{ color: '#fff' }}>Seoul Semiconductor Engine</span>의 결합.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ background: '#0ea5e9', color: '#fff', padding: '18px 40px', borderRadius: 16, fontWeight: 900, fontSize: 18, border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px rgba(14, 165, 233, 0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
              실시간 견적 요청 <ArrowRight size={20} />
            </button>
            <button style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '18px 40px', borderRadius: 16, fontWeight: 800, fontSize: 18, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
              기술 문서 리포트
            </button>
          </div>
        </motion.div>

        {/* Real-time Metrics */}
        <div style={{ position: 'absolute', bottom: 60, display: 'flex', gap: 'clamp(20px, 5vw, 80px)', zIndex: 10, width: '100%', justifyContent: 'center', padding: '0 20px' }}>
          {[
            { label: 'System Efficacy', value: '151.2 lm/W', detail: 'Actual Tested Value' },
            { label: 'Sensor Altitude', value: '18~20m', detail: 'K-Microwave 5.8GHz' },
            { label: 'Driver Reliability', value: '100k Hours', detail: 'Philips Xitanium™' },
            { label: 'IP / IK Rating', value: 'IP65 / IK08', detail: 'Heavy Duty Die-Cast' },
          ].map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 900, color: '#fff', marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{m.detail}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 1.5 CINEMATIC TECH DEMO (Remotion) */}
      <section style={{ height: '75vh', background: '#000', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Player
          component={HighbaySequence}
          durationInFrames={150}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
          autoPlay
          loop
        />
        <div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
           <div style={{ fontSize: 12, fontWeight: 900, color: 'rgba(14, 165, 233, 0.5)', letterSpacing: 4 }}>ENGINEERING CINEMATIC</div>
        </div>
      </section>


      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 24px' }}>
        
        {/* 2. SENSOR DEEP-DIVE SIMULATION */}
        <section style={{ marginBottom: 160 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div style={{ order: 0 }}>
              <div style={{ display: 'inline-block', color: '#0ea5e9', fontWeight: 900, fontSize: 14, letterSpacing: 2, marginBottom: 16 }}>01. HYPER-SENSING ENGINE</div>
              <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 24, lineHeight: 1.1 }}>
                초고천장 물류창고를 위한<br/>
                <span style={S.accent}>18M 정밀 감지</span> 알고리즘
              </h2>
              <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}>
                일반적인 8~10m급 센서로는 대응할 수 없는 대규모 물류센터의 요구사항을 반영했습니다. 
                국내 독자 개발한 5.8GHz 고출력 마이크로웨이브 모듈과 Dual-MCU 노이즈 필터링 시스템은 
                강한 바람이나 대형 셔터의 움직임에도 오작동 없이 바닥면의 미세한 작업자 움직임만을 포착합니다.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontWeight: 800, color: '#fff', marginBottom: 8 }}>고도 자동 보정</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>설치 높이에 따른 감도 자동 튜닝 알고리즘 탑재</div>
                </div>
                <div style={{ padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontWeight: 800, color: '#fff', marginBottom: 8 }}>지게차 특화 필터</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>물류 장비의 금속 반사파 노이즈 99% 제거</div>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', order: 1 }}>
              <div style={{ ...S.card, padding: 0, height: 500, overflow: 'hidden', position: 'relative', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
                <div style={{ height: '100%', background: 'linear-gradient(to bottom, #020617, #0f172a)', padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 120, height: 10, background: '#1e293b', margin: '0 auto', borderRadius: 5 }} />
                    <div style={{ 
                      width: 0, height: 0, margin: '20px auto 0',
                      borderLeft: `${mountHeight * 8}px solid transparent`,
                      borderRight: `${mountHeight * 8}px solid transparent`,
                      borderBottom: '360px solid rgba(14, 165, 233, 0.1)',
                      filter: 'blur(30px)',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    <motion.div 
                      animate={{ x: [0, 100, -100, 0] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      style={{ width: 40, height: 60, background: '#fff', borderRadius: 8, opacity: 0.2, position: 'absolute', bottom: 0 }} 
                    />
                    <div style={{ width: '100%', height: 2, background: 'rgba(14,165,233,0.3)' }} />
                  </div>
                </div>
                
                {/* HUD Overlay */}
                <div style={{ position: 'absolute', top: 24, left: 24, padding: '12px 20px', ...S.glass }}>
                  <div style={{ fontSize: 12, color: '#0ea5e9', fontWeight: 900, marginBottom: 4 }}>ALTITUDE ANALYSIS</div>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>{mountHeight}.0M <span style={{ fontSize: 14, color: '#64748b' }}>STABLE</span></div>
                </div>
              </div>
              
              <div style={{ marginTop: 20, padding: 24, ...S.glass }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontWeight: 800 }}>설치 높이 시뮬레이션</span>
                  <span style={{ color: '#0ea5e9', fontWeight: 900 }}>{mountHeight}m</span>
                </div>
                <input 
                  type="range" min="5" max="25" value={mountHeight} 
                  onChange={(e) => setMountHeight(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0ea5e9' }} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. HARDWARE SPEC DEEP-DIVE TABS */}
        <section style={{ marginBottom: 160 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 16 }}>Proven Engineering Assets</h2>
            <p style={{ color: '#94a3b8', fontSize: 18 }}>실제 부품 사양서와 도면을 바탕으로 검증된 신뢰성을 확인하세요.</p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { id: 'driver', label: 'Driver (Philips)', icon: <Cpu /> },
              { id: 'chipset', label: 'LED (SSC)', icon: <ChipIcon /> },
              { id: 'thermal', label: 'Thermal Design', icon: <Wind /> },
              { id: 'cad', label: 'Structure CAD', icon: <Box /> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  background: activeTab === tab.id ? '#0ea5e9' : 'rgba(255,255,255,0.03)', 
                  border: '1px solid',
                  borderColor: activeTab === tab.id ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
                  color: activeTab === tab.id ? '#fff' : '#94a3b8',
                  padding: '12px 24px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, transition: '0.2s'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: 60, alignItems: 'center' }}
            >
              {activeTab === 'driver' && (
                <>
                  <div style={S.card}>
                    <div style={{ display: 'inline-flex', padding: '4px 12px', background: '#0ea5e922', color: '#0ea5e9', borderRadius: 6, fontSize: 11, fontWeight: 900, marginBottom: 20 }}>POWER UNIT</div>
                    <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>Philips Xitanium™ 150W</h3>
                    <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>
                      글로벌 조명 솔루션의 표준, 필립스 자이타늄 드라이버를 탑재했습니다. 
                      1-10V 디밍과 보조 전원(Auxiliary Power) 출력을 지원하여 스마트 센서와 완벽하게 페어링됩니다. 
                      서지 보호와 높은 역률(PF &gt; 0.95)로 가혹한 산업 현장 환경을 견뎌냅니다.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#64748b' }}>출력 전류 모델</span>
                        <span style={{ fontWeight: 700 }}>0.52 - 0.84A Adjustable</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#64748b' }}>Aux Power</span>
                        <span style={{ fontWeight: 700 }}>24Vdc / 3W Support</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <img src="/promotion_assets/hero-main.png" style={{ width: '100%', borderRadius: 24, boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }} alt="Driver Rendering" />
                    <div style={{ position: 'absolute', bottom: 20, right: 20, ...S.glass, padding: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#0ea5e9' }}>SPECIFICATION DOCUMENT</div>
                      <a href="/promotion_assets/Xi_RHB_150W_0.52-0.84A_1-10V_WL_AUX_132S_929003459080(1).pdf" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', textDecoration: 'none', fontWeight: 800, marginTop: 4 }}>
                        View PDF Spec <Download size={16}/>
                      </a>
                    </div>
                  </div>
                </>
              )}
              {activeTab === 'chipset' && (
                <>
                  <div style={S.card}>
                    <div style={{ display: 'inline-flex', padding: '4px 12px', background: '#0ea5e922', color: '#0ea5e9', borderRadius: 6, fontSize: 11, fontWeight: 900, marginBottom: 20 }}>LED ENGINE</div>
                    <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>Seoul Semiconductor 2835 9V</h3>
                    <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>
                      고효율(150lm/W 이상) 달성을 위해 서울반도체의 최신 9V 패키지를 적용했습니다. 
                      LM-80 테스트 기준 50,000시간 이상의 수명을 보증하며, 정밀한 Binning 제어로 뛰어난 색 편차를 자랑합니다.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#64748b' }}>Efficacy (Typ)</span>
                        <span style={{ fontWeight: 700 }}>180 lm/W (Chip level)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#64748b' }}>LM-80 Final</span>
                        <span style={{ fontWeight: 700 }}>50,000h @ Tj 105°C</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ position: 'relative', height: 400, background: '#0f172a', borderRadius: 24, padding: 40, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
                    {[...Array(60)].map((_, i) => (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.01 }}
                        key={i} 
                        style={{ aspectRatio: '1', background: '#facc15', borderRadius: 1, boxShadow: '0 0 4px rgba(250,204,21,0.4)' }} 
                      />
                    ))}
                  </div>
                </>
              )}
              {activeTab === 'thermal' && (
                <>
                  <div style={S.card}>
                    <div style={{ display: 'inline-flex', padding: '4px 12px', background: '#0ea5e922', color: '#0ea5e9', borderRadius: 6, fontSize: 11, fontWeight: 900, marginBottom: 20 }}>THERMAL CONTROL</div>
                    <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>ADC12 Die-Casting Structure</h3>
                    <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>
                      공기역학적 방열핀 설계를 통해 자연 대류를 극대화했습니다. 
                      산업 현장의 유증기와 염해에도 부식되지 않는 특수 정전식 분체 도장 처리가 되어 있어 
                      가혹한 현장에서도 변함없는 성능을 유지합니다.
                    </p>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div style={{ textAlign: 'center', flex: 1, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                        <Thermometer size={24} style={{ color: '#f43f5e', marginBottom: 8, margin: '0 auto' }} />
                        <div style={{ fontSize: 18, fontWeight: 900 }}>Tj 65°C</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Operating Temp</div>
                      </div>
                      <div style={{ textAlign: 'center', flex: 1, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                        <Wind size={24} style={{ color: '#0ea5e9', marginBottom: 8, margin: '0 auto' }} />
                        <div style={{ fontSize: 18, fontWeight: 900 }}>-30~+50°C</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Environment</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#0f172a', borderRadius: 24, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                     <motion.div 
                       animate={{ 
                         scale: [1, 1.05, 1],
                         opacity: [0.3, 0.6, 0.3]
                       }}
                       transition={{ duration: 4, repeat: Infinity }}
                       style={{ position: 'absolute', width: '200%', height: '200%', background: 'radial-gradient(circle, #0ea5e9 0%, transparent 60%)', filter: 'blur(100px)', opacity: 0.1 }}
                     />
                     <Layers size={80} color="#0ea5e9" opacity={0.5} />
                  </div>
                </>
              )}
              {activeTab === 'cad' && (
                <>
                  <div style={S.card}>
                    <div style={{ display: 'inline-flex', padding: '4px 12px', background: '#0ea5e922', color: '#0ea5e9', borderRadius: 6, fontSize: 11, fontWeight: 900, marginBottom: 20 }}>MECHANICAL CAD</div>
                    <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>Ultra-Slim & Robust</h3>
                    <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>
                      실제 제품의 기구 도면을 통해 치수와 설치 편의성을 확인하세요. 
                      기존 조명 대비 20% 이상 경량화하여 설치 하중을 줄이면서도 필요한 강도는 유지했습니다.
                    </p>
                    <a href="/promotion_assets/Housing CAD.pdf" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px', background: '#fff', color: '#000', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>
                      도면 데이터 보기 (PDF) <Download size={20}/>
                    </a>
                  </div>
                  <div style={{ padding: 40, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 24, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Box size={60} style={{ color: '#64748b', marginBottom: 20, margin: '0 auto' }} />
                      <div style={{ color: '#64748b', fontSize: 14 }}>Engineering Blueprint Rendering Area</div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* 4. TECHNICAL DATA ARCHIVE */}
        <section style={{ marginBottom: 160 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>Data Sheets & Certifications</h2>
              <p style={{ color: '#94a3b8' }}>설계 및 관공서 납품에 필요한 모든 기술 문서를 다운로드하세요.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {TECH_FILES.map((file, i) => (
              <a 
                key={i} 
                href={file.path} 
                target="_blank"
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 20, padding: 24, ...S.glass, 
                  textDecoration: 'none', transition: '0.2s', border: '1px solid rgba(255,255,255,0.05)'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.background = 'rgba(14,165,233,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                  {file.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>PDF Document</div>
                </div>
                <Download size={18} color="#64748b" />
              </a>
            ))}
          </div>
        </section>

        {/* 5. CTA - PROJECT PARTNERSHIP */}
        <section style={{ 
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)', 
          borderRadius: 32,
          textAlign: 'center', 
          padding: '100px 40px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }} />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: 56, fontWeight: 950, marginBottom: 24 }}>설계 스펙 제안이<br/>필요하신가요?</h2>
            <p style={{ fontSize: 22, fontWeight: 500, marginBottom: 48, opacity: 0.9 }}>물류창고 신축 및 보수 프로젝트를 위한 전문 기술 컨설팅을 제공합니다.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ background: '#fff', color: '#000', padding: '20px 48px', borderRadius: 16, fontWeight: 900, fontSize: 20, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                상담 신청하기 <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </section>

      </main>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 5px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #0ea5e9;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid #020617;
          box-shadow: 0 0 10px rgba(14,165,233,0.5);
        }
      `}</style>
    </div>
  );
}
