import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { EmptyState, Header, Page } from '../components/ui';
import { NOTIF_LABEL } from '../lib/notifications';
import { useStore } from '../store/useStore';

function ago(ts: number) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return '방금';
  if (m < 60) return `${m}분 전`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.round(h / 24)}일 전`;
}

export default function Notifications() {
  const navigate = useNavigate();
  const inbox = useStore((s) => s.inbox);
  const settings = useStore((s) => s.notifSettings);
  const markNotifRead = useStore((s) => s.markNotifRead);
  const markAllNotifRead = useStore((s) => s.markAllNotifRead);
  const unread = inbox.filter((n) => !n.read).length;

  return (
    <>
      <Header
        title="알림함"
        back="/home"
        right={
          unread > 0 ? (
            <button type="button" className="text-sm text-ink-sub px-2 min-h-[40px]" onClick={markAllNotifRead}>
              모두 읽음
            </button>
          ) : undefined
        }
      />
      <Page>
        <p className="text-xs text-ink-sub px-1">
          웹앱에서는 앱을 열어 둔 동안 설정한 시간({settings.time}) 이후에 알림을 이 화면과 상단 배너로 보여 드려요. 앱이 닫혀 있을 때 오는 푸시 알림은 아직 지원하지 않아요.
        </p>
        {!settings.enabled && (
          <button type="button" onClick={() => navigate('/my')} className="card w-full p-4 text-left text-sm flex items-center gap-2">
            <Icon name="info" size={18} className="text-warn" />
            <span className="flex-1">알림 수신이 꺼져 있어요. MY에서 켤 수 있어요.</span>
            <Icon name="chevron" size={16} />
          </button>
        )}
        {inbox.length === 0 ? (
          <EmptyState icon="bell" title="아직 받은 알림이 없어요" desc="복습 예정일이 되거나 학습을 시작하지 않았을 때 알려 드려요." />
        ) : (
          <ul className="card divide-y divide-line">
            {inbox.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    markNotifRead(n.id);
                    navigate(n.path);
                  }}
                  className={`w-full text-left px-4 py-3.5 flex gap-3 items-start active:bg-surface ${n.read ? '' : 'bg-brand-soft/40'}`}
                >
                  <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.read ? 'bg-transparent' : 'bg-brand'}`} aria-label={n.read ? undefined : '읽지 않음'} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs text-ink-sub">
                      {NOTIF_LABEL[n.type].title} · {ago(n.createdAt)}
                    </span>
                    <span className="block font-semibold mt-0.5">{n.title}</span>
                    <span className="block text-sm text-ink-sub">{n.body}</span>
                  </span>
                  <Icon name="chevron" size={16} className="text-ink-mute mt-2" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Page>
    </>
  );
}
