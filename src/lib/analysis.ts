import { concepts, GRAMMAR_CATEGORIES, getQuestion } from '../data';
import type { Area, GrammarCategory, LearningSession, MemoryState, QuestionType, ReviewEvent, ReviewSchedule, UserAnswer, UserMastery, WrongNote } from '../types';
import { memoryState } from './review';
import { DAY_MS, dayKey, pct, startOfDay } from './util';

export const AREA_LABEL: Record<Area, string> = { vocab: '어휘', grammar: '문법', writing: '영작', reading: '독해·해석' };
export const AREAS: Area[] = ['vocab', 'grammar', 'writing', 'reading'];

const RECENT_WINDOW = 10;
export const MIN_ATTEMPTS = 3;

/**
 * 추정 숙련도: 최근 10회 답안의 정답률을 라플라스 보정((정답+1)/(시도+2))한 값.
 * 실제 영어 능력이 아닌 '학습 데이터 기반 추정치'다.
 */
export function estimate(correct: number, attempts: number): number {
  return Math.round(((correct + 1) / (attempts + 2)) * 100);
}

function stateOf(attempts: number, est: number, unresolvedWrong: number): UserMastery['state'] {
  if (attempts < MIN_ATTEMPTS) return unresolvedWrong >= 2 ? 'weak' : 'no-data';
  if (est < 60 || unresolvedWrong >= 2) return 'weak';
  if (est >= 80) return 'stable';
  return 'learning';
}

export function conceptMastery(conceptId: string, answers: UserAnswer[], wrongNotes: Record<string, WrongNote>, now = Date.now()): UserMastery {
  const rel = answers.filter((a) => getQuestion(a.questionId)?.conceptIds.includes(conceptId));
  const recent = rel.slice(-RECENT_WINDOW);
  const correct = recent.filter((a) => a.correct).length;
  const wrongs = rel.filter((a) => !a.correct);
  const unresolved = Object.values(wrongNotes).filter((w) => !w.resolved && getQuestion(w.questionId)?.conceptIds.includes(conceptId)).length;
  const est = estimate(correct, recent.length);
  return {
    conceptId,
    attempts: rel.length,
    correct: rel.filter((a) => a.correct).length,
    estimate: est,
    lastWrongAt: wrongs.length ? wrongs[wrongs.length - 1].at : undefined,
    recentWrong: wrongs.filter((a) => a.at >= now - 7 * DAY_MS).length,
    state: stateOf(recent.length, est, unresolved),
  };
}

export function allConceptMastery(answers: UserAnswer[], wrongNotes: Record<string, WrongNote>, now = Date.now()): UserMastery[] {
  return concepts.map((c) => conceptMastery(c.id, answers, wrongNotes, now));
}

export interface AreaStat {
  area: Area;
  attempts: number;
  correct: number;
  accuracy: number;
  estimate: number;
  enough: boolean;
}

export function areaStats(answers: UserAnswer[]): AreaStat[] {
  return AREAS.map((area) => {
    const rel = answers.filter((a) => getQuestion(a.questionId)?.area === area);
    const correct = rel.filter((a) => a.correct).length;
    const recent = rel.slice(-20);
    return {
      area,
      attempts: rel.length,
      correct,
      accuracy: pct(correct, rel.length),
      estimate: estimate(recent.filter((a) => a.correct).length, recent.length),
      enough: rel.length >= MIN_ATTEMPTS,
    };
  });
}

export interface CategoryStat {
  category: GrammarCategory;
  attempts: number;
  correct: number;
  accuracy: number;
  hasContent: boolean;
}

export function categoryStats(answers: UserAnswer[]): CategoryStat[] {
  return GRAMMAR_CATEGORIES.map(({ category }) => {
    const ids = new Set(concepts.filter((c) => c.category === category).map((c) => c.id));
    const rel = answers.filter((a) => getQuestion(a.questionId)?.conceptIds.some((id) => ids.has(id)));
    const correct = rel.filter((a) => a.correct).length;
    return { category, attempts: rel.length, correct, accuracy: pct(correct, rel.length), hasContent: ids.size > 0 };
  });
}

export interface DayStat {
  key: string;
  label: string;
  attempts: number;
  correct: number;
  accuracy: number;
}

export function dailyTrend(answers: UserAnswer[], days = 14, now = Date.now()): DayStat[] {
  const out: DayStat[] = [];
  const today = startOfDay(now);
  const buckets = new Map<string, { a: number; c: number }>();
  for (const a of answers) {
    const k = dayKey(a.at);
    const b = buckets.get(k) ?? { a: 0, c: 0 };
    b.a++;
    if (a.correct) b.c++;
    buckets.set(k, b);
  }
  for (let i = days - 1; i >= 0; i--) {
    const ts = today - i * DAY_MS;
    const k = dayKey(ts);
    const b = buckets.get(k) ?? { a: 0, c: 0 };
    const d = new Date(ts);
    out.push({ key: k, label: `${d.getMonth() + 1}/${d.getDate()}`, attempts: b.a, correct: b.c, accuracy: pct(b.c, b.a) });
  }
  return out;
}

/** 학습 연속 일수: 오늘(또는 어제)부터 거꾸로 활동이 있었던 날 수 */
export function streakDays(answers: UserAnswer[], sessions: LearningSession[], now = Date.now()): number {
  const active = new Set<string>([...answers.map((a) => dayKey(a.at)), ...sessions.filter((s) => s.endedAt).map((s) => dayKey(s.startedAt))]);
  let cursor = startOfDay(now);
  if (!active.has(dayKey(cursor))) cursor -= DAY_MS;
  let n = 0;
  while (active.has(dayKey(cursor))) {
    n++;
    cursor -= DAY_MS;
  }
  return n;
}

export function totalStudySec(sessions: LearningSession[]): number {
  return sessions.reduce((s, x) => s + (x.durationSec || 0), 0);
}

export const MASTERY_LABEL: Record<UserMastery['state'], string> = {
  'no-data': '데이터 부족',
  learning: '학습 중',
  stable: '안정',
  weak: '복습 필요',
};

/** 장기 기억 현황: 복습 항목을 기억 상태별로 집계 */
export function memoryStats(reviews: Record<string, ReviewSchedule>, now = Date.now()) {
  const out: Record<MemoryState, { word: number; concept: number }> = {
    new: { word: 0, concept: 0 },
    due: { word: 0, concept: 0 },
    learning: { word: 0, concept: 0 },
    stable: { word: 0, concept: 0 },
    relearn: { word: 0, concept: 0 },
  };
  Object.values(reviews).forEach((r) => out[memoryState(r, now)][r.kind]++);
  return out;
}

/** 복습 문제 유형별 정답률 (유형별 난이도 관리용) */
export function reviewTypeStats(events: ReviewEvent[]) {
  const m = new Map<QuestionType, { n: number; c: number }>();
  events.forEach((e) => {
    const x = m.get(e.type) ?? { n: 0, c: 0 };
    x.n++;
    if (e.correct) x.c++;
    m.set(e.type, x);
  });
  return [...m.entries()].map(([type, x]) => ({ type, attempts: x.n, accuracy: pct(x.c, x.n) }));
}

/** 일정 기간 후 재평가: 7일 이상 간격 복습(단계 3 이상)에서의 정답률 = 장기 기억 유지율 */
export function retentionRate(events: ReviewEvent[]) {
  const late = events.filter((e) => e.stageBefore >= 3);
  return { attempts: late.length, accuracy: pct(late.filter((e) => e.correct).length, late.length) };
}
