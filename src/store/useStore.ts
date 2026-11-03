import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { POLICY } from '../config/policy';
import type {
  AnswerSource,
  AppNotification,
  ConceptCheck,
  Level,
  LearningSession,
  ListeningRecord,
  SpeakingAttempt,
  LoadDecision,
  NotifSettings,
  Question,
  ReviewEvent,
  ReviewSchedule,
  SessionType,
  Understanding,
  UserAnswer,
  UserProfile,
  UserProgress,
  WordStatus,
  WrongNote,
} from '../types';
import { defaultNotifSettings, type NotifCandidate } from '../lib/notifications';
import { applyAnswer, createItem, itemKey } from '../lib/review';
import { uid } from '../lib/util';

/**
 * 사용자 학습 기록 저장소.
 * - 현재: 브라우저 localStorage (키: honja-english/v1) — 브라우저 데이터 삭제 시 사라짐
 * - 향후: 같은 형태를 Supabase 테이블(profiles, answers, wrong_notes, review_items, review_events, sessions)로 동기화
 */
export const STORAGE_KEY = 'honja-english/v1';
const MAX_ANSWERS = 5000;
const MAX_SESSIONS = 1000;
const MAX_EVENTS = 5000;

export interface UserData {
  profile: UserProfile;
  progress: UserProgress;
  answers: UserAnswer[];
  wrongNotes: Record<string, WrongNote>;
  /** 복습 항목 — 키(w:단어id / c:개념id)당 하나 (중복 일정 방지) */
  reviews: Record<string, ReviewSchedule>;
  reviewEvents: ReviewEvent[];
  sessions: LearningSession[];
  conceptChecks: Record<string, ConceptCheck>;
  notifSettings: NotifSettings;
  inbox: AppNotification[];
  deliveredKeys: string[];
  loadDecision: LoadDecision | null;
  /** 오늘 홈에서 복습을 '나중에'로 미룬 날짜 */
  reviewSnoozedDay: string | null;
  listeningRecords: Record<string, ListeningRecord>;
  speakingAttempts: SpeakingAttempt[];
  /** 녹음·음성 인식 사용 동의 시각 (동의 전에는 마이크를 켜지 않음) */
  voiceConsentAt: number | null;
}

interface Actions {
  completeOnboarding: (p: Partial<UserProfile>) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  setPlacementResult: (vocab: Level, grammar: Level, course: Level) => void;
  /** reviewKey: 복습 화면에서 특정 복습 항목에 대해 푼 문제 */
  recordAnswer: (q: Question, given: string, correct: boolean, source: AnswerSource, sessionId: string, reviewKey?: string) => void;
  resolveWrongNote: (questionId: string) => void;
  /** 문법 강의를 학습함 → 개념 복습 일정 생성 (학습 완료와는 별개) */
  markConceptStudied: (conceptId: string) => void;
  /** 확인 문제 결과 기록. 이해 완료일 때만 conceptDone */
  recordConceptCheck: (conceptId: string, result: Understanding, rate: number) => void;
  setWordStatus: (wordId: string, status: WordStatus) => void;
  /** 단어 학습 → 단어 복습 일정 생성 */
  markWordsSeen: (wordIds: string[]) => void;
  toggleSaveWord: (wordId: string) => void;
  completeLesson: (lessonId: string) => void;
  skipUnit: (unitId: string) => void;
  startSession: (type: SessionType, label: string, level?: Level) => string;
  finishSession: (id: string) => void;
  setLastLocation: (path: string, label: string) => void;
  updateNotifSettings: (p: Partial<NotifSettings>) => void;
  deliverNotifications: (cands: NotifCandidate[]) => AppNotification[];
  markNotifRead: (id: string) => void;
  markAllNotifRead: () => void;
  setLoadDecision: (d: LoadDecision) => void;
  snoozeReview: (day: string | null) => void;
  recordListening: (dialogueId: string, correct: number, total: number) => void;
  /** 말하기 시도 기록. 누락·다르게 인식된 단어가 있으면 재연습 복습 항목 등록 */
  recordSpeaking: (a: Omit<SpeakingAttempt, 'id' | 'at'>, asReview: boolean) => void;
  setVoiceConsent: (on: boolean) => void;
  resetAll: () => void;
}

export const defaultProfile = (): UserProfile => ({
  onboarded: false,
  goal: null,
  dailyMinutes: 20,
  selfLevel: 'A1',
  courseLevel: 'A1',
  vocabLevel: 'A1',
  grammarLevel: 'A1',
  placementDone: false,
  dailyWordGoal: 10,
  reviewEnabled: true,
  reviewPerDay: POLICY.review.defaultPerDay,
  createdAt: Date.now(),
});

const defaultProgress = (): UserProgress => ({
  completedLessons: {},
  skippedUnits: {},
  conceptDone: {},
  wordStatus: {},
  wordSeenAt: {},
  savedWords: [],
  lastLocation: null,
});

export const initialData = (): UserData => ({
  profile: defaultProfile(),
  progress: defaultProgress(),
  answers: [],
  wrongNotes: {},
  reviews: {},
  reviewEvents: [],
  sessions: [],
  conceptChecks: {},
  notifSettings: defaultNotifSettings(),
  inbox: [],
  deliveredKeys: [],
  loadDecision: null,
  reviewSnoozedDay: null,
  listeningRecords: {},
  speakingAttempts: [],
  voiceConsentAt: null,
});

export const useStore = create<UserData & Actions>()(
  persist(
    (set, get) => ({
      ...initialData(),

      completeOnboarding: (p) => set((s) => ({ profile: { ...s.profile, ...p, onboarded: true } })),
      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setPlacementResult: (vocab, grammar, course) =>
        set((s) => ({ profile: { ...s.profile, vocabLevel: vocab, grammarLevel: grammar, courseLevel: course, placementDone: true, placementAt: Date.now() } })),

      recordAnswer: (q, given, correct, source, sessionId, reviewKey) =>
        set((s) => {
          const now = Date.now();
          const answer: UserAnswer = { id: uid('a_'), questionId: q.id, given, correct, source, sessionId, at: now };
          const answers = [...s.answers, answer].slice(-MAX_ANSWERS);

          const wrongNotes = { ...s.wrongNotes };
          if (!correct && source !== 'placement') {
            const prev = wrongNotes[q.id];
            wrongNotes[q.id] = { questionId: q.id, wrongCount: (prev?.wrongCount ?? 0) + 1, firstWrongAt: prev?.firstWrongAt ?? now, lastWrongAt: now, lastGiven: given, resolved: false };
          }

          const reviews = { ...s.reviews };
          let reviewEvents = s.reviewEvents;
          if (s.profile.reviewEnabled && source !== 'placement') {
            if (reviewKey && reviews[reviewKey]) {
              // 복습 화면: 해당 복습 항목만 복습 결과로 반영
              const before = reviews[reviewKey];
              reviews[reviewKey] = applyAnswer(before, correct, true, now);
              reviewEvents = [...reviewEvents, { key: reviewKey, questionId: q.id, type: q.type, correct, stageBefore: before.stage, at: now }].slice(-MAX_EVENTS);
            } else {
              const asReview = source === 'wrong-note';
              for (const c of q.conceptIds) {
                const k = itemKey('concept', c);
                const prev = reviews[k];
                if (prev) reviews[k] = applyAnswer(prev, correct, asReview, now);
                else if (!correct) reviews[k] = applyAnswer(createItem('concept', c, now), false, false, now);
              }
              for (const w of q.wordIds) {
                const k = itemKey('word', w);
                if (reviews[k]) reviews[k] = applyAnswer(reviews[k], correct, asReview, now);
              }
              if (q.dialogueId) {
                // 듣기 오답 → 해당 대화 재청취 복습 등록
                const k = itemKey('listening', q.dialogueId);
                const prev = reviews[k];
                if (prev) reviews[k] = applyAnswer(prev, correct, asReview, now);
                else if (!correct) reviews[k] = applyAnswer(createItem('listening', q.dialogueId, now), false, false, now);
              }
            }
          }
          return { answers, wrongNotes, reviews, reviewEvents };
        }),

      resolveWrongNote: (questionId) =>
        set((s) => {
          const w = s.wrongNotes[questionId];
          if (!w) return {};
          return { wrongNotes: { ...s.wrongNotes, [questionId]: { ...w, resolved: true, resolvedAt: Date.now() } } };
        }),

      markConceptStudied: (conceptId) =>
        set((s) => {
          const k = itemKey('concept', conceptId);
          if (s.reviews[k] || !s.profile.reviewEnabled) return {};
          return { reviews: { ...s.reviews, [k]: createItem('concept', conceptId, Date.now()) } };
        }),

      recordConceptCheck: (conceptId, result, rate) =>
        set((s) => {
          const now = Date.now();
          const k = itemKey('concept', conceptId);
          const reviews = s.reviews[k] || !s.profile.reviewEnabled ? s.reviews : { ...s.reviews, [k]: createItem('concept', conceptId, now) };
          return {
            reviews,
            conceptChecks: { ...s.conceptChecks, [conceptId]: { conceptId, result, rate, at: now } },
            progress: result === 'understood' ? { ...s.progress, conceptDone: { ...s.progress.conceptDone, [conceptId]: s.progress.conceptDone[conceptId] ?? now } } : s.progress,
          };
        }),

      setWordStatus: (wordId, status) =>
        set((s) => {
          const now = Date.now();
          const k = itemKey('word', wordId);
          return {
            progress: { ...s.progress, wordStatus: { ...s.progress.wordStatus, [wordId]: status }, wordSeenAt: { ...s.progress.wordSeenAt, [wordId]: s.progress.wordSeenAt[wordId] ?? now } },
            reviews: s.reviews[k] || !s.profile.reviewEnabled ? s.reviews : { ...s.reviews, [k]: createItem('word', wordId, now) },
          };
        }),

      markWordsSeen: (ids) =>
        set((s) => {
          const seen = { ...s.progress.wordSeenAt };
          const reviews = { ...s.reviews };
          const now = Date.now();
          ids.forEach((id) => {
            if (!seen[id]) seen[id] = now;
            const k = itemKey('word', id);
            if (!reviews[k] && s.profile.reviewEnabled) reviews[k] = createItem('word', id, now);
          });
          return { progress: { ...s.progress, wordSeenAt: seen }, reviews };
        }),

      toggleSaveWord: (wordId) =>
        set((s) => {
          const has = s.progress.savedWords.includes(wordId);
          return { progress: { ...s.progress, savedWords: has ? s.progress.savedWords.filter((x) => x !== wordId) : [...s.progress.savedWords, wordId] } };
        }),

      completeLesson: (lessonId) => set((s) => ({ progress: { ...s.progress, completedLessons: { ...s.progress.completedLessons, [lessonId]: s.progress.completedLessons[lessonId] ?? Date.now() } } })),

      skipUnit: (unitId) => set((s) => ({ progress: { ...s.progress, skippedUnits: { ...s.progress.skippedUnits, [unitId]: Date.now() } } })),

      startSession: (type, label, level) => {
        const id = uid('s_');
        const session: LearningSession = { id, type, label, level, startedAt: Date.now(), durationSec: 0, questionCount: 0, correctCount: 0 };
        set((s) => ({ sessions: [...s.sessions, session].slice(-MAX_SESSIONS) }));
        return id;
      },

      finishSession: (id) => {
        const st = get();
        const s0 = st.sessions.find((x) => x.id === id);
        if (!s0 || s0.endedAt) return;
        const now = Date.now();
        const rel = st.answers.filter((a) => a.sessionId === id);
        // 자리를 비운 시간이 과도하게 쌓이지 않도록 1회 최대 60분으로 제한
        const durationSec = Math.min(Math.round((now - s0.startedAt) / 1000), 60 * 60);
        set((s) => ({ sessions: s.sessions.map((x) => (x.id === id ? { ...x, endedAt: now, durationSec, questionCount: rel.length, correctCount: rel.filter((a) => a.correct).length } : x)) }));
      },

      setLastLocation: (path, label) => set((s) => ({ progress: { ...s.progress, lastLocation: { path, label, at: Date.now() } } })),

      updateNotifSettings: (p) => set((s) => ({ notifSettings: { ...s.notifSettings, ...p, types: { ...s.notifSettings.types, ...(p.types ?? {}) } } })),

      deliverNotifications: (cands) => {
        const s = get();
        const known = new Set(s.deliveredKeys);
        const fresh = cands.filter((c) => !known.has(c.dedupKey));
        if (!fresh.length) return [];
        const now = Date.now();
        const items: AppNotification[] = fresh.map((c) => ({ ...c, id: uid('n_'), createdAt: now, read: false }));
        set({ inbox: [...items, ...s.inbox].slice(0, 50), deliveredKeys: [...s.deliveredKeys, ...fresh.map((c) => c.dedupKey)].slice(-500) });
        return items;
      },

      markNotifRead: (id) => set((s) => ({ inbox: s.inbox.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllNotifRead: () => set((s) => ({ inbox: s.inbox.map((n) => ({ ...n, read: true })) })),
      setLoadDecision: (d) => set({ loadDecision: d }),
      snoozeReview: (day) => set({ reviewSnoozedDay: day }),

      recordListening: (dialogueId, correct, total) =>
        set((s) => {
          const prev = s.listeningRecords[dialogueId];
          return { listeningRecords: { ...s.listeningRecords, [dialogueId]: { dialogueId, completedAt: Date.now(), correct, total, attempts: (prev?.attempts ?? 0) + 1 } } };
        }),

      recordSpeaking: (a, asReview) =>
        set((s) => {
          const now = Date.now();
          const attempt: SpeakingAttempt = { ...a, id: uid('sp_'), at: now };
          const speakingAttempts = [...s.speakingAttempts, attempt].slice(-2000);
          if (a.mode !== 'stt' || !s.profile.reviewEnabled) return { speakingAttempts };
          // 인식 기준 '통과'는 누락·다르게 인식된 단어가 없을 때 (발음 숙련도 판정이 아님)
          const passed = a.missing.length === 0 && a.substituted.length === 0;
          const k = itemKey('speaking', a.sentenceId);
          const reviews = { ...s.reviews };
          const prev = reviews[k];
          if (prev) reviews[k] = applyAnswer(prev, passed, asReview, now);
          else if (!passed) reviews[k] = { ...applyAnswer(createItem('speaking', a.sentenceId, now), false, false, now), dueAt: now + 3600_000 };
          return { speakingAttempts, reviews };
        }),

      setVoiceConsent: (on) => set({ voiceConsentAt: on ? Date.now() : null }),

      resetAll: () => set({ ...initialData() }),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const out: Partial<UserData> = {};
        (Object.keys(initialData()) as (keyof UserData)[]).forEach((k) => {
          (out as Record<string, unknown>)[k] = s[k];
        });
        return out;
      },
      migrate: (persisted, version) => {
        const p = (persisted ?? {}) as Partial<UserData>;
        // v1 → v2: 복습 항목 구조 변경(개념 단위 → 단어·개념 항목). 기존 일정은 버리고 다시 생성
        if (version < 2) return { ...p, reviews: {}, reviewEvents: [] } as UserData;
        return p as UserData;
      },
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<UserData>;
        return {
          ...current,
          ...p,
          profile: { ...current.profile, ...(p.profile ?? {}) },
          progress: { ...current.progress, ...(p.progress ?? {}) },
          notifSettings: { ...current.notifSettings, ...(p.notifSettings ?? {}), types: { ...current.notifSettings.types, ...(p.notifSettings?.types ?? {}) } },
        };
      },
    },
  ),
);
