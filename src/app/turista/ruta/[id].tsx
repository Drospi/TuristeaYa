import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { LocationCard } from '@/features/turista/components/location-card';
import { RouteStatus } from '@/features/turista/components/route-status';
import { useRoutes } from '@/features/turista/route-context';
import { realPlaces } from '@/features/turista/data/real-places';
import { categoryLabels } from '@/features/turista/data/route-planner';
import { formatDuration } from '@/utils/format';
export default function RutaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findRoute, routes, ready, busy, repository } = useRoutes();
  const route = findRoute(id);
  if (!route) return <Screen title="Ruta no disponible"><RouteStatus /><Button title="Ver mis rutas" onPress={() => router.replace('/turista/mis-rutas')} /></Screen>;
  const saved = routes.find((item) => item.id === id || item.sourceId === id);
  const displayed = saved ?? route;
  const first = realPlaces.find((place) => place.id === displayed.placeIds[0])!;
  return <Screen title={displayed.name} subtitle={`${displayed.placeIds.length} paradas · ${formatDuration(displayed.durationMin)} aprox.`}>
    <RouteStatus />
    <AppText variant="body">{displayed.categories.map((category) => categoryLabels[category]).join(' + ')}</AppText>
    <AppText variant="caption">Salida: {displayed.departure} · Bs {displayed.cost} estimados · {displayed.distanceKm} km aprox.</AppText>
    <LocationCard point={first.point} title={first.name} note="Mapa de la primera parada. Abre cada lugar para ver su ubicación." />
    {displayed.placeIds.map((placeId, index) => {
      const place = realPlaces.find((item) => item.id === placeId)!;
      return <ListCard key={placeId} title={`${index + 1}. ${place.name}`} body={`${categoryLabels[place.category]} · Visita sugerida: ${place.visitMinutes} min · Presupuesto orientativo: Bs ${place.estimatedCost}`} onPress={() => router.navigate(`/turista/lugar/${placeId}`)} />;
    })}
    <AppText variant="caption">Recorrido propuesto a pie. Distancia aproximada entre referencias, ajustada por un factor urbano; no es navegación calculada por calles. Incluye visitas y traslados a 3 km/h; no incluye regreso. Confirma accesos, horarios y tarifas.</AppText>
    {saved ? <>
      <AppText variant="label">✓ Ruta guardada en este dispositivo</AppText>
      <Button title="Editar paradas" variant="secondary" onPress={() => router.navigate(`/turista/ruta/${saved.id}/editar-paradas`)} />
      <Button title="Ver en Mis rutas" onPress={() => router.navigate('/turista/mis-rutas')} />
    </> : <Button title="Guardar ruta" disabled={!ready || busy} onPress={() => { void repository.save(route).then((savedId) => router.replace(`/turista/ruta/${savedId}`)).catch(() => undefined); }} />}
    <Button title="Compartir itinerario" variant="secondary" onPress={() => router.navigate(`/turista/ruta/${displayed.id}/compartir`)} />
  </Screen>;
}
