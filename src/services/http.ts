import AsyncStorage from '@react-native-async-storage/async-storage';

import { ENV } from '@/config/env';
import {
  FOREIGN_KEY_COLUMNS,
  READONLY_COLUMNS,
  RESOURCE_TABLE_MAP,
  TABLE_COLUMNS,
  type ResourceEndpoint,
  type TokenResponsePayload,
} from '@/types/database';

export const AUTH_STORAGE_KEY = 'turisteaya.auth.session.v1';

export interface StoredAuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullName?: string;
  user: Record<string, unknown>;
}

let currentSession: StoredAuthSession | null = null;
let sessionLoaded = false;
let loadingPromise: Promise<StoredAuthSession | null> | null = null;
let refreshPromise: Promise<StoredAuthSession | null> | null = null;
const sessionListeners = new Set<(session: StoredAuthSession | null) => void>();

function notifyListeners() {
  sessionListeners.forEach((listener) => {
    try {
      listener(currentSession);
    } catch {
      // Evita que un listener defectuoso bloquee el resto
    }
  });
}

export function subscribeSession(listener: (session: StoredAuthSession | null) => void): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export function getSessionSync(): StoredAuthSession | null {
  return currentSession;
}

export function getCurrentUserIdSync(): string | null {
  return currentSession?.userId ?? null;
}

export async function ensureSessionLoaded(): Promise<StoredAuthSession | null> {
  if (sessionLoaded) return currentSession;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAuthSession;
        if (parsed && typeof parsed.accessToken === 'string' && typeof parsed.refreshToken === 'string') {
          currentSession = parsed;
        }
      }
    } catch {
      currentSession = null;
    } finally {
      sessionLoaded = true;
      loadingPromise = null;
      notifyListeners();
    }
    return currentSession;
  })();

  return loadingPromise;
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await ensureSessionLoaded();
  return session?.userId ?? null;
}

export function tokenResponseToSession(
  tokenResponse: TokenResponsePayload,
  fallbackEmail = '',
  fallbackName?: string,
): StoredAuthSession {
  const userObj = (tokenResponse.user ?? {}) as Record<string, unknown>;
  const metadata = (userObj.user_metadata ?? {}) as Record<string, unknown>;
  const userId = String(userObj.id ?? '');
  const email = String(userObj.email ?? fallbackEmail ?? '');
  const fullName =
    typeof metadata.full_name === 'string'
      ? metadata.full_name
      : typeof userObj.full_name === 'string'
        ? userObj.full_name
        : fallbackName;

  return {
    accessToken: tokenResponse.access_token,
    refreshToken: tokenResponse.refresh_token,
    userId,
    email,
    fullName,
    user: userObj,
  };
}

export async function setSession(session: StoredAuthSession | null): Promise<void> {
  currentSession = session;
  sessionLoaded = true;
  try {
    if (session) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // Continúa en memoria si el almacenamiento falla
  }
  notifyListeners();
}

export async function clearSession(): Promise<void> {
  await setSession(null);
}

/** Generador UUID v4 compatible con React Native y Web para claves de idempotencia. */
export function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/** Valida si un string tiene formato UUID válido (exigido por FastAPI en filtros y record_id). */
export function isUuid(value: string | null | undefined): boolean {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

export class ApiHttpError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiHttpError';
    this.status = status;
    this.detail = detail;
  }
}

async function parseErrorDetail(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: unknown; message?: unknown };
    if (typeof data?.detail === 'string') return data.detail;
    if (Array.isArray(data?.detail) && data.detail.length > 0) {
      const first = data.detail[0] as { msg?: string };
      if (typeof first?.msg === 'string') return first.msg;
    }
    if (typeof data?.message === 'string') return data.message;
  } catch {
    // Ignorar error de parseo JSON
  }
  return `Error HTTP ${response.status}`;
}

async function tryRefreshSession(): Promise<StoredAuthSession | null> {
  if (refreshPromise) return refreshPromise;
  const session = await ensureSessionLoaded();
  if (!session?.refreshToken) return null;

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${ENV.API_V1_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refresh_token: session.refreshToken }),
      });
      if (!response.ok) {
        await clearSession();
        return null;
      }
      const data = (await response.json()) as TokenResponsePayload;
      const nextSession = tokenResponseToSession(data, session.email, session.fullName);
      await setSession(nextSession);
      return nextSession;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  authenticated?: boolean;
  retryOn401?: boolean;
  timeoutMs?: number;
}

export async function httpRequest<T>(
  path: string,
  options: HttpRequestOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    authenticated = true,
    retryOn401 = true,
    timeoutMs = ENV.REQUEST_TIMEOUT_MS,
  } = options;

  const url = path.startsWith('http')
    ? path
    : path.startsWith('/api/') || path === '/health'
      ? `${ENV.API_BASE_URL}${path}`
      : `${ENV.API_V1_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const session = authenticated ? await ensureSessionLoaded() : null;
  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  if (authenticated && session?.accessToken && !requestHeaders.Authorization) {
    requestHeaders.Authorization = `Bearer ${session.accessToken}`;
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeout = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller?.signal,
    });

    if (response.status === 401 && authenticated && retryOn401 && session?.refreshToken) {
      const refreshed = await tryRefreshSession();
      if (refreshed?.accessToken) {
        return httpRequest<T>(path, {
          ...options,
          retryOn401: false,
          headers: {
            ...headers,
            Authorization: `Bearer ${refreshed.accessToken}`,
          },
        });
      }
    }

    if (!response.ok) {
      const detail = await parseErrorDetail(response);
      throw new ApiHttpError(response.status, detail);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

/* -------------------------------------------------------------------------- */
/* Helpers CRUD tipados para las 32 tablas de Supabase expuestas en /api/v1   */
/* -------------------------------------------------------------------------- */

export interface ListQueryOptions {
  limit?: number;
  offset?: number;
  filters?: Record<string, string | null | undefined>;
}

export function sanitizePayload(
  endpoint: ResourceEndpoint,
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const table = RESOURCE_TABLE_MAP[endpoint];
  const validColumns = new Set<string>(TABLE_COLUMNS[table] ?? []);
  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;
    if (READONLY_COLUMNS.has(key)) continue;
    if (validColumns.size === 0 || validColumns.has(key)) {
      clean[key] = value;
    }
  }
  return clean;
}

export function buildListQuery(endpoint: ResourceEndpoint, options: ListQueryOptions = {}): string {
  const table = RESOURCE_TABLE_MAP[endpoint];
  const allowedFk = new Set<string>(FOREIGN_KEY_COLUMNS[table] ?? []);
  const params = new URLSearchParams();

  const limit = Math.min(Math.max(options.limit ?? 50, 1), 100);
  const offset = Math.max(options.offset ?? 0, 0);
  params.set('limit', String(limit));
  if (offset > 0) {
    params.set('offset', String(offset));
  }

  if (options.filters) {
    for (const [column, value] of Object.entries(options.filters)) {
      if (!value || !allowedFk.has(column)) continue;
      if (isUuid(value)) {
        params.set(column, value.trim());
      }
    }
  }

  const query = params.toString();
  return query ? `/${endpoint}?${query}` : `/${endpoint}`;
}

export async function listRecords<T>(
  endpoint: ResourceEndpoint,
  options: ListQueryOptions = {},
): Promise<T[]> {
  const path = buildListQuery(endpoint, options);
  const data = await httpRequest<T[]>(path, { method: 'GET' });
  return Array.isArray(data) ? data : [];
}

export async function getRecord<T>(endpoint: ResourceEndpoint, recordId: string): Promise<T> {
  return httpRequest<T>(`/${endpoint}/${encodeURIComponent(recordId)}`, { method: 'GET' });
}

export async function createRecord<T>(
  endpoint: ResourceEndpoint,
  payload: Record<string, unknown>,
): Promise<T> {
  const clean = sanitizePayload(endpoint, payload);
  return httpRequest<T>(`/${endpoint}`, {
    method: 'POST',
    body: clean,
    authenticated: true,
  });
}

export async function updateRecord<T>(
  endpoint: ResourceEndpoint,
  recordId: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const clean = sanitizePayload(endpoint, payload);
  return httpRequest<T>(`/${endpoint}/${encodeURIComponent(recordId)}`, {
    method: 'PATCH',
    body: clean,
    authenticated: true,
  });
}

export async function deleteRecord(endpoint: ResourceEndpoint, recordId: string): Promise<void> {
  await httpRequest<void>(`/${endpoint}/${encodeURIComponent(recordId)}`, {
    method: 'DELETE',
    authenticated: true,
  });
}

export async function checkBackendHealth(): Promise<{ status: string; app: string }> {
  return httpRequest<{ status: string; app: string }>('/health', {
    method: 'GET',
    authenticated: false,
  });
}
