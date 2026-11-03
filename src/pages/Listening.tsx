import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DialoguePlayer } from '../components/AudioPlayer';
import { Icon } from '../components/Icon';
import { QuestionRunner, ResultSummary, type RunResult } from '../components/QuestionRunner';
import { EmptyState, Header, Page, Segmented } from '../components/ui';
import { getConcept, getQuestion } from '../data';
import { dialogues, getDialogue } from '../data/listening';
import { speakingSentences } from '../data/speaking';
import { useLearningSession } from '../lib/useSession';
import { formatDate } from '../lib/util';
import { useStore } from '../store/useStore';
import { LEVELS, type Level } from '../types';

export function ListeningList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const courseLevel = useStore((s) => s.profile.courseLevel);
  const records = useStore((s) => s.listeningRecords);
  const p = params.get('level') as Level | null;
  const level: Level = p && LEVELS.includes(p) ? p : courseLevel;
  const list = dialogues.filter((d) => d.level === level);

  return (
    <>
      <Header title="듣기 학습" back={`/free?level=${level}`} sub="실생활 대화 · 받아쓰기" />
      <Page>
        <Segmented ariaLabel="듣기 레벨" value={level} options={LEVELS.map((l) => ({ value: l, label: l }))} onChange={(l) => setParams({ level: l }, { replace: true })} />
        {list.length === 0 ? (
          <EmptyState icon="headphones" title={`${level} 듣기는 준비 중이에요`} desc="음성 파일이 준비된 대화만 학습 콘텐츠로 공개해요. 지금은 A1 대화 10편을 들을 수 있어요." action={<button className="btn-secondary" onClick={() => setParams({ level: 'A1' }, { replace: true })}>A1 듣기 보기</button>} />
        ) : (
          <ul className="space-y-2">
            {list.map((d, i) => {
              const r = records[d.id];
              return (
                <li key={d.id}>
                  <button type="button" onClick={() => navigate(`/listening/${d.id}`)} className="card w-full p-4 flex items-center gap-3 text-left active:bg-surface">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${r ? 'bg-ok-soft text-ok' : 'bg-surface'}`}>{r ? <Icon name="check" size={18} strokeWidth={2.6} /> : i + 1}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold">{d.title}</span>
                      <span className="block text-xs text-ink-sub mt-0.5 truncate">{d.situation}</span>
                      <span className="block text-xs text-ink-sub mt-0.5">
                        {d.lines.length}줄 · 문제 {d.questionIds.length}
                        {r ? ` · 최근 ${r.correct}/${r.total} (${formatDate(r.completedAt)})` : ''}
                      </span>
                    </span>
                    <Icon name="chevron" size={18} className="text-ink-mute" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <p className="text-xs text-ink-sub px-1">음성은 오픈 라이선스 TTS 모델로 만든 합성 음성이에요(원어민 녹음 아님). 0.75배속으로 천천히 들을 수 있어요.</p>
      </Page>
    </>
  );
}

export function ListeningDetail() {
  const { dialogueId = '' } = useParams();
  const d = getDialogue(dialogueId);
  return <ListeningDetailInner key={dialogueId} id={dialogueId} exists={!!d} />;
}

function ListeningDetailInner({ id, exists }: { id: string; exists: boolean }) {
  const navigate = useNavigate();
  const d = getDialogue(id);
  const recordListening = useStore((s) => s.recordListening);
  const { getId, finish } = useLearningSession('listening', d ? `듣기: ${d.title}` : '듣기', d?.level, { lazy: true });
  const [mode, setMode] = useState<'study' | 'quiz' | 'result'>('study');
  const [results, setResults] = useState<RunResult[]>([]);

  if (!exists || !d)
    return (
      <>
        <Header title="듣기" back="/free/listening" />
        <Page>
          <EmptyState title="듣기 콘텐츠를 찾을 수 없어요" />
        </Page>
      </>
    );

  const qs = d.questionIds.map((qid) => getQuestion(qid)!);
  const sentences = speakingSentences.filter((s) => s.dialogueId === d.id);
  const back = `/free/listening?level=${d.level}`;

  if (mode === 'quiz')
    return (
      <div className="min-h-screen bg-white">
        <Header title={`${d.title} · 듣기 문제`} onBack={() => setMode('study')} />
        <main className="px-4 py-4 pb-12">
          <QuestionRunner
            questions={qs}
            source="free"
            getSessionId={getId}
            onFinish={(r) => {
              finish();
              recordListening(d.id, r.filter((x) => x.correct).length, r.length);
              setResults(r);
              setMode('result');
            }}
          />
        </main>
      </div>
    );

  if (mode === 'result') {
    const wrong = results.some((r) => !r.correct);
    return (
      <div className="min-h-screen bg-white">
        <Header title="듣기 결과" onBack={() => navigate(back, { replace: true })} />
        <Page className="pb-10">
          <ResultSummary results={results} title={d.title} />
          {wrong && <p className="rounded-2xl bg-warn-soft text-warn p-3 text-sm">틀린 문제가 있어요. 스크립트를 숨기고 해당 줄을 다시 들어 보세요. 이 대화는 복습 목록(재청취)에 등록됐어요.</p>}
          <button type="button" className="btn-primary w-full" onClick={() => setMode('study')}>
            {wrong ? '다시 듣기' : '대화 다시 보기'}
          </button>
          {sentences.length > 0 && (
            <button type="button" className="btn-secondary w-full" onClick={() => navigate(`/speaking?ids=${sentences.map((s) => s.id).join(',')}`)}>
              핵심 문장 따라 말하기 ({sentences.length})
            </button>
          )}
          <button type="button" className="btn-ghost w-full" onClick={() => navigate(back, { replace: true })}>
            목록으로
          </button>
        </Page>
      </div>
    );
  }

  return (
    <>
      <Header title={d.title} back={back} sub={`${d.level} · ${d.speakers.A.name} & ${d.speakers.B.name}`} />
      <Page>
        <p className="text-sm text-ink-sub px-1">{d.situation}</p>
        <DialoguePlayer d={d} />
        <section className="card p-5">
          <h3 className="section-title">핵심 단어</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {d.keyWords.map((w) => (
              <li key={w.en} className="rounded-xl bg-surface px-3 py-2 text-sm">
                <span className="en font-semibold block">{w.en}</span>
                <span className="text-ink-sub">{w.ko}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5">
          <h3 className="section-title">핵심 표현</h3>
          <ul className="mt-3 space-y-3">
            {d.keyExpressions.map((e) => (
              <li key={e.en}>
                <p className="en font-semibold">{e.en}</p>
                <p className="text-sm">{e.ko}</p>
                <p className="text-xs text-ink-sub mt-0.5">{e.note}</p>
              </li>
            ))}
          </ul>
          {d.conceptIds.map((c) => (
            <button key={c} type="button" onClick={() => navigate(`/grammar/${c}`)} className="mt-3 text-sm text-brand-dark font-semibold flex items-center gap-1 min-h-[36px]">
              <Icon name="link" size={14} />
              연결 문법: {getConcept(c)?.title}
            </button>
          ))}
        </section>
        <button type="button" className="btn-primary w-full" onClick={() => setMode('quiz')}>
          듣기 문제 풀기 (이해도 2 · 받아쓰기 1)
        </button>
        {sentences.length > 0 && (
          <button type="button" className="btn-secondary w-full" onClick={() => navigate(`/speaking?ids=${sentences.map((s) => s.id).join(',')}`)}>
            <Icon name="mic" size={18} />
            핵심 문장 따라 말하기 ({sentences.length})
          </button>
        )}
      </Page>
    </>
  );
}
