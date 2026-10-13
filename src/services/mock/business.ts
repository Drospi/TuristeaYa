import type {
  BusinessNotification,
  BusinessProfile,
  BusinessStats,
  Campaign,
  Promotion,
} from '@/types';

/** Datos del establecimiento (pantalla 34). */
export const businessProfile: BusinessProfile = {
  name: 'Café del Patio',
  address: 'Calle del Sol 24',
  hours: '09:00 a 19:00',
  description: 'Café de especialidad · Wi-Fi · Terraza',
  services: ['Wi-Fi', 'Terraza'],
};

/** Métricas del negocio (pantalla 33). */
export const businessStats: BusinessStats = {
  views: 1248,
  localVisits: 86,
  couponsRedeemed: 32,
  peakLabel: '16:00 a 18:00',
  hourly: [
    { hour: '10h', value: 23 },
    { hour: '12h', value: 41 },
    { hour: '14h', value: 59 },
    { hour: '16h', value: 86 },
    { hour: '18h', value: 69 },
    { hour: '20h', value: 33 },
  ],
};

/** Promociones del negocio (pantallas 35-36). */
export const promotions: Promotion[] = [
  {
    id: 'p1',
    title: '20% en primera bebida',
    state: 'Activa',
    redemptions: 32,
    validity: 'Hasta el 30 sep.',
    discountPct: 20,
    code: 'TURISTEA20',
    usageLimit: '1 por persona · Máximo 100 canjes',
    conditions: 'Solo bebidas seleccionadas. No acumulable, excepto beneficio VIP.',
  },
  {
    id: 'p2',
    title: '10% en desayuno',
    state: 'Programada',
    redemptions: 0,
    validity: 'Desde el 1 oct.',
    discountPct: 10,
    code: 'DESAYUNO10',
    usageLimit: '1 por persona · Máximo 50 canjes',
    conditions: 'Solo desayunos seleccionados. No acumulable.',
  },
];

/** Campañas publicitarias (pantallas 38-40). */
export const campaigns: Campaign[] = [
  {
    id: 'c1',
    title: 'Café cerca de ti',
    state: 'Activa',
    spent: 65,
    budget: 150,
    period: '21 al 27 de septiembre',
    views: 430,
    space: 'Inicio patrocinado',
  },
  {
    id: 'c2',
    title: 'Menú del día',
    state: 'Finalizada',
    spent: 100,
    budget: 100,
    period: '14 al 20 de septiembre',
    views: 560,
    space: 'Lugares cercanos',
  },
];

/** Notificaciones del negocio (pantalla 42). */
export const businessNotifications: BusinessNotification[] = [
  {
    id: 'bn1',
    title: 'Nuevo canje · #C102',
    body: 'TURISTEA20 · Ahorro Bs 7\nHoy, 14:35 · Uso 1 de 1',
    kind: 'canje',
  },
  {
    id: 'bn2',
    title: 'Soporte · Revisar promoción',
    body: 'El cupón tiene un horario incorrecto.\nActualiza las condiciones.',
    kind: 'soporte',
  },
  {
    id: 'bn3',
    title: 'Campaña próxima a terminar',
    body: 'Café cerca de ti finaliza el 27 sep.',
    kind: 'campana',
  },
];
