/** Datos del establecimiento (pantalla 34). */
export interface BusinessProfile {
  name: string;
  address: string;
  hours: string;
  description: string;
  services: string[];
}

/** Barra del gráfico "Visitas por horario" (pantalla 33). */
export interface HourlyVisit {
  hour: string;
  /** Valor relativo de la barra. */
  value: number;
}

/** Métricas del negocio (pantalla 33). */
export interface BusinessStats {
  views: number;
  localVisits: number;
  couponsRedeemed: number;
  peakLabel: string;
  hourly: HourlyVisit[];
}

export type PromotionState = 'Activa' | 'Programada';

/** Promoción del negocio (pantallas 35-36). */
export interface Promotion {
  id: string;
  title: string;
  state: PromotionState;
  redemptions: number;
  validity: string;
  discountPct: number;
  code: string;
  usageLimit: string;
  conditions: string;
}

export type CampaignState = 'Activa' | 'Pausada' | 'Finalizada';

/** Campaña publicitaria (pantallas 38-40). */
export interface Campaign {
  id: string;
  title: string;
  state: CampaignState;
  spent: number;
  budget: number;
  period: string;
  views: number;
  space: string;
}

/** Notificación del negocio (pantalla 42). */
export interface BusinessNotification {
  id: string;
  title: string;
  body: string;
  kind: 'canje' | 'soporte' | 'campana';
}
