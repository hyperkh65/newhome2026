'use client';
import Navbar from '@/components/Navbar';
import { ScrollReveal } from '@/components/LuminaAnimation';

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <Navbar />
      
      <div style={{ paddingTop: 100 }}>
        {/* Header Section */}
        <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <ScrollReveal>
              <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 20 }}>
                (주)와이앤케이
              </h1>
              <p style={{ fontSize: 20, color: 'var(--primary-dark)', fontWeight: 700, marginBottom: 16 }}>
                글로벌 LED 조명 무역회사
              </p>
              <p style={{ fontSize: 16, color: 'var(--gray-600)', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
                (주)와이앤케이는 전 세계의 고품질 LED 조명 시스템을 발굴하고, 국내외 B2B 파트너들에게 안전하고 신속하게 공급하는 빛의 무역 허브입니다.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Info Cards */}
        <section style={{ padding: '80px 24px' }}>
          <div className="container" style={{ maxWidth: 1000 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
              
              <ScrollReveal delay={100}>
                <div style={{ background: 'var(--gray-50)', padding: 40, borderRadius: 24, border: '1px solid var(--gray-200)', height: '100%' }}>
                  <div style={{ fontSize: 40, marginBottom: 24 }}>🏢</div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, color: 'var(--gray-900)' }}>회사 소개</h3>
                  <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.7 }}>
                    우리는 단순한 제품 공급을 넘어, 공간의 가치를 높이는 빛을 전달합니다. 수년 간의 글로벌 소싱 경험과 국제 무역 및 인증 노하우를 바탕으로 가장 혁신적이고 안정적인 LED 조명 솔루션을 제안합니다. 스마트 조명부터 산업용 특수 조명까지, (주)와이앤케이가 귀사의 든든한 파트너가 무역 파트너가 되겠습니다.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div style={{ background: 'var(--gray-50)', padding: 40, borderRadius: 24, border: '1px solid var(--gray-200)', height: '100%' }}>
                  <div style={{ fontSize: 40, marginBottom: 24 }}>📍</div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, color: 'var(--gray-900)' }}>회사 위치 / 오시는 길</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <li style={{ display: 'flex', gap: 12 }}>
                      <span style={{ color: 'var(--primary)' }}>•</span>
                      <span><strong>주소:</strong> 인천광역시 미추홀구 경인로112 4층 (주)와이앤케이</span>
                    </li>
                    <li style={{ display: 'flex', gap: 12 }}>
                      <span style={{ color: 'var(--primary)' }}>•</span>
                      <span><strong>지하철:</strong> 제물포역(1호선) 1번 출구 도보 5분 거리</span>
                    </li>
                    <li style={{ display: 'flex', gap: 12 }}>
                      <span style={{ color: 'var(--primary)' }}>•</span>
                      <span><strong>차량/주차:</strong> 본 건물 후면 지정 주차장 이용 및 주변 공영 주차장 이용 가능</span>
                    </li>
                    <li style={{ display: 'flex', gap: 12 }}>
                      <span style={{ color: 'var(--primary)' }}>•</span>
                      <span><strong>운영시간:</strong> 평일 09:00 - 18:00 (주말/공휴일 휴무)</span>
                    </li>
                  </ul>
                  
                  {/* Fake Map Box */}
                  <div style={{ marginTop: 24, width: '100%', height: 200, background: '#e5e7eb', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', border: '1px solid #d1d5db' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>지도 API 연동 영역</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
