import React, { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';
import { api, setUnauthorizedHandler } from '@/lib/api';
import { clearToken, getToken, setToken } from '@/lib/session';
import type { UserProfile } from '@/types';

interface AuthResponse {
  token: string;
  user: UserProfile;
}

interface AuthContextValue {
  /** Usuário logado (nome, e-mail e papel); null = deslogado */
  profile: UserProfile | null;
  /** true enquanto a sessão salva ainda está sendo validada na API */
  loading: boolean;
  canWrite: boolean; // admin ou técnico
  canDelete: boolean; // somente admin
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  // Só precisa validar na API se há um token salvo.
  const [loading, setLoading] = useState(() => getToken() !== null);

  const signOut = useCallback(() => {
    clearToken();
    setProfile(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => setProfile(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  // Restaura a sessão: valida o token salvo e carrega nome e papel atuais.
  useEffect(() => {
    if (getToken() === null) return;
    let active = true;
    api
      .get<UserProfile>('/auth/me')
      .then((user) => active && setProfile(user))
      .catch(() => {
        // 401 já limpa o token em api.ts; falha de rede apenas mantém o login visível
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const finishAuth = useCallback(({ token, user }: AuthResponse) => {
    setToken(token);
    setProfile(user);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      finishAuth(await api.post<AuthResponse>('/auth/login', { email, password }));
    },
    [finishAuth],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      finishAuth(await api.post<AuthResponse>('/auth/register', { name, email, password }));
    },
    [finishAuth],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      loading,
      canWrite: profile?.role === 'admin' || profile?.role === 'technician',
      canDelete: profile?.role === 'admin',
      signIn,
      signUp,
      signOut,
    }),
    [profile, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
