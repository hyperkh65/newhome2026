'use client';
import { useState, useEffect, useCallback } from 'react';

interface Terminal {
  code: string; name: string; status: string; label: string; level: string; updatedAt?: string;
}
interface PortData {
  level: 'smooth' | 'normal' | 'busy' | 'very_busy';
  terminals: Terminal[];
  updatedAt: string;
  demo?: boolean;
}

const LV = {
  smooth:   { label: '원활',    color: '#34d399', bg: 'rgba(52,211,153,0.12)',  icon: '🟢' },
  normal:   { label: '보통',    color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  icon: '🔵' },
  busy:     { label: '혼잡',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '🟡' },
  very_busy:{ label: '매우혼잡', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: '🔴' },
};

const STATUS_COLOR: Record<string, string> = {
  A: '#34d399', B: '#60a5fa', C: '#f59e0b', D: '#ef4444',
};

export default function PortCongestionWidget() {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<PortData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/port');
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { setError('데이터 로드 실패'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const lv = data ? LV[data.level] : null;

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} title="인천항 혼잡도"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 900,
          width: 52, height: 52, borderRadius: '50%',
          background: lv ? lv.bg : 'rgba(14,165,233,0.15)',
          border: `2px solid ${lv ? lv.color : '#0ea5e9'}`,
          cursor: 'pointer', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)', transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {lv ? lv.icon : '🚢'}
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 900, width: 300,
      background: 'rgba(10,10,14,0.95)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20,
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)', color: '#fff', fontFamily: 'inherit',
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🚢</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0ea5e9' }}>인천항 터미널 혼잡도</div>
            {!data?.demo && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>인천항만공사 실시간</div>}
          </div>
        </div>
        <button onClick={() => setOpen(false)}
          style={{ background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', width: 26, height: 26, borderRadius: '50%', color: 'rgba(255,255,255,0.5)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >✕</button>
      </div>

      {/* 바디 */}
      <div style={{ padding: '14px 16px 16px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '28px 0', color: 'rgba(255,255,255,0.35)' }}>
            <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.08)', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'pcw-spin 0.8s linear infinite', margin: '0 auto 10px' }} />
            <style>{`@keyframes pcw-spin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize: 12 }}>조회 중...</span>
          </div>
        )}

        {!loading && (error || !data) && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#f87171' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
            <div style={{ fontSize: 12, marginBottom: 12 }}>{error || '데이터 없음'}</div>
            <button onClick={fetchData} style={{ padding: '7px 14px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>재시도</button>
          </div>
        )}

        {!loading && data && lv && (
          <>
            {/* 전체 상태 */}
            <div style={{ background: lv.bg, borderRadius: 14, padding: '12px 16px', border: `1px solid ${lv.color}30`, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{lv.icon}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: lv.color }}>{lv.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>인천항 전체 혼잡도</div>
              </div>
              {data.demo && <div style={{ marginLeft: 'auto', fontSize: 9, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', padding: '3px 7px', borderRadius: 6 }}>추정값</div>}
            </div>

            {/* 터미널별 현황 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 }}>터미널별 현황</div>
              {data.terminals.map((t) => (
                <div key={t.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                    {t.updatedAt && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{t.updatedAt} 기준</div>}
                  </div>
                  <span style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 6, fontWeight: 700, flexShrink: 0, marginLeft: 8,
                    color: STATUS_COLOR[t.status] ?? '#60a5fa',
                    background: `${STATUS_COLOR[t.status] ?? '#60a5fa'}18`,
                    border: `1px solid ${STATUS_COLOR[t.status] ?? '#60a5fa'}30`,
                  }}>{t.label}</span>
                </div>
              ))}
            </div>

            {/* 푸터 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>업데이트 {data.updatedAt}</span>
              <button onClick={fetchData} style={{ padding: '4px 10px', background: 'rgba(14,165,233,0.1)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 6, cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>🔄 새로고침</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
