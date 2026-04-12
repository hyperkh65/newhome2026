'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface Guide { id: string; title: string; video_url: string; thumbnail: string; description: string; }

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function InstallGuidePage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [playing, setPlaying] = useState<Guide | null>(null);

  useEffect(() => {
    supabase.from('install_guides').select('*').order('order_num').then(({ data }) => {
      if (data) setGuides(data);
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setPlaying(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const getThumbnail = (g: Guide) => {
    if (g.thumbnail) return g.thumbnail;
    const ytId = getYouTubeId(g.video_url);
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    return null;
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
          <header style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 }}>CUSTOMER CENTER</div>
            <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 14, letterSpacing: -0.5 }}>설치 가이드</h1>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
              제품별 설치 영상 가이드입니다. 영상을 클릭하여 재생하세요.
            </p>
          </header>

          {guides.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
              <div style={{ fontSize: 16 }}>등록된 설치가이드가 없습니다.</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {guides.map(g => {
                const thumb = getThumbnail(g);
                return (
                  <div key={g.id} onClick={() => setPlaying(g)}
                    style={{ background: '#fff', borderRadius: 18, border: '1px solid #e2e8f0', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; el.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; el.style.transform = 'none'; }}>
                    <div style={{ position: 'relative', paddingTop: '56.25%', background: '#0f172a', overflow: 'hidden' }}>
                      {thumb
                        ? <img src={thumb} alt={g.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🎬</div>
                      }
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="#0f172a"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6, lineHeight: 1.3 }}>{g.title}</div>
                      {g.description && <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{g.description}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {playing && (
        <div onClick={() => setPlaying(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#000', borderRadius: 16, overflow: 'hidden', width: '100%', maxWidth: 900, boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: '#0f172a' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{playing.title}</span>
              <button onClick={() => setPlaying(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 26, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              {getYouTubeId(playing.video_url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(playing.video_url)}?autoplay=1`}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; encrypted-media" allowFullScreen
                />
              ) : (
                <video src={playing.video_url} controls autoPlay
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
