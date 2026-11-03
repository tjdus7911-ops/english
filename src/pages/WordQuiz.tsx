import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QuestionRunner, ResultSummary, type RunResult } from '../components/QuestionRunner';
import { EmptyState, Header, Page } from '../components/ui';
import { wordQuizQuestions } from '../data';
import { useLearningSession } from '../lib/useSession';
import { seededShuffle } from '../lib/util';
import { useStore } from '../store/useStore';
import { LEVELS, type Level } from '../types';

export default function WordQuiz() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const courseLevel = useStore((s) => s.profile.courseLevel);
  const p = params.get('level') as Level | null;
  const level: Level = p && LEVELS.includes(p) ? p : courseLevel;
  const only = params.get('words')?.split(',').filter(Boolean);
  const { getId, finish } = useLearningSession('word-quiz', `${level} 단어 퀴즈`, level);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<RunResult[] | null>(null);

  // 단어마다 한 가지 방식(뜻 고르기/단어 고르기)만 출제, 아직 못 외운 단어 우선
  const [qs, setQs] = useState(() => pick(level, only, 0));
  const back = `/free?level=${level}`;

  if (qs.length === 0)
    return (
      <div className="min-h-screen">
        <Header title="단어 퀴즈" back={back} />
        <Page>
          <EmptyState title="퀴즈로 낼 단어가 없어요" />
        </Page>
      </div>
    );

  if (results)
    return (
      <div className="min-h-screen bg-white">
        <Header title="단어 퀴즈 결과" onBack={() => navigate(back, { replace: true })} />
        <Page className="pb-10">
          <ResultSummary results={results} title={`${level} 단어 퀴즈`} />
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => {
              const r = round + 1;
              setRound(r);
              setQs(pick(level, undefined, r));
              setResults(null);
            }}
          >
            새 단어로 한 번 더
          </button>
          <button type="button" className="btn-secondary w-full" onClick={() => navigate(back, { replace: true })}>
            자유학습으로
          </button>
        </Page>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <Header title="단어 퀴즈" sub={`${level} · ${qs.length}문제`} back={back} />
      <main className="px-4 py-4 pb-12">
        <QuestionRunner
          key={round}
          questions={qs}
          source="free"
          getSessionId={getId}
          onFinish={(r) => {
            finish();
            setResults(r);
          }}
        />
      </main>
    </div>
  );
}

function pick(level: Level, only: string[] | undefined, round: number) {
  const st = useStore.getState().progress.wordStatus;
  const pool = wordQuizQuestions.filter((q) => (q.id.startsWith('wq-m-') || q.id.startsWith('wq-w-')) && q.level === level && (!only || only.includes(q.wordIds[0])));
  const byWord = new Map<string, typeof pool>();
  pool.forEach((q) => byWord.set(q.wordIds[0], [...(byWord.get(q.wordIds[0]) ?? []), q]));
  const seed = `${level}-${new Date().toDateString()}-${round}`;
  const wordIds = seededShuffle([...byWord.keys()], seed).sort((a, b) => (st[a] === 'known' ? 1 : 0) - (st[b] === 'known' ? 1 : 0));
  return wordIds.slice(0, 10).map((id, i) => byWord.get(id)![(i + round) % 2]);
}
