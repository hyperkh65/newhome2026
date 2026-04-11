import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const CRKY_CN = 'r260g286i041p271c040p050q0';
// NOTE: 관세정보 API는 port 없는 기본 URL 사용 (38010은 화물추적 전용)
const BASE = 'https://unipass.customs.go.kr/ext/rest';

// FTA 협정명 매핑
const FTA_NAMES: Record<string, string> = {
  'A': 'ASEAN (아세안)', 'AU': '한-호주', 'CA': '한-캐나다', 'CL': '한-칠레',
  'CN': '한-중국', 'CO': '한-콜롬비아', 'E': '한-EFTA', 'EU': '한-EU',
  'GB': '한-영국', 'IL': '한-이스라엘', 'IN': '한-인도 (CEPA)', 'KH': '한-캄보디아',
  'NZ': '한-뉴질랜드', 'PE': '한-페루', 'RC': 'RCEP', 'SG': '한-싱가포르',
  'TR': '한-터키', 'US': '한-미국 (KORUS)', 'VN': '한-베트남', 'MX': '한-멕시코',
};

// 세율 구분 매핑
const RATE_TYPE: Record<string, string> = {
  '1': '기본세율', '2': 'WTO 협정세율 (MFN)', '3': '잠정세율',
  '4': 'FTA 협정세율', '5': '특별긴급관세', '6': '편익관세', '8': '국제협력관세',
};

// ─── 주요 LED/조명 HS 코드 내장 세율 데이터 (2024년 기준, 참고용) ───
// 출처: 관세청 관세율표 (www.customs.go.kr)
interface StaticTariff {
  hsNm: string; hsNmEn: string; unit: string;
  basic: string; wto: string;
  fta: { ftaCd: string; rate: string; note?: string; }[];
}
const STATIC_TARIFF: Record<string, StaticTariff> = {
  '8541400000': {
    hsNm: '발광다이오드 (LED)', hsNmEn: 'Light emitting diodes', unit: '개',
    basic: '8', wto: '0',  // ITA(정보기술협정) 적용으로 WTO 세율 0%
    fta: [
      { ftaCd: 'US', rate: '0' }, { ftaCd: 'EU', rate: '0' },
      { ftaCd: 'CN', rate: '0' }, { ftaCd: 'A',  rate: '0' },
      { ftaCd: 'RC', rate: '0' }, { ftaCd: 'AU', rate: '0' },
      { ftaCd: 'VN', rate: '0' }, { ftaCd: 'SG', rate: '0' },
    ],
  },
  '8541101000': {
    hsNm: '다이오드 (발광다이오드 및 광감성 반도체 제외)', hsNmEn: 'Diodes (other)', unit: '개',
    basic: '8', wto: '0',
    fta: [
      { ftaCd: 'US', rate: '0' }, { ftaCd: 'EU', rate: '0' },
      { ftaCd: 'CN', rate: '0' }, { ftaCd: 'A',  rate: '0' },
    ],
  },
  '8539500000': {
    hsNm: 'LED 램프', hsNmEn: 'LED lamps', unit: '개',
    basic: '8', wto: '8',
    fta: [
      { ftaCd: 'US', rate: '0' }, { ftaCd: 'EU', rate: '0' },
      { ftaCd: 'CN', rate: '0', note: '단계적 인하' },
      { ftaCd: 'A',  rate: '0' }, { ftaCd: 'RC', rate: '0' },
      { ftaCd: 'VN', rate: '0' }, { ftaCd: 'AU', rate: '0' },
    ],
  },
  '9405109090': {
    hsNm: '샹들리에 및 기타 천장조명기구', hsNmEn: 'Chandeliers and ceiling fittings', unit: '개',
    basic: '8', wto: '8',
    fta: [
      { ftaCd: 'US', rate: '0' }, { ftaCd: 'EU', rate: '0' },
      { ftaCd: 'CN', rate: '4.8', note: '2024년 기준' },
      { ftaCd: 'A',  rate: '0' }, { ftaCd: 'RC', rate: '5.6', note: '단계적 인하' },
      { ftaCd: 'VN', rate: '0' }, { ftaCd: 'AU', rate: '0' },
    ],
  },
  '9405409000': {
    hsNm: '기타 전기식 조명기구', hsNmEn: 'Other electric luminaires and fittings', unit: '개',
    basic: '8', wto: '8',
    fta: [
      { ftaCd: 'US', rate: '0' }, { ftaCd: 'EU', rate: '0' },
      { ftaCd: 'CN', rate: '4.8', note: '2024년 기준' },
      { ftaCd: 'A',  rate: '0' }, { ftaCd: 'RC', rate: '5.6', note: '단계적 인하' },
      { ftaCd: 'VN', rate: '0' }, { ftaCd: 'AU', rate: '0' },
    ],
  },
  '9405991000': {
    hsNm: '조명기구 유리제 부품', hsNmEn: 'Glass parts of lamps', unit: 'KG',
    basic: '8', wto: '8',
    fta: [
      { ftaCd: 'US', rate: '0' }, { ftaCd: 'EU', rate: '0' },
      { ftaCd: 'CN', rate: '0', note: '단계적 인하' },
    ],
  },
  '9405999000': {
    hsNm: '조명기구 기타 부품', hsNmEn: 'Other parts of lamps', unit: '개',
    basic: '8', wto: '8',
    fta: [
      { ftaCd: 'US', rate: '0' }, { ftaCd: 'EU', rate: '0' },
      { ftaCd: 'CN', rate: '0', note: '단계적 인하' },
      { ftaCd: 'A',  rate: '0' }, { ftaCd: 'RC', rate: '0' },
    ],
  },
  '8544421000': {
    hsNm: '전압 1,000V 이하 전기 도체 (플러그/소켓 구비)', hsNmEn: 'Electric conductors ≤1000V with connectors', unit: 'KG',
    basic: '8', wto: '8',
    fta: [
      { ftaCd: 'US', rate: '0' }, { ftaCd: 'EU', rate: '0' },
      { ftaCd: 'CN', rate: '0', note: '단계적 인하' },
      { ftaCd: 'A',  rate: '0' },
    ],
  },
};

function cleanHs(raw: string) {
  return raw.replace(/[\.\-\s]/g, '').slice(0, 10);
}

// 정적 데이터에서 HS 코드 검색 (prefix 매칭)
function findStaticData(hsSgn: string): StaticTariff | null {
  // 정확 매칭 우선
  if (STATIC_TARIFF[hsSgn]) return STATIC_TARIFF[hsSgn];
  // prefix 매칭 (입력이 6자리 등 짧을 경우)
  for (const [key, val] of Object.entries(STATIC_TARIFF)) {
    if (key.startsWith(hsSgn) || hsSgn.startsWith(key.slice(0, hsSgn.length))) {
      return val;
    }
  }
  return null;
}

async function fetchTariffBook(hsSgn: string) {
  const url = `${BASE}/tariffBook/retrieveTariffBook?crkyCn=${CRKY_CN}&hsSgn=${hsSgn}&_type=json`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const text = await res.text();
  if (!text || text.length < 5) return [];
  const data = JSON.parse(text);
  const body = data?.response?.body;
  const items = body?.items?.item;
  return items ? (Array.isArray(items) ? items : [items]) : [];
}

async function fetchFtaTariff(hsSgn: string) {
  const url = `${BASE}/ftaTariffQry/retrieveFtaTariffQryList?crkyCn=${CRKY_CN}&hsSgn=${hsSgn}&_type=json`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const text = await res.text();
  if (!text || text.length < 5) return [];
  const data = JSON.parse(text);
  const body = data?.response?.body;
  const items = body?.items?.item;
  return items ? (Array.isArray(items) ? items : [items]) : [];
}

async function fetchHsKeyword(keyword: string) {
  const url = `${BASE}/itemscrBrkdQry/retrieveItemscrBrkdQryList?crkyCn=${CRKY_CN}&itemScr=${encodeURIComponent(keyword)}&_type=json`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const text = await res.text();
  if (!text || text.length < 5) return [];
  const data = JSON.parse(text);
  const body = data?.response?.body;
  const items = body?.items?.item;
  return items ? (Array.isArray(items) ? items : [items]) : [];
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get('q')?.trim() || '';
  const mode  = searchParams.get('mode') || 'code';

  if (!query) return NextResponse.json({ error: '검색어를 입력하세요' }, { status: 400 });

  try {
    if (mode === 'keyword') {
      const results = await fetchHsKeyword(query);
      // 키워드 검색도 API 실패 시 정적 데이터에서 검색
      if (results.length === 0) {
        const staticMatches = Object.entries(STATIC_TARIFF)
          .filter(([, v]) => v.hsNm.includes(query) || v.hsNmEn.toLowerCase().includes(query.toLowerCase()))
          .map(([k, v]) => ({ hsSgn: k, hsNm: v.hsNm, hsNmEn: v.hsNmEn, _static: true }));
        return NextResponse.json({ type: 'list', items: staticMatches, apiKeyRequired: staticMatches.length === 0 });
      }
      return NextResponse.json({ type: 'list', items: results.slice(0, 20) });
    }

    const hsSgn = cleanHs(query);
    if (hsSgn.length < 4) {
      return NextResponse.json({ error: 'HS 코드는 최소 4자리 이상 입력하세요' }, { status: 400 });
    }

    // Unipass API 시도
    const [tariffItems, ftaItems] = await Promise.allSettled([
      fetchTariffBook(hsSgn),
      fetchFtaTariff(hsSgn),
    ]);

    const tariffs = tariffItems.status === 'fulfilled' ? tariffItems.value : [];
    const ftas    = ftaItems.status === 'fulfilled'    ? ftaItems.value    : [];

    // API 데이터 없으면 정적 데이터 사용
    if (tariffs.length === 0 && ftas.length === 0) {
      const staticData = findStaticData(hsSgn);
      if (staticData) {
        return NextResponse.json({
          type: 'detail',
          dataSource: 'static',  // 정적 데이터 표시
          hsInfo: {
            hsSgn, hsNm: staticData.hsNm, hsNmEn: staticData.hsNmEn,
            unit: staticData.unit, chapter: hsSgn.slice(0, 2), heading: hsSgn.slice(0, 4),
          },
          basicRates: [
            { type: '기본세율', rate: staticData.basic, unit: '', note: '' },
            { type: 'WTO 협정세율 (MFN)', rate: staticData.wto, unit: '', note: staticData.wto === '0' ? 'ITA(정보기술협정) 적용' : '' },
          ],
          ftaRates: [],
          ftaDetail: staticData.fta.map(f => ({
            country: FTA_NAMES[f.ftaCd] || f.ftaCd,
            ftaCd: f.ftaCd, rate: f.rate, unit: '', stage: '', origin: '', note: f.note || '',
          })),
          otherRates: [],
          rawCount: 0, ftaCount: staticData.fta.length,
        });
      }

      // 정적 데이터도 없으면 apiKeyRequired 응답
      return NextResponse.json({
        type: 'detail',
        apiKeyRequired: true,
        hsInfo: {
          hsSgn, hsNm: '', hsNmEn: '', unit: '',
          chapter: hsSgn.slice(0, 2), heading: hsSgn.slice(0, 4),
        },
        basicRates: [], ftaRates: [], ftaDetail: [], otherRates: [],
        rawCount: 0, ftaCount: 0,
      });
    }

    // API 데이터 처리 (기존 로직)
    const basicRates: any[] = [];
    const ftaRates: any[]   = [];
    const otherRates: any[] = [];

    for (const t of tariffs) {
      const rtCd = String(t.rtCd || t.rateTypeCd || '');
      const item = {
        type:  RATE_TYPE[rtCd] || rtCd,
        rate:  String(t.dtyRt  || t.dutyRate || t.rt    || '-'),
        unit:  String(t.dtyRtUt || t.rateUnit || ''),
        note:  String(t.applBgnDt ? `적용: ${t.applBgnDt}~` : ''),
        raw:   t,
      };
      if (rtCd === '2')      basicRates.push(item);
      else if (rtCd === '1') basicRates.unshift(item);
      else if (rtCd === '4') ftaRates.push(item);
      else                   otherRates.push(item);
    }

    const ftaDetail = ftas.map((f: any) => ({
      country: FTA_NAMES[String(f.ftaCd || f.cntrCd || '')] || String(f.ftaNm || f.ftaCd || ''),
      ftaCd:   String(f.ftaCd || f.cntrCd || ''),
      rate:    String(f.dtyRt || f.ftaRate || f.rate || '-'),
      unit:    String(f.dtyRtUt || ''),
      stage:   String(f.stgCd  || ''),
      origin:  String(f.orgRulCn || ''),
      note:    String(f.rmk || ''),
    }));

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
      type: 'detail', dataSource: 'unipass',
      hsInfo, basicRates, ftaRates, ftaDetail, otherRates,
      rawCount: tariffs.length, ftaCount: ftas.length,
    });

  } catch (e) {
    return NextResponse.json({ error: '조회 중 오류: ' + String(e) }, { status: 500 });
  }
}
