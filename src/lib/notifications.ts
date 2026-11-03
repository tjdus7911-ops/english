import { POLICY } from '../config/policy';
import { getConcept, getLesson } from '../data';
import type { AppNotification, NotifSettings, NotifType, ReviewSchedule, UserAnswer, UserProgress } from '../types';
import { isDue, sortDue } from './review';
import { DAY_MS, dayKey, startOfDay } from './util';

export const NOTIF_LABEL: Record<NotifType, { title: string; desc: string }> = {
  'daily-start': { title: '매일 학습 시작 알림', desc: '설정한 시간까지 학습 기록이 없으면 알려 드려요.' },
  'next-day-review': { title: '다음 날 복습 알림', desc: '어제 배운 단어를 오늘 다시 확인하도록 알려 드려요.' },
  'due-items': { title: '복습 예정 항목 알림', desc: '복습 날짜가 된 문법·표현을 알려 드려요.' },
  incomplete: { title: '미완료 학습 안내', desc: '시작하고 끝내지 못한 DAY 학습을 알려 드려요.' },
};

export const defaultNotifSettings = (): NotifSettings => ({
  enabled: true,
  time: '20:00',
  types: { 'daily-start': true, 'next-day-review': true, 'due-items': true, incomplete: true },
});

export type NotifCandidate = Omit<AppNotification, 'id' | 'createdAt' | 'read'>;

function timeReached(time: string, now: number): boolean {
  const [h, m] = time.split(':').map(Number);
  const t = new Date(now);
  t.setHours(h || 0, m || 0, 0, 0);
  return now >= t.getTime();
}

/**
 * 지금 시점에 보내야 할 알림 후보.
 * dedupKey로 같은 대상·같은 날짜의 알림은 한 번만 전달된다(store.deliverNotifications).
 * 웹: 앱이 열려 있을 때 계산해 앱 내부 알림함에 쌓음 / Android: 같은 규칙으로 로컬 알림 예약 예정.
 */
export function computeNotifications(
  s: { reviews: Record<string, ReviewSchedule>; answers: UserAnswer[]; progress: UserProgress; settings: NotifSettings },
  now: number,
): NotifCandidate[] {
  const { settings } = s;
  if (!settings.enabled || !timeReached(settings.time, now)) return [];
  const D = dayKey(now);
  const today = startOfDay(now);
  const out: NotifCandidate[] = [];
  const due = sortDue(Object.values(s.reviews).filter((r) => isDue(r, now)), now);

  if (settings.types['next-day-review']) {
    const yesterday = today - DAY_MS;
    const fromYesterday = due.filter((r) => r.kind === 'word' && r.createdAt >= yesterday && r.createdAt < today).length;
    if (fromYesterday > 0)
      out.push({ dedupKey: `next-day:${D}`, type: 'next-day-review', title: `어제 배운 단어 ${fromYesterday}개, 아직 기억하고 있나요?`, body: '잊어버리기 전에 오늘 한 번 더 확인해요.', path: '/review?kind=word' });
  }

  if (settings.types['due-items'] && due.length > 0) {
    due
      .filter((r) => r.kind === 'concept')
      .slice(0, POLICY.notifications.maxConceptNotifs)
      .forEach((r) => {
        const c = getConcept(r.refId);
        if (!c) return;
        // 같은 항목은 같은 복습 예정일에 한 번만 (밀려도 다시 보내지 않음)
        out.push({ dedupKey: `due:${r.key}:${dayKey(r.dueAt)}`, type: 'due-items', title: `오늘은 '${c.title}' 문법을 다시 복습하는 날이에요.`, body: r.lapses > 0 ? `지금까지 ${r.lapses}번 틀린 개념이에요.` : '다른 문장으로 기억을 확인해요.', path: `/review?focus=${encodeURIComponent(r.key)}` });
      });
    out.push({ dedupKey: `due-summary:${D}`, type: 'due-items', title: `복습할 영어 표현 ${due.length}개가 기다리고 있어요.`, body: '하루 복습량만큼 나누어 보여 드려요.', path: '/review' });
  }

  if (settings.types['daily-start']) {
    const studiedToday = s.answers.some((a) => a.at >= today);
    if (!studiedToday) out.push({ dedupKey: `daily-start:${D}`, type: 'daily-start', title: '오늘의 영어 학습을 시작해 볼까요?', body: '복습부터 가볍게 시작해요.', path: '/home' });
  }

  if (settings.types.incomplete) {
    const last = s.progress.lastLocation;
    const m = last?.path.match(/^\/course\/lesson\/(.+)$/);
    if (last && m && !s.progress.completedLessons[m[1]] && now - last.at >= POLICY.notifications.incompleteAfterHours * 3600_000) {
      const l = getLesson(m[1]);
      if (l) out.push({ dedupKey: `incomplete:${l.id}:${D}`, type: 'incomplete', title: '끝내지 못한 학습이 있어요', body: `${last.label} — 이어서 마무리해요.`, path: last.path });
    }
  }
  return out;
}

/** 다음 알림 예정 시각 계획 (Android 로컬 알림 예약용 — 웹에서는 표시용) */
export function nextFireTime(settings: NotifSettings, now: number): number {
  const [h, m] = settings.time.split(':').map(Number);
  const t = new Date(now);
  t.setHours(h || 0, m || 0, 0, 0);
  if (t.getTime() <= now) t.setDate(t.getDate() + 1);
  return t.getTime();
}
