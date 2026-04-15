'use client';
import React, { useState, useEffect } from 'react';
import { Lightbulb, Search, BookOpen, BarChart, Clock, ShieldCheck, Sun, Eye, CheckCircle2 } from 'lucide-react';

export default function LEDChipManualInteractive() {
  const [isMobile, setIsMobile] = useState(false);
  const [cct, setCct] = useState(5000);
  const [cri, setCri] = useState(80);
  const [beamAngle, setBeamAngle] = useState(120);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCctColor = (temp: number) => {
    if (temp <= 3000) return '#fbbf24';
    if (temp <= 4000) return '#fde68a';
    if (temp <= 5000) return '#fff';
    return '#bae6fd';
  };

  return (
    <div style={{
      width: '100%',
      background: '#020617',
      borderRadius: isMobile ? '0' : '24px',
      padding: isMobile ? '24px 16px' : '48px',
      color: '#f8fafc',
      fontFamily: '"Pretendard", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '32px' : '64px',
      boxShadow: '0 40px 100px rgba(0, 0, 0, 0.7)',
    }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: isMobile ? '28px' : '48px', fontWeight: 900, marginBottom: '24px', lineHeight: 1.2 }}>
           🌟 LED 칩 사양서 완전 정복 <br/>
           <span style={{ color: '#fbbf24' }}>CRI·배광·수명 데이터 읽는 법</span>
        </h1>
        <p style={{ fontSize: isMobile ? '16px' : '20px', color: '#94a3b8', maxWidth: '850px', margin: '0 auto', lineHeight: 1.6 }}>
           단순히 밝은 것이 전부가 아닙니다. 색이 얼마나 정확한지(CRI), 빛이 어디로 퍼지는지(배광), 
           신뢰성 데이터(LM-80)는 어떻게 보는지 실무 전문가의 시선으로 칩을 분석해봅시다.
        </p>
      </div>

      {/* Chapter 1: Color & Quality */}
      <section style={{ 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        padding: isMobile ? '24px' : '48px', 
        borderRadius: '32px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'center' }}>
           <div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fbbf24', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <Sun size={32} /> 1. 색온도(CCT) & 연색성(CRI)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                 <div>
                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 700 }}>
                       <span>🌡️ 색온도 (Correlated Color Temp)</span>
                       <span style={{ color: '#fbbf24' }}>{cct} K</span>
                    </label>
                    <input type="range" min="2700" max="6500" step="100" value={cct} onChange={(e)=>setCct(Number(e.target.value))} style={{ width: '100%', accentColor: '#fbbf24' }} />
                 </div>
                 <div>
                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 700 }}>
                       <span>🎨 연색성 (Color Rendering Index)</span>
                       <span style={{ color: '#fbbf24' }}>Ra {cri}</span>
                    </label>
                    <input type="range" min="70" max="98" value={cri} onChange={(e)=>setCri(Number(e.target.value))} style={{ width: '100%', accentColor: '#fbbf24' }} />
                 </div>
              </div>
           </div>

           <div style={{ background: '#0f172a', padding: '32px', borderRadius: '24px', textAlign: 'center', border: '1px solid #1e293b' }}>
              <div style={{ 
                width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 24px',
                background: getCctColor(cct),
                boxShadow: `0 0 50px ${getCctColor(cct)}88`,
                transition: 'all 0.3s'
              }}/>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                 {cct <= 3000 ? '전구색 (Warm White)' : cct <= 4500 ? '주백색 (Natural White)' : '주광색 (Cool White)'}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                 <b>효과:</b> CRI가 {cri}인 경우, 실제 태양광 대비 {cri}% 수준의 색 정확도를 가집니다. 
                 상업용은 90 이상, 가로등은 {cri < 80 ? '가성비 위주의 70~80' : '고급형 80 이상'}이 주로 사용됩니다.
              </p>
           </div>
        </div>
      </section>

      {/* Chapter 2: Beam Angle & Distribution */}
      <section style={{ 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        padding: isMobile ? '24px' : '48px', 
        borderRadius: '32px'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#38bdf8', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
           <Eye size={32} /> 2. 배광곡선 & 지향각 (Beam Angle)
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: '48px' }}>
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignContent: 'flex-start' }}>
              {[60, 90, 120].map(angle => (
                <button 
                  key={angle}
                  onClick={() => setBeamAngle(angle)}
                  style={{
                    flex: 1, minWidth: '100px', padding: '16px', borderRadius: '12px',
                    background: beamAngle === angle ? '#38bdf8' : '#1e293b',
                    color: beamAngle === angle ? '#0f172a' : '#fff',
                    fontWeight: 900, cursor: 'pointer', border: 'none'
                  }}
                >
                  {angle}° Lens
                </button>
              ))}
              <div style={{ width: '100%', marginTop: '20px', color: '#cbd5e1', lineHeight: 1.7 }}>
                 <b>배광곡선(Luminous Intensity Distribution)</b>은 빛이 어느 방향으로 강하게 나가는지를 보여주는 지도입니다. 
                 가로등은 도로를 따라 길게 비춰야 하므로 <b>비대칭 배광</b>렌즈를 사용하여 빛의 낭비를 막는 것이 핵심입니다.
              </div>
           </div>

           <div style={{ 
             background: '#020617', height: '250px', borderRadius: '24px', position: 'relative', overflow: 'hidden',
             display: 'flex', justifyContent: 'center'
           }}>
              {/* Fake Light Cone */}
              <div style={{
                width: '0', height: '0',
                borderLeft: `${beamAngle}px solid transparent`,
                borderRight: `${beamAngle}px solid transparent`,
                borderTop: `200px solid rgba(56, 189, 248, 0.3)`,
                filter: 'blur(10px)',
                transition: 'all 0.5s'
              }}/>
              <div style={{ position: 'absolute', bottom: 20, fontWeight: 800, color: '#38bdf8' }}>{beamAngle}도 광각 조사 중</div>
           </div>
        </div>
      </section>

      {/* Chapter 3: Knowledge Base (LM-80, LM-79) */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
         <div style={{ background: '#0f172a', padding: '32px', borderRadius: '24px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fbbf24', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Clock size={24} /> LM-80 & L70/L90
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.8 }}>
               LED는 꺼지지 않지만 서서히 어두워집니다. <br/>
               <b>L70</b>은 초기 밝기의 70%가 될 때까지 걸리는 시간(보통 5만 시간)을 의미합니다. 
               LM-80 데이터 시트를 통해 고온 신뢰성을 반드시 확인해야 합니다.
            </p>
         </div>
         <div style={{ background: '#0f172a', padding: '32px', borderRadius: '24px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <CheckCircle2 size={24} /> LM-79 테스트 리포트
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.8 }}>
               칩 하나가 아니라 <b>등기구 전체</b>에 대한 성능 검사 성적서입니다. 
               총광속(lm), 소비전력(W), 광효율(lm/W) 및 배광 데이터를 실측하여 공식적으로 인증한 문서입니다.
            </p>
         </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '40px 0' }}>
         <p style={{ fontSize: '20px', fontWeight: 800, color: '#fbbf24' }}>지표(Metric)를 읽을 줄 아는 것이 전문가의 시작입니다. 📈</p>
      </footer>
    </div>
  );
}
