import type { Dialogue, DialogueLine, Question } from '../types';

/**
 * A1 실생활 대화 10편 (자체 작성). 음성은 scripts/gen-audio.py로 생성한 합성 음성(mp3)이다.
 * 각 대화: 스크립트·해석·핵심 단어·핵심 표현·이해도 문제 2·받아쓰기 1.
 */

type L = [speaker: 'A' | 'B', en: string, ko: string];
interface Raw {
  id: string;
  title: string;
  situation: string;
  A: [string, 'female' | 'male'];
  B: [string, 'female' | 'male'];
  lines: L[];
  keyWords: [string, string][];
  keyExpressions: [string, string, string][];
  conceptIds: string[];
  q1: { prompt: string; options: string[]; answer: string; explanation: string; why?: Record<string, string> };
  q2: { prompt: string; options: string[]; answer: string; explanation: string; why?: Record<string, string> };
  /** 받아쓰기: 몇 번째 줄(0부터), 빈칸 단어 */
  dictation: { line: number; word: string; acceptable?: string[]; explanation: string };
}

const RAW: Raw[] = [
  {
    id: 'l-a1-01',
    title: '처음 만난 사람과 인사하기',
    situation: '대학교 오리엔테이션에서 옆자리 사람과 인사해요.',
    A: ['Jisu', 'female'],
    B: ['Tom', 'male'],
    lines: [
      ['A', "Hi, I'm Jisu. What's your name?", '안녕, 나는 지수야. 너는 이름이 뭐야?'],
      ['B', "Hi, Jisu. I'm Tom. Nice to meet you.", '안녕, 지수. 나는 톰이야. 만나서 반가워.'],
      ['A', 'Nice to meet you, too. Are you a student?', '나도 만나서 반가워. 너 학생이야?'],
      ['B', "Yes, I am. I'm a student at Seoul University.", '응, 맞아. 나는 서울대학교 학생이야.'],
      ['A', "Really? I'm a student there, too!", '정말? 나도 거기 학생이야!'],
      ['B', "Oh, cool! Let's be friends.", '오, 좋다! 우리 친구 하자.'],
    ],
    keyWords: [['name', '이름'], ['student', '학생'], ['university', '대학교'], ['too', '~도, 또한']],
    keyExpressions: [
      ['Nice to meet you.', '만나서 반가워요.', '처음 만났을 때 쓰는 인사. 대답은 Nice to meet you, too.'],
      ['Are you a student? — Yes, I am.', '학생이에요? — 네, 맞아요.', 'be동사 의문문에는 be동사로 짧게 대답해요. Yes, I’m.이라고 줄이지 않아요.'],
    ],
    conceptIds: ['a1-be'],
    q1: { prompt: 'Tom은 무엇을 하는 사람인가요?', options: ['학생', '선생님', '회사원', '의사'], answer: '학생', explanation: "Tom이 \"I'm a student at Seoul University.\"라고 말했어요." },
    q2: { prompt: '지수와 Tom의 공통점은 무엇인가요?', options: ['같은 대학교 학생이다', '같은 동네에 산다', '둘 다 선생님이다', '같은 회사에 다닌다'], answer: '같은 대학교 학생이다', explanation: "지수가 \"I'm a student there, too!\" — 거기(서울대학교) 학생이라고 했어요." },
    dictation: { line: 1, word: 'meet', explanation: 'Nice to meet you. — 처음 만났을 때 하는 인사예요.' },
  },
  {
    id: 'l-a1-02',
    title: '어디에서 왔어요?',
    situation: '언어 교환 모임에서 출신을 묻고 답해요.',
    A: ['Minho', 'male'],
    B: ['Emma', 'female'],
    lines: [
      ['A', 'Where are you from, Emma?', '엠마, 어디에서 왔어요?'],
      ['B', "I'm from Canada. And you?", '저는 캐나다에서 왔어요. 당신은요?'],
      ['A', "I'm from Korea. I'm from Busan.", '저는 한국에서 왔어요. 부산 출신이에요.'],
      ['B', 'Oh, Busan! Is it a big city?', '오, 부산! 큰 도시예요?'],
      ['A', "Yes, it is. It's very beautiful.", '네, 맞아요. 아주 아름다워요.'],
      ['B', 'I want to go there someday.', '언젠가 거기 가 보고 싶어요.'],
    ],
    keyWords: [['from', '~에서(출신)'], ['city', '도시'], ['beautiful', '아름다운'], ['someday', '언젠가']],
    keyExpressions: [
      ['Where are you from?', '어디 출신이에요?', '대답은 I’m from + 나라/도시.'],
      ['And you?', '당신은요?', '같은 질문을 상대에게 되돌려 물을 때 써요.'],
    ],
    conceptIds: ['a1-be'],
    q1: { prompt: 'Emma는 어디에서 왔나요?', options: ['캐나다', '미국', '영국', '호주'], answer: '캐나다', explanation: "Emma가 \"I'm from Canada.\"라고 했어요." },
    q2: { prompt: '부산에 대한 설명으로 맞는 것은?', options: ['큰 도시이고 아름답다', '작은 마을이다', 'Emma의 고향이다', '서울 바로 옆에 있다'], answer: '큰 도시이고 아름답다', explanation: "Is it a big city? — Yes, it is. It's very beautiful." },
    dictation: { line: 0, word: 'are', explanation: 'Where are you from? — 주어 you에는 be동사 are를 써요.' },
  },
  {
    id: 'l-a1-03',
    title: '피곤해 보이는 친구',
    situation: '학교 복도에서 피곤해 보이는 친구에게 말을 걸어요.',
    A: ['Jake', 'male'],
    B: ['Mina', 'female'],
    lines: [
      ['A', 'Hi, Mina. Are you okay? You look tired.', '안녕, 미나. 괜찮아? 피곤해 보여.'],
      ['B', "I'm okay. I'm just tired and hungry.", '괜찮아. 그냥 피곤하고 배고파.'],
      ['A', 'Are you busy today?', '오늘 바빠?'],
      ['B', "Yes, I'm very busy. I have three classes.", '응, 엄청 바빠. 수업이 세 개 있어.'],
      ['A', "Let's get something to eat first.", '우선 뭐 좀 먹자.'],
      ['B', 'Good idea. Thanks.', '좋은 생각이야. 고마워.'],
    ],
    keyWords: [['tired', '피곤한'], ['hungry', '배고픈'], ['busy', '바쁜'], ['class', '수업']],
    keyExpressions: [
      ['You look tired.', '피곤해 보여.', 'look + 형용사 = ~해 보이다.'],
      ["Let's get something to eat.", '뭐 좀 먹자.', "Let's + 동사원형 = ~하자. something to eat = 먹을 것."],
    ],
    conceptIds: ['a1-be'],
    q1: { prompt: '미나의 지금 상태로 알맞은 것은?', options: ['피곤하고 배고프다', '아프다', '화가 났다', '심심하다'], answer: '피곤하고 배고프다', explanation: "\"I'm just tired and hungry.\"" },
    q2: { prompt: '미나가 오늘 바쁜 이유는?', options: ['수업이 세 개 있어서', '아르바이트를 해서', '시험이 있어서', '이사를 해서'], answer: '수업이 세 개 있어서', explanation: '"I have three classes." — 수업이 세 개 있어요.' },
    dictation: { line: 1, word: 'hungry', explanation: "I'm just tired and hungry. — hungry(배고픈)." },
  },
  {
    id: 'l-a1-04',
    title: '가족사진 보여 주기',
    situation: '친구에게 휴대폰 속 가족사진을 보여 줘요.',
    A: ['Yuna', 'female'],
    B: ['Chris', 'male'],
    lines: [
      ['A', 'Who is this in the picture?', '사진 속 이 사람은 누구야?'],
      ['B', "That's my brother, Daniel.", '내 남동생(형) 대니얼이야.'],
      ['A', 'He looks kind. Is he a teacher?', '친절해 보인다. 선생님이야?'],
      ['B', "No, he isn't. He's a nurse.", '아니. 간호사야.'],
      ['A', 'And who are they?', '그리고 이분들은 누구야?'],
      ['B', "They're my parents. They're in Jeju now.", '우리 부모님이야. 지금 제주에 계셔.'],
    ],
    keyWords: [['picture', '사진'], ['brother', '형·남동생'], ['nurse', '간호사'], ['parents', '부모님']],
    keyExpressions: [
      ['Who is this?', '이 사람은 누구예요?', '사진 속 사람을 가리킬 때 써요. 여러 명이면 Who are they?'],
      ["No, he isn't.", '아니요, 그렇지 않아요.', 'Is he …?에 대한 부정 대답. isn’t = is not.'],
    ],
    conceptIds: ['a1-be'],
    q1: { prompt: 'Daniel의 직업은 무엇인가요?', options: ['간호사', '선생님', '학생', '의사'], answer: '간호사', explanation: "\"No, he isn't. He's a nurse.\" — 선생님이 아니라 간호사예요." },
    q2: { prompt: 'Chris의 부모님은 지금 어디에 계신가요?', options: ['제주', '서울', '부산', 'Chris의 집'], answer: '제주', explanation: "\"They're in Jeju now.\"" },
    dictation: { line: 3, word: "isn't", acceptable: ['is not'], explanation: "No, he isn't. — is not의 줄임말이에요." },
  },
  {
    id: 'l-a1-05',
    title: '새 회사 첫 출근',
    situation: '첫 출근 날, 같은 팀 동료를 만나요.',
    A: ['Mark', 'male'],
    B: ['Sora', 'female'],
    lines: [
      ['A', 'Good morning! Are you the new designer?', '좋은 아침이에요! 새로 온 디자이너세요?'],
      ['B', "Yes, I am. I'm Sora. Today is my first day.", '네, 맞아요. 저는 소라예요. 오늘이 첫날이에요.'],
      ['A', "Welcome! I'm Mark. I'm on the design team, too.", '환영해요! 저는 마크예요. 저도 디자인팀이에요.'],
      ['B', 'Oh, nice! Is the meeting room on this floor?', '오, 좋네요! 회의실이 이 층에 있나요?'],
      ['A', "Yes, it is. It's next to the kitchen.", '네, 있어요. 탕비실 옆이에요.'],
      ['B', "Thank you. You're very kind.", '감사해요. 정말 친절하시네요.'],
    ],
    keyWords: [['new', '새로운'], ['first day', '첫날'], ['team', '팀'], ['next to', '~ 옆에']],
    keyExpressions: [
      ['Today is my first day.', '오늘이 첫날이에요.', '첫 출근·첫 수업 날 자기소개로 자주 써요.'],
      ["It's next to the kitchen.", '탕비실(부엌) 옆에 있어요.', '위치 말하기: be동사 + next to + 장소.'],
    ],
    conceptIds: ['a1-be'],
    q1: { prompt: '소라는 어떤 사람인가요?', options: ['오늘 처음 출근한 디자이너', '디자인팀 팀장', '회사에 온 손님', '면접을 보러 온 사람'], answer: '오늘 처음 출근한 디자이너', explanation: 'Are you the new designer? — Yes, I am. … Today is my first day.' },
    q2: { prompt: '회의실은 어디에 있나요?', options: ['같은 층 탕비실 옆', '다른 층', '엘리베이터 앞', '건물 밖'], answer: '같은 층 탕비실 옆', explanation: "Is the meeting room on this floor? — Yes, it is. It's next to the kitchen." },
    dictation: { line: 1, word: 'first', explanation: 'Today is my first day. — first(첫 번째의).' },
  },
  {
    id: 'l-a1-06',
    title: '아침 일과 이야기',
    situation: '동료와 아침 습관에 대해 이야기해요.',
    A: ['Hana', 'female'],
    B: ['Leo', 'male'],
    lines: [
      ['A', 'What time do you get up, Leo?', '레오, 몇 시에 일어나요?'],
      ['B', 'I usually get up at six thirty.', '보통 6시 30분에 일어나요.'],
      ['A', "Wow, that's early! What do you do in the morning?", '와, 일찍 일어나네요! 아침에 뭐 해요?'],
      ['B', 'I walk my dog and drink coffee.', '개를 산책시키고 커피를 마셔요.'],
      ['A', 'Do you eat breakfast?', '아침은 먹어요?'],
      ['B', "No, I don't. I eat lunch early.", '아니요. 점심을 일찍 먹어요.'],
    ],
    keyWords: [['get up', '일어나다'], ['early', '일찍, 이른'], ['walk (a dog)', '(개를) 산책시키다'], ['breakfast', '아침 식사']],
    keyExpressions: [
      ['What time do you get up?', '몇 시에 일어나요?', 'What time + do you + 동사원형? = 몇 시에 ~해요?'],
      ["No, I don't.", '아니요, 안 해요.', 'Do you …?에 대한 부정 대답이에요.'],
    ],
    conceptIds: ['a1-present'],
    q1: { prompt: 'Leo는 보통 몇 시에 일어나나요?', options: ['6시 30분', '6시', '7시 30분', '8시'], answer: '6시 30분', explanation: '"I usually get up at six thirty."' },
    q2: { prompt: 'Leo가 아침에 하지 않는 일은?', options: ['아침밥 먹기', '개 산책시키기', '커피 마시기', '6시 30분에 일어나기'], answer: '아침밥 먹기', explanation: "Do you eat breakfast? — No, I don't." },
    dictation: { line: 1, word: 'get', explanation: 'I usually get up at six thirty. — get up(일어나다).' },
  },
  {
    id: 'l-a1-07',
    title: '무슨 일을 하세요?',
    situation: '모임에서 처음 만난 사람의 직업을 물어봐요.',
    A: ['Ben', 'male'],
    B: ['Sarah', 'female'],
    lines: [
      ['A', 'What do you do, Sarah?', '사라, 무슨 일 하세요?'],
      ['B', "I'm a cook. I work at a hotel restaurant.", '요리사예요. 호텔 레스토랑에서 일해요.'],
      ['A', 'Do you work on weekends?', '주말에도 일해요?'],
      ['B', 'Yes, I do. I work on Saturdays and Sundays.', '네. 토요일과 일요일에 일해요.'],
      ['A', "That's hard. When do you rest?", '힘들겠네요. 언제 쉬어요?'],
      ['B', 'I rest on Mondays. I watch movies at home.', '월요일에 쉬어요. 집에서 영화를 봐요.'],
    ],
    keyWords: [['cook', '요리사'], ['restaurant', '식당'], ['weekend', '주말'], ['rest', '쉬다']],
    keyExpressions: [
      ['What do you do?', '무슨 일 하세요?', '직업을 묻는 표현. What are you doing?(지금 뭐 해?)과 달라요.'],
      ['on Mondays', '월요일마다', '요일 + s는 "매주 그 요일에"라는 뜻이에요.'],
    ],
    conceptIds: ['a1-present'],
    q1: { prompt: 'Sarah의 직업은 무엇인가요?', options: ['요리사', '간호사', '선생님', '은행원'], answer: '요리사', explanation: "\"I'm a cook. I work at a hotel restaurant.\"" },
    q2: { prompt: 'Sarah가 쉬는 날은?', options: ['월요일', '토요일', '일요일', '금요일'], answer: '월요일', explanation: '"I rest on Mondays." — 토·일요일에는 일해요.' },
    dictation: { line: 1, word: 'work', explanation: 'I work at a hotel restaurant. — work at + 장소.' },
  },
  {
    id: 'l-a1-08',
    title: '어디 살아요?',
    situation: '회사 동료에게 사는 곳과 출근길을 물어봐요.',
    A: ['Jenny', 'female'],
    B: ['Kevin', 'male'],
    lines: [
      ['A', 'Do you live in Seoul, Kevin?', '케빈, 서울에 살아요?'],
      ['B', "No, I don't. I live in Incheon.", '아니요. 인천에 살아요.'],
      ['A', 'Really? How do you come to work?', '정말요? 회사에 어떻게 와요?'],
      ['B', 'I take the subway. It takes one hour.', '지하철을 타요. 한 시간 걸려요.'],
      ['A', "That's long. Do you like it?", '오래 걸리네요. 괜찮아요?'],
      ['B', 'Yes. I read books on the subway.', '네. 지하철에서 책을 읽어요.'],
    ],
    keyWords: [['live', '살다'], ['subway', '지하철'], ['take', '(교통수단을) 타다; (시간이) 걸리다'], ['hour', '시간']],
    keyExpressions: [
      ['How do you come to work?', '회사에 어떻게 와요?', 'How = 어떻게(방법).'],
      ['It takes one hour.', '한 시간 걸려요.', 'It takes + 시간 = (시간이) 걸리다.'],
    ],
    conceptIds: ['a1-present'],
    q1: { prompt: 'Kevin은 어디에 사나요?', options: ['인천', '서울', '수원', '부산'], answer: '인천', explanation: "Do you live in Seoul? — No, I don't. I live in Incheon." },
    q2: { prompt: 'Kevin의 출근 방법과 시간은?', options: ['지하철, 1시간', '버스, 1시간', '지하철, 30분', '걸어서, 1시간'], answer: '지하철, 1시간', explanation: 'I take the subway. It takes one hour.' },
    dictation: { line: 1, word: "don't", acceptable: ['do not'], explanation: "No, I don't. — Do you …?에 대한 부정 대답이에요." },
  },
  {
    id: 'l-a1-09',
    title: '동생은 뭘 좋아해?',
    situation: '친구의 여동생 취미에 대해 물어봐요.',
    A: ['Alex', 'male'],
    B: ['Jiwon', 'female'],
    lines: [
      ['A', 'Does your sister like K-pop?', '네 여동생 K-pop 좋아해?'],
      ['B', 'Yes, she does. She listens to it every day.', '응, 좋아해. 매일 들어.'],
      ['A', 'Does she play an instrument?', '악기도 연주해?'],
      ['B', "No, she doesn't. But she sings very well.", '아니. 그런데 노래를 정말 잘해.'],
      ['A', 'Cool. What does she do on weekends?', '멋지다. 주말에는 뭐 해?'],
      ['B', 'She studies Japanese and watches dramas.', '일본어 공부하고 드라마 봐.'],
    ],
    keyWords: [['listen to', '~을 듣다'], ['instrument', '악기'], ['sing', '노래하다'], ['drama', '드라마']],
    keyExpressions: [
      ['Does she …? — Yes, she does. / No, she doesn’t.', '그녀는 ~하니? — 응 / 아니', '주어가 she이면 Does로 묻고 does/doesn’t로 답해요.'],
      ['She studies Japanese.', '그녀는 일본어를 공부해.', 'study → studies (자음 + y → ies).'],
    ],
    conceptIds: ['a1-present'],
    q1: { prompt: '지원의 여동생에 대해 맞는 것은?', options: ['악기는 안 하지만 노래를 잘한다', '기타를 친다', '피아노를 친다', 'K-pop을 좋아하지 않는다'], answer: '악기는 안 하지만 노래를 잘한다', explanation: "Does she play an instrument? — No, she doesn't. But she sings very well." },
    q2: { prompt: '여동생은 주말에 무엇을 하나요?', options: ['일본어 공부와 드라마 보기', '콘서트 가기', '노래 연습', '아르바이트'], answer: '일본어 공부와 드라마 보기', explanation: 'She studies Japanese and watches dramas.' },
    dictation: { line: 5, word: 'studies', explanation: 'She studies Japanese … — 3인칭 단수라 study → studies.' },
  },
  {
    id: 'l-a1-10',
    title: '일요일에 보통 뭐 해?',
    situation: '친구와 주말 습관을 이야기해요.',
    A: ['Olivia', 'female'],
    B: ['Sam', 'male'],
    lines: [
      ['A', 'What do you usually do on Sundays?', '일요일에 보통 뭐 해?'],
      ['B', 'I usually clean my room and cook lunch.', '보통 방 청소하고 점심을 요리해.'],
      ['A', 'Do you go out?', '밖에 나가기도 해?'],
      ['B', 'Sometimes. My friends and I play tennis in the park.', '가끔. 친구들이랑 공원에서 테니스를 쳐.'],
      ['A', 'Does your brother play, too?', '네 남동생도 같이 쳐?'],
      ['B', "No. He doesn't like sports. He plays games at home.", '아니. 걔는 운동을 안 좋아해. 집에서 게임해.'],
    ],
    keyWords: [['clean', '청소하다'], ['go out', '외출하다'], ['sometimes', '가끔'], ['sports', '운동, 스포츠']],
    keyExpressions: [
      ['What do you usually do on Sundays?', '일요일에 보통 뭐 해?', '습관을 묻는 현재시제 질문이에요.'],
      ["He doesn't like sports.", '그는 운동을 좋아하지 않아.', "doesn't + 동사원형 (likes 아님)."],
    ],
    conceptIds: ['a1-present'],
    q1: { prompt: 'Sam이 일요일에 보통 하는 일은?', options: ['방 청소와 점심 요리', '테니스 수업', '늦잠 자기', '쇼핑하기'], answer: '방 청소와 점심 요리', explanation: 'I usually clean my room and cook lunch. 테니스는 "가끔" 쳐요.' },
    q2: { prompt: 'Sam의 남동생에 대해 맞는 것은?', options: ['운동을 좋아하지 않고 집에서 게임한다', '테니스를 같이 친다', '요리를 좋아한다', '공원에 자주 간다'], answer: '운동을 좋아하지 않고 집에서 게임한다', explanation: "He doesn't like sports. He plays games at home." },
    dictation: { line: 5, word: "doesn't", acceptable: ['does not'], explanation: "He doesn't like sports. — 3인칭 단수 부정은 doesn't + 동사원형." },
  },
];

export const lineAudio = (dialogueId: string, i: number) => `audio/listening/${dialogueId}-${i + 1}.mp3`;

function build(r: Raw): { dialogue: Dialogue; questions: Question[] } {
  const lines: DialogueLine[] = r.lines.map(([speaker, en, ko], i) => ({ speaker, en, ko, audio: lineAudio(r.id, i) }));
  const all = lines.map((l) => l.audio);
  const base = { level: 'A1' as const, unitId: r.id, area: 'listening' as const, role: 'listening' as const, dialogueId: r.id, wordIds: [], conceptIds: r.conceptIds };
  const mk = (n: 1 | 2, q: Raw['q1']): Question => ({
    ...base,
    id: `${r.id}-q${n}`,
    type: 'mcq',
    prompt: `대화를 듣고 답하세요. ${q.prompt}`,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
    optionWhy: q.why,
    audio: all,
    mistakeType: 'interpretation',
  });
  const d = r.dictation;
  const src = r.lines[d.line][1];
  const idx = src.indexOf(d.word);
  if (idx < 0) throw new Error(`받아쓰기 단어 없음: ${r.id}`);
  const dict: Question = {
    ...base,
    id: `${r.id}-d1`,
    type: 'blank',
    prompt: '문장을 듣고 빈칸에 들어갈 단어를 쓰세요. (받아쓰기)',
    sentence: src.slice(0, idx) + '___' + src.slice(idx + d.word.length),
    answer: d.word,
    acceptable: d.acceptable,
    explanation: `${src}\n${d.explanation}`,
    audio: [lines[d.line].audio],
    hint: `${d.word.length}글자`,
    mistakeType: 'spelling',
  };
  const questions = [mk(1, r.q1), mk(2, r.q2), dict];
  return {
    dialogue: {
      id: r.id,
      level: 'A1',
      title: r.title,
      situation: r.situation,
      speakers: { A: { name: r.A[0], voice: r.A[1] }, B: { name: r.B[0], voice: r.B[1] } },
      lines,
      keyWords: r.keyWords.map(([en, ko]) => ({ en, ko })),
      keyExpressions: r.keyExpressions.map(([en, ko, note]) => ({ en, ko, note })),
      conceptIds: r.conceptIds,
      questionIds: questions.map((q) => q.id),
    },
    questions,
  };
}

const built = RAW.map(build);
export const dialogues: Dialogue[] = built.map((b) => b.dialogue);
export const listeningQuestions: Question[] = built.flatMap((b) => b.questions);
export const getDialogue = (id: string) => dialogues.find((d) => d.id === id);
