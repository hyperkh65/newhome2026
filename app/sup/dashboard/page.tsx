'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Supplier { id: string; company_name: string; country: string; contact_name: string; phone: string; address: string; business_reg_no: string; website: string; status: string; admin_notes: string; }
interface Product { id?: string; supplier_id?: string; name: string; category: string; description: string; specs: Record<string, string>; images: string[]; status: string; }
interface Document { id?: string; supplier_id?: string; product_id?: string; name: string; url: string; doc_type: string; }

const EMPTY_PRODUCT: Product = { name: '', category: '', description: '', specs: {}, images: [], status: 'draft' };
const DOC_TYPES = ['datasheet', 'cert', 'manual', 'drawing', 'other'];

const inp: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
};
const label: React.CSSProperties = { display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 7, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' };
const card: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginBottom: 16 };

export default function SupplierDashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<'company' | 'products' | 'documents'>('company');
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newDoc, setNewDoc] = useState<Document>({ name: '', url: '', doc_type: 'datasheet' });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace('/sup'); return; }
      const uid = data.session.user.id;
      setUserId(uid);
      const { data: s } = await supabase.from('suppliers').select('*').eq('id', uid).single();
      if (s) setSupplier(s as Supplier);
      const { data: p } = await supabase.from('supplier_products').select('*').eq('supplier_id', uid).order('created_at', { ascending: false });
      if (p) setProducts(p as Product[]);
      const { data: d } = await supabase.from('supplier_documents').select('*').eq('supplier_id', uid).order('created_at', { ascending: false });
      if (d) setDocuments(d as Document[]);
    });
  }, []);

  const saveCompany = async () => {
    if (!supplier || !userId) return;
    setSaving(true);
    await supabase.from('suppliers').update({ ...supplier }).eq('id', userId);
    setSaving(false);
  };

  const saveProduct = async () => {
    if (!editProduct || !userId) return;
    setSaving(true);
    if (editProduct.id) {
      await supabase.from('supplier_products').update({ ...editProduct }).eq('id', editProduct.id);
    } else {
      const { data } = await supabase.from('supplier_products').insert({ ...editProduct, supplier_id: userId }).select().single();
      if (data) setProducts(prev => [data as Product, ...prev]);
    }
    const { data: p } = await supabase.from('supplier_products').select('*').eq('supplier_id', userId).order('created_at', { ascending: false });
    if (p) setProducts(p as Product[]);
    setEditProduct(null);
    setSaving(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('제품을 삭제할까요?')) return;
    await supabase.from('supplier_products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const uploadFile = async (file: File, productId?: string) => {
    setUploading(true);
    const path = `supplier-docs/${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('supplier-files').upload(path, file, { upsert: true });
    if (error) { alert('업로드 실패: ' + error.message); setUploading(false); return; }
    const { data: pub } = supabase.storage.from('supplier-files').getPublicUrl(path);
    setNewDoc(prev => ({ ...prev, url: pub.publicUrl, name: prev.name || file.name }));
    setUploading(false);
  };

  const saveDoc = async () => {
    if (!newDoc.name || !newDoc.url || !userId) return;
    setSaving(true);
    const { data } = await supabase.from('supplier_documents').insert({ ...newDoc, supplier_id: userId }).select().single();
    if (data) setDocuments(prev => [data as Document, ...prev]);
    setNewDoc({ name: '', url: '', doc_type: 'datasheet' });
    setSaving(false);
  };

  const deleteDoc = async (id: string) => {
    await supabase.from('supplier_documents').delete().eq('id', id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const statusColor = (s: string) => s === 'approved' ? '#4ade80' : s === 'rejected' ? '#f87171' : '#fbbf24';
  const statusLabel = (s: string) => s === 'approved' ? '승인됨' : s === 'rejected' ? '반려됨' : '검토 중';

  if (!userId) return (
    <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>로딩 중...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080a0f', color: '#fff', fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex' }}>

      {/* 사이드바 */}
      <aside style={{ width: 220, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '28px 0', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{supplier?.company_name || '공급사'}</div>
          <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: statusColor(supplier?.status || 'pending') + '22', color: statusColor(supplier?.status || 'pending') }}>
            {statusLabel(supplier?.status || 'pending')}
          </div>
        </div>
        <nav style={{ padding: '16px 10px', flex: 1 }}>
          {([['company', '🏢', '회사 정보'], ['products', '📦', '제품 등록'], ['documents', '📄', '문서 관리']] as const).map(([key, icon, lbl]) => (
            <button key={key} onClick={() => { setTab(key); setEditProduct(null); }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 3, fontFamily: 'inherit', fontSize: 13, transition: '0.15s',
                background: tab === key ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: tab === key ? '#60a5fa' : 'rgba(255,255,255,0.45)',
                fontWeight: tab === key ? 700 : 400,
                borderLeft: `2px solid ${tab === key ? '#3b82f6' : 'transparent'}` }}>
              <span>{icon}</span><span>{lbl}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={async () => { await supabase.auth.signOut(); router.replace('/sup'); }}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: 13, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', gap: 10, alignItems: 'center' }}>
            🚪 로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 */}
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '100vh' }}>

        {/* ── 회사 정보 ── */}
        {tab === 'company' && supplier && (
          <div style={{ padding: 40, maxWidth: 720 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>🏢 회사 정보</h1>
            {supplier.admin_notes && (
              <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#fbbf24' }}>
                📋 YnK 담당자 메모: {supplier.admin_notes}
              </div>
            )}
            <div style={card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {([['company_name', '회사명 *'], ['country', '국가'], ['contact_name', '담당자'], ['phone', '연락처'], ['address', '주소'], ['business_reg_no', '사업자 번호'], ['website', '웹사이트']] as [keyof Supplier, string][]).map(([k, l]) => (
                  <div key={k} style={k === 'address' || k === 'website' ? { gridColumn: '1 / -1' } : {}}>
                    <label style={label}>{l}</label>
                    <input value={String(supplier[k] || '')} onChange={e => setSupplier({ ...supplier, [k]: e.target.value })} style={inp} />
                  </div>
                ))}
              </div>
              <button onClick={saveCompany} disabled={saving}
                style={{ marginTop: 20, padding: '12px 28px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? '저장 중...' : '💾 저장'}
              </button>
            </div>
          </div>
        )}

        {/* ── 제품 목록 ── */}
        {tab === 'products' && !editProduct && (
          <div style={{ padding: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900 }}>📦 제품 등록</h1>
              <button onClick={() => setEditProduct({ ...EMPTY_PRODUCT })}
                style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                + 제품 추가
              </button>
            </div>
            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                <p>등록된 제품이 없습니다</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {products.map(p => (
                  <div key={p.id} style={{ ...card, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{p.category} · 스펙 {Object.keys(p.specs || {}).length}개</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 8, background: p.status === 'approved' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)', color: p.status === 'approved' ? '#4ade80' : '#fbbf24' }}>
                      {p.status === 'approved' ? '승인' : p.status === 'rejected' ? '반려' : '검토중'}
                    </span>
                    <button onClick={() => setEditProduct(p)} style={{ padding: '7px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, background: 'transparent', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>편집</button>
                    <button onClick={() => deleteProduct(p.id!)} style={{ padding: '7px 14px', border: 'none', borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: 12, cursor: 'pointer' }}>삭제</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 제품 편집 ── */}
        {tab === 'products' && editProduct && (
          <div style={{ padding: 40, maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <button onClick={() => setEditProduct(null)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>← 목록</button>
              <h1 style={{ fontSize: 22, fontWeight: 900 }}>{editProduct.id ? '제품 편집' : '제품 추가'}</h1>
            </div>
            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', marginBottom: 20 }}>기본 정보</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={label}>제품명 *</label>
                  <input value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} placeholder="Product Name" style={inp} />
                </div>
                <div>
                  <label style={label}>카테고리</label>
                  <input value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} placeholder="예: LED Panel, Street Light" style={inp} />
                </div>
                <div>
                  <label style={label}>상태</label>
                  <select value={editProduct.status} onChange={e => setEditProduct({ ...editProduct, status: e.target.value })}
                    style={{ ...inp, appearance: 'none' }}>
                    <option value="draft">Draft</option>
                    <option value="submitted">제출 완료</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={label}>제품 설명</label>
                  <textarea value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} rows={3} placeholder="제품 설명" style={{ ...inp, resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa', marginBottom: 16 }}>사양 (Specifications)</h3>
              {Object.entries(editProduct.specs || {}).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input value={k} readOnly style={{ ...inp, width: 160, flexShrink: 0, opacity: 0.7 }} />
                  <input value={v} onChange={e => setEditProduct({ ...editProduct, specs: { ...editProduct.specs, [k]: e.target.value } })} style={inp} />
                  <button onClick={() => { const s = { ...editProduct.specs }; delete s[k]; setEditProduct({ ...editProduct, specs: s }); }}
                    style={{ padding: '11px 14px', border: 'none', borderRadius: 10, background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', flexShrink: 0 }}>×</button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input value={newSpecKey} onChange={e => setNewSpecKey(e.target.value)} placeholder="항목 (예: Power)" style={{ ...inp, width: 160, flexShrink: 0 }} />
                <input value={newSpecVal} onChange={e => setNewSpecVal(e.target.value)} placeholder="값 (예: 50W)" style={inp} />
                <button onClick={() => { if (!newSpecKey) return; setEditProduct({ ...editProduct, specs: { ...editProduct.specs, [newSpecKey]: newSpecVal } }); setNewSpecKey(''); setNewSpecVal(''); }}
                  style={{ padding: '11px 16px', border: 'none', borderRadius: 10, background: 'rgba(59,130,246,0.2)', color: '#60a5fa', cursor: 'pointer', flexShrink: 0, fontWeight: 700 }}>+ 추가</button>
              </div>
            </div>

            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#10b981', marginBottom: 16 }}>이미지 URL</h3>
              {(editProduct.images || []).map((url, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={url} onChange={e => { const imgs = [...editProduct.images]; imgs[i] = e.target.value; setEditProduct({ ...editProduct, images: imgs }); }} placeholder="https://" style={inp} />
                  <button onClick={() => setEditProduct({ ...editProduct, images: editProduct.images.filter((_, j) => j !== i) })}
                    style={{ padding: '11px 14px', border: 'none', borderRadius: 10, background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer' }}>×</button>
                </div>
              ))}
              <button onClick={() => setEditProduct({ ...editProduct, images: [...(editProduct.images || []), ''] })}
                style={{ padding: '8px 16px', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer' }}>
                + 이미지 추가
              </button>
            </div>

            <button onClick={saveProduct} disabled={saving || !editProduct.name}
              style={{ width: '100%', padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', opacity: saving || !editProduct.name ? 0.5 : 1 }}>
              {saving ? '저장 중...' : '💾 저장하기'}
            </button>
          </div>
        )}

        {/* ── 문서 관리 ── */}
        {tab === 'documents' && (
          <div style={{ padding: 40, maxWidth: 800 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 28 }}>📄 문서 관리</h1>

            <div style={card}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b', marginBottom: 16 }}>문서 업로드</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={label}>문서 이름 *</label>
                  <input value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} placeholder="KC Certificate 2024" style={inp} />
                </div>
                <div>
                  <label style={label}>문서 유형</label>
                  <select value={newDoc.doc_type} onChange={e => setNewDoc({ ...newDoc, doc_type: e.target.value })} style={{ ...inp, appearance: 'none' }}>
                    {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={label}>연결 제품 (선택)</label>
                  <select value={newDoc.product_id || ''} onChange={e => setNewDoc({ ...newDoc, product_id: e.target.value || undefined })} style={{ ...inp, appearance: 'none' }}>
                    <option value="">없음</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={label}>파일 업로드</label>
                  <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
                    style={{ ...inp, padding: '8px 14px', cursor: 'pointer' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={label}>또는 URL 직접 입력</label>
                  <input value={newDoc.url} onChange={e => setNewDoc({ ...newDoc, url: e.target.value })} placeholder="https://..." style={inp} />
                </div>
              </div>
              <button onClick={saveDoc} disabled={saving || !newDoc.name || !newDoc.url || uploading}
                style={{ padding: '11px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer', opacity: saving || !newDoc.name || !newDoc.url ? 0.5 : 1 }}>
                {uploading ? '업로드 중...' : saving ? '저장 중...' : '📎 저장'}
              </button>
            </div>

            {documents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div><p>등록된 문서가 없습니다</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {documents.map(d => (
                  <div key={d.id} style={{ ...card, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ fontSize: 20 }}>{d.doc_type === 'cert' ? '📜' : d.doc_type === 'datasheet' ? '📊' : d.doc_type === 'manual' ? '📖' : '📄'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{d.doc_type}{d.product_id ? ` · ${products.find(p => p.id === d.product_id)?.name || ''}` : ''}</div>
                    </div>
                    <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontSize: 12, textDecoration: 'none' }}>보기 →</a>
                    <button onClick={() => deleteDoc(d.id!)} style={{ padding: '6px 12px', border: 'none', borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: 11, cursor: 'pointer' }}>삭제</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
