import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, email, phone, content, attachments, password } = body;

    if (!name || !content || !password) {
      return NextResponse.json({ error: '필수 항목을 입력하세요.' }, { status: 400 });
    }

    // Service role key: bypasses RLS and schema cache entirely
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const adminClient  = createClient(supabaseUrl, serviceKey);

    // Create table if not exists (runs as superuser)
    await adminClient.rpc('exec_sql', {
      sql: `CREATE TABLE IF NOT EXISTS inquiries (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        type text, name text NOT NULL, email text, phone text,
        content text NOT NULL, attachments jsonb DEFAULT '[]',
        password text NOT NULL, admin_reply text, replied_at timestamptz,
        status text DEFAULT 'pending', created_at timestamptz DEFAULT now()
      );`
    }).maybeSingle();

    const { data, error } = await adminClient
      .from('inquiries')
      .insert({ type, name, email, phone, content, attachments: attachments || [], password, status: 'pending' })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id       = searchParams.get('id');
    const password = searchParams.get('password');
    const type     = searchParams.get('type');

    if (!id || !password) {
      return NextResponse.json({ error: '조회 정보가 부족합니다.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const adminClient = createClient(supabaseUrl, serviceKey);

    const query = adminClient.from('inquiries').select('*').eq('id', id).eq('password', password);
    if (type) query.eq('type', type);

    const { data, error } = await query.single();
    if (error || !data) return NextResponse.json({ error: '조회 결과가 없습니다.' }, { status: 404 });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, admin_reply, status } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const adminClient = createClient(supabaseUrl, serviceKey);

    const update: any = { status: status || 'replied' };
    if (admin_reply) { update.admin_reply = admin_reply; update.replied_at = new Date().toISOString(); }

    const { error } = await adminClient.from('inquiries').update(update).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
