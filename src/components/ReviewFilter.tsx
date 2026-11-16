import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export type FilterType = 'recientes' | 'mejor_valoradas';

interface ReviewFilterProps {
  activeFilter?: FilterType;
  onFilterChange?: (filter: FilterType) => void;
}

export function ReviewFilter({
  activeFilter = 'recientes',
  onFilterChange,
}: ReviewFilterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ver opiniones</Text>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={() => onFilterChange?.('recientes')}
          style={[
            styles.filterButton,
            activeFilter === 'recientes' ? styles.activeButton : styles.inactiveButton,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'recientes' ? styles.activeText : styles.inactiveText,
            ]}
          >
            Recientes
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onFilterChange?.('mejor_valoradas')}
          style={[
            styles.filterButton,
            activeFilter === 'mejor_valoradas' ? styles.activeButton : styles.inactiveButton,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'mejor_valoradas' ? styles.activeText : styles.inactiveText,
            ]}
          >
            Mejor valoradas
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C2621',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#DCEDE3',
    borderColor: '#C0DCD0',
  },
  inactiveButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCD8D1',
  },
  filterText: {
    fontSize: 14,
  },
  activeText: {
    fontWeight: '700',
    color: '#1A3E31',
  },
  inactiveText: {
    fontWeight: '500',
    color: '#4B5550',
  },
});

export default ReviewFilter;
