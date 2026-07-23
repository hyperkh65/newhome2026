'use client';
import React from 'react';
import { 
  Box, Maximize, Ruler, Settings, Cpu, Layers, 
  Target, ShieldCheck, Factory, Zap, Wrench,
  Cog, Database, Thermometer
} from 'lucide-react';
import { motion } from 'framer-motion';

const S = {
  glass: {
    background: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(30px)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: 40,
    padding: 60
  }
};

export default function MoldManualInteractive() {
  return (
    <div style={{ background: '#000', color: '#fff', padding: '120px 40px', fontFamily: '"Pretendard", sans-serif' }}>
      
      {/* 1. HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 150 }}
      >
        <div style={{ display: 'inline-block', padding: '10px 24px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: 13, fontWeight: 900, borderRadius: 100, marginBottom: 32, letterSpacing: '0.4em' }}>
          PRECISION TOOLING & MOLDING
        </div>
        <h1 style={{ fontSize: '7vw', fontWeight: 950, letterSpacing: '-0.05em', color: '#f1f5f9', lineHeight: 0.9 }}>
          STRUCTURAL <br/> <span style={{ color: '#10b981' }}>INTEGRITY</span>
        </h1>
        <p style={{ fontSize: 22, color: '#64748b', marginTop: 40, maxWidth: 900, margin: '40px auto', lineHeight: 1.8 }}>
          정밀 금형 설계는 균일한 품질의 초석입니다. <br/>
          0.05mm의 정밀 공차 관리와 초고압 다이캐스팅 공정을 통해 극한의 내구성과 미니멀한 외형 디자인을 동시에 실현합니다.
        </p>
      </motion.div>

      {/* 2. CORE TECH SECTION */}
      <section style={{ marginBottom: 200 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }}>
          <div style={S.glass}>
             <Ruler size={40} color="#10b981" style={{ marginBottom: 32 }} />
             <h3 style={{ fontSize: 32, fontWeight: 950, marginBottom: 24 }}>제조 공차 & 치수 정밀도</h3>
             <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.9 }}>
               당사의 금형은 <b>H13 열처리강</b>을 사용하여 50만 샷 이상의 양산 시에도 변형 없는 정밀도를 보장합니다. 
               주요 조립 부위는 ±0.05mm 이하의 공차를 유지하여 IP65~68 등기구의 완전 분진/방수 성능을 물리적으로 뒷받침합니다.
             </p>
             <div style={{ marginTop: 48, display: 'flex', gap: 16 }}>
                <span style={{ padding: '12px 24px', background: '#020617', borderRadius: 12, border: '1px solid #1e293b', color: '#10b981', fontWeight: 800 }}>Tolerance: ±0.05mm</span>
                <span style={{ padding: '12px 24px', background: '#020617', borderRadius: 12, border: '1px solid #1e293b', color: '#10b981', fontWeight: 800 }}>Draft Angle: 1~3°</span>
             </div>
          </div>

          <div style={S.glass}>
             <Thermometer size={40} color="#10b981" style={{ marginBottom: 32 }} />
             <h3 style={{ fontSize: 32, fontWeight: 950, marginBottom: 24 }}>Mold Flow & 열 관리 설계</h3>
             <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.9 }}>
               CAE 기반의 **유동 해석(Mold Flow Analysis)**을 통해 금속 용탕의 균일한 충진을 유도하고, 
               기포 및 냉납(Cold Shut)을 근본적으로 차단합니다. 이는 알루미늄 하우징 전체의 일관된 열전도 계수를 확보하는 핵심 공정입니다.
             </p>
             <div style={{ marginTop: 48, display: 'flex', gap: 16 }}>
                <span style={{ padding: '12px 24px', background: '#020617', borderRadius: 12, border: '1px solid #1e293b', color: '#10b981', fontWeight: 800 }}>Pressure: 800~1,200 Ton</span>
                <span style={{ padding: '12px 24px', background: '#020617', borderRadius: 12, border: '1px solid #1e293b', color: '#10b981', fontWeight: 800 }}>Cycles: 30-45 sec</span>
             </div>
          </div>
        </div>
      </section>

      {/* 3. MOLD STRUCTURE DETAIL */}
      <section style={{ ...S.glass, marginBottom: 200 }}>
        <h2 style={{ fontSize: 40, fontWeight: 950, marginBottom: 60, textAlign: 'center' }}>Engineering Components</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
           {[
             { icon: Box, title: 'Sliding Core', desc: '복잡한 측면 구조물을 단일 공정으로 성형하기 위한 정밀 슬라이딩 시스템' },
             { icon: Maximize, title: 'Ejector Pins', desc: '성형품의 뒤틀림을 방지하기 위해 계산된 위치에 배치된 자동 추출 핀' },
             { icon: Target, title: 'Water Cooling', desc: '금형 내부 온도를 일정하게 제어하여 생산성 및 물성을 균일하게 유지하는 냉각 라인' },
             { icon: ShieldCheck, title: 'Surface Finish', desc: '도장 밀착력을 극대화하기 위한 Ra 3.2 수준의 정밀 방전 가공 표면' }
           ].map((item, i) => (
             <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#10b981' }}>
                  <item.icon size={32} />
                </div>
                <h4 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>{item.title}</h4>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '100px 0', borderTop: '1px solid #111' }}>
        <p style={{ color: '#1e293b', fontSize: 13, letterSpacing: '0.8em', fontWeight: 950 }}>MECHANICAL MASTER MOLD ARCHITECTURE</p>
      </footer>
    </div>
  );
}
