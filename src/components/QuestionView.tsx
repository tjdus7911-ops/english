import { useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';
import { getConcept } from '../data';
import { explainMistake } from '../lib/grading';
import { seededShuffle } from '../lib/util';
import { MISTAKE_LABEL, QUESTION_TYPE_LABEL, type Question } from '../types';
import { Icon } from './Icon';
import { SpeakButton } from './SpeakButton';

export interface Checked {
  given: string;
  correct: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function displayAnswer(q: Question): string {
  if (q.type === 'error' && q.tokens) return `'${q.tokens[Number(q.answer)]}' 부분`;
  return q.answer;
}

function displayGiven(q: Question, given: string): string {
  if (q.type === 'error' && q.tokens) return given === '' ? '(선택 안 함)' : `'${q.tokens[Number(given)]}'`;
  return given || '(입력 없음)';
}

/** 한 문항을 보여 주고 답을 입력받는 컴포넌트 (6가지 유형 공통) */
export function QuestionView({ q, checked, onSubmit }: { q: Question; checked: Checked | null; onSubmit: (given: string) => void }) {
  const [choice, setChoice] = useState<string>('');
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  const options = useMemo(() => (q.options ? seededShuffle(q.options, q.id) : []), [q]);
  const orderTokens = useMemo(() => (q.type === 'order' && q.tokens ? seededShuffle(q.tokens.map((t, i) => ({ t, i })), q.id + 'ord') : []), [q]);

  const locked = !!checked;

  const current = (): string => {
    switch (q.type) {
      case 'mcq':
      case 'translate':
      case 'error':
        return choice;
      case 'order':
        return picked.map((i) => q.tokens![i]).join(' ');
      default:
        return text;
    }
  };
  const canSubmit = q.type === 'order' ? picked.length === (q.tokens?.length ?? 0) : current().trim() !== '';

  const submit = () => {
    if (!canSubmit || locked) return;
    onSubmit(current());
  };
  const onEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="chip bg-surface text-ink-sub">{QUESTION_TYPE_LABEL[q.type]}</span>
        <p className="mt-2 text-[15px] font-semibold">{q.prompt}</p>
      </div>

      {q.sentence && q.type !== 'blank' && (
        <div className="card p-4 flex items-start gap-2">
          <p className={`flex-1 text-[17px] leading-relaxed ${q.type === 'write' ? '' : 'en font-medium'}`}>{q.sentence}</p>
          {q.type !== 'write' && <SpeakButton text={q.sentence.replace(/___/g, 'blank')} />}
        </div>
      )}

      {q.type === 'blank' && q.sentence && (
        <div className="card p-4">
          <p className="en text-[17px] leading-relaxed font-medium">
            {q.sentence.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className={`inline-block min-w-[72px] px-2 mx-0.5 border-b-2 text-center ${checked ? (checked.correct ? 'border-ok text-ok' : 'border-bad text-bad') : 'border-brand text-brand'}`}>{text || ' '}</span>
                )}
              </span>
            ))}
          </p>
        </div>
      )}

      {(q.type === 'mcq' || q.type === 'translate') && (
        <ul className="space-y-2">
          {options.map((o, i) => {
            const isAns = o === q.answer;
            const isPicked = (checked ? checked.given : choice) === o;
            let cls = 'border-line bg-white';
            let tag: ReactNode = null;
            if (checked) {
              if (isAns) {
                cls = 'border-ok bg-ok-soft';
                tag = (
                  <span className="chip bg-ok text-white">
                    <Icon name="check" size={12} strokeWidth={3} />
                    정답
                  </span>
                );
              } else if (isPicked) {
                cls = 'border-bad bg-bad-soft';
                tag = (
                  <span className="chip bg-bad text-white">
                    <Icon name="x" size={12} strokeWidth={3} />내 선택
                  </span>
                );
              }
            } else if (isPicked) cls = 'border-brand bg-brand-soft';
            return (
              <li key={o}>
                <button
                  type="button"
                  disabled={locked}
                  aria-pressed={isPicked}
                  onClick={() => setChoice(o)}
                  className={`w-full min-h-[52px] flex items-center gap-3 text-left px-4 py-3 rounded-2xl border-2 transition-colors ${cls} disabled:cursor-default`}
                >
                  <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${isPicked && !checked ? 'bg-brand text-white' : 'bg-surface text-ink-sub'}`}>{LETTERS[i]}</span>
                  <span className={`flex-1 ${q.type === 'mcq' && /^[a-zA-Z]/.test(o) ? 'en' : ''}`}>{o}</span>
                  {tag}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {q.type === 'error' && q.tokens && (
        <div className="card p-4">
          <p className="text-xs text-ink-sub mb-3">틀린 부분을 눌러 선택하세요.</p>
          <div className="flex flex-wrap gap-2">
            {q.tokens.map((t, i) => {
              const s = String(i);
              const isPicked = (checked ? checked.given : choice) === s;
              let cls = 'border-line bg-white';
              if (checked) {
                if (s === q.answer) cls = 'border-ok bg-ok-soft text-ok';
                else if (isPicked) cls = 'border-bad bg-bad-soft text-bad line-through';
              } else if (isPicked) cls = 'border-brand bg-brand-soft text-brand-dark';
              return (
                <button key={i} type="button" disabled={locked} aria-pressed={isPicked} onClick={() => setChoice(s)} className={`en min-h-[44px] px-3 rounded-xl border-2 font-medium ${cls}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {q.type === 'order' && q.tokens && (
        <div className="space-y-3">
          <div className={`card p-3 min-h-[72px] flex flex-wrap gap-2 items-start ${checked ? (checked.correct ? 'border-ok' : 'border-bad') : ''}`} aria-label="내가 만든 문장">
            {picked.length === 0 && <span className="text-sm text-ink-mute p-1.5">아래 단어를 순서대로 눌러 문장을 만드세요.</span>}
            {picked.map((ti, pi) => (
              <button key={pi} type="button" disabled={locked} onClick={() => setPicked(picked.filter((_, j) => j !== pi))} className="en min-h-[40px] px-3 rounded-xl bg-ink text-white font-medium">
                {q.tokens![ti]}
              </button>
            ))}
          </div>
          {!locked && (
            <div className="flex flex-wrap gap-2">
              {orderTokens.map(({ t, i }) => (
                <button key={i} type="button" disabled={picked.includes(i)} onClick={() => setPicked([...picked, i])} className="en min-h-[44px] px-3 rounded-xl border-2 border-line bg-white font-medium disabled:opacity-25">
                  {t}
                </button>
              ))}
              {picked.length > 0 && (
                <button type="button" onClick={() => setPicked([])} className="min-h-[44px] px-3 text-sm text-ink-sub flex items-center gap-1">
                  <Icon name="refresh" size={16} />
                  다시
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {(q.type === 'blank' || q.type === 'write') && (
        <div>
          {q.type === 'write' ? (
            <textarea
              value={text}
              disabled={locked}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onEnter}
              rows={3}
              autoCapitalize="sentences"
              autoCorrect="off"
              spellCheck={false}
              placeholder="영어 문장을 입력하세요"
              aria-label="영작 답안"
              className="en w-full card p-4 text-[16px] resize-none outline-none focus:border-brand disabled:bg-surface"
            />
          ) : (
            <input
              value={text}
              disabled={locked}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onEnter}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="빈칸에 들어갈 말"
              aria-label="빈칸 답안"
              className="en w-full card px-4 h-12 text-[16px] outline-none focus:border-brand disabled:bg-surface"
            />
          )}
          {q.hint && !locked && (
            <button type="button" onClick={() => setShowHint((v) => !v)} className="mt-2 text-sm text-ink-sub flex items-center gap-1 min-h-[36px]">
              <Icon name="bulb" size={16} />
              {showHint ? `힌트: ${q.hint}` : '힌트 보기'}
            </button>
          )}
        </div>
      )}

      {!checked && (
        <button type="button" className="btn-primary w-full" disabled={!canSubmit} onClick={submit}>
          정답 확인
        </button>
      )}

      {checked && <Feedback q={q} checked={checked} />}
    </div>
  );
}

export function Feedback({ q, checked }: { q: Question; checked: Checked }) {
  const why = checked.correct ? null : explainMistake(q, checked.given);
  const concept = q.recommendConceptId ? getConcept(q.recommendConceptId) : undefined;
  return (
    <div role="status" className={`rounded-2xl p-4 space-y-2 ${checked.correct ? 'bg-ok-soft' : 'bg-bad-soft'}`}>
      <p className={`flex items-center gap-2 font-bold ${checked.correct ? 'text-ok' : 'text-bad'}`}>
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${checked.correct ? 'bg-ok' : 'bg-bad'}`}>
          <Icon name={checked.correct ? 'check' : 'x'} size={14} strokeWidth={3} />
        </span>
        {checked.correct ? '정답이에요' : '오답이에요'}
      </p>
      {!checked.correct && (
        <div className="text-sm space-y-1">
          <p>
            <span className="text-ink-sub">내 답: </span>
            <span className="en">{displayGiven(q, checked.given)}</span>
          </p>
          <p>
            <span className="text-ink-sub">정답: </span>
            <span className="en font-semibold">{displayAnswer(q)}</span>
          </p>
          <p className="pt-1">
            <span className="chip bg-white text-bad">{MISTAKE_LABEL[q.mistakeType]}</span>
          </p>
          {why && <p className="text-ink">{why}</p>}
        </div>
      )}
      {checked.correct && q.type === 'write' && (
        <p className="text-sm">
          <span className="text-ink-sub">모범 답안: </span>
          <span className="en font-semibold">{q.answer}</span>
        </p>
      )}
      <p className="text-sm text-ink whitespace-pre-line">{q.explanation}</p>
      {!checked.correct && concept && (
        <p className="text-xs text-ink-sub flex items-center gap-1">
          <Icon name="link" size={14} />
          관련 개념: {concept.title} — 오답노트와 복습에 자동으로 추가돼요.
        </p>
      )}
    </div>
  );
}
