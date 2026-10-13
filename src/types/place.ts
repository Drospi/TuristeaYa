export type PlaceCategory = 'gastronomia' | 'cultura' | 'naturaleza';

/** Lugar turístico (pantallas 12-14 del prototipo). */
export interface Place {
  id: string;
  name: string;
  description: string;
  category: PlaceCategory;
  distanceM: number;
  priceFrom: number;
  rating: number;
  reviewsCount: number;
  open: boolean;
  hours: string;
  services: string[];
  address: string;
}

/** Reseña de un lugar (pantallas 15-16). */
export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  hasPhoto: boolean;
}
