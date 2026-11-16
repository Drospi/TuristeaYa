import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { fetchBusinessDashboardData } from '@/services/catalogos.service';
import * as businessMock from '@/services/mock/business';
import { colors, radius, spacing } from '@/theme';
import type {
  BusinessNotification,
  BusinessProfile,
  BusinessStats,
} from '@/types';

/** Pantalla 33 del prototipo: Resumen y métricas del negocio (/api/v1/businesses, /place-visits, /campaign-events). */
export default function NegocioResumenScreen() {
  const [profile, setProfile] = useState<BusinessProfile>(businessMock.businessProfile);
  const [stats, setStats] = useState<BusinessStats>(businessMock.businessStats);
  const [notifications, setNotifications] = useState<BusinessNotification[]>(
    businessMock.businessNotifications,
  );
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBusinessDashboardData();
      setProfile(data.profile);
      setStats(data.stats);
      setNotifications(data.notifications);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Screen title="Panel del negocio" subtitle={`${profile.name} · ${profile.address}`}>
      {loading ? <AppText variant="caption">Sincronizando datos del comercio…</AppText> : null}

      <ListCard
        title="Métricas de la semana"
        body={`Visualizaciones en la app: ${stats.views}\nVisitas registradas al local: ${stats.localVisits}\nCupones canjeados: ${stats.couponsRedeemed}\nHorario de mayor afluencia: ${stats.peakLabel}`}
      />

      <View style={styles.chartCard}>
        <AppText variant="section">Visitas por horario</AppText>
        <View style={styles.barsRow}>
          {stats.hourly.map((item) => (
            <View key={item.hour} style={styles.barCol}>
              <View style={[styles.bar, { height: item.value }]} />
              <AppText variant="tiny">{item.hour}</AppText>
            </View>
          ))}
        </View>
      </View>

      <AppText variant="section">Avisos recientes</AppText>
      {notifications.map((n) => (
        <ListCard
          key={n.id}
          title={n.title}
          body={n.body}
          footer={
            <Badge
              label={n.kind}
              tone={n.kind === 'canje' ? 'green' : 'cream'}
            />
          }
        />
      ))}

      <Button
        title="Administrar promociones y cupones"
        onPress={() => router.navigate('/negocio/promociones')}
      />
      <Button
        title="Ver campañas publicitarias"
        variant="secondary"
        onPress={() => router.navigate('/negocio/campanas')}
      />
      <Button
        title="Editar datos de mi local"
        variant="secondary"
        onPress={() => router.navigate('/negocio/mi-local')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    paddingTop: spacing.sm,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  bar: {
    width: 24,
    backgroundColor: colors.greenSoft,
    borderRadius: radius.sm,
  },
});
