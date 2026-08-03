"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createLightPracticeCard, type LightExpression } from "@/lib/english/catalog";

type ApiResponse = {
  items: LightExpression[];
  total: number;
  page: number;
  totalPages: number;
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: "#22c55e",
  intermediate: "#38bdf8",
  advanced: "#a78bfa",
};

const SOURCE_LABELS: Record<string, string> = {
  wordnet: "General",
  business: "Business",
};

const CATEGORIES = [
  "all","general","business","email","communication","operations","finance",
  "sales","management","quality","logistics","strategy","hr","marketing",
  "negotiation","academic","daily","technical","idiom","phrase",
];

export function LightExpressionBrowser({ totalCount }: { totalCount: number }) {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState("all");
  const [source, setSource] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<LightExpression | null>(null);
  const [practiceSeed, setPracticeSeed] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback((params: {
    q: string; level: string; category: string; source: string; page: number;
  }) => {
    setLoading(true);
    const sp = new URLSearchParams({
      q: params.q, level: params.level, category: params.category,
      source: params.source, page: String(params.page),
    });
    fetch(`/api/english/expressions?${sp}`)
      .then(r => r.json())
      .then((d: ApiResponse) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchData({ q, level, category, source, page: 1 });
    }, 300);
  }, [q, level, category, source, fetchData]);

  useEffect(() => {
    fetchData({ q, level, category, source, page });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const practiceCard = selected ? createLightPracticeCard(selected, practiceSeed) : null;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
            핵심 표현 라이브러리
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: "4px 0 0" }}>
            WordNet + 비즈니스 표현 총 {totalCount.toLocaleString()}개 · 검색·레벨·카테고리 필터
          </p>
        </div>
        {data && (
          <span style={{ color: "#64748b", fontSize: 13 }}>
            {data.total.toLocaleString()}개 결과
          </span>
        )}
      </div>

      {/* 필터 바 */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="표현·한국어·정의 검색..."
          style={{
            flex: "1 1 200px", padding: "8px 14px", borderRadius: 10,
            background: "#1e293b", border: "1px solid #334155",
            color: "#f1f5f9", fontSize: 14, outline: "none",
          }}
        />
        <select
          value={level}
          onChange={e => setLevel(e.target.value)}
          style={selectStyle}
        >
          <option value="all">모든 레벨</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select value={source} onChange={e => setSource(e.target.value)} style={selectStyle}>
          <option value="all">전체 출처</option>
          <option value="wordnet">General (WordNet)</option>
          <option value="business">Business</option>
        </select>
        <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c === "all" ? "전체 카테고리" : c}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20, alignItems: "start" }}>
        {/* 카드 리스트 */}
        <div>
          {loading && (
            <div style={{ color: "#64748b", padding: "40px 0", textAlign: "center" }}>불러오는 중...</div>
          )}
          {!loading && data && (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 10,
              }}>
                {data.items.map(entry => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      setSelected(prev => prev?.id === entry.id ? null : entry);
                      setShowAnswer(false);
                      setPracticeSeed(0);
                    }}
                    style={{
                      textAlign: "left", padding: "14px 16px", borderRadius: 12,
                      background: selected?.id === entry.id ? "#1e3a5f" : "#1e293b",
                      border: `1px solid ${selected?.id === entry.id ? "#38bdf8" : "#334155"}`,
                      cursor: "pointer", display: "grid", gap: 6, transition: "border-color .15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                        background: LEVEL_COLORS[entry.level] + "22",
                        color: LEVEL_COLORS[entry.level],
                      }}>
                        {entry.level}
                      </span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        {SOURCE_LABELS[entry.source]}
                      </span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>
                      {entry.expression}
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>{entry.korean}</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>
                      {entry.definition}
                    </div>
                  </button>
                ))}
              </div>

              {!data.items.length && (
                <div style={{ color: "#64748b", padding: "40px 0", textAlign: "center" }}>
                  검색 결과가 없습니다.
                </div>
              )}

              {/* 페이지네이션 */}
              {data.totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, justifyContent: "center" }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    style={pageButtonStyle(page <= 1)}
                  >
                    ← Prev
                  </button>
                  <span style={{ color: "#94a3b8", fontSize: 14 }}>
                    {page} / {data.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                    disabled={page >= data.totalPages}
                    style={pageButtonStyle(page >= data.totalPages)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 선택된 표현 상세 + 연습 */}
        {selected && practiceCard && (
          <div style={{
            position: "sticky", top: 20, background: "#1e293b",
            border: "1px solid #334155", borderRadius: 16, padding: 24, display: "grid", gap: 18,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                  background: LEVEL_COLORS[selected.level] + "22",
                  color: LEVEL_COLORS[selected.level],
                }}>
                  {selected.level}
                </span>
                <span style={{ fontSize: 12, color: "#64748b" }}>{selected.pos}</span>
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 900, color: "#f1f5f9", margin: 0 }}>
                {selected.expression}
              </h3>
              <p style={{ color: "#38bdf8", fontWeight: 700, margin: "6px 0 0", fontSize: 16 }}>
                {selected.korean}
              </p>
            </div>

            <div style={{ borderTop: "1px solid #334155", paddingTop: 14, display: "grid", gap: 10 }}>
              <div style={{ fontSize: 14, color: "#94a3b8" }}>{selected.definition}</div>
              <div style={{
                padding: "10px 14px", borderRadius: 10,
                background: "#0f172a", border: "1px solid #1e3a5f",
              }}>
                <div style={{ fontSize: 13, color: "#f1f5f9", lineHeight: 1.6 }}>
                  {selected.example}
                </div>
                {selected.exampleKr && (
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    {selected.exampleKr}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {selected.categories.slice(0, 4).map(c => (
                  <span key={c} style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 99,
                    background: "#334155", color: "#94a3b8",
                  }}>{c}</span>
                ))}
              </div>
            </div>

            {/* 연습 카드 */}
            <div style={{
              borderTop: "1px solid #334155", paddingTop: 14, display: "grid", gap: 12,
            }}>
              <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Practice · {practiceCard.taskType.replace(/-/g, " ")}
              </span>
              <p style={{ color: "#f1f5f9", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {practiceCard.prompt}
              </p>
              {showAnswer && (
                <div style={{
                  padding: "12px 14px", borderRadius: 10,
                  background: "#0f172a", border: "1px solid #22c55e33",
                }}>
                  <div style={{ fontSize: 13, color: "#22c55e", fontWeight: 700 }}>
                    {practiceCard.answer}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                    {practiceCard.explanation}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  onClick={() => setShowAnswer(v => !v)}
                  style={actionButtonStyle("#334155")}
                >
                  {showAnswer ? "숨기기" : "정답 보기"}
                </button>
                <button
                  onClick={() => { setPracticeSeed(s => s + 1); setShowAnswer(false); }}
                  style={actionButtonStyle("#334155")}
                >
                  다음 문제
                </button>
                <button
                  onClick={() => { setSelected(null); }}
                  style={actionButtonStyle("#1e3a5f")}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "8px 14px", borderRadius: 10,
  background: "#1e293b", border: "1px solid #334155",
  color: "#f1f5f9", fontSize: 14, outline: "none",
};

function pageButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "#1e293b" : "#334155", color: disabled ? "#475569" : "#f1f5f9",
    border: "1px solid #334155",
  };
}

function actionButtonStyle(bg: string): React.CSSProperties {
  return {
    padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
    background: bg, color: "#f1f5f9", border: "1px solid #334155",
  };
}
