import type { RelatedActivity, Ticket, UserHistoryEntry } from '@/types';

/** Tickets de soporte (pantallas 43-45). */
export const tickets: Ticket[] = [
  {
    id: '2048',
    subject: 'Cupón no reconocido',
    user: 'María',
    category: 'Canjes',
    priority: 'Alta',
    status: 'Pendiente',
    type: 'Canje',
    messagesCount: 4,
    verification:
      'TURISTEA20 · Vigente\nCanje #C102 · 1 uso registrado\nRevisar posible duplicación.',
    chat: [
      { id: 'm1', author: 'user', time: '14:32', text: 'El local no reconoce mi cupón.' },
      {
        id: 'm2',
        author: 'support',
        time: '14:34',
        text: 'Estoy revisando el canje con el negocio.',
      },
    ],
    draftReply: 'El cupón ya registra un uso. Vamos a verificarlo.',
  },
  {
    id: '2049',
    subject: 'Descarga incompleta',
    user: 'Usuario VIP',
    category: 'Descargas',
    priority: 'Media',
    status: 'En curso',
    type: 'Datos',
    messagesCount: 2,
    verification: 'Ruta sin conexión · Descarga interrumpida.\nSe reintentará automáticamente.',
    chat: [
      { id: 'm1', author: 'user', time: '09:12', text: 'La ruta no termina de descargarse.' },
      { id: 'm2', author: 'support', time: '09:20', text: 'Estamos verificando la descarga.' },
    ],
    draftReply: 'Volvimos a habilitar la descarga de la ruta.',
  },
  {
    id: '2050',
    subject: 'Horario incorrecto',
    user: 'Turista',
    category: 'Información del lugar',
    priority: 'Baja',
    status: 'Pendiente',
    type: 'Datos',
    messagesCount: 1,
    verification: 'Café del Patio · Horario informado no coincide.\nSe consultará al negocio.',
    chat: [
      { id: 'm1', author: 'user', time: '11:05', text: 'El horario del local está desactualizado.' },
    ],
    draftReply: 'Consultamos el horario con el negocio.',
  },
];

/** Historial del usuario del ticket (pantalla 46). */
export const userHistory: UserHistoryEntry[] = [
  {
    id: '2048',
    date: 'Hoy',
    status: 'En curso',
    subject: 'Cupón no reconocido',
    messages: 4,
  },
  {
    id: '2030',
    date: '18 sep.',
    status: 'Resuelto',
    subject: 'Consulta sobre horario',
    messages: 3,
  },
];

/** Actividad relacionada (pantalla 46). */
export const relatedActivity: RelatedActivity[] = [
  { id: 'a1', label: 'Canje #C102 · TURISTEA20 · 14:35' },
];
