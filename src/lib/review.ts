import { POLICY } from '../config/policy';
import { getConcept, getQuestion, getWord, questionsForConcept, courseQuestions } from '../data';
import { getDialogue } from '../data/listening';
import { getSpeaking } from '../data/speaking';
import { getExpression } from '../data/expressions';
import type { MemoryState, Question, QuestionType, ReviewKind, ReviewSchedule, UserAnswer, WrongNote } from '../types';
import { DAY_MS, endOfDay, startOfDay } from './util';

const INTERVALS = POLICY.review.intervalsDays;
export const MAX_STAGE = INTERVALS.length - 1;

const PREFIX: Record<ReviewKind, string> = { word: 'w', concept: 'c', listening: 'l', speaking: 's', expression: 'x' };
const KIND: Record<string, ReviewKind> = { w: 'word', c: 'concept', l: 'listening', s: 'speaking', x: 'expression' };
export const itemKey = (kind: ReviewKind, id: string) => `${PREFIX[kind]}:${id}`;
export const parseKey = (key: string): { kind: ReviewKind; refId: string } => ({ kind: KIND[key[0]] ?? 'concept', refId: key.slice(2) });

/** 학습 직후 생성: 학습 당일 복습(0일)부터 시작 */
export function createItem(kind: ReviewKind, refId: string, now: number): ReviewSchedule {
  return { key: itemKey(kind, refId), kind, refId, stage: 0, dueAt: now, createdAt: now, reviewCount: 0, correctCount: 0, lapses: 0, wrongStreak: 0 };
}

export const isDue = (r: ReviewSchedule, now: number) => r.dueAt <= endOfDay(now);

/**
 * 답안 1건이 복습 항목에 주는 영향.
 * - 복습으로 푼 경우(기한 도래): 정답 → 다음 단계(간격 증가) / 오답 → 0단계로 내리고 내일 다시
 * - 일반 학습 중 오답: 오늘 바로 복습 대상으로 (단계 초기화)
 * - 일반 학습 중 정답: 일정 변화 없음 (복습 주기를 통과해야 장기 기억으로 판단)
 * 기한이 지나 밀린 항목도 정답이면 불이익 없이 그대로 다음 단계로 간다.
 */
export function applyAnswer(r: ReviewSchedule, correct: boolean, asReview: boolean, now: number): ReviewSchedule {
  const today = startOfDay(now);
  if (asReview && isDue(r, now)) {
    if (correct) {
      const stage = Math.min(r.stage + 1, MAX_STAGE);
      return { ...r, stage, dueAt: today + INTERVALS[stage] * DAY_MS, lastReviewedAt: now, lastResult: 'correct', reviewCount: r.reviewCount + 1, correctCount: r.correctCount + 1, wrongStreak: 0 };
    }
    return { ...r, stage: 0, dueAt: today + POLICY.review.wrongRetryDays * DAY_MS, lastReviewedAt: now, lastResult: 'wrong', reviewCount: r.reviewCount + 1, lapses: r.lapses + 1, wrongStreak: r.wrongStreak + 1 };
  }
  if (!correct) return { ...r, stage: 0, dueAt: Math.min(r.dueAt, now), lastResult: 'wrong', lapses: r.lapses + 1, wrongStreak: r.wrongStreak + 1 };
  return r;
}

export function memoryState(r: ReviewSchedule, now: number): MemoryState {
  if (r.wrongStreak >= POLICY.review.relearnWrongStreak) return 'relearn';
  if (r.reviewCount === 0 && !r.lastResult) return 'new';
  if (isDue(r, now)) return 'due';
  if (r.stage >= POLICY.review.stableStage && r.lastResult === 'correct') return 'stable';
  return 'learning';
}

export const MEMORY_LABEL: Record<MemoryState, string> = {
  new: '신규 학습',
  due: '복습 필요',
  learning: '학습 진행 중',
  stable: '안정적으로 기억 중',
  relearn: '재학습 필요',
};

/** 단어 복습 단계별 문제 유형: 뜻 맞히기 → 단어 입력 → 예문 빈칸 → 예문 해석 → 단어 배열 → 짧은 영작 */
const WORD_STAGE_IDS = ['wq-m-', 'wq-t-', 'wq-b-', 'wq-r-', 'wq-o-', 'write'];
/** 문법 복습 단계별 문제 유형 */
const CONCEPT_STAGE_TYPES: QuestionType[] = ['mcq', 'blank', 'error', 'translate', 'order', 'write'];

function wordCandidates(wordId: string, stage: number): Question[] {
  const ordered: Question[] = [];
  const pushId = (prefix: string) => {
    if (prefix === 'write') {
      courseQuestions.filter((q) => q.type === 'write' && q.wordIds.includes(wordId)).forEach((q) => ordered.push(q));
      return;
    }
    const q = getQuestion(prefix + wordId);
    if (q) ordered.push(q);
  };
  for (let i = 0; i < WORD_STAGE_IDS.length; i++) pushId(WORD_STAGE_IDS[(stage + i) % WORD_STAGE_IDS.length]);
  const w = getQuestion('wq-w-' + wordId);
  if (w) ordered.push(w);
  return ordered;
}

function conceptCandidates(conceptId: string, stage: number, wrongNotes: Record<string, WrongNote>): Question[] {
  const qs = questionsForConcept(conceptId).filter((q) => q.role !== 'placement');
  const out: Question[] = [];
  for (let i = 0; i < CONCEPT_STAGE_TYPES.length; i++) {
    const t = CONCEPT_STAGE_TYPES[(stage + i) % CONCEPT_STAGE_TYPES.length];
    const ofType = qs
      .filter((q) => q.type === t)
      // 변형 문항 우선, 틀렸던 그 문장은 뒤로 (다른 문장으로 재시험)
      .sort((a, b) => (a.isVariant ? -1 : 0) - (b.isVariant ? -1 : 0) || (wrongNotes[a.id] && !wrongNotes[a.id].resolved ? 1 : 0) - (wrongNotes[b.id] && !wrongNotes[b.id].resolved ? 1 : 0));
    out.push(...ofType);
  }
  return out;
}

/** 듣기 복습: 이해도 문제 → 받아쓰기 → 다른 이해도 문제 순으로 다시 듣기 */
function listeningCandidates(dialogueId: string, stage: number): Question[] {
  const d = getDialogue(dialogueId);
  if (!d) return [];
  const qs = d.questionIds.map((id) => getQuestion(id)!).filter(Boolean);
  const order = [qs.find((q) => q.id.endsWith('-q1')), qs.find((q) => q.id.endsWith('-d1')), qs.find((q) => q.id.endsWith('-q2'))].filter((x): x is Question => !!x);
  return order.map((_, i) => order[(stage + i) % order.length]);
}

/** 표현 복습: 듣고 빈칸 → 뜻 → 응용 배열 순으로 유형을 바꿔 가며 */
function expressionCandidates(id: string, stage: number): Question[] {
  const e = getExpression(id);
  if (!e) return [];
  const order = ['xq-l-', 'xq-m-', 'xq-o-'].map((p) => getQuestion(p + id)).filter((x): x is Question => !!x);
  return order.map((_, i) => order[(stage + i) % order.length]);
}

export function itemTitle(r: { kind: ReviewKind; refId: string }): string {
  if (r.kind === 'expression') return getExpression(r.refId)?.en ?? r.refId;
  if (r.kind === 'word') return getWord(r.refId)?.word ?? r.refId;
  if (r.kind === 'concept') return getConcept(r.refId)?.title ?? r.refId;
  if (r.kind === 'listening') return getDialogue(r.refId)?.title ?? r.refId;
  return getSpeaking(r.refId)?.en ?? r.refId;
}

export interface ReviewItem {
  key: string;
  kind: ReviewKind;
  refId: string;
  title: string;
  question: Question;
  reason: string;
  overdueDays: number;
  stage: number;
}

/**
 * 오늘의 복습 목록.
 * 우선순위: (알림으로 진입한 항목) → 연속 오답 → 누적 오답 → 오래 밀린 항목 → 먼저 도래한 항목
 * 하루 복습량을 넘는 항목은 기한을 유지한 채 다음 날 목록으로 넘어간다(재배치).
 */
export function buildReviewQueue(
  reviews: Record<string, ReviewSchedule>,
  wrongNotes: Record<string, WrongNote>,
  answers: UserAnswer[],
  limit: number,
  now: number,
  opts: { focusKey?: string; kind?: ReviewKind } = {},
): ReviewItem[] {
  const today = startOfDay(now);
  const answeredTodayOk = new Set(answers.filter((a) => a.at >= today && a.correct).map((a) => a.questionId));
  // 말하기 항목은 문제 풀이가 아니라 따라 말하기 화면에서 복습하므로 제외
  const due = sortDue(Object.values(reviews).filter((r) => isDue(r, now) && r.kind !== 'speaking' && (!opts.kind || r.kind === opts.kind)), now, opts.focusKey);
  const used = new Set<string>();
  const out: ReviewItem[] = [];
  for (const r of due) {
    if (out.length >= limit) break;
    const cands = r.kind === 'word' ? wordCandidates(r.refId, r.stage) : r.kind === 'listening' ? listeningCandidates(r.refId, r.stage) : r.kind === 'expression' ? expressionCandidates(r.refId, r.stage) : conceptCandidates(r.refId, r.stage, wrongNotes);
    const q = cands.find((c) => !used.has(c.id) && !answeredTodayOk.has(c.id)) ?? cands.find((c) => !used.has(c.id));
    if (!q) continue;
    used.add(q.id);
    const overdueDays = Math.max(0, Math.floor((today - startOfDay(r.dueAt)) / DAY_MS));
    const title = itemTitle(r);
    let reason = r.reviewCount === 0 ? '오늘 배운 내용' : `${INTERVALS[r.stage]}일 주기 복습`;
    if (r.wrongStreak >= 2) reason = `연속 오답 ${r.wrongStreak}회 · 재학습`;
    else if (r.lapses >= 2) reason = `반복 오답 ${r.lapses}회`;
    else if (r.lastResult === 'wrong') reason = '최근 오답';
    if (r.kind === 'listening' && r.lastResult === 'wrong') reason = r.lapses >= 2 ? `듣기 반복 오답 ${r.lapses}회 · 다시 들어 보세요` : '듣기 오답 · 다시 들어 보세요';
    if (overdueDays > 0) reason += ` · ${overdueDays}일 밀림`;
    out.push({ key: r.key, kind: r.kind, refId: r.refId, title, question: q, reason, overdueDays, stage: r.stage });
  }
  return out;
}

export function sortDue(items: ReviewSchedule[], _now: number, focusKey?: string): ReviewSchedule[] {
  return [...items].sort(
    (a, b) =>
      (a.key === focusKey ? -1 : 0) - (b.key === focusKey ? -1 : 0) ||
      b.wrongStreak - a.wrongStreak ||
      b.lapses - a.lapses ||
      a.dueAt - b.dueAt,
  );
}

export interface ReviewSummary {
  dueWords: number;
  dueConcepts: number;
  dueListening: number;
  dueExpressions: number;
  /** 따라 말하기 재연습 (문제 풀이 목록과 별도) */
  dueSpeaking: number;
  dueTotal: number;
  /** 오늘 목록에 들어가는 수 (하루 복습량 적용) */
  todayCount: number;
  /** 하루 복습량을 넘어 다음 날로 넘기는 수 */
  deferred: number;
  doneToday: number;
  completion: number;
  estMinutes: number;
}

export function reviewSummary(reviews: Record<string, ReviewSchedule>, perDay: number, now: number): ReviewSummary {
  const all = Object.values(reviews);
  const dueSpeaking = all.filter((r) => r.kind === 'speaking' && isDue(r, now)).length;
  const due = all.filter((r) => isDue(r, now) && r.kind !== 'speaking');
  const today = startOfDay(now);
  const doneToday = all.filter((r) => r.kind !== 'speaking' && r.lastReviewedAt && r.lastReviewedAt >= today).length;
  const todayCount = Math.min(due.length, Math.max(0, perDay - doneToday));
  const sorted = sortDue(due, now).slice(0, todayCount);
  const dueWords = sorted.filter((r) => r.kind === 'word').length;
  const dueListening = sorted.filter((r) => r.kind === 'listening').length;
  const dueExpressions = sorted.filter((r) => r.kind === 'expression').length;
  const total = doneToday + todayCount;
  return {
    dueWords,
    dueConcepts: sorted.length - dueWords - dueListening - dueExpressions,
    dueListening,
    dueExpressions,
    dueSpeaking,
    dueTotal: due.length,
    todayCount,
    deferred: due.length - todayCount,
    doneToday,
    completion: total === 0 ? 0 : Math.round((doneToday / total) * 100),
    estMinutes: Math.max(todayCount > 0 ? 1 : 0, Math.round((todayCount * POLICY.review.secPerItem) / 60)),
  };
}
