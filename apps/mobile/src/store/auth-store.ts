import { create } from 'zustand';
import type {
  ConsentType,
  LoginPayload,
  PendingConsent,
  RegisterPayload,
  SocialLoginPayload,
  SocialLoginResponse,
  AuthPayload,
  TwoFactorChallengeResponse,
  User,
} from '@sanken/core';
import { ApiError, buildConsentFields, currentConsentVersions, isSocialConsentRequired, isTwoFactorChallenge } from '@sanken/core';

import { api } from '@/lib/api';
import { uploadFileAsync } from '@/lib/upload-file';
import { describeSocialAuthError, signInWithGoogle, signOutFromGoogle, SocialAuthCancelledError } from '@/lib/social-auth';
import { tokenStorage } from '@/lib/token-storage';

interface PendingChallenge {
  challengeToken: string;
}

/**
 * "Continuar con Google" con una cuenta NUEVA sin consentimientos: el
 * backend no crea nada y devuelve qué hay que aceptar. Se guarda el
 * id_token (válido 1 h) para reenviarlo con las casillas marcadas.
 */
interface PendingSocialConsent {
  idToken: string;
  consents: PendingConsent[];
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
  pendingSocialConsent: PendingSocialConsent | null;
  isAcceptingConsents: boolean;

  isUploadingAvatar: boolean;
  avatarError: string | null;

  isSubmittingForgotPassword: boolean;

  hydrate: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  /** No inicia sesión — solo dispara el correo de recuperación. Devuelve el mensaje del backend para mostrarlo en pantalla. */
  forgotPassword: (email: string) => Promise<string>;
  /** `accepted`: casillas ya marcadas (pantalla de registro) — si están todas, se mandan en el primer intento. */
  loginWithGoogle: (accepted?: Partial<Record<ConsentType, boolean>>) => Promise<void>;
  confirmGoogleConsent: (accepted: Partial<Record<ConsentType, boolean>>) => Promise<void>;
  cancelGoogleConsent: () => void;
  /** Re-aceptación de documentos actualizados (ver app/legal/aceptar.tsx). */
  acceptPendingConsents: (types: ConsentType[]) => Promise<void>;
  /** Llamado por el ApiClient ante un 403 consent_required (ver lib/api.ts). */
  markPendingConsents: (types: ConsentType[]) => void;
  isDeletingAccount: boolean;
  /**
   * DELETE /auth/me (irreversible). `password` solo para cuentas de correo;
   * si sale bien, limpia la sesión local igual que un logout.
   */
  deleteAccount: (payload: { confirmation: string; password?: string }) => Promise<void>;
  challenge2fa: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  /**
   * Limpia la sesión local sin llamar al servidor — a diferencia de
   * logout(), no hace POST /auth/logout. Pensada para el interceptor de 401
   * del ApiClient (ver lib/api.ts): si ya llegó un 401, el server ya
   * considera el token inválido, así que un logout "normal" solo generaría
   * otro 401 (y, sin cuidado, otra llamada a este mismo handler en bucle).
   */
  clearSessionLocal: () => void;
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

export const useAuthStore = create<AuthState>((set, get) => {
  /**
   * Google → Firebase → ID Token → mismo endpoint de "resultado de login"
   * que ya maneja email/password (user+token o desafío de 2FA) — así el
   * resto del flujo (guardar token, setOnboardingCompleted, etc.) es
   * idéntico sin importar cómo se autenticó. Si la cuenta es nueva y faltan
   * los consentimientos, queda en pendingSocialConsent (sin cuenta creada).
   */
  const submitSocialLogin = async (idToken: string, accepted?: Partial<Record<ConsentType, boolean>>) => {
    const payload: SocialLoginPayload = {
      id_token: idToken,
      provider: 'google',
      ...(accepted ? buildConsentFields(accepted) : {}),
    };
    const response = await api.post<SocialLoginResponse>('/auth/social', payload);

    if (isSocialConsentRequired(response)) {
      set({ isSubmittingGoogle: false, pendingSocialConsent: { idToken, consents: response.consents } });
      return;
    }

    if (isTwoFactorChallenge(response)) {
      set({ isSubmittingGoogle: false, pendingSocialConsent: null, pendingChallenge: { challengeToken: response.challenge_token } });
      return;
    }

    await tokenStorage.set(response.token);
    set({ user: response.user, token: response.token, isSubmittingGoogle: false, pendingSocialConsent: null });
  };

  return {
    user: null,
    token: null,
    isHydrating: true,
    isSubmitting: false,
    isSubmittingGoogle: false,
    error: null,
    pendingChallenge: null,
    pendingSocialConsent: null,
    isAcceptingConsents: false,
    isDeletingAccount: false,

    isUploadingAvatar: false,
    avatarError: null,

    isSubmittingForgotPassword: false,

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

    loginWithGoogle: async (accepted) => {
      set({ isSubmittingGoogle: true, error: null, pendingSocialConsent: null });
      try {
        const { idToken } = await signInWithGoogle();
        const allAccepted = !!accepted && Object.values(accepted).length > 0 && Object.values(accepted).every(Boolean);
        await submitSocialLogin(idToken, allAccepted ? accepted : undefined);
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

    confirmGoogleConsent: async (accepted) => {
      const pending = get().pendingSocialConsent;
      if (!pending) return;
      set({ isSubmittingGoogle: true, error: null });
      try {
        await submitSocialLogin(pending.idToken, accepted);
      } catch (err) {
        set({ isSubmittingGoogle: false, error: readErrorMessage(err) });
        throw err;
      }
    },

    cancelGoogleConsent: () => set({ pendingSocialConsent: null, isSubmittingGoogle: false }),

    acceptPendingConsents: async (types) => {
      set({ isAcceptingConsents: true, error: null });
      try {
        const { user } = await api.post<{ pending: PendingConsent[]; user: User }>('/legal/consents', {
          consents: types,
          legal_versions: currentConsentVersions(types),
        });
        set({ user, isAcceptingConsents: false });
      } catch (err) {
        set({ isAcceptingConsents: false, error: readErrorMessage(err) });
        throw err;
      }
    },

    markPendingConsents: (types) => {
      const { user } = get();
      if (user) set({ user: { ...user, pending_consents: types } });
    },

    deleteAccount: async (payload) => {
      set({ isDeletingAccount: true, error: null });
      try {
        await api.delete('/auth/me', payload);
      } catch (err) {
        set({ isDeletingAccount: false, error: readErrorMessage(err) });
        throw err;
      }
      // La cuenta (y sus tokens) ya no existe en el servidor: no tiene
      // sentido POST /auth/logout, solo limpiar lo local.
      await tokenStorage.clear();
      await signOutFromGoogle();
      set({ user: null, token: null, isDeletingAccount: false });
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

    forgotPassword: async (email: string): Promise<string> => {
      set({ isSubmittingForgotPassword: true, error: null });
      try {
        const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
        set({ isSubmittingForgotPassword: false });
        return response.message;
      } catch (err) {
        set({ isSubmittingForgotPassword: false, error: readErrorMessage(err) });
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

    clearSessionLocal: () => {
      set({ user: null, token: null });
      void tokenStorage.clear();
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
        // Subida multipart nativa, sin FormData en JS — ver lib/upload-file.ts
        // (era la diferencia con la web y el motivo de que en el APK el pedido
        // nunca llegara al servidor).
        const user = await uploadFileAsync<User>({
          path: '/auth/me/avatar',
          fieldName: 'avatar',
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType,
        });
        // El backend siempre debe devolver avatar_url tras un upload exitoso
        // (ver AuthController::updateAvatar) — si por lo que sea no viene,
        // mejor mostrar un error real que dejar la sesión con un estado que
        // no coincide con lo que el usuario acaba de confirmar en pantalla.
        if (!user?.avatar_url) {
          const message = 'La foto se subió pero el servidor no confirmó el cambio. Probá de nuevo.';
          set({ isUploadingAvatar: false, avatarError: message });
          throw new Error(message);
        }
        set({ user, isUploadingAvatar: false });
      } catch (err) {
        // Un ApiError ya trae un mensaje pensado para mostrarse (validación,
        // "no se pudo guardar la foto", etc). Cualquier otra cosa es un fallo
        // técnico (red, archivo ilegible, etc.): se muestra un mensaje genérico
        // pero con el detalle técnico al final, así un tester puede reportar
        // exactamente qué falló en vez de solo "no anda".
        const detail = err instanceof Error && err.message ? ` (detalle: ${err.message})` : '';
        const message = err instanceof ApiError ? readErrorMessage(err) : `No se pudo subir la foto. Probá de nuevo.${detail}`;
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
  };
});

export function useIsAuthenticated() {
  return useAuthStore((s) => s.token !== null && s.user !== null);
}
