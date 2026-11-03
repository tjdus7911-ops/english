import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { WordCard } from '../components/WordCard';
import { EmptyState, Header, Page, ProgressBar } from '../components/ui';
import { wordsOfLevel } from '../lib/course';
import { useLearningSession } from '../lib/useSession';
import { useStore } from '../store/useStore';
import { LEVELS, type Level } from '../types';

export default function WordStudy() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const profile = useStore((s) => s.profile);
  const markWordsSeen = useStore((s) => s.markWordsSeen);
  const p = params.get('level') as Level | null;
  const level: Level = p && LEVELS.includes(p) ? p : profile.courseLevel;
  const { finish } = useLearningSession('free-words', `${level} 오늘의 단어`, level);

  // 시작 시점에 목록 고정: '모름' 표시 단어 → 처음 보는 단어 → 나머지 미암기 단어 순
  const [ids] = useState(() => {
    const pr = useStore.getState().progress;
    const ws = wordsOfLevel(level).filter((w) => pr.wordStatus[w.id] !== 'known');
    const rank = (id: string) => (pr.wordStatus[id] === 'unknown' ? 0 : pr.wordSeenAt[id] ? 2 : 1);
    return ws
      .map((w) => w.id)
      .sort((a, b) => rank(a) - rank(b))
      .slice(0, profile.dailyWordGoal);
  });
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const statuses = useStore((s) => s.progress.wordStatus);
  const back = `/free?level=${level}`;

  if (ids.length === 0)
    return (
      <div className="min-h-screen">
        <Header title="오늘의 단어" back={back} />
        <Page>
          <EmptyState icon="check" title={`${level} 단어를 모두 외웠어요`} desc="단어 퀴즈로 확인하거나 다른 레벨을 선택해 보세요." action={<button className="btn-primary" onClick={() => navigate(`/free/word-quiz?level=${level}`, { replace: true })}>단어 퀴즈</button>} />
        </Page>
      </div>
    );

  if (done) {
    const known = ids.filter((id) => statuses[id] === 'known').length;
    const unknown = ids.filter((id) => statuses[id] === 'unknown').length;
    return (
      <div className="min-h-screen">
        <Header title="오늘의 단어 완료" onBack={() => navigate(back, { replace: true })} />
        <Page>
          <div className="card p-6 text-center">
            <span className="inline-flex w-12 h-12 rounded-full bg-ok text-white items-center justify-center">
              <Icon name="check" size={24} strokeWidth={3} />
            </span>
            <p className="text-lg font-bold mt-3">{ids.length}개 단어를 학습했어요</p>
            <p className="text-sm text-ink-sub mt-1">
              암기 완료 {known} · 모름 {unknown} · 표시 안 함 {ids.length - known - unknown}
            </p>
          </div>
          <button type="button" className="btn-primary w-full" onClick={() => navigate(`/free/word-quiz?level=${level}&words=${ids.join(',')}`, { replace: true })}>
            방금 본 단어로 퀴즈 풀기
          </button>
          <button type="button" className="btn-secondary w-full" onClick={() => navigate(back, { replace: true })}>
            자유학습으로
          </button>
        </Page>
      </div>
    );
  }

  const id = ids[i];
  return (
    <div className="min-h-screen bg-white">
      <Header title="오늘의 단어" sub={`${level} · 목표 ${profile.dailyWordGoal}개`} back={back} />
      <main className="px-4 py-4 pb-12 space-y-4">
        <div className="flex items-center gap-3">
          <ProgressBar value={i + 1} max={ids.length} className="flex-1" label="단어 학습 진행률" />
          <span className="text-xs font-semibold text-ink-sub tabular-nums">
            {i + 1} / {ids.length}
          </span>
        </div>
        <WordCard key={id} w={wordsOfLevel(level).find((w) => w.id === id)!} />
        <div className="flex gap-2">
          <button type="button" className="btn-secondary flex-1" disabled={i === 0} onClick={() => setI(i - 1)}>
            이전
          </button>
          <button
            type="button"
            className="btn-primary flex-[2]"
            onClick={() => {
              markWordsSeen([id]);
              if (i < ids.length - 1) setI(i + 1);
              else {
                finish();
                setDone(true);
              }
            }}
          >
            {i < ids.length - 1 ? '다음 단어' : '학습 완료'}
          </button>
        </div>
      </main>
    </div>
  );
}
