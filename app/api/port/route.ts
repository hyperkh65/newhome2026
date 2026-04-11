import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// 관세청 Unipass API 키 (기존 물류조회와 동일)
const CRKY_CN = 'r260g286i041p271c040p050q0';

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
  parseTagValue: true,
  removeNSPrefix: true,
});

function getLevel(waiting: number, berthRate: number): 'smooth' | 'normal' | 'busy' | 'very_busy' {
  if (waiting >= 15 || berthRate >= 90) return 'very_busy';
  if (waiting >= 8  || berthRate >= 75) return 'busy';
  if (waiting >= 3  || berthRate >= 50) return 'normal';
  return 'smooth';
}

async function fetchPortVessels() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm   = String(today.getMonth() + 1).padStart(2, '0');
  const dd   = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  // Unipass: 항만 입항 예정 선박 목록 (인천항 = INC / KRNIC)
  const url = `https://unipass.customs.go.kr:38010/ext/rest/portlManifQry/retrievePortlManifList` +
    `?crkyCn=${CRKY_CN}&portCode=INC&ioTp=I&schStrtDt=${dateStr}&schEndDt=${dateStr}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Unipass API 응답 오류');

  const xml = await res.text();
  const parsed = parser.parse(xml);

  const root = parsed?.portlManifQryRtnVo;
  const tCnt = parseInt(String(root?.tCnt ?? '0'));
  let items = root?.portlManifQryVo ?? [];
  if (!Array.isArray(items)) items = items ? [items] : [];

  const vessels = items.slice(0, 8).map((it: any) => ({
    name: String(it.vslNm || it.vslEngNm || 'UNKNOWN').trim(),
    flag: getFlagEmoji(String(it.ntcoNm || '')),
    status: it.ioTp === 'I' ? (it.arvDt ? '접안' : '대기') : '출항',
    eta: it.schArvDt ? formatTime(String(it.schArvDt)) : undefined,
    etd: it.schDepDt ? formatTime(String(it.schDepDt)) : undefined,
  }));

  const berthed = vessels.filter((v: {status: string}) => v.status === '접안').length;
  const waiting = vessels.filter((v: {status: string}) => v.status === '대기').length;
  const berthRate = tCnt > 0 ? Math.min(Math.round(berthed / Math.max(tCnt, 10) * 100), 100) : 50;

  return { tCnt, vessels, berthed, waiting, berthRate };
}

function formatTime(s: string): string {
  if (s.length >= 12) return `${s.slice(8, 10)}:${s.slice(10, 12)}`;
  if (s.length >= 8)  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
  return s;
}

function getFlagEmoji(country: string): string {
  const map: Record<string, string> = {
    '파나마': '🇵🇦', '한국': '🇰🇷', '홍콩': '🇭🇰', '중국': '🇨🇳',
    '바하마': '🇧🇸', '마샬': '🇲🇭', '싱가포르': '🇸🇬', '라이베리아': '🇱🇷',
    '일본': '🇯🇵', '미국': '🇺🇸', '독일': '🇩🇪', '그리스': '🇬🇷',
    '노르웨이': '🇳🇴', '영국': '🇬🇧',
  };
  for (const [k, v] of Object.entries(map)) {
    if (country.includes(k)) return v;
  }
  return '🚢';
}

function fallbackData() {
  const now = new Date();
  const hh = now.getHours();
  const waiting   = hh >= 9 && hh <= 18 ? Math.floor(Math.random() * 8 + 5) : Math.floor(Math.random() * 3 + 1);
  const berthed   = Math.floor(Math.random() * 10 + 16);
  const berthRate = Math.round(berthed / 28 * 100);
  return {
    level: getLevel(waiting, berthRate) as any,
    waiting, berthed, berthRate,
    departed: Math.floor(Math.random() * 5 + 2),
    updatedAt: now.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    demo: true,
    vessels: [
      { name: 'EVER BRIGHT',  flag: '🇵🇦', status: '접안', etd: `${hh + 2}:00` },
      { name: 'MSC VICTORIA', flag: '🇨🇭', status: '대기', eta: `${hh + 1}:30` },
      { name: 'COSCO PACIFIC',flag: '🇨🇳', status: '접안', etd: `${hh + 4}:00` },
      { name: 'HMM OSLO',     flag: '🇰🇷', status: '출항', etd: `${hh}:${String(now.getMinutes() + 10).padStart(2,'0')}` },
      { name: 'ONE HAWK',     flag: '🇯🇵', status: '대기', eta: `${hh + 3}:00` },
    ],
  };
}

export async function GET() {
  try {
    const { tCnt, vessels, berthed, waiting, berthRate } = await fetchPortVessels();
    const departed = vessels.filter((v: {status: string}) => v.status === '출항').length;

    return NextResponse.json({
      level: getLevel(waiting, berthRate),
      waiting,
      berthed,
      berthRate,
      departed,
      total: tCnt,
      updatedAt: new Date().toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      demo: false,
      vessels,
    });
  } catch {
    // Unipass 실패 시 시뮬레이션 데이터
    return NextResponse.json(fallbackData());
  }
}
