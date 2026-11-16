import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  ensureSessionLoaded,
  subscribeSession,
  type StoredAuthSession,
} from '@/services/http';
import {
  fetchCurrentUserSummary,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
  type RegisterResult,
} from '@/services/usuarios.service';
import type { Role, User } from '@/types';
import type { DbProfile, DbSubscription } from '@/types/database';

export interface AuthContextValue {
  session: StoredAuthSession | null;
  user: User;
  profile: DbProfile | null;
  role: Role;
  subscription: DbSubscription | null;
  loading: boolean;
  busy: boolean;
  error: string;
  login: (email: string, password: string) => Promise<Role>;
  register: (params: {
    name: string;
    email: string;
    password: string;
    acceptTerms: boolean;
  }) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  saveProfileChanges: (changes: Partial<DbProfile>) => Promise<DbProfile | null>;
}

const defaultUser: User = {
  name: 'María',
  email: 'maria@ejemplo.com',
  accountType: 'Cuenta gratuita',
  interests: ['Cultura y gastronomía'],
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<StoredAuthSession | null>(null);
  const [user, setUser] = useState<User>(defaultUser);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [role, setRole] = useState<Role>('turista');
  const [subscription, setSubscription] = useState<DbSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const refreshProfile = useCallback(async () => {
    try {
      const summary = await fetchCurrentUserSummary();
      setUser(summary.user);
      setProfile(summary.profile);
      setRole(summary.role);
      setSubscription(summary.subscription);
    } catch {
      // Mantiene datos actuales en caso de fallo de red
    }
  }, []);

  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeSession((nextSession) => {
      if (active) setSessionState(nextSession);
    });

    (async () => {
      try {
        const initial = await ensureSessionLoaded();
        if (!active) return;
        setSessionState(initial);
        await refreshProfile();
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [refreshProfile]);

  const login = useCallback(
    async (email: string, password: string): Promise<Role> => {
      setBusy(true);
      setError('');
      try {
        await loginUser({ email: email.trim(), password });
        const summary = await fetchCurrentUserSummary();
        setUser(summary.user);
        setProfile(summary.profile);
        setRole(summary.role);
        setSubscription(summary.subscription);
        return summary.role;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo iniciar sesión. Revisa tus credenciales.';
        setError(message);
        throw err;
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (params: {
      name: string;
      email: string;
      password: string;
      acceptTerms: boolean;
    }): Promise<RegisterResult> => {
      setBusy(true);
      setError('');
      try {
        const result = await registerUser({
          full_name: params.name.trim(),
          email: params.email.trim(),
          password: params.password,
          accept_terms: params.acceptTerms,
        });
        if (result.session) {
          await refreshProfile();
        }
        return result;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo registrar la cuenta. Verifica tus datos.';
        setError(message);
        throw err;
      } finally {
        setBusy(false);
      }
    },
    [refreshProfile],
  );

  const logout = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      await logoutUser();
      await refreshProfile();
    } finally {
      setBusy(false);
    }
  }, [refreshProfile]);

  const saveProfileChanges = useCallback(
    async (changes: Partial<DbProfile>): Promise<DbProfile | null> => {
      const targetId = profile?.id ?? session?.userId;
      if (!targetId) return null;
      setBusy(true);
      setError('');
      try {
        const updated = await updateProfile(targetId, changes);
        setProfile(updated);
        setUser((prev) => ({
          ...prev,
          name: updated.full_name || prev.name,
        }));
        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'No se pudo actualizar el perfil.';
        setError(message);
        throw err;
      } finally {
        setBusy(false);
      }
    },
    [profile?.id, session?.userId],
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role,
        subscription,
        loading,
        busy,
        error,
        login,
        register,
        logout,
        refreshProfile,
        saveProfileChanges,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  }
  return context;
}
