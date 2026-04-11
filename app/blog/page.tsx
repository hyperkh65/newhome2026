'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string; title: string; content: string; author: string;
  created_at: string; cover_image?: string; attachments?: { name: string; url: string }[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('posts').select('*')
      .eq('type', 'blog').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setPosts(data as BlogPost[]); setLoading(false); });
  }, []);

  const excerpt = (html: string, len = 120) => {
    const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return text.length > len ? text.slice(0, len) + '…' : text;
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '100px 24px 80px' }}>
        {/* 헤더 */}
        <header style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 }}>BLOG & NEWS</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 14, letterSpacing: -0.5 }}>블로그</h1>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
            와이앤케이의 최신 소식, LED 조명 트렌드, 기술 정보를 전달합니다.
          </p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
            <div style={{ width: 32, height: 32, border: '2px solid #e2e8f0', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            로딩 중...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✍️</div>
            <div style={{ color: '#94a3b8', fontSize: 15 }}>아직 등록된 블로그 글이 없습니다.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28 }}>
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <article
                  style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.04)'; }}>
                  {/* 커버 이미지 */}
                  <div style={{ height: 200, overflow: 'hidden', background: '#f1f5f9', position: 'relative' }}>
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, opacity: 0.3 }}>✍️</div>
                    )}
                  </div>

                  {/* 내용 */}
                  <div style={{ padding: '22px 24px 24px' }}>
                    <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 10, lineHeight: 1.4, letterSpacing: -0.2 }}>
                      {post.title}
                    </h2>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 16 }}>
                      {excerpt(post.content || '')}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>
                        {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span style={{ fontSize: 12, color: '#0ea5e9', fontWeight: 700 }}>더 보기 →</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
