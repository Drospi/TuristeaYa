import { useEffect, useState } from 'react';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import {
  createBusinessPromotion,
  fetchBusinessPromotions,
  toggleBusinessPromotionStatus,
} from '@/services/cupones.service';
import type { Promotion } from '@/types';

export default function NegocioPromocionesScreen() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountPct, setDiscountPct] = useState('20');
  const [conditions, setConditions] = useState(
    'Presentar código antes de pagar. Un canje por cuenta.',
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadPromotions() {
    setLoading(true);
    try {
      const items = await fetchBusinessPromotions();
      setPromotions(items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPromotions();
  }, []);

  async function handleCreate() {
    if (!title.trim() || !code.trim()) {
      setFeedback('Completa el título y el código del cupón.');
      return;
    }
    setCreating(true);
    setFeedback(null);
    try {
      const created = await createBusinessPromotion({
        title,
        code,
        discountPct: Number(discountPct) || 15,
        conditions,
      });
      setPromotions((prev) => [created, ...prev]);
      setTitle('');
      setCode('');
      setShowForm(false);
      setFeedback(`Promoción ${created.code} publicada en el catálogo.`);
    } catch {
      setFeedback('No se pudo publicar la promoción en este momento.');
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(promo: Promotion) {
    try {
      const nextState = await toggleBusinessPromotionStatus(promo.id, promo.state);
      setPromotions((prev) =>
        prev.map((item) =>
          item.id === promo.id ? { ...item, state: nextState } : item,
        ),
      );
    } catch {
      setFeedback('No se pudo actualizar el estado de la promoción.');
    }
  }

  return (
    <Screen
      title="Promociones y cupones"
      subtitle="Descuentos activos para atraer visitantes"
    >
      {feedback ? <Badge label={feedback} tone="green" /> : null}
      {loading ? <AppText variant="caption">Sincronizando promociones…</AppText> : null}

      <Button
        title={showForm ? 'Ocultar formulario' : 'Crear nueva promoción'}
        variant={showForm ? 'secondary' : 'primary'}
        onPress={() => setShowForm((v) => !v)}
      />

      {showForm ? (
        <Card>
          <AppText variant="section">Nueva promoción</AppText>
          <FormField
            label="Título del descuento"
            placeholder="Ej. 20% en cafés especiales"
            value={title}
            onChangeText={setTitle}
          />
          <FormField
            label="Código de canje"
            placeholder="Ej. CAFE20"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
          />
          <FormField
            label="Porcentaje de descuento (%)"
            keyboardType="number-pad"
            value={discountPct}
            onChangeText={setDiscountPct}
          />
          <FormField
            label="Condiciones"
            value={conditions}
            onChangeText={setConditions}
          />
          <Button
            title={creating ? 'Publicando...' : 'Publicar promoción'}
            disabled={creating}
            onPress={handleCreate}
          />
        </Card>
      ) : null}

      {promotions.map((promo) => (
        <ListCard
          key={promo.id}
          title={`${promo.title} (${promo.code})`}
          body={`${promo.discountPct}% de descuento · ${promo.redemptions} canjes · ${promo.validity}\nLímite: ${promo.usageLimit}\n${promo.conditions}`}
          footer={
            <>
              <Badge
                label={promo.state}
                tone={promo.state === 'Activa' ? 'green' : 'cream'}
              />
              <Button
                title={
                  promo.state === 'Activa'
                    ? 'Pausar / Programar'
                    : 'Activar promoción'
                }
                variant="secondary"
                onPress={() => {
                  void handleToggle(promo);
                }}
              />
            </>
          }
        />
      ))}
    </Screen>
  );
}
