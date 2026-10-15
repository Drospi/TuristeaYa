import { createContext, useContext, useState, type ReactNode } from 'react';

type DiscoveryState = {
  readNotices: string[];
  markRead: (ids: string[]) => void;
};
const DiscoveryContext = createContext<DiscoveryState | null>(null);
export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [readNotices, setReadNotices] = useState<string[]>([]);
  return <DiscoveryContext.Provider value={{
    readNotices,
    markRead: (ids) => setReadNotices((previous) => [...new Set([...previous, ...ids])]),
  }}>{children}</DiscoveryContext.Provider>;
}
export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (!context) throw new Error('Falta DiscoveryProvider en el layout del turista.');
  return context;
}
