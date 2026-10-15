import { useState } from 'react';
import { router } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { CategoryPicker } from '@/features/turista/components/category-picker';
import { useRoutes } from '@/features/turista/route-context';
import { useSelectedLocation } from '@/features/turista/location-context';
import { zonePoints } from '@/features/turista/data/discovery';

export default function CrearRutaScreen() {
  const { criteria, setCriteria } = useRoutes();
  const { location } = useSelectedLocation();
  const [budget, setBudget] = useState(String(criteria.budget));
  const [minutes, setMinutes] = useState(String(criteria.minutes));
  const [categories, setCategories] = useState(criteria.categories);
  const [error, setError] = useState('');
  function search() {
    const maxBudget = Number(budget.replace(',', '.'));
    const maxMinutes = Number(minutes.replace(',', '.'));
    const origin = location.latitude != null && location.longitude != null ? { latitude: location.latitude, longitude: location.longitude } : zonePoints[location.label];
    if (!categories.length) return setError('Selecciona al menos una categoría.');
    if (!budget.trim() || !Number.isFinite(maxBudget) || maxBudget < 0) return setError('Escribe un presupuesto válido, desde Bs 0.');
    if (!minutes.trim() || !Number.isFinite(maxMinutes) || maxMinutes <= 0) return setError('Escribe un tiempo disponible mayor que cero.');
    if (!origin) return setError('Selecciona una zona conocida o usa GPS para calcular el punto de partida.');
    setCriteria({ categories, budget: maxBudget, minutes: maxMinutes, origin, departure: location.label, order: 'time', maxDistance: null });
    router.navigate('/turista/rutas-disponibles');
  }
  return <Screen title="Crear una ruta" subtitle="Combina tus intereses en La Paz">
    <FormField label="Presupuesto por persona (Bs)" keyboardType="decimal-pad" value={budget} onChangeText={setBudget} />
    <FormField label="Tiempo disponible (minutos)" keyboardType="number-pad" value={minutes} onChangeText={setMinutes} />
    <AppText variant="caption">Ejemplo: 120 minutos = 2 horas.</AppText>
    <CategoryPicker value={categories} onChange={setCategories} />
    <AppText variant="label">Punto de partida: {location.label}</AppText>
    <Button title="Cambiar punto de partida" variant="secondary" onPress={() => router.navigate('/turista/ubicacion')} />
    {error ? <AppText variant="bodySmall" accessibilityLiveRegion="polite">{error}</AppText> : null}
    <Button title="Buscar rutas" onPress={search} />
    <AppText variant="caption">Lugares reales. Costos y tiempos estimados para planificar; verifica tarifas y horarios antes de salir. Naturaleza incluye parques y miradores urbanos.</AppText>
  </Screen>;
}
