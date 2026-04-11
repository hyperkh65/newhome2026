import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Yahoo Finance 심볼 (LME 연동 선물)
const METAL_SYMBOLS = 'ALI%3DF,HG%3DF,NI%3DF,ZNC%3DF,PB%3DF';

async function fetchRates() {
  const res = await fetch(
    'https://api.manana.kr/exchange/rate/KRW/USD,CNY,JPY.json',
    { cache: 'no-store' }
  );
  const data = await res.json();
  const find = (key: string) => data.find((i: { name: string; rate: number }) => i.name.includes(key))?.rate ?? 0;
  return { usd: find('USD'), cny: find('CNY'), jpy: find('JPY') };
}

async function fetchMetals() {
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${METAL_SYMBOLS}&fields=regularMarketPrice,regularMarketPreviousClose,regularMarketChange,regularMarketChangePercent,currency,shortName`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    });
    const json = await res.json();
    const quotes = json?.quoteResponse?.result ?? [];

    const map: Record<string, string> = {
      'ALI=F': 'aluminum', 'HG=F': 'copper', 'NI=F': 'nickel',
      'ZNC=F': 'zinc', 'PB=F': 'lead',
    };
    const metals: Record<string, { price: number; prev: number; change: number; changePct: number; currency: string; name: string }> = {};
    for (const q of quotes) {
      const key = map[q.symbol];
      if (key) metals[key] = {
        price: q.regularMarketPrice ?? 0,
        prev: q.regularMarketPreviousClose ?? 0,
        change: q.regularMarketChange ?? 0,
        changePct: q.regularMarketChangePercent ?? 0,
        currency: q.currency ?? 'USD',
        name: q.shortName ?? key,
      };
    }
    return metals;
  } catch {
    return {};
  }
}

async function saveTodaySnapshot(rates: { usd: number; cny: number; jpy: number }, metals: Record<string, { price: number }>) {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase.from('market_history').select('date').eq('date', today).single();
  if (data) return; // 오늘 이미 저장됨

  await supabase.from('market_history').insert({
    date: today,
    usd: rates.usd,
    cny: rates.cny,
    jpy: rates.jpy,
    aluminum: metals.aluminum?.price ?? null,
    copper: metals.copper?.price ?? null,
    nickel: metals.nickel?.price ?? null,
    zinc: metals.zinc?.price ?? null,
    lead: metals.lead?.price ?? null,
  });
}

export async function GET() {
  try {
    const [rates, metals] = await Promise.all([fetchRates(), fetchMetals()]);
    saveTodaySnapshot(rates, metals).catch(console.error);

    // 최근 30일 히스토리
    const { data: history } = await supabase
      .from('market_history')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      rates,
      metals,
      history: (history ?? []).reverse(),
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
