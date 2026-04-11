'use client';
import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface HsInfo { hsSgn: string; hsNm: string; hsNmEn: string; unit: string; chapter: string; heading: string; }
interface RateItem { type: string; rate: string; unit: string; note: string; }
interface FtaItem { country: string; ftaCd: string; rate: string; unit: string; stage: string; origin: string; note: string; }
interface HsResult {
  type: 'detail' | 'list';
  dataSource?: 'unipass' | 'static';
  apiKeyRequired?: boolean;
  hsInfo?: HsInfo;
  basicRates?: RateItem[];
  ftaRates?: RateItem[];
  ftaDetail?: FtaItem[];
  otherRates?: RateItem[];
  rawCount?: number;
  ftaCount?: number;
  items?: any[];
  error?: string;
}

const FTA_FLAG: Record<string, string> = {
  US:'🇺🇸', CN:'🇨🇳', EU:'🇪🇺', A:'🌏', AU:'🇦🇺', CA:'🇨🇦', CL:'🇨🇱',
  CO:'🇨🇴', E:'🇨🇭', GB:'🇬🇧', IL:'🇮🇱', IN:'🇮🇳', KH:'🇰🇭', NZ:'🇳🇿',
  PE:'🇵🇪', RC:'🌏', SG:'🇸🇬', TR:'🇹🇷', VN:'🇻🇳', MX:'🇲🇽',
};

function fmtHs(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0,4)}.${d.slice(4)}`;
  return `${d.slice(0,4)}.${d.slice(4,6)}-${d.slice(6)}`;
}

function rateColor(rate: string) {
  if (rate === '0' || rate === '0%' || rate === '0.0') return '#34d399';
  if (rate === '-' || rate === '') return '#94a3b8';
  const n = parseFloat(rate);
  if (n === 0) return '#34d399';
  if (n <= 5) return '#60a5fa';
  if (n <= 10) return '#f59e0b';
  return '#ef4444';
}

const CARD: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 20,
};

// 관세청 공식 링크 생성
function customsUrl(hsSgn: string) {
  return `https://www.customs.go.kr/kcs/main/nationschedules/singleList.do`;
}
function ftaPortalUrl(hsSgn: string) {
  return `https://www.ftaportal.fta.go.kr/ftaKor/fta01.do`;
}

export default function HsCodePage() {
  const [input, setInput]     = useState('');
  const [mode, setMode]       = useState<'code' | 'keyword'>('code');
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<HsResult | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'fta' | 'other'>('basic');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (v: string) => {
    if (mode === 'code') {
      const digits = v.replace(/\D/g, '').slice(0, 10);
      setInput(fmtHs(digits));
    } else {
      setInput(v);
    }
  };

  const search = async () => {
    const q = input.replace(/[\.\-\s]/g, '');
    if (!q) { inputRef.current?.focus(); return; }
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`/api/hscode?q=${encodeURIComponent(q)}&mode=${mode}`);
      const data = await res.json();
      setResult(data);
      if (data.type === 'detail') setActiveTab('basic');
    } catch {
      setResult({ type: 'detail', error: '서버 연결 오류가 발생했습니다.' });
    }
    setLoading(false);
  };

  const selectHs = (hs: string) => {
    const digits = hs.replace(/\D/g, '');
    setMode('code');
    setInput(fmtHs(digits));
    setResult(null);
    setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hscode?q=${encodeURIComponent(digits)}&mode=code`);
        const data = await res.json();
        setResult(data);
        if (data.type === 'detail') setActiveTab('basic');
      } catch {
        setResult({ type: 'detail', error: '서버 연결 오류' });
      }
      setLoading(false);
    }, 50);
  };

  const hsSgn = result?.hsInfo?.hsSgn || input.replace(/[\.\-\s]/g, '');

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔎</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>HS 코드 세율 조회</h1>
          <p style={{ fontSize: 15, color: '#64748b' }}>수입 관세율 · FTA 협정세율 · WTO 세율 한눈에 확인</p>
        </div>

        {/* 검색 박스 */}
        <div style={{ ...CARD, padding: '24px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {(['code', 'keyword'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setInput(''); setResult(null); }}
                style={{ padding: '7px 18px', borderRadius: 20, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  background: mode === m ? '#0ea5e9' : '#f1f5f9', color: mode === m ? '#fff' : '#64748b' }}>
                {m === 'code' ? '🔢 HS 코드 직접 입력' : '🔤 품목명 키워드'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input ref={inputRef} value={input}
              onChange={e => handleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder={mode === 'code' ? 'HS 코드 입력 (예: 8541.40-0000)' : '품목명 입력 (예: LED 조명)'}
              style={{ flex: 1, padding: '13px 18px', borderRadius: 12, border: '2px solid #e2e8f0', fontSize: 16, fontFamily: 'monospace', outline: 'none',
                transition: '0.15s', letterSpacing: mode === 'code' ? 1 : 0 }}
              onFocus={e => e.target.style.borderColor = '#0ea5e9'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            <button onClick={search} disabled={loading}
              style={{ padding: '13px 28px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1 }}>
              {loading ? '조회 중…' : '조회'}
            </button>
          </div>
        </div>

        {/* 로딩 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <div>관세청 데이터 조회 중…</div>
          </div>
        )}

        {/* 에러 */}
        {result?.error && (
          <div style={{ ...CARD, padding: '24px', background: '#fef2f2', borderColor: '#fecaca' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
            <div style={{ color: '#dc2626', fontWeight: 700 }}>{result.error}</div>
          </div>
        )}

        {/* 결과: 목록 (키워드 검색) */}
        {result?.type === 'list' && !result.error && (
          <div style={CARD}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>검색 결과 ({result.items?.length || 0}건)</h3>
            </div>
            {(result.items?.length || 0) === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                <div style={{ marginBottom: 16 }}>검색 결과가 없습니다.</div>
                <a href="https://www.customs.go.kr/kcs/main/nationschedules/singleList.do" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', padding: '10px 20px', background: '#0ea5e9', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  🏛️ 관세청 세율표에서 직접 검색
                </a>
              </div>
            ) : (
              <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                {result.items!.map((item: any, i: number) => (
                  <button key={i} onClick={() => selectHs(String(item.hsSgn || item.hsCd || ''))}
                    style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0',
                      borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: '0.12s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e0f2fe'; (e.currentTarget as HTMLElement).style.borderColor = '#0ea5e9'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0369a1', letterSpacing: 0.5 }}>
                      {fmtHs(String(item.hsSgn || item.hsCd || ''))}
                    </span>
                    <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 600 }}>{item.hsNm || item.itemNm || '-'}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 결과: 상세 (코드 조회) */}
        {result?.type === 'detail' && !result.error && (
          <div>
            {/* HS 코드 정보 헤더 */}
            <div style={{ ...CARD, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 900, color: '#0369a1', letterSpacing: 1 }}>
                      {fmtHs(result.hsInfo?.hsSgn || hsSgn)}
                    </span>
                    {result.dataSource === 'static' && (
                      <span style={{ fontSize: 11, padding: '3px 8px', background: '#fef3c7', color: '#92400e', borderRadius: 6, fontWeight: 700 }}>
                        📊 내장 데이터 (2026년 기준)
                      </span>
                    )}
                    {result.apiKeyRequired && (
                      <span style={{ fontSize: 11, padding: '3px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: 6, fontWeight: 700 }}>
                        API 미등록 HS코드
                      </span>
                    )}
                  </div>
                  {result.hsInfo?.hsNm && (
                    <div style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{result.hsInfo.hsNm}</div>
                  )}
                  {result.hsInfo?.hsNmEn && (
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{result.hsInfo.hsNmEn}</div>
                  )}
                  {result.hsInfo?.unit && (
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>단위: {result.hsInfo.unit}</div>
                  )}
                </div>

                {/* HS 구조 표시 */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { label: '류 (Chapter)', val: result.hsInfo?.chapter },
                    { label: '호 (Heading)', val: result.hsInfo?.heading },
                  ].filter(x => x.val).map(x => (
                    <div key={x.label} style={{ background: '#f0f9ff', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{x.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#0369a1', fontFamily: 'monospace' }}>{x.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 공식 사이트 링크 */}
              <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href={customsUrl(hsSgn)} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#0f172a', color: '#fff',
                    borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                  🏛️ 관세청 세율표 조회
                </a>
                <a href={ftaPortalUrl(hsSgn)} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#0369a1', color: '#fff',
                    borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                  🤝 FTA 포털 세율 조회
                </a>
              </div>
            </div>

            {/* API 키 미등록 안내 */}
            {result.apiKeyRequired && (
              <div style={{ ...CARD, padding: '24px', background: '#fffbeb', borderColor: '#fef3c7' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 28 }}>ℹ️</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#92400e', marginBottom: 6 }}>
                      이 HS 코드는 내장 데이터베이스에 없습니다
                    </div>
                    <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.7 }}>
                      실시간 세율 조회를 위해서는 위 버튼을 클릭해 <strong>관세청 세율표</strong>에서 직접 확인하세요.<br />
                      LED 조명 관련 주요 HS 코드(8541, 8539, 9405 등)는 아래 버튼으로 바로 조회할 수 있습니다.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 내장 데이터 안내 */}
            {result.dataSource === 'static' && (
              <div style={{ ...CARD, padding: '14px 20px', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <div style={{ fontSize: 12, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📊</span>
                  <span><strong>참고 데이터</strong> — 2026년 기준 내장 데이터입니다. 실제 통관 세율은 위 버튼에서 관세청 공식 세율표를 반드시 확인하세요.</span>
                </div>
              </div>
            )}

            {/* 탭 */}
            {!result.apiKeyRequired && (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {[
                    { key: 'basic', label: '📊 기본·WTO세율' },
                    { key: 'fta',   label: `🤝 FTA협정세율 ${result.ftaDetail?.length ? `(${result.ftaDetail.length}개국)` : ''}` },
                    { key: 'other', label: '📋 기타세율' },
                  ].map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                      style={{ padding: '9px 18px', borderRadius: 10, border: '2px solid', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                        background: activeTab === t.key ? '#0ea5e9' : '#fff',
                        color: activeTab === t.key ? '#fff' : '#64748b',
                        borderColor: activeTab === t.key ? '#0ea5e9' : '#e2e8f0' }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* 기본·WTO 탭 */}
                {activeTab === 'basic' && (
                  <div style={CARD}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>기본 세율 및 WTO 협정세율</h3>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>MFN(최혜국) 세율 — FTA 미적용 일반 수입세율</p>
                    </div>
                    {(result.basicRates?.length || 0) === 0 ? (
                      <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
                        세율 정보가 없습니다.
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            {['세율 구분', '세율 (%)', '단위', '비고'].map(h => (
                              <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.basicRates!.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}
                              onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                              onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fff'}>
                              <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{r.type}</td>
                              <td style={{ padding: '14px 20px' }}>
                                <span style={{ fontSize: 22, fontWeight: 900, color: rateColor(r.rate) }}>
                                  {r.rate}{r.rate !== '-' && !r.rate.includes('%') ? '%' : ''}
                                </span>
                              </td>
                              <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{r.unit || '-'}</td>
                              <td style={{ padding: '14px 20px', fontSize: 12, color: '#94a3b8' }}>{r.note || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* FTA 탭 */}
                {activeTab === 'fta' && (
                  <div style={CARD}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>FTA 협정세율</h3>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>한국이 체결한 FTA 협정별 수입 세율 — 원산지 증명서 필요</p>
                    </div>
                    {(result.ftaDetail?.length || 0) === 0 ? (
                      <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>🤝</div>
                        FTA 세율 정보가 없습니다.
                        <div style={{ marginTop: 16 }}>
                          <a href="https://www.ftaportal.fta.go.kr/ftaKor/fta01.do" target="_blank" rel="noopener noreferrer"
                            style={{ padding: '10px 20px', background: '#0369a1', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                            🤝 FTA 포털에서 직접 조회
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* FTA 국가별 그리드 */}
                        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, borderBottom: '1px solid #f1f5f9' }}>
                          {result.ftaDetail!.map((f, i) => (
                            <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                <span style={{ fontSize: 18 }}>{FTA_FLAG[f.ftaCd] || '🌐'}</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{f.country}</span>
                              </div>
                              <div style={{ fontSize: 24, fontWeight: 900, color: rateColor(f.rate) }}>
                                {f.rate}{f.rate !== '-' && !f.rate.includes('%') ? '%' : ''}
                              </div>
                              {f.note && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{f.note}</div>}
                            </div>
                          ))}
                        </div>
                        {/* FTA 상세 테이블 */}
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc' }}>
                              {['협정국', '협정세율', '원산지 기준', '비고'].map(h => (
                                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {result.ftaDetail!.map((f, i) => (
                              <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}
                                onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                                onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fff'}>
                                <td style={{ padding: '12px 16px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 16 }}>{FTA_FLAG[f.ftaCd] || '🌐'}</span>
                                    <div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{f.country}</div>
                                      <div style={{ fontSize: 10, color: '#94a3b8' }}>{f.ftaCd}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                  <span style={{ fontSize: 18, fontWeight: 900, color: rateColor(f.rate) }}>
                                    {f.rate}{f.rate !== '-' && !f.rate.includes('%') ? '%' : ''}
                                  </span>
                                </td>
                                <td style={{ padding: '12px 16px', fontSize: 11, color: '#64748b', maxWidth: 200 }}>{f.origin || '-'}</td>
                                <td style={{ padding: '12px 16px', fontSize: 11, color: '#94a3b8' }}>{f.note || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={{ padding: '14px 20px', background: '#fffbeb', borderTop: '1px solid #fef3c7' }}>
                          <p style={{ fontSize: 12, color: '#92400e', margin: 0 }}>
                            ⚠️ FTA 세율 적용을 위해서는 <strong>원산지증명서(C/O)</strong>가 필요합니다. 원산지 기준을 충족하지 못하면 기본세율(MFN) 적용.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 기타 세율 탭 */}
                {activeTab === 'other' && (
                  <div style={CARD}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>기타 세율</h3>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>잠정세율, 편익관세, 특별긴급관세 등</p>
                    </div>
                    {(result.otherRates?.length || 0) === 0 ? (
                      <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
                        해당 HS 코드에 기타 세율 정보가 없습니다.
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            {['세율 구분', '세율', '단위', '비고'].map(h => (
                              <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.otherRates!.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                              <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{r.type}</td>
                              <td style={{ padding: '14px 20px' }}>
                                <span style={{ fontSize: 16, fontWeight: 900, color: rateColor(r.rate) }}>
                                  {r.rate}{r.rate !== '-' && !r.rate.includes('%') ? '%' : ''}
                                </span>
                              </td>
                              <td style={{ padding: '14px 20px', fontSize: 13, color: '#64748b' }}>{r.unit || '-'}</td>
                              <td style={{ padding: '14px 20px', fontSize: 12, color: '#94a3b8' }}>{r.note || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 면책 안내 */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
              <strong>📌 유의사항</strong><br />
              본 정보는 참고용입니다. 실제 통관 적용 세율은 수입 신고 시점의 관세율표를 기준으로 하며, 정확한 세율은 관세청(125번) 또는 관세사에게 문의하시기 바랍니다.
            </div>
          </div>
        )}

        {/* 빠른 예시 HS 코드 */}
        {!result && !loading && (
          <div style={CARD}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#475569' }}>자주 조회하는 HS 코드</h3>
            </div>
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {[
                { hs: '8539510000', nm: 'LED 모듈 (엘이디 모듈)' },
                { hs: '8539520000', nm: 'LED 램프 (엘이디 램프)' },
                { hs: '9405110000', nm: 'LED 천장/벽 조명기구' },
                { hs: '9405210000', nm: 'LED 스탠드/데스크 조명' },
                { hs: '9405420000', nm: 'LED 기타 조명기구' },
                { hs: '9405492000', nm: '투광형 조명기구' },
                { hs: '9405493000', nm: '가로등 조명기구' },
                { hs: '8544421000', nm: '전기 도체 (전선류)' },
              ].map(item => (
                <button key={item.hs} onClick={() => selectHs(item.hs)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0',
                    borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: '0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e0f2fe'; (e.currentTarget as HTMLElement).style.borderColor = '#0ea5e9'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#0369a1', letterSpacing: 0.5, flexShrink: 0 }}>{fmtHs(item.hs)}</span>
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{item.nm}</span>
                </button>
              ))}
            </div>

            {/* 공식 링크 패널 */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="https://www.customs.go.kr/kcs/main/nationschedules/singleList.do" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#0f172a', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                🏛️ 관세청 세율표 (전체 조회)
              </a>
              <a href="https://www.ftaportal.fta.go.kr/ftaKor/fta01.do" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#0369a1', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                🤝 FTA 포털 협정세율
              </a>
              <a href="https://unipass.customs.go.kr/csp/index.do" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#64748b', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                📦 Unipass 화물추적
              </a>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
