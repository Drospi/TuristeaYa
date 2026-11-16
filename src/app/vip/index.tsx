import { useCallback, useEffect, useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import {
  fetchVipExperienceCatalog,
  reserveExperience,
} from '@/services/catalogos.service';
import { isUuid } from '@/services/http';
import * as vipMock from '@/services/mock/vip';
import type { VipExperience } from '@/types';
import type { DbReservation } from '@/types/database';

/** Pantallas 26, 30-31 del prototipo: Panel VIP y reserva de experiencias exclusivas (/api/v1/experiences/{id}/reserve). */
export default function VipHomeScreen() {
  const [experiences, setExperiences] = useState<VipExperience[]>([vipMock.experience]);
  const [reservations, setReservations] = useState<DbReservation[]>([]);
  const [peopleCount, setPeopleCount] = useState('2');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchVipExperienceCatalog();
      setExperiences(data.experiences);
      setReservations(data.reservations);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleReserve(exp: VipExperience) {
    const people = Number(peopleCount);
    if (!Number.isFinite(people) || people <= 0) {
      setFeedback('Ingresa un número válido de participantes (1 o más).');
      return;
    }
    setBusyId(exp.id);
    setFeedback('');
    try {
      if (isUuid(exp.id)) {
        await reserveExperience(exp.id, people);
        await load();
        setFeedback(`Reserva confirmada para «${exp.name}» (${people} personas).`);
      } else {
        setFeedback(
          `Reserva registrada para «${exp.name}» (${people} personas · Total Bs ${exp.pricePerPerson * people}).`,
        );
      }
    } catch (err) {
      setFeedback(
        err instanceof Error
          ? err.message
          : 'No se pudo completar la reserva. Verifica tu sesión VIP o cupos disponibles.',
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Screen title="Zona VIP" subtitle="Experiencias exclusivas y beneficios">
      {loading ? <AppText variant="caption">Cargando experiencias del catálogo…</AppText> : null}

      <FormField
        label="Participantes para reservar"
        keyboardType="number-pad"
        value={peopleCount}
        onChangeText={setPeopleCount}
        placeholder="2"
      />

      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}

      <AppText variant="section">Experiencias exclusivas</AppText>
      {experiences.map((exp) => (
        <ListCard
          key={exp.id}
          title={exp.name}
          body={`${exp.date} · ${exp.time}\n${exp.duration}\nCupos disponibles: ${exp.slots} · Bs ${exp.pricePerPerson} por persona\n${exp.cancellationPolicy}`}
          footer={
            <>
              <Badge label={`Bs ${exp.pricePerPerson} / persona`} tone="green" />
              <Button
                align="left"
                size="sm"
                title={busyId === exp.id ? 'Reservando…' : 'Reservar experiencia'}
                disabled={busyId === exp.id}
                onPress={() => void handleReserve(exp)}
              />
            </>
          }
        />
      ))}

      {reservations.length > 0 ? (
        <>
          <AppText variant="section">Mis reservas confirmadas</AppText>
          {reservations.map((res) => (
            <ListCard
              key={res.id}
              title={`Reserva #${res.id.slice(0, 6)}`}
              body={`Participantes: ${res.participants} · Total: Bs ${res.total}\nEstado: ${res.status}`}
            />
          ))}
        </>
      ) : null}

      <Button
        title="Rutas sin conexión (Descargas)"
        variant="secondary"
        onPress={() => router.navigate('/vip/descargas')}
      />
      <Button
        title="Ver historial de beneficios"
        variant="secondary"
        onPress={() => router.navigate('/vip/beneficios')}
      />
    </Screen>
  );
}
