import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { ScreenHeader, type ScreenHeaderProps } from './screen-header';

import { colors, spacing } from '@/theme';

type ScreenProps = Pick<ScreenHeaderProps, 'title' | 'subtitle' | 'showBack' | 'onBack'> & {
  children: ReactNode;
  /** Envuelve el contenido en un ScrollView. */
  scroll?: boolean;
  /** Padding horizontal de 20. */
  padded?: boolean;
  /** Bordes seguros extra: usar "bottom" en pantallas sin barra de pestañas. */
  extraEdges?: Edge[];
};

/**
 * Estructura base de pantalla: área segura + encabezado + contenido.
 * El encabezado queda fijo y el contenido se desplaza debajo.
 */
export function Screen({
  title,
  subtitle,
  showBack,
  onBack,
  children,
  scroll = true,
  padded = true,
  extraEdges = [],
}: ScreenProps) {
  const edges: Edge[] = ['top', ...extraEdges];
  return (
    <SafeAreaView edges={edges} style={styles.safe}>
      {title ? <ScreenHeader title={title} subtitle={subtitle} showBack={showBack} onBack={onBack} /> : null}
      {scroll ? (
        <ScrollView
          style={styles.fill}
          contentContainerStyle={[styles.content, padded && styles.padded]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, styles.content, padded && styles.padded]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
  content: {
    paddingTop: 15,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  padded: { paddingHorizontal: spacing.xl },
});
