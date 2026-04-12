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

const ISSUE_TYPES = ['작동 불량', '파손/손상', '설치 문의', '부품 교체', '기타'];

export default function AsPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', product_name: '', issue_type: '작동 불량', content: '', password: '' });
  const [attachments, setAttachments] = useState<{ name: string; url: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [checkId, setCheckId] = useState('');
  const [checkPw, setCheckPw] = useState('');
  const [found, setFound] = useState<any | null>(null);
  const [checkError, setCheckError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.content || !form.password) { alert('이름, 연락처, 증상/내용, 비밀번호는 필수입니다.'); return; }
    setSubmitting(true);
    const fullContent = `[제품명] ${form.product_name || '미입력'}\n[증상유형] ${form.issue_type}\n\n${form.content}`;
    const { data, error } = await supabase.from('inquiries').insert({
      type: 'as', name: form.name, phone: form.phone, email: form.email,
      content: fullContent, attachments, password: form.password, status: 'pending',
    }).select('id').single();
    if (error) alert('제출 오류: ' + error.message);
    else setSubmitted(data.id);
    setSubmitting(false);
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckError(''); setFound(null);
    const { data } = await supabase.from('inquiries').select('*')
      .eq('id', checkId.trim()).eq('password', checkPw).eq('type', 'as').single();
    if (data) setFound(data);
    else setCheckError('조회 번호 또는 비밀번호가 올바르지 않습니다.');
  };

  const statusLabel = (s: string) => s === 'replied' ? '✅ 답변 완료' : s === 'closed' ? '🔒 처리 완료' : '⏳ 접수 대기';
  const statusColor = (s: string) => s === 'replied' ? '#166534' : s === 'closed' ? '#1e40af' : '#c2410c';
  const statusBg   = (s: string) => s === 'replied' ? '#f0fdf4' : s === 'closed' ? '#eff6ff' : '#fff7ed';

  if (submitted) return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 500, width: '100%', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔧</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>A/S 신청이 접수되었습니다</h2>
          <p style={{ color: '#64748b', marginBottom: 28, lineHeight: 1.7 }}>담당자 확인 후 연락드리겠습니다.<br/>아래 조회번호와 비밀번호를 꼭 보관해 주세요.</p>
          <div style={{ background: '#fff', borderRadius: 16, border: '2px solid #e2e8f0', padding: '24px', marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>조회 번호 (접수 ID)</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', wordBreak: 'break-all', fontFamily: 'monospace', background: '#f8fafc', padding: '10px', borderRadius: 8 }}>{submitted}</div>
          </div>
          <button onClick={() => { setSubmitted(null); setForm({ name:'',phone:'',email:'',product_name:'',issue_type:'작동 불량',content:'',password:'' }); setAttachments([]); }}
            style={{ padding: '12px 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
            추가 신청하기
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
            <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 14, letterSpacing: -0.5 }}>A/S 신청</h1>
            <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>
              제품 불량, 파손, 교체 등 A/S 신청을 접수해 주세요.<br/>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>비밀번호는 접수 내용 조회 시 필요하니 반드시 기억해 주세요.</span>
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '32px' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>🔧 A/S 신청서</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>{lbl('이름', true)}<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="홍길동" style={inputBase}/></div>
                  <div>{lbl('연락처', true)}<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required placeholder="010-0000-0000" style={inputBase}/></div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  {lbl('이메일')}
                  <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="example@email.com" style={inputBase}/>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    {lbl('제품명')}
                    <input value={form.product_name} onChange={e=>setForm({...form,product_name:e.target.value})} placeholder="예: LED 패널라이트 60W" style={inputBase}/>
                  </div>
                  <div>
                    {lbl('증상 유형', true)}
                    <select value={form.issue_type} onChange={e=>setForm({...form,issue_type:e.target.value})}
                      style={{ ...inputBase, cursor: 'pointer' }}>
                      {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  {lbl('증상 및 요청사항', true)}
                  <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required rows={6}
                    placeholder="증상을 자세히 설명해 주세요. 언제부터 발생했는지, 어떤 상황에서 발생했는지 등을 포함해 주세요."
                    style={{ ...inputBase, resize: 'vertical' }}/>
                </div>
                <div style={{ marginBottom: 16 }}>
                  {lbl('사진 첨부 (최대 5개, 불량 부위 촬영 권장)')}
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
                    <CloudinaryUpload label="사진/동영상 첨부" folder="as-requests" accept="image/*,video/*"
                      onSuccess={url => {
                        const name = decodeURIComponent(url.split('/').pop()?.split('?')[0] || 'file');
                        setAttachments([...attachments, { name, url }]);
                      }}/>
                  )}
                </div>
                <div style={{ marginBottom: 24, padding: '16px', background: '#fef3c7', borderRadius: 12, border: '1px solid #fde68a' }}>
                  <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#92400e', marginBottom:6 }}>
                    🔒 접수 비밀번호 <span style={{ color:'#ef4444' }}>*</span>
                  </label>
                  <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required
                    placeholder="접수 조회 시 사용할 비밀번호" style={{ ...inputBase, border:'2px solid #fde68a', background:'#fffbeb' }}/>
                  <p style={{ fontSize:11, color:'#92400e', marginTop:6 }}>개인정보 보호를 위해 비밀번호를 설정합니다. 반드시 기억해 주세요.</p>
                </div>
                <button type="submit" disabled={submitting}
                  style={{ width:'100%', padding:'14px', background:'#0f172a', color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:15, cursor:submitting?'not-allowed':'pointer', opacity:submitting?0.7:1, fontFamily:'inherit' }}>
                  {submitting ? '⏳ 접수 중...' : '🔧 A/S 신청하기'}
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', padding: '28px' }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>🔍 접수 조회</h2>
                <form onSubmit={handleCheck}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#475569', marginBottom:6 }}>조회 번호</label>
                    <input value={checkId} onChange={e=>setCheckId(e.target.value)} required placeholder="접수 번호 입력"
                      style={{ ...inputBase, padding:'10px 12px', fontSize:13 }}/>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#475569', marginBottom:6 }}>비밀번호</label>
                    <input type="password" value={checkPw} onChange={e=>setCheckPw(e.target.value)} required
                      style={{ ...inputBase, padding:'10px 12px', fontSize:13 }}/>
                  </div>
                  {checkError && <p style={{ fontSize:12, color:'#ef4444', marginBottom:10 }}>{checkError}</p>}
                  <button type="submit" style={{ width:'100%', padding:'11px', background:'#0f172a', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                    조회하기
                  </button>
                </form>
                {found && (
                  <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid #f1f5f9' }}>
                    <div style={{ display:'inline-block', padding:'4px 10px', borderRadius:20, background:statusBg(found.status), color:statusColor(found.status), fontSize:12, fontWeight:700, marginBottom:10 }}>
                      {statusLabel(found.status)}
                    </div>
                    <div style={{ fontSize:12, color:'#94a3b8', marginBottom:4 }}>{new Date(found.created_at).toLocaleDateString('ko-KR')} · {found.name}</div>
                    <div style={{ fontSize:13, color:'#475569', marginBottom:12, lineHeight:1.6, whiteSpace:'pre-wrap', background:'#f8fafc', padding:12, borderRadius:8 }}>{found.content}</div>
                    {found.attachments?.length > 0 && (
                      <div style={{ marginBottom:12 }}>
                        {found.attachments.map((a: any, i: number) => (
                          <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
                            style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#0ea5e9', textDecoration:'none', marginBottom:4 }}>
                            📎 {a.name}
                          </a>
                        ))}
                      </div>
                    )}
                    {found.admin_reply ? (
                      <div style={{ background:'#f0fdf4', borderRadius:10, padding:'14px', border:'1px solid #bbf7d0' }}>
                        <div style={{ fontSize:11, fontWeight:700, color:'#166534', marginBottom:6 }}>📩 담당자 답변</div>
                        <div style={{ fontSize:13, color:'#166534', lineHeight:1.6, whiteSpace:'pre-wrap' }}>{found.admin_reply}</div>
                        <div style={{ fontSize:11, color:'#86efac', marginTop:6 }}>{new Date(found.replied_at).toLocaleDateString('ko-KR')}</div>
                      </div>
                    ) : (
                      <div style={{ background:'#fff7ed', borderRadius:10, padding:'12px', border:'1px solid #fed7aa', fontSize:13, color:'#c2410c' }}>
                        ⏳ 담당자 확인 후 연락드리겠습니다.
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', borderRadius: 20, padding: '24px', color: '#fff' }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>🔧 A/S 처리 안내</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>접수 후 영업일 기준 1~3일 내 연락</div>
                {[
                  { step: '1', text: '온라인 접수' },
                  { step: '2', text: '담당자 확인 연락' },
                  { step: '3', text: '수리/교체 진행' },
                  { step: '4', text: '처리 완료 안내' },
                ].map(s => (
                  <div key={s.step} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                    <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>{s.step}</div>
                    <span style={{ fontSize:13 }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
