import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { router } from 'expo-router';

import { findDiscoveryPlace, recommendations } from '../data/discovery';
import { useDiscovery } from '../discovery-context';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { colors, radius, spacing } from '@/theme';

export function RecommendationCarousel() {
  const { backendPlaces } = useDiscovery();
  const [index, setIndex] = useState(0);

  const items = useMemo(() => {
    const dynamicItems = backendPlaces.slice(0, 4).map((p) => ({
      placeId: p.id,
      eyebrow: `Catálogo · ${
        p.category === 'gastronomia'
          ? 'Gastronomía'
          : p.category === 'naturaleza'
            ? 'Naturaleza'
            : 'Cultura'
      }`,
      description: p.description,
      tag: `${p.address} · Bs ${p.priceFrom}`,
    }));
    return [...dynamicItems, ...recommendations];
  }, [backendPlaces]);

  const safeIndex = index % items.length;
  const recommendation = items[safeIndex];
  const place =
    backendPlaces.find((p) => p.id === recommendation.placeId) ??
    findDiscoveryPlace(recommendation.placeId) ??
    findDiscoveryPlace('mercado-lanza')!;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <AppText variant="label" color="primary">
          {recommendation.eyebrow}
        </AppText>
        <AppText variant="caption">
          {safeIndex + 1} / {items.length}
        </AppText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver ${place.name}`}
        onPress={() => router.navigate(`/turista/lugar/${place.id}`)}
        style={styles.content}
      >
        <AppText variant="title">{place.name}</AppText>
        <AppText variant="bodySmall">{recommendation.description}</AppText>
        <AppText variant="caption">{recommendation.tag}</AppText>
        <AppText variant="action">Ver lugar y mapa →</AppText>
      </Pressable>
      <View style={styles.row}>
        <Button
          title="Anterior"
          variant="secondary"
          size="sm"
          onPress={() => setIndex((safeIndex + items.length - 1) % items.length)}
        />
        <View style={styles.dots}>
          {items.map((item, position) => (
            <Pressable
              key={item.placeId}
              accessibilityRole="button"
              accessibilityLabel={`Mostrar opción ${position + 1}`}
              accessibilityState={{ selected: safeIndex === position }}
              onPress={() => setIndex(position)}
              hitSlop={8}
              style={[styles.dot, position === safeIndex && styles.activeDot]}
            />
          ))}
        </View>
        <Button
          title="Siguiente"
          variant="secondary"
          size="sm"
          onPress={() => setIndex((safeIndex + 1) % items.length)}
        />
      </View>
      <AppText variant="micro">
        Lugares sincronizados con el catálogo de TuristeaYa y sugerencias de La Paz.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.highlight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    borderRadius: radius.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  content: { gap: 9 },
  dots: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  dot: { height: 8, width: 8, borderRadius: 4, backgroundColor: colors.borderCream },
  activeDot: { backgroundColor: colors.primary },
});
