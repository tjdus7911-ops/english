import type { Expression, ExpressionCategory, Level, Question, SpeakingSentence } from '../../types';
import { expressionSpeaking } from '../speaking';
import { seededShuffle } from '../../lib/util';
import { BUSINESS, ESSENTIAL, PHRASAL, TRAVEL } from './raw';

export const EXPRESSION_CATEGORIES: { id: ExpressionCategory; title: string; desc: string; icon: string }[] = [
  { id: 'essential', title: '필수 영어회화 표현', desc: '인사·감정·동의 등 매일 쓰는 표현', icon: 'note' },
  { id: 'travel', title: '여행 영어', desc: '호텔·식당·공항·쇼핑·길 찾기', icon: 'compass' },
  { id: 'business', title: '비즈니스 영어', desc: '회의·이메일·일정·전화', icon: 'course' },
  { id: 'phrasal', title: '구동사 및 숙어', desc: '원어민이 자주 쓰는 동사 덩어리와 관용 표현', icon: 'link' },
  { id: 'situational', title: '상황별 듣기·말하기', desc: '실제 상황 대화를 듣고 따라 말하기', icon: 'headphones' },
  { id: 'video', title: '영상 속 영어', desc: '오리지널 미니 드라마 (준비 중)', icon: 'play' },
];

const clean = (s: string) => s.replace(/[.?!]+$/, '').trim();

function parse(category: ExpressionCategory, prefix: string, raw: string): Omit<Expression, 'questionIds'>[] {
  return raw
    .trim()
    .split('\n')
    .map((line, i) => {
      const f = line.split(' | ').map((x) => x.trim());
      if (f.length < 13) throw new Error(`표현 데이터 형식 오류 (${category} ${i + 1}행): ${line.slice(0, 40)}`);
      const [en, ko, level, tags, situation, nuance, similar, aEn, aKo, bEn, bKo, pEn, pKo, conceptId, match] = f;
      const id = `${prefix}-${String(i + 1).padStart(3, '0')}`;
      const span0 = match || clean(en);
      const lines = [aEn, bEn];
      let lineIdx = lines.findIndex((l) => l.toLowerCase().includes(span0.toLowerCase()));
      if (lineIdx < 0) throw new Error(`대사에 표현이 없음: ${id} ${en}`);
      const start = lines[lineIdx].toLowerCase().indexOf(span0.toLowerCase());
      const span = lines[lineIdx].slice(start, start + span0.length);
      if (lineIdx > 1) lineIdx = 1;
      return {
        id,
        category,
        level: level as Level,
        en,
        ko,
        tags: tags.split(',').map((t) => t.trim()),
        situation,
        nuance,
        similar: similar
          ? similar.split(';').map((s) => {
              const [e, d] = s.split('~');
              return { en: e.trim(), diff: (d ?? '').trim() };
            })
          : [],
        dialogue: [
          { speaker: 'A' as const, en: aEn, ko: aKo, audio: `audio/expr/${id}-a.mp3` },
          { speaker: 'B' as const, en: bEn, ko: bKo, audio: `audio/expr/${id}-b.mp3` },
        ],
        usedIn: { line: lineIdx, span },
        practice: { en: pEn, ko: pKo },
        conceptId: conceptId || undefined,
        audio: `audio/expr/${id}.mp3`,
      };
    });
}

const base = [
  ...parse('essential', 'ex-es', ESSENTIAL),
  ...parse('travel', 'ex-tr', TRAVEL),
  ...parse('business', 'ex-bz', BUSINESS),
  ...parse('phrasal', 'ex-ph', PHRASAL),
];

/** 표현마다 자동 생성: 뜻 고르기 · 듣고 빈칸 표현 고르기 · 응용 문장 배열 */
function buildQuestions(e: Omit<Expression, 'questionIds'>): Question[] {
  const peers = base.filter((x) => x.category === e.category && x.id !== e.id);
  const mPeers = seededShuffle(peers, e.id + 'm').filter((x, i, a) => x.ko !== e.ko && a.findIndex((y) => y.ko === x.ko) === i).slice(0, 3);
  const lPeers = seededShuffle(peers, e.id + 'l').filter((x) => clean(x.en).toLowerCase() !== e.usedIn.span.toLowerCase()).slice(0, 3);
  const common = { expressionId: e.id, level: e.level, unitId: e.category, role: 'practice' as const, wordIds: [], conceptIds: e.conceptId ? [e.conceptId] : [], recommendConceptId: e.conceptId };
  const line = e.dialogue[e.usedIn.line];
  const blankSentence = line.en.replace(e.usedIn.span, '___');
  const exp = `${e.en} = ${e.ko}\n${e.situation}. ${e.nuance}`;
  const qs: Question[] = [
    {
      ...common,
      id: `xq-m-${e.id}`,
      type: 'mcq',
      area: 'vocab',
      prompt: `'${e.en}'의 뜻으로 알맞은 것을 고르세요.`,
      options: [e.ko, ...mPeers.map((p) => p.ko)],
      answer: e.ko,
      explanation: exp,
      optionWhy: Object.fromEntries(mPeers.map((p) => [p.ko, `'${p.ko}'은(는) ${p.en}의 뜻이에요.`])),
      mistakeType: 'meaning',
    },
    {
      ...common,
      id: `xq-l-${e.id}`,
      type: 'mcq',
      area: 'listening',
      prompt: '대화를 듣고 빈칸에 들어갈 표현을 고르세요.',
      sentence: blankSentence,
      audio: e.dialogue.map((d) => d.audio),
      options: [e.usedIn.span, ...lPeers.map((p) => clean(p.en))],
      answer: e.usedIn.span,
      explanation: `${line.en}\n(${line.ko})\n${exp}`,
      mistakeType: 'interpretation',
    },
  ];
  const tokens = e.practice.en.split(' ');
  if (tokens.length >= 3 && tokens.length <= 14)
    qs.push({
      ...common,
      id: `xq-o-${e.id}`,
      type: 'order',
      area: 'writing',
      prompt: `응용 영작: '${e.practice.ko}'를 영어로 배열하세요.`,
      tokens,
      answer: e.practice.en,
      explanation: `${e.practice.en}\n${exp}`,
      mistakeType: 'word-order',
    });
  return qs;
}

const built = base.map((e) => {
  const questions = buildQuestions(e);
  return { e: { ...e, questionIds: questions.map((q) => q.id) } as Expression, questions };
});

export const expressions: Expression[] = built.map((b) => b.e);
export const expressionQuestions: Question[] = built.flatMap((b) => b.questions);
export const getExpression = (id: string) => expressions.find((e) => e.id === id);

/** 표현마다 따라 말하기 문장 = 표현이 쓰인 대사 */
export const speakingOfExpression = (e: Expression): SpeakingSentence => {
  const l = e.dialogue[e.usedIn.line];
  return { id: `sp-${e.id}`, level: e.level, en: l.en, ko: l.ko, audio: l.audio, conceptId: e.conceptId };
};
expressionSpeaking.push(...expressions.map(speakingOfExpression));
