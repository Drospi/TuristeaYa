import { useEffect, useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { listRecords } from '@/services/http';
import * as routesMock from '@/services/mock/routes';
import type { DbPlace, DbRoute } from '@/types/database';

/** Pantalla 47 del prototipo: Revisión de recorridos y lugares reportados en soporte. */
export default function SoporteRecorridosScreen() {
  const [routes, setRoutes] = useState<DbRoute[]>([]);
  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      listRecords<DbRoute>('routes', { limit: 15 }).catch(() => [] as DbRoute[]),
      listRecords<DbPlace>('places', { limit: 15 }).catch(() => [] as DbPlace[]),
    ])
      .then(([routesData, placesData]) => {
        if (!active) return;
        setRoutes(routesData);
        setPlaces(placesData);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Screen title="Recorridos y lugares" subtitle="Verificación de catálogo desde soporte">
      {loading ? <AppText variant="caption">Consultando rutas y lugares en el servidor…</AppText> : null}

      <AppText variant="section">Rutas registradas</AppText>
      {routes.length > 0
        ? routes.slice(0, 6).map((route) => (
            <ListCard
              key={route.id}
              title={route.name}
              body={`Presupuesto: Bs ${route.budget} · Tiempo: ${route.available_minutes} min · Visibilidad: ${route.visibility}`}
            />
          ))
        : routesMock.routes.map((route) => (
            <ListCard
              key={route.id}
              title={route.name}
              body={`${route.tagline} · Bs ${route.cost} · ${route.durationMin} min`}
            />
          ))}

      <AppText variant="section">Lugares del catálogo</AppText>
      {places.slice(0, 6).map((place) => (
        <ListCard
          key={place.id}
          title={place.name}
          body={`${place.address}\nCosto estimado: Bs ${place.estimated_cost} · Visita: ${place.visit_minutes} min`}
        />
      ))}

      <Button
        title="Volver a selección de roles"
        variant="secondary"
        onPress={() => router.navigate('/')}
      />
    </Screen>
  );
}
