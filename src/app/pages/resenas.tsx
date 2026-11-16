import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { BottomNav } from '@/components/BottomNav';
import { ReviewActions } from '@/components/ReviewActions';
import { ReviewCard } from '@/components/ReviewCard';
import { FilterType, ReviewFilter } from '@/components/ReviewFilter';
import { ReviewHeader } from '@/components/ReviewHeader';
import { ReviewImagePlaceholder } from '@/components/ReviewImagePlaceholder';
import {
  fetchPlaceReviewsList,
  submitPlaceReview,
  type PlaceReviewWithExtras,
} from '@/services/lugares.service';

export default function ResenasScreen() {
  const { placeId = 'cafe-del-patio', placeName = 'Café del Patio' } =
    useLocalSearchParams<{ placeId?: string; placeName?: string }>();
  const [filter, setFilter] = useState<FilterType>('recientes');
  const [reviews, setReviews] = useState<PlaceReviewWithExtras[]>([]);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('5');
  const [feedback, setFeedback] = useState('');

  const loadReviews = useCallback(async () => {
    const data = await fetchPlaceReviewsList(placeId);
    setReviews(data);
  }, [placeId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const sortedReviews = useMemo(() => {
    if (filter === 'mejor_valoradas') {
      return [...reviews].sort((a, b) => b.rating - a.rating);
    }
    return reviews;
  }, [filter, reviews]);

  const avgRating = useMemo(() => {
    if (!reviews.length) return '4.8';
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  }, [reviews]);

  async function handlePublishReview() {
    if (!newComment.trim()) {
      setFeedback('Escribe tu comentario antes de publicar.');
      return;
    }
    const created = await submitPlaceReview({
      placeId,
      rating: Number(newRating) || 5,
      body: newComment.trim(),
    });
    setReviews((prev) => [created, ...prev]);
    setNewComment('');
    setShowWriteForm(false);
    setFeedback('Tu reseña fue registrada.');
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="dark" />

      <ReviewHeader
        title="Reseñas del lugar"
        subtitle={`${placeName} · ${avgRating} / 5 · ${reviews.length || 128} opiniones`}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ReviewFilter activeFilter={filter} onFilterChange={setFilter} />

        {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}

        {showWriteForm ? (
          <View style={styles.formBox}>
            <Text style={styles.formLabel}>Calificación (1 a 5)</Text>
            <TextInput
              style={styles.input}
              value={newRating}
              onChangeText={setNewRating}
              keyboardType="number-pad"
              maxLength={1}
            />
            <Text style={styles.formLabel}>Tu opinión</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Comparte tu experiencia..."
              multiline
            />
          </View>
        ) : null}

        {sortedReviews.map((item, idx) => (
          <React.Fragment key={item.id}>
            <ReviewCard
              author={item.author}
              rating={`${item.rating} / 5`}
              comment={
                item.reply
                  ? `${item.text}\nRespuesta del negocio: ${item.reply}`
                  : item.text
              }
              visitDate={`Visitó el local · ${item.date}`}
            />
            {(item.hasPhoto || idx === 0) ? (
              <ReviewImagePlaceholder
                label={
                  item.mediaPath
                    ? `Foto: ${item.mediaPath}`
                    : 'Foto de la reseña'
                }
              />
            ) : null}
          </React.Fragment>
        ))}

        <ReviewActions
          onWriteReview={() => {
            if (showWriteForm) {
              void handlePublishReview();
            } else {
              setShowWriteForm(true);
            }
          }}
          onBackToPlace={() => {
            if (router.canGoBack()) router.back();
            else router.navigate('/turista');
          }}
        />
      </ScrollView>

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
  feedbackText: {
    fontSize: 13,
    color: '#184D3B',
    marginBottom: 12,
  },
  formBox: {
    backgroundColor: '#F7FAF8',
    borderWidth: 1,
    borderColor: '#DFE8E3',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    gap: 8,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A2420',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCD8D1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1A2420',
  },
  multilineInput: {
    minHeight: 68,
    textAlignVertical: 'top',
  },
});
