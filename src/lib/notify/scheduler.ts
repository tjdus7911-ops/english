/**
 * 알림 전달 계층 분리.
 *
 * - WebInAppScheduler (구현 완료): 웹앱이 열려 있을 때 1분마다/화면 복귀 시 알림 후보를 계산해
 *   앱 내부 알림함·배너로 보여 준다. 앱(탭)이 닫혀 있으면 알림이 전달되지 않는다.
 * - CapacitorLocalScheduler (미구현): Android 전환 시 @capacitor/local-notifications 로
 *   nextFireTime() 시각에 OS 알림을 예약하고, 알림 탭 시 extra.path 로 라우팅할 예정.
 *   의존성을 아직 설치하지 않았으므로 앱에서 사용하지 않는다.
 */
export interface ScheduledReminder {
  id: number;
  at: number;
  title: string;
  body: string;
  path: string;
}

export interface NotificationScheduler {
  readonly platform: 'web-in-app' | 'android-local';
  /** 앱이 닫혀 있어도 알림을 띄울 수 있는지 */
  readonly supportsBackground: boolean;
  sync(reminders: ScheduledReminder[]): Promise<void>;
}

export const webInAppScheduler: NotificationScheduler = {
  platform: 'web-in-app',
  supportsBackground: false,
  // 웹은 예약 대신 앱 실행 중 computeNotifications()로 즉시 계산하므로 할 일이 없다.
  async sync() {},
};

/*
 * Android 전환 시 구현 예시 (참고용, 미적용):
 *
 * import { LocalNotifications } from '@capacitor/local-notifications';
 * export const capacitorLocalScheduler: NotificationScheduler = {
 *   platform: 'android-local',
 *   supportsBackground: true,
 *   async sync(reminders) {
 *     await LocalNotifications.requestPermissions();
 *     const pending = await LocalNotifications.getPending();
 *     await LocalNotifications.cancel({ notifications: pending.notifications });
 *     await LocalNotifications.schedule({
 *       notifications: reminders.map((r) => ({ id: r.id, title: r.title, body: r.body, schedule: { at: new Date(r.at) }, extra: { path: r.path } })),
 *     });
 *   },
 * };
 * // LocalNotifications.addListener('localNotificationActionPerformed', (e) => navigate(e.notification.extra.path));
 */
