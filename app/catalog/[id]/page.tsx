'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Catalog {
  id: string; title: string; description: string; pdf_url: string;
  thumbnail: string; category: string; password: string; is_public: boolean;
  page_count: number; view_count: number; created_at: string;
}

type ViewMode = 'proxy' | 'google' | 'direct';

export default function CatalogViewer() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('proxy');
  const [proxyError, setProxyError] = useState('');

  useEffect(() => {
    fetch(`/api/catalogs/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { router.push('/catalog'); return; }
        setCatalog(d);
        if (!d.password) setUnlocked(true);
        setLoading(false);
        fetch(`/api/catalogs/${id}/view`, { method: 'POST' }).catch(() => {});
      });
  }, [id]);

  useEffect(() => {
    if (catalog && unlocked && viewMode === 'proxy') checkProxy();
  }, [catalog, unlocked]);

  const handleUnlock = () => {
    if (!catalog) return;
    if (pwInput === catalog.password) { setUnlocked(true); setPwError(false); }
    else { setPwError(true); }
  };

  const proxyUrl = catalog?.pdf_url ? `/api/pdf-proxy?url=${encodeURIComponent(catalog.pdf_url)}` : '';
  const pdfSrc = catalog?.pdf_url
    ? viewMode === 'proxy'  ? proxyUrl
    : viewMode === 'google' ? `https://docs.google.com/viewer?url=${encodeURIComponent(catalog.pdf_url)}&embedded=true`
    : catalog.pdf_url
    : '';

  // 프록시 오류 체크 (처음 로드 시)
  const checkProxy = async () => {
    if (!proxyUrl) return;
    setProxyError('');
    const res = await fetch(proxyUrl);
    if (!res.ok || !res.headers.get('content-type')?.includes('pdf')) {
      const err = await res.json().catch(() => ({ error: 'PDF를 불러올 수 없습니다' }));
      setProxyError(err.error || 'PDF 오류');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>불러오는 중...
        </div>
      </main>
      <Footer />
    </>
  );

  if (!catalog) return null;

  // 비밀번호 게이트
  if (!unlocked) return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 420, width: '100%', padding: '0 24px' }}>
          <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>암호 보호 카탈로그</h2>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#475569', marginBottom: 6 }}>{catalog.title}</div>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 28 }}>이 카탈로그는 암호로 보호되어 있습니다.</p>
            <input type="password" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              placeholder="암호를 입력하세요"
              style={{ width: '100%', padding: '12px 16px', border: `2px solid ${pwError ? '#ef4444' : '#e2e8f0'}`, borderRadius: 10, fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 8, textAlign: 'center' }} />
            {pwError && <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 12 }}>암호가 올바르지 않습니다.</p>}
            <button onClick={handleUnlock}
              style={{ width: '100%', padding: '13px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 12 }}>
              확인
            </button>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>← 돌아가기</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      {!fullscreen && <Navbar />}
      <main style={{ minHeight: '100vh', background: '#1e293b', paddingTop: fullscreen ? 0 : 84 }}>
        {/* 상단 컨트롤 바 */}
        <div style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/catalog')}
            style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', flexShrink: 0 }}>
            ← 목록
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{catalog.title}</div>
            {catalog.category && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{catalog.category}</div>}
          </div>

          {catalog.page_count > 0 && (
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{catalog.page_count}p</span>
          )}

          <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 2, gap: 2 }}>
              {([['proxy','🖥 서버뷰어'],['google','🌐 Google'],['direct','📄 직접']] as [ViewMode,string][]).map(([mode, label]) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  style={{ padding: '5px 9px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: viewMode === mode ? '#0ea5e9' : 'transparent', color: viewMode === mode ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                  {label}
                </button>
              ))}
            </div>
            <a href={catalog.pdf_url} target="_blank" rel="noopener noreferrer"
              style={{ padding: '7px 12px', background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.4)', borderRadius: 8, color: '#7dd3fc', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              ⬇ 다운로드
            </a>
            <button onClick={() => setFullscreen(f => !f)}
              style={{ padding: '7px 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13 }}>
              {fullscreen ? '⊠' : '⊞'}
            </button>
          </div>
        </div>

        {/* PDF 오류 안내 */}
        {proxyError && viewMode === 'proxy' && (
          <div style={{ background: '#7f1d1d', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <div style={{ color: '#fca5a5', fontWeight: 700, fontSize: 13 }}>PDF를 불러올 수 없습니다</div>
              <div style={{ color: '#fca5a5', fontSize: 12, opacity: 0.8, marginTop: 2 }}>{proxyError} — 관리자 페이지에서 PDF를 다시 업로드하세요.</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={() => setViewMode('google')} style={{ padding: '6px 12px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Google로 시도</button>
              <button onClick={() => setViewMode('direct')} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>직접 URL</button>
            </div>
          </div>
        )}

        {/* PDF 뷰어 */}
        <div style={{ width: '100%', background: '#374151' }}>
          {!proxyError || viewMode !== 'proxy' ? (
            <iframe
              key={`${id}-${viewMode}`}
              src={pdfSrc}
              style={{ width: '100%', height: fullscreen ? '100vh' : 'calc(100vh - 120px)', border: 'none', display: 'block' }}
              title={catalog.title}
              allow="fullscreen"
            />
          ) : (
            <div style={{ height: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 48 }}>📄</div>
              <div style={{ color: '#94a3b8', fontSize: 14 }}>PDF 파일에 접근할 수 없습니다</div>
              <a href={catalog.pdf_url} target="_blank" rel="noopener noreferrer"
                style={{ padding: '10px 20px', background: '#0ea5e9', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                새 탭에서 직접 열기
              </a>
            </div>
          )}
        </div>
      </main>
      {!fullscreen && <Footer />}
    </>
  );
}
