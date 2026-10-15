import type { DiscoveryPlace } from './discovery';
import type { PlaceCategory } from '@/types';

const municipal = 'https://lapaz.bo/turismo/centro/';
const viewpoints = 'https://lapaz.bo/agendajiwaki/turismo-en-la-paz-los-miradores-regalan-vistas-panoramicas/';
function place(id: string, name: string, category: PlaceCategory, lat: number, lon: number, address: string, description: string, cost: number, minutes: number, sourceUrl = municipal): DiscoveryPlace {
  return { id, name, category, point: { latitude: lat, longitude: lon }, address, description,
    isDemo: false, mapNote: 'Marcador de referencia aproximado. Verifica el acceso antes de salir.',
    priceFrom: cost, estimatedCost: cost, visitMinutes: minutes, rating: 0, reviewsCount: 0,
    distanceM: 0, open: false, hours: 'Consulta horarios y disponibilidad en la fuente del lugar',
    services: [], sourceUrl };
}
/** Lugares documentados. Importes y duración son supuestos de planificación, NO tarifas verificadas. */
export const realPlaces: DiscoveryPlace[] = [
  place('mercado-lanza', 'Mercado Lanza', 'gastronomia', -16.4945, -68.1381, 'Sector Plaza San Francisco · La Paz', 'Mercado paceño para una parada gastronómica y productos locales.', 25, 35),
  place('cafe-del-mundo', 'Café del Mundo', 'gastronomia', -16.4974, -68.1396, 'Calle Sagárnaga 324 · La Paz', 'Café con propuesta internacional en el centro turístico de La Paz.', 45, 40, 'https://www.cafe-delmundo.com/'),
  place('mercado-rodriguez', 'Mercado Rodríguez', 'gastronomia', -16.5025, -68.1418, 'Calle Rodríguez · San Pedro, La Paz', 'Mercado tradicional para conocer productos e ingredientes de la cocina local.', 20, 35, 'https://lapaz.bo/2026/08/09/'),
  place('calle-jaen', 'Calle Jaén', 'cultura', -16.4919, -68.1358, 'Calle Apolinar Jaén · La Paz', 'Paseo por la calle histórica. Esta propuesta recorre el exterior; no incluye entradas a museos.', 0, 30),
  place('plaza-murillo', 'Plaza Murillo', 'cultura', -16.4957, -68.1335, 'Centro histórico · La Paz', 'Paseo exterior por la plaza y observación de su arquitectura histórica.', 0, 25),
  place('san-francisco', 'Plaza Mayor de San Francisco', 'cultura', -16.4958, -68.1377, 'Plaza San Francisco · La Paz', 'Recorrido exterior por la plaza y la fachada de la basílica. No incluye ingreso al museo.', 0, 25),
  place('killi-killi', 'Mirador Killi Killi', 'naturaleza', -16.4991, -68.1265, 'Villa Pabón · La Paz', 'Mirador urbano con vistas de la ciudad y las montañas. El acceso tiene pendientes.', 0, 35, viewpoints),
  place('laikakota', 'Parque Mirador Laikakota', 'naturaleza', -16.5063, -68.1242, 'Parque Urbano Central · La Paz', 'Parque y mirador para una pausa al aire libre; confirma la tarifa de acceso.', 10, 40, 'https://lapaz.bo/turismo/centro-parque-mirador-laikakota/'),
  place('parque-urbano', 'Parque Urbano Central', 'naturaleza', -16.5102, -68.1255, 'Parque Urbano Central · La Paz', 'Paseo por espacios abiertos del parque. No incluye actividades pagadas.', 0, 40),
];
