import { useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { PlaceholderBox } from '@/components/ui/placeholder-box';

/** Pantalla 05 del prototipo: mi ubicación. */
export default function UbicacionScreen() {
  const [zone, setZone] = useState('Centro de La Paz');

  return (
    <Screen title="Mi ubicación" subtitle="Elige desde dónde quieres salir">
      <Button title="Usar mi ubicación actual" onPress={() => router.back()} />
      <AppText variant="body">
        {'La app solicitará permiso para consultar la\nubicación.'}
      </AppText>
      <FormField label="Buscar una zona" placeholder="Centro de La Paz" value={zone} onChangeText={setZone} />
      <PlaceholderBox label="Mapa de ubicación · ejemplo" height={165} />
      <Button title="Confirmar esta ubicación" onPress={() => router.back()} />
      <Button
        title="Sin permiso: elegir zona manualmente"
        variant="secondary"
        onPress={() => router.back()}
      />
    </Screen>
  );
}
