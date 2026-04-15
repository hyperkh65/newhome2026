'use client';
import React from 'react';
import ControllerManualInteractive from '@/components/ControllerManualInteractive';
import ManualSidebar from '@/components/ManualSidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ControllerManualPage() {
  const pageUrl = "https://newhome2026.vercel.app/controller1";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${pageUrl}`;

  return (
    <main style={{ minHeight: '100vh', background: '#0f172a' }}>
      <Navbar />
      <ManualSidebar />
      <div style={{ padding: '80px 20px' }}>
      
      {/* Header with QR Code for Mobile Access */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 40px auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
            지능형 컨트롤러 기술 매뉴얼
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '18px' }}>
            MPPT 고효율 고출력 전력 제어 및 스마트 디밍 센서 프로토콜
          </p>
        </div>
        
        <div style={{ 
          background: '#fff', 
          padding: '16px', 
          borderRadius: '16px', 
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <img src={qrUrl} alt="QR Code for Mobile Access" width={120} height={120} />
          <p style={{ color: '#0f172a', fontSize: '12px', fontWeight: 700, marginTop: '8px' }}>모바일로 보기</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <ControllerManualInteractive />
      </div>
      </div>
      <Footer />
    </main>
  );
}
