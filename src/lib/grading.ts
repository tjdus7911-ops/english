import type { Question } from '../types';

const CONTRACTIONS: [RegExp, string][] = [
  [/\bcan't\b/g, 'cannot'],
  [/\bcan not\b/g, 'cannot'],
  [/\bwon't\b/g, 'will not'],
  [/\bshan't\b/g, 'shall not'],
  [/n't\b/g, ' not'],
  [/'m\b/g, ' am'],
  [/'re\b/g, ' are'],
  [/'ve\b/g, ' have'],
  [/'ll\b/g, ' will'],
];

const NUMBERS: Record<string, string> = { '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten' };

/**
 * 영작·빈칸 채점용 정규화.
 * 대소문자, 앞뒤 공백, 문장부호, 축약형(n't, 'm, 're, 've, 'll), 1~10 숫자를 통일한다.
 * 's / 'd 는 뜻이 여러 개라 펼치지 않는다.
 */
export function normalize(text: string): string {
  let s = text
    .toLowerCase()
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/[“”]/g, '"')
    .trim();
  for (const [re, rep] of CONTRACTIONS) s = s.replace(re, rep);
  s = s
    .replace(/[.,!?;:"()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  s = s
    .split(' ')
    .map((t) => NUMBERS[t] ?? t)
    .join(' ');
  return s;
}

export function correctAnswers(q: Question): string[] {
  return [q.answer, ...(q.acceptable ?? [])];
}

export function isCorrect(q: Question, given: string): boolean {
  if (q.type === 'error') return given === q.answer;
  if (q.type === 'mcq' || q.type === 'translate') return given === q.answer;
  const g = normalize(given);
  if (!g) return false;
  return correctAnswers(q).some((a) => normalize(a) === g);
}

/** 오답일 때 사용자에게 보여 줄 원인 설명 (규칙 기반) */
export function explainMistake(q: Question, given: string): string | null {
  if (q.optionWhy && q.optionWhy[given]) return q.optionWhy[given];
  if (q.type === 'error' && q.tokens) {
    const picked = q.tokens[Number(given)];
    const wrong = q.tokens[Number(q.answer)];
    if (picked !== undefined) return `'${picked}'은(는) 어법상 문제가 없어요. 틀린 부분은 '${wrong}'이에요.`;
  }
  if ((q.type === 'write' || q.type === 'blank') && given.trim()) {
    const g = normalize(given);
    const a = normalize(q.answer);
    const gw = g.split(' ');
    const aw = a.split(' ');
    const missing = aw.filter((x) => !gw.includes(x));
    const extra = gw.filter((x) => !aw.includes(x));
    if (missing.length && missing.length <= 3) {
      return `정답 문장과 비교하면 ${missing.map((m) => `'${m}'`).join(', ')}이(가) 빠졌거나 다르게 쓰였어요.${extra.length && extra.length <= 3 ? ` 대신 ${extra.map((m) => `'${m}'`).join(', ')}을(를) 썼어요.` : ''}`;
    }
  }
  if (q.type === 'order') return '단어 순서가 정답과 달라요. 주어 → 동사 → 나머지 순서를 확인해 보세요.';
  return null;
}
