'use client';
import { useState, useRef } from 'react';
import { useSiteSettings } from '@/lib/useSiteSettings';

const CURRENCIES = ['USD', 'EUR', 'CNY', 'KRW', 'JPY'];
const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', CNY: '¥', KRW: '₩', JPY: '¥' };

const PAYMENT_OPTIONS = [
  '30% T/T in advance, 70% T/T before shipment\n(30% 선금, 70% 선적 전 잔금)',
  '100% T/T at end of month following shipment (B/L date)\n(선금없이 100% 익월말 결제)',
  '100% T/T at end of 2nd month following shipment (B/L date)\n(100% 익익월말 결제)',
];

const FOB_PORTS = [
  'FOB Shanghai (上海)', 'FOB Ningbo (宁波)', 'FOB Shenzhen / Yantian (深圳/盐田)',
  'FOB Guangzhou / Nansha (广州/南沙)', 'FOB Xiamen (厦门)',
  'FOB Tianjin (天津)', 'FOB Qingdao (青岛)', 'FOB Dalian (大连)',
];

interface ProductRow {
  id: number; image: string; name: string; model: string;
  power: string; voltage: string; flux: string; efficacy: string;
  cct: string; cri: string; beam: string; ip: string;
  lifespan: string; warranty: string; cert: string;
  size: string; weight: string; innerBox: string; outerBox: string; pcsPerCarton: string;
  currency: string; unitPrice: string; moq: string; qty: string;
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
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) { onChange(URL.createObjectURL(file)); return; }
    const fd = new FormData();
    fd.append('file', file); fd.append('upload_preset', uploadPreset); fd.append('folder', 'ynk-quotation');
    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: 'POST', body: fd })
      .then(r => r.json()).then(d => { if (d.secure_url) onChange(d.secure_url); });
  };
  return (
    <div className="no-print-border" style={{ width: 120, height: 120, border: '1.5px dashed #cbd5e1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', background: '#f8fafc', flexShrink: 0 }}
      onClick={() => ref.current?.click()}>
      {value ? <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
  const c = siteSettings?.company || {
    name: '(주)와이앤케이', address: '인천광역시 미추홀구 경인로112 4층',
    tel: '032-862-1350', fax: '032-863-1351', email: 'sales@ynk2014.com',
    business_id: '131-86-67779', about_text: '',
  };

  const today = new Date().toISOString().slice(0, 10);
  const [quoteNo, setQuoteNo]       = useState(`YNK-${today.replace(/-/g, '')}-001`);
  const [quoteDate, setQuoteDate]   = useState(today);
  const [validUntil, setValidUntil] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10); });
  const [fromEmail]                 = useState('hyperkh@ynk2014.com');

  const [supplier, setSupplier] = useState({ company: '', contact: '', email: '', address: '', tel: '' });
  const updateSupplier = (k: keyof typeof supplier, v: string) => setSupplier(s => ({ ...s, [k]: v }));

  const [products, setProducts]     = useState<ProductRow[]>([emptyProduct()]);
  const [incotermType, setIncotermType] = useState<'FOB' | 'DDP'>('FOB');
  const [incotermPort, setIncotermPort] = useState(FOB_PORTS[4]); // Xiamen default
  const [ddpDest, setDdpDest]       = useState('');
  const [payment, setPayment]       = useState(PAYMENT_OPTIONS[0]);
  const [leadTime, setLeadTime]     = useState('45 days after deposit confirmed');
  const [notes, setNotes]           = useState('');

  const updateProduct  = (id: number, k: keyof ProductRow, v: string) =>
    setProducts(ps => ps.map(p => p.id === id ? { ...p, [k]: v } : p));
  const addProduct     = () => setProducts(ps => [...ps, emptyProduct()]);
  const removeProduct  = (id: number) => setProducts(ps => ps.filter(p => p.id !== id));

  const totalByCurrency = () => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      const amt = parseFloat(p.unitPrice || '0') * parseFloat(p.qty || '0');
      if (amt > 0) map[p.currency] = (map[p.currency] || 0) + amt;
    });
    return map;
  };

  const incotermLabel = incotermType === 'FOB' ? incotermPort : `DDP ${ddpDest}`;
  const paymentLabel  = payment.replace(/\n/g, ' ');

  /* ── Word 다운로드 ── */
  const downloadWord = () => {
    const productRows = products.map((p, i) => `
      <h3>ITEM ${i + 1}: ${p.name} ${p.model ? `(${p.model})` : ''}</h3>
      <table>
        <tr><td><b>소비전력 (W)</b></td><td>${p.power}</td><td><b>입력전압</b></td><td>${p.voltage}</td></tr>
        <tr><td><b>광속 (lm)</b></td><td>${p.flux}</td><td><b>광효율 (lm/W)</b></td><td>${p.efficacy}</td></tr>
        <tr><td><b>색온도 CCT</b></td><td>${p.cct}</td><td><b>연색지수 CRI</b></td><td>${p.cri}</td></tr>
        <tr><td><b>배광각</b></td><td>${p.beam}</td><td><b>IP 등급</b></td><td>${p.ip}</td></tr>
        <tr><td><b>수명 (h)</b></td><td>${p.lifespan}</td><td><b>보증기간</b></td><td>${p.warranty}</td></tr>
        <tr><td><b>인증</b></td><td>${p.cert}</td><td><b>제품 크기</b></td><td>${p.size}</td></tr>
        <tr><td><b>중량</b></td><td>${p.weight}</td><td><b>이너박스</b></td><td>${p.innerBox}</td></tr>
        <tr><td><b>아웃박스</b></td><td>${p.outerBox}</td><td><b>입수</b></td><td>${p.pcsPerCarton}</td></tr>
        <tr><td><b>단가 (Unit Price)</b></td><td>${CURRENCY_SYMBOLS[p.currency]}${p.unitPrice} ${p.currency}</td><td><b>MOQ</b></td><td>${p.moq}</td></tr>
        <tr><td><b>주문수량 (Qty)</b></td><td>${p.qty}</td><td><b>금액 (Amount)</b></td><td>${p.unitPrice && p.qty ? `${CURRENCY_SYMBOLS[p.currency]}${(+p.unitPrice * +p.qty).toFixed(2)}` : ''}</td></tr>
      </table><br/>
    `).join('');

    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
<head><meta charset='utf-8'><style>
  body { font-family: Arial, sans-serif; font-size: 11pt; color: #000; }
  h1 { font-size: 20pt; color: #0284c7; text-align: right; }
  h2 { font-size: 13pt; }
  h3 { font-size: 12pt; background: #f1f5f9; padding: 6px; margin-top: 16px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 8px; }
  td, th { border: 1px solid #ccc; padding: 5px 8px; font-size: 10pt; }
  .header { display: flex; justify-content: space-between; }
  .notice { border: 1px solid #f59e0b; background: #fffbeb; padding: 10px; margin: 16px 0; font-size: 10pt; }
</style></head>
<body>
<h1>견적 의뢰서 / REQUEST FOR QUOTATION</h1>
<table><tr>
  <td><b>${c.name}</b><br/>${c.address}<br/>Tel: ${c.tel} | Fax: ${c.fax}<br/>Email: ${fromEmail}<br/>사업자번호: ${c.business_id}</td>
  <td style="text-align:right">Quote No: <b>${quoteNo}</b><br/>Date: ${quoteDate}<br/>Valid Until: ${validUntil}</td>
</tr></table>
<table><tr>
  <td width="50%"><b>FROM (구매자)</b><br/>${c.name}</td>
  <td width="50%"><b>TO (공급사)</b><br/>${supplier.company}<br/>${supplier.contact}<br/>${supplier.email}<br/>${supplier.tel}<br/>${supplier.address}</td>
</tr></table>
${productRows}
<div class="notice">
  ※ 해당 양식으로 작성이 어려울 경우, 위 항목을 최소한 포함하여 귀사 양식으로 작성해서 보내주시기 바랍니다.<br/>
  If this form is difficult to fill out, please include at minimum the above items and respond using your own company format.
</div>
<h2>거래 조건 (Terms &amp; Conditions)</h2>
<table>
  <tr><td><b>Incoterms</b></td><td>${incotermLabel}</td></tr>
  <tr><td><b>결제조건 (Payment Terms)</b></td><td>${paymentLabel}</td></tr>
  <tr><td><b>납기 (Lead Time)</b></td><td>${leadTime}</td></tr>
</table>
${notes ? `<p><b>비고 (Remarks):</b> ${notes}</p>` : ''}
<br/><br/>
<table><tr>
  <td style="text-align:center;width:50%;padding:40px 0"><b>${c.name}</b><br/><br/><br/>_______________________<br/>서명 / Signature &amp; Seal</td>
  <td style="text-align:center;width:50%;padding:40px 0"><b>${supplier.company || '(공급사)'}</b><br/><br/><br/>_______________________<br/>서명 / Signature &amp; Seal</td>
</tr></table>
</body></html>`;

    const blob = new Blob(['﻿' + html], { type: 'application/msword' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `RFQ_${quoteNo}.doc`; a.click();
  };

  /* ── Excel 다운로드 ── */
  const downloadExcel = () => {
    const rows = products.map((p, i) => `
      <tr style="background:#1e293b;color:#fff"><td colspan="6"><b>ITEM ${i + 1}: ${p.name} ${p.model}</b></td></tr>
      <tr><td><b>소비전력(W)</b></td><td>${p.power}</td><td><b>입력전압</b></td><td>${p.voltage}</td><td><b>광속(lm)</b></td><td>${p.flux}</td></tr>
      <tr><td><b>광효율(lm/W)</b></td><td>${p.efficacy}</td><td><b>색온도 CCT</b></td><td>${p.cct}</td><td><b>CRI</b></td><td>${p.cri}</td></tr>
      <tr><td><b>배광각</b></td><td>${p.beam}</td><td><b>IP등급</b></td><td>${p.ip}</td><td><b>수명(h)</b></td><td>${p.lifespan}</td></tr>
      <tr><td><b>보증기간</b></td><td>${p.warranty}</td><td><b>인증</b></td><td>${p.cert}</td><td><b>제품크기</b></td><td>${p.size}</td></tr>
      <tr><td><b>중량</b></td><td>${p.weight}</td><td><b>이너박스</b></td><td>${p.innerBox}</td><td><b>아웃박스</b></td><td>${p.outerBox}</td></tr>
      <tr><td><b>입수(pcs/ctn)</b></td><td>${p.pcsPerCarton}</td><td><b>단가(${p.currency})</b></td><td>${p.unitPrice}</td><td><b>MOQ</b></td><td>${p.moq}</td></tr>
      <tr><td><b>주문수량</b></td><td>${p.qty}</td><td><b>금액</b></td><td colspan="3">${p.unitPrice && p.qty ? `${CURRENCY_SYMBOLS[p.currency]}${(+p.unitPrice * +p.qty).toFixed(2)} ${p.currency}` : ''}</td></tr>
      <tr><td colspan="6"></td></tr>
    `).join('');

    const html = `<html><head><meta charset='utf-8'>
<style>table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:5px 8px;font-size:10pt;font-family:Arial}</style>
</head><body><table>
<tr style="background:#0f172a;color:#fff"><td colspan="6" style="font-size:16pt;padding:12px"><b>견적 의뢰서 / REQUEST FOR QUOTATION</b></td></tr>
<tr><td><b>Quote No.</b></td><td>${quoteNo}</td><td><b>Date</b></td><td>${quoteDate}</td><td><b>Valid Until</b></td><td>${validUntil}</td></tr>
<tr><td><b>FROM (구매자)</b></td><td colspan="2">${c.name}</td><td><b>TO (공급사)</b></td><td colspan="2">${supplier.company}</td></tr>
<tr><td colspan="6"></td></tr>
${rows}
<tr style="background:#fef3c7"><td colspan="6">※ 해당 양식으로 작성이 어려울 경우, 위 항목을 최소한 포함하여 귀사 양식으로 작성해서 보내주시기 바랍니다. / If difficult, respond using your own format including minimum items above.</td></tr>
<tr><td colspan="6"></td></tr>
<tr><td><b>Incoterms</b></td><td colspan="5">${incotermLabel}</td></tr>
<tr><td><b>결제조건</b></td><td colspan="5">${paymentLabel}</td></tr>
<tr><td><b>납기</b></td><td colspan="5">${leadTime}</td></tr>
${notes ? `<tr><td><b>비고</b></td><td colspan="5">${notes}</td></tr>` : ''}
</table></body></html>`;

    const blob = new Blob(['﻿' + html], { type: 'application/vnd.ms-excel' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `RFQ_${quoteNo}.xls`; a.click();
  };

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .no-print-border { border: none !important; cursor: default !important; }
          body { margin: 0; }
          .page { box-shadow: none !important; margin: 0 !important; padding: 32px !important; }
          input, textarea { border: none !important; border-bottom: none !important; padding: 0 !important; }
          select { appearance: none; -webkit-appearance: none; border: none !important; }
          .print-section { page-break-inside: avoid; }
        }
        @page { size: A4; margin: 0; }
        input:focus { outline: none; }
        select { border: none; background: transparent; font-size: 13px; cursor: pointer; }
        textarea { border: none; border-bottom: 1px solid #e2e8f0; width: 100%; resize: vertical; font-size: 13px; outline: none; background: transparent; }
      `}</style>

      {/* 상단 컨트롤 */}
      <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: '#0f172a', padding: '10px 24px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>📄 견적 의뢰서</span>
        <div style={{ flex: 1 }} />
        <button onClick={addProduct} style={{ padding: '7px 14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>+ 제품 추가</button>
        <button onClick={downloadExcel} style={{ padding: '7px 14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>📊 Excel 다운로드</button>
        <button onClick={downloadWord} style={{ padding: '7px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>📝 Word 다운로드</button>
        <button onClick={() => window.print()} style={{ padding: '7px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>🖨️ PDF 인쇄</button>
        <a href="/admin" style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>← 관리자</a>
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
                  <div style={{ fontSize: 18, fontWeight: 900 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>GLOBAL LED TRADING</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.9 }}>
                <div>📍 {c.address}</div>
                <div>📞 {c.tel} | 📠 {c.fax}</div>
                <div>✉️ {fromEmail}</div>
                <div>사업자번호: {c.business_id}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#0ea5e9', letterSpacing: -0.5, marginBottom: 2 }}>견적 의뢰서</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 14 }}>REQUEST FOR QUOTATION</div>
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

          {/* FROM / TO */}
          <div className="print-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            <div style={{ background: '#f0f9ff', borderRadius: 12, padding: '18px 20px', border: '1px solid #bae6fd' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>FROM (구매자)</div>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.9 }}>
                <div>{c.address}</div>
                <div>Tel: {c.tel} | Fax: {c.fax}</div>
                <div>Email: {fromEmail}</div>
                <div>사업자번호: {c.business_id}</div>
              </div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '18px 20px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>TO (공급사)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <F label="회사명 (Company)" value={supplier.company} onChange={v => updateSupplier('company', v)} />
                <F label="담당자 (Contact)" value={supplier.contact} onChange={v => updateSupplier('contact', v)} />
                <F label="이메일 (Email)" value={supplier.email} onChange={v => updateSupplier('email', v)} />
                <F label="전화 (Tel)" value={supplier.tel} onChange={v => updateSupplier('tel', v)} />
                <F label="주소 (Address)" value={supplier.address} onChange={v => updateSupplier('address', v)} />
              </div>
            </div>
          </div>

          {/* 제품 목록 */}
          {products.map((p, pi) => (
            <div key={p.id} className="print-section" style={{ marginBottom: 28, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: '#0f172a', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>ITEM {pi + 1}</span>
                <button className="no-print" onClick={() => removeProduct(p.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>✕ 삭제</button>
              </div>
              <div style={{ padding: '20px 20px 8px' }}>
                <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                  <ImageUpload value={p.image} onChange={v => updateProduct(p.id, 'image', v)} />
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                    <F label="제품명 (Product Name)" value={p.name} onChange={v => updateProduct(p.id, 'name', v)} wide />
                    <F label="모델번호 (Model No.)" value={p.model} onChange={v => updateProduct(p.id, 'model', v)} />
                    <F label="인증 (Certification)" value={p.cert} onChange={v => updateProduct(p.id, 'cert', v)} />
                  </div>
                </div>
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
                <div style={{ background: '#f0f9ff', borderRadius: 8, padding: '14px 16px', display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr auto', gap: '0 20px', alignItems: 'end' }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>화폐</div>
                    <select value={p.currency} onChange={e => updateProduct(p.id, 'currency', e.target.value)} style={{ fontSize: 14, fontWeight: 700, color: '#0ea5e9', background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer' }}>
                      {CURRENCIES.map(cur => <option key={cur} value={cur}>{cur}</option>)}
                    </select>
                  </div>
                  <F label={`단가 (Unit Price, ${CURRENCY_SYMBOLS[p.currency] || p.currency})`} value={p.unitPrice} onChange={v => updateProduct(p.id, 'unitPrice', v)} placeholder="0.00" />
                  <F label="MOQ" value={p.moq} onChange={v => updateProduct(p.id, 'moq', v)} placeholder="e.g. 1000 pcs" />
                  <F label="주문수량 (Qty)" value={p.qty} onChange={v => updateProduct(p.id, 'qty', v)} placeholder="0" />
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>금액 (Amount)</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>
                      {p.unitPrice && p.qty ? `${CURRENCY_SYMBOLS[p.currency] || p.currency}${(parseFloat(p.unitPrice) * parseFloat(p.qty)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
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

          {/* 안내 문구 */}
          <div style={{ marginBottom: 20, padding: '14px 18px', background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 10, fontSize: 13, lineHeight: 1.8, color: '#78350f' }}>
            ※ 해당 양식으로 작성이 어려울 경우, 위 항목을 최소한 포함하여 <strong>귀사 양식으로 작성해서 보내주시기 바랍니다.</strong><br />
            <span style={{ color: '#92400e' }}>If this form is difficult to complete, please include at minimum the above items and <strong>respond using your own company format.</strong></span>
          </div>

          {/* 거래 조건 */}
          <div className="print-section" style={{ marginBottom: 28, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '10px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>📋 거래 조건 (Terms & Conditions)</span>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Incoterms */}
              <div>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Incoterms</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  {(['FOB', 'DDP'] as const).map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, fontWeight: incotermType === type ? 800 : 500, color: incotermType === type ? '#0ea5e9' : '#475569' }}>
                      <input type="radio" name="incoterm" value={type} checked={incotermType === type} onChange={() => setIncotermType(type)} style={{ accentColor: '#0ea5e9' }} />
                      {type}
                    </label>
                  ))}
                  {incotermType === 'FOB' ? (
                    <select value={incotermPort} onChange={e => setIncotermPort(e.target.value)}
                      style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px 8px', fontSize: 13, background: '#fff', outline: 'none', cursor: 'pointer' }}>
                      {FOB_PORTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  ) : (
                    <input value={ddpDest} onChange={e => setDdpDest(e.target.value)} placeholder="목적지 입력 (e.g. Incheon, Korea)"
                      style={{ border: 'none', borderBottom: '1px solid #e2e8f0', padding: '4px 0', fontSize: 13, outline: 'none', minWidth: 220 }} />
                  )}
                </div>
              </div>
              {/* 결제조건 */}
              <div>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>결제조건 (Payment Terms)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PAYMENT_OPTIONS.map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 13, lineHeight: 1.5, color: payment === opt ? '#0f172a' : '#64748b', fontWeight: payment === opt ? 700 : 400 }}>
                      <input type="radio" name="payment" value={opt} checked={payment === opt} onChange={() => setPayment(opt)} style={{ accentColor: '#0ea5e9', marginTop: 2, flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'pre-line' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* 납기 */}
              <div>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>납기 (Lead Time)</div>
                <input value={leadTime} onChange={e => setLeadTime(e.target.value)}
                  style={{ border: 'none', borderBottom: '1px solid #e2e8f0', padding: '3px 0', fontSize: 13, outline: 'none', width: '100%', background: 'transparent' }} />
              </div>
            </div>
          </div>

          {/* 비고 */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>비고 (Remarks)</div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="추가 조건, 특이사항 등..." />
          </div>

          {/* 서명란 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, paddingTop: 24, borderTop: '1px solid #e2e8f0' }}>
            {[['구매자 (Buyer)', c.name], ['공급사 (Supplier)', supplier.company || '']].map(([role, name]) => (
              <div key={role} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{role}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 48 }}>{name}</div>
                <div style={{ borderTop: '1px solid #94a3b8', paddingTop: 8, fontSize: 12, color: '#94a3b8' }}>서명 / Signature & Seal</div>
              </div>
            ))}
          </div>

          {/* 푸터 */}
          <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
            {c.name} · {c.address} · {c.tel} · {fromEmail}
          </div>

        </div>
      </div>
    </>
  );
}
