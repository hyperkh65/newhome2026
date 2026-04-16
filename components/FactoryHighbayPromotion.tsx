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
  Box,
  Eye,
  TrendingUp,
  Award,
  Settings,
  Monitor,
  HardDrive
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Player } from '@remotion/player';
import { HighbaySequence } from './HighbayRemotion';

const S = {
  container: { background: '#020617', color: '#f8fafc', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' as const },
  section: { maxWidth: 1400, margin: '0 auto', padding: '120px 24px' },
  glass: { background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, padding: 48 },
  label: { fontSize: 13, fontWeight: 900, color: '#0ea5e9', letterSpacing: 4, marginBottom: 20, display: 'block', textTransform: 'uppercase' as const },
  title: { fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 950, marginBottom: 32, letterSpacing: '-0.04em', lineHeight: 1.1 },
  text: { color: '#94a3b8', fontSize: 18, lineHeight: 1.8, marginBottom: 40 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }
};

const SpecRow = ({ label, value, detail }: { label: string, value: string, detail?: string }) => (
  <div style={{ padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
      <span style={{ fontSize: 15, color: '#64748b', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 20, color: '#f8fafc', fontWeight: 900 }}>{value}</span>
    </div>
    {detail && <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{detail}</div>}
  </div>
);

const PhotoCard = ({ src, title, desc, delay = 0 }: { src: string, title?: string, desc?: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    style={{ ...S.glass, padding: 0, overflow: 'hidden' }}
  >
    <div style={{ width: '100%', aspectRatio: '16/10', background: '#000', overflow: 'hidden' }}>
       <img src={src} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, transition: '0.5s' }} 
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
    </div>
    {(title || desc) && (
      <div style={{ padding: 32 }}>
         <h4 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>{title}</h4>
         <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>{desc}</p>
      </div>
    )}
  </motion.div>
);

export default function FactoryHighbayPromotion() {
  return (
    <div style={S.container}>
      
      {/* 1. CINEMATIC VIDEO ANALYSIS */}
      <section style={{ background: '#000', position: 'relative' }}>
        <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '85vh', overflow: 'hidden' }}>
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
        <div style={{ position: 'absolute', bottom: 40, left: 40, zIndex: 50 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(14,165,233,0.1)', padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(14,165,233,0.3)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0ea5e9', boxShadow: '0 0 10px #0ea5e9' }} />
              <span style={{ fontSize: 11, fontWeight: 900, color: '#38bdf8', letterSpacing: 2 }}>TECH STREAMING ACTIVE</span>
           </div>
        </div>
      </section>

      {/* 2. KOREAN MARKET EXCLUSIVE: PREMIUM BLACK SENSOR CAP */}
      <section style={S.section}>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
               <span style={S.label}>Design Innovation for Korea</span>
               <h2 style={S.title}>글로벌 표준을 넘어선<br/><span style={{ color: '#0ea5e9' }}>한국형 프리미엄 블랙 캡</span></h2>
               <p style={S.text}>
                  영상 속 일반 모델의 화이트 센서 캡과 달리, 국내 산업 현장의 고유한 인테리어 조화와 오염 방지, 
                  그리고 정체성 확보를 위해 **매트 블랙 전용 캡**을 한국 시장용으로 전격 채택했습니다. 
                  글로벌 기술력에 한국적 감각을 더한 독점적 디자인을 만나보세요.
               </p>
               <div style={{ display: 'flex', gap: 20 }}>
                  <div style={{ padding: '24px', background: 'rgba(14,165,233,0.05)', borderRadius: 20, border: '1px solid rgba(14,165,233,0.1)' }}>
                     <div style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8', marginBottom: 8 }}>WHITE-CAP (Global)</div>
                     <div style={{ fontSize: 12, color: '#64748b' }}>Standard Industry Design</div>
                  </div>
                  <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.2)' }}>
                     <div style={{ fontSize: 14, fontWeight: 900, color: '#f8fafc', marginBottom: 8 }}>BLACK-CAP (Korea Spec)</div>
                     <div style={{ fontSize: 12, color: '#94a3b8' }}>Custom Premium Identity</div>
                  </div>
               </div>
            </motion.div>
            <div style={{ position: 'relative' }}>
               <img src="/promotion_assets/gallery/gallery_016.jpeg" 
                    alt="Main Feature" 
                    style={{ width: '100%', borderRadius: 40, boxShadow: '0 40px 100px rgba(0,0,0,0.5)', zIndex: 10, position: 'relative' }} />
               <div style={{ position: 'absolute', inset: -20, border: '1px solid rgba(14,165,233,0.2)', borderRadius: 60, zIndex: 5 }} />
            </div>
         </div>
      </section>

      {/* 3. FIELD USAGE GALLERY (18m ALTITUDE REALITY) */}
      <section style={{ ...S.section, maxWidth: '100%', paddingLeft: 60, paddingRight: 60 }}>
         <div style={{ textAlign: 'center', marginBottom: 100 }}>
            <span style={S.label}>Real-World Deployment</span>
            <h2 style={S.title}>압도적 높이에서 증명되는<br/>현장 조도와 센서 정밀도</h2>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 80 }}>
            <PhotoCard src="/promotion_assets/gallery/gallery_001.jpeg" />
            <PhotoCard src="/promotion_assets/gallery/gallery_002.jpeg" delay={0.1} />
            <PhotoCard src="/promotion_assets/gallery/gallery_003.jpeg" delay={0.2} />
            <PhotoCard src="/promotion_assets/gallery/gallery_004.jpeg" delay={0.3} />
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 20, marginBottom: 80 }}>
            <PhotoCard src="/promotion_assets/gallery/gallery_016.jpeg" title="Master Lighting View" desc="18m 고천간 물류센터 실측 현장. 균일한 조도 분포와 그림자 최소화 기술이 적용되었습니다." />
            <PhotoCard src="/promotion_assets/gallery/gallery_005.jpeg" title="Structural Detail" desc="ADC12 하우징의 누끼 디테일. 산업 현장의 열악한 조건을 견디는 정밀 다이캐스팅 공법." />
            <PhotoCard src="/promotion_assets/gallery/gallery_006.jpeg" title="Sensor Alignment" desc="K-마이크로웨이브 센서의 완벽한 결합. 한국형 화이트/블랙 캡 매칭." />
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <PhotoCard src="/promotion_assets/gallery/gallery_007.jpeg" />
            <PhotoCard src="/promotion_assets/gallery/gallery_008.jpeg" />
            <PhotoCard src="/promotion_assets/gallery/gallery_009.jpeg" />
         </div>
      </section>

      {/* 4. MECHANICAL BLUEPRINT & KEY DIMENSIONS */}
      <section style={S.section}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
           <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #0ea5e911, transparent)', filter: 'blur(80px)' }} />
              <div style={{ border: '2px dashed rgba(14,165,233,0.15)', padding: 60, borderRadius: 1000, aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'rgba(15,23,42,0.3)' }}>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 90, fontWeight: 950, color: '#0ea5e9' }}>Φ260</div>
                    <div style={{ fontSize: 24, fontWeight: 800, opacity: 0.4 }}>ENGINEERING BLUEPRINT</div>
                 </div>
                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} 
                             style={{ position: 'absolute', inset: 30, border: '1px dotted rgba(14,165,233,0.3)', borderRadius: '50%' }} />
              </div>
           </div>
           
           <div>
              <span style={S.label}>Mechanical Specification</span>
              <h2 style={S.title}>0.5mm의 오차도 허용치 않는<br/>고정밀 설계의 정점</h2>
              <p style={S.text}>
                 Housing CAD 도면(Revision V1.2)에 명시된 Φ260mm 규격은 단순히 외형을 넘어 최적의 방열 면적을 계산한 결과입니다. 
                 ADC12 산업용 특수 알루미늄 합금을 사용하여, 고출력 가동 시에도 칩셋 온도를 극한으로 낮추어 10만 시간의 수명을 보장합니다.
              </p>
              
              <div style={S.grid}>
                 <div>
                    <SpecRow label="Exterior Diameter" value="Φ 260.0 mm" detail="공차 ±0.5mm 이내 정밀 가공" />
                    <SpecRow label="Standard Height" value="185.0 mm" detail="슬림 고천장 하우징 설계" />
                 </div>
                 <div>
                    <SpecRow label="Net Weight" value="3.8 kg" detail="드라이버 & 센서 포함 실측 중량" />
                    <SpecRow label="Material" value="ADC12 Aluminum" detail="고강도/고방열 특수 합금" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 5. OPTICAL & ELECTRONIC SUPREMACY (5X EXPANDED) */}
      <section style={{ background: '#0f172a', padding: '120px 0' }}>
         <div style={S.section}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
               {[
                  { icon: Microscope, title: 'LM-80 신뢰성 데이터', desc: '서울반도체 SSC 2835 9V 칩셋의 10,000시간 가속 테스트 리포트(SZ2200910) 준수. L90 기준 10만 시간 이상의 안정적인 광속 유지를 보장합니다.' },
                  { icon: Zap, title: 'Philips Xitanium 테크놀로지', desc: 'Xi RHB 150W 드라이버의 서지 보호(6kV/10kV) 기능 탑재. 불안정한 산업 전력망에서도 칩셋을 완벽하게 보호하고 THD 10% 미만의 고품질 전력을 공급합니다.' },
                  { icon: Activity, title: 'K-SMART 센서 알고리즘', desc: '5.8GHz 마이크로웨이브 주파수를 활용한 독자적 동적 알고리즘. 사람과 지게차의 움직임을 구분하여 18m 높이에서도 즉각적인 감지 피드백을 실현했습니다.' },
                  { icon: Wind, title: '에어로다이나믹 패시브 쿨링', desc: '강제 대류가 아닌 자연 대류를 극대화한 방열 핀 설계. 상부 공기 배출구를 통해 수평 및 수직 기류를 동시에 제어하여 열 적체 현상을 근본적으로 해결했습니다.' },
                  { icon: ShieldCheck, title: 'IP65 완전 밀폐 구조', desc: '산업용 고압 물분사 및 미세 먼지 침투를 완벽히 차단하는 가스켓 설계. 습기가 많은 공장이나 먼지가 발생하는 물류센터에서도 변함없는 성능을 발휘합니다.' },
                  { icon: TrendingUp, title: '유지보수 비용 85% 절감', desc: '고수명 엔진과 스마트 디밍의 결합으로 기존 메탈 할라이드 램프 대비 전기료 및 교체 비용을 혁신적으로 절감하여 TCO를 최적화합니다.' }
               ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} style={S.glass}>
                     <item.icon color="#0ea5e9" size={48} style={{ marginBottom: 24 }} />
                     <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>{item.title}</h3>
                     <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>{item.desc}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. EXPANDED SPECIFICATION TABLE */}
      <section style={S.section}>
         <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 950 }}>Master Specification Sheet (Full v2.0)</h2>
            <p style={{ color: '#64748b', marginTop: 10 }}>공장등 140 시리즈 / UFO-AM6-150W 엔지니어링 리포트</p>
         </div>

         <div style={S.grid}>
            <div style={S.glass}>
               <h4 style={{ color: '#0ea5e9', fontWeight: 900, fontSize: 14, marginBottom: 32, letterSpacing: 2 }}>[ ELECTRICAL SYSTEM ]</h4>
               <SpecRow label="Input Voltage" value="AC 220-240V, 50/60Hz" detail="산업 전력망 전 구간 대응" />
               <SpecRow label="Total Power" value="150W (Actual 148.5W)" detail="필립스 드라이버 측정 기준" />
               <SpecRow label="Surge Level" value="6kV (L-N) / 10kV (GND)" detail="낙뢰 및 서지 보호 표준 준수" />
               <SpecRow label="Power Factor" value="0.98 @ Full Load" detail="전력 손실을 최소화한 고역률" />
               <SpecRow label="THD" value="< 10%" detail="전류 왜곡 억제를 통한 전력망 안정화" />
            </div>
            <div style={S.glass}>
               <h4 style={{ color: '#0ea5e9', fontWeight: 900, fontSize: 14, marginBottom: 32, letterSpacing: 2 }}>[ OPTICAL & SENSING ]</h4>
               <SpecRow label="System Efficacy" value="145 lm/W Plus" detail="기구 효율 기준 세계 최고 수준" />
               <SpecRow label="CCT / CRI" value="5,700K / Ra 85" detail="서울반도체 High CRI Tier 적용" />
               <SpecRow label="Sensing Range" value="Φ18m @ 18m Height" detail="K-Microwave 5.8GHz 알고리즘" />
               <SpecRow label="Sensor Cap" value="PREMIUM BLACK" detail="한국 시장 전용 맞춤형 디자인" />
               <SpecRow label="Beam Distribution" value="120° Wide Angle" detail="IESNA2002 광학 데이터 준수" />
            </div>
         </div>
      </section>

      {/* 7. MORE PRODUCT GALLERY */}
      <section style={{ padding: '0 24px 120px' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            <PhotoCard src="/promotion_assets/gallery/gallery_010.jpeg" />
            <PhotoCard src="/promotion_assets/gallery/gallery_011.jpeg" />
            <PhotoCard src="/promotion_assets/gallery/gallery_012.jpeg" />
            <PhotoCard src="/promotion_assets/gallery/gallery_013.jpeg" />
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 20 }}>
            <PhotoCard src="/promotion_assets/gallery/gallery_014.jpeg" />
            <PhotoCard src="/promotion_assets/gallery/gallery_015.jpeg" />
            <PhotoCard src="/promotion_assets/gallery/gallery_018.png" />
         </div>
      </section>

      {/* 8. DOWNLOAD VERIFIED ASSETS */}
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
                  <div style={{ ...S.glass, padding: '24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                     <FileText color="#0ea5e9" size={24} />
                     <span style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{asset.name}</span>
                     <Download size={18} color="#0ea5e9" style={{ marginLeft: 'auto' }} />
                  </div>
               </a>
            ))}
         </div>
      </section>

      <footer style={{ padding: '100px 24px', textAlign: 'center', background: '#020617', borderTop: '1px solid #1e293b' }}>
         <h2 style={{ fontSize: 32, fontWeight: 950, marginBottom: 24 }}>YNK TECHNOLOGY RESEARCH LAB</h2>
         <p style={{ color: '#475569', fontSize: 14, maxWidth: 800, margin: '0 auto', lineHeight: 1.8 }}>
            본 테크니컬 리포트는 YNK 기술연구소의 실측 데이터를 바탕으로 작성되었습니다. 
            모든 수치는 실제 제품 성능을 보증하며, 국내외 인증(KC, CE, RoHS) 기준을 충족합니다. 
            한국 시장 전용 프리미엄 라인업에 대한 독점적 권리를 보유하고 있습니다.
            © 2026 YNK Engineering. All Rights Reserved.
         </p>
      </footer>

    </div>
  );
}
