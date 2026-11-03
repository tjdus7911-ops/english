import type { ConceptBase, Question, Unit, Vocabulary } from '../../types';

const U = 'b1-u1';

export const b1Units: Unit[] = [
  {
    id: U,
    level: 'B1',
    order: 1,
    title: '경험과 기간 말하기',
    description: '현재완료로 지금까지의 경험과 계속된 일을 말하고, 과거시제와 구분해요.',
    status: 'ready',
    topics: ['현재완료', '경험과 의견 표현', '복합 문장'],
    days: 2,
  },
  { id: 'b1-u2', level: 'B1', order: 2, title: '누가 했는지보다 무엇이', description: '수동태로 행위의 대상을 중심에 두고 말해요.', status: 'preparing', topics: ['수동태'], days: 2 },
  { id: 'b1-u3', level: 'B1', order: 3, title: '사람과 사물 설명하기', description: 'who, which, that으로 명사를 꾸며요.', status: 'preparing', topics: ['관계대명사'], days: 2 },
  { id: 'b1-u4', level: 'B1', order: 4, title: '만약 ~라면', description: '조건문과 가정법 과거의 기초를 배워요.', status: 'preparing', topics: ['조건문', '가정법 기초'], days: 2 },
  { id: 'b1-u5', level: 'B1', order: 5, title: '그 전에 이미', description: '과거완료로 두 과거 사건의 순서를 정리해요.', status: 'preparing', topics: ['과거완료 기초'], days: 2 },
  { id: 'b1-u6', level: 'B1', order: 6, title: '짧은 문단 쓰기', description: '경험과 의견을 5문장 문단으로 써요.', status: 'preparing', topics: ['짧은 문단 작성', '경험과 의견 표현'], days: 2 },
];

const w = (
  id: string, day: number, word: string, pos: Vocabulary['pos'], ipa: string, koPron: string,
  meaning: string, example: string, exampleKo: string, linkedConceptId?: string, pattern?: string,
): Vocabulary => ({ id, level: 'B1', unitId: U, day, word, pos, ipa, koPron, meaning, example, exampleKo, linkedConceptId, pattern });

export const b1Words: Vocabulary[] = [
  w('b1-w-experience', 1, 'experience', 'n.', '/ɪkˈspɪriəns/', '익스피어리언스', '경험', 'Living abroad was a great experience for me.', '해외에서 산 것은 나에게 큰 경험이었다.', 'b1-pp-experience'),
  w('b1-w-foreign', 1, 'foreign', 'adj.', '/ˈfɔːrən/', '포린', '외국의', 'Have you ever lived in a foreign country?', '외국에서 살아 본 적 있니?', 'b1-pp-experience'),
  w('b1-w-culture', 1, 'culture', 'n.', '/ˈkʌltʃər/', '컬처', '문화', 'Learning about a new culture is exciting.', '새로운 문화를 배우는 것은 신나는 일이다.'),
  w('b1-w-journey', 1, 'journey', 'n.', '/ˈdʒɜːrni/', '저ㄹ니', '여정, (장거리) 이동', 'The journey from Seoul to Busan took three hours.', '서울에서 부산까지 가는 데 3시간이 걸렸다.'),
  w('b1-w-memorable', 1, 'memorable', 'adj.', '/ˈmemərəbl/', '메모러블', '기억에 남는', 'It was the most memorable trip of my life.', '그것은 내 인생에서 가장 기억에 남는 여행이었다.'),
  w('b1-w-attempt', 1, 'attempt', 'n.', '/əˈtempt/', '어템프트', '시도', 'He passed the test on his first attempt.', '그는 첫 시도에 시험에 합격했다.'),
  w('b1-w-achieve', 1, 'achieve', 'v.', '/əˈtʃiːv/', '어치브', '이루다, 달성하다', 'She has achieved all her goals this year.', '그녀는 올해 목표를 모두 이뤘다.', 'b1-pp-experience'),
  w('b1-w-opportunity', 1, 'opportunity', 'n.', '/ˌɑːpərˈtuːnəti/', '아퍼투너티', '기회', "I've never had the opportunity to work abroad.", '나는 해외에서 일할 기회를 가져 본 적이 없다.', 'b1-pp-experience', 'the opportunity to + 동사원형'),
  w('b1-w-nervous', 1, 'nervous', 'adj.', '/ˈnɜːrvəs/', '너ㄹ버스', '긴장한, 불안한', 'I was nervous before the interview.', '나는 면접 전에 긴장했다.'),
  w('b1-w-ever', 1, 'ever', 'adv.', '/ˈevər/', '에버', '(의문문에서) 한 번이라도', 'Have you ever eaten Indian food?', '인도 음식을 먹어 본 적 있니?', 'b1-pp-experience', 'Have you ever + p.p.?'),
  w('b1-w-improve', 2, 'improve', 'v.', '/ɪmˈpruːv/', '임프루브', '향상되다, 개선하다', 'My English has improved a lot since last year.', '내 영어는 작년 이후로 많이 늘었다.', 'b1-pp-vs-past', 'has improved since …'),
  w('b1-w-recently', 2, 'recently', 'adv.', '/ˈriːsntli/', '리슨틀리', '최근에', 'I have recently started a new job.', '나는 최근에 새 일을 시작했다.', 'b1-pp-vs-past'),
  w('b1-w-several', 2, 'several', 'adj.', '/ˈsevrəl/', '세브럴', '몇몇의, 여러', "I've visited Japan several times.", '나는 일본을 여러 번 가 봤다.', 'b1-pp-experience'),
  w('b1-w-apply', 2, 'apply', 'v.', '/əˈplaɪ/', '어플라이', '지원하다, 신청하다', 'She has applied for three jobs this month.', '그녀는 이번 달에 세 곳에 지원했다.', 'b1-pp-vs-past', 'apply for + 명사'),
  w('b1-w-career', 2, 'career', 'n.', '/kəˈrɪr/', '커리어', '경력, 직업 생활', 'He has had a long career in marketing.', '그는 마케팅 분야에서 오랜 경력을 쌓아 왔다.'),
  w('b1-w-colleague', 2, 'colleague', 'n.', '/ˈkɑːliːɡ/', '칼리그', '(직장) 동료', 'My colleagues have helped me a lot.', '동료들이 나를 많이 도와줬다.'),
  w('b1-w-confident', 2, 'confident', 'adj.', '/ˈkɑːnfɪdənt/', '칸피던트', '자신감 있는', 'I feel more confident now.', '나는 이제 더 자신감이 생겼다.'),
  w('b1-w-skill', 2, 'skill', 'n.', '/skɪl/', '스킬', '기술, 능력', 'Communication is an important skill.', '의사소통은 중요한 능력이다.'),
  w('b1-w-manage', 2, 'manage', 'v.', '/ˈmænɪdʒ/', '매니지', '(어떻게든) 해내다; 관리하다', 'I managed to finish the project on time.', '나는 그 프로젝트를 제때 끝내는 데 성공했다.', undefined, 'manage to + 동사원형'),
  w('b1-w-volunteer', 2, 'volunteer', 'v.', '/ˌvɑːlənˈtɪr/', '발런티어', '자원봉사하다', 'I have volunteered at an animal shelter since 2022.', '나는 2022년부터 동물 보호소에서 봉사해 왔다.', 'b1-pp-vs-past', 'have volunteered since …'),
];

export const b1Concepts: ConceptBase[] = [
  {
    id: 'b1-pp-experience',
    level: 'B1',
    unitId: U,
    day: 1,
    category: '시제',
    title: '현재완료 ① 경험 (have + p.p.)',
    summary: "'지금까지 ~해 본 적이 있다/없다'는 have(has) + 과거분사로 말해요.",
    explanation: [
      '현재완료는 과거의 일이 지금과 연결되어 있을 때 써요. 그중 가장 많이 쓰는 뜻이 "지금까지의 경험"이에요.',
      'ever(한 번이라도), never(한 번도 ~않은), before(전에), once / twice / three times(~번) 같은 말과 자주 함께 써요.',
      "have been to + 장소는 '~에 가 본 적이 있다'예요. have gone to는 '가 버려서 지금 여기 없다'는 뜻이라 경험을 말할 때는 been을 써요.",
    ],
    structure: ['주어 + have / has + 과거분사(p.p.)', 'Have / Has + 주어 + ever + p.p.?', '주어 + have / has + never + p.p.'],
    correctExamples: [
      { en: 'I have been to Jeju twice.', ko: '나는 제주에 두 번 가 봤다.' },
      { en: 'Have you ever tried Thai food?', ko: '태국 음식 먹어 본 적 있어?' },
      { en: 'She has never seen snow.', ko: '그녀는 눈을 한 번도 본 적이 없다.' },
    ],
    wrongExamples: [
      { en: 'She has visit Japan three times.', fix: 'She has visited Japan three times.', why: 'has 뒤에는 동사원형이 아니라 과거분사가 와요.' },
      { en: 'Have you ever went to London?', fix: 'Have you ever been to London?', why: 'went는 과거형이에요. 현재완료에는 과거분사 been/gone을 써요.' },
      { en: 'I have never ate sushi.', fix: 'I have never eaten sushi.', why: 'eat의 과거분사는 eaten이에요.' },
    ],
    realLife: [
      { en: "Have you ever been to Busan? You should go!", ko: '부산 가 봤어? 꼭 가 봐!', situation: '여행지 추천할 때' },
      { en: "I've worked with foreign clients before.", ko: '전에 외국 고객과 일해 본 적이 있어요.', situation: '면접에서 경험 말하기' },
    ],
    linkedWordIds: ['b1-w-experience', 'b1-w-foreign', 'b1-w-ever', 'b1-w-achieve', 'b1-w-opportunity', 'b1-w-several'],
  },
  {
    id: 'b1-pp-vs-past',
    level: 'B1',
    unitId: U,
    day: 2,
    category: '시제',
    title: '현재완료 ② 계속 & 과거시제와 구분',
    summary: "for / since와 함께 '지금까지 계속'을 말하고, 끝난 과거 시점에는 과거시제를 써요.",
    explanation: [
      "현재완료는 과거에 시작한 일이 지금도 이어질 때도 써요. for + 기간(for three years), since + 시작 시점(since 2019)과 함께 써요.",
      'yesterday, last week, two days ago, in 2020처럼 이미 끝난 과거의 특정 시점이 있으면 현재완료를 쓸 수 없고 과거시제를 써야 해요.',
      "When으로 시점을 묻는 질문도 과거시제를 써요. When did you move? (O) / When have you moved? (X)",
    ],
    structure: ['주어 + have / has + p.p. + for + 기간', '주어 + have / has + p.p. + since + 시작 시점', '과거시제 + yesterday / ago / last … / in + 연도'],
    correctExamples: [
      { en: 'I have lived here since 2019.', ko: '나는 2019년부터 여기 살고 있다.' },
      { en: 'She has worked here for three years.', ko: '그녀는 3년 동안 여기서 일해 왔다.' },
      { en: 'We met our new colleague last Monday.', ko: '우리는 지난 월요일에 새 동료를 만났다.' },
    ],
    wrongExamples: [
      { en: 'We have met him last Monday.', fix: 'We met him last Monday.', why: 'last Monday라는 끝난 과거 시점이 있으니 과거시제를 써요.' },
      { en: 'I have lived here since three years.', fix: 'I have lived here for three years.', why: '기간(three years)에는 for, 시작 시점에는 since를 써요.' },
      { en: 'When have you moved to Canada?', fix: 'When did you move to Canada?', why: 'When은 특정 시점을 묻기 때문에 과거시제를 써요.' },
    ],
    realLife: [
      { en: "I've worked in marketing for five years.", ko: '마케팅 분야에서 5년째 일하고 있어요.', situation: '경력 소개' },
      { en: "My English has improved since I started this app.", ko: '이 앱을 시작한 뒤로 영어가 늘었어요.', situation: '성장 이야기' },
    ],
    linkedWordIds: ['b1-w-improve', 'b1-w-recently', 'b1-w-apply', 'b1-w-volunteer', 'b1-w-colleague', 'b1-w-career'],
  },
];

type QIn = Omit<Question, 'level' | 'unitId'>;
const q = (x: QIn): Question => ({ level: 'B1', unitId: U, ...x });

export const b1Questions: Question[] = [
  // ── DAY 1: 현재완료 경험 ──
  q({ id: 'b1-q01', day: 1, role: 'practice', type: 'mcq', area: 'vocab', prompt: "'opportunity'의 뜻으로 알맞은 것을 고르세요.", options: ['기회', '경험', '여정', '문화'], answer: '기회', explanation: "opportunity는 '기회'예요. the opportunity to + 동사원형 = ~할 기회.", optionWhy: { '경험': '경험은 experience예요.', '여정': '여정은 journey예요.', '문화': '문화는 culture예요.' }, mistakeType: 'meaning', wordIds: ['b1-w-opportunity'], conceptIds: [] }),
  q({ id: 'b1-q02', day: 1, role: 'practice', type: 'mcq', area: 'vocab', prompt: '빈칸에 들어갈 알맞은 단어를 고르세요.', sentence: 'I was so ___ before my first presentation that my hands were shaking.', options: ['nervous', 'confident', 'memorable', 'foreign'], answer: 'nervous', explanation: "손이 떨릴 정도였다는 문맥 → nervous(긴장한)가 알맞아요.", optionWhy: { confident: 'confident(자신감 있는)는 손이 떨렸다는 내용과 반대예요.', memorable: 'memorable(기억에 남는)은 사람의 감정 상태를 나타내지 않아요.', foreign: 'foreign(외국의)은 문맥과 관계없어요.' }, mistakeType: 'meaning', wordIds: ['b1-w-nervous'], conceptIds: [] }),
  q({ id: 'b1-q03', day: 1, role: 'practice', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요.', sentence: 'Have you ever ___ (be) to London?', answer: 'been', explanation: "'~에 가 본 적 있다'는 have been to예요. be의 과거분사는 been이에요.", hint: 'be의 과거분사', mistakeType: 'form', wordIds: ['b1-w-ever'], conceptIds: ['b1-pp-experience'], recommendConceptId: 'b1-pp-experience' }),
  q({ id: 'b1-q04', day: 1, role: 'practice', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: "I ___ sushi before, so I'd like to try it today.", options: ['have never eaten', 'have never ate', 'never have eaten', 'has never eaten'], answer: 'have never eaten', explanation: '경험이 없음 → have never + 과거분사. eat의 과거분사는 eaten이에요.', optionWhy: { 'have never ate': 'ate는 과거형이에요. 과거분사 eaten을 써야 해요.', 'never have eaten': 'never는 have와 과거분사 사이에 와요.', 'has never eaten': '주어 I에는 has가 아니라 have를 써요.' }, mistakeType: 'form', wordIds: [], conceptIds: ['b1-pp-experience'], recommendConceptId: 'b1-pp-experience' }),
  q({ id: 'b1-q05', day: 1, role: 'practice', type: 'error', area: 'grammar', prompt: '문법적으로 틀린 부분을 고르세요.', tokens: ['She', 'has', 'visit', 'Japan', 'three times.'], answer: '2', explanation: 'has 뒤에는 과거분사가 와요. → She has visited Japan three times.', mistakeType: 'form', wordIds: [], conceptIds: ['b1-pp-experience'], recommendConceptId: 'b1-pp-experience' }),
  q({ id: 'b1-q06', day: 1, role: 'writing', type: 'order', area: 'writing', prompt: "단어를 배열해 '너는 외국에서 살아 본 적이 있니?'를 완성하세요.", tokens: ['Have', 'you', 'ever', 'lived', 'in', 'a foreign country?'], answer: 'Have you ever lived in a foreign country?', explanation: '경험을 묻는 현재완료 의문문: Have + 주어 + ever + p.p.?', mistakeType: 'word-order', wordIds: ['b1-w-ever', 'b1-w-foreign'], conceptIds: ['b1-pp-experience'], recommendConceptId: 'b1-pp-experience' }),
  q({ id: 'b1-q07', day: 1, role: 'writing', type: 'write', area: 'writing', prompt: '다음 문장을 영어로 쓰세요.', sentence: '나는 해외에서 일할 기회를 가져 본 적이 없다.', answer: 'I have never had the opportunity to work abroad.', acceptable: ['I have never had an opportunity to work abroad.', 'I have never had a chance to work abroad.', 'I have never had the chance to work abroad.', 'I have not had the opportunity to work abroad.'], hint: 'have never had the opportunity to …', explanation: "경험이 없음 → have never + p.p. have의 과거분사는 had예요. '~할 기회' = the opportunity to + 동사원형.", mistakeType: 'form', wordIds: ['b1-w-opportunity'], conceptIds: ['b1-pp-experience'], recommendConceptId: 'b1-pp-experience' }),
  q({ id: 'b1-q08', day: 1, role: 'test', type: 'translate', area: 'reading', prompt: '문장의 뜻으로 알맞은 것을 고르세요.', sentence: 'I have been to Jeju twice.', options: ['나는 제주에 두 번 가 본 적이 있다.', '나는 제주에 두 번째로 가는 중이다.', '나는 제주에 두 번 가야 한다.', '나는 제주에서 2년 동안 살았다.'], answer: '나는 제주에 두 번 가 본 적이 있다.', explanation: "have been to + 장소 + twice = '~에 두 번 가 본 적이 있다'.", optionWhy: { '나는 제주에 두 번째로 가는 중이다.': '진행 중이라면 I am going …이에요.', '나는 제주에 두 번 가야 한다.': "'~해야 한다'는 have to + 동사원형이에요.", '나는 제주에서 2년 동안 살았다.': "twice는 '두 번'이고 기간이 아니에요." }, mistakeType: 'interpretation', wordIds: [], conceptIds: ['b1-pp-experience'], recommendConceptId: 'b1-pp-experience' }),
  q({ id: 'b1-q09', day: 1, role: 'test', type: 'mcq', area: 'grammar', prompt: '대화의 빈칸에 가장 알맞은 대답을 고르세요.', sentence: 'A: Have you ever tried skiing?  B: ___', options: ['Yes, I have. I tried it last winter.', 'Yes, I did. I have tried it last winter.', 'Yes, I have tried it last winter.', 'Yes, I am. I tried it last winter.'], answer: 'Yes, I have. I tried it last winter.', explanation: 'Have you …?에는 Yes, I have.로 답하고, last winter처럼 구체적 과거 시점은 과거시제로 말해요.', optionWhy: { 'Yes, I did. I have tried it last winter.': 'Have로 물었으니 did가 아니라 have로 답하고, last winter와 현재완료는 함께 못 써요.', 'Yes, I have tried it last winter.': 'last winter(끝난 과거 시점)는 현재완료와 함께 쓸 수 없어요.', 'Yes, I am. I tried it last winter.': 'Have로 물었으니 be동사로 답하지 않아요.' }, mistakeType: 'time-marker', wordIds: [], conceptIds: ['b1-pp-experience', 'b1-pp-vs-past'], recommendConceptId: 'b1-pp-vs-past' }),
  // ── DAY 2: 계속 & 과거와 구분 ──
  q({ id: 'b1-q10', day: 2, role: 'practice', type: 'mcq', area: 'vocab', prompt: "'colleague'의 뜻으로 알맞은 것을 고르세요.", options: ['(직장) 동료', '경력', '기술', '대학'], answer: '(직장) 동료', explanation: "colleague는 같은 직장에서 일하는 '동료'예요.", optionWhy: { '경력': '경력은 career예요.', '기술': '기술·능력은 skill이에요.', '대학': "college(대학)와 철자가 비슷해서 헷갈리기 쉬워요. 대학은 college예요." }, mistakeType: 'meaning', wordIds: ['b1-w-colleague'], conceptIds: [] }),
  q({ id: 'b1-q11', day: 2, role: 'practice', type: 'mcq', area: 'vocab', prompt: '빈칸에 들어갈 알맞은 단어를 고르세요.', sentence: 'She has ___ for a job at a bank.', options: ['applied', 'managed', 'improved', 'achieved'], answer: 'applied', explanation: "apply for + 일자리 = '~에 지원하다'.", optionWhy: { managed: "manage는 '해내다·관리하다'로, for a job과 어울리지 않아요.", improved: "improve는 '향상되다'예요.", achieved: "achieve는 '달성하다'이고 for와 함께 쓰지 않아요." }, mistakeType: 'meaning', wordIds: ['b1-w-apply'], conceptIds: [] }),
  q({ id: 'b1-q12', day: 2, role: 'practice', type: 'blank', area: 'grammar', prompt: '빈칸에 for 또는 since를 쓰세요.', sentence: 'I have lived in this city ___ 2019.', answer: 'since', explanation: '2019는 시작 시점이므로 since를 써요. 기간(3 years)이면 for예요.', hint: '시작 시점 vs 기간', mistakeType: 'time-marker', wordIds: [], conceptIds: ['b1-pp-vs-past'], recommendConceptId: 'b1-pp-vs-past' }),
  q({ id: 'b1-q13', day: 2, role: 'practice', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'I ___ my wallet yesterday, but I found it this morning.', options: ['lost', 'have lost', 'have been lost', 'am losing'], answer: 'lost', explanation: 'yesterday라는 끝난 과거 시점이 있으니 과거시제 lost를 써요.', optionWhy: { 'have lost': '현재완료는 yesterday 같은 과거 시점과 함께 쓸 수 없어요.', 'have been lost': '수동태라 의미가 맞지 않아요.', 'am losing': '진행형은 어제 일어난 일에 쓰지 않아요.' }, mistakeType: 'time-marker', wordIds: [], conceptIds: ['b1-pp-vs-past'], recommendConceptId: 'b1-pp-vs-past' }),
  q({ id: 'b1-q14', day: 2, role: 'practice', type: 'error', area: 'grammar', prompt: '문법적으로 틀린 부분을 고르세요.', tokens: ['We', 'have met', 'our new colleague', 'last Monday.'], answer: '1', explanation: 'last Monday는 끝난 과거 시점이라 과거시제 met을 써요. → We met our new colleague last Monday.', mistakeType: 'time-marker', wordIds: ['b1-w-colleague'], conceptIds: ['b1-pp-vs-past'], recommendConceptId: 'b1-pp-vs-past' }),
  q({ id: 'b1-q15', day: 2, role: 'writing', type: 'order', area: 'writing', prompt: "단어를 배열해 '내 영어는 작년 이후로 많이 늘었다.'를 완성하세요.", tokens: ['My English', 'has', 'improved', 'a lot', 'since', 'last year.'], answer: 'My English has improved a lot since last year.', explanation: 'since + 시작 시점 → 현재완료 has improved.', mistakeType: 'word-order', wordIds: ['b1-w-improve'], conceptIds: ['b1-pp-vs-past'], recommendConceptId: 'b1-pp-vs-past' }),
  q({ id: 'b1-q16', day: 2, role: 'writing', type: 'write', area: 'writing', prompt: '다음 문장을 영어로 쓰세요.', sentence: '그녀는 3년 동안 이 회사에서 일해 왔다.', answer: 'She has worked at this company for three years.', acceptable: ['She has worked for this company for three years.', 'She has been working at this company for three years.', 'She has been working for this company for three years.', 'She has worked in this company for three years.'], hint: 'has + p.p. + for …', explanation: "지금까지 계속된 일 → has worked, 기간 → for three years. 진행 중임을 강조하면 has been working도 돼요.", mistakeType: 'tense', wordIds: [], conceptIds: ['b1-pp-vs-past'], recommendConceptId: 'b1-pp-vs-past' }),
  q({ id: 'b1-q17', day: 2, role: 'test', type: 'translate', area: 'reading', prompt: '문장의 뜻으로 알맞은 것을 고르세요.', sentence: 'He has worked here since he graduated.', options: ['그는 졸업한 이후로 여기서 일해 왔다.', '그는 졸업하기 전에 여기서 일했다.', '그는 졸업하자마자 여기서 일을 그만두었다.', '그는 졸업할 때까지 여기서 일할 것이다.'], answer: '그는 졸업한 이후로 여기서 일해 왔다.', explanation: "has worked + since + 시작 시점 = '그때 이후로 지금까지 계속 일해 왔다'.", optionWhy: { '그는 졸업하기 전에 여기서 일했다.': "since는 '~이후로'예요. '~전에'는 before예요.", '그는 졸업하자마자 여기서 일을 그만두었다.': '그만두었다(quit)는 의미가 없어요.', '그는 졸업할 때까지 여기서 일할 것이다.': '미래가 아니라 지금까지의 계속이에요.' }, mistakeType: 'interpretation', wordIds: [], conceptIds: ['b1-pp-vs-past'], recommendConceptId: 'b1-pp-vs-past' }),
  q({ id: 'b1-q18', day: 2, role: 'test', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'When ___ to Canada?', options: ['did you move', 'have you moved', 'have you move', 'you moved'], answer: 'did you move', explanation: 'When은 특정한 과거 시점을 묻기 때문에 현재완료가 아니라 과거시제를 써요.', optionWhy: { 'have you moved': 'When과 현재완료는 함께 쓰지 않아요.', 'have you move': '현재완료는 have + 과거분사이고, When과도 맞지 않아요.', 'you moved': '의문문은 조동사 did가 주어 앞에 와야 해요.' }, mistakeType: 'time-marker', wordIds: [], conceptIds: ['b1-pp-vs-past'], recommendConceptId: 'b1-pp-vs-past' }),
  // ── 복습용 변형 문항 ──
  q({ id: 'b1-v01', role: 'variant', isVariant: true, variantOf: 'b1-q03', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요.', sentence: 'My parents have never ___ (see) the ocean.', answer: 'seen', explanation: 'have never + 과거분사. see의 과거분사는 seen이에요.', mistakeType: 'form', wordIds: [], conceptIds: ['b1-pp-experience'], recommendConceptId: 'b1-pp-experience' }),
  q({ id: 'b1-v02', role: 'variant', isVariant: true, variantOf: 'b1-q04', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'How many times ___ to Busan?', options: ['have you been', 'did you been', 'have you went', 'are you been'], answer: 'have you been', explanation: '경험 횟수를 묻는 현재완료: How many times have you been to …?', optionWhy: { 'did you been': 'did 뒤에는 동사원형이 와요.', 'have you went': 'went는 과거형이에요. 과거분사는 been/gone이에요.', 'are you been': 'be동사와 been을 함께 쓰지 않아요.' }, mistakeType: 'form', wordIds: [], conceptIds: ['b1-pp-experience'], recommendConceptId: 'b1-pp-experience' }),
  q({ id: 'b1-v03', role: 'variant', isVariant: true, variantOf: 'b1-q12', type: 'blank', area: 'grammar', prompt: '빈칸에 for 또는 since를 쓰세요.', sentence: 'She has studied Chinese ___ five years.', answer: 'for', explanation: 'five years는 기간이므로 for를 써요.', mistakeType: 'time-marker', wordIds: [], conceptIds: ['b1-pp-vs-past'], recommendConceptId: 'b1-pp-vs-past' }),
  q({ id: 'b1-v04', role: 'variant', isVariant: true, variantOf: 'b1-q13', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'I ___ him two days ago.', options: ['saw', 'have seen', 'have saw', 'had see'], answer: 'saw', explanation: '~ ago는 끝난 과거 시점이므로 과거시제 saw를 써요.', optionWhy: { 'have seen': 'ago와 현재완료는 함께 쓸 수 없어요.', 'have saw': 'have 뒤에는 과거분사 seen이 오며, ago와도 맞지 않아요.', 'had see': 'had 뒤에는 과거분사가 와야 해요.' }, mistakeType: 'time-marker', wordIds: [], conceptIds: ['b1-pp-vs-past'], recommendConceptId: 'b1-pp-vs-past' }),
];
