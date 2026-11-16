import {
  createRecord,
  deleteRecord,
  ensureSessionLoaded,
  generateUuid,
  getRecord,
  isUuid,
  listRecords,
  updateRecord,
  type ListQueryOptions,
} from './http';
import type {
  DbOfflineDownload,
  DbPlace,
  DbRoute,
  DbRouteStop,
  DbSavedRoute,
} from '@/types/database';
import type { OfflineRoute, PlaceCategory, TourRoute } from '@/types';
import {
  calculateRoute,
  defaultCriteria,
  registerExtraRoutePlaces,
  type PlannedRoute,
} from '@/features/turista/data/route-planner';
import type { DiscoveryPlace } from '@/features/turista/data/discovery';
import { realPlaces } from '@/features/turista/data/real-places';
import { offlineRoutes as fallbackOfflineRoutes } from './mock/vip';

// ============================================================================
// CRUD de Rutas (/api/v1/routes)
// ============================================================================

export function listRoutes(options?: ListQueryOptions): Promise<DbRoute[]> {
  return listRecords<DbRoute>('routes', options);
}

export function getRoute(id: string): Promise<DbRoute> {
  return getRecord<DbRoute>('routes', id);
}

export function createRouteRecord(payload: Partial<DbRoute>): Promise<DbRoute> {
  return createRecord<DbRoute>('routes', payload as Record<string, unknown>);
}

export function updateRouteRecord(id: string, payload: Partial<DbRoute>): Promise<DbRoute> {
  return updateRecord<DbRoute>('routes', id, payload as Record<string, unknown>);
}

export function deleteRouteRecord(id: string): Promise<void> {
  return deleteRecord('routes', id);
}

// ============================================================================
// CRUD de Paradas de Ruta (/api/v1/route-stops)
// ============================================================================

export function listRouteStops(options?: ListQueryOptions): Promise<DbRouteStop[]> {
  return listRecords<DbRouteStop>('route-stops', options);
}

export function getRouteStop(id: string): Promise<DbRouteStop> {
  return getRecord<DbRouteStop>('route-stops', id);
}

export function createRouteStop(payload: Partial<DbRouteStop>): Promise<DbRouteStop> {
  return createRecord<DbRouteStop>('route-stops', payload as Record<string, unknown>);
}

export function updateRouteStop(
  id: string,
  payload: Partial<DbRouteStop>,
): Promise<DbRouteStop> {
  return updateRecord<DbRouteStop>('route-stops', id, payload as Record<string, unknown>);
}

export function deleteRouteStop(id: string): Promise<void> {
  return deleteRecord('route-stops', id);
}

// ============================================================================
// CRUD de Rutas Guardadas (/api/v1/saved-routes)
// ============================================================================

export function listSavedRoutes(options?: ListQueryOptions): Promise<DbSavedRoute[]> {
  return listRecords<DbSavedRoute>('saved-routes', options);
}

export function getSavedRoute(id: string): Promise<DbSavedRoute> {
  return getRecord<DbSavedRoute>('saved-routes', id);
}

export function createSavedRoute(payload: Partial<DbSavedRoute>): Promise<DbSavedRoute> {
  return createRecord<DbSavedRoute>('saved-routes', payload as Record<string, unknown>);
}

export function updateSavedRoute(
  id: string,
  payload: Partial<DbSavedRoute>,
): Promise<DbSavedRoute> {
  return updateRecord<DbSavedRoute>('saved-routes', id, payload as Record<string, unknown>);
}

export function deleteSavedRoute(id: string): Promise<void> {
  return deleteRecord('saved-routes', id);
}

// ============================================================================
// CRUD de Descargas Offline VIP (/api/v1/offline-downloads)
// ============================================================================

export function listOfflineDownloads(options?: ListQueryOptions): Promise<DbOfflineDownload[]> {
  return listRecords<DbOfflineDownload>('offline-downloads', options);
}

export function getOfflineDownload(id: string): Promise<DbOfflineDownload> {
  return getRecord<DbOfflineDownload>('offline-downloads', id);
}

export function createOfflineDownload(
  payload: Partial<DbOfflineDownload>,
): Promise<DbOfflineDownload> {
  return createRecord<DbOfflineDownload>(
    'offline-downloads',
    payload as Record<string, unknown>,
  );
}

export function updateOfflineDownload(
  id: string,
  payload: Partial<DbOfflineDownload>,
): Promise<DbOfflineDownload> {
  return updateRecord<DbOfflineDownload>(
    'offline-downloads',
    id,
    payload as Record<string, unknown>,
  );
}

export function deleteOfflineDownload(id: string): Promise<void> {
  return deleteRecord('offline-downloads', id);
}

// ============================================================================
// Sincronización y Mapeadores de Dominio (PlannedRoute / TourRoute / OfflineRoute)
// ============================================================================

function inferPlaceCategory(place: DbPlace): PlaceCategory {
  const haystack = `${place.name} ${place.description ?? ''}`.toLowerCase();
  if (
    haystack.includes('mirador') ||
    haystack.includes('parque') ||
    haystack.includes('valle') ||
    haystack.includes('naturaleza')
  ) {
    return 'naturaleza';
  }
  if (
    haystack.includes('mercado') ||
    haystack.includes('café') ||
    haystack.includes('cafe') ||
    haystack.includes('restaurante') ||
    haystack.includes('gastronom')
  ) {
    return 'gastronomia';
  }
  return 'cultura';
}

function registerBackendPlacesForPlanner(places: DbPlace[]) {
  const mapped: DiscoveryPlace[] = places.map((place) => {
    const matchingLocal = realPlaces.find(
      (item) => item.name.toLowerCase() === place.name.toLowerCase(),
    );
    const cost = Number(place.estimated_cost ?? matchingLocal?.estimatedCost ?? 0);
    return {
      id: place.id,
      name: place.name,
      category: matchingLocal?.category ?? inferPlaceCategory(place),
      point: {
        latitude: Number(place.latitude) || matchingLocal?.point.latitude || -16.4955,
        longitude: Number(place.longitude) || matchingLocal?.point.longitude || -68.1336,
      },
      address: place.address ?? matchingLocal?.address ?? 'La Paz, Bolivia',
      description:
        place.description ?? matchingLocal?.description ?? 'Lugar turístico en La Paz',
      isDemo: false,
      mapNote: 'Ubicación sincronizada desde el catálogo TuristeaYA.',
      priceFrom: cost,
      estimatedCost: cost,
      visitMinutes: Number(place.visit_minutes ?? matchingLocal?.visitMinutes ?? 45),
      rating: matchingLocal?.rating ?? 4.7,
      reviewsCount: matchingLocal?.reviewsCount ?? 12,
      distanceM: 0,
      open: true,
      hours: matchingLocal?.hours ?? '09:00 a 18:00',
      services: Array.isArray(place.services) ? place.services : [],
      sourceUrl: matchingLocal?.sourceUrl ?? 'https://lapaz.bo/turismo/centro/',
    };
  });
  registerExtraRoutePlaces(mapped);
}

export async function fetchBackendPlannedRoutes(): Promise<{
  templateRoutes: PlannedRoute[];
  savedRoutes: PlannedRoute[];
  rawRoutes: DbRoute[];
}> {
  try {
    const session = await ensureSessionLoaded();
    const userId = session?.userId && isUuid(session.userId) ? session.userId : undefined;

    const [routes, stops, savedList, places] = await Promise.all([
      listRoutes({ limit: 100 }),
      listRouteStops({ limit: 100 }).catch(() => [] as DbRouteStop[]),
      listSavedRoutes({
        limit: 100,
        filters: userId ? { user_id: userId } : undefined,
      }).catch(() => [] as DbSavedRoute[]),
      listRecords<DbPlace>('places', { limit: 100 }).catch(() => [] as DbPlace[]),
    ]);

    registerBackendPlacesForPlanner(places);

    const stopsByRoute = new Map<string, DbRouteStop[]>();
    for (const stop of stops) {
      const current = stopsByRoute.get(stop.route_id) ?? [];
      current.push(stop);
      stopsByRoute.set(stop.route_id, current);
    }

    const savedStatusByRouteId = new Map<string, DbSavedRoute>();
    for (const saved of savedList) {
      savedStatusByRouteId.set(saved.route_id, saved);
    }

    const toPlannedRoute = (
      record: DbRoute,
      visitedOverride?: boolean,
    ): PlannedRoute | null => {
      const routeStops = (stopsByRoute.get(record.id) ?? []).sort(
        (a, b) => a.position - b.position,
      );
      const resolvedPlaceIds: string[] = [];

      for (const stop of routeStops) {
        const backendPlace = places.find((p) => p.id === stop.place_id);
        if (backendPlace) {
          const localMatch = realPlaces.find(
            (rp) => rp.name.toLowerCase() === backendPlace.name.toLowerCase(),
          );
          resolvedPlaceIds.push(localMatch ? localMatch.id : backendPlace.id);
        } else {
          resolvedPlaceIds.push(stop.place_id);
        }
      }

      const fallbackIds =
        resolvedPlaceIds.length > 0
          ? resolvedPlaceIds
          : [realPlaces[0]?.id ?? 'plaza-murillo'];

      try {
        const calculated = calculateRoute({
          id: record.id,
          name: record.name,
          placeIds: fallbackIds,
          departure: defaultCriteria.departure,
          origin: {
            latitude: Number(record.origin_lat ?? defaultCriteria.origin.latitude),
            longitude: Number(record.origin_lng ?? defaultCriteria.origin.longitude),
          },
          visited: visitedOverride ?? false,
          shareSlug: record.share_slug ?? undefined,
        });
        return {
          ...calculated,
          cost: Number(record.budget ?? calculated.cost),
          durationMin: Number(record.available_minutes ?? calculated.durationMin),
          shareSlug: record.share_slug ?? undefined,
        };
      } catch {
        return null;
      }
    };

    const templateRoutes: PlannedRoute[] = [];
    const savedRoutes: PlannedRoute[] = [];

    for (const record of routes) {
      const savedEntry = savedStatusByRouteId.get(record.id);
      const isVisited = Boolean(savedEntry?.visited_at);
      const planned = toPlannedRoute(record, isVisited);
      if (!planned) continue;

      if (record.visibility === 'public') {
        templateRoutes.push(planned);
      }
      if (savedEntry || (userId && record.user_id === userId)) {
        savedRoutes.push({
          ...planned,
          savedRecordId: savedEntry?.id,
        });
      }
    }

    return { templateRoutes, savedRoutes, rawRoutes: routes };
  } catch {
    return { templateRoutes: [], savedRoutes: [], rawRoutes: [] };
  }
}

export async function syncPlannedRouteToBackend(route: PlannedRoute): Promise<{
  backendRoute?: DbRoute;
  savedRecord?: DbSavedRoute;
}> {
  const session = await ensureSessionLoaded();
  const userId = session?.userId && isUuid(session.userId) ? session.userId : null;
  if (!userId) return {};

  try {
    const shareSlug =
      route.shareSlug ??
      `${route.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;

    let backendRoute: DbRoute;
    if (isUuid(route.id)) {
      try {
        backendRoute = await updateRouteRecord(route.id, {
          name: route.name,
          budget: route.cost,
          available_minutes: route.durationMin,
          origin_lat: route.origin.latitude,
          origin_lng: route.origin.longitude,
        });
      } catch {
        backendRoute = await createRouteRecord({
          user_id: userId,
          name: route.name,
          budget: route.cost,
          available_minutes: route.durationMin,
          origin_lat: route.origin.latitude,
          origin_lng: route.origin.longitude,
          preference: 'balanced',
          visibility: 'private',
          share_slug: shareSlug,
        });
      }
    } else {
      backendRoute = await createRouteRecord({
        user_id: userId,
        name: route.name,
        budget: route.cost,
        available_minutes: route.durationMin,
        origin_lat: route.origin.latitude,
        origin_lng: route.origin.longitude,
        preference: 'balanced',
        visibility: 'private',
        share_slug: shareSlug,
      });
    }

    const places = await listRecords<DbPlace>('places', { limit: 100 }).catch(
      () => [] as DbPlace[],
    );
    for (let index = 0; index < route.placeIds.length; index++) {
      const stopIdOrSlug = route.placeIds[index];
      const localPlaceName =
        realPlaces.find((rp) => rp.id === stopIdOrSlug)?.name.toLowerCase() ?? '';
      const matchedBackendPlace = places.find(
        (p) =>
          p.id === stopIdOrSlug ||
          (localPlaceName && p.name.toLowerCase() === localPlaceName),
      );
      if (matchedBackendPlace) {
        await createRouteStop({
          route_id: backendRoute.id,
          place_id: matchedBackendPlace.id,
          position: index + 1,
          visit_minutes: matchedBackendPlace.visit_minutes ?? 45,
          travel_minutes: 15,
          travel_meters: 800,
          estimated_cost: matchedBackendPlace.estimated_cost ?? 0,
        }).catch(() => undefined);
      }
    }

    const savedRecord = await createSavedRoute({
      user_id: userId,
      route_id: backendRoute.id,
      visited_at: route.visited ? new Date().toISOString() : null,
    }).catch(() => undefined);

    return { backendRoute, savedRecord };
  } catch {
    return {};
  }
}

export async function syncRouteVisitedStatus(
  route: PlannedRoute,
  visited: boolean,
): Promise<void> {
  try {
    if (route.savedRecordId && isUuid(route.savedRecordId)) {
      await updateSavedRoute(route.savedRecordId, {
        visited_at: visited ? new Date().toISOString() : null,
      });
      return;
    }
    if (isUuid(route.id)) {
      const session = await ensureSessionLoaded();
      const userId = session?.userId && isUuid(session.userId) ? session.userId : undefined;
      const savedList = await listSavedRoutes({
        limit: 5,
        filters: {
          route_id: route.id,
          ...(userId ? { user_id: userId } : {}),
        },
      });
      if (savedList[0]) {
        await updateSavedRoute(savedList[0].id, {
          visited_at: visited ? new Date().toISOString() : null,
        });
      }
    }
  } catch {
    // Mantiene estado local si falla la sincronización remota
  }
}

export async function removeRouteFromBackend(route: PlannedRoute): Promise<void> {
  try {
    if (route.savedRecordId && isUuid(route.savedRecordId)) {
      await deleteSavedRoute(route.savedRecordId).catch(() => undefined);
    }
    if (isUuid(route.id)) {
      await deleteRouteRecord(route.id).catch(() => undefined);
    }
  } catch {
    // Silencioso para no bloquear borrado local
  }
}

export async function fetchTourRoutesCatalog(): Promise<TourRoute[]> {
  const { rawRoutes } = await fetchBackendPlannedRoutes();
  if (!rawRoutes.length) return [];
  const stops = await listRouteStops({ limit: 100 }).catch(() => [] as DbRouteStop[]);
  return rawRoutes.map((route) => {
    const routeStops = stops
      .filter((s) => s.route_id === route.id)
      .sort((a, b) => a.position - b.position);
    return {
      id: route.id,
      name: route.name,
      tagline: `Recorrido recomendado (${route.preference || 'cultural'})`,
      category: 'cultura',
      cost: Number(route.budget ?? 0),
      durationMin: Number(route.available_minutes ?? 120),
      distanceKm: 2.4,
      rating: 4.8,
      saved: false,
      stops: routeStops.map((stop, idx) => ({
        order: idx + 1,
        placeId: stop.place_id,
        placeName: `Parada ${idx + 1}`,
        time: stop.arrival_at ?? '10:00',
        durationMin: Number(stop.visit_minutes ?? 45),
        cost: Number(stop.estimated_cost ?? 0),
      })),
    };
  });
}

export async function fetchOfflineDownloadsCatalog(): Promise<
  (OfflineRoute & { recordId?: string; routeId?: string })[]
> {
  try {
    const session = await ensureSessionLoaded();
    const userId = session?.userId && isUuid(session.userId) ? session.userId : undefined;
    const [downloads, routes] = await Promise.all([
      listOfflineDownloads({
        limit: 50,
        filters: userId ? { user_id: userId } : undefined,
      }),
      listRoutes({ limit: 100 }).catch(() => [] as DbRoute[]),
    ]);

    if (!downloads.length) return fallbackOfflineRoutes;

    const routeMap = new Map(routes.map((r) => [r.id, r]));
    return downloads.map((item) => {
      const route = item.route_id ? routeMap.get(item.route_id) : undefined;
      const snapshot = (item.snapshot ?? {}) as Record<string, unknown>;
      return {
        id: item.id,
        recordId: item.id,
        routeId: item.route_id,
        name:
          (typeof snapshot.name === 'string' && snapshot.name) ||
          route?.name ||
          `Paquete offline v${item.version ?? 1}`,
        stopsCount: Number(snapshot.stopsCount ?? 4),
        sizeMb: Number(snapshot.sizeMb ?? 18.5),
        downloaded: true,
        updatedLabel: item.created_at
          ? `Sincronizado ${new Date(item.created_at).toLocaleDateString('es-BO')}`
          : 'Actualizado hoy',
      };
    });
  } catch {
    return fallbackOfflineRoutes;
  }
}

export async function createOfflineDownloadForRoute(params: {
  routeId?: string | null;
  routeName?: string;
  stopsCount?: number;
  packageSizeMb?: number;
}): Promise<DbOfflineDownload> {
  const session = await ensureSessionLoaded();
  const userId =
    session?.userId && isUuid(session.userId) ? session.userId : generateUuid();
  let targetRouteId = params.routeId && isUuid(params.routeId) ? params.routeId : null;

  if (!targetRouteId) {
    const routes = await listRoutes({ limit: 5 }).catch(() => [] as DbRoute[]);
    targetRouteId = routes[0]?.id ?? generateUuid();
  }

  return createOfflineDownload({
    user_id: userId,
    route_id: targetRouteId,
    snapshot: {
      name: params.routeName ?? 'Ruta patrimonial de La Paz',
      stopsCount: params.stopsCount ?? 4,
      sizeMb: params.packageSizeMb ?? 18.5,
      savedAt: new Date().toISOString(),
    },
    version: 1,
  });
}
