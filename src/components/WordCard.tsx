import { useNavigate } from 'react-router-dom';
import { getConcept } from '../data';
import { useStore } from '../store/useStore';
import type { Vocabulary } from '../types';
import { Icon } from './Icon';
import { SpeakButton } from './SpeakButton';
import { LevelBadge } from './ui';

export function WordCard({ w, showStatus = true, linkConcept = true }: { w: Vocabulary; showStatus?: boolean; linkConcept?: boolean }) {
  const navigate = useNavigate();
  const status = useStore((s) => s.progress.wordStatus[w.id]);
  const saved = useStore((s) => s.progress.savedWords.includes(w.id));
  const setWordStatus = useStore((s) => s.setWordStatus);
  const toggleSaveWord = useStore((s) => s.toggleSaveWord);
  const concept = w.linkedConceptId ? getConcept(w.linkedConceptId) : undefined;

  return (
    <article className="card p-5 space-y-4" aria-label={`단어 ${w.word}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <LevelBadge level={w.level} />
            <span className="text-xs text-ink-sub">{w.pos}</span>
          </div>
          <h2 className="en text-[28px] font-bold mt-1 leading-tight">{w.word}</h2>
          <p className="text-sm text-ink-sub mt-0.5">
            <span className="en">{w.ipa}</span> · 한글 참고 [{w.koPron}]
          </p>
        </div>
        <SpeakButton text={w.word} />
        <button
          type="button"
          onClick={() => toggleSaveWord(w.id)}
          aria-pressed={saved}
          aria-label={saved ? '단어 저장 취소' : '단어 저장'}
          className={`w-11 h-11 rounded-full flex items-center justify-center ${saved ? 'bg-brand-soft text-brand' : 'bg-surface text-ink'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 3h12v18l-6-4-6 4z" />
          </svg>
        </button>
      </div>

      <p className="text-lg font-semibold">{w.meaning}</p>

      <div className="rounded-xl bg-surface p-4 flex gap-2 items-start">
        <div className="flex-1 min-w-0">
          <p className="en font-medium">{w.example}</p>
          <p className="text-sm text-ink-sub mt-1">{w.exampleKo}</p>
        </div>
        <SpeakButton text={w.example} label="예문 듣기" size="sm" />
      </div>

      {(w.pattern || concept) && (
        <div className="rounded-xl border border-dashed border-line p-3 text-sm space-y-1">
          <p className="font-semibold flex items-center gap-1">
            <Icon name="link" size={16} className="text-brand" />
            연결 학습
          </p>
          {w.pattern && (
            <p>
              패턴: <span className="en font-semibold">{w.pattern}</span>
            </p>
          )}
          {concept && linkConcept && (
            <button type="button" onClick={() => navigate(`/grammar/${concept.id}`)} className="text-brand-dark font-semibold flex items-center gap-0.5 min-h-[32px]">
              문법: {concept.title}
              <Icon name="chevron" size={14} />
            </button>
          )}
          {concept && !linkConcept && <p className="text-ink-sub">이어서 '{concept.title}'에서 이 단어를 문장으로 써 봐요.</p>}
        </div>
      )}

      {showStatus && (
        <div className="grid grid-cols-2 gap-2">
          <button type="button" aria-pressed={status === 'unknown'} onClick={() => setWordStatus(w.id, 'unknown')} className={`btn border-2 ${status === 'unknown' ? 'border-warn bg-warn-soft text-warn' : 'border-line bg-white text-ink'}`}>
            {status === 'unknown' && <Icon name="check" size={16} />}
            모름
          </button>
          <button type="button" aria-pressed={status === 'known'} onClick={() => setWordStatus(w.id, 'known')} className={`btn border-2 ${status === 'known' ? 'border-ok bg-ok-soft text-ok' : 'border-line bg-white text-ink'}`}>
            {status === 'known' && <Icon name="check" size={16} />}
            암기 완료
          </button>
        </div>
      )}
    </article>
  );
}
