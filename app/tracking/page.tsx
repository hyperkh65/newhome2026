'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ScrollReveal } from '@/components/LuminaAnimation';

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setSearched(true);
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <Navbar />
      
      <div style={{ paddingTop: 100 }}>
        {/* Header */}
        <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%)', color: 'var(--white)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <ScrollReveal>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 16 }}>
                실시간 화물 추적
              </h1>
              <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
                발급받으신 B/L 번호 또는 Shipment ID를 입력하시면 인천항 도착 및 통관 현황을 조회할 수 있습니다.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Tracking Search Input */}
        <section style={{ padding: '60px 24px' }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 16, background: 'var(--white)', padding: 12, borderRadius: 16, border: '1px solid var(--gray-200)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
              <input 
                type="text" 
                placeholder="TRK-0000-0000 또는 B/L No 입력" 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                style={{ flex: 1, padding: '16px 20px', border: 'none', background: 'transparent', outline: 'none', fontSize: 16, color: 'var(--gray-900)' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 32px' }}>
                화물 조회
              </button>
            </form>

            <div style={{ marginTop: 24, fontSize: 13, color: 'var(--gray-500)', textAlign: 'center' }}>
              데모 트래킹 번호: <strong>TRK-2026-KR001</strong> 를 입력해보세요. (향후 실제 관세청/포워더 API 연동 예정)
            </div>
          </div>
        </section>

        {/* Demo Tracking Result */}
        {searched && (
          <section style={{ padding: '0 24px 80px' }}>
            <div className="container" style={{ maxWidth: 800 }}>
              <div style={{ background: 'var(--gray-50)', padding: 40, borderRadius: 20, border: '1px solid var(--gray-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--gray-200)' }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 4, fontWeight: 600 }}>SHIPMENT ID</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary-dark)' }}>{trackingId}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(52,211,153,0.1)', color: '#059669', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                      IN TRANSIT
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative', paddingLeft: 40 }}>
                  <div style={{ position: 'absolute', left: 11, top: 20, bottom: 20, width: 2, background: 'var(--gray-200)' }} />
                  
                  {[
                    { date: '2026-04-12 14:30', status: '인천항(Incheon Port) 양하 완료 및 통관 대기', active: false },
                    { date: '2026-04-11 08:15', status: '인천항 입항 대기중', active: true },
                    { date: '2026-04-09 18:00', status: '중국 웨이하이(Weihai) 항구 출항', active: false, done: true },
                    { date: '2026-04-08 11:20', status: '중국 심천(Shenzhen) 공장 선적 완료', active: false, done: true },
                    { date: '2026-04-01 09:00', status: '오더 접수 및 양산 시작', active: false, done: true },
                  ].map((node, i) => (
                    <div key={i} style={{ position: 'relative', marginBottom: node.active ? 40 : 32, opacity: (!node.active && !node.done) ? 0.4 : 1 }}>
                      <div style={{ 
                        position: 'absolute', left: -34, top: 2, width: 12, height: 12, borderRadius: '50%', 
                        background: node.active ? 'var(--primary)' : (node.done ? 'var(--gray-400)' : 'var(--white)'),
                        border: node.done ? 'none' : '2px solid var(--gray-300)',
                        boxShadow: node.active ? '0 0 0 4px rgba(14,165,233,0.2)' : 'none',
                        zIndex: 2
                      }} />
                      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 4 }}>{node.date}</div>
                      <div style={{ fontSize: 16, fontWeight: node.active ? 700 : 500, color: node.active ? 'var(--gray-900)' : 'var(--gray-700)' }}>{node.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
