import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Header, Page, Stat } from '../components/ui';
import { concepts, getConcept, LEVEL_LABEL } from '../data';
import { allConceptMastery, AREA_LABEL, areaStats, categoryStats, dailyTrend, MASTERY_LABEL, memoryStats, retentionRate, reviewTypeStats, streakDays, totalStudySec } from '../lib/analysis';
import { MEMORY_LABEL } from '../lib/review';
import { formatDate, formatMinutes } from '../lib/util';
import { useStore } from '../store/useStore';
import { QUESTION_TYPE_LABEL, type MemoryState } from '../types';

const STATE_CLS = { 'no-data': 'bg-surface text-ink-sub', learning: 'bg-brand-soft text-brand-dark', stable: 'bg-ok-soft text-ok', weak: 'bg-bad-soft text-bad' };
const MEM_ORDER: MemoryState[] = ['new', 'due', 'learning', 'stable', 'relearn'];

function Bar({ value, muted }: { value: number; muted?: boolean }) {
  return (
    <div className="h-2.5 bg-surface rounded-full overflow-hidden flex-1">
      <div className={`h-full rounded-full ${muted ? 'bg-line' : 'bg-brand'}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function Stats() {
  const navigate = useNavigate();
  const { profile, progress, answers, sessions, wrongNotes, reviews, reviewEvents } = useStore();
  const now = Date.now();
  const areas = useMemo(() => areaStats(answers), [answers]);
  const cats = useMemo(() => categoryStats(answers), [answers]);
  const mastery = useMemo(() => allConceptMastery(answers, wrongNotes), [answers, wrongNotes]);
  const trend = useMemo(() => dailyTrend(answers, 14), [answers]);
  const mem = useMemo(() => memoryStats(reviews, now), [reviews, now]);
  const typeStats = useMemo(() => reviewTypeStats(reviewEvents), [reviewEvents]);
  const retention = useMemo(() => retentionRate(reviewEvents), [reviewEvents]);
  const weak = mastery.filter((m) => m.state === 'weak');
  const known = Object.values(progress.wordStatus).filter((s) => s === 'known').length;
  const seen = Object.keys(progress.wordSeenAt).length;
  const maxDay = Math.max(1, ...trend.map((d) => d.attempts));
  const thisWeek = trend.slice(7).reduce((s, d) => ({ a: s.a + d.attempts, c: s.c + d.correct }), { a: 0, c: 0 });
  const lastWeek = trend.slice(0, 7).reduce((s, d) => ({ a: s.a + d.attempts, c: s.c + d.correct }), { a: 0, c: 0 });
  const recentSessions = [...sessions].filter((s) => s.endedAt).reverse().slice(0, 8);
  const empty = answers.length === 0 && sessions.length === 0;

  return (
    <>
      <Header title="실력분석" />
      <Page>
        <p className="text-xs text-ink-sub px-1">아래 수치는 앱 안의 학습 데이터로 계산한 '추정 숙련도'예요. 실제 영어 능력이나 공인 CEFR 등급과 같지 않아요.</p>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">학습 요약</h2>
            <span className="text-xs text-ink-sub">
              진단: 어휘 {profile.vocabLevel} · 문법 {profile.grammarLevel}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-3 mt-4">
            <Stat label="외운 단어 / 학습한 단어" value={`${known}/${seen}`} unit="개" />
            <Stat label="누적 학습 시간" value={formatMinutes(totalStudySec(sessions))} />
            <Stat label="푼 문제" value={answers.length} unit="개" />
            <Stat label="연속 학습" value={streakDays(answers, sessions)} unit="일" />
          </div>
          <p className="text-xs text-ink-sub mt-3">현재 학습 레벨: {LEVEL_LABEL[profile.courseLevel]}</p>
        </section>

        {empty && (
          <div className="card p-5 text-sm text-ink-sub flex gap-2">
            <Icon name="info" size={18} />
            아직 학습 기록이 없어요. 문제를 풀면 영역별 실력 지도가 채워져요.
          </div>
        )}

        <section className="card p-5">
          <h2 className="font-bold">장기 기억 현황</h2>
          <p className="text-xs text-ink-sub mt-0.5">여러 복습 주기(7일·14일)를 통과해야 '안정적으로 기억 중'이 돼요.</p>
          <ul className="mt-3 space-y-2">
            {MEM_ORDER.map((st) => (
              <li key={st} className="flex items-center text-sm">
                <span className="flex-1">{MEMORY_LABEL[st]}</span>
                <span className="text-ink-sub tabular-nums w-28 text-right">
                  단어 {mem[st].word} · 문법 {mem[st].concept}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-surface p-3 text-sm">
            <p className="font-semibold">일정 기간 후 재평가 (7일 이상 간격 복습)</p>
            <p className="text-ink-sub mt-0.5">{retention.attempts ? `정답률 ${retention.accuracy}% (${retention.attempts}문제)` : '아직 7일 이상 지난 복습 기록이 없어요.'}</p>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-bold">영역별 실력 지도</h2>
          <ul className="mt-4 space-y-3">
            {areas.map((a) => (
              <li key={a.area}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{AREA_LABEL[a.area]}</span>
                  <span className="text-ink-sub tabular-nums">{a.enough ? `추정 ${a.estimate}점 · 정답률 ${a.accuracy}% (${a.attempts}문제)` : a.attempts ? `데이터 부족 (${a.attempts}문제)` : '학습 전'}</span>
                </div>
                <div className="flex mt-1.5">
                  <Bar value={a.enough ? a.estimate : 0} muted={!a.enough} />
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-ink-sub mt-3">듣기·말하기 영역은 콘텐츠 준비 중이라 측정하지 않아요.</p>
        </section>

        <section className="card p-5">
          <h2 className="font-bold">문법 세부 영역</h2>
          <ul className="mt-3 space-y-2.5">
            {cats.map((c) => (
              <li key={c.category} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0">{c.category}</span>
                <Bar value={c.accuracy} muted={!c.attempts} />
                <span className="w-24 text-right text-ink-sub tabular-nums shrink-0">{!c.hasContent ? '준비 중' : c.attempts ? `${c.accuracy}% (${c.attempts})` : '학습 전'}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5">
          <h2 className="font-bold">취약 개념</h2>
          {weak.length === 0 ? (
            <p className="text-sm text-ink-sub mt-2">지금은 복습이 필요한 개념이 없어요. (3문제 이상 풀어야 판단해요)</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {weak.map((m) => {
                const c = getConcept(m.conceptId)!;
                return (
                  <li key={m.conceptId}>
                    <button type="button" onClick={() => navigate(`/practice?concept=${c.id}`)} className="w-full rounded-xl bg-bad-soft p-3 text-left flex items-center gap-2">
                      <span className="flex-1">
                        <span className="block font-semibold text-sm">{c.title}</span>
                        <span className="block text-xs text-bad">
                          추정 {m.estimate}점 · 최근 7일 오답 {m.recentWrong}회{m.lastWrongAt ? ` · 마지막 오답 ${formatDate(m.lastWrongAt)}` : ''}
                        </span>
                      </span>
                      <span className="text-xs font-semibold text-bad">복습하기</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <h2 className="font-bold">개념별 상태</h2>
          <ul className="mt-2 divide-y divide-line">
            {concepts.map((c) => {
              const m = mastery.find((x) => x.conceptId === c.id)!;
              return (
                <li key={c.id}>
                  <button type="button" onClick={() => navigate(`/grammar/${c.id}`)} className="w-full py-3 flex items-center gap-2 text-left">
                    <span className="chip bg-surface text-ink-sub">{c.level}</span>
                    <span className="flex-1 text-sm font-medium min-w-0 truncate">{c.title}</span>
                    <span className={`chip ${STATE_CLS[m.state]}`}>
                      {MASTERY_LABEL[m.state]}
                      {m.attempts > 0 && ` ${m.correct}/${m.attempts}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {typeStats.length > 0 && (
          <section className="card p-5">
            <h2 className="font-bold">복습 문제 유형별 정답률</h2>
            <ul className="mt-3 space-y-2">
              {typeStats.map((t) => (
                <li key={t.type} className="flex items-center gap-3 text-sm">
                  <span className="w-20 shrink-0">{QUESTION_TYPE_LABEL[t.type]}</span>
                  <Bar value={t.accuracy} />
                  <span className="w-20 text-right text-ink-sub tabular-nums">
                    {t.accuracy}% ({t.attempts})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="card p-5">
          <h2 className="font-bold">기간별 성장 추이 (최근 14일)</h2>
          <div className="flex items-end gap-1 h-28 mt-4" role="img" aria-label="최근 14일 일별 푼 문제 수">
            {trend.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className={`w-full rounded-t ${d.attempts ? 'bg-brand' : 'bg-surface'}`} style={{ height: `${Math.max(4, (d.attempts / maxDay) * 100)}%`, opacity: d.attempts ? 0.35 + (d.accuracy / 100) * 0.65 : 1 }} title={`${d.label}: ${d.attempts}문제, 정답률 ${d.accuracy}%`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-ink-mute mt-1">
            <span>{trend[0].label}</span>
            <span>오늘</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <div className="rounded-xl bg-surface p-3">
              <p className="text-xs text-ink-sub">지난주</p>
              <p className="font-bold">{lastWeek.a ? `${Math.round((lastWeek.c / lastWeek.a) * 100)}% · ${lastWeek.a}문제` : '기록 없음'}</p>
            </div>
            <div className="rounded-xl bg-surface p-3">
              <p className="text-xs text-ink-sub">이번 주</p>
              <p className="font-bold">{thisWeek.a ? `${Math.round((thisWeek.c / thisWeek.a) * 100)}% · ${thisWeek.a}문제` : '기록 없음'}</p>
            </div>
          </div>
          <p className="text-xs text-ink-sub mt-2">막대 높이는 푼 문제 수, 진하기는 정답률이에요.</p>
        </section>

        <section className="card">
          <h2 className="px-5 pt-5 pb-2 font-bold">학습 기록</h2>
          {recentSessions.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-ink-sub">완료한 학습 세션이 없어요.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentSessions.map((s) => (
                <li key={s.id} className="px-5 py-3 flex items-center gap-3 text-sm">
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium truncate">{s.label}</span>
                    <span className="block text-xs text-ink-sub">
                      {formatDate(s.startedAt)} · {formatMinutes(s.durationSec)}
                    </span>
                  </span>
                  {s.questionCount > 0 && (
                    <span className="text-ink-sub tabular-nums">
                      {s.correctCount}/{s.questionCount}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </Page>
    </>
  );
}
