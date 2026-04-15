'use client';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Easing } from 'remotion';
import React, { useState, useEffect } from 'react';
import { Compass, ThermometerSun, ShieldAlert, Cpu, Zap, BatteryCharging, ChevronRight, Sun } from 'lucide-react';

const FadeIn = ({ children, frameRange, translateYStart = 30, style, className }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, frameRange, [0, 1], { easing: Easing.out(Easing.quad), extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const translateY = interpolate(frame, frameRange, [translateYStart, 0], { easing: Easing.out(Easing.quad), extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  return <div style={{ opacity, transform: `translateY(${translateY}px)`, display: 'flex', flexDirection: 'column', ...style }} className={className}>{children}</div>;
};

// Scene 1: Sun Angle & Peak Hours
const SunAngleScene = () => {
  const frame = useCurrentFrame();
  const sunArc = interpolate(frame, [30, 200], [180, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const sunX = Math.cos((sunArc * Math.PI) / 180) * 300;
  const sunY = -Math.sin((sunArc * Math.PI) / 180) * 200;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', color: 'white', background: '#020617' }}>
      <div style={{ display: 'flex', maxWidth: 1400, width: '100%', padding: '0 40px', gap: 60, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
          <FadeIn frameRange={[10, 40]}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(234,88,12,0.1)', borderRadius: 50, color: '#f97316', fontWeight: 800, fontSize: 16 }}>
              <Compass size={20} /> 전문가 체크포인트 01
            </div>
            <h2 style={{ fontSize: 48, fontWeight: 900, margin: '16px 0', wordBreak: 'keep-all', lineHeight: 1.2 }}>
              일조 시간 및<br/>최적 설치 각도
            </h2>
          </FadeIn>
          <FadeIn frameRange={[40, 70]}>
            <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.7)', wordBreak: 'keep-all', lineHeight: 1.6 }}>
              태양광 패널은 <b>정남향(방위각 180도)</b>을 향하는 것이 기본이며, 대한민국의 경우 <b>설치 각도는 30도~35도</b>가 연간 평균 효율을 극대화합니다.
            </p>
          </FadeIn>
          <FadeIn frameRange={[70, 100]}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
              <h4 style={{ color: 'white', fontSize: 20, marginBottom: 12, fontWeight: 800 }}>일평균 일조시간 (Peak Sun Hours)</h4>
              <p style={{ fontSize: 16, color: '#cbd5e1', wordBreak: 'keep-all', lineHeight: 1.6 }}>
                대한민국 기준 하루 3.5 ~ 4시간을 기준(Worst Month 반영 시 3.0시간 이하)으로 잡아야 안정적인 시스템 설계가 가능합니다. 그늘짐(음영)이 발생하면 직렬 연결된 패널 전체 효율이 급감하므로 현장 실사가 필수적입니다.
              </p>
            </div>
          </FadeIn>
        </div>
        
        {/* Animated Visual */}
        <FadeIn frameRange={[30, 60]} style={{ flex: 1, position: 'relative', height: 400, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          {/* Arc path */}
          <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, borderTopLeftRadius: 300, borderTopRightRadius: 300, border: '2px dashed rgba(255,255,255,0.2)', borderBottom: 'none' }} />
          {/* Animated Sun */}
          <div style={{ position: 'absolute', bottom: 50, left: '50%', transform: `translate(calc(-50% + ${sunX}px), ${sunY}px)` }}>
            <div style={{ width: 64, height: 64, background: 'radial-gradient(circle, #fbbf24 0%, transparent 80%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px #fbbf24', animation: 'spin 10s linear infinite' }}>
              <Sun size={32} color="white" />
            </div>
          </div>
          {/* Panel */}
          <div style={{ width: 200, height: 8, background: '#cbd5e1', transform: 'rotate(-30deg)', position: 'absolute', bottom: 60, left: 'calc(50% - 100px)', borderRadius: 4, display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
             {[...Array(8)].map((_,i) => <div key={i} style={{ width: 25, height: '100%', borderRight: '1px solid #1e293b' }} />)}
          </div>
          <div style={{ position: 'absolute', bottom: 20, color: 'white', fontWeight: 800, fontSize: 18, background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: 20 }}>30° 정남향</div>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Battery Comparison
const BatteryComparisonScene = () => {
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', color: 'white', background: '#020617' }}>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1400, width: '100%', padding: '0 40px' }}>
          <FadeIn frameRange={[10, 40]} style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(56,189,248,0.1)', borderRadius: 50, color: '#38bdf8', fontWeight: 800, fontSize: 16 }}>
              <BatteryCharging size={20} /> 전문가 체크포인트 02
            </div>
            <h2 style={{ fontSize: 48, fontWeight: 900, margin: '16px 0', wordBreak: 'keep-all' }}>배터리 소재별 장단점 비교</h2>
          </FadeIn>
          
          <div style={{ display: 'flex', gap: 24 }}>
            {/* Lead-Acid */}
            <FadeIn frameRange={[40, 70]} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.1)' }}>
               <h3 style={{ fontSize: 24, fontWeight: 800, color: '#94a3b8', marginBottom: 16 }}>납축 전지 (Gel / AGM)</h3>
               <p style={{ color: '#cbd5e1', fontSize: 16, lineHeight: 1.6, wordBreak: 'keep-all', minHeight: 80 }}>초기 구축 비용이 저렴하여 과거에 주로 사용되었으나 무겁고 수명이 짧습니다.</p>
               <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}><span>수명</span> <b>300~500회</b></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}><span>DOD (방전심도)</span> <b>50% 이하 권장</b></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f87171' }}><span>특징</span> <b>과방전 시 영구 손상</b></div>
               </div>
            </FadeIn>

            {/* Li-ion */}
            <FadeIn frameRange={[70, 100]} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.1)' }}>
               <h3 style={{ fontSize: 24, fontWeight: 800, color: '#60a5fa', marginBottom: 16 }}>리튬 이온 (Li-ion)</h3>
               <p style={{ color: '#cbd5e1', fontSize: 16, lineHeight: 1.6, wordBreak: 'keep-all', minHeight: 80 }}>에너지 밀도가 가장 높아 크기가 매우 작으나, 열에 매우 취약한 구조입니다.</p>
               <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#60a5fa' }}><span>수명</span> <b>800~1,000회</b></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#60a5fa' }}><span>DOD (방전심도)</span> <b>80%</b></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}><span>리스크</span> <b>화재/폭발 위험성</b></div>
               </div>
            </FadeIn>

            {/* LiFePO4 */}
            <FadeIn frameRange={[100, 130]} style={{ flex: 1, background: 'rgba(56,189,248,0.1)', borderRadius: 24, padding: 32, border: '2px solid rgba(56,189,248,0.4)', boxShadow: '0 0 40px rgba(56,189,248,0.1)' }}>
               <div style={{ display: 'inline-block', background: '#38bdf8', color: '#020617', padding: '4px 12px', borderRadius: 12, fontWeight: 800, fontSize: 12, marginBottom: 12 }}>MOST RECOMMENDED</div>
               <h3 style={{ fontSize: 28, fontWeight: 800, color: '#38bdf8', marginBottom: 16 }}>리튬 인산철 (LiFePO4)</h3>
               <p style={{ color: 'white', fontSize: 16, lineHeight: 1.6, wordBreak: 'keep-all', minHeight: 50 }}>현재 태양광 가로등의 최적 소재. 열화학적으로 매우 안정되어 폭발 위험이 없습니다.</p>
               <div style={{ marginTop: 20, borderTop: '1px solid rgba(56,189,248,0.2)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}><span>수명</span> <b>2,000~3,000회 이상</b></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}><span>DOD (방전심도)</span> <b>90% 이상</b></div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}><span>장점</span> <b>극한 온도 내구성 우수</b></div>
               </div>
            </FadeIn>
          </div>
        </div>
      </AbsoluteFill>
    );
};

// Scene 3: MPPT vs PWM Logic
const ControllerTechScene = () => {
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', color: 'white', background: '#020617' }}>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1400, width: '100%', padding: '0 40px' }}>
          <FadeIn frameRange={[10, 40]} style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(16,185,129,0.1)', borderRadius: 50, color: '#10b981', fontWeight: 800, fontSize: 16 }}>
              <Cpu size={20} /> 전문가 체크포인트 03
            </div>
            <h2 style={{ fontSize: 48, fontWeight: 900, margin: '16px 0', wordBreak: 'keep-all' }}>컨트롤러 딥다이브: PWM vs MPPT</h2>
          </FadeIn>

          <div style={{ display: 'flex', gap: 60 }}>
             <FadeIn frameRange={[40, 70]} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '100%', height: 260, background: 'rgba(255,255,255,0.05)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <h3 style={{ fontSize: 32, fontWeight: 900, color: '#94a3b8' }}>PWM <span style={{ fontSize: 14, fontWeight: 500 }}>(Pulse Width Modulation)</span></h3>
                    <p style={{ fontSize: 18, color: '#cbd5e1', wordBreak: 'keep-all', lineHeight: 1.6 }}>
                        패널에서 생산된 18V 전압을 배터리 규격(예: 12V)에 맞게 강제로 깎아냅니다. <b>나머지 전압(약 6V)은 열로 소실되어 버려집니다.</b> 여름철에는 무방하나, 일조량이 적은 겨울에는 충전 부족을 유발합니다.
                    </p>
                </div>
             </FadeIn>

             <FadeIn frameRange={[70, 100]} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '100%', height: 260, background: 'rgba(16,185,129,0.05)', borderRadius: 24, border: '1px solid rgba(16,185,129,0.3)', padding: 32, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -15, right: -15, background: '#10b981', color: 'white', padding: '6px 16px', borderRadius: 20, fontWeight: 900 }}>최대 +30% 효율</div>
                    <h3 style={{ fontSize: 32, fontWeight: 900, color: '#10b981' }}>MPPT <span style={{ fontSize: 14, fontWeight: 500 }}>(Max Power Point Tracking)</span></h3>
                    <p style={{ fontSize: 18, color: '#e2e8f0', wordBreak: 'keep-all', lineHeight: 1.6 }}>
                        버려지는 전압을 <b>스마트하게 전류(A)로 변환</b>하여 배터리에 밀어 넣습니다. 아침저녁 약한 빛이나 구름 낀 날씨에서도 에너지를 남김없이 쥐어짜내 충전합니다. 고성능 가로등의 필수 요건입니다.
                    </p>
                </div>
             </FadeIn>
          </div>
        </div>
      </AbsoluteFill>
    );
};

export const DeepDiveComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#020617', overflow: 'hidden' }}>
      <Sequence from={0} durationInFrames={350}>
        <SunAngleScene />
      </Sequence>
      <Sequence from={350} durationInFrames={350}>
        <BatteryComparisonScene />
      </Sequence>
      <Sequence from={700} durationInFrames={400}>
        <ControllerTechScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default function SolarTechDeepDive() {
  const [dim, setDim] = useState({ w: 1920, h: 1080 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
        const width = document.getElementById('deepdive-remotion-container')?.clientWidth || window.innerWidth;
        setDim({ w: width, h: width * (1080/1920) });
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!mounted) return <div style={{ width: '100%', aspectRatio: '16/9', background: '#020617', borderRadius: 24 }} />;

  return (
    <div id="deepdive-remotion-container" style={{ width: '100%', position: 'relative', overflow: 'hidden', background: '#020617', borderRadius: 24, boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <Player
        component={DeepDiveComposition}
        durationInFrames={1100}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={60}
        style={{ width: '100%', height: 'auto', aspectRatio: '16/9', background: 'transparent' }}
        controls
        autoPlay
        loop
      />
    </div>
  );
}
