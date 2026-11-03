import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { QuestionRunner, ResultSummary, type RunResult } from '../components/QuestionRunner';
import { EmptyState, Header, Modal, Page } from '../components/ui';
import { getQuestion, getUnit, skipTestQuestionIds, SKIP_PASS_RATE } from '../data';
import { isUnitUnlocked } from '../lib/course';
import { useLearningSession } from '../lib/useSession';
import { useStore } from '../store/useStore';

export default function SkipTest() {
  const { unitId = '' } = useParams();
  const navigate = useNavigate();
  const unit = getUnit(unitId);
  const progress = useStore((s) => s.progress);
  const skipUnit = useStore((s) => s.skipUnit);
  const { getId, finish } = useLearningSession('skip-test', `${unit?.title ?? ''} 건너뛰기 테스트`, unit?.level);
  const [results, setResults] = useState<RunResult[] | null>(null);
  const [quit, setQuit] = useState(false);

  if (!unit || unit.status !== 'ready' || !isUnitUnlocked(unit, progress))
    return (
      <div className="min-h-screen">
        <Header title="건너뛰기 테스트" back="/course" />
        <Page>
          <EmptyState title="지금은 볼 수 없는 테스트예요" action={<button className="btn-secondary" onClick={() => navigate('/course', { replace: true })}>코스로</button>} />
        </Page>
      </div>
    );

  const qs = skipTestQuestionIds(unit.id).map((id) => getQuestion(id)!);
  const back = `/course/unit/${unit.id}`;

  if (results) {
    const rate = results.filter((r) => r.correct).length / results.length;
    const pass = rate >= SKIP_PASS_RATE;
    return (
      <div className="min-h-screen bg-white">
        <Header title="건너뛰기 테스트 결과" onBack={() => navigate(back, { replace: true })} />
        <Page className="pb-10">
          <div className={`rounded-2xl p-4 flex items-center gap-3 ${pass ? 'bg-ok-soft text-ok' : 'bg-warn-soft text-warn'}`}>
            <Icon name={pass ? 'check' : 'info'} size={22} />
            <p className="font-semibold">{pass ? '통과! 이 단원을 완료로 처리했어요.' : `통과 기준(${Math.round(SKIP_PASS_RATE * 100)}%)에 못 미쳤어요. DAY 학습으로 차근차근 익혀 봐요.`}</p>
          </div>
          <ResultSummary results={results} title="건너뛰기 테스트" />
          <button type="button" className="btn-primary w-full" onClick={() => navigate(pass ? '/course' : back, { replace: true })}>
            {pass ? '코스로 돌아가기' : '단원 학습하러 가기'}
          </button>
        </Page>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="건너뛰기 테스트" sub={unit.title} onBack={() => setQuit(true)} />
      <main className="px-4 py-4 pb-12">
        <QuestionRunner
          questions={qs}
          source="skip-test"
          getSessionId={getId}
          onFinish={(r) => {
            finish();
            if (r.filter((x) => x.correct).length / r.length >= SKIP_PASS_RATE) skipUnit(unit.id);
            setResults(r);
          }}
        />
      </main>
      <Modal
        open={quit}
        title="테스트를 그만둘까요?"
        onClose={() => setQuit(false)}
        actions={
          <>
            <button type="button" className="btn-secondary flex-1" onClick={() => setQuit(false)}>
              계속
            </button>
            <button type="button" className="btn-primary flex-1" onClick={() => navigate(back, { replace: true })}>
              그만두기
            </button>
          </>
        }
      >
        중간에 그만두면 통과 처리되지 않아요. 푼 문제의 오답은 오답노트에 저장돼요.
      </Modal>
    </div>
  );
}
