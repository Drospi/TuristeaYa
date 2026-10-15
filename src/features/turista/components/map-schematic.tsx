import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, fontFamilies, radius, spacing, borderWidth } from '@/theme';

type MapSchematicProps = {
  label?: string;
  stopsCount: number;
  height?: number;
};

/**
 * Esquema de recorrido del prototipo: rectángulo verde claro con
 * líneas decorativas, puntos numerados y tramos verdes entre paradas.
 * Posiciones medidas sobre el recuadro de 350px del Figma.
 */
const stopSlots = [
  { left: '21%', top: 74 },
  { left: '43%', top: 24 },
  { left: '78%', top: 35 },
] as const;

export function MapSchematic({ label = 'Mapa del recorrido · esquema', stopsCount, height = 155 }: MapSchematicProps) {
  return (
    <View style={[styles.box, { height }]}>
      <AppText variant="micro" style={styles.label}>
        {label}
      </AppText>
      <View style={[styles.vline, { left: '11%' }]} />
      <View style={[styles.vline, { left: '34%' }]} />
      <View style={[styles.vline, { left: '59%' }]} />
      <View style={[styles.vline, { left: '80%' }]} />
      <View style={[styles.hline, { top: 44 }]} />
      <View style={[styles.hline, { top: 91 }]} />
      <View style={[styles.hline, { top: 134 }]} />
      <View style={styles.segmentA} />
      <View style={styles.segmentB} />
      {Array.from({ length: stopsCount }, (_, index) => {
        const slot = stopSlots[index];
        return (
          <View key={index} style={[styles.dot, { left: slot.left, top: slot.top }]}>
            <AppText variant="caption" style={styles.dotText}>
              {index + 1}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.borderCream,
    backgroundColor: colors.surfaceGreenSoft,
    overflow: 'hidden',
  },
  label: {
    position: 'absolute',
    left: spacing.sm + 2,
    top: spacing.sm + 2,
  },
  vline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.surface,
  },
  hline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.surface,
  },
  segmentA: {
    position: 'absolute',
    left: 71,
    top: 87,
    width: 108,
    height: 2,
    backgroundColor: colors.primaryDeep,
    transform: [{ rotate: '-46deg' }],
  },
  segmentB: {
    position: 'absolute',
    left: 162,
    top: 57,
    width: 125,
    height: 2,
    backgroundColor: colors.primaryDeep,
    transform: [{ rotate: '8deg' }],
  },
  dot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: borderWidth.hairline,
    borderColor: colors.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: {
    color: colors.ink,
    fontFamily: fontFamilies.bold,
  },
});
