import { describe, expect, it } from 'vitest';
import { getQuestion } from '../data';
import type { ReviewSchedule, UserAnswer } from '../types';
import { conceptMastery, streakDays } from './analysis';
import { explainMistake, isCorrect, normalize } from './grading';
import { computeNotifications, defaultNotifSettings } from './notifications';
import { recommendLoad } from './recommend';
import { applyAnswer, buildReviewQueue, createItem, memoryState, reviewSummary } from './review';
import { judgeUnderstanding } from './understanding';
import { DAY_MS, startOfDay } from './util';

const NOW = new Date(2026, 10, 3, 21).getTime(); // 21시 (알림 시간 20:00 이후)

describe('채점 정규화', () => {
  it('대소문자·문장부호·축약형을 통일한다', () => {
    expect(normalize("I can't afford to buy a new car.")).toBe('i cannot afford to buy a new car');
    expect(normalize("She's worked here for 3 years!")).toBe("she's worked here for three years");
    expect(normalize('I’m a student.')).toBe('i am a student');
  });
  it('영작: 허용 답안·축약형은 정답, 의미가 다른 문장은 오답', () => {
    const q = getQuestion('a2-q07')!;
    expect(isCorrect(q, 'i cannot afford to buy a new car')).toBe(true);
    expect(isCorrect(q, "I can't afford a new car")).toBe(true);
    expect(isCorrect(q, 'I can afford to buy a new car.')).toBe(false);
    expect(isCorrect(q, '')).toBe(false);
  });
  it('오답 원인을 설명한다', () => {
    expect(explainMistake(getQuestion('a1-q04')!, 'is')).toContain('한 사람');
    expect(explainMistake(getQuestion('a1-q05')!, '0')).toContain("'is'");
  });
});

describe('복습 일정', () => {
  it('학습 직후 항목은 학습 당일(오늘) 복습 대상', () => {
    const r = createItem('word', 'a2-w-afford', NOW);
    expect(r.dueAt).toBeLessThanOrEqual(NOW);
    expect(memoryState(r, NOW)).toBe('new');
  });

  it('복습 정답마다 간격이 0→1→3→7→14→30일로 늘어난다', () => {
    let r = createItem('word', 'a2-w-afford', NOW);
    let t = NOW;
    const gaps: number[] = [];
    for (let i = 0; i < 6; i++) {
      r = applyAnswer(r, true, true, t);
      gaps.push(Math.round((r.dueAt - startOfDay(t)) / DAY_MS));
      t = r.dueAt + 10 * 3600_000;
    }
    expect(gaps).toEqual([1, 3, 7, 14, 30, 30]);
    expect(memoryState(r, r.dueAt - 2 * DAY_MS)).toBe('stable');
  });

  it('한 번 맞혔다고 장기 기억으로 판단하지 않는다', () => {
    const r = applyAnswer(createItem('word', 'x', NOW), true, true, NOW);
    expect(memoryState(r, NOW)).toBe('learning');
  });

  it('복습 오답 → 0단계, 내일 다시 / 연속 오답 → 재학습 필요', () => {
    let r: ReviewSchedule = { ...createItem('concept', 'a1-be', NOW), stage: 3 };
    r = applyAnswer(r, false, true, NOW);
    expect(r.stage).toBe(0);
    expect(r.dueAt).toBe(startOfDay(NOW) + DAY_MS);
    r = applyAnswer(r, false, true, r.dueAt);
    expect(memoryState(r, r.dueAt)).toBe('relearn');
  });

  it('일반 학습 중 오답 → 오늘 바로 복습 대상, 정답 → 일정 변화 없음', () => {
    const base = { ...createItem('concept', 'a1-be', NOW - 5 * DAY_MS), stage: 2, dueAt: NOW + 3 * DAY_MS };
    expect(applyAnswer(base, true, false, NOW)).toEqual(base);
    expect(applyAnswer(base, false, false, NOW).dueAt).toBeLessThanOrEqual(NOW);
  });

  it('밀린 복습도 정답이면 불이익 없이 다음 단계로', () => {
    const r = { ...createItem('word', 'x', NOW - 10 * DAY_MS), stage: 2, dueAt: NOW - 5 * DAY_MS };
    expect(applyAnswer(r, true, true, NOW).stage).toBe(3);
  });

  it('반복 오답 우선, 단어는 단계마다 다른 문제 유형, 하루 복습량 초과분은 이월', () => {
    const reviews: Record<string, ReviewSchedule> = {};
    const add = (r: ReviewSchedule) => (reviews[r.key] = r);
    add({ ...createItem('word', 'a2-w-afford', NOW - DAY_MS), stage: 0 });
    add({ ...createItem('word', 'a2-w-decide', NOW - DAY_MS), stage: 1 });
    add({ ...createItem('word', 'a2-w-plan', NOW - DAY_MS), stage: 2 });
    add({ ...createItem('concept', 'a1-present', NOW - DAY_MS), lapses: 3, wrongStreak: 2 });
    const q = buildReviewQueue(reviews, {}, [], 3, NOW);
    expect(q).toHaveLength(3);
    expect(q[0].key).toBe('c:a1-present');
    const types = Object.fromEntries(buildReviewQueue(reviews, {}, [], 10, NOW).map((x) => [x.key, x.question.id]));
    expect(types['w:a2-w-afford']).toBe('wq-m-a2-w-afford'); // 1차: 뜻 맞히기
    expect(types['w:a2-w-decide']).toBe('wq-t-a2-w-decide'); // 2차: 영어 단어 입력
    expect(types['w:a2-w-plan']).toBe('wq-b-a2-w-plan'); // 3차: 예문 빈칸
    const sum = reviewSummary(reviews, 3, NOW);
    expect(sum.todayCount).toBe(3);
    expect(sum.deferred).toBe(1);
  });

  it('알림으로 진입한 항목을 맨 앞에 출제', () => {
    const reviews: Record<string, ReviewSchedule> = {
      'c:a1-be': { ...createItem('concept', 'a1-be', NOW), lapses: 5 },
      'c:b1-pp-experience': createItem('concept', 'b1-pp-experience', NOW),
    };
    expect(buildReviewQueue(reviews, {}, [], 5, NOW, { focusKey: 'c:b1-pp-experience' })[0].key).toBe('c:b1-pp-experience');
  });

  it('문법 복습은 틀렸던 문장 대신 변형 문항을 먼저 낸다', () => {
    const reviews = { 'c:a1-present': { ...createItem('concept', 'a1-present', NOW), stage: 1 } };
    const wn = { 'a1-q12': { questionId: 'a1-q12', wrongCount: 2, firstWrongAt: NOW, lastWrongAt: NOW, lastGiven: 'studys', resolved: false } };
    const q = buildReviewQueue(reviews, wn, [], 1, NOW);
    expect(q[0].question.type).toBe('blank');
    expect(q[0].question.id).toBe('a1-v03');
  });
});

const ans = (qid: string, correct: boolean, at = NOW, source: UserAnswer['source'] = 'course'): UserAnswer => ({ id: Math.random().toString(), questionId: qid, given: '', correct, source, sessionId: 's', at });

describe('학습량 추천', () => {
  it('표본이 적으면 조정하지 않는다', () => {
    expect(recommendLoad([ans('a1-q03', false, NOW, 'review')], 10, NOW).kind).toBe('insufficient');
  });
  it.each([
    [10, 'increase', 12],
    [8, 'keep', 10],
    [6, 'reduce20', 8],
    [3, 'reduce40', 6],
  ])('복습 10문제 중 %i개 정답 → %s', (correct, kind, goal) => {
    const a = Array.from({ length: 10 }, (_, i) => ans('a1-q03', i < correct, NOW - 3600_000, 'review'));
    const r = recommendLoad(a, 10, NOW);
    expect(r.kind).toBe(kind);
    expect(r.suggestedGoal).toBe(goal);
    expect(r.message.length).toBeGreaterThan(10);
  });
  it('반복 오답 개념을 취약 개념으로 추천한다', () => {
    const a = [...Array.from({ length: 10 }, () => ans('a1-q03', false, NOW, 'review'))];
    const r = recommendLoad(a, 10, NOW);
    expect(r.weakConcepts[0].id).toBe('a1-be');
    expect(r.message).toContain('be동사');
  });
});

describe('이해도 판정', () => {
  it('3/3 → 이해 완료, 2/3 → 추가 연습, 1/3 → 기초', () => {
    const r = (c: boolean) => ({ correct: c, mistakeType: 'agreement' as const });
    expect(judgeUnderstanding([r(true), r(true), r(true)]).result).toBe('understood');
    expect(judgeUnderstanding([r(true), r(true), r(false)]).result).toBe('partial');
    expect(judgeUnderstanding([r(true), r(false), r(false)]).result).toBe('needs-basics');
  });
  it('같은 오답 유형이 반복되면 기초 설명 추천', () => {
    const o = judgeUnderstanding([
      { correct: true, mistakeType: 'form' },
      { correct: true, mistakeType: 'form' },
      { correct: true, mistakeType: 'form' },
      { correct: false, mistakeType: 'time-marker' },
      { correct: false, mistakeType: 'time-marker' },
    ]);
    expect(o.result).toBe('needs-basics');
    expect(o.repeatedMistake).toBe('time-marker');
  });
});

describe('알림', () => {
  const progress = { completedLessons: {}, skippedUnits: {}, conceptDone: {}, wordStatus: {}, wordSeenAt: {}, savedWords: [], lastLocation: null };
  it('어제 배운 단어 → 다음 날 복습 알림, 개념 복습 알림은 항목·예정일별 고유 키', () => {
    const reviews = {
      'w:a1-w-tired': createItem('word', 'a1-w-tired', NOW - DAY_MS),
      'c:a1-be': { ...createItem('concept', 'a1-be', NOW - 3 * DAY_MS), dueAt: NOW - DAY_MS },
    };
    const n = computeNotifications({ reviews, answers: [], progress, settings: defaultNotifSettings() }, NOW);
    expect(n.find((x) => x.type === 'next-day-review')?.title).toContain('어제 배운 단어 1개');
    const due = n.filter((x) => x.dedupKey.startsWith('due:c:a1-be'));
    expect(due).toHaveLength(1);
    expect(due[0].path).toBe('/review?focus=c%3Aa1-be');
    // 하루 뒤에도 같은 항목이 밀려 있으면 같은 키 → 중복 전달되지 않음
    const n2 = computeNotifications({ reviews, answers: [], progress, settings: defaultNotifSettings() }, NOW + DAY_MS);
    expect(n2.find((x) => x.dedupKey.startsWith('due:c:a1-be'))!.dedupKey).toBe(due[0].dedupKey);
  });
  it('설정 시간 전이거나 수신 동의를 끄면 알림 없음, 종류별로 끌 수 있음', () => {
    const reviews = { 'c:a1-be': createItem('concept', 'a1-be', NOW - DAY_MS) };
    const s = defaultNotifSettings();
    expect(computeNotifications({ reviews, answers: [], progress, settings: { ...s, time: '23:00' } }, NOW)).toHaveLength(0);
    expect(computeNotifications({ reviews, answers: [], progress, settings: { ...s, enabled: false } }, NOW)).toHaveLength(0);
    const only = computeNotifications({ reviews, answers: [], progress, settings: { ...s, types: { ...s.types, 'due-items': false } } }, NOW);
    expect(only.some((x) => x.type === 'due-items')).toBe(false);
  });
});

describe('실력 분석', () => {
  it('시도 3회 미만은 데이터 부족', () => {
    expect(conceptMastery('a1-be', [ans('a1-q03', true)], {}).state).toBe('no-data');
  });
  it('정답률이 낮으면 복습 필요', () => {
    expect(conceptMastery('a1-be', ['a1-q03', 'a1-q04', 'a1-q05', 'a1-q06'].map((id) => ans(id, false)), {}).state).toBe('weak');
  });
  it('연속 학습 일수', () => {
    const a = [0, 1, 2, 4].map((d) => ans('a1-q01', true, NOW - d * DAY_MS));
    expect(streakDays(a, [], NOW)).toBe(3);
  });
});
