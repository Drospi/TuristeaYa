import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  discoveryPlaces,
  registerBackendDiscoveryPlaces,
  type DiscoveryPlace,
} from './data/discovery';

import {
  fetchDiscoveryCatalog,
  type PlaceReviewWithExtras,
} from '@/services/lugares.service';

type DiscoveryState = {
  readNotices: string[];
  markRead: (ids: string[]) => void;
  places: DiscoveryPlace[];
  backendPlaces: DiscoveryPlace[];
  reviewsByPlaceId: Record<string, PlaceReviewWithExtras[]>;
  loadingPlaces: boolean;
  refreshPlaces: () => Promise<void>;
};

const DiscoveryContext = createContext<DiscoveryState | null>(null);

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [readNotices, setReadNotices] = useState<string[]>([]);
  const [backendPlaces, setBackendPlaces] = useState<DiscoveryPlace[]>([]);
  const [reviewsByPlaceId, setReviewsByPlaceId] = useState<
    Record<string, PlaceReviewWithExtras[]>
  >({});
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  const refreshPlaces = useCallback(async () => {
    setLoadingPlaces(true);
    try {
      const { places, reviewsByPlaceId: revs } = await fetchDiscoveryCatalog();
      if (places.length) {
        registerBackendDiscoveryPlaces(places, revs);
        setBackendPlaces(places);
      }
      setReviewsByPlaceId(revs);
    } finally {
      setLoadingPlaces(false);
    }
  }, []);

  useEffect(() => {
    void refreshPlaces();
  }, [refreshPlaces]);

  return (
    <DiscoveryContext.Provider
      value={{
        readNotices,
        markRead: (ids) => setReadNotices((previous) => [...new Set([...previous, ...ids])]),
        places: [...backendPlaces, ...discoveryPlaces.filter((d) => !backendPlaces.some((b) => b.id === d.id))],
        backendPlaces,
        reviewsByPlaceId,
        loadingPlaces,
        refreshPlaces,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (!context) throw new Error('Falta DiscoveryProvider en el layout del turista.');
  return context;
}
