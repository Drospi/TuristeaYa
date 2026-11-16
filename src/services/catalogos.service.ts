import {
  createRecord,
  deleteRecord,
  generateUuid,
  getCurrentUserId,
  getRecord,
  httpRequest,
  listRecords,
  updateRecord,
  type ListQueryOptions,
} from './http';
import * as businessMock from './mock/business';
import * as vipMock from './mock/vip';

import type {
  BusinessNotification,
  BusinessProfile,
  BusinessStats,
  Campaign,
  CampaignState,
  PlaceCategory,
  VipExperience,
} from '@/types';
import type {
  BookExperienceRequestPayload,
  DbBusiness,
  DbBusinessVerification,
  DbCampaign,
  DbCampaignEvent,
  DbCategory,
  DbCouponRedemption,
  DbExperience,
  DbNotification,
  DbOpeningHour,
  DbPlace,
  DbPlaceVisit,
  DbReservation,
  DbZone,
} from '@/types/database';

/* -------------------------------------------------------------------------- */
/* CRUD de Categorías (/api/v1/categories)                                    */
/* -------------------------------------------------------------------------- */

export const listCategories = (options?: ListQueryOptions) =>
  listRecords<DbCategory>('categories', options);
export const getCategory = (id: string) => getRecord<DbCategory>('categories', id);
export const createCategory = (payload: Partial<DbCategory>) =>
  createRecord<DbCategory>('categories', payload as Record<string, unknown>);
export const updateCategory = (id: string, payload: Partial<DbCategory>) =>
  updateRecord<DbCategory>('categories', id, payload as Record<string, unknown>);
export const deleteCategory = (id: string) => deleteRecord('categories', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Zonas (/api/v1/zones)                                              */
/* -------------------------------------------------------------------------- */

export const listZones = (options?: ListQueryOptions) =>
  listRecords<DbZone>('zones', options);
export const getZone = (id: string) => getRecord<DbZone>('zones', id);
export const createZone = (payload: Partial<DbZone>) =>
  createRecord<DbZone>('zones', payload as Record<string, unknown>);
export const updateZone = (id: string, payload: Partial<DbZone>) =>
  updateRecord<DbZone>('zones', id, payload as Record<string, unknown>);
export const deleteZone = (id: string) => deleteRecord('zones', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Negocios y Verificaciones (/api/v1/businesses y /business-verifications) */
/* -------------------------------------------------------------------------- */

export const listBusinesses = (
  filters?: { owner_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbBusiness>('businesses', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getBusiness = (id: string) => getRecord<DbBusiness>('businesses', id);
export const createBusiness = (payload: Partial<DbBusiness>) =>
  createRecord<DbBusiness>('businesses', payload as Record<string, unknown>);
export const updateBusiness = (id: string, payload: Partial<DbBusiness>) =>
  updateRecord<DbBusiness>('businesses', id, payload as Record<string, unknown>);
export const deleteBusiness = (id: string) => deleteRecord('businesses', id);

export const listBusinessVerifications = (
  filters?: { business_id?: string; reviewer_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbBusinessVerification>('business-verifications', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getBusinessVerification = (id: string) =>
  getRecord<DbBusinessVerification>('business-verifications', id);
export const createBusinessVerification = (payload: Partial<DbBusinessVerification>) =>
  createRecord<DbBusinessVerification>(
    'business-verifications',
    payload as Record<string, unknown>,
  );
export const updateBusinessVerification = (
  id: string,
  payload: Partial<DbBusinessVerification>,
) =>
  updateRecord<DbBusinessVerification>(
    'business-verifications',
    id,
    payload as Record<string, unknown>,
  );
export const deleteBusinessVerification = (id: string) =>
  deleteRecord('business-verifications', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Campañas y Eventos (/api/v1/campaigns y /campaign-events)          */
/* -------------------------------------------------------------------------- */

export const listCampaigns = (
  filters?: { business_id?: string; category_id?: string; zone_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbCampaign>('campaigns', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getCampaign = (id: string) => getRecord<DbCampaign>('campaigns', id);
export const createCampaign = (payload: Partial<DbCampaign>) =>
  createRecord<DbCampaign>('campaigns', payload as Record<string, unknown>);
export const updateCampaign = (id: string, payload: Partial<DbCampaign>) =>
  updateRecord<DbCampaign>('campaigns', id, payload as Record<string, unknown>);
export const deleteCampaign = (id: string) => deleteRecord('campaigns', id);

export const listCampaignEvents = (
  filters?: { campaign_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbCampaignEvent>('campaign-events', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getCampaignEvent = (id: string) =>
  getRecord<DbCampaignEvent>('campaign-events', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Experiencias y Reservas RPC (/api/v1/experiences y /reservations)  */
/* -------------------------------------------------------------------------- */

export const listExperiences = (
  filters?: { place_id?: string; business_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbExperience>('experiences', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getExperience = (id: string) => getRecord<DbExperience>('experiences', id);
export const createExperience = (payload: Partial<DbExperience>) =>
  createRecord<DbExperience>('experiences', payload as Record<string, unknown>);
export const updateExperience = (id: string, payload: Partial<DbExperience>) =>
  updateRecord<DbExperience>('experiences', id, payload as Record<string, unknown>);
export const deleteExperience = (id: string) => deleteRecord('experiences', id);

export const listReservations = (
  filters?: { experience_id?: string; user_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbReservation>('reservations', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getReservation = (id: string) => getRecord<DbReservation>('reservations', id);

/**
 * Reserva atómica mediante el RPC book_experience(experience, people, request_key)
 * en POST /api/v1/experiences/{experience_id}/reserve.
 */
export async function reserveExperience(
  experienceId: string,
  people: number,
  requestKey?: string,
): Promise<unknown> {
  const payload: BookExperienceRequestPayload = {
    people: Math.max(1, Math.round(people)),
    request_key: requestKey ?? generateUuid(),
  };
  return httpRequest<unknown>(
    `/experiences/${encodeURIComponent(experienceId)}/reserve`,
    {
      method: 'POST',
      body: payload,
      authenticated: true,
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Adaptadores de Dominio para Pantallas de Catálogos, Negocio y VIP          */
/* -------------------------------------------------------------------------- */

export function mapCategorySlugToPlaceCategory(slugOrName: string): PlaceCategory {
  const normalized = slugOrName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (
    normalized.includes('gastro') ||
    normalized.includes('cafe') ||
    normalized.includes('comida') ||
    normalized.includes('restauran')
  ) {
    return 'gastronomia';
  }
  if (
    normalized.includes('natur') ||
    normalized.includes('mirador') ||
    normalized.includes('parque') ||
    normalized.includes('aire')
  ) {
    return 'naturaleza';
  }
  return 'cultura';
}

function mapCampaignStatus(rawStatus: string): CampaignState {
  const normalized = rawStatus.toLowerCase();
  if (normalized.includes('pause') || normalized.includes('pausa')) return 'Pausada';
  if (normalized.includes('end') || normalized.includes('final') || normalized.includes('closed'))
    return 'Finalizada';
  return 'Activa';
}

function formatDateRange(startsAt?: string, endsAt?: string): string {
  if (!startsAt && !endsAt) return 'Periodo vigente';
  const fmt = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
    return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short' });
  };
  return `${fmt(startsAt)} al ${fmt(endsAt)}`.trim();
}

export async function fetchZonesCatalog(): Promise<{
  zones: DbZone[];
  pointsByName: Record<string, { latitude: number; longitude: number; id?: string }>;
}> {
  try {
    const zones = await listZones({ limit: 50 });
    const pointsByName: Record<string, { latitude: number; longitude: number; id?: string }> = {};
    for (const z of zones) {
      if (Number.isFinite(Number(z.latitude)) && Number.isFinite(Number(z.longitude))) {
        pointsByName[z.name] = {
          latitude: Number(z.latitude),
          longitude: Number(z.longitude),
          id: z.id,
        };
      }
    }
    return { zones, pointsByName };
  } catch {
    return { zones: [], pointsByName: {} };
  }
}

export async function fetchCategoriesCatalog(): Promise<DbCategory[]> {
  try {
    return await listCategories({ limit: 50 });
  } catch {
    return [];
  }
}

export async function fetchBusinessDashboardData(): Promise<{
  business: DbBusiness | null;
  place: DbPlace | null;
  profile: BusinessProfile;
  stats: BusinessStats;
  campaigns: Campaign[];
  rawCampaigns: DbCampaign[];
  notifications: BusinessNotification[];
}> {
  try {
    const userId = await getCurrentUserId();
    let businesses = userId
      ? await listBusinesses({ owner_id: userId }, { limit: 10 }).catch(() => [] as DbBusiness[])
      : [];
    if (!businesses.length) {
      businesses = await listBusinesses(undefined, { limit: 10 });
    }

    const activeBusiness = businesses[0] ?? null;
    const businessId = activeBusiness?.id;

    const [places, campaigns, events, visits, redemptions, notifications] = await Promise.all([
      listRecords<DbPlace>('places', {
        limit: 20,
        filters: businessId ? { business_id: businessId } : undefined,
      }).catch(() => [] as DbPlace[]),
      listCampaigns(businessId ? { business_id: businessId } : undefined, { limit: 30 }).catch(
        () => [] as DbCampaign[],
      ),
      listCampaignEvents(undefined, { limit: 100 }).catch(() => [] as DbCampaignEvent[]),
      listRecords<DbPlaceVisit>('place-visits', { limit: 100 }).catch(() => [] as DbPlaceVisit[]),
      listRecords<DbCouponRedemption>('coupon-redemptions', { limit: 100 }).catch(
        () => [] as DbCouponRedemption[],
      ),
      listRecords<DbNotification>('notifications', {
        limit: 20,
        filters: userId ? { user_id: userId } : undefined,
      }).catch(() => [] as DbNotification[]),
    ]);

    const mainPlace = places[0] ?? null;
    let hoursLabel = businessMock.businessProfile.hours;
    if (mainPlace) {
      const opening = await listRecords<DbOpeningHour>('opening-hours', {
        limit: 10,
        filters: { place_id: mainPlace.id },
      }).catch(() => [] as DbOpeningHour[]);
      if (opening.length > 0) {
        hoursLabel = `${opening[0].opens_at.slice(0, 5)} a ${opening[0].closes_at.slice(0, 5)}`;
      }
    }

    const profile: BusinessProfile = mainPlace
      ? {
          name: activeBusiness?.name || mainPlace.name,
          address: mainPlace.address,
          hours: hoursLabel,
          description: mainPlace.description,
          services: Array.isArray(mainPlace.services) && mainPlace.services.length
            ? mainPlace.services
            : businessMock.businessProfile.services,
        }
      : activeBusiness
        ? {
            ...businessMock.businessProfile,
            name: activeBusiness.name,
          }
        : businessMock.businessProfile;

    const mappedCampaigns: Campaign[] = campaigns.length
      ? campaigns.map((c) => {
          const cEvents = events.filter((e) => e.campaign_id === c.id);
          const viewsCount = cEvents.length || 120;
          const budgetNum = Number(c.budget) || 100;
          return {
            id: c.id,
            title: c.title,
            state: mapCampaignStatus(c.status),
            spent: Math.min(budgetNum, Math.round(budgetNum * 0.65)),
            budget: budgetNum,
            period: formatDateRange(c.starts_at, c.ends_at),
            views: viewsCount,
            space: c.placement || 'Inicio patrocinado',
          };
        })
      : businessMock.campaigns;

    const stats: BusinessStats = {
      views: events.length ? events.length * 18 : businessMock.businessStats.views,
      localVisits: visits.length || businessMock.businessStats.localVisits,
      couponsRedeemed: redemptions.length || businessMock.businessStats.couponsRedeemed,
      peakLabel: businessMock.businessStats.peakLabel,
      hourly: businessMock.businessStats.hourly,
    };

    const mappedNotifications: BusinessNotification[] = notifications.length
      ? notifications.slice(0, 10).map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          kind: n.kind.toLowerCase().includes('promo')
            ? 'canje'
            : n.kind.toLowerCase().includes('camp')
              ? 'campana'
              : 'soporte',
        }))
      : businessMock.businessNotifications;

    return {
      business: activeBusiness,
      place: mainPlace,
      profile,
      stats,
      campaigns: mappedCampaigns,
      rawCampaigns: campaigns,
      notifications: mappedNotifications,
    };
  } catch {
    return {
      business: null,
      place: null,
      profile: businessMock.businessProfile,
      stats: businessMock.businessStats,
      campaigns: businessMock.campaigns,
      rawCampaigns: [],
      notifications: businessMock.businessNotifications,
    };
  }
}

export async function fetchVipExperienceCatalog(): Promise<{
  experiences: VipExperience[];
  rawExperiences: DbExperience[];
  reservations: DbReservation[];
}> {
  try {
    const userId = await getCurrentUserId();
    const [exps, resvs] = await Promise.all([
      listExperiences(undefined, { limit: 30 }).catch(() => [] as DbExperience[]),
      listReservations(userId ? { user_id: userId } : undefined, { limit: 30 }).catch(
        () => [] as DbReservation[],
      ),
    ]);

    if (!exps.length) {
      return {
        experiences: [vipMock.experience],
        rawExperiences: [],
        reservations: resvs,
      };
    }

    const mapped: VipExperience[] = exps.map((e) => {
      const d = new Date(e.starts_at);
      const validDate = !Number.isNaN(d.getTime());
      return {
        id: e.id,
        name: e.title,
        date: validDate
          ? d.toLocaleDateString('es-BO', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })
          : vipMock.experience.date,
        time: validDate
          ? d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
          : vipMock.experience.time,
        duration: e.description || vipMock.experience.duration,
        slots: Number(e.capacity) || vipMock.experience.slots,
        pricePerPerson: Number(e.price_per_person) || vipMock.experience.pricePerPerson,
        cancellationPolicy: e.vip_only
          ? 'Exclusivo miembros VIP · Cancelación sin costo hasta 24 h antes.'
          : vipMock.experience.cancellationPolicy,
      };
    });

    return {
      experiences: mapped,
      rawExperiences: exps,
      reservations: resvs,
    };
  } catch {
    return {
      experiences: [vipMock.experience],
      rawExperiences: [],
      reservations: [],
    };
  }
}

export const catalogosService = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  listZones,
  getZone,
  createZone,
  updateZone,
  deleteZone,
  listBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  listBusinessVerifications,
  getBusinessVerification,
  createBusinessVerification,
  updateBusinessVerification,
  deleteBusinessVerification,
  listCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  listCampaignEvents,
  getCampaignEvent,
  listExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  listReservations,
  getReservation,
  reserveExperience,
  fetchZonesCatalog,
  fetchCategoriesCatalog,
  fetchBusinessDashboardData,
  fetchVipExperienceCatalog,
};
