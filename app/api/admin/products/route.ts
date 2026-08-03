import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function checkAdminAuth(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token');
  const adminPw = process.env.NEXT_PUBLIC_ADMIN_PW || '';
  return !!(token && adminPw && token === adminPw);
}

// GET: 전체 제품 목록
export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

// POST: 제품 등록 (admin 전용)
export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: '관리자 인증 필요' }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: '잘못된 JSON' }, { status: 400 }); }

  const { name, category, description } = body as Record<string, string>;
  if (!name || !category || !description) {
    return NextResponse.json({ error: '필수 필드 누락: name, category, description' }, { status: 400 });
  }

  const product = {
    name,
    category,
    description,
    manufacturer: String(body.manufacturer ?? 'YNK'),
    badge:        String(body.badge ?? ''),
    image:        String(body.image ?? ''),
    images:       (body.images as string[]) ?? [],
    specs:        (body.specs as Record<string, string>) ?? {},
    documents:    (body.documents as unknown[]) ?? [],
    featured:     Boolean(body.featured ?? false),
    stock:        (body.stock as number) ?? null,
    rating:       (body.rating as number) ?? null,
    reviews:      (body.reviews as number) ?? null,
  };

  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, product: data }, { status: 201 });
}

// PUT: 제품 수정 (admin 전용)
export async function PUT(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: '관리자 인증 필요' }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: '잘못된 JSON' }, { status: 400 }); }

  const id = body.id as string;
  if (!id) return NextResponse.json({ error: 'id 필요' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  const allowed = ['name','category','description','manufacturer','badge','image','images','specs','documents','featured','stock','rating','reviews'];
  for (const k of allowed) {
    if (k in body) updates[k] = body[k];
  }

  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, product: data });
}

// DELETE: 제품 삭제 (admin 전용)
export async function DELETE(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: '관리자 인증 필요' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id 파라미터 필요' }, { status: 400 });

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
