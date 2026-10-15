import { useState } from 'react';
import { router } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/button';
import { AppText } from '@/components/ui/app-text';
import { ListCard } from '@/components/ui/list-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useRoutes } from '@/features/turista/route-context';
import { RouteStatus } from '@/features/turista/components/route-status';
import { formatDuration } from '@/utils/format';
const options = ['Guardadas', 'Visitadas'] as const;
export default function MisRutasScreen() {
  const { routes, ready, busy, repository } = useRoutes();
  const [filter, setFilter] = useState<(typeof options)[number]>('Guardadas');
  const [deleting, setDeleting] = useState<string | null>(null);
  const visible = routes.filter((route) => filter === 'Visitadas' ? route.visited : !route.visited);
  return <Screen title="Mis rutas" subtitle="Guardadas en este dispositivo">
    <RouteStatus />
    <SegmentedControl label="Mostrar" options={options} value={filter} onChange={setFilter} />
    {ready && !visible.length ? <AppText variant="body">{filter === 'Visitadas' ? 'Aún no marcaste rutas como visitadas.' : 'Aún no tienes rutas pendientes guardadas.'}</AppText> : null}
    {visible.map((route) => <ListCard key={route.id} title={route.name} body={`${route.placeIds.length} paradas · Bs ${route.cost} estimados · ${formatDuration(route.durationMin)} aprox.`}
      footer={<>
        <Button title="Ver ruta" onPress={() => router.navigate(`/turista/ruta/${route.id}`)} />
        <Button title={route.visited ? 'Mover a pendientes' : 'Marcar como visitada'} variant="secondary" disabled={busy} onPress={() => { void repository.setVisited(route.id, !route.visited).catch(() => undefined); }} />
        {deleting === route.id ? <>
          <AppText variant="caption">¿Eliminar esta ruta de tus guardadas?</AppText>
          <Button title="Sí, eliminar ruta" disabled={busy} onPress={() => { void repository.remove(route.id).then(() => setDeleting(null)).catch(() => undefined); }} />
          <Button title="Cancelar" variant="secondary" onPress={() => setDeleting(null)} />
        </> : <Button title="Eliminar ruta" variant="secondary" onPress={() => setDeleting(route.id)} />}
      </>} />)}
    <Button title="Buscar nuevas rutas" onPress={() => router.navigate('/turista/crear-ruta')} />
  </Screen>;
}
