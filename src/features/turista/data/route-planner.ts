import type { PlaceCategory } from '@/types';
import { realPlaces } from './real-places';
import type { MapPoint } from './discovery';

export const categoryLabels: Record<PlaceCategory, string> = { gastronomia: 'Gastronomía', cultura: 'Cultura', naturaleza: 'Naturaleza' };
export const allCategories = Object.keys(categoryLabels) as PlaceCategory[];
export type PlannedRoute = {
  id: string; name: string; placeIds: string[]; categories: PlaceCategory[];
  cost: number; durationMin: number; distanceKm: number; visited: boolean;
  departure: string; origin: MapPoint; sourceId?: string;
};
export type RouteCriteria = { categories: PlaceCategory[]; budget: number; minutes: number; departure: string; origin: MapPoint; order: 'time' | 'cost' | 'distance'; maxDistance: number | null };
export const defaultCriteria: RouteCriteria = { categories: ['cultura'], budget: 150, minutes: 240, departure: 'Centro de La Paz', origin: { latitude: -16.4955, longitude: -68.1336 }, order: 'time', maxDistance: null };
export function distanceKm(a: MapPoint, b: MapPoint) {
  const r = Math.PI / 180;
  const h = Math.sin((b.latitude - a.latitude) * r / 2) ** 2 + Math.cos(a.latitude * r) * Math.cos(b.latitude * r) * Math.sin((b.longitude - a.longitude) * r / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}
export function calculateRoute(route: Pick<PlannedRoute, 'id' | 'name' | 'placeIds' | 'departure' | 'origin'> & Partial<PlannedRoute>): PlannedRoute {
  const ids = [...new Set(route.placeIds)];
  const stops = ids.map((id) => realPlaces.find((p) => p.id === id));
  if (!ids.length || stops.some((p) => !p)) throw new Error('La ruta necesita al menos un lugar real del catálogo.');
  let previous = route.origin;
  let distance = 0;
  for (const stop of stops) { distance += distanceKm(previous, stop!.point) * 1.4; previous = stop!.point; }
  return { ...route, placeIds: ids, visited: route.visited ?? false,
    categories: allCategories.filter((category) => stops.some((p) => p!.category === category)),
    cost: stops.reduce((sum, p) => sum + (p!.estimatedCost ?? 0), 0),
    durationMin: stops.reduce((sum, p) => sum + (p!.visitMinutes ?? 30), 0) + Math.ceil(distance / 3 * 60),
    distanceKm: Math.round(distance * 10) / 10 };
}
// Tres propuestas distintas para cada una de las siete combinaciones no vacías.
const g = ['mercado-lanza', 'cafe-del-mundo', 'mercado-rodriguez'];
const c = ['calle-jaen', 'plaza-murillo', 'san-francisco'];
const n = ['killi-killi', 'laikakota', 'parque-urbano'];
const definitions: [string, string[]][] = [
  ['Sabores del centro', [g[0], g[1]]], ['Mercados paceños', [g[0], g[2]]], ['Café y productos locales', [g[1], g[2]]],
  ['Calles e historia', [c[0], c[1]]], ['Plazas del centro', [c[2], c[1]]], ['Patrimonio paceño', [c[2], c[0], c[1]]],
  ['Miradores de La Paz', [n[0], n[1]]], ['Pausa verde', [n[1], n[2]]], ['Panorámicas y parque', [n[0], n[2]]],
  ['Mercado e historia', [g[0], c[2], c[0]]], ['Café y plazas', [g[1], c[2], c[1]]], ['Tradición y patrimonio', [g[2], c[2], c[0]]],
  ['Sabores y mirador', [g[0], n[0]]], ['Café al aire libre', [g[1], n[1], n[2]]], ['Mercado y parque', [g[2], n[2]]],
  ['Historia desde lo alto', [c[1], n[0]]], ['Calle Jaén y panorámicas', [c[0], n[0], n[1]]], ['Plazas y espacios verdes', [c[2], c[1], n[2]]],
  ['La Paz en tres experiencias', [g[0], c[0], n[0]]], ['Café, historia y mirador', [g[1], c[1], n[0]]], ['Mercado, plaza y parque', [g[2], c[2], n[2]]],
];
export function catalogRoutes(criteria: RouteCriteria = defaultCriteria) {
  return definitions.map(([name, placeIds], index) => calculateRoute({ id: `lp-${index + 1}`, name, placeIds, departure: criteria.departure, origin: criteria.origin }));
}
export function matchingRoutes(criteria: RouteCriteria) {
  return catalogRoutes(criteria).filter((route) =>
    route.categories.length === criteria.categories.length && criteria.categories.every((category) => route.categories.includes(category)) &&
    route.cost <= criteria.budget && route.durationMin <= criteria.minutes && (criteria.maxDistance == null || route.distanceKm <= criteria.maxDistance)
  ).sort((a, b) => criteria.order === 'cost' ? a.cost - b.cost : criteria.order === 'distance' ? a.distanceKm - b.distanceKm : a.durationMin - b.durationMin);
}
