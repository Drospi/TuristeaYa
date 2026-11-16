/**
 * Tipos de base de datos y mapeo de esquema sincronizados con el backend
 * https://backend-turisteaya.onrender.com/ y Supabase (xjdiwevkbcvakmqjyzuv).
 */

export const TABLE_COLUMNS = {
  audit_logs: ['id', 'actor_id', 'action', 'entity', 'entity_id', 'details', 'created_at'],
  business_verifications: [
    'id',
    'business_id',
    'responsible_name',
    'contact_email',
    'document_path',
    'status',
    'reviewer_id',
    'review_notes',
    'reviewed_at',
    'created_at',
  ],
  businesses: ['id', 'owner_id', 'name', 'contact_email', 'phone', 'created_at'],
  campaign_events: ['id', 'campaign_id', 'kind', 'occurred_at', 'created_at'],
  campaigns: [
    'id',
    'business_id',
    'title',
    'ad_text',
    'placement',
    'budget',
    'starts_at',
    'ends_at',
    'zone_id',
    'category_id',
    'radius_meters',
    'status',
    'created_at',
  ],
  categories: ['id', 'name', 'slug', 'created_at'],
  coupon_redemptions: [
    'id',
    'user_id',
    'promotion_id',
    'idempotency_key',
    'savings',
    'redeemed_at',
    'created_at',
  ],
  experiences: [
    'id',
    'business_id',
    'place_id',
    'title',
    'description',
    'starts_at',
    'price_per_person',
    'capacity',
    'vip_only',
    'published',
    'created_at',
  ],
  moderation_actions: ['id', 'review_id', 'moderator_id', 'action', 'reason', 'created_at'],
  notifications: [
    'id',
    'user_id',
    'title',
    'body',
    'kind',
    'ticket_id',
    'read_at',
    'created_at',
  ],
  offline_downloads: ['id', 'user_id', 'route_id', 'snapshot', 'version', 'created_at'],
  opening_hours: ['id', 'place_id', 'weekday', 'opens_at', 'closes_at', 'created_at'],
  place_categories: ['id', 'place_id', 'category_id', 'created_at'],
  place_media: ['id', 'place_id', 'storage_path', 'kind', 'position', 'created_at'],
  place_visits: ['id', 'user_id', 'place_id', 'visited_at', 'created_at'],
  places: [
    'id',
    'business_id',
    'zone_id',
    'name',
    'description',
    'address',
    'latitude',
    'longitude',
    'estimated_cost',
    'visit_minutes',
    'services',
    'published',
    'created_at',
  ],
  profiles: [
    'id',
    'full_name',
    'avatar_url',
    'phone',
    'terms_accepted_at',
    'home_lat',
    'home_lng',
    'created_at',
  ],
  promotions: [
    'id',
    'business_id',
    'place_id',
    'title',
    'code',
    'discount_percent',
    'starts_at',
    'ends_at',
    'max_redemptions',
    'per_user_limit',
    'conditions',
    'status',
    'created_at',
  ],
  reservations: [
    'id',
    'user_id',
    'experience_id',
    'participants',
    'total',
    'status',
    'idempotency_key',
    'created_at',
  ],
  review_media: ['id', 'review_id', 'storage_path', 'created_at'],
  review_replies: ['id', 'review_id', 'business_id', 'body', 'created_at'],
  reviews: ['id', 'user_id', 'place_id', 'rating', 'body', 'hidden', 'created_at'],
  route_stops: [
    'id',
    'route_id',
    'place_id',
    'position',
    'arrival_at',
    'visit_minutes',
    'travel_minutes',
    'travel_meters',
    'estimated_cost',
    'created_at',
  ],
  routes: [
    'id',
    'user_id',
    'name',
    'budget',
    'available_minutes',
    'origin_lat',
    'origin_lng',
    'zone_id',
    'category_id',
    'preference',
    'visibility',
    'share_slug',
    'created_at',
  ],
  saved_routes: ['id', 'user_id', 'route_id', 'visited_at', 'created_at'],
  subscription_plans: ['id', 'name', 'price', 'currency', 'period_days', 'created_at'],
  subscriptions: ['id', 'user_id', 'plan_id', 'starts_at', 'ends_at', 'status', 'created_at'],
  ticket_messages: ['id', 'ticket_id', 'sender_id', 'body', 'attachment_path', 'created_at'],
  tickets: [
    'id',
    'user_id',
    'place_id',
    'route_id',
    'redemption_id',
    'review_id',
    'subject',
    'description',
    'kind',
    'priority',
    'status',
    'assigned_to',
    'created_at',
  ],
  user_access: ['id', 'user_id', 'role', 'status', 'created_at'],
  user_interests: ['id', 'user_id', 'category_id', 'created_at'],
  zones: ['id', 'name', 'city', 'country_code', 'latitude', 'longitude', 'created_at'],
} as const;

export const FOREIGN_KEY_COLUMNS: Record<string, readonly string[]> = {
  audit_logs: ['actor_id'],
  business_verifications: ['business_id', 'reviewer_id'],
  businesses: ['owner_id'],
  campaign_events: ['campaign_id'],
  campaigns: ['business_id', 'category_id', 'zone_id'],
  coupon_redemptions: ['promotion_id', 'user_id'],
  experiences: ['place_id', 'business_id'],
  moderation_actions: ['moderator_id', 'review_id'],
  notifications: ['ticket_id', 'user_id'],
  offline_downloads: ['route_id', 'user_id'],
  opening_hours: ['place_id'],
  place_categories: ['category_id', 'place_id'],
  place_media: ['place_id'],
  place_visits: ['place_id', 'user_id'],
  places: ['business_id', 'zone_id'],
  promotions: ['place_id', 'business_id'],
  reservations: ['experience_id', 'user_id'],
  review_media: ['review_id'],
  review_replies: ['business_id', 'review_id'],
  reviews: ['place_id', 'user_id'],
  route_stops: ['place_id', 'route_id'],
  routes: ['category_id', 'user_id', 'zone_id'],
  saved_routes: ['route_id', 'user_id'],
  subscriptions: ['plan_id', 'user_id'],
  ticket_messages: ['sender_id', 'ticket_id'],
  tickets: ['assigned_to', 'place_id', 'redemption_id', 'review_id', 'route_id', 'user_id'],
  user_access: ['user_id'],
  user_interests: ['category_id', 'user_id'],
} as const;

export const READONLY_COLUMNS = new Set(['id', 'created_at']);

/** Mapeo central URL kebab-case -> tabla PostgreSQL snake_case (las 32 tablas). */
export const RESOURCE_TABLE_MAP = {
  profiles: 'profiles',
  'user-access': 'user_access',
  categories: 'categories',
  zones: 'zones',
  'user-interests': 'user_interests',
  businesses: 'businesses',
  places: 'places',
  'place-categories': 'place_categories',
  'opening-hours': 'opening_hours',
  'place-media': 'place_media',
  routes: 'routes',
  'route-stops': 'route_stops',
  'saved-routes': 'saved_routes',
  reviews: 'reviews',
  'review-media': 'review_media',
  'review-replies': 'review_replies',
  'subscription-plans': 'subscription_plans',
  subscriptions: 'subscriptions',
  'offline-downloads': 'offline_downloads',
  promotions: 'promotions',
  'coupon-redemptions': 'coupon_redemptions',
  experiences: 'experiences',
  reservations: 'reservations',
  campaigns: 'campaigns',
  'campaign-events': 'campaign_events',
  'place-visits': 'place_visits',
  'business-verifications': 'business_verifications',
  tickets: 'tickets',
  'ticket-messages': 'ticket_messages',
  notifications: 'notifications',
  'moderation-actions': 'moderation_actions',
  'audit-logs': 'audit_logs',
} as const;

export type ResourceEndpoint = keyof typeof RESOURCE_TABLE_MAP;
export type DatabaseTableName = (typeof RESOURCE_TABLE_MAP)[ResourceEndpoint];

/* -------------------------------------------------------------------------- */
/* Auth Schemas (/api/v1/auth/* y /api/v1/me)                                 */
/* -------------------------------------------------------------------------- */

export interface RegisterRequestPayload {
  email: string;
  password: string;
  full_name: string;
  accept_terms: boolean;
}

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface RefreshRequestPayload {
  refresh_token: string;
}

export interface LogoutRequestPayload {
  refresh_token?: string | null;
}

export interface TokenResponsePayload {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: Record<string, unknown>;
}

export interface RegisterPendingResponsePayload {
  message: string;
  user: Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/* RPC Action Schemas (/api/v1/promotions/{id}/redeem y /experiences/{id}/reserve) */
/* -------------------------------------------------------------------------- */

export interface RedeemCouponRequestPayload {
  request_key: string;
  purchase_amount: number;
}

export interface BookExperienceRequestPayload {
  people: number;
  request_key: string;
}

/* -------------------------------------------------------------------------- */
/* Database Row Interfaces (32 tablas del esquema public en Supabase)         */
/* -------------------------------------------------------------------------- */

export interface DbProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  terms_accepted_at: string | null;
  home_lat: number | null;
  home_lng: number | null;
  created_at: string;
}

export interface DbUserAccess {
  id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface DbZone {
  id: string;
  name: string;
  city: string;
  country_code: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface DbUserInterest {
  id: string;
  user_id: string;
  category_id: string;
  created_at: string;
}

export interface DbBusiness {
  id: string;
  owner_id: string;
  name: string;
  contact_email: string | null;
  phone: string | null;
  created_at: string;
}

export interface DbPlace {
  id: string;
  business_id: string | null;
  zone_id: string | null;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  estimated_cost: number;
  visit_minutes: number;
  services: string[];
  published: boolean;
  created_at: string;
}

export interface DbPlaceCategory {
  id: string;
  place_id: string;
  category_id: string;
  created_at: string;
}

export interface DbOpeningHour {
  id: string;
  place_id: string;
  weekday: number;
  opens_at: string;
  closes_at: string;
  created_at: string;
}

export interface DbPlaceMedia {
  id: string;
  place_id: string;
  storage_path: string;
  kind: string;
  position: number;
  created_at: string;
}

export interface DbRoute {
  id: string;
  user_id: string;
  name: string;
  budget: number;
  available_minutes: number;
  origin_lat: number | null;
  origin_lng: number | null;
  zone_id: string | null;
  category_id: string | null;
  preference: string;
  visibility: string;
  share_slug: string;
  created_at: string;
}

export interface DbRouteStop {
  id: string;
  route_id: string;
  place_id: string;
  position: number;
  arrival_at: string | null;
  visit_minutes: number;
  travel_minutes: number;
  travel_meters: number;
  estimated_cost: number;
  created_at: string;
}

export interface DbSavedRoute {
  id: string;
  user_id: string;
  route_id: string;
  visited_at: string | null;
  created_at: string;
}

export interface DbReview {
  id: string;
  user_id: string;
  place_id: string;
  rating: number;
  body: string;
  hidden: boolean;
  created_at: string;
}

export interface DbReviewMedia {
  id: string;
  review_id: string;
  storage_path: string;
  created_at: string;
}

export interface DbReviewReply {
  id: string;
  review_id: string;
  business_id: string;
  body: string;
  created_at: string;
}

export interface DbSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period_days: number;
  created_at: string;
}

export interface DbSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  created_at: string;
}

export interface DbOfflineDownload {
  id: string;
  user_id: string;
  route_id: string;
  snapshot: Record<string, unknown>;
  version: number;
  created_at: string;
}

export interface DbPromotion {
  id: string;
  business_id: string;
  place_id: string;
  title: string;
  code: string;
  discount_percent: number;
  starts_at: string;
  ends_at: string;
  max_redemptions: number;
  per_user_limit: number;
  conditions: string;
  status: string;
  created_at: string;
}

export interface DbCouponRedemption {
  id: string;
  user_id: string;
  promotion_id: string;
  idempotency_key: string;
  savings: number;
  redeemed_at: string;
  created_at: string;
}

export interface DbExperience {
  id: string;
  business_id: string;
  place_id: string;
  title: string;
  description: string;
  starts_at: string;
  price_per_person: number;
  capacity: number;
  vip_only: boolean;
  published: boolean;
  created_at: string;
}

export interface DbReservation {
  id: string;
  user_id: string;
  experience_id: string;
  participants: number;
  total: number;
  status: string;
  idempotency_key: string;
  created_at: string;
}

export interface DbCampaign {
  id: string;
  business_id: string;
  title: string;
  ad_text: string;
  placement: string;
  budget: number;
  starts_at: string;
  ends_at: string;
  zone_id: string | null;
  category_id: string | null;
  radius_meters: number;
  status: string;
  created_at: string;
}

export interface DbCampaignEvent {
  id: string;
  campaign_id: string;
  kind: string;
  occurred_at: string;
  created_at: string;
}

export interface DbPlaceVisit {
  id: string;
  user_id: string;
  place_id: string;
  visited_at: string;
  created_at: string;
}

export interface DbBusinessVerification {
  id: string;
  business_id: string;
  responsible_name: string;
  contact_email: string;
  document_path: string;
  status: string;
  reviewer_id: string | null;
  review_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface DbTicket {
  id: string;
  user_id: string;
  place_id: string | null;
  route_id: string | null;
  redemption_id: string | null;
  review_id: string | null;
  subject: string;
  description: string;
  kind: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  created_at: string;
}

export interface DbTicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  body: string;
  attachment_path: string | null;
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  kind: string;
  ticket_id: string | null;
  read_at: string | null;
  created_at: string;
}

export interface DbModerationAction {
  id: string;
  review_id: string;
  moderator_id: string;
  action: string;
  reason: string;
  created_at: string;
}

export interface DbAuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}
