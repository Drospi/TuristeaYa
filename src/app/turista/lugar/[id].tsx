import { useState } from 'react';
import { Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import { LocationCard } from '@/features/turista/components/location-card';
import { findDiscoveryPlace, reviewsByPlace, type DiscoveryPlace } from '@/features/turista/data/discovery';
import { useRoutes } from '@/features/turista/route-context';

export default function LugarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = findDiscoveryPlace(id);
  if (!place) return <Screen title="Lugar no encontrado" subtitle="Esta parada no está disponible">
    <Button title="Volver a Inicio" onPress={() => router.replace('/turista')} />
  </Screen>;
  return <PlaceDetails key={place.id} place={place} />;
}

function PlaceDetails({ place }: { place: DiscoveryPlace }) {
  const [panel, setPanel] = useState<'reviews' | 'offers' | 'report' | null>(null);
  const [report, setReport] = useState('');
  const [reportSaved, setReportSaved] = useState(false);
  const [sourceError, setSourceError] = useState('');
  const { routes } = useRoutes();
  const containingRoutes = routes.filter((route) => route.placeIds.includes(place.id));
  const reviews = reviewsByPlace[place.id] ?? [];
  const togglePanel = (next: 'reviews' | 'offers' | 'report') => setPanel((previous) => previous === next ? null : next);

  return (
    <Screen title={place.name} subtitle={place.isDemo ? 'La Paz · Lugar de demostración' : 'La Paz, Bolivia · Lugar real'}>
      <LocationCard point={place.point} title={place.name} note={place.mapNote} />
      <AppText variant="body">{place.description}</AppText>
      <ListCard title="Antes de tu visita" body={place.isDemo
        ? `Desde Bs ${place.priceFrom} · Calificación ${place.rating} / 5\nHorario de ejemplo: ${place.hours}\n${place.services.join(' · ')}\n${place.address}`
        : `${place.address}\n${place.hours}${place.estimatedCost != null ? `\nPresupuesto orientativo: Bs ${place.estimatedCost} (no es una tarifa confirmada)` : ''}\n${place.services.join(' · ')}`}
        footer={place.isDemo ? <AppText variant="micro">Precios, horarios, valoraciones y promociones simulados.</AppText> : undefined} />
      <Button align="left" title="Guardar en una ruta" disabled={place.isDemo} onPress={() => router.navigate({ pathname: '/turista/guardar-lugar', params: { placeId: place.id } })} />
      {containingRoutes.length ? <AppText variant="caption">Incluido en: {containingRoutes.map((route) => route.name).join(', ')}</AppText> : null}
      <Button align="left" title="Ver reseñas" variant="secondary" onPress={() => togglePanel('reviews')} accessibilityState={{ expanded: panel === 'reviews' }} />
      {panel === 'reviews' ? <>
        <AppText variant="section">Reseñas</AppText>
        {reviews.length ? reviews.map((review) => <ListCard key={review.id} title={`${review.author} · ${review.rating} / 5`} body={review.text} footer={<AppText variant="micro">Reseña de demostración</AppText>} />) : <AppText variant="bodySmall">Todavía no hay reseñas registradas para este lugar.</AppText>}
      </> : null}
      <Button align="left" title="Ver cupones" variant="secondary" onPress={() => togglePanel('offers')} accessibilityState={{ expanded: panel === 'offers' }} />
      {panel === 'offers' ? <ListCard title={place.offer ? 'Oferta de ejemplo' : 'Sin cupones disponibles'} body={place.offer ?? 'Este lugar no tiene promociones registradas.'} /> : null}
      <Button align="left" title="Reportar información incorrecta" variant="secondary" onPress={() => togglePanel('report')} accessibilityState={{ expanded: panel === 'report' }} />
      {panel === 'report' ? <>
        <AppText variant="bodySmall">Anota una corrección para la demostración. No se enviará a un servidor.</AppText>
        <FormField label="¿Qué debemos revisar?" placeholder="Horario, dirección u otro dato" value={report} maxLength={500} onChangeText={(value) => { setReport(value); setReportSaved(false); }} />
        <Button align="left" title="Registrar nota de ejemplo" disabled={!report.trim() || reportSaved} onPress={() => setReportSaved(true)} />
        {reportSaved ? <AppText variant="caption" accessibilityLiveRegion="polite">Nota registrada en esta pantalla. Pendiente de conectar con soporte.</AppText> : null}
      </> : null}
      {place.sourceUrl ? <Button align="left" title="Consultar información turística oficial" variant="secondary" onPress={async () => {
        try { setSourceError(''); await Linking.openURL(place.sourceUrl!); }
        catch { setSourceError('No se pudo abrir la página. Revisa tu conexión.'); }
      }} /> : null}
      {sourceError ? <AppText variant="bodySmall">{sourceError}</AppText> : null}
      <Button align="left" title="Volver" variant="secondary" onPress={() => { if (router.canGoBack()) router.back(); else router.replace('/turista'); }} />
    </Screen>
  );
}
