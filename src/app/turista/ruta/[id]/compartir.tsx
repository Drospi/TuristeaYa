import { useState } from 'react';
import { Share } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { useRoutes } from '@/features/turista/route-context';
import { realPlaces } from '@/features/turista/data/real-places';
import { RouteStatus } from '@/features/turista/components/route-status';
export default function CompartirRutaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findRoute } = useRoutes();
  const [error, setError] = useState('');
  const route = findRoute(id);
  const message = route ? `${route.name}\nSalida: ${route.departure}\n${route.placeIds.map((placeId, index) => `${index + 1}. ${realPlaces.find((p) => p.id === placeId)!.name}`).join('\n')}\nPresupuesto estimado: Bs ${route.cost}\nDuración aproximada: ${route.durationMin} min. Verifica horarios y tarifas.` : '';
  return <Screen title="Compartir itinerario" subtitle={route?.name}>
    <RouteStatus />
    <AppText variant="body" selectable>{message || 'Ruta no disponible.'}</AppText>
    <Button title="Compartir con otra aplicación" disabled={!route} onPress={async () => { try { await Share.share({ message }); } catch { setError('No se pudo compartir. Puedes seleccionar y copiar el itinerario de arriba.'); } }} />
    {error ? <AppText variant="caption">{error}</AppText> : null}
    <Button title="Volver" variant="secondary" onPress={() => router.back()} />
  </Screen>;
}
