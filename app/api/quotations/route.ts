import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function auth(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  const pw = process.env.NEXT_PUBLIC_ADMIN_PW || '';
  return !!(token && pw && token === pw);
}

async function generateQuoteNo(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `YNK-RFQ-${year}-`;
  const { count } = await supabase
    .from('bossai_quotations')
    .select('*', { count: 'exact', head: true })
    .like('quote_no', `${prefix}%`);
  const next = ((count ?? 0) + 1).toString().padStart(3, '0');
  return `${prefix}${next}`;
}

export async function GET() {
  const { data, error } = await supabase
    .from('bossai_quotations')
    .select('id, quote_no, supplier_company, updated_at')
    .order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const quoteNo = await generateQuoteNo();
  const saveData = { ...body, quoteNo };
  const { data, error } = await supabase
    .from('bossai_quotations')
    .insert({ quote_no: quoteNo, supplier_company: body.supplier?.company || '', data: saveData })
    .select('id, quote_no, supplier_company, updated_at')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
