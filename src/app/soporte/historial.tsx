import { useEffect, useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { fetchUserSupportHistory } from '@/services/usuarios.service';
import type { RelatedActivity, UserHistoryEntry } from '@/types';

/** Pantalla 46 del prototipo: Historial de tickets y actividad relacionada. */
export default function SoporteHistorialScreen() {
  const [history, setHistory] = useState<UserHistoryEntry[]>([]);
  const [related, setRelated] = useState<RelatedActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchUserSupportHistory()
      .then((res) => {
        if (!active) return;
        setHistory(res.history);
        setRelated(res.related);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Screen title="Historial del usuario" subtitle="Casos previos y actividad asociada">
      {loading ? <AppText variant="caption">Cargando historial…</AppText> : null}

      <AppText variant="section">Tickets anteriores</AppText>
      {history.map((entry) => (
        <ListCard
          key={entry.id}
          title={`#${entry.id.slice(0, 6)} · ${entry.subject}`}
          body={`${entry.date} · ${entry.messages} mensajes`}
          onPress={() =>
            router.navigate({ pathname: '/soporte/caso', params: { ticketId: entry.id } })
          }
          footer={
            <Badge
              label={entry.status}
              tone={entry.status === 'Resuelto' ? 'green' : 'cream'}
            />
          }
        />
      ))}

      <AppText variant="section">Actividad relacionada</AppText>
      {related.map((item) => (
        <ListCard key={item.id} title={item.label} />
      ))}

      <Button
        title="Volver a tickets"
        variant="secondary"
        onPress={() => router.navigate('/soporte')}
      />
    </Screen>
  );
}
