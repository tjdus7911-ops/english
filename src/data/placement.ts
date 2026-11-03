import type { Level, Question } from '../types';

/**
 * 레벨 테스트 전용 문항 (커리큘럼 문항과 분리).
 * 어휘 8 + 문법 8 (레벨별 2문항) + 기초 영작 2.
 */
type P = Omit<Question, 'unitId' | 'role' | 'wordIds' | 'conceptIds'>;
const p = (x: P): Question => ({ unitId: 'placement', role: 'placement', wordIds: [], conceptIds: [], ...x });

export const placementQuestions: Question[] = [
  // 어휘
  p({ id: 'p-v1', level: 'A1', type: 'mcq', area: 'vocab', prompt: "'buy'의 뜻으로 알맞은 것은?", options: ['사다', '팔다', '주다', '가다'], answer: '사다', explanation: "buy는 '사다'예요. 팔다는 sell이에요.", mistakeType: 'meaning' }),
  p({ id: 'p-v2', level: 'A1', type: 'mcq', area: 'vocab', prompt: "'kitchen'은 어떤 장소인가요?", options: ['부엌', '침실', '욕실', '거실'], answer: '부엌', explanation: 'kitchen은 요리하는 곳, 부엌이에요.', mistakeType: 'meaning' }),
  p({ id: 'p-v3', level: 'A2', type: 'mcq', area: 'vocab', prompt: "'expensive'의 반대말은?", options: ['cheap', 'heavy', 'busy', 'quiet'], answer: 'cheap', explanation: 'expensive(비싼) ↔ cheap(싼).', mistakeType: 'meaning' }),
  p({ id: 'p-v4', level: 'A2', type: 'mcq', area: 'vocab', prompt: "'arrive'의 뜻으로 알맞은 것은?", options: ['도착하다', '출발하다', '기다리다', '돌아오다'], answer: '도착하다', explanation: "arrive는 '도착하다'예요. arrive at/in + 장소.", mistakeType: 'meaning' }),
  p({ id: 'p-v5', level: 'B1', type: 'mcq', area: 'vocab', prompt: "'nervous'와 의미가 가장 비슷한 단어는?", options: ['anxious', 'confident', 'generous', 'curious'], answer: 'anxious', explanation: 'nervous(긴장한, 불안한) ≈ anxious(불안한).', mistakeType: 'meaning' }),
  p({ id: 'p-v6', level: 'B1', type: 'mcq', area: 'vocab', prompt: "'improve'의 뜻으로 알맞은 것은?", options: ['향상시키다', '증명하다', '승인하다', '제공하다'], answer: '향상시키다', explanation: 'improve(향상시키다). prove(증명하다), approve(승인하다), provide(제공하다)와 구분하세요.', mistakeType: 'meaning' }),
  p({ id: 'p-v7', level: 'B2', type: 'mcq', area: 'vocab', prompt: "'inevitable'의 뜻으로 알맞은 것은?", options: ['피할 수 없는', '눈에 보이지 않는', '매우 귀중한', '믿을 수 없는'], answer: '피할 수 없는', explanation: 'inevitable(불가피한). invisible(보이지 않는), invaluable(매우 귀중한), incredible(믿기 힘든)과 구분하세요.', mistakeType: 'meaning' }),
  p({ id: 'p-v8', level: 'B2', type: 'mcq', area: 'vocab', prompt: '빈칸에 가장 알맞은 단어는?', sentence: 'The new policy had a ___ impact on small businesses; many had to close.', options: ['significant', 'reluctant', 'hesitant', 'convinced'], answer: 'significant', explanation: "significant impact = 상당한 영향. 많은 가게가 문을 닫았다는 내용과 어울려요.", mistakeType: 'meaning' }),
  // 문법
  p({ id: 'p-g1', level: 'A1', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말은?', sentence: 'She ___ a nurse.', options: ['is', 'are', 'am', 'be'], answer: 'is', explanation: 'She는 3인칭 단수 → is.', mistakeType: 'agreement' }),
  p({ id: 'p-g2', level: 'A1', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말은?', sentence: 'He ___ to school by bus.', options: ['goes', 'go', 'going', 'is go'], answer: 'goes', explanation: 'He는 3인칭 단수 → goes.', mistakeType: 'agreement' }),
  p({ id: 'p-g3', level: 'A2', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말은?', sentence: 'I ___ to the cinema last night.', options: ['went', 'go', 'have gone', 'goes'], answer: 'went', explanation: 'last night(과거 시점) → 과거시제 went.', mistakeType: 'tense' }),
  p({ id: 'p-g4', level: 'A2', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말은?', sentence: 'This bag is ___ than that one.', options: ['more expensive', 'expensiver', 'most expensive', 'more expensiver'], answer: 'more expensive', explanation: '긴 형용사의 비교급은 more + 형용사.', mistakeType: 'form' }),
  p({ id: 'p-g5', level: 'B1', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말은?', sentence: 'I ___ here since 2020.', options: ['have lived', 'live', 'lived', 'am living'], answer: 'have lived', explanation: 'since + 시작 시점 → 현재완료.', mistakeType: 'tense' }),
  p({ id: 'p-g6', level: 'B1', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말은?', sentence: 'The bridge ___ in 1990.', options: ['was built', 'built', 'has built', 'is building'], answer: 'was built', explanation: '다리는 지어지는 대상 → 수동태 was built.', mistakeType: 'form' }),
  p({ id: 'p-g7', level: 'B2', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말은?', sentence: 'If I ___ about the problem, I would have told you.', options: ['had known', 'knew', 'have known', 'would know'], answer: 'had known', explanation: '주절이 would have told → 가정법 과거완료, If절은 had + p.p.', mistakeType: 'conditional-form' }),
  p({ id: 'p-g8', level: 'B2', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말은?', sentence: "___ by the noise, she couldn't concentrate.", options: ['Distracted', 'Distracting', 'To distract', 'Distract'], answer: 'Distracted', explanation: '그녀가 소음에 의해 방해받은 것 → 수동 의미의 분사구문 Distracted.', mistakeType: 'form' }),
  // 기초 영작
  p({ id: 'p-w1', level: 'A1', type: 'order', area: 'writing', prompt: "단어를 배열해 '나는 매일 아침 커피를 마신다.'를 완성하세요.", tokens: ['I', 'drink', 'coffee', 'every', 'morning.'], answer: 'I drink coffee every morning.', explanation: '주어 + 동사 + 목적어 + 시간 표현 순서예요.', mistakeType: 'word-order' }),
  p({ id: 'p-w2', level: 'A2', type: 'write', area: 'writing', prompt: '다음 문장을 영어로 쓰세요.', sentence: '나는 어제 친구를 만났다.', answer: 'I met my friend yesterday.', acceptable: ['I met a friend yesterday.', 'I met my friends yesterday.', 'Yesterday I met my friend.', 'Yesterday, I met my friend.', 'Yesterday I met a friend.', 'Yesterday, I met a friend.'], hint: 'meet의 과거형', explanation: 'meet의 과거형은 met. I met my friend yesterday.', mistakeType: 'tense' }),
];

/** 영역 점수(0~8)를 레벨로 변환 */
export function scoreToLevel(score: number): Level {
  if (score >= 7) return 'B2';
  if (score >= 5) return 'B1';
  if (score >= 3) return 'A2';
  return 'A1';
}
