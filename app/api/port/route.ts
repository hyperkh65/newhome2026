import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// 인천항만공사(ICPA) 터미널 혼잡도 API
// data.go.kr B551504/ipaTrmnlCnf
const API_KEY = process.env.ICPA_API_KEY || '';

const STATUS_MAP: Record<string, { level: 'smooth' | 'normal' | 'busy' | 'very_busy'; label: string }> = {
  A: { level: 'smooth',   label: '원활' },
  B: { level: 'normal',   label: '보통' },
  C: { level: 'busy',     label: '혼잡' },
  D: { level: 'very_busy', label: '매우혼잡' },
};

function getOverallLevel(statuses: string[]): 'smooth' | 'normal' | 'busy' | 'very_busy' {
  if (statuses.includes('D')) return 'very_busy';
  if (statuses.includes('C')) return 'busy';
  if (statuses.includes('B')) return 'normal';
  return 'smooth';
}

const parser = new XMLParser({ ignoreAttributes: false, trimValues: true, parseTagValue: true });

async function fetchIcpaData() {
  const url = `https://apis.data.go.kr/B551504/ipaTrmnlCnf/getTrmnlCnf?serviceKey=${API_KEY}&skipRow=0&endRow=20`;
  const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const parsed = parser.parse(xml);

  const header = parsed?.response?.header;
  if (header?.resultCode !== '00' && header?.resultCode !== 0) {
    throw new Error(header?.resultMsg || 'API 오류');
  }

  const body = parsed?.response?.body;
  let items = body?.items?.item ?? [];
  if (!Array.isArray(items)) items = [items];

  return items;
}

function fallbackData() {
  const now = new Date();
  const hh = now.getHours();
  const isBusy = hh >= 9 && hh <= 18;
  return {
    level: isBusy ? 'busy' : 'normal' as const,
    terminals: [
      { code: 'IT001', name: '선광신컨테이너터미널', status: 'B', label: '보통' },
      { code: 'IT002', name: 'E1컨테이너터미널',    status: 'B', label: '보통' },
      { code: 'IT003', name: '인천컨테이너터미널',   status: 'B', label: '보통' },
      { code: 'IT004', name: '한진인천컨테이너터미널', status: 'B', label: '보통' },
    ],
    updatedAt: now.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    demo: true,
  };
}

export async function GET() {
  try {
    if (!API_KEY) throw new Error('API key not set');

    const items = await fetchIcpaData();
    const terminals = items.map((it: any) => {
      const status = String(it.trafficStatus ?? 'B').toUpperCase();
      const info = STATUS_MAP[status] ?? { level: 'normal', label: '보통' };
      return {
        code: String(it.termCd ?? ''),
        name: String(it.termName ?? ''),
        status,
        label: info.label,
        level: info.level,
        updatedAt: String(it.trafficTime ?? '').slice(11, 16),
      };
    });

    const overallLevel = getOverallLevel(terminals.map((t: any) => t.status));

    return NextResponse.json({
      level: overallLevel,
      terminals,
      updatedAt: new Date().toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      demo: false,
    });
  } catch {
    return NextResponse.json(fallbackData());
  }
}
