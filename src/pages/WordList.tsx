import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SpeakButton } from '../components/SpeakButton';
import { EmptyState, Header, Page } from '../components/ui';
import { getUnit, vocabulary } from '../data';
import { useStore } from '../store/useStore';
import { LEVELS, type Level } from '../types';

type Filter = 'all' | 'unknown' | 'known' | 'new';
const FILTERS: { v: Filter; label: string }[] = [
  { v: 'all', label: '전체' },
  { v: 'new', label: '미학습' },
  { v: 'unknown', label: '모름' },
  { v: 'known', label: '암기 완료' },
];

export default function WordList() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const progress = useStore((s) => s.progress);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const unitId = params.get('unit');
  const unit = unitId ? getUnit(unitId) : undefined;
  const lp = params.get('level') as Level | null;
  const level: Level = unit?.level ?? (lp && LEVELS.includes(lp) ? lp : 'A1');

  const base = useMemo(() => vocabulary.filter((w) => (unit ? w.unitId === unit.id : w.level === level)), [unit, level]);
  const list = base.filter((w) => {
    const st = progress.wordStatus[w.id];
    if (filter === 'known' && st !== 'known') return false;
    if (filter === 'unknown' && st !== 'unknown') return false;
    if (filter === 'new' && (st || progress.wordSeenAt[w.id])) return false;
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      return w.word.toLowerCase().includes(s) || w.meaning.includes(s);
    }
    return true;
  });

  return (
    <>
      <Header title={unit ? `${unit.title} 단어장` : `${level} 단어장`} back={unit ? `/course/unit/${unit.id}` : `/free?level=${level}`} sub={`${base.length}개 단어`} />
      <Page>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="단어 또는 뜻 검색" aria-label="단어 검색" className="w-full h-12 card px-4 outline-none focus:border-brand" />
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1" role="tablist" aria-label="단어 상태 필터">
          {FILTERS.map((f) => (
            <button key={f.v} type="button" role="tab" aria-selected={filter === f.v} onClick={() => setFilter(f.v)} className={`shrink-0 min-h-[36px] px-4 rounded-full text-sm font-semibold border ${filter === f.v ? 'bg-ink text-white border-ink' : 'bg-white border-line text-ink-sub'}`}>
              {f.label}
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <EmptyState title="조건에 맞는 단어가 없어요" desc="검색어나 필터를 바꿔 보세요." />
        ) : (
          <ul className="card divide-y divide-line">
            {list.map((w) => {
              const st = progress.wordStatus[w.id];
              return (
                <li key={w.id} className="flex items-center gap-2 pr-3">
                  <button type="button" onClick={() => navigate(`/free/words/${w.id}`)} className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3 text-left active:bg-surface">
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="en font-semibold">{w.word}</span>
                        <span className="text-xs text-ink-mute">{w.pos}</span>
                        {progress.savedWords.includes(w.id) && <Icon name="bookmark" size={13} className="text-brand" />}
                      </span>
                      <span className="block text-sm text-ink-sub truncate">{w.meaning}</span>
                    </span>
                    {st === 'known' && <span className="chip bg-ok-soft text-ok">암기</span>}
                    {st === 'unknown' && <span className="chip bg-warn-soft text-warn">모름</span>}
                  </button>
                  <SpeakButton text={w.word} size="sm" />
                </li>
              );
            })}
          </ul>
        )}
      </Page>
    </>
  );
}
