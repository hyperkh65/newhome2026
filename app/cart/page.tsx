'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useShopStore } from '@/lib/store';
import { useSiteSettings } from '@/lib/useSiteSettings';
import { supabase } from '@/lib/supabase';
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  ChevronRight,
  Copy,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';

type PaymentConfig = {
  bank_name?: string;
  account_number?: string;
  account_holder?: string;
  notice?: string;
};

function money(value: number) {
  return new Intl.NumberFormat('ko-KR').format(Math.max(0, Math.round(value)));
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handleCopy}
      className="btn-primary"
      style={{ width: '100%', justifyContent: 'center', gap: 8, display: 'flex', alignItems: 'center' }}
    >
      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
      {copied ? '복사 완료!' : label}
    </button>
  );
}

export default function CartPage() {
  const settings = useSiteSettings();
  const cart = useShopStore((s) => s.cart);
  const removeFromCart = useShopStore((s) => s.removeFromCart);
  const updateQty = useShopStore((s) => s.updateQty);
  const clearCart = useShopStore((s) => s.clearCart);
  const cartTotal = useShopStore((s) => s.cartTotal());
  const cartCount = useShopStore((s) => s.cartCount());

  const [payment, setPayment] = useState<PaymentConfig>({});
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    let alive = true;
    supabase
      .from('site_settings')
      .select('category, config')
      .eq('category', 'payment')
      .single()
      .then(({ data }) => {
        if (alive && data?.config) setPayment(data.config as PaymentConfig);
      });
    return () => { alive = false; };
  }, []);

  const companyName = settings?.company.name || '(주)와이앤케이';
  const bankName = payment.bank_name || '은행 미설정';
  const accountNumber = payment.account_number || '계좌번호 미설정';
  const accountHolder = payment.account_holder || companyName;
  const notice = payment.notice || '카드 결제는 제공하지 않으며, 입금 확인 후 출고가 진행됩니다.';
  const bankLine = `${bankName} ${accountNumber} ${accountHolder}`;

  const total = cartTotal;
  const hasItems = cart.length > 0;

  const orderMemo = useMemo(() => [
    `[주문 접수] ${companyName}`,
    `───────────────────`,
    ...cart.map((item) => `• ${item.product.name}  ×${item.quantity}  ${item.product.price ? money(item.product.price * item.quantity) + '원' : ''}`),
    `───────────────────`,
    `합계: ${money(total)}원`,
    ``,
    `입금자명: ${payerName || '(미입력)'}`,
    `연락처: ${payerPhone || '(미입력)'}`,
    note ? `요청사항: ${note}` : '',
    ``,
    `입금 계좌: ${bankLine}`,
  ].filter(l => l !== null).join('\n'), [companyName, cart, total, payerName, payerPhone, note, bankLine]);

  const inquiryText = useMemo(() => [
    '안녕하세요. 아래 제품으로 주문 문의드립니다.',
    '',
    ...cart.map((item) => `• ${item.product.name} × ${item.quantity}`),
    '',
    `입금자명: ${payerName || '(미입력)'}`,
    `연락처: ${payerPhone || '(미입력)'}`,
    `합계: ${money(total)}원`,
    note ? `요청사항: ${note}` : '',
  ].filter(Boolean).join('\n'), [cart, payerName, payerPhone, note, total]);

  const inquiryHref = `/support/contact?name=${encodeURIComponent(payerName)}&phone=${encodeURIComponent(payerPhone)}&content=${encodeURIComponent(inquiryText)}`;

  return (
    <main style={{ minHeight: '100vh', background: '#f6f8fc', color: '#0f172a' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(circle at 15% 10%, rgba(14,165,233,0.10), transparent 30%), radial-gradient(circle at 85% 5%, rgba(59,130,246,0.10), transparent 25%)', pointerEvents: 'none' }} />
      <Navbar />

      {/* ── 히어로 ── */}
      <section style={{ position: 'relative', padding: '110px 24px 28px' }}>
        <div className="container">
          <div style={{
            borderRadius: 32, padding: '32px 36px',
            background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(18px)',
            border: '1px solid rgba(148,163,184,0.18)',
            boxShadow: '0 20px 60px rgba(15,23,42,0.08)',
            display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#0ea5e9', marginBottom: 12 }}>SHOPPING CART</div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 14 }}>
                장바구니
              </h1>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, maxWidth: 520 }}>
                아래 주문 양식을 작성한 뒤 <strong style={{ color: '#0284c7' }}>주문 메모 복사</strong> 버튼을 누르고,
                이메일이나 문의 페이지로 보내주시면 바로 접수됩니다.
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
                {[
                  { icon: '🏦', text: '계좌이체 결제' },
                  { icon: '✅', text: '입금 확인 후 출고' },
                  { icon: '📋', text: '메모 한 번에 복사' },
                ].map(b => (
                  <span key={b.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>
                    <span>{b.icon}</span>{b.text}
                  </span>
                ))}
              </div>
            </div>

            {/* 요약 카드 */}
            <div style={{
              minWidth: 200, padding: '20px 24px', borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(14,165,233,0.10), rgba(59,130,246,0.06))',
              border: '1px solid rgba(14,165,233,0.14)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: '#0ea5e9', marginBottom: 14 }}>주문 요약</div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#334155' }}>
                  <span>총 제품</span>
                  <strong style={{ color: '#0f172a' }}>{cartCount}개</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#334155' }}>
                  <span>금액</span>
                  <strong style={{ color: '#0f172a' }}>{money(cartTotal)}원</strong>
                </div>
                <div style={{ height: 1, background: 'rgba(14,165,233,0.15)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                  <span style={{ color: '#0284c7', fontWeight: 700 }}>입금 금액</span>
                  <strong style={{ color: '#0ea5e9', fontSize: 20 }}>{money(total)}원</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 본문 ── */}
      <section style={{ position: 'relative', padding: '8px 24px 80px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.7fr)',
            gap: 24, alignItems: 'start',
          }}>
            {/* 왼쪽: 상품 목록 */}
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{
                padding: '18px 24px', borderRadius: 24,
                background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(148,163,184,0.15)',
                boxShadow: '0 8px 30px rgba(15,23,42,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.03em' }}>담은 상품</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                  <Truck size={14} />
                  입금 확인 후 순차 출고
                </div>
              </div>

              {!hasItems ? (
                <div style={{
                  padding: '60px 24px', borderRadius: 28, textAlign: 'center',
                  background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(148,163,184,0.15)',
                  boxShadow: '0 8px 30px rgba(15,23,42,0.05)',
                }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px', display: 'grid', placeItems: 'center', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.12)' }}>
                    <ShoppingBag size={32} color="#0ea5e9" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>장바구니가 비어있습니다</div>
                  <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
                    제품을 담으면 이곳에서 한 번에 주문할 수 있습니다.
                  </p>
                  <Link href="/shop" className="btn-primary">
                    제품 둘러보기 <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {cart.map((item, i) => {
                    const image = item.product.image || item.product.images?.[0];
                    return (
                      <div key={item.product.id} style={{
                        display: 'grid', gridTemplateColumns: '100px minmax(0,1fr) auto',
                        gap: 16, padding: 16, borderRadius: 22,
                        background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(148,163,184,0.13)',
                        boxShadow: '0 4px 20px rgba(15,23,42,0.05)',
                        animation: 'fadeInUp 0.4s ease forwards', animationDelay: `${i * 50}ms`,
                        alignItems: 'center',
                      }}>
                        <div style={{
                          width: 100, aspectRatio: '1', borderRadius: 16, overflow: 'hidden',
                          background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(148,163,184,0.10)',
                        }}>
                          {image
                            ? <img src={image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: 26 }}>💡</div>
                          }
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                            <span className="tag" style={{ background: 'rgba(14,165,233,0.08)', color: '#0369a1' }}>{item.product.category}</span>
                            {item.product.badge && <span className="tag" style={{ background: 'rgba(16,185,129,0.08)', color: '#059669' }}>{item.product.badge}</span>}
                          </div>
                          <Link href={`/shop/${item.product.id}`} style={{ color: '#0f172a', textDecoration: 'none', fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', display: 'block', marginBottom: 6 }}>
                            {item.product.name}
                          </Link>
                          {item.product.price > 0 && (
                            <div style={{ fontSize: 14, color: '#64748b' }}>
                              단가 <strong style={{ color: '#0284c7' }}>{money(item.product.price)}원</strong>
                            </div>
                          )}
                          <button onClick={() => removeFromCart(item.product.id)}
                            style={{ marginTop: 8, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 700, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Trash2 size={13} />삭제
                          </button>
                        </div>

                        <div style={{ display: 'grid', justifyItems: 'end', gap: 10 }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <button onClick={() => updateQty(item.product.id, Math.max(0, item.quantity - 1))}
                              style={{ width: 30, height: 30, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                              <Minus size={14} />
                            </button>
                            <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 900, fontSize: 16 }}>{item.quantity}</span>
                            <button onClick={() => updateQty(item.product.id, item.quantity + 1)}
                              style={{ width: 30, height: 30, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                              <Plus size={14} />
                            </button>
                          </div>
                          {item.product.price > 0 && (
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>소계</div>
                              <div style={{ fontSize: 20, fontWeight: 900, color: '#0284c7', letterSpacing: '-0.03em' }}>{money(item.product.price * item.quantity)}원</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <button onClick={clearCart} style={{
                    background: 'none', border: '1px dashed #e2e8f0', borderRadius: 14,
                    padding: '12px', color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <Trash2 size={14} />장바구니 전체 비우기
                  </button>
                </div>
              )}
            </div>

            {/* 오른쪽: 주문 접수 */}
            <aside style={{ position: 'sticky', top: 96 }}>
              <div style={{
                padding: 24, borderRadius: 28,
                background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(148,163,184,0.15)',
                boxShadow: '0 16px 50px rgba(15,23,42,0.09)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.6, color: '#0ea5e9', marginBottom: 5 }}>ORDER</div>
                    <h3 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.03em' }}>주문 접수</h3>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.14)' }}>
                    <Banknote size={19} color="#0ea5e9" />
                  </div>
                </div>

                {/* 입금 계좌 */}
                <div style={{
                  padding: '14px 16px', borderRadius: 18,
                  background: 'linear-gradient(135deg, #eff8ff, #f0f7ff)',
                  border: '1px solid rgba(14,165,233,0.15)', marginBottom: 18,
                }}>
                  <div style={{ fontSize: 11, color: '#0284c7', fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>입금 계좌</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', marginBottom: 6, letterSpacing: '-0.02em' }}>
                    {bankName} &nbsp;·&nbsp; {accountNumber}
                  </div>
                  <div style={{ fontSize: 13, color: '#0369a1', fontWeight: 700, marginBottom: 8 }}>예금주: {accountHolder}</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{notice}</div>
                </div>

                {/* 입력 폼 */}
                <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#334155', fontWeight: 700 }}>입금자명 <span style={{ color: '#ef4444' }}>*</span></span>
                    <input
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      placeholder="실제 입금하실 이름을 입력해 주세요"
                      style={{ width: '100%', background: '#fff', border: '1.5px solid #e2e8f0', color: '#0f172a', borderRadius: 12, padding: '11px 14px', outline: 'none', fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' }}
                    />
                  </label>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#334155', fontWeight: 700 }}>연락처 <span style={{ color: '#ef4444' }}>*</span></span>
                    <input
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      style={{ width: '100%', background: '#fff', border: '1.5px solid #e2e8f0', color: '#0f172a', borderRadius: 12, padding: '11px 14px', outline: 'none', fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' }}
                    />
                  </label>
                  <label style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#334155', fontWeight: 700 }}>요청 사항</span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="납기일, 배송 주소, 세금계산서 요청 등을 입력해 주세요"
                      rows={3}
                      style={{ width: '100%', background: '#fff', border: '1.5px solid #e2e8f0', color: '#0f172a', borderRadius: 12, padding: '11px 14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' }}
                    />
                  </label>
                </div>

                {/* 금액 합계 */}
                <div style={{ display: 'grid', gap: 8, marginBottom: 18, padding: '14px 16px', background: '#f8fafc', borderRadius: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                    <span>상품 합계</span>
                    <span>{money(cartTotal)}원</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                    <span>배송비</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>협의</span>
                  </div>
                  <div style={{ height: 1, background: '#e2e8f0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>총 입금액</span>
                    <strong style={{ fontSize: 26, fontWeight: 900, color: '#0ea5e9', letterSpacing: '-0.04em' }}>{money(total)}원</strong>
                  </div>
                </div>

                {/* CTA 버튼 */}
                <div style={{ display: 'grid', gap: 10 }}>
                  <CopyButton text={orderMemo} label="주문 메모 복사하기" />
                  <Link href={inquiryHref} className="btn-secondary" style={{ justifyContent: 'center', textAlign: 'center', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.07)', color: '#0284c7', borderColor: 'rgba(14,165,233,0.15)' }}>
                    문의 페이지로 바로 접수 <ArrowRight size={15} />
                  </Link>
                  <Link href="/shop" className="btn-secondary" style={{ justifyContent: 'center', textAlign: 'center', display: 'flex', alignItems: 'center', gap: 8 }}>
                    쇼핑 계속하기 <ChevronRight size={15} />
                  </Link>
                </div>

                <p style={{ marginTop: 14, fontSize: 12, color: '#94a3b8', lineHeight: 1.7, textAlign: 'center' }}>
                  메모를 복사해 이메일 또는 문의 페이지에 붙여넣기 하시면<br />빠르게 주문이 접수됩니다.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
