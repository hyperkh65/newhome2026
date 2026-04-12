import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function getKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
}

async function dbPost(table: string, body: object) {
  const key = getKey();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': key, 'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json', 'Prefer': 'return=representation',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) return { data: null, error: data };
  return { data: Array.isArray(data) ? data[0] : data, error: null };
}

async function dbPatch(table: string, id: string, body: object) {
  const key = getKey();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': key, 'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json', 'Prefer': 'return=representation',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) return { error: data };
  return { error: null };
}

async function dbGet(table: string, filters: Record<string, string>) {
  const key = getKey();
  const params = Object.entries(filters).map(([k,v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}&limit=1`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` },
  });
  const data = await res.json();
  if (!res.ok) return { data: null, error: data };
  return { data: Array.isArray(data) ? data[0] ?? null : data, error: null };
}

export async function POST(req: NextRequest) {
  try {
    const { type, name, email, phone, content, attachments, password } = await req.json();
    if (!name || !content || !password)
      return NextResponse.json({ error: '필수 항목을 입력하세요.' }, { status: 400 });

    const { data, error } = await dbPost('inquiries', {
      type, name, email, phone, content,
      attachments: attachments || [], password, status: 'pending',
    });

    if (error) return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
    return NextResponse.json({ id: data.id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const password = searchParams.get('password');
    const type = searchParams.get('type');
    if (!id || !password)
      return NextResponse.json({ error: '조회 정보 부족' }, { status: 400 });

    const filters: Record<string, string> = { id, password };
    if (type) filters.type = type;

    const { data, error } = await dbGet('inquiries', filters);
    if (error || !data) return NextResponse.json({ error: '조회 결과 없음' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, admin_reply, status } = await req.json();
    const update: Record<string, string> = { status: status || 'replied' };
    if (admin_reply) { update.admin_reply = admin_reply; update.replied_at = new Date().toISOString(); }

    const { error } = await dbPatch('inquiries', id, update);
    if (error) return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
