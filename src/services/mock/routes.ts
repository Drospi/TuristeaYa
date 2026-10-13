import type { TourRoute } from '@/types';

/** Rutas de demostración (pantallas 07, 09-10, 18). */
export const routes: TourRoute[] = [
  {
    id: 'paseo-por-el-centro',
    name: 'Paseo por el centro',
    tagline: 'Cultura y gastronomía',
    category: 'cultura',
    cost: 85,
    durationMin: 150,
    distanceKm: 1.8,
    rating: 4.8,
    stops: [
      { order: 1, placeId: 'cafe-del-patio', placeName: 'Café del Patio', time: '14:00', durationMin: 45, cost: 35 },
      { order: 2, placeId: 'galeria-de-la-ciudad', placeName: 'Galería de la Ciudad', time: '14:55', durationMin: 50, cost: 20 },
      { order: 3, placeId: 'mirador-de-los-andes', placeName: 'Mirador de los Andes', time: '15:55', durationMin: 35, cost: 30 },
    ],
  },
  {
    id: 'una-tarde-cultural',
    name: 'Una tarde cultural',
    tagline: 'Arte y exposiciones',
    category: 'cultura',
    cost: 40,
    durationMin: 110,
    distanceKm: 1,
    rating: 4.6,
    note: 'Traslado estimado: 10 minutos a pie.',
    stops: [
      { order: 1, placeId: 'galeria-de-la-ciudad', placeName: 'Galería de la Ciudad', time: '14:00', durationMin: 50, cost: 20 },
      { order: 2, placeId: 'centro-cultural', placeName: 'Centro cultural', time: '15:00', durationMin: 50, cost: 20 },
    ],
  },
];
