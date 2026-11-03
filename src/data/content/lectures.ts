import type { LectureExtra } from '../../types';

/**
 * 문법 강의 보강 데이터 (목적, 쉬운/자세한 설명, 문장 분석, 예문 더 보기, 유사 문법 비교, 선행 개념).
 * 설명 텍스트는 질문(AI 튜터) 기능과 분리된 순수 데이터로 관리한다.
 */
export const lectures: Record<string, LectureExtra> = {
  'a1-be': {
    goal: '나 자신과 주변 사람을 "누구인지, 어떤 상태인지, 어디에 있는지" 한 문장으로 말할 수 있게 돼요.',
    canDo: ['이름·직업·출신을 소개할 수 있다', '기분과 상태를 말하고 물어볼 수 있다', '주어에 맞춰 am / are / is를 고를 수 있다'],
    easy: [
      'be동사는 영어 문장의 "="(이퀄) 기호라고 생각하면 쉬워요. I = student → I am a student.',
      '주어에 따라 모양만 바뀌어요. 나(I)는 am, 너·우리·그들(you, we, they)은 are, 그·그녀·그것(he, she, it)은 is.',
      '한국어로 "~이다, ~하다(상태), ~에 있다"가 나오면 먼저 be동사를 떠올리세요.',
    ],
    detailed: [
      '축약형: I am → I’m, you are → you’re, he is → he’s, is not → isn’t, are not → aren’t. 회화에서는 축약형을 훨씬 많이 써요. (am not은 amn’t로 줄이지 않아요.)',
      '주어가 "A and B"이면 두 사람(복수)이므로 are를 써요: Tom and I are friends.',
      'be동사 뒤에는 명사(a student), 형용사(happy), 장소(in Seoul)가 와요. 형용사 앞에는 a를 붙이지 않아요: She is kind. (O) / She is a kind. (X)',
      '의문문에 짧게 답할 때: Are you busy? — Yes, I am. / No, I’m not. (Yes, I’m.처럼 긍정 짧은 답에서는 축약하지 않아요.)',
    ],
    analysis: {
      sentence: 'My sister is a teacher.',
      ko: '우리 언니(누나)는 선생님이다.',
      parts: [
        { text: 'My sister', role: '주어 (3인칭 단수)' },
        { text: 'is', role: 'be동사 (=)' },
        { text: 'a teacher', role: '보어 (주어가 누구인지)' },
      ],
    },
    moreExamples: [
      { en: "I'm not hungry right now.", ko: '나 지금은 배고프지 않아.' },
      { en: 'Are your parents at home?', ko: '너희 부모님 집에 계시니?' },
      { en: "It's cold today.", ko: '오늘 춥다.' },
      { en: 'We are from Korea.', ko: '우리는 한국에서 왔어요.' },
    ],
    compare: {
      title: 'be동사 vs 일반동사',
      left: 'be동사 (am/are/is)',
      right: '일반동사 (like, work …)',
      rows: [
        { left: '상태·정체를 말함: I am tired.', right: '동작·습관을 말함: I work.' },
        { left: '부정: be + not → I am not tired.', right: "부정: don't + 동사 → I don't work." },
        { left: '의문: Are you tired?', right: 'Do you work?' },
      ],
      tip: '한 문장에 두 동사를 함께 쓰지 않아요. I am like coffee. (X) → I like coffee. (O)',
    },
    prerequisites: [],
    prereqNote: '인칭대명사(I, you, he, she, it, we, they)를 알고 있으면 충분해요.',
  },
  'a1-present': {
    goal: '내 하루 일과와 습관, 다른 사람의 생활을 현재시제로 정확하게 말할 수 있게 돼요.',
    canDo: ['하루 일과를 3문장 이상 말할 수 있다', '3인칭 단수 주어에 -s/-es를 붙일 수 있다', "don't/doesn't, Do/Does로 부정문·의문문을 만들 수 있다"],
    easy: [
      '현재시제는 "늘, 보통, 매일" 하는 일이에요. 지금 이 순간 하는 일이 아니라 습관이에요.',
      '규칙은 하나만 기억하세요: 주어가 "남 한 명"(he, she, it, Tom)이면 동사 끝에 -s! He works.',
      'does나 doesn’t가 나오면 -s는 거기로 옮겨 갔으니, 뒤의 동사는 맨몸(원형)으로 돌아와요. He doesn’t work.',
    ],
    detailed: [
      '-s 붙이는 법: 대부분 -s (works), -s/-sh/-ch/-x/-o로 끝나면 -es (watches, goes, fixes), 자음+y는 y→i+es (study→studies), 모음+y는 -s (play→plays). have는 has로 바뀌어요.',
      '빈도부사(always, usually, often, sometimes, never)는 일반동사 앞, be동사 뒤에 와요: I usually walk. / I am usually busy.',
      '현재진행형(I am working)은 "지금 하는 중", 현재시제(I work)는 "평소에 하는 일"이에요. What do you do?는 직업을 묻는 표현이에요.',
    ],
    analysis: {
      sentence: "She doesn't eat breakfast.",
      ko: '그녀는 아침을 먹지 않는다.',
      parts: [
        { text: 'She', role: '주어 (3인칭 단수)' },
        { text: "doesn't", role: '부정 조동사 (does + not)' },
        { text: 'eat', role: '동사원형 (-s 없음)' },
        { text: 'breakfast', role: '목적어' },
      ],
    },
    moreExamples: [
      { en: 'My brother goes to the gym every day.', ko: '우리 형은 매일 헬스장에 간다.' },
      { en: "We don't watch TV in the morning.", ko: '우리는 아침에 TV를 보지 않는다.' },
      { en: 'Does your mom work on Saturdays?', ko: '너희 엄마는 토요일에 일하시니?' },
      { en: 'He has two cats.', ko: '그는 고양이 두 마리를 키운다.' },
    ],
    compare: {
      title: '현재시제 vs 현재진행형',
      left: '현재시제 (I work)',
      right: '현재진행형 (I am working)',
      rows: [
        { left: '평소 습관·사실', right: '지금 이 순간 하고 있는 일' },
        { left: 'every day, usually와 자주 씀', right: 'now, right now와 자주 씀' },
        { left: 'She drinks coffee every morning.', right: 'She is drinking coffee now.' },
      ],
      tip: 'like, know, want 같은 마음·상태 동사는 보통 진행형으로 쓰지 않아요. I am liking it. (X)',
    },
    prerequisites: ['a1-be'],
  },
  'a2-verb-to': {
    goal: '앞으로 하고 싶은 일, 계획, 약속, 여유가 없는 일을 동사 두 개를 이어서 말할 수 있게 돼요.',
    canDo: ['want/plan/decide/hope + to부정사로 계획을 말할 수 있다', "can't afford to로 여유가 없음을 표현할 수 있다", 'to 뒤에 동사원형을 정확히 쓸 수 있다'],
    easy: [
      'to는 화살표(→)예요. 아직 안 한 일을 "향해" 가요. I want → to go. (가는 쪽으로 마음이 향함)',
      '그래서 "하고 싶다, 하기로 했다, 할 계획이다, 하겠다고 약속했다"처럼 미래를 바라보는 동사 뒤에 to + 동사원형이 와요.',
      "can't afford to는 '~할 돈·시간이 없다'예요. 통장 잔고를 떠올리면 쉬워요.",
    ],
    detailed: [
      'to부정사를 목적어로 쓰는 대표 동사: want, need, hope, plan, decide, promise, agree, refuse, afford, manage, learn, expect, would like.',
      '부정은 to 앞에 not: She decided not to go. (가지 않기로 했다) — She didn’t decide to go.(가기로 결정하지 않았다)와 의미가 달라요.',
      'afford는 거의 항상 can / can’t / be able to와 함께 써요. 뒤에 명사가 바로 와도 돼요: We can’t afford a new car.',
      '이 단원의 to는 "목적어 자리"예요. I’m saving money to travel.처럼 "~하기 위해(목적)"를 나타내는 to도 있지만, 그건 동사와 상관없이 문장 끝에 붙는 다른 용법이에요.',
    ],
    analysis: {
      sentence: "We can't afford to buy a new car.",
      ko: '우리는 새 차를 살 여유가 없다.',
      parts: [
        { text: 'We', role: '주어' },
        { text: "can't afford", role: '동사 (여유가 없다)' },
        { text: 'to buy', role: 'to부정사 (무엇을 할 여유?)' },
        { text: 'a new car', role: 'buy의 목적어' },
      ],
    },
    moreExamples: [
      { en: 'I need to finish this by Friday.', ko: '나는 이걸 금요일까지 끝내야 해.' },
      { en: 'They agreed to meet at six.', ko: '그들은 6시에 만나기로 했다.' },
      { en: 'He refused to answer the question.', ko: '그는 그 질문에 답하기를 거부했다.' },
      { en: "I'd like to book a table for two.", ko: '두 명 자리 예약하고 싶어요.' },
    ],
    compare: {
      title: 'to부정사 vs 동명사(-ing)',
      left: '동사 + to부정사',
      right: '동사 + -ing (다음 DAY)',
      rows: [
        { left: '아직 안 한 일·미래·계획', right: '하고 있거나 해 본 일·경험' },
        { left: 'want, decide, plan, hope, afford', right: 'enjoy, finish, avoid, mind, quit' },
        { left: 'I decided to study.', right: 'I enjoy studying.' },
      ],
      tip: 'like, love, start, begin은 to와 -ing를 둘 다 쓸 수 있어요. I like to swim. = I like swimming.',
    },
    prerequisites: ['a1-present'],
    prereqNote: '동사원형이 무엇인지(-s, -ed가 붙지 않은 기본형) 알고 있어야 해요.',
  },
  'a2-verb-ing': {
    goal: '즐기는 일, 끝낸 일, 피하는 일, 그만둔 일을 자연스럽게 말하고 정중하게 부탁할 수 있게 돼요.',
    canDo: ['enjoy/finish/avoid/quit + -ing를 쓸 수 있다', 'Do you mind -ing?로 정중히 부탁할 수 있다', 'to부정사를 쓰는 동사와 구분할 수 있다'],
    easy: [
      '-ing는 "하는 것"이라는 이름표예요. cooking = 요리하는 것. 이미 하고 있는 행동을 하나의 덩어리로 들고 있는 느낌이에요.',
      '즐기다(enjoy), 끝내다(finish), 피하다(avoid), 그만두다(quit) — 모두 "이미 있는 행동"을 다루죠. 그래서 -ing를 써요.',
      'Do you mind opening the window? = "창문 여는 것, 꺼리세요?" → 정중한 부탁이에요. 들어줄 때는 No, not at all.(전혀요!)',
    ],
    detailed: [
      '동명사를 목적어로 쓰는 대표 동사: enjoy, finish, avoid, mind, practice, keep, quit, suggest, consider, give up.',
      'stop은 뜻이 달라져요: stop smoking(담배를 끊다) / stop to smoke(담배를 피우려고 멈추다).',
      '전치사 뒤에도 동사는 -ing로 와요: I’m good at cooking. / Thank you for helping me.',
      '-ing 만들기: 대부분 +ing, e로 끝나면 e 빼고 +ing (make → making), 단모음+단자음은 자음 한 번 더 (run → running, quit → quitting).',
    ],
    analysis: {
      sentence: 'Do you mind opening the window?',
      ko: '창문 좀 열어 주시겠어요?',
      parts: [
        { text: 'Do you', role: '의문문 (조동사 + 주어)' },
        { text: 'mind', role: '동사 (꺼리다)' },
        { text: 'opening', role: '동명사 (여는 것)' },
        { text: 'the window', role: 'opening의 목적어' },
      ],
    },
    moreExamples: [
      { en: 'I finished cleaning my room.', ko: '나는 방 청소를 끝냈다.' },
      { en: 'She suggested going by train.', ko: '그녀는 기차로 가자고 제안했다.' },
      { en: 'Keep practicing every day.', ko: '매일 꾸준히 연습해.' },
      { en: "I don't mind waiting.", ko: '기다리는 건 괜찮아요.' },
    ],
    compare: {
      title: 'stop -ing vs stop to',
      left: 'stop + -ing',
      right: 'stop + to부정사',
      rows: [
        { left: '하던 일을 그만두다', right: '~하기 위해 (하던 걸) 멈추다' },
        { left: 'He stopped smoking. (끊었다)', right: 'He stopped to smoke. (피우려고 멈췄다)' },
      ],
      tip: '헷갈리면 이렇게: -ing는 그만두는 "대상", to는 멈춘 "목적"이에요.',
    },
    prerequisites: ['a2-verb-to'],
  },
  'b1-pp-experience': {
    goal: '지금까지 해 본 일과 해 보지 않은 일을 말하고, 상대의 경험을 물을 수 있게 돼요.',
    canDo: ['Have you ever …?로 경험을 물을 수 있다', 'never / before / ~ times로 경험을 말할 수 있다', '자주 쓰는 불규칙 과거분사(been, seen, eaten, had)를 쓸 수 있다'],
    easy: [
      '현재완료는 "과거에서 지금까지 이어진 다리"예요. 경험은 그 다리 위 어딘가에서 한 일이에요. 언제 했는지는 중요하지 않아요.',
      '공식은 have(has) + 과거분사. "가지고 있다(have) + 해 본 일(p.p.)" → 경험을 가지고 있다!',
      'Have you ever …? = "한 번이라도 ~해 본 적 있어?"',
    ],
    detailed: [
      '과거분사(p.p.): 규칙동사는 과거형과 같아요(visited, lived). 불규칙은 따로 외워야 해요: be–was–been, go–went–gone, see–saw–seen, eat–ate–eaten, have–had–had, do–did–done.',
      'have been to vs have gone to: I have been to Paris.(가 본 적 있다, 지금은 여기 있음) / He has gone to Paris.(가 버려서 지금 여기 없음)',
      '경험과 자주 쓰는 말: ever(의문문), never, before, once, twice, three times, so far. 위치는 have와 p.p. 사이: I have never seen it.',
      '구체적인 과거 시점(yesterday, last year)을 말하는 순간 과거시제로 바꿔요. 경험을 물은 뒤 자세히 말할 때 자주 일어나요.',
    ],
    analysis: {
      sentence: 'Have you ever lived in a foreign country?',
      ko: '외국에서 살아 본 적 있니?',
      parts: [
        { text: 'Have', role: '조동사 (의문문이라 앞으로)' },
        { text: 'you', role: '주어' },
        { text: 'ever', role: '한 번이라도' },
        { text: 'lived', role: '과거분사' },
        { text: 'in a foreign country', role: '장소' },
      ],
    },
    moreExamples: [
      { en: "I've seen this movie three times.", ko: '나는 이 영화를 세 번 봤다.' },
      { en: 'Has she ever met your parents?', ko: '그녀가 너희 부모님을 만나 본 적 있어?' },
      { en: "We've never been to Europe.", ko: '우리는 유럽에 가 본 적이 없다.' },
      { en: 'This is the best pizza I have ever eaten.', ko: '이건 내가 먹어 본 피자 중 최고야.' },
    ],
    compare: {
      title: '현재완료(경험) vs 과거시제',
      left: '현재완료: 경험 유무',
      right: '과거시제: 언제 했는지',
      rows: [
        { left: 'I have been to Jeju.', right: 'I went to Jeju last summer.' },
        { left: '시점 없음 / ever, never', right: 'yesterday, last …, ago, in 2020' },
      ],
      tip: '대화에서는 "경험 있어?"(현재완료) → "응, 작년에 갔어"(과거)로 자주 바뀌어요.',
    },
    prerequisites: ['a1-present'],
    prereqNote: '동사의 과거형과 과거분사(p.p.) 형태를 알아야 해요. 불규칙 동사표를 함께 보면 좋아요.',
  },
  'b1-pp-vs-past': {
    goal: '과거부터 지금까지 계속된 일을 for/since로 말하고, 끝난 과거와 정확히 구분할 수 있게 돼요.',
    canDo: ['for + 기간, since + 시점을 구분해 쓸 수 있다', '과거 시점 표현이 있으면 과거시제를 고를 수 있다', '경력·거주 기간을 소개할 수 있다'],
    easy: [
      '시간 표현을 보고 고르세요. 과거에 "끝난 날짜"(yesterday, last week, ago)가 보이면 무조건 과거시제!',
      'for는 "얼마 동안"(3년 동안), since는 "언제부터"(2019년부터). 둘 다 지금까지 이어지니까 현재완료와 짝이에요.',
      'When으로 물으면 날짜를 묻는 거니까 과거시제예요: When did you move?',
    ],
    detailed: [
      'for + 기간: for three years, for a long time, for ages / since + 시작점: since 2019, since last May, since I was a child, since I graduated(문장도 가능).',
      'How long have you …?는 기간을 묻는 현재완료 질문이에요: How long have you lived here? — For five years.',
      '계속되는 동작을 강조하면 현재완료진행형: I have been working here since March. 의미 차이가 크지 않은 동사(live, work)는 둘 다 자연스러워요.',
      'just, already, yet, recently도 현재완료와 자주 써요. 단, just now(방금 전)는 과거 시점이라 과거시제와 써요.',
    ],
    analysis: {
      sentence: 'She has worked at this company for three years.',
      ko: '그녀는 이 회사에서 3년 동안 일해 왔다.',
      parts: [
        { text: 'She', role: '주어' },
        { text: 'has worked', role: '현재완료 (지금까지 계속)' },
        { text: 'at this company', role: '장소' },
        { text: 'for three years', role: '기간 (얼마 동안)' },
      ],
    },
    moreExamples: [
      { en: 'How long have you known each other?', ko: '너희 서로 안 지 얼마나 됐어?' },
      { en: "I haven't seen him since Monday.", ko: '월요일 이후로 그를 못 봤어.' },
      { en: 'They moved to Busan in 2021.', ko: '그들은 2021년에 부산으로 이사했다.' },
      { en: "We've been friends since high school.", ko: '우리는 고등학교 때부터 친구야.' },
    ],
    compare: {
      title: 'for vs since',
      left: 'for + 기간',
      right: 'since + 시작 시점',
      rows: [
        { left: 'for two hours / for ten years', right: 'since 3 o’clock / since 2015' },
        { left: '“얼마 동안?”에 대한 답', right: '“언제부터?”에 대한 답' },
      ],
      tip: 'since three years (X) — 숫자 + 기간 단위에는 for를 써요.',
    },
    prerequisites: ['b1-pp-experience'],
  },
  'b2-third-cond': {
    goal: '이미 지나간 일을 되돌아보며 "그때 ~했더라면"이라고 가정하고, 후회와 교훈을 말할 수 있게 돼요.',
    canDo: ['If + had p.p., would have p.p. 형태를 정확히 쓸 수 있다', 'should have p.p.로 후회를 말할 수 있다', '가정법 문장의 실제 사실을 추론할 수 있다'],
    easy: [
      '타임머신을 타고 과거로 돌아가 한 가지를 바꿔 보는 상상이에요. "그때 일찍 나왔더라면 → 기차를 탔을 텐데."',
      '과거를 바꾸니까 한 칸 더 과거로: if 쪽은 had + p.p., 결과 쪽은 would have + p.p.',
      '진짜로 일어난 일은 반대예요. If I had left earlier … = 실제로는 늦게 나왔어요.',
    ],
    detailed: [
      '주절의 조동사로 확신 정도를 조절해요: would have(~했을 것이다), could have(~할 수 있었을 것이다), might have(~했을지도 모른다).',
      '부정형: If I hadn’t missed the bus, I wouldn’t have been late. 축약형 I’d은 문맥으로 구분해요: If I’d known(= had), I’d have come(= would).',
      'if를 생략하고 had를 앞으로 보내는 격식체도 있어요: Had I known, I would have come.',
      '후회 표현: should have p.p.(~했어야 했는데), shouldn’t have p.p.(~하지 말았어야 했는데). I wish I had p.p.도 같은 후회를 나타내요.',
    ],
    analysis: {
      sentence: 'If I had left earlier, I would have caught the train.',
      ko: '더 일찍 나섰더라면 기차를 탔을 텐데.',
      parts: [
        { text: 'If I had left earlier,', role: '가정 (과거 사실의 반대: 실제로는 늦게 나옴)' },
        { text: 'I would have caught', role: '결과 (과거에 일어나지 않은 일)' },
        { text: 'the train.', role: '목적어' },
      ],
    },
    moreExamples: [
      { en: "If we had checked the weather, we wouldn't have gotten wet.", ko: '날씨를 확인했더라면 비에 젖지 않았을 텐데.' },
      { en: 'She might have passed if she had studied a little more.', ko: '조금만 더 공부했더라면 그녀는 합격했을지도 몰라.' },
      { en: 'I should have listened to your advice.', ko: '네 조언을 들었어야 했는데.' },
      { en: 'I wish I had taken more photos.', ko: '사진을 더 찍어 둘걸.' },
    ],
    compare: {
      title: '가정법 과거 vs 가정법 과거완료',
      left: '가정법 과거 (지금 반대)',
      right: '가정법 과거완료 (과거 반대)',
      rows: [
        { left: 'If I had time, I would go.', right: 'If I had had time, I would have gone.' },
        { left: '실제: 지금 시간이 없다', right: '실제: 그때 시간이 없었다' },
      ],
      tip: '결과가 언제의 일인지 먼저 보세요. 과거면 would have p.p., 지금이면 would + 동사원형.',
    },
    prerequisites: ['b1-pp-experience'],
    prereqNote: '가정법 과거(If I were…, I would…)와 과거분사(p.p.)를 알고 있으면 이해가 쉬워요.',
  },
  'b2-mixed-cond': {
    goal: '과거의 선택이 지금에 미친 영향을 정확한 시제로 말할 수 있게 돼요.',
    canDo: ['과거 조건 + 현재 결과(would + 동사원형)를 쓸 수 있다', '현재 조건 + 과거 결과(would have p.p.)를 쓸 수 있다', 'now, yesterday 같은 시간 단서로 형태를 고를 수 있다'],
    easy: [
      '혼합 가정법은 "조건의 시간"과 "결과의 시간"이 달라요. 어제 늦게 잤더라면(과거) → 지금 안 피곤할 텐데(현재).',
      '결과가 now면 would + 동사원형, 결과가 과거면 would have + p.p. — 결과의 시간만 보고 고르면 돼요.',
      '조건 쪽도 마찬가지: 과거 일이면 had + p.p., 지금 성격·사실이면 과거형(were, spoke).',
    ],
    detailed: [
      '유형 ①(가장 흔함): If + had p.p., would + 동사원형 (+ now/today). 과거의 선택 → 현재 상태.',
      "유형 ②: If + 과거형/were, would have + p.p. 지금의 변하지 않는 성격·사실 → 과거 결과. If I weren't afraid of heights, I would have gone up the tower.",
      '시간 표현이 없으면 두 해석이 모두 가능할 수 있어요. 시험에서는 now, yesterday, last year 같은 단서를 꼭 확인하세요.',
      'could / might도 주절에 쓸 수 있어요: If I had studied medicine, I might be a doctor now.',
    ],
    analysis: {
      sentence: 'If I had studied medicine, I would be a doctor now.',
      ko: '내가 의학을 공부했더라면, 지금 의사일 텐데.',
      parts: [
        { text: 'If I had studied medicine,', role: '과거 조건 (had p.p.)' },
        { text: 'I would be', role: '현재 결과 (would + 동사원형)' },
        { text: 'a doctor now.', role: '보어 + 현재 시간 단서' },
      ],
    },
    moreExamples: [
      { en: "If she hadn't moved to Canada, she wouldn't speak English so well now.", ko: '캐나다로 이사하지 않았다면 그녀는 지금 영어를 그렇게 잘하지 못할 거야.' },
      { en: 'If I had taken that job, I would be living in London now.', ko: '그 일을 맡았다면 나는 지금 런던에 살고 있을 텐데.' },
      { en: "If he were more careful, he wouldn't have lost his phone yesterday.", ko: '그가 좀 더 조심성이 있다면 어제 휴대폰을 잃어버리지 않았을 텐데.' },
    ],
    compare: {
      title: '가정법 과거완료 vs 혼합 가정법',
      left: '과거 → 과거 결과',
      right: '과거 → 현재 결과',
      rows: [
        { left: 'If I had slept, I would have felt better yesterday.', right: 'If I had slept, I would feel better now.' },
        { left: 'would have + p.p.', right: 'would + 동사원형' },
      ],
      tip: '조건은 둘 다 had p.p.로 같아요. 결과의 시간(yesterday / now)이 형태를 결정해요.',
    },
    prerequisites: ['b2-third-cond'],
  },
};
