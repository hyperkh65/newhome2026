'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/sup/dashboard');
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError('이메일과 비밀번호를 입력하세요.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError('이메일 또는 비밀번호가 올바르지 않습니다.'); return; }
    router.replace('/sup/dashboard');
  };

  const handleRegister = async () => {
    if (!companyName || !email || !password) { setError('모든 필수 항목을 입력하세요.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    setLoading(true); setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from('suppliers').insert({ id: data.user.id, company_name: companyName, contact_name: contactName });
      if (data.session) { router.replace('/sup/dashboard'); return; }
    }
    setSuccess('가입이 완료되었습니다. 이메일 인증 후 로그인해주세요.');
    setLoading(false);
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: 12,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, -apple-system, sans-serif', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #60a5fa, #1d4ed8)', boxShadow: '0 0 20px #3b82f650' }} />
            <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>YnK Supplier Portal</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>해외 공급사 협력 플랫폼</p>
        </div>

        {/* 카드 */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '32px 28px' }}>

          {/* 탭 */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                style={{ flex: 1, padding: '9px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', transition: '0.15s',
                  background: mode === m ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: mode === m ? '#60a5fa' : 'rgba(255,255,255,0.4)' }}>
                {m === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>

          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
              <p style={{ color: '#4ade80', fontSize: 14, lineHeight: 1.7 }}>{success}</p>
              <button onClick={() => { setMode('login'); setSuccess(''); }}
                style={{ marginTop: 20, padding: '10px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
                로그인하기
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {mode === 'register' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 7, fontWeight: 700, letterSpacing: 0.5 }}>회사명 *</label>
                    <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Company Name" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 7, fontWeight: 700, letterSpacing: 0.5 }}>담당자 이름</label>
                    <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Contact Person" style={inp} />
                  </div>
                </>
              )}
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 7, fontWeight: 700, letterSpacing: 0.5 }}>이메일 *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com" style={inp}
                  onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 7, fontWeight: 700, letterSpacing: 0.5 }}>비밀번호 *</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="6자 이상" style={inp}
                  onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())} />
              </div>

              {error && <p style={{ color: '#f87171', fontSize: 12, margin: 0 }}>{error}</p>}

              <button onClick={mode === 'login' ? handleLogin : handleRegister} disabled={loading}
                style={{ width: '100%', padding: '13px', background: loading ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #2563eb, #3b82f6)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
                {loading ? '처리 중...' : mode === 'login' ? '로그인' : '가입하기'}
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
          YnK Co., Ltd. · Supplier Collaboration Platform
        </p>
      </div>
    </div>
  );
}
