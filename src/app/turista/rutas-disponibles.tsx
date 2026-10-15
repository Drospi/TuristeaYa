import { router } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { useRoutes } from '@/features/turista/route-context';
import { matchingRoutes, categoryLabels } from '@/features/turista/data/route-planner';
import { realPlaces } from '@/features/turista/data/real-places';
import { formatDuration } from '@/utils/format';
export default function RutasDisponiblesScreen() {
  const { criteria } = useRoutes();
  const results = matchingRoutes(criteria);
  return <Screen title="Rutas disponibles" subtitle={`${results.length} opciones · ${criteria.departure}`}>
    <AppText variant="body">{criteria.categories.map((category) => categoryLabels[category]).join(' + ')}</AppText>
    <AppText variant="caption">Hasta Bs {criteria.budget} · {formatDuration(criteria.minutes)}</AppText>
    <Button title="Filtrar y ordenar" variant="secondary" onPress={() => router.navigate('/turista/filtros')} />
    {results.map((route) => <ListCard key={route.id} title={route.name}
      body={`Bs ${route.cost} estimados · ${formatDuration(route.durationMin)} aprox. · ${route.distanceKm} km aprox.\n${route.placeIds.map((id) => realPlaces.find((place) => place.id === id)!.name).join(' → ')}`}
      onPress={() => router.navigate(`/turista/ruta/${route.id}`)} />)}
    {!results.length ? <ListCard title="No hay coincidencias con estos límites" body="Amplía el presupuesto, el tiempo o la distancia. No mostraremos rutas que incumplan tus categorías o límites." /> : null}
    <AppText variant="caption">Los recorridos contienen exactamente las categorías elegidas. Estimaciones a pie desde el punto de partida; no incluyen regreso, tráfico ni reservas.</AppText>
    <Button title="Cambiar categorías, presupuesto o tiempo" variant="secondary" onPress={() => router.navigate('/turista/crear-ruta')} />
  </Screen>;
}
