'use client';
import { useState, useRef } from 'react';
import { useSiteSettings } from '@/lib/useSiteSettings';

const CURRENCIES = ['USD', 'EUR', 'CNY', 'KRW', 'JPY'];
const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', CNY: '¥', KRW: '₩', JPY: '¥' };

interface ProductRow {
  id: number;
  image: string;
  name: string;
  model: string;
  power: string;
  voltage: string;
  flux: string;
  efficacy: string;
  cct: string;
  cri: string;
  beam: string;
  ip: string;
  lifespan: string;
  warranty: string;
  cert: string;
  size: string;
  weight: string;
  innerBox: string;
  outerBox: string;
  pcsPerCarton: string;
  currency: string;
  unitPrice: string;
  moq: string;
  qty: string;
}

const emptyProduct = (): ProductRow => ({
  id: Date.now(), image: '', name: '', model: '',
  power: '', voltage: '220-240V', flux: '', efficacy: '', cct: '', cri: '',
  beam: '', ip: '', lifespan: '', warranty: '', cert: '',
  size: '', weight: '', innerBox: '', outerBox: '', pcsPerCarton: '',
  currency: 'USD', unitPrice: '', moq: '', qty: '',
});

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      const url = URL.createObjectURL(file);
      onChange(url);
      return;
    }
    const fd = new FormData();
    fd.append('file', file); fd.append('upload_preset', uploadPreset); fd.append('folder', 'ynk-quotation');
    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: 'POST', body: fd })
      .then(r => r.json()).then(d => { if (d.secure_url) onChange(d.secure_url); });
  };
  return (
    <div className="no-print-border" style={{ width: 120, height: 120, border: '1.5px dashed #cbd5e1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', background: '#f8fafc', flexShrink: 0 }}
      onClick={() => ref.current?.click()}>
      {value
        ? <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        : <span style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>📷<br />이미지 업로드</span>}
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
}

function F({ label, value, onChange, placeholder = '', wide = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; wide?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, gridColumn: wide ? '1 / -1' : undefined }}>
      <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ border: 'none', borderBottom: '1px solid #e2e8f0', padding: '3px 0', fontSize: 13, outline: 'none', background: 'transparent', width: '100%' }} />
    </div>
  );
}

export default function QuotationPage() {
  const siteSettings = useSiteSettings();
  const c = siteSettings?.company || { name: '(주)와이앤케이', address: '인천광역시 미추홀구 경인로112 4층', tel: '032-862-1350', fax: '032-863-1351', email: 'sales@ynk2014.com', business_id: '131-86-67779', about_text: '' };

  const today = new Date().toISOString().slice(0, 10);
  const [quoteNo, setQuoteNo]     = useState(`YNK-${today.replace(/-/g, '')}-001`);
  const [quoteDate, setQuoteDate] = useState(today);
  const [validUntil, setValidUntil] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10); });

  const [buyer, setBuyer] = useState({ company: '', contact: '', email: '', address: '', tel: '' });

  const [products, setProducts] = useState<ProductRow[]>([emptyProduct()]);
  const [incoterm, setIncoterm]   = useState('FOB XIAMEN');
  const [payment, setPayment]     = useState('30% T/T in advance, 70% before shipment');
  const [leadTime, setLeadTime]   = useState('45 days after deposit confirmed');
  const [notes, setNotes]         = useState('');

  const updateBuyer = (k: keyof typeof buyer, v: string) => setBuyer(b => ({ ...b, [k]: v }));
  const updateProduct = (id: number, k: keyof ProductRow, v: string) =>
    setProducts(ps => ps.map(p => p.id === id ? { ...p, [k]: v } : p));
  const addProduct   = () => setProducts(ps => [...ps, emptyProduct()]);
  const removeProduct = (id: number) => setProducts(ps => ps.filter(p => p.id !== id));

  const totalByCurrency = () => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      const amt = parseFloat(p.unitPrice || '0') * parseFloat(p.qty || '0');
      if (amt > 0) map[p.currency] = (map[p.currency] || 0) + amt;
    });
    return map;
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .no-print-border { border: none !important; cursor: default !important; }
          body { margin: 0; }
          .page { box-shadow: none !important; margin: 0 !important; padding: 32px !important; }
          input, select, textarea { border: none !important; border-bottom: none !important; padding: 0 !important; }
          .print-section { page-break-inside: avoid; }
        }
        @page { size: A4; margin: 0; }
        input:focus { outline: none; }
        select { border: none; background: transparent; font-size: 13px; cursor: pointer; }
        textarea { border: none; border-bottom: 1px solid #e2e8f0; width: 100%; resize: vertical; font-size: 13px; outline: none; background: transparent; }
      `}</style>

      {/* 상단 컨트롤 */}
      <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#0f172a', padding: '10px 24px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>📄 견적서 작성</span>
        <div style={{ flex: 1 }} />
        <button onClick={addProduct}
          style={{ padding: '8px 18px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          + 제품 추가
        </button>
        <button onClick={() => window.print()}
          style={{ padding: '8px 18px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          🖨️ PDF 저장 / 인쇄
        </button>
        <a href="/admin" style={{ padding: '8px 18px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>← 관리자</a>
      </div>

      {/* 견적서 본문 */}
      <div style={{ paddingTop: 56, background: '#e2e8f0', minHeight: '100vh' }}>
        <div className="page" style={{ maxWidth: 860, margin: '24px auto 60px', background: '#fff', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', padding: '48px 52px', fontFamily: 'sans-serif', color: '#0f172a' }}>

          {/* 헤더 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid #0ea5e9' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #0284c7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>YnK</span>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>GLOBAL LED TRADING</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
                <div>📍 {c.address}</div>
                <div>📞 {c.tel} | 📠 {c.fax}</div>
                <div>✉️ {c.email}</div>
                <div>사업자번호: {c.business_id}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#0ea5e9', letterSpacing: -0.5, marginBottom: 12 }}>QUOTATION</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px 16px', fontSize: 13, textAlign: 'left' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Quote No.</span>
                <input value={quoteNo} onChange={e => setQuoteNo(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #e2e8f0', fontSize: 13, fontWeight: 700, textAlign: 'right', outline: 'none', width: 160 }} />
                <span style={{ color: '#64748b', fontWeight: 600 }}>Date</span>
                <input type="date" value={quoteDate} onChange={e => setQuoteDate(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #e2e8f0', fontSize: 13, textAlign: 'right', outline: 'none', width: 140 }} />
                <span style={{ color: '#64748b', fontWeight: 600 }}>Valid Until</span>
                <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #e2e8f0', fontSize: 13, textAlign: 'right', outline: 'none', width: 140 }} />
              </div>
            </div>
          </div>

          {/* 수신처 */}
          <div className="print-section" style={{ marginBottom: 32, background: '#f8fafc', borderRadius: 12, padding: '20px 24px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>TO (수신처)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>
              <F label="회사명 (Company)" value={buyer.company} onChange={v => updateBuyer('company', v)} />
              <F label="담당자 (Contact)" value={buyer.contact} onChange={v => updateBuyer('contact', v)} />
              <F label="이메일 (Email)" value={buyer.email} onChange={v => updateBuyer('email', v)} />
              <F label="전화 (Tel)" value={buyer.tel} onChange={v => updateBuyer('tel', v)} />
              <F label="주소 (Address)" value={buyer.address} onChange={v => updateBuyer('address', v)} wide />
            </div>
          </div>

          {/* 제품 목록 */}
          {products.map((p, pi) => (
            <div key={p.id} className="print-section" style={{ marginBottom: 28, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              {/* 제품 헤더 */}
              <div style={{ background: '#0f172a', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>ITEM {pi + 1}</span>
                <button className="no-print" onClick={() => removeProduct(p.id)}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>✕ 삭제</button>
              </div>

              <div style={{ padding: '20px 20px 8px' }}>
                {/* 이미지 + 기본 정보 */}
                <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                  <ImageUpload value={p.image} onChange={v => updateProduct(p.id, 'image', v)} />
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                    <F label="제품명 (Product Name)" value={p.name} onChange={v => updateProduct(p.id, 'name', v)} wide />
                    <F label="모델번호 (Model No.)" value={p.model} onChange={v => updateProduct(p.id, 'model', v)} />
                    <F label="인증 (Certification)" value={p.cert} onChange={v => updateProduct(p.id, 'cert', v)} />
                  </div>
                </div>

                {/* 전기/광학 사양 */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid #e2e8f0' }}>⚡ 전기 / 광학 사양</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 20px' }}>
                    <F label="소비전력 (W)" value={p.power} onChange={v => updateProduct(p.id, 'power', v)} placeholder="e.g. 50" />
                    <F label="입력전압 (V)" value={p.voltage} onChange={v => updateProduct(p.id, 'voltage', v)} placeholder="220-240V" />
                    <F label="광속 (lm)" value={p.flux} onChange={v => updateProduct(p.id, 'flux', v)} placeholder="e.g. 4500" />
                    <F label="광효율 (lm/W)" value={p.efficacy} onChange={v => updateProduct(p.id, 'efficacy', v)} placeholder="e.g. 90" />
                    <F label="색온도 CCT (K)" value={p.cct} onChange={v => updateProduct(p.id, 'cct', v)} placeholder="e.g. 6500K" />
                    <F label="연색지수 CRI (Ra)" value={p.cri} onChange={v => updateProduct(p.id, 'cri', v)} placeholder="e.g. Ra80" />
                    <F label="배광각 (°)" value={p.beam} onChange={v => updateProduct(p.id, 'beam', v)} placeholder="e.g. 120°" />
                    <F label="IP 등급" value={p.ip} onChange={v => updateProduct(p.id, 'ip', v)} placeholder="e.g. IP65" />
                    <F label="수명 (h)" value={p.lifespan} onChange={v => updateProduct(p.id, 'lifespan', v)} placeholder="e.g. 50000" />
                    <F label="보증기간" value={p.warranty} onChange={v => updateProduct(p.id, 'warranty', v)} placeholder="e.g. 3 years" />
                  </div>
                </div>

                {/* 제품/포장 사이즈 */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid #e2e8f0' }}>📦 제품 / 포장 크기</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 20px' }}>
                    <F label="제품 크기 (mm)" value={p.size} onChange={v => updateProduct(p.id, 'size', v)} placeholder="e.g. 640×640×28" />
                    <F label="중량 (g/kg)" value={p.weight} onChange={v => updateProduct(p.id, 'weight', v)} placeholder="e.g. 560g" />
                    <F label="이너박스 (Inner Box)" value={p.innerBox} onChange={v => updateProduct(p.id, 'innerBox', v)} placeholder="e.g. 680×680×40mm" />
                    <F label="아웃박스 (Outer Box)" value={p.outerBox} onChange={v => updateProduct(p.id, 'outerBox', v)} placeholder="e.g. 700×360×440mm" />
                    <F label="입수 (Pcs/Carton)" value={p.pcsPerCarton} onChange={v => updateProduct(p.id, 'pcsPerCarton', v)} placeholder="e.g. 4" />
                  </div>
                </div>

                {/* 가격 */}
                <div style={{ background: '#f0f9ff', borderRadius: 8, padding: '14px 16px', display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr auto', gap: '0 20px', alignItems: 'end' }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>화폐</div>
                    <select value={p.currency} onChange={e => updateProduct(p.id, 'currency', e.target.value)}
                      style={{ fontSize: 14, fontWeight: 700, color: '#0ea5e9', background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer' }}>
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <F label={`단가 (Unit Price, ${CURRENCY_SYMBOLS[p.currency] || p.currency})`} value={p.unitPrice} onChange={v => updateProduct(p.id, 'unitPrice', v)} placeholder="0.00" />
                  <F label="MOQ" value={p.moq} onChange={v => updateProduct(p.id, 'moq', v)} placeholder="e.g. 1000 pcs" />
                  <F label="주문수량 (Qty)" value={p.qty} onChange={v => updateProduct(p.id, 'qty', v)} placeholder="0" />
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>금액 (Amount)</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>
                      {p.unitPrice && p.qty
                        ? `${CURRENCY_SYMBOLS[p.currency] || p.currency}${(parseFloat(p.unitPrice) * parseFloat(p.qty)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '—'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 합계 */}
          {Object.keys(totalByCurrency()).length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
              <div style={{ background: '#0f172a', color: '#fff', borderRadius: 12, padding: '16px 28px', textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>TOTAL AMOUNT</div>
                {Object.entries(totalByCurrency()).map(([cur, amt]) => (
                  <div key={cur} style={{ fontSize: 22, fontWeight: 900 }}>
                    {CURRENCY_SYMBOLS[cur] || cur}{amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {cur}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 거래 조건 */}
          <div className="print-section" style={{ marginBottom: 28, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '10px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>📋 거래 조건 (Terms & Conditions)</span>
            </div>
            <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 32px' }}>
              <F label="Incoterms" value={incoterm} onChange={setIncoterm} placeholder="FOB XIAMEN" />
              <F label="결제조건 (Payment Terms)" value={payment} onChange={setPayment} />
              <F label="납기 (Lead Time)" value={leadTime} onChange={setLeadTime} />
            </div>
          </div>

          {/* 비고 */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>비고 (Remarks)</div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="추가 조건, 특이사항 등..." />
          </div>

          {/* 서명란 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, paddingTop: 24, borderTop: '1px solid #e2e8f0' }}>
            {[['공급자 (Seller)', c.name], ['구매자 (Buyer)', buyer.company]].map(([role, name]) => (
              <div key={role} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{role}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 48 }}>{name}</div>
                <div style={{ borderTop: '1px solid #94a3b8', paddingTop: 8, fontSize: 12, color: '#94a3b8' }}>서명 / Signature & Seal</div>
              </div>
            ))}
          </div>

          {/* 푸터 */}
          <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
            {c.name} · {c.address} · {c.tel} · {c.email}
          </div>

        </div>
      </div>
    </>
  );
}
