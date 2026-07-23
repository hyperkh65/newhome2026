'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ynk-datahub-popup-hide-until';
const HIDE_MS = 24 * 60 * 60 * 1000;

function shouldShowPopup() {
  if (typeof window === 'undefined') return false;
  const hiddenUntil = window.localStorage.getItem(STORAGE_KEY);
  if (!hiddenUntil) return true;
  const expiresAt = Number(hiddenUntil);
  if (!Number.isFinite(expiresAt)) return true;
  return Date.now() > expiresAt;
}

export default function DataHubPromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(shouldShowPopup());
  }, []);

  const closePopup = () => setOpen(false);

  const hideForToday = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now() + HIDE_MS));
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="promo-popup">
      <button
        type="button"
        aria-label="팝업 닫기"
        className="promo-popup__close"
        onClick={closePopup}
      >
        ×
      </button>

      <div className="promo-popup__eyebrow">NEW DATA SERVICE</div>
      <h3 className="promo-popup__title">조달·민수 데이터 허브 오픈</h3>
      <p className="promo-popup__text">
        조달 등록 제품, 업체, 가격 흐름을 한 화면에서 검색해보세요.
      </p>

      <div className="promo-popup__stats">
        <div>
          <strong>13,062</strong>
          <span>조달 제품</span>
        </div>
        <div>
          <strong>1,059</strong>
          <span>등록 업체</span>
        </div>
      </div>

      <div className="promo-popup__actions">
        <Link href="https://data.ynk2014.com" className="promo-popup__cta">
          데이터 허브 보기
        </Link>
        <button type="button" className="promo-popup__mute" onClick={hideForToday}>
          오늘 하루 보지 않기
        </button>
      </div>
    </div>
  );
}
