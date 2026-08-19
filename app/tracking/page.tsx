'use client';
import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';

interface TrackingResult {
  success: boolean;
  type?: 'IMPORT' | 'EXPORT';
  blType?: string;
  year?: number;
  data?: Record<string, string | number>;
  details?: Record<string, string | number>[];
  error?: string;
}

function fmt(v: string | number | undefined): string {
  if (!v) return '-';
  const s = String(v).trim();
  if (!s || s === '0') return '-';
  // 날짜 포맷 YYYYMMDDHHMMSS → YYYY-MM-DD HH:MM
  if (/^\d{14}$/.test(s)) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)} ${s.slice(8,10)}:${s.slice(10,12)}`;
  if (/^\d{12}$/.test(s)) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)} ${s.slice(8,10)}:${s.slice(10,12)}`;
  if (/^\d{8}$/.test(s)) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
  return s;
}

const INFO_ROW = ({ label, value, highlight }: { label: string; value?: string | number; highlight?: boolean }) => (
  <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
    <div style={{ width: 130, fontSize: 13, color: '#64748b', fontWeight: 600, flexShrink: 0 }}>{label}</div>
    <div style={{ fontSize: 14, color: highlight ? '#0284c7' : '#1e293b', fontWeight: highlight ? 700 : 500, flex: 1 }}>{fmt(value)}</div>
  </div>
);

export default function TrackingPage() {
  const [blInput, setBlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = async () => {
    const blNo = blInput.trim();
    if (!blNo) { inputRef.current?.focus(); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/tracking?blNo=${encodeURIComponent(blNo)}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: '서버 연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
    setLoading(false);
  };

  const d = result?.data ?? {};
  const details = result?.details ?? [];

  // 현황 배지 색상
  const statusColor = (status: string) => {
    if (!status) return { bg: '#f1f5f9', text: '#64748b' };
    if (status.includes('반출') || status.includes('완료') || status.includes('수리')) return { bg: '#dcfce7', text: '#16a34a' };
    if (status.includes('신고') || status.includes('진행') || status.includes('통관')) return { bg: '#dbeafe', text: '#1d4ed8' };
    if (status.includes('입항') || status.includes('반입')) return { bg: '#fef3c7', text: '#d97706' };
    return { bg: '#f0f9ff', text: '#0284c7' };
  };

  const currentStatus = String(d.cargSttNm ?? d.cargSttsNm ?? '');
  const sc = statusColor(currentStatus);

  return (
    <main className="tracking-page" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      {/* Header */}
      <section style={{ paddingTop: 100, padding: '100px 24px 0', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
        <div className="container" style={{ textAlign: 'center', paddingBottom: 0, maxWidth: 800 }}>
          <div style={{ display: 'inline-block', padding: '5px 16px', background: 'rgba(14,165,233,0.2)', borderRadius: 20, fontSize: 12, fontWeight: 700, color: '#7dd3fc', marginBottom: 18, letterSpacing: 1 }}>
            관세청 유니패스(Unipass) 실시간 연동
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#fff', marginBottom: 14, lineHeight: 1.2 }}>
            화물 통관 현황 조회
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 36 }}>
            B/L 번호(House B/L 또는 Master B/L)를 입력하면 실제 통관 현황이 표시됩니다
          </p>

          {/* 검색창 */}
          <div className="tracking-search-row" style={{ display: 'flex', gap: 10, background: '#fff', padding: 8, borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', marginBottom: 0 }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="예) COSU1234567890  /  INCHEON-BL-XXXX"
              value={blInput}
              onChange={e => setBlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              style={{ flex: 1, padding: '14px 18px', border: 'none', outline: 'none', fontSize: 16, color: '#1e293b', background: 'transparent', letterSpacing: 0.5 }}
            />
            <button
              onClick={search}
              disabled={loading}
              style={{ padding: '14px 28px', background: loading ? '#94a3b8' : '#0ea5e9', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            >
              {loading ? '조회 중...' : '🔍 조회'}
            </button>
          </div>

          {/* 안내 */}
          <div style={{ paddingTop: 16, paddingBottom: 40, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            수입: HBL/MBL 번호 · 수출: B/L 번호 · 최근 3년 데이터 조회 (관세청 공식 API)
          </div>
        </div>
      </section>

      {/* 결과 */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div className="container" style={{ maxWidth: 800 }}>

          {/* 로딩 */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ display: 'inline-block', width: 48, height: 48, border: '4px solid #e2e8f0', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 20 }} />
              <p style={{ color: '#64748b', fontSize: 15 }}>관세청 유니패스에서 데이터를 불러오는 중...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* 오류 */}
          {!loading && result && !result.success && (
            <div style={{ padding: 32, background: '#fff', borderRadius: 16, border: '1px solid #fecaca', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>조회 결과 없음</div>
              <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{result.error}</div>
              <div style={{ marginTop: 20, fontSize: 13, color: '#94a3b8' }}>
                · B/L 번호의 대소문자, 하이픈(-) 포함 여부를 확인해주세요<br />
                · 선사에서 발급받은 정확한 번호를 입력해주세요
              </div>
            </div>
          )}

          {/* 성공 */}
          {!loading && result?.success && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* 상태 배너 */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6, letterSpacing: 1 }}>
                    {result.type === 'IMPORT' ? '수입 화물' : '수출 화물'} · {result.type === 'IMPORT' ? (result.blType === 'hblNo' ? 'House B/L' : 'Master B/L') : 'B/L'} · {result.year}년
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: 0.5 }}>
                    {blInput.toUpperCase()}
                  </div>
                </div>
                {currentStatus && (
                  <div style={{ padding: '10px 20px', borderRadius: 30, background: sc.bg, color: sc.text, fontWeight: 800, fontSize: 15 }}>
                    ● {currentStatus}
                  </div>
                )}
              </div>

              {/* 화물 기본 정보 */}
              <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  📦 화물 기본 정보
                </h3>
                {result.type === 'IMPORT' ? (
                  <>
                    <INFO_ROW label="화물 명칭" value={d.cargNm} />
                    <INFO_ROW label="HBL 번호" value={d.hblNo} />
                    <INFO_ROW label="MBL 번호" value={d.mblNo} />
                    <INFO_ROW label="적재항 (출발)" value={d.ldprNm} />
                    <INFO_ROW label="양하항 (도착)" value={d.dsprNm} />
                    <INFO_ROW label="입항 예정일 (ETA)" value={d.etprDt} highlight />
                    <INFO_ROW label="화주 (수출국)" value={d.shprCntrNm} />
                    <INFO_ROW label="수하인 (수입국)" value={d.cnseCntrNm} />
                    <INFO_ROW label="선사/항공사" value={d.shmtCsgNm ?? d.trsprCpNm} />
                    <INFO_ROW label="컨테이너 번호" value={d.cntrNo} />
                    <INFO_ROW label="중량 (KG)" value={d.grsWghtMsrm} />
                    <INFO_ROW label="현재 화물 상태" value={d.cargSttNm} highlight />
                  </>
                ) : (
                  <>
                    <INFO_ROW label="수출자" value={d.exprBsopNm} />
                    <INFO_ROW label="수출 신고 번호" value={d.expDclrNo} />
                    <INFO_ROW label="B/L 번호" value={d.blNo} />
                    <INFO_ROW label="선적일" value={d.ldgDt} highlight />
                    <INFO_ROW label="목적지 국가" value={d.dtnCtrNm} />
                    <INFO_ROW label="품명" value={d.gdNm} />
                  </>
                )}
              </div>

              {/* 통관 진행 타임라인 */}
              {details.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                    🕐 통관 진행 현황
                  </h3>
                  <div style={{ position: 'relative', paddingLeft: 36 }}>
                    <div style={{ position: 'absolute', left: 10, top: 10, bottom: 10, width: 2, background: '#e2e8f0' }} />
                    {details.map((dtl, i) => {
                      const stt = String(dtl.cargSttNm ?? dtl.prcsSttNm ?? '');
                      const dttm = String(dtl.dclrSttDttm ?? dtl.prcsDttm ?? '');
                      const place = String(dtl.prcsPlcNm ?? dtl.ldgPlcNm ?? '');
                      const color = statusColor(stt);
                      const isLatest = i === 0;
                      return (
                        <div key={i} style={{ position: 'relative', marginBottom: 20 }}>
                          <div style={{
                            position: 'absolute', left: -30, top: 3,
                            width: 16, height: 16, borderRadius: '50%',
                            background: isLatest ? '#0ea5e9' : '#cbd5e1',
                            border: isLatest ? '3px solid #bae6fd' : '2px solid #e2e8f0',
                            boxShadow: isLatest ? '0 0 0 4px rgba(14,165,233,0.15)' : 'none',
                            zIndex: 2,
                          }} />
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: isLatest ? 800 : 600, color: isLatest ? '#0f172a' : '#475569', marginBottom: 4 }}>
                                {stt || '처리 중'}
                              </div>
                              {place && <div style={{ fontSize: 12, color: '#94a3b8' }}>📍 {place}</div>}
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                              {fmt(dttm)}
                            </div>
                          </div>
                          {isLatest && stt && (
                            <div style={{ marginTop: 8, display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: color.bg, color: color.text, fontSize: 12, fontWeight: 700 }}>
                              현재 상태
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 유니패스 바로가기 */}
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <a href="https://unipass.customs.go.kr" target="_blank" rel="noreferrer"
                  style={{ fontSize: 13, color: '#94a3b8', textDecoration: 'none' }}>
                  🔗 관세청 유니패스(customs.go.kr)에서 상세 조회 →
                </a>
              </div>
            </div>
          )}

          {/* 초기 안내 */}
          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>🚢</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#334155', marginBottom: 12 }}>B/L 번호를 입력하세요</div>
              <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8 }}>
                관세청 유니패스 API로 실시간 통관 현황을 조회합니다<br />
                수입 화물(HBL/MBL)과 수출 화물 모두 조회 가능합니다
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
