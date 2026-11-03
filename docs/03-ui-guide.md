# UI/UX 디자인 시스템

## 토큰 (`tailwind.config.js`)
| 토큰 | 값 | 용도 |
|---|---|---|
| brand | #E9513B (dark #C93D29, soft #FDEDEA) | 주요 CTA, 진행률, 강조 |
| ink | #222222 / sub #777777 / mute #A8A8A8 | 본문 / 보조 / 비활성 |
| surface | #F6F6F7 | 보조 배경 (기본 배경 white) |
| line | #EBEBEB | 구분선, 카드 테두리 |
| ok / bad / warn | #1F8A5B / #C6362B / #B26A00 (+soft) | 정답 / 오답 / 주의 |
| 폰트 | Pretendard Variable → 시스템 sans-serif 대체 | |
| 라운드 | 카드 16px, 버튼 pill | |

그림자·그라데이션은 쓰지 않고(모달·배너만 최소한의 그림자), 보라색 계열 AI 스타일과 캐릭터·게임 요소를 피했다.

## 공통 컴포넌트 (`src/components`)
Header(뒤로 규칙 포함) · BottomNav · Page · ProgressBar · Segmented · ListRow · Stat · Modal(바텀시트) · Toast · EmptyState · LevelBadge · Icon · SpeakButton · WordCard · GrammarView · QuestionView(6유형) · QuestionRunner · ResultSummary · UnderstandingPanel · NotificationRunner(배너)

## 원칙
- 본문 15px, 보조 13~14px, 제목 17~22px.
- 터치 영역 최소 44px (주요 버튼 48px).
- 정답/오답/선택 상태는 **색 + 아이콘 + 텍스트**("정답", "내 선택", ✓/✗)로 구분.
- 한 화면에 하나의 주요 CTA(brand), 보조 동작은 흰 버튼·텍스트 버튼.
- `word-break: keep-all`로 한국어 줄바꿈, 영어는 `overflow-wrap: anywhere`.

## 반응형 정책
- 모바일 우선, 최대 폭 480px 중앙 정렬 (태블릿·데스크톱에서도 앱 비율 유지).
- 320px 폭까지 가로 넘침 없음 (E2E로 8개 화면 검사).
- 하단 내비게이션 고정 + `safe-area-inset-bottom` 대응, 몰입형 학습 화면은 내비게이션 숨김.
- 알림 배너는 헤더 아래에 표시되고 6초 뒤 자동으로 사라지며, 학습 중 화면에서는 띄우지 않는다.
