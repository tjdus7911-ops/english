import type { ConceptBase, Question, Unit, Vocabulary } from '../../types';

const U = 'a1-u1';

export const a1Units: Unit[] = [
  {
    id: U,
    level: 'A1',
    order: 1,
    title: '나와 나의 하루',
    description: 'be동사로 나를 소개하고, 일반동사 현재시제로 하루 일과를 말해요.',
    status: 'ready',
    topics: ['인칭대명사', 'be동사', '일반동사', '현재시제', '부정문', '의문문'],
    days: 2,
  },
  { id: 'a1-u2', level: 'A1', order: 2, title: '물건과 사람 말하기', description: '관사 a/an/the와 셀 수 있는 명사, 복수형을 배워요.', status: 'preparing', topics: ['관사와 명사', '복수형', 'this/that'], days: 2 },
  { id: 'a1-u3', level: 'A1', order: 3, title: '어디에, 언제', description: 'in, on, at 등 기초 전치사로 장소와 시간을 말해요.', status: 'preparing', topics: ['기초 전치사', '시간 표현'], days: 2 },
  { id: 'a1-u4', level: 'A1', order: 4, title: '할 수 있는 일', description: 'can으로 능력과 요청을 표현해요.', status: 'preparing', topics: ['can', '부정문', '의문문'], days: 2 },
  { id: 'a1-u5', level: 'A1', order: 5, title: '자기소개 완성', description: '배운 표현을 묶어 3~4문장 자기소개를 써요.', status: 'preparing', topics: ['자기소개와 일상 문장', '짧은 영작'], days: 2 },
];

const w = (
  id: string, day: number, word: string, pos: Vocabulary['pos'], ipa: string, koPron: string,
  meaning: string, example: string, exampleKo: string, linkedConceptId?: string, pattern?: string,
): Vocabulary => ({ id, level: 'A1', unitId: U, day, word, pos, ipa, koPron, meaning, example, exampleKo, linkedConceptId, pattern });

export const a1Words: Vocabulary[] = [
  w('a1-w-student', 1, 'student', 'n.', '/ˈstuːdənt/', '스튜던트', '학생', 'I am a student at Hanguk University.', '나는 한국대학교 학생이다.', 'a1-be', 'I am a + 명사'),
  w('a1-w-teacher', 1, 'teacher', 'n.', '/ˈtiːtʃər/', '티처', '선생님, 교사', 'My mother is an English teacher.', '우리 엄마는 영어 선생님이다.', 'a1-be'),
  w('a1-w-friend', 1, 'friend', 'n.', '/frend/', '프렌드', '친구', 'Jisu and I are good friends.', '지수와 나는 좋은 친구다.', 'a1-be', 'A and I are + 복수 명사'),
  w('a1-w-family', 1, 'family', 'n.', '/ˈfæməli/', '패멀리', '가족', 'My family is in Busan.', '우리 가족은 부산에 있다.', 'a1-be'),
  w('a1-w-happy', 1, 'happy', 'adj.', '/ˈhæpi/', '해피', '행복한, 기쁜', 'We are happy today.', '우리는 오늘 행복하다.', 'a1-be', 'be동사 + 형용사'),
  w('a1-w-tired', 1, 'tired', 'adj.', '/ˈtaɪərd/', '타이어드', '피곤한', "I'm tired after work.", '나는 퇴근 후에 피곤하다.', 'a1-be', 'be동사 + 형용사'),
  w('a1-w-busy', 1, 'busy', 'adj.', '/ˈbɪzi/', '비지', '바쁜', 'Are you busy now?', '너 지금 바쁘니?', 'a1-be'),
  w('a1-w-hungry', 1, 'hungry', 'adj.', '/ˈhʌŋɡri/', '헝그리', '배고픈', "The children are hungry.", '아이들이 배고프다.', 'a1-be'),
  w('a1-w-kind', 1, 'kind', 'adj.', '/kaɪnd/', '카인드', '친절한', 'Your sister is very kind.', '너의 여동생은 정말 친절하다.', 'a1-be'),
  w('a1-w-city', 1, 'city', 'n.', '/ˈsɪti/', '시티', '도시', 'Seoul is a big city.', '서울은 큰 도시다.', 'a1-be'),
  w('a1-w-getup', 2, 'get up', 'phr.', '/ɡet ʌp/', '겟 업', '(잠자리에서) 일어나다', 'I usually get up at seven.', '나는 보통 7시에 일어난다.', 'a1-present', 'get up at + 시각'),
  w('a1-w-eat', 2, 'eat', 'v.', '/iːt/', '잇', '먹다', "She doesn't eat breakfast.", '그녀는 아침을 먹지 않는다.', 'a1-present'),
  w('a1-w-drink', 2, 'drink', 'v.', '/drɪŋk/', '드링크', '마시다', 'He drinks coffee every morning.', '그는 매일 아침 커피를 마신다.', 'a1-present', 'He/She + 동사-s'),
  w('a1-w-work', 2, 'work', 'v.', '/wɜːrk/', '워ㄹ크', '일하다', 'My father works in a bank.', '우리 아빠는 은행에서 일한다.', 'a1-present', 'work in/at + 장소'),
  w('a1-w-study', 2, 'study', 'v.', '/ˈstʌdi/', '스터디', '공부하다', 'She studies English every day.', '그녀는 매일 영어를 공부한다.', 'a1-present', 'study → studies'),
  w('a1-w-live', 2, 'live', 'v.', '/lɪv/', '리브', '살다', 'Do you live in Seoul?', '너는 서울에 사니?', 'a1-present', 'live in + 장소'),
  w('a1-w-like', 2, 'like', 'v.', '/laɪk/', '라이크', '좋아하다', "He doesn't like spicy food.", '그는 매운 음식을 좋아하지 않는다.', 'a1-present', "doesn't + 동사원형"),
  w('a1-w-watch', 2, 'watch', 'v.', '/wɑːtʃ/', '와치', '(TV·영상 등을) 보다', 'We watch movies on Fridays.', '우리는 금요일마다 영화를 본다.', 'a1-present', 'watch → watches'),
  w('a1-w-walk', 2, 'walk', 'v.', '/wɔːk/', '워크', '걷다, 걸어가다', 'I walk to school.', '나는 학교에 걸어간다.', 'a1-present', 'walk to + 장소'),
  w('a1-w-usually', 2, 'usually', 'adv.', '/ˈjuːʒuəli/', '유주얼리', '보통, 대개', 'We usually eat dinner at home.', '우리는 보통 집에서 저녁을 먹는다.', 'a1-present', '주어 + usually + 일반동사'),
];

export const a1Concepts: ConceptBase[] = [
  {
    id: 'a1-be',
    level: 'A1',
    unitId: U,
    day: 1,
    category: 'be동사·문장 구조',
    title: 'be동사 (am / are / is)',
    summary: "'~이다', '~한 상태다', '~에 있다'를 말할 때 주어에 맞춰 am, are, is를 골라 써요.",
    explanation: [
      'be동사는 주어가 누구인지(직업·관계), 어떤 상태인지(기분·성격), 어디에 있는지를 말할 때 쓰는 동사예요.',
      '주어가 I이면 am, you이거나 두 명 이상(we, they, Tom and I)이면 are, 한 사람·한 개(he, she, it, my mom)이면 is를 써요.',
      '부정문은 be동사 바로 뒤에 not을 붙이고, 의문문은 be동사를 주어 앞으로 보내면 돼요. 일반동사처럼 do를 쓰지 않아요.',
    ],
    structure: ['주어 + am / are / is + 명사·형용사·장소', '부정: 주어 + be동사 + not + …', '의문: Am / Are / Is + 주어 + …?'],
    correctExamples: [
      { en: 'I am a student.', ko: '나는 학생이다.' },
      { en: 'They are busy today.', ko: '그들은 오늘 바쁘다.' },
      { en: 'Is she your friend?', ko: '그녀는 네 친구니?' },
      { en: "My family isn't in Seoul.", ko: '우리 가족은 서울에 있지 않다.' },
    ],
    wrongExamples: [
      { en: 'She are happy.', fix: 'She is happy.', why: 'She는 한 사람(3인칭 단수)이므로 is를 써요.' },
      { en: 'I is tired.', fix: 'I am tired.', why: 'I 뒤에는 항상 am을 써요.' },
      { en: 'He not busy.', fix: 'He is not busy.', why: 'not만으로는 동사가 될 수 없어요. be동사가 꼭 있어야 해요.' },
    ],
    realLife: [
      { en: "Hi, I'm Minji. I'm from Daegu.", ko: '안녕하세요, 저는 민지예요. 대구 출신이에요.', situation: '처음 만난 사람에게 자기소개' },
      { en: 'Are you busy now?', ko: '지금 바빠?', situation: '친구에게 연락할 때' },
    ],
    linkedWordIds: ['a1-w-student', 'a1-w-friend', 'a1-w-happy', 'a1-w-tired', 'a1-w-busy', 'a1-w-hungry', 'a1-w-kind'],
  },
  {
    id: 'a1-present',
    level: 'A1',
    unitId: U,
    day: 2,
    category: '시제',
    title: '일반동사 현재시제 (-s / don’t / doesn’t)',
    summary: '습관과 사실은 현재시제로 말하고, 주어가 3인칭 단수면 동사에 -s를 붙여요.',
    explanation: [
      '매일 하는 일이나 늘 그런 사실은 현재시제로 말해요. I, you, we, they가 주어면 동사원형 그대로 써요: I work, they live.',
      '주어가 he, she, it 또는 한 사람·한 개(Tom, my mom)면 동사에 -s를 붙여요. -s, -sh, -ch, -x, -o로 끝나면 -es (watches, goes), 자음+y로 끝나면 y를 i로 바꾸고 -es (study → studies)를 붙여요.',
      "부정문은 don't / doesn't + 동사원형, 의문문은 Do / Does + 주어 + 동사원형으로 만들어요. doesn't나 Does가 이미 -s 역할을 하니까 뒤의 동사는 원형으로 돌아가요.",
    ],
    structure: ['I / You / We / They + 동사원형', 'He / She / It + 동사-s(es)', "부정: don't / doesn't + 동사원형", '의문: Do / Does + 주어 + 동사원형?'],
    correctExamples: [
      { en: 'She drinks coffee every morning.', ko: '그녀는 매일 아침 커피를 마신다.' },
      { en: "We don't live in Seoul.", ko: '우리는 서울에 살지 않는다.' },
      { en: 'Does he walk to school?', ko: '그는 학교에 걸어가니?' },
    ],
    wrongExamples: [
      { en: 'He like pizza.', fix: 'He likes pizza.', why: 'He는 3인칭 단수라 동사에 -s를 붙여요.' },
      { en: "She doesn't likes milk.", fix: "She doesn't like milk.", why: "doesn't 뒤에는 동사원형을 써요." },
      { en: 'Do she work here?', fix: 'Does she work here?', why: '주어가 she이므로 Do가 아니라 Does로 물어요.' },
    ],
    realLife: [
      { en: 'I usually get up at seven.', ko: '저는 보통 7시에 일어나요.', situation: '하루 일과 말하기' },
      { en: 'What do you do?', ko: '무슨 일을 하세요?', situation: '상대의 직업을 물을 때' },
    ],
    linkedWordIds: ['a1-w-getup', 'a1-w-drink', 'a1-w-work', 'a1-w-study', 'a1-w-live', 'a1-w-like', 'a1-w-watch', 'a1-w-usually'],
  },
];

type QIn = Omit<Question, 'level' | 'unitId'>;
const q = (x: QIn): Question => ({ level: 'A1', unitId: U, ...x });

export const a1Questions: Question[] = [
  // ── DAY 1: be동사 ──
  q({ id: 'a1-q01', day: 1, role: 'practice', type: 'mcq', area: 'vocab', prompt: "'tired'의 뜻으로 알맞은 것을 고르세요.", options: ['피곤한', '배고픈', '바쁜', '행복한'], answer: '피곤한', explanation: "tired는 '피곤한'이라는 뜻이에요. I'm tired. = 나는 피곤해.", optionWhy: { '배고픈': '배고픈은 hungry예요.', '바쁜': '바쁜은 busy예요.', '행복한': '행복한은 happy예요.' }, mistakeType: 'meaning', wordIds: ['a1-w-tired'], conceptIds: [] }),
  q({ id: 'a1-q02', day: 1, role: 'practice', type: 'mcq', area: 'vocab', prompt: '빈칸에 들어갈 알맞은 단어를 고르세요.', sentence: "I want to eat something. I'm ___.", options: ['hungry', 'busy', 'kind', 'tired'], answer: 'hungry', explanation: "'무언가 먹고 싶다'는 앞 문장과 어울리는 상태는 hungry(배고픈)예요.", optionWhy: { busy: 'busy(바쁜)는 먹고 싶다는 문맥과 연결되지 않아요.', kind: 'kind(친절한)는 성격을 나타내요.', tired: 'tired(피곤한)는 먹고 싶은 이유로 어색해요.' }, mistakeType: 'meaning', wordIds: ['a1-w-hungry'], conceptIds: [] }),
  q({ id: 'a1-q03', day: 1, role: 'practice', type: 'blank', area: 'grammar', prompt: '빈칸에 알맞은 be동사를 쓰세요.', sentence: 'My sister ___ a teacher.', answer: 'is', explanation: 'My sister는 한 사람(3인칭 단수)이므로 is를 써요.', hint: 'am / are / is 중 하나', mistakeType: 'agreement', wordIds: ['a1-w-teacher'], conceptIds: ['a1-be'], recommendConceptId: 'a1-be' }),
  q({ id: 'a1-q04', day: 1, role: 'practice', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'You and I ___ good friends.', options: ['are', 'am', 'is', 'be'], answer: 'are', explanation: "'You and I'는 두 사람(복수)이므로 are를 써요.", optionWhy: { am: 'am은 주어가 I 하나일 때만 써요.', is: 'is는 한 사람·한 개가 주어일 때 써요.', be: 'be는 원형이라 주어 바로 뒤에 그대로 쓸 수 없어요.' }, mistakeType: 'agreement', wordIds: ['a1-w-friend'], conceptIds: ['a1-be'], recommendConceptId: 'a1-be' }),
  q({ id: 'a1-q05', day: 1, role: 'practice', type: 'error', area: 'grammar', prompt: '문법적으로 틀린 부분을 고르세요.', tokens: ['They', 'is', 'from', 'Busan.'], answer: '1', explanation: 'They는 복수이므로 is가 아니라 are를 써야 해요. → They are from Busan.', mistakeType: 'agreement', wordIds: [], conceptIds: ['a1-be'], recommendConceptId: 'a1-be' }),
  q({ id: 'a1-q06', day: 1, role: 'writing', type: 'order', area: 'writing', prompt: "단어를 배열해 '우리는 오늘 바쁘지 않다.'를 완성하세요.", tokens: ['We', 'are', 'not', 'busy', 'today.'], answer: 'We are not busy today.', explanation: 'be동사 부정문은 be동사 뒤에 not을 붙여요: We are not busy.', mistakeType: 'word-order', wordIds: ['a1-w-busy'], conceptIds: ['a1-be'], recommendConceptId: 'a1-be' }),
  q({ id: 'a1-q07', day: 1, role: 'writing', type: 'write', area: 'writing', prompt: '다음 문장을 영어로 쓰세요.', sentence: '나는 학생이다.', answer: 'I am a student.', acceptable: ["I'm a student."], hint: 'student 앞에 a를 붙여요.', explanation: "I 뒤에는 am, 직업·신분 명사 앞에는 a를 써요. I'm a student.도 정답이에요.", mistakeType: 'form', wordIds: ['a1-w-student'], conceptIds: ['a1-be'], recommendConceptId: 'a1-be' }),
  q({ id: 'a1-q08', day: 1, role: 'test', type: 'translate', area: 'reading', prompt: '문장의 뜻으로 알맞은 것을 고르세요.', sentence: 'Is your family in Seoul?', options: ['너의 가족은 서울에 있니?', '너의 가족은 서울에 있다.', '너의 가족은 서울을 좋아하니?', '너의 가족은 서울에 있었니?'], answer: '너의 가족은 서울에 있니?', explanation: 'Is로 시작하므로 의문문이고, be동사 + 장소는 "~에 있다"는 뜻이에요.', optionWhy: { '너의 가족은 서울에 있다.': 'Is가 주어 앞에 있으면 평서문이 아니라 의문문이에요.', '너의 가족은 서울을 좋아하니?': "'좋아하다'는 like가 있어야 해요.", '너의 가족은 서울에 있었니?': '과거라면 Was를 써요. Is는 현재예요.' }, mistakeType: 'interpretation', wordIds: ['a1-w-family'], conceptIds: ['a1-be'], recommendConceptId: 'a1-be' }),
  q({ id: 'a1-q09', day: 1, role: 'test', type: 'mcq', area: 'grammar', prompt: '문법적으로 올바른 문장을 고르세요.', options: ['He is kind.', 'He are kind.', 'He am kind.', 'He kind.'], answer: 'He is kind.', explanation: 'He는 3인칭 단수 → is. 형용사 kind 앞에 be동사가 꼭 필요해요.', optionWhy: { 'He are kind.': 'are는 you나 복수 주어에 써요.', 'He am kind.': 'am은 I에만 써요.', 'He kind.': '형용사만으로는 문장이 안 돼요. be동사가 필요해요.' }, mistakeType: 'agreement', wordIds: ['a1-w-kind'], conceptIds: ['a1-be'], recommendConceptId: 'a1-be' }),
  // ── DAY 2: 일반동사 현재시제 ──
  q({ id: 'a1-q10', day: 2, role: 'practice', type: 'mcq', area: 'vocab', prompt: "'live'의 뜻으로 알맞은 것을 고르세요.", options: ['살다', '떠나다', '사랑하다', '좋아하다'], answer: '살다', explanation: "live는 '살다'예요. 발음이 비슷한 leave(떠나다)와 헷갈리지 마세요.", optionWhy: { '떠나다': '떠나다는 leave /liːv/예요. live는 짧은 /ɪ/ 소리예요.', '사랑하다': '사랑하다는 love예요.', '좋아하다': '좋아하다는 like예요.' }, mistakeType: 'meaning', wordIds: ['a1-w-live'], conceptIds: [] }),
  q({ id: 'a1-q11', day: 2, role: 'practice', type: 'mcq', area: 'vocab', prompt: "'아침에 잠자리에서 일어나다'에 해당하는 표현을 고르세요.", options: ['get up', 'walk', 'watch', 'drink'], answer: 'get up', explanation: 'get up은 잠자리에서 일어나는 것을 말해요. I get up at 7.', optionWhy: { walk: 'walk는 걷다예요.', watch: 'watch는 (영상 등을) 보다예요.', drink: 'drink는 마시다예요.' }, mistakeType: 'meaning', wordIds: ['a1-w-getup'], conceptIds: [] }),
  q({ id: 'a1-q12', day: 2, role: 'practice', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요.', sentence: 'She ___ (study) English every day.', answer: 'studies', explanation: 'She는 3인칭 단수 → -s. study처럼 자음+y로 끝나면 y를 i로 바꾸고 -es를 붙여 studies가 돼요.', hint: '자음 + y로 끝나는 동사', mistakeType: 'spelling', wordIds: ['a1-w-study'], conceptIds: ['a1-present'], recommendConceptId: 'a1-present' }),
  q({ id: 'a1-q13', day: 2, role: 'practice', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'Tom ___ coffee. He drinks tea.', options: ["doesn't drink", "don't drink", "doesn't drinks", 'not drink'], answer: "doesn't drink", explanation: "Tom은 3인칭 단수 → doesn't, 그리고 doesn't 뒤에는 동사원형 drink를 써요.", optionWhy: { "don't drink": "Tom은 3인칭 단수라 don't가 아니라 doesn't예요.", "doesn't drinks": "doesn't 뒤에는 -s를 붙이지 않아요.", 'not drink': "일반동사 부정은 not만으로 안 되고 don't/doesn't가 필요해요." }, mistakeType: 'form', wordIds: ['a1-w-drink'], conceptIds: ['a1-present'], recommendConceptId: 'a1-present' }),
  q({ id: 'a1-q14', day: 2, role: 'practice', type: 'error', area: 'grammar', prompt: '문법적으로 틀린 부분을 고르세요.', tokens: ['My brother', 'watch', 'TV', 'every evening.'], answer: '1', explanation: 'My brother는 3인칭 단수라 watches로 써야 해요. -ch로 끝나는 동사는 -es를 붙여요.', mistakeType: 'agreement', wordIds: ['a1-w-watch'], conceptIds: ['a1-present'], recommendConceptId: 'a1-present' }),
  q({ id: 'a1-q15', day: 2, role: 'writing', type: 'order', area: 'writing', prompt: "단어를 배열해 '너는 서울에 사니?'를 완성하세요.", tokens: ['Do', 'you', 'live', 'in', 'Seoul?'], answer: 'Do you live in Seoul?', explanation: '일반동사 의문문은 Do + 주어 + 동사원형 순서예요.', mistakeType: 'word-order', wordIds: ['a1-w-live'], conceptIds: ['a1-present'], recommendConceptId: 'a1-present' }),
  q({ id: 'a1-q16', day: 2, role: 'writing', type: 'write', area: 'writing', prompt: '다음 문장을 영어로 쓰세요.', sentence: '그는 보통 걸어서 출근한다.', answer: 'He usually walks to work.', acceptable: ['He usually goes to work on foot.', 'Usually he walks to work.', 'Usually, he walks to work.'], hint: 'usually, walk, work를 사용해요.', explanation: 'He는 3인칭 단수 → walks. usually 같은 빈도부사는 일반동사 앞에 와요.', mistakeType: 'agreement', wordIds: ['a1-w-usually', 'a1-w-walk', 'a1-w-work'], conceptIds: ['a1-present'], recommendConceptId: 'a1-present' }),
  q({ id: 'a1-q17', day: 2, role: 'test', type: 'translate', area: 'reading', prompt: '문장의 뜻으로 알맞은 것을 고르세요.', sentence: "She doesn't eat breakfast.", options: ['그녀는 아침을 먹지 않는다.', '그녀는 아침을 먹지 않았다.', '그녀는 아침을 먹는다.', '그녀는 아침을 먹고 싶지 않다.'], answer: '그녀는 아침을 먹지 않는다.', explanation: "doesn't + 동사원형은 현재의 습관을 부정해요: '(평소에) 먹지 않는다'.", optionWhy: { '그녀는 아침을 먹지 않았다.': "과거라면 didn't eat이에요.", '그녀는 아침을 먹는다.': "doesn't가 있으므로 부정문이에요.", '그녀는 아침을 먹고 싶지 않다.': "'원하다'는 want가 필요해요." }, mistakeType: 'interpretation', wordIds: ['a1-w-eat'], conceptIds: ['a1-present'], recommendConceptId: 'a1-present' }),
  q({ id: 'a1-q18', day: 2, role: 'test', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: 'Where ___ your parents live?', options: ['do', 'does', 'are', 'is'], answer: 'do', explanation: 'your parents는 복수이고 live가 일반동사이므로 do를 써요.', optionWhy: { does: 'does는 3인칭 단수 주어에 써요. parents는 복수예요.', are: 'live가 일반동사라 be동사로 물을 수 없어요.', is: 'is는 be동사이고 단수용이에요.' }, mistakeType: 'agreement', wordIds: ['a1-w-live'], conceptIds: ['a1-present'], recommendConceptId: 'a1-present' }),
  // ── 복습용 변형 문항 ──
  q({ id: 'a1-v01', role: 'variant', isVariant: true, variantOf: 'a1-q03', type: 'blank', area: 'grammar', prompt: '빈칸에 알맞은 be동사를 쓰세요.', sentence: 'The students ___ in the classroom now.', answer: 'are', explanation: 'The students는 복수이므로 are를 써요.', hint: 'am / are / is 중 하나', mistakeType: 'agreement', wordIds: ['a1-w-student'], conceptIds: ['a1-be'], recommendConceptId: 'a1-be' }),
  q({ id: 'a1-v02', role: 'variant', isVariant: true, variantOf: 'a1-q04', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: '___ you tired?', options: ['Are', 'Is', 'Am', 'Do'], answer: 'Are', explanation: 'you가 주어인 be동사 의문문은 Are you …?예요.', optionWhy: { Is: 'Is는 단수 3인칭 주어에 써요.', Am: 'Am은 I에만 써요.', Do: 'tired는 형용사라 일반동사 의문문(Do)이 아니라 be동사로 물어요.' }, mistakeType: 'agreement', wordIds: ['a1-w-tired'], conceptIds: ['a1-be'], recommendConceptId: 'a1-be' }),
  q({ id: 'a1-v03', role: 'variant', isVariant: true, variantOf: 'a1-q12', type: 'blank', area: 'grammar', prompt: '괄호 안 동사를 알맞은 형태로 쓰세요.', sentence: 'My father ___ (work) in a bank.', answer: 'works', explanation: 'My father는 3인칭 단수이므로 works예요.', mistakeType: 'agreement', wordIds: ['a1-w-work'], conceptIds: ['a1-present'], recommendConceptId: 'a1-present' }),
  q({ id: 'a1-v04', role: 'variant', isVariant: true, variantOf: 'a1-q18', type: 'mcq', area: 'grammar', prompt: '빈칸에 알맞은 말을 고르세요.', sentence: '___ your sister like cats?', options: ['Does', 'Do', 'Is', 'Are'], answer: 'Does', explanation: 'your sister는 3인칭 단수이고 like는 일반동사 → Does로 물어요.', optionWhy: { Do: '3인칭 단수 주어에는 Does를 써요.', Is: 'like가 일반동사라 be동사로 묻지 않아요.', Are: 'like가 일반동사이고, are는 복수용이에요.' }, mistakeType: 'agreement', wordIds: ['a1-w-like'], conceptIds: ['a1-present'], recommendConceptId: 'a1-present' }),
];
