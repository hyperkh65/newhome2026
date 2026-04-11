import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const CRKY_CN = 'r260g286i041p271c040p050q0';

export async function GET(req: NextRequest) {
  let blNo = req.nextUrl.searchParams.get('blNo');
  if (!blNo) return NextResponse.json({ success: false, error: 'B/L 번호가 필요합니다' }, { status: 400 });

  blNo = blNo.trim().toUpperCase();

  const currentYear = new Date().getFullYear();
  const searchYears = [currentYear, currentYear - 1, currentYear - 2];

  const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
    parseTagValue: true,
    removeNSPrefix: true,
  });

  try {
    // 수입 조회 (hblNo / mblNo × 연도별)
    for (const year of searchYears) {
      for (const type of ['hblNo', 'mblNo']) {
        const url =
          `https://unipass.customs.go.kr:38010/ext/rest/cargCsclPrgsInfoQry/retrieveCargCsclPrgsInfo` +
          `?crkyCn=${CRKY_CN}&${type}=${blNo}&blYy=${year}`;

        const res = await fetch(url, { method: 'GET', cache: 'no-store' });
        const xml = await res.text();
        const parsed = parser.parse(xml);

        const root = parsed?.cargCsclPrgsInfoQryRtnVo;
        const result = root?.cargCsclPrgsInfoQryVo;
        const total = parseInt(String(root?.tCnt ?? '0'));

        if (total > 0 && result) {
          let details = root?.cargCsclPrgsInfoDtlQryVo ?? [];
          if (!Array.isArray(details)) details = [details];

          return NextResponse.json({
            success: true,
            type: 'IMPORT',
            blType: type,
            year,
            data: result,
            details,
          });
        }
      }
    }

    // 수출 조회
    const expUrl =
      `https://unipass.customs.go.kr:38010/ext/rest/expDclrNoPrExpFfmnBrkdQry/retrieveExpDclrNoPrExpFfmnBrkd` +
      `?crkyCn=${CRKY_CN}&blNo=${blNo}`;

    const expRes = await fetch(expUrl, { cache: 'no-store' });
    const expXml = await expRes.text();
    const expParsed = parser.parse(expXml);

    const expRoot = expParsed?.expDclrNoPrExpFfmnBrkdQryRtnVo;
    const expResult = expRoot?.expDclrNoPrExpFfmnBrkdBlNoQryRsltVo;
    const expTotal = parseInt(String(expRoot?.tCnt ?? '0'));

    if (expTotal > 0 && expResult) {
      return NextResponse.json({
        success: true,
        type: 'EXPORT',
        data: Array.isArray(expResult) ? expResult[0] : expResult,
        details: [],
      });
    }

    return NextResponse.json({
      success: false,
      error: `'${blNo}' B/L 번호로 조회된 화물이 없습니다. (수입/수출 ${searchYears.join(', ')}년도 모두 확인)`,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: '관세청(Unipass) 연결 오류: ' + String(e) },
      { status: 500 }
    );
  }
}
