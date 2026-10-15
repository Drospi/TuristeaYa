import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export type TabId = 'inicio' | 'rutas' | 'cupones' | 'perfil';

interface BottomNavProps {
  currentTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'rutas', label: 'Mis rutas' },
  { id: 'cupones', label: 'Cupones' },
  { id: 'perfil', label: 'Perfil' },
];

export function BottomNav({
  currentTab = 'inicio',
  onTabChange,
}: BottomNavProps) {
  const [selectedTab, setSelectedTab] = useState<TabId>(currentTab);

  const handleSelect = (tabId: TabId) => {
    setSelectedTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {TABS.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => handleSelect(tab.id)}
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
