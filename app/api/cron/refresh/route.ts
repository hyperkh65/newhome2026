import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(req: Request) {
  try {
    const base = new URL(req.url);
    const [marketRes, portRes] = await Promise.all([
      fetch(new URL('/api/market', base).toString(), { cache: 'no-store' }),
      fetch(new URL('/api/port', base).toString(), { cache: 'no-store' }),
    ]);

    const [market, port] = await Promise.all([
      marketRes.json(),
      portRes.json(),
    ]);

    return NextResponse.json({
      ok: true,
      refreshedAt: new Date().toISOString(),
      marketOk: market?.success ?? false,
      portOk: !port?.error,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
