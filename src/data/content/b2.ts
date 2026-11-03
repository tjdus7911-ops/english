import type { ConceptBase, Question, Unit, Vocabulary } from '../../types';

const U = 'b2-u1';

export const b2Units: Unit[] = [
  {
    id: U,
    level: 'B2',
    order: 1,
    title: '후회와 가정, 그리고 주장',
    description: '가정법 과거완료와 혼합 가정법으로 과거를 돌아보고, 근거를 들어 의견을 말하는 어휘를 익혀요.',
    status: 'ready',
    topics: ['가정법 심화', '근거와 주장 표현', '어휘 뉘앙스'],
    days: 2,
  },
  { id: 'b2-u2', level: 'B2', order: 2, title: '문장을 압축하기', description: '분사구문으로 두 문장을 하나로 줄여요.', status: 'preparing', topics: ['분사구문'], days: 2 },
  { id: 'b2-u3', level: 'B2', order: 3, title: '정보를 겹겹이', description: '전치사 + 관계대명사, 계속적 용법 등 복잡한 관계절을 다뤄요.', status: 'preparing', topics: ['복잡한 관계절'], days: 2 },
  { id: 'b2-u4', level: 'B2', order: 4, title: '논리적으로 연결하기', description: 'however, nevertheless, whereas 등 고급 접속 표현과 논리적 독해.', status: 'preparing', topics: ['고급 접속 표현', '논리적 독해'], days: 2 },
  { id: 'b2-u5', level: 'B2', order: 5, title: '원어민처럼 묶어 쓰기', description: '구동사와 연어(collocation), 비슷한 단어의 뉘앙스 차이.', status: 'preparing', topics: ['구동사와 연어', '어휘 뉘앙스'], days: 2 },
  { id: 'b2-u6', level: 'B2', order: 6, title: '의견문 쓰기', description: '주장-근거-예시-결론 구조로 의견문을 써요.', status: 'preparing', topics: ['의견문 작성', '근거와 주장 표현'], days: 2 },
];

const w = (
  id: string, day: number, word: string, pos: Vocabulary['pos'], ipa: string, koPron: string,
  meaning: string, example: string, exampleKo: string, linkedConceptId?: string, pattern?: string,
): Vocabulary => ({ id, level: 'B2', unitId: U, day, word, pos, ipa, koPron, meaning, example, exampleKo, linkedConceptId, pattern });

export const b2Words: Vocabulary[] = [
  w('b2-w-regret', 1, 'regret', 'v.', '/rɪˈɡret/', '리그렛', '후회하다', 'I regret not studying harder in college.', '나는 대학 때 더 열심히 공부하지 않은 것을 후회한다.', 'b2-third-cond', 'regret (not) + -ing'),
  w('b2-w-consequence', 1, 'consequence', 'n.', '/ˈkɑːnsəkwens/', '칸서퀜스', '(좋지 않은) 결과, 영향', "If he had read the contract, he wouldn't have faced such serious consequences.", '그가 계약서를 읽었더라면 그렇게 심각한 결과를 겪지 않았을 것이다.', 'b2-third-cond', 'face the consequences'),
  w('b2-w-crucial', 1, 'crucial', 'adj.', '/ˈkruːʃl/', '크루셜', '결정적인, 매우 중요한', 'Sleep is crucial for good health.', '수면은 건강에 매우 중요하다.'),
  w('b2-w-outcome', 1, 'outcome', 'n.', '/ˈaʊtkʌm/', '아웃컴', '결과', 'The outcome of the meeting was better than expected.', '회의 결과는 예상보다 좋았다.'),
  w('b2-w-hesitate', 1, 'hesitate', 'v.', '/ˈhezɪteɪt/', '헤지테이트', '망설이다', "Don't hesitate to contact me if you have any questions.", '질문이 있으면 망설이지 말고 연락 주세요.', undefined, "don't hesitate to + 동사원형"),
  w('b2-w-prevent', 1, 'prevent', 'v.', '/prɪˈvent/', '프리벤트', '막다, 예방하다', 'Wearing a seatbelt can prevent serious injuries.', '안전벨트를 매면 심각한 부상을 막을 수 있다.', undefined, 'prevent A from -ing'),
  w('b2-w-inevitable', 1, 'inevitable', 'adj.', '/ɪnˈevɪtəbl/', '이네비터블', '불가피한, 피할 수 없는', 'Some mistakes are inevitable when you learn a new language.', '새 언어를 배울 때 어떤 실수들은 피할 수 없다.'),
  w('b2-w-reluctant', 1, 'reluctant', 'adj.', '/rɪˈlʌktənt/', '릴럭턴트', '꺼리는, 마지못해 하는', 'She was reluctant to accept the offer.', '그녀는 그 제안을 받아들이기를 꺼렸다.', undefined, 'be reluctant to + 동사원형'),
  w('b2-w-hindsight', 1, 'in hindsight', 'phr.', '/ɪn ˈhaɪndsaɪt/', '인 하인드사이트', '돌이켜 보면', 'In hindsight, I should have asked for help earlier.', '돌이켜 보면, 나는 더 일찍 도움을 요청했어야 했다.', 'b2-third-cond', 'In hindsight, + should have p.p.'),
  w('b2-w-advantage', 1, 'take advantage of', 'phr.', '/teɪk ədˈvæntɪdʒ əv/', '테익 어드밴티지 오브', '~을 활용하다, (기회를) 잡다', 'You should take advantage of this opportunity.', '이 기회를 꼭 활용해야 한다.'),
  w('b2-w-argue', 2, 'argue', 'v.', '/ˈɑːrɡjuː/', '아ㄹ규', '주장하다; 언쟁하다', 'Some people argue that remote work improves productivity.', '어떤 사람들은 재택근무가 생산성을 높인다고 주장한다.', undefined, 'argue that + 문장'),
  w('b2-w-evidence', 2, 'evidence', 'n.', '/ˈevɪdəns/', '에비던스', '증거, 근거', 'There is little evidence to support his claim.', '그의 주장을 뒷받침할 근거가 거의 없다.', undefined, 'evidence to support …'),
  w('b2-w-assume', 2, 'assume', 'v.', '/əˈsuːm/', '어숨', '(사실이라고) 가정하다, 추정하다', "Don't assume that everyone agrees with you.", '모두가 너에게 동의한다고 단정하지 마.'),
  w('b2-w-significant', 2, 'significant', 'adj.', '/sɪɡˈnɪfɪkənt/', '시그니피컨트', '상당한, 중요한', 'There has been a significant increase in prices.', '물가가 상당히 올랐다.'),
  w('b2-w-perspective', 2, 'perspective', 'n.', '/pərˈspektɪv/', '퍼ㄹ스펙티브', '관점, 시각', 'Traveling gave me a new perspective on life.', '여행은 나에게 삶에 대한 새로운 시각을 주었다.', undefined, 'a perspective on …'),
  w('b2-w-therefore', 2, 'therefore', 'adv.', '/ˈðerfɔːr/', '데어포어', '그러므로', 'The data was incomplete; therefore, the results were unreliable.', '데이터가 불완전했다. 그러므로 결과는 신뢰할 수 없었다.'),
  w('b2-w-claim', 2, 'claim', 'v.', '/kleɪm/', '클레임', '(사실이라고) 주장하다', 'The company claims that its product is eco-friendly.', '그 회사는 자사 제품이 친환경적이라고 주장한다.', undefined, 'claim that + 문장'),
  w('b2-w-whereas', 2, 'whereas', 'conj.', '/werˈæz/', '웨어애즈', '~인 반면에', 'I prefer tea, whereas my brother loves coffee.', '나는 차를 좋아하는 반면, 내 동생은 커피를 무척 좋아한다.'),
  w('b2-w-convince', 2, 'convince', 'v.', '/kənˈvɪns/', '컨빈스', '설득하다, 납득시키다', 'If you had shown more evidence, you would have convinced them.', '네가 근거를 더 보여 줬더라면 그들을 설득했을 거야.', 'b2-third-cond'),
  w('b2-w-relyon', 2, 'rely on', 'phr.', '/rɪˈlaɪ ɑːn/', '릴라이 온', '~에 의존하다', "We shouldn't rely on a single source of information.", '우리는 하나의 정보원에만 의존해서는 안 된다.', 'b2-mixed-cond'),
];

export const b2Concepts: ConceptBase[] = [
  {
    id: 'b2-third-cond',
    level: 'B2',
    unitId: U,
    day: 1,
    category: '조건·가정법',
    title: '가정법 과거완료 (If + had p.p., would have p.p.)',
    summary: "과거 사실과 반대로 가정하며 '그때 ~했더라면, ~했을 텐데'라고 말해요.",
    explanation: [
      '이미 일어난(또는 일어나지 않은) 과거를 바꿔 상상할 때 써요. 실제로는 그렇지 않았다는 후회·아쉬움이 담겨 있어요.',
      'If절에는 had + 과거분사, 주절에는 would / could / might + have + 과거분사를 써요. If절에 would를 넣지 않는 것이 핵심이에요.',
      "후회를 직접 말할 때는 should have + p.p.(~했어야 했는데)도 자주 써요. In hindsight, I should have asked earlier.",
    ],
    structure: ['If + 주어 + had + p.p., 주어 + would / could / might + have + p.p.', '주어 + would have + p.p. + if + 주어 + had + p.p.', '후회: 주어 + should have + p.p.'],
    correctExamples: [
      { en: 'If I had left earlier, I would have caught the train.', ko: '더 일찍 나섰더라면 기차를 탔을 텐데.' },
      { en: "If she had read the instructions, she wouldn't have made that mistake.", ko: '그녀가 설명서를 읽었더라면 그런 실수를 하지 않았을 텐데.' },
      { en: 'We could have won if we had practiced more.', ko: '연습을 더 했더라면 이길 수도 있었을 텐데.' },
    ],
    wrongExamples: [
      { en: 'If we would have known, we would have come.', fix: 'If we had known, we would have come.', why: 'If절에는 would를 쓰지 않고 had + p.p.를 써요.' },
      { en: 'If I had left earlier, I would caught the train.', fix: 'If I had left earlier, I would have caught the train.', why: '과거 결과는 would + have + p.p.로 써요.' },
      { en: 'If he has studied, he would have passed.', fix: 'If he had studied, he would have passed.', why: '과거 사실의 반대는 has가 아니라 had + p.p.예요.' },
    ],
    realLife: [
      { en: 'If I had known you were coming, I would have cooked dinner.', ko: '네가 온다는 걸 알았더라면 저녁을 했을 텐데.', situation: '갑작스러운 방문에' },
      { en: 'In hindsight, I should have taken that job.', ko: '돌이켜 보면 그 일을 했어야 했어.', situation: '진로를 돌아보며' },
    ],
    linkedWordIds: ['b2-w-regret', 'b2-w-consequence', 'b2-w-hindsight', 'b2-w-convince'],
  },
  {
    id: 'b2-mixed-cond',
    level: 'B2',
    unitId: U,
    day: 2,
    category: '조건·가정법',
    title: '혼합 가정법 (과거 가정 → 현재 결과)',
    summary: "'그때 ~했더라면, 지금 ~할 텐데'처럼 과거 조건과 현재 결과를 섞어 말해요.",
    explanation: [
      '과거의 선택이 지금에 영향을 주는 상황을 말할 때 써요. If절은 과거완료(had p.p.), 주절은 would + 동사원형이에요. 주절에 now, today 같은 말이 자주 와요.',
      "반대 방향도 있어요. 지금의 성격·사실이 과거 결과에 영향을 준 경우: If + 과거형, would have + p.p. (If I weren't so shy, I would have spoken yesterday.)",
      "어느 시점의 결과인지 보고 형태를 골라요. 결과가 '지금'이면 would + 동사원형, 결과가 '과거'면 would have + p.p.예요.",
    ],
    structure: ['If + 주어 + had + p.p., 주어 + would + 동사원형 (+ now)', "If + 주어 + 과거형/were, 주어 + would have + p.p. (+ 과거 시점)"],
    correctExamples: [
      { en: 'If I had studied medicine, I would be a doctor now.', ko: '내가 의학을 공부했더라면, 지금 의사일 텐데.' },
      { en: "If I hadn't missed the bus, I wouldn't be late now.", ko: '버스를 놓치지 않았더라면 지금 늦지 않았을 텐데.' },
      { en: "If she weren't so shy, she would have spoken at the meeting yesterday.", ko: '그녀가 그렇게 수줍음이 많지 않다면, 어제 회의에서 발언했을 텐데.' },
    ],
    wrongExamples: [
      { en: 'If I had saved more money, I would have been rich now.', fix: 'If I had saved more money, I would be rich now.', why: "결과가 '지금(now)'이므로 would + 동사원형을 써요." },
      { en: 'If I would have taken the job, I would live in Seoul now.', fix: 'If I had taken the job, I would live in Seoul now.', why: 'If절에는 would를 쓰지 않아요.' },
    ],
    realLife: [
      { en: "If I had gone to bed earlier, I wouldn't be so tired now.", ko: '일찍 잤더라면 지금 이렇게 피곤하지 않을 텐데.', situation: '아침에 피곤할 때' },
      { en: 'If we had booked earlier, we would be on the beach right now.', ko: '일찍 예약했더라면 지금 해변에 있을 텐데.', situation: '여행 계획을 놓쳤을 때' },
    ],
    linkedWordIds: ['b2-w-relyon', 'b2-w-regret'],
  },
];

type QIn = Omit<Question, 'level' | 'unitId'>;
const q = (x: QIn): Question => ({ level: 'B2', unitId: U, ...x });

export const b2Questions: Question[] = [
  // ── DAY 1: 가정법 과거완료 ──
  q({ id: 'b2-q01', day: 1, role: 'practice', type: 'mcq', area: 'vocab', prompt: "'reluctant'의 뜻으로 알맞은 것을 고르세요.", options: ['꺼리는, 마지못해 하는', '결정적인', '불가피한', '상당한'], answer: '꺼리는, 마지못해 하는', explanation: "reluctant는 '하기를 꺼리는'이에요. be reluctant to + 동사원형.", optionWhy: { '결정적인': '결정적인은 crucial이에요.', '불가피한': '불가피한은 inevitable이에요.', '상당한': '상당한은 significant예요.' }, mistakeType: 'meaning', wordIds: ['b2-w-reluctant'], conceptIds: [] }),
  q({ id: 'b2-q02', day: 1, role: 'practice', type: 'mcq', area: 'vocab', prompt: '빈칸에 들어갈 알맞은 단어를 고르세요.', sentence: "Don't ___ to ask if you need help.", options: ['hesitate', 'prevent', 'regret', 'assume'], answer: 'hesitate', explanation: "Don't hesitate to + 동사원형 = 망설이지 말고 ~하세요. 이메일·업무 표현으로 자주 써요.", optionWhy: { prevent: 'prevent(막다)는 to부정사를 바로 쓰지 않아요.', regret: "regret to + 동사원형은 '유감스럽게도 ~하다'라서 문맥에 맞지 않아요.", assume: "assume(추정하다)는 '도움을 요청하라'는 문맥과 어울리지 않아요." }, mistakeType: 'meaning', wordIds: ['b2-w-hesitate'], conceptIds: [] }),
  q({ id: 'b2-q03', day: 1, role: 'practice', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요.', sentence: 'If I had left earlier, I would have ___ (catch) the train.', answer: 'caught', explanation: 'would have 뒤에는 과거분사가 와요. catch의 과거분사는 caught예요.', hint: 'catch의 과거분사', mistakeType: 'form', wordIds: [], conceptIds: ['b2-third-cond'], recommendConceptId: 'b2-third-cond' }),
  q({ id: 'b2-q04', day: 1, role: 'practice', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: "If she ___ the instructions, she wouldn't have made that mistake.", options: ['had read', 'read', 'would read', 'has read'], answer: 'had read', explanation: '주절이 wouldn’t have made(과거 결과)이므로 If절은 had + p.p.예요.', optionWhy: { read: '과거형 read는 현재 사실의 반대(가정법 과거)에 써요.', 'would read': 'If절에는 would를 쓰지 않아요.', 'has read': '현재완료는 가정법에 쓰지 않아요.' }, mistakeType: 'conditional-form', wordIds: [], conceptIds: ['b2-third-cond'], recommendConceptId: 'b2-third-cond' }),
  q({ id: 'b2-q05', day: 1, role: 'practice', type: 'error', area: 'grammar', prompt: '문법적으로 틀린 부분을 고르세요.', tokens: ['If we', 'would have known', 'about the traffic,', 'we would have taken', 'the subway.'], answer: '1', explanation: 'If절에는 would를 쓰지 않아요. → If we had known about the traffic, we would have taken the subway.', mistakeType: 'conditional-form', wordIds: [], conceptIds: ['b2-third-cond'], recommendConceptId: 'b2-third-cond' }),
  q({ id: 'b2-q06', day: 1, role: 'writing', type: 'order', area: 'writing', prompt: "단어를 배열해 '돌이켜 보면, 나는 더 일찍 도움을 요청했어야 했다.'를 완성하세요.", tokens: ['In hindsight,', 'I', 'should', 'have', 'asked', 'for help', 'earlier.'], answer: 'In hindsight, I should have asked for help earlier.', explanation: "과거에 대한 후회는 should have + p.p.(~했어야 했는데)로 말해요.", mistakeType: 'word-order', wordIds: ['b2-w-hindsight'], conceptIds: ['b2-third-cond'], recommendConceptId: 'b2-third-cond' }),
  q({ id: 'b2-q07', day: 1, role: 'writing', type: 'write', area: 'writing', prompt: '다음 문장을 영어로 쓰세요.', sentence: '내가 그 기회를 잡았더라면, 나는 해외에서 일했을 텐데.', answer: 'If I had taken the opportunity, I would have worked abroad.', acceptable: ['If I had taken that opportunity, I would have worked abroad.', 'If I had taken advantage of the opportunity, I would have worked abroad.', 'If I had taken advantage of that opportunity, I would have worked abroad.', 'If I had taken the chance, I would have worked abroad.', 'If I had taken that chance, I would have worked abroad.', 'I would have worked abroad if I had taken the opportunity.', 'I would have worked abroad if I had taken that opportunity.'], hint: 'If + had p.p., would have p.p.', explanation: "과거 사실의 반대 → If I had taken …, I would have worked …. '기회를 잡다'는 take the opportunity / take advantage of the opportunity예요.", mistakeType: 'conditional-form', wordIds: ['b2-w-advantage'], conceptIds: ['b2-third-cond'], recommendConceptId: 'b2-third-cond' }),
  q({ id: 'b2-q08', day: 1, role: 'test', type: 'translate', area: 'reading', prompt: '문장의 뜻으로 알맞은 것을 고르세요.', sentence: 'If you had told me, I would have helped you.', options: ['네가 말해 줬더라면, 내가 도와줬을 텐데.', '네가 말해 주면, 내가 도와줄게.', '네가 말해 줬기 때문에, 내가 도와줬다.', '네가 말해 줬더라면, 지금 내가 도와줄 텐데.'], answer: '네가 말해 줬더라면, 내가 도와줬을 텐데.', explanation: "had told / would have helped → 둘 다 과거 사실의 반대예요. 실제로는 말하지 않았고, 돕지 못했어요.", optionWhy: { '네가 말해 주면, 내가 도와줄게.': "미래 조건이라면 If you tell me, I'll help you.예요.", '네가 말해 줬기 때문에, 내가 도와줬다.': '가정법은 사실이 아닌 일을 상상하는 것이라 실제로 일어난 일이 아니에요.', '네가 말해 줬더라면, 지금 내가 도와줄 텐데.': "'지금 ~할 텐데'는 would + 동사원형(혼합 가정법)이에요." }, mistakeType: 'interpretation', wordIds: [], conceptIds: ['b2-third-cond'], recommendConceptId: 'b2-third-cond' }),
  q({ id: 'b2-q09', day: 1, role: 'test', type: 'mcq', area: 'grammar', prompt: '빈칸에 차례로 들어갈 말을 고르세요.', sentence: 'He regrets his decision. If he ___ the risks, he ___ the offer.', options: ['had considered / would have rejected', 'has considered / will reject', 'would consider / would have rejected', 'considered / will have rejected'], answer: 'had considered / would have rejected', explanation: '이미 내린 결정에 대한 후회 → 과거 사실의 반대: If + had p.p., would have p.p.', optionWhy: { 'has considered / will reject': '현재완료와 will은 실제 가능한 조건에 써요.', 'would consider / would have rejected': 'If절에는 would를 쓰지 않아요.', 'considered / will have rejected': 'will have p.p.는 미래완료라 가정법 형태가 아니에요.' }, mistakeType: 'conditional-form', wordIds: ['b2-w-regret'], conceptIds: ['b2-third-cond'], recommendConceptId: 'b2-third-cond' }),
  // ── DAY 2: 혼합 가정법 + 주장 어휘 ──
  q({ id: 'b2-q10', day: 2, role: 'practice', type: 'mcq', area: 'vocab', prompt: "'evidence'의 뜻으로 알맞은 것을 고르세요.", options: ['증거, 근거', '관점', '결과', '주장'], answer: '증거, 근거', explanation: "evidence는 '증거, 근거'예요. 셀 수 없는 명사라 an evidence, evidences로 쓰지 않아요.", optionWhy: { '관점': '관점은 perspective예요.', '결과': '결과는 outcome / consequence예요.', '주장': '주장은 claim / argument예요.' }, mistakeType: 'meaning', wordIds: ['b2-w-evidence'], conceptIds: [] }),
  q({ id: 'b2-q11', day: 2, role: 'practice', type: 'mcq', area: 'vocab', prompt: '빈칸에 들어갈 알맞은 말을 고르세요.', sentence: 'I love summer, ___ my sister prefers winter.', options: ['whereas', 'therefore', 'as a result', 'in hindsight'], answer: 'whereas', explanation: "두 대상을 대조할 때 whereas(~인 반면에)를 써요.", optionWhy: { therefore: 'therefore(그러므로)는 원인-결과를 연결해요.', 'as a result': 'as a result(그 결과)도 원인-결과 연결이에요.', 'in hindsight': 'in hindsight(돌이켜 보면)는 대조의 의미가 없어요.' }, mistakeType: 'meaning', wordIds: ['b2-w-whereas'], conceptIds: [] }),
  q({ id: 'b2-q12', day: 2, role: 'practice', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요. (두 단어)', sentence: 'If I had studied medicine, I ___ (be) a doctor now.', answer: 'would be', acceptable: ['could be', 'might be'], explanation: "과거 조건(had studied) + 현재 결과(now) → would + 동사원형. 가능성을 낮추면 could be / might be도 돼요.", hint: 'now가 있어요', mistakeType: 'conditional-form', wordIds: [], conceptIds: ['b2-mixed-cond'], recommendConceptId: 'b2-mixed-cond' }),
  q({ id: 'b2-q13', day: 2, role: 'practice', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: "If she weren't so shy, she ___ at the meeting yesterday.", options: ['would have spoken', 'would speak', 'had spoken', 'speaks'], answer: 'would have spoken', explanation: "지금의 성격(weren't so shy)이 어제의 결과에 영향 → 현재 조건 + 과거 결과: would have + p.p.", optionWhy: { 'would speak': 'yesterday는 과거라서 would + 동사원형은 맞지 않아요.', 'had spoken': '주절에는 would / could 같은 조동사가 필요해요.', speaks: '가정법 주절에 현재시제를 쓰지 않아요.' }, mistakeType: 'conditional-form', wordIds: [], conceptIds: ['b2-mixed-cond'], recommendConceptId: 'b2-mixed-cond' }),
  q({ id: 'b2-q14', day: 2, role: 'practice', type: 'error', area: 'grammar', prompt: '문법적으로 틀린 부분을 고르세요.', tokens: ['If I', 'had saved', 'more money last year,', 'I would have been', 'rich now.'], answer: '3', explanation: "결과가 '지금(now)'이므로 would be를 써야 해요. → I would be rich now.", mistakeType: 'conditional-form', wordIds: [], conceptIds: ['b2-mixed-cond'], recommendConceptId: 'b2-mixed-cond' }),
  q({ id: 'b2-q15', day: 2, role: 'writing', type: 'order', area: 'writing', prompt: "단어를 배열해 '그녀가 그 제안을 받아들였더라면, 지금 런던에 살 텐데.'를 완성하세요.", tokens: ['If she', 'had accepted', 'the offer,', 'she', 'would', 'live', 'in London', 'now.'], answer: 'If she had accepted the offer, she would live in London now.', explanation: '과거 조건 had accepted + 현재 결과 would live … now (혼합 가정법).', mistakeType: 'word-order', wordIds: [], conceptIds: ['b2-mixed-cond'], recommendConceptId: 'b2-mixed-cond' }),
  q({ id: 'b2-q16', day: 2, role: 'writing', type: 'write', area: 'writing', prompt: '다음 문장을 영어로 쓰세요.', sentence: '내가 어젯밤에 잠을 충분히 잤더라면, 지금 피곤하지 않을 텐데.', answer: "If I had slept enough last night, I wouldn't be tired now.", acceptable: ["If I had gotten enough sleep last night, I wouldn't be tired now.", "If I had got enough sleep last night, I wouldn't be tired now.", "If I'd slept enough last night, I wouldn't be tired now.", "I wouldn't be tired now if I had slept enough last night.", "If I had slept enough last night, I wouldn't feel tired now."], hint: 'If + had p.p., would + 동사원형 + now', explanation: "어젯밤(과거) 조건 + 지금 결과 → If I had slept …, I wouldn't be tired now.", mistakeType: 'conditional-form', wordIds: [], conceptIds: ['b2-mixed-cond'], recommendConceptId: 'b2-mixed-cond' }),
  q({ id: 'b2-q17', day: 2, role: 'test', type: 'translate', area: 'reading', prompt: '문장의 뜻으로 알맞은 것을 고르세요.', sentence: "If I hadn't relied on that app, I wouldn't be lost now.", options: ['그 앱에 의존하지 않았더라면, 지금 길을 잃은 상태가 아닐 텐데.', '그 앱에 의존하지 않는다면, 길을 잃지 않을 텐데.', '그 앱에 의존했기 때문에, 길을 잃지 않았다.', '그 앱에 의존하지 않았더라면, 그때 길을 잃지 않았을 텐데.'], answer: '그 앱에 의존하지 않았더라면, 지금 길을 잃은 상태가 아닐 텐데.', explanation: "hadn't relied(과거 조건) + wouldn't be … now(현재 결과): 과거에 그 앱을 믿은 탓에 지금 길을 잃은 상태예요.", optionWhy: { '그 앱에 의존하지 않는다면, 길을 잃지 않을 텐데.': '현재 사실의 반대라면 If I didn’t rely on …예요.', '그 앱에 의존했기 때문에, 길을 잃지 않았다.': '실제로는 길을 잃은 상태예요. 의미가 반대예요.', '그 앱에 의존하지 않았더라면, 그때 길을 잃지 않았을 텐데.': "결과가 '지금(now)'이에요. 과거 결과라면 wouldn't have gotten lost예요." }, mistakeType: 'interpretation', wordIds: ['b2-w-relyon'], conceptIds: ['b2-mixed-cond'], recommendConceptId: 'b2-mixed-cond' }),
  q({ id: 'b2-q18', day: 2, role: 'test', type: 'mcq', area: 'vocab', prompt: '빈칸에 들어갈 가장 알맞은 단어를 고르세요.', sentence: 'Some experts ___ that social media has a significant impact on how we form opinions.', options: ['argue', 'rely', 'prevent', 'hesitate'], answer: 'argue', explanation: "argue that + 문장 = '~라고 주장하다'. 의견문에서 다른 사람의 주장을 소개할 때 써요.", optionWhy: { rely: 'rely는 on과 함께 쓰며, that절을 받지 않아요.', prevent: "prevent(막다)는 that절을 목적어로 쓰지 않아요.", hesitate: 'hesitate는 that절을 받지 않아요.' }, mistakeType: 'meaning', wordIds: ['b2-w-argue', 'b2-w-significant'], conceptIds: [] }),
  // ── 복습용 변형 문항 ──
  q({ id: 'b2-v01', role: 'variant', isVariant: true, variantOf: 'b2-q03', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요.', sentence: 'If they had booked earlier, they would have ___ (get) better seats.', answer: 'gotten', acceptable: ['got'], explanation: 'would have + 과거분사. get의 과거분사는 gotten(미국식) / got(영국식)이에요.', mistakeType: 'form', wordIds: [], conceptIds: ['b2-third-cond'], recommendConceptId: 'b2-third-cond' }),
  q({ id: 'b2-v02', role: 'variant', isVariant: true, variantOf: 'b2-q04', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'We would have won the game if our best player ___ injured.', options: ["hadn't been", "wasn't", "wouldn't be", "hasn't been"], answer: "hadn't been", explanation: '주절이 would have won(과거 결과)이므로 if절은 had + p.p.의 부정형 hadn’t been이에요.', optionWhy: { "wasn't": '과거형은 현재 사실의 반대에 써요.', "wouldn't be": 'if절에는 would를 쓰지 않아요.', "hasn't been": '현재완료는 가정법 형태가 아니에요.' }, mistakeType: 'conditional-form', wordIds: [], conceptIds: ['b2-third-cond'], recommendConceptId: 'b2-third-cond' }),
  q({ id: 'b2-v03', role: 'variant', isVariant: true, variantOf: 'b2-q12', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요. (두 단어)', sentence: 'If he had taken the job in Seoul, he ___ (live) there now.', answer: 'would live', acceptable: ['could live', 'might live'], explanation: '과거 조건 + 현재 결과(now) → would + 동사원형.', mistakeType: 'conditional-form', wordIds: [], conceptIds: ['b2-mixed-cond'], recommendConceptId: 'b2-mixed-cond' }),
  q({ id: 'b2-v04', role: 'variant', isVariant: true, variantOf: 'b2-q13', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'If I spoke French, I ___ the job in Paris last year.', options: ['would have gotten', 'would get', 'had gotten', 'will get'], answer: 'would have gotten', explanation: '현재 사실의 반대(spoke) + 과거 결과(last year) → would have + p.p.', optionWhy: { 'would get': 'last year는 과거라서 would + 동사원형은 맞지 않아요.', 'had gotten': '주절에는 would 같은 조동사가 필요해요.', 'will get': '가정법 주절에 will을 쓰지 않아요.' }, mistakeType: 'conditional-form', wordIds: [], conceptIds: ['b2-mixed-cond'], recommendConceptId: 'b2-mixed-cond' }),
];
