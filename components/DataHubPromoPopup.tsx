'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Banner {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  link_url: string;
  link_text: string;
  is_active: boolean;
  hide_hours: number;
  stats: { value: string; label: string }[];
  position: string;
}

const FALLBACK: Banner = {
  id: 'datahub-fallback',
  eyebrow: 'YnK DATA HUB',
  title: '조달·민수 데이터 허브',
  description: '조달 등록 제품, 업체, 가격 흐름을 한 화면에서 검색해보세요.',
  link_url: 'https://data.ynk2014.com',
  link_text: '데이터 허브 바로가기',
  is_active: true,
  hide_hours: 24,
  stats: [
    { value: '13,062', label: '조달 제품' },
    { value: '1,059', label: '등록 업체' },
  ],
  position: 'bottom-right',
};

function storageKey(id: string) {
  return `ynk-banner-hide-${id}`;
}
function isHidden(id: string) {
  try {
    const v = localStorage.getItem(storageKey(id));
    return v ? Date.now() < Number(v) : false;
  } catch { return false; }
}
function hideFor(id: string, hours: number) {
  try { localStorage.setItem(storageKey(id), String(Date.now() + hours * 3600 * 1000)); } catch {}
}

function BannerCard({ b, onClose }: { b: Banner; onClose: () => void }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      border: '1px solid rgba(56,189,248,0.25)',
      borderRadius: 20,
      padding: '24px 22px 20px',
      width: 280,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
      position: 'relative',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 12, right: 14,
          background: 'rgba(255,255,255,0.06)', border: 'none',
          color: 'rgba(255,255,255,0.5)', width: 24, height: 24,
          borderRadius: '50%', cursor: 'pointer', fontSize: 15, lineHeight: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="닫기"
      >×</button>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14,
        padding: '4px 10px', background: 'rgba(56,189,248,0.12)',
        border: '1px solid rgba(56,189,248,0.3)', borderRadius: 20,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
        <span style={{ fontSize: 10, fontWeight: 800, color: '#38bdf8', letterSpacing: 1.5 }}>{b.eyebrow}</span>
      </div>

      <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 900, color: '#fff', lineHeight: 1.3 }}>{b.title}</h3>
      <p style={{ margin: '0 0 16px', fontSize: 12.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{b.description}</p>

      {b.stats && b.stats.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {b.stats.map((s, i) => (
            <div key={i} style={{
              flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 10,
              padding: '10px 8px', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#38bdf8', letterSpacing: -0.5 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <a
        href={b.link_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block', textAlign: 'center', padding: '11px',
          background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
          color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 800,
          textDecoration: 'none', marginBottom: 8,
          boxShadow: '0 4px 16px rgba(2,132,199,0.35)',
        }}
      >
        {b.link_text} →
      </a>

      <button
        onClick={() => { hideFor(b.id, b.hide_hours); onClose(); }}
        style={{
          display: 'block', width: '100%', background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.25)', fontSize: 11, cursor: 'pointer',
          textAlign: 'center', padding: '4px 0',
        }}
      >
        {b.hide_hours}시간 동안 보지 않기
      </button>
    </div>
  );
}

export default function DataHubPromoPopup() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 즉시 fallback 표시, DB 응답 오면 교체
    setBanners([FALLBACK]);
    (async () => {
      try {
        const { data } = await supabase.from('banners').select('*').eq('is_active', true)
          .order('created_at', { ascending: false });
        if (data && data.length > 0) setBanners(data as Banner[]);
      } catch {}
    })();
  }, []);

  if (!mounted) return null;

  const visible = banners.filter(b => !isHidden(b.id) && !closedIds.has(b.id));
  if (visible.length === 0) return null;

  const close = (id: string) => setClosedIds(prev => new Set([...prev, id]));

  return (
    <div style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 1200, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {visible.map(b => <BannerCard key={b.id} b={b} onClose={() => close(b.id)} />)}
    </div>
  );
}
