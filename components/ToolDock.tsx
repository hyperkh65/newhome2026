'use client';
import { useState, useEffect, useCallback } from 'react';

type Tool = 'port' | 'cbm' | 'cost' | null;

// ── 스타일 ──────────────────────────────────────────────────────────
const INP: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8, padding: '8px 11px', color: '#fff', fontSize: 13,
  fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' as const,
};
const LBL: React.CSSProperties = {
  fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4, display: 'block',
  fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.4,
};
const SEL: React.CSSProperties = { ...INP, padding: '8px 7px' };
const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 16px',
  border: '1px solid rgba(255,255,255,0.07)', marginBottom: 12,
};
const n = (v: string | number) => parseFloat(String(v)) || 0;

// ── 실제 운임 데이터 (2days.kr 기준) ──────────────────────────────
const FREIGHT_DATA: [string, string, string, number][] = [
  ['20ft', 'shanghai', 'incheon',    340],
  ['20ft', 'ningbo',   'incheon',    340],
  ['20ft', 'shekou',   'incheon',    310],
  ['20ft', 'xiamen',   'incheon',    240],
  ['20ft', 'shanghai', 'busan',       70],
  ['20ft', 'ningbo',   'busan',       70],
  ['20ft', 'shekou',   'busan',      250],
  ['20ft', 'xiamen',   'busan',      210],
  ['20ft', 'shanghai', 'pyeongtaek', 340],
  ['20ft', 'ningbo',   'pyeongtaek', 340],
  ['20ft', 'shekou',   'pyeongtaek', 310],
  ['20ft', 'xiamen',   'pyeongtaek', 240],
  ['40ft', 'shanghai', 'incheon',    650],
  ['40ft', 'ningbo',   'incheon',    650],
  ['40ft', 'shekou',   'incheon',    580],
  ['40ft', 'xiamen',   'incheon',    470],
  ['40ft', 'shanghai', 'busan',      120],
  ['40ft', 'ningbo',   'busan',      120],
  ['40ft', 'shekou',   'busan',      480],
  ['40ft', 'xiamen',   'busan',      410],
  ['40ft', 'shanghai', 'pyeongtaek', 650],
  ['40ft', 'ningbo',   'pyeongtaek', 650],
  ['40ft', 'shekou',   'pyeongtaek', 580],
  ['40ft', 'xiamen',   'pyeongtaek', 470],
];

// 항만요금 (KRW) — 2days.kr 기준
const PORT_CHARGE: Record<string, Record<string, number>> = {
  incheon:    { '20ft': 229200, '40ft': 308400 },
  busan:      { '20ft': 229429, '40ft': 308858 },
  pyeongtaek: { '20ft': 229200, '40ft': 308400 },
};

// 컨테이너 용량 (CBM)
const CONT_CBM: Record<string, number> = { '20ft': 27, '40ft': 56 };

const findFreight = (ct: string, from: string, to: string) =>
  FREIGHT_DATA.find(r => r[0] === ct && r[1] === from && r[2] === to)?.[3] ?? 0;

// ── CBM 계산기 ────────────────────────────────────────────────────
function CbmCalculator() {
  const [items, setItems] = useState([{ name: '', l: '', w: '', h: '', innerQty: '', orderQty: '', unit: 'mm' as 'mm' | 'cm' }]);

  const upd = (i: number, k: string, v: string) => {
    const next = [...items]; (next[i] as any)[k] = v; setItems(next);
  };

  const calcItem = (item: typeof items[0]) => {
    const factor = item.unit === 'mm' ? 1e9 : 1e6;
    const l = n(item.l), w = n(item.w), h = n(item.h);
    const cbmPer = l && w && h ? (l * w * h) / factor : 0;
    const inner  = Math.max(1, Math.round(n(item.innerQty)));
    const order  = Math.round(n(item.orderQty));
    const boxes  = order && inner ? Math.ceil(order / inner) : 0;
    return { cbmPer, inner, order, boxes, totalCbm: cbmPer * boxes };
  };

  const calcs     = items.map(calcItem);
  const grandCbm  = calcs.reduce((s, c) => s + c.totalCbm, 0);
  const grandBoxes= calcs.reduce((s, c) => s + c.boxes, 0);

  return (
    <div>
      {items.map((item, i) => {
        const c = calcItem(item);
        return (
          <div key={i} style={CARD}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
              <input value={item.name} onChange={e => upd(i, 'name', e.target.value)}
                placeholder={`품목 ${i + 1}`}
                style={{ ...INP, flex: 1, fontSize: 12, padding: '6px 10px' }} />
              <select value={item.unit} onChange={e => upd(i, 'unit', e.target.value)}
                style={{ ...SEL, width: 60, fontSize: 11, padding: '6px 5px', flex: 'none' }}>
                <option value="mm">mm</option>
                <option value="cm">cm</option>
              </select>
              {items.length > 1 && (
                <button onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                  style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 13 }}>×</button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
              {(['l','w','h'] as const).map((k, ki) => (
                <div key={k}>
                  <label style={LBL}>{['가로(L)','세로(W)','높이(H)'][ki]}</label>
                  <input value={(item as any)[k]} onChange={e => upd(i, k, e.target.value)} placeholder="0" style={INP} />
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={LBL}>박스 입수 (pcs/CTN)</label>
                <input value={item.innerQty} onChange={e => upd(i, 'innerQty', e.target.value)} placeholder="12" style={INP} />
              </div>
              <div>
                <label style={LBL}>발주 수량 (pcs)</label>
                <input value={item.orderQty} onChange={e => upd(i, 'orderQty', e.target.value)} placeholder="1000" style={INP} />
              </div>
            </div>

            {c.cbmPer > 0 && c.boxes > 0 && (
              <div style={{ marginTop: 10, background: 'rgba(52,211,153,0.06)', borderRadius: 8, padding: '10px 12px', border: '1px solid rgba(52,211,153,0.15)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, textAlign: 'center', fontSize: 12 }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>단위CBM</div>
                    <div style={{ color: '#34d399', fontWeight: 700 }}>{c.cbmPer.toFixed(4)}</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>아웃박스</div>
                    <div style={{ color: '#60a5fa', fontWeight: 700 }}>{c.boxes} CTN</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>소계 CBM</div>
                    <div style={{ color: '#f59e0b', fontWeight: 700 }}>{c.totalCbm.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button onClick={() => setItems([...items, { name: '', l: '', w: '', h: '', innerQty: '', orderQty: '', unit: 'mm' }])}
        style={{ width: '100%', padding: '8px', background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px dashed rgba(59,130,246,0.25)', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', marginBottom: 16 }}>
        + 품목 추가
      </button>

      {grandCbm > 0 && (
        <div style={{ background: 'rgba(52,211,153,0.08)', borderRadius: 14, padding: '16px', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>총 아웃박스</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#60a5fa' }}>{grandBoxes} <span style={{ fontSize: 11 }}>CTN</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>총 CBM</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#34d399' }}>{grandCbm.toFixed(3)} <span style={{ fontSize: 12 }}>m³</span></div>
            </div>
          </div>

          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>컨테이너 선적 계획</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(['20ft', '40ft'] as const).map(ct => {
              const maxCbm = CONT_CBM[ct];
              const pct = Math.min(grandCbm / maxCbm * 100, 100);
              const containers = Math.ceil(grandCbm / maxCbm);
              const cbmPerBox = grandBoxes > 0 ? grandCbm / grandBoxes : 0;
              const barsPerCont = cbmPerBox > 0 ? Math.floor(maxCbm / cbmPerBox) : 0;
              return (
                <div key={ct} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{ct}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>{maxCbm} CBM</div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 10 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#34d399', borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{containers}컨테이너</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{pct.toFixed(0)}% 적재</div>
                  {barsPerCont > 0 && (
                    <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 4 }}>1컨 ≈ {barsPerCont} CTN</div>
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

// ── FOB → DDP 원가 계산기 (2days.kr 방식) ────────────────────────────
interface CostRow { fob: string; l: string; w: string; h: string; units: string; qtyMode: 'auto' | 'manual'; manualQty: string; }
const emptyRow = (): CostRow => ({ fob: '', l: '', w: '', h: '', units: '', qtyMode: 'auto', manualQty: '' });

function CostCalculator() {
  const [exRate,    setExRate]    = useState('1380');
  const [ct,        setCt]        = useState('40ft');
  const [from,      setFrom]      = useState('shanghai');
  const [to,        setTo]        = useState('incheon');
  const [domestic,  setDomestic]  = useState('800000');   // KRW
  const [taxRate,   setTaxRate]   = useState('8');         // %
  const [margin,    setMargin]    = useState('20');        // % (markup on DDP)
  const [envFee,    setEnvFee]    = useState('0');         // USD/unit
  const [freightOverride, setFreightOverride] = useState('');   // USD, 빈값이면 테이블 자동값
  const [portOverride,    setPortOverride]    = useState('');   // KRW, 빈값이면 테이블 자동값
  const [rows, setRows] = useState<CostRow[]>([emptyRow()]);

  // 경로/컨테이너 변경시 자동값으로 리셋
  useEffect(() => { setFreightOverride(''); setPortOverride(''); }, [ct, from, to]);

  const updRow = (i: number, k: keyof CostRow, v: string) => {
    const next = [...rows]; (next[i] as any)[k] = v; setRows(next);
  };

  const freightDefault = findFreight(ct, from, to);
  const portDefault    = PORT_CHARGE[to]?.[ct] ?? 0;
  const freight        = freightOverride !== '' ? n(freightOverride) : freightDefault;
  const portCharge     = portOverride    !== '' ? n(portOverride)    : portDefault;
  const rate           = n(exRate) || 1380;
  const maxCbm    = CONT_CBM[ct];

  const computeQty = (row: CostRow) => {
    const cbmPer = n(row.l) && n(row.w) && n(row.h) ? (n(row.l) * n(row.w) * n(row.h)) / 1e9 : 0;
    const boxes  = cbmPer > 0 ? Math.floor(maxCbm / cbmPer) : 0;
    return boxes * Math.max(1, Math.round(n(row.units)));
  };

  const calcRow = (row: CostRow) => {
    const qty        = row.qtyMode === 'auto' ? computeQty(row) : Math.round(n(row.manualQty));
    const fobUnit    = n(row.fob);
    const fobTotal   = fobUnit * qty;
    const frtUnit    = qty > 0 ? freight / qty : 0;
    const cif        = fobUnit + frtUnit;
    const taxVal     = cif * (n(taxRate) / 100);
    const domUnit    = qty > 0 ? (n(domestic) / rate) / qty : 0;
    const portUnit   = qty > 0 ? (portCharge / rate) / qty : 0;
    const env        = n(envFee);
    const ddp        = cif + taxVal + domUnit + portUnit + env;
    const sales      = ddp * (1 + n(margin) / 100);
    const profit     = sales - ddp;
    const profitRate = sales > 0 ? (profit / sales) * 100 : 0;
    const logShare   = cif > 0 ? (frtUnit / cif) * 100 : 0;
    return { qty, fobUnit, fobTotal, frtUnit, cif, taxVal, domUnit, portUnit, env, ddp, sales, profit, profitRate, logShare };
  };

  const Row4 = ({ label, val, color, bold }: { label: string; val: string; color?: string; bold?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span style={{ color: color || 'rgba(255,255,255,0.85)', fontWeight: bold ? 800 : 500 }}>{val}</span>
    </div>
  );

  return (
    <div>
      {/* 기본 설정 */}
      <div style={CARD}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>⚙️ 기본 설정</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <div>
            <label style={LBL}>환율 (KRW/USD)</label>
            <input value={exRate} onChange={e => setExRate(e.target.value)} style={INP} placeholder="1380" />
          </div>
          <div>
            <label style={LBL}>컨테이너</label>
            <select value={ct} onChange={e => setCt(e.target.value)} style={SEL}>
              <option value="20ft">20ft (27 CBM)</option>
              <option value="40ft">40ft (56 CBM)</option>
            </select>
          </div>
          <div>
            <label style={LBL}>출발항</label>
            <select value={from} onChange={e => setFrom(e.target.value)} style={SEL}>
              <option value="shanghai">Shanghai (상해)</option>
              <option value="ningbo">Ningbo (닝보)</option>
              <option value="shekou">Shekou (심천)</option>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 2 }}>
          <div>
            <label style={{ ...LBL, display: 'flex', justifyContent: 'space-between' }}>
              <span>해상운임 (USD/컨)</span>
              {freightOverride === '' && <span style={{ color: '#60a5fa', fontWeight: 400 }}>기준: ${freightDefault}</span>}
            </label>
            <input
              value={freightOverride !== '' ? freightOverride : freightDefault.toString()}
              onChange={e => setFreightOverride(e.target.value)}
              onFocus={e => { if (freightOverride === '') setFreightOverride(freightDefault.toString()); e.target.select(); }}
              style={{ ...INP, borderColor: freightOverride !== '' ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.12)' }} />
          </div>
          <div>
            <label style={{ ...LBL, display: 'flex', justifyContent: 'space-between' }}>
              <span>항만요금 (KRW/컨)</span>
              {portOverride === '' && <span style={{ color: '#f59e0b', fontWeight: 400 }}>기준: {portDefault.toLocaleString()}</span>}
            </label>
            <input
              value={portOverride !== '' ? portOverride : portDefault.toString()}
              onChange={e => setPortOverride(e.target.value)}
              onFocus={e => { if (portOverride === '') setPortOverride(portDefault.toString()); e.target.select(); }}
              style={{ ...INP, borderColor: portOverride !== '' ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.12)' }} />
          </div>
        </div>
      </div>

      {/* 비용 공통 설정 */}
      <div style={CARD}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>💰 비용 설정</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={LBL}>관세율 (%)</label>
            <input value={taxRate}  onChange={e => setTaxRate(e.target.value)}  placeholder="8"      style={INP} />
          </div>
          <div>
            <label style={LBL}>마진 % (markup)</label>
            <input value={margin}   onChange={e => setMargin(e.target.value)}   placeholder="20"     style={INP} />
          </div>
          <div>
            <label style={LBL}>국내운송료 (KRW/컨)</label>
            <input value={domestic} onChange={e => setDomestic(e.target.value)} placeholder="800000" style={INP} />
          </div>
          <div>
            <label style={LBL}>환경료 (USD/EA)</label>
            <input value={envFee}   onChange={e => setEnvFee(e.target.value)}   placeholder="0"      style={INP} />
          </div>
        </div>
      </div>

      {/* 제품별 행 */}
      {rows.map((row, i) => {
        const c = calcRow(row);
        const autoQty = computeQty(row);
        const hasResult = c.fobUnit > 0 && c.qty > 0;
        return (
          <div key={i} style={{ ...CARD, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>제품 {i + 1}</div>
              {rows.length > 1 && (
                <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontSize: 12 }}>삭제</button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={LBL}>FOB 단가 (USD/EA)</label>
                <input value={row.fob} onChange={e => updRow(i, 'fob', e.target.value)} placeholder="0.00" style={INP} />
              </div>
              <div>
                <label style={LBL}>박스 입수 (EA/CTN)</label>
                <input value={row.units} onChange={e => updRow(i, 'units', e.target.value)} placeholder="12" style={INP} />
              </div>
            </div>

            {/* 박스 크기 */}
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>📦 박스 크기 (mm) — 컨테이너 자동 수량 계산용</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
              {['l','w','h'].map((k, ki) => (
                <div key={k}>
                  <label style={LBL}>{['가로','세로','높이'][ki]}</label>
                  <input value={(row as any)[k]} onChange={e => updRow(i, k as keyof CostRow, e.target.value)} placeholder="0" style={INP} />
                </div>
              ))}
            </div>

            {/* 수량 모드 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: autoQty > 0 && row.qtyMode === 'auto' ? 6 : 0 }}>
              {(['auto','manual'] as const).map(m => (
                <button key={m} onClick={() => updRow(i, 'qtyMode', m)}
                  style={{ flex: 1, padding: '7px', borderRadius: 7, border: `1px solid ${row.qtyMode === m ? '#10b981' : 'rgba(255,255,255,0.1)'}`, background: row.qtyMode === m ? 'rgba(16,185,129,0.1)' : 'transparent', color: row.qtyMode === m ? '#34d399' : 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  {m === 'auto' ? '자동 (CBM)' : '직접 입력'}
                </button>
              ))}
            </div>

            {row.qtyMode === 'auto' && autoQty > 0 && (
              <div style={{ fontSize: 11, color: '#34d399', padding: '5px 0', marginBottom: 4 }}>
                → 컨테이너 자동 수량: <strong>{autoQty.toLocaleString()} EA</strong>
              </div>
            )}
            {row.qtyMode === 'manual' && (
              <div style={{ marginTop: 8 }}>
                <label style={LBL}>수량 (EA)</label>
                <input value={row.manualQty} onChange={e => updRow(i, 'manualQty', e.target.value)} placeholder="1000" style={INP} />
              </div>
            )}

            {/* 계산 결과 */}
            {hasResult && (
              <div style={{ marginTop: 14, background: 'rgba(15,23,42,0.6)', borderRadius: 12, padding: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                  수량 {c.qty.toLocaleString()} EA · FOB Total ${c.fobTotal.toFixed(0)}
                </div>
                <Row4 label="FOB 단가"            val={`$${c.fobUnit.toFixed(4)}`} />
                <Row4 label={`해상운임/EA ($${freight}÷${c.qty})`} val={`$${c.frtUnit.toFixed(4)}`} />
                <Row4 label="CIF"                 val={`$${c.cif.toFixed(4)}`}    bold />
                <Row4 label={`관세 (${taxRate}%)`} val={`$${c.taxVal.toFixed(4)}`} />
                <Row4 label="국내운송/EA"          val={`$${c.domUnit.toFixed(4)}`} />
                <Row4 label="항만료/EA"            val={`$${c.portUnit.toFixed(4)}`} />
                {c.env > 0 && <Row4 label="환경료/EA" val={`$${c.env.toFixed(4)}`} />}

                {/* DDP */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 6px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 4 }}>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>DDP (수입원가)</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#60a5fa', fontWeight: 900, fontSize: 16 }}>${c.ddp.toFixed(4)}</div>
                    <div style={{ color: '#93c5fd', fontSize: 11 }}>{Math.round(c.ddp * rate).toLocaleString()}원</div>
                  </div>
                </div>

                {/* 판매가 */}
                <div style={{ background: 'rgba(52,211,153,0.08)', borderRadius: 10, padding: '12px', border: '1px solid rgba(52,211,153,0.15)', marginTop: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>판매가 (markup {margin}%)</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#34d399', fontWeight: 900, fontSize: 18 }}>${c.sales.toFixed(4)}</div>
                      <div style={{ color: 'rgba(52,211,153,0.7)', fontSize: 11 }}>{Math.round(c.sales * rate).toLocaleString()}원</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 11 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>이익 <strong style={{ color: '#34d399' }}>${c.profit.toFixed(4)} ({c.profitRate.toFixed(1)}%)</strong></span>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>물류비중 <strong style={{ color: '#f59e0b' }}>{c.logShare.toFixed(1)}%</strong></span>
                  </div>
                </div>

                {/* KRW 환산 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 8 }}>
                  {[
                    { label: 'DDP(원)', val: Math.round(c.ddp * rate), color: '#60a5fa' },
                    { label: '판매가(원)', val: Math.round(c.sales * rate), color: '#34d399' },
                    { label: '이익(원)', val: Math.round(c.profit * rate), color: '#f59e0b' },
                  ].map(x => (
                    <div key={x.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>{x.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: x.color }}>{x.val.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button onClick={() => setRows([...rows, emptyRow()])}
        style={{ width: '100%', padding: '8px', background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px dashed rgba(59,130,246,0.25)', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
        + 제품 추가
      </button>
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
      if (!res.ok) throw new Error();
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
      <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>{error || '데이터 없음'}
      <button onClick={fetchData} style={{ display: 'block', margin: '14px auto 0', padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>재시도</button>
    </div>
  );
  const LV = { smooth: { label:'원활', color:'#34d399', bg:'rgba(52,211,153,0.1)', icon:'🟢' }, normal: { label:'보통', color:'#60a5fa', bg:'rgba(96,165,250,0.1)', icon:'🔵' }, busy: { label:'혼잡', color:'#f59e0b', bg:'rgba(245,158,11,0.1)', icon:'🟡' }, very_busy: { label:'매우혼잡', color:'#ef4444', bg:'rgba(239,68,68,0.1)', icon:'🔴' } };
  const lv = LV[data.level];
  return (
    <div>
      <div style={{ background: lv.bg, borderRadius: 16, padding: '18px', border: `1px solid ${lv.color}30`, marginBottom: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 6 }}>{lv.icon}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: lv.color }}>{lv.label}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>인천항 현재 혼잡도</div>
        {data.demo && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>※ 시뮬레이션 데이터</div>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[{label:'대기 선박',value:data.waiting,color:'#f59e0b'},{label:'접안 중',value:data.berthed,color:'#34d399'},{label:'출항 예정',value:data.departed,color:'#60a5fa'}].map(s=>(
          <div key={s.label} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'10px', textAlign:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize:20, fontWeight:900, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'12px', marginBottom:14, border:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:11 }}>
          <span style={{ color:'rgba(255,255,255,0.45)' }}>선석 점유율</span>
          <span style={{ color:'#fff', fontWeight:700 }}>{data.berthRate}%</span>
        </div>
        <div style={{ height:5, background:'rgba(255,255,255,0.07)', borderRadius:3 }}>
          <div style={{ height:'100%', width:`${data.berthRate}%`, background: data.berthRate>80?'#ef4444':data.berthRate>60?'#f59e0b':'#34d399', borderRadius:3 }} />
        </div>
      </div>
      {data.vessels.length > 0 && (
        <div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase', letterSpacing:0.5, marginBottom:7 }}>입출항 선박 현황</div>
          {data.vessels.map((v,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'rgba(255,255,255,0.025)', borderRadius:8, marginBottom:5, border:'1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize:16 }}>{v.flag}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.name}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>{v.eta?`ETA ${v.eta}`:''}{v.etd?`ETD ${v.etd}`:''}</div>
              </div>
              <span style={{ fontSize:10, padding:'2px 7px', borderRadius:5, fontWeight:700, flexShrink:0, background:v.status==='접안'?'rgba(52,211,153,0.15)':v.status==='대기'?'rgba(245,158,11,0.15)':'rgba(96,165,250,0.15)', color:v.status==='접안'?'#34d399':v.status==='대기'?'#f59e0b':'#60a5fa' }}>{v.status}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
        <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)' }}>업데이트: {data.updatedAt}</span>
        <button onClick={fetchData} style={{ padding:'5px 10px', background:'rgba(14,165,233,0.1)', color:'#0ea5e9', border:'1px solid rgba(14,165,233,0.2)', borderRadius:7, cursor:'pointer', fontSize:11, fontFamily:'inherit' }}>🔄 새로고침</button>
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
  cost: '💰 FOB → DDP 원가계산기',
};

export default function ToolDock() {
  const [active, setActive] = useState<Tool>(null);
  const [hovered, setHovered] = useState<Tool>(null);
  return (
    <>
      <div style={{ position:'fixed', right:0, top:'50%', transform:'translateY(-50%)', zIndex:990, display:'flex', flexDirection:'column', gap:4 }}>
        {TOOLS.map(tool => (
          <button key={tool.id!} onClick={() => setActive(active === tool.id ? null : tool.id)}
            onMouseEnter={() => setHovered(tool.id)} onMouseLeave={() => setHovered(null)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'0 16px 0 0', height:52, background: active===tool.id ? tool.color : 'rgba(10,14,26,0.92)', border:`1px solid ${active===tool.id ? tool.color : 'rgba(255,255,255,0.1)'}`, borderRight:'none', borderRadius:'12px 0 0 12px', color: active===tool.id ? '#fff' : 'rgba(255,255,255,0.7)', cursor:'pointer', fontFamily:'inherit', backdropFilter:'blur(12px)', transition:'all 0.22s cubic-bezier(0.34,1.56,0.64,1)', transform: hovered===tool.id || active===tool.id ? 'translateX(0)' : 'translateX(8px)', boxShadow: active===tool.id ? `0 0 20px ${tool.color}40` : '0 4px 16px rgba(0,0,0,0.4)' }}>
            <span style={{ width:36, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginLeft:12 }}>{tool.icon}</span>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:0.3, whiteSpace:'nowrap' }}>{tool.label}</span>
          </button>
        ))}
      </div>

      {active && (
        <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'16px' }}
          onClick={e => { if (e.target === e.currentTarget) setActive(null); }}>
          <div style={{ width:490, maxHeight:'calc(100vh - 32px)', background:'#0b0f1a', borderRadius:20, border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 24px 80px rgba(0,0,0,0.7)', display:'flex', flexDirection:'column', overflow:'hidden', animation:'slideIn 0.22s ease' }}>
            <div style={{ padding:'15px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
              <div style={{ fontSize:16, fontWeight:800, color:'#fff' }}>{TITLES[active!]}</div>
              <button onClick={() => setActive(null)} style={{ width:30, height:30, borderRadius:'50%', background:'rgba(255,255,255,0.07)', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:15, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
            <div style={{ padding:'16px 18px', overflowY:'auto', flex:1 }}>
              {active === 'port' && <PortCongestion />}
              {active === 'cbm'  && <CbmCalculator />}
              {active === 'cost' && <CostCalculator />}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}`}</style>
    </>
  );
}
