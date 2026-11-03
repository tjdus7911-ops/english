import type { ConceptBase, Question, Unit, Vocabulary } from '../../types';

const U = 'a2-u1';

export const a2Units: Unit[] = [
  {
    id: U,
    level: 'A2',
    order: 1,
    title: '하고 싶은 일, 즐기는 일',
    description: '동사 뒤에 to부정사가 오는지 동명사가 오는지 구분해서 계획과 습관을 말해요.',
    status: 'ready',
    topics: ['to부정사', '동명사', '일상생활 표현', '짧은 영작'],
    days: 2,
  },
  { id: 'a2-u2', level: 'A2', order: 2, title: '어제와 내일', description: '과거시제와 will / be going to로 지난 일과 계획을 말해요.', status: 'preparing', topics: ['과거시제', '미래 표현'], days: 2 },
  { id: 'a2-u3', level: 'A2', order: 3, title: '더 좋은 것, 가장 좋은 것', description: '비교급과 최상급으로 비교해요.', status: 'preparing', topics: ['비교급과 최상급'], days: 2 },
  { id: 'a2-u4', level: 'A2', order: 4, title: '해야 하는 일', description: 'must, should, have to로 의무와 조언을 표현해요.', status: 'preparing', topics: ['조동사'], days: 2 },
  { id: 'a2-u5', level: 'A2', order: 5, title: '문장 잇기와 양 말하기', description: 'and, but, because, so와 some, any, much, many를 배워요.', status: 'preparing', topics: ['접속사', '수량 표현'], days: 2 },
];

const w = (
  id: string, day: number, word: string, pos: Vocabulary['pos'], ipa: string, koPron: string,
  meaning: string, example: string, exampleKo: string, linkedConceptId?: string, pattern?: string,
): Vocabulary => ({ id, level: 'A2', unitId: U, day, word, pos, ipa, koPron, meaning, example, exampleKo, linkedConceptId, pattern });

export const a2Words: Vocabulary[] = [
  w('a2-w-afford', 1, 'afford', 'v.', '/əˈfɔːrd/', '어포ㄹ드', '(~할) 여유가 있다', "We can't afford to buy a new car this year.", '우리는 올해 새 차를 살 여유가 없다.', 'a2-verb-to', "can't afford to + 동사원형"),
  w('a2-w-decide', 1, 'decide', 'v.', '/dɪˈsaɪd/', '디사이드', '결정하다, 결심하다', 'She decided to learn Spanish.', '그녀는 스페인어를 배우기로 결심했다.', 'a2-verb-to', 'decide to + 동사원형'),
  w('a2-w-plan', 1, 'plan', 'v.', '/plæn/', '플랜', '계획하다', "I'm planning to visit my grandparents.", '나는 조부모님을 방문할 계획이다.', 'a2-verb-to', 'plan to + 동사원형'),
  w('a2-w-hope', 1, 'hope', 'v.', '/hoʊp/', '호프', '바라다, 희망하다', 'I hope to see you again soon.', '곧 다시 만나길 바라.', 'a2-verb-to', 'hope to + 동사원형'),
  w('a2-w-promise', 1, 'promise', 'v.', '/ˈprɑːmɪs/', '프라미스', '약속하다', 'He promised to call me tonight.', '그는 오늘 밤 나에게 전화하겠다고 약속했다.', 'a2-verb-to', 'promise to + 동사원형'),
  w('a2-w-save', 1, 'save', 'v.', '/seɪv/', '세이브', '(돈을) 모으다, 저축하다', "I'm saving money to travel abroad.", '나는 해외여행을 하려고 돈을 모으고 있다.', 'a2-verb-to'),
  w('a2-w-expensive', 1, 'expensive', 'adj.', '/ɪkˈspensɪv/', '익스펜시브', '비싼', 'This bag is too expensive for me.', '이 가방은 나에게 너무 비싸다.'),
  w('a2-w-borrow', 1, 'borrow', 'v.', '/ˈbɑːroʊ/', '바로우', '빌리다', 'Can I borrow your pen?', '펜 좀 빌려도 될까?', undefined, 'borrow A from B'),
  w('a2-w-prepare', 1, 'prepare', 'v.', '/prɪˈper/', '프리페어', '준비하다', 'We need to prepare for the meeting.', '우리는 회의를 준비해야 한다.', 'a2-verb-to', 'prepare for + 명사'),
  w('a2-w-abroad', 1, 'abroad', 'adv.', '/əˈbrɔːd/', '어브로드', '해외에(서), 해외로', 'My cousin wants to study abroad.', '내 사촌은 해외에서 공부하고 싶어 한다.', 'a2-verb-to', 'study / travel abroad (to 없이)'),
  w('a2-w-enjoy', 2, 'enjoy', 'v.', '/ɪnˈdʒɔɪ/', '인조이', '즐기다', 'I enjoy cooking on weekends.', '나는 주말에 요리하는 것을 즐긴다.', 'a2-verb-ing', 'enjoy + -ing'),
  w('a2-w-finish', 2, 'finish', 'v.', '/ˈfɪnɪʃ/', '피니시', '끝내다', 'Did you finish writing the report?', '보고서 쓰는 거 끝냈어?', 'a2-verb-ing', 'finish + -ing'),
  w('a2-w-avoid', 2, 'avoid', 'v.', '/əˈvɔɪd/', '어보이드', '피하다', 'Try to avoid eating late at night.', '밤늦게 먹는 것을 피하도록 해 봐.', 'a2-verb-ing', 'avoid + -ing'),
  w('a2-w-mind', 2, 'mind', 'v.', '/maɪnd/', '마인드', '꺼리다, 신경 쓰다', 'Do you mind opening the window?', '창문 좀 열어 주시겠어요?', 'a2-verb-ing', 'Do you mind + -ing?'),
  w('a2-w-practice', 2, 'practice', 'v.', '/ˈpræktɪs/', '프랙티스', '연습하다', 'She practices speaking English every day.', '그녀는 매일 영어 말하기를 연습한다.', 'a2-verb-ing', 'practice + -ing'),
  w('a2-w-keep', 2, 'keep', 'v.', '/kiːp/', '킵', '계속 ~하다', "Keep trying. You'll get better.", '계속 해 봐. 점점 나아질 거야.', 'a2-verb-ing', 'keep + -ing'),
  w('a2-w-hobby', 2, 'hobby', 'n.', '/ˈhɑːbi/', '하비', '취미', 'My hobby is taking pictures.', '내 취미는 사진 찍기다.', 'a2-verb-ing', 'My hobby is + -ing'),
  w('a2-w-habit', 2, 'habit', 'n.', '/ˈhæbɪt/', '해빗', '습관', 'Reading before bed is a good habit.', '자기 전에 책을 읽는 것은 좋은 습관이다.', 'a2-verb-ing'),
  w('a2-w-exercise', 2, 'exercise', 'v.', '/ˈeksərsaɪz/', '엑서사이즈', '운동하다', 'I exercise three times a week.', '나는 일주일에 세 번 운동한다.'),
  w('a2-w-quit', 2, 'quit', 'v.', '/kwɪt/', '큇', '그만두다, 끊다', 'He quit smoking last year.', '그는 작년에 담배를 끊었다.', 'a2-verb-ing', 'quit + -ing'),
];

export const a2Concepts: ConceptBase[] = [
  {
    id: 'a2-verb-to',
    level: 'A2',
    unitId: U,
    day: 1,
    category: '준동사',
    title: '동사 + to부정사 (want / decide / afford to)',
    summary: '앞으로 할 일·계획·바람을 나타내는 동사 뒤에는 to + 동사원형이 와요.',
    explanation: [
      "want, decide, plan, hope, promise, need, afford 같은 동사는 '아직 일어나지 않은 일'을 향해 있어요. 그래서 뒤에 to + 동사원형을 써요.",
      "to 뒤에는 항상 동사원형이 와요. to buying, to bought처럼 쓰지 않아요.",
      "afford는 주로 can / can't와 함께 써요. can't afford to + 동사원형 = '~할 (돈·시간의) 여유가 없다'. 뒤에 명사가 오면 to 없이 can't afford a car처럼도 써요.",
    ],
    structure: ['주어 + want / decide / plan / hope / promise + to + 동사원형', "주어 + can't afford + to + 동사원형", "부정: decide not to + 동사원형"],
    correctExamples: [
      { en: 'I want to study abroad.', ko: '나는 해외에서 공부하고 싶다.' },
      { en: "We can't afford to eat out every day.", ko: '우리는 매일 외식할 여유가 없다.' },
      { en: 'She decided not to buy the expensive bag.', ko: '그녀는 그 비싼 가방을 사지 않기로 했다.' },
    ],
    wrongExamples: [
      { en: 'I hope seeing you soon.', fix: 'I hope to see you soon.', why: 'hope 뒤에는 to부정사가 와요. -ing는 쓰지 않아요.' },
      { en: "We can't afford buy it.", fix: "We can't afford to buy it.", why: 'afford 뒤에 동사가 오면 to가 필요해요.' },
      { en: 'He decided to went home.', fix: 'He decided to go home.', why: 'to 뒤에는 과거형이 아닌 동사원형을 써요.' },
    ],
    realLife: [
      { en: "Sorry, I can't afford to go on the trip this month.", ko: '미안, 이번 달은 여행 갈 여유가 없어.', situation: '친구의 여행 제안을 거절할 때' },
      { en: "I'm planning to take an English class.", ko: '영어 수업을 들을 계획이에요.', situation: '계획을 말할 때' },
    ],
    linkedWordIds: ['a2-w-afford', 'a2-w-decide', 'a2-w-plan', 'a2-w-hope', 'a2-w-promise', 'a2-w-save', 'a2-w-prepare', 'a2-w-abroad'],
  },
  {
    id: 'a2-verb-ing',
    level: 'A2',
    unitId: U,
    day: 2,
    category: '준동사',
    title: '동사 + 동명사 (enjoy / finish / avoid -ing)',
    summary: '이미 하고 있거나 경험하는 일을 다루는 동사 뒤에는 동사-ing가 와요.',
    explanation: [
      "enjoy, finish, avoid, mind, practice, keep, quit 같은 동사는 '하고 있는 행동 자체'를 즐기거나 끝내거나 피한다는 뜻이에요. 그래서 뒤에 동사-ing(동명사)를 써요.",
      'to부정사(미래·계획)와 동명사(진행·경험)를 구분하는 감각이 중요해요. decide to go(가기로 결정) vs. enjoy going(가는 것을 즐김).',
      "Do you mind + -ing?는 '~해도 괜찮을까요? / ~해 주시겠어요?'라는 정중한 부탁이에요. 대답할 때 No, not at all.은 '전혀 괜찮아요(해 드릴게요)'라는 뜻이에요.",
    ],
    structure: ['주어 + enjoy / finish / avoid / mind / keep / quit + 동사-ing', 'Do you mind + 동사-ing …?', 'My hobby is + 동사-ing'],
    correctExamples: [
      { en: 'I enjoy cooking for my friends.', ko: '나는 친구들을 위해 요리하는 것을 즐긴다.' },
      { en: 'He quit smoking last year.', ko: '그는 작년에 담배를 끊었다.' },
      { en: 'Do you mind waiting a few minutes?', ko: '몇 분만 기다려 주시겠어요?' },
    ],
    wrongExamples: [
      { en: 'I enjoy to cook.', fix: 'I enjoy cooking.', why: 'enjoy 뒤에는 to부정사가 아니라 동명사를 써요.' },
      { en: 'Have you finished to write the report?', fix: 'Have you finished writing the report?', why: 'finish 뒤에는 동명사(-ing)가 와요.' },
      { en: 'She avoids to eat sugar.', fix: 'She avoids eating sugar.', why: 'avoid 뒤에는 동명사를 써요.' },
    ],
    realLife: [
      { en: 'Do you mind closing the door?', ko: '문 좀 닫아 주시겠어요?', situation: '정중하게 부탁할 때' },
      { en: 'I enjoy walking after dinner.', ko: '저녁 먹고 산책하는 걸 좋아해요.', situation: '취미·습관 말하기' },
    ],
    linkedWordIds: ['a2-w-enjoy', 'a2-w-finish', 'a2-w-avoid', 'a2-w-mind', 'a2-w-practice', 'a2-w-keep', 'a2-w-hobby', 'a2-w-quit'],
  },
];

type QIn = Omit<Question, 'level' | 'unitId'>;
const q = (x: QIn): Question => ({ level: 'A2', unitId: U, ...x });

export const a2Questions: Question[] = [
  // ── DAY 1: 동사 + to부정사 ──
  q({ id: 'a2-q01', day: 1, role: 'practice', type: 'mcq', area: 'vocab', prompt: "'afford'의 뜻으로 알맞은 것을 고르세요.", options: ['(~할) 여유가 있다', '피하다', '빌리다', '약속하다'], answer: '(~할) 여유가 있다', explanation: "afford는 돈·시간의 '여유가 있다'는 뜻이에요. 주로 can't afford to + 동사원형으로 써요.", optionWhy: { '피하다': '피하다는 avoid예요.', '빌리다': '빌리다는 borrow예요.', '약속하다': '약속하다는 promise예요.' }, mistakeType: 'meaning', wordIds: ['a2-w-afford'], conceptIds: [] }),
  q({ id: 'a2-q02', day: 1, role: 'practice', type: 'mcq', area: 'vocab', prompt: '빈칸에 들어갈 알맞은 단어를 고르세요.', sentence: "Can I ___ your umbrella? I'll give it back tomorrow.", options: ['borrow', 'lend', 'save', 'prepare'], answer: 'borrow', explanation: "내일 돌려주겠다고 했으니 '내가 빌리다' → borrow예요.", optionWhy: { lend: "lend는 '빌려주다'예요. Can I lend …?는 내가 상대에게 빌려준다는 뜻이 돼요.", save: "save는 '모으다·저축하다'예요.", prepare: "prepare는 '준비하다'예요." }, mistakeType: 'meaning', wordIds: ['a2-w-borrow'], conceptIds: [] }),
  q({ id: 'a2-q03', day: 1, role: 'practice', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요. (두 단어)', sentence: "I can't afford ___ (buy) a new phone.", answer: 'to buy', explanation: "afford 뒤에 동사가 올 때는 to + 동사원형 → can't afford to buy.", hint: 'afford 뒤 동사 패턴', mistakeType: 'pattern', wordIds: ['a2-w-afford'], conceptIds: ['a2-verb-to'], recommendConceptId: 'a2-verb-to' }),
  q({ id: 'a2-q04', day: 1, role: 'practice', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'They decided ___ the trip.', options: ['to cancel', 'canceling', 'cancel', 'to canceling'], answer: 'to cancel', explanation: 'decide는 to부정사를 목적어로 써요: decide to + 동사원형.', optionWhy: { canceling: 'decide 뒤에는 동명사를 쓰지 않아요.', cancel: '동사가 두 개 연달아 올 수 없어요. to가 필요해요.', 'to canceling': 'to 뒤에는 동사원형을 써요.' }, mistakeType: 'pattern', wordIds: ['a2-w-decide'], conceptIds: ['a2-verb-to'], recommendConceptId: 'a2-verb-to' }),
  q({ id: 'a2-q05', day: 1, role: 'practice', type: 'error', area: 'grammar', prompt: '문법적으로 틀린 부분을 고르세요.', tokens: ['She', 'hopes', 'visiting', 'Paris', 'next year.'], answer: '2', explanation: 'hope 뒤에는 to부정사가 와요. → She hopes to visit Paris next year.', mistakeType: 'pattern', wordIds: ['a2-w-hope'], conceptIds: ['a2-verb-to'], recommendConceptId: 'a2-verb-to' }),
  q({ id: 'a2-q06', day: 1, role: 'writing', type: 'order', area: 'writing', prompt: "단어를 배열해 '나는 해외에서 공부할 계획이다.'를 완성하세요.", tokens: ['I', 'am', 'planning', 'to', 'study', 'abroad.'], answer: 'I am planning to study abroad.', explanation: 'plan to + 동사원형. abroad는 부사라서 앞에 전치사 in/to를 붙이지 않아요.', mistakeType: 'word-order', wordIds: ['a2-w-plan', 'a2-w-abroad'], conceptIds: ['a2-verb-to'], recommendConceptId: 'a2-verb-to' }),
  q({ id: 'a2-q07', day: 1, role: 'writing', type: 'write', area: 'writing', prompt: '다음 문장을 영어로 쓰세요.', sentence: '나는 새 차를 살 여유가 없다.', answer: "I can't afford to buy a new car.", acceptable: ['I cannot afford to buy a new car.', "I can't afford a new car."], hint: "can't afford to …", explanation: "'~할 여유가 없다' = can't afford to + 동사원형. 명사만 쓰는 I can't afford a new car.도 자연스러워요.", mistakeType: 'pattern', wordIds: ['a2-w-afford'], conceptIds: ['a2-verb-to'], recommendConceptId: 'a2-verb-to' }),
  q({ id: 'a2-q08', day: 1, role: 'test', type: 'translate', area: 'reading', prompt: '문장의 뜻으로 알맞은 것을 고르세요.', sentence: 'He promised to call me tonight.', options: ['그는 오늘 밤 나에게 전화하겠다고 약속했다.', '나는 오늘 밤 그에게 전화하겠다고 약속했다.', '그는 오늘 밤 나에게 전화하는 것을 즐겼다.', '그는 오늘 밤 나에게 전화하는 것을 피했다.'], answer: '그는 오늘 밤 나에게 전화하겠다고 약속했다.', explanation: "promise to + 동사원형 = '~하겠다고 약속하다'. 주어는 He, 전화 받는 사람은 me예요.", optionWhy: { '나는 오늘 밤 그에게 전화하겠다고 약속했다.': '주어(He)와 목적어(me)가 바뀌었어요.', '그는 오늘 밤 나에게 전화하는 것을 즐겼다.': "'즐기다'는 enjoy예요.", '그는 오늘 밤 나에게 전화하는 것을 피했다.': "'피하다'는 avoid예요." }, mistakeType: 'interpretation', wordIds: ['a2-w-promise'], conceptIds: ['a2-verb-to'], recommendConceptId: 'a2-verb-to' }),
  q({ id: 'a2-q09', day: 1, role: 'test', type: 'mcq', area: 'grammar', prompt: '어법상 올바른 문장을 고르세요.', options: ['I hope to see you soon.', 'I hope seeing you soon.', 'I hope see you soon.', 'I hope to seeing you soon.'], answer: 'I hope to see you soon.', explanation: 'hope + to + 동사원형이 올바른 형태예요.', optionWhy: { 'I hope seeing you soon.': 'hope는 동명사를 목적어로 쓰지 않아요.', 'I hope see you soon.': 'to 없이 동사를 이어 쓸 수 없어요.', 'I hope to seeing you soon.': 'to 뒤에는 동사원형이 와요.' }, mistakeType: 'pattern', wordIds: ['a2-w-hope'], conceptIds: ['a2-verb-to'], recommendConceptId: 'a2-verb-to' }),
  // ── DAY 2: 동사 + 동명사 ──
  q({ id: 'a2-q10', day: 2, role: 'practice', type: 'mcq', area: 'vocab', prompt: "'avoid'의 뜻으로 알맞은 것을 고르세요.", options: ['피하다', '즐기다', '끝내다', '연습하다'], answer: '피하다', explanation: "avoid는 '피하다'예요. 뒤에 동사가 오면 avoid + -ing로 써요.", optionWhy: { '즐기다': '즐기다는 enjoy예요.', '끝내다': '끝내다는 finish예요.', '연습하다': '연습하다는 practice예요.' }, mistakeType: 'meaning', wordIds: ['a2-w-avoid'], conceptIds: [] }),
  q({ id: 'a2-q11', day: 2, role: 'practice', type: 'mcq', area: 'vocab', prompt: '빈칸에 들어갈 알맞은 단어를 고르세요.', sentence: 'He ___ smoking last year. Now he feels much healthier.', options: ['quit', 'enjoyed', 'kept', 'practiced'], answer: 'quit', explanation: "건강해졌다는 뒷문장과 어울리는 것은 '담배를 끊었다(quit smoking)'예요. quit의 과거형은 quit 그대로예요.", optionWhy: { enjoyed: '담배를 즐겼다면 더 건강해졌다는 내용과 맞지 않아요.', kept: "kept smoking은 '계속 피웠다'라서 문맥과 반대예요.", practiced: 'practice smoking은 의미상 어색해요.' }, mistakeType: 'meaning', wordIds: ['a2-w-quit'], conceptIds: [] }),
  q({ id: 'a2-q12', day: 2, role: 'practice', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요.', sentence: 'I enjoy ___ (cook) for my friends.', answer: 'cooking', explanation: 'enjoy는 동명사를 목적어로 써요: enjoy + -ing.', mistakeType: 'pattern', wordIds: ['a2-w-enjoy'], conceptIds: ['a2-verb-ing'], recommendConceptId: 'a2-verb-ing' }),
  q({ id: 'a2-q13', day: 2, role: 'practice', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'Do you mind ___ the window?', options: ['opening', 'to open', 'open', 'opened'], answer: 'opening', explanation: 'Do you mind + -ing? = ~해 주시겠어요? mind는 동명사를 써요.', optionWhy: { 'to open': 'mind 뒤에는 to부정사를 쓰지 않아요.', open: '동사원형을 바로 이어 쓸 수 없어요.', opened: '과거형은 목적어 자리에 올 수 없어요.' }, mistakeType: 'pattern', wordIds: ['a2-w-mind'], conceptIds: ['a2-verb-ing'], recommendConceptId: 'a2-verb-ing' }),
  q({ id: 'a2-q14', day: 2, role: 'practice', type: 'error', area: 'grammar', prompt: '문법적으로 틀린 부분을 고르세요.', tokens: ['Have you', 'finished', 'to write', 'the report?'], answer: '2', explanation: 'finish 뒤에는 동명사가 와요. → Have you finished writing the report?', mistakeType: 'pattern', wordIds: ['a2-w-finish'], conceptIds: ['a2-verb-ing'], recommendConceptId: 'a2-verb-ing' }),
  q({ id: 'a2-q15', day: 2, role: 'writing', type: 'order', area: 'writing', prompt: "단어를 배열해 '그녀는 매일 영어로 말하기를 연습한다.'를 완성하세요.", tokens: ['She', 'practices', 'speaking', 'English', 'every day.'], answer: 'She practices speaking English every day.', explanation: 'practice + -ing. 주어가 She라서 practices예요.', mistakeType: 'word-order', wordIds: ['a2-w-practice'], conceptIds: ['a2-verb-ing'], recommendConceptId: 'a2-verb-ing' }),
  q({ id: 'a2-q16', day: 2, role: 'writing', type: 'write', area: 'writing', prompt: '다음 문장을 영어로 쓰세요.', sentence: '나는 주말에 요리하는 것을 즐긴다.', answer: 'I enjoy cooking on weekends.', acceptable: ['I enjoy cooking on the weekend.', 'I enjoy cooking on the weekends.', 'On weekends, I enjoy cooking.', 'On weekends I enjoy cooking.', 'I enjoy cooking at weekends.'], hint: 'enjoy + -ing, on weekends', explanation: "enjoy 뒤에는 동명사 cooking. '주말에'는 on weekends (영국식 at weekends)예요.", mistakeType: 'pattern', wordIds: ['a2-w-enjoy'], conceptIds: ['a2-verb-ing'], recommendConceptId: 'a2-verb-ing' }),
  q({ id: 'a2-q17', day: 2, role: 'test', type: 'translate', area: 'reading', prompt: '문장의 뜻으로 알맞은 것을 고르세요.', sentence: 'Try to avoid eating late at night.', options: ['밤늦게 먹는 것을 피하도록 해 봐.', '밤늦게 먹으려고 노력해 봐.', '밤늦게 먹는 것을 즐겨 봐.', '밤늦게 먹는 것을 그만뒀어.'], answer: '밤늦게 먹는 것을 피하도록 해 봐.', explanation: "try to + 동사원형 = ~하려고 노력하다, avoid -ing = ~하는 것을 피하다. 합치면 '먹는 것을 피하도록 해 봐'.", optionWhy: { '밤늦게 먹으려고 노력해 봐.': 'avoid(피하다)의 의미가 빠졌어요.', '밤늦게 먹는 것을 즐겨 봐.': '즐기다는 enjoy예요.', '밤늦게 먹는 것을 그만뒀어.': 'Try …로 시작하는 명령문이고, 과거가 아니에요.' }, mistakeType: 'interpretation', wordIds: ['a2-w-avoid'], conceptIds: ['a2-verb-ing', 'a2-verb-to'], recommendConceptId: 'a2-verb-ing' }),
  q({ id: 'a2-q18', day: 2, role: 'test', type: 'mcq', area: 'grammar', prompt: '빈칸에 차례로 들어갈 말을 고르세요.', sentence: 'I decided ___ more, so I quit ___ fast food.', options: ['to exercise / eating', 'exercising / to eat', 'to exercise / to eat', 'exercising / eating'], answer: 'to exercise / eating', explanation: 'decide는 to부정사, quit은 동명사를 써요. → decided to exercise, quit eating.', optionWhy: { 'exercising / to eat': '두 동사의 패턴이 서로 바뀌었어요.', 'to exercise / to eat': 'quit 뒤에는 동명사를 써요.', 'exercising / eating': 'decide 뒤에는 to부정사를 써요.' }, mistakeType: 'pattern', wordIds: ['a2-w-decide', 'a2-w-quit', 'a2-w-exercise'], conceptIds: ['a2-verb-to', 'a2-verb-ing'], recommendConceptId: 'a2-verb-ing' }),
  // ── 복습용 변형 문항 ──
  q({ id: 'a2-v01', role: 'variant', isVariant: true, variantOf: 'a2-q03', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요. (두 단어)', sentence: 'We are planning ___ (move) to a bigger city.', answer: 'to move', explanation: 'plan to + 동사원형 → planning to move.', mistakeType: 'pattern', wordIds: ['a2-w-plan'], conceptIds: ['a2-verb-to'], recommendConceptId: 'a2-verb-to' }),
  q({ id: 'a2-v02', role: 'variant', isVariant: true, variantOf: 'a2-q04', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: "My parents can't afford ___ a house in Seoul.", options: ['to buy', 'buying', 'buy', 'bought'], answer: 'to buy', explanation: "can't afford to + 동사원형.", optionWhy: { buying: 'afford 뒤에는 동명사를 쓰지 않아요.', buy: 'to 없이 동사를 이어 쓸 수 없어요.', bought: '과거형은 이 자리에 올 수 없어요.' }, mistakeType: 'pattern', wordIds: ['a2-w-afford'], conceptIds: ['a2-verb-to'], recommendConceptId: 'a2-verb-to' }),
  q({ id: 'a2-v03', role: 'variant', isVariant: true, variantOf: 'a2-q12', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요.', sentence: 'He kept ___ (talk) during the movie.', answer: 'talking', explanation: 'keep + -ing = 계속 ~하다 → kept talking.', mistakeType: 'pattern', wordIds: ['a2-w-keep'], conceptIds: ['a2-verb-ing'], recommendConceptId: 'a2-verb-ing' }),
  q({ id: 'a2-v04', role: 'variant', isVariant: true, variantOf: 'a2-q13', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'She finally finished ___ the novel.', options: ['reading', 'to read', 'read', 'reads'], answer: 'reading', explanation: 'finish + -ing → finished reading.', optionWhy: { 'to read': 'finish 뒤에는 to부정사를 쓰지 않아요.', read: '동사를 연달아 쓸 수 없어요.', reads: '동사 형태가 두 번 나올 수 없어요.' }, mistakeType: 'pattern', wordIds: ['a2-w-finish'], conceptIds: ['a2-verb-ing'], recommendConceptId: 'a2-verb-ing' }),
];
