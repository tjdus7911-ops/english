import { tutor } from '../lib/tutor';
import type { CheckOutcome } from '../lib/understanding';
import type { GrammarConcept } from '../types';
import { Icon } from './Icon';

const TONE = {
  understood: { box: 'bg-ok-soft', text: 'text-ok', icon: 'check', label: '이해도 높음' },
  partial: { box: 'bg-warn-soft', text: 'text-warn', icon: 'refresh', label: '일부 개념 오답' },
  'needs-basics': { box: 'bg-bad-soft', text: 'text-bad', icon: 'info', label: '반복 오답 · 기초 필요' },
} as const;

/** 확인 문제 결과에 따른 다음 행동 추천 */
export function UnderstandingPanel({
  outcome,
  concept,
  onNext,
  onExtra,
  onBasics,
  onConcept,
  extraAvailable,
}: {
  outcome: CheckOutcome;
  concept: GrammarConcept;
  onNext: () => void;
  onExtra?: () => void;
  onBasics?: () => void;
  onConcept?: (id: string) => void;
  extraAvailable: boolean;
}) {
  const t = TONE[outcome.result];
  const basics = outcome.result === 'needs-basics' ? tutor.explain(concept.id, 'confused') : null;
  return (
    <div className="space-y-4">
      <section className={`rounded-2xl p-5 ${t.box}`} role="status">
        <p className={`flex items-center gap-2 font-bold ${t.text}`}>
          <Icon name={t.icon} size={20} />
          {t.label} · 확인 문제 {outcome.correct}/{outcome.total}
        </p>
        <h2 className="text-lg font-bold mt-2">{outcome.title}</h2>
        <p className="text-sm mt-1">{outcome.advice}</p>
      </section>

      {basics && (
        <section className="card p-5 space-y-2">
          <h3 className="font-bold">기초 설명 다시 보기</h3>
          {basics.paragraphs.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed">
              {p}
            </p>
          ))}
          {basics.prerequisites?.map((p) =>
            onConcept ? (
              <button key={p.id} type="button" onClick={() => onConcept(p.id)} className="flex items-center gap-1 text-brand-dark font-semibold text-sm min-h-[36px]">
                선행 개념: {p.level} {p.title}
                <Icon name="chevron" size={14} />
              </button>
            ) : (
              <p key={p.id} className="text-sm font-semibold">
                선행 개념: {p.level} {p.title}
              </p>
            ),
          )}
        </section>
      )}

      <div className="space-y-2">
        {outcome.result === 'understood' && (
          <button type="button" className="btn-primary w-full" onClick={onNext}>
            다음 학습 진행
          </button>
        )}
        {outcome.result === 'partial' && (
          <>
            {extraAvailable && onExtra && (
              <button type="button" className="btn-primary w-full" onClick={onExtra}>
                이 개념 추가 연습 (다른 문장)
              </button>
            )}
            <button type="button" className={extraAvailable ? 'btn-secondary w-full' : 'btn-primary w-full'} onClick={onNext}>
              다음 학습으로
            </button>
          </>
        )}
        {outcome.result === 'needs-basics' && (
          <>
            {onBasics && (
              <button type="button" className="btn-primary w-full" onClick={onBasics}>
                쉬운 설명 보고 확인 문제 다시 풀기
              </button>
            )}
            <button type="button" className="btn-ghost w-full" onClick={onNext}>
              일단 계속 진행 (개념은 미완료로 남아요)
            </button>
          </>
        )}
      </div>
    </div>
  );
}
