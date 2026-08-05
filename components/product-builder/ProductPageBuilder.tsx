"use client";

import { useMemo, useState, type CSSProperties } from "react";

import styles from "./ProductPageBuilder.module.css";

type Theme = "midnight" | "warm" | "clean";

const themes: Record<Theme, { label: string; accent: string; surface: string }> = {
  midnight: { label: "Midnight", accent: "#9df0dc", surface: "#081417" },
  warm: { label: "Solar", accent: "#ffcc63", surface: "#20160a" },
  clean: { label: "Studio", accent: "#1769ff", surface: "#f5f8ff" },
};

const defaultBullets = ["핵심 기능을 한 문장으로 설명", "구매자가 얻는 이점을 명확하게 제시", "신뢰를 높이는 사양과 보증 정보"]; 

export function ProductPageBuilder() {
  const [name, setName] = useState("UFO AM6 High Bay 150W");
  const [category, setCategory] = useState("산업용 LED 조명");
  const [audience, setAudience] = useState("물류센터·공장 운영 담당자");
  const [price, setPrice] = useState("₩189,000");
  const [specs, setSpecs] = useState("150W\n21,000 lm\n140 lm/W\nIP65\n5년 보증");
  const [bullets, setBullets] = useState(defaultBullets.join("\n"));
  const [theme, setTheme] = useState<Theme>("midnight");
  const [saved, setSaved] = useState(false);

  const bulletList = useMemo(
    () => bullets.split("\n").map((item) => item.trim()).filter(Boolean).slice(0, 4),
    [bullets]
  );
  const specList = useMemo(
    () => specs.split("\n").map((item) => item.trim()).filter(Boolean),
    [specs]
  );
  const summary = `${name}은 ${audience}를 위해 설계한 ${category}입니다. 빠른 설치와 안정적인 성능으로 운영 비용을 줄이고, 더 오래 사용할 수 있도록 구성했습니다.`;

  function generateDraft() {
    setBullets([
      `${category} 환경에 맞춘 ${name}의 안정적인 성능`,
      `${audience}가 바로 이해할 수 있는 간결한 사양과 설치 정보`,
      "에너지 효율과 유지보수 비용을 함께 고려한 구매 제안",
    ].join("\n"));
    setSaved(false);
  }

  function saveDraft() {
    window.localStorage.setItem("product-page-builder-draft", JSON.stringify({ name, category, audience, price, specs, bullets, theme }));
    setSaved(true);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.kicker}>PRODUCT STUDIO / AI DRAFT</div>
          <h1>상품페이지 빌더</h1>
          <p>제품 정보만 넣으면 판매 구조와 디자인 초안을 즉시 조립합니다.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.ghostButton} onClick={saveDraft}>{saved ? "임시저장됨" : "임시저장"}</button>
          <button className={styles.primaryButton} onClick={generateDraft}>AI 초안 만들기</button>
        </div>
      </header>

      <section className={styles.workspace}>
        <aside className={styles.editor}>
          <div className={styles.editorHeader}><span>01</span><h2>제품 정보</h2></div>
          <label>제품명<input value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>카테고리<input value={category} onChange={(event) => setCategory(event.target.value)} /></label>
          <label>주요 고객<input value={audience} onChange={(event) => setAudience(event.target.value)} /></label>
          <label>대표 가격<input value={price} onChange={(event) => setPrice(event.target.value)} /></label>

          <div className={styles.editorHeader}><span>02</span><h2>판매 포인트</h2></div>
          <label>핵심 장점 <small>줄마다 하나씩</small><textarea value={bullets} onChange={(event) => setBullets(event.target.value)} rows={5} /></label>
          <label>핵심 사양 <small>줄마다 하나씩</small><textarea value={specs} onChange={(event) => setSpecs(event.target.value)} rows={5} /></label>

          <div className={styles.editorHeader}><span>03</span><h2>디자인 톤</h2></div>
          <div className={styles.themeGrid}>
            {(Object.keys(themes) as Theme[]).map((item) => (
              <button key={item} className={`${styles.themeButton} ${theme === item ? styles.themeActive : ""}`} onClick={() => setTheme(item)}>
                <i style={{ background: themes[item].surface }} /><span>{themes[item].label}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className={styles.previewPane}>
          <div className={styles.previewBar}><span>실시간 페이지 미리보기</span><span>Desktop · 1440px</span></div>
          <article className={styles.preview} style={{ "--surface": themes[theme].surface, "--accent": themes[theme].accent } as CSSProperties}>
            <div className={styles.previewNav}><strong>YNK</strong><span>{category}</span><button>견적 문의</button></div>
            <section className={styles.hero}>
              <div><p className={styles.eyebrow}>ENGINEERED FOR PERFORMANCE</p><h2>{name}</h2><p className={styles.summary}>{summary}</p><div className={styles.ctaRow}><button>상세 사양 보기</button><strong>{price}</strong></div></div>
              <div className={styles.productVisual}><span>PRODUCT<br />IMAGE</span></div>
            </section>
            <section className={styles.benefitGrid}>{bulletList.map((bullet, index) => <div key={bullet}><b>0{index + 1}</b><p>{bullet}</p></div>)}</section>
            <section className={styles.specSection}><p className={styles.eyebrow}>AT A GLANCE</p><h3>구매 결정을 빠르게 하는 핵심 사양</h3><div>{specList.map((spec) => <span key={spec}>{spec}</span>)}</div></section>
          </article>
        </section>
      </section>
    </main>
  );
}
