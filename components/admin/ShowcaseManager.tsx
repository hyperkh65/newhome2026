'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import CloudinaryUpload from '@/components/CloudinaryUpload';

type Slide = { id: string; productId: string; imageUrl: string; title: string; description: string; enabled: boolean; order: number };

const blank = (order: number): Slide => ({ id: crypto.randomUUID(), productId: '', imageUrl: '', title: '', description: '', enabled: true, order });

export default function ShowcaseManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    (async () => {
      const [{ data: ps }, { data: setting }] = await Promise.all([
        supabase.from('products').select('id,name,image,images').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('config').eq('category', 'product_showcase').maybeSingle(),
      ]);
      setProducts(ps ?? []);
      setSlides(Array.isArray(setting?.config?.slides) ? setting.config.slides : []);
    })();
  }, []);
  const update = (id: string, patch: Partial<Slide>) => setSlides(xs => xs.map(x => x.id === id ? { ...x, ...patch } : x));
  const save = async () => {
    setSaving(true);
    await supabase.from('site_settings').upsert([{ category: 'product_showcase', config: { slides } }], { onConflict: 'category' });
    setSaving(false);
    alert('제품 쇼케이스 설정을 저장했습니다.');
  };
  return <section style={{ padding: 28, maxWidth: 1000 }}>
    <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>제품 쇼케이스</h1>
    <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, marginBottom: 22 }}>메인 우측에 노출할 기존 제품과 이미지를 관리합니다. 모바일에서는 숨겨집니다.</p>
    <button onClick={() => setSlides(xs => [...xs, blank(xs.length)])} style={{ padding: '10px 14px', border: 0, borderRadius: 9, background: '#0ea5e9', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 16 }}>+ 쇼케이스 추가</button>
    {slides.map((s, i) => <div key={s.id} style={{ padding: 18, marginBottom: 12, border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, background: 'rgba(255,255,255,.03)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label style={{ fontSize: 12, color: '#94a3b8' }}>연결 제품<select value={s.productId} onChange={e => update(s.id, { productId: e.target.value })} style={{ display: 'block', width: '100%', marginTop: 6, padding: 10, background: '#111827', color: '#fff', border: '1px solid #334155', borderRadius: 8 }}><option value="">제품 선택</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label style={{ fontSize: 12, color: '#94a3b8' }}>이미지 URL<input value={s.imageUrl} onChange={e => update(s.id, { imageUrl: e.target.value })} style={{ display: 'block', width: '100%', marginTop: 6, padding: 10, background: '#111827', color: '#fff', border: '1px solid #334155', borderRadius: 8 }} /></label>
      </div>
      <div style={{ marginTop: 10 }}><CloudinaryUpload folder="product-showcase" label="이미지 업로드" onSuccess={url => update(s.id, { imageUrl: url })} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 10, marginTop: 12 }}>
        <input placeholder="노출 제목" value={s.title} onChange={e => update(s.id, { title: e.target.value })} style={{ padding: 10, background: '#111827', color: '#fff', border: '1px solid #334155', borderRadius: 8 }} />
        <input placeholder="짧은 설명" value={s.description} onChange={e => update(s.id, { description: e.target.value })} style={{ padding: 10, background: '#111827', color: '#fff', border: '1px solid #334155', borderRadius: 8 }} />
        <label style={{ fontSize: 11, color: '#94a3b8' }}>노출<input type="checkbox" checked={s.enabled} onChange={e => update(s.id, { enabled: e.target.checked })} style={{ display: 'block', marginTop: 10 }} /></label>
      </div>
      <button onClick={() => setSlides(xs => xs.filter(x => x.id !== s.id))} style={{ marginTop: 12, background: 'none', border: 0, color: '#f87171', cursor: 'pointer' }}>삭제</button>
    </div>)}
    <button disabled={saving} onClick={save} style={{ padding: '12px 24px', border: 0, borderRadius: 9, background: '#22c55e', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>{saving ? '저장 중...' : '설정 저장'}</button>
  </section>;
}
