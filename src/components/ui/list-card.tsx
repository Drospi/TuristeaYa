import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { colors, radius, spacing, borderWidth } from '@/theme';

type ListCardProps = ViewProps & {
  title: string;
  body?: string;
  onPress?: () => void;
  /** Contenido extra bajo el cuerpo (acciones, insignias). */
  footer?: ReactNode;
};

/**
 * Tarjeta uniforme del prototipo: título 15/21, cuerpo 13/18,
 * fondo blanco, radio 8, borde 1px y padding 12.
 */
export function ListCard({ title, body, onPress, footer, style, ...rest }: ListCardProps) {
  const content = (
    <>
      <AppText variant="section" numberOfLines={1}>
        {title}
      </AppText>
      {body ? (
        <AppText variant="bodySmall" style={styles.body}>
          {body}
        </AppText>
      ) : null}
      {footer}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
        {...rest}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, style]} {...rest}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: borderWidth.hairline,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: 6,
  },
  body: { alignSelf: 'stretch' },
  pressed: { opacity: 0.7 },
});
