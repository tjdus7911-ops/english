# 데이터 구조 · 학습 로직

## 1. 콘텐츠 데이터 (정적, `src/data`)

| 엔티티 | 위치 | 설명 |
|---|---|---|
| Course | `data/index.ts` | 레벨별 코스, 레벨 can-do |
| Unit | `content/{a1,a2,b1,b2}.ts` | 대단원 (ready / preparing), 학습 목표·성취 기준 |
| Lesson | `data/index.ts#buildLessons` | 준비된 단원을 DAY로 변환 (단어 10 · 개념 1 · 연습 5 · 영작 2 · 테스트 2) |
| Vocabulary | `content/*.ts` + `content/wordExtras.ts` | 철자·품사·IPA·한글 참고·뜻·예문·해석·패턴·조합·혼동 표현·연결 개념 |
| GrammarConcept | `content/*.ts` + `content/lectures.ts` | 설명·구조·예문·오류 예문 + 목적·쉬운/자세한 설명·문장 분석·예문 더 보기·비교·선행 개념 |
| Question | `content/*.ts`, `placement.ts`, `wordQuiz.ts` | 유형·영역·정답·허용 답안·해설·오답 유형·보기별 오답 이유·관련 단어/개념·변형 원문항 |
| QuestionConcept | `data/index.ts#questionConcepts` | 문항-개념 다대다 연결 테이블 |

콘텐츠와 사용자 기록은 완전히 분리되어 있고, 사용자 기록은 콘텐츠를 id로만 참조한다.

## 2. 사용자 기록 (`src/store/useStore.ts`, localStorage `honja-english/v1`)

| 엔티티 | 필드 요약 | 향후 Supabase 테이블 |
|---|---|---|
| UserProfile | 목적, 하루 시간, 자가/코스/어휘/문법 레벨, 단어 목표, 복습 설정 | profiles |
| UserProgress | 완료 DAY, 건너뛴 단원, 개념 완료, 단어 상태·첫 학습일, 저장 단어, 이어서 위치 | progress |
| UserAnswer | 문항, 입력, 정오, 출처(course/free/review/wrong-note/placement/skip-test), 세션, 시각 | answers |
| WrongNote | 문항, 오답 횟수, 최초/최근 오답, 마지막 입력, 해결 여부 | wrong_notes |
| ReviewSchedule | key(`w:`/`c:`), 단계 0~5, 예정일, 생성일, 복습/정답 횟수, 누적·연속 오답, 마지막 결과 | review_items |
| ReviewEvent | 복습 항목, 문항, 유형, 정오, 복습 전 단계, 시각 | review_events |
| LearningSession | 유형, 라벨, 레벨, 시작/종료, 시간(최대 60분), 문항·정답 수 | sessions |
| ConceptCheck | 개념, 이해도 판정, 정답률, 시각 | concept_checks |
| NotifSettings / AppNotification | 동의·시간·종류 / dedupKey·제목·본문·이동 경로·읽음 | notification_settings / notifications |
| UserMastery | 답안에서 **계산되는 파생 데이터** (저장하지 않음) | (view) |

브라우저 데이터를 지우면 기록이 사라진다는 점을 MY 화면에 안내한다.

## 3. 자동 복습 로직 (`src/lib/review.ts`)

- 복습 항목은 **단어(w:)·문법 개념(c:) 단위로 키 하나씩**만 존재 → 같은 대상의 중복 일정이 생길 수 없음.
- 생성: 단어를 학습(카드 넘김·상태 표시)하거나 문법 강의를 열면 `stage 0, dueAt = 지금`(학습 당일 복습).
- 간격: `[0, 1, 3, 7, 14, 30]`일 (`config/policy.ts`).
- 복습 화면에서 기한이 된 항목을 풀었을 때:
  - 정답 → 단계 +1, 다음 예정일 = 오늘 0시 + 간격
  - 오답 → 단계 0, 내일 다시, 누적·연속 오답 +1
- 일반 학습 중 오답 → 관련 개념이 **오늘 바로** 복습 대상 (없으면 새로 생성). 정답은 일정 변화 없음.
- 기억 상태: 신규 학습 / 복습 필요 / 학습 진행 중 / 안정적으로 기억 중(7·14일 주기 통과, stage ≥ 4) / 재학습 필요(연속 오답 2회).
- 문제 유형 순환
  - 단어: 뜻 맞히기 → 영어 단어 입력 → 예문 빈칸 → 예문 해석 → 단어 배열 → 짧은 영작
  - 문법: 객관식 → 빈칸 → 오류 찾기 → 해석 → 배열 → 영작 (변형 문항 우선, 틀렸던 그 문장은 뒤로)
- 밀린 복습: 연속 오답 → 누적 오답 → 오래 밀린 순으로 하루 복습량만큼만 출제, 나머지는 기한을 유지한 채 다음 날로 이월. 밀린 항목도 정답이면 불이익 없이 다음 단계.

## 4. 학습량 추천 (`src/lib/recommend.ts`)

최근 7일 복습 답안 기준. 10문제 미만이면 조정하지 않음.

| 복습 정답률 | 제안 |
|---|---|
| ≥ 90% | 신규 단어 ×1.2 (소폭 증가 제안) |
| 70~89% | 유지 |
| 50~69% | ×0.8 |
| < 50% | ×0.6 + 반복 오답 개념 복습 추천 |

추천은 이유와 함께 표시하고, 사용자가 [추천대로] / [그대로] / [직접 변경] 중 선택한다. 모든 수치는 `POLICY.load`에서 조정한다.

## 5. 알림 (`src/lib/notifications.ts`)

| 종류 | 조건 | dedupKey | 이동 |
|---|---|---|---|
| 매일 학습 시작 | 설정 시간 이후, 오늘 답안 없음 | `daily-start:날짜` | /home |
| 다음 날 복습 | 어제 생성된 단어 항목이 기한 도래 | `next-day:날짜` | /review?kind=word |
| 복습 예정 항목 | 기한 도래 개념(최대 2개) + 요약 1건 | `due:항목키:예정일`, `due-summary:날짜` | /review?focus=항목키 |
| 미완료 학습 | 시작한 DAY가 6시간 넘게 미완료 | `incomplete:DAY:날짜` | 해당 DAY |

전달된 dedupKey는 저장되어 같은 알림이 두 번 생성되지 않는다. 같은 복습 항목이 며칠 밀려도 예정일이 같으면 키가 같아 다시 알리지 않는다.

플랫폼 구분: 웹(구현) = 앱 실행 중 계산해 앱 내부 알림함·배너 / Android(미구현) = `NotificationScheduler` 인터페이스에 Capacitor Local Notifications 구현체를 붙여 `nextFireTime()` 시각에 OS 알림 예약 예정.

## 6. 설명 데이터와 질문 기능 분리 (`src/lib/tutor.ts`)

문법 설명은 `content/lectures.ts`의 순수 데이터이고, "쉽게/자세히/예문/비교/이해가 안 돼요" 요청은 `TutorProvider.explain()`을 거친다. 현재 구현체는 `curatedTutor`(검수된 설명 반환)이며, AI 튜터 연결 시 `tutor` 상수만 교체하면 된다.
