import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { LevelBadge, Page, ProgressBar, Stat, useToast } from '../components/ui';
import { getConcept, getUnit, LEVEL_LABEL } from '../data';
import { streakDays } from '../lib/analysis';
import { buildPlan, estimateMinutes, levelProgress, nextLesson } from '../lib/course';
import { recommendLoad } from '../lib/recommend';
import { reviewSummary } from '../lib/review';
import { dayKey, startOfDay } from '../lib/util';
import { useStore } from '../store/useStore';

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const s = useStore();
  const { profile, progress, answers, sessions, reviews, wrongNotes, inbox } = s;
  const now = Date.now();
  const today = dayKey(now);

  const sum = useMemo(() => reviewSummary(reviews, profile.reviewPerDay, now), [reviews, profile.reviewPerDay, now]);
  const rec = useMemo(() => recommendLoad(answers, profile.dailyWordGoal, now), [answers, profile.dailyWordGoal, now]);
  const { lesson, levelDone, nextLevel } = nextLesson(profile.courseLevel, progress);
  const lp = levelProgress(profile.courseLevel, progress);
  const unresolved = Object.values(wrongNotes).filter((w) => !w.resolved).length;
  const streak = streakDays(answers, sessions, now);
  const todayAnswers = answers.filter((a) => a.at >= startOfDay(now));
  const known = Object.values(progress.wordStatus).filter((x) => x === 'known').length;
  const unread = inbox.filter((n) => !n.read).length;

  const plan = lesson ? buildPlan(lesson, profile) : null;
  const est = plan ? estimateMinutes(plan, 0) : 0;
  const unit = lesson ? getUnit(lesson.unitId) : undefined;
  const concept = lesson ? getConcept(lesson.conceptId) : undefined;
  const last = progress.lastLocation;
  const snoozed = s.reviewSnoozedDay === today;
  const hasReviewToday = profile.reviewEnabled && sum.todayCount > 0;
  const showRec = rec.kind !== 'insufficient' && rec.kind !== 'keep' && s.loadDecision?.day !== today;

  return (
    <>
      <header className="bg-white px-4 pt-5 pb-4 border-b border-line">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xl font-extrabold">
            혼자<span className="text-brand">영어</span>
          </p>
          <div className="flex items-center gap-1">
            <span className="chip bg-surface text-ink min-h-[32px] px-3" aria-label={`학습 연속 ${streak}일`}>
              <Icon name="flame" size={16} className={streak > 0 ? 'text-brand' : 'text-ink-mute'} />
              {streak}일
            </span>
            <button type="button" onClick={() => navigate('/notifications')} className="relative w-11 h-11 rounded-full flex items-center justify-center active:bg-surface" aria-label={`알림함${unread ? `, 읽지 않은 알림 ${unread}개` : ''}`}>
              <Icon name="bell" size={22} />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>}
            </button>
          </div>
        </div>
      </header>
      <Page>
        {/* 1. 오늘의 복습 (복습 우선) */}
        <section className="card p-5" aria-label="오늘의 복습">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[17px]">오늘의 복습</h2>
            {sum.doneToday + sum.todayCount > 0 && <span className="text-sm text-ink-sub tabular-nums">완료율 {sum.completion}%</span>}
          </div>
          {!profile.reviewEnabled ? (
            <p className="text-sm text-ink-sub mt-2">복습 일정이 꺼져 있어요. MY &gt; 학습 설정에서 켤 수 있어요.</p>
          ) : hasReviewToday && !snoozed ? (
            <>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-xs text-ink-sub">영단어</p>
                  <p className="text-xl font-bold tabular-nums">{sum.dueWords}</p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-xs text-ink-sub">문법</p>
                  <p className="text-xl font-bold tabular-nums">{sum.dueConcepts}</p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-xs text-ink-sub">예상 시간</p>
                  <p className="text-xl font-bold tabular-nums">
                    {sum.estMinutes}
                    <span className="text-sm font-semibold">분</span>
                  </p>
                </div>
              </div>
              <ProgressBar value={sum.completion} className="mt-3" label="오늘 복습 완료율" />
              {sum.deferred > 0 && <p className="text-xs text-ink-sub mt-2">하루 복습량({profile.reviewPerDay}개)을 넘는 {sum.deferred}개는 다음 날로 나눠 드려요. 밀려도 불이익은 없어요.</p>}
              <div className="flex gap-2 mt-4">
                <button type="button" className="btn-primary flex-[2]" onClick={() => navigate('/review')}>
                  복습 시작
                </button>
                <button type="button" className="btn-secondary flex-1" onClick={() => s.snoozeReview(today)}>
                  나중에
                </button>
              </div>
            </>
          ) : hasReviewToday && snoozed ? (
            <button type="button" onClick={() => s.snoozeReview(null)} className="mt-2 text-sm text-ink-sub flex items-center gap-1 min-h-[40px]">
              복습 {sum.todayCount}개가 남아 있어요 · 다시 펼치기
              <Icon name="chevron" size={14} />
            </button>
          ) : sum.doneToday > 0 ? (
            <div className="mt-2">
              <p className="font-semibold text-ok flex items-center gap-1">
                <Icon name="check" size={18} />
                오늘 복습을 모두 완료했어요! 이제 새로운 영어를 배워볼까요?
              </p>
              {rec.weakConcepts.length > 0 && (
                <p className="text-sm text-ink-sub mt-1">
                  취약 개념:{' '}
                  {rec.weakConcepts.slice(0, 2).map((w, i) => (
                    <button key={w.id} type="button" className="text-brand-dark font-semibold underline" onClick={() => navigate(`/grammar/${w.id}`)}>
                      {i > 0 ? ', ' : ''}
                      {w.title}
                    </button>
                  ))}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-sub mt-2">오늘은 복습할 내용이 없어요. 바로 새로운 학습을 시작해요.</p>
          )}
        </section>

        {/* 2. 맞춤 학습량 추천 */}
        {showRec && (
          <section className="card p-5 border-brand" aria-label="오늘의 추천">
            <p className="text-xs font-semibold text-brand-dark">오늘의 추천 · {rec.label}</p>
            <p className="text-[15px] mt-1">{rec.message}</p>
            <p className="text-xs text-ink-sub mt-2">정답률은 실력을 단정하는 지표가 아니라 학습량을 정하기 위한 참고값이에요.</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={() => {
                  s.updateProfile({ dailyWordGoal: rec.suggestedGoal });
                  s.setLoadDecision({ day: today, kind: rec.kind, applied: true });
                  toast(`신규 단어 목표를 ${rec.suggestedGoal}개로 바꿨어요.`);
                }}
              >
                추천대로 ({rec.suggestedGoal}개)
              </button>
              <button type="button" className="btn-secondary flex-1" onClick={() => s.setLoadDecision({ day: today, kind: rec.kind, applied: false })}>
                그대로 ({rec.currentGoal}개)
              </button>
            </div>
            <div className="flex gap-3 mt-2 text-sm">
              {rec.weakConcepts[0] && (
                <button type="button" className="text-brand-dark font-semibold min-h-[36px]" onClick={() => navigate(`/practice?concept=${rec.weakConcepts[0].id}`)}>
                  '{rec.weakConcepts[0].title}' 복습하기
                </button>
              )}
              <button type="button" className="text-ink-sub underline min-h-[36px]" onClick={() => navigate('/my')}>
                직접 변경
              </button>
            </div>
          </section>
        )}
        {rec.kind === 'insufficient' && answers.length > 0 && <p className="text-xs text-ink-sub px-1">{rec.message}</p>}

        {/* 3. 오늘의 신규 학습 */}
        <section className="card p-5" aria-label="오늘의 학습">
          <div className="flex items-center gap-2">
            <LevelBadge level={profile.courseLevel} />
            <span className="text-sm text-ink-sub">오늘의 신규 학습</span>
          </div>
          {lesson && unit && concept && plan ? (
            <>
              <p className="text-sm text-ink-sub mt-3">
                {unit.title} · DAY {lesson.day}
              </p>
              <h2 className="text-xl font-bold mt-0.5">{concept.title}</h2>
              <ul className="mt-3 text-sm text-ink-sub flex flex-wrap gap-x-3 gap-y-1">
                <li>단어 {plan.wordIds.length}</li>
                <li>문법 강의 1</li>
                <li>확인 문제 {plan.check.length}</li>
                <li>영작 {plan.writing.length}</li>
                <li>마무리 테스트 {plan.test.length}</li>
              </ul>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <Icon name="clock" size={16} className="text-ink-sub" />
                <span>
                  예상 <b>{est}분</b> · {profile.dailyMinutes}분 코스
                </span>
              </div>
              {hasReviewToday && !snoozed && <p className="text-xs text-ink-sub mt-2">복습을 먼저 하면 좋지만, 바로 시작해도 괜찮아요.</p>}
              <button type="button" className={`${hasReviewToday && !snoozed ? 'btn-secondary' : 'btn-primary'} w-full mt-4`} onClick={() => navigate(`/course/lesson/${lesson.id}`)}>
                신규 학습 시작
              </button>
            </>
          ) : (
            <div className="mt-3">
              <h2 className="text-lg font-bold">{LEVEL_LABEL[profile.courseLevel]} 대표 단원을 모두 마쳤어요</h2>
              <p className="text-sm text-ink-sub mt-1">나머지 단원은 콘텐츠 준비 중이에요. {nextLevel ? `${nextLevel} 코스로 넘어가거나 ` : ''}복습과 자유학습으로 실력을 다져 보세요.</p>
              <div className="flex gap-2 mt-4">
                {levelDone && nextLevel && (
                  <button type="button" className="btn-primary flex-1" onClick={() => s.updateProfile({ courseLevel: nextLevel })}>
                    {nextLevel} 시작하기
                  </button>
                )}
                <button type="button" className="btn-secondary flex-1" onClick={() => navigate('/course')}>
                  코스 보기
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">학습 진도</h3>
            <span className="text-sm text-ink-sub tabular-nums">
              {lp.done} / {lp.total} DAY
            </span>
          </div>
          <ProgressBar value={lp.done} max={lp.total} className="mt-3" label="레벨 진도" />
          <div className="flex mt-4 gap-3">
            <Stat label="연속 학습" value={streak} unit="일" />
            <Stat label="오늘 푼 문제" value={todayAnswers.length} unit="개" />
            <Stat label="외운 단어" value={known} unit="개" />
          </div>
        </section>

        {last && (
          <button type="button" onClick={() => navigate(last.path)} className="card w-full p-4 flex items-center gap-3 text-left active:bg-surface">
            <span className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
              <Icon name="play" size={18} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-xs text-ink-sub">이어서 공부하기</span>
              <span className="block font-semibold truncate">{last.label}</span>
            </span>
            <Icon name="chevron" size={18} className="text-ink-mute" />
          </button>
        )}

        <section>
          <h3 className="font-bold px-1 mb-2">자유학습 바로가기</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['/free/word-study', '오늘의 단어', `${profile.dailyWordGoal}개 목표`, 'bookmark'],
              ['/free/word-quiz', '단어 퀴즈', '뜻·철자 확인', 'check'],
              ['/free/grammar', '문법 강의', '개념 + 확인 문제', 'course'],
              ['/wrong-notes', '오답노트', `미해결 ${unresolved}개`, 'note'],
            ].map(([to, t, d, ic]) => (
              <button key={to} type="button" onClick={() => navigate(to)} className="card p-4 text-left active:bg-surface min-h-[96px]">
                <Icon name={ic} size={20} className="text-brand" />
                <p className="font-semibold mt-2">{t}</p>
                <p className="text-xs text-ink-sub">{d}</p>
              </button>
            ))}
          </div>
        </section>
      </Page>
    </>
  );
}
