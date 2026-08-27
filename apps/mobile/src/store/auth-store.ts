import { create } from 'zustand';
import type { AuthPayload, LoginPayload, RegisterPayload, TwoFactorChallengeResponse, User } from '@sanken/core';
import { ApiError, isTwoFactorChallenge } from '@sanken/core';

import { api } from '@/lib/api';
import { describeSocialAuthError, signInWithGoogle, signOutFromGoogle, SocialAuthCancelledError } from '@/lib/social-auth';
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
    // Sin esto, la próxima vez que se toca "Continuar con Google" el SDK
    // nativo reutiliza en silencio la última cuenta sin mostrar el
    // selector — ver el comentario en signOutFromGoogle().
    await signOutFromGoogle();
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

    try {
      const formData = new FormData();

      // El shape clásico { uri, name, type } de React Native para adjuntar
      // un archivo por su ruta local NO funciona acá: desde SDK 53, Expo
      // reemplaza el `fetch` global por su propio runtime ("expo/fetch") en
      // todas las plataformas — ver node_modules/expo/src/winter/runtime.native.ts
      // — y su conversor de FormData (winter/fetch/convertFormData.ts) solo
      // reconoce partes que sean string o instancia real de Blob, nunca ese
      // objeto plano. Resolver siempre a un Blob real evita depender de ese
      // detalle interno y funciona igual en ambas plataformas. Va dentro del
      // try: si esto falla, isUploadingAvatar tiene que volver a false igual.
      const blob = await fetch(asset.uri).then((r) => r.blob());
      formData.append('avatar', blob, asset.name);

      const user = await api.post<User>('/auth/me/avatar', formData);
      // El backend siempre debe devolver avatar_url tras un upload exitoso
      // (ver AuthController::updateAvatar) — si por lo que sea no viene,
      // mejor mostrar un error real que dejar la sesión con un estado que
      // no coincide con lo que el usuario acaba de confirmar en pantalla.
      if (!user.avatar_url) {
        const message = 'La foto se subió pero el servidor no confirmó el cambio. Probá de nuevo.';
        set({ isUploadingAvatar: false, avatarError: message });
        throw new Error(message);
      }
      set({ user, isUploadingAvatar: false });
    } catch (err) {
      // Un ApiError ya trae un mensaje pensado para mostrarse (validación,
      // "no se pudo guardar la foto", etc). Cualquier otra cosa es un fallo
      // técnico (red, FormData, el runtime de fetch) que no tiene sentido
      // mostrarle crudo al usuario — se loguea para debugging y se muestra
      // un mensaje genérico en su lugar.
      const message = err instanceof ApiError ? readErrorMessage(err) : 'No se pudo subir la foto. Probá de nuevo.';
      if (!(err instanceof ApiError)) {
        console.error('[updateAvatar] fallo inesperado subiendo el avatar:', err);
      }
      set((state) => ({ isUploadingAvatar: false, avatarError: state.avatarError ?? message }));
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
