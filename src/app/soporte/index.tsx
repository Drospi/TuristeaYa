import { useCallback, useEffect, useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { fetchSupportTickets } from '@/services/usuarios.service';
import type { Ticket, TicketStatus } from '@/types';

const statusOptions = ['Todos', 'Pendiente', 'En curso', 'Resuelto'] as const;

/** Pantalla 43 del prototipo: Bandeja de tickets de soporte (/api/v1/tickets). */
export default function SoporteTicketsScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<(typeof statusOptions)[number]>('Todos');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSupportTickets();
      setTickets(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered =
    filter === 'Todos'
      ? tickets
      : tickets.filter((ticket) => ticket.status === (filter as TicketStatus));

  return (
    <Screen title="Tickets de soporte" subtitle={`${filtered.length} casos en bandeja`}>
      <SegmentedControl
        label="Estado del ticket"
        options={statusOptions}
        value={filter}
        onChange={setFilter}
      />
      {loading ? <AppText variant="caption">Cargando tickets del servidor…</AppText> : null}
      {filtered.map((ticket) => (
        <ListCard
          key={ticket.id}
          title={`#${ticket.id.slice(0, 6)} · ${ticket.subject}`}
          body={`${ticket.user} · ${ticket.category}\n${ticket.messagesCount} mensajes`}
          onPress={() =>
            router.navigate({ pathname: '/soporte/caso', params: { ticketId: ticket.id } })
          }
          footer={
            <Badge
              label={`${ticket.priority} · ${ticket.status}`}
              tone={ticket.status === 'Resuelto' ? 'green' : 'cream'}
            />
          }
        />
      ))}
      <Button
        title="Actualizar bandeja"
        variant="secondary"
        onPress={() => void load()}
      />
    </Screen>
  );
}
