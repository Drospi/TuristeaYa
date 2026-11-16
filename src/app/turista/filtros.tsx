import { useEffect, useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { CategoryPicker } from '@/features/turista/components/category-picker';
import { useRoutes } from '@/features/turista/route-context';
import { fetchCategoriesCatalog } from '@/services/catalogos.service';
import type { DbCategory } from '@/types/database';

const labels = ['Menor tiempo', 'Menor precio', 'Menor distancia'] as const;
const orders = ['time', 'cost', 'distance'] as const;

export default function FiltrosScreen() {
  const { criteria, setCriteria } = useRoutes();
  const [categories, setCategories] = useState(criteria.categories);
  const [order, setOrder] = useState<(typeof labels)[number]>(
    labels[orders.indexOf(criteria.order)],
  );
  const [distance, setDistance] = useState(
    criteria.maxDistance == null ? '' : String(criteria.maxDistance),
  );
  const [backendCategories, setBackendCategories] = useState<DbCategory[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchCategoriesCatalog().then((cats) => {
      if (active) setBackendCategories(cats);
    });
    return () => {
      active = false;
    };
  }, []);

  function apply() {
    const maximum = distance.trim() ? Number(distance.replace(',', '.')) : null;
    if (!categories.length) return setError('Elige al menos una categoría.');
    if (maximum != null && (!Number.isFinite(maximum) || maximum <= 0))
      return setError('La distancia debe ser positiva o quedar vacía.');
    setCriteria({
      ...criteria,
      categories,
      order: orders[labels.indexOf(order)],
      maxDistance: maximum,
    });
    router.back();
  }

  return (
    <Screen title="Filtros y orden" subtitle="Ajusta los resultados">
      <CategoryPicker value={categories} onChange={setCategories} />
      {backendCategories.length > 0 ? (
        <AppText variant="caption">
          Catálogo activo en servidor: {backendCategories.map((c) => c.name).join(' · ')}
        </AppText>
      ) : null}
      <SegmentedControl label="Ordenar por" options={labels} value={order} onChange={setOrder} />
      <FormField
        label="Distancia máxima (km; vacío = sin límite)"
        value={distance}
        onChangeText={setDistance}
        keyboardType="decimal-pad"
      />
      {error ? <AppText variant="caption">{error}</AppText> : null}
      <Button title="Aplicar filtros" onPress={apply} />
      <Button
        title="Quitar límite de distancia"
        variant="secondary"
        onPress={() => {
          setDistance('');
          setError('');
        }}
      />
    </Screen>
  );
}
