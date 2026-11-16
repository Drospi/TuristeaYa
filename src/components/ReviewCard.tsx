import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ReviewCardProps {
  author: string;
  rating: string;
  comment: string;
  visitDate?: string;
}

export function ReviewCard({
  author,
  rating,
  comment,
  visitDate,
}: ReviewCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.header}>
        {author} · {rating}
      </Text>
      <Text style={styles.comment}>{comment}</Text>
      {visitDate ? <Text style={styles.date}>{visitDate}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE8E3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2420',
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    color: '#43504A',
    lineHeight: 20,
  },
  date: {
    fontSize: 14,
    color: '#606E67',
    marginTop: 2,
    lineHeight: 20,
  },
});

export default ReviewCard;
