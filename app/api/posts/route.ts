import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');
  if (!type) return NextResponse.json([], { status: 400 });

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from('posts').select('*')
      .eq('type', type).order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? [], {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
