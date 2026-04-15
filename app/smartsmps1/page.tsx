import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ManualSidebar from '@/components/ManualSidebar';
import SmartSMPSManual from '@/components/SmartSMPSManual';
import SmartDimmingInteractive from '@/components/SmartDimmingInteractive';
import { Cpu } from 'lucide-react';

export default function SmartSMPSPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--white)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <ManualSidebar />

      {/* Hero Header Section */}
      <section style={{ padding: '160px 24px 80px', background: 'var(--white)', borderBottom: '1px solid var(--gray-200)', textAlign: 'center', position: 'relative' }}>
        
        {/* 우측 상단 모바일 QR 코드 유도 */}
        <div style={{ position: 'absolute', right: '40px', top: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: 'var(--white)', padding: '16px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--gray-200)', zIndex: 10 }}>
           <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://newhome2026.vercel.app/smartsmps1" alt="Mobile QR Code" width="100" height="100" style={{ display: 'block', borderRadius: '8px' }} />
           <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>📷 모바일에서 보기 스캔</span>
        </div>

        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--gray-100)', borderRadius: 50, color: 'var(--gray-700)', fontWeight: 700, fontSize: 13, marginBottom: 24, border: '1px solid var(--gray-200)' }}>
            <Cpu size={16} color="#3b82f6" />
            <span>프리미엄 레벨 스마트 조명 기술 가이드</span>
          </div>

          <h1 style={{ fontSize: '48px', fontWeight: 900, color: 'var(--gray-900)', margin: '0 0 24px 0', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            스마트 LED 제품 및 <br />
            <span style={{ color: '#3b82f6' }}>초정밀 디밍 제어 시스템 완벽 실무 가이드</span>
          </h1>
          
          <p style={{ fontSize: '20px', color: 'var(--gray-600)', margin: '0 auto 40px auto', maxWidth: 700, lineHeight: 1.6, fontWeight: 500 }}>
            단순한 원리를 넘어 현업 설계자와 SI 시스템 통합 전문가를 위한 실무 기반 하드웨어 및 제어 프로토콜 딥다이브 교육 자료입니다.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '80px 24px 120px', background: 'var(--gray-50)', flex: 1 }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '60px' }}>
          
          {/* Interactive and Easy Version (For Elementary Level) */}
          <SmartDimmingInteractive />

          {/* Professional Data view */}
          <SmartSMPSManual />
          
        </div>
      </section>

      <Footer />
    </main>
  );
}
