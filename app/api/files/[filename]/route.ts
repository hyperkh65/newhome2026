import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const STORE_DIR =
  process.env.PDF_STORE_DIR ||
  (process.env.NODE_ENV === 'production'
    ? '/volume1/homes/urjent/pdf-store'
    : path.join(process.cwd(), 'pdf-store'));

export async function GET(_req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  // 경로 traversal 방지
  const safe = path.basename(filename);
  const filePath = path.join(STORE_DIR, safe);

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${safe}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return new NextResponse('파일을 찾을 수 없습니다', { status: 404 });
  }
}
