import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SpeakingPractice } from '../components/SpeakingPractice';
import { EmptyState, Header, Page, ProgressBar, Segmented, useBack } from '../components/ui';
import { getSpeaking, speakingSentences } from '../data/speaking';
import { isDue } from '../lib/review';
import { useLearningSession } from '../lib/useSession';
import { secureContext, sttSupported } from '../lib/voice/recognition';
import { useStore } from '../store/useStore';
import { LEVELS, type Level } from '../types';

export function SpeakingList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const courseLevel = useStore((s) => s.profile.courseLevel);
  const attempts = useStore((s) => s.speakingAttempts);
  const p = params.get('level') as Level | null;
  const level: Level = p && LEVELS.includes(p) ? p : courseLevel;
  const list = speakingSentences.filter((s) => s.level === level);
  const best = (id: string) => {
    const a = attempts.filter((x) => x.sentenceId === id && x.mode === 'stt');
    return a.length ? Math.max(...a.map((x) => x.matchRate)) : null;
  };

  return (
    <>
      <Header title="말하기 학습" back={`/free?level=${level}`} sub="따라 말하기 · 음성 인식 비교" />
      <Page>
        <Segmented ariaLabel="말하기 레벨" value={level} options={LEVELS.map((l) => ({ value: l, label: l }))} onChange={(l) => setParams({ level: l }, { replace: true })} />
        <div className="card p-4 text-xs text-ink-sub space-y-1">
          <p>
            음성 인식: <b className={sttSupported() ? 'text-ok' : 'text-warn'}>{sttSupported() ? '이 브라우저에서 지원' : '이 브라우저 미지원 (녹음 자가 확인만 가능)'}</b> · 보안 연결: <b className={secureContext() ? 'text-ok' : 'text-bad'}>{secureContext() ? 'OK' : 'HTTPS 필요'}</b>
          </p>
          <p>인식 일치도는 발음 점수가 아니에요. 발음 정확도·강세·억양·유창성 평가는 준비 중이에요.</p>
        </div>
        {list.length === 0 ? (
          <EmptyState icon="mic" title={`${level} 말하기는 준비 중이에요`} desc="지금은 A1 따라 말하기 30문장을 연습할 수 있어요." action={<button className="btn-secondary" onClick={() => setParams({ level: 'A1' }, { replace: true })}>A1 보기</button>} />
        ) : (
          <>
            <button type="button" className="btn-primary w-full" onClick={() => navigate(`/speaking?ids=${list.slice(0, 10).map((s) => s.id).join(',')}`)}>
              <Icon name="mic" size={18} />
              처음 10문장 연습하기
            </button>
            <ul className="card divide-y divide-line">
              {list.map((s) => {
                const b = best(s.id);
                return (
                  <li key={s.id}>
                    <button type="button" onClick={() => navigate(`/speaking?ids=${s.id}`)} className="w-full text-left px-4 py-3 flex items-center gap-3 active:bg-surface">
                      <span className="flex-1 min-w-0">
                        <span className="block en font-medium">{s.en}</span>
                        <span className="block text-xs text-ink-sub">{s.ko}</span>
                      </span>
                      {b !== null && <span className={`chip ${b === 100 ? 'bg-ok-soft text-ok' : 'bg-warn-soft text-warn'}`}>인식 {b}%</span>}
                      <Icon name="chevron" size={16} className="text-ink-mute" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Page>
    </>
  );
}

/** /speaking?ids=a,b,c 또는 ?review=1 (복습 대상 문장) */
export function SpeakingSession() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isReview = params.get('review') === '1';
  const [ids] = useState(() => {
    if (isReview) {
      const r = useStore.getState().reviews;
      return Object.values(r)
        .filter((x) => x.kind === 'speaking' && isDue(x, Date.now()))
        .sort((a, b) => b.lapses - a.lapses)
        .map((x) => x.refId)
        .slice(0, 10);
    }
    return (params.get('ids') ?? '').split(',').filter((id) => getSpeaking(id));
  });
  const [i, setI] = useState(0);
  const goBack = useBack('/free/speaking');
  useLearningSession('speaking', isReview ? '말하기 재연습' : '따라 말하기', 'A1');

  if (ids.length === 0)
    return (
      <div className="min-h-screen">
        <Header title="따라 말하기" back="/free/speaking" />
        <Page>
          <EmptyState icon="mic" title={isReview ? '재연습할 문장이 없어요' : '연습할 문장이 없어요'} action={<button className="btn-secondary" onClick={() => navigate('/free/speaking', { replace: true })}>말하기 목록</button>} />
        </Page>
      </div>
    );

  const s = getSpeaking(ids[i])!;
  return (
    <div className="min-h-screen bg-white">
      <Header title={isReview ? '말하기 재연습' : '따라 말하기'} sub={`${i + 1} / ${ids.length}`} back="/free/speaking" />
      <main className="px-4 py-4 pb-12 space-y-4">
        <ProgressBar value={i + 1} max={ids.length} label="말하기 진행률" />
        <SpeakingPractice key={s.id} s={s} asReview={isReview} />
        <div className="flex gap-2">
          <button type="button" className="btn-secondary flex-1" disabled={i === 0} onClick={() => setI(i - 1)}>
            이전 문장
          </button>
          {i < ids.length - 1 ? (
            <button type="button" className="btn-primary flex-[2]" onClick={() => setI(i + 1)}>
              다음 문장
            </button>
          ) : (
            <button type="button" className="btn-primary flex-[2]" onClick={goBack}>
              연습 끝내기
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
