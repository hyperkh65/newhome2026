'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type ShowcaseSlide = {
  id?: string;
  productId: string;
  imageUrl: string;
  title?: string;
  description?: string;
  enabled?: boolean;
  order?: number;
};

type Product = {
  id: string;
  name?: string;
  description?: string;
  image?: string;
  images?: string[];
};

export default function DataHubPromoPopup() {
  const [slides, setSlides] = useState<ShowcaseSlide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ data: setting }, { data: productRows }] = await Promise.all([
        supabase.from('site_settings').select('config').eq('category', 'product_showcase').maybeSingle(),
        supabase.from('products').select('id,name,description,image,images'),
      ]);
      if (cancelled) return;
      const configured = Array.isArray(setting?.config?.slides) ? setting.config.slides : [];
      setSlides(configured.filter((s: ShowcaseSlide) => s.enabled !== false && s.imageUrl && s.productId).sort((a: ShowcaseSlide, b: ShowcaseSlide) => (a.order ?? 0) - (b.order ?? 0)));
      setProducts((productRows ?? []) as Product[]);
    })();
    return () => { cancelled = true; };
  }, []);

  const current = slides[index];
  const product = useMemo(() => products.find(p => String(p.id) === String(current?.productId)), [products, current]);
  const gallery = product ? [current?.imageUrl, ...(product.images ?? []), product.image].filter(Boolean) as string[] : [current?.imageUrl].filter(Boolean) as string[];

  useEffect(() => {
    if (slides.length < 2 || lightbox) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slides.length, lightbox]);

  if (!current || !product) return null;

  return (
    <>
      <section className="product-showcase-popup" aria-label="추천 제품">
        <div className="product-showcase-kicker">추천 제품</div>
        <button className="product-showcase-image-button" onClick={() => setLightbox(true)} aria-label="제품 이미지 크게 보기">
          <img src={current.imageUrl} alt={current.title || product.name || '추천 제품'} />
          <span>이미지 크게 보기</span>
        </button>
        <div className="product-showcase-copy">
          <strong>{current.title || product.name}</strong>
          <p>{current.description || product.description || '제품 상세 정보를 확인해보세요.'}</p>
        </div>
        <div className="product-showcase-actions">
          <button onClick={() => setLightbox(true)}>상세 이미지</button>
          <a href={`/shop/${product.id}`}>대표 제품으로 이동</a>
        </div>
        {slides.length > 1 && <div className="product-showcase-dots" aria-label="제품 순서">{slides.map((s, i) => <button key={s.id || `${s.productId}-${i}`} className={i === index ? 'active' : ''} onClick={() => setIndex(i)} aria-label={`${i + 1}번 제품`} />)}</div>}
      </section>

      {lightbox && (
        <div className="product-showcase-lightbox" role="dialog" aria-modal="true" onClick={e => { if (e.target === e.currentTarget) setLightbox(false); }}>
          <button className="product-showcase-close" onClick={() => setLightbox(false)} aria-label="닫기">×</button>
          <div className="product-showcase-lightbox-body">
            <div className="product-showcase-gallery">{gallery.map((src, i) => <img key={`${src}-${i}`} src={src} alt={`${product.name || '제품'} 이미지 ${i + 1}`} />)}</div>
            <div className="product-showcase-lightbox-footer">
              <strong>{product.name}</strong>
              <a href={`/shop/${product.id}`}>대표 제품으로 이동 →</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
