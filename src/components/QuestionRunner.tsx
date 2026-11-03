import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConcept } from '../data';
import { isCorrect } from '../lib/grading';
import { pct } from '../lib/util';
import { useStore } from '../store/useStore';
import type { AnswerSource, Question } from '../types';
import { Icon } from './Icon';
import { QuestionView, type Checked } from './QuestionView';
import { ProgressBar } from './ui';

export interface RunResult {
  question: Question;
  given: string;
  correct: boolean;
}

/**
 * 문항 묶음 풀이. 채점 즉시 답안을 저장(오답노트·복습 일정·숙련도 자동 반영)하고
 * 모두 끝나면 onFinish로 결과를 넘긴다.
 */
export function QuestionRunner({
  questions,
  source,
  getSessionId,
  onFinish,
  finishLabel = '결과 보기',
  renderExtra,
  reviewKeys,
}: {
  questions: Question[];
  source: AnswerSource;
  getSessionId: () => string;
  onFinish: (results: RunResult[]) => void;
  finishLabel?: string;
  renderExtra?: (q: Question, checked: Checked) => ReactNode;
  /** 문항별 복습 항목 키 (복습 화면) */
  reviewKeys?: (string | undefined)[];
}) {
  const recordAnswer = useStore((s) => s.recordAnswer);
  const [idx, setIdx] = useState(0);
  const [checked, setChecked] = useState<Checked | null>(null);
  const [results, setResults] = useState<RunResult[]>([]);

  const q = questions[idx];
  if (!q) return null;
  const last = idx === questions.length - 1;

  const submit = (given: string) => {
    const correct = isCorrect(q, given);
    recordAnswer(q, given, correct, source, getSessionId(), reviewKeys?.[idx]);
    setChecked({ given, correct });
    setResults((r) => [...r, { question: q, given, correct }]);
  };

  const next = () => {
    if (last) {
      onFinish(results);
      return;
    }
    setChecked(null);
    setIdx((i) => i + 1);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ProgressBar value={idx + (checked ? 1 : 0)} max={questions.length} className="flex-1" label="문제 진행률" />
        <span className="text-xs font-semibold text-ink-sub tabular-nums">
          {idx + 1} / {questions.length}
        </span>
      </div>
      <QuestionView key={q.id + idx} q={q} checked={checked} onSubmit={submit} />
      {checked && renderExtra?.(q, checked)}
      {checked && (
        <button type="button" className="btn-primary w-full" onClick={next}>
          {last ? finishLabel : '다음 문제'}
        </button>
      )}
    </div>
  );
}

export function ResultSummary({ results, title = '풀이 결과', children }: { results: RunResult[]; title?: string; children?: ReactNode }) {
  const navigate = useNavigate();
  const correct = results.filter((r) => r.correct).length;
  const wrong = results.filter((r) => !r.correct);
  const conceptIds = [...new Set(wrong.flatMap((r) => (r.question.recommendConceptId ? [r.question.recommendConceptId] : r.question.conceptIds)))];
  return (
    <div className="space-y-4">
      <div className="card p-5 text-center">
        <p className="text-sm text-ink-sub">{title}</p>
        <p className="text-4xl font-extrabold mt-1 tabular-nums">
          {correct}
          <span className="text-xl text-ink-sub font-bold"> / {results.length}</span>
        </p>
        <p className="text-sm mt-1">
          정답률 <b className="text-brand">{pct(correct, results.length)}%</b>
        </p>
      </div>

      {wrong.length > 0 && (
        <section className="card">
          <h3 className="px-4 pt-4 pb-2 font-bold">틀린 문제 {wrong.length}개</h3>
          <ul className="divide-y divide-line">
            {wrong.map((r, i) => (
              <li key={r.question.id + i} className="px-4 py-3 text-sm">
                <p className="font-medium">{r.question.sentence ?? r.question.prompt}</p>
                <p className="text-ink-sub mt-0.5">
                  정답: <span className="en text-ink font-semibold">{r.question.type === 'error' ? r.question.tokens![Number(r.question.answer)] : r.question.answer}</span>
                </p>
              </li>
            ))}
          </ul>
          <p className="px-4 pb-4 pt-1 text-xs text-ink-sub flex items-center gap-1">
            <Icon name="check" size={14} /> 오답노트에 자동 저장됐어요.
          </p>
        </section>
      )}

      {conceptIds.length > 0 && (
        <section className="card p-4">
          <h3 className="font-bold">관련 개념 복습</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {conceptIds.map((id) => {
              const c = getConcept(id);
              if (!c) return null;
              return (
                <button key={id} type="button" onClick={() => navigate(`/grammar/${id}`)} className="chip bg-brand-soft text-brand-dark min-h-[36px] px-3 text-sm">
                  {c.title}
                  <Icon name="chevron" size={14} />
                </button>
              );
            })}
          </div>
        </section>
      )}
      {children}
    </div>
  );
}
