'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface FaqItem { id: string; question: string; answer: string; order_num: number; }

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('faq').select('*').eq('is_active', true).order('order_num').then(({ data }) => {
      if (data) setItems(data);
    });
  }, []);

  const filtered = items.filter(f =>
    !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 100 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
          <header style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 }}>CUSTOMER CENTER</div>
            <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 14, letterSpacing: -0.5 }}>자주 묻는 질문</h1>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
              고객님이 자주 문의하시는 질문과 답변을 모아두었습니다.<br/>
              원하시는 답변을 찾지 못하셨다면 고객문의를 이용해주세요.
            </p>
          </header>

          <div style={{ marginBottom: 32 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 질문 검색..."
              style={{ width: '100%', padding: '14px 18px', borderRadius: 12, border: '2px solid #e2e8f0', fontSize: 15, outline: 'none', boxSizing: 'border-box', background: '#fff', fontFamily: 'inherit' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: 15 }}>
                {search ? `"${search}" 에 해당하는 질문이 없습니다.` : '등록된 FAQ가 없습니다.'}
              </div>
            )}
            {filtered.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: 16, border: `2px solid ${open === item.id ? '#0ea5e9' : '#e2e8f0'}`, overflow: 'hidden', transition: 'all 0.2s' }}>
                <button onClick={() => setOpen(open === item.id ? null : item.id)}
                  style={{ width: '100%', padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', fontFamily: 'inherit' }}>
                  <span style={{ fontSize: 20, color: '#0ea5e9', fontWeight: 900, flexShrink: 0 }}>Q</span>
                  <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{item.question}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"
                    style={{ transform: open === item.id ? 'rotate(180deg)' : 'none', transition: '0.3s', flexShrink: 0 }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {open === item.id && (
                  <div style={{ padding: '0 24px 20px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingTop: 16 }}>
                      <span style={{ fontSize: 20, color: '#10b981', fontWeight: 900, flexShrink: 0 }}>A</span>
                      <div style={{ fontSize: 15, color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{item.answer}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, padding: '32px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', borderRadius: 20, textAlign: 'center', color: '#fff' }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>원하시는 답변을 찾지 못하셨나요?</div>
            <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 20 }}>고객문의를 통해 직접 문의해 주시면 빠르게 답변드리겠습니다.</div>
            <a href="/support/contact" style={{ display: 'inline-block', padding: '12px 28px', background: '#fff', color: '#0284c7', borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
              📧 고객문의 하기
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
