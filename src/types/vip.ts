/** Ruta descargada para uso sin conexión (pantalla 27). */
export interface OfflineRoute {
  id: string;
  name: string;
  stopsCount: number;
  sizeMb: number;
  downloaded: boolean;
  updatedLabel?: string;
}

/** Experiencia exclusiva VIP (pantallas 30-31). */
export interface VipExperience {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  slots: number;
  pricePerPerson: number;
  cancellationPolicy: string;
}

/** Entrada del historial de beneficios (pantalla 32). */
export interface BenefitHistoryEntry {
  id: string;
  title: string;
  detail: string;
  usedLabel: string;
}
