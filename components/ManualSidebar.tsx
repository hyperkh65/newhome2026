'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const MANUALS = [
  { id: 'solar1', title: '1. 태양광 가로등 기초 및 유지보수', path: '/solar1' },
  { id: 'smartsmps1', title: '2. 스마트 LED SMPS 및 초정밀 디밍 설계 가이드', path: '/smartsmps1' },
  { id: 'solar3', title: '3. 배터리 용량 산출 및 셀 유지보수 실무', path: '/solar3' },
  { id: 'controller1', title: '4. 지능형 컨트롤러(MPPT) 설정 및 센싱 기술', path: '/controller1' },
  { id: 'mold1', title: '5. 정밀 금형 설계 및 사출·압출 실무 공정', path: '/mold1' },
  // ... 최소 10개 이상 추가될 예정
];

export default function ManualSidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        position: 'fixed',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 닫힘 상태 시 보이는 손잡이 부분 */}
      <div style={{
        background: '#0f172a',
        color: '#fff',
        padding: '20px 8px',
        borderTopRightRadius: '12px',
        borderBottomRightRadius: '12px',
        cursor: 'pointer',
        boxShadow: '4px 0 15px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid #334155',
        borderLeft: 'none',
        transition: 'all 0.3s ease',
        width: '40px'
      }}>
        <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '2px', fontWeight: 700, fontSize: '14px' }}>
          매뉴얼 모음
        </span>
        <span>👉</span>
      </div>

      {/* 펼침 상태 시 보이는 메뉴 영역 */}
      <div style={{
        width: isHovered ? '320px' : '0px',
        opacity: isHovered ? 1 : 0,
        overflow: 'hidden',
        background: '#ffffff',
        borderTopRightRadius: '16px',
        borderBottomRightRadius: '16px',
        boxShadow: '10px 0 30px rgba(0,0,0,0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: 'auto',
        maxHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: isHovered ? 'auto' : 'none',
        border: isHovered ? '1px solid var(--gray-200)' : 'none',
        borderLeft: 'none'
      }}>
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>📚 실무 매뉴얼</h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px', wordBreak: 'keep-all' }}>
            계속해서 추가될 예정입니다. 링크를 클릭하거나 우측 QR코드를 스캔하여 모바일에서 바로 확인해보세요.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MANUALS.map((manual) => {
              // 실제 프로덕션 환경의 URL 기반으로 QR코드 생성 (예시)
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://newhome2026.vercel.app${manual.path}`;

              return (
                <Link key={manual.id} href={manual.path} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--gray-50)',
                    border: '1px solid var(--gray-200)',
                    transition: 'border-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--gray-200)')}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155', flex: 1, paddingRight: '12px', wordBreak: 'keep-all' }}>
                      {manual.title}
                    </span>
                    <div style={{ padding: '4px', background: '#fff', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                      <img src={qrUrl} alt="QR Code" width={40} height={40} style={{ display: 'block' }} />
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {/* 향후 추가될 더미 슬롯 (시각적 채움용) */}
            {[2,3,4,5].map(num => (
              <div key={`dummy-${num}`} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--gray-50)',
                border: '1px dashed var(--gray-300)',
                opacity: 0.5
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#94a3b8' }}>
                  {num}. (업데이트 예정)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
