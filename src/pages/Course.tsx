import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Header, Page, ProgressBar, Segmented, useToast } from '../components/ui';
import { courses } from '../data';
import { isUnitComplete, isUnitUnlocked, lessonsOfUnit, levelProgress } from '../lib/course';
import { useStore } from '../store/useStore';
import { LEVELS, type Level } from '../types';

export default function Course() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const profile = useStore((s) => s.profile);
  const progress = useStore((s) => s.progress);
  const updateProfile = useStore((s) => s.updateProfile);
  const initial = (params.get('level') as Level) || profile.courseLevel;
  const [level, setLevel] = useState<Level>(LEVELS.includes(initial) ? initial : 'A1');
  const course = courses.find((c) => c.level === level)!;
  const lp = levelProgress(level, progress);

  return (
    <>
      <Header title="학습코스" />
      <Page>
        <Segmented
          ariaLabel="레벨 선택"
          value={level}
          options={LEVELS.map((l) => ({ value: l, label: l }))}
          onChange={(l) => {
            setLevel(l);
            setParams({ level: l }, { replace: true });
          }}
        />

        <section className="card p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm text-ink-sub">{course.subtitle}</p>
              <h2 className="text-xl font-bold">{course.title}</h2>
            </div>
            {profile.courseLevel === level ? (
              <span className="chip bg-brand text-white">내 학습 레벨</span>
            ) : (
              <button
                type="button"
                className="chip bg-surface text-ink min-h-[32px] px-3"
                onClick={() => {
                  updateProfile({ courseLevel: level });
                  toast(`학습 레벨을 ${level}(으)로 바꿨어요.`);
                }}
              >
                이 레벨로 학습
              </button>
            )}
          </div>
          <p className="text-sm text-ink-sub mt-2">{course.description}</p>
          <div className="flex items-center gap-3 mt-4">
            <ProgressBar value={lp.done} max={lp.total} className="flex-1" label={`${level} 진도`} />
            <span className="text-xs text-ink-sub tabular-nums">
              {lp.done}/{lp.total} DAY
            </span>
          </div>
        </section>

        <ol className="space-y-2">
          {course.units.map((u) => {
            const ready = u.status === 'ready';
            const done = ready && isUnitComplete(u, progress);
            const unlocked = ready && isUnitUnlocked(u, progress);
            const ls = lessonsOfUnit(u.id);
            const doneDays = ls.filter((l) => progress.completedLessons[l.id]).length;
            let badge;
            if (!ready) badge = <span className="chip bg-surface text-ink-sub">콘텐츠 준비 중</span>;
            else if (done) badge = <span className="chip bg-ok-soft text-ok"><Icon name="check" size={12} strokeWidth={3} />완료</span>;
            else if (!unlocked) badge = <span className="chip bg-surface text-ink-sub"><Icon name="lock" size={12} />잠김</span>;
            else badge = <span className="chip bg-brand-soft text-brand-dark">{doneDays > 0 ? `${doneDays}/${ls.length} DAY` : '학습 가능'}</span>;
            const body = (
              <>
                <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${ready ? 'bg-brand-soft text-brand-dark' : 'bg-surface text-ink-mute'}`}>{u.order}</span>
                <span className="flex-1 min-w-0 text-left">
                  <span className={`block font-semibold ${ready ? '' : 'text-ink-sub'}`}>{u.title}</span>
                  <span className="block text-sm text-ink-sub mt-0.5">{u.description}</span>
                  <span className="block mt-2">{badge}</span>
                </span>
                {ready && <Icon name="chevron" size={18} className="text-ink-mute shrink-0 mt-2" />}
              </>
            );
            return (
              <li key={u.id}>
                {ready ? (
                  <button type="button" onClick={() => navigate(`/course/unit/${u.id}`)} className="card w-full p-4 flex gap-3 items-start active:bg-surface">
                    {body}
                  </button>
                ) : (
                  <div className="card p-4 flex gap-3 items-start" aria-disabled="true">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-ink-sub px-1">MVP에서는 레벨마다 대표 단원 1개를 완성했어요. '콘텐츠 준비 중' 단원은 아직 학습할 수 없어요.</p>
      </Page>
    </>
  );
}
