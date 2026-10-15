import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

interface ReviewHeaderProps {
  title?: string;
  subtitle?: string;
  onBackPress?: () => void;
}

export function ReviewHeader({
  title = 'Reseñas del lugar',
  subtitle = 'Café del Patio · 4.8 / 5 · 128 opiniones',
  onBackPress,
}: ReviewHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          hitSlop={12}
          onPress={handleBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          {/* Vector chevron matching the screenshot */}
          <View style={styles.chevronContainer}>
            <View style={styles.chevronIcon} />
          </View>
        </Pressable>

        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronContainer: {
    width: 20,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronIcon: {
    width: 10,
    height: 10,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: '#184D3B',
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#184D3B',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#63736C',
    marginTop: 6,
    marginBottom: 16,
    paddingLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEFEA',
    width: '100%',
  },
  pressed: {
    opacity: 0.6,
  },
});

export default ReviewHeader;
