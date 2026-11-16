import React from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  tabActiva: string;
  onSelectTab: (tab: string) => void;
}

const TAB_ROUTES: Record<string, '/turista' | '/turista/mis-rutas' | '/turista/cupones' | '/turista/perfil'> = {
  Inicio: '/turista',
  'Mis rutas': '/turista/mis-rutas',
  Cupones: '/turista/cupones',
  Perfil: '/turista/perfil',
};

export const BottomTabBar: React.FC<Props> = ({ tabActiva, onSelectTab }) => {
  const tabs = ['Inicio', 'Mis rutas', 'Cupones', 'Perfil'];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => {
        const isActive = tabActiva === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              onSelectTab(tab);
              const target = TAB_ROUTES[tab];
              if (target) {
                router.navigate(target);
              }
            }}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#eef2f0',
    backgroundColor: '#ffffff',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#dceee3',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#52665e',
  },
  tabTextActive: {
    fontWeight: '700',
    color: '#164e3f',
  },
});
