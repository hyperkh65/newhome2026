'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const MANUALS = [
  { id: 'solar1', title: '1. 태양광 가로등 실무 매뉴얼', path: '/solar1' },
  { id: 'smartsmps1', title: '2. 스마트 LED SMPS 및 초정밀 디밍 설계 가이드', path: '/smartsmps1' },
  { id: 'solar3', title: '3. 배터리 용량 산출 및 셀 유지보수 실무', path: '/solar3' },
  { id: 'controller1', title: '4. 지능형 컨트롤러(MPPT) 설정 및 센싱 기술', path: '/controller1' },
  { id: 'mold1', title: '5. 정밀 금형 설계 및 사출·압출 실무 공정', path: '/mold1' },
  { id: 'led-circuit1', title: '6. LED 모듈 직·병렬 설계 및 컨버터 매칭 실무', path: '/led-circuit1' },
  { id: 'led-chip1', title: '7. LED 칩 사양서 완전 정복: CRI·배광·수명 데이터 읽기', path: '/led-chip1' },
  { id: 'material1', title: '8. 실무 소재 사전: PC·ABS·ASA 및 비철금속 가공 가이드', path: '/material1' },
];

const PROMOTIONS = [
  { id: 'factory-highbay', title: 'UFO-AM6 150W: 18m 센서 공장등', path: '/promotion/factory-highbay' },
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
          콘텐츠
        </span>
        <span style={{ transform: isHovered ? 'scaleX(-1)' : 'none', transition: '0.3s', display: 'inline-block' }}>👉</span>
      </div>

      {/* 펼침 상태 시 보이는 메뉴 영역 */}
      <div style={{
        width: isHovered ? '340px' : '0px',
        opacity: isHovered ? 1 : 0,
        overflow: 'hidden',
        background: '#ffffff',
        borderTopRightRadius: '16px',
        borderBottomRightRadius: '16px',
        boxShadow: '10px 0 30px rgba(0,0,0,0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: 'auto',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: isHovered ? 'auto' : 'none',
        border: isHovered ? '1px solid #e2e8f0' : 'none',
        borderLeft: 'none'
      }}>
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          
          {/* 매뉴얼 섹션 */}
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>📚 매뉴얼</h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', wordBreak: 'keep-all' }}>
            전문 기술 습득을 위한 엔지니어링 가이드
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            {MANUALS.map((manual) => (
              <Link key={manual.id} href={manual.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: '0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.background = '#f0fdf4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f8fafc';
                }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', flex: 1, wordBreak: 'keep-all' }}>
                    {manual.title}
                  </span>
                  <div style={{ padding: '4px', background: '#fff', borderRadius: '4px', border: '1px solid #e2e8f0', marginLeft: 10 }}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://newhome2026.vercel.app${manual.path}`} alt="QR" width={24} height={24} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 프로모션 섹션 */}
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>🚀 프로모션</h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px', wordBreak: 'keep-all' }}>
            최신 제품 홍보 및 인터랙티브 시연
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PROMOTIONS.map((promo) => (
              <Link key={promo.id} href={promo.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'linear-gradient(to right, #0f172a, #1e293b)',
                  border: '1px solid #334155',
                  transition: '0.2s',
                  color: '#fff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 700, flex: 1, wordBreak: 'keep-all' }}>
                    {promo.title}
                  </span>
                  <div style={{ padding: '4px', background: '#fff', borderRadius: '4px', marginLeft: 10 }}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://newhome2026.vercel.app${promo.path}`} alt="QR" width={24} height={24} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
