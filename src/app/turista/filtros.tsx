import { useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { SegmentedControl } from '@/components/ui/segmented-control';

const categoryOptions = ['Todas', 'Gastronomía', 'Cultura', 'Naturaleza'] as const;
const orderOptions = ['Menor distancia', 'Menor precio', 'Mejor calificación'] as const;
const availabilityOptions = ['Solo lugares abiertos'] as const;

type CategoryOption = (typeof categoryOptions)[number];
type OrderOption = (typeof orderOptions)[number];
type AvailabilityOption = (typeof availabilityOptions)[number];

/** Pantalla 08 del prototipo: filtros y orden de rutas. */
export default function FiltrosScreen() {
  const [category, setCategory] = useState<CategoryOption>('Cultura');
  const [order, setOrder] = useState<OrderOption>('Menor distancia');
  const [maxDistance, setMaxDistance] = useState('3 km');
  const [openOnly, setOpenOnly] = useState<AvailabilityOption>('Solo lugares abiertos');

  return (
    <Screen title="Filtros y orden" subtitle="Ajusta los resultados">
      <SegmentedControl label="Categoría" options={categoryOptions} value={category} onChange={setCategory} />
      <SegmentedControl label="Ordenar por" options={orderOptions} value={order} onChange={setOrder} />
      <FormField label="Distancia máxima" value={maxDistance} onChangeText={setMaxDistance} />
      <SegmentedControl
        label="Disponibilidad"
        options={availabilityOptions}
        value={openOnly}
        onChange={setOpenOnly}
      />
      <Button title="Aplicar filtros" onPress={() => router.back()} />
      <Button
        title="Quitar filtros"
        variant="secondary"
        onPress={() => {
          setCategory('Todas');
          setOrder('Menor distancia');
          setMaxDistance('3 km');
          setOpenOnly('Solo lugares abiertos');
          router.back();
        }}
      />
    </Screen>
  );
}
