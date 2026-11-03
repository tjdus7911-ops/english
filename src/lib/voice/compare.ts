import { normalize } from '../grading';

export interface CompareResult {
  /** 목표 문장 단어별 결과 */
  tokens: { word: string; status: 'ok' | 'missing' | 'different'; heard?: string }[];
  missing: string[];
  extra: string[];
  substituted: { expected: string; heard: string }[];
  /** 인식 일치도 0~100 — 음성 인식 결과와 목표 문장의 단어 일치 비율이며 발음 점수가 아니다 */
  matchRate: number;
}

const words = (s: string) => normalize(s).split(' ').filter(Boolean);

/** 목표 문장과 인식 문장을 단어 단위로 정렬(LCS)해 누락·추가·다르게 인식된 단어를 찾는다 */
export function compareSentence(target: string, recognized: string): CompareResult {
  const a = words(target);
  const b = words(recognized);
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  // 정렬 경로 복원
  type Op = { t: 'eq'; a: string } | { t: 'del'; a: string } | { t: 'ins'; b: string };
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      ops.push({ t: 'eq', a: a[i] });
      i++;
      j++;
    } else if (j < m && (i === n || dp[i][j + 1] >= dp[i + 1][j])) {
      ops.push({ t: 'ins', b: b[j] });
      j++;
    } else {
      ops.push({ t: 'del', a: a[i] });
      i++;
    }
  }

  // 인접한 누락+추가는 '다르게 인식됨'으로 묶기
  const tokens: CompareResult['tokens'] = [];
  const missing: string[] = [];
  const extra: string[] = [];
  const substituted: CompareResult['substituted'] = [];
  let k = 0;
  while (k < ops.length) {
    const dels: string[] = [];
    const ins: string[] = [];
    while (k < ops.length && ops[k].t !== 'eq') {
      const o = ops[k];
      if (o.t === 'del') dels.push(o.a);
      else if (o.t === 'ins') ins.push(o.b);
      k++;
    }
    const pairs = Math.min(dels.length, ins.length);
    for (let p = 0; p < dels.length; p++) {
      if (p < pairs) {
        tokens.push({ word: dels[p], status: 'different', heard: ins[p] });
        substituted.push({ expected: dels[p], heard: ins[p] });
      } else {
        tokens.push({ word: dels[p], status: 'missing' });
        missing.push(dels[p]);
      }
    }
    extra.push(...ins.slice(pairs));
    if (k < ops.length && ops[k].t === 'eq') {
      tokens.push({ word: (ops[k] as { a: string }).a, status: 'ok' });
      k++;
    }
  }
  const ok = tokens.filter((t) => t.status === 'ok').length;
  return { tokens, missing, extra, substituted, matchRate: n ? Math.round((ok / n) * 100) : 0 };
}
