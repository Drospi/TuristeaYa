import { useCallback } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { useApiData } from '@/hooks/use-api-data';
import { api } from '@/services/api';
import { formatDuration } from '@/utils/format';

/** Pantalla 04 del prototipo: inicio del turista. */
export default function InicioScreen() {
  const routes = useApiData(useCallback(() => api.getRoutes(), []));
  const places = useApiData(useCallback(() => api.getPlaces(), []));

  const featuredRoute = routes?.[0];
  const featuredPlace = places?.[0];

  return (
    <Screen title="Inicio" subtitle="La Paz · Centro">
      <Button
        title="Cambiar ubicación"
        variant="secondary"
        onPress={() => router.navigate('/turista/ubicacion')}
      />
      <Button title="Crear una ruta" onPress={() => router.navigate('/turista/crear-ruta')} />
      <AppText variant="body">Recomendado según tus intereses</AppText>
      {featuredRoute ? (
        <ListCard
          title={featuredRoute.name}
          body={`${featuredRoute.tagline} · Bs ${featuredRoute.cost} · ${formatDuration(featuredRoute.durationMin)}`}
          onPress={() => router.navigate(`/turista/ruta/${featuredRoute.id}`)}
        />
      ) : null}
      {featuredPlace ? (
        <ListCard
          title={featuredPlace.name}
          body={`A ${featuredPlace.distanceM} m · Desde Bs ${featuredPlace.priceFrom} · ${featuredPlace.rating} / 5`}
          onPress={() => router.navigate(`/turista/lugar/${featuredPlace.id}`)}
        />
      ) : null}
      <ListCard
        title="Avisos de mi salida"
        body="La galería cambió su horario de cierre."
        onPress={() => router.navigate('/turista/notificaciones')}
      />
      <ListCard
        title="Patrocinado · Restaurante local"
        body="Promoción del día · Consulta condiciones."
        onPress={() => router.navigate('/turista/cupones')}
      />
    </Screen>
  );
}
