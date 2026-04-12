import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function sb() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

// 관리자용: 전체 목록 (비공개 포함, 비밀번호 포함)
export async function GET() {
  const { data, error } = await sb().from('catalogs').select('*').order('order_num').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
