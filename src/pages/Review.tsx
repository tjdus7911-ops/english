import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { QuestionRunner, ResultSummary, type RunResult } from '../components/QuestionRunner';
import { EmptyState, Header, Page } from '../components/ui';
import { POLICY } from '../config/policy';
import { buildReviewQueue, isDue, MEMORY_LABEL, memoryState, reviewSummary } from '../lib/review';
import { useLearningSession } from '../lib/useSession';
import { formatDate, startOfDay } from '../lib/util';
import { useStore } from '../store/useStore';
import { QUESTION_TYPE_LABEL, type ReviewKind } from '../types';

export default function Review() {
  const [params] = useSearchParams();
  const focus = params.get('focus') ?? undefined;
  const kind = (params.get('kind') as ReviewKind | null) ?? undefined;
  // 알림·필터로 진입하면 목록을 새로 만들기 위해 key로 재마운트
  return <ReviewInner key={`${focus}-${kind}`} focus={focus} kind={kind} />;
}

function ReviewInner({ focus, kind }: { focus?: string; kind?: ReviewKind }) {
  const navigate = useNavigate();
  const profile = useStore((s) => s.profile);
  const reviews = useStore((s) => s.reviews);
  const { getId, finish } = useLearningSession('review', '오늘의 복습');
  const [round, setRound] = useState(0);
  const build = () => {
    const s = useStore.getState();
    if (!s.profile.reviewEnabled) return [];
    const now = Date.now();
    const doneToday = Object.values(s.reviews).filter((r) => r.lastReviewedAt && r.lastReviewedAt >= startOfDay(now)).length;
    const limit = Math.max(focus ? 1 : 0, s.profile.reviewPerDay - doneToday);
    return buildReviewQueue(s.reviews, s.wrongNotes, s.answers, limit, now, { focusKey: focus, kind });
  };
  const [items, setItems] = useState(build);
  const [results, setResults] = useState<RunResult[] | null>(null);

  const speakingDue = Object.values(reviews).filter((r) => r.kind === 'speaking' && isDue(r, Date.now())).length;
  const speakingCard =
    speakingDue > 0 ? (
      <button type="button" onClick={() => navigate('/speaking?review=1')} className="card w-full p-4 flex items-center gap-3 text-left active:bg-surface">
        <Icon name="mic" size={20} className="text-brand" />
        <span className="flex-1">
          <span className="block font-semibold">따라 말하기 재연습 {speakingDue}문장</span>
          <span className="block text-xs text-ink-sub">누락되거나 다르게 인식된 단어가 있었던 문장이에요.</span>
        </span>
        <Icon name="chevron" size={16} />
      </button>
    ) : null;

  if (results) {
    const now = Date.now();
    const sum = reviewSummary(useStore.getState().reviews, profile.reviewPerDay, now);
    const after = items.map((it) => ({ it, r: useStore.getState().reviews[it.key] }));
    return (
      <div className="min-h-screen bg-white">
        <Header title="복습 결과" onBack={() => navigate('/home', { replace: true })} />
        <Page className="pb-10">
          <ResultSummary results={results} title="오늘의 복습" />
          {speakingCard}
          <section className="card">
            <h3 className="px-4 pt-4 pb-1 font-bold">항목별 다음 복습</h3>
            <ul className="divide-y divide-line">
              {after.map(({ it, r }) => (
                <li key={it.key} className="px-4 py-3 flex items-center gap-2 text-sm">
                  <span className="chip bg-surface text-ink-sub shrink-0">{it.kind === 'word' ? '단어' : '문법'}</span>
                  <span className="flex-1 min-w-0 truncate font-medium en">{it.title}</span>
                  {r && (
                    <span className="text-ink-sub shrink-0">
                      {MEMORY_LABEL[memoryState(r, now)]} · {formatDate(r.dueAt)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="px-4 pb-4 pt-1 text-xs text-ink-sub">맞힌 항목은 간격이 늘어나고({POLICY.review.intervalsDays.slice(1).join('→')}일), 틀린 항목은 내일 다시 나와요.</p>
          </section>
          {sum.todayCount > 0 ? (
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => {
                setItems(build());
                setResults(null);
                setRound(round + 1);
              }}
            >
              남은 복습 {sum.todayCount}개 계속하기
            </button>
          ) : (
            <div className="rounded-2xl bg-ok-soft p-4">
              <p className="font-semibold text-ok">오늘 복습을 모두 완료했어요! 이제 새로운 영어를 배워볼까요?</p>
            </div>
          )}
          <button type="button" className={sum.todayCount > 0 ? 'btn-secondary w-full' : 'btn-primary w-full'} onClick={() => navigate('/home', { replace: true })}>
            신규 학습하러 가기
          </button>
        </Page>
      </div>
    );
  }

  if (items.length === 0) {
    const upcoming = Object.values(reviews).sort((a, b) => a.dueAt - b.dueAt)[0];
    return (
      <div className="min-h-screen">
        <Header title="오늘의 복습" back="/home" />
        <Page>
          {speakingCard}
          {!profile.reviewEnabled ? (
            <EmptyState title="복습 일정이 꺼져 있어요" desc="MY > 학습 설정에서 복습을 켜면 단어·문법별 복습 일정이 만들어져요." action={<button className="btn-secondary" onClick={() => navigate('/my')}>설정으로</button>} />
          ) : upcoming ? (
            <EmptyState icon="check" title="지금 복습할 항목이 없어요" desc={`다음 복습 예정: ${formatDate(upcoming.dueAt)}`} action={<button className="btn-primary" onClick={() => navigate('/home')}>신규 학습하러 가기</button>} />
          ) : (
            <EmptyState title="아직 복습할 내용이 없어요" desc="단어나 문법을 학습하면 오늘·내일·3일·7일·14일·30일 뒤 복습 일정이 자동으로 만들어져요." action={<button className="btn-primary" onClick={() => navigate('/home')}>학습하러 가기</button>} />
          )}
        </Page>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="오늘의 복습" sub={`${items.length}문제 · 단계마다 다른 유형으로`} back="/home" />
      <main className="px-4 py-4 pb-12 space-y-4">
        {speakingCard}
        <QuestionRunner
          key={round}
          questions={items.map((i) => i.question)}
          reviewKeys={items.map((i) => i.key)}
          source="review"
          getSessionId={getId}
          renderExtra={(q) => {
            const it = items.find((i) => i.question.id === q.id);
            return it ? (
              <p className="text-xs text-ink-sub flex items-center gap-1">
                <Icon name="refresh" size={14} />
                {it.kind === 'word' ? '단어' : '문법'} 복습: <span className="en">{it.title}</span> · {it.reason} · {QUESTION_TYPE_LABEL[q.type]}
              </p>
            ) : null;
          }}
          onFinish={(r) => {
            finish();
            setResults(r);
          }}
        />
      </main>
    </div>
  );
}
