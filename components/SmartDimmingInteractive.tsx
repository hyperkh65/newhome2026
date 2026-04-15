'use client';
import React, { useState, useEffect } from 'react';
import { Lightbulb, Cpu, Wind, Activity, Key, Eye, ShieldCheck, PlayCircle, Zap, AlertTriangle } from 'lucide-react';

export default function SmartDimmingInteractive() {
  // States for interactive elements
  const [basicDim, setBasicDim] = useState(100);
  const [icFlowSpeed, setIcFlowSpeed] = useState(1);
  const [voltage, setVoltage] = useState(10);
  const [wireThickness, setWireThickness] = useState(false);
  const [pwmDuty, setPwmDuty] = useState(50);
  const [bitDepth, setBitDepth] = useState(8);
  const [bitProgress, setBitProgress] = useState(100);
  const [relayOn, setRelayOn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // Animation effect for bit simulation
  useEffect(() => {
    let interval: any;
    if (bitProgress > 0) {
      interval = setInterval(() => {
        setBitProgress(prev => {
          const step = bitDepth === 8 ? 10 : 1; // 8-bit drops by chunks, 16-bit smoothly
          if (prev - step <= 0) return 0;
          return prev - step;
        });
      }, bitDepth === 8 ? 300 : 30);
    }
    return () => clearInterval(interval);
  }, [bitDepth, bitProgress]);

  const resetBitSim = (bits: number) => {
    setBitDepth(bits);
    setBitProgress(100);
  };

  return (
    <div style={{
      width: '100%',
      background: '#020617', // Deep dark
      borderRadius: isMobile ? '0' : '24px',
      padding: isMobile ? '24px 16px' : '48px 24px',
      color: '#f8fafc',
      fontFamily: '"Pretendard", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '40px' : '80px',
      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
    }}>

      
      {/* Intro Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 900, marginBottom: '24px', lineHeight: 1.3 }}>
          💡 초등학생도 이해하는 <br/>
          <span style={{ color: '#3b82f6' }}>디밍(Dimming)과 IC의 마법 세계!</span>
        </h1>
        <p style={{ fontSize: isMobile ? '16px' : '20px', color: '#94a3b8', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          전기를 자유자재로 다뤄 빛을 예쁘게 조절하는 기술! 아주아주 작은 두뇌인 'IC'가 어떻게 전기를 멈추고 보내는지 눈으로 직접 만져보면서 배워봅시다. 스크롤을 내리면서 마음껏 버튼을 눌러보세요!
        </p>
      </div>


      {/* Chapter 1 */}
      <section style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontSize: isMobile ? '22px' : '30px', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Lightbulb size={isMobile ? 28 : 36} /> 제 1장: 디밍(Dimming)이란 무엇일까요?
        </h2>
        <p style={{ fontSize: isMobile ? '15px' : '18px', lineHeight: 1.8, color: '#cbd5e1', marginTop: '20px' }}>
          화장실 세면대에서 수도꼭지를 살살 돌리면 물이 졸졸 나오고, 꽉 틀면 콸콸 나오죠? 
          <br/><br/>
          전등도 마찬가지예요! 전기를 100만큼 다 주면 눈이 부시게 밝지만, 전기를 50만큼만 주면 부드러운 빛이 됩니다. 
          이렇게 <b>전기의 양을 조절해서 빛의 밝기를 마음대로 바꾸는 것</b>을 바로 <b>'디밍(Dimming)'</b>이라고 불러요.
        </p>


        {/* Interactive 1 */}
        <div style={{ marginTop: '40px', background: '#0f172a', padding: '30px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '20px', color: '#fff' }}>👉 직접 해보세요! (수도꼭지 돌리기)</h3>
          
          <div style={{ 
            width: '120px', 
            height: '120px', 
            background: `rgba(250, 204, 21, ${basicDim / 100})`, 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 ${basicDim}px rgba(250, 204, 21, ${basicDim / 100})`,
            transition: 'all 0.1s ease-out'
          }}>
            <Lightbulb size={60} color={basicDim > 50 ? '#000' : '#fff'} opacity={0.8} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>밝기: {basicDim}%</div>
          
          <input 
            type="range" 
            min="0" max="100" 
            value={basicDim} 
            onChange={(e) => setBasicDim(Number(e.target.value))}
            style={{ width: '80%', cursor: 'pointer', height: '8px', accentColor: '#eab308' }} 
          />
        </div>
      </section>

      {/* Chapter 2 */}
      <section style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontSize: isMobile ? '22px' : '30px', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Cpu size={isMobile ? 28 : 36} /> 제 2장: IC - 빛을 지휘하는 조그만 꼬마 기관사
        </h2>
        <p style={{ fontSize: isMobile ? '15px' : '18px', lineHeight: 1.8, color: '#cbd5e1', marginTop: '20px' }}>
          그렇다면 누가 전기를 얼만큼 보낼지 <b>"결정"</b>하고 문을 열어줄까요? 바로 <b>IC(Integrated Circuit, 집적회로)</b>라는 까만색의 아주 작은 컴퓨터 칩입니다.
          이 칩이 조명 안에서 <b>"지금 주인이 스위치를 반만 열었어! 전기를 반만 보내!"</b>라고 트랜지스터(전기 문지기)에게 명령을 내리는 역할을 합니다.
        </p>


        {/* Interactive 2 */}
        <div style={{ marginTop: '40px', background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '20px', color: '#fff', textAlign: 'center', marginBottom: '20px' }}>👉 전기가 흘러가는 길 (IC 기관사의 명령)</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
            <button onClick={() => setIcFlowSpeed(0.2)} style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>천천히 보내! (디밍)</button>
            <button onClick={() => setIcFlowSpeed(2)} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>콸콸 쏟아! (100%)</button>
          </div>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0' : '0 40px', gap: '20px' }}>
            {/* Battery Source */}
            <div style={{ textAlign: 'center' }}>
              <Zap size={40} color="#eab308" />
              <div style={{ fontSize: '12px' }}>전원</div>
            </div>
            
            {/* The Road and Dots */}
            <div style={{ width: isMobile ? '100%' : '200px', height: '40px', background: '#1e293b', borderRadius: '20px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
              <div 
                style={{
                  width: '20px', height: '20px', background: '#eab308', borderRadius: '50%',
                  animation: `moveRight ${2 / icFlowSpeed}s linear infinite`
                }}
              />
              <div 
                style={{
                  width: '20px', height: '20px', background: '#eab308', borderRadius: '50%', position: 'absolute',
                  animation: `moveRight ${2 / icFlowSpeed}s linear infinite`, animationDelay: `-${1 / icFlowSpeed}s`
                }}
              />
               <style>{`
                @keyframes moveRight {
                  0% { transform: translateX(0px); opacity: 1; }
                  100% { transform: translateX(${isMobile ? '300' : '1000'}px); opacity: 0; }
                }
              `}</style>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* IC Brain */}
              <div style={{ textAlign: 'center', background: '#3b82f6', padding: '12px', borderRadius: '12px' }}>
                <Cpu size={32} color="#fff" />
                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>IC 칩</div>
              </div>

              {/* LED Bulb */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ transition: 'all 0.5s', opacity: icFlowSpeed > 1 ? 1 : 0.3, transform: icFlowSpeed > 1 ? 'scale(1.2)' : 'scale(1)' }}>
                  <Lightbulb size={48} color="#eab308" />
                </div>
                <div style={{ fontSize: '12px' }}>LED 전등</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Chapter 3 */}
      <section style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontSize: isMobile ? '22px' : '30px', color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={isMobile ? 28 : 36} /> 제 3장: 아날로그 방식 (0-10V 디밍의 원리)
        </h2>
        <p style={{ fontSize: isMobile ? '15px' : '18px', lineHeight: 1.8, color: '#cbd5e1', marginTop: '20px' }}>
          IC 기관사에게 도대체 어떻게 "반만 열어!" 라고 알려줄까요? <br/>
          가장 옛날부터 써온 쉽고 확실한 방법은 <b>"전압(V)의 높이"</b>로 알려주는 거예요!
          IC에게 10V짜리 편지를 보내면 "아! 제일 밝게 틀라는 거구나!" 하고, 5V짜리 편지를 보내면 "딱 절반만 틀라는 거구나!" 하고 눈치채는 방식입니다.
        </p>


        {/* Interactive 3 */}
        <div style={{ marginTop: '40px', background: '#0f172a', padding: isMobile ? '20px' : '30px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '20px' }}>👉 슬라이더로 전압(V)을 올려보세요</h3>
            <input 
              type="range" 
              min="1" max="10" 
              value={voltage} 
              onChange={(e) => setVoltage(Number(e.target.value))}
              style={{ width: isMobile ? '100%' : '60%', height: '8px', cursor: 'pointer', accentColor: '#2dd4bf' }} 
            />
            <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 900, color: '#2dd4bf', marginTop: '20px' }}>{voltage} V 전송 중!</div>
          </div>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: 'center', gap: '40px', marginTop: '40px' }}>
            {/* IC thinking */}
            <div style={{ position: 'relative', width: isMobile ? '100%' : '200px', height: '200px', border: '4px solid #334155', borderRadius: '16px', display: 'flex', alignItems: 'flex-end', padding: '4px' }}>
              <div style={{ 
                width: '100%', 
                height: `${(voltage / 10) * 100}%`, 
                background: 'linear-gradient(0deg, rgba(45,212,191,0.5) 0%, rgba(45,212,191,1) 100%)', 
                borderRadius: '8px',
                transition: 'height 0.3s ease-out',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold'
              }}>
                물(전기) 차오르는 중
              </div>
            </div>
            
            {/* LED Bulb reacting */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <Lightbulb size={isMobile ? 80 : 120} color={voltage > 2 ? '#2dd4bf' : '#475569'} style={{ opacity: voltage/10, transition: 'all 0.3s' }} />
               <div style={{ marginTop: '10px', fontSize: '18px' }}>밝기: {voltage * 10}%</div>
            </div>
          </div>
        </div>

      </section>

      {/* Chapter 4 */}
      <section style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontSize: isMobile ? '22px' : '30px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={isMobile ? 28 : 36} /> 제 4장: 0-10V 방식의 치명적 단점 (전기가 길을 잃다)
        </h2>
        <p style={{ fontSize: isMobile ? '15px' : '18px', lineHeight: 1.8, color: '#cbd5e1', marginTop: '20px' }}>
          그런데 문제가 생겼어요! 학교 복도처럼 <b>가로등 패널이 엄청 멀리 떨어져 있으면</b> 어떻게 될까요?
          <br/><br/>
          전선도 아주 미세하게 전기를 갉아먹는 마찰력(저항)이 있거든요. 그래서 시작점에서 10V를 보냈는데, 50m 뒤에 있는 마지막 전등에게 도착할 때는 전압이 7V로 깎여버립니다. 
          그럼 마지막 조명은 바보같이 "아, 스위치를 70%만 틀라고 하셨구나!" 하고 어둡게 켜집니다.
        </p>


        {/* Interactive 4 */}
        <div style={{ marginTop: '40px', background: '#0f172a', padding: isMobile ? '15px' : '30px', borderRadius: '16px', border: '1px solid #1e293b', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '20px', color: '#fff', textAlign: 'center', marginBottom: '20px' }}>👉 전선 굵기 실험</h3>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
             <button onClick={() => setWireThickness(!wireThickness)} style={{ padding: '12px 24px', background: wireThickness ? '#22c55e' : '#64748b', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold' }}>
               {wireThickness ? '두껍고 좋은 전선 사용 중 (전압 안 깎임!)' : '얇고 싼 전선 사용 중 (버튼을 눌러 교체하세요)'}
             </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px', background: '#1e293b', borderRadius: '12px', minWidth: isMobile ? '600px' : 'auto' }}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '10px' }}>스위치: 10V 발사!</div>
                <Zap size={32} color="#3b82f6" />
             </div>
             
             {/* Array of 5 lights */}
             {[1, 2, 3, 4, 5].map((num) => {
               // Calculate drop
               const drop = wireThickness ? 0 : (num - 1) * 1.5; 
               const receivedV = 10 - drop;
               return (
                 <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ width: '80px', height: wireThickness ? '12px' : '4px', background: '#475569', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <div style={{ width: '100%', height: '2px', background: wireThickness ? '#22c55e' : '#f87171' }}></div>
                   </div>
                   <Lightbulb size={36} color={receivedV > 4 ? '#eab308' : '#64748b'} style={{ opacity: receivedV/10 }} />
                   <div style={{ marginTop: '10px', fontSize: '12px' }}>조명 {num}번</div>
                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: receivedV === 10 ? '#22c55e' : '#f87171' }}>{receivedV}V 도착</div>
                 </div>
               )
             })}
          </div>
          {isMobile && <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '10px' }}>← 옆으로 밀어서 확인하세요 →</div>}
        </div>

      </section>

      {/* Chapter 5 */}
      <section style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontSize: isMobile ? '22px' : '30px', color: '#facc15', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Wind size={isMobile ? 28 : 36} /> 제 5장: 완벽한 기술, PWM 디밍 (엄청 빠른 깜빡임!)
        </h2>
        <p style={{ fontSize: isMobile ? '15px' : '18px', lineHeight: 1.8, color: '#cbd5e1', marginTop: '20px' }}>
          0-10V 방식의 단점을 해결하기 위해 나타난 궁극의 디지털 기술입니다! PWM(Pulse Width Modulation) 방식은 <b>전류를 아주 빠르게 켰다 껐다(ON/OFF)</b> 합니다.
          <br/><br/>
          사람의 눈은 너무 빠르면 깜빡인다고 느끼지 못하고, '잔상' 때문에 밝기가 약해진 것처럼 착각하게 됩니다.
          만약 1초 동안 <b>20%의 시간은 켜고(ON), 80%의 시간은 끄면(OFF)</b> 우리 눈에는 딱 20%의 어두운 밝기로 예쁘게 보입니다.
        </p>


        {/* Interactive 5 */}
        <div style={{ marginTop: '40px', background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
             <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '10px' }}>👉 켜져있는 비율(Duty Cycle) 조절하기</h3>
             <input 
              type="range" 
              min="10" max="100" step="10"
              value={pwmDuty} 
              onChange={(e) => setPwmDuty(Number(e.target.value))}
              style={{ width: '60%', height: '8px', cursor: 'pointer', accentColor: '#facc15' }} 
            />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#facc15', marginTop: '10px' }}>Duty Cycle: {pwmDuty}%</div>
          </div>

          <div style={{ display: 'flex', gap: '40px' }}>
            {/* Waveform Visualization */}
            <div style={{ flex: 1, border: '1px solid #334155', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', height: '120px', gap: '2px' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(block => (
                <div key={block} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  {/* ON block */}
                  <div style={{ width: `${pwmDuty}%`, height: '100%', background: '#facc15', borderTopLeftRadius: '4px', borderTopRightRadius: '4px', transition: 'width 0.2s' }}></div>
                  {/* OFF block */}
                  <div style={{ width: `${100 - pwmDuty}%`, height: '10%', background: '#475569', transition: 'width 0.2s' }}></div>
                </div>
              ))}
            </div>

            {/* LED Bulb */}
            <div style={{ width: '150px', background: '#1e293b', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Lightbulb size={60} color={pwmDuty > 20 ? '#facc15' : '#64748b'} style={{ opacity: Math.max(pwmDuty/100, 0.2) }} />
              <div style={{ marginTop: '10px' }}>사람이 보는 밝기</div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 6 */}
      <section style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontSize: isMobile ? '22px' : '30px', color: '#fb923c', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={isMobile ? 28 : 36} /> 제 6장: 해상도의 마법 (8비트 vs 16비트)
        </h2>
        <p style={{ fontSize: isMobile ? '15px' : '18px', lineHeight: 1.8, color: '#cbd5e1', marginTop: '20px' }}>
          밝기를 100에서 0으로 줄일 때 일어나는 일입니다. 
          저가형 <b>8비트 IC</b>는 계단을 256개로 나눕니다. 밝을 때는 괜찮지만, 어두워질 때는 갑자기 쿵! 쿵! 떨어지며 영화관처럼 예쁘게 꺼지지 않고 끊기면서 꺼집니다.
          반면 고급 상가나 호텔에 쓰는 <b>16비트 IC</b>는 무려 65,536개의 계단으로 쪼개기 때문에 미끄럼틀을 타듯 스르륵 하고 부드럽게 빛이 사라집니다.
        </p>


        {/* Interactive 6 */}
        <div style={{ marginTop: '40px', background: '#0f172a', padding: '30px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: '20px', color: '#fff', textAlign: 'center', marginBottom: '20px' }}>👉 페이드 아웃(서서히 꺼짐) 애니메이션 시뮬레이션</h3>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: '12px', marginBottom: '30px' }}>
             <button onClick={() => resetBitSim(8)} style={{ padding: '12px 24px', background: '#475569', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold' }}>
               8비트 (저가형) 뚝뚝 끊김
             </button>
             <button onClick={() => resetBitSim(16)} style={{ padding: '12px 24px', background: '#fb923c', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold' }}>
               16비트 (도서관, 호텔급) 스무스
             </button>
          </div>


          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
            {/* The Graph */}
            <div style={{ position: 'relative', width: isMobile ? '100%' : '300px', height: '200px', borderLeft: '2px solid #64748b', borderBottom: '2px solid #64748b' }}>
              <div 
                style={{ 
                  position: 'absolute', left: 0, bottom: 0, width: '100%', 
                  height: `${bitProgress}%`, 
                  background: 'rgba(251,146,60,0.2)', 
                  borderTop: '4px solid #fb923c',
                  transition: bitDepth === 16 ? 'height 0.05s linear' : 'none' // 8bit no transition css to show jerkiness
                }}
              />
              <div style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', color: '#cbd5e1', fontSize: '12px' }}>시간이 지나며 불 끄기...</div>
            </div>

            {/* Bubble */}
            <div style={{ width: isMobile ? '100px' : '150px', height: isMobile ? '100px' : '150px', borderRadius: '50%', background: `rgba(251, 146, 60, ${bitProgress/100})`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: bitDepth === 16 ? 'background 0.05s linear' : 'none' }}>
               <Lightbulb size={isMobile ? 48 : 60} color="#fff" />
            </div>
          </div>

        </div>
      </section>

      {/* Chapter 7 */}
      <section style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontSize: isMobile ? '22px' : '30px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Key size={isMobile ? 28 : 36} /> 제 7장: 유령등 현상과 릴레이 스위치 방어법
        </h2>
        <p style={{ fontSize: isMobile ? '15px' : '18px', lineHeight: 1.8, color: '#cbd5e1', marginTop: '20px' }}>
          0-10V 방식에서는 슬라이더를 0까지 내렸는데도 전기가 찌끔 찌끔 새어 들어가 밤에 무섭게 전등이 은은하게 켜져 있는 <b>'유령 등(Ghosting)'</b> 현상이 종종 생깁니다. <br/>
          이것을 막기 위해 <b>원천 수도꼭지를 물리적으로 잠가버리는 마그네틱 릴레이(자석 스위치)</b>를 함께 설계하는 것이 완벽한 실무 비법입니다.
        </p>


        {/* Interactive 7 */}
        <div style={{ marginTop: '40px', background: '#0f172a', padding: isMobile ? '20px' : '30px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
             <button onClick={() => setRelayOn(!relayOn)} style={{ padding: '16px 32px', background: relayOn ? '#ef4444' : '#22c55e', color: '#fff', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: isMobile ? '16px' : '20px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
               {relayOn ? '릴레이 차단함 (완전소등 타락!)' : '릴레이 열려있음 (유령등 발생 대기)'}
             </button>
          </div>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '20px' : '40px', background: '#1e293b', borderRadius: '16px', gap: isMobile ? '30px' : '60px' }}>
             <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: '18px', marginBottom: '10px' }}>조명 컨트롤러 (0V 명령)</div>
               <div style={{ background: '#334155', padding: '20px', borderRadius: '8px' }}>[ 0 % ]</div>
             </div>

             {/* Relay Gate */}
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '60px', border: '2px solid #94a3b8', borderRight: 'none', borderLeft: 'none', position: 'relative' }}>
                   {/* Switch arm */}
                   <div style={{ 
                     position: 'absolute', top: '10px', left: 0, width: '40px', height: '4px', background: relayOn ? '#ef4444' : '#22c55e',
                     transformOrigin: 'left center',
                     transform: relayOn ? 'rotate(-45deg)' : 'rotate(0deg)',
                     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                   }}></div>
                </div>
                <div style={{ marginTop: '10px', color: relayOn ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>물리적 릴레이</div>
             </div>

             <div style={{ textAlign: 'center' }}>
               {/* 0V still leeks in 0-10V system if not shut off */}
               <Lightbulb size={80} color={relayOn ? '#1e293b' : '#34d399'} style={{ opacity: relayOn ? 0.1 : 0.4, transition: 'all 0.5s', filter: relayOn ? 'none' : 'drop-shadow(0 0 20px #34d399)' }} />
               <div style={{ marginTop: '10px', color: relayOn ? '#475569' : '#34d399', fontWeight: 'bold' }}>
                 {relayOn ? '빛 한줌 없음 (완벽!)' : '스멀스멀 새어나오는 유령등... (1%)'}
               </div>
             </div>
          </div>
        </div>

      </section>

      {/* Footer message */}
      <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '40px' }}>
        <p style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6' }}>🎉 축하합니다! 이제 당신도 디밍 제어와 SMPS 설계의 마스터입니다! 🎉</p>
      </div>
    </div>
  );
}
