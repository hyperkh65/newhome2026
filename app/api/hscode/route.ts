import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const CRKY_CN = 'r260g286i041p271c040p050q0';
const BASE = 'https://unipass.customs.go.kr:38010/ext/rest';

const parser = new XMLParser({
  ignoreAttributes: false, trimValues: true, parseTagValue: true, removeNSPrefix: true,
});

// FTA 협정명 매핑
const FTA_NAMES: Record<string, string> = {
  'A': 'ASEAN (아세안)',
  'AU': '한-호주',
  'CA': '한-캐나다',
  'CL': '한-칠레',
  'CN': '한-중국',
  'CO': '한-콜롬비아',
  'E': '한-EFTA (유럽자유무역)',
  'EU': '한-EU',
  'GB': '한-영국',
  'IL': '한-이스라엘',
  'IN': '한-인도 (CEPA)',
  'KH': '한-캄보디아',
  'MX': '한-멕시코',
  'NZ': '한-뉴질랜드',
  'PE': '한-페루',
  'RC': 'RCEP (역내포괄경제동반자)',
  'SG': '한-싱가포르',
  'TR': '한-터키',
  'US': '한-미국 (KORUS)',
  'VN': '한-베트남',
};

// 세율 구분 매핑
const RATE_TYPE: Record<string, string> = {
  '1': '기본세율',
  '2': 'WTO 협정세율 (MFN)',
  '3': '잠정세율',
  '4': 'FTA 협정세율',
  '5': '특별긴급관세',
  '6': '편익관세',
  '8': '국제협력관세',
};

function cleanHs(raw: string) {
  return raw.replace(/[\.\-\s]/g, '').slice(0, 10);
}

async function fetchTariffBook(hsSgn: string) {
  const url = `${BASE}/tariffBook/retrieveTariffBook?crkyCn=${CRKY_CN}&hsSgn=${hsSgn}&_type=json`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('tariffBook API 오류');
  const data = await res.json();
  const body = data?.response?.body;
  const items = body?.items?.item;
  return items ? (Array.isArray(items) ? items : [items]) : [];
}

async function fetchFtaTariff(hsSgn: string) {
  const url = `${BASE}/ftaTariffQry/retrieveFtaTariffQryList?crkyCn=${CRKY_CN}&hsSgn=${hsSgn}&_type=json`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  const body = data?.response?.body;
  const items = body?.items?.item;
  return items ? (Array.isArray(items) ? items : [items]) : [];
}

async function fetchHsKeyword(keyword: string) {
  // 키워드로 HS 코드 검색
  const url = `${BASE}/itemscrBrkdQry/retrieveItemscrBrkdQryList?crkyCn=${CRKY_CN}&itemScr=${encodeURIComponent(keyword)}&_type=json`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  const body = data?.response?.body;
  const items = body?.items?.item;
  return items ? (Array.isArray(items) ? items : [items]) : [];
}

async function fetchTariffXml(hsSgn: string) {
  // XML 방식 백업
  const url = `${BASE}/tariffChk/retrieveTariffChk?crkyCn=${CRKY_CN}&hsSgn=${hsSgn}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return null;
  const xml = await res.text();
  return parser.parse(xml);
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get('q')?.trim() || '';
  const mode  = searchParams.get('mode') || 'code'; // 'code' | 'keyword'

  if (!query) return NextResponse.json({ error: '검색어를 입력하세요' }, { status: 400 });

  try {
    if (mode === 'keyword') {
      // 키워드 검색
      const results = await fetchHsKeyword(query);
      return NextResponse.json({ type: 'list', items: results.slice(0, 20) });
    }

    // HS 코드 직접 조회
    const hsSgn = cleanHs(query);
    if (hsSgn.length < 4) {
      return NextResponse.json({ error: 'HS 코드는 최소 4자리 이상 입력하세요' }, { status: 400 });
    }

    const [tariffItems, ftaItems] = await Promise.allSettled([
      fetchTariffBook(hsSgn),
      fetchFtaTariff(hsSgn),
    ]);

    const tariffs = tariffItems.status === 'fulfilled' ? tariffItems.value : [];
    const ftas    = ftaItems.status === 'fulfilled'    ? ftaItems.value    : [];

    // 세율 분류
    const basicRates: any[]  = [];
    const ftaRates: any[]    = [];
    const otherRates: any[]  = [];

    for (const t of tariffs) {
      const rtCd = String(t.rtCd || t.rateTypeCd || '');
      const item = {
        type:     RATE_TYPE[rtCd] || rtCd,
        rate:     String(t.dtyRt  || t.dutyRate   || t.rt    || '-'),
        unit:     String(t.dtyRtUt || t.rateUnit  || ''),
        note:     String(t.applBgnDt ? `적용: ${t.applBgnDt}~` : ''),
        raw:      t,
      };
      if (rtCd === '2')      basicRates.push(item);
      else if (rtCd === '1') basicRates.unshift(item);
      else if (rtCd === '4') ftaRates.push(item);
      else                   otherRates.push(item);
    }

    // FTA 전용 API 결과
    const ftaDetail = ftas.map((f: any) => ({
      country:  FTA_NAMES[String(f.ftaCd || f.cntrCd || '')] || String(f.ftaNm || f.ftaCd || ''),
      ftaCd:    String(f.ftaCd || f.cntrCd || ''),
      rate:     String(f.dtyRt || f.ftaRate || f.rate || '-'),
      unit:     String(f.dtyRtUt || ''),
      stage:    String(f.stgCd  || ''),    // 단계세율
      origin:   String(f.orgRulCn || ''), // 원산지 규정
      note:     String(f.rmk || ''),
    }));

    // HS 코드 기본 정보
    const first = tariffs[0] || {};
    const hsInfo = {
      hsSgn:   String(first.hsSgn  || first.hsCd  || hsSgn),
      hsNm:    String(first.hsNm   || first.itemNm || ''),
      hsNmEn:  String(first.hsNmEn || first.itemNmEn || ''),
      unit:    String(first.statUt || first.unit   || ''),
      chapter: hsSgn.slice(0, 2),
      heading: hsSgn.slice(0, 4),
    };

    return NextResponse.json({
      type:       'detail',
      hsInfo,
      basicRates,
      ftaRates,
      ftaDetail,
      otherRates,
      rawCount:   tariffs.length,
      ftaCount:   ftas.length,
    });

  } catch (e) {
    return NextResponse.json({ error: '조회 중 오류: ' + String(e) }, { status: 500 });
  }
}
