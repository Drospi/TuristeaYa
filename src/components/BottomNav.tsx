import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

export type TabId = 'inicio' | 'rutas' | 'cupones' | 'perfil';

interface BottomNavProps {
  currentTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; href: string }[] = [
  { id: 'inicio', label: 'Inicio', href: '/turista' },
  { id: 'rutas', label: 'Mis rutas', href: '/turista/mis-rutas' },
  { id: 'cupones', label: 'Cupones', href: '/turista/cupones' },
  { id: 'perfil', label: 'Perfil', href: '/turista/perfil' },
];

export function BottomNav({
  currentTab = 'inicio',
  onTabChange,
}: BottomNavProps) {
  const [selectedTab, setSelectedTab] = useState<TabId>(currentTab);

  const handleSelect = (tab: { id: TabId; href: string }) => {
    setSelectedTab(tab.id);
    onTabChange?.(tab.id);
    router.navigate(tab.href);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => handleSelect(tab)}
              style={styles.tabItem}
            >
              <View style={[styles.pill, isActive && styles.activePill]}>
                <Text
                  style={[
                    styles.tabText,
                    isActive ? styles.activeTabText : styles.inactiveTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Android/iOS home indicator bar */}
      <View style={styles.indicatorContainer}>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF2EE',
    paddingTop: 10,
    paddingBottom: 4,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    backgroundColor: '#E2ECE5',
  },
  tabText: {
    fontSize: 13,
  },
  activeTabText: {
    color: '#1B4D3E',
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#4B5851',
    fontWeight: '500',
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  homeIndicator: {
    width: 134,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#35775F',
  },
});

export default BottomNav;
