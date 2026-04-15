'use client';
import { Player } from '@remotion/player';
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Easing, Img } from 'remotion';
import React, { useState, useEffect } from 'react';
import { Sun, Battery, Zap, Cpu, Lightbulb, Settings, Info, Cable, CheckCircle2, ListFilter } from 'lucide-react';

const FadeIn = ({ children, frameRange, translateYStart = 30, style, className }: any) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, frameRange, [0, 1], { easing: Easing.out(Easing.quad), extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const translateY = interpolate(frame, frameRange, [translateYStart, 0], { easing: Easing.out(Easing.quad), extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  return <div style={{ opacity, transform: `translateY(${translateY}px)`, display: 'flex', flexDirection: 'column', ...style }} className={className}>{children}</div>;
};

// Scene 1: Intro
const IntroScene = () => {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', color: 'white', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FadeIn frameRange={[10, 40]} style={{ alignItems: 'center' }}>
        <div style={{ padding: '12px 30px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: 50, border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontWeight: 800, fontSize: 14, letterSpacing: 2 }}>
          가로등 시스템 종합 마스터
        </div>
      </FadeIn>
      <FadeIn frameRange={[40, 70]} style={{ alignItems: 'center' }}>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 900, textAlign: 'center', margin: 0, textShadow: '0 10px 30px rgba(0,0,0,0.5)', wordBreak: 'keep-all' }}>
          태양광 LED 솔루션<br/>
          <span style={{ color: '#fbbf24' }}>완벽 실무 가이드</span>
        </h1>
      </FadeIn>
      <FadeIn frameRange={[70, 100]} style={{ alignItems: 'center' }}>
        <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.7)', marginTop: 20, wordBreak: 'keep-all', textAlign: 'center' }}>
          패널 효율부터 배터리 용량 산정, 결선 방법, 그리고 컨트롤러 세팅까지.
        </p>
      </FadeIn>
    </AbsoluteFill>
  );
};

// Scene 2: Panel & Efficiency
const PanelScene = () => {
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      <div style={{ display: 'flex', maxWidth: 1400, width: '100%', padding: '0 40px', gap: 60, alignItems: 'center' }}>
        <FadeIn frameRange={[10, 40]} translateYStart={0} style={{ flex: 1, minWidth: 400, maxWidth: 500, position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)', zIndex: 0 }} />
          <Img src="/solar-panel.png" style={{ width: '100%', objectFit: 'contain', zIndex: 1, position: 'relative', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
        </FadeIn>
        
        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
          <FadeIn frameRange={[30, 60]}>
             <h2 style={{ fontSize: 48, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 20, wordBreak: 'keep-all' }}>
               <Sun size={44} color="#fbbf24" /> 태양광 패널: 종류와 효율
             </h2>
          </FadeIn>
          
          <FadeIn frameRange={[60, 90]}>
             <p style={{ fontSize: 22, lineHeight: 1.6, color: '#e2e8f0', margin: 0, wordBreak: 'keep-all' }}>
               효율적인 발전을 위해서는 환경에 맞는 패널을 선택해야 합니다. 일반적으로 모노(단결정) 패널이 좁은 지붕이나 가로등 상단에 가장 유리합니다.
             </p>
          </FadeIn>

          <FadeIn frameRange={[90, 120]}>
            <div style={{ display: 'flex', gap: 24, marginTop: 10, width: '100%' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16, border: '1px solid rgba(251,191,36,0.3)' }}>
                <h4 style={{ color: '#fbbf24', fontSize: 20, marginBottom: 12, fontWeight: 800 }}>단결정 (Mono)</h4>
                <p style={{ fontSize: 16, color: '#94a3b8', wordBreak: 'keep-all', lineHeight: 1.5 }}>효율 18~22%. 좁은 면적에서 높은 전력 생산. 단가가 높으나 가로등에 최적화.</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ color: 'white', fontSize: 20, marginBottom: 12, fontWeight: 800 }}>다결정 (Poly)</h4>
                <p style={{ fontSize: 16, color: '#94a3b8', wordBreak: 'keep-all', lineHeight: 1.5 }}>효율 15~17%. 면적이 넓은 곳에 유리하며 가성비가 좋으나 최근 사용 빈도가 줄어듦.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Controller Reading & Setting
const ControllerScene = () => {
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        <div style={{ display: 'flex', maxWidth: 1400, width: '100%', padding: '0 40px', gap: 60, alignItems: 'center', flexDirection: 'row-reverse' }}>
          
          <FadeIn frameRange={[10, 40]} translateYStart={0} style={{ flex: 1, minWidth: 400, maxWidth: 500, position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', zIndex: 0 }} />
            <Img src="/solar-controller.png" style={{ width: '100%', objectFit: 'contain', zIndex: 1, position: 'relative', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
          </FadeIn>
          
          <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <FadeIn frameRange={[30, 60]}>
               <h2 style={{ fontSize: 48, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 20, wordBreak: 'keep-all' }}>
                 <Cpu size={44} color="#10b981" /> 컨트롤러 타입 및 설정법
               </h2>
            </FadeIn>
            <FadeIn frameRange={[60, 90]}>
               <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                 <span style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.2)', color: '#34d399', borderRadius: 8, fontWeight: 800 }}>MPPT (추천)</span>
                 <span style={{ fontSize: 18, color: '#e2e8f0', alignSelf: 'center', wordBreak: 'keep-all' }}>전압을 변환하여 효율을 최대 30% 끌어올림. 가을/겨울철 필수.</span>
               </div>
               <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                 <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: 8, fontWeight: 800 }}>PWM</span>
                 <span style={{ fontSize: 18, color: '#94a3b8', alignSelf: 'center', wordBreak: 'keep-all' }}>저비용 단순 구조. 패널 전압을 깎아내려 손실이 큼.</span>
               </div>
            </FadeIn>
            <FadeIn frameRange={[90, 120]}>
               <div style={{ background: 'rgba(16,185,129,0.05)', padding: 24, borderRadius: 16, border: '1px solid rgba(16,185,129,0.3)', width: '100%' }}>
                  <h4 style={{ color: '#10b981', fontSize: 20, marginBottom: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}><ListFilter size={20}/> 컨트롤러 상태 읽기 및 세팅</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 18, color: '#cbd5e1' }}>
                    <li style={{ wordBreak: 'keep-all' }}>1. <b>LED 표시부</b>: [Solar] 깜빡임(충전중), [Battery] 녹색(완충)/빨간색(저전압)</li>
                    <li style={{ wordBreak: 'keep-all' }}>2. <b>부하 설정 (Load Set)</b>: 야간 점등시간 조절 (예: 24H=상시, 1~14H=타이머, 0H=일몰~일출)</li>
                    <li style={{ wordBreak: 'keep-all' }}>3. <b>배터리 타입 설정(B01~03)</b>: 리튬이온/인산철/납축 전압체계가 다르므로 맞춤 셋팅 필수.</li>
                  </ul>
               </div>
            </FadeIn>
          </div>
        </div>
      </AbsoluteFill>
    );
};

// Scene 4: Battery Sizing & Specs
const BatteryScene = () => {
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        <div style={{ display: 'flex', maxWidth: 1400, width: '100%', padding: '0 40px', gap: 60, alignItems: 'center' }}>
          
          <FadeIn frameRange={[10, 40]} translateYStart={0} style={{ flex: 1, display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
             <div style={{ background: 'rgba(56,189,248,0.1)', padding: 40, borderRadius: 24, border: '1px solid rgba(56,189,248,0.3)', textAlign: 'center' }}>
                 <Battery size={80} color="#38bdf8" style={{ margin: '0 auto 20px' }} />
                 <h3 style={{ fontSize: 32, fontWeight: 900, color: '#38bdf8' }}>LiFePO4</h3>
                 <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', margin: '10px 0 0' }}>리튬 인산철 (권장)<br/>수명 2000회 이상 / 화재안전성 우수</p>
             </div>
          </FadeIn>
          
          <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <FadeIn frameRange={[30, 60]}>
               <h2 style={{ fontSize: 48, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 20, wordBreak: 'keep-all' }}>
                 배터리 용량 선정 방법
               </h2>
            </FadeIn>
            
            <FadeIn frameRange={[60, 90]}>
               <p style={{ fontSize: 22, lineHeight: 1.6, color: '#e2e8f0', margin: 0, wordBreak: 'keep-all' }}>
                 흐린 날(불조일)을 버티기 위한 설계가 가장 중요합니다. 일반적으로 3~5일 연속 점등을 목표로 배터리를 계산합니다.
               </p>
            </FadeIn>
            
            <FadeIn frameRange={[90, 120]}>
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', width: '100%' }}>
                  <h4 style={{ color: 'white', fontSize: 20, marginBottom: 16, fontWeight: 800 }}>산출 공식 예시</h4>
                  <div style={{ background: '#0f172a', padding: 20, borderRadius: 12, fontSize: 18, fontFamily: 'monospace', color: '#38bdf8', lineHeight: 1.6, wordBreak: 'keep-all' }}>
                    1. 일일 소모량 = LED 전력(W) × 1일 점등시간(Hr)<br/>
                    2. 필요 배터리(Wh) = 일일 소모량 × 보증 일수(3일) ÷ 방전심도(0.8)<br/>
                    3. 배터리(Ah) = 필요 배터리(Wh) ÷ 시스템 배터리 전압(V)
                  </div>
               </div>
            </FadeIn>
          </div>
        </div>
      </AbsoluteFill>
    );
};

// Scene 5: Setup & Wiring Method
const WiringScene = () => {
    return (
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1200, width: '100%', padding: '0 40px', gap: 40 }}>
            
            <FadeIn frameRange={[10, 40]} style={{ alignItems: 'center' }}>
               <h2 style={{ fontSize: 48, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 20, wordBreak: 'keep-all' }}>
                 <Cable size={48} color="#f43f5e" /> 절대 지켜야 할 전선 연결 순서
               </h2>
               <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', marginTop: 16, wordBreak: 'keep-all', textAlign: 'center' }}>
                 순서를 어길 경우 컨트롤러 파손의 원인이 됩니다. 반드시 배터리부터 연결하여 기준 전압을 잡아주세요.
               </p>
            </FadeIn>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
                {[
                  { step: 1, title: '배터리 연결', desc: '가장 먼저 배터리의 (+), (-) 극을 컨트롤러에 연결. 컨트롤러 LCD가 켜집니다.', color: '#38bdf8' },
                  { step: 2, title: '태양광 패널 연결', desc: '두번째로 스위치를 내린 상태에서 패널을 연결. 이후 스위치 ON. (스파크 주의)', color: '#fbbf24' },
                  { step: 3, title: 'LED 램프 연결', desc: '마지막으로 조명(Load) 부하를 연결합니다. 극성에 유의하세요.', color: '#f43f5e' }
                ].map((item, i) => (
                    <FadeIn key={item.step} frameRange={[40 + (i * 30), 70 + (i * 30)]} translateYStart={20}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(255,255,255,0.04)', padding: '24px 32px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: 32, fontWeight: 900, color: item.color, width: 40 }}>{item.step}.</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'white' }}>{item.title}</div>
                                <div style={{ fontSize: 18, color: '#94a3b8', wordBreak: 'keep-all' }}>{item.desc}</div>
                            </div>
                            <CheckCircle2 size={40} color={item.color} style={{ opacity: 0.8 }} />
                        </div>
                    </FadeIn>
                ))}
            </div>

        </div>
      </AbsoluteFill>
    );
};

export const SolarManualComposition: React.FC = () => {
    // 0~200: Intro
    // 200~500: Panel
    // 500~800: Controller
    // 800~1100: Battery
    // 1100~1500: Wiring
  return (
    <AbsoluteFill style={{ background: '#020617', overflow: 'hidden' }}>
      <Sequence from={0} durationInFrames={200}>
        <IntroScene />
      </Sequence>
      <Sequence from={200} durationInFrames={300}>
        <PanelScene />
      </Sequence>
      <Sequence from={500} durationInFrames={300}>
        <ControllerScene />
      </Sequence>
      <Sequence from={800} durationInFrames={300}>
        <BatteryScene />
      </Sequence>
      <Sequence from={1100} durationInFrames={400}>
        <WiringScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default function SolarManualRemotion() {
  const [dim, setDim] = useState({ w: 1920, h: 1080 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
        const width = document.getElementById('remotion-container')?.clientWidth || window.innerWidth;
        setDim({ w: width, h: width * (1080/1920) });
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!mounted) return <div style={{ width: '100%', aspectRatio: '16/9', background: '#020617', borderRadius: 24 }} />;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '48px', color: 'white', fontFamily: 'sans-serif' }}>
      <div id="remotion-container" style={{ width: '100%', position: 'relative', overflow: 'hidden', background: '#020617', borderRadius: 24, boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Player
          component={SolarManualComposition}
          durationInFrames={1500}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={60}
          style={{ width: '100%', height: 'auto', aspectRatio: '16/9', background: 'transparent' }}
          controls
          autoPlay
          loop
        />
      </div>

      {/* Educational Content Text Section */}
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '24px', padding: '48px', border: '1px solid rgba(30, 41, 59, 1)', backdropFilter: 'blur(4px)' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '64px' }}>
          
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Sun size={32} color="#fbbf24" />
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#f1f5f9' }}>태양광 패널: 종류와 효율</h3>
            </div>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '24px', margin: 0 }}>
              효율적인 발전을 위해서는 환경에 맞는 패널을 선택해야 합니다. 일반적으로 모노(단결정) 패널이 좁은 지붕이나 가로등 상단에 가장 유리합니다.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                <h4 style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>단결정 (Mono)</h4>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>효율 18~22%. 좁은 면적에서 높은 전력 생산. 단가가 높으나 가로등에 최적화.</p>
              </div>
              <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155' }}>
                <h4 style={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>다결정 (Poly)</h4>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>효율 15~17%. 면적이 넓은 곳에 유리하며 가성비가 좋으나 최근 사용 빈도가 줄어듦.</p>
              </div>
            </div>
          </section>

          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Cpu size={32} color="#34d399" />
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#f1f5f9' }}>컨트롤러 타입 및 설정법</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(6, 78, 59, 0.2)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>MPPT (추천)</div>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>전압을 변환하여 효율을 최대 30% 끌어올림. 가을/겨울철 심한 온도 변화 및 흐린 날씨에 필수적입니다.</p>
                </div>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid #334155' }}>
                  <div style={{ display: 'inline-block', padding: '4px 12px', background: '#334155', color: '#cbd5e1', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>PWM</div>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>저비용 단순 구조. 패널 전압을 배터리 전압에 맞게 깎아내려 에너지 손실이 큽니다.</p>
                </div>
              </div>
              <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(30, 41, 59, 0.3)', border: '1px solid #334155' }}>
                 <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', fontWeight: 'bold', marginBottom: '16px', margin: 0 }}><ListFilter size={20} color="#94a3b8" /> 컨트롤러 상태 읽기 및 세팅</h4>
                 <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#cbd5e1', fontSize: '14px', margin: 0, padding: 0, listStyle: 'none' }}>
                   <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', lineHeight: '1.6', wordBreak: 'keep-all' }}><span style={{ color: '#34d399', fontWeight: 'bold' }}>1.</span> <span><strong>LED 표시부:</strong> [Solar] 깜빡임(충전중), [Battery] 녹색(완충)/빨간색(저전압)</span></li>
                   <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', lineHeight: '1.6', wordBreak: 'keep-all' }}><span style={{ color: '#34d399', fontWeight: 'bold' }}>2.</span> <span><strong>부하 설정 (Load Set):</strong> 야간 점등시간 조절 (예: 24H=상시, 1~14H=타이머, 0H=일몰~일출)</span></li>
                   <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', lineHeight: '1.6', wordBreak: 'keep-all' }}><span style={{ color: '#34d399', fontWeight: 'bold' }}>3.</span> <span><strong>배터리 타입 설정(B01~03):</strong> 리튬이온/인산철/납축 전압체계가 다르므로 맞춤 셋팅 필수.</span></li>
                 </ul>
              </div>
            </div>
          </section>

          <section>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Battery size={32} color="#38bdf8" />
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#f1f5f9' }}>배터리 용량 선정 방법</h3>
            </div>
            <p style={{ color: '#cbd5e1', marginBottom: '24px', margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>
              흐린 날(불조일)을 버티기 위한 설계가 가장 중요합니다. 일반적으로 3~5일 연속 점등을 목표로 배터리를 계산합니다.
            </p>
            <div style={{ padding: '24px', borderRadius: '16px', background: '#0f172a', border: '1px solid #334155', fontFamily: 'monospace', fontSize: '14px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)', marginTop: '24px' }}>
              <h4 style={{ color: '#94a3b8', fontFamily: 'sans-serif', marginBottom: '16px', fontWeight: 'bold', margin: 0 }}>배터리 산출 공식 예시</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#7dd3fc', marginTop: '16px' }}>
                <p style={{ margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>1. 일일 소모량 = LED 전력(W) × 1일 점등시간(Hr)</p>
                <p style={{ margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>2. 필요 배터리(Wh) = 일일 소모량 × 보증 일수(3일) ÷ 방전심도(0.8)</p>
                <p style={{ margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>3. 배터리(Ah) = 필요 배터리(Wh) ÷ 시스템 배터리 전압(V)</p>
              </div>
            </div>
          </section>

          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Cable size={32} color="#fb7185" />
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#f1f5f9' }}>절대 지켜야 할 전선 연결 순서</h3>
            </div>
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fecdd3', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', wordBreak: 'keep-all', lineHeight: '1.6' }}>
              <strong>주의:</strong> 연결 순서를 어길 경우 컨트롤러 파손의 원인이 됩니다. 반드시 배터리부터 연결하여 기준 전압을 잡아주세요.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.5)' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>1</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>배터리 연결</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>가장 먼저 배터리의 (+), (-) 극을 컨트롤러에 연결. 컨트롤러 LCD가 켜집니다.</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.5)' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>2</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>태양광 패널 연결</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>두번째로 스위치를 내린 상태에서 패널을 연결. 이후 스위치 ON. (스파크 주의)</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.5)' }}>
                <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(225, 29, 72, 0.2)', color: '#fb7185', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>3</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: '#e2e8f0', fontWeight: 'bold', marginBottom: '4px', margin: 0 }}>LED 램프 연결</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, wordBreak: 'keep-all', lineHeight: '1.6' }}>마지막으로 조명(Load) 부하를 연결합니다. 극성에 유의하세요.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
