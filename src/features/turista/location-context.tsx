import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { zonePoints } from './data/discovery';

import { fetchZonesCatalog } from '@/services/catalogos.service';
import type { DbZone } from '@/types/database';

export type SelectedLocation = {
  label: string;
  latitude?: number;
  longitude?: number;
  zoneId?: string;
};

const defaultZoneNames = [
  'Centro de La Paz',
  'Sopocachi',
  'Miraflores',
  'San Pedro',
  'Obrajes',
  'Calacoto',
  'San Miguel',
];

const LocationContext = createContext<{
  location: SelectedLocation;
  setLocation: (location: SelectedLocation) => void;
  availableZones: string[];
  zonesCatalog: DbZone[];
  pointsByZone: Record<string, { latitude: number; longitude: number; id?: string }>;
} | null>(null);

/** Conserva la selección entre pantallas y sincroniza zonas desde /api/v1/zones. */
export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<SelectedLocation>({
    label: 'Centro de La Paz',
    latitude: zonePoints['Centro de La Paz'].latitude,
    longitude: zonePoints['Centro de La Paz'].longitude,
  });
  const [zonesCatalog, setZonesCatalog] = useState<DbZone[]>([]);
  const [pointsByZone, setPointsByZone] = useState<
    Record<string, { latitude: number; longitude: number; id?: string }>
  >(zonePoints);

  useEffect(() => {
    let active = true;
    fetchZonesCatalog().then(({ zones, pointsByName }) => {
      if (!active || !zones.length) return;
      setZonesCatalog(zones);
      setPointsByZone((prev) => ({ ...prev, ...pointsByName }));
    });
    return () => {
      active = false;
    };
  }, []);

  const availableZones = Array.from(
    new Set([...defaultZoneNames, ...zonesCatalog.map((z) => z.name)]),
  );

  return (
    <LocationContext.Provider
      value={{ location, setLocation, availableZones, zonesCatalog, pointsByZone }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useSelectedLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('Falta LocationProvider en el layout del turista.');
  return context;
}
