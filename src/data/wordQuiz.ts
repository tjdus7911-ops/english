import type { Question, Vocabulary } from '../types';
import { seededShuffle } from '../lib/util';

/**
 * 단어 데이터에서 자동 생성되는 단어 문항 (복습 단계별로 다른 유형을 출제하기 위함).
 *  wq-m 뜻 고르기 · wq-w 단어 고르기 · wq-t 영어 단어 입력 · wq-b 예문 빈칸 · wq-r 예문 해석 · wq-o 예문 배열
 * 오답 보기는 같은 레벨 단어 중 같은 품사를 우선 사용하고, 시드 고정이라 항상 같은 보기가 나온다.
 */

/** 예문에서 표제어(활용형 포함)를 찾아 빈칸으로 바꾼다 */
export function makeCloze(w: Vocabulary): { sentence: string; answer: string } | null {
  const ex = w.example;
  const lower = ex.toLowerCase();
  const target = w.word.toLowerCase();
  const exact = lower.indexOf(target);
  if (exact >= 0) {
    const before = exact === 0 || !/[a-z]/i.test(ex[exact - 1]);
    const after = exact + target.length >= ex.length || !/[a-z]/i.test(ex[exact + target.length]);
    if (before && after) return { sentence: ex.slice(0, exact) + '___' + ex.slice(exact + target.length), answer: ex.slice(exact, exact + target.length) };
  }
  if (w.word.includes(' ')) return null;
  // 활용형: drinks, studies, decided, planning, saved ...
  const stem = target.length > 4 ? target.slice(0, target.length - 1) : target.length > 3 ? target.slice(0, 3) : target;
  const re = new RegExp(`\\b(${stem}[a-z]*)\\b`, 'i');
  const m = ex.match(re);
  if (!m || m.index === undefined) return null;
  return { sentence: ex.slice(0, m.index) + '___' + ex.slice(m.index + m[1].length), answer: m[1] };
}

function letterHint(word: string): string {
  return word
    .split(' ')
    .map((p) => p[0] + ' _'.repeat(p.length - 1))
    .join('   ');
}

export function buildWordQuiz(words: Vocabulary[]): Question[] {
  const out: Question[] = [];
  for (const w of words) {
    const pool = words.filter((x) => x.level === w.level && x.id !== w.id);
    const samePos = seededShuffle(pool.filter((x) => x.pos === w.pos), w.id);
    const other = seededShuffle(pool.filter((x) => x.pos !== w.pos), w.id + 'o');
    const distract = [...samePos, ...other]
      .filter((x, i, arr) => arr.findIndex((y) => y.meaning === x.meaning) === i && x.meaning !== w.meaning && x.word !== w.word)
      .slice(0, 3);
    const base = { level: w.level, unitId: w.unitId, role: 'practice' as const, wordIds: [w.id], conceptIds: [] as string[] };
    const exp = `${w.word} ${w.ipa} (${w.pos}) — ${w.meaning}\n예문: ${w.example} (${w.exampleKo})`;

    out.push({
      ...base,
      id: `wq-m-${w.id}`,
      type: 'mcq',
      area: 'vocab',
      prompt: `'${w.word}'의 뜻으로 알맞은 것을 고르세요.`,
      options: [w.meaning, ...distract.map((d) => d.meaning)],
      answer: w.meaning,
      explanation: exp,
      optionWhy: Object.fromEntries(distract.map((d) => [d.meaning, `'${d.meaning}'은(는) ${d.word}의 뜻이에요.`])),
      mistakeType: 'meaning',
    });

    out.push({
      ...base,
      id: `wq-w-${w.id}`,
      type: 'mcq',
      area: 'vocab',
      prompt: `'${w.meaning}'에 해당하는 영어 단어를 고르세요.`,
      options: [w.word, ...distract.map((d) => d.word)],
      answer: w.word,
      explanation: exp,
      optionWhy: Object.fromEntries(distract.map((d) => [d.word, `${d.word}은(는) '${d.meaning}'이라는 뜻이에요.`])),
      mistakeType: 'meaning',
    });

    out.push({
      ...base,
      id: `wq-t-${w.id}`,
      type: 'blank',
      area: 'vocab',
      prompt: '뜻에 맞는 영어 단어(표현)를 직접 쓰세요.',
      sentence: `${w.meaning} (${w.pos})  →  ___`,
      hint: `${letterHint(w.word)}  (${w.word.replace(/ /g, '').length}글자)`,
      answer: w.word,
      explanation: exp,
      mistakeType: 'spelling',
    });

    const cloze = makeCloze(w);
    if (cloze) {
      const inflected = cloze.answer.toLowerCase() !== w.word.toLowerCase();
      out.push({
        ...base,
        id: `wq-b-${w.id}`,
        type: 'blank',
        area: 'vocab',
        prompt: inflected ? `빈칸에 '${w.word}'를 알맞은 형태로 바꿔 쓰세요.` : '예문의 빈칸에 알맞은 단어를 쓰세요.',
        sentence: cloze.sentence,
        hint: inflected ? `기본형: ${w.word} — 시제·주어에 맞게` : `뜻: ${w.meaning}`,
        answer: cloze.answer,
        explanation: `${w.example}\n(${w.exampleKo})`,
        mistakeType: inflected ? 'form' : 'spelling',
      });
    }

    const koPool = seededShuffle(
      pool.filter((x) => x.exampleKo !== w.exampleKo),
      w.id + 'r',
    ).slice(0, 3);
    out.push({
      ...base,
      id: `wq-r-${w.id}`,
      type: 'translate',
      area: 'reading',
      prompt: '예문의 뜻으로 알맞은 것을 고르세요.',
      sentence: w.example,
      options: [w.exampleKo, ...koPool.map((x) => x.exampleKo)],
      answer: w.exampleKo,
      explanation: `'${w.word}'(${w.meaning})가 쓰인 문장이에요.\n${w.example}`,
      mistakeType: 'interpretation',
    });

    const tokens = w.example.split(' ');
    if (tokens.length >= 3 && tokens.length <= 12) {
      out.push({
        ...base,
        id: `wq-o-${w.id}`,
        type: 'order',
        area: 'writing',
        prompt: `'${w.word}'를 활용해 문장을 완성하세요: ${w.exampleKo}`,
        tokens,
        answer: w.example,
        explanation: `${w.example}\n${w.pattern ? `패턴: ${w.pattern}` : ''}`.trim(),
        mistakeType: 'word-order',
      });
    }
  }
  return out;
}
