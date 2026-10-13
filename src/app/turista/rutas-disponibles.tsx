import { useCallback } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { useApiData } from '@/hooks/use-api-data';
import { api } from '@/services/api';
import { formatDuration } from '@/utils/format';

/** Pantalla 07 del prototipo: rutas que cumplen el criterio. */
export default function RutasDisponiblesScreen() {
  const routes = useApiData(useCallback(() => api.getRoutes(), []));

  return (
    <Screen title="Rutas disponibles" subtitle="Hasta Bs 100 · 3 horas · Centro">
      <Button
        title="Filtrar y ordenar"
        variant="secondary"
        onPress={() => router.navigate('/turista/filtros')}
      />
      {routes?.map((route) => (
        <ListCard
          key={route.id}
          title={route.name}
          body={`Bs ${route.cost} · ${formatDuration(route.durationMin)} · ${route.distanceKm} km\n${route.stops.length} paradas · Calificación ${route.rating} / 5`}
          onPress={() => router.navigate(`/turista/ruta/${route.id}`)}
        />
      ))}
      <AppText variant="body">Los importes son aproximados y por persona.</AppText>
      <Button
        title="Cambiar presupuesto o tiempo"
        variant="secondary"
        onPress={() => router.navigate('/turista/crear-ruta')}
      />
    </Screen>
  );
}
