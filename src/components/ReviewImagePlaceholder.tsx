import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ReviewImagePlaceholderProps {
  label?: string;
}

export function ReviewImagePlaceholder({
  label = 'Foto de la reseña',
}: ReviewImagePlaceholderProps) {
  return (
    <View style={styles.container}>
      {/* Subtle diagonal wireframe lines */}
      <View style={[styles.diagonalLine, styles.diagonalLine1]} />
      <View style={[styles.diagonalLine, styles.diagonalLine2]} />

      {/* Center label covering the line intersection */}
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 105,
    backgroundColor: '#F8EFE4',
    borderWidth: 1,
    borderColor: '#E7D8C8',
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagonalLine: {
    position: 'absolute',
    height: 1,
    width: '120%',
    backgroundColor: '#DFCFC0',
  },
  diagonalLine1: {
    transform: [{ rotate: '16deg' }],
  },
  diagonalLine2: {
    transform: [{ rotate: '-16deg' }],
  },
  labelContainer: {
    backgroundColor: '#F8EFE4',
    paddingHorizontal: 16,
    paddingVertical: 6,
    zIndex: 1,
  },
  labelText: {
    fontSize: 14,
    color: '#847668',
    fontWeight: '500',
  },
});

export default ReviewImagePlaceholder;
