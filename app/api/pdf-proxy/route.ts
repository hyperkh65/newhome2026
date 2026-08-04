import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  // 상대 URL이면 (/api/files/... 등) 자체 서버 절대 URL로 변환
  const origin = req.nextUrl.origin;
  const absoluteUrl = url.startsWith('/') ? `${origin}${url}` : url;

  try {
    const res = await fetch(absoluteUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const ct = res.headers.get('content-type') || '';

    // PDF가 아닌 경우(Cloudinary GIF 오류 등) 명확한 오류 반환
    if (!ct.includes('pdf') && !ct.includes('octet-stream')) {
      return new NextResponse(
        JSON.stringify({ error: `파일이 PDF가 아닙니다 (content-type: ${ct}). Cloudinary에 PDF를 다시 업로드하세요.` }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e) {
    return new NextResponse('PDF 가져오기 실패: ' + String(e), { status: 500 });
  }
}
