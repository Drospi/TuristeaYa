import { useCallback, useEffect, useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { useAuth } from '@/context/auth-context';
import {
  createSubscription,
  listSubscriptionPlans,
  listSubscriptions,
  updateSubscription,
} from '@/services/usuarios.service';
import type { DbSubscription, DbSubscriptionPlan } from '@/types/database';

/** Pantalla de Perfil VIP y gestión de suscripciones (/api/v1/subscription-plans y /subscriptions). */
export default function VipPerfilScreen() {
  const { user, profile, session, logout, refreshProfile } = useAuth();
  const [plans, setPlans] = useState<DbSubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<DbSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadSubscriptionData = useCallback(async () => {
    setLoading(true);
    try {
      const userId = profile?.id ?? session?.userId;
      const [plansData, subsData] = await Promise.all([
        listSubscriptionPlans({ limit: 20 }).catch(() => [] as DbSubscriptionPlan[]),
        listSubscriptions(userId ? { user_id: userId } : undefined, { limit: 20 }).catch(
          () => [] as DbSubscription[],
        ),
      ]);
      setPlans(plansData);
      setSubscriptions(subsData);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, session?.userId]);

  useEffect(() => {
    void loadSubscriptionData();
  }, [loadSubscriptionData]);

  async function handleSubscribe(plan: DbSubscriptionPlan) {
    const userId = profile?.id ?? session?.userId;
    if (!userId) {
      setFeedback('Inicia sesión para activar una suscripción VIP.');
      return;
    }
    setBusy(true);
    setFeedback('');
    try {
      const startsAt = new Date();
      const endsAt = new Date(startsAt.getTime() + plan.period_days * 24 * 60 * 60 * 1000);
      await createSubscription({
        user_id: userId,
        plan_id: plan.id,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        status: 'active',
      });
      await loadSubscriptionData();
      await refreshProfile();
      setFeedback(`Suscripción al plan «${plan.name}» activada correctamente.`);
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudo procesar la suscripción.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleCancelSubscription(sub: DbSubscription) {
    setBusy(true);
    setFeedback('');
    try {
      await updateSubscription(sub.id, { status: 'canceled' });
      await loadSubscriptionData();
      await refreshProfile();
      setFeedback('Suscripción actualizada a estado cancelado.');
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudo actualizar la suscripción.',
      );
    } finally {
      setBusy(false);
    }
  }

  const activeSub =
    subscriptions.find((s) => s.status.toLowerCase() === 'active') ?? subscriptions[0] ?? null;

  return (
    <Screen title="Perfil VIP" subtitle="Membresía y planes de suscripción">
      <ListCard
        title={user.name}
        body={`${session?.email ?? user.email}\n${
          activeSub
            ? `Suscripción: ${activeSub.status} · Vence: ${new Date(activeSub.ends_at).toLocaleDateString()}`
            : 'Estado: Membresía VIP de demostración'
        }`}
        footer={
          <Badge
            label={activeSub ? `Estado: ${activeSub.status}` : 'Cuenta VIP'}
            tone="green"
          />
        }
      />

      {loading ? <AppText variant="caption">Cargando planes de suscripción…</AppText> : null}

      <AppText variant="section">Planes disponibles</AppText>
      {plans.length > 0 ? (
        plans.map((plan) => (
          <ListCard
            key={plan.id}
            title={`${plan.name} · ${plan.currency} ${plan.price}`}
            body={`Duración: ${plan.period_days} días · Descargas sin conexión, experiencias exclusivas y descuentos adicionales.`}
            footer={
              <Button
                align="left"
                size="sm"
                title={busy ? 'Procesando…' : 'Activar este plan'}
                disabled={busy}
                onPress={() => void handleSubscribe(plan)}
              />
            }
          />
        ))
      ) : (
        <ListCard
          title="Plan Mensual VIP · BOB 49"
          body="Duración: 30 días · Descargas offline y experiencias exclusivas."
        />
      )}

      {activeSub && activeSub.status.toLowerCase() === 'active' ? (
        <Button
          title="Cancelar renovación automática"
          variant="secondary"
          disabled={busy}
          onPress={() => void handleCancelSubscription(activeSub)}
        />
      ) : null}

      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}

      <Button
        title="Ir a perfil de turista"
        variant="secondary"
        onPress={() => router.navigate('/turista/perfil')}
      />
      <Button
        title="Volver a selección de roles"
        variant="secondary"
        onPress={() => {
          if (session) void logout();
          router.navigate('/');
        }}
      />
    </Screen>
  );
}
