"use client";

import { Player } from "@remotion/player";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { useEffect, useState } from "react";

import {
  countByLevel,
  createPracticeCard,
  ENGLISH_CATEGORIES,
  ENGLISH_ENTRIES,
  type EnglishEntry,
  type EnglishLevel,
  practiceUniverseSize,
} from "@/lib/english/catalog";

import styles from "./BusinessEnglishStudio.module.css";

type EntryGroup = {
  key: string;
  expression: string;
  korean: string;
  level: EnglishLevel;
  kind: EnglishEntry["kind"];
  categories: string[];
  grammarPattern: string;
  variants: EnglishEntry[];
};

type StudyProfile = {
  name: string;
  email: string;
  targetLevel: EnglishLevel;
  dailyGoal: number;
  createdAt: string;
};

type StudyProgress = {
  studiedEntries: string[];
  masteredEntries: string[];
  studiedCards: number;
  practiceCardsSolved: string[];
  streakDays: number;
  lastStudiedAt: string | null;
};

const PROFILE_KEY = "english-study-profile-v1";
const PROGRESS_KEY = "english-study-progress-v1";
const PAGE_SIZE = 60;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function MotionComposition({ entry }: { entry: EnglishEntry }) {
  const frame = useCurrentFrame();
  const headlineY = interpolate(frame, [0, 25], [50, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const alpha = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const bar = interpolate(frame, [0, 120], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.28), transparent 30%), linear-gradient(135deg, #061421 0%, #0f2c47 55%, #102132 100%)",
        color: "white",
        padding: 72,
        fontFamily: "Pretendard, Apple SD Gothic Neo, sans-serif",
      }}
    >
      <Sequence from={0}>
        <div
          style={{
            opacity: alpha,
            transform: `translateY(${headlineY}px)`,
            display: "grid",
            gap: 24,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Business English
            </div>
            <div
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                background: entry.level === "advanced" ? "rgba(129,140,248,0.28)" : "rgba(45,212,191,0.24)",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              {entry.level === "advanced" ? "Advanced" : "Intermediate"}
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ fontSize: 74, fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 1 }}>
              {entry.expression}
            </div>
            <div style={{ fontSize: 34, color: "rgba(255,255,255,0.76)" }}>{entry.korean}</div>
          </div>

          <div
            style={{
              padding: 28,
              borderRadius: 28,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "grid",
              gap: 18,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: "rgba(255,255,255,0.68)" }}>Pattern</div>
            <div style={{ fontSize: 34, lineHeight: 1.45 }}>{entry.grammarPattern}</div>
            <div style={{ fontSize: 25, lineHeight: 1.55, color: "rgba(255,255,255,0.78)" }}>
              {entry.examples[0]?.en}
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "grid", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {entry.categories.slice(0, 4).map((category) => (
                <div
                  key={category}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.12)",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
            <div
              style={{
                width: "100%",
                height: 10,
                borderRadius: 999,
                overflow: "hidden",
                background: "rgba(255,255,255,0.14)",
              }}
            >
              <div
                style={{
                  width: `${bar}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #38bdf8, #2dd4bf)",
                }}
              />
            </div>
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
}

const emptyProgress: StudyProgress = {
  studiedEntries: [],
  masteredEntries: [],
  studiedCards: 0,
  practiceCardsSolved: [],
  streakDays: 0,
  lastStudiedAt: null,
};

function daysBetween(a: string, b: string) {
  const start = new Date(a);
  const end = new Date(b);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function buildGroups(entries: EnglishEntry[]) {
  const map = new Map<string, EntryGroup>();

  for (const entry of entries) {
    const key = `${entry.level}:${entry.baseExpression}`;
    const existing = map.get(key);
    if (existing) {
      existing.variants.push(entry);
      existing.categories = Array.from(new Set([...existing.categories, ...entry.categories]));
      continue;
    }

    map.set(key, {
      key,
      expression: entry.baseExpression,
      korean: entry.korean,
      level: entry.level,
      kind: entry.kind,
      categories: [...entry.categories],
      grammarPattern: entry.grammarPattern,
      variants: [entry],
    });
  }

  return Array.from(map.values());
}

export function BusinessEnglishStudio() {
  const [mounted, setMounted] = useState(false);
  const [targetLevel, setTargetLevel] = useState<EnglishLevel>("intermediate");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(ENGLISH_ENTRIES[0]?.id ?? "");
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"overview" | "examples" | "practice">("overview");
  const [practiceSeed, setPracticeSeed] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [progress, setProgress] = useState<StudyProgress>(emptyProgress);
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    targetLevel: "intermediate" as EnglishLevel,
    dailyGoal: "12",
  });

  useEffect(() => {
    setMounted(true);
    try {
      const storedProfile = window.localStorage.getItem(PROFILE_KEY);
      const storedProgress = window.localStorage.getItem(PROGRESS_KEY);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile) as StudyProfile);
      }
      if (storedProgress) {
        setProgress({ ...emptyProgress, ...(JSON.parse(storedProgress) as StudyProgress) });
      }
    } catch {
      // ignore storage parse issues
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (profile) {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  }, [mounted, profile]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [mounted, progress]);

  const filteredEntries = ENGLISH_ENTRIES.filter((entry) => {
    if (entry.level !== targetLevel) return false;
    if (category !== "all" && !entry.categories.includes(category)) return false;
    if (!query.trim()) return true;
    const haystack = [
      entry.baseExpression,
      entry.korean,
      entry.grammarPattern,
      entry.scenarioLabel,
      entry.focusObject,
      entry.categories.join(" "),
      entry.examples.map((item) => item.en).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  const groupedEntries = buildGroups(filteredEntries);

  const totalPages = Math.max(1, Math.ceil(groupedEntries.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedGroups = groupedEntries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const selectedEntry =
    filteredEntries.find((entry) => entry.id === selectedId) ??
    pagedGroups[0]?.variants[0] ??
    filteredEntries[0] ??
    ENGLISH_ENTRIES[0];

  const selectedGroup =
    groupedEntries.find(
      (group) =>
        group.level === selectedEntry.level && group.expression === selectedEntry.baseExpression
    ) ?? null;

  const practiceCard = createPracticeCard(selectedEntry, practiceSeed);
  const intermediateStats = countByLevel("intermediate");
  const advancedStats = countByLevel("advanced");
  const completionRate =
    selectedEntry && ENGLISH_ENTRIES.length > 0
      ? Math.round((progress.studiedEntries.length / ENGLISH_ENTRIES.length) * 100)
      : 0;
  const masteredRate =
    selectedEntry && ENGLISH_ENTRIES.length > 0
      ? Math.round((progress.masteredEntries.length / ENGLISH_ENTRIES.length) * 100)
      : 0;
  const solvedToday =
    progress.lastStudiedAt && daysBetween(progress.lastStudiedAt, new Date().toISOString()) === 0
      ? progress.studiedCards
      : progress.studiedCards;

  useEffect(() => {
    setPage(1);
  }, [targetLevel, category, query]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!filteredEntries.length) return;
    if (!filteredEntries.some((entry) => entry.id === selectedId)) {
      setSelectedId(filteredEntries[0].id);
      setShowAnswer(false);
    }
  }, [filteredEntries, selectedId]);

  function markEntry(type: "studied" | "mastered") {
    const now = new Date().toISOString();
    setProgress((current) => {
      const studiedEntries = current.studiedEntries.includes(selectedEntry.id)
        ? current.studiedEntries
        : [...current.studiedEntries, selectedEntry.id];
      const masteredEntries =
        type === "mastered" && !current.masteredEntries.includes(selectedEntry.id)
          ? [...current.masteredEntries, selectedEntry.id]
          : current.masteredEntries;
      const daysGap = current.lastStudiedAt ? daysBetween(current.lastStudiedAt, now) : null;
      const streakDays =
        daysGap === null ? 1 : daysGap === 0 ? current.streakDays || 1 : daysGap === 1 ? current.streakDays + 1 : 1;

      return {
        ...current,
        studiedEntries,
        masteredEntries,
        lastStudiedAt: now,
        streakDays,
      };
    });
  }

  function markPracticeSolved(mastered: boolean) {
    const now = new Date().toISOString();
    setProgress((current) => {
      const practiceCardsSolved = current.practiceCardsSolved.includes(practiceCard.id)
        ? current.practiceCardsSolved
        : [...current.practiceCardsSolved, practiceCard.id];
      const studiedEntries = current.studiedEntries.includes(selectedEntry.id)
        ? current.studiedEntries
        : [...current.studiedEntries, selectedEntry.id];
      const masteredEntries =
        mastered && !current.masteredEntries.includes(selectedEntry.id)
          ? [...current.masteredEntries, selectedEntry.id]
          : current.masteredEntries;
      const daysGap = current.lastStudiedAt ? daysBetween(current.lastStudiedAt, now) : null;
      const streakDays =
        daysGap === null ? 1 : daysGap === 0 ? current.streakDays || 1 : daysGap === 1 ? current.streakDays + 1 : 1;

      return {
        ...current,
        studiedEntries,
        masteredEntries,
        practiceCardsSolved,
        studiedCards: current.studiedCards + 1,
        streakDays,
        lastStudiedAt: now,
      };
    });
    setPracticeSeed((current) => current + 1);
    setShowAnswer(false);
  }

  function handleSignupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextProfile: StudyProfile = {
      name: signup.name.trim() || "Learner",
      email: signup.email.trim(),
      targetLevel: signup.targetLevel,
      dailyGoal: Number(signup.dailyGoal) || 12,
      createdAt: new Date().toISOString(),
    };
    setProfile(nextProfile);
    setTargetLevel(nextProfile.targetLevel);
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={`${styles.panel} ${styles.heroMain}`}>
            <div className={styles.eyebrow}>English Self Study / Business Phrasal Verbs</div>
            <h1 className={styles.title}>Business English Study Lab</h1>
            <p className={styles.subtitle}>
              비즈니스 구동사와 패턴을 중급·고급 단계로 나눠서 공부할 수 있도록 만들었습니다.
              핵심 라이브러리 표현을 먼저 익히고, 생성형 드릴로 100,000개 이상 연습 문장을 반복하면서
              이메일, 회의, 보고, 협상, 공급망 문맥까지 자연스럽게 확장할 수 있습니다.
            </p>

            <div className={styles.levelPills}>
              <button
                className={`${styles.pill} ${targetLevel === "intermediate" ? styles.pillActive : ""}`}
                onClick={() => setTargetLevel("intermediate")}
              >
                Intermediate
              </button>
              <button
                className={`${styles.pill} ${targetLevel === "advanced" ? styles.pillActive : ""}`}
                onClick={() => setTargetLevel("advanced")}
              >
                Advanced
              </button>
            </div>

            <div className={styles.statGrid}>
              <article className={styles.statCard}>
                <span className={styles.statLabel}>Intermediate Study Cards</span>
                <strong className={styles.statValue}>{formatNumber(intermediateStats.entries)}</strong>
                <span className={styles.statHelper}>{formatNumber(intermediateStats.drills)} generated drills</span>
              </article>
              <article className={styles.statCard}>
                <span className={styles.statLabel}>Advanced Study Cards</span>
                <strong className={styles.statValue}>{formatNumber(advancedStats.entries)}</strong>
                <span className={styles.statHelper}>{formatNumber(advancedStats.drills)} generated drills</span>
              </article>
              <article className={styles.statCard}>
                <span className={styles.statLabel}>Study Universe</span>
                <strong className={styles.statValue}>{formatNumber(practiceUniverseSize())}</strong>
                <span className={styles.statHelper}>구동사, 패턴, 예문 기반 생성형 연습 카드</span>
              </article>
              <article className={styles.statCard}>
                <span className={styles.statLabel}>Tracked Progress</span>
                <strong className={styles.statValue}>{completionRate}%</strong>
                <span className={styles.statHelper}>가입 후 브라우저에 진도율과 복습 이력 저장</span>
              </article>
            </div>
          </div>

          <div className={`${styles.panel} ${styles.heroSide}`}>
            <div className={styles.motionWrap}>
              {mounted ? (
                <Player
                  component={MotionComposition}
                  inputProps={{ entry: selectedEntry }}
                  durationInFrames={180}
                  compositionWidth={1280}
                  compositionHeight={720}
                  fps={30}
                  style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
                  controls
                  autoPlay
                  loop
                  acknowledgeRemotionLicense
                />
              ) : (
                <div style={{ width: "100%", aspectRatio: "16 / 9", background: "#091321" }} />
              )}
            </div>
            <div className={styles.footerNote}>
              리모션 카드가 현재 선택한 표현의 의미, 문형, 예문을 반복 재생합니다. 보고 따라 읽고,
              바로 아래 생성형 연습으로 넘어가면 자가 학습이 훨씬 빠릅니다.
            </div>
          </div>
        </section>

        <section className={styles.bodyGrid}>
          <aside className={`${styles.panel} ${styles.sidebar}`}>
            <div>
              <h2 className={styles.sectionTitle}>Study Library</h2>
              <p className={styles.profileNote}>
                5,000개 이상 학습 단위를 검색하고, 카테고리와 난이도별로 빠르게 좁혀 볼 수 있습니다.
              </p>
            </div>

            <input
              className={styles.field}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search expression, Korean meaning, pattern"
            />

            <select
              className={styles.select}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">All categories</option>
              {ENGLISH_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <div className={styles.searchMeta}>
              {formatNumber(groupedEntries.length)} core expressions / {formatNumber(filteredEntries.length)} study cards / {formatNumber(practiceUniverseSize(filteredEntries))} drills
              {groupedEntries.length ? (
                <>
                  {" "}
                  · page {formatNumber(currentPage)} of {formatNumber(totalPages)}
                </>
              ) : null}
            </div>

            <div className={styles.entryList}>
              {pagedGroups.map((group) => {
                const preview = group.variants[0];
                const isActive =
                  selectedGroup?.key === group.key;
                const isMastered = group.variants.some((entry) =>
                  progress.masteredEntries.includes(entry.id)
                );
                return (
                  <button
                    key={group.key}
                    className={`${styles.entryCard} ${isActive ? styles.entryCardActive : ""}`}
                    onClick={() => {
                      setSelectedId(preview.id);
                      setShowAnswer(false);
                    }}
                  >
                    <div className={styles.entryTop}>
                      <div>
                        <h3 className={styles.entryExpression}>{group.expression}</h3>
                        <div className={styles.entryKorean}>{group.korean}</div>
                      </div>
                    </div>
                    <div className={styles.badgeRow}>
                      <span className={`${styles.badge} ${group.level === "advanced" ? styles.badgeAdvanced : ""}`}>
                        {group.level}
                      </span>
                      <span className={styles.badge}>{group.kind}</span>
                      {isMastered ? <span className={`${styles.badge} ${styles.badgeMastered}`}>mastered</span> : null}
                    </div>
                    <div className={styles.searchMeta}>
                      {group.grammarPattern}
                    </div>
                    <div className={styles.searchMeta}>
                      {formatNumber(group.variants.length)} study cards · {group.variants.slice(0, 3).map((item) => item.scenarioLabel).join(", ")}
                    </div>
                  </button>
                );
              })}
              {!pagedGroups.length ? (
                <div className={styles.emptyState}>
                  검색 결과가 없습니다. 키워드나 카테고리를 바꿔서 다시 찾아보세요.
                </div>
              ) : null}
            </div>

            {groupedEntries.length ? (
              <div className={styles.pagination}>
                <button
                  className={styles.secondaryButton}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className={styles.paginationMeta}>
                  {formatNumber((currentPage - 1) * PAGE_SIZE + 1)}-
                  {formatNumber(Math.min(currentPage * PAGE_SIZE, groupedEntries.length))} /{" "}
                  {formatNumber(groupedEntries.length)}
                </div>
                <button
                  className={styles.secondaryButton}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            ) : null}
          </aside>

          <div className={styles.content}>
            <section className={`${styles.panel} ${styles.profileCard}`}>
              {!profile ? (
                <>
                  <div>
                    <h2 className={styles.sectionTitle}>Quick Sign-up</h2>
                    <p className={styles.profileNote}>
                      가입하면 현재 브라우저에 학습 프로필, 진도율, 복습 카드, 연속 학습일이 저장됩니다.
                    </p>
                  </div>
                  <form onSubmit={handleSignupSubmit} className={styles.practice}>
                    <input
                      className={styles.field}
                      placeholder="Name"
                      value={signup.name}
                      onChange={(event) => setSignup((current) => ({ ...current, name: event.target.value }))}
                    />
                    <input
                      className={styles.field}
                      type="email"
                      placeholder="Email"
                      value={signup.email}
                      onChange={(event) => setSignup((current) => ({ ...current, email: event.target.value }))}
                    />
                    <select
                      className={styles.select}
                      value={signup.targetLevel}
                      onChange={(event) =>
                        setSignup((current) => ({
                          ...current,
                          targetLevel: event.target.value as EnglishLevel,
                        }))
                      }
                    >
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <input
                      className={styles.field}
                      type="number"
                      min={5}
                      max={120}
                      value={signup.dailyGoal}
                      onChange={(event) => setSignup((current) => ({ ...current, dailyGoal: event.target.value }))}
                      placeholder="Daily goal"
                    />
                    <button className={styles.primaryButton} type="submit">
                      Create study profile
                    </button>
                    <div className={styles.footerNote}>
                      서버 계정이 아니라 현재 브라우저에 저장되는 간편 가입입니다. 나중에 실제 회원 시스템으로 바꾸기
                      쉬운 구조로 분리해 두었습니다.
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div>
                    <h2 className={styles.sectionTitle}>Welcome back, {profile.name}</h2>
                    <p className={styles.profileNote}>
                      목표 난이도: {profile.targetLevel} / 일일 목표: {profile.dailyGoal} cards
                    </p>
                  </div>
                  <div className={styles.profileGrid}>
                    <div className={styles.metric}>
                      <div className={styles.metricValue}>{completionRate}%</div>
                      <div className={styles.metricLabel}>overall progress</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricValue}>{masteredRate}%</div>
                      <div className={styles.metricLabel}>mastered rate</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricValue}>{formatNumber(progress.studiedCards)}</div>
                      <div className={styles.metricLabel}>practice cards solved</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricValue}>{progress.streakDays}</div>
                      <div className={styles.metricLabel}>study streak days</div>
                    </div>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${completionRate}%` }} />
                  </div>
                  <div className={styles.footerNote}>
                    Studied {progress.studiedEntries.length} / {ENGLISH_ENTRIES.length} expressions · Today's solved
                    cards: {solvedToday}
                  </div>
                </>
              )}
            </section>

            <section className={`${styles.panel} ${styles.content}`}>
              <div className={styles.detailHero}>
                <div>
                  <div className={styles.badgeRow}>
                    <span className={`${styles.badge} ${selectedEntry.level === "advanced" ? styles.badgeAdvanced : ""}`}>
                      {selectedEntry.level}
                    </span>
                    <span className={styles.badge}>{selectedEntry.kind}</span>
                    {selectedEntry.categories.slice(0, 4).map((item) => (
                      <span key={item} className={styles.badge}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <h2 className={styles.detailTitle}>{selectedEntry.baseExpression}</h2>
                  <p className={styles.detailSub}>
                    {selectedEntry.korean} · {selectedEntry.usageNote}
                  </p>
                </div>

                <div className={styles.actionRow}>
                  <button className={styles.secondaryButton} onClick={() => markEntry("studied")}>
                    Mark studied
                  </button>
                  <button className={styles.primaryButton} onClick={() => markEntry("mastered")}>
                    Mark mastered
                  </button>
                </div>
              </div>

              <div className={styles.tabRow}>
                <button
                  className={`${styles.tab} ${tab === "overview" ? styles.tabActive : ""}`}
                  onClick={() => setTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`${styles.tab} ${tab === "examples" ? styles.tabActive : ""}`}
                  onClick={() => setTab("examples")}
                >
                  Examples
                </button>
                <button
                  className={`${styles.tab} ${tab === "practice" ? styles.tabActive : ""}`}
                  onClick={() => setTab("practice")}
                >
                  Practice
                </button>
              </div>

              {selectedGroup ? (
                <div className={styles.contextPanel}>
                  <div className={styles.contextHeader}>
                    <div>
                      <div className={styles.infoLabel}>Current context</div>
                      <div className={styles.contextTitle}>{selectedEntry.scenarioLabel}</div>
                    </div>
                    <div className={styles.contextObject}>{selectedEntry.focusObject}</div>
                  </div>
                  <div className={styles.contextList}>
                    {selectedGroup.variants.slice(0, 18).map((variant) => (
                      <button
                        key={variant.id}
                        className={`${styles.contextChip} ${selectedEntry.id === variant.id ? styles.contextChipActive : ""}`}
                        onClick={() => {
                          setSelectedId(variant.id);
                          setShowAnswer(false);
                        }}
                      >
                        <strong>{variant.scenarioLabel}</strong>
                        <span>{variant.focusObject}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {tab === "overview" ? (
                <div className={styles.cardGrid}>
                  <article className={styles.infoCard}>
                    <span className={styles.infoLabel}>Grammar pattern</span>
                    <div className={styles.infoValue}>{selectedEntry.grammarPattern}</div>
                  </article>
                  <article className={styles.infoCard}>
                    <span className={styles.infoLabel}>Grammar focus</span>
                    <div className={styles.infoValue}>{selectedEntry.grammarFocus}</div>
                  </article>
                  <article className={styles.infoCard}>
                    <span className={styles.infoLabel}>Business context</span>
                    <div className={styles.infoValue}>{selectedEntry.scenarioLabel}</div>
                  </article>
                  <article className={styles.infoCard}>
                    <span className={styles.infoLabel}>Focus object</span>
                    <div className={styles.infoValue}>{selectedEntry.focusObject}</div>
                  </article>
                  <article className={styles.infoCard}>
                    <span className={styles.infoLabel}>Common collocations</span>
                    <div className={styles.infoValue}>{selectedEntry.collocations.join(", ")}</div>
                  </article>
                  <article className={styles.infoCard}>
                    <span className={styles.infoLabel}>Common mistake</span>
                    <div className={styles.infoValue}>{selectedEntry.commonMistake}</div>
                  </article>
                </div>
              ) : null}

              {tab === "examples" ? (
                <div className={styles.exampleList}>
                  {selectedEntry.examples.map((item) => (
                    <article className={styles.exampleCard} key={item.en}>
                      <div className={styles.exampleEn}>{item.en}</div>
                      <div className={styles.exampleKr}>{item.kr}</div>
                    </article>
                  ))}
                </div>
              ) : null}

              {tab === "practice" ? (
                <div className={styles.practice}>
                  <div className={styles.practiceCard}>
                    <span className={styles.practiceLabel}>
                      {practiceCard.taskType} · {selectedEntry.expression}
                    </span>
                    <p className={styles.practicePrompt}>{practiceCard.prompt}</p>
                    {showAnswer ? (
                      <div className={styles.answerBox}>
                        <span className={styles.answerLabel}>Model Answer</span>
                        <div className={styles.answerText}>{practiceCard.answer}</div>
                        <div className={styles.footerNote} style={{ color: "rgba(255,255,255,0.78)" }}>
                          {practiceCard.explanation}
                        </div>
                      </div>
                    ) : null}
                    <div className={styles.actionRow}>
                      <button className={styles.secondaryButton} onClick={() => setShowAnswer((current) => !current)}>
                        {showAnswer ? "Hide answer" : "Reveal answer"}
                      </button>
                      <button className={styles.secondaryButton} onClick={() => {
                        setPracticeSeed((current) => current + 1);
                        setShowAnswer(false);
                      }}>
                        Next card
                      </button>
                      <button className={styles.secondaryButton} onClick={() => markPracticeSolved(false)}>
                        Mark done
                      </button>
                      <button className={styles.primaryButton} onClick={() => markPracticeSolved(true)}>
                        Done + mastered
                      </button>
                    </div>
                  </div>
                  <div className={styles.footerNote}>
                    각 카드에는 빈칸, 번역 힌트, 문법 포인트, 실수 교정, 업무 문장 작성이 섞여 나옵니다.
                    핵심 표현을 외운 뒤 바로 생산형 연습으로 연결되도록 구성했습니다.
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
