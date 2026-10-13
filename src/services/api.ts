import * as admin from './mock/admin';
import * as business from './mock/business';
import * as coupons from './mock/coupons';
import * as notifications from './mock/notifications';
import * as places from './mock/places';
import * as routes from './mock/routes';
import * as support from './mock/support';
import * as user from './mock/user';
import * as vip from './mock/vip';
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

/**
 * Interfaz de datos de la aplicación.
 *
 * Hoy se resuelve con datos de demostración (services/mock).
 * Cuando exista el backend, se implementa esta misma interfaz
 * con llamadas HTTP y las pantallas no cambian.
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

const resolve = <T,>(value: T): Promise<T> => Promise.resolve(value);

export const api: ApiService = {
  getPlaces: () => resolve(places.places),
  getPlace: (id) => resolve(places.places.find((place) => place.id === id)),
  getReviews: (placeId) => resolve(places.reviewsByPlace[placeId] ?? []),
  getRoutes: () => resolve(routes.routes),
  getRoute: (id) => resolve(routes.routes.find((route) => route.id === id)),
  getCoupons: () => resolve(coupons.coupons),
  getCoupon: (id) => resolve(coupons.coupons.find((coupon) => coupon.id === id)),
  getNotifications: () => resolve(notifications.notifications),
  getUser: () => resolve(user.user),
  getOfflineRoutes: () => resolve(vip.offlineRoutes),
  getVipExperience: () => resolve(vip.experience),
  getBenefitHistory: () => resolve(vip.benefitHistory),
  getBusinessProfile: () => resolve(business.businessProfile),
  getBusinessStats: () => resolve(business.businessStats),
  getPromotions: () => resolve(business.promotions),
  getBusinessCampaigns: () => resolve(business.campaigns),
  getBusinessNotifications: () => resolve(business.businessNotifications),
  getTickets: () => resolve(support.tickets),
  getTicket: (id) => resolve(support.tickets.find((ticket) => ticket.id === id)),
  getUserHistory: () => resolve(support.userHistory),
  getRelatedActivity: () => resolve(support.relatedActivity),
  getPlatformStats: () => resolve(admin.platformStats),
  getManagedUsers: () => resolve(admin.managedUsers),
  getVerificationRequest: () => resolve(admin.verificationRequest),
  getReportedReview: () => resolve(admin.reportedReview),
  getSecurityAlerts: () => resolve(admin.securityAlerts),
  getAuditEntries: () => resolve(admin.auditEntries),
};
