import { useCallback, useEffect, useState } from 'react';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import { getCurrentUserId, listRecords, updateRecord } from '@/services/http';
import * as adminMock from '@/services/mock/admin';
import type { DbBusiness, DbBusinessVerification } from '@/types/database';

/** Pantalla 50 del prototipo: Verificación de comercios (/api/v1/business-verifications y /businesses). */
export default function AdminComerciosScreen() {
  const [verifications, setVerifications] = useState<DbBusinessVerification[]>([]);
  const [businesses, setBusinesses] = useState<DbBusiness[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [verData, bizData] = await Promise.all([
        listRecords<DbBusinessVerification>('business-verifications', { limit: 50 }).catch(
          () => [] as DbBusinessVerification[],
        ),
        listRecords<DbBusiness>('businesses', { limit: 50 }).catch(() => [] as DbBusiness[]),
      ]);
      setVerifications(verData);
      setBusinesses(bizData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleReview(item: DbBusinessVerification, status: 'approved' | 'rejected') {
    setBusyId(item.id);
    setFeedback('');
    try {
      const reviewerId = await getCurrentUserId();
      const updated = await updateRecord<DbBusinessVerification>(
        'business-verifications',
        item.id,
        {
          status,
          review_notes: notes.trim() || item.review_notes || 'Revisión completada por administración.',
          reviewed_at: new Date().toISOString(),
          ...(reviewerId ? { reviewer_id: reviewerId } : {}),
        },
      );
      setVerifications((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      setFeedback(
        status === 'approved'
          ? 'Comercio aprobado correctamente.'
          : 'Solicitud rechazada y registrada.',
      );
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudo actualizar la verificación.',
      );
    } finally {
      setBusyId(null);
    }
  }

  const bizMap = new Map(businesses.map((b) => [b.id, b.name]));

  return (
    <Screen
      title="Verificación de comercios"
      subtitle={`${verifications.length || 1} solicitudes`}
    >
      {loading ? <AppText variant="caption">Cargando verificaciones…</AppText> : null}
      <FormField
        label="Observaciones de revisión"
        placeholder="Datos del negocio y documento verificados"
        value={notes}
        onChangeText={setNotes}
      />
      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}

      {verifications.length > 0 ? (
        verifications.map((item) => (
          <ListCard
            key={item.id}
            title={bizMap.get(item.business_id) ?? item.responsible_name}
            body={`Responsable: ${item.responsible_name} (${item.contact_email})\nDocumento: ${item.document_path}\nNotas: ${item.review_notes ?? 'Sin notas previas'}`}
            footer={
              <>
                <Badge
                  label={`Estado: ${item.status}`}
                  tone={item.status === 'approved' ? 'green' : 'cream'}
                />
                <Button
                  align="left"
                  size="sm"
                  title={busyId === item.id ? 'Procesando…' : 'Aprobar comercio'}
                  disabled={busyId === item.id}
                  onPress={() => void handleReview(item, 'approved')}
                />
                <Button
                  align="left"
                  size="sm"
                  variant="secondary"
                  title="Rechazar solicitud"
                  disabled={busyId === item.id}
                  onPress={() => void handleReview(item, 'rejected')}
                />
              </>
            }
          />
        ))
      ) : (
        <ListCard
          title={adminMock.verificationRequest.businessName}
          body={`${adminMock.verificationRequest.owner}\n${adminMock.verificationRequest.receivedLabel}\n${adminMock.verificationRequest.observations}`}
        />
      )}
    </Screen>
  );
}
