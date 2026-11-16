import { useCallback, useEffect, useState } from 'react';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import {
  createCampaign,
  fetchBusinessDashboardData,
  updateCampaign,
} from '@/services/catalogos.service';
import { isUuid } from '@/services/http';
import * as businessMock from '@/services/mock/business';
import type { Campaign } from '@/types';
import type { DbBusiness } from '@/types/database';

/** Pantallas 38-40 del prototipo: Gestión de campañas publicitarias (/api/v1/campaigns y /campaign-events). */
export default function NegocioCampanasScreen() {
  const [business, setBusiness] = useState<DbBusiness | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>(businessMock.campaigns);
  const [title, setTitle] = useState('');
  const [adText, setAdText] = useState('');
  const [budget, setBudget] = useState('150');
  const [placement, setPlacement] = useState('Inicio patrocinado');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBusinessDashboardData();
      setBusiness(data.business);
      setCampaigns(data.campaigns);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreateCampaign() {
    const budgetNum = Number(budget.replace(',', '.'));
    if (!title.trim() || !adText.trim()) {
      setFeedback('Completa el título y texto del anuncio.');
      return;
    }
    if (!Number.isFinite(budgetNum) || budgetNum <= 0) {
      setFeedback('Ingresa un presupuesto válido mayor que cero.');
      return;
    }
    setBusy(true);
    setFeedback('');
    try {
      if (business?.id) {
        const startsAt = new Date();
        const endsAt = new Date(startsAt.getTime() + 7 * 24 * 60 * 60 * 1000);
        await createCampaign({
          business_id: business.id,
          title: title.trim(),
          ad_text: adText.trim(),
          placement: placement.trim() || 'Inicio patrocinado',
          budget: budgetNum,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          radius_meters: 1500,
          status: 'active',
        });
        await load();
      } else {
        setCampaigns((prev) => [
          {
            id: `camp-${Date.now()}`,
            title: title.trim(),
            state: 'Activa',
            spent: 0,
            budget: budgetNum,
            period: 'Próximos 7 días',
            views: 0,
            space: placement.trim() || 'Inicio patrocinado',
          },
          ...prev,
        ]);
      }
      setTitle('');
      setAdText('');
      setShowForm(false);
      setFeedback('Campaña creada y publicada.');
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudo crear la campaña.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleCampaign(campaign: Campaign) {
    const nextState = campaign.state === 'Activa' ? 'Pausada' : 'Activa';
    setBusy(true);
    setFeedback('');
    try {
      if (isUuid(campaign.id)) {
        await updateCampaign(campaign.id, {
          status: nextState === 'Activa' ? 'active' : 'paused',
        });
      }
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaign.id ? { ...c, state: nextState } : c)),
      );
      setFeedback(`Campaña actualizada a estado: ${nextState}.`);
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudo actualizar la campaña.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen title="Campañas" subtitle="Promoción patrocinada de tu comercio">
      {loading ? <AppText variant="caption">Cargando campañas desde /api/v1/campaigns…</AppText> : null}

      <Button
        title={showForm ? 'Cancelar nueva campaña' : 'Crear nueva campaña'}
        variant={showForm ? 'secondary' : 'primary'}
        onPress={() => setShowForm((v) => !v)}
      />

      {showForm ? (
        <>
          <FormField
            label="Título de la campaña"
            placeholder="Café cerca de ti"
            value={title}
            onChangeText={setTitle}
          />
          <FormField
            label="Texto del anuncio"
            placeholder="Pausa de café y pastelería en el centro"
            value={adText}
            onChangeText={setAdText}
          />
          <FormField
            label="Ubicación del anuncio"
            placeholder="Inicio patrocinado"
            value={placement}
            onChangeText={setPlacement}
          />
          <FormField
            label="Presupuesto total (Bs)"
            keyboardType="decimal-pad"
            value={budget}
            onChangeText={setBudget}
          />
          <Button
            title={busy ? 'Publicando…' : 'Publicar campaña'}
            disabled={busy}
            onPress={() => void handleCreateCampaign()}
          />
        </>
      ) : null}

      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}

      <AppText variant="section">Campañas registradas</AppText>
      {campaigns.map((camp) => (
        <ListCard
          key={camp.id}
          title={camp.title}
          body={`Ubicación: ${camp.space}\nPeriodo: ${camp.period}\nInversión: Bs ${camp.spent} de Bs ${camp.budget} · ${camp.views} impresiones`}
          footer={
            <>
              <Badge
                label={camp.state}
                tone={camp.state === 'Activa' ? 'green' : 'cream'}
              />
              {camp.state !== 'Finalizada' ? (
                <Button
                  align="left"
                  size="sm"
                  variant="secondary"
                  title={camp.state === 'Activa' ? 'Pausar campaña' : 'Reactivar campaña'}
                  disabled={busy}
                  onPress={() => void handleToggleCampaign(camp)}
                />
              ) : null}
            </>
          }
        />
      ))}
    </Screen>
  );
}
