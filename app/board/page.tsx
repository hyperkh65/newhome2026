'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string; title: string; content: string; author: string;
  created_at: string; attachments: { name: string; url: string }[];
  is_locked: boolean; password?: string; cover_image?: string;
}

const PROSE = `
  .prose-content { line-height: 1.85; color: #334155; font-size: 15px; }
  .prose-content h2 { font-size: 22px; font-weight: 800; margin: 24px 0 10px; color: #0f172a; }
  .prose-content h3 { font-size: 18px; font-weight: 700; margin: 18px 0 8px; color: #1e293b; }
  .prose-content h4 { font-size: 14px; font-weight: 700; margin: 12px 0 4px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
  .prose-content ul, .prose-content ol { padding-left: 22px; margin: 8px 0; }
  .prose-content li { margin: 5px 0; }
  .prose-content blockquote { border-left: 3px solid #0ea5e9; margin: 14px 0; padding: 10px 18px; background: #f0f9ff; border-radius: 0 10px 10px 0; color: #0369a1; }
  .prose-content hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
  .prose-content img { max-width: 100%; border-radius: 12px; margin: 12px 0; display: block; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .prose-content a { color: #0ea5e9; text-decoration: underline; }
  .prose-content video { max-width: 100%; border-radius: 12px; margin: 12px 0; }
  .prose-content iframe { max-width: 100%; border-radius: 12px; }
  .prose-content s { opacity: 0.5; }
  .prose-content p { margin: 8px 0; }
`;

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Post | null>(null);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.from('posts').select('id, type, title, author, created_at, attachments, is_locked, cover_image')
      .eq('type', 'board').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setPosts(data as Post[]); setLoading(false); });
  }, []);

  const openPost = async (post: Post) => {
    if (post.is_locked && !unlocked.has(post.id)) {
      setSelected(post); setPwInput(''); setPwError(false); return;
    }
    // 잠금 없거나 이미 해제된 글 → 전체 내용 로드
    const { data } = await supabase.from('posts').select('*').eq('id', post.id).single();
    if (data) setSelected(data as Post);
  };

  const handleUnlock = async () => {
    if (!selected) return;
    setPwLoading(true);
    // 비밀번호 확인 - 해당 글의 password 필드 조회
    const { data } = await supabase.from('posts').select('password, content, attachments').eq('id', selected.id).single();
    if (data && data.password === pwInput) {
      setUnlocked(prev => new Set([...prev, selected.id]));
      setSelected({ ...selected, content: data.content, attachments: data.attachments } as Post);
      setPwError(false);
    } else {
      setPwError(true);
    }
    setPwLoading(false);
  };

  const isContentVisible = (post: Post) => !post.is_locked || unlocked.has(post.id);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <style>{PROSE}</style>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '100px 24px 80px' }}>

        {/* 헤더 */}
        {!selected && (
          <header style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 }}>NOTICE & FILES</div>
            <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 14, letterSpacing: -0.5 }}>자료 공유 게시판</h1>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
              공지사항 및 사진·파일 자료를 공유하는 게시판입니다.<br/>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <span style={{ fontSize: 14 }}>🔒</span> 잠금 게시글은 담당자 확인 후 암호를 통해 열람하실 수 있습니다.
              </span>
            </p>
          </header>
        )}

        {/* 목록 */}
        {!selected && (
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            {/* 헤더 행 */}
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 110px 130px', padding: '13px 24px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              {['번호', '제목', '작성자', '날짜'].map((h, i) => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: i >= 2 ? 'center' : 'left' }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ width: 32, height: 32, border: '2px solid #e2e8f0', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                로딩 중...
              </div>
            ) : posts.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <div style={{ color: '#94a3b8', fontSize: 14 }}>등록된 게시물이 없습니다</div>
              </div>
            ) : posts.map((post, i) => (
              <div key={post.id} onClick={() => openPost(post)}
                style={{ display: 'grid', gridTemplateColumns: '60px 1fr 110px 130px', padding: '17px 24px', borderBottom: i < posts.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: '0.13s', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#fff'}>

                {/* 번호 */}
                <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{posts.length - i}</div>

                {/* 제목 */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    {post.is_locked && !unlocked.has(post.id) && <span style={{ fontSize: 14, lineHeight: 1 }}>🔒</span>}
                    <span style={{ fontSize: 15, fontWeight: 650, color: '#0f172a' }}>{post.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(post.attachments as any)?.length > 0 && (
                      <span style={{ fontSize: 11, background: '#eff6ff', color: '#0369a1', padding: '1px 7px', borderRadius: 10, fontWeight: 600 }}>
                        📎 파일 {(post.attachments as any).length}개
                      </span>
                    )}
                    {post.cover_image && (
                      <span style={{ fontSize: 11, background: '#f0fdf4', color: '#16a34a', padding: '1px 7px', borderRadius: 10, fontWeight: 600 }}>🖼 이미지</span>
                    )}
                  </div>
                </div>

                {/* 작성자 */}
                <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>{post.author}</div>

                {/* 날짜 */}
                <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                  {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 게시글 상세 */}
        {selected && (
          <div>
            <button onClick={() => setSelected(null)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 700, cursor: 'pointer', marginBottom: 24, fontSize: 14, padding: 0 }}>
              ← 목록으로
            </button>

            {/* 잠금 해제 UI */}
            {selected.is_locked && !unlocked.has(selected.id) ? (
              <div style={{ background: '#fff', borderRadius: 24, padding: '56px 40px', textAlign: 'center', border: '1px solid #e2e8f0', maxWidth: 440, margin: '0 auto', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 52, marginBottom: 20 }}>🔒</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 10 }}>잠금 게시글</h2>
                <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
                  이 게시글은 암호로 보호되어 있습니다.<br/>
                  담당자에게 문의하여 열람 암호를 확인하세요.
                </p>
                <input
                  type="password" value={pwInput}
                  onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                  onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                  placeholder="열람 암호 입력"
                  autoFocus
                  style={{
                    width: '100%', padding: '13px 16px', border: `1.5px solid ${pwError ? '#ef4444' : '#e2e8f0'}`,
                    borderRadius: 12, fontSize: 15, marginBottom: 10, boxSizing: 'border-box',
                    outline: 'none', textAlign: 'center', fontFamily: 'inherit', transition: '0.2s',
                    background: pwError ? '#fef2f2' : '#fff',
                  }} />
                {pwError && (
                  <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    ⚠️ 암호가 올바르지 않습니다
                  </div>
                )}
                <button onClick={handleUnlock} disabled={pwLoading || !pwInput}
                  style={{ width: '100%', padding: '14px', background: pwLoading ? '#94a3b8' : '#0ea5e9', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: pwLoading ? 'not-allowed' : 'pointer', transition: '0.2s' }}>
                  {pwLoading ? '확인 중...' : '🔓 열람하기'}
                </button>
              </div>
            ) : (
              /* 본문 표시 */
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                {/* 커버 이미지 */}
                {selected.cover_image && (
                  <div style={{ height: 300, overflow: 'hidden' }}>
                    <img src={selected.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                {/* 제목/메타 */}
                <div style={{ padding: '32px 40px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    {selected.is_locked && <span title="해제됨" style={{ fontSize: 16 }}>🔓</span>}
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: -0.3 }}>{selected.title}</h1>
                  </div>
                  <div style={{ display: 'flex', gap: 16, color: '#94a3b8', fontSize: 13 }}>
                    <span>작성자: <strong style={{ color: '#475569' }}>{selected.author}</strong></span>
                    <span>·</span>
                    <span>{new Date(selected.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>

                {/* 본문 */}
                <div className="prose-content" style={{ padding: '32px 40px' }}
                  dangerouslySetInnerHTML={{ __html: selected.content || '<p style="color:#94a3b8">내용이 없습니다.</p>' }} />

                {/* 첨부파일 */}
                {selected.attachments?.length > 0 && (
                  <div style={{ padding: '24px 40px 36px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>📎 첨부파일 ({selected.attachments.length}개)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {selected.attachments.map((f, i) => (
                        <a key={i} href={f.url} download target="_blank" rel="noreferrer"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', textDecoration: 'none', color: '#0f172a', transition: '0.15s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#0ea5e9'; (e.currentTarget as HTMLAnchorElement).style.background = '#f0f9ff'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLAnchorElement).style.background = '#fff'; }}>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>📄 {f.name}</span>
                          <span style={{ fontSize: 13, color: '#0ea5e9', fontWeight: 700 }}>↓ 다운로드</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
