import { createContext, useContext, useState, type ReactNode } from 'react';

export type SelectedLocation = {
  label: string;
  latitude?: number;
  longitude?: number;
};

const LocationContext = createContext<{
  location: SelectedLocation;
  setLocation: (location: SelectedLocation) => void;
} | null>(null);

/** Conserva la selección entre pantallas durante la sesión de la aplicación. */
export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<SelectedLocation>({ label: 'Centro de La Paz' });
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useSelectedLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('Falta LocationProvider en el layout del turista.');
  return context;
}
