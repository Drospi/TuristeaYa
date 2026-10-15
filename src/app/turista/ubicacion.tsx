import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { useSelectedLocation, type SelectedLocation } from '@/features/turista/location-context';
import { colors, radius } from '@/theme';
import { LocationCard } from '@/features/turista/components/location-card';
import { zonePoints } from '@/features/turista/data/discovery';

const zones = ['Centro de La Paz', 'Sopocachi', 'Miraflores', 'San Pedro', 'Obrajes', 'Calacoto', 'San Miguel'];
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Pantalla 05: selección manual y ubicación del dispositivo. */
export default function UbicacionScreen() {
  const { location, setLocation } = useSelectedLocation();
  const [zone, setZone] = useState(location.label);
  const [coordinates, setCoordinates] = useState<SelectedLocation | null>(location.latitude != null ? location : null);
  const [manual, setManual] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const requestId = useRef(0);
  useEffect(() => () => { requestId.current += 1; }, []);

  const suggestions = zones.filter((item) => normalize(item).includes(normalize(zone.trim())));
  const mapPoint = coordinates?.latitude != null && coordinates?.longitude != null
    ? { latitude: coordinates.latitude, longitude: coordinates.longitude }
    : zonePoints[zone.trim()];

  function editZone(value: string) {
    requestId.current += 1;
    setBusy(false);
    setZone(value);
    setCoordinates(null);
    setMessage('');
    setManual(true);
  }

  async function useCurrentLocation() {
    const id = ++requestId.current;
    setBusy(true);
    setMessage('');
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const result = await Promise.race([
        (async (): Promise<SelectedLocation> => {
          const permission = await Location.requestForegroundPermissionsAsync();
          if (!permission.granted) throw new Error('No se concedió permiso. Puedes elegir una zona manualmente.');
          const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const { latitude, longitude } = position.coords;
          let label = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          if (Platform.OS !== 'web') {
            try {
              const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
              const name = [address?.district || address?.street, address?.city].filter(Boolean).join(' · ');
              if (name) label = name;
            } catch {
              // Las coordenadas siguen siendo válidas aunque no haya dirección.
            }
          }
          return { label, latitude, longitude };
        })(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('La ubicación tardó demasiado. Reintenta o elige una zona manualmente.')), 20000);
        }),
      ]);
      if (id !== requestId.current) return;
      setCoordinates(result);
      setZone(result.label);
      setManual(false);
      setMessage('Ubicación encontrada. Pulsa «Confirmar esta ubicación» para usarla.');
    } catch (error) {
      if (id !== requestId.current) return;
      setMessage(error instanceof Error ? error.message : 'No se pudo obtener tu ubicación. Elige una zona manualmente.');
      setManual(true);
    } finally {
      if (timer) clearTimeout(timer);
      if (id === requestId.current) setBusy(false);
    }
  }

  function confirm() {
    const label = zone.trim();
    if (!label || busy) return;
    setLocation(coordinates ? { ...coordinates, label } : { label });
    if (router.canGoBack()) router.back();
    else router.replace('/turista');
  }

  return (
    <Screen title="Mi ubicación" subtitle="Elige desde dónde quieres salir">
      <Button align="left" title={busy ? 'Buscando ubicación…' : 'Usar mi ubicación actual'} disabled={busy} onPress={useCurrentLocation} />
      <AppText variant="body">La app solicitará permiso para consultar la ubicación.</AppText>
      <FormField label="Buscar una zona" placeholder="Centro de La Paz" value={zone} onChangeText={editZone} maxLength={100} returnKeyType="done" onSubmitEditing={confirm} />
      {manual && suggestions.length > 0 ? (
        <View style={styles.suggestions}>
          {suggestions.map((item) => (
            <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Elegir ${item}`} onPress={() => { setZone(item); setCoordinates(null); setManual(false); setMessage(''); }} style={({ pressed }) => [styles.option, pressed && { backgroundColor: colors.surfaceGreen }]}>
              <AppText variant="bodySmall">{item}</AppText>
            </Pressable>
          ))}
        </View>
      ) : null}
      {mapPoint ? <LocationCard point={mapPoint} title={zone} note={coordinates ? 'Ubicación obtenida del dispositivo. Confírmala para usarla.' : 'Referencia aproximada de la zona seleccionada.'} /> : <AppText variant="bodySmall">Elige una zona de la lista o usa tu ubicación actual para ver el mapa. También puedes confirmar el nombre escrito sin coordenadas.</AppText>}
      {message ? <AppText variant="bodySmall" accessibilityLiveRegion="polite">{message}</AppText> : null}
      <Button align="left" title="Confirmar esta ubicación" disabled={!zone.trim() || busy} onPress={confirm} />
      <Button align="left" title="Sin permiso: elegir zona manualmente" variant="secondary" onPress={() => editZone('')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  suggestions: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  option: { padding: 12 },
});
