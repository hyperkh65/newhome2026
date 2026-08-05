'use client';
import dynamic from 'next/dynamic';

const PortCongestionWidget = dynamic(() => import('@/components/PortCongestionWidget'), { ssr: false });

export default function ClientWidgets() {
  return <PortCongestionWidget />;
}
