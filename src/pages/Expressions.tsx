import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AudioButton } from '../components/AudioPlayer';
import { Icon } from '../components/Icon';
import { QuestionRunner, ResultSummary, type RunResult } from '../components/QuestionRunner';
import { SpeakingPractice } from '../components/SpeakingPractice';
import { EmptyState, Header, Page, useToast } from '../components/ui';
import { getConcept, getQuestion } from '../data';
import { EXPRESSION_CATEGORIES, expressions, getExpression, speakingOfExpression } from '../data/expressions';
import { miniDramas } from '../data/expressions/videos';
import { dialogues } from '../data/listening';
import { useLearningSession } from '../lib/useSession';
import { useStore } from '../store/useStore';
import { LEVELS, type ExpressionCategory, type Level } from '../types';

const isCat = (c: string | null): c is ExpressionCategory => !!c && EXPRESSION_CATEGORIES.some((x) => x.id === c);
export const exprDoneKey = (id: string) => `expr:${id}`;

/** 표현 학습관 허브 + 카테고리 목록 (/expressions?cat=&level=&q=&saved=1) */
export function ExpressionHub() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const saved = useStore((s) => s.savedExpressions);
  const done = useStore((s) => s.completionEvents);
  const records = useStore((s) => s.listeningRecords);
  const cat = params.get('cat');
  const lv = params.get('level') as Level | null;
  const level = lv && LEVELS.includes(lv) ? lv : null;
  const q = params.get('q') ?? '';
  const onlySaved = params.get('saved') === '1';
  const set = (k: string, v: string | null) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v);
    else p.delete(k);
    setParams(p, { replace: true });
  };

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return expressions.filter(
      (e) =>
        (!isCat(cat) || e.category === cat) &&
        (!level || e.level === level) &&
        (!onlySaved || saved.includes(e.id)) &&
        (!s || e.en.toLowerCase().includes(s) || e.ko.includes(s) || e.situation.includes(s) || e.tags.some((t) => t.includes(s))),
    );
  }, [cat, level, q, onlySaved, saved]);

  const filters = (
    <div className="space-y-2">
      <input value={q} onChange={(e) => set('q', e.target.value || null)} placeholder="표현·뜻·상황 검색 (예: 호텔, 거절, sorry)" aria-label="표현 검색" className="w-full h-12 card px-4 outline-none focus:border-brand" />
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1" role="group" aria-label="레벨 필터">
        {[null, ...LEVELS].map((l) => (
          <button key={l ?? 'all'} type="button" aria-pressed={level === l} onClick={() => set('level', l)} className={`shrink-0 min-h-[36px] px-4 rounded-full text-sm font-semibold border ${level === l ? 'bg-ink text-white border-ink' : 'bg-white border-line text-ink-sub'}`}>
            {l ?? '전체 레벨'}
          </button>
        ))}
        <button type="button" aria-pressed={onlySaved} onClick={() => set('saved', onlySaved ? null : '1')} className={`shrink-0 min-h-[36px] px-4 rounded-full text-sm font-semibold border ${onlySaved ? 'bg-brand text-white border-brand' : 'bg-white border-line text-ink-sub'}`}>
          저장한 표현 {saved.length}
        </button>
      </div>
    </div>
  );

  // 상황별 듣기·말하기
  if (cat === 'situational') {
    const sit = dialogues.filter((d) => d.situational);
    return (
      <>
        <Header title="상황별 듣기·말하기" back="/expressions" sub={`${sit.length}개 상황 · A2`} />
        <Page>
          <ul className="space-y-2">
            {sit.map((d) => (
              <li key={d.id}>
                <button type="button" onClick={() => navigate(`/listening/${d.id}`)} className="card w-full p-4 flex items-center gap-3 text-left active:bg-surface">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${records[d.id] ? 'bg-ok-soft text-ok' : 'bg-surface'}`}>
                    <Icon name={records[d.id] ? 'check' : 'headphones'} size={18} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold">{d.title}</span>
                    <span className="block text-xs text-ink-sub truncate">{d.situation}</span>
                  </span>
                  <span className="chip bg-surface text-ink-sub">{d.level}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-sub px-1">대화를 듣고 이해도 문제·받아쓰기를 푼 뒤 핵심 문장을 따라 말해요. 음성은 합성 음성이에요.</p>
        </Page>
      </>
    );
  }

  // 영상 속 영어
  if (cat === 'video')
    return (
      <>
        <Header title="영상 속 영어" back="/expressions" sub="오리지널 미니 드라마" />
        <Page>
          <div className="card p-4 text-sm space-y-1">
            <p className="font-semibold">콘텐츠 원칙</p>
            <p className="text-ink-sub text-xs">영화·드라마를 무단으로 복제하거나 편집해 쓰지 않아요. 직접 제작했거나, 권리를 확보한 AI 생성 영상, 상업적 이용·편집이 허용된 라이선스 영상, 권리자 이용허락을 받은 영상만 공개해요.</p>
          </div>
          <ul className="space-y-2">
            {miniDramas.map((m) => (
              <li key={m.id} className="card p-4">
                <div className="flex items-center gap-2">
                  <span className="chip bg-surface text-ink-sub">{m.level}</span>
                  <span className="chip bg-warn-soft text-warn">준비 중 · 영상 미제작</span>
                </div>
                <p className="font-semibold mt-2">{m.title}</p>
                <p className="text-sm text-ink-sub mt-0.5">{m.synopsis}</p>
                <p className="text-xs text-ink-mute mt-2">
                  예정 분량 {m.durationSec}초 · 권리: {m.rights.owner} · 제3자 자료 {m.rights.thirdPartyMaterial ? '있음' : '없음'} · 권리 확인 {m.rights.checkedAt ?? '미완료'}
                </p>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-sub px-1">영상이 제작되고 권리 확인이 끝나면 자막 보기·숨기기, 해석, 구간 반복, 이해도 문제, 쉐도잉을 함께 제공할 예정이에요.</p>
        </Page>
      </>
    );

  // 카테고리 목록
  if (isCat(cat)) {
    const meta = EXPRESSION_CATEGORIES.find((c) => c.id === cat)!;
    const all = expressions.filter((e) => e.category === cat);
    const doneN = all.filter((e) => done[exprDoneKey(e.id)]).length;
    return (
      <>
        <Header title={meta.title} back="/expressions" sub={`${all.length}개 · 완료 ${doneN}`} />
        <Page>
          {filters}
          <ExpressionList list={list} />
        </Page>
      </>
    );
  }

  // 허브
  const searching = !!q.trim() || !!level || onlySaved;
  return (
    <>
      <Header title="표현 학습관" back="/free" sub="상황별 영어 표현" />
      <Page>
        {filters}
        {searching ? (
          <ExpressionList list={list} />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {EXPRESSION_CATEGORIES.map((c) => {
              const items = expressions.filter((e) => e.category === c.id);
              const n = c.id === 'situational' ? dialogues.filter((d) => d.situational).length : c.id === 'video' ? miniDramas.length : items.length;
              const doneN = c.id === 'situational' ? dialogues.filter((d) => d.situational && records[d.id]).length : items.filter((e) => done[exprDoneKey(e.id)]).length;
              return (
                <button key={c.id} type="button" onClick={() => set('cat', c.id)} className="card p-4 text-left active:bg-surface min-h-[132px] flex flex-col">
                  <Icon name={c.icon} size={22} className="text-brand" />
                  <p className="font-semibold mt-2 leading-snug">{c.title}</p>
                  <p className="text-xs text-ink-sub mt-0.5 flex-1">{c.desc}</p>
                  <p className="text-xs font-semibold mt-2">{c.id === 'video' ? <span className="text-warn">준비 중 {n}편</span> : `${n}개 · 완료 ${doneN}`}</p>
                </button>
              );
            })}
          </div>
        )}
      </Page>
    </>
  );
}

function ExpressionList({ list }: { list: typeof expressions }) {
  const navigate = useNavigate();
  const saved = useStore((s) => s.savedExpressions);
  const done = useStore((s) => s.completionEvents);
  if (list.length === 0) return <EmptyState title="조건에 맞는 표현이 없어요" desc="검색어나 필터를 바꿔 보세요." />;
  return (
    <ul className="card divide-y divide-line">
      {list.map((e) => (
        <li key={e.id}>
          <button type="button" onClick={() => navigate(`/expressions/${e.id}`)} className="w-full text-left px-4 py-3 flex items-center gap-3 active:bg-surface">
            <span className="flex-1 min-w-0">
              <span className="flex items-center gap-1.5">
                <span className="en font-semibold">{e.en}</span>
                {saved.includes(e.id) && <Icon name="bookmark" size={13} className="text-brand shrink-0" />}
              </span>
              <span className="block text-sm text-ink-sub">{e.ko}</span>
              <span className="block text-xs text-ink-mute mt-0.5">
                {e.level} · {e.tags.join(' · ')}
              </span>
            </span>
            {done[exprDoneKey(e.id)] && (
              <span className="chip bg-ok-soft text-ok shrink-0">
                <Icon name="check" size={12} strokeWidth={3} />
                완료
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** 표현 상세 (/expressions/:id) */
export function ExpressionDetail() {
  const { expressionId = '' } = useParams();
  return <ExpressionDetailInner key={expressionId} id={expressionId} />;
}

function ExpressionDetailInner({ id }: { id: string }) {
  const navigate = useNavigate();
  const toast = useToast();
  const e = getExpression(id);
  const saved = useStore((s) => s.savedExpressions.includes(id));
  const done = useStore((s) => s.completionEvents[exprDoneKey(id)]);
  const toggleSaveExpression = useStore((s) => s.toggleSaveExpression);
  const recordCompletion = useStore((s) => s.recordCompletion);
  const { getId, finish } = useLearningSession('expression', e ? `표현: ${e.en}` : '표현', e?.level, { lazy: true });
  const [mode, setMode] = useState<'study' | 'quiz' | 'result' | 'speak'>('study');
  const [results, setResults] = useState<RunResult[]>([]);

  if (!e)
    return (
      <>
        <Header title="표현" back="/expressions" />
        <Page>
          <EmptyState title="표현을 찾을 수 없어요" />
        </Page>
      </>
    );

  const back = `/expressions?cat=${e.category}`;
  const qs = e.questionIds.map((qid) => getQuestion(qid)!);
  const concept = e.conceptId ? getConcept(e.conceptId) : undefined;
  const idx = expressions.filter((x) => x.category === e.category).findIndex((x) => x.id === e.id);
  const next = expressions.filter((x) => x.category === e.category)[idx + 1];

  if (mode === 'quiz')
    return (
      <div className="min-h-screen bg-white">
        <Header title="표현 연습" sub={e.en} onBack={() => setMode('study')} />
        <main className="px-4 py-4 pb-12">
          <QuestionRunner
            questions={qs}
            source="free"
            getSessionId={getId}
            onFinish={(r) => {
              finish();
              setResults(r);
              setMode('result');
              // 같은 표현의 완료 이벤트는 한 번만 기록 (보상 중복 지급 방지 기준)
              if (recordCompletion(exprDoneKey(e.id))) toast('표현 학습 완료로 기록했어요.');
            }}
          />
        </main>
      </div>
    );

  if (mode === 'result')
    return (
      <div className="min-h-screen bg-white">
        <Header title="연습 결과" onBack={() => setMode('study')} />
        <Page className="pb-10">
          <ResultSummary results={results} title={e.en} />
          <p className="text-xs text-ink-sub px-1">틀린 문제는 오답노트에 저장되고, 이 표현은 다른 문제 유형으로 다시 복습하도록 등록돼요.</p>
          <button type="button" className="btn-primary w-full" onClick={() => setMode('speak')}>
            <Icon name="mic" size={18} />
            따라 말하기
          </button>
          {next && (
            <button type="button" className="btn-secondary w-full" onClick={() => navigate(`/expressions/${next.id}`, { replace: true })}>
              다음 표현: <span className="en">{next.en}</span>
            </button>
          )}
          <button type="button" className="btn-ghost w-full" onClick={() => navigate(back, { replace: true })}>
            목록으로
          </button>
        </Page>
      </div>
    );

  if (mode === 'speak')
    return (
      <div className="min-h-screen bg-white">
        <Header title="따라 말하기" sub={e.en} onBack={() => setMode('study')} />
        <main className="px-4 py-4 pb-12 space-y-4">
          <SpeakingPractice s={speakingOfExpression(e)} />
          <button type="button" className="btn-secondary w-full" onClick={() => setMode('study')}>
            표현으로 돌아가기
          </button>
        </main>
      </div>
    );

  return (
    <>
      <Header
        title={e.en}
        back={back}
        sub={`${e.level} · ${EXPRESSION_CATEGORIES.find((c) => c.id === e.category)?.title}`}
        right={
          <button type="button" onClick={() => (toggleSaveExpression(e.id), toast(saved ? '저장을 취소했어요.' : '저장하고 복습 목록에 추가했어요.'))} aria-pressed={saved} aria-label={saved ? '표현 저장 취소' : '표현 저장 (복습 등록)'} className={`w-11 h-11 rounded-full flex items-center justify-center ${saved ? 'text-brand' : 'text-ink'}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 3h12v18l-6-4-6 4z" />
            </svg>
          </button>
        }
      />
      <Page>
        <section className="card p-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="chip bg-brand-soft text-brand-dark">{e.level}</span>
            {e.tags.map((t) => (
              <span key={t} className="chip bg-surface text-ink-sub">
                {t}
              </span>
            ))}
            {done && <span className="chip bg-ok-soft text-ok">학습 완료</span>}
          </div>
          <h2 className="en text-[24px] font-bold mt-3 leading-snug">{e.en}</h2>
          <p className="text-lg font-semibold mt-1">{e.ko}</p>
          <div className="mt-3">
            <AudioButton files={[e.audio]} label="발음 듣기" />
          </div>
        </section>

        <section className="card p-5 space-y-3">
          <div>
            <h3 className="font-bold text-sm text-ink-sub">이럴 때 써요</h3>
            <p className="mt-1">{e.situation}</p>
          </div>
          <div>
            <h3 className="font-bold text-sm text-ink-sub">주의할 뉘앙스</h3>
            <p className="mt-1">{e.nuance}</p>
          </div>
          {e.similar.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-ink-sub">비슷한 표현과 차이</h3>
              <ul className="mt-1 space-y-1">
                {e.similar.map((s) => (
                  <li key={s.en} className="text-sm">
                    <span className="en font-semibold">{s.en}</span> — {s.diff}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {concept && (
            <button type="button" onClick={() => navigate(`/grammar/${concept.id}`)} className="text-sm text-brand-dark font-semibold flex items-center gap-1 min-h-[36px]">
              <Icon name="link" size={14} />
              관련 문법: {concept.title}
            </button>
          )}
        </section>

        <section className="card p-5">
          <h3 className="section-title">대화 예문</h3>
          <ul className="mt-3 space-y-3">
            {e.dialogue.map((d, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className={`w-8 h-8 shrink-0 rounded-full text-xs font-bold flex items-center justify-center ${d.speaker === 'A' ? 'bg-ink text-white' : 'bg-white border border-line'}`}>{d.speaker}</span>
                <div className="flex-1 min-w-0">
                  <p className="en font-medium">
                    {i === e.usedIn.line ? (
                      <>
                        {d.en.slice(0, d.en.indexOf(e.usedIn.span))}
                        <mark className="bg-brand-soft text-brand-dark rounded px-0.5">{e.usedIn.span}</mark>
                        {d.en.slice(d.en.indexOf(e.usedIn.span) + e.usedIn.span.length)}
                      </>
                    ) : (
                      d.en
                    )}
                  </p>
                  <p className="text-sm text-ink-sub">{d.ko}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <AudioButton files={e.dialogue.map((d) => d.audio)} label="대화 듣기" />
          </div>
        </section>

        <section className="card p-5">
          <h3 className="section-title">응용 문장</h3>
          <p className="text-sm text-ink-sub mt-1">연습 문제에서 이 문장을 직접 배열해 봐요.</p>
          <p className="mt-2">{e.practice.ko}</p>
        </section>

        <div className="space-y-2">
          <button type="button" className="btn-primary w-full" onClick={() => setMode('quiz')}>
            연습하기 (뜻 · 듣기 · 응용 영작 {qs.length}문제)
          </button>
          <button type="button" className="btn-secondary w-full" onClick={() => setMode('speak')}>
            <Icon name="mic" size={18} />
            따라 말하기
          </button>
        </div>
        <p className="text-[11px] text-ink-mute px-1">음성은 합성 음성(TTS)이에요. 저장하면 복습 일정(오늘·1·3·7·14·30일)에 추가돼요.</p>
      </Page>
    </>
  );
}
