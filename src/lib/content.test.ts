import { describe, expect, it } from 'vitest';
import { allLessons, allQuestions, allUnits, concepts, courseQuestions, courses, getConcept, getQuestion, getWord, vocabulary } from '../data';
import { placementQuestions } from '../data/placement';
import { isCorrect, normalize } from './grading';

describe('콘텐츠 무결성', () => {
  it('ID 중복이 없다', () => {
    const ids = [...vocabulary.map((w) => w.id), ...concepts.map((c) => c.id), ...allQuestions.map((q) => q.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('최소 분량: 단어 80개, 연습문제 60개 이상', () => {
    expect(vocabulary.length).toBeGreaterThanOrEqual(80);
    expect(courseQuestions.filter((q) => q.role !== 'variant').length).toBeGreaterThanOrEqual(60);
  });

  it('각 레벨 5개 이상 대단원, 준비 단원마다 단어 20개·문항 15개 이상', () => {
    for (const c of courses) {
      expect(c.units.length).toBeGreaterThanOrEqual(5);
      const ready = c.units.filter((u) => u.status === 'ready');
      expect(ready.length).toBeGreaterThanOrEqual(1);
      for (const u of ready) {
        expect(vocabulary.filter((w) => w.unitId === u.id).length).toBeGreaterThanOrEqual(20);
        expect(courseQuestions.filter((q) => q.unitId === u.id && q.role !== 'variant').length).toBeGreaterThanOrEqual(15);
        expect(courseQuestions.filter((q) => q.unitId === u.id && q.type === 'write').length).toBeGreaterThanOrEqual(1);
        expect(courseQuestions.filter((q) => q.unitId === u.id && q.isVariant).length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('6가지 문제 유형이 모두 있다', () => {
    const types = new Set(courseQuestions.map((q) => q.type));
    ['mcq', 'blank', 'order', 'translate', 'write', 'error'].forEach((t) => expect(types.has(t as never)).toBe(true));
  });

  it('모든 문항의 정답이 채점 로직에서 정답으로 인정된다', () => {
    for (const q of allQuestions) {
      expect(isCorrect(q, q.answer), q.id).toBe(true);
      for (const a of q.acceptable ?? []) expect(isCorrect(q, a), `${q.id}: ${a}`).toBe(true);
    }
  });

  it('객관식 정답은 보기에 포함되고 보기는 서로 다르다', () => {
    for (const q of allQuestions.filter((x) => x.type === 'mcq' || x.type === 'translate')) {
      expect(q.options, q.id).toBeDefined();
      expect(q.options!.length, q.id).toBe(4);
      expect(q.options, q.id).toContain(q.answer);
      expect(new Set(q.options).size, q.id).toBe(q.options!.length);
      for (const k of Object.keys(q.optionWhy ?? {})) expect(q.options, `${q.id} optionWhy ${k}`).toContain(k);
    }
  });

  it('단어 배열 문항은 토큰을 이으면 정답이 된다', () => {
    for (const q of allQuestions.filter((x) => x.type === 'order')) expect(q.tokens!.join(' '), q.id).toBe(q.answer);
  });

  it('오류 찾기 문항은 유효한 인덱스를 가진다', () => {
    for (const q of allQuestions.filter((x) => x.type === 'error')) {
      const i = Number(q.answer);
      expect(i >= 0 && i < q.tokens!.length, q.id).toBe(true);
    }
  });

  it('빈칸 문항에는 빈칸 표시가 있다', () => {
    for (const q of allQuestions.filter((x) => x.type === 'blank')) expect(q.sentence, q.id).toContain('___');
  });

  it('참조 무결성: 단어·개념·변형 원문항', () => {
    for (const q of courseQuestions) {
      q.wordIds.forEach((id) => expect(getWord(id), `${q.id} → ${id}`).toBeDefined());
      q.conceptIds.forEach((id) => expect(getConcept(id), `${q.id} → ${id}`).toBeDefined());
      if (q.recommendConceptId) expect(getConcept(q.recommendConceptId)).toBeDefined();
      if (q.variantOf) {
        const orig = getQuestion(q.variantOf);
        expect(orig, q.id).toBeDefined();
        expect(orig!.conceptIds.some((c) => q.conceptIds.includes(c)), q.id).toBe(true);
        expect(orig!.sentence).not.toBe(q.sentence);
      }
    }
    for (const c of concepts) c.linkedWordIds.forEach((id) => expect(getWord(id), `${c.id} → ${id}`).toBeDefined());
    for (const w of vocabulary) if (w.linkedConceptId) expect(getConcept(w.linkedConceptId), w.id).toBeDefined();
  });

  it('같은 문장이 중복 출제되지 않는다', () => {
    const keys = [...courseQuestions, ...placementQuestions].filter((q) => q.sentence).map((q) => `${q.type}|${q.sentence}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('준비된 단원은 DAY 레슨으로 변환된다', () => {
    const ready = allUnits.filter((u) => u.status === 'ready');
    for (const u of ready) {
      const ls = allLessons.filter((l) => l.unitId === u.id);
      expect(ls.length).toBe(u.days);
      ls.forEach((l) => {
        expect(l.wordIds.length).toBe(10);
        expect(l.practiceQuestionIds.length).toBe(5);
        expect(l.writingQuestionIds.length).toBe(2);
        expect(l.testQuestionIds.length).toBe(2);
      });
    }
  });

  it('문법 강의 10단계 데이터가 모두 있다', () => {
    for (const c of concepts) {
      expect(c.goal.length, c.id).toBeGreaterThan(10);
      expect(c.canDo.length, c.id).toBeGreaterThanOrEqual(2);
      expect(c.easy.length, c.id).toBeGreaterThanOrEqual(2);
      expect(c.detailed.length, c.id).toBeGreaterThanOrEqual(2);
      expect(c.moreExamples.length, c.id).toBeGreaterThanOrEqual(3);
      expect(c.compare.rows.length, c.id).toBeGreaterThanOrEqual(2);
      expect(c.wrongExamples.length, c.id).toBeGreaterThanOrEqual(2);
      c.prerequisites.forEach((p) => expect(getConcept(p), `${c.id} 선행 ${p}`).toBeDefined());
      // 문장 분석 조각을 이으면 원문이 된다
      expect(normalize(c.analysis.parts.map((x) => x.text).join(' ')), c.id).toBe(normalize(c.analysis.sentence));
      // 확인 문제(연습)와 추가 연습(변형)이 있다
      expect(courseQuestions.filter((q) => q.role === 'practice' && q.conceptIds.includes(c.id)).length, c.id).toBeGreaterThanOrEqual(3);
      expect(courseQuestions.filter((q) => q.isVariant && q.conceptIds.includes(c.id)).length, c.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('단어마다 복습 단계별 문제(뜻·입력·빈칸·해석·배열)가 생성된다', () => {
    for (const w of vocabulary) {
      ['wq-m-', 'wq-t-', 'wq-b-', 'wq-r-'].forEach((p) => expect(getQuestion(p + w.id), p + w.id).toBeDefined());
      // 단어 배열은 12단어 이하 예문만 (긴 문장은 다른 유형으로 대체)
      if (w.example.split(' ').length <= 12) expect(getQuestion('wq-o-' + w.id), w.id).toBeDefined();
      const b = getQuestion('wq-b-' + w.id)!;
      expect(b.sentence!.replace('___', b.answer), w.id).toBe(w.example);
    }
  });
});
