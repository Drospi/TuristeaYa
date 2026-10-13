import { Pressable, StyleSheet, View } from 'react-native';

import { router } from 'expo-router';

import { AppText } from '@/components/ui/app-text';
import { Divider } from '@/components/ui/divider';
import { colors, spacing } from '@/theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  /** Muestra el botón de retroceso "‹". */
  showBack?: boolean;
  /** Acción personalizada de retroceso. */
  onBack?: () => void;
};

/** Encabezado de pantalla de Figma: "‹" + título 22/31 verde + subtítulo + divisor. */
export function ScreenHeader({ title, subtitle, showBack = true, onBack }: ScreenHeaderProps) {
  const goBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) router.back();
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={goBack}
            style={styles.back}
          >
            <AppText variant="back">‹</AppText>
          </Pressable>
        ) : null}
        <AppText variant="title" style={styles.title} numberOfLines={1}>
          {title}
        </AppText>
      </View>
      {subtitle ? (
        <AppText variant="subtitle" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
      <Divider style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginLeft: spacing.md },
  subtitle: { marginTop: 6 },
  divider: { marginTop: 15 },
});
