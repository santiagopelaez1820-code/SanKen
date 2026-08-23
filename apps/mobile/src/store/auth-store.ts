import { create } from 'zustand';
import type { AuthPayload, LoginPayload, RegisterPayload, TwoFactorChallengeResponse, User } from '@sanken/core';
import { ApiError, isTwoFactorChallenge } from '@sanken/core';

import { api } from '@/lib/api';
import { tokenStorage } from '@/lib/token-storage';

interface PendingChallenge {
  challengeToken: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  /** true mientras se restaura la sesión guardada al abrir la app. */
  isHydrating: boolean;
  isSubmitting: boolean;
  error: string | null;
  pendingChallenge: PendingChallenge | null;

  hydrate: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  challenge2fa: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  setOnboardingCompleted: () => void;
  clearError: () => void;
}

function readErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const firstFieldError = Object.values(err.body.errors ?? {})[0]?.[0];
    return firstFieldError ?? err.body.message;
  }
  return err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isHydrating: true,
  isSubmitting: false,
  error: null,
  pendingChallenge: null,

  hydrate: async () => {
    const token = await tokenStorage.get();

    if (!token) {
      set({ isHydrating: false });
      return;
    }

    set({ token });

    try {
      const user = await api.get<User>('/auth/me');
      set({ user, isHydrating: false });
    } catch {
      await tokenStorage.clear();
      set({ token: null, user: null, isHydrating: false });
    }
  },

  register: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const { user, token } = await api.post<AuthPayload>('/auth/register', payload);
      await tokenStorage.set(token);
      set({ user, token, isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: readErrorMessage(err) });
      throw err;
    }
  },

  login: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await api.post<AuthPayload | TwoFactorChallengeResponse>('/auth/login', payload);

      if (isTwoFactorChallenge(response)) {
        set({ isSubmitting: false, pendingChallenge: { challengeToken: response.challenge_token } });
        return;
      }

      await tokenStorage.set(response.token);
      set({ user: response.user, token: response.token, isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: readErrorMessage(err) });
      throw err;
    }
  },

  challenge2fa: async (code) => {
    const { pendingChallenge } = get();
    if (!pendingChallenge) return;

    set({ isSubmitting: true, error: null });
    try {
      const { user, token } = await api.post<AuthPayload>('/auth/2fa/challenge', {
        challenge_token: pendingChallenge.challengeToken,
        code,
      });
      await tokenStorage.set(token);
      set({ user, token, isSubmitting: false, pendingChallenge: null });
    } catch (err) {
      set({ isSubmitting: false, error: readErrorMessage(err) });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Si el token ya era inválido no hay nada que revertir del lado del servidor.
    }
    await tokenStorage.clear();
    set({ user: null, token: null });
  },

  refreshMe: async () => {
    const user = await api.get<User>('/auth/me');
    set({ user });
  },

  setOnboardingCompleted: () => {
    const { user } = get();
    if (user) set({ user: { ...user, onboarding_completed: true } });
  },

  clearError: () => set({ error: null }),
}));

export function useIsAuthenticated() {
  return useAuthStore((s) => s.token !== null && s.user !== null);
}
