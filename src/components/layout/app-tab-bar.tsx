import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { colors, radius, sizes, spacing, borderWidth } from '@/theme';

export type TabItem = {
  label: string;
  href: string;
};

/**
 * Barras de pestañas por rol, tal como aparecen en Figma.
 * Cada rol tiene su propia barra de 4 pestañas.
 */
export const tabsByArea: Record<string, readonly TabItem[]> = {
  turista: [
    { label: 'Inicio', href: '/turista' },
    { label: 'Mis rutas', href: '/turista/mis-rutas' },
    { label: 'Cupones', href: '/turista/cupones' },
    { label: 'Perfil', href: '/turista/perfil' },
  ],
  vip: [
    { label: 'VIP', href: '/vip' },
    { label: 'Descargas', href: '/vip/descargas' },
    { label: 'Beneficios', href: '/vip/beneficios' },
    { label: 'Perfil', href: '/vip/perfil' },
  ],
  negocio: [
    { label: 'Resumen', href: '/negocio' },
    { label: 'Cupones', href: '/negocio/promociones' },
    { label: 'Campañas', href: '/negocio/campanas' },
    { label: 'Mi local', href: '/negocio/mi-local' },
  ],
  soporte: [
    { label: 'Tickets', href: '/soporte' },
    { label: 'Caso', href: '/soporte/caso' },
    { label: 'Historial', href: '/soporte/historial' },
    { label: 'Recorridos', href: '/soporte/recorridos' },
  ],
  admin: [
    { label: 'Resumen', href: '/admin' },
    { label: 'Usuarios', href: '/admin/usuarios' },
    { label: 'Comercios', href: '/admin/comercios' },
    { label: 'Seguridad', href: '/admin/seguridad' },
  ],
};

/** Barra de pestañas de Figma: fondo blanco, borde superior, píldora verde en la activa. */
export function AppTabBar() {
  const pathname = usePathname();
  const area = pathname.split('/')[1] ?? '';
  const tabs = tabsByArea[area];
  if (!tabs) return null;

  const isActive = (href: string) => href === `/${area}`
    ? pathname === href || !tabs.some((tab) => tab.href !== href && (pathname === tab.href || pathname.startsWith(`${tab.href}/`)))
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <SafeAreaView edges={['bottom']} style={styles.bar}>
      <View style={styles.row}>
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Pressable
              key={tab.href}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }}
              onPress={() => handleTabPress(tab.href)}
              style={styles.tab}
            >
              <View style={[styles.pill, active && styles.pillActive]}>
                <AppText variant="caption" numberOfLines={1}>
                  {tab.label}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/**
 * Cambio de pestaña: descarta las pantallas apiladas del área
 * y navega a la raíz de la pestaña elegida.
 */
function handleTabPress(href: string) {
  if (router.canDismiss()) router.dismissAll();
  router.navigate(href);
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    height: sizes.tabBarHeight,
    paddingTop: 9,
    paddingBottom: 9,
  },
  tab: { flex: 1, paddingHorizontal: 5 },
  pill: {
    height: sizes.tabPillHeight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  pillActive: { backgroundColor: colors.surfaceGreen },
});
