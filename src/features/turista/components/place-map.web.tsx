import type { PlaceMapProps } from './place-map.types';
import { colors, radius } from '@/theme';

/** OpenStreetMap mantiene sus controles y atribución dentro del iframe. */
export function PlaceMap({ point, title, height = 220 }: PlaceMapProps) {
  const { latitude: lat, longitude: lon } = point;
  const bbox = [lon - 0.004, lat - 0.003, lon + 0.004, lat + 0.003].join(',');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
  return <iframe title={`Mapa de ${title}`} src={src} loading="lazy" style={{ width: '100%', height, flexShrink: 0, border: `1px solid ${colors.border}`, borderRadius: radius.md, backgroundColor: colors.surfaceGreenSoft }} />;
}
