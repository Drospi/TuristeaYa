import type { AppNotification } from '@/types';

/** Notificaciones del turista (pantalla 22). */
export const notifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Cambio de horario',
    body: 'La galería cierra hoy a las 17:00.\nTu visita está prevista para las 14:55.',
    kind: 'warning',
  },
  {
    id: 'n2',
    title: 'Lugar no disponible',
    body: 'Un restaurante cerró temporalmente.\nRevisa otra parada para tu salida.',
    kind: 'warning',
  },
  {
    id: 'n3',
    title: 'Reserva anticipada VIP',
    body: 'Ya está disponible la degustación del sábado.',
    kind: 'promo',
  },
];
