import { Pressable, StyleSheet, type AccessibilityProps } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, radius, sizes, spacing, borderWidth } from '@/theme';

type ButtonProps = AccessibilityProps & {
  title: string;
  onPress?: () => void;
  /** primary: fondo verde; secondary: fondo blanco con borde verde. */
  variant?: 'primary' | 'secondary';
  /** md: alto 46; sm: alto 31. */
  size?: 'md' | 'sm';
  disabled?: boolean;
};

/** Botón medido en Figma: alto 46, radio 8, texto 14/20 bold. */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  ...accessibility
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        size === 'md' ? styles.md : styles.sm,
        isPrimary ? styles.primary : styles.secondary,
        pressed && (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
        disabled && styles.disabled,
      ]}
      {...accessibility}
    >
      <AppText
        variant="button"
        color={isPrimary ? 'onPrimary' : 'primary'}
        style={styles.label}
        numberOfLines={1}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: borderWidth.hairline,
  },
  md: { height: sizes.buttonHeight },
  sm: { height: sizes.buttonHeightSm },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },
  primaryPressed: { backgroundColor: colors.primaryDeep },
  secondaryPressed: { backgroundColor: colors.surfaceGreen },
  disabled: { opacity: 0.5 },
  label: { paddingHorizontal: spacing.md },
});
