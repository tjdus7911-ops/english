import { beforeEach, describe, expect, it, vi } from 'vitest';

// node 환경용 localStorage
const mem = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k) => mem.get(k) ?? null,
  setItem: (k, v) => void mem.set(k, String(v)),
  removeItem: (k) => void mem.delete(k),
  clear: () => mem.clear(),
  key: (i) => [...mem.keys()][i] ?? null,
  get length() {
    return mem.size;
  },
};

const { useStore, STORAGE_KEY } = await import('./useStore');
const { getQuestion } = await import('../data');
const { buildReviewQueue } = await import('../lib/review');
const { DAY_MS, startOfDay } = await import('../lib/util');

const st = () => useStore.getState();

describe('학습 기록 저장소 (복습·알림 연동)', () => {
  beforeEach(() => {
    vi.useRealTimers();
    st().resetAll();
  });

  it('단어 학습 완료 → 단어 복습 일정 생성 (중복 없음)', () => {
    st().markWordsSeen(['a2-w-afford', 'a2-w-decide']);
    st().markWordsSeen(['a2-w-afford']);
    st().setWordStatus('a2-w-afford', 'known');
    const keys = Object.keys(st().reviews);
    expect(keys.sort()).toEqual(['w:a2-w-afford', 'w:a2-w-decide']);
  });

  it('문법 학습 → 개념 복습 일정 생성, 읽기만으로는 학습 완료 아님', () => {
    st().markConceptStudied('a1-be');
    st().markConceptStudied('a1-be');
    expect(Object.keys(st().reviews)).toEqual(['c:a1-be']);
    expect(st().progress.conceptDone['a1-be']).toBeUndefined();
    st().recordConceptCheck('a1-be', 'partial', 0.67);
    expect(st().progress.conceptDone['a1-be']).toBeUndefined();
    st().recordConceptCheck('a1-be', 'understood', 1);
    expect(st().progress.conceptDone['a1-be']).toBeDefined();
  });

  it('오늘 복습 → 정답이면 다음 날로, 다음 날 조회 시 다시 대상이 아님 (3일 뒤)', () => {
    vi.useFakeTimers();
    const t0 = new Date(2026, 10, 3, 10).getTime();
    vi.setSystemTime(t0);
    st().markWordsSeen(['a1-w-tired']);
    let q = buildReviewQueue(st().reviews, st().wrongNotes, st().answers, 10, Date.now());
    expect(q.map((x) => x.key)).toEqual(['w:a1-w-tired']);
    st().recordAnswer(q[0].question, q[0].question.answer, true, 'review', 's1', q[0].key);
    expect(st().reviews['w:a1-w-tired'].dueAt).toBe(startOfDay(t0) + DAY_MS);
    expect(buildReviewQueue(st().reviews, st().wrongNotes, st().answers, 10, Date.now())).toHaveLength(0);

    // 다음 날: 다시 복습 대상, 이번엔 다른 유형(영어 단어 입력)
    vi.setSystemTime(t0 + DAY_MS);
    q = buildReviewQueue(st().reviews, st().wrongNotes, st().answers, 10, Date.now());
    expect(q[0].question.id).toBe('wq-t-a1-w-tired');
    st().recordAnswer(q[0].question, 'tierd', false, 'review', 's2', q[0].key);
    const r = st().reviews['w:a1-w-tired'];
    expect(r.stage).toBe(0);
    expect(r.lapses).toBe(1);
    expect(st().reviewEvents).toHaveLength(2);
    expect(st().wrongNotes['wq-t-a1-w-tired']).toBeDefined();
  });

  it('일반 학습 오답 → 관련 개념이 오늘 복습 목록에 등록', () => {
    st().recordAnswer(getQuestion('a1-q03')!, 'are', false, 'course', 's');
    expect(st().reviews['c:a1-be'].lapses).toBe(1);
    expect(buildReviewQueue(st().reviews, st().wrongNotes, st().answers, 5, Date.now())[0].key).toBe('c:a1-be');
  });

  it('알림 설정 저장 · 같은 알림은 한 번만 전달', () => {
    st().updateNotifSettings({ time: '07:30', types: { ...st().notifSettings.types, incomplete: false } });
    expect(st().notifSettings.time).toBe('07:30');
    expect(st().notifSettings.types.incomplete).toBe(false);
    const c = [{ dedupKey: 'due:c:a1-be:2026-11-03', type: 'due-items' as const, title: 't', body: 'b', path: '/review' }];
    expect(st().deliverNotifications(c)).toHaveLength(1);
    expect(st().deliverNotifications(c)).toHaveLength(0);
    expect(st().inbox).toHaveLength(1);
  });

  it('새로고침(재실행) 후에도 기록이 유지된다', async () => {
    st().markWordsSeen(['a1-w-busy']);
    st().recordAnswer(getQuestion('a1-q04')!, 'is', false, 'course', 's');
    st().updateNotifSettings({ time: '09:15' });
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.state.reviews['w:a1-w-busy']).toBeDefined();
    // 앱 재실행 흉내: 메모리 상태를 비운 뒤(이때 저장소도 덮어써짐) 저장돼 있던 원본으로 다시 불러오기
    const raw = localStorage.getItem(STORAGE_KEY)!;
    useStore.setState({ reviews: {}, answers: [], wrongNotes: {}, notifSettings: { ...st().notifSettings, time: '00:00' } });
    expect(st().answers).toHaveLength(0);
    localStorage.setItem(STORAGE_KEY, raw);
    await useStore.persist.rehydrate();
    expect(st().reviews['w:a1-w-busy']).toBeDefined();
    expect(st().answers).toHaveLength(1);
    expect(st().wrongNotes['a1-q04']).toBeDefined();
    expect(st().notifSettings.time).toBe('09:15');
  });

  it('듣기 오답 → 재청취 복습 등록, 학습 기록 저장', () => {
    st().recordAnswer(getQuestion('l-a1-03-d1')!, 'hungy', false, 'free', 's');
    st().recordListening('l-a1-03', 2, 3);
    expect(st().reviews['l:l-a1-03'].lapses).toBe(1);
    expect(st().listeningRecords['l-a1-03']).toMatchObject({ correct: 2, total: 3, attempts: 1 });
    const q = buildReviewQueue(st().reviews, st().wrongNotes, st().answers, 5, Date.now());
    const l = q.find((x) => x.key === 'l:l-a1-03')!;
    expect(l).toBeDefined();
    expect(l.question.audio?.length).toBeGreaterThan(0);
    expect(l.reason).toContain('다시 들어');
  });

  it('말하기: 누락 단어 → 재연습 등록, 자가 확인 모드는 복습에 반영 안 함, 기록 저장', () => {
    st().recordSpeaking({ sentenceId: 's-a1-23', mode: 'self', recognized: '', matchRate: 0, missing: [], extra: [], substituted: [] }, false);
    expect(st().reviews['s:s-a1-23']).toBeUndefined();
    st().recordSpeaking({ sentenceId: 's-a1-23', mode: 'stt', recognized: 'she study japanese', matchRate: 67, missing: [], extra: [], substituted: [{ expected: 'studies', heard: 'study' }] }, false);
    expect(st().reviews['s:s-a1-23'].lapses).toBe(1);
    expect(st().speakingAttempts).toHaveLength(2);
    // 문제 풀이 복습 목록에는 섞이지 않음
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 2 * DAY_MS);
    expect(buildReviewQueue(st().reviews, {}, [], 10, Date.now()).some((x) => x.kind === 'speaking')).toBe(false);
    st().recordSpeaking({ sentenceId: 's-a1-23', mode: 'stt', recognized: 'she studies japanese', matchRate: 100, missing: [], extra: [], substituted: [] }, true);
    expect(st().reviews['s:s-a1-23'].stage).toBe(1);
  });

  it('표현: 저장 → 복습 등록, 오답 → 표현 복습, 완료 이벤트는 한 번만', () => {
    st().toggleSaveExpression('ex-tr-001');
    expect(st().savedExpressions).toContain('ex-tr-001');
    expect(st().reviews['x:ex-tr-001']).toBeDefined();
    st().recordAnswer(getQuestion('xq-m-ex-ph-007')!, 'x', false, 'free', 's');
    expect(st().reviews['x:ex-ph-007'].lapses).toBe(1);
    expect(st().wrongNotes['xq-m-ex-ph-007']).toBeDefined();
    expect(st().recordCompletion('expr:ex-tr-001')).toBe(true);
    expect(st().recordCompletion('expr:ex-tr-001')).toBe(false);
    expect(Object.keys(st().completionEvents)).toEqual(['expr:ex-tr-001']);
    const q = buildReviewQueue(st().reviews, st().wrongNotes, st().answers, 10, Date.now());
    expect(q.find((x) => x.key === 'x:ex-tr-001')?.question.id).toBe('xq-l-ex-tr-001');
  });
});
