'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

interface MarketData {
  success: boolean;
  timestamp: string;
  rates: { usd: number; cny: number; jpy: number };
  metals: Record<string, { price: number; prev: number; change: number; changePct: number; currency: string; name: string }>;
  history: Array<{ date: string; usd: number; cny: number; jpy: number; aluminum: number; copper: number; nickel: number; zinc: number; lead: number }>;
}

// SVG 미니 라인 차트
function LineChart({ data, color, height = 60 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return null;
  const w = 200, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(' ');
  const area = `0,${h} ` + pts + ` ${w},${h}`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`g-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#g-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

const RATE_META = [
  { key: 'usd', label: 'USD / KRW', flag: '🇺🇸', color: '#3b82f6', unit: '원' },
  { key: 'cny', label: 'CNY / KRW', flag: '🇨🇳', color: '#ef4444', unit: '원' },
  { key: 'jpy', label: 'JPY / KRW', flag: '🇯🇵', color: '#f59e0b', unit: '원/100엔' },
];

const METAL_META = [
  { key: 'aluminum', label: '알루미늄', en: 'Aluminum', symbol: 'AL', color: '#6366f1', unit: 'USD/ton', mult: 1000 },
  { key: 'copper', label: '구리', en: 'Copper', symbol: 'CU', color: '#f97316', unit: 'USD/ton', mult: 2204.62 },
  { key: 'nickel', label: '니켈', en: 'Nickel', symbol: 'NI', color: '#22c55e', unit: 'USD/ton', mult: 2204.62 },
  { key: 'zinc', label: '아연', en: 'Zinc', symbol: 'ZN', color: '#8b5cf6', unit: 'USD/ton', mult: 1 },
  { key: 'lead', label: '납', en: 'Lead', symbol: 'PB', color: '#64748b', unit: 'USD/ton', mult: 1 },
];

function pct(v: number) {
  const sign = v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(2)}%`;
}
function num(v: number, dec = 2) {
  if (!v || isNaN(v)) return '-';
  return v.toLocaleString('ko-KR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export default function MarketPage() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [chartKey, setChartKey] = useState<'usd' | 'cny' | 'jpy' | 'aluminum' | 'copper' | 'nickel'>('usd');

  useEffect(() => {
    fetch('/api/market')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const hist = data?.history ?? [];
  const chartMeta = [...RATE_META, ...METAL_META.slice(0, 3)];
  const activeChart = chartMeta.find(m => m.key === chartKey)!;
  const chartData = hist.map(h => Number((h as Record<string, number>)[chartKey] ?? 0)).filter(v => v > 0);

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      {/* Header */}
      <section style={{ paddingTop: 100, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '100px 24px 48px' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7dd3fc', letterSpacing: 2, marginBottom: 12 }}>LIVE MARKET DATA</div>
              <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 10 }}>
                시장 현황 · 원자재 시세
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                {data?.timestamp ? `업데이트: ${new Date(data.timestamp).toLocaleString('ko-KR')}` : '실시간 데이터 로딩 중...'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['card', 'table'] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
                    background: view === v ? '#0ea5e9' : 'rgba(255,255,255,0.08)', color: '#fff' }}>
                  {v === 'card' ? '📊 카드' : '📋 표'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 24px 80px' }}>
        <div className="container" style={{ maxWidth: 1100 }}>

          {loading && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ display: 'inline-block', width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <p style={{ marginTop: 16, color: '#64748b' }}>시장 데이터 로딩 중...</p>
            </div>
          )}

          {!loading && data?.success && (
            <>
              {/* 환율 섹션 */}
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  💱 주요 환율 <span style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>(KRW 기준)</span>
                </h2>
                {view === 'card' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {RATE_META.map(m => {
                      const val = data.rates[m.key as keyof typeof data.rates];
                      const prevArr = hist.map(h => Number((h as Record<string,number>)[m.key])).filter(v => v > 0);
                      const prev = prevArr.length > 1 ? prevArr[prevArr.length - 2] : val;
                      const chg = val - prev;
                      const chgPct = prev ? (chg / prev) * 100 : 0;
                      return (
                        <div key={m.key} onClick={() => setChartKey(m.key as typeof chartKey)}
                          style={{ background: '#fff', borderRadius: 16, padding: 24, border: `2px solid ${chartKey === m.key ? m.color : '#e2e8f0'}`, cursor: 'pointer', transition: 'all 0.2s', boxShadow: chartKey === m.key ? `0 8px 24px ${m.color}22` : '0 2px 8px rgba(0,0,0,0.04)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{m.flag} {m.label}</div>
                              <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a' }}>{num(m.key === 'jpy' ? val * 100 : val)}</div>
                              <div style={{ fontSize: 12, color: '#94a3b8' }}>{m.unit}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: chg >= 0 ? '#16a34a' : '#dc2626' }}>{pct(chgPct)}</div>
                              <div style={{ fontSize: 12, color: '#94a3b8' }}>{chg >= 0 ? '▲' : '▼'} {Math.abs(chg).toFixed(2)}</div>
                            </div>
                          </div>
                          <LineChart data={prevArr.map(v => m.key === 'jpy' ? v * 100 : v)} color={m.color} height={50} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['통화', '현재 환율', '전일비', '등락률', '단위'].map(h => (
                            <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {RATE_META.map((m, i) => {
                          const val = data.rates[m.key as keyof typeof data.rates];
                          const prevArr = hist.map(h => Number((h as Record<string,number>)[m.key])).filter(v => v > 0);
                          const prev = prevArr.length > 1 ? prevArr[prevArr.length - 2] : val;
                          const chg = val - prev;
                          const chgPct = prev ? (chg / prev) * 100 : 0;
                          return (
                            <tr key={m.key} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '14px 16px', fontWeight: 700 }}>{m.flag} {m.label}</td>
                              <td style={{ padding: '14px 16px', fontSize: 16, fontWeight: 900 }}>{num(m.key === 'jpy' ? val * 100 : val)}</td>
                              <td style={{ padding: '14px 16px', color: chg >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{chg >= 0 ? '▲' : '▼'} {Math.abs(chg).toFixed(2)}</td>
                              <td style={{ padding: '14px 16px', color: chg >= 0 ? '#16a34a' : '#dc2626', fontWeight: 700 }}>{pct(chgPct)}</td>
                              <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>{m.unit}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 비철금속 섹션 */}
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  ⚙️ LME 비철금속 시세 <span style={{ fontSize: 13, fontWeight: 500, color: '#94a3b8' }}>(Yahoo Finance 실시간)</span>
                </h2>
                <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>알루미늄·구리·니켈·아연·납 — LED 조명 핵심 원자재</p>
                {view === 'card' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                    {METAL_META.map(m => {
                      const metal = data.metals[m.key];
                      const prevArr = hist.map(h => Number((h as Record<string,number>)[m.key])).filter(v => v > 0);
                      if (!metal) return (
                        <div key={m.key} style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #e2e8f0', opacity: 0.5 }}>
                          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>{m.label}</div>
                          <div style={{ fontSize: 14, color: '#cbd5e1' }}>데이터 없음</div>
                        </div>
                      );
                      return (
                        <div key={m.key} onClick={() => setChartKey(m.key as typeof chartKey)}
                          style={{ background: '#fff', borderRadius: 14, padding: 20, border: `2px solid ${chartKey === m.key ? m.color : '#e2e8f0'}`, cursor: 'pointer', transition: 'all 0.2s', boxShadow: chartKey === m.key ? `0 8px 20px ${m.color}22` : '0 2px 6px rgba(0,0,0,0.04)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>{m.label} ({m.symbol})</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: metal.changePct >= 0 ? '#16a34a' : '#dc2626' }}>{pct(metal.changePct)}</div>
                          </div>
                          <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>
                            ${num(metal.price, 0)}
                          </div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>{m.unit} · {metal.currency}</div>
                          <LineChart data={prevArr.length > 1 ? prevArr : [metal.prev, metal.price]} color={m.color} height={40} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['금속', '현재가 (USD)', '전일종가', '변동', '등락률', '단위'].map(h => (
                            <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {METAL_META.map((m, i) => {
                          const metal = data.metals[m.key];
                          return (
                            <tr key={m.key} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '14px 16px', fontWeight: 700 }}>{m.label} <span style={{ fontSize: 11, color: '#94a3b8' }}>({m.symbol})</span></td>
                              <td style={{ padding: '14px 16px', fontSize: 16, fontWeight: 900 }}>${num(metal?.price ?? 0, 2)}</td>
                              <td style={{ padding: '14px 16px', color: '#475569' }}>${num(metal?.prev ?? 0, 2)}</td>
                              <td style={{ padding: '14px 16px', color: (metal?.change ?? 0) >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>{(metal?.change ?? 0) >= 0 ? '▲' : '▼'} {Math.abs(metal?.change ?? 0).toFixed(2)}</td>
                              <td style={{ padding: '14px 16px', color: (metal?.changePct ?? 0) >= 0 ? '#16a34a' : '#dc2626', fontWeight: 700 }}>{pct(metal?.changePct ?? 0)}</td>
                              <td style={{ padding: '14px 16px', fontSize: 12, color: '#94a3b8' }}>{m.unit}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 히스토리 차트 */}
              {hist.length > 1 && (
                <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: 40 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>📈 30일 추이</h2>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {[...RATE_META, ...METAL_META.slice(0,3)].map(m => (
                        <button key={m.key} onClick={() => setChartKey(m.key as typeof chartKey)}
                          style={{ padding: '5px 12px', borderRadius: 20, border: `1.5px solid ${chartKey === m.key ? m.color : '#e2e8f0'}`, background: chartKey === m.key ? m.color + '18' : 'transparent', color: chartKey === m.key ? m.color : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          {m.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ position: 'relative', height: 180 }}>
                    <LineChart data={chartData} color={activeChart?.color ?? '#0ea5e9'} height={180} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
                    <span>{hist[0]?.date}</span>
                    <span style={{ fontWeight: 700, color: activeChart?.color }}>{activeChart?.label}</span>
                    <span>{hist[hist.length - 1]?.date}</span>
                  </div>
                </div>
              )}

              {/* 히스토리 표 */}
              {hist.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>🗂️ 종가 히스토리</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>Supabase 자동 저장 · 최근 {hist.length}일</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['날짜', 'USD', 'CNY', 'JPY/100', 'AL(알루미늄)', 'CU(구리)', 'NI(니켈)'].map(h => (
                            <th key={h} style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#475569', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[...hist].reverse().map((row, i) => (
                          <tr key={row.date} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 14px', fontWeight: 600, color: '#334155' }}>{row.date}</td>
                            <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace' }}>{num(row.usd)}</td>
                            <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace' }}>{num(row.cny)}</td>
                            <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace' }}>{num(row.jpy * 100)}</td>
                            <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace' }}>${num(row.aluminum, 0)}</td>
                            <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace' }}>${num(row.copper, 0)}</td>
                            <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'monospace' }}>${num(row.nickel, 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {!loading && !data?.success && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
              <div style={{ color: '#dc2626', fontWeight: 700, marginBottom: 8 }}>데이터 로딩 실패</div>
              <div style={{ color: '#94a3b8', fontSize: 14 }}>잠시 후 새로고침해주세요</div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
