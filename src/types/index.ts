// ─────────────────────────────────────────────────────────────
// 콘텐츠 데이터 (정적, 앱 번들에 포함) — 사용자 기록과 분리
// ─────────────────────────────────────────────────────────────

export type Level = 'A1' | 'A2' | 'B1' | 'B2';
export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2'];

/** 실력 지도 영역 */
export type Area = 'vocab' | 'grammar' | 'writing' | 'reading';

export type PartOfSpeech = 'n.' | 'v.' | 'adj.' | 'adv.' | 'prep.' | 'conj.' | 'pron.' | 'phr.';

export interface Vocabulary {
  id: string;
  level: Level;
  unitId: string;
  /** 같은 단원 안에서 몇 번째 DAY에 배우는 단어인지 (1부터) */
  day: number;
  word: string;
  pos: PartOfSpeech;
  ipa: string;
  /** 한글 발음 참고 (정확한 발음은 발음기호·음성 기준) */
  koPron: string;
  meaning: string;
  example: string;
  exampleKo: string;
  /** 연결 학습: 이 단어가 쓰이는 문법 개념 */
  linkedConceptId?: string;
  /** 연결 학습: 함께 외우면 좋은 패턴 (예: can't afford to + 동사원형) */
  pattern?: string;
  /** 자주 쓰는 단어 조합 */
  collocations?: string[];
  /** 혼동하기 쉬운 표현 */
  confusable?: { word: string; note: string };
}

export type GrammarCategory =
  | 'be동사·문장 구조'
  | '시제'
  | '조동사'
  | '전치사'
  | '관사·명사'
  | '비교'
  | '준동사'
  | '접속·연결'
  | '수동태'
  | '관계절'
  | '조건·가정법'
  | '분사구문'
  | '어휘·연어';

export interface GrammarConcept {
  id: string;
  level: Level;
  unitId: string;
  day: number;
  category: GrammarCategory;
  title: string;
  /** 한 줄 요약 */
  summary: string;
  /** 쉬운 한국어 해설 (문단 배열) */
  explanation: string[];
  /** 문장 구조 공식 */
  structure: string[];
  correctExamples: { en: string; ko: string }[];
  wrongExamples: { en: string; fix: string; why: string }[];
  realLife: { en: string; ko: string; situation: string }[];
  /** 연결 학습: 이 개념과 함께 배우는 단어 */
  linkedWordIds: string[];
  /** ① 오늘 배울 문법의 목적 / 할 수 있게 되는 것 */
  goal: string;
  canDo: string[];
  /** '쉽게 설명하기' — 비유 중심의 아주 쉬운 설명 */
  easy: string[];
  /** '자세히 설명하기' — 규칙·예외 */
  detailed: string[];
  /** 문장 구조 분석: 한 문장을 성분별로 쪼갬 */
  analysis: { sentence: string; ko: string; parts: { text: string; role: string }[] };
  /** '예문 더 보기' */
  moreExamples: { en: string; ko: string }[];
  /** 유사 문법 비교 */
  compare: { title: string; left: string; right: string; rows: { left: string; right: string }[]; tip: string };
  /** 선행 개념 (앱 안 개념 id) 및 선행 지식 설명 */
  prerequisites: string[];
  prereqNote?: string;
}

export type LectureKeys = 'goal' | 'canDo' | 'easy' | 'detailed' | 'analysis' | 'moreExamples' | 'compare' | 'prerequisites' | 'prereqNote';
export type LectureExtra = Pick<GrammarConcept, LectureKeys>;
/** 레벨 콘텐츠 파일에 작성하는 개념 기본 데이터 (강의 보강 데이터는 lectures.ts) */
export type ConceptBase = Omit<GrammarConcept, LectureKeys>;

export type QuestionType = 'mcq' | 'blank' | 'order' | 'translate' | 'write' | 'error';

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  mcq: '객관식',
  blank: '빈칸 채우기',
  order: '단어 배열',
  translate: '문장 해석',
  write: '영작',
  error: '오류 찾기',
};

/** 규칙 기반 오답 원인 분류 */
export type MistakeType =
  | 'meaning'
  | 'form'
  | 'agreement'
  | 'tense'
  | 'word-order'
  | 'pattern'
  | 'time-marker'
  | 'conditional-form'
  | 'interpretation'
  | 'spelling';

export const MISTAKE_LABEL: Record<MistakeType, string> = {
  meaning: '단어 뜻 혼동',
  form: '동사 형태 오류',
  agreement: '주어-동사 수일치',
  tense: '시제 선택 오류',
  'word-order': '어순 오류',
  pattern: '동사 패턴(to/-ing) 혼동',
  'time-marker': '시간 표현과 시제 불일치',
  'conditional-form': '가정법 형태 오류',
  interpretation: '문장 의미 해석 오류',
  spelling: '철자·형태 오류',
};

export interface Question {
  id: string;
  level: Level;
  unitId: string;
  type: QuestionType;
  area: Area;
  /** 지시문 (한국어) */
  prompt: string;
  /** 문제 본문: mcq/blank/translate는 영어 문장, write는 한국어 문장 */
  sentence?: string;
  /** mcq/translate 보기 */
  options?: string[];
  /** order: 섞기 전 정답 순서의 토큰, error: 문장 조각 */
  tokens?: string[];
  /** 정답. error는 틀린 조각의 인덱스(문자열) */
  answer: string;
  /** blank/write 에서 함께 인정하는 정답 */
  acceptable?: string[];
  /** 정답 해설 (한국어) */
  explanation: string;
  /** 대표 오답 원인 */
  mistakeType: MistakeType;
  /** 보기별 오답 이유 (mcq/translate) */
  optionWhy?: Record<string, string>;
  hint?: string;
  /** 관련 단어 (Vocabulary.id) */
  wordIds: string[];
  /** 관련 문법 개념 — 다대다 (QuestionConcept) */
  conceptIds: string[];
  /** 틀렸을 때 추천할 학습 개념 */
  recommendConceptId?: string;
  /** 복습용 변형 문항 여부 (같은 개념, 다른 문장) */
  isVariant?: boolean;
  variantOf?: string;
  /** 커리큘럼 안에서의 용도 */
  role: 'practice' | 'writing' | 'test' | 'variant' | 'placement';
  day?: number;
}

/** 문항-개념 연결 테이블 (다대다) */
export interface QuestionConcept {
  questionId: string;
  conceptId: string;
}

export type UnitStatus = 'ready' | 'preparing';

/** 대단원 */
export interface Unit {
  id: string;
  level: Level;
  order: number;
  title: string;
  description: string;
  status: UnitStatus;
  /** 다루는 주제 (준비 중 단원도 표시) */
  topics: string[];
  days: number;
  /** 단원 학습 목표와 성취 기준 (준비된 단원) */
  goals?: string[];
  canDo?: string[];
}

/** 레벨 코스 */
export interface Course {
  level: Level;
  title: string;
  subtitle: string;
  description: string;
  /** 레벨 수료 시 할 수 있는 것 (내부 추정 기준, 공인 인증 아님) */
  canDo: string[];
  units: Unit[];
}

/** 커리큘럼 학습 단위 (DAY) */
export interface Lesson {
  id: string; // `${unitId}-d${day}`
  unitId: string;
  level: Level;
  day: number;
  title: string;
  wordIds: string[];
  conceptId: string;
  practiceQuestionIds: string[];
  writingQuestionIds: string[];
  testQuestionIds: string[];
}

// ─────────────────────────────────────────────────────────────
// 사용자 학습 기록 (로컬 저장, 추후 서버 동기화 대상)
// ─────────────────────────────────────────────────────────────

export type AnswerSource = 'course' | 'free' | 'review' | 'wrong-note' | 'placement' | 'skip-test';

export interface UserAnswer {
  id: string;
  questionId: string;
  given: string;
  correct: boolean;
  source: AnswerSource;
  sessionId: string;
  at: number;
}

export type StudyGoal = 'travel' | 'work' | 'exam' | 'conversation' | 'hobby';
export type DailyMinutes = 10 | 20 | 30;

export interface UserProfile {
  onboarded: boolean;
  goal: StudyGoal | null;
  dailyMinutes: DailyMinutes;
  selfLevel: Level;
  /** 커리큘럼 학습 레벨 */
  courseLevel: Level;
  /** 영역별 진단 레벨 (개별 관리) */
  vocabLevel: Level;
  grammarLevel: Level;
  placementDone: boolean;
  placementAt?: number;
  dailyWordGoal: number;
  reviewEnabled: boolean;
  reviewPerDay: number;
  createdAt: number;
}

export type WordStatus = 'known' | 'unknown';

export interface UserProgress {
  /** lessonId -> 완료 시각 */
  completedLessons: Record<string, number>;
  /** 건너뛰기 테스트로 통과한 단원 */
  skippedUnits: Record<string, number>;
  /** 개념 학습 완료 (문법 학습) */
  conceptDone: Record<string, number>;
  wordStatus: Record<string, WordStatus>;
  /** 단어 첫 학습 시각 */
  wordSeenAt: Record<string, number>;
  savedWords: string[];
  /** 이어서 공부하기 */
  lastLocation: { path: string; label: string; at: number } | null;
}

/** 개념 숙련도 — 답안 기록에서 계산되는 파생 데이터 */
export interface UserMastery {
  conceptId: string;
  attempts: number;
  correct: number;
  /** 추정 숙련도 0~100 (데이터 기반 추정치) */
  estimate: number;
  lastWrongAt?: number;
  recentWrong: number;
  state: 'no-data' | 'learning' | 'stable' | 'weak';
}

/** 복습 항목: 단어(w:) 또는 문법 개념(c:) 단위로 하나씩만 존재 (중복 일정 방지) */
export type ReviewKind = 'word' | 'concept';

export type MemoryState = 'new' | 'due' | 'learning' | 'stable' | 'relearn';

export interface ReviewSchedule {
  /** `w:${wordId}` | `c:${conceptId}` */
  key: string;
  kind: ReviewKind;
  refId: string;
  /** 0~5: 0=학습 당일, 1=1일, 2=3일, 3=7일, 4=14일, 5=30일 간격 단계 */
  stage: number;
  dueAt: number;
  createdAt: number;
  lastReviewedAt?: number;
  lastResult?: 'correct' | 'wrong';
  reviewCount: number;
  correctCount: number;
  /** 누적 오답 */
  lapses: number;
  /** 연속 오답 */
  wrongStreak: number;
}

export interface ReviewEvent {
  key: string;
  questionId: string;
  type: QuestionType;
  correct: boolean;
  stageBefore: number;
  at: number;
}

export interface WrongNote {
  questionId: string;
  wrongCount: number;
  firstWrongAt: number;
  lastWrongAt: number;
  lastGiven: string;
  resolved: boolean;
  resolvedAt?: number;
}

export type SessionType = 'course' | 'skip-test' | 'free-words' | 'word-quiz' | 'grammar' | 'practice' | 'review' | 'wrong-note' | 'placement';

export interface LearningSession {
  id: string;
  type: SessionType;
  label: string;
  level?: Level;
  startedAt: number;
  endedAt?: number;
  durationSec: number;
  questionCount: number;
  correctCount: number;
}

// ─────────────────────────────────────────────────────────────
// 알림 (웹: 앱 내부 알림함 / Android: Capacitor 로컬 알림 예정)
// ─────────────────────────────────────────────────────────────

export type NotifType = 'daily-start' | 'next-day-review' | 'due-items' | 'incomplete';

export interface NotifSettings {
  /** 알림 수신 동의 */
  enabled: boolean;
  /** HH:MM (로컬 시간) */
  time: string;
  types: Record<NotifType, boolean>;
}

export interface AppNotification {
  id: string;
  /** 중복 방지 키 (같은 대상·같은 날 1회) */
  dedupKey: string;
  type: NotifType;
  title: string;
  body: string;
  /** 선택 시 이동할 화면 */
  path: string;
  createdAt: number;
  read: boolean;
}

/** 문법 이해도 판정 */
export type Understanding = 'understood' | 'partial' | 'needs-basics';

export interface ConceptCheck {
  conceptId: string;
  result: Understanding;
  rate: number;
  at: number;
}

export interface LoadDecision {
  day: string;
  kind: string;
  applied: boolean;
}
