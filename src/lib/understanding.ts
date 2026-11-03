import { POLICY } from '../config/policy';
import type { MistakeType, Understanding } from '../types';
import { MISTAKE_LABEL } from '../types';

export interface CheckOutcome {
  result: Understanding;
  rate: number;
  correct: number;
  total: number;
  repeatedMistake?: MistakeType;
  title: string;
  advice: string;
}

/**
 * 문법 확인 문제 결과 → 이해도 판정 (규칙 기반)
 *  - 정답률 80% 이상 & 반복 오답 없음 → 이해 완료: 다음 학습
 *  - 정답률 40% 미만 또는 같은 오답 유형 2회 이상 → 기초 설명·선행 개념 복습
 *  - 그 외 → 해당 개념 추가 연습
 */
export function judgeUnderstanding(results: { correct: boolean; mistakeType: MistakeType }[]): CheckOutcome {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  const rate = total ? correct / total : 0;
  const counts = new Map<MistakeType, number>();
  results.filter((r) => !r.correct).forEach((r) => counts.set(r.mistakeType, (counts.get(r.mistakeType) ?? 0) + 1));
  const rep = [...counts.entries()].sort((a, b) => b[1] - a[1]).find(([, n]) => n >= POLICY.understanding.repeatedMistake)?.[0];

  if (rate >= POLICY.understanding.understood && !rep)
    return { result: 'understood', rate, correct, total, title: '잘 이해했어요', advice: '개념을 학습 완료로 기록하고 다음 학습으로 넘어가요. 복습 일정에 따라 다시 확인할게요.' };
  if (rate < POLICY.understanding.basics || rep)
    return {
      result: 'needs-basics',
      rate,
      correct,
      total,
      repeatedMistake: rep,
      title: rep ? `'${MISTAKE_LABEL[rep]}' 실수가 반복됐어요` : '기초부터 다시 짚어 볼게요',
      advice: '쉬운 설명과 선행 개념을 먼저 복습한 뒤 다시 확인 문제를 풀어 보세요. 개념은 아직 학습 완료로 기록하지 않아요.',
    };
  return { result: 'partial', rate, correct, total, title: '조금만 더 연습해요', advice: '틀린 부분과 같은 개념의 다른 문장으로 추가 연습을 해 볼게요.' };
}
