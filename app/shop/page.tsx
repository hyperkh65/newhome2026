import { Suspense } from 'react';
import ShopContent from './ShopContent';

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111827', fontFamily: 'Inter, sans-serif' }}>로딩 중...</div>}>
      <ShopContent />
    </Suspense>
  );
}
