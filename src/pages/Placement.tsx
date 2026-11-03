import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { QuestionRunner, type RunResult } from '../components/QuestionRunner';
import { Header, Modal, Page, Segmented } from '../components/ui';
import { LEVEL_LABEL } from '../data';
import { placementQuestions, scoreToLevel } from '../data/placement';
import { useLearningSession } from '../lib/useSession';
import { useStore } from '../store/useStore';
import { LEVELS, type Level } from '../types';

const ORDER = ['p-v1', 'p-g1', 'p-w1', 'p-v2', 'p-g2', 'p-v3', 'p-g3', 'p-w2', 'p-v4', 'p-g4', 'p-v5', 'p-g5', 'p-v6', 'p-g6', 'p-v7', 'p-g7', 'p-v8', 'p-g8'];
const QS = ORDER.map((id) => placementQuestions.find((q) => q.id === id)!);

export default function Placement() {
  const navigate = useNavigate();
  const onboarded = useStore((s) => s.profile.onboarded);
  const setPlacementResult = useStore((s) => s.setPlacementResult);
  const { getId, finish } = useLearningSession('placement', '레벨 테스트');
  const [results, setResults] = useState<RunResult[] | null>(null);
  const [pick, setPick] = useState<Level | null>(null);
  const [quit, setQuit] = useState(false);

  if (!onboarded) return <Navigate to="/onboarding" replace />;

  if (results) {
    const vocab = results.filter((r) => r.question.area === 'vocab' && r.correct).length;
    const grammar = results.filter((r) => r.question.area === 'grammar' && r.correct).length;
    const writing = results.filter((r) => r.question.area === 'writing' && r.correct).length;
    const vL = scoreToLevel(vocab);
    const gL = scoreToLevel(grammar);
    const rec: Level = LEVELS.indexOf(vL) < LEVELS.indexOf(gL) ? vL : gL;
    const chosen = pick ?? rec;
    return (
      <div className="min-h-screen bg-surface">
        <Header title="레벨 테스트 결과" />
        <Page className="pb-10">
          <section className="card p-5">
            <p className="text-sm text-ink-sub">추천 학습 레벨</p>
            <p className="text-3xl font-extrabold mt-1 text-brand">{LEVEL_LABEL[rec]}</p>
            <p className="text-sm text-ink-sub mt-2">어휘와 문법 중 낮은 쪽을 기준으로 추천해요. 부족한 영역부터 다지면 다음 단계가 훨씬 쉬워져요.</p>
          </section>
          <section className="card divide-y divide-line">
            {[
              ['어휘', vocab, 8, vL],
              ['문법', grammar, 8, gL],
            ].map(([label, s, m, l]) => (
              <div key={label as string} className="flex items-center px-4 py-3.5">
                <span className="flex-1 font-semibold">{label}</span>
                <span className="text-sm text-ink-sub mr-3 tabular-nums">
                  {s}/{m}
                </span>
                <span className="chip bg-brand-soft text-brand-dark">{l as string}</span>
              </div>
            ))}
            <div className="flex items-center px-4 py-3.5">
              <span className="flex-1 font-semibold">기초 영작</span>
              <span className="text-sm text-ink-sub tabular-nums">{writing}/2</span>
            </div>
          </section>
          <p className="text-xs text-ink-sub px-1">18문항 결과로 추정한 레벨이에요. 실제 실력과 다를 수 있으니, 학습하면서 실력분석에서 영역별 추정 숙련도를 확인하세요.</p>
          <section className="card p-4 space-y-3">
            <p className="font-semibold">시작할 코스 레벨</p>
            <Segmented ariaLabel="코스 레벨" value={chosen} options={LEVELS.map((l) => ({ value: l, label: l }))} onChange={setPick} />
          </section>
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => {
              setPlacementResult(vL, gL, chosen);
              navigate('/home', { replace: true });
            }}
          >
            {chosen} 코스로 시작하기
          </button>
        </Page>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="레벨 테스트" sub="어휘 · 문법 · 기초 영작" onBack={() => setQuit(true)} />
      <main className="px-4 py-4 pb-10">
        <QuestionRunner
          questions={QS}
          source="placement"
          getSessionId={getId}
          finishLabel="결과 보기"
          onFinish={(r) => {
            finish();
            setResults(r);
          }}
        />
      </main>
      <Modal
        open={quit}
        title="레벨 테스트를 그만둘까요?"
        onClose={() => setQuit(false)}
        actions={
          <>
            <button type="button" className="btn-secondary flex-1" onClick={() => setQuit(false)}>
              계속 풀기
            </button>
            <button type="button" className="btn-primary flex-1" onClick={() => navigate('/home', { replace: true })}>
              그만두기
            </button>
          </>
        }
      >
        지금 그만두면 현재 설정된 레벨로 학습을 시작해요. 테스트는 MY에서 다시 볼 수 있어요.
      </Modal>
    </div>
  );
}
