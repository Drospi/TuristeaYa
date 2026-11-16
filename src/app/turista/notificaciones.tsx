import { useCallback, useEffect, useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { findDiscoveryPlace, outingNotices } from '@/features/turista/data/discovery';
import { useDiscovery } from '@/features/turista/discovery-context';
import { getCurrentUserId } from '@/services/http';
import {
  listNotifications,
  markNotificationRead,
} from '@/services/usuarios.service';
import { colors } from '@/theme';
import type { DbNotification } from '@/types/database';

export default function NotificacionesScreen() {
  const { readNotices, markRead } = useDiscovery();
  const [serverNotifications, setServerNotifications] = useState<DbNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const userId = await getCurrentUserId();
      const rows = await listNotifications(
        userId ? { user_id: userId } : undefined,
        { limit: 30 },
      );
      setServerNotifications(rows);
    } catch {
      setServerNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  async function handleMarkServerRead(notification: DbNotification) {
    setBusyId(notification.id);
    try {
      const updated = await markNotificationRead(notification.id);
      setServerNotifications((prev) =>
        prev.map((item) => (item.id === notification.id ? updated : item)),
      );
    } catch {
      setServerNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, read_at: new Date().toISOString() }
            : item,
        ),
      );
    } finally {
      setBusyId(null);
    }
  }

  const unreadLocal = outingNotices.filter((notice) => !readNotices.includes(notice.id));
  const unreadServer = serverNotifications.filter((n) => !n.read_at);
  const totalUnread = unreadLocal.length + unreadServer.length;

  return (
    <Screen
      title="Avisos de mi salida"
      subtitle={totalUnread ? `${totalUnread} avisos sin leer` : 'Estás al día'}
    >
      {loading ? <AppText variant="caption">Sincronizando avisos con el servidor…</AppText> : null}

      {serverNotifications.length > 0 ? (
        <>
          <AppText variant="section">Notificaciones de tu cuenta</AppText>
          {serverNotifications.map((item) => {
            const isRead = Boolean(item.read_at);
            return (
              <ListCard
                key={item.id}
                title={item.title}
                body={item.body}
                style={{ borderColor: isRead ? colors.border : colors.primary }}
                footer={
                  <>
                    <Badge
                      label={isRead ? 'Leído' : `Nuevo · ${item.kind}`}
                      tone={isRead ? 'green' : 'cream'}
                    />
                    {!isRead ? (
                      <Button
                        align="left"
                        variant="soft"
                        size="sm"
                        title={busyId === item.id ? 'Marcando…' : 'Marcar como leído'}
                        disabled={busyId === item.id}
                        onPress={() => void handleMarkServerRead(item)}
                      />
                    ) : null}
                  </>
                }
              />
            );
          })}
        </>
      ) : null}

      <AppText variant="section">Avisos de recorrido</AppText>
      {outingNotices.map((notice) => {
        const read = readNotices.includes(notice.id);
        return (
          <ListCard
            key={notice.id}
            title={notice.title}
            body={notice.text}
            style={{ borderColor: read ? colors.border : colors.primary }}
            footer={
              <>
                <AppText variant="caption">
                  {read ? 'Leído' : 'Nuevo'} · {findDiscoveryPlace(notice.placeId)?.name}
                </AppText>
                <Button
                  align="left"
                  variant="secondary"
                  title={notice.action}
                  onPress={() => {
                    markRead([notice.id]);
                    router.navigate(`/turista/lugar/${notice.placeId}`);
                  }}
                />
                {!read ? (
                  <Button
                    align="left"
                    variant="soft"
                    size="sm"
                    title="Marcar como leído"
                    onPress={() => markRead([notice.id])}
                  />
                ) : null}
              </>
            }
          />
        );
      })}
      <Button
        align="left"
        title="Marcar todos como leídos"
        disabled={!totalUnread}
        onPress={() => {
          markRead(outingNotices.map((notice) => notice.id));
          unreadServer.forEach((n) => {
            void handleMarkServerRead(n);
          });
        }}
      />
      <Button
        align="left"
        title="Volver a Inicio"
        variant="secondary"
        onPress={() => router.navigate('/turista')}
      />
    </Screen>
  );
}
