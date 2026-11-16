import { View } from 'react-native';

import { Stack } from 'expo-router';

import { AppTabBar } from '@/components/layout/app-tab-bar';
import { colors } from '@/theme';

export default function VipLayout() {
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
