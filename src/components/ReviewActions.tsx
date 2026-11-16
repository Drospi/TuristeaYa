import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface ReviewActionsProps {
  onWriteReview?: () => void;
  onBackToPlace?: () => void;
}

export function ReviewActions({
  onWriteReview,
  onBackToPlace,
}: ReviewActionsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onWriteReview}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
      >
        <Text style={styles.primaryButtonText}>Escribir mi reseña</Text>
      </Pressable>

      <Pressable
        onPress={onBackToPlace}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
      >
        <Text style={styles.secondaryButtonText}>Volver al lugar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#24624D',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#24624D',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#24624D',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});

export default ReviewActions;
