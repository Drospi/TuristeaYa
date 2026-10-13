/** Formatea minutos como "2 h 30 min". */
export function formatDuration(totalMin: number): string {
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

/** Formatea metros como "A 350 m" o "1.8 km". */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `A ${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
