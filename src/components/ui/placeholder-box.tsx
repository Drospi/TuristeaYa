import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, radius, borderWidth } from '@/theme';

type PlaceholderBoxProps = ViewProps & {
  label: string;
  height: number;
  /** cream: fotos y mapas de ubicación; green: esquemas de recorrido. */
  tone?: 'cream' | 'green';
};

/**
 * Marcador de posición tal como aparece en Figma: el prototipo
 * usa rectángulos con etiqueta en lugar de fotos y mapas reales.
 */
export function PlaceholderBox({
  label,
  height,
  tone = 'cream',
  style,
  ...rest
}: PlaceholderBoxProps) {
  return (
    <View style={[styles.box, { height }, tone === 'cream' ? styles.cream : styles.green, style]} {...rest}>
      <AppText variant="bodySmall">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.borderCream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  cream: { backgroundColor: colors.highlight },
  green: { backgroundColor: colors.surfaceGreenSoft },
});
