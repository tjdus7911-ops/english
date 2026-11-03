import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GrammarView } from '../components/GrammarView';
import { Icon } from '../components/Icon';
import { QuestionRunner, ResultSummary, type RunResult } from '../components/QuestionRunner';
import { UnderstandingPanel } from '../components/UnderstandingPanel';
import { WordCard } from '../components/WordCard';
import { EmptyState, Header, Modal, Page, ProgressBar } from '../components/ui';
import { allLessons, getConcept, getLesson, getUnit, getWord } from '../data';
import { buildPlan, estimateMinutes, isLessonUnlocked, isUnitUnlocked } from '../lib/course';
import { buildReviewQueue } from '../lib/review';
import { judgeUnderstanding, type CheckOutcome } from '../lib/understanding';
import { useLearningSession } from '../lib/useSession';
import { startOfDay } from '../lib/util';
import { useStore } from '../store/useStore';
import { DialoguePlayer } from '../components/AudioPlayer';
import { SpeakingPractice } from '../components/SpeakingPractice';
import { dialogues } from '../data/listening';
import { speakingSentences } from '../data/speaking';
import { getQuestion } from '../data';

type Step = 'intro' | 'review' | 'words' | 'quiz' | 'grammar' | 'vocab' | 'check' | 'judge' | 'extra' | 'listen' | 'listenQ' | 'speak' | 'writing' | 'test' | 'done';

const STEP_LABEL: Record<Step, string> = {
  intro: '준비',
  review: '먼저 복습',
  words: '신규 단어',
  quiz: '단어 퀴즈',
  grammar: '문법 강의',
  vocab: '어휘 연습',
  check: '단계별 연습',
  judge: '이해도 확인',
  extra: '추가 연습',
  listen: '대화 듣기',
  listenQ: '듣기 이해도',
  speak: '따라 말하기',
  writing: '직접 영작하기',
  test: '마무리 테스트',
  done: '완료',
};

export default function LessonSession() {
  const { lessonId = '' } = useParams();
  // DAY가 바뀌면 화면 상태를 새로 시작
  return <LessonSessionInner key={lessonId} lessonId={lessonId} />;
}

function LessonSessionInner({ lessonId }: { lessonId: string }) {
  const navigate = useNavigate();
  const lesson = getLesson(lessonId);
  const store = useStore();
  const { profile, progress } = store;

  // 세션 시작 시점의 설정·복습 목록을 고정 (풀이 중 목록이 바뀌지 않도록)
  const [plan] = useState(() => (lesson ? buildPlan(lesson, useStore.getState().profile) : null));
  const [reviewItems] = useState(() => {
    const s = useStore.getState();
    if (!plan || plan.reviewLimit === 0) return [];
    const doneToday = Object.values(s.reviews).filter((r) => r.lastReviewedAt && r.lastReviewedAt >= startOfDay(Date.now())).length;
    return buildReviewQueue(s.reviews, s.wrongNotes, s.answers, Math.min(plan.reviewLimit, Math.max(0, s.profile.reviewPerDay - doneToday)), Date.now());
  });

  // 문법과 연결된 대화(아직 안 들은 것 우선)와 그 대화의 핵심 문장 2개
  const [listen] = useState(() => {
    if (!lesson) return null;
    const recs = useStore.getState().listeningRecords;
    const cands = dialogues.filter((d) => d.conceptIds.includes(lesson.conceptId));
    const d = cands.find((x) => !recs[x.id]) ?? cands[0];
    if (!d) return null;
    return { d, questions: d.questionIds.map((id) => getQuestion(id)!), sentences: speakingSentences.filter((x) => x.dialogueId === d.id).slice(0, 2) };
  });
  const [speakIdx, setSpeakIdx] = useState(0);
  const [step, setStep] = useState<Step>('intro');
  const [wordIdx, setWordIdx] = useState(0);
  const [results, setResults] = useState<RunResult[]>([]);
  const [checkRes, setCheckRes] = useState<RunResult[]>([]);
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);
  const [easyMode, setEasyMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [quit, setQuit] = useState(false);
  const unit = lesson ? getUnit(lesson.unitId) : undefined;
  const concept = lesson ? getConcept(lesson.conceptId) : undefined;
  const { getId, finish } = useLearningSession('course', lesson ? `${unit?.title} DAY ${lesson.day}` : '코스 학습', lesson?.level);

  const flow = useMemo<Step[]>(() => {
    if (!plan) return [];
    const st: Step[] = ['intro'];
    if (reviewItems.length) st.push('review');
    st.push('words');
    if (plan.wordQuiz.length) st.push('quiz');
    st.push('grammar');
    if (plan.vocabPractice.length) st.push('vocab');
    st.push('check', 'judge');
    if (listen) {
      st.push('listen', 'listenQ');
      if (listen.sentences.length) st.push('speak');
    }
    if (plan.writing.length) st.push('writing');
    st.push('test', 'done');
    return st;
  }, [plan, reviewItems.length, listen]);

  useEffect(() => {
    if (lesson && unit) store.setLastLocation(`/course/lesson/${lesson.id}`, `${lesson.level} ${unit.title} · DAY ${lesson.day}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  if (!lesson || !plan || !unit || !concept)
    return (
      <div className="min-h-screen">
        <Header title="학습" back="/course" />
        <Page>
          <EmptyState title="학습을 찾을 수 없어요" action={<button className="btn-secondary" onClick={() => navigate('/course')}>코스로 가기</button>} />
        </Page>
      </div>
    );

  if (!isUnitUnlocked(unit, progress) || !isLessonUnlocked(lesson, progress))
    return (
      <div className="min-h-screen">
        <Header title={`DAY ${lesson.day}`} back={`/course/unit/${unit.id}`} />
        <Page>
          <EmptyState icon="lock" title="아직 열리지 않은 학습이에요" desc="이전 DAY를 먼저 완료하거나 건너뛰기 테스트를 통과해 주세요." action={<button className="btn-secondary" onClick={() => navigate(`/course/unit/${unit.id}`, { replace: true })}>단원으로</button>} />
        </Page>
      </div>
    );

  const go = (next?: Step) => {
    const base: Step = step === 'extra' ? 'judge' : step;
    const n = next ?? flow[flow.indexOf(base) + 1];
    if (n === 'grammar') store.markConceptStudied(concept.id);
    if (n === 'done') {
      store.completeLesson(lesson.id);
      finish();
    }
    setStep(n);
    window.scrollTo({ top: 0 });
  };
  const addResults = (r: RunResult[]) => setResults((prev) => [...prev, ...r]);
  const stepIdx = flow.indexOf(step === 'extra' ? 'judge' : step);
  const nextLessonInUnit = allLessons.find((l) => l.unitId === lesson.unitId && l.day === lesson.day + 1);
  const judge = (r: RunResult[]) => {
    const o = judgeUnderstanding(r.map((x) => ({ correct: x.correct, mistakeType: x.question.mistakeType })));
    store.recordConceptCheck(concept.id, o.result, o.rate);
    setOutcome(o);
  };
  const check = useStore.getState().conceptChecks[concept.id];

  return (
    <div className="min-h-screen bg-white">
      <Header
        title={`DAY ${lesson.day} · ${STEP_LABEL[step]}`}
        sub={`${lesson.level} ${unit.title}`}
        onBack={() => (step === 'intro' || step === 'done' ? navigate(`/course/unit/${unit.id}`, { replace: true }) : setQuit(true))}
      />
      {step !== 'intro' && step !== 'done' && (
        <div className="px-4 pt-3">
          <ProgressBar value={stepIdx} max={flow.length - 1} label="학습 단계 진행률" />
        </div>
      )}
      <main className="px-4 py-4 pb-12 space-y-4">
        {step === 'intro' && (
          <>
            <section className="card p-5 bg-surface border-none">
              <p className="text-sm text-ink-sub">오늘 배울 문법</p>
              <h2 className="text-xl font-bold mt-0.5">{concept.title}</h2>
              <p className="text-sm mt-2">{concept.goal}</p>
            </section>
            <ol className="card divide-y divide-line">
              {flow
                .filter((s) => !['intro', 'done', 'judge'].includes(s))
                .map((s, i) => {
                  const count: Partial<Record<Step, string>> = {
                    review: `${reviewItems.length}문제`,
                    words: `${plan.wordIds.length}개`,
                    quiz: `${plan.wordQuiz.length}문제`,
                    grammar: '강의 1',
                    vocab: `${plan.vocabPractice.length}문제`,
                    check: `${plan.check.length}문제`,
                    listen: '대화 1',
                    listenQ: `${listen?.questions.length ?? 0}문제`,
                    speak: `${listen?.sentences.length ?? 0}문장`,
                    writing: `${plan.writing.length}문제`,
                    test: `${plan.test.length}문제`,
                  };
                  return (
                    <li key={s} className="flex items-center gap-3 px-4 py-3">
                      <span className="w-7 h-7 rounded-full bg-brand-soft text-brand-dark text-sm font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="flex-1 font-medium">{STEP_LABEL[s]}</span>
                      <span className="text-sm text-ink-sub">{count[s]}</span>
                    </li>
                  );
                })}
            </ol>
            {plan.deferredWordIds.length > 0 && (
              <p className="text-xs text-ink-sub">하루 신규 단어 목표({profile.dailyWordGoal}개)에 맞춰 단어 {plan.deferredWordIds.length}개는 자유학습 '오늘의 단어'로 미뤘어요.</p>
            )}
            <p className="text-sm text-ink-sub flex items-center gap-1">
              <Icon name="clock" size={16} />
              예상 {estimateMinutes(plan, reviewItems.length)}분 ({profile.dailyMinutes}분 코스) · 푼 문제는 바로 저장돼요
            </p>
            <button type="button" className="btn-primary w-full" onClick={() => go()}>
              학습 시작
            </button>
          </>
        )}

        {step === 'review' && (
          <>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-ink-sub">새로 배우기 전에, 기억할 때가 된 내용부터 확인해요.</p>
              <button type="button" className="text-sm text-ink-sub underline min-h-[40px] shrink-0" onClick={() => go()}>
                건너뛰기
              </button>
            </div>
            <QuestionRunner
              questions={reviewItems.map((r) => r.question)}
              reviewKeys={reviewItems.map((r) => r.key)}
              source="review"
              getSessionId={getId}
              finishLabel="신규 단어로"
              onFinish={() => go()}
            />
          </>
        )}

        {step === 'words' && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-sub">
                새 단어 {wordIdx + 1} / {plan.wordIds.length}
              </span>
              <span className="text-ink-sub">모르면 '모름'으로 표시해 두세요</span>
            </div>
            <WordCard key={plan.wordIds[wordIdx]} w={getWord(plan.wordIds[wordIdx])!} linkConcept={false} />
            <div className="flex gap-2">
              <button type="button" className="btn-secondary flex-1" disabled={wordIdx === 0} onClick={() => setWordIdx(wordIdx - 1)}>
                이전
              </button>
              <button
                type="button"
                className="btn-primary flex-[2]"
                onClick={() => {
                  store.markWordsSeen([plan.wordIds[wordIdx]]);
                  if (wordIdx < plan.wordIds.length - 1) setWordIdx(wordIdx + 1);
                  else go();
                }}
              >
                {wordIdx < plan.wordIds.length - 1 ? '다음 단어' : plan.wordQuiz.length ? '단어 퀴즈로' : '문법 강의로'}
              </button>
            </div>
          </>
        )}

        {step === 'quiz' && <QuestionRunner questions={plan.wordQuiz} source="course" getSessionId={getId} finishLabel="문법 강의로" onFinish={(r) => (addResults(r), go())} />}

        {step === 'grammar' && (
          <>
            <GrammarView key={easyMode ? 'easy' : 'normal'} c={concept} initialMode={easyMode ? 'easy' : null} />
            <p className="text-xs text-ink-sub">강의를 읽는 것만으로는 학습 완료가 되지 않아요. 다음 단계의 확인 문제로 이해도를 확인해요.</p>
            <button type="button" className="btn-primary w-full" onClick={() => go(retryCount > 0 ? 'check' : undefined)}>
              {retryCount > 0 ? '확인 문제 다시 풀기' : plan.vocabPractice.length ? '어휘 연습으로' : '단계별 연습 시작'}
            </button>
          </>
        )}

        {step === 'vocab' && <QuestionRunner questions={plan.vocabPractice} source="course" getSessionId={getId} finishLabel="단계별 연습으로" onFinish={(r) => (addResults(r), go())} />}

        {step === 'check' && (
          <>
            <p className="text-sm text-ink-sub">1단계 기초(객관식·빈칸) → 2단계 응용(오류 찾기) 순서로 풀어요. 결과로 이해도를 판단해요.</p>
            <QuestionRunner
              key={`check-${retryCount}`}
              questions={plan.check}
              source="course"
              getSessionId={getId}
              finishLabel="이해도 확인"
              onFinish={(r) => {
                addResults(r);
                setCheckRes(r);
                judge(r);
                go('judge');
              }}
            />
          </>
        )}

        {step === 'judge' && outcome && (
          <UnderstandingPanel
            outcome={outcome}
            concept={concept}
            extraAvailable={plan.extra.length > 0}
            onNext={() => go(flow[flow.indexOf('judge') + 1])}
            onExtra={() => go('extra')}
            onBasics={() => {
              setEasyMode(true);
              setRetryCount((n) => n + 1);
              go('grammar');
            }}
          />
        )}

        {step === 'extra' && (
          <>
            <p className="text-sm text-ink-sub">같은 개념을 다른 문장으로 한 번 더 연습해요.</p>
            <QuestionRunner
              questions={plan.extra}
              source="course"
              getSessionId={getId}
              finishLabel="결과 확인"
              onFinish={(r) => {
                addResults(r);
                const merged = [...checkRes, ...r];
                setCheckRes(merged);
                judge(merged);
                setStep('judge');
              }}
            />
          </>
        )}

        {step === 'listen' && listen && (
          <>
            <p className="text-sm text-ink-sub">방금 배운 문법이 실제 대화에서 어떻게 쓰이는지 들어 봐요. 처음엔 스크립트를 숨기고 들어 보세요.</p>
            <h2 className="font-bold text-lg">{listen.d.title}</h2>
            <DialoguePlayer d={listen.d} />
            <button type="button" className="btn-primary w-full" onClick={() => go()}>
              듣기 문제 풀기
            </button>
          </>
        )}

        {step === 'listenQ' && listen && (
          <QuestionRunner
            questions={listen.questions}
            source="course"
            getSessionId={getId}
            finishLabel={listen.sentences.length ? '따라 말하기로' : '영작으로'}
            onFinish={(r) => {
              addResults(r);
              store.recordListening(listen.d.id, r.filter((x) => x.correct).length, r.length);
              go();
            }}
          />
        )}

        {step === 'speak' && listen && listen.sentences[speakIdx] && (
          <>
            <p className="text-sm text-ink-sub">
              대화의 핵심 문장을 따라 말해요 ({speakIdx + 1}/{listen.sentences.length}). 마이크를 쓸 수 없으면 예시 음성만 듣고 넘어가도 돼요.
            </p>
            <SpeakingPractice key={listen.sentences[speakIdx].id} s={listen.sentences[speakIdx]} />
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => {
                if (speakIdx < listen.sentences.length - 1) setSpeakIdx(speakIdx + 1);
                else go();
              }}
            >
              {speakIdx < listen.sentences.length - 1 ? '다음 문장' : plan.writing.length ? '영작으로' : '마무리 테스트로'}
            </button>
          </>
        )}

        {step === 'writing' && (
          <>
            <p className="text-sm text-ink-sub">오늘 배운 단어와 문법으로 직접 문장을 만들어 봐요. 정답형 채점이라, 다른 표현을 썼는데 오답으로 나오면 모범 답안과 비교해 보세요.</p>
            <QuestionRunner questions={plan.writing} source="course" getSessionId={getId} finishLabel="마무리 테스트로" onFinish={(r) => (addResults(r), go())} />
          </>
        )}

        {step === 'test' && <QuestionRunner questions={plan.test} source="course" getSessionId={getId} finishLabel="학습 완료" onFinish={(r) => (addResults(r), go('done'))} />}

        {step === 'done' && (
          <>
            <div className="text-center pt-2">
              <span className="inline-flex w-14 h-14 rounded-full bg-ok text-white items-center justify-center">
                <Icon name="check" size={28} strokeWidth={3} />
              </span>
              <h2 className="text-xl font-bold mt-3">DAY {lesson.day} 완료!</h2>
              <p className="text-sm text-ink-sub mt-1">오늘 배운 단어와 문법은 오늘·내일·3일·7일·14일·30일 뒤 복습에 나와요.</p>
            </div>
            {check && (
              <p className={`rounded-2xl p-3 text-sm font-semibold ${check.result === 'understood' ? 'bg-ok-soft text-ok' : 'bg-warn-soft text-warn'}`}>
                {concept.title}: {check.result === 'understood' ? '이해 완료로 기록했어요' : '아직 이해 확인 전이에요. 문법 단원에서 확인 문제를 다시 풀 수 있어요.'}
              </p>
            )}
            <ResultSummary results={results} title="오늘의 학습 결과" />
            <div className="space-y-2">
              {nextLessonInUnit ? (
                <button type="button" className="btn-primary w-full" onClick={() => navigate(`/course/lesson/${nextLessonInUnit.id}`, { replace: true })}>
                  다음 DAY 학습하기
                </button>
              ) : (
                <button type="button" className="btn-primary w-full" onClick={() => navigate(`/course/unit/${unit.id}`, { replace: true })}>
                  단원 정리 보기
                </button>
              )}
              <button type="button" className="btn-secondary w-full" onClick={() => navigate('/home', { replace: true })}>
                홈으로
              </button>
            </div>
          </>
        )}
      </main>

      <Modal
        open={quit}
        title="학습을 그만둘까요?"
        onClose={() => setQuit(false)}
        actions={
          <>
            <button type="button" className="btn-secondary flex-1" onClick={() => setQuit(false)}>
              계속 학습
            </button>
            <button type="button" className="btn-primary flex-1" onClick={() => navigate(`/course/unit/${unit.id}`, { replace: true })}>
              그만두기
            </button>
          </>
        }
      >
        지금까지 푼 문제·오답·복습 일정은 저장돼요. DAY 완료는 마무리 테스트까지 끝내야 기록돼요.
      </Modal>
    </div>
  );
}
