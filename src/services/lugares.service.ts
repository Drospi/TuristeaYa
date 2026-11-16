import {
  createRecord,
  deleteRecord,
  getCurrentUserId,
  getRecord,
  isUuid,
  listRecords,
  updateRecord,
  type ListQueryOptions,
} from './http';
import * as placesMock from './mock/places';

import type { DiscoveryPlace } from '@/features/turista/data/discovery';
import type { Place, PlaceCategory, Review } from '@/types';
import type {
  DbCategory,
  DbOpeningHour,
  DbPlace,
  DbPlaceCategory,
  DbPlaceMedia,
  DbPlaceVisit,
  DbProfile,
  DbPromotion,
  DbReview,
  DbReviewMedia,
  DbReviewReply,
  DbTicket,
} from '@/types/database';

/* -------------------------------------------------------------------------- */
/* CRUD de Lugares (/api/v1/places)                                           */
/* -------------------------------------------------------------------------- */

export const listPlaces = (
  filters?: { business_id?: string; zone_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbPlace>('places', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getPlaceRecord = (id: string) => getRecord<DbPlace>('places', id);
export const createPlace = (payload: Partial<DbPlace>) =>
  createRecord<DbPlace>('places', payload as Record<string, unknown>);
export const updatePlace = (id: string, payload: Partial<DbPlace>) =>
  updateRecord<DbPlace>('places', id, payload as Record<string, unknown>);
export const deletePlace = (id: string) => deleteRecord('places', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Categorías por Lugar (/api/v1/place-categories)                    */
/* -------------------------------------------------------------------------- */

export const listPlaceCategories = (
  filters?: { place_id?: string; category_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbPlaceCategory>('place-categories', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getPlaceCategory = (id: string) =>
  getRecord<DbPlaceCategory>('place-categories', id);
export const createPlaceCategory = (payload: Partial<DbPlaceCategory>) =>
  createRecord<DbPlaceCategory>('place-categories', payload as Record<string, unknown>);
export const updatePlaceCategory = (id: string, payload: Partial<DbPlaceCategory>) =>
  updateRecord<DbPlaceCategory>('place-categories', id, payload as Record<string, unknown>);
export const deletePlaceCategory = (id: string) => deleteRecord('place-categories', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Horarios de Atención (/api/v1/opening-hours)                       */
/* -------------------------------------------------------------------------- */

export const listOpeningHours = (
  filters?: { place_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbOpeningHour>('opening-hours', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getOpeningHour = (id: string) => getRecord<DbOpeningHour>('opening-hours', id);
export const createOpeningHour = (payload: Partial<DbOpeningHour>) =>
  createRecord<DbOpeningHour>('opening-hours', payload as Record<string, unknown>);
export const updateOpeningHour = (id: string, payload: Partial<DbOpeningHour>) =>
  updateRecord<DbOpeningHour>('opening-hours', id, payload as Record<string, unknown>);
export const deleteOpeningHour = (id: string) => deleteRecord('opening-hours', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Multimedia del Lugar (/api/v1/place-media)                         */
/* -------------------------------------------------------------------------- */

export const listPlaceMedia = (
  filters?: { place_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbPlaceMedia>('place-media', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getPlaceMedia = (id: string) => getRecord<DbPlaceMedia>('place-media', id);
export const createPlaceMedia = (payload: Partial<DbPlaceMedia>) =>
  createRecord<DbPlaceMedia>('place-media', payload as Record<string, unknown>);
export const updatePlaceMedia = (id: string, payload: Partial<DbPlaceMedia>) =>
  updateRecord<DbPlaceMedia>('place-media', id, payload as Record<string, unknown>);
export const deletePlaceMedia = (id: string) => deleteRecord('place-media', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Visitas a Lugares (/api/v1/place-visits)                           */
/* -------------------------------------------------------------------------- */

export const listPlaceVisits = (
  filters?: { place_id?: string; user_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbPlaceVisit>('place-visits', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getPlaceVisit = (id: string) => getRecord<DbPlaceVisit>('place-visits', id);
export const createPlaceVisit = (payload: Partial<DbPlaceVisit>) =>
  createRecord<DbPlaceVisit>('place-visits', payload as Record<string, unknown>);
export const updatePlaceVisit = (id: string, payload: Partial<DbPlaceVisit>) =>
  updateRecord<DbPlaceVisit>('place-visits', id, payload as Record<string, unknown>);
export const deletePlaceVisit = (id: string) => deleteRecord('place-visits', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Reseñas, Multimedia y Respuestas (/reviews, /review-media, /review-replies) */
/* -------------------------------------------------------------------------- */

export const listReviews = (
  filters?: { place_id?: string; user_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbReview>('reviews', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getReview = (id: string) => getRecord<DbReview>('reviews', id);
export const createReview = (payload: Partial<DbReview>) =>
  createRecord<DbReview>('reviews', payload as Record<string, unknown>);
export const updateReview = (id: string, payload: Partial<DbReview>) =>
  updateRecord<DbReview>('reviews', id, payload as Record<string, unknown>);
export const deleteReview = (id: string) => deleteRecord('reviews', id);

export const listReviewMedia = (
  filters?: { review_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbReviewMedia>('review-media', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getReviewMedia = (id: string) => getRecord<DbReviewMedia>('review-media', id);
export const createReviewMedia = (payload: Partial<DbReviewMedia>) =>
  createRecord<DbReviewMedia>('review-media', payload as Record<string, unknown>);
export const updateReviewMedia = (id: string, payload: Partial<DbReviewMedia>) =>
  updateRecord<DbReviewMedia>('review-media', id, payload as Record<string, unknown>);
export const deleteReviewMedia = (id: string) => deleteRecord('review-media', id);

export const listReviewReplies = (
  filters?: { review_id?: string; business_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbReviewReply>('review-replies', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getReviewReply = (id: string) => getRecord<DbReviewReply>('review-replies', id);
export const createReviewReply = (payload: Partial<DbReviewReply>) =>
  createRecord<DbReviewReply>('review-replies', payload as Record<string, unknown>);
export const updateReviewReply = (id: string, payload: Partial<DbReviewReply>) =>
  updateRecord<DbReviewReply>('review-replies', id, payload as Record<string, unknown>);
export const deleteReviewReply = (id: string) => deleteRecord('review-replies', id);

/* -------------------------------------------------------------------------- */
/* Helpers y Adaptadores de Dominio para Lugares y Reseñas                    */
/* -------------------------------------------------------------------------- */

function inferCategory(name: string, description: string, catSlug?: string): PlaceCategory {
  const combined = `${catSlug ?? ''} ${name} ${description}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (
    combined.includes('gastro') ||
    combined.includes('cafe') ||
    combined.includes('restauran') ||
    combined.includes('comida') ||
    combined.includes('mercado')
  ) {
    return 'gastronomia';
  }
  if (
    combined.includes('natur') ||
    combined.includes('mirador') ||
    combined.includes('parque') ||
    combined.includes('sendero')
  ) {
    return 'naturaleza';
  }
  return 'cultura';
}

function formatOpeningHours(hours: DbOpeningHour[]): string {
  if (!hours.length) return '09:00 a 19:00';
  const sorted = [...hours].sort((a, b) => a.weekday - b.weekday);
  const first = sorted[0];
  return `${first.opens_at.slice(0, 5)} a ${first.closes_at.slice(0, 5)}`;
}

function formatReviewDate(iso?: string): string {
  if (!iso) return 'Reciente';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-BO', { day: 'numeric', month: 'long' });
}

export interface PlaceReviewWithExtras extends Review {
  reply?: string;
  mediaPath?: string;
  placeId?: string;
}

export async function fetchDiscoveryCatalog(): Promise<{
  places: DiscoveryPlace[];
  reviewsByPlaceId: Record<string, PlaceReviewWithExtras[]>;
}> {
  try {
    const [
      dbPlaces,
      dbPlaceCategories,
      dbCategories,
      dbHours,
      dbPromos,
      dbReviews,
      dbProfiles,
      dbReplies,
      dbReviewMedia,
    ] = await Promise.all([
      listPlaces(undefined, { limit: 100 }),
      listPlaceCategories(undefined, { limit: 100 }).catch(() => [] as DbPlaceCategory[]),
      listRecords<DbCategory>('categories', { limit: 50 }).catch(() => [] as DbCategory[]),
      listOpeningHours(undefined, { limit: 100 }).catch(() => [] as DbOpeningHour[]),
      listRecords<DbPromotion>('promotions', { limit: 50 }).catch(() => [] as DbPromotion[]),
      listReviews(undefined, { limit: 100 }).catch(() => [] as DbReview[]),
      listRecords<DbProfile>('profiles', { limit: 100 }).catch(() => [] as DbProfile[]),
      listReviewReplies(undefined, { limit: 100 }).catch(() => [] as DbReviewReply[]),
      listReviewMedia(undefined, { limit: 100 }).catch(() => [] as DbReviewMedia[]),
    ]);

    const catById = new Map(dbCategories.map((c) => [c.id, c]));
    const placeCatMap = new Map<string, DbCategory>();
    for (const pc of dbPlaceCategories) {
      const cat = catById.get(pc.category_id);
      if (cat && !placeCatMap.has(pc.place_id)) {
        placeCatMap.set(pc.place_id, cat);
      }
    }

    const profileMap = new Map(dbProfiles.map((p) => [p.id, p.full_name]));
    const replyByReview = new Map(dbReplies.map((r) => [r.review_id, r.body]));
    const mediaByReview = new Map(dbReviewMedia.map((m) => [m.review_id, m.storage_path]));

    const reviewsByPlaceId: Record<string, PlaceReviewWithExtras[]> = {};
    for (const rev of dbReviews) {
      if (rev.hidden) continue;
      const list = reviewsByPlaceId[rev.place_id] ?? [];
      list.push({
        id: rev.id,
        author: profileMap.get(rev.user_id) ?? 'Visitante verificado',
        rating: Number(rev.rating) || 5,
        date: formatReviewDate(rev.created_at),
        text: rev.body,
        hasPhoto: mediaByReview.has(rev.id),
        reply: replyByReview.get(rev.id),
        mediaPath: mediaByReview.get(rev.id),
        placeId: rev.place_id,
      });
      reviewsByPlaceId[rev.place_id] = list;
    }

    const mappedPlaces: DiscoveryPlace[] = dbPlaces.map((p) => {
      const cat = placeCatMap.get(p.id);
      const category = inferCategory(p.name, p.description, cat?.slug || cat?.name);
      const placeHours = dbHours.filter((h) => h.place_id === p.id);
      const placeRevs = reviewsByPlaceId[p.id] ?? [];
      const avgRating = placeRevs.length
        ? Math.round(
            (placeRevs.reduce((acc, r) => acc + r.rating, 0) / placeRevs.length) * 10,
          ) / 10
        : 4.7;
      const promo = dbPromos.find((pr) => pr.place_id === p.id);
      const cost = Number(p.estimated_cost) || 0;
      const minutes = Number(p.visit_minutes) || 35;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        category,
        distanceM: 350,
        priceFrom: cost,
        estimatedCost: cost,
        visitMinutes: minutes,
        rating: avgRating,
        reviewsCount: placeRevs.length,
        open: Boolean(p.published),
        hours: formatOpeningHours(placeHours),
        services: Array.isArray(p.services) ? p.services : [],
        address: p.address,
        point: {
          latitude: Number(p.latitude) || -16.4955,
          longitude: Number(p.longitude) || -68.1336,
        },
        isDemo: false,
        mapNote: 'Ubicación sincronizada desde el catálogo de TuristeaYa (Supabase).',
        offer: promo
          ? `${promo.title} · Código ${promo.code} (${promo.discount_percent}% dto.) · ${promo.conditions}`
          : undefined,
      };
    });

    return { places: mappedPlaces, reviewsByPlaceId };
  } catch {
    return { places: [], reviewsByPlaceId: {} };
  }
}

export async function fetchPlaceReviewsList(placeId?: string): Promise<PlaceReviewWithExtras[]> {
  try {
    const filter = placeId && isUuid(placeId) ? { place_id: placeId } : undefined;
    const [reviews, profiles, replies, media] = await Promise.all([
      listReviews(filter, { limit: 50 }),
      listRecords<DbProfile>('profiles', { limit: 50 }).catch(() => [] as DbProfile[]),
      listReviewReplies(undefined, { limit: 50 }).catch(() => [] as DbReviewReply[]),
      listReviewMedia(undefined, { limit: 50 }).catch(() => [] as DbReviewMedia[]),
    ]);

    if (!reviews.length) {
      const fallback = (placeId && placesMock.reviewsByPlace[placeId]) ||
        placesMock.reviewsByPlace['cafe-del-patio'] ||
        [];
      return fallback;
    }

    const profileMap = new Map(profiles.map((p) => [p.id, p.full_name]));
    const replyMap = new Map(replies.map((r) => [r.review_id, r.body]));
    const mediaMap = new Map(media.map((m) => [m.review_id, m.storage_path]));

    return reviews
      .filter((r) => !r.hidden)
      .map((r) => ({
        id: r.id,
        author: profileMap.get(r.user_id) ?? 'Visitante TuristeaYa',
        rating: Number(r.rating) || 5,
        date: formatReviewDate(r.created_at),
        text: r.body,
        hasPhoto: mediaMap.has(r.id),
        reply: replyMap.get(r.id),
        mediaPath: mediaMap.get(r.id),
        placeId: r.place_id,
      }));
  } catch {
    return (
      (placeId && placesMock.reviewsByPlace[placeId]) ||
      placesMock.reviewsByPlace['cafe-del-patio'] ||
      []
    );
  }
}

export async function submitPlaceReview(params: {
  placeId: string;
  rating: number;
  body: string;
  photoPath?: string;
}): Promise<PlaceReviewWithExtras> {
  const userId = await getCurrentUserId();
  let targetPlaceId = params.placeId;

  if (!isUuid(targetPlaceId)) {
    const allPlaces = await listPlaces(undefined, { limit: 20 }).catch(() => [] as DbPlace[]);
    if (allPlaces[0]?.id) {
      targetPlaceId = allPlaces[0].id;
    }
  }

  if (userId && isUuid(userId) && isUuid(targetPlaceId)) {
    const created = await createReview({
      user_id: userId,
      place_id: targetPlaceId,
      rating: Math.min(5, Math.max(1, Math.round(params.rating))),
      body: params.body.trim(),
      hidden: false,
    });
    if (params.photoPath) {
      await createReviewMedia({
        review_id: created.id,
        storage_path: params.photoPath,
      }).catch(() => undefined);
    }
    return {
      id: created.id,
      author: 'Tú',
      rating: created.rating,
      date: 'Hoy',
      text: created.body,
      hasPhoto: Boolean(params.photoPath),
      placeId: created.place_id,
    };
  }

  return {
    id: `local-rev-${Date.now()}`,
    author: 'Tú',
    rating: Math.min(5, Math.max(1, Math.round(params.rating))),
    date: 'Hoy',
    text: params.body.trim(),
    hasPhoto: Boolean(params.photoPath),
    placeId: params.placeId,
  };
}

export async function recordPlaceVisit(placeId: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId || !isUuid(userId) || !isUuid(placeId)) return;
  await createPlaceVisit({
    user_id: userId,
    place_id: placeId,
    visited_at: new Date().toISOString(),
  });
}

export async function reportPlaceIssue(
  placeId: string,
  placeName: string,
  description: string,
): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId || !isUuid(userId)) return;
  await createRecord<DbTicket>('tickets', {
    user_id: userId,
    ...(isUuid(placeId) ? { place_id: placeId } : {}),
    subject: `Corrección en ${placeName}`,
    description: description.trim(),
    kind: 'place_info',
    priority: 'medium',
    status: 'open',
  });
}

export async function fetchAllPlacesForApi(): Promise<Place[]> {
  const { places } = await fetchDiscoveryCatalog();
  if (!places.length) return placesMock.places;
  return places;
}

export const lugaresService = {
  listPlaces,
  getPlaceRecord,
  createPlace,
  updatePlace,
  deletePlace,
  listPlaceCategories,
  getPlaceCategory,
  createPlaceCategory,
  updatePlaceCategory,
  deletePlaceCategory,
  listOpeningHours,
  getOpeningHour,
  createOpeningHour,
  updateOpeningHour,
  deleteOpeningHour,
  listPlaceMedia,
  getPlaceMedia,
  createPlaceMedia,
  updatePlaceMedia,
  deletePlaceMedia,
  listPlaceVisits,
  getPlaceVisit,
  createPlaceVisit,
  updatePlaceVisit,
  deletePlaceVisit,
  listReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  listReviewMedia,
  getReviewMedia,
  createReviewMedia,
  updateReviewMedia,
  deleteReviewMedia,
  listReviewReplies,
  getReviewReply,
  createReviewReply,
  updateReviewReply,
  deleteReviewReply,
  fetchDiscoveryCatalog,
  fetchPlaceReviewsList,
  submitPlaceReview,
  recordPlaceVisit,
  reportPlaceIssue,
  fetchAllPlacesForApi,
};
