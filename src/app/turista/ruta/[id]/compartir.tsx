import { useCallback } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { Share } from 'react-native';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { useApiData } from '@/hooks/use-api-data';
import { api } from '@/services/api';
import { formatDuration } from '@/utils/format';

/** Pantalla 17 del prototipo: compartir una ruta guardada. */
export default function CompartirRutaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const route = useApiData(useCallback(() => api.getRoute(String(id)), [id]));

  if (!route) return null;

  const link = `turisteaya.demo/ruta/${route.id === 'paseo-por-el-centro' ? 'centro' : route.id}`;

  const shareRoute = () => {
    Share.share({ message: `${route.name} · ${link}` });
  };

  return (
    <Screen
      title="Compartir ruta"
      subtitle={route.name}
      onBack={() => router.navigate(`/turista/ruta/${route.id}`)}
    >
      <AppText variant="body">
        {`${route.stops.length} paradas · ${formatDuration(route.durationMin)} · Bs ${route.cost}`}
      </AppText>
      <FormField label="Enlace de la ruta" value={link} />
      <Button title="Copiar enlace" onPress={shareRoute} />
      <Button title="Compartir con otra aplicación" onPress={shareRoute} />
      <Button
        title="Volver al itinerario"
        variant="secondary"
        onPress={() => router.navigate(`/turista/ruta/${route.id}`)}
      />
    </Screen>
  );
}
