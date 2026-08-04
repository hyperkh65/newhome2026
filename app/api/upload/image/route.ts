import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR =
  process.env.PDF_STORE_DIR ||
  (process.env.NODE_ENV === 'production'
    ? '/volume1/homes/urjent/pdf-store'
    : path.join(process.cwd(), 'pdf-store'));

const ALLOWED_EXT = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

function auth(req: NextRequest) {
  const token = req.headers.get('x-admin-token');
  const pw = process.env.NEXT_PUBLIC_ADMIN_PW || '';
  return !!(token && pw && token === pw);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let formData: FormData;
  try { formData = await req.formData(); }
  catch { return NextResponse.json({ error: '파일 파싱 실패' }, { status: 400 }); }

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: '파일 없음' }, { status: 400 });

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!ALLOWED_EXT.includes(ext))
    return NextResponse.json({ error: '이미지 파일만 가능 (png/jpg/webp/gif)' }, { status: 400 });

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `${timestamp}-${safeName}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
  } catch (e) {
    return NextResponse.json({ error: '파일 저장 실패: ' + String(e) }, { status: 500 });
  }

  return NextResponse.json({ url: `/api/files/${fileName}`, fileName, size: file.size });
}
