import { useCallback, useEffect, useState } from 'react';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import { getCurrentUserId, listRecords, updateRecord } from '@/services/http';
import {
  createModerationAction,
  fetchAdminDashboardData,
} from '@/services/usuarios.service';
import type { AuditEntry, SecurityAlert } from '@/types';
import type { DbReview } from '@/types/database';

/** Pantallas 51-52 del prototipo: Moderación de reseñas y registros de auditoría (/api/v1/moderation-actions y /audit-logs). */
export default function AdminSeguridadScreen() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [reason, setReason] = useState('Incumplimiento de normas de convivencia');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboard, reviewsData] = await Promise.all([
        fetchAdminDashboardData(),
        listRecords<DbReview>('reviews', { limit: 20 }).catch(() => [] as DbReview[]),
      ]);
      setAlerts(dashboard.securityAlerts);
      setAudits(dashboard.auditEntries);
      setReviews(reviewsData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleModerateReview(review: DbReview, hide: boolean) {
    setBusyId(review.id);
    setFeedback('');
    try {
      const moderatorId = await getCurrentUserId();
      await updateRecord<DbReview>('reviews', review.id, { hidden: hide });
      if (moderatorId) {
        await createModerationAction({
          review_id: review.id,
          moderator_id: moderatorId,
          action: hide ? 'hide' : 'restore',
          reason: reason.trim() || 'Moderación de contenido',
        });
      }
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, hidden: hide } : r)),
      );
      setFeedback(
        hide ? 'Reseña ocultada y acción registrada.' : 'Reseña restaurada.',
      );
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudo registrar la moderación.',
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Screen title="Moderación y seguridad" subtitle="Auditoría y control de contenido">
      {loading ? <AppText variant="caption">Cargando registros de auditoría…</AppText> : null}

      <AppText variant="section">Moderación de reseñas</AppText>
      <FormField
        label="Motivo de moderación"
        value={reason}
        onChangeText={setReason}
        placeholder="Motivo de la decisión"
      />
      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}

      {reviews.slice(0, 5).map((review) => (
        <ListCard
          key={review.id}
          title={`Calificación ${review.rating} / 5`}
          body={review.body}
          footer={
            <>
              <Badge
                label={review.hidden ? 'Oculta' : 'Visible'}
                tone={review.hidden ? 'cream' : 'green'}
              />
              <Button
                align="left"
                size="sm"
                variant="secondary"
                title={
                  busyId === review.id
                    ? 'Aplicando…'
                    : review.hidden
                      ? 'Restaurar reseña'
                      : 'Ocultar reseña'
                }
                disabled={busyId === review.id}
                onPress={() => void handleModerateReview(review, !review.hidden)}
              />
            </>
          }
        />
      ))}

      <AppText variant="section">Alertas de seguridad</AppText>
      {alerts.map((alert) => (
        <ListCard key={alert.id} title={alert.label} body={alert.date} />
      ))}

      <AppText variant="section">Registro de auditoría (audit_logs)</AppText>
      {audits.map((entry) => (
        <ListCard key={entry.id} title={entry.label} body={entry.time} />
      ))}
    </Screen>
  );
}
