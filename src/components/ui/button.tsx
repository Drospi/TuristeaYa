import { Pressable, StyleSheet, type AccessibilityProps } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, radius, sizes, spacing, borderWidth } from '@/theme';

type ButtonProps = AccessibilityProps & {
  title: string;
  onPress?: () => void;
  /** primary: fondo verde; secondary: blanco con borde verde; soft: verde claro. */
  variant?: 'primary' | 'secondary' | 'soft';
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
  const isSoft = variant === 'soft';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        size === 'md' ? styles.md : styles.sm,
        isPrimary ? styles.primary : isSoft ? styles.soft : styles.secondary,
        pressed && pressedStyle(variant),
        disabled && styles.disabled,
      ]}
      {...accessibility}
    >
      <AppText
        variant="button"
        color={isPrimary ? 'onPrimary' : isSoft ? 'ink' : 'primary'}
        style={styles.label}
        numberOfLines={1}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

function pressedStyle(variant: 'primary' | 'secondary' | 'soft') {
  if (variant === 'primary') return styles.primaryPressed;
  if (variant === 'soft') return styles.softPressed;
  return styles.secondaryPressed;
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
  soft: {
    backgroundColor: colors.surfaceGreen,
    borderColor: colors.borderSoftGreen,
  },
  primaryPressed: { backgroundColor: colors.primaryDeep },
  secondaryPressed: { backgroundColor: colors.surfaceGreen },
  softPressed: { backgroundColor: colors.surfaceGreenAlt },
  disabled: { opacity: 0.5 },
  label: { paddingHorizontal: spacing.md },
});
