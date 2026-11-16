import * as admin from './mock/admin';
import * as business from './mock/business';
import * as coupons from './mock/coupons';
import * as notifications from './mock/notifications';
import * as places from './mock/places';
import * as routes from './mock/routes';
import * as support from './mock/support';
import * as user from './mock/user';
import * as vip from './mock/vip';
import {
  fetchAdminDashboardData,
  fetchAppNotifications,
  fetchCurrentUserSummary,
  fetchSupportTickets,
  fetchUserSupportHistory,
} from './usuarios.service';
import {
  fetchBusinessDashboardData,
  fetchVipExperienceCatalog,
} from './catalogos.service';
import {
  fetchAllPlacesForApi,
  fetchPlaceReviewsList,
} from './lugares.service';
import {
  fetchOfflineDownloadsCatalog,
  fetchTourRoutesCatalog,
} from './rutas.service';
import {
  fetchBusinessPromotions,
  fetchCouponById,
  fetchCouponsCatalog,
  fetchVipBenefitHistory,
} from './cupones.service';
import type {
  AppNotification,
  AuditEntry,
  BenefitHistoryEntry,
  BusinessNotification,
  BusinessProfile,
  BusinessStats,
  Campaign,
  Coupon,
  ManagedUser,
  OfflineRoute,
  Place,
  PlatformStats,
  Promotion,
  RelatedActivity,
  ReportedReview,
  Review,
  SecurityAlert,
  Ticket,
  TourRoute,
  User,
  UserHistoryEntry,
  VerificationRequest,
  VipExperience,
} from '@/types';

export * from './http';
export * as usuariosService from './usuarios.service';
export * as catalogosService from './catalogos.service';
export * as lugaresService from './lugares.service';
export * as rutasService from './rutas.service';
export * as cuponesService from './cupones.service';

/**
 * Interfaz central de datos de TuristeaYA conectada al backend
 * https://backend-turisteaya.onrender.com/api/v1 (Supabase Project: xjdiwevkbcvakmqjyzuv)
 * con respaldo resiliente en datos locales.
 */
export interface ApiService {
  getPlaces(): Promise<Place[]>;
  getPlace(id: string): Promise<Place | undefined>;
  getReviews(placeId: string): Promise<Review[]>;
  getRoutes(): Promise<TourRoute[]>;
  getRoute(id: string): Promise<TourRoute | undefined>;
  getCoupons(): Promise<Coupon[]>;
  getCoupon(id: string): Promise<Coupon | undefined>;
  getNotifications(): Promise<AppNotification[]>;
  getUser(): Promise<User>;
  getOfflineRoutes(): Promise<OfflineRoute[]>;
  getVipExperience(): Promise<VipExperience>;
  getBenefitHistory(): Promise<BenefitHistoryEntry[]>;
  getBusinessProfile(): Promise<BusinessProfile>;
  getBusinessStats(): Promise<BusinessStats>;
  getPromotions(): Promise<Promotion[]>;
  getBusinessCampaigns(): Promise<Campaign[]>;
  getBusinessNotifications(): Promise<BusinessNotification[]>;
  getTickets(): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  getUserHistory(): Promise<UserHistoryEntry[]>;
  getRelatedActivity(): Promise<RelatedActivity[]>;
  getPlatformStats(): Promise<PlatformStats>;
  getManagedUsers(): Promise<ManagedUser[]>;
  getVerificationRequest(): Promise<VerificationRequest>;
  getReportedReview(): Promise<ReportedReview>;
  getSecurityAlerts(): Promise<SecurityAlert[]>;
  getAuditEntries(): Promise<AuditEntry[]>;
}

export const api: ApiService = {
  getPlaces: async () => {
    const list = await fetchAllPlacesForApi().catch(() => []);
    return list.length > 0 ? list : places.places;
  },
  getPlace: async (id) => {
    const list = await fetchAllPlacesForApi().catch(() => []);
    return (
      list.find((place) => place.id === id) ??
      places.places.find((place) => place.id === id)
    );
  },
  getReviews: async (placeId) => {
    const list = await fetchPlaceReviewsList(placeId).catch(() => []);
    return list.length > 0 ? list : (places.reviewsByPlace[placeId] ?? []);
  },
  getRoutes: async () => {
    const list = await fetchTourRoutesCatalog().catch(() => []);
    return list.length > 0 ? list : routes.routes;
  },
  getRoute: async (id) => {
    const list = await fetchTourRoutesCatalog().catch(() => []);
    return (
      list.find((route) => route.id === id) ??
      routes.routes.find((route) => route.id === id)
    );
  },
  getCoupons: () => fetchCouponsCatalog().catch(() => coupons.coupons),
  getCoupon: (id) =>
    fetchCouponById(id).catch(() =>
      coupons.coupons.find((coupon) => coupon.id === id),
    ),
  getNotifications: () =>
    fetchAppNotifications().catch(() => notifications.notifications),
  getUser: async () => {
    const summary = await fetchCurrentUserSummary().catch(() => null);
    return summary?.user ?? user.user;
  },
  getOfflineRoutes: () =>
    fetchOfflineDownloadsCatalog().catch(() => vip.offlineRoutes),
  getVipExperience: async () => {
    const data = await fetchVipExperienceCatalog().catch(() => null);
    return data?.experiences[0] ?? vip.experience;
  },
  getBenefitHistory: () =>
    fetchVipBenefitHistory().catch(() => vip.benefitHistory),
  getBusinessProfile: async () => {
    const data = await fetchBusinessDashboardData().catch(() => null);
    return data?.profile ?? business.businessProfile;
  },
  getBusinessStats: async () => {
    const data = await fetchBusinessDashboardData().catch(() => null);
    return data?.stats ?? business.businessStats;
  },
  getPromotions: () =>
    fetchBusinessPromotions().catch(() => business.promotions),
  getBusinessCampaigns: async () => {
    const data = await fetchBusinessDashboardData().catch(() => null);
    return data?.campaigns ?? business.campaigns;
  },
  getBusinessNotifications: async () => {
    const data = await fetchBusinessDashboardData().catch(() => null);
    return data?.notifications ?? business.businessNotifications;
  },
  getTickets: () => fetchSupportTickets().catch(() => support.tickets),
  getTicket: async (id) => {
    const list = await fetchSupportTickets().catch(() => support.tickets);
    return list.find((ticket) => ticket.id === id);
  },
  getUserHistory: async () => {
    const data = await fetchUserSupportHistory().catch(() => null);
    return data?.history ?? support.userHistory;
  },
  getRelatedActivity: async () => {
    const data = await fetchUserSupportHistory().catch(() => null);
    return data?.related ?? support.relatedActivity;
  },
  getPlatformStats: async () => {
    const data = await fetchAdminDashboardData().catch(() => null);
    return data?.stats ?? admin.platformStats;
  },
  getManagedUsers: async () => {
    const data = await fetchAdminDashboardData().catch(() => null);
    return data?.managedUsers ?? admin.managedUsers;
  },
  getVerificationRequest: async () => {
    const data = await fetchAdminDashboardData().catch(() => null);
    return data?.verificationRequest ?? admin.verificationRequest;
  },
  getReportedReview: async () => {
    const data = await fetchAdminDashboardData().catch(() => null);
    return data?.reportedReview ?? admin.reportedReview;
  },
  getSecurityAlerts: async () => {
    const data = await fetchAdminDashboardData().catch(() => null);
    return data?.securityAlerts ?? admin.securityAlerts;
  },
  getAuditEntries: async () => {
    const data = await fetchAdminDashboardData().catch(() => null);
    return data?.auditEntries ?? admin.auditEntries;
  },
};
