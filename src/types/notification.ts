export type NotificationKind = 'warning' | 'info' | 'promo';

/** Notificación del turista (pantalla 22). */
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  kind: NotificationKind;
}
