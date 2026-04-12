'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CloudinaryUpload from '@/components/CloudinaryUpload';
import { supabase } from '@/lib/supabase';

const inputBase: React.CSSProperties = {
  width: '100%', padding: '11px 14px', border: '2px solid #e2e8f0', borderRadius: 10,
  fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff',
};
const lbl = (text: string, required = false) => (
  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
    {text}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
  </label>
);

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', content: '', password: '' });
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.content || !form.password) { alert('이름, 문의내용, 비밀번호는 필수입니다.'); return; }
    setSubmitting(true);
    const { data, error } = await supabase.rpc('submit_inquiry', {
      p_type: 'contact', p_name: form.name, p_email: form.email, p_phone: form.phone,
      p_content: form.content, p_attachments: attachments, p_password: form.password,
    });
    if (error) alert('제출 오류: ' + error.message);
    else setSubmitted(data as string);
    setSubmitting(false);
  };

  if (submitted) return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 500, width: '100%', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>문의가 접수되었습니다</h2>
          <p style={{ color: '#64748b', marginBottom: 28, lineHeight: 1.7 }}>빠른 시일 내에 답변드리겠습니다.<br/>담당자가 이메일 또는 연락처로 답변드릴 예정입니다.</p>
          <button onClick={() => { setSubmitted(null); setForm({ name:'',email:'',phone:'',content:'',password:'' }); setAttachments([]); }}
            style={{ padding: '12px 24px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
            추가 문의하기
          </button>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 100 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
          <header style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 }}>CUSTOMER CENTER</div>
            <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 14, letterSpacing: -0.5 }}>고객 문의</h1>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
              제품 문의, 견적 요청, 기타 문의를 남겨주세요.<br/>
              담당자가 이메일 또는 연락처로 빠르게 답변드리겠습니다.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'flex-start' }}>
            {/* 문의 폼 */}
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>📧 문의 작성</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>{lbl('이름', true)}<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="홍길동" style={inputBase}/></div>
                  <div>{lbl('연락처')}<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="010-0000-0000" style={inputBase}/></div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  {lbl('이메일')}
                  <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="example@email.com" style={inputBase}/>
                </div>
                <div style={{ marginBottom: 16 }}>
                  {lbl('문의 내용', true)}
                  <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required rows={6}
                    placeholder="문의 내용을 자세히 작성해 주세요..." style={{ ...inputBase, resize: 'vertical' }}/>
                </div>
                <div style={{ marginBottom: 16 }}>
                  {lbl('첨부파일 (사진/동영상/문서 최대 5개)')}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: attachments.length ? 10 : 0 }}>
                    {attachments.map((f, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px', background:'#f1f5f9', borderRadius:8, fontSize:13 }}>
                        <span>📎 {f.name}</span>
                        <button type="button" onClick={() => setAttachments(attachments.filter((_,idx)=>idx!==i))}
                          style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:16, lineHeight:1 }}>×</button>
                      </div>
                    ))}
                  </div>
                  {attachments.length < 5 && (
                    <CloudinaryUpload label="파일 첨부" folder="inquiries" accept="image/*,video/*,application/pdf"
                      onSuccess={url => {
                        const name = decodeURIComponent(url.split('/').pop()?.split('?')[0] || 'file');
                        setAttachments([...attachments, { name, url }]);
                      }}/>
                  )}
                </div>
                <div style={{ marginBottom: 24, padding: '16px', background: '#fef3c7', borderRadius: 12, border: '1px solid #fde68a' }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#92400e', marginBottom:6 }}>
                    🔒 문의 비밀번호 <span style={{ color:'#ef4444' }}>*</span>
                  </label>
                  <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required
                    placeholder="문의 조회 시 사용할 비밀번호" style={{ ...inputBase, border:'2px solid #fde68a', background:'#fffbeb' }}/>
                  <p style={{ fontSize:11, color:'#92400e', marginTop:6 }}>개인정보 보호를 위해 비밀번호를 설정합니다. 담당자만 내용을 확인할 수 있습니다.</p>
                </div>
                <button type="submit" disabled={submitting}
                  style={{ width:'100%', padding:'14px', background:'#0ea5e9', color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:15, cursor:submitting?'not-allowed':'pointer', opacity:submitting?0.7:1, fontFamily:'inherit' }}>
                  {submitting ? '⏳ 제출 중...' : '📨 문의 제출하기'}
                </button>
              </form>
            </div>

            {/* 연락처 정보 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#0f172a', borderRadius: 20, padding: '28px', color: '#fff' }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>📞 직접 연락</div>
                {[
                  { icon: '📞', label: '전화', val: '032-862-1350' },
                  { icon: '🕘', label: '운영시간', val: '평일 09:00 ~ 18:00' },
                ].map(c => (
                  <div key={c.label} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:2 }}>{c.label}</div>
                      <div style={{ fontSize:14, fontWeight:700 }}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>💡 문의 안내</div>
                {[
                  '제품 사양 및 견적 문의',
                  '납기 및 재고 확인',
                  '기술 지원 및 설치 문의',
                  '대량 구매 및 OEM 협의',
                ].map(t => (
                  <div key={t} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, fontSize:13, color:'#475569' }}>
                    <span style={{ color:'#0ea5e9', fontWeight:900 }}>·</span> {t}
                  </div>
                ))}
              </div>

              <div style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', borderRadius: 20, padding: '24px', color: '#fff', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 8 }}>A/S 신청</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 16 }}>제품 불량·파손 등<br/>A/S는 별도 페이지에서 접수</div>
                <a href="/support/as" style={{ display:'inline-block', padding:'10px 20px', background:'#fff', color:'#0284c7', borderRadius:8, fontWeight:800, fontSize:13, textDecoration:'none' }}>
                  🔧 A/S 신청하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

