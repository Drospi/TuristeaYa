import type { BenefitHistoryEntry, OfflineRoute, VipExperience } from '@/types';

/** Rutas descargables (pantalla 27). */
export const offlineRoutes: OfflineRoute[] = [
  {
    id: 'paseo-por-el-centro',
    name: 'Paseo por el centro',
    stopsCount: 3,
    sizeMb: 2,
    downloaded: true,
    updatedLabel: 'Actualizado hoy a las 10:30',
  },
  {
    id: 'una-tarde-cultural',
    name: 'Una tarde cultural',
    stopsCount: 2,
    sizeMb: 2,
    downloaded: false,
  },
];

/** Experiencia exclusiva (pantallas 30-31). */
export const experience: VipExperience = {
  id: 'degustacion-local',
  name: 'Degustación local',
  date: 'Sábado, 26 de septiembre',
  time: '17:30',
  duration: 'Duración: 2 horas',
  slots: 6,
  pricePerPerson: 80,
  cancellationPolicy: 'Cancelación sin costo hasta 24 horas antes.',
};

/** Historial de beneficios (pantalla 32). */
export const benefitHistory: BenefitHistoryEntry[] = [
  {
    id: 'b1',
    title: 'Cupón de Café del Patio',
    detail: '20 sep. · Ahorro Bs 7',
    usedLabel: 'Utilizado',
  },
  {
    id: 'b2',
    title: 'Degustación local · #R102',
    detail: '26 sep. · 2 personas',
    usedLabel: 'Reserva confirmada',
  },
  {
    id: 'b3',
    title: 'Descuento VIP acumulable',
    detail: '5% adicional · Se puede combinar con cupón',
    usedLabel: 'Ahorro total ilustrativo: Bs 8.75',
  },
];

/** Total de ahorro del mes (pantalla 32). */
export const monthlySavingsLabel = 'Bs 15.75';
