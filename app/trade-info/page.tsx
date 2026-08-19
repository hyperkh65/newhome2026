'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ScrollReveal } from '@/components/LuminaAnimation';

const TABS = [
  { id: 'overview', label: '📋 업무 개요' },
  { id: 'order', label: '📦 발주 프로세스' },
  { id: 'import', label: '🚢 수입 절차' },
  { id: 'docs', label: '📑 서류 & 인증' },
  { id: 'customs', label: '🏛️ 통관 & 세관' },
  { id: 'delivery', label: '🚛 내륙 운송' },
];

const CARD = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
  <div style={{ background: 'var(--white)', padding: 36, borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.05)', border: '1px solid var(--gray-200)', marginBottom: 28 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 18, borderBottom: '2px solid var(--gray-100)' }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gray-900)' }}>{title}</h2>
    </div>
    {children}
  </div>
);

const TABLE = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', marginTop: 16 }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ background: 'var(--primary)', color: 'white' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? 'var(--gray-50)' : 'var(--white)', borderBottom: '1px solid var(--gray-100)' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '12px 16px', color: 'var(--gray-700)', lineHeight: 1.6, verticalAlign: 'top' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BADGE = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: color === 'blue' ? 'rgba(14,165,233,0.1)' : color === 'green' ? 'rgba(34,197,94,0.1)' : color === 'orange' ? 'rgba(249,115,22,0.1)' : 'rgba(168,85,247,0.1)', color: color === 'blue' ? '#0284c7' : color === 'green' ? '#16a34a' : color === 'orange' ? '#ea580c' : '#7c3aed' }}>
    {children}
  </span>
);

const TIP = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderLeft: '4px solid var(--primary)', borderRadius: 10, padding: '14px 18px', marginTop: 14, fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.7 }}>
    💡 {children}
  </div>
);

const WARN = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderLeft: '4px solid #f97316', borderRadius: 10, padding: '14px 18px', marginTop: 14, fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.7 }}>
    ⚠️ {children}
  </div>
);

export default function TradeInfoPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="trade-info-page" style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      <Navbar />

      <div style={{ paddingTop: 100 }}>
        {/* Header */}
        <section style={{ padding: '60px 24px 0', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', color: 'white' }}>
          <div className="container" style={{ textAlign: 'center', paddingBottom: 0 }}>
            <ScrollReveal>
              <div style={{ display: 'inline-block', padding: '6px 18px', background: 'rgba(14,165,233,0.2)', borderRadius: 20, fontSize: 13, fontWeight: 700, color: '#7dd3fc', marginBottom: 20, letterSpacing: 1 }}>
                YNK 수입 매뉴얼 — 한국 특화 무역·통관 지침서
              </div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
                LED 조명 수입 · 인증 · 통관<br />완전 정복 가이드
              </h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 680, margin: '0 auto 32px', lineHeight: 1.7 }}>
                중국 제조사 OEM 제품을 국내에 수입하는 전 과정 — 발주부터 내륙 운송까지.<br />
                초보자도 한눈에, 전문가도 놓치지 않는 실전 지침서
              </p>
            </ScrollReveal>

            {/* Tabs */}
            <div className="trade-info-tabs" style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', paddingBottom: 0 }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 20px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, borderRadius: '12px 12px 0 0', transition: 'all 0.2s',
                    background: activeTab === tab.id ? 'var(--gray-50)' : 'rgba(255,255,255,0.08)',
                    color: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.7)',
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: '48px 24px 80px' }}>
          <div className="container" style={{ maxWidth: 900 }}>

            {/* ─── 업무 개요 ─── */}
            {activeTab === 'overview' && (
              <ScrollReveal>
                <CARD icon="🏭" title="YNK 수입 업무란?">
                  <p style={{ fontSize: 16, color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: 20 }}>
                    (주)와이앤케이는 국내 업체로부터 발주를 받아 <strong>중국 제조사가 만든 OEM 제품을 국내에 수입</strong>하는 업무를 주로 합니다.
                    주요 수입품으로는 <strong>조명 기기(LED벌브, LED등기구)</strong>와 컨버터 등이 있습니다.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                    {[
                      { icon: '📥', title: '발주 접수', desc: '국내 업체로부터 발주서 수취 후 해외 공장에 전달' },
                      { icon: '🚢', title: '수입 진행', desc: '포워더 부킹 → 선적 서류 검토 → 관세사 신고' },
                      { icon: '🏛️', title: '통관 처리', desc: '수입 신고 수리 → 세관 검사 → 면장 수령' },
                      { icon: '🚛', title: '내륙 운송', desc: '운송사 배차 → 창고 또는 고객사로 납품' },
                    ].map(item => (
                      <div key={item.title} style={{ background: 'var(--gray-50)', padding: 20, borderRadius: 14, border: '1px solid var(--gray-200)', textAlign: 'center' }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--gray-800)' }}>{item.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </CARD>

                <CARD icon="📊" title="수입 방식 선택 기준">
                  <TABLE
                    headers={['방식', '적용 기준', '특징 및 주의사항']}
                    rows={[
                      ['20FT 컨테이너', '약 30 CBM 내외', '중소량 단독 컨테이너. 가성비 우수'],
                      ['40FT 컨테이너', '약 70 CBM 내외', '대량 수입 시 활용. 단위당 운임 최저'],
                      ['LCL (혼재화물)', '0~10 CBM 소량', '작업비 별도 발생, 프리타임 없음. 소량 수입 시 선택'],
                      ['Ferry (페리)', '5 CBM 이하', '비용 높지만 5CBM 이하일 때 합리적. 반입 후 1주일 프리타임 제공. 인천 입항만 가능'],
                    ]}
                  />
                  <TIP>
                    인코텀즈(Incoterms) 확인 필수 — 예: 상해→인천, 40FT, FOB 조건. ETD(출항일)와 ETA(입항일)를 항상 함께 확인하세요.
                  </TIP>
                </CARD>
              </ScrollReveal>
            )}

            {/* ─── 발주 프로세스 ─── */}
            {activeTab === 'order' && (
              <ScrollReveal>
                <CARD icon="📦" title="발주서 확인 및 전달 업무">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderLeft: '3px solid var(--primary)', paddingLeft: 24 }}>
                    {[
                      {
                        step: 'STEP 1', title: '국내 업체 발주서 수취',
                        desc: '고객사(국내 업체)로부터 발주서를 접수합니다.',
                        detail: []
                      },
                      {
                        step: 'STEP 2', title: '해외 업체(공장)에 발주서 전달',
                        desc: '중국 제조사(공장)에 발주 내용을 전달합니다.',
                        detail: [
                          '발주가 YNK로 나온 경우 → YNK에서 발행한 PI를 해외 업체에 전달',
                          '해외 업체로 직접 발주를 진행하는 경우 → 해외 업체의 발주서를 그대로 전달',
                        ]
                      },
                      {
                        step: 'STEP 3', title: 'PI 확인 및 국내 업체 전달',
                        desc: '예상 생산 일정을 확인하고, 일정과 PI(Proforma Invoice)를 국내 업체에 전달합니다.',
                        detail: [
                          'PI에 쓰인 거래 조건을 양사 간 반드시 확인',
                          '확인의 의미로 명판적인 날인(직인/서명) 필요',
                        ]
                      },
                      {
                        step: 'STEP 4', title: 'PI 결제 조건에 따른 대금 지급',
                        desc: 'PI에 명시된 결제 조건에 따라 대금을 지급합니다.',
                        detail: [
                          '보증금(Deposit)이 명시된 경우 → 선지급 필요, 보증금은 보통 10~30%',
                          'MOQ(최소발주수량) 이하 발주 시 → 단가 상승 또는 추가 비용 발생 가능, 반드시 사전 해외 업체 확인',
                        ]
                      },
                    ].map((s, i) => (
                      <div key={i} style={{ marginBottom: 32, position: 'relative' }}>
                        <div style={{ position: 'absolute', left: -36, top: 0, background: 'var(--primary)', color: 'white', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>
                          {s.step}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--gray-900)', marginBottom: 6 }}>{s.title}</div>
                        <div style={{ fontSize: 15, color: 'var(--gray-600)', marginBottom: 10, lineHeight: 1.6 }}>{s.desc}</div>
                        {s.detail.length > 0 && (
                          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {s.detail.map((d, j) => (
                              <li key={j} style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 }}>{d}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </CARD>
              </ScrollReveal>
            )}

            {/* ─── 수입 절차 ─── */}
            {activeTab === 'import' && (
              <ScrollReveal>
                <CARD icon="🚢" title="수입 업무 기본 절차">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                    {[
                      {
                        n: '01', title: '출하 일정 확인 (Cargo Ready Date)',
                        items: [
                          '해외 업체(공장)에 Cargo ready date(출하 가능일)를 확인',
                          '수입 일정 계획의 시작점 — 이 날짜 기준으로 포워더 부킹 일정을 잡음',
                        ]
                      },
                      {
                        n: '02', title: '포워더에 스케줄 부킹 요청',
                        items: [
                          '수입은 기본 해상 운송 (긴급 건은 항공 가능하나 비용 매우 높음)',
                          '항로·선적품 크기·인코텀즈를 확인 후 부킹 요청 (예: 상해→인천, 40FT, FOB)',
                          '선적품 CBM 확인 후 컨테이너/LCL/Ferry 방식 결정',
                          'ETD(출항일), ETA(입항일) 확인',
                        ]
                      },
                      {
                        n: '03', title: '선적 서류 검토',
                        items: [
                          '쉬퍼(해외 공장)가 BL, CI/PL, CO 기본 서류 제공',
                          '전체 서류의 내용(수량·금액·품명 등)이 일치하는지 반드시 검토',
                          'BL 전달이 늦어질 경우 포워더에 요청하면 수령 가능',
                          '수입 제품에 따라 요건 서류 추가 요구 가능 (KC인증, KS인증, 방송통신기자재 적합성평가확인서 등)',
                        ]
                      },
                      {
                        n: '04', title: '관세사에 수입 신고 서류 전달',
                        items: [
                          '적재화물목록(적하목록) 제출 완료 후 수입 신고 가능',
                          '유니패스(Unipass)에서 적하목록 제출 여부 확인: customs.go.kr',
                          '확인 경로: 유니패스 접속 → 통관단일창구 → 정보관리 → 수입화물진행정보 → H/BL칸에 BL번호 입력',
                          '서류 전달 후 관세사가 수입 신고 진행 → "예상경비 청구서" 수령',
                          '예상경비 송금 완료 후 수입 신고 수리 → 관세사가 면장·정산서류 전달',
                        ]
                      },
                      {
                        n: '05', title: '운송사 배차 요청',
                        items: [
                          '운송 시 운송사에 DO(화물인도지시서)와 면장 제출 필요',
                          'DO는 포워더로부터 수령 (포워더에 운송 직접 요청도 가능)',
                          '익일 운송 희망 시 → 전날 오후 2시 전에 일정 전달 필수',
                        ]
                      },
                    ].map((s, i) => (
                      <div key={i} style={{ background: 'var(--gray-50)', padding: 24, borderRadius: 16, border: '1px solid var(--gray-200)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                          <div style={{ width: 36, height: 36, background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, flexShrink: 0 }}>{s.n}</div>
                          <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--gray-900)' }}>{s.title}</div>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 7 }}>
                          {s.items.map((item, j) => (
                            <li key={j} style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65 }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CARD>
              </ScrollReveal>
            )}

            {/* ─── 서류 & 인증 ─── */}
            {activeTab === 'docs' && (
              <ScrollReveal>
                <CARD icon="📑" title="기본 선적 서류 (모든 수입건 공통)">
                  <TABLE
                    headers={['서류명', '영문약칭', '설명']}
                    rows={[
                      ['선하증권', 'BL (Bill of Lading)', '해상 화물의 소유권을 증명하는 핵심 서류. 포워더로부터 수령'],
                      ['상업송장', 'CI (Commercial Invoice)', '거래 가격·수량·품목 등이 기재된 거래 명세서'],
                      ['포장명세서', 'PL (Packing List)', '포장별 내용물·수량·무게·부피 명세서'],
                      ['원산지증명서', 'CO (Certificate of Origin)', '제품의 생산국을 증명. FTA 혜택 적용 시 필수'],
                      ['포워더 운임 인보이스', 'INVOICE', '포워더가 발행하는 운임 청구서'],
                    ]}
                  />
                  <TIP>모든 서류의 수량·금액·품명·중량이 일치하는지 반드시 대조 검토 후 관세사에 전달하세요.</TIP>
                </CARD>

                <CARD icon="🔖" title="국내 필수 인증 요건 서류 (한국 특화)">
                  <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 20 }}>
                    수입 제품의 종류에 따라 아래 요건 서류를 추가로 준비해야 합니다. 관세사에 전달 시 기본 선적 서류와 함께 제출합니다.
                  </p>
                  <TABLE
                    headers={['구분', '발급 방법', '소요 시간 / 유의사항']}
                    rows={[
                      ['KS 인증 대상', '별도 확인서 발급 없이 KS 인증서 스캔본 제출', '즉시 — 인증서 스캔본 보유 필수'],
                      ['안전 인증 대상\n(KC 등)', '유트레이드허브 로그인 → 확인서 발급\nwww.utradehub.or.kr', '약 1시간 이상 소요\n사전에 여유 있게 발급 신청'],
                      ['전자파 인증 대상\n(방통위)', '유니패스 로그인 → 확인서 발급\nunipass.customs.go.kr/csp', '즉시 (약 5분 소요)\n유니패스 계정 필요'],
                      ['비인증 대상 제품', '관세사가 별도 사유서 제출 요구 가능', '정해진 양식 없음\n관세사와 사전 협의'],
                      ['요건면제확인서\n(샘플 수입)', '품목별 5개 이하 샘플 수입 시 사용\n수출 목적 수입: 관할 시청 발급', '시청별 요건서류 상이\n발급 전 각 시청에 문의 필수'],
                    ]}
                  />
                  <WARN>
                    인증 대상 제품이나 인증을 미취득한 경우, 반드시 요건면제확인서를 발급받아야 합니다. 미제출 시 수입 신고가 수리되지 않습니다.
                  </WARN>

                  <div style={{ marginTop: 24, padding: 20, background: 'rgba(14,165,233,0.04)', borderRadius: 14, border: '1px solid rgba(14,165,233,0.15)' }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--gray-800)', marginBottom: 12 }}>📌 HS코드별 요건 서류 확인 방법</div>
                    <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7, margin: 0 }}>
                      관세법령정보포털(CLIP) → 세계HS → 상단 검색란에 품목명 또는 HS코드 입력하여 검색<br />
                      🔗 customs.go.kr (관세법령정보포털 CLIP)
                    </p>
                  </div>
                </CARD>

                <CARD icon="📋" title="수입 서류 검토 주체별 역할">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    <div style={{ padding: 20, background: 'rgba(14,165,233,0.05)', borderRadius: 14, border: '1px solid rgba(14,165,233,0.15)' }}>
                      <div style={{ fontWeight: 800, marginBottom: 10, color: 'var(--primary)' }}>📌 YNK가 수하인(Consignee)인 경우</div>
                      <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7, margin: 0 }}>
                        YNK가 직접 수입 신고 서류를 검토 및 수정합니다.
                      </p>
                    </div>
                    <div style={{ padding: 20, background: 'rgba(59,130,246,0.05)', borderRadius: 14, border: '1px solid rgba(59,130,246,0.15)' }}>
                      <div style={{ fontWeight: 800, marginBottom: 10, color: '#2563eb' }}>📌 YNK가 국내 에이전트인 경우</div>
                      <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7, margin: 0 }}>
                        해외 업체(화주/Shipper)의 국내 에이전트로서 고객사(국내 업체)를 대신하여 서류 검토·수정을 담당. 일부 업체에 한해 서류 전달도 담당합니다.
                      </p>
                    </div>
                  </div>
                </CARD>
              </ScrollReveal>
            )}

            {/* ─── 통관 & 세관 ─── */}
            {activeTab === 'customs' && (
              <ScrollReveal>
                <CARD icon="🏛️" title="수입 신고 종류">
                  <TABLE
                    headers={['신고 종류', '내용 및 시점', '비고']}
                    rows={[
                      ['입항전신고', '물품이 CY(컨테이너 야드)에 반입되기 전 수입신고 수리\n적재화물목록 제출 직후 수입 신고 시작', '검색기 대상 여부 확인 전에 신고 시작'],
                      ['부두직통관', '물품이 CY에 반입된 후 수입신고 수리\n하선신고 수리 후 수입 신고 시작', '하선신고 수리 시 검색기 대상 여부 확인 가능'],
                      ['반입후통관', '물품이 CY에 반입된 후 수입신고 수리\n반입신고 후 수입 신고 시작', '일반적으로 가장 많이 사용'],
                      ['임시개청', '개청 시간 외 통관·보세운송 절차 진행 필요 시\n사전에 임시 개청 진행 통보서 제출 후 절차 진행', '토요일 수입신고 시 사용\n관세사에 사전 요청 필수'],
                    ]}
                  />
                  <TIP>
                    하선신고 수리 시 유니패스 사이트에서 검색기 대상 여부를 확인할 수 있습니다. 검색기 대상 = 검색기 검사 대상.
                  </TIP>
                </CARD>

                <CARD icon="💰" title="관세사 서류 전달 & 예상경비">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 18, background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-200)' }}>
                      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>① 서류 전달 절차</div>
                      <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <li style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65 }}>기본 선적 서류 (BL, CI, PL, CO, 운임인보이스) 준비</li>
                        <li style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65 }}>품목별 요건 서류 추가 준비 (KC인증서, 적합성평가확인서 등)</li>
                        <li style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65 }}>관세사에 일괄 전달 → 관세사가 서류 검토 후 수입 신고 진행</li>
                        <li style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65 }}>"예상경비 청구서" 수령 → 해당 금액 즉시 송금</li>
                        <li style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65 }}>수입 신고 수리 완료 → 관세사가 면장 + 정산서류 전달</li>
                      </ol>
                    </div>
                    <WARN>
                      예상경비 청구서 금액을 송금하지 않으면 수입 신고가 수리되지 않습니다. 외근 등으로 송금이 어려울 경우 관세사에 선납 요청이 가능합니다.
                    </WARN>
                    <TIP>
                      수입 신고 완료 후 프리타임과 관계없이 <strong>15일 이내</strong>에 창고에서 반출해야 합니다.
                      긴급 건이 아니라면 수입 신고 수리를 서두를 필요 없습니다.
                      단, <strong>부산항은 반출기한 연장이 비교적 쉬우나, 인천항은 거의 불가능</strong>하므로 주의하세요.
                    </TIP>
                    <div style={{ padding: 16, background: 'rgba(14,165,233,0.05)', borderRadius: 12, border: '1px solid rgba(14,165,233,0.15)', fontSize: 14, color: 'var(--gray-700)' }}>
                      <strong>📌 적용 환율:</strong> 수입 신고 시의 환율은 <strong>신고일 기준</strong>으로 적용됩니다.
                    </div>
                  </div>
                </CARD>

                <CARD icon="🔍" title="세관 검사 종류 및 대응">
                  <TABLE
                    headers={['검사 종류', '확인 방법', '대응 요령']}
                    rows={[
                      ['검색기 검사', '하선신고 수리 후 유니패스에서 BL번호 입력하여 확인', '물리적 검사 없음. X-ray 스캔 방식으로 진행'],
                      ['협업검사', '정식 통관 진행 후 관세사가 통보', '확인 요청 시 상황에 맞는 자료 제공하며 대응'],
                    ]}
                  />
                  <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ padding: 16, background: 'rgba(249,115,22,0.06)', borderRadius: 12, border: '1px solid rgba(249,115,22,0.15)', fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.7 }}>
                      ⚠️ <strong>협업검사 대비 필수 사항:</strong> 쉬퍼(해외 공장)에게 선적되는 모든 물품을 <strong>1개씩 컨테이너 문 쪽에 배치</strong>해달라고 사전 요청해야 합니다. (공문 첨부 권장)
                    </div>
                    <TIP>
                      협업검사 시 특정 제품 실물 확인을 요청하는 경우가 있습니다. 그때그때 상황에 맞는 자료(인증서, 시험성적서 등)를 즉시 제공할 수 있도록 사전 준비하세요.
                    </TIP>
                  </div>
                </CARD>

                <CARD icon="🌐" title="유니패스(Unipass) 활용 가이드">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    {[
                      { title: '수입화물 진행현황 확인', steps: ['유니패스 접속 (customs.go.kr)', '통관단일창구 → 정보관리', '수입화물진행정보 선택', 'H/BL칸에 BL번호 입력'] },
                      { title: '전자파 인증 확인서 발급', steps: ['유니패스 로그인', 'CSP 메뉴 접속', '확인서 발급 신청', '즉시 발급 (약 5분 소요)'] },
                      { title: '검색기 대상 여부 확인', steps: ['하선신고 수리 후 확인 가능', '유니패스 BL번호 입력', '검색기 대상 = 검색기 검사', '입항전신고: 수리 전에 신고 시작'] },
                    ].map((item, i) => (
                      <div key={i} style={{ padding: 18, background: 'var(--gray-50)', borderRadius: 12, border: '1px solid var(--gray-200)' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)', marginBottom: 12 }}>📌 {item.title}</div>
                        <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {item.steps.map((s, j) => <li key={j} style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>{s}</li>)}
                        </ol>
                      </div>
                    ))}
                  </div>
                </CARD>
              </ScrollReveal>
            )}

            {/* ─── 내륙 운송 ─── */}
            {activeTab === 'delivery' && (
              <ScrollReveal>
                <CARD icon="🚛" title="내륙 운송 프로세스">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 14, border: '1px solid var(--gray-200)' }}>
                      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>배차 요청 절차</div>
                      <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <li style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65 }}>운송사에 <strong>DO(화물인도지시서)</strong>와 <strong>면장</strong> 제출 → DO는 포워더로부터 수령</li>
                        <li style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65 }}>포워더에 운송 진행을 직접 요청하는 것도 가능</li>
                        <li style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65 }}>익일 운송 희망 시 <strong>전날 오후 2시 전에 일정 전달</strong> 필수</li>
                        <li style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.65 }}>부산 컨테이너 진행 시, 배차 후 <strong>부곡 컨테이너 반납 가능 여부 확인</strong> 필요</li>
                      </ul>
                    </div>

                    <div style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 14, border: '1px solid var(--gray-200)' }}>
                      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>📊 운송 비용 관리</div>
                      <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7, margin: 0 }}>
                        월말 별도의 엑셀 파일에 진행된 운송건과 비용을 정리하여 관리합니다.
                        포워더와 운송사별로 구분하여 기록하고, 월별 비용 추이를 파악합니다.
                      </p>
                    </div>

                    <WARN>
                      수입 신고 수리 완료 후 <strong>15일 이내</strong>에 창고에서 반출해야 합니다.
                      인천항은 기한 연장이 거의 불가능하므로, 수입 신고 완료 후 즉시 운송 일정을 잡으세요.
                    </WARN>
                  </div>
                </CARD>

                <CARD icon="📝" title="항구별 특이사항">
                  <TABLE
                    headers={['항구', '특징', '주의사항']}
                    rows={[
                      ['인천항', 'Ferry 이용 시 인천 입항만 가능\n소량(5CBM 이하) Ferry 수입 시 반입 후 1주일 프리타임', '반출기한 연장 거의 불가능\n15일 내 반드시 반출'],
                      ['부산항', '40FT 대량 컨테이너 주로 활용\n부곡 컨테이너 반납 여부 사전 확인 필요', '반출기한 연장 비교적 용이\n배차 후 부곡 반납 가능 여부 확인'],
                    ]}
                  />
                </CARD>
              </ScrollReveal>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}
