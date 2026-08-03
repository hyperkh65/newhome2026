'use client';

import { useState, useEffect, useCallback } from 'react';

// ── 스펙 필드 정의 ────────────────────────────────────────────────────────────
const SPEC_GROUPS = [
  {
    label: '전기 특성',
    color: '#3b82f6',
    fields: [
      { key: 'power',         label: '소비전력',      unit: 'W',   placeholder: '예) 9' },
      { key: 'input_voltage', label: '입력전압',      unit: 'V',   placeholder: '예) 220-240' },
      { key: 'power_factor',  label: '역률(PF)',      unit: '',    placeholder: '예) 0.5' },
      { key: 'thd',           label: 'THD',           unit: '%',   placeholder: '예) <20' },
    ],
  },
  {
    label: '광학 특성',
    color: '#f59e0b',
    fields: [
      { key: 'luminous_flux', label: '광속',          unit: 'lm',  placeholder: '예) 990' },
      { key: 'efficacy',      label: '광효율',        unit: 'lm/W',placeholder: '예) 110' },
      { key: 'cct',           label: '색온도 옵션',   unit: '',    placeholder: '예) 3000K/4000K/6500K' },
      { key: 'color_temp',    label: '색온도(대표)',  unit: 'K',   placeholder: '예) 4000' },
      { key: 'cri',           label: 'CRI (Ra)',      unit: '',    placeholder: '예) ≥80' },
      { key: 'beam_angle',    label: '빔각',          unit: '°',   placeholder: '예) 120' },
      { key: 'flux_tolerance',label: '광속 오차',     unit: '',    placeholder: '예) ±5%' },
    ],
  },
  {
    label: 'LED 칩',
    color: '#8b5cf6',
    fields: [
      { key: 'chip_type',     label: '칩 종류',       unit: '',    placeholder: '예) 2835' },
      { key: 'chip_qty',      label: '칩 수량',       unit: '개',  placeholder: '예) 54' },
    ],
  },
  {
    label: '구조/소재',
    color: '#10b981',
    fields: [
      { key: 'product_type',  label: '제품 타입',     unit: '',    placeholder: '예) T3' },
      { key: 'size',          label: '외형 크기',     unit: 'mm',  placeholder: '예) 575×35×22' },
      { key: 'weight',        label: '중량',          unit: 'g',   placeholder: '예) 120' },
      { key: 'material',      label: '소재',          unit: '',    placeholder: '예) PC' },
      { key: 'body_color',    label: '바디 색상',     unit: '',    placeholder: '예) 화이트' },
      { key: 'connection_type',label: '접속 방식',    unit: '',    placeholder: '예) G13, 직결식' },
    ],
  },
  {
    label: '환경/안전',
    color: '#ef4444',
    fields: [
      { key: 'ip_rating',     label: 'IP 등급',       unit: '',    placeholder: '예) IP20' },
      { key: 'operating_temp',label: '동작 온도',     unit: '',    placeholder: '예) -20~40°C' },
      { key: 'dimming',       label: '디밍',          unit: '',    placeholder: '예) 불가 / 0-10V' },
    ],
  },
  {
    label: '수명/보증',
    color: '#06b6d4',
    fields: [
      { key: 'lifespan',         label: '수명',        unit: 'h',   placeholder: '예) 30000' },
      { key: 'warranty',         label: '보증 기간',   unit: '',    placeholder: '예) 2년' },
      { key: 'switching_cycles', label: '스위칭 횟수', unit: '',    placeholder: '예) 10,000회' },
    ],
  },
  {
    label: '드라이버',
    color: '#f97316',
    fields: [
      { key: 'driver',       label: '드라이버 타입',  unit: '',    placeholder: '예) 내장형 constant current' },
      { key: 'driver_brand', label: '드라이버 브랜드',unit: '',    placeholder: '예) 자체생산' },
    ],
  },
  {
    label: '포장/물류',
    color: '#84cc16',
    fields: [
      { key: 'pcs_per_carton',  label: '박스당 수량',  unit: '개', placeholder: '예) 30' },
      { key: 'gift_box_size',   label: '낱개 박스 크기',unit: 'mm',placeholder: '예) 610×50×40' },
      { key: 'carton_size',     label: '외박스 크기',  unit: 'mm', placeholder: '예) 640×340×280' },
      { key: 'packaging_type',  label: '포장 방식',   unit: '',   placeholder: '예) 개별 컬러박스' },
    ],
  },
  {
    label: '구매/공급',
    color: '#ec4899',
    fields: [
      { key: 'moq',          label: 'MOQ',            unit: '개', placeholder: '예) 5000' },
      { key: 'lead_time',    label: '납기',           unit: '',   placeholder: '예) 30~45일' },
      { key: 'supplier',     label: '제조사',         unit: '',   placeholder: '예) 중국 OEM' },
      { key: 'supplier_code',label: '공급사 코드',    unit: '',   placeholder: '예) T3-9W-PC' },
      { key: 'certification',label: '인증',           unit: '',   placeholder: '예) KC, RoHS' },
    ],
  },
];

const ALL_SPEC_KEYS = SPEC_GROUPS.flatMap(g => g.fields.map(f => f.key));

// ── T3 시드 데이터 ────────────────────────────────────────────────────────────
const T3_SEED_PRODUCTS = [
  {
    name: 'T3 LED 튜브 5W',
    category: 'indoor',
    description: 'T3 LED 형광등 대체 튜브. 5W 저전력 고효율 실내조명.',
    badge: 'KC',
    manufacturer: 'YNK',
    specs: {
      product_type: 'T3', power: '5', input_voltage: '220-240', power_factor: '0.5',
      efficacy: '110', cct: '3000K/3500K/4000K/6500K', cri: '≥80',
      chip_type: '2835', chip_qty: '28',
      size: '300×35×22', material: 'PC',
      lifespan: '30000', warranty: '2년',
      moq: '5000', certification: 'KC',
    },
  },
  {
    name: 'T3 LED 튜브 7W',
    category: 'indoor',
    description: 'T3 LED 형광등 대체 튜브. 7W 고효율 실내조명.',
    badge: 'KC',
    manufacturer: 'YNK',
    specs: {
      product_type: 'T3', power: '7', input_voltage: '220-240', power_factor: '0.5',
      efficacy: '110', cct: '3000K/3500K/4000K/6500K', cri: '≥80',
      chip_type: '2835', chip_qty: '44',
      size: '375×35×22', material: 'PC',
      lifespan: '30000', warranty: '2년',
      moq: '5000', certification: 'KC',
    },
  },
  {
    name: 'T3 LED 튜브 9W',
    category: 'indoor',
    description: 'T3 LED 형광등 대체 튜브. 9W 고효율 실내조명.',
    badge: 'KC',
    manufacturer: 'YNK',
    specs: {
      product_type: 'T3', power: '9', input_voltage: '220-240', power_factor: '0.5',
      efficacy: '110', cct: '3000K/3500K/4000K/6500K', cri: '≥80',
      chip_type: '2835', chip_qty: '54',
      size: '575×35×22', material: 'PC',
      lifespan: '30000', warranty: '2년',
      moq: '5000', certification: 'KC',
    },
  },
  {
    name: 'T3 LED 튜브 14W',
    category: 'indoor',
    description: 'T3 LED 형광등 대체 튜브. 14W 고효율 실내조명.',
    badge: 'KC',
    manufacturer: 'YNK',
    specs: {
      product_type: 'T3', power: '14', input_voltage: '220-240', power_factor: '0.5',
      efficacy: '110', cct: '3000K/3500K/4000K/6500K', cri: '≥80',
      chip_type: '2835', chip_qty: '82',
      size: '875×35×22', material: 'PC',
      lifespan: '30000', warranty: '2년',
      moq: '5000', certification: 'KC',
    },
  },
  {
    name: 'T3 LED 튜브 18W',
    category: 'indoor',
    description: 'T3 LED 형광등 대체 튜브. 18W 고효율 실내조명.',
    badge: 'KC',
    manufacturer: 'YNK',
    specs: {
      product_type: 'T3', power: '18', input_voltage: '220-240', power_factor: '0.5',
      efficacy: '110', cct: '3000K/3500K/4000K/6500K', cri: '≥80',
      chip_type: '2835', chip_qty: '108',
      size: '1175×35×22', material: 'PC',
      lifespan: '30000', warranty: '2년',
      moq: '5000', certification: 'KC',
    },
  },
];

// ── 타입 ──────────────────────────────────────────────────────────────────────
type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  manufacturer?: string;
  badge?: string;
  specs: Record<string, string>;
  featured?: boolean;
  created_at?: string;
};

type FormData = Omit<Product, 'id' | 'created_at'>;

const emptyForm = (): FormData => ({
  name: '', category: 'indoor', description: '', manufacturer: 'YNK', badge: '',
  specs: {}, featured: false,
});

// ── 스타일 ────────────────────────────────────────────────────────────────────
const s = {
  page: { minHeight: '100vh', background: '#0a0f1a', color: '#e2e8f0', fontFamily: 'system-ui,sans-serif' } as React.CSSProperties,
  header: { background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const },
  h1: { margin: 0, fontSize: 22, fontWeight: 800, color: '#f1f5f9' },
  sub: { margin: '4px 0 0', color: '#64748b', fontSize: 13 },
  body: { padding: '24px 32px', maxWidth: 1600, margin: '0 auto' },
  btnPrimary: { padding: '9px 20px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  btnGhost: { padding: '9px 20px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
  btnDanger: { padding: '6px 14px', background: '#7f1d1d22', color: '#f87171', border: '1px solid #7f1d1d44', borderRadius: 6, fontSize: 12, cursor: 'pointer' },
  btnEdit: { padding: '6px 14px', background: '#1e3a5f', color: '#38bdf8', border: '1px solid #1e40af44', borderRadius: 6, fontSize: 12, cursor: 'pointer' },
  card: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20 },
  input: { width: '100%', padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
  label: { fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4, display: 'block', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  tag: (color: string) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: color + '22', color }),
  specVal: { fontSize: 13, color: '#f1f5f9', fontWeight: 600 },
  specLabel: { fontSize: 11, color: '#64748b', marginBottom: 2 },
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' as const },
  modal: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16, padding: 32, width: '100%', maxWidth: 900, position: 'relative' as const },
};

// ── 제품 행 컴포넌트 ──────────────────────────────────────────────────────────
function ProductRow({ product, onEdit, onDelete }: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const specCount = Object.values(product.specs ?? {}).filter(v => v).length;
  const totalSpecCount = ALL_SPEC_KEYS.length;

  return (
    <>
      <tr
        style={{ borderBottom: '1px solid #1e293b', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <td style={{ padding: '12px 16px' }}>
          <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>{product.name}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{product.manufacturer}</div>
        </td>
        <td style={{ padding: '12px 16px' }}>
          <span style={s.tag('#0ea5e9')}>{product.category}</span>
        </td>
        <td style={{ padding: '12px 16px' }}>
          {product.badge && <span style={s.tag('#f59e0b')}>{product.badge}</span>}
        </td>
        <td style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, background: '#1e293b', borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <div style={{ width: `${(specCount / totalSpecCount) * 100}%`, background: specCount > 20 ? '#22c55e' : specCount > 10 ? '#f59e0b' : '#ef4444', height: '100%', transition: 'width .3s' }} />
            </div>
            <span style={{ fontSize: 12, color: '#64748b', minWidth: 48 }}>{specCount}/{totalSpecCount}</span>
          </div>
        </td>
        <td style={{ padding: '12px 16px', fontSize: 12, color: '#475569' }}>
          {product.created_at ? new Date(product.created_at).toLocaleDateString('ko') : '-'}
        </td>
        <td style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
            <button style={s.btnEdit} onClick={() => onEdit(product)}>편집</button>
            <button style={s.btnDanger} onClick={() => { if (confirm('삭제하시겠습니까?')) onDelete(product.id); }}>삭제</button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr style={{ background: '#080e19' }}>
          <td colSpan={6} style={{ padding: '0 16px 16px' }}>
            <div style={{ display: 'grid', gap: 16, paddingTop: 16 }}>
              {SPEC_GROUPS.map(group => {
                const groupSpecs = group.fields.filter(f => product.specs?.[f.key]);
                if (!groupSpecs.length) return null;
                return (
                  <div key={group.label}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: group.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{group.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                      {groupSpecs.map(f => (
                        <div key={f.key} style={{ background: '#0f172a', border: `1px solid ${group.color}22`, borderRadius: 8, padding: '8px 12px' }}>
                          <div style={s.specLabel}>{f.label}</div>
                          <div style={s.specVal}>{product.specs[f.key]}{f.unit ? ' ' + f.unit : ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {!Object.keys(product.specs ?? {}).length && (
                <div style={{ color: '#475569', fontSize: 13 }}>스펙 데이터 없음 — 편집으로 추가하세요</div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── 제품 폼 모달 ──────────────────────────────────────────────────────────────
function ProductFormModal({ initial, onSave, onClose, saving }: {
  initial: FormData;
  onSave: (data: FormData) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [activeGroup, setActiveGroup] = useState(SPEC_GROUPS[0].label);

  const setSpec = (key: string, val: string) => {
    setForm(f => ({ ...f, specs: { ...f.specs, [key]: val } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={s.modal}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>
            {(initial as Product).id ? '제품 수정' : '제품 등록'}
          </h2>
          <button style={{ ...s.btnGhost, padding: '6px 12px' }} onClick={onClose}>닫기</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 기본 정보 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={s.label}>제품명 *</label>
              <input style={s.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="예) T3 LED 튜브 9W" />
            </div>
            <div>
              <label style={s.label}>카테고리 *</label>
              <select style={s.input} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['indoor','outdoor','commercial','industrial','smart','home_lighting','landscape','special'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={s.label}>제조사</label>
              <input style={s.input} value={form.manufacturer ?? ''} onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))} placeholder="예) YNK" />
            </div>
            <div>
              <label style={s.label}>배지 (인증 등)</label>
              <input style={s.input} value={form.badge ?? ''} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="예) KC" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={s.label}>설명 *</label>
              <textarea style={{ ...s.input, resize: 'vertical', minHeight: 72 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required placeholder="제품 설명을 입력하세요" />
            </div>
          </div>

          {/* 스펙 탭 */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>스펙 항목</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {SPEC_GROUPS.map(g => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setActiveGroup(g.label)}
                  style={{
                    padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: activeGroup === g.label ? g.color : '#1e293b',
                    color: activeGroup === g.label ? '#fff' : '#64748b',
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
            {SPEC_GROUPS.map(group => (
              <div key={group.label} style={{ display: activeGroup === group.label ? 'grid' : 'none', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {group.fields.map(f => (
                  <div key={f.key}>
                    <label style={{ ...s.label, color: group.color }}>
                      {f.label}{f.unit ? ` (${f.unit})` : ''}
                    </label>
                    <input
                      style={s.input}
                      value={form.specs?.[f.key] ?? ''}
                      onChange={e => setSpec(f.key, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid #1e293b' }}>
            <button type="button" style={s.btnGhost} onClick={onClose}>취소</button>
            <button type="submit" style={s.btnPrimary} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminPw, setAdminPw] = useState('');
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [seedingT3, setSeedingT3] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('');

  const loadProducts = useCallback(async (pw: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      setError('제품 목록 로드 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = () => {
    const stored = (window as unknown as Record<string, unknown>).__NEXT_DATA__;
    // Try the input password directly via an auth test
    setAdminPw(pwInput);
    setAuthed(true);
    loadProducts(pwInput);
  };

  const apiHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'x-admin-token': adminPw,
  }), [adminPw]);

  const handleSave = async (data: FormData) => {
    setSaving(true);
    setError('');
    try {
      if ((editTarget as Product)?.id) {
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: apiHeaders(),
          body: JSON.stringify({ ...data, id: (editTarget as Product).id }),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error || '수정 실패'); return; }
        setProducts(ps => ps.map(p => p.id === (editTarget as Product).id ? json.product : p));
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: apiHeaders(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error || '등록 실패'); return; }
        setProducts(ps => [json.product, ...ps]);
      }
      setShowForm(false);
      setEditTarget(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/products?id=${id}`, {
      method: 'DELETE',
      headers: apiHeaders(),
    });
    if (res.ok) {
      setProducts(ps => ps.filter(p => p.id !== id));
    } else {
      setError('삭제 실패');
    }
  };

  const handleSeedT3 = async () => {
    setSeedingT3(true);
    setError('');
    let successCount = 0;
    for (const seed of T3_SEED_PRODUCTS) {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify(seed),
      });
      if (res.ok) {
        const json = await res.json();
        setProducts(ps => [json.product, ...ps]);
        successCount++;
      }
    }
    setSeedingT3(false);
    if (successCount < T3_SEED_PRODUCTS.length) {
      setError(`T3 등록: ${successCount}/${T3_SEED_PRODUCTS.length} 성공 (나머지는 관리자 비밀번호를 확인하세요)`);
    }
  };

  const filteredProducts = products.filter(p => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterType && p.specs?.product_type !== filterType) return false;
    return true;
  });

  const specCompletion = (p: Product) => {
    const filled = ALL_SPEC_KEYS.filter(k => p.specs?.[k]).length;
    return Math.round((filled / ALL_SPEC_KEYS.length) * 100);
  };

  const avgCompletion = products.length
    ? Math.round(products.reduce((s, p) => s + specCompletion(p), 0) / products.length)
    : 0;

  // ── 로그인 화면 ────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...s.card, width: 360 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>제품 관리 로그인</h2>
          <label style={s.label}>관리자 비밀번호</label>
          <input
            type="password"
            style={{ ...s.input, marginBottom: 16 }}
            value={pwInput}
            onChange={e => setPwInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="관리자 비밀번호 입력"
          />
          <button style={{ ...s.btnPrimary, width: '100%' }} onClick={handleLogin}>로그인</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* 헤더 */}
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>제품 관리</h1>
          <p style={s.sub}>총 {products.length}개 제품 · 평균 스펙 완성도 {avgCompletion}% · 스펙 항목 {ALL_SPEC_KEYS.length}개</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            style={{ ...s.btnGhost, borderColor: '#22c55e44', color: '#22c55e' }}
            onClick={handleSeedT3}
            disabled={seedingT3}
          >
            {seedingT3 ? 'T3 등록 중...' : 'T3 제품 5개 등록'}
          </button>
          <button style={s.btnPrimary} onClick={() => { setEditTarget(null); setShowForm(true); }}>
            + 제품 추가
          </button>
        </div>
      </div>

      <div style={s.body}>
        {error && (
          <div style={{ background: '#7f1d1d22', border: '1px solid #7f1d1d44', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* 통계 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: '전체 제품', value: products.length, color: '#0ea5e9' },
            { label: '실내조명', value: products.filter(p => p.category === 'indoor').length, color: '#8b5cf6' },
            { label: '스펙 완성도', value: `${avgCompletion}%`, color: avgCompletion > 70 ? '#22c55e' : avgCompletion > 40 ? '#f59e0b' : '#ef4444' },
            { label: 'T3 튜브', value: products.filter(p => p.specs?.product_type === 'T3').length, color: '#f59e0b' },
          ].map(stat => (
            <div key={stat.label} style={{ ...s.card, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 필터 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <select
            style={{ ...s.input, width: 'auto', flex: '0 0 auto' }}
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="all">전체 카테고리</option>
            {['indoor','outdoor','commercial','industrial','smart','home_lighting','landscape','special'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            style={{ ...s.input, width: 160, flex: '0 0 auto' }}
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            placeholder="제품 타입 (T3, T5...)"
          />
          <span style={{ color: '#475569', fontSize: 13, alignSelf: 'center' }}>
            {filteredProducts.length}개 표시 중
          </span>
        </div>

        {/* 제품 테이블 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>로드 중...</div>
        ) : (
          <div style={{ ...s.card, padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#080e19', borderBottom: '1px solid #1e293b' }}>
                  {['제품명', '카테고리', '인증', '스펙 완성도', '등록일', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', color: '#475569', fontSize: 14 }}>
                    제품이 없습니다. 위 버튼으로 T3 제품을 등록하거나 직접 추가하세요.
                  </td></tr>
                )}
                {filteredProducts.map(p => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    onEdit={product => { setEditTarget(product); setShowForm(true); }}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 스펙 가이드 */}
        <div style={{ ...s.card, marginTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 16 }}>스펙 항목 가이드 ({ALL_SPEC_KEYS.length}개)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {SPEC_GROUPS.map(group => (
              <div key={group.label} style={{ border: `1px solid ${group.color}33`, borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: group.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{group.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {group.fields.map(f => (
                    <span key={f.key} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, background: '#1e293b', color: '#94a3b8' }}>{f.label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 폼 모달 */}
      {showForm && (
        <ProductFormModal
          initial={editTarget ? { ...editTarget } : emptyForm()}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          saving={saving}
        />
      )}
    </div>
  );
}
