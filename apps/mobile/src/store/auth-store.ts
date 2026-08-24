import { Platform } from 'react-native';
import { create } from 'zustand';
import type { AuthPayload, LoginPayload, RegisterPayload, TwoFactorChallengeResponse, User } from '@sanken/core';
import { ApiError, isTwoFactorChallenge } from '@sanken/core';

import { api } from '@/lib/api';
import { describeSocialAuthError, signInWithGoogle, SocialAuthCancelledError } from '@/lib/social-auth';
import { tokenStorage } from '@/lib/token-storage';

interface PendingChallenge {
  challengeToken: string;
}

interface AvatarPickerAsset {
  uri: string;
  name: string;
  mimeType: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  /** true mientras se restaura la sesión guardada al abrir la app. */
  isHydrating: boolean;
  isSubmitting: boolean;
  /** Separado de isSubmitting para que el botón de Google muestre su propio "Continuando…" sin pisar el form tradicional. */
  isSubmittingGoogle: boolean;
  error: string | null;
  pendingChallenge: PendingChallenge | null;

  isUploadingAvatar: boolean;
  avatarError: string | null;

  hydrate: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  challenge2fa: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
  setOnboardingCompleted: () => void;
  updateAvatar: (asset: AvatarPickerAsset) => Promise<void>;
  deleteAvatar: () => Promise<void>;
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
  isSubmittingGoogle: false,
  error: null,
  pendingChallenge: null,

  isUploadingAvatar: false,
  avatarError: null,

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

  /**
   * Google → Firebase → ID Token → mismo endpoint de "resultado de login"
   * que ya maneja email/password (user+token o desafío de 2FA) — así el
   * resto del flujo (guardar token, setOnboardingCompleted, etc.) es
   * idéntico sin importar cómo se autenticó.
   */
  loginWithGoogle: async () => {
    set({ isSubmittingGoogle: true, error: null });
    try {
      const { idToken } = await signInWithGoogle();
      const response = await api.post<AuthPayload | TwoFactorChallengeResponse>('/auth/social', {
        id_token: idToken,
        provider: 'google',
      });

      if (isTwoFactorChallenge(response)) {
        set({ isSubmittingGoogle: false, pendingChallenge: { challengeToken: response.challenge_token } });
        return;
      }

      await tokenStorage.set(response.token);
      set({ user: response.user, token: response.token, isSubmittingGoogle: false });
    } catch (err) {
      // Cancelar el popup a propósito no es un error para mostrarle al
      // usuario — solo se limpia el estado de carga y vuelve al login.
      if (err instanceof SocialAuthCancelledError) {
        set({ isSubmittingGoogle: false });
        return;
      }
      // Un ApiError viene del backend (ej. "ya existe una cuenta con este
      // correo") y ya trae un mensaje en español listo para mostrar — solo
      // los errores de Firebase/red necesitan el mapeo de códigos técnicos.
      const message = err instanceof ApiError ? readErrorMessage(err) : describeSocialAuthError(err);
      set({ isSubmittingGoogle: false, error: message });
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

  /**
   * Si el upload falla, `user` nunca se toca — la foto anterior queda como
   * estaba. Solo se reemplaza en `set()` cuando el backend confirma que la
   * nueva quedó guardada.
   */
  updateAvatar: async (asset) => {
    set({ isUploadingAvatar: true, avatarError: null });
    const formData = new FormData();

    // El shape { uri, name, type } es la API de fetch de React Native para
    // adjuntar un archivo por su ruta local (funciona con file:// / content://
    // en Android e iOS). En web, expo-image-picker devuelve un blob:/data:
    // URI en vez de una ruta de archivo — fetch web no sabe adjuntar eso
    // directamente, hay que resolverlo primero a un Blob real.
    if (Platform.OS === 'web') {
      const blob = await fetch(asset.uri).then((r) => r.blob());
      formData.append('avatar', blob, asset.name);
    } else {
      formData.append('avatar', {
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType ?? 'image/jpeg',
      } as unknown as Blob);
    }

    try {
      const user = await api.post<User>('/auth/me/avatar', formData);
      set({ user, isUploadingAvatar: false });
    } catch (err) {
      set({ isUploadingAvatar: false, avatarError: readErrorMessage(err) });
      throw err;
    }
  },

  deleteAvatar: async () => {
    set({ isUploadingAvatar: true, avatarError: null });
    try {
      const user = await api.delete<User>('/auth/me/avatar');
      set({ user, isUploadingAvatar: false });
    } catch (err) {
      set({ isUploadingAvatar: false, avatarError: readErrorMessage(err) });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

export function useIsAuthenticated() {
  return useAuthStore((s) => s.token !== null && s.user !== null);
}
