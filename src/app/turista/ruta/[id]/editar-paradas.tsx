import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { RouteStatus } from '@/features/turista/components/route-status';
import { useRoutes } from '@/features/turista/route-context';
import { calculateRoute, type PlannedRoute } from '@/features/turista/data/route-planner';
import { realPlaces } from '@/features/turista/data/real-places';
import { formatDuration } from '@/utils/format';
export default function EditarParadasScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { routes } = useRoutes();
  const route = routes.find((item) => item.id === id);
  if (!route) return <Screen title="Editar paradas"><RouteStatus /><AppText variant="body">Primero guarda la ruta.</AppText></Screen>;
  return <Editor key={route.id} route={route} />;
}
function Editor({ route }: { route: PlannedRoute }) {
  const { busy, repository } = useRoutes();
  const [ids, setIds] = useState(route.placeIds);
  const preview = calculateRoute({ ...route, placeIds: ids });
  function move(index: number, offset: number) {
    const next = [...ids]; const target = index + offset;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]]; setIds(next);
  }
  return <Screen title="Editar paradas" subtitle={route.name}>
    <RouteStatus />
    {ids.map((id, index) => <ListCard key={id} title={`${index + 1}. ${realPlaces.find((p) => p.id === id)!.name}`} footer={<>
      <Button title="Subir" variant="secondary" disabled={busy || index === 0} onPress={() => move(index, -1)} />
      <Button title="Bajar" variant="secondary" disabled={busy || index === ids.length - 1} onPress={() => move(index, 1)} />
      <Button title="Quitar parada" variant="secondary" disabled={busy || ids.length === 1} onPress={() => setIds(ids.filter((item) => item !== id))} />
    </>} />)}
    <ListCard title="Resumen actualizado" body={`Bs ${preview.cost} estimados · ${formatDuration(preview.durationMin)} aprox. · ${preview.distanceKm} km aprox.`} />
    <Button title="Guardar cambios" disabled={busy} onPress={() => { void repository.updateStops(route.id, ids).then(() => router.back()).catch(() => undefined); }} />
    <Button title="Cancelar" variant="secondary" disabled={busy} onPress={() => router.back()} />
  </Screen>;
}
