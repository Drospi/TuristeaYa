/** Roles de la plataforma (secciones del prototipo). */
export type Role = 'turista' | 'vip' | 'negocio' | 'soporte' | 'admin';

/** Usuario de demostración del prototipo. */
export interface User {
  name: string;
  email: string;
  accountType: string;
  interests: string[];
}
