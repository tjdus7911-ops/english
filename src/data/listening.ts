import type { Dialogue, DialogueLine, Question } from '../types';

/**
 * A1 실생활 대화 10편 (자체 작성). 음성은 scripts/gen-audio.py로 생성한 합성 음성(mp3)이다.
 * 각 대화: 스크립트·해석·핵심 단어·핵심 표현·이해도 문제 2·받아쓰기 1.
 */

type L = [speaker: 'A' | 'B', en: string, ko: string];
interface Raw {
  id: string;
  level?: 'A1' | 'A2';
  /** 표현 학습관 '상황별 듣기·말하기' 콘텐츠 여부 */
  situational?: boolean;
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


const SIT = (r: Omit<Raw, 'level' | 'situational'>): Raw => ({ ...r, level: 'A2', situational: true });

/** 표현 학습관 · 상황별 듣기·말하기 (A2) 10편 */
const RAW_SITUATIONS: Raw[] = [
  SIT({
    id: 'sx-01',
    title: '카페에서 주문하기',
    situation: '카페 카운터에서 음료를 주문해요.',
    A: ['Barista', 'female'],
    B: ['Daniel', 'male'],
    lines: [
      ['A', 'Hi, what can I get for you?', '안녕하세요, 뭐 드릴까요?'],
      ['B', 'Can I get a large iced latte, please?', '아이스 라테 큰 사이즈로 주시겠어요?'],
      ['A', 'Sure. For here or to go?', '네. 드시고 가세요, 가져가세요?'],
      ['B', 'To go, please. How much is it?', '가져갈게요. 얼마예요?'],
      ['A', "That's five dollars and fifty cents.", '5달러 50센트입니다.'],
      ['B', 'Here you are. Thank you.', '여기요. 감사합니다.'],
    ],
    keyWords: [['large', '큰'], ['iced', '얼음을 넣은, 차가운'], ['to go', '포장해 가는'], ['cent', '센트']],
    keyExpressions: [
      ['Can I get …, please?', '…로 주시겠어요?', '주문할 때 가장 무난한 표현이에요.'],
      ['For here or to go?', '드시고 가세요, 가져가세요?', '점원이 꼭 묻는 질문. To go, please. / For here, please.로 답해요.'],
    ],
    conceptIds: [],
    q1: { prompt: '손님이 주문한 음료는?', options: ['큰 사이즈 아이스 라테', '작은 사이즈 따뜻한 라테', '큰 사이즈 아메리카노', '아이스티'], answer: '큰 사이즈 아이스 라테', explanation: 'Can I get a large iced latte, please?' },
    q2: { prompt: '손님은 음료를 어떻게 하나요?', options: ['가져간다', '매장에서 마신다', '친구에게 선물한다', '주문을 취소한다'], answer: '가져간다', explanation: 'For here or to go? — To go, please.' },
    dictation: { line: 2, word: 'here', explanation: 'For here or to go? — 매장에서 드실지, 가져가실지 묻는 말이에요.' },
  }),
  SIT({
    id: 'sx-02',
    title: '호텔 체크인',
    situation: '호텔 프런트에서 체크인해요.',
    A: ['Clerk', 'male'],
    B: ['Ms. Lee', 'female'],
    lines: [
      ['A', 'Good evening. How can I help you?', '안녕하세요. 무엇을 도와드릴까요?'],
      ['B', "Hi, I'd like to check in. I have a reservation under Lee.", '안녕하세요, 체크인하려고요. 이(Lee)로 예약했어요.'],
      ['A', 'Yes, Ms. Lee. Three nights, right?', '네, 이 고객님. 3박 맞으시죠?'],
      ['B', "That's right. Is breakfast included?", '맞아요. 조식 포함인가요?'],
      ['A', 'Yes, it is. Breakfast is from seven to ten.', '네, 포함입니다. 조식은 7시부터 10시까지예요.'],
      ['B', 'Great. Thank you.', '좋네요. 감사합니다.'],
    ],
    keyWords: [['reservation', '예약'], ['night', '박, 밤'], ['breakfast', '아침 식사'], ['included', '포함된']],
    keyExpressions: [
      ["I'd like to check in.", '체크인하고 싶어요.', "I'd like to + 동사원형 = ~하고 싶어요(정중)."],
      ['Is breakfast included?', '조식 포함인가요?', '요금에 포함되는지 물을 때 써요.'],
    ],
    conceptIds: [],
    q1: { prompt: '손님은 며칠 묵나요?', options: ['3박', '1박', '2박', '일주일'], answer: '3박', explanation: 'Three nights, right? — That\'s right.' },
    q2: { prompt: '조식 시간은?', options: ['7시부터 10시까지', '6시부터 9시까지', '8시부터 11시까지', '조식은 포함되지 않는다'], answer: '7시부터 10시까지', explanation: 'Breakfast is from seven to ten.' },
    dictation: { line: 1, word: 'reservation', explanation: 'I have a reservation under Lee. — under + 이름 = ~의 이름으로.' },
  }),
  SIT({
    id: 'sx-03',
    title: '길 묻기',
    situation: '여행 중 길에서 미술관 가는 길을 물어요.',
    A: ['Sophie', 'female'],
    B: ['Local', 'male'],
    lines: [
      ['A', 'Excuse me. How do I get to the art museum?', '실례합니다. 미술관에 어떻게 가요?'],
      ['B', 'Go straight and turn left at the bank.', '쭉 가다가 은행에서 왼쪽으로 도세요.'],
      ['A', 'Is it within walking distance?', '걸어갈 수 있는 거리예요?'],
      ['B', "Yes, it's about ten minutes on foot.", '네, 걸어서 10분 정도예요.'],
      ['A', 'Thank you so much.', '정말 감사합니다.'],
      ['B', "You're welcome. Enjoy the museum!", '천만에요. 미술관 즐겁게 구경하세요!'],
    ],
    keyWords: [['straight', '똑바로'], ['turn left', '왼쪽으로 돌다'], ['on foot', '걸어서'], ['museum', '박물관, 미술관']],
    keyExpressions: [
      ['How do I get to …?', '…에 어떻게 가요?', '길을 물을 때 가장 기본적인 질문이에요.'],
      ['Is it within walking distance?', '걸어갈 수 있는 거리예요?', 'within = ~ 이내에.'],
    ],
    conceptIds: [],
    q1: { prompt: '어디에서 왼쪽으로 돌아야 하나요?', options: ['은행', '우체국', '병원', '지하철역'], answer: '은행', explanation: 'Go straight and turn left at the bank.' },
    q2: { prompt: '미술관까지 걸어서 얼마나 걸리나요?', options: ['10분 정도', '5분 정도', '20분 정도', '걸어갈 수 없다'], answer: '10분 정도', explanation: "Yes, it's about ten minutes on foot." },
    dictation: { line: 1, word: 'left', explanation: 'turn left = 왼쪽으로 돌다. 오른쪽은 right.' },
  }),
  SIT({
    id: 'sx-04',
    title: '옷 가게에서',
    situation: '옷 가게에서 사이즈를 묻고 입어 봐요.',
    A: ['Clerk', 'female'],
    B: ['Ryan', 'male'],
    lines: [
      ['A', 'Hi there. Can I help you find anything?', '안녕하세요. 찾으시는 것 있으세요?'],
      ['B', 'Yes. Do you have this shirt in a medium?', '네. 이 셔츠 미디엄 사이즈 있어요?'],
      ['A', 'Let me check. Yes, here you go.', '확인해 볼게요. 네, 여기 있어요.'],
      ['B', 'Thanks. Can I try it on?', '감사해요. 입어 봐도 돼요?'],
      ['A', 'Of course. The fitting room is over there.', '물론이죠. 탈의실은 저쪽이에요.'],
      ['B', 'It fits well. I\'ll take it.', '잘 맞네요. 이걸로 살게요.'],
    ],
    keyWords: [['medium', '중간 사이즈'], ['try on', '입어 보다'], ['fitting room', '탈의실'], ['fit', '(크기가) 맞다']],
    keyExpressions: [
      ['Can I try it on?', '입어 봐도 돼요?', '대명사 it은 try와 on 사이에 넣어요.'],
      ["I'll take it.", '이걸로 살게요.', '사기로 결정했을 때 쓰는 자연스러운 표현이에요.'],
    ],
    conceptIds: [],
    q1: { prompt: '손님이 찾는 사이즈는?', options: ['미디엄', '스몰', '라지', '엑스라지'], answer: '미디엄', explanation: 'Do you have this shirt in a medium?' },
    q2: { prompt: '결과적으로 손님은 어떻게 하나요?', options: ['잘 맞아서 산다', '너무 커서 사지 않는다', '다른 색으로 바꾼다', '환불한다'], answer: '잘 맞아서 산다', explanation: "It fits well. I'll take it." },
    dictation: { line: 5, word: 'take', explanation: "I'll take it. — 이걸로 살게요." },
  }),
  SIT({
    id: 'sx-05',
    title: '식당 예약 전화',
    situation: '전화로 주말 저녁 식당을 예약해요.',
    A: ['Host', 'male'],
    B: ['Jiyeon', 'female'],
    lines: [
      ['A', 'Good afternoon, Rosa Restaurant.', '안녕하세요, 로사 레스토랑입니다.'],
      ['B', "Hi, I'd like to book a table for Saturday.", '안녕하세요, 토요일에 자리를 예약하고 싶어요.'],
      ['A', 'Sure. For how many people?', '네. 몇 분이세요?'],
      ['B', 'Four people, at seven p.m.', '네 명이요, 저녁 7시요.'],
      ['A', 'Okay. Can I have your name, please?', '알겠습니다. 성함을 알려 주시겠어요?'],
      ['B', "It's Park. Thank you.", '박이에요. 감사합니다.'],
    ],
    keyWords: [['book', '예약하다'], ['table', '(식당) 자리'], ['people', '사람들'], ['p.m.', '오후']],
    keyExpressions: [
      ["I'd like to book a table for …", '…에 자리를 예약하고 싶어요.', 'book = reserve(예약하다).'],
      ['For how many people?', '몇 분이세요?', '인원을 묻는 질문이에요.'],
    ],
    conceptIds: [],
    q1: { prompt: '예약한 요일과 시간은?', options: ['토요일 저녁 7시', '금요일 저녁 7시', '토요일 낮 12시', '일요일 저녁 6시'], answer: '토요일 저녁 7시', explanation: "I'd like to book a table for Saturday. … at seven p.m." },
    q2: { prompt: '몇 명이 가나요?', options: ['4명', '2명', '6명', '7명'], answer: '4명', explanation: 'Four people, at seven p.m.' },
    dictation: { line: 1, word: 'book', explanation: 'book a table = 식당 자리를 예약하다.' },
  }),
  SIT({
    id: 'sx-06',
    title: '공항 체크인',
    situation: '공항 카운터에서 탑승 수속을 해요.',
    A: ['Agent', 'female'],
    B: ['Minsu', 'male'],
    lines: [
      ['A', 'Can I see your passport, please?', '여권 보여 주시겠어요?'],
      ['B', 'Here it is.', '여기 있어요.'],
      ['A', 'Thank you. How many bags are you checking?', '감사합니다. 짐은 몇 개 부치세요?'],
      ['B', 'Just one. Can I have a window seat?', '하나요. 창가 자리로 주실 수 있나요?'],
      ['A', 'Sure. Your gate is twelve, and boarding starts at ten thirty.', '네. 게이트는 12번이고 탑승은 10시 30분에 시작해요.'],
      ['B', 'Gate twelve at ten thirty. Got it.', '12번 게이트, 10시 30분. 알겠어요.'],
    ],
    keyWords: [['passport', '여권'], ['check (a bag)', '(짐을) 부치다'], ['gate', '탑승구'], ['boarding', '탑승']],
    keyExpressions: [
      ['How many bags are you checking?', '짐 몇 개 부치세요?', '공항 직원이 꼭 묻는 질문이에요.'],
      ['Can I have a window seat?', '창가 자리로 주실 수 있나요?', '통로 쪽은 aisle seat예요.'],
    ],
    conceptIds: [],
    q1: { prompt: '부치는 짐은 몇 개인가요?', options: ['1개', '2개', '3개', '없다'], answer: '1개', explanation: 'How many bags are you checking? — Just one.' },
    q2: { prompt: '탑승구와 탑승 시작 시간은?', options: ['12번, 10시 30분', '2번, 10시', '12번, 11시 30분', '20번, 10시 30분'], answer: '12번, 10시 30분', explanation: 'Your gate is twelve, and boarding starts at ten thirty.' },
    dictation: { line: 3, word: 'window', explanation: 'window seat = 창가 자리.' },
  }),
  SIT({
    id: 'sx-07',
    title: '약국에서',
    situation: '감기 증상을 말하고 약을 사요.',
    A: ['Pharmacist', 'male'],
    B: ['Yuri', 'female'],
    lines: [
      ['A', 'Hello. What can I do for you?', '안녕하세요. 무엇을 도와드릴까요?'],
      ['B', 'I have a bad cold. I have a sore throat and a runny nose.', '감기가 심해요. 목이 아프고 콧물이 나요.'],
      ['A', 'Do you have a fever?', '열도 있나요?'],
      ['B', "No, I don't.", '아니요, 없어요.'],
      ['A', 'Take this medicine three times a day after meals.', '이 약을 하루 세 번 식후에 드세요.'],
      ['B', 'Okay. Thank you.', '네. 감사합니다.'],
    ],
    keyWords: [['cold', '감기'], ['sore throat', '인후통'], ['runny nose', '콧물'], ['fever', '열']],
    keyExpressions: [
      ['I have a sore throat.', '목이 아파요.', '증상은 I have a + 증상으로 말해요.'],
      ['three times a day after meals', '하루 세 번 식후에', '복용법을 들을 때 꼭 알아야 하는 표현이에요.'],
    ],
    conceptIds: ['a1-present'],
    q1: { prompt: '손님의 증상은?', options: ['목이 아프고 콧물이 난다', '열이 나고 머리가 아프다', '배가 아프다', '기침과 열이 난다'], answer: '목이 아프고 콧물이 난다', explanation: 'I have a sore throat and a runny nose. 열은 없어요.' },
    q2: { prompt: '약은 어떻게 먹어야 하나요?', options: ['하루 세 번 식후', '하루 한 번 자기 전', '하루 두 번 식전', '아플 때만'], answer: '하루 세 번 식후', explanation: 'Take this medicine three times a day after meals.' },
    dictation: { line: 1, word: 'throat', explanation: 'sore throat = 목 아픔(인후통).' },
  }),
  SIT({
    id: 'sx-08',
    title: '회의 일정 바꾸기',
    situation: '동료에게 전화해 회의 시간을 바꿔요.',
    A: ['Sarah', 'female'],
    B: ['Tom', 'male'],
    lines: [
      ['A', "Hi, Tom. It's Sarah. Something came up. Could we reschedule our meeting?", '안녕 톰, 사라예요. 일이 좀 생겼어요. 회의 일정을 바꿀 수 있을까요?'],
      ['B', 'Sure. When are you free?', '그럼요. 언제 시간 되세요?'],
      ['A', 'How about Thursday at two?', '목요일 2시 어때요?'],
      ['B', "I'm afraid I can't make it then. Is three okay?", '그때는 어려울 것 같아요. 3시 괜찮아요?'],
      ['A', 'Three works for me.', '3시 괜찮아요.'],
      ['B', 'Great. See you on Thursday.', '좋아요. 목요일에 봬요.'],
    ],
    keyWords: [['reschedule', '일정을 다시 잡다'], ['free', '시간이 되는'], ['come up', '(일이) 생기다'], ['work for', '~에게 괜찮다']],
    keyExpressions: [
      ['Could we reschedule?', '일정을 바꿀 수 있을까요?', '정중하게 일정 변경을 요청해요.'],
      ["I'm afraid I can't make it.", '아쉽지만 어려울 것 같아요.', 'make it = 시간 맞춰 가다.'],
    ],
    conceptIds: [],
    q1: { prompt: '새로 정한 회의 시간은?', options: ['목요일 3시', '목요일 2시', '수요일 3시', '금요일 2시'], answer: '목요일 3시', explanation: 'Is three okay? — Three works for me.' },
    q2: { prompt: '사라가 전화한 이유는?', options: ['일이 생겨 회의 시간을 바꾸려고', '회의를 취소하려고', '회의 장소를 물으려고', '늦는다고 알리려고'], answer: '일이 생겨 회의 시간을 바꾸려고', explanation: 'Something came up. Could we reschedule our meeting?' },
    dictation: { line: 3, word: 'afraid', explanation: "I'm afraid I can't … — 유감이지만 ~할 수 없어요." },
  }),
  SIT({
    id: 'sx-09',
    title: '택시 타기',
    situation: '택시를 타고 기차역으로 가요.',
    A: ['Driver', 'male'],
    B: ['Hana', 'female'],
    lines: [
      ['A', 'Where to?', '어디로 모실까요?'],
      ['B', 'Please take me to Central Station.', '중앙역으로 가 주세요.'],
      ['A', 'Sure. Are you in a hurry?', '네. 급하세요?'],
      ['B', 'Yes. My train leaves at five.', '네. 기차가 5시에 출발해요.'],
      ['A', "Don't worry. We'll be there in fifteen minutes.", '걱정 마세요. 15분이면 도착해요.'],
      ['B', 'Thank you. Can I pay by card?', '감사해요. 카드로 계산해도 되나요?'],
    ],
    keyWords: [['station', '역'], ['in a hurry', '급한'], ['leave', '떠나다, 출발하다'], ['pay by card', '카드로 계산하다']],
    keyExpressions: [
      ['Please take me to …', '…로 가 주세요.', '택시 목적지를 말하는 기본 표현이에요.'],
      ['Are you in a hurry?', '급하세요?', 'be in a hurry = 서두르다, 급하다.'],
    ],
    conceptIds: ['a1-present'],
    q1: { prompt: '손님의 목적지는?', options: ['중앙역', '공항', '시청', '호텔'], answer: '중앙역', explanation: 'Please take me to Central Station.' },
    q2: { prompt: '목적지까지 걸리는 시간은?', options: ['15분', '5분', '50분', '30분'], answer: '15분', explanation: "We'll be there in fifteen minutes." },
    dictation: { line: 3, word: 'leaves', explanation: 'My train leaves at five. — 정해진 일정은 현재시제로 말해요 (3인칭 단수 leaves).' },
  }),
  SIT({
    id: 'sx-10',
    title: '환불 요청하기',
    situation: '어제 산 신발을 환불하러 가게에 왔어요.',
    A: ['Emily', 'female'],
    B: ['Clerk', 'male'],
    lines: [
      ['A', "Hi. I bought these shoes yesterday, but they're too small.", '안녕하세요. 어제 이 신발을 샀는데 너무 작아요.'],
      ['B', "I'm sorry about that. Do you want to exchange them?", '죄송합니다. 교환하시겠어요?'],
      ['A', "No, I'd like a refund, please.", '아니요, 환불받고 싶어요.'],
      ['B', 'Okay. Do you have the receipt?', '알겠습니다. 영수증 있으세요?'],
      ['A', 'Yes, here it is.', '네, 여기요.'],
      ['B', 'Thank you. The money will go back to your card.', '감사합니다. 돈은 카드로 다시 들어갈 거예요.'],
    ],
    keyWords: [['exchange', '교환하다'], ['refund', '환불'], ['receipt', '영수증'], ['too small', '너무 작은']],
    keyExpressions: [
      ["I'd like a refund, please.", '환불받고 싶어요.', '교환은 exchange, 환불은 refund예요.'],
      ['Do you have the receipt?', '영수증 있으세요?', '환불·교환 때 직원이 꼭 묻는 질문이에요.'],
    ],
    conceptIds: [],
    q1: { prompt: '신발의 문제는?', options: ['너무 작다', '너무 크다', '색이 마음에 안 든다', '망가졌다'], answer: '너무 작다', explanation: "they're too small." },
    q2: { prompt: '손님이 원하는 것은?', options: ['환불', '교환', '수선', '다른 색'], answer: '환불', explanation: "No, I'd like a refund, please." },
    dictation: { line: 2, word: 'refund', explanation: "I'd like a refund. — 환불받고 싶어요." },
  }),
];

export const lineAudio = (dialogueId: string, i: number) => `audio/listening/${dialogueId}-${i + 1}.mp3`;

function build(r: Raw): { dialogue: Dialogue; questions: Question[] } {
  const lines: DialogueLine[] = r.lines.map(([speaker, en, ko], i) => ({ speaker, en, ko, audio: lineAudio(r.id, i) }));
  const all = lines.map((l) => l.audio);
  const level = r.level ?? 'A1';
  const base = { level, unitId: r.id, area: 'listening' as const, role: 'listening' as const, dialogueId: r.id, wordIds: [], conceptIds: r.conceptIds };
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
      level,
      situational: !!r.situational,
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

const built = [...RAW, ...RAW_SITUATIONS].map(build);
export const dialogues: Dialogue[] = built.map((b) => b.dialogue);
export const listeningQuestions: Question[] = built.flatMap((b) => b.questions);
export const getDialogue = (id: string) => dialogues.find((d) => d.id === id);
