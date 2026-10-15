import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteRepository } from './route-repository';
import { catalogRoutes, defaultCriteria, type RouteCriteria } from './data/route-planner';

function useRouteState() {
  const [repository] = useState(() => new RouteRepository(AsyncStorage));
  const snapshot = useSyncExternalStore(repository.subscribe, repository.snapshot, repository.snapshot);
  const [criteria, setCriteria] = useState<RouteCriteria>(defaultCriteria);
  useEffect(() => { void repository.load(); }, [repository]);
  return { ...snapshot, repository, criteria, setCriteria,
    findRoute: (id: string) => snapshot.routes.find((route) => route.id === id) ?? catalogRoutes(criteria).find((route) => route.id === id) };
}
const RouteContext = createContext<ReturnType<typeof useRouteState> | null>(null);
export function RouteProvider({ children }: { children: ReactNode }) {
  const state = useRouteState();
  return <RouteContext.Provider value={state}>{children}</RouteContext.Provider>;
}
export function useRoutes() {
  const context = useContext(RouteContext);
  if (!context) throw new Error('Falta RouteProvider.');
  return context;
}
