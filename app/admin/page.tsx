'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/store';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import RichEditor from '@/components/RichEditor';
import { supabase } from '@/lib/supabase';

interface Post {
  id?: string; type: 'board' | 'blog'; title: string; content: string;
  author: string; attachments: { name: string; url: string }[]; created_at?: string;
  is_locked?: boolean; password?: string; cover_image?: string;
}
interface SiteSettings {
  company: { name: string; address: string; tel: string; fax: string; email: string; business_id: string; about_text: string };
  menus: { label: string; href: string }[];
  site: { site_name: string; logo_url: string; description: string };
}
interface DocFile { name: string; url: string; type: 'datasheet' | 'manual' | 'cert' | 'drawing' | 'other' }
interface EditableProduct {
  id?: string; name: string; category: string; manufacturer: string; badge: string;
  description: string; image: string; images: string[]; specs: Record<string, string>;
  documents: DocFile[]; featured: boolean; stock?: number; rating?: number; reviews?: number; created_at?: string;
}

const EMPTY_PRODUCT: EditableProduct = {
  name: '', category: 'indoor', manufacturer: '', badge: '', description: '',
  image: '', images: [], specs: {}, documents: [], featured: false,
};
const EMPTY_POST: Post = { type: 'board', title: '', content: '', author: 'YNK Admin', attachments: [], is_locked: false, password: '', cover_image: '' };

const CATEGORIES = [
  { value: 'smart', label: '스마트조명', icon: '☁️' }, { value: 'indoor', label: '실내조명', icon: '🏢' },
  { value: 'home_lighting', label: '홈조명', icon: '🏠' }, { value: 'commercial', label: '상업조명', icon: '🏪' },
  { value: 'industrial', label: '산업조명', icon: '🏗️' }, { value: 'outdoor', label: '실외조명', icon: '🏭' },
  { value: 'landscape', label: '경관조명', icon: '🌉' }, { value: 'special', label: '특수조명', icon: '🔬' },
];

const SPEC_FIELDS = [
  { key: 'power', label: '소비전력', unit: 'W', icon: '⚡' },
  { key: 'luminous_flux', label: '광속', unit: 'lm', icon: '💡' },
  { key: 'efficacy', label: '광효율', unit: 'lm/W', icon: '✨' },
  { key: 'color_temp', label: '색온도', unit: 'K', icon: '🌡' },
  { key: 'cri', label: '연색지수 CRI', unit: 'Ra', icon: '🎨' },
  { key: 'beam_angle', label: '배광각', unit: '°', icon: '📐' },
  { key: 'ip_rating', label: 'IP 등급', unit: '', icon: '🛡️' },
  { key: 'input_voltage', label: '입력전압', unit: 'V', icon: '🔌' },
  { key: 'power_factor', label: '역률', unit: 'PF', icon: '📊' },
  { key: 'thd', label: 'THD', unit: '%', icon: '〰️' },
  { key: 'lifespan', label: '수명', unit: 'hrs', icon: '⏱️' },
  { key: 'size', label: '제품 크기', unit: 'mm', icon: '📏' },
  { key: 'weight', label: '중량', unit: 'kg', icon: '⚖️' },
  { key: 'operating_temp', label: '작동온도', unit: '°C', icon: '🌡️' },
  { key: 'warranty', label: '보증기간', unit: '', icon: '🛡' },
  { key: 'driver', label: '드라이버', unit: '', icon: '🔧' },
];

const DOC_TYPES = [
  { value: 'datasheet', label: '데이터시트', icon: '📊' },
  { value: 'manual', label: '설치 매뉴얼', icon: '📖' },
  { value: 'cert', label: '인증서', icon: '📜' },
  { value: 'drawing', label: '도면/CAD', icon: '📐' },
  { value: 'other', label: '기타 문서', icon: '📄' },
];

// ── 스펙 입력 컴포넌트 ────────────────────────────────────────────────
function SpecField({ specKey, label, unit, icon, specs, onChange }: {
  specKey: string; label: string; unit: string; icon: string;
  specs: Record<string, string>; onChange: (k: string, v: string) => void;
}) {
  const value = specs[specKey] ?? '';
  const isNa = value === 'N/A';
  const isTbd = value === 'TBD';

  const chip = (active: boolean, color: string, text: string, onClick: () => void) => (
    <button onClick={onClick} style={{
      padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: 'pointer',
      border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
      background: active ? color + '25' : 'transparent',
      color: active ? color : 'rgba(255,255,255,0.3)',
    }}>{text}</button>
  );

  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
          {icon} {label}{unit ? ` · ${unit}` : ''}
        </span>
        <div style={{ display: 'flex', gap: 3 }}>
          {chip(!isNa && !isTbd, '#10b981', '입력', () => { if (isNa || isTbd) onChange(specKey, ''); })}
          {chip(isNa, '#64748b', '해당없음', () => onChange(specKey, isNa ? '' : 'N/A'))}
          {chip(isTbd, '#f59e0b', '별도확인', () => onChange(specKey, isTbd ? '' : 'TBD'))}
        </div>
      </div>
      {!isNa && !isTbd ? (
        <input value={value} onChange={e => onChange(specKey, e.target.value)}
          placeholder={unit ? `예: 50${unit}` : '값 입력...'}
          style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
      ) : (
        <div style={{ padding: '7px 10px', fontSize: 12, color: isNa ? '#475569' : '#d97706', fontStyle: 'italic' }}>
          {isNa ? '— 해당 없음' : '⏳ 별도 확인'}
        </div>
      )}
    </div>
  );
}

// ── 메인 관리자 페이지 ────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const isLoggedIn = useAdminStore(s => s.isLoggedIn);
  const logout     = useAdminStore(s => s.logout);

  const [tab, setTab]   = useState<'dashboard' | 'products' | 'board' | 'blog' | 'settings'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [editProduct, setEditProduct] = useState<EditableProduct | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [brochureUrl, setBrochureUrl] = useState('');
  const [prodSearch, setProdSearch] = useState('');
  const [prodCatFilter, setProdCatFilter] = useState('all');

  useEffect(() => {
    if (!isLoggedIn) router.push('/admin/login');
    else { fetchPosts(); fetchSettings(); fetchProducts(); }
  }, [isLoggedIn]);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setDbProducts(data);
  }
  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  }
  async function fetchSettings() {
    const { data } = await supabase.from('site_settings').select('*');
    if (data) {
      const company = data.find(d => d.category === 'company')?.config;
      const menus   = data.find(d => d.category === 'menu')?.config;
      const brochure = data.find(d => d.category === 'brochure')?.config;
      const site    = data.find(d => d.category === 'site')?.config || { site_name: '(주)와이앤케이 YNK', logo_url: '', description: '' };
      setSettings({ company, menus, site });
      if (brochure?.url) setBrochureUrl(brochure.url);
    }
  }

  if (!isLoggedIn) return null;

  // ── 핸들러 ──────────────────────────────────────────────────────────
  const handleEditProduct = (prod: any) => {
    setEditProduct({
      ...prod,
      images: prod.images || (prod.image ? [prod.image] : []),
      specs: prod.specs || {},
      documents: prod.documents || [],
      manufacturer: prod.manufacturer || '',
      badge: prod.badge || '',
      featured: prod.featured || false,
    });
  };

  const handleSaveProduct = async () => {
    if (!editProduct) return;
    setLoading(true);
    const primaryImage = editProduct.images[0] || editProduct.image || '';
    const payload: any = {
      name: editProduct.name, category: editProduct.category,
      manufacturer: editProduct.manufacturer, badge: editProduct.badge || null,
      description: editProduct.description, image: primaryImage,
      images: editProduct.images, specs: editProduct.specs,
      documents: editProduct.documents, featured: editProduct.featured,
      stock: editProduct.stock ?? 1, rating: editProduct.rating ?? 0, reviews: editProduct.reviews ?? 0,
    };
    if (editProduct.id) payload.id = editProduct.id;
    const { error } = await supabase.from('products').upsert(payload);
    if (!error) { setEditProduct(null); fetchProducts(); }
    else alert('저장 실패: ' + error.message);
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const handleSavePost = async () => {
    if (!editPost) return;
    setLoading(true);
    // 기본 필드만 포함 (항상 존재하는 컬럼)
    const payload: any = {
      type: editPost.type, title: editPost.title, content: editPost.content,
      author: editPost.author, attachments: editPost.attachments,
    };
    // 선택 컬럼은 값이 있을 때만 포함 (schema cache 오류 방지)
    if (editPost.is_locked)                          payload.is_locked    = true;
    if (editPost.cover_image)                        payload.cover_image  = editPost.cover_image;
    if (editPost.is_locked && editPost.password)     payload.password     = editPost.password;

    let error;
    if (editPost.id) {
      ({ error } = await supabase.from('posts').update(payload).eq('id', editPost.id));
    } else {
      ({ error } = await supabase.from('posts').insert(payload));
    }
    if (error) alert('저장 실패: ' + error.message);
    else { setEditPost(null); fetchPosts(); }
    setLoading(false);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setLoading(true);
    await supabase.from('site_settings').upsert([
      { category: 'company',  config: settings.company },
      { category: 'menu',     config: settings.menus },
      { category: 'brochure', config: { url: brochureUrl } },
      { category: 'site',     config: settings.site },
    ], { onConflict: 'category' });
    alert('저장되었습니다.');
    setLoading(false);
  };

  // ── 사이드바 아이템 ──────────────────────────────────────────────────
  const NAV_ITEMS = [
    { key: 'dashboard', label: '대시보드',   icon: '📊', badge: null },
    { key: 'products',  label: '제품 관리',  icon: '💡', badge: dbProducts.length },
    { key: 'board',     label: '게시판',     icon: '📝', badge: posts.filter(p=>p.type==='board').length },
    { key: 'blog',      label: '블로그',     icon: '✍️', badge: posts.filter(p=>p.type==='blog').length },
    { key: 'settings',  label: '사이트 설정', icon: '⚙️', badge: null },
  ];

  const filteredProducts = dbProducts.filter(p => {
    const matchCat = prodCatFilter === 'all' || p.category === prodCatFilter;
    const matchSearch = !prodSearch || p.name?.toLowerCase().includes(prodSearch.toLowerCase()) || p.manufacturer?.toLowerCase().includes(prodSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── 스타일 헬퍼 ─────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 };
  const sectionCard: React.CSSProperties = { background: 'rgba(255,255,255,0.025)', borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 20 };

  const Field = (label: string, node: React.ReactNode) => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      {node}
    </div>
  );

  const TextInput = (label: string, value: string, onChange: (v: string) => void, placeholder = '') => Field(label,
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
  );

  return (
    <main style={{ background: '#080a0f', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex' }}>

      {/* ── 사이드바 ── */}
      <aside style={{ width: 220, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '28px 0', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #60a5fa, #1d4ed8)', boxShadow: '0 0 18px #3b82f650' }} />
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>YnK Admin</span>
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5, textTransform: 'uppercase' }}>CMS v3.0</span>
        </div>

        <nav style={{ padding: '16px 10px', flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.key} onClick={() => setTab(item.key as any)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 3, transition: 'all 0.18s', fontFamily: 'inherit',
                background: tab === item.key ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: tab === item.key ? '#60a5fa' : 'rgba(255,255,255,0.45)',
                fontWeight: tab === item.key ? 700 : 400, fontSize: 13,
                borderLeft: `2px solid ${tab === item.key ? '#3b82f6' : 'transparent'}`,
              }}>
              <span>{item.icon}</span>
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge !== null && (item.badge as number) > 0 && (
                <span style={{ fontSize: 10, background: tab === item.key ? '#3b82f6' : 'rgba(255,255,255,0.1)', color: tab === item.key ? '#fff' : 'rgba(255,255,255,0.5)', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => { logout(); router.push('/'); }}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: 13, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', gap: 10, alignItems: 'center' }}>
            🚪 로그아웃
          </button>
        </div>
      </aside>

      {/* ── 메인 영역 ── */}
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '100vh' }}>

        {/* ─────── 대시보드 ─────── */}
        {tab === 'dashboard' && (
          <div style={{ padding: '40px' }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>관리 대시보드</h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 36 }}>와이앤케이 LED 홈페이지 CMS</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
              {[
                { label: '등록 제품', value: dbProducts.length, icon: '💡', color: '#3b82f6', sub: '개' },
                { label: '게시글', value: posts.filter(p=>p.type==='board').length, icon: '📝', color: '#10b981', sub: '개' },
                { label: '블로그', value: posts.filter(p=>p.type==='blog').length, icon: '✍️', color: '#f59e0b', sub: '개' },
                { label: '주요 제품', value: dbProducts.filter(p=>p.featured).length, icon: '⭐', color: '#a855f7', sub: '개' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '22px 24px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: s.color, letterSpacing: -1 }}>{s.value}<span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>{s.sub}</span></div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'rgba(255,255,255,0.6)' }}>최근 등록 제품</h3>
                {dbProducts.slice(0, 5).map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <img src={p.image} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', background: '#1e293b' }} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{p.category} · {p.manufacturer || '제조사 미입력'}</div>
                    </div>
                    {p.featured && <span style={{ fontSize: 10, background: '#a855f720', color: '#a855f7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>추천</span>}
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '24px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'rgba(255,255,255,0.6)' }}>카테고리별 현황</h3>
                {CATEGORIES.map(cat => {
                  const count = dbProducts.filter(p => p.category === cat.value).length;
                  const pct = dbProducts.length ? Math.round(count / dbProducts.length * 100) : 0;
                  return (
                    <div key={cat.value} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{cat.icon} {cat.label}</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{count}개</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: '#3b82f6', borderRadius: 2, transition: '0.3s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─────── 제품 관리 ─────── */}
        {tab === 'products' && !editProduct && (
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>제품 관리</h1>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>총 {dbProducts.length}개 · 추천 {dbProducts.filter(p=>p.featured).length}개</p>
              </div>
              <button onClick={() => setEditProduct({ ...EMPTY_PRODUCT })}
                style={{ padding: '11px 22px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                + 새 제품 등록
              </button>
            </div>

            {/* 필터/검색 */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              <input value={prodSearch} onChange={e => setProdSearch(e.target.value)} placeholder="🔍 제품명 또는 제조사 검색..."
                style={{ ...inputStyle, width: 280, padding: '9px 14px' }} />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[{ value: 'all', label: '전체' }, ...CATEGORIES].map(c => (
                  <button key={c.value} onClick={() => setProdCatFilter(c.value)}
                    style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${prodCatFilter === c.value ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                      background: prodCatFilter === c.value ? '#3b82f620' : 'transparent',
                      color: prodCatFilter === c.value ? '#60a5fa' : 'rgba(255,255,255,0.45)',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    {'icon' in c ? c.icon + ' ' : ''}{c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 제품 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {filteredProducts.map(prod => (
                <div key={prod.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(59,130,246,0.3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.07)'}>
                  <div style={{ position: 'relative', height: 160, background: '#0f1623', overflow: 'hidden' }}>
                    {prod.image ? <img src={prod.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, color: 'rgba(255,255,255,0.1)' }}>💡</div>}
                    {prod.featured && <span style={{ position: 'absolute', top: 10, right: 10, background: '#a855f7', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>⭐ 추천</span>}
                    {prod.badge && <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>{prod.badge}</span>}
                    {(prod.images?.length > 1) && <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>+{prod.images.length - 1}</span>}
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>
                      {CATEGORIES.find(c => c.value === prod.category)?.icon} {prod.category}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{prod.name}</div>
                    {prod.manufacturer && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>🇨🇳 {prod.manufacturer}</div>}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                      {Object.entries(prod.specs || {}).slice(0, 3).map(([k, v]) => (
                        v && String(v) !== 'N/A' && String(v) !== 'TBD' && String(v) !== '' ? (
                          <span key={k} style={{ fontSize: 10, padding: '2px 7px', background: 'rgba(255,255,255,0.06)', borderRadius: 4, color: 'rgba(255,255,255,0.5)' }}>{String(v)}</span>
                        ) : null
                      ))}
                      {prod.documents?.length > 0 && <span style={{ fontSize: 10, padding: '2px 7px', background: 'rgba(16,185,129,0.1)', borderRadius: 4, color: '#10b981' }}>📄 {prod.documents.length}개 자료</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEditProduct(prod)} style={{ flex: 1, padding: '8px', background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>✏️ 수정</button>
                      <button onClick={() => handleDeleteProduct(prod.id)} style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────── 제품 편집 폼 ─────── */}
        {tab === 'products' && editProduct && (
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <button onClick={() => setEditProduct(null)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 13 }}>← 목록으로</button>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900 }}>{editProduct.id ? '제품 수정' : '새 제품 등록'}</h1>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>모든 스펙 항목은 입력/해당없음/별도확인 중 선택 가능합니다</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'flex-start' }}>
              {/* 왼쪽 컬럼 */}
              <div>
                <div style={sectionCard}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#60a5fa', marginBottom: 18, textTransform: 'uppercase', letterSpacing: 0.5 }}>📋 기본 정보</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {TextInput('제품명', editProduct.name, v => setEditProduct({ ...editProduct, name: v }), '예: LED 패널라이트 60W')}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>카테고리</label>
                      <select value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} style={{ ...inputStyle }}>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                      </select>
                    </div>
                    {TextInput('제조사명 (중국)', editProduct.manufacturer, v => setEditProduct({ ...editProduct, manufacturer: v }), '예: Shenzhen XYZ Lighting Co., Ltd')}
                    {TextInput('배지 / 태그', editProduct.badge, v => setEditProduct({ ...editProduct, badge: v }), '예: NEW / 베스트셀러 / 에너지절감')}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>제품 설명</label>
                    <textarea value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                      rows={4} placeholder="제품의 주요 특징, 용도, 장점 등을 입력하세요..."
                      style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(168,85,247,0.06)', borderRadius: 10, border: '1px solid rgba(168,85,247,0.15)' }}>
                    <input type="checkbox" id="featured" checked={editProduct.featured} onChange={e => setEditProduct({ ...editProduct, featured: e.target.checked })} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#a855f7' }} />
                    <label htmlFor="featured" style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#c084fc' }}>⭐ 홈페이지 추천 제품으로 노출</label>
                  </div>
                </div>

                <div style={sectionCard}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#10b981', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>⚡ 상세 스펙</h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 18 }}>각 항목별로 값 입력 / 해당없음 / 별도확인 을 선택하세요</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {SPEC_FIELDS.map(f => (
                      <SpecField key={f.key} specKey={f.key} label={f.label} unit={f.unit} icon={f.icon}
                        specs={editProduct.specs}
                        onChange={(k, v) => setEditProduct({ ...editProduct, specs: { ...editProduct.specs, [k]: v } })} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 오른쪽 컬럼 */}
              <div>
                <div style={sectionCard}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>📸 제품 이미지</h3>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>첫 번째 이미지가 대표 이미지로 사용됩니다</p>
                  {editProduct.images.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                      {editProduct.images.map((url, i) => (
                        <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: i === 0 ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)', aspectRatio: '1' }}>
                          <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                          {i === 0 && <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(245,158,11,0.85)', fontSize: 9, fontWeight: 700, textAlign: 'center', padding: '3px', color: '#000' }}>대표</span>}
                          <button onClick={() => setEditProduct({ ...editProduct, images: editProduct.images.filter((_, idx) => idx !== i) })}
                            style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239,68,68,0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <CloudinaryUpload label="+ 이미지 추가" folder="led-products"
                    onSuccess={url => setEditProduct({ ...editProduct, images: [...editProduct.images, url], image: editProduct.images[0] || url })} />
                </div>

                <div style={sectionCard}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: '#a855f7', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>📁 자료 다운로드</h3>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>데이터시트, 설치매뉴얼, 인증서 등 업로드</p>
                  {editProduct.documents.map((doc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: 14 }}>{DOC_TYPES.find(t => t.value === doc.type)?.icon || '📄'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <input value={doc.name} onChange={e => {
                          const docs = [...editProduct.documents]; docs[i] = { ...doc, name: e.target.value };
                          setEditProduct({ ...editProduct, documents: docs });
                        }} style={{ ...inputStyle, padding: '4px 8px', fontSize: 12 }} placeholder="파일명" />
                      </div>
                      <select value={doc.type} onChange={e => {
                        const docs = [...editProduct.documents]; docs[i] = { ...doc, type: e.target.value as DocFile['type'] };
                        setEditProduct({ ...editProduct, documents: docs });
                      }} style={{ ...inputStyle, width: 90, padding: '4px 6px', fontSize: 11 }}>
                        {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <button onClick={() => setEditProduct({ ...editProduct, documents: editProduct.documents.filter((_, idx) => idx !== i) })}
                        style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>×</button>
                    </div>
                  ))}
                  <CloudinaryUpload label="+ 파일 업로드" folder="led-documents"
                    onSuccess={url => {
                      const name = decodeURIComponent(url.split('/').pop()?.split('?')[0] || '문서');
                      setEditProduct({ ...editProduct, documents: [...editProduct.documents, { name, url, type: 'datasheet' }] });
                    }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button onClick={handleSaveProduct} disabled={loading || !editProduct.name}
                    style={{ padding: '14px', background: loading ? '#1e3a5f' : '#3b82f6', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
                    {loading ? '저장 중...' : '💾 저장하기'}
                  </button>
                  <button onClick={() => setEditProduct(null)}
                    style={{ padding: '12px', background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────── 게시판 / 블로그 ─────── */}
        {(tab === 'board' || tab === 'blog') && (
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900 }}>{tab === 'board' ? '📝 게시판 관리' : '✍️ 블로그 관리'}</h1>
              <button onClick={() => setEditPost({ ...EMPTY_POST, type: tab })}
                style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                + 새 글 작성
              </button>
            </div>

            {editPost ? (
              <div style={sectionCard}>
                {/* 제목 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>제목</label>
                  <input value={editPost.title} onChange={e => setEditPost({ ...editPost, title: e.target.value })}
                    style={inputStyle} placeholder="제목을 입력하세요" />
                </div>

                {/* 커버 이미지 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>커버 이미지 (선택)</label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {editPost.cover_image && (
                      <div style={{ position: 'relative', width: 80, height: 56, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={editPost.cover_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        <button onClick={() => setEditPost({ ...editPost, cover_image: '' })}
                          style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(239,68,68,0.85)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                      </div>
                    )}
                    <CloudinaryUpload label="🖼 이미지 업로드" folder="led-blog"
                      onSuccess={url => setEditPost({ ...editPost, cover_image: url })} />
                  </div>
                </div>

                {/* 내용 - 게시판은 RichEditor, 블로그도 RichEditor */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>내용</label>
                  <RichEditor
                    key={editPost.id || 'new'}
                    value={editPost.content}
                    onChange={html => setEditPost(prev => prev ? { ...prev, content: html } : prev)}
                    minHeight={tab === 'blog' ? 500 : 320}
                  />
                </div>

                {/* 게시판 전용: 잠금 설정 */}
                {tab === 'board' && (
                  <div style={{ marginBottom: 20, padding: '16px 18px', background: 'rgba(239,68,68,0.05)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: editPost.is_locked ? 14 : 0 }}>
                      <input type="checkbox" id="is_locked" checked={!!editPost.is_locked}
                        onChange={e => setEditPost({ ...editPost, is_locked: e.target.checked, password: e.target.checked ? editPost.password : '' })}
                        style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#ef4444' }} />
                      <label htmlFor="is_locked" style={{ cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#f87171' }}>
                        🔒 게시글 암호 잠금
                      </label>
                    </div>
                    {editPost.is_locked && (
                      <div>
                        <label style={{ ...labelStyle, marginTop: 2 }}>열람 암호</label>
                        <input type="text" value={editPost.password || ''}
                          onChange={e => setEditPost({ ...editPost, password: e.target.value })}
                          placeholder="열람 시 사용할 암호를 입력하세요"
                          style={{ ...inputStyle, border: '1px solid rgba(239,68,68,0.3)' }} />
                        <p style={{ fontSize: 11, color: 'rgba(239,68,68,0.6)', marginTop: 6 }}>
                          ⚠️ 암호는 안전하게 보관하세요. 암호 없이는 열람할 수 없습니다.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 첨부파일 */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <label style={labelStyle}>첨부파일 ({editPost.attachments.length}/5)</label>
                    {editPost.attachments.length < 5 && (
                      <CloudinaryUpload label="파일 추가" folder="led-attachments"
                        onSuccess={url => setEditPost({ ...editPost, attachments: [...editPost.attachments, { name: url.split('/').pop() || 'file', url }] })} />
                    )}
                  </div>
                  {editPost.attachments.map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', padding: '8px 14px', borderRadius: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>📎 {f.name}</span>
                      <button onClick={() => { const a = [...editPost.attachments]; a.splice(i, 1); setEditPost({ ...editPost, attachments: a }); }}
                        style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>삭제</button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleSavePost} disabled={loading}
                    style={{ padding: '11px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                    {loading ? '저장 중...' : '💾 저장하기'}
                  </button>
                  <button onClick={() => setEditPost(null)}
                    style={{ padding: '11px 24px', background: 'transparent', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer' }}>취소</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {posts.filter(p => p.type === tab).map(post => (
                  <div key={post.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'rgba(255,255,255,0.025)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                      {post.cover_image && <img src={post.cover_image} style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} alt="" />}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                          {post.is_locked && <span style={{ fontSize: 13 }}>🔒</span>}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                          {new Date(post.created_at!).toLocaleDateString('ko-KR')} · {post.author}
                          {post.attachments?.length > 0 && ` · 첨부 ${post.attachments.length}개`}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => setEditPost(post)} style={{ padding: '7px 14px', background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>수정</button>
                      <button onClick={() => handleDeletePost(post.id!)} style={{ padding: '7px 12px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>삭제</button>
                    </div>
                  </div>
                ))}
                {posts.filter(p => p.type === tab).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                    아직 글이 없습니다
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─────── 사이트 설정 ─────── */}
        {tab === 'settings' && settings && (
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900 }}>⚙️ 사이트 설정</h1>
              <button onClick={handleSaveSettings} disabled={loading}
                style={{ padding: '11px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                {loading ? '저장 중...' : '💾 설정 저장'}
              </button>
            </div>

            {/* 사이트 기본 정보 */}
            <div style={sectionCard}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa', marginBottom: 6, textTransform: 'uppercase' }}>🌐 사이트 기본 정보</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 18 }}>브라우저 탭 제목과 파비콘(아이콘)을 설정합니다</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>사이트 이름 (브라우저 탭 제목)</label>
                  <input value={settings.site?.site_name || ''} onChange={e => setSettings({ ...settings, site: { ...settings.site, site_name: e.target.value } })} placeholder="(주)와이앤케이 YNK" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>사이트 설명 (SEO)</label>
                  <input value={settings.site?.description || ''} onChange={e => setSettings({ ...settings, site: { ...settings.site, description: e.target.value } })} placeholder="YNK LED 조명 전문기업" style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>로고 이미지 URL (파비콘 / 탭 아이콘)</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input value={settings.site?.logo_url || ''} onChange={e => setSettings({ ...settings, site: { ...settings.site, logo_url: e.target.value } })} placeholder="https://... (PNG, SVG, ICO 권장)" style={{ ...inputStyle, flex: 1 }} />
                    <CloudinaryUpload label="로고 업로드" folder="ynk-logo" onSuccess={url => setSettings({ ...settings, site: { ...settings.site, logo_url: url } })} />
                  </div>
                  {settings.site?.logo_url && (
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={settings.site.logo_url} alt="logo preview" style={{ width: 40, height: 40, objectFit: 'contain', background: '#fff', borderRadius: 6, padding: 4 }} />
                      <span style={{ fontSize: 11, color: '#60a5fa', wordBreak: 'break-all' }}>✅ {settings.site.logo_url}</span>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(167,139,250,0.08)', borderRadius: 8, border: '1px solid rgba(167,139,250,0.2)', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
                💡 저장 후 페이지 새로고침 시 브라우저 탭에 반영됩니다. 로고는 정사각형 이미지(PNG/SVG)를 권장합니다.
              </div>
            </div>

            <div style={sectionCard}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#60a5fa', marginBottom: 20, textTransform: 'uppercase' }}>🏢 회사 정보</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  ['회사명', 'name'], ['사업자번호', 'business_id'],
                  ['전화번호', 'tel'], ['팩스번호', 'fax'], ['이메일', 'email'],
                ].map(([label, key]) => (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <label style={labelStyle}>{label}</label>
                    <input value={(settings.company as any)[key] || ''} onChange={e => setSettings({ ...settings, company: { ...settings.company, [key]: e.target.value } })} style={inputStyle} />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>주소</label>
                  <input value={settings.company.address || ''} onChange={e => setSettings({ ...settings, company: { ...settings.company, address: e.target.value } })} style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>회사 소개문</label>
                  <textarea value={settings.company.about_text || ''} onChange={e => setSettings({ ...settings, company: { ...settings.company, about_text: e.target.value } })} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#10b981', marginBottom: 6, textTransform: 'uppercase' }}>📥 회사소개서</h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>업로드 시 회사소개 페이지 다운로드 버튼과 연동됩니다</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <input value={brochureUrl} onChange={e => setBrochureUrl(e.target.value)} placeholder="URL 직접 입력 또는 아래 업로드" style={{ ...inputStyle, flex: 1, minWidth: 260 }} />
                <CloudinaryUpload label="PDF 업로드" folder="led-brochure" onSuccess={url => setBrochureUrl(url)} />
              </div>
              {brochureUrl && <div style={{ marginTop: 10, fontSize: 11, color: '#60a5fa', wordBreak: 'break-all' }}>✅ {brochureUrl}</div>}
            </div>

            <div style={sectionCard}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b', marginBottom: 20, textTransform: 'uppercase' }}>🗺️ 메뉴 이름</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {settings.menus?.map((menu, i) => (
                  <div key={i}>
                    <label style={{ ...labelStyle, color: 'rgba(255,255,255,0.25)' }}>{menu.href}</label>
                    <input value={menu.label} onChange={e => { const m = [...settings.menus]; m[i] = { ...m[i], label: e.target.value }; setSettings({ ...settings, menus: m }); }} style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18) !important; }
        input:focus, textarea:focus, select:focus { outline: none; border-color: rgba(59,130,246,0.5) !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.08); }
        select option { background: #1e293b; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </main>
  );
}
