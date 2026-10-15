import { useState } from 'react';
import { Linking } from 'react-native';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { PlaceMap } from './place-map';
import type { MapPoint } from '../data/discovery';

export function LocationCard({ point, title, note }: { point: MapPoint; title: string; note: string }) {
  const [error, setError] = useState('');
  async function openMap() {
    try {
      setError('');
      await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${point.latitude},${point.longitude}`)}`);
    } catch {
      setError('No se pudo abrir el mapa. Revisa la conexión e inténtalo de nuevo.');
    }
  }
  return <>
    <PlaceMap point={point} title={title} />
    <AppText variant="caption">{note}</AppText>
    <Button align="left" title="Abrir punto en Google Maps" variant="secondary" onPress={openMap} />
    {error ? <AppText variant="bodySmall" accessibilityLiveRegion="polite">{error}</AppText> : null}
  </>;
}
