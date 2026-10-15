import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { recommendations, findDiscoveryPlace } from '../data/discovery';
import { colors, radius, spacing } from '@/theme';

export function RecommendationCarousel() {
  const [index, setIndex] = useState(0);
  const recommendation = recommendations[index];
  const place = findDiscoveryPlace(recommendation.placeId)!;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <AppText variant="label" color="primary">{recommendation.eyebrow}</AppText>
        <AppText variant="caption">{index + 1} / {recommendations.length}</AppText>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Ver ${place.name}`} onPress={() => router.navigate(`/turista/lugar/${place.id}`)} style={styles.content}>
        <AppText variant="title">{place.name}</AppText>
        <AppText variant="bodySmall">{recommendation.description}</AppText>
        <AppText variant="caption">{recommendation.tag}</AppText>
        <AppText variant="action">Ver lugar y mapa →</AppText>
      </Pressable>
      <View style={styles.row}>
        <Button title="Anterior" variant="secondary" size="sm" onPress={() => setIndex((index + recommendations.length - 1) % recommendations.length)} />
        <View style={styles.dots}>
          {recommendations.map((item, position) => <Pressable key={item.placeId} accessibilityRole="button" accessibilityLabel={`Mostrar ${findDiscoveryPlace(item.placeId)?.name}`} accessibilityState={{ selected: index === position }} onPress={() => setIndex(position)} hitSlop={8} style={[styles.dot, position === index && styles.activeDot]} />)}
        </View>
        <Button title="Siguiente" variant="secondary" size="sm" onPress={() => setIndex((index + 1) % recommendations.length)} />
      </View>
      <AppText variant="micro">Lugares reales en La Paz. Sugerencias editoriales, sin patrocinio comercial.</AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { padding: spacing.lg, gap: spacing.md, backgroundColor: colors.highlight, borderWidth: 1, borderColor: colors.borderHighlight, borderRadius: radius.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  content: { gap: 9 },
  dots: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  dot: { height: 8, width: 8, borderRadius: 4, backgroundColor: colors.borderCream },
  activeDot: { backgroundColor: colors.primary },
});
