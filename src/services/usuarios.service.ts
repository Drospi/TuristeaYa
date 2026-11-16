import * as adminMock from './mock/admin';
import * as notificationsMock from './mock/notifications';
import * as supportMock from './mock/support';
import * as userMock from './mock/user';
import {
  clearSession,
  createRecord,
  deleteRecord,
  ensureSessionLoaded,
  getCurrentUserId,
  getRecord,
  httpRequest,
  listRecords,
  setSession,
  tokenResponseToSession,
  updateRecord,
  type ListQueryOptions,
  type StoredAuthSession,
} from './http';

import type {
  AppNotification,
  AuditEntry,
  ChatMessage,
  ManagedUser,
  NotificationKind,
  PlatformStats,
  RelatedActivity,
  ReportedReview,
  Role,
  SecurityAlert,
  Ticket,
  TicketPriority,
  TicketStatus,
  User,
  UserHistoryEntry,
  VerificationRequest,
} from '@/types';
import type {
  DbAuditLog,
  DbBusiness,
  DbBusinessVerification,
  DbCategory,
  DbModerationAction,
  DbNotification,
  DbProfile,
  DbReview,
  DbSubscription,
  DbSubscriptionPlan,
  DbTicket,
  DbTicketMessage,
  DbUserAccess,
  DbUserInterest,
  LoginRequestPayload,
  LogoutRequestPayload,
  RefreshRequestPayload,
  RegisterPendingResponsePayload,
  RegisterRequestPayload,
  TokenResponsePayload,
} from '@/types/database';

/* -------------------------------------------------------------------------- */
/* Auth Endpoints (/api/v1/auth/* y /api/v1/me)                               */
/* -------------------------------------------------------------------------- */

export interface RegisterResult {
  requiresConfirmation: boolean;
  message?: string;
  session: StoredAuthSession | null;
}

export async function registerUser(payload: RegisterRequestPayload): Promise<RegisterResult> {
  const response = await httpRequest<TokenResponsePayload | RegisterPendingResponsePayload>(
    '/auth/register',
    {
      method: 'POST',
      body: payload,
      authenticated: false,
    },
  );

  if ('access_token' in response && typeof response.access_token === 'string') {
    const session = tokenResponseToSession(response, payload.email, payload.full_name);
    await setSession(session);
    return { requiresConfirmation: false, session };
  }

  const pending = response as RegisterPendingResponsePayload;
  return {
    requiresConfirmation: true,
    message:
      pending.message || 'Cuenta creada. Revisa tu correo electrónico para confirmar la cuenta.',
    session: null,
  };
}

export async function loginUser(payload: LoginRequestPayload): Promise<StoredAuthSession> {
  const response = await httpRequest<TokenResponsePayload>('/auth/login', {
    method: 'POST',
    body: payload,
    authenticated: false,
  });
  const session = tokenResponseToSession(response, payload.email);
  await setSession(session);
  return session;
}

export async function refreshUserSession(refreshToken?: string): Promise<StoredAuthSession> {
  const current = await ensureSessionLoaded();
  const tokenToUse = refreshToken ?? current?.refreshToken;
  if (!tokenToUse) {
    throw new Error('No hay refresh token disponible para renovar la sesión.');
  }

  const body: RefreshRequestPayload = { refresh_token: tokenToUse };
  const response = await httpRequest<TokenResponsePayload>('/auth/refresh', {
    method: 'POST',
    body,
    authenticated: false,
  });
  const session = tokenResponseToSession(response, current?.email, current?.fullName);
  await setSession(session);
  return session;
}

export async function logoutUser(): Promise<void> {
  const current = await ensureSessionLoaded();
  try {
    if (current?.accessToken) {
      const body: LogoutRequestPayload = current.refreshToken
        ? { refresh_token: current.refreshToken }
        : {};
      await httpRequest<void>('/auth/logout', {
        method: 'POST',
        body,
        authenticated: true,
        retryOn401: false,
      });
    }
  } finally {
    await clearSession();
  }
}

export async function getMe(): Promise<DbProfile> {
  return httpRequest<DbProfile>('/me', {
    method: 'GET',
    authenticated: true,
  });
}

/* -------------------------------------------------------------------------- */
/* CRUD de Perfiles (/api/v1/profiles)                                        */
/* -------------------------------------------------------------------------- */

export const listProfiles = (options?: ListQueryOptions) =>
  listRecords<DbProfile>('profiles', options);
export const getProfile = (id: string) => getRecord<DbProfile>('profiles', id);
export const createProfile = (payload: Partial<DbProfile>) =>
  createRecord<DbProfile>('profiles', payload as Record<string, unknown>);
export const updateProfile = (id: string, payload: Partial<DbProfile>) =>
  updateRecord<DbProfile>('profiles', id, payload as Record<string, unknown>);
export const deleteProfile = (id: string) => deleteRecord('profiles', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Accesos y Roles (/api/v1/user-access)                              */
/* -------------------------------------------------------------------------- */

export const listUserAccess = (userId?: string, options?: ListQueryOptions) =>
  listRecords<DbUserAccess>('user-access', {
    ...options,
    filters: { ...options?.filters, ...(userId ? { user_id: userId } : {}) },
  });
export const getUserAccess = (id: string) => getRecord<DbUserAccess>('user-access', id);
export const createUserAccess = (payload: Partial<DbUserAccess>) =>
  createRecord<DbUserAccess>('user-access', payload as Record<string, unknown>);
export const updateUserAccess = (id: string, payload: Partial<DbUserAccess>) =>
  updateRecord<DbUserAccess>('user-access', id, payload as Record<string, unknown>);
export const deleteUserAccess = (id: string) => deleteRecord('user-access', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Intereses del Usuario (/api/v1/user-interests)                     */
/* -------------------------------------------------------------------------- */

export const listUserInterests = (
  filters?: { user_id?: string; category_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbUserInterest>('user-interests', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getUserInterest = (id: string) => getRecord<DbUserInterest>('user-interests', id);
export const createUserInterest = (payload: { user_id: string; category_id: string }) =>
  createRecord<DbUserInterest>('user-interests', payload);
export const updateUserInterest = (id: string, payload: Partial<DbUserInterest>) =>
  updateRecord<DbUserInterest>('user-interests', id, payload as Record<string, unknown>);
export const deleteUserInterest = (id: string) => deleteRecord('user-interests', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Planes y Suscripciones (/api/v1/subscription-plans y /subscriptions) */
/* -------------------------------------------------------------------------- */

export const listSubscriptionPlans = (options?: ListQueryOptions) =>
  listRecords<DbSubscriptionPlan>('subscription-plans', options);
export const getSubscriptionPlan = (id: string) =>
  getRecord<DbSubscriptionPlan>('subscription-plans', id);
export const createSubscriptionPlan = (payload: Partial<DbSubscriptionPlan>) =>
  createRecord<DbSubscriptionPlan>('subscription-plans', payload as Record<string, unknown>);
export const updateSubscriptionPlan = (id: string, payload: Partial<DbSubscriptionPlan>) =>
  updateRecord<DbSubscriptionPlan>('subscription-plans', id, payload as Record<string, unknown>);
export const deleteSubscriptionPlan = (id: string) => deleteRecord('subscription-plans', id);

export const listSubscriptions = (
  filters?: { user_id?: string; plan_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbSubscription>('subscriptions', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getSubscription = (id: string) => getRecord<DbSubscription>('subscriptions', id);
export const createSubscription = (payload: Partial<DbSubscription>) =>
  createRecord<DbSubscription>('subscriptions', payload as Record<string, unknown>);
export const updateSubscription = (id: string, payload: Partial<DbSubscription>) =>
  updateRecord<DbSubscription>('subscriptions', id, payload as Record<string, unknown>);
export const deleteSubscription = (id: string) => deleteRecord('subscriptions', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Notificaciones (/api/v1/notifications)                             */
/* -------------------------------------------------------------------------- */

export const listNotifications = (
  filters?: { user_id?: string; ticket_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbNotification>('notifications', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getNotification = (id: string) => getRecord<DbNotification>('notifications', id);
export const createNotification = (payload: Partial<DbNotification>) =>
  createRecord<DbNotification>('notifications', payload as Record<string, unknown>);
export const updateNotification = (id: string, payload: Partial<DbNotification>) =>
  updateRecord<DbNotification>('notifications', id, payload as Record<string, unknown>);
export const deleteNotification = (id: string) => deleteRecord('notifications', id);

export const markNotificationRead = (id: string) =>
  updateNotification(id, { read_at: new Date().toISOString() });

/* -------------------------------------------------------------------------- */
/* CRUD de Tickets y Mensajes de Soporte (/api/v1/tickets y /ticket-messages) */
/* -------------------------------------------------------------------------- */

export const listTicketRecords = (
  filters?: {
    user_id?: string;
    place_id?: string;
    route_id?: string;
    redemption_id?: string;
    review_id?: string;
    assigned_to?: string;
  },
  options?: ListQueryOptions,
) =>
  listRecords<DbTicket>('tickets', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getTicketRecord = (id: string) => getRecord<DbTicket>('tickets', id);
export const createTicketRecord = (payload: Partial<DbTicket>) =>
  createRecord<DbTicket>('tickets', payload as Record<string, unknown>);
export const updateTicketRecord = (id: string, payload: Partial<DbTicket>) =>
  updateRecord<DbTicket>('tickets', id, payload as Record<string, unknown>);
export const deleteTicketRecord = (id: string) => deleteRecord('tickets', id);

export const listTicketMessages = (
  filters?: { ticket_id?: string; sender_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbTicketMessage>('ticket-messages', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getTicketMessage = (id: string) => getRecord<DbTicketMessage>('ticket-messages', id);
export const createTicketMessage = (payload: Partial<DbTicketMessage>) =>
  createRecord<DbTicketMessage>('ticket-messages', payload as Record<string, unknown>);
export const updateTicketMessage = (id: string, payload: Partial<DbTicketMessage>) =>
  updateRecord<DbTicketMessage>('ticket-messages', id, payload as Record<string, unknown>);
export const deleteTicketMessage = (id: string) => deleteRecord('ticket-messages', id);

/* -------------------------------------------------------------------------- */
/* CRUD de Moderación y Auditoría (/api/v1/moderation-actions y /audit-logs)  */
/* -------------------------------------------------------------------------- */

export const listModerationActions = (
  filters?: { review_id?: string; moderator_id?: string },
  options?: ListQueryOptions,
) =>
  listRecords<DbModerationAction>('moderation-actions', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getModerationAction = (id: string) =>
  getRecord<DbModerationAction>('moderation-actions', id);
export const createModerationAction = (payload: Partial<DbModerationAction>) =>
  createRecord<DbModerationAction>('moderation-actions', payload as Record<string, unknown>);
export const updateModerationAction = (id: string, payload: Partial<DbModerationAction>) =>
  updateRecord<DbModerationAction>('moderation-actions', id, payload as Record<string, unknown>);
export const deleteModerationAction = (id: string) => deleteRecord('moderation-actions', id);

export const listAuditLogs = (filters?: { actor_id?: string }, options?: ListQueryOptions) =>
  listRecords<DbAuditLog>('audit-logs', {
    ...options,
    filters: { ...options?.filters, ...filters },
  });
export const getAuditLog = (id: string) => getRecord<DbAuditLog>('audit-logs', id);

/* -------------------------------------------------------------------------- */
/* Adaptadores de Dominio para las Pantallas de Usuarios, Soporte y Admin     */
/* -------------------------------------------------------------------------- */

export function mapDbRoleToAppRole(rawRole?: string | null): Role {
  const normalized = (rawRole ?? '').toLowerCase();
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('support') || normalized.includes('soporte') || normalized.includes('mod'))
    return 'soporte';
  if (normalized.includes('business') || normalized.includes('negocio') || normalized.includes('owner'))
    return 'negocio';
  if (normalized.includes('vip')) return 'vip';
  return 'turista';
}

function mapNotificationKind(rawKind?: string | null): NotificationKind {
  const normalized = (rawKind ?? '').toLowerCase();
  if (normalized.includes('warn') || normalized.includes('alert') || normalized.includes('horario'))
    return 'warning';
  if (normalized.includes('promo') || normalized.includes('vip') || normalized.includes('coupon'))
    return 'promo';
  return 'info';
}

function mapTicketPriority(raw?: string | null): TicketPriority {
  const normalized = (raw ?? '').toLowerCase();
  if (normalized.includes('high') || normalized.includes('alta') || normalized.includes('urgent'))
    return 'Alta';
  if (normalized.includes('low') || normalized.includes('baja')) return 'Baja';
  return 'Media';
}

function mapTicketStatus(raw?: string | null): TicketStatus {
  const normalized = (raw ?? '').toLowerCase();
  if (normalized.includes('resuel') || normalized.includes('closed') || normalized.includes('resolved'))
    return 'Resuelto';
  if (normalized.includes('progres') || normalized.includes('curso') || normalized.includes('open'))
    return 'En curso';
  return 'Pendiente';
}

function formatShortDate(iso?: string | null): string {
  if (!iso) return 'Reciente';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short' });
}

function formatShortTime(iso?: string | null): string {
  if (!iso) return 'Ahora';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
}

export async function fetchCurrentUserSummary(): Promise<{
  user: User;
  profile: DbProfile | null;
  role: Role;
  subscription: DbSubscription | null;
}> {
  try {
    const session = await ensureSessionLoaded();
    let profile: DbProfile | null = null;

    if (session?.accessToken) {
      try {
        profile = await getMe();
      } catch {
        if (session.userId) {
          profile = await getProfile(session.userId).catch(() => null);
        }
      }
    }

    if (!profile) {
      const allProfiles = await listProfiles({ limit: 5 });
      profile = allProfiles[0] ?? null;
    }

    const userId = profile?.id ?? session?.userId ?? undefined;
    const [accessList, interestsList, categoriesList, subscriptionsList] = await Promise.all([
      listUserAccess(userId, { limit: 10 }).catch(() => [] as DbUserAccess[]),
      listUserInterests(userId ? { user_id: userId } : undefined, { limit: 20 }).catch(
        () => [] as DbUserInterest[],
      ),
      listRecords<DbCategory>('categories', { limit: 50 }).catch(() => [] as DbCategory[]),
      listSubscriptions(userId ? { user_id: userId } : undefined, { limit: 10 }).catch(
        () => [] as DbSubscription[],
      ),
    ]);

    const categoryMap = new Map(categoriesList.map((cat) => [cat.id, cat.name]));
    const interestNames = interestsList
      .map((item) => categoryMap.get(item.category_id))
      .filter((name): name is string => Boolean(name));

    const activeSub =
      subscriptionsList.find((sub) => sub.status.toLowerCase() === 'active') ??
      subscriptionsList[0] ??
      null;
    const accessRecord =
      accessList.find((a) => !userId || a.user_id === userId) ?? accessList[0] ?? null;
    const role = activeSub ? 'vip' : mapDbRoleToAppRole(accessRecord?.role);

    return {
      user: {
        name: profile?.full_name || session?.fullName || userMock.user.name,
        email: session?.email || `${(profile?.full_name || 'usuario').toLowerCase().replace(/\s+/g, '.')}@turisteaya.bo`,
        accountType: activeSub
          ? 'Suscripción VIP activa'
          : accessRecord?.role
            ? `Rol: ${accessRecord.role}`
            : userMock.user.accountType,
        interests: interestNames.length > 0 ? interestNames : userMock.user.interests,
      },
      profile,
      role,
      subscription: activeSub,
    };
  } catch {
    return {
      user: userMock.user,
      profile: null,
      role: 'turista',
      subscription: null,
    };
  }
}

export async function fetchAppNotifications(): Promise<AppNotification[]> {
  try {
    const userId = await getCurrentUserId();
    const rows = await listNotifications(userId ? { user_id: userId } : undefined, { limit: 30 });
    if (!rows.length) return notificationsMock.notifications;
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      body: row.body,
      kind: mapNotificationKind(row.kind),
    }));
  } catch {
    return notificationsMock.notifications;
  }
}

export async function fetchSupportTickets(): Promise<Ticket[]> {
  try {
    const [tickets, messages, profiles] = await Promise.all([
      listTicketRecords(undefined, { limit: 30 }),
      listTicketMessages(undefined, { limit: 100 }).catch(() => [] as DbTicketMessage[]),
      listProfiles({ limit: 50 }).catch(() => [] as DbProfile[]),
    ]);

    if (!tickets.length) return supportMock.tickets;

    const profileMap = new Map(profiles.map((p) => [p.id, p.full_name]));

    return tickets.map((t) => {
      const ticketMessages = messages.filter((m) => m.ticket_id === t.id);
      const chat: ChatMessage[] = ticketMessages.length
        ? ticketMessages.map((m) => ({
            id: m.id,
            author: m.sender_id === t.user_id ? 'user' : 'support',
            time: formatShortTime(m.created_at),
            text: m.body,
          }))
        : [
            {
              id: `${t.id}-init`,
              author: 'user',
              time: formatShortTime(t.created_at),
              text: t.description,
            },
          ];

      return {
        id: t.id,
        subject: t.subject,
        user: profileMap.get(t.user_id) ?? 'Usuario TuristeaYa',
        category: t.kind || 'Soporte',
        priority: mapTicketPriority(t.priority),
        status: mapTicketStatus(t.status),
        type: t.kind || 'Consulta',
        messagesCount: chat.length,
        verification: `${t.description}\nEstado actual: ${t.status}`,
        chat,
        draftReply: 'Hemos revisado tu caso y actualizado la información correspondiente.',
      };
    });
  } catch {
    return supportMock.tickets;
  }
}

export async function fetchUserSupportHistory(): Promise<{
  history: UserHistoryEntry[];
  related: RelatedActivity[];
}> {
  try {
    const tickets = await fetchSupportTickets();
    const history: UserHistoryEntry[] = tickets.slice(0, 10).map((t) => ({
      id: t.id,
      date: t.chat[0]?.time ?? 'Reciente',
      status: t.status,
      subject: t.subject,
      messages: t.messagesCount,
    }));
    const related: RelatedActivity[] = tickets.slice(0, 5).map((t) => ({
      id: `rel-${t.id}`,
      label: `Ticket #${t.id.slice(0, 6)} · ${t.category} · ${t.priority}`,
    }));
    return {
      history: history.length ? history : supportMock.userHistory,
      related: related.length ? related : supportMock.relatedActivity,
    };
  } catch {
    return {
      history: supportMock.userHistory,
      related: supportMock.relatedActivity,
    };
  }
}

export async function fetchAdminDashboardData(): Promise<{
  stats: PlatformStats;
  managedUsers: ManagedUser[];
  verificationRequest: VerificationRequest;
  verifications: DbBusinessVerification[];
  reportedReview: ReportedReview;
  securityAlerts: SecurityAlert[];
  auditEntries: AuditEntry[];
}> {
  try {
    const [profiles, accessList, businesses, verifications, reviews, moderations, tickets, audits] =
      await Promise.all([
        listProfiles({ limit: 100 }).catch(() => [] as DbProfile[]),
        listUserAccess(undefined, { limit: 100 }).catch(() => [] as DbUserAccess[]),
        listRecords<DbBusiness>('businesses', { limit: 100 }).catch(() => [] as DbBusiness[]),
        listRecords<DbBusinessVerification>('business-verifications', { limit: 50 }).catch(
          () => [] as DbBusinessVerification[],
        ),
        listRecords<DbReview>('reviews', { limit: 50 }).catch(() => [] as DbReview[]),
        listModerationActions(undefined, { limit: 50 }).catch(() => [] as DbModerationAction[]),
        listTicketRecords(undefined, { limit: 50 }).catch(() => [] as DbTicket[]),
        listAuditLogs(undefined, { limit: 50 }).catch(() => [] as DbAuditLog[]),
      ]);

    const profileMap = new Map(profiles.map((p) => [p.id, p]));
    const businessMap = new Map(businesses.map((b) => [b.id, b]));
    const accessByUser = new Map(accessList.map((a) => [a.user_id, a]));

    const managedUsers: ManagedUser[] = profiles.length
      ? profiles.slice(0, 25).map((p) => {
          const access = accessByUser.get(p.id);
          return {
            email: `${p.full_name.toLowerCase().replace(/\s+/g, '.')}@turisteaya.bo`,
            name: p.full_name,
            accountState: access?.status ? `Estado: ${access.status}` : 'Cuenta activa',
            currentRole: access?.role || 'turista',
          };
        })
      : adminMock.managedUsers;

    const firstVerification = verifications[0];
    const verificationRequest: VerificationRequest = firstVerification
      ? {
          businessName:
            businessMap.get(firstVerification.business_id)?.name ??
            firstVerification.responsible_name,
          owner: `${firstVerification.responsible_name} (${firstVerification.contact_email})`,
          receivedLabel: `Solicitud recibida el ${formatShortDate(firstVerification.created_at)} · Estado: ${firstVerification.status}`,
          observations:
            firstVerification.review_notes ||
            `Documento: ${firstVerification.document_path}`,
        }
      : adminMock.verificationRequest;

    const firstModeration = moderations[0];
    const hiddenReview = reviews.find((r) => r.hidden) ?? reviews[0];
    const reportedReview: ReportedReview = firstModeration
      ? {
          id: firstModeration.review_id.slice(0, 8),
          businessName: hiddenReview?.body ? `Reseña: "${hiddenReview.body.slice(0, 40)}"` : 'Reseña en moderación',
          reason: firstModeration.reason,
          decision: `Acción: ${firstModeration.action}`,
        }
      : adminMock.reportedReview;

    const auditEntries: AuditEntry[] = audits.length
      ? audits.slice(0, 20).map((a) => ({
          id: a.id,
          label: `${profileMap.get(a.actor_id ?? '')?.full_name ?? 'Sistema'} · ${a.action} en ${a.entity}`,
          time: `${formatShortDate(a.created_at)} ${formatShortTime(a.created_at)}`,
        }))
      : adminMock.auditEntries;

    const securityAlerts: SecurityAlert[] = audits.length
      ? audits
          .filter((a) => a.action.toLowerCase().includes('auth') || a.action.toLowerCase().includes('role') || a.action.toLowerCase().includes('mod'))
          .slice(0, 5)
          .map((a) => ({
            id: `sec-${a.id}`,
            label: `${a.action} (${a.entity})`,
            date: `${formatShortDate(a.created_at)} · ${formatShortTime(a.created_at)}`,
          }))
      : adminMock.securityAlerts;

    return {
      stats: {
        users: profiles.length || adminMock.platformStats.users,
        businesses: businesses.length || adminMock.platformStats.businesses,
        pendingReports:
          verifications.filter((v) => v.status.toLowerCase() === 'pending').length +
            moderations.length || adminMock.platformStats.pendingReports,
        openTickets:
          tickets.filter((t) => !t.status.toLowerCase().includes('closed')).length ||
          adminMock.platformStats.openTickets,
      },
      managedUsers,
      verificationRequest,
      verifications,
      reportedReview,
      securityAlerts: securityAlerts.length ? securityAlerts : adminMock.securityAlerts,
      auditEntries,
    };
  } catch {
    return {
      stats: adminMock.platformStats,
      managedUsers: adminMock.managedUsers,
      verificationRequest: adminMock.verificationRequest,
      verifications: [],
      reportedReview: adminMock.reportedReview,
      securityAlerts: adminMock.securityAlerts,
      auditEntries: adminMock.auditEntries,
    };
  }
}

export const usuariosService = {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  getMe,
  listProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  listUserAccess,
  getUserAccess,
  createUserAccess,
  updateUserAccess,
  deleteUserAccess,
  listUserInterests,
  getUserInterest,
  createUserInterest,
  updateUserInterest,
  deleteUserInterest,
  listSubscriptionPlans,
  getSubscriptionPlan,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  listSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  listNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  markNotificationRead,
  listTicketRecords,
  getTicketRecord,
  createTicketRecord,
  updateTicketRecord,
  deleteTicketRecord,
  listTicketMessages,
  getTicketMessage,
  createTicketMessage,
  updateTicketMessage,
  deleteTicketMessage,
  listModerationActions,
  getModerationAction,
  createModerationAction,
  updateModerationAction,
  deleteModerationAction,
  listAuditLogs,
  getAuditLog,
  fetchCurrentUserSummary,
  fetchAppNotifications,
  fetchSupportTickets,
  fetchUserSupportHistory,
  fetchAdminDashboardData,
};
