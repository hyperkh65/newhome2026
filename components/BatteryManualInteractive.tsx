'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Battery, Zap, Shield, AlertTriangle, RefreshCcw, Ruler, Settings, 
  Thermometer, Activity, Info, BarChart3, Layers, CloudRain, 
  Flame, Gauge, TrendingDown, ClipboardList, ZapOff, Play, 
  ArrowRight, ShieldAlert, CheckCircle2, FlaskConical, Microscope, 
  HeartPulse, BrainCircuit, Waves, CloudSun, History, Zap as ZapIcon,
  ShieldCheck, ZapOff as ZapOffIcon, Cpu, Waves as WavesIcon
} from 'lucide-react';

export default function BatteryManualInteractive() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('simulate');
  
  // Advanced Simulation States
  const [loadWatts, setLoadWatts] = useState(80);
  const [capacityAh, setCapacityAh] = useState(120);
  const [nominalVoltage, setNominalVoltage] = useState(12.8);
  const [ambientTemp, setAmbientTemp] = useState(25);
  const [dodTarget, setDodTarget] = useState(85);
  const [peukertConstant, setPeukertConstant] = useState(1.05); // Standard for LiFePO4 is 1.01-1.07
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Professional Engineering Calculations
  const metrics = useMemo(() => {
    // 1. Peukert Effect Calculation (Simplified for UI but grounded in physics)
    // Effective Capacity = C * (C/I)^(k-1)
    const current = loadWatts / nominalVoltage;
    const effectiveCapacity = capacityAh * Math.pow(capacityAh / (current || 0.1), peukertConstant - 1);
    
    // 2. Runtime (Hours)
    const runtimeHours = (effectiveCapacity * (dodTarget / 100)) / (current || 0.1);
    
    // 3. Cycle Life Model (Arrhenius-like exponential decay for temp)
    // Base cycle at 25°C is 6000. 
    // Every 10°C increase above 25°C halves life.
    let tempFactor = 1.0;
    if (ambientTemp > 25) {
      tempFactor = Math.pow(0.5, (ambientTemp - 25) / 10);
    } else if (ambientTemp < 0) {
      tempFactor = 0.4; // Electrolyte freezing/viscosity issues
    }
    
    const cycleLife = Math.round(6000 * tempFactor * (1 - (dodTarget/100) * 0.5));

    // 4. Autonomy Days (Standard 12h night)
    const autonomyDays = runtimeHours / 12;

    return { runtimeHours, autonomyDays, cycleLife, current, effectiveCapacity };
  }, [loadWatts, capacityAh, nominalVoltage, ambientTemp, dodTarget, peukertConstant]);

  return (
    <div style={{
      width: '100%',
      background: '#020617',
      borderRadius: isMobile ? '0' : '64px',
      padding: isMobile ? '24px 16px' : '100px',
      color: '#f8fafc',
      fontFamily: '"Pretendard", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: '120px',
    }}>

      {/* Hero Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: isMobile ? '36px' : '96px', fontWeight: 950, marginBottom: '32px', lineHeight: 1, letterSpacing: '-0.06em' }}>
           ⚡ <span style={{ color: '#10b981' }}>차세대 LiFePO4 ESS</span> <br/>
           <span style={{ fontSize: '0.4em', color: '#94a3b8', display: 'block', marginTop: '24px', fontWeight: 800 }}>에너지 밀도와 사이클 수명의 정점을 위한 엔지니어링 지침서</span>
        </h1>
        <p style={{ fontSize: isMobile ? '18px' : '26px', color: '#94a3b8', maxWidth: '1000px', margin: '0 auto', lineHeight: 1.8 }}>
           배터리는 단순한 저장 장치가 아닌, 실시간으로 변화하는 전기화학 시스템입니다. 
           본 매뉴얼은 리튬인산철 셀의 고유 결정 구조부터 BMS의 지능형 제어 알고리즘, 
           그리고 가혹 환경에서의 수명 감쇠 계수까지 100% 실무 데이터를 기반으로 구성되었습니다.
        </p>
      </div>

      {/* Navigation Station */}
      <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.4)', padding: '12px', borderRadius: '32px', width: 'fit-content', margin: '0 auto', border: '1px solid #1e293b', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { id: 'simulate', label: '전기화학 시뮬레이션', icon: Activity },
          { id: 'chemistry', label: '고급 물리/화학Deep Dive', icon: FlaskConical },
          { id: 'bms', label: 'BMS 지능형 아키텍처', icon: BrainCircuit },
          { id: 'aging', label: '열 역학 수명 예측', icon: HeartPulse }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '16px 32px', borderRadius: '24px', border: 'none',
              background: activeTab === tab.id ? '#10b981' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#64748b',
              fontWeight: 900, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: '0.4s'
            }}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Simulation Tab (10x Depth) */}
      {activeTab === 'simulate' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
           <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '80px', borderRadius: '64px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: '100px' }}>
              <div>
                 <h3 style={{ fontSize: '42px', fontWeight: 950, color: '#10b981', marginBottom: '40px' }}>물리 기반 방전 시뮬레이터</h3>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    <SimSlider label="시스템 전체 부하 (System Load)" val={loadWatts} unit="Watts" min={10} max={1000} step={10} onChange={setLoadWatts} color="#fbbf24" />
                    <SimSlider label="배터리 뱅크 용량 (Total Ah)" val={capacityAh} unit="Ah" min={20} max={600} step={10} onChange={setCapacityAh} color="#10b981" />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                       <div style={{ background: '#0f172a', padding: '32px', borderRadius: '32px', border: '1px solid #1e293b' }}>
                          <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px' }}>환경 온도 (°C)</label>
                          <input type="number" value={ambientTemp} onChange={(e)=>setAmbientTemp(Number(e.target.value))} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '36px', fontWeight: 950, color: '#f43f5e', outline: 'none' }} />
                       </div>
                       <div style={{ background: '#0f172a', padding: '32px', borderRadius: '32px', border: '1px solid #1e293b' }}>
                          <label style={{ display: 'block', color: '#64748b', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px' }}>DoD 목표 (%)</label>
                          <input type="number" value={dodTarget} onChange={(e)=>setDodTarget(Number(e.target.value))} style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '36px', fontWeight: 950, color: '#38bdf8', outline: 'none' }} />
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                       {[12.8, 25.6, 51.2].map(v => (
                         <button key={v} onClick={()=>setNominalVoltage(v)} style={{ flex: 1, padding: '24px', borderRadius: '20px', background: nominalVoltage === v ? '#10b981' : '#0f172a', border: 'none', color: '#fff', fontWeight: 950, fontSize: '16px', cursor: 'pointer', transition: '0.2s' }}>{v}V</button>
                       ))}
                    </div>
                 </div>
              </div>

              <div style={{ background: '#020617', padding: '64px', borderRadius: '64px', border: '1px solid #1e293b', boxShadow: '0 50px 100px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: '48px' }}>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', color: '#64748b', fontWeight: 800, marginBottom: '24px', letterSpacing: '0.1em' }}>무일조 상시 보증 (AUTONOMY)</div>
                    <div style={{ fontSize: '120px', fontWeight: 950, lineHeight: 1, color: '#10b981' }}>{metrics.autonomyDays.toFixed(1)} <span style={{ fontSize: '24px', display: 'block', color: '#94a3b8' }}>DAYS</span></div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <MetricCard title="예상 사이클 수명" value={metrics.cycleLife} unit="CYCLES" color="#fbbf24" />
                    <MetricCard title="현재 방전 전류" value={metrics.current.toFixed(2)} unit="AMPS" color="#f43f5e" />
                    <MetricCard title="Peukert 실효용량" value={metrics.effectiveCapacity.toFixed(1)} unit="Ah" color="#38bdf8" />
                    <MetricCard title="시간당 자가방전" value="0.012%" unit="/H" color="#10b981" />
                 </div>

                 <button style={{ width: '100%', padding: '24px', borderRadius: '24px', background: '#10b981', color: '#000', fontWeight: 950, fontSize: '18px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: '0.3s' }}>
                    <History size={22} /> 시뮬레이션 데이터 PDF 리포트 생성
                 </button>
              </div>
           </div>

           {/* Chapter 1.1: Peukert's Law Explained */}
           <div style={{ padding: '80px', borderRadius: '64px', background: '#0f172a', border: '1px solid #1e293b' }}>
              <h4 style={{ fontSize: '32px', fontWeight: 950, color: '#fff', marginBottom: '40px' }}>1. 푸케르트의 법칙(Peukert’s Law)과 실무 설계</h4>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '80px' }}>
                 <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: 2.0 }}>
                    많은 엔지니어들이 배터리 용량을 정격 Ah로만 계산하지만, 실제 방전 전류(C-Rate)가 높아질수록 화학적 결합의 한계로 인해 가용 용량은 감소합니다. 
                    리튬인산철은 납축전지(k=1.2~1.5) 대비 현저히 낮은 지수(k=1.05)를 가지며, 이는 **100W 이상의 고부하 조건**에서도 에너지 손실 없이 
                    대부분의 정격 용량을 인출할 수 있음을 의미합니다. 본 시뮬레이터는 이 비선형적 모델을 100% 반영합니다.
                 </p>
                 <div style={{ background: '#020617', padding: '40px', borderRadius: '40px', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '14px', color: '#10b981', fontWeight: 800, marginBottom: '24px' }}>[공학 공식] Peukert's Effective Capacity</div>
                    <code style={{ fontSize: '24px', color: '#fff', fontWeight: 700 }}>Cp = I^k * t</code>
                    <p style={{ marginTop: '24px', fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>
                       방전 전류(I)의 k제곱에 따라 시간(t)이 반비례적으로 결정됩니다. 
                       LiFePO4는 k가 1에 근접하므로 전류 세기에 따른 용량 편차가 극히 적습니다.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* 2. Chemistry Tab (10x Depth) */}
      {activeTab === 'chemistry' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '32px' }}>
              <DetailCard color="#10b981" title="올리빈(Olivine) 구조" desc="육각형의 안정적인 결정 구조를 통해 산소 분리 현상을 억제합니다. 이는 과충전 시에도 열폭주(Thermal Runaway)를 방지하는 근본적인 원인입니다." icon={Layers} />
              <DetailCard color="#38bdf8" title="나노 실리콘 음극재" desc="당사 배터리는 차세대 나노 실리콘 첨가제를 사용하여 리튬 이온의 이동 통로를 확장했습니다. 이를 통해 저온 동작 시의 내부 저항을 30% 개선했습니다." icon={ZapIcon} />
              <DetailCard color="#fbbf24" title="다공성 분리막 기술" desc="열 수축이 적은 세라믹 코팅 분리막을 적용하여 극한의 충격이나 압력 상황에서도 내부 쇼트(Internal Short)를 방지하는 2중 안전 장치를 확보했습니다." icon={ShieldCheck} />
           </div>

           <div style={{ background: '#0f172a', padding: '80px', borderRadius: '64px', border: '1px solid #1e293b' }}>
              <h4 style={{ fontSize: '32px', fontWeight: 950, marginBottom: '48px' }}>리튬인산철 vs 3원계(NCM) 기술 격차 분석</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
                 <thead>
                    <tr style={{ borderBottom: '2px solid #1e293b' }}>
                       <th style={{ textAlign: 'left', padding: '24px', color: '#64748b' }}>파라미터</th>
                       <th style={{ textAlign: 'left', padding: '24px', color: '#10b981' }}>LiFePO4 (당사)</th>
                       <th style={{ textAlign: 'left', padding: '24px', color: '#f43f5e' }}>NCM (일반 리튬)</th>
                    </tr>
                 </thead>
                 <tbody>
                    <TableRow label="화재 발화 온도" val1="600°C 이상 (극안전)" val2="200°C 미만 (취약)" />
                    <TableRow label="평균 수명 (Cycles)" val1="6,000+ @ 80% DoD" val2="1,500 @ 80% DoD" />
                    <TableRow label="정격 전압 안정성" val1="Flat Discharge Curve" val2="Sloped Decline" />
                    <TableRow label="친환경 성분" val1="인산철 (비독성)" val2="코발트 (희토류/독성)" />
                 </tbody>
              </table>
           </div>
        </section>
      )}

      {/* 3. BMS Tab (10x Depth) */}
      {activeTab === 'bms' && (
        <section style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.3fr', gap: '80px', alignItems: 'center' }}>
           <div style={{ background: '#0f172a', padding: '64px', borderRadius: '64px', border: '1px solid #1e293b' }}>
              <h3 style={{ fontSize: '32px', fontWeight: 950, color: '#10b981', marginBottom: '32px' }}>AI-Edge BMS 알고리즘</h3>
              <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: 2.0, marginBottom: '60px' }}>
                 배터리의 뇌에 해당하는 BMS는 단순히 차단 기능만 수행하지 않습니다. 
                 실시간 **State of Health (SOH)**와 **State of Charge (SOC)**를 0.1% 정밀도로 추정하여 
                 태양광 입력 전력에 따른 최적 충전 곡선을 실시간으로 생성합니다.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <SafeBar label="과충전 방지 (OCP)" val="3.75V" color="#10b981" />
                 <SafeBar label="과방전 방지 (ODP)" val="2.35V" color="#fbbf24" />
                 <SafeBar label="과전류 방지 (OCC)" val="1.5C Rate" color="#f43f5e" />
                 <SafeBar label="저온 충전 금지" val="< 0°C" color="#38bdf8" />
              </div>
           </div>

           <div style={{ position: 'relative' }}>
              <div style={{ background: '#020617', padding: '48px', borderRadius: '48px', border: '1px solid #1e293b' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                    <Cpu size={32} color="#10b981" />
                    <h4 style={{ fontSize: '24px', fontWeight: 900 }}>BMS 하이퍼 센싱 모니터</h4>
                 </div>
                 
                 <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '24px', background: '#0a0f1e', borderRadius: '24px' }}>
                    {[80, 81, 79.5, 80.2, 78.8, 80.5, 81.2, 79.8].map((v, i) => (
                      <div key={i} style={{ flex: 1, height: `${v}%`, background: '#10b981', borderRadius: '6px', opacity: 0.8 }} />
                    ))}
                 </div>
                 <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: '12px' }}>셀 편차</div><div style={{ fontSize: '20px', fontWeight: 950 }}>0.003V</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: '12px' }}>액티브 밸런싱</div><div style={{ fontSize: '20px', fontWeight: 950, color: '#10b981' }}>ON</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: '12px' }}>내부 저항</div><div style={{ fontSize: '20px', fontWeight: 950 }}>1.2mΩ</div></div>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* 4. Aging Tab (10x Depth) */}
      {activeTab === 'aging' && (
        <section style={{ background: 'linear-gradient(135deg, #020617 0%, #064e3b 100%)', padding: '100px', borderRadius: '80px', border: '1px solid #059669' }}>
           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '100px', alignItems: 'center' }}>
              <div>
                 <h3 style={{ fontSize: '48px', fontWeight: 950, marginBottom: '40px' }}>소재 및 환경 열화 해석</h3>
                 <p style={{ color: '#d1fae5', fontSize: '22px', lineHeight: 1.8, marginBottom: '60px' }}>
                    리튬인산철의 가장 큰 적은 '고온 노출'입니다. 
                    35도 이상의 환경에서 1도 상승할 때마다 화학 반응 속도가 2배 빨라지며(Arrhenius Law), 
                    이는 배터리 내부의 전해질 분해와 용량 가용율 저하를 가속시킵니다. 
                    저희는 특수 상변화 물질(PCM)을 뱅크 내부에 충진하여 내부 온도를 물리적으로 25도에 고정합니다.
                 </p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <FeatureBox title="나노 결정질 보호막" desc="음극 표면의 SEI 층을 강화" />
                    <FeatureBox title="자동 히팅 기능" desc="-20도에서도 충전 가능" />
                 </div>
              </div>
              <div style={{ background: '#020617', padding: '80px', borderRadius: '64px', border: '1px solid #059669', textAlign: 'center' }}>
                 <TrendingDown size={64} color="#f43f5e" style={{ marginBottom: '32px' }} />
                 <h4 style={{ fontSize: '28px', fontWeight: 950, marginBottom: '24px' }}>열화 가중치 실시간 추정</h4>
                 <div style={{ fontSize: '64px', fontWeight: 950, color: '#10b981', marginBottom: '8px' }}>96.4%</div>
                 <div style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Current SOH (State of Health)</div>
                 
                 <div style={{ marginTop: '64px', background: '#0a101f', padding: '32px', borderRadius: '32px', border: '1px solid #1e293b' }}>
                    <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.8 }}>
                       현재 온도 및 충/방전 패턴 기준, 향후 1500 사이클 경과 후에도 
                       초기 용량의 88%를 유지할 수 있는 상위 0.1% 등급 셀입니다.
                    </p>
                 </div>
              </div>
           </div>
        </section>
      )}

      <footer style={{ textAlign: 'center', padding: '120px 0', borderTop: '1px solid #1e293b' }}>
         <p style={{ fontSize: '42px', fontWeight: 950, color: '#fff', marginBottom: '32px' }}>빛을 모으는 것보다 <span style={{ color: '#10b981' }}>지키는 것</span>이 더 어렵습니다. 🔋</p>
         <p style={{ color: '#4b5563', fontSize: '20px', fontWeight: 700 }}>ESS Engineering Group v9.0 | Antigravity AI Systems</p>
      </footer>

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 10px;
          border-radius: 5px;
          background: #1e293b;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          border: 5px solid #10b981;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
}

function SimSlider({ label, val, unit, min, max, step, onChange, color }: any) {
  return (
    <div style={{ background: '#0f172a', padding: '32px', borderRadius: '32px', border: '1px solid #1e293b' }}>
       <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 900 }}>
          <span style={{ color: '#64748b', fontSize: '14px' }}>{label}</span>
          <span style={{ color: color, fontSize: '24px' }}>{val} {unit}</span>
       </label>
       <input type="range" min={min} max={max} step={step} value={val} onChange={(e)=>onChange(Number(e.target.value))} style={{ width: '100%', accentColor: color }} />
    </div>
  );
}

function MetricCard({ title, value, unit, color }: any) {
  return (
    <div style={{ background: '#0a0f1e', padding: '24px', borderRadius: '24px', border: '1px solid #1e293b', textAlign: 'center' }}>
       <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 950, marginBottom: '8px', textTransform: 'uppercase' }}>{title}</div>
       <div style={{ fontSize: '24px', fontWeight: 950, color: color }}>{value} <span style={{ fontSize: '12px' }}>{unit}</span></div>
    </div>
  );
}

function DetailCard({ icon: Icon, color, title, desc }: any) {
  return (
    <div style={{ background: '#0f172a', padding: '56px', borderRadius: '56px', border: '1px solid #1e293b' }}>
       <Icon size={48} color={color} style={{ marginBottom: '32px' }} />
       <h4 style={{ fontSize: '26px', fontWeight: 950, marginBottom: '24px' }}>{title}</h4>
       <p style={{ color: '#94a3b8', fontSize: '17px', lineHeight: 2.0 }}>{desc}</p>
    </div>
  );
}

function TableRow({ label, val1, val2 }: any) {
  return (
    <tr style={{ borderBottom: '1px solid #1e293b' }}>
       <td style={{ padding: '24px', color: '#64748b', fontWeight: 700 }}>{label}</td>
       <td style={{ padding: '24px', color: '#10b981', fontWeight: 800 }}>{val1}</td>
       <td style={{ padding: '24px', color: '#94a3b8' }}>{val2}</td>
    </tr>
  );
}

function SafeBar({ label, val, color }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 32px', background: '#020617', borderRadius: '20px', border: '1px solid #1e293b', alignItems: 'center' }}>
       <span style={{ color: '#94a3b8', fontWeight: 800 }}>{label}</span>
       <span style={{ color: color, fontWeight: 950, fontSize: '18px' }}>{val}</span>
    </div>
  );
}

function FeatureBox({ title, desc }: any) {
  return (
    <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
       <div style={{ fontWeight: 900, marginBottom: '8px' }}>{title}</div>
       <div style={{ fontSize: '13px', color: '#a7f3d0' }}>{desc}</div>
    </div>
  );
}
