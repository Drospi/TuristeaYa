import { useCallback, useEffect, useState } from 'react';

import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import { getCurrentUserId, isUuid } from '@/services/http';
import {
  createTicketMessage,
  fetchSupportTickets,
  updateTicketRecord,
} from '@/services/usuarios.service';
import type { Ticket } from '@/types';

/** Pantallas 44-45 del prototipo: Detalle del caso y chat de soporte (/api/v1/tickets y /ticket-messages). */
export default function SoporteCasoScreen() {
  const { ticketId } = useLocalSearchParams<{ ticketId?: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadTicket = useCallback(async () => {
    const all = await fetchSupportTickets();
    const match = (ticketId ? all.find((t) => t.id === ticketId) : null) ?? all[0] ?? null;
    setTicket(match);
    if (match && !reply) {
      setReply(match.draftReply);
    }
  }, [ticketId]);

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  async function handleSendMessage() {
    if (!ticket || !reply.trim()) return;
    setBusy(true);
    setFeedback('');
    const text = reply.trim();
    try {
      const senderId = await getCurrentUserId();
      if (isUuid(ticket.id) && senderId && isUuid(senderId)) {
        await createTicketMessage({
          ticket_id: ticket.id,
          sender_id: senderId,
          body: text,
        });
      }
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              messagesCount: prev.messagesCount + 1,
              chat: [
                ...prev.chat,
                {
                  id: `msg-${Date.now()}`,
                  author: 'support',
                  time: 'Ahora',
                  text,
                },
              ],
            }
          : prev,
      );
      setReply('');
      setFeedback('Respuesta enviada al usuario.');
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudo enviar el mensaje.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleResolve() {
    if (!ticket) return;
    setBusy(true);
    setFeedback('');
    try {
      if (isUuid(ticket.id)) {
        await updateTicketRecord(ticket.id, { status: 'closed' });
      }
      setTicket((prev) => (prev ? { ...prev, status: 'Resuelto' } : prev));
      setFeedback('Caso marcado como resuelto.');
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudo actualizar el estado del ticket.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (!ticket) {
    return (
      <Screen title="Detalle del caso" subtitle="Cargando…">
        <AppText variant="body">Selecciona un ticket en la bandeja.</AppText>
      </Screen>
    );
  }

  return (
    <Screen
      title={`Caso #${ticket.id.slice(0, 6)}`}
      subtitle={`${ticket.subject} · ${ticket.user}`}
    >
      <ListCard
        title="Verificación del sistema"
        body={ticket.verification}
        footer={
          <Badge
            label={`${ticket.priority} · ${ticket.status}`}
            tone={ticket.status === 'Resuelto' ? 'green' : 'cream'}
          />
        }
      />

      <AppText variant="section">Conversación</AppText>
      {ticket.chat.map((msg) => (
        <ListCard
          key={msg.id}
          title={`${msg.author === 'support' ? 'Soporte' : ticket.user} · ${msg.time}`}
          body={msg.text}
        />
      ))}

      <FormField
        label="Respuesta al usuario"
        value={reply}
        onChangeText={setReply}
        placeholder="Escribe una respuesta…"
      />
      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}
      <Button
        title={busy ? 'Enviando…' : 'Enviar respuesta'}
        disabled={busy || !reply.trim()}
        onPress={() => void handleSendMessage()}
      />
      <Button
        title="Marcar caso como resuelto"
        variant="secondary"
        disabled={busy || ticket.status === 'Resuelto'}
        onPress={() => void handleResolve()}
      />
      <Button
        title="Ver historial del usuario"
        variant="secondary"
        onPress={() => router.navigate('/soporte/historial')}
      />
    </Screen>
  );
}
