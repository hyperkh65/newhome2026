import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.vercel.app';

async function getApiKey() {
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await sb.from('site_settings').select('config').eq('category', 'apikey').maybeSingle();
    return data?.config?.key || null;
  } catch { return null; }
}

const S = {
  card: { background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'28px 32px', marginBottom:24, boxShadow:'0 2px 12px rgba(0,0,0,0.04)' } as React.CSSProperties,
  h2:   { fontSize:18, fontWeight:800, color:'#0f172a', marginBottom:12, display:'flex', alignItems:'center', gap:8 } as React.CSSProperties,
  code: { background:'#0f172a', color:'#e2e8f0', borderRadius:12, padding:'16px 20px', fontSize:13, fontFamily:'monospace', lineHeight:1.7, overflowX:'auto' as const, display:'block', whiteSpace:'pre' as const },
  tag:  { display:'inline-block', padding:'3px 10px', borderRadius:6, fontSize:12, fontWeight:700 } as React.CSSProperties,
  pill: (c: string) => ({ background:c+'22', color:c, display:'inline-block', padding:'2px 10px', borderRadius:20, fontSize:12, fontWeight:700, marginRight:4, marginBottom:4 } as React.CSSProperties),
};

export default async function AiGuidePage() {
  const apiKey = await getApiKey();

  return (
    <div style={{ background:'#f8fafc', minHeight:'100vh' }}>
      <Navbar />
      <main style={{ maxWidth:900, margin:'0 auto', padding:'100px 24px 80px' }}>

        {/* 헤더 */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🤖</div>
          <h1 style={{ fontSize:32, fontWeight:900, color:'#0f172a', marginBottom:8 }}>YNK AI 제품 등록 가이드</h1>
          <p style={{ fontSize:16, color:'#64748b' }}>Claude 등 AI에게 이 페이지 링크를 공유하고 제품 등록을 자동화하세요</p>
          <div style={{ marginTop:16, display:'inline-block', background:'#fef3c7', border:'1px solid #fde68a', borderRadius:10, padding:'10px 20px', fontSize:13, color:'#92400e' }}>
            ⚠️ API 키는 외부에 노출되지 않도록 주의하세요
          </div>
        </div>

        {/* API 정보 */}
        <div style={S.card}>
          <h2 style={S.h2}>🔗 API 엔드포인트</h2>
          <code style={S.code}>{`POST ${API_BASE}/api/products/register
Content-Type: application/json
Authorization: Bearer {API_KEY}`}</code>
          {apiKey && (
            <div style={{ marginTop:16, padding:'14px 18px', background:'#f0fdf4', borderRadius:10, border:'1px solid #bbf7d0' }}>
              <div style={{ fontSize:12, color:'#166534', fontWeight:700, marginBottom:4 }}>🔑 현재 API 키</div>
              <code style={{ fontSize:14, color:'#0f172a', fontFamily:'monospace', wordBreak:'break-all' }}>{apiKey}</code>
            </div>
          )}
        </div>

        {/* AI에게 주는 지시문 */}
        <div style={S.card}>
          <h2 style={S.h2}>📋 AI 지시문 (복사해서 사용)</h2>
          <p style={{ fontSize:13, color:'#64748b', marginBottom:12 }}>아래 내용을 Claude에게 전달하면 제품을 자동 등록합니다:</p>
          <code style={{ ...S.code, background:'#1e293b', color:'#bfdbfe' }}>{`당신은 YNK LED 조명회사의 제품 등록 담당자입니다.
제공된 제품 사진, 데이터시트, 카탈로그를 분석하여 아래 API로 제품을 등록하세요.

API: POST ${API_BASE}/api/products/register
Authorization: Bearer ${apiKey || '{API_KEY}'}
Content-Type: application/json

규칙:
1. description은 한국어로 작성 (200~400자)
2. 제품 특징 3~5가지를 HTML <ul><li> 형식으로 포함
3. 제공된 이미지는 Cloudinary URL 그대로 사용
4. 스펙은 제공된 데이터에서 추출, 없으면 생략
5. 카테고리는 아래 유효값 중 하나만 사용
6. 등록 완료 후 product id와 이름을 알려주세요

[상세 규칙은 이 페이지 참조: ${API_BASE}/ai-guide]`}</code>
        </div>

        {/* 카테고리 */}
        <div style={S.card}>
          <h2 style={S.h2}>📂 카테고리 (category)</h2>
          <p style={{ fontSize:13, color:'#64748b', marginBottom:14 }}>반드시 아래 값 중 하나를 사용해야 합니다:</p>
          <div>
            {[
              { value:'smart',        label:'스마트조명', desc:'IoT/스마트홈 연동 조명' },
              { value:'indoor',       label:'실내조명',   desc:'사무실, 매장, 공장 실내' },
              { value:'home_lighting',label:'홈조명',     desc:'가정용 인테리어 조명' },
              { value:'commercial',   label:'상업조명',   desc:'호텔, 백화점, 쇼핑몰' },
              { value:'industrial',   label:'산업조명',   desc:'공장, 창고, 산업시설' },
              { value:'outdoor',      label:'실외조명',   desc:'가로등, 외벽, 주차장' },
              { value:'landscape',    label:'경관조명',   desc:'건물 외관, 조경, 야간경관' },
              { value:'special',      label:'특수조명',   desc:'방폭, 의료, 농업 등 특수목적' },
            ].map(c => (
              <div key={c.value} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #f1f5f9' }}>
                <code style={{ background:'#0f172a', color:'#34d399', padding:'3px 10px', borderRadius:6, fontSize:13, fontFamily:'monospace', minWidth:140 }}>{c.value}</code>
                <span style={{ fontWeight:700, color:'#0f172a', minWidth:80 }}>{c.label}</span>
                <span style={{ fontSize:13, color:'#64748b' }}>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 스펙 필드 */}
        <div style={S.card}>
          <h2 style={S.h2}>⚙️ 스펙 필드 (specs)</h2>
          <p style={{ fontSize:13, color:'#64748b', marginBottom:14 }}>specs 객체에 사용 가능한 키 목록. 해당하는 것만 포함하면 됩니다:</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:8 }}>
            {[
              { key:'power',         label:'소비전력',    unit:'W' },
              { key:'luminous_flux', label:'광속',        unit:'lm' },
              { key:'efficacy',      label:'광효율',      unit:'lm/W' },
              { key:'color_temp',    label:'색온도',      unit:'K' },
              { key:'cri',           label:'연색지수 CRI',unit:'Ra' },
              { key:'beam_angle',    label:'배광각',      unit:'°' },
              { key:'ip_rating',     label:'IP 등급',     unit:'' },
              { key:'input_voltage', label:'입력전압',    unit:'V' },
              { key:'power_factor',  label:'역률',        unit:'PF' },
              { key:'thd',           label:'THD',         unit:'%' },
              { key:'lifespan',      label:'수명',        unit:'hrs' },
              { key:'size',          label:'크기',        unit:'mm' },
              { key:'weight',        label:'중량',        unit:'kg' },
              { key:'operating_temp',label:'작동온도',    unit:'°C' },
              { key:'warranty',      label:'보증기간',    unit:'' },
              { key:'driver',        label:'드라이버',    unit:'' },
            ].map(f => (
              <div key={f.key} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:'#f8fafc', borderRadius:8, border:'1px solid #e2e8f0' }}>
                <code style={{ fontSize:12, color:'#0369a1', fontFamily:'monospace' }}>{f.key}</code>
                <span style={{ fontSize:12, color:'#475569' }}>{f.label}</span>
                {f.unit && <span style={{ fontSize:11, color:'#94a3b8', marginLeft:'auto' }}>{f.unit}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* 문서 타입 */}
        <div style={S.card}>
          <h2 style={S.h2}>📄 문서 타입 (documents[].type)</h2>
          <div style={{ display:'flex', flexWrap:'wrap' as const, gap:8 }}>
            {[
              { value:'datasheet', label:'데이터시트' },
              { value:'manual',    label:'설치 매뉴얼' },
              { value:'cert',      label:'인증서' },
              { value:'drawing',   label:'도면/CAD' },
              { value:'other',     label:'기타 문서' },
            ].map(d => (
              <div key={d.value} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:8 }}>
                <code style={{ fontSize:13, color:'#0369a1', fontFamily:'monospace' }}>{d.value}</code>
                <span style={{ fontSize:12, color:'#475569' }}>— {d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 완성 예시 */}
        <div style={S.card}>
          <h2 style={S.h2}>✅ 요청 예시 (JSON)</h2>
          <code style={S.code}>{`{
  "name": "YNK Pro-200 LED 고천장등",
  "category": "industrial",
  "manufacturer": "YNK",
  "badge": "신제품",
  "description": "YNK Pro-200은 산업용 고천장 공간을 위해 설계된 고효율 LED 조명입니다.\\n높은 광효율(150lm/W)과 IP65 방진방수 등급으로 공장, 창고, 물류센터에 최적화되어 있습니다.\\n\\n<ul><li>업계 최고 수준의 광효율 150lm/W</li><li>IP65 방진방수로 혹독한 환경에서도 안정적 운용</li><li>50,000시간 장수명으로 유지보수 비용 절감</li><li>순간 점등 기능, 플리커 프리 설계</li></ul>",
  "image": "https://res.cloudinary.com/xxx/image/upload/v1/ynk-products/pro200-main.jpg",
  "images": [
    "https://res.cloudinary.com/xxx/image/upload/v1/ynk-products/pro200-main.jpg",
    "https://res.cloudinary.com/xxx/image/upload/v1/ynk-products/pro200-detail.jpg"
  ],
  "specs": {
    "power": "200W",
    "luminous_flux": "30,000lm",
    "efficacy": "150lm/W",
    "color_temp": "5000K",
    "cri": "Ra ≥ 80",
    "beam_angle": "120°",
    "ip_rating": "IP65",
    "input_voltage": "AC 100-277V",
    "lifespan": "50,000hrs",
    "size": "φ400 × H120mm",
    "weight": "3.5kg",
    "warranty": "3년"
  },
  "documents": [
    { "name": "YNK Pro-200 데이터시트", "url": "https://...", "type": "datasheet" },
    { "name": "설치 매뉴얼",           "url": "https://...", "type": "manual" }
  ],
  "featured": false
}`}</code>
        </div>

        {/* description 작성 룰 */}
        <div style={S.card}>
          <h2 style={S.h2}>✍️ 제품 설명 작성 규칙 (description)</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { title:'언어', content:'한국어 (전문적이고 간결한 어투)' },
              { title:'길이', content:'200~400자 (HTML 태그 포함)' },
              { title:'구조', content:'1~2줄 개요 → <ul><li> 특징 3~5개' },
              { title:'강조', content:'수치와 성능 수치를 구체적으로 기재' },
              { title:'금지', content:'과장 표현, 불확실한 수치, 경쟁사 언급' },
              { title:'용도', content:'적용 환경/공간을 반드시 포함' },
            ].map(r => (
              <div key={r.title} style={{ padding:'12px 16px', background:'#f8fafc', borderRadius:10, border:'1px solid #e2e8f0' }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#0369a1', marginBottom:4 }}>{r.title}</div>
                <div style={{ fontSize:13, color:'#334155' }}>{r.content}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 응답 형식 */}
        <div style={S.card}>
          <h2 style={S.h2}>📤 응답 형식</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#166534', marginBottom:8 }}>✅ 성공 (201)</div>
              <code style={{ ...S.code, fontSize:12 }}>{`{
  "success": true,
  "message": "제품 \\"이름\\" 등록 완료",
  "product": {
    "id": "uuid",
    "name": "제품명",
    "category": "카테고리"
  }
}`}</code>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#991b1b', marginBottom:8 }}>❌ 오류 (400/401/500)</div>
              <code style={{ ...S.code, fontSize:12 }}>{`{
  "error": "오류 메시지",
  "valid_values": [...]
  // 카테고리 오류 시 제공
}`}</code>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
