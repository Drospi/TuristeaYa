import { Stack } from 'expo-router';
import { View } from 'react-native';

import { AppTabBar } from '@/components/layout/app-tab-bar';
import { colors } from '@/theme';

/**
 * Área del turista: stack propio con la barra de pestañas
 * visible en todas las pantallas, igual que el prototipo.
 */
export default function TuristaLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <AppTabBar />
    </View>
  );
}
