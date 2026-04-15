'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SolarManualRemotion from '@/components/SolarManualRemotion';
import { ShieldCheck, Zap, Sun, Award } from 'lucide-react';

import SolarTechDeepDive from '@/components/SolarTechDeepDive';

export default function SolarEducationalPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      <Navbar />

      {/* Hero Header Section */}
      <section style={{ padding: '160px 24px 80px', background: 'var(--white)', borderBottom: '1px solid var(--gray-200)', textAlign: 'center', position: 'relative' }}>
        
        {/* 우측 상단 모바일 QR 코드 유도 */}
        <div style={{ position: 'absolute', right: '40px', top: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'var(--white)', padding: '16px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--gray-200)' }}>
           <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://newhome2026.vercel.app/solar1" alt="Mobile QR Code" width="100" height="100" style={{ display: 'block', borderRadius: '8px' }} />
           <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>📷 모바일에서 보기 스캔</span>
        </div>

        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--gray-100)', borderRadius: 50, color: 'var(--gray-700)', fontWeight: 700, fontSize: 13, marginBottom: 24, border: '1px solid var(--gray-200)' }}>
            <Sun size={16} color="var(--primary)" />
            <span>최첨단 태양광 솔루션 교육 자료</span>
          </div>
          <h1 className="section-title" style={{ marginBottom: 24 }}>
            태양광 LED 가로등 <br />
            <span className="text-gradient">작동 원리와 관리 매뉴얼</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--gray-600)', maxWidth: 700, margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
            초기 설치부터 유지보수까지 완벽한 이해를 위해 기획된 인터랙티브 가이드입니다. 각 핵심 부품의 역할과 에너지 플로우를 직관적으로 확인하세요.
          </p>
        </div>
      </section>

      {/* Interactive Remotion Section */}
      <section style={{ padding: '100px 24px', background: 'var(--gray-900)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="section-title" style={{ color: 'var(--white)' }}>인터랙티브 컴포넌트 시뮬레이션</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 16, fontSize: 16 }}>영상 내의 진행 바를 컨트롤하거나 자동으로 시청하시며 구조를 파악하실 수 있습니다.</p>
          </div>
          
          <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', borderRadius: 24 }}>
              <SolarManualRemotion />
          </div>

          {/* Written Manual Section (영상 해설) */}
          <div style={{ maxWidth: 1000, margin: '80px auto 0', color: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>동영상 상세 리뷰 및 가이드라인</h3>
              <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>영상에 등장한 핵심적인 기술 요소를 텍스트로 자세히 정리했습니다.</p>
            </div>

            {/* 1. 패널 */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 40, borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(251, 191, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sun size={24} color="#fbbf24" />
                </div>
                <h4 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>1. 태양광 패널의 선택: 고효율 단결정 권장</h4>
              </div>
              <p style={{ lineHeight: 1.8, fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 16, wordBreak: 'keep-all' }}>
                가로등 시스템의 심장인 태양광 패널은 제한된 윗면 공간 안에서 최대한의 전력을 만들어내야 합니다. 따라서 효율이 <strong>18~22%</strong> 정도로 높은 <strong>단결정(Mono) 패널</strong>을 사용하는 것이 필수적입니다. 넓은 장소에 설치되는 가성비 목적의 다결정(Poly) 패널은 가로등처럼 공간이 한정된 환경에서는 적합하지 않습니다.
              </p>
            </div>

            {/* 2. 컨트롤러 */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 40, borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={24} color="#10b981" />
                </div>
                <h4 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>2. 컨트롤러 타입 및 상태 세팅법</h4>
              </div>
              <p style={{ lineHeight: 1.8, fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 16, wordBreak: 'keep-all' }}>
                빛 에너지를 배터리로 가장 효율적으로 밀어넣기 위해서는 <strong>MPPT(최대전력점 추적) 컨트롤러</strong>를 쓰는 것이 좋습니다. 일반 PWM 방식보다 약 30% 정도 향상된 충전 속도를 보여줍니다.<br/><br/>
                컨트롤러의 LED 표시등을 통해 에러를 확인하고, <strong>부하 설정(시간)</strong>과 <strong>배터리 타입 설정(보통 리튬인산철인 경우 특정 세팅값 필요)</strong>을 매뉴얼에 맞게 조작해야 합니다. 전압체계가 맞지 않으면 과충전 혹은 저전압으로 시스템이 멈춥니다.
              </p>
            </div>

            {/* 3. 배터리 */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 40, borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ transform: 'rotate(90deg)' }}><Zap size={24} color="#38bdf8" /></div>
                </div>
                <h4 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>3. 배터리 (LiFePO4) 용량 산정</h4>
              </div>
              <p style={{ lineHeight: 1.8, fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 16, wordBreak: 'keep-all' }}>
                야외 환경에서 견딜 수 있으면서 화재 가능성이 거의 없는 <strong>리튬 인산철(LiFePO4)</strong> 배터리를 추천합니다. <br/><br/>
                가장 중요한 것은 흐린 날이 이어질 때를 대비한 <strong>보증일수</strong>입니다. 보통 3일~5일 비가 와도 켜질 수 있게 설계합니다. 
                <br/><code>(단일 점등 시간 × LED 전력) × 3일 ÷ (총 시스템 전압 × 방전심도 0.8)</code> <br/>
                공식을 활용하면 필요한 배터리 Ah 용량을 산출할 수 있습니다.
              </p>
            </div>

            {/* 4. 결선(Wiring) */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 40, borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={24} color="#f43f5e" />
                </div>
                <h4 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>4. 절대 지켜야 할 구성품 연결 순서</h4>
              </div>
              <p style={{ lineHeight: 1.8, fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 0, wordBreak: 'keep-all' }}>
                가장 치명적인 오류는 태양광 패널을 컨트롤러에 먼저 연결하는 것입니다. 기준 전압을 컨트롤러가 알지 못한 채 센 전류가 들어오면 보드가 파손될 수 있습니다.<br/><br/>
                아래 순서를 반드시 지켜주세요:<br/>
                <strong style={{ color: '#38bdf8' }}>① 배터리 먼저 연결</strong> (컨트롤러 불 켜짐 확인) ➔ <strong style={{ color: '#fbbf24' }}>② 태양광 패널 연결</strong> ➔ <strong style={{ color: '#f43f5e' }}>③ 마지막으로 조명(LED 램프) 연결</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: '120px 24px', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="section-label" style={{ marginBottom: 16 }}>MAINTENANCE GUIDE</p>
            <h2 className="section-title">주요 유지보수 체크포인트</h2>
            <p style={{ color: 'var(--gray-600)', marginTop: 16, maxWidth: 700, margin: '16px auto 0', lineHeight: 1.6 }}>설치 후 정기적인 관리를 통해 태양광 가로등의 수명을 극대화할 수 있습니다. 다음 항목들을 정기적으로 점검해주세요.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {/* Card 1 */}
            <div className="glass-panel" style={{ padding: 40, border: '1px solid var(--gray-200)', cursor: 'default', background: 'var(--gray-50)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }} 
                 onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)'; }}
                 onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
              <div style={{ width: 64, height: 64, background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Sun size={32} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: 'var(--gray-900)' }}>패널 관리 (Solar Panel)</h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 24 }}>
                태양광 패널에 먼지나 이물질(낙엽, 조류 분변 등)이 쌓이면 효율이 급감합니다. 분기별 1회 부드러운 천이나 물로 표면을 닦아주세요.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--gray-500)', fontSize: 14, fontWeight: 500, padding: 0 }}>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--primary)' }}>•</span> 그늘짐 여부 확인 (주변 나뭇가지 등)</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--primary)' }}>•</span> 표면 스크래치 점검</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--primary)' }}>•</span> 고정 브라켓 체결 상태 확인</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="glass-panel" style={{ padding: 40, border: '1px solid var(--gray-200)', cursor: 'default', background: 'var(--gray-50)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                 onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)'; }}
                 onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
              <div style={{ width: 64, height: 64, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Zap size={32} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: 'var(--gray-900)' }}>MPPT 제어기 (Controller)</h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 24 }}>
                전체 전력을 분배하는 컨트롤러는 습기와 고열에 주의해야 합니다. LED 인디케이터를 통해 에러 상태가 아닌지 확인하세요.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--gray-500)', fontSize: 14, fontWeight: 500, padding: 0 }}>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--primary)' }}>•</span> LED 점등 상태 확인 (충전/방전 정상)</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--primary)' }}>•</span> 배선 단자대 스파크/느슨함 점검</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--primary)' }}>•</span> 케이싱 내부 침수 흔적 확인</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="glass-panel" style={{ padding: 40, border: '1px solid var(--gray-200)', cursor: 'default', background: 'var(--gray-50)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                 onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)'; }}
                 onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
              <div style={{ width: 64, height: 64, background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: 'var(--gray-900)' }}>배터리 및 조명 (Battery & LED)</h3>
              <p style={{ color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 24 }}>
                리튬 인산철 배터리는 수명이 길지만 극한의 온도에서는 효율성이 떨어질 수 있습니다. LED는 방열판 관리가 중요합니다.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--gray-500)', fontSize: 14, fontWeight: 500, padding: 0 }}>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--primary)' }}>•</span> 배터리 외함 팽창 현상 점검</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--primary)' }}>•</span> LED 칩셋 점등 불량 (Dead spots) 확인</li>
                <li style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--primary)' }}>•</span> 모션 센서 정상 작동 반경 테스트</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERT DEEP DIVE SECTION */}
      <section style={{ padding: '40px 24px 120px', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="section-label" style={{ marginBottom: 16, background: 'rgba(234, 88, 12, 0.1)', color: 'var(--warning)' }}>ADVANCED EXPERT LEVEL</p>
            <h2 className="section-title">전문가를 위한 심화 지식 (Deep-Dive)</h2>
            <p style={{ color: 'var(--gray-600)', marginTop: 16, maxWidth: 800, margin: '16px auto 0', lineHeight: 1.6 }}>
              현장 설계 및 도입 검토 단계에서 필수적으로 알아야 하는 기술적 제원, 부품별 소재 차이, 기후 환경에 따른 설치 기준이 총망라된 전문 교육 시퀀스입니다. 
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: 1280, margin: '0 auto' }}>
              <SolarTechDeepDive />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
