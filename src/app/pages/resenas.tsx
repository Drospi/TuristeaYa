import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ReviewHeader } from '@/components/ReviewHeader';
import { ReviewFilter, FilterType } from '@/components/ReviewFilter';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewImagePlaceholder } from '@/components/ReviewImagePlaceholder';
import { ReviewActions } from '@/components/ReviewActions';
import { BottomNav } from '@/components/BottomNav';

export default function ResenasScreen() {
  const [filter, setFilter] = useState<FilterType>('recientes');

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header with back button, title, and subtitle */}
      <ReviewHeader
        title="Reseñas del lugar"
        subtitle="Café del Patio · 4.8 / 5 · 128 opiniones"
      />

      {/* Main scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter buttons */}
        <ReviewFilter activeFilter={filter} onFilterChange={setFilter} />

        {/* First review card */}
        <ReviewCard
          author="Lucía"
          rating="5 / 5"
          comment="Buen café y atención amable."
          visitDate="Visitó el local el 18 de septiembre."
        />

        {/* Photo wireframe placeholder */}
        <ReviewImagePlaceholder label="Foto de la reseña" />

        {/* Second review card */}
        <ReviewCard
          author="Carlos"
          rating="4 / 5"
          comment="El lugar estaba lleno, pero valió la pena."
        />

        {/* Action buttons */}
        <ReviewActions
          onWriteReview={() => console.log('Escribir reseña')}
          onBackToPlace={() => console.log('Volver al lugar')}
        />
      </ScrollView>

      {/* Bottom navigation bar */}
      <BottomNav currentTab="inicio" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
});
