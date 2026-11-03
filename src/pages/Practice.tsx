import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QuestionRunner, ResultSummary, type RunResult } from '../components/QuestionRunner';
import { UnderstandingPanel } from '../components/UnderstandingPanel';
import { EmptyState, Header, Page } from '../components/ui';
import { courseQuestions, getConcept, questionsForConcept } from '../data';
import { judgeUnderstanding, type CheckOutcome } from '../lib/understanding';
import { useLearningSession } from '../lib/useSession';
import { seededShuffle } from '../lib/util';
import { useStore } from '../store/useStore';
import { LEVELS, QUESTION_TYPE_LABEL, type Level, type Question, type QuestionType } from '../types';

const LIMIT = 10;
const STEP_ORDER: Record<string, number> = { mcq: 0, blank: 1, translate: 2, error: 3, order: 4, write: 5 };

export default function Practice() {
  const [params] = useSearchParams();
  return <PracticeInner key={params.toString()} />;
}

function PracticeInner() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const conceptId = params.get('concept');
  const lv = params.get('level') as Level | null;
  const level = lv && LEVELS.includes(lv) ? lv : null;
  const type = params.get('type') as QuestionType | null;
  const isCheck = params.get('mode') === 'check';
  const concept = conceptId ? getConcept(conceptId) : undefined;
  const recordConceptCheck = useStore((s) => s.recordConceptCheck);

  const title = concept ? `${concept.title}${isCheck ? ' · 이해도 확인' : type ? ` · ${QUESTION_TYPE_LABEL[type]}` : ''}` : `${level ?? ''} ${type ? QUESTION_TYPE_LABEL[type] : '전체'} 문제`;
  const back = concept ? `/grammar/${concept.id}` : `/free${level ? `?level=${level}` : ''}`;
  const { getId, finish } = useLearningSession(concept ? 'grammar' : 'practice', title, concept?.level ?? level ?? undefined);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<RunResult[] | null>(null);
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);
  const [extra, setExtra] = useState(false);

  let pool: Question[];
  if (concept && isCheck) {
    // 확인 문제: 1단계 기초 → 2단계 응용 (원래 연습 문항, 변형 문항은 추가 연습용으로 남김)
    pool = questionsForConcept(concept.id)
      .filter((q) => q.role === 'practice')
      .sort((a, b) => STEP_ORDER[a.type] - STEP_ORDER[b.type]);
  } else if (concept) {
    pool = seededShuffle(questionsForConcept(concept.id).filter((q) => !type || q.type === type), `${conceptId}-${type}-${round}-${new Date().toDateString()}`).slice(0, LIMIT);
  } else {
    pool = seededShuffle(courseQuestions.filter((q) => (!level || q.level === level) && (!type || q.type === type)), `${level}-${type}-${round}-${new Date().toDateString()}`).slice(0, LIMIT);
  }
  const extraPool = concept ? courseQuestions.filter((q) => q.isVariant && q.conceptIds.includes(concept.id)) : [];

  if (pool.length === 0)
    return (
      <div className="min-h-screen">
        <Header title="문제 풀기" back={back} />
        <Page>
          <EmptyState title="풀 수 있는 문제가 없어요" desc="다른 레벨이나 유형을 선택해 보세요." action={<button className="btn-secondary" onClick={() => navigate(back, { replace: true })}>돌아가기</button>} />
        </Page>
      </div>
    );

  if (results && concept && isCheck && outcome && !extra)
    return (
      <div className="min-h-screen bg-white">
        <Header title="이해도 확인 결과" onBack={() => navigate(back, { replace: true })} />
        <Page className="pb-10">
          <UnderstandingPanel
            outcome={outcome}
            concept={concept}
            extraAvailable={extraPool.length > 0}
            onNext={() => navigate(back, { replace: true })}
            onExtra={() => setExtra(true)}
            onBasics={() => navigate(`/grammar/${concept.id}?help=easy`, { replace: true })}
            onConcept={(id) => navigate(`/grammar/${id}`)}
          />
          <ResultSummary results={results} title="확인 문제" />
        </Page>
      </div>
    );

  if (results && !(isCheck && extra))
    return (
      <div className="min-h-screen bg-white">
        <Header title="풀이 결과" onBack={() => navigate(back, { replace: true })} />
        <Page className="pb-10">
          <ResultSummary results={results} title={title} />
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => {
              setRound(round + 1);
              setResults(null);
            }}
          >
            다시 풀기 (순서 섞기)
          </button>
          <button type="button" className="btn-secondary w-full" onClick={() => navigate(back, { replace: true })}>
            돌아가기
          </button>
        </Page>
      </div>
    );

  const runningExtra = isCheck && extra;
  return (
    <div className="min-h-screen bg-white">
      <Header title={runningExtra ? '추가 연습' : title} sub={`${runningExtra ? extraPool.length : pool.length}문제${isCheck && !runningExtra ? ' · 1단계 기초 → 2단계 응용' : ''}`} back={back} />
      <main className="px-4 py-4 pb-12">
        <QuestionRunner
          key={`${round}-${runningExtra}`}
          questions={runningExtra ? extraPool : pool}
          source="free"
          getSessionId={getId}
          onFinish={(r) => {
            finish();
            if (concept && isCheck) {
              const all = runningExtra ? [...(results ?? []), ...r] : r;
              const o = judgeUnderstanding(all.map((x) => ({ correct: x.correct, mistakeType: x.question.mistakeType })));
              recordConceptCheck(concept.id, o.result, o.rate);
              setOutcome(o);
              setResults(all);
              setExtra(false);
            } else setResults(r);
          }}
        />
      </main>
    </div>
  );
}
