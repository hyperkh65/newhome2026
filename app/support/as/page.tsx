'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CloudinaryUpload from '@/components/CloudinaryUpload';


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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.content || !form.password) { alert('이름, 연락처, 증상/내용, 비밀번호는 필수입니다.'); return; }
    setSubmitting(true);
    const fullContent = `[제품명] ${form.product_name || '미입력'}\n[증상유형] ${form.issue_type}\n\n${form.content}`;
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'as', name: form.name, email: form.email, phone: form.phone, content: fullContent, attachments, password: form.password }),
    });
    const json = await res.json();
    if (!res.ok) alert('제출 오류: ' + json.error);
    else setSubmitted(json.id);
    setSubmitting(false);
  };

  if (submitted) return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 500, width: '100%', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔧</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>A/S 신청이 접수되었습니다</h2>
          <p style={{ color: '#64748b', marginBottom: 28, lineHeight: 1.7 }}>담당자가 입력하신 연락처로 연락드리겠습니다.<br/>영업일 기준 1~3일 내 처리됩니다.</p>
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
              담당자가 입력하신 연락처로 빠르게 연락드리겠습니다.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'flex-start' }}>
            {/* A/S 신청 폼 */}
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
                    <select value={form.issue_type} onChange={e=>setForm({...form,issue_type:e.target.value})} style={{ ...inputBase, cursor:'pointer' }}>
                      {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  {lbl('증상 및 요청사항', true)}
                  <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required rows={6}
                    placeholder="증상을 자세히 설명해 주세요. 언제부터 발생했는지, 어떤 상황에서 발생했는지 등을 포함해 주세요."
                    style={{ ...inputBase, resize:'vertical' }}/>
                </div>
                <div style={{ marginBottom: 16 }}>
                  {lbl('사진/동영상 첨부 (최대 5개, 불량 부위 촬영 권장)')}
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
                  <p style={{ fontSize:11, color:'#92400e', marginTop:6 }}>개인정보 보호를 위해 비밀번호를 설정합니다. 담당자만 내용을 확인할 수 있습니다.</p>
                </div>
                <button type="submit" disabled={submitting}
                  style={{ width:'100%', padding:'14px', background:'#0f172a', color:'#fff', border:'none', borderRadius:12, fontWeight:800, fontSize:15, cursor:submitting?'not-allowed':'pointer', opacity:submitting?0.7:1, fontFamily:'inherit' }}>
                  {submitting ? '⏳ 접수 중...' : '🔧 A/S 신청하기'}
                </button>
              </form>
            </div>

            {/* 안내 정보 */}
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
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>🔧 A/S 처리 절차</div>
                {[
                  { step: '1', text: '온라인 접수' },
                  { step: '2', text: '담당자 확인 후 연락' },
                  { step: '3', text: '수리/교체 진행' },
                  { step: '4', text: '처리 완료 안내' },
                ].map(s => (
                  <div key={s.step} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#475569', flexShrink:0 }}>{s.step}</div>
                    <span style={{ fontSize:13, color:'#475569' }}>{s.text}</span>
                  </div>
                ))}
                <div style={{ marginTop:16, padding:'12px', background:'#fff7ed', borderRadius:8, border:'1px solid #fed7aa', fontSize:12, color:'#c2410c' }}>
                  ⏱ 영업일 기준 1~3일 내 담당자 연락
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


