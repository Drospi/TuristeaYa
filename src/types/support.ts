export type TicketStatus = 'Pendiente' | 'En curso' | 'Resuelto';
export type TicketPriority = 'Alta' | 'Media' | 'Baja';

/** Mensaje del chat de soporte (pantalla 45). */
export interface ChatMessage {
  id: string;
  author: 'user' | 'support';
  time: string;
  text: string;
}

/** Ticket de soporte (pantallas 43-44). */
export interface Ticket {
  id: string;
  subject: string;
  user: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  type: string;
  messagesCount: number;
  verification: string;
  chat: ChatMessage[];
  draftReply: string;
}

/** Entrada del historial del usuario (pantalla 46). */
export interface UserHistoryEntry {
  id: string;
  date: string;
  status: string;
  subject: string;
  messages: number;
}

/** Actividad relacionada al usuario (pantalla 46). */
export interface RelatedActivity {
  id: string;
  label: string;
}
