import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { computeNotifications } from '../lib/notifications';
import { useStore } from '../store/useStore';
import type { AppNotification } from '../types';
import { Icon } from './Icon';

const IMMERSIVE = /^\/(course\/lesson|course\/skip|review|practice|placement|onboarding|free\/word-(study|quiz))/;

/**
 * 웹앱 알림 실행기: 앱이 열려 있는 동안 1분마다, 그리고 화면으로 돌아올 때 알림 후보를 계산해
 * 앱 내부 알림함에 쌓고, 새 알림은 상단 배너로 보여 준다. (앱이 닫혀 있으면 동작하지 않음)
 */
export function NotificationRunner() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onboarded = useStore((s) => s.profile.onboarded);
  const [banner, setBanner] = useState<AppNotification | null>(null);

  useEffect(() => {
    if (!onboarded) return;
    const tick = () => {
      const s = useStore.getState();
      const cands = computeNotifications({ reviews: s.reviews, answers: s.answers, progress: s.progress, settings: s.notifSettings }, Date.now());
      const fresh = s.deliverNotifications(cands);
      if (fresh.length) setBanner(fresh[0]);
    };
    tick();
    const t = window.setInterval(tick, 60_000);
    const onVis = () => document.visibilityState === 'visible' && tick();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(t);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [onboarded]);

  // 배너는 6초 뒤 자동으로 사라짐 (알림함에는 남아 있음)
  useEffect(() => {
    if (!banner) return;
    const t = window.setTimeout(() => setBanner(null), 6000);
    return () => window.clearTimeout(t);
  }, [banner]);

  // 학습 중에는 배너로 방해하지 않음 (알림함에는 저장됨)
  if (!banner || IMMERSIVE.test(pathname)) return null;
  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-3 flex justify-center pointer-events-none">
      <div role="alert" className="pointer-events-auto max-w-app w-full bg-ink text-white rounded-2xl shadow-lg flex items-start gap-2 p-3">
        <button
          type="button"
          className="flex-1 text-left flex gap-2 min-h-[44px]"
          onClick={() => {
            useStore.getState().markNotifRead(banner.id);
            setBanner(null);
            navigate(banner.path);
          }}
        >
          <Icon name="bell" size={20} className="text-brand mt-0.5 shrink-0" />
          <span>
            <span className="block font-semibold text-sm">{banner.title}</span>
            <span className="block text-xs text-white/70">{banner.body}</span>
          </span>
        </button>
        <button type="button" onClick={() => setBanner(null)} aria-label="알림 닫기" className="w-9 h-9 flex items-center justify-center rounded-full text-white/70">
          <Icon name="x" size={18} />
        </button>
      </div>
    </div>
  );
}
