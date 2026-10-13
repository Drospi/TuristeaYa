/** Métricas de la plataforma (pantalla 48). */
export interface PlatformStats {
  users: number;
  businesses: number;
  pendingReports: number;
  openTickets: number;
}

/** Usuario gestionado por el administrador (pantalla 49). */
export interface ManagedUser {
  email: string;
  name: string;
  accountState: string;
  currentRole: string;
}

/** Solicitud de verificación de comercio (pantalla 50). */
export interface VerificationRequest {
  businessName: string;
  owner: string;
  receivedLabel: string;
  observations: string;
}

/** Reseña reportada para moderación (pantalla 51). */
export interface ReportedReview {
  id: string;
  businessName: string;
  reason: string;
  decision: string;
}

/** Alerta de seguridad (pantalla 52). */
export interface SecurityAlert {
  id: string;
  label: string;
  date: string;
}

/** Registro de cambios (pantalla 52). */
export interface AuditEntry {
  id: string;
  label: string;
  time: string;
}
