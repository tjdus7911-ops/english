# 혼자영어 (가칭)

혼자 공부해도 다음에 무엇을 공부해야 하는지 알려주는 **CEFR A1~B2 영어 독학 웹앱 (MVP)**.
진단 → 추천 커리큘럼 → 복습 우선 학습 → 오답 원인 분석 → 자동 복습 → 실력 지도로 이어지는 흐름을 실제 데이터와 함께 구현했습니다.
A1에는 실제 재생되는 음성(합성)으로 듣기 대화 10편과 따라 말하기 30문장(녹음·음성 인식 비교)이 있고,
자유학습의 **표현 학습관**에는 회화·여행·비즈니스·구동사 표현 150개와 상황별 듣기·말하기 10편이 있습니다.

## 실행 방법

```bash
npm install
npm run dev          # 개발 서버 (http://localhost:5173)
npm run build        # 타입 검사 + 프로덕션 빌드 (dist/)
npm run preview      # 빌드 결과 미리보기
npm test             # 단위·콘텐츠 검증 테스트 (Vitest)
npm run test:e2e     # 주요 플로우 + 듣기·말하기 + 표현 학습관 E2E (빌드 후 실행, Playwright 필요)
npm run typecheck    # 앱 + 테스트 타입 검사
```

- Node 20 이상. 라우팅은 HashRouter라 정적 호스팅(GitHub Pages 등)이나 Capacitor에 그대로 올릴 수 있습니다.
- E2E는 `playwright` 패키지와 Chromium이 설치된 환경에서 실행됩니다 (`npm i -D playwright && npx playwright install chromium`).

## 기술 스택
React 19 · TypeScript · Vite 6 · Tailwind CSS 3 · React Router 6 (Hash) · Zustand (persist → localStorage) · Vitest · Playwright

## 폴더 구조
```
src/
  config/policy.ts     복습 간격·학습량·이해도·알림 기준값 (초기 가설, 조정 가능)
  data/                콘텐츠 (레벨별 단어·개념·문항, 강의 보강, 단어 보강, 레벨 테스트, 자동 단어 문항)
  lib/                 채점, 복습 엔진, 추천, 이해도 판정, 알림, 튜터 인터페이스, 분석
  store/useStore.ts    사용자 학습 기록 (localStorage)
  components/ pages/   UI
docs/                  서비스 설계 · 데이터/로직 · UI 가이드 · 콘텐츠 검수 기록
e2e/                   E2E 시나리오 (run · voice · expressions)
scripts/               합성 음성 생성 스크립트
public/audio/          합성 음성 mp3 (CREDITS.md에 출처)
```

## 문서
- [서비스 설계 (IA · 플로우 · 화면 · 기능정의)](docs/01-service-design.md)
- [데이터 구조 · 학습 로직](docs/02-data-and-logic.md)
- [UI/UX 디자인 시스템](docs/03-ui-guide.md)
- [콘텐츠 현황 · 검수 기록](docs/04-content-review.md)
- [듣기 · 말하기 (음성·마이크·지원 범위·테스트)](docs/05-listening-speaking.md)
- [표현 학습관 (콘텐츠 수·검수·영상 권리 기록)](docs/06-expression-hall.md)

## 알려진 제한
- 학습 기록은 브라우저(localStorage)에만 저장됩니다. 회원가입·동기화는 아직 없습니다.
- 알림은 앱이 열려 있을 때 앱 내부 알림함·배너로만 동작합니다. 앱 종료 상태 푸시 / Android 로컬 알림은 미구현입니다.
- 영작은 정답형 채점입니다. 자유 영작 첨삭과 AI 튜터는 미구현입니다.
- 각 레벨은 대표 단원 1개만 학습 가능하고 나머지 단원은 '콘텐츠 준비 중'입니다.
- 콘텐츠는 자동 검증을 통과했지만 교육 전문가 최종 검수는 받지 않았습니다.
- 영상 속 영어(오리지널 미니 드라마 3편)는 영상 에셋이 없어 '준비 중'입니다. 캐릭터 경험치·영어 마을 보상은 범위에서 제외했습니다.
- 음성은 합성 음성(Piper TTS, LibriTTS CC BY 4.0)이며 사람의 청취 검수가 필요합니다. 음성 인식은 자동 테스트에서 모의 인식기로만 검증했고 실기기 확인이 필요합니다. 발음 평가는 준비 중입니다.
