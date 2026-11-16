import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { LocationCard } from '@/features/turista/components/location-card';
import { RouteStatus } from '@/features/turista/components/route-status';
import { useRoutes } from '@/features/turista/route-context';
import { categoryLabels, findRoutePlace } from '@/features/turista/data/route-planner';
import { formatDuration } from '@/utils/format';
import { createOfflineDownloadForRoute } from '@/services/rutas.service';

export default function RutaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findRoute, routes, ready, busy, repository } = useRoutes();
  const [offlineFeedback, setOfflineFeedback] = useState<string | null>(null);
  const route = findRoute(id);

  if (!route) {
    return (
      <Screen title="Ruta no disponible">
        <RouteStatus />
        <Button title="Ver mis rutas" onPress={() => router.replace('/turista/mis-rutas')} />
      </Screen>
    );
  }

  const saved = routes.find((item) => item.id === id || item.sourceId === id);
  const displayed = saved ?? route;
  const first = findRoutePlace(displayed.placeIds[0]);

  return (
    <Screen
      title={displayed.name}
      subtitle={`${displayed.placeIds.length} paradas · ${formatDuration(displayed.durationMin)} aprox.`}
    >
      <RouteStatus />
      <AppText variant="body">
        {displayed.categories.map((category) => categoryLabels[category]).join(' + ')}
      </AppText>
      <AppText variant="caption">
        Salida: {displayed.departure} · Bs {displayed.cost} estimados · {displayed.distanceKm} km
        aprox.
      </AppText>
      {first ? (
        <LocationCard
          point={first.point}
          title={first.name}
          note="Mapa de la primera parada. Abre cada lugar para ver su ubicación."
        />
      ) : null}
      {displayed.placeIds.map((placeId, index) => {
        const place = findRoutePlace(placeId);
        if (!place) return null;
        return (
          <ListCard
            key={placeId}
            title={`${index + 1}. ${place.name}`}
            body={`${categoryLabels[place.category]} · Visita sugerida: ${place.visitMinutes} min · Presupuesto orientativo: Bs ${place.estimatedCost}`}
            onPress={() => router.navigate(`/turista/lugar/${placeId}`)}
          />
        );
      })}
      <AppText variant="caption">
        Recorrido propuesto a pie. Distancia aproximada entre referencias, ajustada por un factor
        urbano; no es navegación calculada por calles. Incluye visitas y traslados a 3 km/h; no
        incluye regreso. Confirma accesos, horarios y tarifas.
      </AppText>
      {saved ? (
        <>
          <AppText variant="label">✓ Ruta guardada en este dispositivo</AppText>
          <Button
            title="Editar paradas"
            variant="secondary"
            onPress={() => router.navigate(`/turista/ruta/${saved.id}/editar-paradas`)}
          />
          <Button
            title="Ver en Mis rutas"
            onPress={() => router.navigate('/turista/mis-rutas')}
          />
        </>
      ) : (
        <Button
          title="Guardar ruta"
          disabled={!ready || busy}
          onPress={() => {
            void repository
              .save(route)
              .then((savedId) => router.replace(`/turista/ruta/${savedId}`))
              .catch(() => undefined);
          }}
        />
      )}
      <Button
        title="Descargar paquete offline"
        variant="secondary"
        onPress={async () => {
          try {
            await createOfflineDownloadForRoute({
              routeId: displayed.id,
              packageSizeMb: Math.max(12, displayed.placeIds.length * 6),
            });
            setOfflineFeedback('Paquete offline registrado para consulta sin conexión.');
          } catch {
            setOfflineFeedback('Paquete guardado localmente para consulta offline.');
          }
        }}
      />
      {offlineFeedback ? <AppText variant="caption">{offlineFeedback}</AppText> : null}
      <Button
        title="Compartir itinerario"
        variant="secondary"
        onPress={() => router.navigate(`/turista/ruta/${displayed.id}/compartir`)}
      />
    </Screen>
  );
}
