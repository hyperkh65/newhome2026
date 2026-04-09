'use client';
import Navbar from '@/components/Navbar';
import { ScrollReveal } from '@/components/LuminaAnimation';

export default function TradeInfoPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      <Navbar />
      
      <div style={{ paddingTop: 100 }}>
        {/* Header Section */}
        <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, var(--white) 0%, #f0f9ff 100%)', borderBottom: '1px solid var(--gray-200)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <ScrollReveal>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16 }}>
                무역 지식 및 인증 안내 (B2B)
              </h1>
              <p style={{ fontSize: 18, color: 'var(--gray-600)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                안전하고 신속한 글로벌 조명 무역을 위한 필수 인증 지식과 표준 수출입 프로세스를 확인하세요.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section style={{ padding: '80px 24px' }}>
          <div className="container" style={{ maxWidth: 1000 }}>
            <div style={{ display: 'grid', gap: 40 }}>
              
              {/* Cerification Block */}
              <ScrollReveal>
                <div style={{ background: 'var(--white)', padding: 40, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--gray-200)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 48, height: 48, background: 'rgba(14,165,233,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                      📜
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-900)' }}>글로벌 스탠다드 필수 인증 (Certifications)</h2>
                  </div>
                  <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 24 }}>
                    LED 조명은 국가별로 요구하는 안전 및 전파 인증 기준이 매우 엄격합니다. 저희 플랫폼에서 취급하는 모델들은 다음의 인증 규격을 준수하거나 서포트합니다.
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                    <div style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
                      <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--gray-800)' }}>KC 인증 (대한민국)</h4>
                      <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.5 }}>전기용품 및 생활용품 안전관리법에 따른 필수 인증으로 제품의 안전성을 보장합니다. SMPS(전원공급장치)와 등기구 항목이 각각 필요합니다.</p>
                    </div>
                    <div style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
                      <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--gray-800)' }}>CE 인증 (유럽연합)</h4>
                      <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.5 }}>유럽 판매를 위한 필수 규격. 저전압 지침(LVD)과 전자기파 적합성(EMC) 기준을 충족해야 합니다.</p>
                    </div>
                    <div style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
                      <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--gray-800)' }}>FCC 준수 (미국)</h4>
                      <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.5 }}>전자파 발생 기기에 대한 미국 통신 위원회 규격. 스마트 조명의 블루투스나 WiFi 모듈에서 필수 요구됩니다.</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Trade Process Block */}
              <ScrollReveal>
                <div style={{ background: 'var(--white)', padding: 40, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--gray-200)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 48, height: 48, background: 'rgba(59,130,246,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                      🚢
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-900)' }}>표준 수출입 프로세스 (Trade Process)</h2>
                  </div>
                  
                  <div style={{ position: 'relative', paddingLeft: 30, borderLeft: '2px dashed var(--gray-200)', display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {[
                      { step: '01', title: '견적 의뢰 및 샘플 발송', desc: '견적 문의함(Quote Cart)을 통해 필요한 스펙과 수량을 제출하시면, FOB/CIF 조건 견적과 샘플을 발송합니다.' },
                      { step: '02', title: 'MOQ 및 인증서 확인', desc: '대량 주문 전 필수적으로 각 국가/지역에 맞는 인증서(Test Report) 원본과 공장 실사 리포트를 제공합니다.' },
                      { step: '03', title: '양산 및 QC (품질검수)', desc: '지정 파트너 공장에서 양산이 완료되면, 출항 전 2단계 품질 검수(QC)를 거칩니다.' },
                      { step: '04', title: '선적 및 포워딩 (인천/부산항)', desc: '최적의 선박을 배정하여 중국 심천/상하이 포트에서 한국 인천항 등으로 출발합니다. [물류 추적] 메뉴에서 실시간 트래킹이 지원됩니다.' },
                    ].map((s) => (
                      <div key={s.step} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: -43, top: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                          {s.step}
                        </div>
                        <h4 style={{ fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8, fontSize: 18 }}>{s.title}</h4>
                        <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.6 }}>{s.desc}</p>
                      </div>
                    ))}
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
