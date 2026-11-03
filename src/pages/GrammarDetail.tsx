import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { GrammarView } from '../components/GrammarView';
import { Icon } from '../components/Icon';
import { EmptyState, Header, Page } from '../components/ui';
import { courseQuestions, getConcept, questionsForConcept } from '../data';
import { conceptMastery, MASTERY_LABEL } from '../lib/analysis';
import { itemKey, MEMORY_LABEL, memoryState } from '../lib/review';
import type { HelpMode } from '../lib/tutor';
import { formatDate } from '../lib/util';
import { useStore } from '../store/useStore';

const CHECK_LABEL = { understood: '이해 완료', partial: '일부 이해 · 추가 연습 필요', 'needs-basics': '기초 복습 필요' };

export default function GrammarDetail() {
  const { conceptId = '' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { progress, answers, wrongNotes, reviews, conceptChecks, markConceptStudied } = useStore();
  const c = getConcept(conceptId);

  useEffect(() => {
    if (c) markConceptStudied(c.id);
  }, [c, markConceptStudied]);

  if (!c)
    return (
      <>
        <Header title="문법" back="/free/grammar" />
        <Page>
          <EmptyState title="문법 개념을 찾을 수 없어요" />
        </Page>
      </>
    );

  const m = conceptMastery(c.id, answers, wrongNotes);
  const done = progress.conceptDone[c.id];
  const r = reviews[itemKey('concept', c.id)];
  const check = conceptChecks[c.id];
  const n = questionsForConcept(c.id).length;
  const hasWrite = courseQuestions.some((q) => q.type === 'write' && q.conceptIds.includes(c.id));
  const initial = (params.get('help') as HelpMode | null) ?? null;

  return (
    <>
      <Header title={c.title} back={`/free/grammar?level=${c.level}`} sub={`${c.level} · ${c.category}`} />
      <Page>
        <section className="card p-4 grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-ink-sub text-xs">추정 숙련도</p>
            <p className="font-bold">{m.attempts < 3 ? '데이터 부족' : `${m.estimate}점`}</p>
            <p className="text-xs text-ink-sub">{MASTERY_LABEL[m.state]}</p>
          </div>
          <div>
            <p className="text-ink-sub text-xs">이해도 확인</p>
            <p className="font-bold">{check ? CHECK_LABEL[check.result] : '미확인'}</p>
            {done && <p className="text-xs text-ok">{formatDate(done)} 완료</p>}
          </div>
          <div>
            <p className="text-ink-sub text-xs">기억 상태</p>
            <p className="font-bold">{r ? MEMORY_LABEL[memoryState(r, Date.now())] : '-'}</p>
            {r && <p className="text-xs text-ink-sub">다음 {formatDate(r.dueAt)}</p>}
          </div>
        </section>

        <GrammarView key={initial ?? 'none'} c={c} initialMode={initial} onWord={(id) => navigate(`/free/words/${id}`)} onConcept={(id) => navigate(`/grammar/${id}`)} />

        <section className="card p-5 space-y-2">
          <h3 className="section-title">8~10. 연습 · 영작 · 마무리</h3>
          <p className="text-sm text-ink-sub">읽기만으로는 완료되지 않아요. 확인 문제로 이해도를 확인하면 결과에 따라 다음 학습을 추천해 드려요.</p>
          <button type="button" className="btn-primary w-full" onClick={() => navigate(`/practice?concept=${c.id}&mode=check`)}>
            <Icon name="check" size={18} />
            단계별 연습 · 이해도 확인
          </button>
          {hasWrite && (
            <button type="button" className="btn-secondary w-full" onClick={() => navigate(`/practice?concept=${c.id}&type=write`)}>
              직접 영작하기
            </button>
          )}
          <button type="button" className="btn-secondary w-full" onClick={() => navigate(`/practice?concept=${c.id}`)}>
            마무리 테스트 (전체 {Math.min(n, 10)}문제)
          </button>
        </section>
      </Page>
    </>
  );
}
