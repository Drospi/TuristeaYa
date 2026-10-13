import { useCallback } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { MapSchematic } from '@/features/turista/components/map-schematic';
import { useApiData } from '@/hooks/use-api-data';
import { api } from '@/services/api';
import { spacing } from '@/theme';
import { formatDuration } from '@/utils/format';

/** Pantallas 09-10 del prototipo: detalle de una ruta. */
export default function RutaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const route = useApiData(useCallback(() => api.getRoute(String(id)), [id]));

  if (!route) return null;

  return (
    <Screen
      title={route.name}
      subtitle={`${route.stops.length} paradas · ${formatDuration(route.durationMin)} · Bs ${route.cost}`}
    >
      <MapSchematic stopsCount={route.stops.length} height={route.saved ? 155 : 160} />
      {route.stops.map((stop) => (
        <ListCard
          key={stop.order}
          title={`${stop.order}. ${stop.placeName}`}
          body={`${stop.time} · ${stop.durationMin} min · Bs ${stop.cost}`}
          onPress={() => router.navigate(`/turista/lugar/${stop.placeId}`)}
        />
      ))}
      {route.note ? <AppText variant="body">{route.note}</AppText> : null}
      {route.saved ? (
        <>
          <Button
            title="Editar paradas"
            variant="secondary"
            onPress={() => router.navigate(`/turista/ruta/${route.id}/editar-paradas`)}
          />
          <View style={styles.pair}>
            <Button title="Guardar" variant="soft" style={styles.pairItem} onPress={() => router.navigate('/turista/mis-rutas')} />
            <Button title="Compartir" variant="soft" style={styles.pairItem} onPress={() => router.navigate(`/turista/ruta/${route.id}/compartir`)} />
          </View>
        </>
      ) : (
        <>
          <Button title="Guardar ruta" onPress={() => router.navigate('/turista/mis-rutas')} />
          <Button title="Volver a los resultados" variant="secondary" onPress={() => router.back()} />
        </>
      )}
    </Screen>
  );
}

const styles = {
  pair: { flexDirection: 'row', gap: 10 },
  pairItem: { flex: 1, height: 44 },
} as const;
