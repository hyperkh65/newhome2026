'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/store';
import QuotationContent from '@/components/QuotationContent';

export default function AdminQuotationPage() {
  const router = useRouter();
  const isLoggedIn = useAdminStore(s => s.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) router.push('/admin/login');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return <QuotationContent />;
}
