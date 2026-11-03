import type { MiniDrama } from '../../types';

/**
 * 오리지널 미니 드라마 (제작 대상 3편).
 * 영상 에셋이 아직 없으므로 status = 'planned', video = null → 앱에서는 '준비 중'으로만 표시한다.
 * 제3자 영화·드라마 클립은 사용하지 않는다. 아래 rights 기록은 공개 전 반드시 채워야 한다.
 */
export const miniDramas: MiniDrama[] = [
  {
    id: 'md-01',
    title: '첫 출근 날',
    level: 'A2',
    durationSec: 45,
    synopsis: '첫 출근한 소라가 엘리베이터에서 팀장님을 알아보지 못하고 인사하는 이야기.',
    status: 'planned',
    video: null,
    scriptDraft: [
      { speaker: 'Sora', en: 'Excuse me. Is this the fifth floor?', ko: '실례합니다. 여기 5층인가요?' },
      { speaker: 'Mark', en: "Yes, it is. Are you the new designer?", ko: '네. 새로 온 디자이너세요?' },
      { speaker: 'Sora', en: "Yes! Today is my first day. I'm a little nervous.", ko: '네! 오늘이 첫날이에요. 조금 긴장돼요.' },
      { speaker: 'Mark', en: "Don't worry. I'm Mark, your team leader.", ko: '걱정 마세요. 저는 팀장 마크예요.' },
      { speaker: 'Sora', en: 'Oh! Nice to meet you. Sorry, I didn\'t know.', ko: '아! 만나서 반갑습니다. 죄송해요, 몰랐어요.' },
      { speaker: 'Mark', en: "It's not a big deal. Welcome to the team!", ko: '별일 아니에요. 팀에 온 걸 환영해요!' },
    ],
    keyExpressionIds: ['ex-es-007', 'ex-es-046'],
    rights: { source: 'original', owner: '혼자영어 (자체 제작 예정)', license: '자체 저작물 — 제작·출연 계약 시 확정', thirdPartyMaterial: false, checkedAt: null, checkedBy: null, note: '촬영 전. 출연자 초상권·음원 라이선스 확인 필요.' },
  },
  {
    id: 'md-02',
    title: '카페에서 생긴 일',
    level: 'A2',
    durationSec: 50,
    synopsis: '주문이 바뀐 음료 때문에 두 손님이 대화를 시작하는 이야기.',
    status: 'planned',
    video: null,
    scriptDraft: [
      { speaker: 'Jake', en: 'Excuse me. I think this is your latte.', ko: '저기요. 이거 당신 라테 같아요.' },
      { speaker: 'Emma', en: 'Oh, you have my drink! Here, this is your americano.', ko: '아, 제 음료를 갖고 계셨네요! 여기, 이게 당신 아메리카노예요.' },
      { speaker: 'Jake', en: 'Thanks a lot. Do you come here often?', ko: '정말 고마워요. 여기 자주 오세요?' },
      { speaker: 'Emma', en: 'Every morning. It\'s on my way to work.', ko: '매일 아침요. 출근길이에요.' },
      { speaker: 'Jake', en: 'Me too. See you tomorrow, then!', ko: '저도요. 그럼 내일 봬요!' },
    ],
    keyExpressionIds: ['ex-es-005', 'ex-es-041'],
    rights: { source: 'original', owner: '혼자영어 (자체 제작 예정)', license: '자체 저작물 — 제작·출연 계약 시 확정', thirdPartyMaterial: false, checkedAt: null, checkedBy: null, note: '촬영 장소 이용 허락 필요.' },
  },
  {
    id: 'md-03',
    title: '마감 전날',
    level: 'B1',
    durationSec: 60,
    synopsis: '프로젝트 마감 전날, 팀원들이 일정을 조율하고 서로 돕는 이야기.',
    status: 'planned',
    video: null,
    scriptDraft: [
      { speaker: 'Lisa', en: "What's the deadline for the report?", ko: '보고서 마감이 언제예요?' },
      { speaker: 'Ben', en: "It's due tomorrow morning. We're running out of time.", ko: '내일 오전까지예요. 시간이 별로 없어요.' },
      { speaker: 'Lisa', en: "Don't worry. I'm on it. Could you send me the file?", ko: '걱정 마세요. 제가 바로 할게요. 파일 보내 줄래요?' },
      { speaker: 'Ben', en: "Sure. I'll keep you posted on the numbers.", ko: '그럼요. 수치는 계속 공유할게요.' },
      { speaker: 'Lisa', en: "Great. Let's wrap up by nine.", ko: '좋아요. 9시까지 마무리해요.' },
    ],
    keyExpressionIds: ['ex-bz-010', 'ex-bz-011', 'ex-bz-017', 'ex-bz-018'],
    rights: { source: 'original', owner: '혼자영어 (자체 제작 예정)', license: '자체 저작물 — 제작·출연 계약 시 확정', thirdPartyMaterial: false, checkedAt: null, checkedBy: null, note: 'AI 생성 영상으로 제작 시 생성 도구 이용약관의 상업적 이용·편집 허용 여부 기록 필요.' },
  },
];
