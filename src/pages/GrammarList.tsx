import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Header, Page, Segmented } from '../components/ui';
import { concepts, courses } from '../data';
import { conceptMastery, MASTERY_LABEL } from '../lib/analysis';
import { useStore } from '../store/useStore';
import { LEVELS, type Level } from '../types';

const STATE_CLS = { 'no-data': 'bg-surface text-ink-sub', learning: 'bg-brand-soft text-brand-dark', stable: 'bg-ok-soft text-ok', weak: 'bg-bad-soft text-bad' };

export default function GrammarList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { profile, progress, answers, wrongNotes } = useStore();
  const p = params.get('level') as Level | null;
  const level: Level = p && LEVELS.includes(p) ? p : profile.courseLevel;
  const list = concepts.filter((c) => c.level === level);
  const preparing = courses.find((c) => c.level === level)!.units.filter((u) => u.status !== 'ready');

  return (
    <>
      <Header title="문법 단원" back={`/free?level=${level}`} />
      <Page>
        <Segmented ariaLabel="문법 레벨" value={level} options={LEVELS.map((l) => ({ value: l, label: l }))} onChange={(l) => setParams({ level: l }, { replace: true })} />
        <ul className="space-y-2">
          {list.map((c) => {
            const m = conceptMastery(c.id, answers, wrongNotes);
            return (
              <li key={c.id}>
                <button type="button" onClick={() => navigate(`/grammar/${c.id}`)} className="card w-full p-4 text-left flex items-start gap-3 active:bg-surface">
                  <span className="flex-1 min-w-0">
                    <span className="text-xs text-ink-sub">{c.category}</span>
                    <span className="block font-semibold mt-0.5">{c.title}</span>
                    <span className="block text-sm text-ink-sub mt-0.5">{c.summary}</span>
                    <span className="flex gap-1.5 mt-2">
                      {progress.conceptDone[c.id] && <span className="chip bg-ok-soft text-ok">학습 완료</span>}
                      <span className={`chip ${STATE_CLS[m.state]}`}>
                        {MASTERY_LABEL[m.state]}
                        {m.attempts > 0 && ` · ${m.correct}/${m.attempts}`}
                      </span>
                    </span>
                  </span>
                  <Icon name="chevron" size={18} className="text-ink-mute mt-1" />
                </button>
              </li>
            );
          })}
        </ul>
        {preparing.length > 0 && (
          <section className="card p-4">
            <h3 className="font-semibold text-ink-sub">콘텐츠 준비 중</h3>
            <ul className="mt-2 space-y-1 text-sm text-ink-sub">
              {preparing.map((u) => (
                <li key={u.id}>· {u.topics.join(', ')}</li>
              ))}
            </ul>
          </section>
        )}
      </Page>
    </>
  );
}
