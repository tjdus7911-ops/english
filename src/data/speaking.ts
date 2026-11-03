import type { SpeakingSentence } from '../types';

/** A1 따라 말하기 30문장 (자체 작성). 음성은 합성 음성 mp3. */
const RAW: [en: string, ko: string, conceptId?: string, dialogueId?: string, tip?: string][] = [
  ["I'm a student.", '나는 학생이에요.', 'a1-be', 'l-a1-01', "I'm은 I와 am을 이어서 한 덩어리로 말해요."],
  ['Nice to meet you.', '만나서 반가워요.', undefined, 'l-a1-01', 'meet you는 끊지 않고 부드럽게 이어 말해요.'],
  ['Where are you from?', '어디에서 왔어요?', 'a1-be', 'l-a1-02', '의문사 의문문은 끝을 내려 말하는 경우가 많아요.'],
  ["I'm from Korea.", '저는 한국에서 왔어요.', 'a1-be', 'l-a1-02'],
  ['Are you busy now?', '지금 바빠요?', 'a1-be', 'l-a1-03', 'Yes/No 질문은 보통 끝을 올려 말해요.'],
  ["I'm tired and hungry.", '피곤하고 배고파요.', 'a1-be', 'l-a1-03'],
  ['My sister is a teacher.', '우리 언니는 선생님이에요.', 'a1-be'],
  ["They're my parents.", '이분들은 우리 부모님이에요.', 'a1-be', 'l-a1-04', "They're는 their, there와 소리가 같아요."],
  ["He isn't a teacher.", '그는 선생님이 아니에요.', 'a1-be', 'l-a1-04'],
  ['Today is my first day.', '오늘이 첫날이에요.', 'a1-be', 'l-a1-05'],
  ["You're very kind.", '정말 친절하시네요.', 'a1-be', 'l-a1-05'],
  ['Seoul is a big city.', '서울은 큰 도시예요.', 'a1-be'],
  ['What time do you get up?', '몇 시에 일어나요?', 'a1-present', 'l-a1-06'],
  ['I usually get up at seven.', '저는 보통 7시에 일어나요.', 'a1-present', 'l-a1-06', 'get up은 "겟업"처럼 이어서 들려요.'],
  ["I don't eat breakfast.", '저는 아침을 안 먹어요.', 'a1-present', 'l-a1-06'],
  ['What do you do?', '무슨 일 하세요?', 'a1-present', 'l-a1-07'],
  ['I work at a hotel.', '저는 호텔에서 일해요.', 'a1-present', 'l-a1-07'],
  ['I rest on Mondays.', '저는 월요일에 쉬어요.', 'a1-present', 'l-a1-07'],
  ['Do you live in Seoul?', '서울에 살아요?', 'a1-present', 'l-a1-08'],
  ['I live in Incheon.', '저는 인천에 살아요.', 'a1-present', 'l-a1-08'],
  ['I take the subway to work.', '저는 지하철로 출근해요.', 'a1-present', 'l-a1-08'],
  ['Does your sister like K-pop?', '여동생이 K-pop을 좋아해요?', 'a1-present', 'l-a1-09'],
  ['She studies Japanese.', '그녀는 일본어를 공부해요.', 'a1-present', 'l-a1-09', 'studies의 끝 -s 소리를 살려 말해요.'],
  ['She sings very well.', '그녀는 노래를 정말 잘해요.', 'a1-present', 'l-a1-09'],
  ['What do you usually do on Sundays?', '일요일에 보통 뭐 해요?', 'a1-present', 'l-a1-10'],
  ['I clean my room on Sundays.', '저는 일요일에 방을 청소해요.', 'a1-present', 'l-a1-10'],
  ["He doesn't like sports.", '그는 운동을 좋아하지 않아요.', 'a1-present', 'l-a1-10'],
  ['He drinks coffee every morning.', '그는 매일 아침 커피를 마셔요.', 'a1-present'],
  ['We watch movies on Fridays.', '우리는 금요일마다 영화를 봐요.', 'a1-present'],
  ["Let's get something to eat.", '뭐 좀 먹자.', undefined, 'l-a1-03'],
];

export const speakingSentences: SpeakingSentence[] = RAW.map(([en, ko, conceptId, dialogueId, tip], i) => {
  const id = `s-a1-${String(i + 1).padStart(2, '0')}`;
  return { id, level: 'A1', en, ko, conceptId, dialogueId, tip, audio: `audio/speaking/${id}.mp3` };
});

export const getSpeaking = (id: string) => speakingSentences.find((s) => s.id === id);
