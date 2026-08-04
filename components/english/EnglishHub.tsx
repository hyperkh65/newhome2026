'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  VOCAB_ENTRIES, VOCAB_CATEGORIES, VOCAB_LEVELS, filterVocab, countVocabByLevel,
  type VocabEntry, type VocabLevel,
} from '@/lib/english/vocabulary';
import {
  ENGLISH_ENTRIES, ENGLISH_CATEGORIES,
  type EnglishEntry, type EnglishLevel,
} from '@/lib/english/catalog';

// ── Types ─────────────────────────────────────────────────────────────────
type Tab = 'vocab' | 'expression' | 'test' | 'progress';
type StudyMode = 'browse' | 'flashcard';
type QuizType = 'vocab' | 'expression' | 'mixed';

interface Progress {
  learnedVocab: string[];    // vocab ids
  masteredVocab: string[];
  learnedExpr: string[];     // expression ids
  masteredExpr: string[];
  quizCorrect: number;
  quizTotal: number;
  streakDays: number;
  lastStudiedAt: string | null;
}

const PROGRESS_KEY = 'english-hub-progress-v1';
const emptyProgress = (): Progress => ({
  learnedVocab: [], masteredVocab: [],
  learnedExpr: [], masteredExpr: [],
  quizCorrect: 0, quizTotal: 0,
  streakDays: 0, lastStudiedAt: null,
});

// ── Colors ────────────────────────────────────────────────────────────────
const C = {
  bg: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  borderHover: '#94a3b8',
  text: '#0f172a',
  sub: '#475569',
  muted: '#94a3b8',
  primary: '#2563eb',
  primaryLight: '#eff6ff',
  primaryBorder: '#bfdbfe',
  green: '#16a34a',
  greenLight: '#f0fdf4',
  greenBorder: '#bbf7d0',
  red: '#dc2626',
  redLight: '#fef2f2',
  redBorder: '#fecaca',
  yellow: '#d97706',
  yellowLight: '#fffbeb',
  shadow: '0 2px 8px rgba(0,0,0,0.06)',
  shadowMd: '0 4px 16px rgba(0,0,0,0.10)',
};

const levelColor: Record<string, string> = {
  basic: '#16a34a', intermediate: '#2563eb', advanced: '#9333ea',
};
const posColor: Record<string, string> = {
  noun: '#0891b2', verb: '#7c3aed', adjective: '#b45309', adverb: '#0f766e', phrase: '#be185d',
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 99,
      fontSize: 11, fontWeight: 700, background: color + '18', color,
    }}>{label}</span>
  );
}

// ── Quiz helpers ──────────────────────────────────────────────────────────
function pickWrong<T>(pool: T[], correct: T, count: number, key: (x: T) => string): T[] {
  const wrongPool = pool.filter(x => key(x) !== key(correct));
  const shuffled = [...wrongPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface VocabQuizItem {
  type: 'vocab';
  entry: VocabEntry;
  question: string;
  correctAnswer: string;
  options: string[];
  questionType: 'en2kr' | 'kr2en' | 'def2word';
}

interface ExprQuizItem {
  type: 'expr';
  entry: EnglishEntry;
  question: string;
  correctAnswer: string;
  options: string[];
}

type QuizItem = VocabQuizItem | ExprQuizItem;

function makeVocabQuiz(entry: VocabEntry, pool: VocabEntry[]): VocabQuizItem {
  const types: Array<'en2kr' | 'kr2en' | 'def2word'> = ['en2kr', 'kr2en', 'def2word'];
  const qType = types[Math.floor(Math.random() * types.length)];
  if (qType === 'en2kr') {
    const wrong = pickWrong(pool, entry, 3, x => x.id).map(x => x.korean);
    const options = [...wrong, entry.korean].sort(() => Math.random() - 0.5);
    return { type: 'vocab', entry, questionType: 'en2kr', question: `"${entry.word}" 의 뜻은?`, correctAnswer: entry.korean, options };
  } else if (qType === 'kr2en') {
    const wrong = pickWrong(pool, entry, 3, x => x.id).map(x => x.word);
    const options = [...wrong, entry.word].sort(() => Math.random() - 0.5);
    return { type: 'vocab', entry, questionType: 'kr2en', question: `"${entry.korean}" 을 영어로 쓰면?`, correctAnswer: entry.word, options };
  } else {
    const wrong = pickWrong(pool, entry, 3, x => x.id).map(x => x.word);
    const options = [...wrong, entry.word].sort(() => Math.random() - 0.5);
    return { type: 'vocab', entry, questionType: 'def2word', question: entry.definition, correctAnswer: entry.word, options };
  }
}

function makeExprQuiz(entry: EnglishEntry, pool: EnglishEntry[]): ExprQuizItem {
  const wrong = pickWrong(pool, entry, 3, x => x.id).map(x => x.korean);
  const options = [...wrong, entry.korean].sort(() => Math.random() - 0.5);
  return { type: 'expr', entry, question: `"${entry.baseExpression}" 의 한국어 의미는?`, correctAnswer: entry.korean, options };
}

function buildQuiz(type: QuizType, count = 10): QuizItem[] {
  const items: QuizItem[] = [];
  if (type === 'vocab' || type === 'mixed') {
    const pool = [...VOCAB_ENTRIES].sort(() => Math.random() - 0.5);
    const take = type === 'mixed' ? Math.ceil(count / 2) : count;
    for (let i = 0; i < take && i < pool.length; i++) {
      items.push(makeVocabQuiz(pool[i], VOCAB_ENTRIES));
    }
  }
  if (type === 'expression' || type === 'mixed') {
    const pool = [...ENGLISH_ENTRIES].sort(() => Math.random() - 0.5);
    const take = type === 'mixed' ? Math.floor(count / 2) : count;
    for (let i = 0; i < take && i < pool.length; i++) {
      items.push(makeExprQuiz(pool[i], ENGLISH_ENTRIES));
    }
  }
  return items.sort(() => Math.random() - 0.5);
}

// ── Vocab Flashcard ───────────────────────────────────────────────────────
function VocabCard({
  entry, onLearned, onMastered, learned, mastered,
}: {
  entry: VocabEntry;
  onLearned: (id: string) => void;
  onMastered: (id: string) => void;
  learned: string[];
  mastered: string[];
}) {
  const [flipped, setFlipped] = useState(false);
  const isLearned = learned.includes(entry.id);
  const isMastered = mastered.includes(entry.id);

  useEffect(() => setFlipped(false), [entry.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          background: flipped ? C.primaryLight : C.card,
          border: `1.5px solid ${flipped ? C.primaryBorder : C.border}`,
          borderRadius: 20, padding: '36px 32px', cursor: 'pointer',
          minHeight: 260, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          boxShadow: C.shadowMd, transition: 'all 0.2s', gap: 16,
        }}
      >
        {!flipped ? (
          <>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Badge label={entry.level} color={levelColor[entry.level]} />
              <Badge label={entry.pos} color={posColor[entry.pos] ?? '#475569'} />
              {entry.categories.slice(0, 2).map(c => <Badge key={c} label={c} color="#475569" />)}
            </div>
            <div style={{ fontSize: 38, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>
              {entry.word}
            </div>
            <div style={{ fontSize: 13, color: C.muted }}>탭해서 뜻 보기</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.primary }}>{entry.korean}</div>
            <div style={{ fontSize: 14, color: C.sub, maxWidth: 460, lineHeight: 1.7 }}>{entry.definition}</div>
            {entry.synonyms.length > 0 && (
              <div style={{ fontSize: 12, color: C.muted }}>
                유의어: <strong>{entry.synonyms.join(', ')}</strong>
              </div>
            )}
            <div style={{ width: '100%', background: C.border, height: 1, margin: '8px 0' }} />
            {entry.examples.slice(0, 2).map((ex, i) => (
              <div key={i} style={{ textAlign: 'left', width: '100%' }}>
                <div style={{ fontSize: 13, color: C.text, fontStyle: 'italic' }}>"{ex.en}"</div>
                <div style={{ fontSize: 12, color: C.sub }}>{ex.kr}</div>
              </div>
            ))}
          </>
        )}
      </div>
      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => onLearned(entry.id)}
          style={{
            flex: 1, padding: '12px', borderRadius: 12, fontWeight: 700, fontSize: 14,
            cursor: 'pointer', border: 'none', fontFamily: 'inherit',
            background: isLearned ? C.greenLight : '#f1f5f9',
            color: isLearned ? C.green : C.sub,
          }}
        >
          {isLearned ? '✓ 학습완료' : '학습했어요'}
        </button>
        <button
          onClick={() => onMastered(entry.id)}
          style={{
            flex: 1, padding: '12px', borderRadius: 12, fontWeight: 700, fontSize: 14,
            cursor: 'pointer', border: 'none', fontFamily: 'inherit',
            background: isMastered ? C.primaryLight : C.primary,
            color: isMastered ? C.primary : '#fff',
          }}
        >
          {isMastered ? '⭐ 마스터됨' : '완전히 외웠어요'}
        </button>
      </div>
    </div>
  );
}

// ── Main Hub ──────────────────────────────────────────────────────────────
export function EnglishHub() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>('vocab');
  const [progress, setProgress] = useState<Progress>(emptyProgress());

  // Vocab state
  const [vocabLevel, setVocabLevel] = useState<string>('all');
  const [vocabCat, setVocabCat] = useState('all');
  const [vocabQ, setVocabQ] = useState('');
  const [vocabStudyMode, setVocabStudyMode] = useState<StudyMode>('browse');
  const [vocabIndex, setVocabIndex] = useState(0);

  // Expression state
  const [exprLevel, setExprLevel] = useState<EnglishLevel>('intermediate');
  const [exprCat, setExprCat] = useState('all');
  const [exprQ, setExprQ] = useState('');
  const [selectedExprId, setSelectedExprId] = useState('');
  const [exprTab, setExprTab] = useState<'overview' | 'examples' | 'practice'>('overview');
  const [showExprAnswer, setShowExprAnswer] = useState(false);

  // Quiz state
  const [quizType, setQuizType] = useState<QuizType>('mixed');
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) setProgress({ ...emptyProgress(), ...JSON.parse(saved) });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress, mounted]);

  const saveProgress = useCallback((patch: Partial<Progress>) => {
    setProgress(p => ({ ...p, ...patch }));
  }, []);

  // Vocab filtered list
  const filteredVocab = filterVocab(VOCAB_ENTRIES, {
    level: vocabLevel === 'all' ? undefined : vocabLevel as VocabLevel,
    category: vocabCat === 'all' ? undefined : vocabCat,
    q: vocabQ || undefined,
  });
  const currentVocab = filteredVocab[vocabIndex] ?? filteredVocab[0];

  // Expression filtered — deduplicate by baseExpression
  const filteredExpr = (() => {
    const seen = new Set<string>();
    return ENGLISH_ENTRIES.filter(e => {
      if (e.level !== exprLevel) return false;
      if (exprCat !== 'all' && !e.categories.includes(exprCat)) return false;
      if (exprQ) {
        const hay = [e.baseExpression, e.korean, e.grammarPattern, ...e.categories].join(' ').toLowerCase();
        if (!hay.includes(exprQ.toLowerCase())) return false;
      }
      if (seen.has(e.baseExpression)) return false;
      seen.add(e.baseExpression);
      return true;
    });
  })();
  const selectedExpr = filteredExpr.find(e => e.id === selectedExprId) ?? filteredExpr[0];

  // Start quiz
  function startQuiz() {
    const items = buildQuiz(quizType, 10);
    setQuiz(items);
    setQuizIdx(0);
    setSelectedOpt(null);
    setSessionCorrect(0);
    setQuizDone(false);
  }

  // Handle quiz answer
  function handleAnswer(opt: string) {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    const current = quiz[quizIdx];
    const correct = opt === current.correctAnswer;
    if (correct) setSessionCorrect(s => s + 1);
    setProgress(p => ({
      ...p,
      quizCorrect: p.quizCorrect + (correct ? 1 : 0),
      quizTotal: p.quizTotal + 1,
      lastStudiedAt: new Date().toISOString(),
    }));
  }

  function nextQuestion() {
    if (quizIdx + 1 >= quiz.length) {
      setQuizDone(true);
    } else {
      setQuizIdx(i => i + 1);
      setSelectedOpt(null);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  const tabStyle = (t: Tab) => ({
    padding: '10px 20px', borderRadius: 99, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', border: 'none', fontFamily: 'inherit',
    background: tab === t ? C.primary : 'transparent',
    color: tab === t ? '#fff' : C.sub,
    transition: 'all 0.15s',
  });

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: C.text }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#38bdf8', marginBottom: 10 }}>
            BUSINESS ENGLISH HUB
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            비즈니스 영어 완전 정복
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 580, lineHeight: 1.7, margin: 0 }}>
            단어 암기 → 표현 학습 → 테스트로 이어지는 체계적인 학습. 구동사, 패턴, 비즈니스 어휘까지 한 곳에서.
          </p>

          {/* Stats bar */}
          {mounted && (
            <div style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
              {[
                { label: '학습한 단어', value: progress.learnedVocab.length, total: VOCAB_ENTRIES.length, color: '#34d399' },
                { label: '마스터한 단어', value: progress.masteredVocab.length, total: VOCAB_ENTRIES.length, color: '#38bdf8' },
                { label: '학습한 표현', value: progress.learnedExpr.length, total: ENGLISH_ENTRIES.length, color: '#a78bfa' },
                { label: '퀴즈 정답률', value: progress.quizTotal > 0 ? Math.round(progress.quizCorrect / progress.quizTotal * 100) : 0, unit: '%', color: '#fb923c' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>
                    {s.value}{s.unit ?? ''}{s.total ? <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}> / {s.total}</span> : null}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, padding: '0 24px', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', gap: 4, padding: '8px 0' }}>
          {([['vocab', '📖 단어'], ['expression', '💬 표현'], ['test', '✏️ 테스트'], ['progress', '📊 내 진도']] as const).map(([t, label]) => (
            <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── VOCAB TAB ─────────────────────────────────────────────── */}
        {tab === 'vocab' && (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

            {/* Sidebar */}
            <aside style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, position: 'sticky', top: 80 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>단어 필터</h2>

              <input
                value={vocabQ} onChange={e => { setVocabQ(e.target.value); setVocabIndex(0); }}
                placeholder="단어 또는 뜻 검색..."
                style={{ width: '100%', padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}
              />

              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>레벨</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {[['all', '전체'], ['basic', 'Basic'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced']].map(([v, l]) => (
                    <button key={v} onClick={() => { setVocabLevel(v); setVocabIndex(0); }}
                      style={{ padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: vocabLevel === v ? (levelColor[v] ?? C.primary) : '#f1f5f9',
                        color: vocabLevel === v ? '#fff' : C.sub }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>카테고리</div>
                <select value={vocabCat} onChange={e => { setVocabCat(e.target.value); setVocabIndex(0); }}
                  style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, background: '#fff', outline: 'none' }}>
                  <option value="all">전체</option>
                  {VOCAB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                <button onClick={() => setVocabStudyMode('browse')}
                  style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: vocabStudyMode === 'browse' ? C.primary : '#f1f5f9', color: vocabStudyMode === 'browse' ? '#fff' : C.sub }}>
                  목록 보기
                </button>
                <button onClick={() => setVocabStudyMode('flashcard')}
                  style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: vocabStudyMode === 'flashcard' ? C.primary : '#f1f5f9', color: vocabStudyMode === 'flashcard' ? '#fff' : C.sub }}>
                  플래시카드
                </button>
              </div>

              <div style={{ fontSize: 12, color: C.muted }}>
                {filteredVocab.length}개 단어 · 학습완료 {progress.learnedVocab.length}개 · 마스터 {progress.masteredVocab.length}개
              </div>
            </aside>

            {/* Content */}
            <div>
              {vocabStudyMode === 'flashcard' ? (
                <div>
                  {currentVocab ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <span style={{ fontSize: 13, color: C.muted }}>
                          {Math.min(vocabIndex + 1, filteredVocab.length)} / {filteredVocab.length}
                        </span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => setVocabIndex(i => Math.max(0, i - 1))} disabled={vocabIndex === 0}
                            style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.sub }}>
                            ← 이전
                          </button>
                          <button onClick={() => setVocabIndex(i => Math.min(filteredVocab.length - 1, i + 1))} disabled={vocabIndex >= filteredVocab.length - 1}
                            style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.primary, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff' }}>
                            다음 →
                          </button>
                        </div>
                      </div>
                      <VocabCard
                        entry={currentVocab}
                        learned={progress.learnedVocab}
                        mastered={progress.masteredVocab}
                        onLearned={id => saveProgress({ learnedVocab: progress.learnedVocab.includes(id) ? progress.learnedVocab : [...progress.learnedVocab, id] })}
                        onMastered={id => saveProgress({
                          learnedVocab: progress.learnedVocab.includes(id) ? progress.learnedVocab : [...progress.learnedVocab, id],
                          masteredVocab: progress.masteredVocab.includes(id) ? progress.masteredVocab : [...progress.masteredVocab, id],
                        })}
                      />
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 60, color: C.muted }}>필터에 맞는 단어가 없습니다.</div>
                  )}
                </div>
              ) : (
                // Browse mode
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filteredVocab.map(entry => {
                    const isLearned = progress.learnedVocab.includes(entry.id);
                    const isMastered = progress.masteredVocab.includes(entry.id);
                    return (
                      <div key={entry.id} style={{
                        background: isMastered ? C.primaryLight : C.card,
                        border: `1px solid ${isMastered ? C.primaryBorder : C.border}`,
                        borderRadius: 14, padding: '16px 20px', boxShadow: C.shadow,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{entry.word}</span>
                              <Badge label={entry.pos} color={posColor[entry.pos] ?? '#475569'} />
                              <Badge label={entry.level} color={levelColor[entry.level]} />
                              {isMastered && <Badge label="⭐ 마스터" color={C.primary} />}
                              {isLearned && !isMastered && <Badge label="✓ 학습완료" color={C.green} />}
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 4 }}>{entry.korean}</div>
                            <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.6 }}>{entry.definition}</div>
                            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                              유의어: {entry.synonyms.join(' · ')}
                            </div>
                            {entry.examples[0] && (
                              <div style={{ marginTop: 8, padding: '10px 12px', background: '#f8fafc', borderRadius: 8, borderLeft: `3px solid ${C.primary}` }}>
                                <div style={{ fontSize: 13, fontStyle: 'italic', color: C.text }}>"{entry.examples[0].en}"</div>
                                <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{entry.examples[0].kr}</div>
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => saveProgress({ learnedVocab: isLearned ? progress.learnedVocab.filter(x => x !== entry.id) : [...progress.learnedVocab, entry.id] })}
                              style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                                background: isLearned ? C.greenLight : '#f1f5f9', color: isLearned ? C.green : C.sub }}>
                              {isLearned ? '✓ 완료' : '학습'}
                            </button>
                            <button onClick={() => saveProgress({
                              learnedVocab: isLearned ? progress.learnedVocab : [...progress.learnedVocab, entry.id],
                              masteredVocab: isMastered ? progress.masteredVocab.filter(x => x !== entry.id) : [...progress.masteredVocab, entry.id],
                            })}
                              style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                                background: isMastered ? C.primaryLight : C.primary, color: isMastered ? C.primary : '#fff' }}>
                              {isMastered ? '⭐ 마스터' : '마스터'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredVocab.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: C.muted }}>검색 결과가 없습니다.</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EXPRESSION TAB ───────────────────────────────────────── */}
        {tab === 'expression' && (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

            {/* Sidebar */}
            <aside style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, position: 'sticky', top: 80 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800 }}>표현 필터</h2>

              <input value={exprQ} onChange={e => setExprQ(e.target.value)}
                placeholder="표현 검색..."
                style={{ width: '100%', padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}
              />

              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                {(['intermediate', 'advanced'] as const).map(l => (
                  <button key={l} onClick={() => setExprLevel(l)}
                    style={{ flex: 1, padding: '7px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none',
                      background: exprLevel === l ? C.primary : '#f1f5f9', color: exprLevel === l ? '#fff' : C.sub }}>
                    {l === 'intermediate' ? '중급' : '고급'}
                  </button>
                ))}
              </div>

              <select value={exprCat} onChange={e => setExprCat(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, background: '#fff', outline: 'none', marginBottom: 12 }}>
                <option value="all">전체 카테고리</option>
                {ENGLISH_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{filteredExpr.length}개 표현</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
                {filteredExpr.slice(0, 80).map(e => {
                  const isMastered = progress.masteredExpr.includes(e.id);
                  const isSelected = selectedExpr?.id === e.id;
                  return (
                    <button key={e.id} onClick={() => { setSelectedExprId(e.id); setExprTab('overview'); setShowExprAnswer(false); }}
                      style={{
                        padding: '10px 12px', borderRadius: 10, border: `1px solid ${isSelected ? C.primary : C.border}`,
                        background: isSelected ? C.primaryLight : '#fff', cursor: 'pointer', textAlign: 'left',
                      }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isSelected ? C.primary : C.text }}>{e.baseExpression}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{e.korean} {isMastered ? '⭐' : ''}</div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Detail */}
            {selectedExpr ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Header */}
                <div style={{ background: '#0f172a', borderRadius: 20, padding: '28px 28px 24px', color: '#fff' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                    <Badge label={selectedExpr.level} color={levelColor[selectedExpr.level] ?? '#2563eb'} />
                    <Badge label={selectedExpr.kind} color="#94a3b8" />
                    {selectedExpr.categories.slice(0, 3).map(c => <Badge key={c} label={c} color="#64748b" />)}
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', letterSpacing: '-0.02em' }}>{selectedExpr.baseExpression}</h2>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{selectedExpr.korean} · {selectedExpr.usageNote}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <button onClick={() => saveProgress({ learnedExpr: progress.learnedExpr.includes(selectedExpr.id) ? progress.learnedExpr : [...progress.learnedExpr, selectedExpr.id] })}
                      style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                      학습 완료
                    </button>
                    <button onClick={() => saveProgress({
                      learnedExpr: progress.learnedExpr.includes(selectedExpr.id) ? progress.learnedExpr : [...progress.learnedExpr, selectedExpr.id],
                      masteredExpr: progress.masteredExpr.includes(selectedExpr.id) ? progress.masteredExpr : [...progress.masteredExpr, selectedExpr.id],
                    })}
                      style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#38bdf8', color: '#0f172a', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                      ⭐ 마스터됨
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 12, padding: 4 }}>
                  {([['overview', '📋 개요'], ['examples', '💡 예문'], ['practice', '✏️ 연습']] as const).map(([t, l]) => (
                    <button key={t} onClick={() => setExprTab(t)}
                      style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                        background: exprTab === t ? '#fff' : 'transparent',
                        color: exprTab === t ? C.primary : C.sub,
                        boxShadow: exprTab === t ? C.shadow : 'none' }}>
                      {l}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {exprTab === 'overview' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      ['문법 패턴', selectedExpr.grammarPattern],
                      ['문법 포인트', selectedExpr.grammarFocus],
                      ['사용 상황', selectedExpr.scenarioLabel],
                      ['핵심 대상', selectedExpr.focusObject],
                      ['콜로케이션', selectedExpr.collocations.join(', ')],
                      ['흔한 실수', selectedExpr.commonMistake],
                    ].map(([label, value]) => (
                      <div key={label as string} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
                        <div style={{ fontSize: 14, color: C.text, fontWeight: 500 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {exprTab === 'examples' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {selectedExpr.examples.map((ex, i) => (
                      <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, borderLeft: `4px solid ${C.primary}` }}>
                        <div style={{ fontSize: 15, fontStyle: 'italic', color: C.text, marginBottom: 8, fontWeight: 500 }}>"{ex.en}"</div>
                        <div style={{ fontSize: 13, color: C.sub }}>{ex.kr}</div>
                      </div>
                    ))}
                  </div>
                )}

                {exprTab === 'practice' && (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                      연습 문제 · {selectedExpr.expression}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 20, lineHeight: 1.6 }}>
                      {selectedExpr.answerTemplate?.replace('{answer}', '______') ?? '이 표현을 사용하여 문장을 만들어 보세요.'}
                    </div>
                    {showExprAnswer && (
                      <div style={{ background: C.primaryLight, border: `1px solid ${C.primaryBorder}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, marginBottom: 6 }}>모범 답안</div>
                        <div style={{ fontSize: 14, color: C.text }}>{selectedExpr.examples[0]?.en}</div>
                        <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>{selectedExpr.examples[0]?.kr}</div>
                      </div>
                    )}
                    <button onClick={() => setShowExprAnswer(v => !v)}
                      style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                      {showExprAnswer ? '답 숨기기' : '답 보기'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 60, color: C.muted }}>왼쪽에서 표현을 선택하세요.</div>
            )}
          </div>
        )}

        {/* ── TEST TAB ─────────────────────────────────────────────── */}
        {tab === 'test' && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            {quiz.length === 0 ? (
              // Quiz setup
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✏️</div>
                <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>퀴즈 테스트</h2>
                <p style={{ color: C.sub, fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
                  10문제가 출제됩니다. 4지선다 형식으로 단어 뜻, 표현 의미를 테스트합니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.sub, textAlign: 'left' }}>출제 유형</div>
                  {([['mixed', '🎯 혼합 (단어 + 표현)', '가장 효과적인 통합 테스트'],
                    ['vocab', '📖 단어만', '단어 뜻과 영어 표기 테스트'],
                    ['expression', '💬 표현만', '구동사 · 패턴 의미 테스트']] as const).map(([v, label, desc]) => (
                    <button key={v} onClick={() => setQuizType(v)}
                      style={{
                        padding: '14px 18px', borderRadius: 12, border: `2px solid ${quizType === v ? C.primary : C.border}`,
                        background: quizType === v ? C.primaryLight : '#fff',
                        cursor: 'pointer', textAlign: 'left',
                      }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: quizType === v ? C.primary : C.text }}>{label}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{desc}</div>
                    </button>
                  ))}
                </div>

                <button onClick={startQuiz}
                  style={{ padding: '14px 40px', borderRadius: 99, background: C.primary, color: '#fff', border: 'none', fontWeight: 800, fontSize: 16, cursor: 'pointer', width: '100%' }}>
                  테스트 시작 →
                </button>

                {progress.quizTotal > 0 && (
                  <div style={{ marginTop: 20, padding: '12px 16px', background: '#f8fafc', borderRadius: 10, fontSize: 13, color: C.sub }}>
                    누적 성적: <strong>{progress.quizCorrect}</strong> / {progress.quizTotal} 정답
                    ({Math.round(progress.quizCorrect / progress.quizTotal * 100)}% 정답률)
                  </div>
                )}
              </div>
            ) : quizDone ? (
              // Result screen
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>
                  {sessionCorrect >= 9 ? '🏆' : sessionCorrect >= 7 ? '🎉' : sessionCorrect >= 5 ? '👍' : '💪'}
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
                  {sessionCorrect} / {quiz.length} 정답!
                </h2>
                <p style={{ fontSize: 15, color: C.sub, marginBottom: 28 }}>
                  {sessionCorrect >= 9 ? '완벽합니다! 🎊' : sessionCorrect >= 7 ? '훌륭해요! 조금 더 연습하면 완벽!' : sessionCorrect >= 5 ? '좋아요! 틀린 부분을 복습해보세요.' : '계속 연습하면 반드시 늘어납니다!'}
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button onClick={startQuiz}
                    style={{ padding: '12px 28px', borderRadius: 99, background: C.primary, color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    다시 테스트
                  </button>
                  <button onClick={() => setQuiz([])}
                    style={{ padding: '12px 28px', borderRadius: 99, border: `1px solid ${C.border}`, background: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', color: C.sub }}>
                    설정으로
                  </button>
                </div>
              </div>
            ) : quiz[quizIdx] ? (
              // Quiz question
              (() => {
                const q = quiz[quizIdx];
                const correct = selectedOpt === q.correctAnswer;
                const wrong = selectedOpt && selectedOpt !== q.correctAnswer;
                return (
                  <div>
                    {/* Progress bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>{quizIdx + 1} / {quiz.length}</span>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: C.green, fontWeight: 700 }}>✓ {sessionCorrect}정답</span>
                        <span style={{ fontSize: 13, color: C.muted }}> · </span>
                        <Badge label={q.type === 'vocab' ? '단어' : '표현'} color={q.type === 'vocab' ? C.green : C.primary} />
                      </div>
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: 8, height: 6, marginBottom: 24 }}>
                      <div style={{ width: `${((quizIdx) / quiz.length) * 100}%`, background: C.primary, height: '100%', borderRadius: 8, transition: 'width 0.3s' }} />
                    </div>

                    {/* Question */}
                    <div style={{ background: '#0f172a', borderRadius: 20, padding: '28px 24px', marginBottom: 16, color: '#fff', textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {q.type === 'vocab' && (q as VocabQuizItem).questionType === 'def2word' ? '다음 설명에 해당하는 단어는?' :
                          q.type === 'vocab' && (q as VocabQuizItem).questionType === 'kr2en' ? '영어로 쓰면?' : '뜻을 고르세요'}
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.5 }}>{q.question}</div>
                    </div>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {q.options.map((opt, i) => {
                        const isCorrectOpt = opt === q.correctAnswer;
                        const isSelectedOpt = selectedOpt === opt;
                        let bg = '#fff', border = C.border, color = C.text;
                        if (selectedOpt) {
                          if (isCorrectOpt) { bg = C.greenLight; border = C.greenBorder; color = C.green; }
                          else if (isSelectedOpt) { bg = C.redLight; border = C.redBorder; color = C.red; }
                        }
                        return (
                          <button key={i} onClick={() => handleAnswer(opt)} disabled={!!selectedOpt}
                            style={{
                              padding: '16px 20px', borderRadius: 14, border: `2px solid ${border}`,
                              background: bg, color, fontSize: 15, fontWeight: 600, cursor: selectedOpt ? 'default' : 'pointer',
                              textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s',
                            }}>
                            <span style={{ width: 28, height: 28, borderRadius: '50%', background: isSelectedOpt && selectedOpt ? (isCorrectOpt ? C.green : C.red) : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: isSelectedOpt && selectedOpt ? '#fff' : C.muted, flexShrink: 0 }}>
                              {['A', 'B', 'C', 'D'][i]}
                            </span>
                            {opt}
                            {selectedOpt && isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: 18 }}>✓</span>}
                            {selectedOpt && isSelectedOpt && !isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: 18 }}>✗</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback */}
                    {selectedOpt && (
                      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ padding: 16, borderRadius: 12, background: correct ? C.greenLight : C.redLight, border: `1px solid ${correct ? C.greenBorder : C.redBorder}` }}>
                          <div style={{ fontWeight: 700, color: correct ? C.green : C.red, marginBottom: 4 }}>
                            {correct ? '✓ 정답!' : `✗ 오답 — 정답: "${q.correctAnswer}"`}
                          </div>
                          {q.type === 'vocab' && (
                            <div style={{ fontSize: 13, color: C.sub }}>
                              {(q as VocabQuizItem).entry.definition}
                            </div>
                          )}
                          {q.type === 'expr' && (
                            <div style={{ fontSize: 13, color: C.sub }}>
                              {(q as ExprQuizItem).entry.usageNote}
                            </div>
                          )}
                        </div>
                        <button onClick={nextQuestion}
                          style={{ padding: '14px', borderRadius: 12, background: C.primary, color: '#fff', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                          {quizIdx + 1 >= quiz.length ? '결과 보기 →' : '다음 문제 →'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : null}
          </div>
        )}

        {/* ── PROGRESS TAB ─────────────────────────────────────────── */}
        {tab === 'progress' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Vocab progress */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>📖 단어 진도</h3>
              {VOCAB_LEVELS.map(level => {
                const total = VOCAB_ENTRIES.filter(e => e.level === level).length;
                const learned = VOCAB_ENTRIES.filter(e => e.level === level && progress.learnedVocab.includes(e.id)).length;
                const mastered = VOCAB_ENTRIES.filter(e => e.level === level && progress.masteredVocab.includes(e.id)).length;
                const pct = total > 0 ? Math.round(learned / total * 100) : 0;
                return (
                  <div key={level} style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: levelColor[level] }}>{level}</span>
                      <span style={{ fontSize: 12, color: C.muted }}>{learned} / {total} 학습 · {mastered} 마스터</span>
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: 99, height: 8 }}>
                      <div style={{ width: `${pct}%`, background: levelColor[level], height: '100%', borderRadius: 99, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Expression progress */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>💬 표현 진도</h3>
              {(['intermediate', 'advanced'] as const).map(level => {
                const total = ENGLISH_ENTRIES.filter(e => e.level === level).length;
                const learned = ENGLISH_ENTRIES.filter(e => e.level === level && progress.learnedExpr.includes(e.id)).length;
                const mastered = ENGLISH_ENTRIES.filter(e => e.level === level && progress.masteredExpr.includes(e.id)).length;
                const pct = total > 0 ? Math.round(learned / total * 100) : 0;
                const color = level === 'intermediate' ? C.primary : '#9333ea';
                return (
                  <div key={level} style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color }}>{level}</span>
                      <span style={{ fontSize: 12, color: C.muted }}>{learned} / {total} 학습 · {mastered} 마스터</span>
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: 99, height: 8 }}>
                      <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 99, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiz stats */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>✏️ 퀴즈 통계</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: '총 문제 수', value: progress.quizTotal },
                  { label: '총 정답 수', value: progress.quizCorrect },
                  { label: '정답률', value: progress.quizTotal > 0 ? Math.round(progress.quizCorrect / progress.quizTotal * 100) + '%' : '-' },
                  { label: '연속 학습일', value: progress.streakDays + '일' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#f8fafc', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: C.primary }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>⚙️ 데이터 관리</h3>
              <p style={{ fontSize: 13, color: C.sub, marginBottom: 20, lineHeight: 1.6 }}>
                진도 데이터는 이 브라우저에 저장됩니다. 초기화 시 모든 학습 기록이 삭제됩니다.
              </p>
              <button onClick={() => {
                if (!confirm('모든 학습 기록을 초기화하시겠습니까?')) return;
                const reset = emptyProgress();
                setProgress(reset);
                localStorage.setItem(PROGRESS_KEY, JSON.stringify(reset));
              }}
                style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid ${C.redBorder}`, background: C.redLight, color: C.red, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                학습 기록 초기화
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
