import { allLessons, courseQuestions, courses, getQuestion, getWord, wordQuizQuestions } from '../data';
import type { DailyMinutes, Lesson, Level, Question, Unit, UserProfile, UserProgress } from '../types';
import { LEVELS } from '../types';

export function lessonsOfUnit(unitId: string): Lesson[] {
  return allLessons.filter((l) => l.unitId === unitId);
}

export function isUnitComplete(unit: Unit, progress: UserProgress): boolean {
  if (progress.skippedUnits[unit.id]) return true;
  const ls = lessonsOfUnit(unit.id);
  return ls.length > 0 && ls.every((l) => progress.completedLessons[l.id]);
}

/** 단원 해제: 준비된 단원 중 첫 번째는 항상 열림, 이후는 앞 준비 단원 완료 시 열림 */
export function isUnitUnlocked(unit: Unit, progress: UserProgress): boolean {
  if (unit.status !== 'ready') return false;
  const course = courses.find((c) => c.level === unit.level)!;
  const readyBefore = course.units.filter((u) => u.status === 'ready' && u.order < unit.order);
  return readyBefore.every((u) => isUnitComplete(u, progress));
}

export function isLessonUnlocked(lesson: Lesson, progress: UserProgress): boolean {
  if (progress.skippedUnits[lesson.unitId]) return true;
  if (lesson.day === 1) return true;
  const prev = allLessons.find((l) => l.unitId === lesson.unitId && l.day === lesson.day - 1);
  return !prev || !!progress.completedLessons[prev.id];
}

export function levelProgress(level: Level, progress: UserProgress) {
  const ls = allLessons.filter((l) => l.level === level);
  const done = ls.filter((l) => progress.completedLessons[l.id] || progress.skippedUnits[l.unitId]).length;
  return { done, total: ls.length };
}

/** 오늘의 학습: 현재 레벨에서 아직 안 끝낸 첫 DAY. 레벨을 다 끝냈으면 다음 레벨 */
export function nextLesson(level: Level, progress: UserProgress): { lesson: Lesson | null; levelDone: boolean; nextLevel?: Level } {
  const ls = allLessons.filter((l) => l.level === level);
  const next = ls.find((l) => !progress.completedLessons[l.id] && !progress.skippedUnits[l.unitId]);
  if (next) return { lesson: next, levelDone: false };
  const idx = LEVELS.indexOf(level);
  const nextLevel = LEVELS[idx + 1];
  return { lesson: null, levelDone: true, nextLevel };
}

export interface SessionPlan {
  reviewLimit: number;
  wordIds: string[];
  /** 하루 신규 단어 목표보다 많아 다음으로 미룬 단어 (자유학습 '오늘의 단어'에서 이어서) */
  deferredWordIds: string[];
  wordQuiz: Question[];
  /** 어휘 연습 (시간 설정에 따라 0~2) */
  vocabPractice: Question[];
  /** 문법 확인 문제 (1단계 기초 → 2단계 응용) — 이해도 판정에 사용 */
  check: Question[];
  /** 추가 연습용 변형 문항 */
  extra: Question[];
  writing: Question[];
  test: Question[];
}

const PLAN: Record<DailyMinutes, { review: number; vocab: number; writing: number; test: number; quiz: number }> = {
  10: { review: 3, vocab: 0, writing: 1, test: 2, quiz: 0 },
  20: { review: 5, vocab: 2, writing: 2, test: 2, quiz: 0 },
  30: { review: 8, vocab: 2, writing: 2, test: 2, quiz: 5 },
};

const STEP_ORDER: Record<string, number> = { mcq: 0, blank: 1, translate: 2, error: 3, order: 4, write: 5 };

export function buildPlan(lesson: Lesson, profile: Pick<UserProfile, 'dailyMinutes' | 'reviewPerDay' | 'reviewEnabled' | 'dailyWordGoal'>): SessionPlan {
  const { dailyMinutes: minutes, reviewPerDay, reviewEnabled } = profile;
  const p = PLAN[minutes];
  const nWords = Math.max(1, Math.min(lesson.wordIds.length, profile.dailyWordGoal));
  const qs = (ids: string[]) => ids.map((id) => getQuestion(id)!).filter(Boolean);
  const practice = qs(lesson.practiceQuestionIds);
  const check = practice.filter((q) => q.conceptIds.includes(lesson.conceptId)).sort((a, b) => STEP_ORDER[a.type] - STEP_ORDER[b.type]);
  return {
    reviewLimit: reviewEnabled ? Math.min(p.review, reviewPerDay) : 0,
    wordIds: lesson.wordIds.slice(0, nWords),
    deferredWordIds: lesson.wordIds.slice(nWords),
    wordQuiz: p.quiz ? lesson.wordIds.slice(0, Math.min(p.quiz, nWords)).map((id) => wordQuizQuestions.find((q) => q.id === `wq-m-${id}`)!) : [],
    vocabPractice: practice.filter((q) => q.area === 'vocab').slice(0, p.vocab),
    check,
    extra: courseQuestions.filter((q) => q.isVariant && q.conceptIds.includes(lesson.conceptId)),
    writing: qs(lesson.writingQuestionIds).slice(0, p.writing),
    test: qs(lesson.testQuestionIds).slice(0, p.test),
  };
}

/** 실제 콘텐츠 분량 기준 예상 시간(분) */
export function estimateMinutes(plan: SessionPlan, reviewCount: number): number {
  const sec =
    reviewCount * 45 +
    plan.wordIds.length * 25 +
    plan.wordQuiz.length * 15 +
    180 + // 문법 개념 읽기
    (plan.vocabPractice.length + plan.check.length) * 40 +
    plan.writing.length * 75 +
    plan.test.length * 40;
  return Math.max(1, Math.round(sec / 60));
}

export function wordsOfLevel(level: Level) {
  return allLessons.filter((l) => l.level === level).flatMap((l) => l.wordIds.map((id) => getWord(id)!));
}
