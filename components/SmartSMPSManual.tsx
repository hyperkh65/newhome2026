import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Activity, Network, AlertTriangle, Settings, Lightbulb, Workflow } from 'lucide-react';


export default function SmartSMPSManual() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{
      width: '100%',
      background: '#020617', // Very dark slate (near black)
      borderRadius: isMobile ? '0' : '24px',
      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255,255,255,0.08)',
      padding: isMobile ? '24px 16px' : '48px',
      color: '#f8fafc',
      fontFamily: '"Pretendard", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '24px' : '40px'
    }}>

      
      {/* Title Area */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>인터랙티브 실무 기술 명세서</h2>
        <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', margin: '0 auto', borderRadius: '4px' }}></div>
      </div>

      {/* Grid Layout for the Content */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>

        
        {/* Module 1: Converter Topology */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(59,130,246,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(59,130,246,0.2)', padding: '12px', borderRadius: '12px' }}>
              <Cpu size={28} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>1. 컨버터(SMPS) 토폴로지 심층 비교</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#93c5fd', fontWeight: 600 }}>플라이백(Flyback) vs LLC 공진형(Resonant)</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                <strong>Flyback:</strong> 50W 이하 평판 조명 주력. 단가가 낮으나 트랜스포머 누설 인덕턴스로 인한 스파이크 노이즈 발생. <br/>
                <strong>LLC:</strong> 고효율, 대용량 및 프리미엄 스마트 조명 필수. '영전압 스위칭(ZVS)'을 활용하여 발열 및 EMI 노이즈를 극히 최소화함.
              </p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#c4b5fd', fontWeight: 600 }}>Active PFC & Flicker-Free</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                <strong>Two-Stage 설계:</strong> 입력단(Active PFC 회로) + 출력단(DC-DC 변환)의 2중 구조. 첫 단에서 역률(PF)을 0.95 이상으로 당기며, 두 번째 단에서 리플(Ripple) 전류를 3% 미만으로 억제해 스마트폰 카메라 대역에서도 깜빡임이 없는 완전한 Flicker-Free를 보장.
              </p>
            </div>
          </div>
        </div>

        {/* Module 2: 0-10V vs PWM Dimming */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(139,92,246,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(139,92,246,0.2)', padding: '12px', borderRadius: '12px' }}>
              <Activity size={28} color="#8b5cf6" />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>2. 정밀 디밍(Dimming) 제어 실무</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#c4b5fd', fontWeight: 600 }}>0-10V 아날로그 디밍의 함정</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                <strong>Sink vs Source:</strong> 대부분 컨버터는 DIM 단자로 전류를 뿜는 Sink 방식을 채택. 다수 조명 연결 시 전류 초과로 컨트롤러 파손 주의.<br/>
                <strong>Voltage Drop:</strong> 제어 선로가 50m를 초과하면 선단과 종단 평판 간 전압차로 밝기 균일도(Uniformity) 붕괴. (최소 AWG18 연선 사용 권장)
              </p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#93c5fd', fontWeight: 600 }}>PWM 및 해상도(Resolution)</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                <strong>주파수 특성:</strong> 2kHz~4kHz 고주파 제어 IC 탑재 필수. (두통 유발 스트로보스코픽 차단)<br/>
                <strong>16비트 디밍:</strong> 8비트(256단계)는 저조도 깜빡임 발생. 1% 미만 Deep Dimming을 위해 65,536단계 세목 분해 제어칩과 CCR (정전류 조절) 하이브리드 구동이 현대 오피스의 코어 핵심기술임.
              </p>
            </div>
          </div>
        </div>

        {/* Module 3: Match & Debugging */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(234,179,8,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(234,179,8,0.2)', padding: '12px', borderRadius: '12px' }}>
              <AlertTriangle size={28} color="#eab308" />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>3. 설계/호환성 크로스 체크</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #eab308' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fde047', fontWeight: 600 }}>Vf (순방향 전압) 매칭 원리</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                패널 내부 LED 스트링의 Vf(예: 36V)가 드라이버 출력 윈도우(예: 30V~42V)를 이탈하면 과전압 보호(OVP) 발동. 점멸(Blinking) 에러 예방을 위해 철저한 전압-전류 곡선 교차 검증 요망.
              </p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #eab308' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#fde047', fontWeight: 600 }}>유령 등(Ghosting)과 릴레이 분리</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                0V 인가 시에도 누설 전류로 인한 잔광 현상(Ghosting). Dim-to-Off 특화 컨버터를 채택하거나, 제어기 단에 마그네틱 릴레이를 이중 설치하여 AC 전원 차단 회로로 강제 제어하는 것이 실무 정석입니다.
              </p>
            </div>
          </div>
        </div>

        {/* Module 4: Future Tech */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.9) 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(16,185,129,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(16,185,129,0.2)', padding: '12px', borderRadius: '12px' }}>
              <Network size={28} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>4. 차세대 디지털 패러다임</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#6ee7b7', fontWeight: 600 }}>PoE 조명 & 양방향 DALI-2</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                <strong>PoE (Power over Ethernet):</strong> 220V 교류 전기선 폐기. UTP CAT6 랜선 하나로 60~90W DC 파워와 제어(Data)를 동시 송신. 초슬림 디자인과 압도적 신뢰성 보장.<br/>
                <strong>DALI-2 / D4i:</strong> 단순 디밍을 넘어 평판 등기구 수명, 온도, 전력량을 서버스위치로 실시간 보고하는 예지 보전 아키텍처.
              </p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #34d399' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#6ee7b7', fontWeight: 600 }}>Mesh Network & HCL</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
                Thread/Matter 라우터 칩셋 탑재로 1,000개 LED를 딜레이 없이 동시 무선 제어. 인간 서캐디언 리듬(생체시계)을 추종하는 Tunable White(색온도 양방향 자동 변환) 구현으로 웰빙 오피스 완성.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
