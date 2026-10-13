import { useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { SegmentedControl } from '@/components/ui/segmented-control';

const categoryOptions = ['Gastronomía', 'Cultura', 'Naturaleza'] as const;
type CategoryOption = (typeof categoryOptions)[number];

/** Pantalla 06 del prototipo: personalizar y crear una ruta. */
export default function CrearRutaScreen() {
  const [budget, setBudget] = useState('100');
  const [time, setTime] = useState('3 horas');
  const [category, setCategory] = useState<CategoryOption>('Cultura');
  const [departure, setDeparture] = useState('Centro de La Paz');

  return (
    <Screen title="Crear una ruta" subtitle="Personaliza tu salida">
      <FormField
        label="Presupuesto por persona (Bs)"
        keyboardType="number-pad"
        value={budget}
        onChangeText={setBudget}
      />
      <FormField label="Tiempo disponible" value={time} onChangeText={setTime} />
      <SegmentedControl label="Categoría" options={categoryOptions} value={category} onChange={setCategory} />
      <FormField
        label="Punto de partida"
        value={departure}
        onChangeText={setDeparture}
      />
      <Button title="Buscar rutas" onPress={() => router.navigate('/turista/rutas-disponibles')} />
      <AppText variant="body">
        {'Los costos y tiempos incluyen las paradas y los\ntraslados estimados.'}
      </AppText>
    </Screen>
  );
}
