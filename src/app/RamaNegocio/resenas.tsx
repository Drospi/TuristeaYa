import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import {
  Boton,
  Campo,
  Card,
  Foto,
  Pantalla,
  TABS_NEGOCIO,
} from '../../components/negocio/Ui';
import { C } from '../../constants/negocioTheme';

import { fetchBusinessDashboardData } from '@/services/catalogos.service';
import { createRecord, listRecords } from '@/services/http';
import type { DbBusiness, DbReview, DbReviewReply } from '@/types/database';

export default function Resenas() {
  const [business, setBusiness] = useState<DbBusiness | null>(null);
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [respuesta, setRespuesta] = useState('Gracias por visitarnos, Lucía.');
  const [publicada, setPublicada] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchBusinessDashboardData(),
      listRecords<DbReview>('reviews', { limit: 10 }).catch(() => [] as DbReview[]),
    ]).then(([bizData, revs]) => {
      if (!active) return;
      setBusiness(bizData.business);
      setReviews(revs);
    });
    return () => {
      active = false;
    };
  }, []);

  const publicar = async () => {
    if (!respuesta.trim()) {
      Alert.alert('Falta información', 'Escribe una respuesta.');
      return;
    }
    const text = respuesta.trim();
    setPublicada(text);
    if (business?.id && reviews[0]?.id) {
      await createRecord<DbReviewReply>('review-replies', {
        review_id: reviews[0].id,
        business_id: business.id,
        body: text,
      }).catch(() => undefined);
    }
  };

  const firstReview = reviews[0];
  const secondReview = reviews[1];

  return (
    <Pantalla
      titulo="Reseñas de mi negocio"
      subtitulo={`4.8 / 5 · ${reviews.length || 128} opiniones`}
      tabs={TABS_NEGOCIO}
      activa="Resumen"
    >
      <Card>
        <Text style={s.titulo}>
          {firstReview ? `Visitante · ${firstReview.rating} / 5` : 'Lucía · 5 / 5'}
        </Text>
        <Text style={s.detalle}>
          {firstReview ? firstReview.body : 'Buen café y atención amable.'}
        </Text>
        {publicada ? <Text style={s.respuesta}>Tu respuesta: {publicada}</Text> : null}
      </Card>

      <Foto texto="Foto adjunta por la visitante" />

      <Campo
        label="Responder como negocio"
        value={respuesta}
        onChangeText={setRespuesta}
      />
      <Boton texto="Publicar respuesta" onPress={() => void publicar()} />

      <Card>
        <Text style={s.titulo}>
          {secondReview ? `Visitante · ${secondReview.rating} / 5` : 'Carlos · 4 / 5'}
        </Text>
        <Text style={s.detalle}>
          {secondReview
            ? secondReview.body
            : 'El servicio estuvo bien, aunque esperamos un poco.'}
        </Text>
      </Card>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: 15, fontWeight: '700', color: C.texto },
  detalle: { fontSize: 13, color: C.gris },
  respuesta: { fontSize: 13, color: C.verde, marginTop: 6 },
});
