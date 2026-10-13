import { useCallback, useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useApiData } from '@/hooks/use-api-data';
import { api } from '@/services/api';
import { formatDuration } from '@/utils/format';

const filterOptions = ['Guardadas', 'Visitadas'] as const;
type FilterOption = (typeof filterOptions)[number];

/** Pantalla 18 del prototipo: rutas favoritas del turista. */
export default function MisRutasScreen() {
  const routes = useApiData(useCallback(() => api.getRoutes(), []));
  const [filter, setFilter] = useState<FilterOption>('Guardadas');

  return (
    <Screen title="Mis rutas" subtitle="Rutas que quieres visitar otra vez">
      <SegmentedControl label="Mostrar" options={filterOptions} value={filter} onChange={setFilter} />
      {routes?.map((route) => (
        <ListCard
          key={route.id}
          title={route.name}
          body={`Bs ${route.cost} · ${formatDuration(route.durationMin)} · ${route.stops.length} paradas`}
          onPress={() => router.navigate(`/turista/ruta/${route.id}`)}
        />
      ))}
      <Button title="Quitar una ruta de favoritos" onPress={() => router.back()} />
      <Button
        title="Descargar rutas con VIP"
        variant="secondary"
        onPress={() => router.navigate('/vip/descargas')}
      />
    </Screen>
  );
}
