import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import { RouteStatus } from '@/features/turista/components/route-status';
import { useRoutes } from '@/features/turista/route-context';
import { realPlaces } from '@/features/turista/data/real-places';
import { useSelectedLocation } from '@/features/turista/location-context';
import { zonePoints } from '@/features/turista/data/discovery';
export default function GuardarLugarScreen() {
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const { routes, ready, busy, repository } = useRoutes();
  const { location } = useSelectedLocation();
  const [target, setTarget] = useState('');
  const [name, setName] = useState('Mi paseo por La Paz');
  const [error, setError] = useState('');
  const place = realPlaces.find((item) => item.id === placeId);
  async function save() {
    if (!place) return;
    try {
      setError('');
      let savedId: string;
      if (target === 'new') {
        const origin = location.latitude != null && location.longitude != null ? { latitude: location.latitude, longitude: location.longitude } : zonePoints[location.label];
        if (!origin) return setError('Elige una zona conocida o GPS en Mi ubicación antes de crear la ruta.');
        savedId = await repository.create(name, place.id, origin, location.label);
      } else if (target) savedId = await repository.addPlace(target, place.id);
      else return setError('Selecciona una ruta o crea una nueva.');
      router.replace(`/turista/ruta/${savedId}`);
    } catch { setError('No se pudo guardar. Tus rutas anteriores se conservan.'); }
  }
  return <Screen title="Guardar en una ruta" subtitle={place?.name ?? 'Lugar no disponible'}>
    <RouteStatus />
    {!place ? <AppText variant="body">Este lugar de demostración no pertenece al catálogo de rutas reales.</AppText> : <>
      <AppText variant="body">¿En qué ruta quieres añadir esta parada?</AppText>
      {ready && !routes.length ? <AppText variant="caption">Todavía no tienes rutas guardadas. Puedes crear una aquí.</AppText> : null}
      {routes.map((route) => <ListCard key={route.id} title={`${target === route.id ? '✓ ' : ''}${route.name}`} body={`${route.placeIds.length} paradas${route.placeIds.includes(place.id) ? ' · Este lugar ya está incluido' : ''}${route.visited ? ' · Visitada' : ''}`} onPress={() => setTarget(route.id)} />)}
      <Button title={target === 'new' ? '✓ Crear una nueva ruta' : 'Crear una nueva ruta'} variant="secondary" onPress={() => setTarget('new')} />
      {target === 'new' ? <FormField label="Nombre de la ruta" value={name} onChangeText={setName} maxLength={80} /> : null}
      {error ? <AppText variant="caption">{error}</AppText> : null}
      <Button title="Confirmar y guardar" disabled={!ready || busy || !target || (target === 'new' && !name.trim())} onPress={save} />
      <AppText variant="caption">La parada se añade al final, sin duplicados. Puedes cambiar su orden después. El total se recalcula; puede superar tu presupuesto de búsqueda.</AppText>
    </>}
  </Screen>;
}
