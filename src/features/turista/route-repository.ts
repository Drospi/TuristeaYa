import { calculateRoute, type PlannedRoute } from './data/route-planner';

export const ROUTES_KEY = 'turisteaya.saved-routes.v1';
type Storage = { getItem: (key: string) => Promise<string | null>; setItem: (key: string, value: string) => Promise<void> };
type Snapshot = { routes: PlannedRoute[]; ready: boolean; busy: boolean; error: string };
export function decodeRoutes(raw: string | null): PlannedRoute[] {
  if (raw == null) return [];
  const value = JSON.parse(raw);
  if (value.version !== 1 || !Array.isArray(value.routes)) throw new Error('Formato de rutas no compatible.');
  const ids = new Set<string>();
  return value.routes.map((route: PlannedRoute) => {
    if (!route || typeof route.id !== 'string' || ids.has(route.id) || typeof route.name !== 'string' || !route.name.trim() ||
      !Array.isArray(route.placeIds) || !route.placeIds.every((id) => typeof id === 'string') || typeof route.departure !== 'string' ||
      !route.origin || !Number.isFinite(route.origin.latitude) || Math.abs(route.origin.latitude) > 90 ||
      !Number.isFinite(route.origin.longitude) || Math.abs(route.origin.longitude) > 180 || typeof route.visited !== 'boolean' ||
      (route.sourceId != null && typeof route.sourceId !== 'string')) throw new Error('Hay una ruta con datos inválidos.');
    ids.add(route.id);
    return calculateRoute(route);
  });
}
export class RouteRepository {
  private state: Snapshot = { routes: [], ready: false, busy: false, error: '' };
  private listeners = new Set<() => void>();
  private queue: Promise<unknown> = Promise.resolve();
  constructor(private storage: Storage) {}
  snapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private emit(next: Partial<Snapshot>) { this.state = { ...this.state, ...next }; this.listeners.forEach((listener) => listener()); }
  async load() {
    this.emit({ error: '' });
    try { this.emit({ routes: decodeRoutes(await this.storage.getItem(ROUTES_KEY)), ready: true }); }
    catch { this.emit({ ready: false, error: 'No se pudieron leer las rutas guardadas. Tus datos no se han sobrescrito.' }); }
  }
  private change<T>(operation: (routes: PlannedRoute[]) => { routes: PlannedRoute[]; result: T }): Promise<T> {
    const task = this.queue.then(async () => {
      if (!this.state.ready) throw new Error('Espera a que terminen de cargar tus rutas.');
      this.emit({ busy: true, error: '' });
      try {
        const next = operation(this.state.routes);
        await this.storage.setItem(ROUTES_KEY, JSON.stringify({ version: 1, routes: next.routes }));
        this.emit({ routes: next.routes });
        return next.result;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo guardar. Intenta de nuevo.';
        this.emit({ error: message });
        throw error;
      } finally { this.emit({ busy: false }); }
    });
    this.queue = task.catch(() => undefined);
    return task;
  }
  save = (route: PlannedRoute) => this.change((routes) => {
    const existing = routes.find((item) => item.id === route.id || item.sourceId === route.id);
    if (existing) return { routes, result: existing.id };
    const copy = calculateRoute({ ...route, id: `saved-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, sourceId: route.id });
    return { routes: [...routes, copy], result: copy.id };
  });
  addPlace = (id: string, placeId: string) => this.change((routes) => {
    const target = routes.find((route) => route.id === id);
    if (!target) throw new Error('La ruta seleccionada ya no existe.');
    const next = calculateRoute({ ...target, placeIds: [...target.placeIds, placeId] });
    return { routes: routes.map((route) => route.id === id ? next : route), result: id };
  });
  create = (name: string, placeId: string, origin: PlannedRoute['origin'], departure: string) => this.change((routes) => {
    if (!name.trim()) throw new Error('Escribe un nombre para la ruta.');
    const route = calculateRoute({ id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, name: name.trim(), placeIds: [placeId], origin, departure });
    return { routes: [...routes, route], result: route.id };
  });
  updateStops = (id: string, placeIds: string[]) => this.change((routes) => {
    const target = routes.find((route) => route.id === id);
    if (!target) throw new Error('Guarda la ruta antes de editarla.');
    const next = calculateRoute({ ...target, placeIds });
    return { routes: routes.map((route) => route.id === id ? next : route), result: id };
  });
  setVisited = (id: string, visited: boolean) => this.change((routes) => ({ routes: routes.map((route) => route.id === id ? { ...route, visited } : route), result: undefined }));
  remove = (id: string) => this.change((routes) => ({ routes: routes.filter((route) => route.id !== id), result: undefined }));
}
