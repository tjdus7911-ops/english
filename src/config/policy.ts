/**
 * 학습 운영 정책 설정값.
 * 모두 '초기 가설'이며 실제 사용자 데이터로 조정할 수 있도록 한 곳에 모아 둔다.
 */
export const POLICY = {
  review: {
    /** 단계별 다음 복습까지 간격(일): 학습 당일 → 1 → 3 → 7 → 14 → 30 */
    intervalsDays: [0, 1, 3, 7, 14, 30],
    /** 오답 시 다음 복습까지(일) */
    wrongRetryDays: 1,
    /** 연속 오답이 이 횟수 이상이면 '재학습 필요' */
    relearnWrongStreak: 2,
    /** 이 단계 이상에서 정답이면 '안정적으로 기억 중' (7일·14일 주기를 통과) */
    stableStage: 4,
    /** 하루 복습량 선택지 (항목 수) */
    perDayOptions: [5, 10, 20, 30],
    defaultPerDay: 10,
    /** 복습 1문제 예상 소요(초) */
    secPerItem: 40,
  },
  load: {
    /** 학습량 자동 조정 판단에 쓰는 기간(일) */
    windowDays: 7,
    /** 복습 답안이 이보다 적으면 학습량을 조정하지 않음 */
    minSamples: 10,
    rules: [
      { min: 0.9, kind: 'increase', factor: 1.2, label: '소폭 증가 제안' },
      { min: 0.7, kind: 'keep', factor: 1, label: '기본 학습량 유지' },
      { min: 0.5, kind: 'reduce20', factor: 0.8, label: '신규 학습량 20% 감소 제안' },
      { min: 0, kind: 'reduce40', factor: 0.6, label: '신규 학습량 40% 감소 + 취약 개념 복습' },
    ],
    minWordGoal: 3,
    maxWordGoal: 30,
  },
  understanding: {
    /** 확인 문제 정답률 이 이상이면 이해 완료 */
    understood: 0.8,
    /** 이 미만이면 기초 설명·선행 개념 복습 */
    basics: 0.4,
    /** 같은 오답 유형이 이 횟수 이상이면 반복 오답으로 판단 */
    repeatedMistake: 2,
  },
  notifications: {
    /** 개념별 복습 알림은 하루 최대 N개까지 (나머지는 요약 알림 1건) */
    maxConceptNotifs: 2,
    /** 미완료 학습 안내: 마지막 학습 후 N시간 경과 */
    incompleteAfterHours: 6,
  },
} as const;
