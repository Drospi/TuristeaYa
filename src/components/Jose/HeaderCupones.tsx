import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onBack?: () => void;
}

export const HeaderCupones: React.FC<Props> = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={10}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Text style={styles.chevron}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mis cupones</Text>
      </View>
      <Text style={styles.subtitle}>Descuentos para tu salida</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f3',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 2,
  },
  chevron: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '700',
    color: '#164e3f',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#164e3f',
  },
  subtitle: {
    fontSize: 14,
    color: '#70807b',
    marginTop: 6,
    marginLeft: 32,
  },
});
