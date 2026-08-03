import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES = ['smart','indoor','home_lighting','commercial','industrial','outdoor','landscape','special'];
const VALID_SPEC_KEYS  = [
  // 전기 특성
  'power','input_voltage','power_factor','thd',
  // 광학 특성
  'luminous_flux','efficacy','color_temp','cri','beam_angle','cct','flux_tolerance',
  // 구조/소재
  'size','weight','material','body_color','connection_type','product_type',
  // LED 칩
  'chip_type','chip_qty',
  // 환경/안전
  'ip_rating','operating_temp','dimming',
  // 수명/보증
  'lifespan','warranty','switching_cycles',
  // 드라이버
  'driver','driver_brand',
  // 포장/물류
  'pcs_per_carton','gift_box_size','carton_size',
  // 구매/공급
  'moq','lead_time','supplier','supplier_code','certification',
  'packaging_type',
];
const VALID_DOC_TYPES  = ['datasheet','manual','cert','drawing','other'];

async function verifyKey(authHeader: string | null): Promise<boolean> {
  if (!authHeader?.startsWith('Bearer ')) return false;
  const provided = authHeader.slice(7).trim();
  const { data } = await supabase
    .from('site_settings').select('config').eq('category', 'apikey').maybeSingle();
  return !!(data?.config?.key && data.config.key === provided);
}

// GET: API 상태 및 가이드 링크
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'YNK LED 제품 등록 API',
    guide: `${process.env.NEXT_PUBLIC_APP_URL || ''}/ai-guide`,
    version: '1.0',
  });
}

// POST: 제품 등록
export async function POST(req: NextRequest) {
  // 1. API 키 인증
  const auth = req.headers.get('authorization');
  if (!await verifyKey(auth)) {
    return NextResponse.json({
      error: '인증 실패: Authorization 헤더에 유효한 Bearer 토큰을 포함하세요.',
      example: 'Authorization: Bearer ynk_xxxxxxxxxxxxxxxx',
    }, { status: 401 });
  }

  let body: any;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: '요청 본문이 유효한 JSON이 아닙니다' }, { status: 400 }); }

  // 2. 필수 필드 검증
  const missing = ['name','category','description'].filter(f => !body[f]);
  if (missing.length) {
    return NextResponse.json({ error: `필수 필드 누락: ${missing.join(', ')}` }, { status: 400 });
  }

  // 3. 카테고리 검증
  if (!VALID_CATEGORIES.includes(body.category)) {
    return NextResponse.json({
      error: `유효하지 않은 category: "${body.category}"`,
      valid_values: VALID_CATEGORIES,
    }, { status: 400 });
  }

  // 4. specs 키 검증 (경고만, 거부 안 함)
  const invalidSpecs = body.specs
    ? Object.keys(body.specs).filter(k => !VALID_SPEC_KEYS.includes(k))
    : [];

  // 5. documents 검증
  const documents = (body.documents || []).map((d: any) => ({
    name: String(d.name || ''),
    url:  String(d.url  || ''),
    type: VALID_DOC_TYPES.includes(d.type) ? d.type : 'other',
  }));

  // 6. 이미지 처리
  const images = body.images || (body.image ? [body.image] : []);
  const image  = body.image || images[0] || '';

  // 7. DB 저장
  const product = {
    name:         String(body.name),
    category:     body.category,
    manufacturer: String(body.manufacturer || 'YNK'),
    badge:        String(body.badge || ''),
    description:  String(body.description),
    image,
    images,
    specs:        body.specs || {},
    documents,
    featured:     Boolean(body.featured ?? false),
    stock:        body.stock ?? null,
    rating:       body.rating ?? null,
    reviews:      body.reviews ?? null,
  };

  const insertProduct = async (data: any) => supabase.from('products').insert(data).select().single();
  let { data, error } = await insertProduct(product);
  if (error?.message?.includes("documents")) {
    const fallback = { ...product };
    delete fallback.documents;
    ({ data, error } = await insertProduct(fallback));
  }
  if (error) {
    return NextResponse.json({ error: 'DB 저장 오류: ' + error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `제품 "${data.name}" 등록 완료`,
    product: { id: data.id, name: data.name, category: data.category },
    warnings: invalidSpecs.length ? [`알 수 없는 spec 키: ${invalidSpecs.join(', ')}`] : undefined,
  }, { status: 201 });
}
