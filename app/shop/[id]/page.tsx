'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useShopStore } from '@/lib/store';
import { ScrollReveal } from '@/components/LuminaAnimation';
import { supabase } from '@/lib/supabase';

const CATEGORIES: Record<string, { label: string; icon: string }> = {
  smart: { label: '스마트조명', icon: '☁️' },
  indoor: { label: '실내조명', icon: '🏢' },
  home_lighting: { label: '홈조명', icon: '🏠' },
  commercial: { label: '상업조명', icon: '🏪' },
  industrial: { label: '산업조명', icon: '🏗️' },
  outdoor: { label: '실외조명', icon: '🏭' },
  landscape: { label: '경관조명', icon: '🌉' },
  special: { label: '특수조명', icon: '🔬' },
};

const SPEC_META: Record<string, { label: string; icon: string; unit: string }> = {
  power:         { label: '소비전력',     icon: '⚡', unit: 'W' },
  luminous_flux: { label: '광속',        icon: '💡', unit: 'lm' },
  efficacy:      { label: '광효율',      icon: '✨', unit: 'lm/W' },
  color_temp:    { label: '색온도',      icon: '🌡', unit: 'K' },
  cri:           { label: '연색지수',    icon: '🎨', unit: 'CRI Ra' },
  beam_angle:    { label: '배광각',      icon: '📐', unit: '°' },
  ip_rating:     { label: 'IP 등급',    icon: '🛡️', unit: '' },
  input_voltage: { label: '입력전압',    icon: '🔌', unit: 'V' },
  power_factor:  { label: '역률',       icon: '📊', unit: 'PF' },
  thd:           { label: 'THD',        icon: '〰️', unit: '%' },
  lifespan:      { label: '수명',        icon: '⏱️', unit: 'hrs' },
  size:          { label: '제품 크기',   icon: '📏', unit: 'mm' },
  weight:        { label: '중량',        icon: '⚖️', unit: 'kg' },
  operating_temp:{ label: '작동온도',    icon: '🌡️', unit: '°C' },
  warranty:      { label: '보증기간',    icon: '🛡', unit: '' },
  driver:        { label: '드라이버',    icon: '🔧', unit: '' },
};

const DOC_ICONS: Record<string, string> = {
  datasheet: '📊', manual: '📖', cert: '📜', drawing: '📐', other: '📄',
};
const DOC_LABELS: Record<string, string> = {
  datasheet: '데이터시트', manual: '설치 매뉴얼', cert: '인증서', drawing: '도면/CAD', other: '문서',
};

function SpecBadge({ value }: { value: string }) {
  if (value === 'N/A') return (
    <span style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>해당없음</span>
  );
  if (value === 'TBD') return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#d97706', fontWeight: 700 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
      별도확인
    </span>
  );
  return <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{value}</span>;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [mainImg, setMainImg]   = useState(0);
  const toggleWishlist = useShopStore(s => s.toggleWishlist);
  const wishlist       = useShopStore(s => s.wishlist);

  useEffect(() => {
    async function load() {
      const { data: prod } = await supabase.from('products').select('*').eq('id', id).single();
      if (prod) {
        setProduct(prod);
        const { data: rel } = await supabase.from('products').select('*')
          .eq('category', prod.category).neq('id', id).limit(3);
        if (rel) setRelated(rel);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, border: '3px solid #e2e8f0', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: '#94a3b8' }}>제품 정보 로딩 중...</p>
      </div>
    </div>
  );

  if (!product) return (
    <main style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: 80 }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🔍</div>
        <h1 style={{ fontSize: 28, color: '#0f172a', marginBottom: 16 }}>제품을 찾을 수 없습니다</h1>
        <Link href="/shop" style={{ padding: '12px 28px', background: '#0ea5e9', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>제품 목록으로</Link>
      </div>
    </main>
  );

  const isWished = wishlist.includes(product.id);
  const cat = CATEGORIES[product.category] ?? { label: product.category, icon: '💡' };

  // 이미지 배열 (images[] 우선, 없으면 image 단일)
  const images: string[] = (product.images?.length > 0 ? product.images : (product.image ? [product.image] : [])).filter(Boolean);

  // 스펙 — 빈 값 제외
  const specs: Record<string, string> = product.specs || {};
  const specEntries = Object.entries(specs).filter(([, v]) => v !== '' && v != null);

  // 문서
  const documents: { name: string; url: string; type: string }[] = product.documents || [];

  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <Navbar />

      {/* 브레드크럼 */}
      <div style={{ paddingTop: 80, background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
          <span>›</span>
          <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>제품소개</Link>
          <span>›</span>
          <Link href={`/shop?cat=${product.category}`} style={{ color: 'inherit', textDecoration: 'none' }}>{cat.icon} {cat.label}</Link>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{product.name}</span>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'flex-start' }}>

          {/* ── 왼쪽: 이미지 갤러리 ── */}
          <div style={{ position: 'sticky', top: 96 }}>
            {/* 메인 이미지 */}
            <div style={{ borderRadius: 24, overflow: 'hidden', background: '#fff', aspectRatio: '1', position: 'relative', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', marginBottom: 12 }}>
              {images.length > 0 ? (
                <img src={images[mainImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12 }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, color: '#e2e8f0' }}>💡</div>
              )}
              {product.badge && (
                <div style={{ position: 'absolute', top: 16, left: 16, padding: '6px 14px', borderRadius: 8, background: '#0f172a', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
                  {product.badge}
                </div>
              )}
              {product.featured && (
                <div style={{ position: 'absolute', top: 16, right: 16, padding: '6px 12px', borderRadius: 8, background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                  ⭐ 추천제품
                </div>
              )}
            </div>

            {/* 썸네일 스트립 */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((url, i) => (
                  <button key={i} onClick={() => setMainImg(i)}
                    style={{ width: 68, height: 68, borderRadius: 12, overflow: 'hidden', border: `2px solid ${mainImg === i ? '#0ea5e9' : '#e2e8f0'}`, cursor: 'pointer', background: '#fff', padding: 0, transition: 'all 0.15s' }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── 오른쪽: 제품 정보 ── */}
          <ScrollReveal direction="right">
            <div>
              {/* 카테고리 + 위시리스트 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e0f2fe', color: '#0369a1', padding: '5px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                  {cat.icon} {cat.label}
                </span>
                <button onClick={() => toggleWishlist(product.id)}
                  style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isWished ? '#ef4444' : '#94a3b8', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>

              {/* 제품명 */}
              <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, letterSpacing: -0.5, marginBottom: 16, lineHeight: 1.2, color: '#0f172a' }}>
                {product.name}
              </h1>

              {/* 제조사 */}
              {product.manufacturer && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '10px 16px', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', width: 'fit-content' }}>
                  <span style={{ fontSize: 18 }}>🇨🇳</span>
                  <div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>제조사</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>{product.manufacturer}</div>
                  </div>
                </div>
              )}

              {/* 설명 */}
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, marginBottom: 28, borderLeft: '3px solid #0ea5e9', paddingLeft: 16 }}>
                {product.description}
              </p>

              {/* ── 상세 스펙 ── */}
              {specEntries.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 3, height: 18, background: '#0ea5e9', borderRadius: 2 }} />
                    <h3 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#475569' }}>SPECIFICATION</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {specEntries.map(([key, value]) => {
                      const meta = SPEC_META[key] || { label: key, icon: '•', unit: '' };
                      return (
                        <div key={key} style={{ padding: '13px 16px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 18, lineHeight: 1 }}>{meta.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>
                              {meta.label}
                            </div>
                            <SpecBadge value={value} />
                            {value !== 'N/A' && value !== 'TBD' && meta.unit && (
                              <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>{meta.unit}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── 자료 다운로드 ── */}
              {documents.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 3, height: 18, background: '#10b981', borderRadius: 2 }} />
                    <h3 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#475569' }}>자료 다운로드</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {documents.map((doc, i) => (
                      <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" download
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0ea5e9'; (e.currentTarget as HTMLAnchorElement).style.background = '#f0f9ff'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLAnchorElement).style.background = '#fff'; }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                          {DOC_ICONS[doc.type] || '📄'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{doc.name}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{DOC_LABELS[doc.type] || '문서'}</div>
                        </div>
                        <div style={{ fontSize: 12, color: '#0ea5e9', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          ↓ 다운로드
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 문의 버튼 ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/board?type=inquiry" style={{ display: 'block', padding: '16px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff', borderRadius: 14, fontWeight: 800, fontSize: 15, textAlign: 'center', textDecoration: 'none', boxShadow: '0 8px 24px rgba(14,165,233,0.3)', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.transform = 'none'}>
                  📩 제품 문의하기
                </Link>
                <a href={`mailto:contact@ynk.co.kr?subject=${encodeURIComponent('[제품문의] ' + product.name)}`}
                  style={{ display: 'block', padding: '14px', background: '#fff', color: '#334155', border: '1px solid #e2e8f0', borderRadius: 14, fontWeight: 700, fontSize: 14, textAlign: 'center', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#f8fafc'}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = '#fff'}>
                  📧 이메일로 문의
                </a>
              </div>

              {/* 안내 */}
              <div style={{ marginTop: 20, padding: '14px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
                💬 이 제품은 B2B 소개 페이지입니다. 가격 및 납기 조건은 문의를 통해 별도 안내드립니다.
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* ── 연관 제품 ── */}
      {related.length > 0 && (
        <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '64px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 32, color: '#0f172a' }}>
              {cat.icon} 같은 카테고리 제품
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {related.map((p, i) => {
                const pImg = p.images?.[0] || p.image;
                return (
                  <ScrollReveal key={p.id} delay={i * 80}>
                    <Link href={`/shop/${p.id}`} style={{ display: 'block', textDecoration: 'none', background: '#f8fafc', borderRadius: 18, overflow: 'hidden', border: '1px solid #e2e8f0', transition: 'all 0.25s', color: '#0f172a' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'none'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}>
                      <div style={{ height: 180, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {pImg ? <img src={pImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} /> : <span style={{ fontSize: 40, color: '#e2e8f0' }}>💡</span>}
                      </div>
                      <div style={{ padding: '16px 18px' }}>
                        {p.manufacturer && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>🇨🇳 {p.manufacturer}</div>}
                        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#0ea5e9', fontWeight: 600 }}>자세히 보기 →</div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
