'use client';
import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ── 타입 ──────────────────────────────────────────────────────────────
interface HsInfo { hsSgn: string; hsNm: string; hsNmEn: string; unit: string; chapter: string; heading: string; }
interface RateItem { type: string; rate: string; unit: string; note: string; }
interface FtaItem { country: string; ftaCd: string; rate: string; unit: string; stage: string; origin: string; note: string; }
interface HsResult {
  type: 'detail' | 'list';
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

// ── FTA 국가별 플래그 ─────────────────────────────────────────────────
const FTA_FLAG: Record<string, string> = {
  US:'🇺🇸', CN:'🇨🇳', EU:'🇪🇺', A:'🌏', AU:'🇦🇺', CA:'🇨🇦', CL:'🇨🇱',
  CO:'🇨🇴', E:'🇨🇭', GB:'🇬🇧', IL:'🇮🇱', IN:'🇮🇳', KH:'🇰🇭', NZ:'🇳🇿',
  PE:'🇵🇪', RC:'🌏', SG:'🇸🇬', TR:'🇹🇷', VN:'🇻🇳', MX:'🇲🇽',
};

// HS 코드 자동 포맷 (1234567890 → 1234.56-7890)
function fmtHs(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0,4)}.${d.slice(4)}`;
  if (d.length <= 10) return `${d.slice(0,4)}.${d.slice(4,6)}-${d.slice(6)}`;
  return d;
}

// 세율 색상
function rateColor(rate: string) {
  if (rate === '0' || rate === '0%' || rate === '0.0') return '#34d399';
  if (rate === '-' || rate === '') return '#94a3b8';
  const n = parseFloat(rate);
  if (n === 0) return '#34d399';
  if (n <= 5) return '#60a5fa';
  if (n <= 10) return '#f59e0b';
  return '#ef4444';
}

// ── 공통 스타일 ──────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)', marginBottom: 20,
};

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

  const selectHs = (hsSgn: string) => {
    setMode('code');
    setInput(fmtHs(hsSgn.replace(/\D/g, '')));
    setResult(null);
    setTimeout(() => search(), 100);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 }}>CUSTOMS TARIFF</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 14, letterSpacing: -0.5 }}>HS코드 세율 조회</h1>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
            HS코드 또는 품목명으로 기본세율, WTO협정세율, FTA 협정세율(한-미, 한-중, ASEAN, RCEP 등)을 조회합니다.<br />
            <span style={{ fontSize: 13, color: '#94a3b8' }}>※ 관세청 UNI-PASS 연동 · 최신 관세율표 기준</span>
          </p>
        </div>

        {/* 검색 박스 */}
        <div style={{ ...CARD, padding: '28px 32px', marginBottom: 28 }}>
          {/* 모드 토글 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {([['code','HS코드 직접 입력'],['keyword','품목명 키워드 검색']] as const).map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); setInput(''); setResult(null); }}
                style={{ padding: '8px 18px', borderRadius: 8, border: `1px solid ${mode === m ? '#0ea5e9' : '#e2e8f0'}`, background: mode === m ? '#e0f2fe' : '#fff', color: mode === m ? '#0369a1' : '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: '0.15s' }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input ref={inputRef}
                value={input}
                onChange={e => handleInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                placeholder={mode === 'code' ? '예: 8541.10-1000  또는  854110' : '예: LED조명, 태양전지, 알루미늄'}
                style={{ width: '100%', padding: '15px 20px', fontSize: 17, border: '2px solid #e2e8f0', borderRadius: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: '0.2s', letterSpacing: mode === 'code' ? 1 : 0 }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#0ea5e9'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'}
              />
              {input && (
                <button onClick={() => { setInput(''); setResult(null); inputRef.current?.focus(); }}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 14, color: '#94a3b8' }}>×</button>
              )}
            </div>
            <button onClick={search} disabled={loading}
              style={{ padding: '0 32px', background: loading ? '#94a3b8' : '#0ea5e9', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', minWidth: 100, transition: '0.2s' }}>
              {loading ? '조회 중…' : '🔍 조회'}
            </button>
          </div>

          {/* HS 코드 계층 안내 */}
          {mode === 'code' && (
            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: '4자리 (호)', desc: '예: 8541', ex: '8541' },
                { label: '6자리 (소호)', desc: '예: 8541.10', ex: '854110' },
                { label: '10자리 (통계부호)', desc: '예: 8541.10-1000', ex: '8541101000' },
              ].map(g => (
                <button key={g.ex} onClick={() => { setInput(fmtHs(g.ex)); }}
                  style={{ padding: '5px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, fontSize: 11, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {g.label} <span style={{ color: '#94a3b8' }}>{g.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 로딩 */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            관세청 UNI-PASS 조회 중…
          </div>
        )}

        {/* 오류 */}
        {result?.error && (
          <div style={{ ...CARD, padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>⚠️</div>
            <div style={{ color: '#ef4444', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{result.error}</div>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>HS 코드를 정확히 입력했는지 확인하거나, 키워드 검색을 이용해 보세요.</div>
          </div>
        )}

        {/* 키워드 검색 결과 (리스트) */}
        {result?.type === 'list' && result.items && (
          <div style={CARD}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>검색 결과 <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 13 }}>{result.items.length}건</span></h2>
            </div>
            {result.items.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>검색 결과가 없습니다. 다른 키워드를 입력해 보세요.</div>
            ) : (
              <div>
                {result.items.map((item: any, i: number) => {
                  const hs = String(item.hsSgn || item.hsCd || '');
                  const nm = String(item.hsNm || item.itemNm || '');
                  const nmEn = String(item.hsNmEn || item.itemNmEn || '');
                  return (
                    <div key={i} onClick={() => selectHs(hs)}
                      style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: i < result.items!.length - 1 ? '1px solid #f8fafc' : 'none', cursor: 'pointer', transition: '0.12s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#fff'}>
                      <div style={{ background: '#e0f2fe', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 800, color: '#0369a1', flexShrink: 0, letterSpacing: 1 }}>
                        {fmtHs(hs)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{nm}</div>
                        {nmEn && <div style={{ fontSize: 12, color: '#94a3b8' }}>{nmEn}</div>}
                      </div>
                      <span style={{ fontSize: 13, color: '#0ea5e9', fontWeight: 700 }}>세율 조회 →</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 상세 결과 */}
        {result?.type === 'detail' && !result.error && result.hsInfo && (
          <div>
            {/* HS 코드 기본 정보 */}
            <div style={{ ...CARD, padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #0369a1)', borderRadius: 14, padding: '14px 20px', flexShrink: 0, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4, letterSpacing: 1 }}>HS CODE</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: 2 }}>{fmtHs(result.hsInfo.hsSgn)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 6, lineHeight: 1.3 }}>
                    {result.hsInfo.hsNm || '품목명 조회 중'}
                  </h2>
                  {result.hsInfo.hsNmEn && <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{result.hsInfo.hsNmEn}</div>}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                      제{result.hsInfo.chapter}류
                    </span>
                    <span style={{ fontSize: 12, background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                      {result.hsInfo.heading}호
                    </span>
                    {result.hsInfo.unit && (
                      <span style={{ fontSize: 12, background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                        단위: {result.hsInfo.unit}
                      </span>
                    )}
                    <span style={{ fontSize: 12, background: '#f0fdf4', color: '#166534', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                      FTA {result.ftaCount || result.ftaDetail?.length || 0}개국
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#fff', borderRadius: 12, padding: '6px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
              {([
                ['basic',  '📊 기본 · WTO 세율', (result.basicRates?.length || 0) + (result.otherRates?.length || 0)],
                ['fta',    '🤝 FTA 협정세율',     result.ftaDetail?.length || 0],
                ['other',  '📋 기타 세율',         result.otherRates?.length || 0],
              ] as const).map(([tab, label, cnt]) => (
                <button key={tab} onClick={() => setActiveTab(tab as any)}
                  style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: activeTab === tab ? '#0ea5e9' : 'transparent', color: activeTab === tab ? '#fff' : '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: '0.15s', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {label}
                  {(cnt as number) > 0 && <span style={{ fontSize: 11, background: activeTab === tab ? 'rgba(255,255,255,0.25)' : '#f1f5f9', borderRadius: 10, padding: '1px 6px' }}>{cnt as number}</span>}
                </button>
              ))}
            </div>

            {/* 기본 · WTO 세율 탭 */}
            {activeTab === 'basic' && (
              <div style={CARD}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>기본 세율 및 WTO 협정세율</h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>MFN(최혜국) 세율 — FTA 미적용 일반 수입세율</p>
                </div>
                {(result.basicRates?.length || 0) === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
                    세율 정보를 불러오지 못했습니다.<br />
                    <span style={{ fontSize: 12 }}>관세청 API 응답을 확인 중입니다.</span>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['세율 구분', '세율 (%)', '단위', '비고'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid #e2e8f0' }}>{h}</th>
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
                            <span style={{ fontSize: 18, fontWeight: 900, color: rateColor(r.rate) }}>{r.rate}{r.rate !== '-' && !r.rate.includes('%') ? '%' : ''}</span>
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

            {/* FTA 협정세율 탭 */}
            {activeTab === 'fta' && (
              <div style={CARD}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>FTA 협정세율</h3>
                  <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>한국이 체결한 FTA 협정별 수입 세율 — 원산지 증명서 필요</p>
                </div>

                {(result.ftaDetail?.length || 0) === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>🤝</div>
                    FTA 세율 정보가 없거나 조회에 실패했습니다.<br />
                    <span style={{ fontSize: 12 }}>10자리 HS 코드로 조회 시 더 상세한 정보를 얻을 수 있습니다.</span>
                  </div>
                ) : (
                  <div>
                    {/* 요약 그리드 */}
                    <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, borderBottom: '1px solid #f1f5f9' }}>
                      {result.ftaDetail!.map((f, i) => (
                        <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <span style={{ fontSize: 18 }}>{FTA_FLAG[f.ftaCd] || '🌐'}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>{f.country}</span>
                          </div>
                          <div style={{ fontSize: 22, fontWeight: 900, color: rateColor(f.rate) }}>
                            {f.rate}{f.rate !== '-' && !f.rate.includes('%') ? '%' : ''}
                          </div>
                          {f.stage && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>단계: {f.stage}</div>}
                        </div>
                      ))}
                    </div>

                    {/* 상세 테이블 */}
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['협정국', '협정세율', '단계', '원산지 기준', '비고'].map(h => (
                            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid #e2e8f0' }}>{h}</th>
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
                                <span style={{ fontSize: 18 }}>{FTA_FLAG[f.ftaCd] || '🌐'}</span>
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
                              {f.unit && <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>{f.unit}</span>}
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{f.stage || '-'}</td>
                            <td style={{ padding: '12px 16px', fontSize: 11, color: '#64748b', maxWidth: 200 }}>{f.origin || '-'}</td>
                            <td style={{ padding: '12px 16px', fontSize: 11, color: '#94a3b8' }}>{f.note || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* 원산지 안내 */}
                    <div style={{ padding: '16px 20px', background: '#fffbeb', borderTop: '1px solid #fef3c7' }}>
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
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.otherRates!.map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{r.type}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ fontSize: 16, fontWeight: 900, color: rateColor(r.rate) }}>{r.rate}{r.rate !== '-' && !r.rate.includes('%') ? '%' : ''}</span>
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

            {/* 면책 안내 */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
              <strong>📌 유의사항</strong><br />
              본 정보는 관세청 UNI-PASS 데이터 기반이며 참고용입니다. 실제 통관 적용 세율은 수입 신고 시점의 관세율표를 기준으로 하며, 정확한 세율은 관세청 또는 관세사에게 문의하시기 바랍니다.
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
                { hs: '8541101000', nm: 'LED 다이오드' },
                { hs: '9405409000', nm: 'LED 조명기구 (기타)' },
                { hs: '8539500000', nm: 'LED 램프' },
                { hs: '7606120000', nm: '알루미늄 합금판' },
                { hs: '7403110000', nm: '정제동 (알음극)' },
                { hs: '7502100000', nm: '정제니켈' },
                { hs: '7901110000', nm: '아연 (합금아닌)' },
                { hs: '8544421000', nm: '전기 도체 (전선류)' },
              ].map(item => (
                <button key={item.hs} onClick={() => { setMode('code'); setInput(fmtHs(item.hs)); setTimeout(() => search(), 100); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: '0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e0f2fe'; (e.currentTarget as HTMLElement).style.borderColor = '#0ea5e9'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#0369a1', letterSpacing: 0.5, flexShrink: 0 }}>{fmtHs(item.hs)}</span>
                  <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{item.nm}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
