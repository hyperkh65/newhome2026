'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Settings, 
  BarChart3, 
  ArrowRight, 
  Download, 
  FileText, 
  Video,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Activity,
  Maximize2,
  MinusCircle,
  PlusCircle,
  Wind,
  Warehouse,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const S = {
  container: { background: '#020617', color: '#f8fafc', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' as const },
  hero: { height: '100vh', position: 'relative' as const, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  accent: { color: '#0ea5e9' },
  glass: { background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }
};

export default function FactoryHighbayPromotion() {
  const [sensorHeight, setSensorHeight] = useState(18);
  const [activeTech, setActiveTech] = useState<'driver' | 'led' | 'housing' | 'sensor'>('sensor');
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div style={S.container}>
      
      {/* 1. HERO SECTION: ACTUAL PRODUCT VIDEO & OVERLAY */}
      <section style={S.hero}>
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
        >
          <source src="/promotion_assets/KakaoTalk_Video_2026-04-16-14-38-09.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Gradient Overlay for Readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(2,6,23,0.4), rgba(2,6,23,0.9))' }} />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', maxWidth: 1200 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 24px', background: 'rgba(14, 165, 233, 0.2)', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: 100, color: '#38bdf8', fontSize: 14, fontWeight: 900, marginBottom: 32, letterSpacing: '0.1em' }}>
            <Flag size={16} /> K-SMART MICROWAVE SENSOR ENGINE
          </div>
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 110px)', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 24 }}>
            UFO-AM6 <span style={{ color: '#0ea5e9' }}>150W</span>
          </h1>
          <p style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', color: '#cbd5e1', maxWidth: 900, margin: '0 auto 48px', fontWeight: 600, lineHeight: 1.4, wordBreak: 'keep-all' }}>
            한국 기술진이 직접 설계한 <span style={{ color: '#fff', borderBottom: '2px solid #0ea5e9' }}>18M 초고천장 고정밀 센서</span><br/>
            가혹한 산업 현장을 압도하는 고효율 하이베이 솔루션.
          </p>

          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
             <div style={{ ...S.glass, padding: '20px 32px', borderRadius: 24, textAlign: 'left', minWidth: 260 }}>
                <div style={{ color: '#0ea5e9', fontWeight: 900, fontSize: 13, marginBottom: 4 }}>SENSOR ENGINE</div>
                <div style={{ fontSize: 24, fontWeight: 900 }}>Max 18~20M</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>K-Microwave 5.8GHz</div>
             </div>
             <div style={{ ...S.glass, padding: '20px 32px', borderRadius: 24, textAlign: 'left', minWidth: 260 }}>
                <div style={{ color: '#0ea5e9', fontWeight: 900, fontSize: 13, marginBottom: 4 }}>LED DRIVER</div>
                <div style={{ fontSize: 24, fontWeight: 900 }}>Philips Xitanium™</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>100K Hours Reliability</div>
             </div>
             <div style={{ ...S.glass, padding: '20px 32px', borderRadius: 24, textAlign: 'left', minWidth: 260 }}>
                <div style={{ color: '#0ea5e9', fontWeight: 900, fontSize: 13, marginBottom: 4 }}>TOTAL EFFICACY</div>
                <div style={{ fontSize: 24, fontWeight: 900 }}>151.2 lm/W</div>
                <div style={{ color: '#64748b', fontSize: 13 }}>Actual Test Report</div>
             </div>
          </div>
        </motion.div>
      </section>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 24px' }}>
        
        {/* 2. REAL WEB SIMULATION: 18M DETECTION AT WAREHOUSE */}
        <section style={{ marginBottom: 160 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16 }}>18m 리얼리티 시뮬레이션</h2>
            <p style={{ color: '#94a3b8', fontSize: 18 }}>실제 대형 물류창고 높이에서의 고정밀 센서 감지 범위를 확인하세요.</p>
          </div>

          <div style={{ ...S.grid, gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
            <div style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', height: 600, background: '#000' }}>
              <img 
                src="/promotion_assets/renders/warehouse.png" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} 
                alt="Warehouse Interior"
              />
              {/* Vertical Height Line */}
              <div style={{ position: 'absolute', left: 40, top: 40, bottom: 40, width: 2, background: 'linear-gradient(to bottom, #0ea5e9, transparent)' }} />
              <div style={{ position: 'absolute', left: 50, top: 40, color: '#0ea5e9', fontWeight: 900 }}>UFO LED ({sensorHeight}m)</div>
              
              {/* Sensor Cone */}
              <motion.div 
                animate={{ width: sensorHeight * 12, height: sensorHeight * 12 }}
                style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(20px)'
                }} 
              />
              
              {/* Detection Point Indicator */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', background: '#0ea5e9', borderRadius: 100, fontWeight: 900, fontSize: 14 }}
              >
                고정밀 감지 중: { (sensorHeight * 0.8).toFixed(1) }m 반경
              </motion.div>
            </div>

            <div style={{ padding: '0 40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <div style={{ background: '#0ea5e9', padding: 12, borderRadius: 16 }}><Cpu size={32} /></div>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 800 }}>K-스마트 센서 엔진</h3>
                  <p style={{ color: '#94a3b8' }}>국내 기술진이 개발한 독자적인 5.8GHz 알고리즘</p>
                </div>
              </div>

              <div style={{ spaceY: 24 }}>
                <div style={{ ...S.glass, padding: 32, borderRadius: 24, marginBottom: 20 }}>
                  <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>설치 높이 설정 (Altitude)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <button onClick={() => setSensorHeight(h => Math.max(10, h-1))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><MinusCircle size={32} /></button>
                    <div style={{ fontSize: 48, fontWeight: 900, color: '#0ea5e9' }}>{sensorHeight}m</div>
                    <button onClick={() => setSensorHeight(h => Math.min(20, h+1))} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><PlusCircle size={32} /></button>
                  </div>
                </div>

                <div style={{ fontSize: 16, lineHeight: 1.8, color: '#94a3b8' }}>
                  <p>일반적인 수입산 센서는 10m 이상에서 감도가 급격히 하락합니다. UFO-AM6는 <b>한국 특유의 높은 층고 환경</b>에 최적화된 마이크로웨이브 알고리즘을 탑재하여 18m 이상의 극한 높이에서도 끊김 없는 감지 성능을 보장합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PRODUCT DEEP-DIVE: REAL RENDERS & SPEC */}
        <section style={{ marginBottom: 160 }}>
           <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
              {(['sensor', 'driver', 'led', 'housing'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTech(tab)}
                  style={{
                    padding: '12px 32px',
                    borderRadius: 100,
                    border: '1px solid',
                    borderColor: activeTech === tab ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
                    background: activeTech === tab ? '#0ea5e9' : 'transparent',
                    color: '#fff',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
           </div>

           <AnimatePresence mode="wait">
             <motion.div 
               key={activeTech}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               style={{ ...S.grid, gridTemplateColumns: '1.2fr 1fr', background: 'rgba(15, 23, 42, 0.4)', borderRadius: 48, padding: 60, border: '1px solid rgba(255,255,255,0.05)' }}
             >
                <div style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', minHeight: 400 }}>
                   <img 
                      src={activeTech === 'driver' ? "/promotion_assets/renders/philips_driver.png" : "/promotion_assets/renders/ufo_main.png"} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      alt="Tech Rendering"
                   />
                </div>
                <div>
                   {activeTech === 'sensor' && (
                     <>
                       <h3 style={{ fontSize: 36, fontWeight: 900, marginBottom: 20 }}>K-MICROWAVE ENGINE</h3>
                       <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.6, marginBottom: 32 }}>수입산 저가형 센서와 차원이 다른 국산 기술력. 초고천장 전 전용 5.8GHz 마이크로웨이브 모듈을 탑재하여 온도와 습도 변화에도 변함없는 감지 속도를 유지합니다.</p>
                       <ul style={{ listStyle: 'none', padding: 0, spaceY: 12 }}>
                          {['최대 18~20m 설치 가능', '감도/대기시간/조도 딥스위치 제어', '필립스 드라이버와 1-10V 인터페이스 연동', 'KC 안전 인증 및 전자기적합성(EMC) 통과'].map(li => (
                            <li key={li} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, fontWeight: 600 }}>
                              <CheckCircle2 color="#0ea5e9" size={20} /> {li}
                            </li>
                          ))}
                       </ul>
                     </>
                   )}
                   {activeTech === 'driver' && (
                     <>
                       <h3 style={{ fontSize: 36, fontWeight: 900, marginBottom: 20 }}>PHILIPS XITANIUM™</h3>
                       <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.6, marginBottom: 32 }}>글로벌 조명 솔루션의 표준, 필립스 자이타늄 드라이버를 탑재했습니다. 서지 보호와 높은 역률(PF &gt; 0.95)로 가혹한 산업 현장 환경을 견뎌냅니다.</p>
                       <div style={{ ...S.glass, padding: 24, borderRadius: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ color: '#64748b' }}>Expected Lifetime</span>
                            <span style={{ fontWeight: 800 }}>100,000 Hours</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Surge Protection</span>
                            <span style={{ fontWeight: 800 }}>6kV / 10kV</span>
                          </div>
                       </div>
                     </>
                   )}
                   {/* ... LED and Housing contents can be added similarly ... */}
                </div>
             </motion.div>
           </AnimatePresence>
        </section>

        {/* 4. TECHNICAL DOCUMENTS: ACTUAL PDF LINKS */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>기술 검증 자료실</h2>
            <p style={{ color: '#94a3b8' }}>UFO-AM6의 성능은 숫자가 아닌 실증 데이터로 증명됩니다.</p>
          </div>
          <div style={{ ...S.grid, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {[
              { title: '공식 카탈로그 (국문)', icon: <FileText color="#ef4444" />, path: '/promotion_assets/[와이앤케이] UFO-AM6 150W 공식카탈로그-24년판.pdf' },
              { title: '필립스 드라이버 스펙', icon: <FileText color="#3b82f6" />, path: '/promotion_assets/Philips Xitanium Driver spec.pdf' },
              { title: '서울반도체 LED 리포트', icon: <FileText color="#10b981" />, path: '/promotion_assets/SSC-2835-LED-LM80.pdf' },
              { title: 'CAD 회로 도면 (DWG)', icon: <Monitor color="#8b5cf6" />, path: '/promotion_assets/UFO-AM6-150W CAD Circuit.pdf' }
            ].map(doc => (
              <a key={doc.title} href={doc.path} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{ ...S.glass, padding: 32, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 20, transition: '0.3s' }}
                     onMouseEnter={e => e.currentTarget.style.borderColor = '#0ea5e9'}
                     onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16 }}>{doc.icon}</div>
                   <div>
                     <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{doc.title}</div>
                     <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}><Download size={12} /> PDF Download</div>
                   </div>
                </div>
              </a>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER CALL TO ACTION */}
      <section style={{ padding: '120px 24px', textAlign: 'center', background: 'linear-gradient(to top, #0ea5e922, transparent)' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 950, marginBottom: 40 }}>에너지 절감의 새로운 기준.</h2>
        <button style={{ background: '#fff', color: '#020617', padding: '24px 64px', borderRadius: 20, fontWeight: 900, fontSize: 20, border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px rgba(255,255,255,0.1)' }}>
          대량 발주 및 기술 미팅 신청
        </button>
        <p style={{ marginTop: 32, color: '#64748b', fontSize: 14 }}>© 2024 (주)와이앤케이. K-SMART 센서 솔루션 공식 파트너.</p>
      </section>

    </div>
  );
}
