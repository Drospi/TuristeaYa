import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, spacing, borderWidth } from '@/theme';

type CardProps = ViewProps & {
  /** Relleno interior de la tarjeta. */
  padding?: number;
};

/** Tarjeta blanca de Figma: radio 8, borde 1px, fondo blanco. */
export function Card({ padding = spacing.lg, style, ...rest }: CardProps) {
  return <View style={[styles.card, { padding }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
