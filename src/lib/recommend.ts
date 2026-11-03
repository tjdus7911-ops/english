import { POLICY } from '../config/policy';
import { getConcept, getQuestion } from '../data';
import type { UserAnswer } from '../types';
import { DAY_MS, pct } from './util';

export type LoadKind = 'insufficient' | 'increase' | 'keep' | 'reduce20' | 'reduce40';

export interface LoadRecommendation {
  kind: LoadKind;
  accuracy: number;
  samples: number;
  currentGoal: number;
  suggestedGoal: number;
  weakConcepts: { id: string; title: string; wrongs: number }[];
  label: string;
  message: string;
}

/** 최근 N일 반복 오답 개념 (오답 2회 이상, 많은 순) */
export function recentWeakConcepts(answers: UserAnswer[], now: number, days = POLICY.load.windowDays) {
  const since = now - days * DAY_MS;
  const count = new Map<string, number>();
  for (const a of answers) {
    if (a.at < since || a.correct || a.source === 'placement') continue;
    for (const c of getQuestion(a.questionId)?.conceptIds ?? []) count.set(c, (count.get(c) ?? 0) + 1);
  }
  return [...count.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([id, wrongs]) => ({ id, title: getConcept(id)?.title ?? id, wrongs }));
}

/**
 * 복습 결과 기반 신규 학습량 추천 (규칙 기반, 설정값은 config/policy.ts).
 * 표본이 적으면 조정하지 않고, 정답률만으로 실력을 단정하지 않는다는 점을 문구로 안내한다.
 */
export function recommendLoad(answers: UserAnswer[], currentGoal: number, now = Date.now()): LoadRecommendation {
  const since = now - POLICY.load.windowDays * DAY_MS;
  const rev = answers.filter((a) => a.source === 'review' && a.at >= since);
  const samples = rev.length;
  const correct = rev.filter((a) => a.correct).length;
  const accuracy = pct(correct, samples);
  const weakConcepts = recentWeakConcepts(answers, now);
  const weakText = weakConcepts.length ? ` 최근 '${weakConcepts[0].title}' 문제를 ${weakConcepts[0].wrongs}번 틀렸어요.` : '';

  if (samples < POLICY.load.minSamples)
    return {
      kind: 'insufficient',
      accuracy,
      samples,
      currentGoal,
      suggestedGoal: currentGoal,
      weakConcepts,
      label: '판단 보류',
      message: `최근 ${POLICY.load.windowDays}일 복습 기록이 ${samples}문제라 아직 학습량을 조정하지 않았어요. (${POLICY.load.minSamples}문제 이상부터 추천)${weakText}`,
    };

  const rule = POLICY.load.rules.find((r) => accuracy / 100 >= r.min)!;
  const suggested = Math.max(POLICY.load.minWordGoal, Math.min(POLICY.load.maxWordGoal, Math.round(currentGoal * rule.factor)));
  let message = `최근 ${POLICY.load.windowDays}일 복습 정답률은 ${accuracy}%(${samples}문제)예요.`;
  if (rule.kind === 'increase') message += ` 잘 기억하고 있어요. 신규 단어를 ${currentGoal}개 → ${suggested}개로 조금 늘려 볼까요?`;
  else if (rule.kind === 'keep') message += ` 지금 학습량(신규 단어 ${currentGoal}개)이 잘 맞아요.`;
  else if (rule.kind === 'reduce20') message += ` 신규 단어를 ${currentGoal}개 → ${suggested}개로 줄이고 복습에 시간을 더 쓰는 것을 추천해요.`;
  else message += ` 신규 단어를 ${currentGoal}개 → ${suggested}개로 줄이고${weakConcepts.length ? ` '${weakConcepts[0].title}'` : ' 취약 개념'} 복습을 먼저 하는 것을 추천해요.`;
  if (rule.kind !== 'reduce40' && weakText) message += weakText;

  return { kind: rule.kind as LoadKind, accuracy, samples, currentGoal, suggestedGoal: suggested, weakConcepts, label: rule.label, message };
}
