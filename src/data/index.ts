import type { Course, GrammarCategory, GrammarConcept, Lesson, Level, Question, QuestionConcept, Unit, Vocabulary } from '../types';
import { a1Concepts, a1Questions, a1Units, a1Words } from './content/a1';
import { a2Concepts, a2Questions, a2Units, a2Words } from './content/a2';
import { b1Concepts, b1Questions, b1Units, b1Words } from './content/b1';
import { b2Concepts, b2Questions, b2Units, b2Words } from './content/b2';
import { placementQuestions } from './placement';
import { buildWordQuiz } from './wordQuiz';
import { lectures } from './content/lectures';
import { wordExtras } from './content/wordExtras';
import { listeningQuestions } from './listening';
import { expressionQuestions } from './expressions';

/** 준비된 단원의 학습 목표·성취 기준 */
const UNIT_GOALS: Record<string, { goals: string[]; canDo: string[] }> = {
  'a1-u1': {
    goals: ['be동사로 정체·상태·위치를 말한다', '일반동사 현재시제로 습관과 사실을 말한다', '부정문·의문문을 만든다'],
    canDo: ['3~4문장으로 자기소개를 할 수 있다', '하루 일과를 묻고 답할 수 있다'],
  },
  'a2-u1': {
    goals: ['to부정사를 쓰는 동사로 계획·바람을 말한다', '동명사를 쓰는 동사로 취미·습관을 말한다', '두 패턴을 구분한다'],
    canDo: ['주말 계획과 취미를 이유와 함께 말할 수 있다', "can't afford to / Do you mind -ing?를 상황에 맞게 쓸 수 있다"],
  },
  'b1-u1': {
    goals: ['현재완료로 경험을 말한다', 'for/since로 계속을 말한다', '현재완료와 과거시제를 구분한다'],
    canDo: ['여행·직장 경험을 묻고 답할 수 있다', '경력과 거주 기간을 정확한 시제로 소개할 수 있다'],
  },
  'b2-u1': {
    goals: ['가정법 과거완료로 과거를 가정한다', '혼합 가정법으로 과거와 현재를 연결한다', '주장·근거 어휘를 익힌다'],
    canDo: ['과거 결정에 대한 후회와 교훈을 말할 수 있다', '근거를 들어 의견을 소개할 수 있다'],
  },
};
const COURSE_CANDO: Record<Level, string[]> = {
  A1: ['자기소개와 인사를 할 수 있다', '일상 습관을 짧은 문장으로 말할 수 있다', '간단한 질문에 답할 수 있다'],
  A2: ['계획·경험·취미를 짧게 말할 수 있다', '일상 상황에서 부탁하고 거절할 수 있다', '짧은 메시지를 쓸 수 있다'],
  B1: ['경험과 의견을 이유와 함께 말할 수 있다', '익숙한 주제의 글을 이해할 수 있다', '짧은 문단을 쓸 수 있다'],
  B2: ['추상적 주제에 대해 논리적으로 주장할 수 있다', '가정과 후회를 정확한 형태로 표현할 수 있다', '근거를 들어 의견문을 쓸 수 있다'],
};
const withGoals = (us: Unit[]) => us.map((u) => ({ ...u, ...(UNIT_GOALS[u.id] ?? {}) }));

export const courses: Course[] = [
  { level: 'A1', title: 'A1 입문', subtitle: '기초 문장 만들기', description: '나와 일상을 짧은 문장으로 말해요.', canDo: COURSE_CANDO.A1, units: withGoals(a1Units) },
  { level: 'A2', title: 'A2 초급', subtitle: '일상 표현 넓히기', description: '계획·습관·과거 일을 말하고 짧게 써요.', canDo: COURSE_CANDO.A2, units: withGoals(a2Units) },
  { level: 'B1', title: 'B1 중급 입문', subtitle: '경험과 의견 말하기', description: '경험을 이야기하고 문장을 길게 연결해요.', canDo: COURSE_CANDO.B1, units: withGoals(b1Units) },
  { level: 'B2', title: 'B2 중급', subtitle: '논리적으로 표현하기', description: '가정·주장·근거를 정확한 형태로 표현해요.', canDo: COURSE_CANDO.B2, units: withGoals(b2Units) },
];

export const LEVEL_LABEL: Record<Level, string> = { A1: 'A1 입문', A2: 'A2 초급', B1: 'B1 중급 입문', B2: 'B2 중급' };

export const vocabulary: Vocabulary[] = [...a1Words, ...a2Words, ...b1Words, ...b2Words].map((w) => ({ ...w, ...(wordExtras[w.id] ?? {}) }));
export const concepts: GrammarConcept[] = [...a1Concepts, ...a2Concepts, ...b1Concepts, ...b2Concepts].map((c) => {
  const lec = lectures[c.id];
  if (!lec) throw new Error(`강의 데이터 누락: ${c.id}`);
  return { ...c, ...lec };
});
export const courseQuestions: Question[] = [...a1Questions, ...a2Questions, ...b1Questions, ...b2Questions];
export const wordQuizQuestions: Question[] = buildWordQuiz(vocabulary);
export const allQuestions: Question[] = [...courseQuestions, ...placementQuestions, ...wordQuizQuestions, ...listeningQuestions, ...expressionQuestions];
export const allUnits: Unit[] = courses.flatMap((c) => c.units);

const byId = <T extends { id: string }>(arr: T[]) => new Map(arr.map((x) => [x.id, x]));
const wordMap = byId(vocabulary);
const conceptMap = byId(concepts);
const questionMap = byId(allQuestions);
const unitMap = byId(allUnits);

export const getWord = (id: string) => wordMap.get(id);
export const getConcept = (id: string) => conceptMap.get(id);
export const getQuestion = (id: string) => questionMap.get(id);
export const getUnit = (id: string) => unitMap.get(id);

/** 문항-개념 다대다 연결 테이블 */
export const questionConcepts: QuestionConcept[] = courseQuestions.flatMap((q) =>
  q.conceptIds.map((conceptId) => ({ questionId: q.id, conceptId })),
);

export const questionsForConcept = (conceptId: string) =>
  questionConcepts.filter((qc) => qc.conceptId === conceptId).map((qc) => questionMap.get(qc.questionId)!);

/** 실력 지도에 표시할 문법 세부 영역 (커리큘럼 전체) */
export const GRAMMAR_CATEGORIES: { category: GrammarCategory; levels: Level[] }[] = [
  { category: 'be동사·문장 구조', levels: ['A1'] },
  { category: '시제', levels: ['A1', 'A2', 'B1'] },
  { category: '관사·명사', levels: ['A1'] },
  { category: '전치사', levels: ['A1'] },
  { category: '조동사', levels: ['A1', 'A2'] },
  { category: '비교', levels: ['A2'] },
  { category: '준동사', levels: ['A2'] },
  { category: '접속·연결', levels: ['A2', 'B2'] },
  { category: '수동태', levels: ['B1'] },
  { category: '관계절', levels: ['B1', 'B2'] },
  { category: '조건·가정법', levels: ['B1', 'B2'] },
  { category: '분사구문', levels: ['B2'] },
  { category: '어휘·연어', levels: ['B2'] },
];

/** 준비된 단원을 DAY 단위 Lesson으로 변환 */
export function buildLessons(unit: Unit): Lesson[] {
  if (unit.status !== 'ready') return [];
  const lessons: Lesson[] = [];
  for (let day = 1; day <= unit.days; day++) {
    const concept = concepts.find((c) => c.unitId === unit.id && c.day === day);
    if (!concept) continue;
    const qs = courseQuestions.filter((q) => q.unitId === unit.id && q.day === day);
    lessons.push({
      id: `${unit.id}-d${day}`,
      unitId: unit.id,
      level: unit.level,
      day,
      title: concept.title,
      wordIds: vocabulary.filter((w) => w.unitId === unit.id && w.day === day).map((w) => w.id),
      conceptId: concept.id,
      practiceQuestionIds: qs.filter((q) => q.role === 'practice').map((q) => q.id),
      writingQuestionIds: qs.filter((q) => q.role === 'writing').map((q) => q.id),
      testQuestionIds: qs.filter((q) => q.role === 'test').map((q) => q.id),
    });
  }
  return lessons;
}

export const allLessons: Lesson[] = allUnits.flatMap(buildLessons);
export const getLesson = (id: string) => allLessons.find((l) => l.id === id);

/** 건너뛰기 테스트: 단원의 테스트 + 일부 연습 문항 */
export function skipTestQuestionIds(unitId: string): string[] {
  const lessons = allLessons.filter((l) => l.unitId === unitId);
  return lessons.flatMap((l) => [...l.testQuestionIds, l.practiceQuestionIds[2], l.practiceQuestionIds[4]]).filter(Boolean);
}

export const SKIP_PASS_RATE = 0.8;
