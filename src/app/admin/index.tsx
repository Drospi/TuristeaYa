import { useCallback, useEffect, useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import * as adminMock from '@/services/mock/admin';
import { fetchAdminDashboardData } from '@/services/usuarios.service';
import type { PlatformStats, ReportedReview, VerificationRequest } from '@/types';

/** Pantalla 48 del prototipo: Resumen de plataforma del administrador. */
export default function AdminResumenScreen() {
  const [stats, setStats] = useState<PlatformStats>(adminMock.platformStats);
  const [verification, setVerification] = useState<VerificationRequest>(
    adminMock.verificationRequest,
  );
  const [reported, setReported] = useState<ReportedReview>(adminMock.reportedReview);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminDashboardData();
      setStats(data.stats);
      setVerification(data.verificationRequest);
      setReported(data.reportedReview);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Screen title="Panel de administración" subtitle="Métricas de TuristeaYa">
      {loading ? <AppText variant="caption">Consultando métricas en Supabase…</AppText> : null}

      <ListCard
        title="Métricas globales"
        body={`Usuarios registrados: ${stats.users}\nComercios registrados: ${stats.businesses}\nReportes / moderación: ${stats.pendingReports}\nTickets abiertos: ${stats.openTickets}`}
      />

      <ListCard
        title={`Verificación · ${verification.businessName}`}
        body={`${verification.owner}\n${verification.receivedLabel}\n${verification.observations}`}
        onPress={() => router.navigate('/admin/comercios')}
      />

      <ListCard
        title={`Moderación · #${reported.id}`}
        body={`${reported.businessName}\nMotivo: ${reported.reason}\n${reported.decision}`}
        onPress={() => router.navigate('/admin/seguridad')}
      />

      <Button
        title="Gestionar usuarios y roles"
        onPress={() => router.navigate('/admin/usuarios')}
      />
      <Button
        title="Revisar verificaciones de comercios"
        variant="secondary"
        onPress={() => router.navigate('/admin/comercios')}
      />
      <Button
        title="Auditoría y seguridad"
        variant="secondary"
        onPress={() => router.navigate('/admin/seguridad')}
      />
      <Button
        title="Volver a selección de roles"
        variant="secondary"
        onPress={() => router.navigate('/')}
      />
    </Screen>
  );
}
