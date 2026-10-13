import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, fontFamilies, radius, spacing, borderWidth } from '@/theme';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress?: () => void;
};

/** Chip de filtro de Figma: alto 32, radio 3, borde #c7dace, activo bold. */
export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.selected : styles.unselected]}
    >
      <AppText
        variant="caption"
        style={selected ? styles.textSelected : undefined}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 32,
    borderRadius: radius.sm,
    borderWidth: borderWidth.hairline,
    borderColor: colors.borderGreen,
    paddingHorizontal: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.surfaceGreenAlt },
  unselected: { backgroundColor: colors.surface },
  textSelected: { color: colors.ink, fontFamily: fontFamilies.bold },
});
