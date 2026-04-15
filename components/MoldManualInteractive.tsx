'use client';
import React, { useState, useEffect } from 'react';
import { Layers, Box, Settings, Thermometer, Gauge, Zap, Info, ArrowRight, Activity, MousePointer2 } from 'lucide-react';

export default function MoldManualInteractive() {
  const [isMobile, setIsMobile] = useState(false);
  const [process, setProcess] = useState('injection'); // injection, extrusion, double, co
  const [temp, setTemp] = useState(240);
  const [coolingTime, setCoolingTime] = useState(20);
  const [isInjecting, setIsInjecting] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startAnimation = () => {
    setIsInjecting(true);
    setTimeout(() => setIsInjecting(false), 2000);
  };

  return (
    <div style={{
      width: '100%',
      background: '#0f172a',
      borderRadius: isMobile ? '0' : '24px',
      padding: isMobile ? '24px 16px' : '48px',
      color: '#f1f5f9',
      fontFamily: '"Pretendard", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '32px' : '64px',
      boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5)',
    }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: isMobile ? '26px' : '44px', fontWeight: 900, marginBottom: '20px', lineHeight: 1.2 }}>
           🏗️ 정밀 금형 설계 및 <br/>
           <span style={{ color: '#38bdf8' }}>사출·압출 실무 마스터 클래스</span>
        </h1>
        <p style={{ fontSize: isMobile ? '16px' : '19px', color: '#94a3b8', maxWidth: '900px', margin: '0 auto', lineHeight: 1.7 }}>
          조명기구의 외형과 방수 성능을 결정하는 핵심 공정! 
          붕어빵 틀 같은 사출부터 가래떡 뽑듯 나오는 압출, 그리고 두 번 찍어내는 이중 사출까지 실무 노하우를 공개합니다.
        </p>
      </div>

      {/* Process Selector Tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '10px' }}>
         {[
           { id: 'injection', name: '사출 (Injection)', icon: <Box size={18} /> },
           { id: 'extrusion', name: '압출 (Extrusion)', icon: <Activity size={18} /> },
           { id: 'double', name: '이중 사출 (Double)', icon: <Layers size={18} /> },
           { id: 'co', name: '아중 압출 (Co-Ex)', icon: <Settings size={18} /> }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setProcess(tab.id)}
             style={{
               whiteSpace: 'nowrap',
               padding: '12px 24px',
               borderRadius: '12px',
               background: process === tab.id ? '#38bdf8' : '#1e293b',
               color: process === tab.id ? '#0f172a' : '#94a3b8',
               fontWeight: 800,
               border: 'none',
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               gap: '8px',
               transition: 'all 0.2s'
             }}
           >
             {tab.icon} {tab.name}
           </button>
         ))}
      </div>

      {/* Main Interactive Zone */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: '40px',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.03)',
        padding: isMobile ? '20px' : '40px',
        borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        
        {/* Left: Interactive Visualizer */}
        <div style={{ position: 'relative', height: '350px', background: '#020617', borderRadius: '24px', overflow: 'hidden', border: '2px solid #334155' }}>
           <div style={{ 
             padding: '20px', 
             borderBottom: '1px solid #1e293b', 
             display: 'flex', 
             justifyContent: 'space-between',
             alignItems: 'center'
           }}>
              <span style={{ fontWeight: 800, color: '#38bdf8' }}>공정 모니터링: {process.toUpperCase()}</span>
              {isInjecting && <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 700 }}>● PROCESSING...</span>}
           </div>

           <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {/* Mold Base */}
              <div style={{ width: '200px', height: '140px', border: '5px solid #64748b', borderRadius: '8px', position: 'relative' }}>
                 {/* Material Filling Animation */}
                 <div style={{
                   position: 'absolute',
                   bottom: 0,
                   left: 0,
                   width: '100%',
                   height: isInjecting ? '100%' : '0%',
                   background: process === 'double' ? 'linear-gradient(to right, #3b82f6, #ef4444)' : '#38bdf8',
                   transition: 'height 2s cubic-bezier(0.4, 0, 0.2, 1)',
                   opacity: 0.8
                 }}/>
                 <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', textAlign: 'center' }}>
                    {isInjecting ? 'MATERIAL FLOWING...' : 'WAITING FOR SHOT'}
                 </div>
              </div>
              
              {/* Extrusion Line (Extra Visual for Extrusion) */}
              {process.includes('extrusion') && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  width: '100px',
                  height: '40px',
                  background: '#1e293b',
                  animation: isInjecting ? 'slideRight 2s linear infinite' : 'none'
                }}/>
              )}
           </div>

           <div style={{ padding: '0 20px 20px' }}>
              <button 
                onClick={startAnimation}
                disabled={isInjecting}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: isInjecting ? '#334155' : '#38bdf8',
                  color: isInjecting ? '#94a3b8' : '#0f172a',
                  fontWeight: 900,
                  border: 'none',
                  cursor: isInjecting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Zap size={20} /> 실시간 공정 시작
              </button>
           </div>
           <style>{`
             @keyframes slideRight {
               from { transform: translateX(0); width: 0; }
               to { transform: translateX(100px); width: 100px; }
             }
           `}</style>
        </div>

        {/* Right: Technical Explanation & Logic */}
        <div>
           {process === 'injection' && (
             <div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#38bdf8', marginBottom: '16px' }}>🚀 일반 사출 (Injection Molding)</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '16px' }}>
                  가장 기본적인 공법입니다. 고체 펠렛을 녹여 금형 내부에 <b>고압</b>으로 밀어넣습니다. 
                  가로등 헤드의 바디(Body)나 브라켓 등을 대량 생산할 때 필수적입니다. <br/>
                  <br/>
                  <b>실무 Tip:</b> 금형 온도가 낮으면 성형 후 제품이 휘는 '변형(Warpage)'이 발생하므로 정확한 냉각 설계가 핵심입니다.
                </p>
             </div>
           )}
           {process === 'extrusion' && (
             <div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#38bdf8', marginBottom: '16px' }}>🧵 압출 (Extrusion Molding)</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '16px' }}>
                  금형의 단면 형상대로 <b>연속적으로 뽑아내는</b> 방식입니다. 국수 가닥을 뽑는 것과 비슷하죠. <br/>
                  가로등의 알루미늄 바디, 파이프, 긴 렌즈 쉴드 등을 만들 때 사용합니다. <br/>
                  <br/>
                  <b>장점:</b> 길이가 긴 제품을 일정한 품질로 빠르게 생산할 수 있으며, 금형비가 사출보다 저렴합니다.
                </p>
             </div>
           )}
           {process === 'double' && (
             <div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#f43f5e', marginBottom: '16px' }}>🎭 이중 사출 (Double Injection)</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '16px' }}>
                  현대 고급 가로등의 정수! <b>서로 다른 두 가지 소재</b>를 하나의 금형에서 연속으로 찍어냅니다. <br/>
                  예: 딱딱한 본체(PC) + 말랑한 방수 고무(TPU)를 본드 없이 일체형으로 결합합니다. <br/>
                  <br/>
                  <b>효과:</b> 조립 공정이 줄어들고 완벽한 방수(IP68) 구조를 구현할 수 있습니다.
                </p>
             </div>
           )}
           {process === 'co' && (
             <div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#fbbf24', marginBottom: '16px' }}>🧬 아중/이중 압출 (Co-Extrusion)</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '16px' }}>
                  압출 시 <b>두 개 이상의 층(Layer)</b>을 겹쳐서 뽑아냅니다. <br/>
                  가로등 커버를 만들 때 안쪽은 빛을 통과시키는 투명 PC, 바깥쪽은 자외선을 차단하는 UV 코팅층으로 동시에 성형하여 변색을 막습니다. <br/>
                  <br/>
                  <b>실무 적용:</b> 바닷가 염해 방지용 특수 피복재 등에 주로 쓰입니다.
                </p>
             </div>
           )}
        </div>
      </div>

      {/* Advanced Calculation Section */}
      <section style={{ 
        background: '#1e293b', 
        padding: isMobile ? '24px' : '40px', 
        borderRadius: '32px',
        border: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
           <Thermometer size={32} color="#fbbf24" />
           <h2 style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: 900 }}>사출 냉각 시간 정밀 산출 (Cost Control)</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '40px' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '12px', color: '#94a3b8' }}>제품 두께 (Thickness) : {coolingTime / 5}mm</label>
                <input type="range" min="5" max="50" value={coolingTime} onChange={(e)=>setCoolingTime(Number(e.target.value))} style={{ width: '100%', accentColor: '#fbbf24' }} />
              </div>
              <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                 <b>이론적 계산:</b> 냉각 시간은 <span style={{ color: '#fbbf24' }}>두께의 제곱</span>에 비례합니다. <br/>
                 두께가 2배 되면 냉각 시간은 4배! 이는 곧 공임비 상승으로 이어집니다. 
                 실무자는 필요 없는 살두께를 줄여 '사이클 타임'을 단축하는 것이 능력입니다.
              </p>
           </div>
           
           <div style={{ 
             background: '#0f172a', 
             borderRadius: '24px', 
             padding: '24px', 
             textAlign: 'center',
             display: 'flex',
             flexDirection: 'column',
             justifyContent: 'center'
           }}>
              <div style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '10px' }}>예상 사이클 타임 (Sec)</div>
              <div style={{ fontSize: '48px', fontWeight: 900, color: '#fbbf24' }}>{(coolingTime * 1.5).toFixed(1)} s</div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '10px' }}>* 초기 사출 및 금형 이동 시간 포함</div>
           </div>
        </div>
      </section>

      {/* Material Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
         {[
           { title: 'AL Diecasting', info: '알루미늄 용탕을 쏘는 방식. 방열 성능 최고.', focus: '가로등 본체' },
           { title: 'Polycarbonate', info: 'PC 소재. 충격에 매우 강하고 투명함.', focus: '커버/렌즈' },
           { title: 'ASA / ABS', info: '내후성 강한 특수 플라스틱. 변색 방지.', focus: '브라켓 외함' }
         ].map((box, i) => (
           <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 style={{ color: '#38bdf8', fontWeight: 800, marginBottom: '12px' }}>{box.title}</h4>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{box.info}</p>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px' }}>
                 <ArrowRight size={14} color="#38bdf8"/> 주요 용도: {box.focus}
              </div>
           </div>
         ))}
      </div>

      <footer style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
         <p style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>금형에 대한 이해가 깊을수록 최적의 디자인이 탄생합니다.</p>
      </footer>
    </div>
  );
}
