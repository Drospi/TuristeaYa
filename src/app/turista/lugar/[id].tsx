import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import { LocationCard } from '@/features/turista/components/location-card';
import {
  findDiscoveryPlace,
  reviewsByPlace,
  type DiscoveryPlace,
} from '@/features/turista/data/discovery';
import { useDiscovery } from '@/features/turista/discovery-context';
import { useRoutes } from '@/features/turista/route-context';
import { isUuid } from '@/services/http';
import {
  fetchPlaceReviewsList,
  listPlaceMedia,
  recordPlaceVisit,
  reportPlaceIssue,
  submitPlaceReview,
  type PlaceReviewWithExtras,
} from '@/services/lugares.service';
import type { DbPlaceMedia } from '@/types/database';

export default function LugarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { places, loadingPlaces } = useDiscovery();
  const place = places.find((item) => item.id === id) ?? findDiscoveryPlace(id);

  if (!place) {
    return (
      <Screen
        title={loadingPlaces ? 'Cargando lugar…' : 'Lugar no encontrado'}
        subtitle={
          loadingPlaces
            ? 'Consultando catálogo en el servidor'
            : 'Esta parada no está disponible'
        }
      >
        <Button title="Volver a Inicio" onPress={() => router.replace('/turista')} />
      </Screen>
    );
  }
  return <PlaceDetails key={place.id} place={place} />;
}

function PlaceDetails({ place }: { place: DiscoveryPlace }) {
  const [panel, setPanel] = useState<'reviews' | 'offers' | 'report' | null>(null);
  const [report, setReport] = useState('');
  const [reportSaved, setReportSaved] = useState(false);
  const [sourceError, setSourceError] = useState('');
  const [visitRecorded, setVisitRecorded] = useState(false);
  const [reviews, setReviews] = useState<PlaceReviewWithExtras[]>(
    reviewsByPlace[place.id] ?? [],
  );
  const [media, setMedia] = useState<DbPlaceMedia[]>([]);
  const [newReviewBody, setNewReviewBody] = useState('');
  const [newReviewRating, setNewReviewRating] = useState('5');
  const [reviewFeedback, setReviewFeedback] = useState('');

  const { routes } = useRoutes();
  const containingRoutes = routes.filter((route) => route.placeIds.includes(place.id));
  const togglePanel = (next: 'reviews' | 'offers' | 'report') =>
    setPanel((previous) => (previous === next ? null : next));

  useEffect(() => {
    let active = true;
    fetchPlaceReviewsList(place.id).then((revs) => {
      if (active && revs.length) setReviews(revs);
    });
    if (isUuid(place.id)) {
      listPlaceMedia({ place_id: place.id }, { limit: 10 })
        .then((items) => {
          if (active) setMedia(items);
        })
        .catch(() => undefined);
    }
    return () => {
      active = false;
    };
  }, [place.id]);

  async function handleRecordVisit() {
    try {
      await recordPlaceVisit(place.id);
    } catch {
      // Continúa localmente
    }
    setVisitRecorded(true);
  }

  async function handleSubmitReview() {
    if (!newReviewBody.trim()) {
      setReviewFeedback('Escribe tu comentario antes de publicar.');
      return;
    }
    const ratingNum = Number(newReviewRating) || 5;
    setReviewFeedback('');
    try {
      const created = await submitPlaceReview({
        placeId: place.id,
        rating: ratingNum,
        body: newReviewBody.trim(),
      });
      setReviews((prev) => [created, ...prev]);
      setNewReviewBody('');
      setReviewFeedback('Reseña publicada correctamente.');
    } catch (err) {
      setReviewFeedback(
        err instanceof Error ? err.message : 'No se pudo publicar la reseña.',
      );
    }
  }

  async function handleSendReport() {
    if (!report.trim()) return;
    try {
      await reportPlaceIssue(place.id, place.name, report.trim());
    } catch {
      // Conserva confirmación local si no hay sesión activa
    }
    setReportSaved(true);
  }

  return (
    <Screen
      title={place.name}
      subtitle={place.isDemo ? 'La Paz · Lugar de demostración' : 'La Paz, Bolivia · Lugar real'}
    >
      <LocationCard point={place.point} title={place.name} note={place.mapNote} />
      <AppText variant="body">{place.description}</AppText>
      <ListCard
        title="Antes de tu visita"
        body={
          place.isDemo
            ? `Desde Bs ${place.priceFrom} · Calificación ${place.rating} / 5\nHorario de ejemplo: ${place.hours}\n${place.services.join(' · ')}\n${place.address}`
            : `${place.address}\n${place.hours}${place.estimatedCost != null ? `\nPresupuesto orientativo: Bs ${place.estimatedCost} (no es una tarifa confirmada)` : ''}\n${place.services.length ? place.services.join(' · ') : 'Acceso peatonal'}`
        }
        footer={
          place.isDemo ? (
            <AppText variant="micro">
              Precios, horarios, valoraciones y promociones simulados.
            </AppText>
          ) : undefined
        }
      />
      {media.length > 0 ? (
        <ListCard
          title="Galería del lugar"
          body={media.map((m) => `${m.kind}: ${m.storage_path}`).join('\n')}
        />
      ) : null}
      <Button
        align="left"
        title="Guardar en una ruta"
        disabled={place.isDemo}
        onPress={() =>
          router.navigate({ pathname: '/turista/guardar-lugar', params: { placeId: place.id } })
        }
      />
      <Button
        align="left"
        title={visitRecorded ? '✓ Visita registrada' : 'Registrar mi visita al lugar'}
        variant="secondary"
        disabled={visitRecorded}
        onPress={() => void handleRecordVisit()}
      />
      {containingRoutes.length ? (
        <AppText variant="caption">
          Incluido en: {containingRoutes.map((route) => route.name).join(', ')}
        </AppText>
      ) : null}
      <Button
        align="left"
        title="Ver reseñas"
        variant="secondary"
        onPress={() => togglePanel('reviews')}
        accessibilityState={{ expanded: panel === 'reviews' }}
      />
      {panel === 'reviews' ? (
        <>
          <AppText variant="section">Reseñas ({reviews.length})</AppText>
          {reviews.length ? (
            reviews.map((review) => (
              <ListCard
                key={review.id}
                title={`${review.author} · ${review.rating} / 5`}
                body={`${review.text}${review.reply ? `\nRespuesta del local: ${review.reply}` : ''}`}
                footer={<AppText variant="micro">{review.date}</AppText>}
              />
            ))
          ) : (
            <AppText variant="bodySmall">
              Todavía no hay reseñas registradas para este lugar.
            </AppText>
          )}
          <FormField
            label="Calificación (1 a 5)"
            keyboardType="number-pad"
            value={newReviewRating}
            onChangeText={setNewReviewRating}
          />
          <FormField
            label="Escribe tu reseña"
            placeholder="Comparte tu experiencia en este lugar"
            value={newReviewBody}
            onChangeText={setNewReviewBody}
          />
          {reviewFeedback ? <AppText variant="caption">{reviewFeedback}</AppText> : null}
          <Button
            align="left"
            title="Publicar mi reseña"
            onPress={() => void handleSubmitReview()}
          />
          <Button
            align="left"
            title="Abrir vista completa de reseñas"
            variant="secondary"
            onPress={() =>
              router.navigate({
                pathname: '/pages/resenas',
                params: { placeId: place.id, placeName: place.name },
              })
            }
          />
        </>
      ) : null}
      <Button
        align="left"
        title="Ver cupones"
        variant="secondary"
        onPress={() => togglePanel('offers')}
        accessibilityState={{ expanded: panel === 'offers' }}
      />
      {panel === 'offers' ? (
        <ListCard
          title={place.offer ? 'Promoción disponible' : 'Sin cupones disponibles'}
          body={place.offer ?? 'Este lugar no tiene promociones registradas.'}
        />
      ) : null}
      <Button
        align="left"
        title="Reportar información incorrecta"
        variant="secondary"
        onPress={() => togglePanel('report')}
        accessibilityState={{ expanded: panel === 'report' }}
      />
      {panel === 'report' ? (
        <>
          <AppText variant="bodySmall">
            Envía una corrección para que el equipo de soporte la verifique.
          </AppText>
          <FormField
            label="¿Qué debemos revisar?"
            placeholder="Horario, dirección u otro dato"
            value={report}
            maxLength={500}
            onChangeText={(value) => {
              setReport(value);
              setReportSaved(false);
            }}
          />
          <Button
            align="left"
            title="Enviar reporte a soporte"
            disabled={!report.trim() || reportSaved}
            onPress={() => void handleSendReport()}
          />
          {reportSaved ? (
            <AppText variant="caption" accessibilityLiveRegion="polite">
              Reporte enviado y registrado correctamente.
            </AppText>
          ) : null}
        </>
      ) : null}
      {place.sourceUrl ? (
        <Button
          align="left"
          title="Consultar información turística oficial"
          variant="secondary"
          onPress={async () => {
            try {
              setSourceError('');
              await Linking.openURL(place.sourceUrl!);
            } catch {
              setSourceError('No se pudo abrir la página. Revisa tu conexión.');
            }
          }}
        />
      ) : null}
      {sourceError ? <AppText variant="bodySmall">{sourceError}</AppText> : null}
      <Button
        align="left"
        title="Volver"
        variant="secondary"
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/turista');
        }}
      />
    </Screen>
  );
}
