import { realPlaces } from './real-places';
import { places, reviewsByPlace } from '@/services/mock/places';
import type { Place } from '@/types';

export type MapPoint = { latitude: number; longitude: number };
export type DiscoveryPlace = Place & {
  point: MapPoint;
  isDemo: boolean;
  mapNote: string;
  offer?: string;
  sourceUrl?: string;
  estimatedCost?: number;
  visitMinutes?: number;
};

const points: Record<string, MapPoint> = {
  'cafe-del-patio': { latitude: -16.4974, longitude: -68.1367 },
  'galeria-de-la-ciudad': { latitude: -16.4939, longitude: -68.1354 },
  'mirador-de-los-andes': { latitude: -16.4993, longitude: -68.1242 },
  'centro-cultural': { latitude: -16.4965, longitude: -68.1352 },
  'mercado-local': { latitude: -16.4978, longitude: -68.1398 },
};

export const discoveryPlaces: DiscoveryPlace[] = [
  ...realPlaces,
  ...places.map((place) => ({
    ...place,
    point: points[place.id],
    isDemo: true,
    mapNote: 'Punto de ejemplo en La Paz. No representa la dirección de un comercio real.',
    offer: place.id === 'cafe-del-patio' ? 'Café y postre desde Bs 35. Promoción simulada para la presentación.' : undefined,
  })),
  {
    id: 'sabores-de-bolivia', name: 'Sabores de Bolivia', category: 'gastronomia',
    description: 'Una pausa para disfrutar comida boliviana durante tu paseo por el centro.',
    distanceM: 450, priceFrom: 40, rating: 4.7, reviewsCount: 32,
    open: true, hours: '12:00 a 21:00', services: ['Comida local', 'Mesas', 'Baño'],
    address: 'Centro de La Paz · Dirección de ejemplo',
    point: { latitude: -16.4987, longitude: -68.1373 }, isDemo: true,
    mapNote: 'Restaurante ficticio. El marcador es un punto de ejemplo.',
    offer: 'Menú boliviano desde Bs 40. Promoción simulada, sin canje real.',
  },
  {
    id: 'calle-jaen', name: 'Calle Jaén', category: 'cultura',
    description: 'Una parada cultural en el centro histórico de La Paz, con arquitectura tradicional y museos municipales.',
    distanceM: 0, priceFrom: 0, rating: 0, reviewsCount: 0,
    open: true, hours: 'Consulta los horarios de cada museo', services: ['Paseo cultural', 'Museos', 'Fotografías'],
    address: 'Calle Apolinar Jaén · La Paz, Bolivia',
    point: { latitude: -16.4919, longitude: -68.1358 }, isDemo: false,
    mapNote: 'Referencia aproximada de la calle. Las entradas de los museos pueden tener costo.',
    sourceUrl: 'https://lapaz.bo/turismo/centro/',
  },
];

export const recommendations = [
  { placeId: 'mercado-lanza', eyebrow: 'Sugerido · Gastronomía', description: 'Una parada para descubrir sabores paceños en el centro.', tag: 'Mercado local · Lugar real' },
  { placeId: 'cafe-del-mundo', eyebrow: 'Sugerido · Café', description: 'Una pausa en la calle Sagárnaga durante tu recorrido.', tag: 'Café · Lugar real' },
  { placeId: 'calle-jaen', eyebrow: 'De paso · Bolivia', description: 'Descubre una calle histórica del centro de La Paz.', tag: 'Cultura · Lugar real' },
];
export const outingNotices = [
  { id: 'horarios-reales', title: 'Antes de salir', text: 'Consulta los horarios vigentes del café antes de iniciar el recorrido.', placeId: 'cafe-del-mundo', action: 'Ver café y fuente oficial' },
  { id: 'pendiente-mirador', title: 'Recorrido con pendientes', text: 'La visita a Killi Killi incluye subidas. Ajusta el tiempo a tu ritmo.', placeId: 'killi-killi', action: 'Ver mirador y ubicación' },
  { id: 'parada-cultural-real', title: 'Una parada cultural', text: 'La propuesta de Calle Jaén recorre el exterior. Las entradas a museos no están incluidas.', placeId: 'calle-jaen', action: 'Explorar Calle Jaén' },
];

export { reviewsByPlace };
export const findDiscoveryPlace = (id: string) => discoveryPlaces.find((place) => place.id === id);

export const zonePoints: Record<string, MapPoint> = {
  'Centro de La Paz': { latitude: -16.4955, longitude: -68.1336 },
  Sopocachi: { latitude: -16.512, longitude: -68.129 },
  Miraflores: { latitude: -16.500, longitude: -68.120 },
  'San Pedro': { latitude: -16.504, longitude: -68.138 },
  Obrajes: { latitude: -16.529, longitude: -68.112 },
  Calacoto: { latitude: -16.540, longitude: -68.080 },
  'San Miguel': { latitude: -16.543, longitude: -68.078 },
};
