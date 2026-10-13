import { useCallback, useState } from 'react';

import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { useApiData } from '@/hooks/use-api-data';
import { api } from '@/services/api';
import { colors, fontFamilies, radius, spacing, borderWidth } from '@/theme';
import type { RouteStop } from '@/types';

/** Pantalla 11 del prototipo: reordenar las paradas de una ruta. */
export default function EditarParadasScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const route = useApiData(useCallback(() => api.getRoute(String(id)), [id]));
  const [stops, setStops] = useState<RouteStop[] | null>(null);

  if (!route) return null;
  const current = stops ?? route.stops;

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= current.length) return;
    const next = [...current];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setStops(next.map((stop, position) => ({ ...stop, order: position + 1 })));
  };

  return (
    <Screen title="Editar paradas" subtitle={route.name}>
      <AppText variant="body">Cambia el orden con las flechas.</AppText>
      {current.map((stop, index) => (
        <View key={stop.placeId} style={styles.row}>
          <AppText variant="bodySmall" color="ink" style={styles.rowLabel}>
            {`${stop.order}. ${stop.placeName} · Bs ${stop.cost}`}
          </AppText>
          <View style={styles.arrows}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Subir ${stop.placeName}`}
              hitSlop={6}
              onPress={() => move(index, -1)}
            >
              <Text style={styles.arrow}>↑</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Bajar ${stop.placeName}`}
              hitSlop={6}
              onPress={() => move(index, 1)}
            >
              <Text style={styles.arrow}>↓</Text>
            </Pressable>
          </View>
        </View>
      ))}
      <AppText variant="body">{'Nuevo orden de ejemplo:\nGalería → Café → Mirador'}</AppText>
      <ListCard title="Resumen actualizado" body="Bs 85 · 2 h 40 min · 2.1 km" />
      <Button title="Guardar cambios" onPress={() => router.back()} />
      <Button title="Cancelar" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 44,
    borderRadius: radius.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    flex: 1,
    color: colors.ink,
  },
  arrows: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingLeft: spacing.sm,
  },
  arrow: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
    fontFamily: fontFamilies.regular,
  },
});
