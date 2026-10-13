import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, fontFamilies, radius, spacing } from '@/theme';

type BadgeProps = ViewProps & {
  label: string;
  /** green: estados positivos; cream: estados de aviso/pendiente. */
  tone?: 'green' | 'cream';
};

/** Insignia de estado (pastilla pequeña, texto 12/17 bold). */
export function Badge({ label, tone = 'green', style, ...rest }: BadgeProps) {
  return (
    <View style={[styles.badge, tone === 'green' ? styles.green : styles.cream, style]} {...rest}>
      <AppText
        variant="caption"
        style={[styles.text, tone === 'green' ? styles.greenText : styles.creamText]}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
  },
  green: { backgroundColor: colors.surfaceGreen },
  cream: { backgroundColor: colors.highlight },
  text: { fontFamily: fontFamilies.bold },
  greenText: { color: colors.primary },
  creamText: { color: colors.ink },
});
