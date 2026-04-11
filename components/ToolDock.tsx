'use client';
import { useState, useEffect, useCallback } from 'react';

type Tool = 'port' | 'cbm' | 'cost' | null;

// ── 스타일 헬퍼 ──────────────────────────────────────────────────────
const INP: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8, padding: '8px 11px', color: '#fff', fontSize: 13,
  fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const,
};
const LBL: React.CSSProperties = {
  fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4,
  display: 'block', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.4,
};
const SEL: React.CSSProperties = { ...INP, padding: '8px 8px' };
const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 16px',
  border: '1px solid rgba(255,255,255,0.07)', marginBottom: 12,
};

const n = (v: string | number) => parseFloat(String(v)) || 0;
const fmt = (v: number, d = 0) => v.toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d });

// ── CBM 계산기 ────────────────────────────────────────────────────────
const CONTAINER = { '20ft': 27, '40ft': 56, '40HQ': 67.5 };

function CbmCalculator() {
  const [items, setItems] = useState([{
    name: '', l: '', w: '', h: '', innerQty: '', orderQty: '', unit: 'mm' as 'mm' | 'cm',
  }]);

  const upd = (i: number, k: string, v: string) => {
    const next = [...items]; (next[i] as any)[k] = v; setItems(next);
  };
  const addItem = () => setItems([...items, { name: '', l: '', w: '', h: '', innerQty: '', orderQty: '', unit: 'mm' }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const calc = (item: typeof items[0]) => {
    const factor = item.unit === 'mm' ? 1e9 : 1e6;
    const l = n(item.l), w = n(item.w), h = n(item.h);
    const cbmPerBox = l && w && h ? (l * w * h) / factor : 0;
    const innerQty = Math.max(1, Math.round(n(item.innerQty)));
    const orderQty = Math.round(n(item.orderQty));
    const boxes = orderQty && innerQty ? Math.ceil(orderQty / innerQty) : 0;
    const totalCbm = cbmPerBox * boxes;
    return { cbmPerBox, innerQty, orderQty, boxes, totalCbm };
  };

  const totals = items.map(calc);
  const grandCbm = totals.reduce((s, t) => s + t.totalCbm, 0);
  const grandBoxes = totals.reduce((s, t) => s + t.boxes, 0);

  return (
    <div>
      {items.map((item, i) => {
        const c = calc(item);
        return (
          <div key={i} style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <input value={item.name} onChange={e => upd(i, 'name', e.target.value)}
                placeholder={`품목 ${i + 1}`}
                style={{ ...INP, width: 160, fontSize: 12, padding: '5px 9px' }} />
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <select value={item.unit} onChange={e => upd(i, 'unit', e.target.value)}
                  style={{ ...SEL, width: 55, padding: '5px 5px', fontSize: 11 }}>
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                </select>
                {items.length > 1 && (
                  <button onClick={() => removeItem(i)} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: 6, padding: '4px 9px', cursor: 'pointer', fontSize: 13 }}>×</button>
                )}
              </div>
            </div>

            {/* 박스 크기 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
              {(['l','w','h'] as const).map((k, ki) => (
                <div key={k}>
                  <label style={LBL}>{['가로(L)','세로(W)','높이(H)'][ki]}</label>
                  <input value={(item as any)[k]} onChange={e => upd(i, k, e.target.value)}
                    placeholder="0" style={INP} />
                </div>
              ))}
            </div>

            {/* 입수 / 발주수량 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={LBL}>박스 입수 (pcs/CTN)</label>
                <input value={item.innerQty} onChange={e => upd(i, 'innerQty', e.target.value)}
                  placeholder="예: 12" style={INP} />
              </div>
              <div>
                <label style={LBL}>발주 수량 (pcs)</label>
                <input value={item.orderQty} onChange={e => upd(i, 'orderQty', e.target.value)}
                  placeholder="예: 1000" style={INP} />
              </div>
            </div>

            {/* 계산 결과 */}
            {c.cbmPerBox > 0 && c.boxes > 0 && (
              <div style={{ marginTop: 10, background: 'rgba(52,211,153,0.06)', borderRadius: 8, padding: '10px 12px', border: '1px solid rgba(52,211,153,0.15)', fontSize: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, textAlign: 'center' }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>단위 CBM</div>
                    <div style={{ color: '#34d399', fontWeight: 700 }}>{c.cbmPerBox.toFixed(4)}</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>아웃박스</div>
                    <div style={{ color: '#60a5fa', fontWeight: 700 }}>{c.boxes} CTN</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>소계 CBM</div>
                    <div style={{ color: '#f59e0b', fontWeight: 700 }}>{c.totalCbm.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button onClick={addItem} style={{ width: '100%', padding: '8px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px dashed rgba(59,130,246,0.25)', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', marginBottom: 16 }}>
        + 품목 추가
      </button>

      {/* 합계 & 컨테이너 적재 */}
      {grandCbm > 0 && (
        <div style={{ background: 'rgba(52,211,153,0.08)', borderRadius: 14, padding: '16px', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>총 아웃박스</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#60a5fa' }}>{grandBoxes} <span style={{ fontSize: 12 }}>CTN</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>총 CBM</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#34d399' }}>{grandCbm.toFixed(3)} <span style={{ fontSize: 13 }}>m³</span></div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>컨테이너 선적 계획</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {(Object.entries(CONTAINER) as [string, number][]).map(([ct, maxCbm]) => {
              const pct = Math.min(grandCbm / maxCbm * 100, 100);
              const containers = Math.ceil(grandCbm / maxCbm);
              const fitsInOne = Math.floor(maxCbm / (grandCbm / grandBoxes || 1));
              return (
                <div key={ct} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{ct}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{maxCbm} CBM</div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 8 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#34d399', borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{containers}컨</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{pct > 100 ? `${pct.toFixed(0)}%` : `${pct.toFixed(0)}% 적재`}</div>
                  {grandBoxes > 0 && fitsInOne < grandBoxes && (
                    <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 4 }}>1컨 = {Math.floor(maxCbm / (grandCbm / grandBoxes))}CTN</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── FOB → DDP 원가 계산기 ─────────────────────────────────────────────
// 해상운임 기준표 (USD, 2024 기준)
const FREIGHT: Record<string, Record<string, Record<string, number>>> = {
  shanghai:  { incheon: { '20ft': 480, '40ft': 780, '40HQ': 880 }, busan: { '20ft': 280, '40ft': 480, '40HQ': 530 }, pyeongtaek: { '20ft': 500, '40ft': 800, '40HQ': 900 } },
  ningbo:    { incheon: { '20ft': 430, '40ft': 730, '40HQ': 820 }, busan: { '20ft': 250, '40ft': 450, '40HQ': 500 }, pyeongtaek: { '20ft': 450, '40ft': 750, '40HQ': 840 } },
  shekou:    { incheon: { '20ft': 580, '40ft': 980, '40HQ':1080 }, busan: { '20ft': 350, '40ft': 600, '40HQ': 650 }, pyeongtaek: { '20ft': 600, '40ft':1000, '40HQ':1100 } },
  xiamen:    { incheon: { '20ft': 530, '40ft': 880, '40HQ': 980 }, busan: { '20ft': 300, '40ft': 530, '40HQ': 580 }, pyeongtaek: { '20ft': 550, '40ft': 900, '40HQ':1000 } },
};

// 항만요금 (KRW, 컨테이너당)
const PORT_FEE: Record<string, number> = { '20ft': 290000, '40ft': 430000, '40HQ': 430000 };
const CONT_CBM: Record<string, number> = { '20ft': 27, '40ft': 56, '40HQ': 67.5 };

function CostCalculator() {
  const [exRate, setExRate]     = useState('1380');
  const [from, setFrom]         = useState('shanghai');
  const [to, setTo]             = useState('incheon');
  const [ct, setCt]             = useState('40ft');
  const [domestic, setDomestic] = useState('800000');
  const [fob, setFob]           = useState('');
  const [dutyRate, setDutyRate] = useState('8');
  const [margin, setMargin]     = useState('20');
  const [envFee, setEnvFee]     = useState('0');
  // 수량 모드
  const [qtyMode, setQtyMode]   = useState<'auto' | 'manual'>('auto');
  const [manualQty, setManualQty] = useState('');
  // 박스 정보 (auto 모드용)
  const [bl, setBl]             = useState('');
  const [bw, setBw]             = useState('');
  const [bh, setBh]             = useState('');
  const [innerQty, setInnerQty] = useState('');
  const [loadRate, setLoadRate] = useState('85'); // 컨테이너 적재율 %

  // 자동 수량 계산 (CBM 기반)
  const cbmPerBox = n(bl) && n(bw) && n(bh) ? (n(bl) * n(bw) * n(bh)) / 1e9 : 0;
  const maxBoxes  = cbmPerBox > 0 ? Math.floor(CONT_CBM[ct] * (n(loadRate) / 100) / cbmPerBox) : 0;
  const autoQty   = maxBoxes * Math.max(1, Math.round(n(innerQty)));
  const qty       = qtyMode === 'auto' ? autoQty : Math.round(n(manualQty));

  const freightTotal = FREIGHT[from]?.[to]?.[ct] ?? 0;
  const rate         = n(exRate) || 1380;
  const fobUnit      = n(fob);
  const fobTotal     = fobUnit * qty;
  const freightUnit  = qty > 0 ? freightTotal / qty : 0;
  const cif          = fobUnit + freightUnit;
  const tax          = cif * (n(dutyRate) / 100);
  const domUnit      = qty > 0 ? (n(domestic) / rate) / qty : 0;
  const portUnit     = qty > 0 ? (PORT_FEE[ct] / rate) / qty : 0;
  const env          = n(envFee);
  const ddp          = cif + tax + domUnit + portUnit + env;
  const salesUnit    = ddp / (1 - n(margin) / 100);
  const profit       = salesUnit - ddp;
  const profitRate   = salesUnit > 0 ? (profit / salesUnit) * 100 : 0;
  const logisticsShare = cif > 0 ? (freightUnit / cif) * 100 : 0;

  const hasResult = fobUnit > 0 && qty > 0;

  const Row = ({ label, usd, note }: { label: string; usd: number; note?: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
      <span style={{ color: 'rgba(255,255,255,0.45)' }}>{label}{note && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>({note})</span>}</span>
      <div style={{ textAlign: 'right' }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>${usd.toFixed(3)}</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginLeft: 6 }}>{fmt(usd * rate)}원</span>
      </div>
    </div>
  );

  return (
    <div>
      {/* 기본 설정 */}
      <div style={CARD}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>⚙️ 기본 설정</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={LBL}>환율 (KRW/USD)</label>
            <input value={exRate} onChange={e => setExRate(e.target.value)} style={INP} placeholder="1380" />
          </div>
          <div>
            <label style={LBL}>컨테이너</label>
            <select value={ct} onChange={e => setCt(e.target.value)} style={SEL}>
              {Object.keys(CONT_CBM).map(c => <option key={c} value={c}>{c} ({CONT_CBM[c]} CBM)</option>)}
            </select>
          </div>
          <div>
            <label style={LBL}>출발항</label>
            <select value={from} onChange={e => setFrom(e.target.value)} style={SEL}>
              <option value="shanghai">Shanghai (상하이)</option>
              <option value="ningbo">Ningbo (닝보)</option>
              <option value="shekou">Shekou (선커우)</option>
              <option value="xiamen">Xiamen (샤먼)</option>
            </select>
          </div>
          <div>
            <label style={LBL}>도착항</label>
            <select value={to} onChange={e => setTo(e.target.value)} style={SEL}>
              <option value="incheon">Incheon (인천)</option>
              <option value="busan">Busan (부산)</option>
              <option value="pyeongtaek">Pyeongtaek (평택)</option>
            </select>
          </div>
        </div>
        {/* 운임 자동 표시 */}
        <div style={{ marginTop: 10, fontSize: 11, color: '#60a5fa', display: 'flex', justifyContent: 'space-between' }}>
          <span>해상운임 (컨테이너당)</span>
          <span style={{ fontWeight: 700 }}>${freightTotal.toLocaleString()}</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <span>항만요금 (컨테이너당)</span>
          <span>{(PORT_FEE[ct] / 1000).toFixed(0)}천원</span>
        </div>
      </div>

      {/* 제품 및 수량 */}
      <div style={CARD}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>📦 제품 및 수량</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={LBL}>FOB 단가 (USD/EA)</label>
            <input value={fob} onChange={e => setFob(e.target.value)} placeholder="0.00" style={INP} />
          </div>
          <div>
            <label style={LBL}>수량 모드</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['auto', 'manual'] as const).map(m => (
                <button key={m} onClick={() => setQtyMode(m)} style={{ flex: 1, padding: '8px', borderRadius: 7, border: `1px solid ${qtyMode === m ? '#10b981' : 'rgba(255,255,255,0.1)'}`, background: qtyMode === m ? 'rgba(16,185,129,0.12)' : 'transparent', color: qtyMode === m ? '#34d399' : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  {m === 'auto' ? '자동(CBM)' : '직접입력'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {qtyMode === 'auto' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
              {[['bl','가로(mm)',setBl],['bw','세로(mm)',setBw],['bh','높이(mm)',setBh]].map(([val, label, setter]) => (
                <div key={label as string}>
                  <label style={LBL}>{label as string}</label>
                  <input value={val === 'bl' ? bl : val === 'bw' ? bw : bh} onChange={e => (setter as any)(e.target.value)} placeholder="0" style={INP} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={LBL}>박스 입수 (pcs/CTN)</label>
                <input value={innerQty} onChange={e => setInnerQty(e.target.value)} placeholder="예: 12" style={INP} />
              </div>
              <div>
                <label style={LBL}>컨테이너 적재율 (%)</label>
                <input value={loadRate} onChange={e => setLoadRate(e.target.value)} placeholder="85" style={INP} />
              </div>
            </div>
            {cbmPerBox > 0 && (
              <div style={{ marginTop: 8, fontSize: 11, color: '#34d399', display: 'flex', justifyContent: 'space-between' }}>
                <span>단위CBM {cbmPerBox.toFixed(4)} → {maxBoxes}CTN × {Math.max(1,Math.round(n(innerQty)))}pcs</span>
                <span style={{ fontWeight: 800 }}>{autoQty.toLocaleString()} EA</span>
              </div>
            )}
          </>
        ) : (
          <div>
            <label style={LBL}>수량 (EA)</label>
            <input value={manualQty} onChange={e => setManualQty(e.target.value)} placeholder="발주 수량 입력" style={INP} />
          </div>
        )}
      </div>

      {/* 비용 설정 */}
      <div style={CARD}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>💰 비용 설정</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={LBL}>관세율 (%)</label>
            <input value={dutyRate} onChange={e => setDutyRate(e.target.value)} placeholder="8" style={INP} />
          </div>
          <div>
            <label style={LBL}>마진 (%)</label>
            <input value={margin} onChange={e => setMargin(e.target.value)} placeholder="20" style={INP} />
          </div>
          <div>
            <label style={LBL}>국내운송료 (KRW/컨)</label>
            <input value={domestic} onChange={e => setDomestic(e.target.value)} placeholder="800000" style={INP} />
          </div>
          <div>
            <label style={LBL}>환경료 (USD/EA)</label>
            <input value={envFee} onChange={e => setEnvFee(e.target.value)} placeholder="0" style={INP} />
          </div>
        </div>
      </div>

      {/* 계산 결과 */}
      {hasResult && (
        <div style={{ background: 'rgba(59,130,246,0.07)', borderRadius: 14, padding: '16px', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>📊 계산 결과 <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(단위: /EA)</span></div>

          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>수량: <strong style={{ color: '#fff' }}>{qty.toLocaleString()} EA</strong> · FOB Total: <strong style={{ color: '#fff' }}>${fmt(fobTotal,0)}</strong></div>

          <Row label="FOB 단가"        usd={fobUnit}     />
          <Row label="해상운임/unit"   usd={freightUnit} note={`${ct} $${freightTotal}`} />
          <Row label="CIF"             usd={cif}         />
          <Row label={`관세 (${dutyRate}%)`} usd={tax}  />
          <Row label="국내운송/unit"   usd={domUnit}     note={`${fmt(n(domestic),0)}원`} />
          <Row label="항만요금/unit"   usd={portUnit}    note={`${(PORT_FEE[ct]/1000).toFixed(0)}천원`} />
          {env > 0 && <Row label="환경료/unit" usd={env} />}

          {/* DDP */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0 8px', borderBottom: '2px solid rgba(255,255,255,0.1)', marginTop: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>DDP (수입원가)</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#60a5fa' }}>${ddp.toFixed(3)}</div>
              <div style={{ fontSize: 13, color: '#93c5fd' }}>{fmt(ddp * rate)}원</div>
            </div>
          </div>

          {/* 판매가 */}
          <div style={{ background: 'rgba(52,211,153,0.08)', borderRadius: 10, padding: '12px', border: '1px solid rgba(52,211,153,0.15)', marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>판매가 (마진 {margin}%)</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#34d399' }}>${salesUnit.toFixed(3)}</div>
                <div style={{ fontSize: 13, color: 'rgba(52,211,153,0.8)' }}>{fmt(salesUnit * rate)}원</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>이익 <strong style={{ color: '#34d399' }}>${profit.toFixed(3)} ({profitRate.toFixed(1)}%)</strong></span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>물류비중 <strong style={{ color: '#f59e0b' }}>{logisticsShare.toFixed(1)}%</strong></span>
            </div>
          </div>

          {/* 총액 요약 */}
          <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <span>총 DDP: <strong style={{ color: '#fff' }}>${fmt(ddp * qty, 0)}</strong></span>
            <span>총 매출: <strong style={{ color: '#34d399' }}>${fmt(salesUnit * qty, 0)}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 인천항 혼잡도 ─────────────────────────────────────────────────────
interface PortData {
  level: 'smooth' | 'normal' | 'busy' | 'very_busy';
  waiting: number; berthed: number; berthRate: number; departed: number;
  updatedAt: string; demo?: boolean;
  vessels: { name: string; flag: string; status: string; eta?: string; etd?: string }[];
}

function PortCongestion() {
  const [data, setData] = useState<PortData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/port');
      if (!res.ok) throw new Error('API 오류');
      setData(await res.json());
    } catch { setError('데이터를 불러오지 못했습니다.'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
      <div style={{ width: 28, height: 28, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      조회 중...
    </div>
  );

  if (error || !data) return (
    <div style={{ textAlign: 'center', padding: '32px', color: '#f87171' }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
      {error || '데이터 없음'}
      <button onClick={fetchData} style={{ display: 'block', margin: '14px auto 0', padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>재시도</button>
    </div>
  );

  const LEVEL_MAP = {
    smooth:   { label: '원활',   color: '#34d399', bg: 'rgba(52,211,153,0.1)', icon: '🟢' },
    normal:   { label: '보통',   color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', icon: '🔵' },
    busy:     { label: '혼잡',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '🟡' },
    very_busy:{ label: '매우혼잡', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '🔴' },
  };
  const lv = LEVEL_MAP[data.level];

  return (
    <div>
      <div style={{ background: lv.bg, borderRadius: 16, padding: '18px', border: `1px solid ${lv.color}30`, marginBottom: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 6 }}>{lv.icon}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: lv.color }}>{lv.label}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>인천항 현재 혼잡도</div>
        {data.demo && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>※ 시뮬레이션 데이터</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[
          { label: '대기 선박', value: data.waiting,  color: '#f59e0b', unit: '척' },
          { label: '접안 중',  value: data.berthed,   color: '#34d399', unit: '척' },
          { label: '출항 예정',value: data.departed,  color: '#60a5fa', unit: '척' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.unit}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px', marginBottom: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>선석 점유율</span>
          <span style={{ color: '#fff', fontWeight: 700 }}>{data.berthRate}%</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${data.berthRate}%`, background: data.berthRate > 80 ? '#ef4444' : data.berthRate > 60 ? '#f59e0b' : '#34d399', borderRadius: 3 }} />
        </div>
      </div>

      {data.vessels.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 }}>입출항 선박 현황</div>
          {data.vessels.map((v, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: 8, marginBottom: 5, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 16 }}>{v.flag}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{v.eta ? `ETA ${v.eta}` : ''}{v.etd ? `ETD ${v.etd}` : ''}</div>
              </div>
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, fontWeight: 700, flexShrink: 0, background: v.status === '접안' ? 'rgba(52,211,153,0.15)' : v.status === '대기' ? 'rgba(245,158,11,0.15)' : 'rgba(96,165,250,0.15)', color: v.status === '접안' ? '#34d399' : v.status === '대기' ? '#f59e0b' : '#60a5fa' }}>{v.status}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>업데이트: {data.updatedAt}</span>
        <button onClick={fetchData} style={{ padding: '5px 10px', background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>🔄 새로고침</button>
      </div>
    </div>
  );
}

// ── 메인 ToolDock ─────────────────────────────────────────────────────
const TOOLS = [
  { id: 'port' as Tool, icon: '🚢', label: '항만혼잡도', color: '#0ea5e9' },
  { id: 'cbm'  as Tool, icon: '📦', label: 'CBM계산기',  color: '#10b981' },
  { id: 'cost' as Tool, icon: '💰', label: '원가계산기',  color: '#f59e0b' },
];
const TITLES: Record<string, string> = {
  port: '🚢 인천항 혼잡도',
  cbm:  '📦 CBM 계산기',
  cost: '💰 FOB→DDP 원가계산기',
};

export default function ToolDock() {
  const [active, setActive] = useState<Tool>(null);
  const [hovered, setHovered] = useState<Tool>(null);

  return (
    <>
      <div style={{ position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 990, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {TOOLS.map(tool => (
          <button key={tool.id!} onClick={() => setActive(active === tool.id ? null : tool.id)}
            onMouseEnter={() => setHovered(tool.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
              padding: '0 16px 0 0', height: 52,
              background: active === tool.id ? tool.color : 'rgba(10,14,26,0.92)',
              border: `1px solid ${active === tool.id ? tool.color : 'rgba(255,255,255,0.1)'}`,
              borderRight: 'none', borderRadius: '12px 0 0 12px',
              color: active === tool.id ? '#fff' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer', fontFamily: 'inherit',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
              transform: hovered === tool.id || active === tool.id ? 'translateX(0)' : 'translateX(8px)',
              boxShadow: active === tool.id ? `0 0 20px ${tool.color}40` : '0 4px 16px rgba(0,0,0,0.4)',
            }}>
            <span style={{ width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginLeft: 12 }}>{tool.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>{tool.label}</span>
          </button>
        ))}
      </div>

      {active && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '16px' }}
          onClick={e => { if (e.target === e.currentTarget) setActive(null); }}>
          <div style={{ width: 480, maxHeight: 'calc(100vh - 32px)', background: '#0b0f1a', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 80px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideIn 0.22s ease' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{TITLES[active!]}</div>
              <button onClick={() => setActive(null)} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: '18px 20px', overflowY: 'auto', flex: 1 }}>
              {active === 'port' && <PortCongestion />}
              {active === 'cbm'  && <CbmCalculator />}
              {active === 'cost' && <CostCalculator />}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </>
  );
}
