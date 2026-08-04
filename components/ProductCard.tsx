'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Product, useShopStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const [added, setAdded] = useState(false);
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const wishlist = useShopStore((s) => s.wishlist);
  const isWished = wishlist.includes(product.id);

  const price = product.price || 0;
  const originalPrice = product.original_price || (product as any).originalPrice;
  const image = (product as any).image || (product.images && product.images[0]);

  const discount = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#f1f5f9' : '#fff',
        border: `1px solid ${hover ? '#cbd5e1' : '#e2e8f0'}`,
        borderRadius: 20,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        transform: hover ? 'translateY(-6px)' : 'none',
        boxShadow: hover ? '0 20px 40px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        animationDelay: `${index * 80}ms`,
        animation: 'fadeInUp 0.6s ease forwards',
        cursor: 'pointer',
      }}
    >
      <Link href={`/shop/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#0a0a0a' }}>
          <img
            src={image}
            alt={product.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
              transform: hover ? 'scale(1.08)' : 'scale(1)',
            }}
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: hover ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
            transition: 'background 0.4s ease',
          }} />

          {/* Badge */}
          {product.badge && (
            <div style={{
              position: 'absolute', top: 14, left: 14,
              padding: '4px 10px', borderRadius: 6,
              background: 'rgba(15,23,42,0.75)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: 10, fontWeight: 700, letterSpacing: 1,
              backdropFilter: 'blur(8px)',
            }}>
              {product.badge}
            </div>
          )}
          {discount && (
            <div style={{
              position: 'absolute', top: 14, right: 14,
              padding: '4px 10px', borderRadius: 6,
              background: 'rgba(255,50,50,0.2)', border: '1px solid rgba(255,100,100,0.3)',
              fontSize: 11, fontWeight: 700, color: '#ff8080',
            }}>
              -{discount}%
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            style={{
              position: 'absolute', bottom: 14, right: 14,
              background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)',
              opacity: hover ? 1 : 0, color: isWished ? '#ff6b6b' : '#fff',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '20px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
              {product.category}
            </span>
            <span style={{ fontSize: 11, color: '#cbd5e1' }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 11, color: '#f5c518' }}>★</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{product.rating} ({product.reviews})</span>
            </div>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, letterSpacing: '-0.01em', lineHeight: 1.3, color: '#0f172a' }}>
            {product.name}
          </h3>

          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {originalPrice && (
                <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through', marginRight: 6 }}>
                  {originalPrice.toLocaleString()}원
                </span>
              )}
              <span style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{price.toLocaleString()}원</span>
            </div>
            <span style={{ fontSize: 11, color: product.stock > 10 ? '#94a3b8' : '#ef4444' }}>
              {product.stock > 10 ? '재고있음' : `${product.stock}개 남음`}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div style={{ padding: '0 20px 20px' }}>
        <button
          onClick={handleAddToCart}
          style={{
            width: '100%', padding: '11px', borderRadius: 12,
            background: added ? '#dcfce7' : hover ? '#0ea5e9' : '#f1f5f9',
            color: added ? '#16a34a' : hover ? '#fff' : '#374151',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.3s ease', fontFamily: 'inherit',
            border: `1px solid ${added ? '#bbf7d0' : hover ? '#0ea5e9' : '#e2e8f0'}`,
          }}
        >
          {added ? '✓ 추가됨' : '장바구니 담기'}
        </button>
      </div>
    </div>
  );
}
