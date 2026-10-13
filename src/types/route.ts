import type { PlaceCategory } from './place';

/** Parada dentro de una ruta (pantallas 09-11). */
export interface RouteStop {
  order: number;
  placeId: string;
  placeName: string;
  time: string;
  durationMin: number;
  cost: number;
}

/** Ruta turística (pantallas 07, 09-10, 18). */
export interface TourRoute {
  id: string;
  name: string;
  tagline: string;
  category: PlaceCategory;
  cost: number;
  durationMin: number;
  distanceKm: number;
  rating: number;
  stops: RouteStop[];
  note?: string;
}
