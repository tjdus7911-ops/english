import { useRef, useState, type ReactNode } from 'react';
import { getWord } from '../data';
import { tutor, type HelpMode } from '../lib/tutor';
import type { GrammarConcept } from '../types';
import { Icon } from './Icon';
import { SpeakButton } from './SpeakButton';
import { LevelBadge } from './ui';

const HELP: { mode: HelpMode; label: string }[] = [
  { mode: 'easy', label: '쉽게 설명하기' },
  { mode: 'detailed', label: '자세히 설명하기' },
  { mode: 'examples', label: '예문 더 보기' },
  { mode: 'compare', label: '비슷한 문법 비교' },
  { mode: 'confused', label: '아직 이해가 안 돼요' },
];

export const LECTURE_STEPS = ['학습 목적', '개념 설명', '문장 구조', '실생활 예문', '해석', '유사 문법 비교', '자주 틀리는 부분', '단계별 연습문제', '직접 영작하기', '마무리 테스트'];

function Sec({ n, title, children, id }: { n: string; title: string; children: ReactNode; id?: string }) {
  return (
    <section className="card p-5" id={id} aria-labelledby={`sec-${n}`}>
      <h3 id={`sec-${n}`} className="section-title flex items-center gap-2">
        <span className="min-w-[24px] h-6 px-1.5 rounded-full bg-brand-soft text-brand-dark text-xs font-bold flex items-center justify-center shrink-0">{n}</span>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** 문법 강의 (1~7단계). 8~10단계(연습·영작·테스트)는 학습 흐름에서 이어진다. */
export function GrammarView({ c, onWord, onConcept, initialMode = null }: { c: GrammarConcept; onWord?: (id: string) => void; onConcept?: (id: string) => void; initialMode?: HelpMode | null }) {
  const [mode, setMode] = useState<HelpMode | null>(initialMode);
  const compareRef = useRef<HTMLDivElement>(null);
  const help = mode ? tutor.explain(c.id, mode) : null;

  const pickMode = (m: HelpMode) => {
    setMode(mode === m ? null : m);
    if (m === 'compare') setTimeout(() => compareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <div className="space-y-4">
      <section className="card p-5">
        <div className="flex items-center gap-2">
          <LevelBadge level={c.level} />
          <span className="text-xs text-ink-sub">{c.category}</span>
        </div>
        <h2 className="text-xl font-bold mt-2">{c.title}</h2>
        <p className="mt-2 text-[15px]">{c.summary}</p>
      </section>

      <Sec n="1" title="오늘 배울 문법의 목적">
        <p className="text-[15px]">{c.goal}</p>
        <ul className="mt-3 space-y-1.5">
          {c.canDo.map((x) => (
            <li key={x} className="text-sm flex gap-2">
              <Icon name="check" size={16} className="text-ok mt-0.5 shrink-0" />
              {x}
            </li>
          ))}
        </ul>
      </Sec>

      <Sec n="2" title="개념 설명">
        <div className="space-y-3">
          {c.explanation.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-xs text-ink-sub mb-2">설명이 어렵거나 더 알고 싶다면</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="설명 도움">
            {HELP.map((h) => (
              <button
                key={h.mode}
                type="button"
                aria-pressed={mode === h.mode}
                onClick={() => pickMode(h.mode)}
                className={`min-h-[40px] px-3 rounded-full text-sm font-semibold border ${mode === h.mode ? 'bg-ink text-white border-ink' : h.mode === 'confused' ? 'border-brand text-brand-dark bg-white' : 'border-line bg-white'}`}
              >
                {h.label}
              </button>
            ))}
          </div>
          {help && mode !== 'compare' && (
            <div className="mt-3 rounded-2xl bg-surface p-4 space-y-2" role="region" aria-label={help.title}>
              <p className="font-bold text-sm">{help.title}</p>
              {help.paragraphs.map((p, i) => (
                <p key={i} className="text-[15px] leading-relaxed">
                  {p}
                </p>
              ))}
              {help.examples && (
                <ul className="space-y-2">
                  {help.examples.map((e) => (
                    <li key={e.en} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <p className="en font-medium">{e.en}</p>
                        <p className="text-sm text-ink-sub">{e.ko}</p>
                      </div>
                      <SpeakButton text={e.en} size="sm" label="예문 듣기" />
                    </li>
                  ))}
                </ul>
              )}
              {help.prerequisites && help.prerequisites.length > 0 && (
                <div className="pt-1 space-y-1">
                  <p className="text-sm font-semibold">선행 개념 복습</p>
                  {help.prerequisites.map((p) =>
                    onConcept ? (
                      <button key={p.id} type="button" onClick={() => onConcept(p.id)} className="flex items-center gap-1 text-brand-dark font-semibold text-sm min-h-[36px]">
                        {p.level} · {p.title}
                        <Icon name="chevron" size={14} />
                      </button>
                    ) : (
                      <p key={p.id} className="text-sm">
                        · {p.level} {p.title}
                      </p>
                    ),
                  )}
                </div>
              )}
              <p className="text-[11px] text-ink-mute">사전에 작성·검수된 설명이에요.</p>
            </div>
          )}
        </div>
      </Sec>

      <Sec n="3" title="문장 구조와 공식">
        <ul className="space-y-2">
          {c.structure.map((s) => (
            <li key={s} className="rounded-xl bg-surface px-4 py-3 en font-semibold text-[15px]">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl border border-line p-4">
          <p className="text-xs text-ink-sub">문장 분석</p>
          <p className="en font-semibold mt-1">{c.analysis.sentence}</p>
          <p className="text-sm text-ink-sub">{c.analysis.ko}</p>
          <ol className="mt-3 space-y-1.5">
            {c.analysis.parts.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm items-baseline">
                <span className="en font-semibold bg-brand-soft text-brand-dark rounded-md px-2 py-0.5 shrink-0">{p.text}</span>
                <span className="text-ink-sub">{p.role}</span>
              </li>
            ))}
          </ol>
        </div>
      </Sec>

      <Sec n="4·5" title="실생활 예문 · 문장별 해석">
        <ul className="space-y-3">
          {c.correctExamples.map((e) => (
            <li key={e.en} className="flex gap-2 items-start">
              <div className="flex-1">
                <p className="en font-medium">{e.en}</p>
                <p className="text-sm text-ink-sub">{e.ko}</p>
              </div>
              <SpeakButton text={e.en} size="sm" label="예문 듣기" />
            </li>
          ))}
          {c.realLife.map((e) => (
            <li key={e.en} className="rounded-xl bg-surface p-3 flex gap-2 items-start">
              <div className="flex-1">
                <p className="text-xs text-ink-sub">{e.situation}</p>
                <p className="en font-medium mt-0.5">{e.en}</p>
                <p className="text-sm text-ink-sub">{e.ko}</p>
              </div>
              <SpeakButton text={e.en} size="sm" label="예문 듣기" />
            </li>
          ))}
        </ul>
      </Sec>

      <div ref={compareRef}>
        <Sec n="6" title={`비슷한 문법 비교 · ${c.compare.title}`}>
          <div className={`rounded-xl overflow-hidden border ${mode === 'compare' ? 'border-brand' : 'border-line'}`}>
            <div className="grid grid-cols-2 bg-surface text-sm font-semibold">
              <p className="p-3">{c.compare.left}</p>
              <p className="p-3 border-l border-line">{c.compare.right}</p>
            </div>
            {c.compare.rows.map((r, i) => (
              <div key={i} className="grid grid-cols-2 text-sm border-t border-line">
                <p className="p-3 en">{r.left}</p>
                <p className="p-3 en border-l border-line">{r.right}</p>
              </div>
            ))}
          </div>
          <p className="text-sm mt-3 flex gap-2">
            <Icon name="bulb" size={16} className="text-brand mt-0.5 shrink-0" />
            {c.compare.tip}
          </p>
        </Sec>
      </div>

      <Sec n="7" title="자주 틀리는 부분">
        <ul className="space-y-3">
          {c.wrongExamples.map((e) => (
            <li key={e.en} className="rounded-xl border border-line p-3 text-sm space-y-1">
              <p className="en text-bad">
                <span className="font-bold">✗ 틀림</span> <span className="line-through decoration-1">{e.en}</span>
              </p>
              <p className="en text-ok font-semibold">✓ 바름 {e.fix}</p>
              <p className="text-ink-sub">{e.why}</p>
            </li>
          ))}
        </ul>
      </Sec>

      {c.linkedWordIds.length > 0 && (
        <section className="card p-5">
          <h3 className="section-title flex items-center gap-1">
            <Icon name="link" size={18} className="text-brand" />이 문법과 연결된 단어
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.linkedWordIds.map((id) => {
              const w = getWord(id);
              if (!w) return null;
              const content = (
                <>
                  <span className="en font-semibold">{w.word}</span>
                  <span className="text-ink-sub">{w.meaning}</span>
                </>
              );
              return onWord ? (
                <button key={id} type="button" onClick={() => onWord(id)} className="chip bg-surface text-ink text-sm min-h-[36px] px-3 gap-1.5">
                  {content}
                </button>
              ) : (
                <span key={id} className="chip bg-surface text-ink text-sm min-h-[36px] px-3 gap-1.5">
                  {content}
                </span>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
