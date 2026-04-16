'use client';
import React from 'react';
import { 
  ShieldCheck, 
  Flag, 
  Cpu, 
  FileText, 
  Download, 
  CheckCircle2,
  ArrowRight,
  Database,
  Search,
  Wrench,
  Camera,
  Activity,
  Layers,
  Maximize,
  Wind,
  Zap,
  Microscope,
  Box
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Player } from '@remotion/player';
import { HighbaySequence } from './HighbayRemotion';

const S = {
  container: { background: '#020617', color: '#f8fafc', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' as const },
  section: { maxWidth: 1400, margin: '0 auto', padding: '100px 24px' },
  glass: { background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 40 },
  label: { fontSize: 12, fontWeight: 900, color: '#0ea5e9', letterSpacing: 2, marginBottom: 16, display: 'block', textTransform: 'uppercase' as const },
  title: { fontSize: 48, fontWeight: 950, marginBottom: 24, letterSpacing: '-0.02em' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }
};

const SpecRow = ({ label, value, detail }: { label: string, value: string, detail?: string }) => (
  <div style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
      <span style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 18, color: '#f8fafc', fontWeight: 800 }}>{value}</span>
    </div>
    {detail && <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{detail}</div>}
  </div>
);

export default function FactoryHighbayPromotion() {
  return (
    <div style={S.container}>
      
      {/* 1. CINEMATIC VIDEO ANALYSIS */}
      <section style={{ background: '#000', position: 'relative', borderBottom: '1px solid #1e293b' }}>
        <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '80vh', overflow: 'hidden' }}>
          <Player
            component={HighbaySequence}
            durationInFrames={5400} 
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            style={{ width: '100%', height: '100%' }}
            controls
            autoPlay
            loop
          />
        </div>
      </section>

      {/* 2. MASTER BLUEPRINT & KEY DIMENSIONS */}
      <section style={S.section}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
           <div>
              <span style={S.label}>Mechanical Engineering</span>
              <h2 style={S.title}>Φ260mm 초정밀 하우징<br/>압도적 방열 메커니즘</h2>
              <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.8, marginBottom: 40 }}>
                 공식 CAD 도면(Housing CAD.pdf)에 기반한 ADC12 알루미늄 다이캐스팅 설계. 
                 상부 벤틸레이션 홀과 하부 공기 순환 핀을 통해 LED 칩셋 정크션 온도를 상시 65°C 이하로 제어합니다.
              </p>
              
              <div style={S.glass}>
                 <SpecRow label="Exterior Diameter" value="Φ 260.0 mm" detail="공차 ±0.5mm 이내 정밀 가공 (UFO-AM6 Standard)" />
                 <SpecRow label="Standard Height" value="185.0 mm" detail="슬림형 고천장 설계로 설치 공간 제약 최소화" />
                 <SpecRow label="Mounting Type" value="EYE BOLT / BRACKET" detail="M10 규격 아이볼트 적용으로 안전 하중 하 확보" />
                 <SpecRow label="Material Index" value="ADC12 Aluminum" detail="내식성 및 열전도율이 우수한 산업용 특수 합금" />
              </div>
           </div>
           
           <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #0ea5e922, transparent)', filter: 'blur(100px)' }} />
              <div style={{ border: '2px dashed rgba(14,165,233,0.2)', padding: 40, borderRadius: 1000, aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 100, fontWeight: 900, color: '#0ea5e9' }}>Φ260</div>
                    <div style={{ fontSize: 24, fontWeight: 700, opacity: 0.5 }}>DIMENSION</div>
                 </div>
                 {/* Decorative CAD Lines */}
                 <div style={{ position: 'absolute', top: '50%', left: -40, width: 80, height: 2, background: '#0ea5e9' }} />
                 <div style={{ position: 'absolute', top: '50%', right: -40, width: 80, height: 2, background: '#0ea5e9' }} />
                 <div style={{ position: 'absolute', top: -40, left: '50%', width: 2, height: 80, background: '#0ea5e9' }} />
                 <div style={{ position: 'absolute', bottom: -40, left: '50%', width: 2, height: 80, background: '#0ea5e9' }} />
              </div>
           </div>
        </div>
      </section>

      {/* 3. OPTICAL ENGINE DEEP DIVE */}
      <section style={{ background: '#020617', padding: '100px 0' }}>
         <div style={S.section}>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
               <span style={S.label}>Optical Performance</span>
               <h2 style={S.title}>서울반도체 SSC 2835 9V<br/>LM-80 검증된 신뢰성</h2>
            </div>

            <div style={S.grid}>
               <div style={S.glass}>
                  <Layers color="#0ea5e9" size={40} style={{ marginBottom: 24 }} />
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>칩셋 배열 분석</h3>
                  <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
                     140lm/W 고효율 구현을 위한 SSC 2835 칩셋 정밀 레이아웃. 
                     회로도(LFZY6290-L-REV01) 기준 전력 부하 분산 설계를 통해 특정 소자의 가부하를 원천 차단했습니다.
                  </p>
               </div>
               <div style={S.glass}>
                  <Zap color="#0ea5e9" size={40} style={{ marginBottom: 24 }} />
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Luminous Flux</h3>
                  <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
                     150W 기준 총 광속 유지율 90% 이상(L90). 
                     IESNA2002 데이터 기준 배광 각도 120°의 광각 배광으로 그림자를 최소화하고 균일한 조도를 제공합니다.
                  </p>
               </div>
               <div style={S.glass}>
                  <Microscope color="#0ea5e9" size={40} style={{ marginBottom: 24 }} />
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>LM-80 Report Data</h3>
                  <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
                     SZ2200910-55786E 시험 성적 준수. 
                     10,000시간 이상의 가혹 환경 테스트를 통과한 산업용 프리미엄 소자 탑재로 반영구적 수명을 보장합니다.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 4. MASTER SPEC TABLE: FACTORY 140 SERIES */}
      <section style={{ ...S.section, background: '#0f172a', borderRadius: 48, padding: '80px' }}>
         <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900 }}>Factory 140 Series Full Specification</h2>
            <p style={{ color: '#64748b', marginTop: 10 }}>UFO-AM6-150W 모델 기준 정밀 데이터 시트</p>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
            <div>
               <h4 style={{ color: '#0ea5e9', fontWeight: 900, fontSize: 14, marginBottom: 24 }}>[ 전기 및 제어 사양 ]</h4>
               <SpecRow label="Input Voltage" value="AC 220-240V" detail="50/60Hz 호환" />
               <SpecRow label="Power Consumption" value="150W (±5%)" />
               <SpecRow label="Power Factor" value="PF > 0.95" detail="드라이버 실측 기준 고역률 구현" />
               <SpecRow label="Driver Brand" value="Philips Xitanium" detail="Xi RHB 150W 0.52-0.84A 전용 모델" />
               <SpecRow label="Surge Protection" value="6kV / 10kV" detail="L-N: 6kV, L/N-GND: 10kV 대응" />
               <SpecRow label="Control Interface" value="1-10V Dimming" detail="스마트 제어 및 센서 연동 필수 인터페이스" />
            </div>
            <div>
               <h4 style={{ color: '#0ea5e9', fontWeight: 900, fontSize: 14, marginBottom: 24 }}>[ 광학 및 환경 사양 ]</h4>
               <SpecRow label="System Efficacy" value="140-150 lm/W" detail="광원 수치가 아닌 실제 기구 효율 기준" />
               <SpecRow label="Color Temperature" value="5,700K / 5,000K" detail="산업 현장 최적의 시안성 확보" />
               <SpecRow label="Color Rendering" value="Ra > 80" detail="서울반도체 High CRI 칩셋 적용" />
               <SpecRow label="IP Rating" value="IP 65" detail="완전 방진 및 고압 분사 액체 보호" />
               <SpecRow label="Sensing Range" value="Max 18~20m" detail="K-Microwave 5.8GHz 고감도 알고리즘" />
               <SpecRow label="Operation Temp" value="-30°C ~ +50°C" detail="냉동 창고 및 고온 생산 시설 대응" />
            </div>
         </div>
      </section>

      {/* 5. K-SMART SENSOR: 18M DETECTION PROWESS */}
      <section style={S.section}>
         <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
               <span style={S.label}>Intelligent Motion Control</span>
               <h2 style={S.title}>국내 기술로 완성된<br/>18M 고천장 센서 엔진</h2>
               <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.8, marginBottom: 32 }}>
                  일반 Microwave 센서(6-7m)로는 불가능한 18m 이상의 극한 높이에서의 정밀 감지.
                  국내 센서 전문 업체와 협업 개발한 독자적 펌웨어로 현장의 미세한 움직임까지 포착합니다.
               </p>
               <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ ...S.glass, padding: 24, flex: 1 }}>
                     <div style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc' }}>5.8GHz</div>
                     <div style={{ fontSize: 12, color: '#64748b' }}>TRANSMIT FREQUENCY</div>
                  </div>
                  <div style={{ ...S.glass, padding: 24, flex: 1 }}>
                     <div style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc' }}>18m</div>
                     <div style={{ fontSize: 12, color: '#64748b' }}>MAX DETECTION HEIGHT</div>
                  </div>
               </div>
            </div>
            <div style={{ flex: 1, height: 400, background: 'rgba(14,165,233,0.05)', borderRadius: 40, border: '1px solid rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
               <div style={{ textAlign: 'center' }}>
                  <Activity size={80} color="#0ea5e9" style={{ opacity: 0.5, marginBottom: 20 }} />
                  <div style={{ color: '#0ea5e9', fontWeight: 900, fontSize: 14 }}>WAVEFORM ANALYSIS: ACTIVE</div>
               </div>
            </div>
         </div>
      </section>

      {/* 6. DOWNLOAD VERIFIED ASSETS */}
      <section style={{ ...S.section, borderTop: '1px solid #1e293b' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
               { name: 'Housing CAD Design (PDF)', file: 'Housing CAD.pdf' },
               { name: 'SSC 2835 LED Datasheet', file: 'LED Chip spec-sheet MK8XM-GX .pdf' },
               { name: 'IES Photometric Data', file: 'UFO_IESNA2002.IES' },
               { name: 'Circuit Diagram (V1.2)', file: '140lmW-LFZY6290-L-REV01(24C13B)-LED module circuit diagram.pdf' },
               { name: 'Philips Driver Specs', file: 'Xi_RHB_150W_0.52-0.84A_1-10V_WL_AUX_132S_929003459080(1).pdf' },
               { name: 'LM-80 Test Report', file: 'SZ2200910-55786E-10-10000 MTC MKXWM-CX LM-80.pdf' }
            ].map((asset, i) => (
               <a key={i} href={`/promotion_assets/${asset.file}`} download style={{ textDecoration: 'none' }}>
                  <div style={{ ...S.glass, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, transition: '0.3s' }}>
                     <FileText color="#64748b" size={20} />
                     <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>{asset.name}</span>
                     <Download size={14} color="#0ea5e9" style={{ marginLeft: 'auto' }} />
                  </div>
               </a>
            ))}
         </div>
      </section>

      <footer style={{ padding: '80px 24px', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
         <p style={{ color: '#475569', fontSize: 13, maxWidth: 600, margin: '0 auto' }}>
            본 테크니컬 리포트는 YNK 기술연구소의 실측 데이터를 바탕으로 작성되었습니다. 
            모든 수치는 설치 환경 및 전력 조건에 따라 미세하게 변동될 수 있습니다. 
            © 2026 YNK Engineering Team.
         </p>
      </footer>

    </div>
  );
}
