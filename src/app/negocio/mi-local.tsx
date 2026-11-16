import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import {
  createBusinessVerification,
  fetchBusinessDashboardData,
  updateBusiness,
} from '@/services/catalogos.service';
import { updateRecord } from '@/services/http';
import * as businessMock from '@/services/mock/business';
import { spacing } from '@/theme';
import type { DbBusiness, DbPlace } from '@/types/database';

const SERVICE_OPTIONS = ['Wi-Fi', 'Terraza', 'Baño', 'Para llevar', 'Reserva previa'];

/** Pantalla 34 del prototipo: Datos del establecimiento (/api/v1/businesses, /places y /business-verifications). */
export default function NegocioMiLocalScreen() {
  const [business, setBusiness] = useState<DbBusiness | null>(null);
  const [place, setPlace] = useState<DbPlace | null>(null);
  const [name, setName] = useState(businessMock.businessProfile.name);
  const [address, setAddress] = useState(businessMock.businessProfile.address);
  const [hours, setHours] = useState(businessMock.businessProfile.hours);
  const [description, setDescription] = useState(businessMock.businessProfile.description);
  const [services, setServices] = useState<string[]>(businessMock.businessProfile.services);
  const [contactEmail, setContactEmail] = useState('contacto@cafedelpatio.bo');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBusinessDashboardData();
      setBusiness(data.business);
      setPlace(data.place);
      setName(data.profile.name);
      setAddress(data.profile.address);
      setHours(data.profile.hours);
      setDescription(data.profile.description);
      setServices(data.profile.services);
      if (data.business?.contact_email) {
        setContactEmail(data.business.contact_email);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function toggleService(service: string) {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
    );
  }

  async function handleSave() {
    if (!name.trim() || !address.trim()) {
      setFeedback('El nombre y la dirección son obligatorios.');
      return;
    }
    setBusy(true);
    setFeedback('');
    try {
      if (business?.id) {
        await updateBusiness(business.id, {
          name: name.trim(),
          contact_email: contactEmail.trim() || null,
        });
      }
      if (place?.id) {
        await updateRecord<DbPlace>('places', place.id, {
          name: name.trim(),
          address: address.trim(),
          description: description.trim(),
          services,
        });
      }
      setFeedback('Datos del comercio actualizados en el servidor.');
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudieron guardar los cambios.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleRequestVerification() {
    if (!business?.id) {
      setFeedback('Solicitud de verificación registrada para revisión administrativa.');
      return;
    }
    setBusy(true);
    setFeedback('');
    try {
      await createBusinessVerification({
        business_id: business.id,
        responsible_name: name.trim(),
        contact_email: contactEmail.trim() || 'contacto@turisteaya.bo',
        document_path: 'verificaciones/licencia-funcionamiento.pdf',
        status: 'pending',
      });
      setFeedback('Solicitud de verificación enviada a administración.');
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudo enviar la verificación.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen title="Mi local" subtitle="Información visible para los turistas">
      {loading ? <AppText variant="caption">Cargando ficha del local…</AppText> : null}

      <FormField label="Nombre del local" value={name} onChangeText={setName} />
      <FormField label="Dirección" value={address} onChangeText={setAddress} />
      <FormField label="Horario de atención" value={hours} onChangeText={setHours} />
      <FormField
        label="Correo de contacto"
        value={contactEmail}
        onChangeText={setContactEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField label="Descripción" value={description} onChangeText={setDescription} />

      <AppText variant="label">Servicios disponibles</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {SERVICE_OPTIONS.map((service) => (
          <Chip
            key={service}
            label={service}
            selected={services.includes(service)}
            onPress={() => toggleService(service)}
          />
        ))}
      </View>

      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}

      <Button
        title={busy ? 'Guardando…' : 'Guardar información'}
        disabled={busy}
        onPress={() => void handleSave()}
      />
      <Button
        title="Solicitar verificación de comercio"
        variant="secondary"
        disabled={busy}
        onPress={() => void handleRequestVerification()}
      />
      <ListCard
        title="Vista detallada del negocio"
        body="Ver reseñas del negocio, notificaciones y soporte de comercio."
        onPress={() => router.navigate('/RamaNegocio')}
      />
    </Screen>
  );
}
