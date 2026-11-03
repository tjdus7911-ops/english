import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { QuestionRunner, ResultSummary, type RunResult } from '../components/QuestionRunner';
import { EmptyState, Header, Page, useToast } from '../components/ui';
import { getConcept, getQuestion } from '../data';
import { AREA_LABEL } from '../lib/analysis';
import { useLearningSession } from '../lib/useSession';
import { formatDate } from '../lib/util';
import { useStore } from '../store/useStore';
import { LEVELS, MISTAKE_LABEL, QUESTION_TYPE_LABEL, type Area, type Level, type Question } from '../types';

type Tab = 'all' | Area;
const TABS: { v: Tab; label: string }[] = [
  { v: 'all', label: '전체' },
  { v: 'vocab', label: '단어' },
  { v: 'grammar', label: '문법' },
  { v: 'writing', label: '영작' },
  { v: 'reading', label: '해석' },
  { v: 'listening', label: '듣기' },
];

function answerText(q: Question) {
  return q.type === 'error' ? q.tokens![Number(q.answer)] : q.answer;
}
function givenText(q: Question, g: string) {
  return q.type === 'error' ? (q.tokens![Number(g)] ?? g) : g;
}

export default function WrongNotes() {
  const navigate = useNavigate();
  const toast = useToast();
  const wrongNotes = useStore((s) => s.wrongNotes);
  const resolveWrongNote = useStore((s) => s.resolveWrongNote);
  const [tab, setTab] = useState<Tab>('all');
  const [level, setLevel] = useState<Level | 'all'>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [retry, setRetry] = useState<Question[] | null>(null);
  const [retryResults, setRetryResults] = useState<RunResult[] | null>(null);
  const { getId } = useLearningSession('wrong-note', '오답노트 다시 풀기', undefined, { lazy: true });

  const all = Object.values(wrongNotes)
    .map((w) => ({ w, q: getQuestion(w.questionId) }))
    .filter((x): x is { w: typeof x.w; q: Question } => !!x.q)
    .sort((a, b) => b.w.lastWrongAt - a.w.lastWrongAt);
  const list = all.filter(({ w, q }) => (tab === 'all' || q.area === tab) && (level === 'all' || q.level === level) && w.resolved === showResolved);
  const unresolvedCount = all.filter((x) => !x.w.resolved).length;

  if (retry) {
    if (retryResults)
      return (
        <>
          <Header title="다시 풀기 결과" onBack={() => { setRetry(null); setRetryResults(null); }} />
          <Page>
            <ResultSummary results={retryResults} title="오답 다시 풀기" />
            <button type="button" className="btn-primary w-full" onClick={() => { setRetry(null); setRetryResults(null); }}>
              오답노트로
            </button>
          </Page>
        </>
      );
    return (
      <>
        <Header title="오답 다시 풀기" sub={`${retry.length}문제`} onBack={() => setRetry(null)} />
        <Page>
          <QuestionRunner
            questions={retry}
            source="wrong-note"
            getSessionId={getId}
            renderExtra={(q, c) =>
              c.correct && !useStore.getState().wrongNotes[q.id]?.resolved ? (
                <button
                  type="button"
                  className="btn-secondary w-full"
                  onClick={() => {
                    resolveWrongNote(q.id);
                    toast('복습 완료로 표시했어요.');
                  }}
                >
                  <Icon name="check" size={18} />이 문제 복습 완료로 표시
                </button>
              ) : null
            }
            onFinish={setRetryResults}
          />
        </Page>
      </>
    );
  }

  return (
    <>
      <Header title="오답노트" back="/home" sub={`미해결 ${unresolvedCount}개`} />
      <Page>
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1" role="tablist" aria-label="영역 분류">
          {TABS.map((t) => (
            <button key={t.v} type="button" role="tab" aria-selected={tab === t.v} onClick={() => setTab(t.v)} className={`shrink-0 min-h-[36px] px-4 rounded-full text-sm font-semibold border ${tab === t.v ? 'bg-ink text-white border-ink' : 'bg-white border-line text-ink-sub'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <select value={level} onChange={(e) => setLevel(e.target.value as Level | 'all')} aria-label="레벨 필터" className="h-10 rounded-xl border border-line bg-white px-3 text-sm font-semibold">
            <option value="all">전체 레벨</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <div className="flex bg-surface rounded-full p-1 ml-auto" role="radiogroup" aria-label="해결 상태">
            {[false, true].map((v) => (
              <button key={String(v)} type="button" role="radio" aria-checked={showResolved === v} onClick={() => setShowResolved(v)} className={`px-3 min-h-[32px] rounded-full text-xs font-semibold ${showResolved === v ? 'bg-white shadow-sm' : 'text-ink-sub'}`}>
                {v ? '복습 완료' : '미해결'}
              </button>
            ))}
          </div>
        </div>

        {list.length > 0 && !showResolved && (
          <button type="button" className="btn-primary w-full" onClick={() => setRetry(list.slice(0, 10).map((x) => x.q))}>
            <Icon name="refresh" size={18} />
            {list.length > 10 ? '최근 10문제 다시 풀기' : `${list.length}문제 다시 풀기`}
          </button>
        )}

        {list.length === 0 ? (
          <EmptyState
            icon={showResolved ? 'note' : 'check'}
            title={all.length === 0 ? '아직 틀린 문제가 없어요' : showResolved ? '복습 완료한 문제가 없어요' : '조건에 맞는 미해결 오답이 없어요'}
            desc={all.length === 0 ? '문제를 틀리면 원인과 함께 자동으로 저장돼요.' : undefined}
            action={all.length === 0 ? <button className="btn-secondary" onClick={() => navigate('/home')}>학습하러 가기</button> : undefined}
          />
        ) : (
          <ul className="space-y-2">
            {list.map(({ w, q }) => {
              const c = q.recommendConceptId ? getConcept(q.recommendConceptId) : undefined;
              const isOpen = open === q.id;
              return (
                <li key={q.id} className="card">
                  <button type="button" onClick={() => setOpen(isOpen ? null : q.id)} aria-expanded={isOpen} className="w-full text-left p-4 flex gap-3 items-start">
                    <span className="flex-1 min-w-0">
                      <span className="flex flex-wrap gap-1.5">
                        <span className="chip bg-surface text-ink-sub">{q.level}</span>
                        <span className="chip bg-surface text-ink-sub">{AREA_LABEL[q.area]}</span>
                        <span className="chip bg-bad-soft text-bad">{MISTAKE_LABEL[q.mistakeType]}</span>
                        {w.wrongCount >= 2 && <span className="chip bg-bad text-white">반복 오답 {w.wrongCount}회</span>}
                      </span>
                      <span className="block font-medium mt-2">{q.sentence ?? q.prompt}</span>
                      <span className="block text-xs text-ink-sub mt-1">
                        {QUESTION_TYPE_LABEL[q.type]} · 마지막 오답 {formatDate(w.lastWrongAt)}
                      </span>
                    </span>
                    <Icon name="chevron" size={18} className={`text-ink-mute mt-1 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-2 text-sm border-t border-line pt-3">
                      <p className="text-ink-sub">{q.prompt}</p>
                      <p>
                        <span className="text-ink-sub">내 답: </span>
                        <span className="en text-bad">{givenText(q, w.lastGiven) || '(입력 없음)'}</span>
                      </p>
                      <p>
                        <span className="text-ink-sub">정답: </span>
                        <span className="en font-semibold text-ok">{answerText(q)}</span>
                      </p>
                      <p className="whitespace-pre-line">{q.explanation}</p>
                      {c && (
                        <button type="button" onClick={() => navigate(`/grammar/${c.id}`)} className="text-brand-dark font-semibold flex items-center gap-1 min-h-[36px]">
                          <Icon name="link" size={15} />
                          관련 개념: {c.title}
                        </button>
                      )}
                      <div className="flex gap-2 pt-1">
                        <button type="button" className="btn-secondary flex-1 !min-h-[44px]" onClick={() => setRetry([q])}>
                          다시 풀기
                        </button>
                        {!w.resolved && (
                          <button
                            type="button"
                            className="btn-primary flex-1 !min-h-[44px]"
                            onClick={() => {
                              resolveWrongNote(q.id);
                              toast('복습 완료로 옮겼어요.');
                            }}
                          >
                            복습 완료
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Page>
    </>
  );
}
