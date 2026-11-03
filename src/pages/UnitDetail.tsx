import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { EmptyState, Header, LevelBadge, Page } from '../components/ui';
import { getConcept, getUnit, skipTestQuestionIds, SKIP_PASS_RATE } from '../data';
import { isLessonUnlocked, isUnitComplete, isUnitUnlocked, lessonsOfUnit } from '../lib/course';
import { formatDate } from '../lib/util';
import { useStore } from '../store/useStore';

export default function UnitDetail() {
  const { unitId = '' } = useParams();
  const navigate = useNavigate();
  const progress = useStore((s) => s.progress);
  const unit = getUnit(unitId);

  if (!unit)
    return (
      <>
        <Header title="단원" back="/course" />
        <Page>
          <EmptyState title="단원을 찾을 수 없어요" action={<button className="btn-secondary" onClick={() => navigate('/course')}>코스로 가기</button>} />
        </Page>
      </>
    );

  const back = `/course?level=${unit.level}`;
  if (unit.status !== 'ready')
    return (
      <>
        <Header title={unit.title} back={back} />
        <Page>
          <EmptyState title="콘텐츠 준비 중인 단원이에요" desc={`다룰 내용: ${unit.topics.join(', ')}`} />
        </Page>
      </>
    );

  const lessons = lessonsOfUnit(unit.id);
  const unlocked = isUnitUnlocked(unit, progress);
  const done = isUnitComplete(unit, progress);
  const skipped = progress.skippedUnits[unit.id];
  const skipCount = skipTestQuestionIds(unit.id).length;

  return (
    <>
      <Header title={unit.title} back={back} sub={`${unit.level} · 단원 ${unit.order}`} />
      <Page>
        <section className="card p-5">
          <div className="flex items-center gap-2">
            <LevelBadge level={unit.level} />
            {done && <span className="chip bg-ok-soft text-ok">{skipped ? '건너뛰기 통과' : '단원 완료'}</span>}
          </div>
          <h2 className="text-xl font-bold mt-2">{unit.title}</h2>
          <p className="text-sm text-ink-sub mt-1">{unit.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {unit.topics.map((t) => (
              <span key={t} className="chip bg-surface text-ink-sub">
                {t}
              </span>
            ))}
          </div>
        </section>

        {!unlocked && (
          <p className="card p-4 text-sm text-ink-sub flex items-center gap-2">
            <Icon name="lock" size={16} /> 앞 단원을 먼저 완료하면 열려요.
          </p>
        )}

        <ol className="space-y-2">
          {lessons.map((l) => {
            const c = getConcept(l.conceptId)!;
            const lDone = progress.completedLessons[l.id];
            const open = unlocked && isLessonUnlocked(l, progress);
            return (
              <li key={l.id}>
                <button
                  type="button"
                  disabled={!open}
                  onClick={() => navigate(`/course/lesson/${l.id}`)}
                  className="card w-full p-4 flex items-center gap-3 text-left active:bg-surface disabled:opacity-60"
                >
                  <span className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 ${lDone ? 'bg-ok-soft text-ok' : open ? 'bg-brand-soft text-brand-dark' : 'bg-surface text-ink-mute'}`}>
                    <span className="text-[10px] font-semibold leading-none">DAY</span>
                    <span className="text-lg font-extrabold leading-none mt-0.5">{l.day}</span>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold">{c.title}</span>
                    <span className="block text-xs text-ink-sub mt-0.5">
                      단어 {l.wordIds.length} · 문제 {l.practiceQuestionIds.length} · 영작 {l.writingQuestionIds.length} · 테스트 {l.testQuestionIds.length}
                    </span>
                    {lDone && <span className="block text-xs text-ok mt-0.5">{formatDate(lDone)} 완료 · 다시 학습 가능</span>}
                  </span>
                  {open ? <Icon name="chevron" size={18} className="text-ink-mute" /> : <Icon name="lock" size={18} className="text-ink-mute" />}
                </button>
              </li>
            );
          })}
        </ol>

        {unlocked && !done && (
          <section className="card p-5">
            <h3 className="font-bold">이미 아는 내용인가요?</h3>
            <p className="text-sm text-ink-sub mt-1">
              건너뛰기 테스트 {skipCount}문항에서 {Math.round(SKIP_PASS_RATE * 100)}% 이상 맞히면 이 단원을 완료로 처리하고 다음 단원이 열려요.
            </p>
            <button type="button" className="btn-secondary w-full mt-3" onClick={() => navigate(`/course/skip/${unit.id}`)}>
              건너뛰기 테스트
            </button>
          </section>
        )}

        <section className="card">
          <h3 className="px-4 pt-4 pb-1 font-bold">단원 자료</h3>
          <button type="button" onClick={() => navigate(`/free/words?unit=${unit.id}`)} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-surface">
            <Icon name="bookmark" size={18} />
            <span className="flex-1 text-left">단원 단어장 ({lessons.reduce((s, l) => s + l.wordIds.length, 0)}개)</span>
            <Icon name="chevron" size={18} className="text-ink-mute" />
          </button>
          {lessons.map((l) => (
            <button key={l.conceptId} type="button" onClick={() => navigate(`/grammar/${l.conceptId}`)} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-surface border-t border-line">
              <Icon name="course" size={18} />
              <span className="flex-1 text-left">{getConcept(l.conceptId)!.title}</span>
              <Icon name="chevron" size={18} className="text-ink-mute" />
            </button>
          ))}
        </section>
      </Page>
    </>
  );
}
