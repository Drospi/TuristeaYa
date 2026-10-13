import type {
  AuditEntry,
  ManagedUser,
  PlatformStats,
  ReportedReview,
  SecurityAlert,
  VerificationRequest,
} from '@/types';

/** Métricas de la plataforma (pantalla 48). */
export const platformStats: PlatformStats = {
  users: 320,
  businesses: 48,
  pendingReports: 12,
  openTickets: 6,
};

/** Usuario gestionado (pantalla 49). */
export const managedUsers: ManagedUser[] = [
  {
    email: 'ana@ejemplo.com',
    name: 'Ana',
    accountState: 'Cuenta activa',
    currentRole: 'Soporte',
  },
];

/** Solicitud de verificación (pantalla 50). */
export const verificationRequest: VerificationRequest = {
  businessName: 'Café del Patio',
  owner: 'Carlos Pérez',
  receivedLabel: 'Solicitud recibida el 21 sep.',
  observations: 'Datos del negocio y responsable coinciden.',
};

/** Reseña reportada (pantalla 51). */
export const reportedReview: ReportedReview = {
  id: 'R55',
  businessName: 'Café del Patio',
  reason: 'contenido ofensivo',
  decision: 'Incumplimiento de las normas de convivencia.',
};

/** Alertas de seguridad (pantalla 52). */
export const securityAlerts: SecurityAlert[] = [
  { id: 's1', label: '5 intentos fallidos en una cuenta.', date: '21 sep. · 10:42' },
];

/** Registro de cambios (pantalla 52). */
export const auditEntries: AuditEntry[] = [
  { id: 'l1', label: 'Ana actualizó un ticket', time: '10:35' },
  { id: 'l2', label: 'Comercio verificado por administrador', time: '10:20' },
];
