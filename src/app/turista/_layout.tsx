import { Stack } from 'expo-router';
import { View } from 'react-native';

import { AppTabBar } from '@/components/layout/app-tab-bar';
import { colors } from '@/theme';
import { DiscoveryProvider } from '@/features/turista/discovery-context';
import { RouteProvider } from '@/features/turista/route-context';
import { LocationProvider } from '@/features/turista/location-context';

/**
 * Área del turista: stack propio con la barra de pestañas
 * visible en todas las pantallas, igual que el prototipo.
 */
export default function TuristaLayout() {
  return (
    <LocationProvider>
    <DiscoveryProvider>
    <RouteProvider>
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <AppTabBar />
    </View>
    </RouteProvider>
    </DiscoveryProvider>
    </LocationProvider>
  );
}
