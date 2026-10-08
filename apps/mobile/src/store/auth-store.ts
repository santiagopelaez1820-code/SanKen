// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import type {
  // Esta línea sirve para incluir el valor «ConsentType» en la lista.
  ConsentType,
  // Esta línea sirve para incluir el valor «LoginPayload» en la lista.
  LoginPayload,
  // Esta línea sirve para incluir el valor «PendingConsent» en la lista.
  PendingConsent,
  // Esta línea sirve para incluir el valor «RegisterPayload» en la lista.
  RegisterPayload,
  // Esta línea sirve para incluir el valor «SocialLoginPayload» en la lista.
  SocialLoginPayload,
  // Esta línea sirve para incluir el valor «SocialLoginResponse» en la lista.
  SocialLoginResponse,
  // Esta línea sirve para incluir el valor «AuthPayload» en la lista.
  AuthPayload,
  // Esta línea sirve para incluir el valor «TwoFactorChallengeResponse» en la lista.
  TwoFactorChallengeResponse,
  // Esta línea sirve para incluir el valor «User» en la lista.
  User,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';
// Esta línea sirve para importar «ApiError, buildConsentFields, currentConsentVersions, isSocialConsentRequired, isTwoFactorChallenge» desde «@sanken/core».
import { ApiError, buildConsentFields, currentConsentVersions, isSocialConsentRequired, isTwoFactorChallenge } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «uploadFileAsync» desde «@/lib/upload-file».
import { uploadFileAsync } from '@/lib/upload-file';
// Esta línea sirve para importar «describeSocialAuthError, signInWithGoogle, signOutFromGoogle, SocialAuthCancelledError» desde «@/lib/social-auth».
import { describeSocialAuthError, signInWithGoogle, signOutFromGoogle, SocialAuthCancelledError } from '@/lib/social-auth';
// Esta línea sirve para importar «tokenStorage» desde «@/lib/token-storage».
import { tokenStorage } from '@/lib/token-storage';

// Esta línea sirve para declarar la interfaz «PendingChallenge».
interface PendingChallenge {
  // Esta línea sirve para declarar la propiedad «challengeToken» con el valor o tipo «string».
  challengeToken: string;
}

/**
 * "Continuar con Google" con una cuenta NUEVA sin consentimientos: el
 * backend no crea nada y devuelve qué hay que aceptar. Se guarda el
 * id_token (válido 1 h) para reenviarlo con las casillas marcadas.
 */
// Esta línea sirve para declarar la interfaz «PendingSocialConsent».
interface PendingSocialConsent {
  // Esta línea sirve para declarar la propiedad «idToken» con el valor o tipo «string».
  idToken: string;
  // Esta línea sirve para declarar la propiedad «consents» con el valor o tipo «PendingConsent[]».
  consents: PendingConsent[];
}

// Esta línea sirve para declarar la interfaz «AvatarPickerAsset».
interface AvatarPickerAsset {
  // Esta línea sirve para declarar la propiedad «uri» con el valor o tipo «string».
  uri: string;
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string;
  // Esta línea sirve para declarar la propiedad «mimeType» con el valor o tipo «string | null».
  mimeType: string | null;
}

// Esta línea sirve para declarar la interfaz «AuthState».
interface AuthState {
  // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «User | null».
  user: User | null;
  // Esta línea sirve para declarar la propiedad «token» con el valor o tipo «string | null».
  token: string | null;
  /** true mientras se restaura la sesión guardada al abrir la app. */
  // Esta línea sirve para declarar la propiedad «isHydrating» con el valor o tipo «boolean».
  isHydrating: boolean;
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «boolean».
  isSubmitting: boolean;
  /** Separado de isSubmitting para que el botón de Google muestre su propio "Continuando…" sin pisar el form tradicional. */
  // Esta línea sirve para declarar la propiedad «isSubmittingGoogle» con el valor o tipo «boolean».
  isSubmittingGoogle: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;
  // Esta línea sirve para declarar la propiedad «pendingChallenge» con el valor o tipo «PendingChallenge | null».
  pendingChallenge: PendingChallenge | null;
  // Esta línea sirve para declarar la propiedad «pendingSocialConsent» con el valor o tipo «PendingSocialConsent | null».
  pendingSocialConsent: PendingSocialConsent | null;
  // Esta línea sirve para declarar la propiedad «isAcceptingConsents» con el valor o tipo «boolean».
  isAcceptingConsents: boolean;

  // Esta línea sirve para declarar la propiedad «isUploadingAvatar» con el valor o tipo «boolean».
  isUploadingAvatar: boolean;
  // Esta línea sirve para declarar la propiedad «avatarError» con el valor o tipo «string | null».
  avatarError: string | null;

  // Esta línea sirve para declarar la propiedad «isSubmittingForgotPassword» con el valor o tipo «boolean».
  isSubmittingForgotPassword: boolean;

  // Esta línea sirve para declarar la propiedad «hydrate» con el valor o tipo «() => Promise<void>».
  hydrate: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «register» con el valor o tipo «(payload: RegisterPayload) => Promise<void>».
  register: (payload: RegisterPayload) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «login» con el valor o tipo «(payload: LoginPayload) => Promise<void>».
  login: (payload: LoginPayload) => Promise<void>;
  /** No inicia sesión — solo dispara el correo de recuperación. Devuelve el mensaje del backend para mostrarlo en pantalla. */
  // Esta línea sirve para declarar la propiedad «forgotPassword» con el valor o tipo «(email: string) => Promise<string>».
  forgotPassword: (email: string) => Promise<string>;
  /** `accepted`: casillas ya marcadas (pantalla de registro) — si están todas, se mandan en el primer intento. */
  // Esta línea sirve para definir «loginWithGoogle» con «(accepted?: Partial<Record<ConsentType, …».
  loginWithGoogle: (accepted?: Partial<Record<ConsentType, boolean>>) => Promise<void>;
  // Esta línea sirve para definir «confirmGoogleConsent» con «(accepted: Partial<Record<ConsentType, b…».
  confirmGoogleConsent: (accepted: Partial<Record<ConsentType, boolean>>) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «cancelGoogleConsent» con el valor o tipo «() => void».
  cancelGoogleConsent: () => void;
  /** Re-aceptación de documentos actualizados (ver app/legal/aceptar.tsx). */
  // Esta línea sirve para declarar la propiedad «acceptPendingConsents» con el valor o tipo «(types: ConsentType[]) => Promise<void>».
  acceptPendingConsents: (types: ConsentType[]) => Promise<void>;
  /** Llamado por el ApiClient ante un 403 consent_required (ver lib/api.ts). */
  // Esta línea sirve para declarar la propiedad «markPendingConsents» con el valor o tipo «(types: ConsentType[]) => void».
  markPendingConsents: (types: ConsentType[]) => void;
  // Esta línea sirve para declarar la propiedad «isDeletingAccount» con el valor o tipo «boolean».
  isDeletingAccount: boolean;
  /**
   * DELETE /auth/me (irreversible). `password` solo para cuentas de correo;
   * si sale bien, limpia la sesión local igual que un logout.
   */
  // Esta línea sirve para definir «deleteAccount» con «(payload: { confirmation: string; passwo…».
  deleteAccount: (payload: { confirmation: string; password?: string }) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «challenge2fa» con el valor o tipo «(code: string) => Promise<void>».
  challenge2fa: (code: string) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «logout» con el valor o tipo «() => Promise<void>».
  logout: () => Promise<void>;
  /**
   * Limpia la sesión local sin llamar al servidor — a diferencia de
   * logout(), no hace POST /auth/logout. Pensada para el interceptor de 401
   * del ApiClient (ver lib/api.ts): si ya llegó un 401, el server ya
   * considera el token inválido, así que un logout "normal" solo generaría
   * otro 401 (y, sin cuidado, otra llamada a este mismo handler en bucle).
   */
  // Esta línea sirve para declarar la propiedad «clearSessionLocal» con el valor o tipo «() => void».
  clearSessionLocal: () => void;
  // Esta línea sirve para declarar la propiedad «refreshMe» con el valor o tipo «() => Promise<void>».
  refreshMe: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «setOnboardingCompleted» con el valor o tipo «() => void».
  setOnboardingCompleted: () => void;
  // Esta línea sirve para declarar la propiedad «updateAvatar» con el valor o tipo «(asset: AvatarPickerAsset) => Promise<void>».
  updateAvatar: (asset: AvatarPickerAsset) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «deleteAvatar» con el valor o tipo «() => Promise<void>».
  deleteAvatar: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «clearError» con el valor o tipo «() => void».
  clearError: () => void;
}

// Esta línea sirve para declarar la función «readErrorMessage».
function readErrorMessage(err: unknown): string {
  // Esta línea sirve para revisar si «err instanceof ApiError».
  if (err instanceof ApiError) {
    // Esta línea sirve para extraer «irstFieldErro» de «Object.values(err.body.errors ?? {})[0]?».
    const firstFieldError = Object.values(err.body.errors ?? {})[0]?.[0];
    // Esta línea sirve para devolver «firstFieldError ?? err.body.message».
    return firstFieldError ?? err.body.message;
  }
  // Esta línea sirve para devolver el mensaje del error o uno genérico.
  return err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
}

// Esta línea sirve para declarar «useAuthStore» con el valor «create<AuthState>((set, get) => {».
export const useAuthStore = create<AuthState>((set, get) => {
  /**
   * Google → Firebase → ID Token → mismo endpoint de "resultado de login"
   * que ya maneja email/password (user+token o desafío de 2FA) — así el
   * resto del flujo (guardar token, setOnboardingCompleted, etc.) es
   * idéntico sin importar cómo se autenticó. Si la cuenta es nueva y faltan
   * los consentimientos, queda en pendingSocialConsent (sin cuenta creada).
   */
  // Esta línea sirve para extraer «ubmitSocialLogi» de «async (idToken: string, accepted?: Parti».
  const submitSocialLogin = async (idToken: string, accepted?: Partial<Record<ConsentType, boolean>>) => {
    // Esta línea sirve para extraer «ayload: SocialLoginPayloa» de «{».
    const payload: SocialLoginPayload = {
      // Esta línea sirve para declarar la propiedad «id_token» con el valor o tipo «idToken».
      id_token: idToken,
      // Esta línea sirve para declarar la propiedad «provider» con el valor o tipo «'google'».
      provider: 'google',
      // Esta línea sirve para incluir los elementos o propiedades de «accepted ? buildConsentFields(accepted) : {}».
      ...(accepted ? buildConsentFields(accepted) : {}),
    };
    // Esta línea sirve para esperar «api.post<SocialLoginResponse>('/auth/social', payl» y guardar el resultado en «response».
    const response = await api.post<SocialLoginResponse>('/auth/social', payload);

    // Esta línea sirve para revisar si «isSocialConsentRequired(response)».
    if (isSocialConsentRequired(response)) {
      // Esta línea sirve para guardar en el store: «isSubmittingGoogle: false, pendingSocialConsent: { idToken, …».
      set({ isSubmittingGoogle: false, pendingSocialConsent: { idToken, consents: response.consents } });
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Esta línea sirve para revisar si «isTwoFactorChallenge(response)».
    if (isTwoFactorChallenge(response)) {
      // Esta línea sirve para guardar en el store: «isSubmittingGoogle: false, pendingSocialConsent: null, pendi…».
      set({ isSubmittingGoogle: false, pendingSocialConsent: null, pendingChallenge: { challengeToken: response.challenge_token } });
      // Esta línea sirve para terminar la función sin devolver nada.
      return;
    }

    // Esta línea sirve para esperar el resultado de «tokenStorage.set».
    await tokenStorage.set(response.token);
    // Esta línea sirve para guardar en el store: «user: response.user, token: response.token, isSubmittingGoog…».
    set({ user: response.user, token: response.token, isSubmittingGoogle: false, pendingSocialConsent: null });
  };

  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «null».
    user: null,
    // Esta línea sirve para declarar la propiedad «token» con el valor o tipo «null».
    token: null,
    // Esta línea sirve para declarar la propiedad «isHydrating» con el valor o tipo «true».
    isHydrating: true,
    // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
    isSubmitting: false,
    // Esta línea sirve para declarar la propiedad «isSubmittingGoogle» con el valor o tipo «false».
    isSubmittingGoogle: false,
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
    error: null,
    // Esta línea sirve para declarar la propiedad «pendingChallenge» con el valor o tipo «null».
    pendingChallenge: null,
    // Esta línea sirve para declarar la propiedad «pendingSocialConsent» con el valor o tipo «null».
    pendingSocialConsent: null,
    // Esta línea sirve para declarar la propiedad «isAcceptingConsents» con el valor o tipo «false».
    isAcceptingConsents: false,
    // Esta línea sirve para declarar la propiedad «isDeletingAccount» con el valor o tipo «false».
    isDeletingAccount: false,

    // Esta línea sirve para declarar la propiedad «isUploadingAvatar» con el valor o tipo «false».
    isUploadingAvatar: false,
    // Esta línea sirve para declarar la propiedad «avatarError» con el valor o tipo «null».
    avatarError: null,

    // Esta línea sirve para declarar la propiedad «isSubmittingForgotPassword» con el valor o tipo «false».
    isSubmittingForgotPassword: false,

    // Esta línea sirve para declarar la propiedad «hydrate» con el valor o tipo «async () => {».
    hydrate: async () => {
      // Esta línea sirve para esperar «tokenStorage.get()» y guardar el resultado en «token».
      const token = await tokenStorage.get();

      // Esta línea sirve para revisar si «!token».
      if (!token) {
        // Esta línea sirve para guardar en el store: «isHydrating: false })…».
        set({ isHydrating: false });
        // Esta línea sirve para terminar la función sin devolver nada.
        return;
      }

      // Esta línea sirve para guardar en el store: «token })…».
      set({ token });

      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar «api.get<User>('/auth/me')» y guardar el resultado en «user».
        const user = await api.get<User>('/auth/me');
        // Esta línea sirve para guardar en el store: «user, isHydrating: false })…».
        set({ user, isHydrating: false });
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch {
        // Esta línea sirve para esperar el resultado de «tokenStorage.clear».
        await tokenStorage.clear();
        // Esta línea sirve para guardar en el store: «token: null, user: null, isHydrating: false })…».
        set({ token: null, user: null, isHydrating: false });
      }
    },

    // Esta línea sirve para declarar la propiedad «register» con el valor o tipo «async (payload) => {».
    register: async (payload) => {
      // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
      set({ isSubmitting: true, error: null });
      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar «api.post<AuthPayload>('/auth/register', » y obtener «user, token».
        const { user, token } = await api.post<AuthPayload>('/auth/register', payload);
        // Esta línea sirve para esperar el resultado de «tokenStorage.set».
        await tokenStorage.set(token);
        // Esta línea sirve para guardar en el store: «user, token, isSubmitting: false })…».
        set({ user, token, isSubmitting: false });
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch (err) {
        // Esta línea sirve para guardar en el store: «isSubmitting: false, error: readErrorMessage(err) })…».
        set({ isSubmitting: false, error: readErrorMessage(err) });
        // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
        throw err;
      }
    },

    // Esta línea sirve para declarar la propiedad «login» con el valor o tipo «async (payload) => {».
    login: async (payload) => {
      // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
      set({ isSubmitting: true, error: null });
      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar «api.post<AuthPayload | TwoFactorChallengeResponse>» y guardar el resultado en «response».
        const response = await api.post<AuthPayload | TwoFactorChallengeResponse>('/auth/login', payload);

        // Esta línea sirve para revisar si «isTwoFactorChallenge(response)».
        if (isTwoFactorChallenge(response)) {
          // Esta línea sirve para guardar en el store: «isSubmitting: false, pendingChallenge: { challengeToken: res…».
          set({ isSubmitting: false, pendingChallenge: { challengeToken: response.challenge_token } });
          // Esta línea sirve para terminar la función sin devolver nada.
          return;
        }

        // Esta línea sirve para esperar el resultado de «tokenStorage.set».
        await tokenStorage.set(response.token);
        // Esta línea sirve para guardar en el store: «user: response.user, token: response.token, isSubmitting: fa…».
        set({ user: response.user, token: response.token, isSubmitting: false });
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch (err) {
        // Esta línea sirve para guardar en el store: «isSubmitting: false, error: readErrorMessage(err) })…».
        set({ isSubmitting: false, error: readErrorMessage(err) });
        // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
        throw err;
      }
    },

    // Esta línea sirve para declarar la propiedad «loginWithGoogle» con el valor o tipo «async (accepted) => {».
    loginWithGoogle: async (accepted) => {
      // Esta línea sirve para guardar en el store: «isSubmittingGoogle: true, error: null, pendingSocialConsent:…».
      set({ isSubmittingGoogle: true, error: null, pendingSocialConsent: null });
      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar «signInWithGoogle()» y obtener «idToken».
        const { idToken } = await signInWithGoogle();
        // Esta línea sirve para extraer «llAccepte» de «!!accepted && Object.values(accepted).le».
        const allAccepted = !!accepted && Object.values(accepted).length > 0 && Object.values(accepted).every(Boolean);
        // Esta línea sirve para esperar el resultado de «submitSocialLogin».
        await submitSocialLogin(idToken, allAccepted ? accepted : undefined);
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch (err) {
        // Cancelar el popup a propósito no es un error para mostrarle al
        // usuario — solo se limpia el estado de carga y vuelve al login.
        // Esta línea sirve para revisar si «err instanceof SocialAuthCancelledError».
        if (err instanceof SocialAuthCancelledError) {
          // Esta línea sirve para guardar en el store: «isSubmittingGoogle: false })…».
          set({ isSubmittingGoogle: false });
          // Esta línea sirve para terminar la función sin devolver nada.
          return;
        }
        // Un ApiError viene del backend (ej. "ya existe una cuenta con este
        // correo") y ya trae un mensaje en español listo para mostrar — solo
        // los errores de Firebase/red necesitan el mapeo de códigos técnicos.
        // Esta línea sirve para extraer «essag» de «err instanceof ApiError ? readErrorMessa».
        const message = err instanceof ApiError ? readErrorMessage(err) : describeSocialAuthError(err);
        // Esta línea sirve para guardar en el store: «isSubmittingGoogle: false, error: message })…».
        set({ isSubmittingGoogle: false, error: message });
        // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
        throw err;
      }
    },

    // Esta línea sirve para declarar la propiedad «confirmGoogleConsent» con el valor o tipo «async (accepted) => {».
    confirmGoogleConsent: async (accepted) => {
      // Esta línea sirve para extraer «endin» de «get().pendingSocialConsent».
      const pending = get().pendingSocialConsent;
      // Esta línea sirve para salir de la función si «!pending».
      if (!pending) return;
      // Esta línea sirve para guardar en el store: «isSubmittingGoogle: true, error: null })…».
      set({ isSubmittingGoogle: true, error: null });
      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar el resultado de «submitSocialLogin».
        await submitSocialLogin(pending.idToken, accepted);
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch (err) {
        // Esta línea sirve para guardar en el store: «isSubmittingGoogle: false, error: readErrorMessage(err) })…».
        set({ isSubmittingGoogle: false, error: readErrorMessage(err) });
        // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
        throw err;
      }
    },

    // Esta línea sirve para definir «cancelGoogleConsent» con «() => set({ pendingSocialConsent: null, …».
    cancelGoogleConsent: () => set({ pendingSocialConsent: null, isSubmittingGoogle: false }),

    // Esta línea sirve para declarar la propiedad «acceptPendingConsents» con el valor o tipo «async (types) => {».
    acceptPendingConsents: async (types) => {
      // Esta línea sirve para guardar en el store: «isAcceptingConsents: true, error: null })…».
      set({ isAcceptingConsents: true, error: null });
      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar «api.post<{ pending: PendingConsent[]; us» y obtener «user».
        const { user } = await api.post<{ pending: PendingConsent[]; user: User }>('/legal/consents', {
          // Esta línea sirve para declarar la propiedad «consents» con el valor o tipo «types».
          consents: types,
          // Esta línea sirve para declarar la propiedad «legal_versions» con el valor o tipo «currentConsentVersions(types)».
          legal_versions: currentConsentVersions(types),
        });
        // Esta línea sirve para guardar en el store: «user, isAcceptingConsents: false })…».
        set({ user, isAcceptingConsents: false });
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch (err) {
        // Esta línea sirve para guardar en el store: «isAcceptingConsents: false, error: readErrorMessage(err) })…».
        set({ isAcceptingConsents: false, error: readErrorMessage(err) });
        // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
        throw err;
      }
    },

    // Esta línea sirve para declarar la propiedad «markPendingConsents» con el valor o tipo «(types) => {».
    markPendingConsents: (types) => {
      // Esta línea sirve para extraer «user» de «get()».
      const { user } = get();
      // Esta línea sirve para llamar a «set» si «user».
      if (user) set({ user: { ...user, pending_consents: types } });
    },

    // Esta línea sirve para declarar la propiedad «deleteAccount» con el valor o tipo «async (payload) => {».
    deleteAccount: async (payload) => {
      // Esta línea sirve para guardar en el store: «isDeletingAccount: true, error: null })…».
      set({ isDeletingAccount: true, error: null });
      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar el resultado de «api.delete».
        await api.delete('/auth/me', payload);
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch (err) {
        // Esta línea sirve para guardar en el store: «isDeletingAccount: false, error: readErrorMessage(err) })…».
        set({ isDeletingAccount: false, error: readErrorMessage(err) });
        // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
        throw err;
      }
      // La cuenta (y sus tokens) ya no existe en el servidor: no tiene
      // sentido POST /auth/logout, solo limpiar lo local.
      // Esta línea sirve para esperar el resultado de «tokenStorage.clear».
      await tokenStorage.clear();
      // Esta línea sirve para esperar el resultado de «signOutFromGoogle».
      await signOutFromGoogle();
      // Esta línea sirve para guardar en el store: «user: null, token: null, isDeletingAccount: false })…».
      set({ user: null, token: null, isDeletingAccount: false });
    },

    // Esta línea sirve para declarar la propiedad «challenge2fa» con el valor o tipo «async (code) => {».
    challenge2fa: async (code) => {
      // Esta línea sirve para extraer «pendingChallenge» de «get()».
      const { pendingChallenge } = get();
      // Esta línea sirve para salir de la función si «!pendingChallenge».
      if (!pendingChallenge) return;

      // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
      set({ isSubmitting: true, error: null });
      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar «api.post<AuthPayload>('/auth/2fa/challen» y obtener «user, token».
        const { user, token } = await api.post<AuthPayload>('/auth/2fa/challenge', {
          // Esta línea sirve para declarar la propiedad «challenge_token» con el valor o tipo «pendingChallenge.challengeToken».
          challenge_token: pendingChallenge.challengeToken,
          // Esta línea sirve para incluir el valor «code» en la lista.
          code,
        });
        // Esta línea sirve para esperar el resultado de «tokenStorage.set».
        await tokenStorage.set(token);
        // Esta línea sirve para guardar en el store: «user, token, isSubmitting: false, pendingChallenge: null })…».
        set({ user, token, isSubmitting: false, pendingChallenge: null });
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch (err) {
        // Esta línea sirve para guardar en el store: «isSubmitting: false, error: readErrorMessage(err) })…».
        set({ isSubmitting: false, error: readErrorMessage(err) });
        // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
        throw err;
      }
    },

    // Esta línea sirve para declarar la propiedad «forgotPassword» con el valor o tipo «async (email: string): Promise<string> => {».
    forgotPassword: async (email: string): Promise<string> => {
      // Esta línea sirve para guardar en el store: «isSubmittingForgotPassword: true, error: null })…».
      set({ isSubmittingForgotPassword: true, error: null });
      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar «api.post<{ message: string }>('/auth/forgot-passwo» y guardar el resultado en «response».
        const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
        // Esta línea sirve para guardar en el store: «isSubmittingForgotPassword: false })…».
        set({ isSubmittingForgotPassword: false });
        // Esta línea sirve para devolver «response.message».
        return response.message;
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch (err) {
        // Esta línea sirve para guardar en el store: «isSubmittingForgotPassword: false, error: readErrorMessage(e…».
        set({ isSubmittingForgotPassword: false, error: readErrorMessage(err) });
        // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
        throw err;
      }
    },

    // Esta línea sirve para declarar la propiedad «logout» con el valor o tipo «async () => {».
    logout: async () => {
      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar el resultado de «api.post».
        await api.post('/auth/logout');
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch {
        // Si el token ya era inválido no hay nada que revertir del lado del servidor.
      }
      // Esta línea sirve para esperar el resultado de «tokenStorage.clear».
      await tokenStorage.clear();
      // Sin esto, la próxima vez que se toca "Continuar con Google" el SDK
      // nativo reutiliza en silencio la última cuenta sin mostrar el
      // selector — ver el comentario en signOutFromGoogle().
      // Esta línea sirve para esperar el resultado de «signOutFromGoogle».
      await signOutFromGoogle();
      // Esta línea sirve para guardar en el store: «user: null, token: null })…».
      set({ user: null, token: null });
    },

    // Esta línea sirve para declarar la propiedad «clearSessionLocal» con el valor o tipo «() => {».
    clearSessionLocal: () => {
      // Esta línea sirve para guardar en el store: «user: null, token: null })…».
      set({ user: null, token: null });
      // Esta línea sirve para ejecutar «tokenStorage.clear» sin esperar su resultado.
      void tokenStorage.clear();
    },

    // Esta línea sirve para declarar la propiedad «refreshMe» con el valor o tipo «async () => {».
    refreshMe: async () => {
      // Esta línea sirve para esperar «api.get<User>('/auth/me')» y guardar el resultado en «user».
      const user = await api.get<User>('/auth/me');
      // Esta línea sirve para guardar en el store: «user })…».
      set({ user });
    },

    // Esta línea sirve para declarar la propiedad «setOnboardingCompleted» con el valor o tipo «() => {».
    setOnboardingCompleted: () => {
      // Esta línea sirve para extraer «user» de «get()».
      const { user } = get();
      // Esta línea sirve para llamar a «set» si «user».
      if (user) set({ user: { ...user, onboarding_completed: true } });
    },

    /**
     * Si el upload falla, `user` nunca se toca — la foto anterior queda como
     * estaba. Solo se reemplaza en `set()` cuando el backend confirma que la
     * nueva quedó guardada.
     */
    // Esta línea sirve para declarar la propiedad «updateAvatar» con el valor o tipo «async (asset) => {».
    updateAvatar: async (asset) => {
      // Esta línea sirve para guardar en el store: «isUploadingAvatar: true, avatarError: null })…».
      set({ isUploadingAvatar: true, avatarError: null });

      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Subida multipart nativa, sin FormData en JS — ver lib/upload-file.ts
        // (era la diferencia con la web y el motivo de que en el APK el pedido
        // nunca llegara al servidor).
        // Esta línea sirve para esperar «uploadFileAsync<User>({» y guardar el resultado en «user».
        const user = await uploadFileAsync<User>({
          // Esta línea sirve para declarar la propiedad «path» con el valor o tipo «'/auth/me/avatar'».
          path: '/auth/me/avatar',
          // Esta línea sirve para declarar la propiedad «fieldName» con el valor o tipo «'avatar'».
          fieldName: 'avatar',
          // Esta línea sirve para declarar la propiedad «uri» con el valor o tipo «asset.uri».
          uri: asset.uri,
          // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «asset.name».
          name: asset.name,
          // Esta línea sirve para declarar la propiedad «mimeType» con el valor o tipo «asset.mimeType».
          mimeType: asset.mimeType,
        });
        // El backend siempre debe devolver avatar_url tras un upload exitoso
        // (ver AuthController::updateAvatar) — si por lo que sea no viene,
        // mejor mostrar un error real que dejar la sesión con un estado que
        // no coincide con lo que el usuario acaba de confirmar en pantalla.
        // Esta línea sirve para revisar si «!user?.avatar_url».
        if (!user?.avatar_url) {
          // Esta línea sirve para extraer «essag» de «'La foto se subió pero el servidor no co».
          const message = 'La foto se subió pero el servidor no confirmó el cambio. Probá de nuevo.';
          // Esta línea sirve para guardar en el store: «isUploadingAvatar: false, avatarError: message })…».
          set({ isUploadingAvatar: false, avatarError: message });
          // Esta línea sirve para lanzar un error de tipo «Error».
          throw new Error(message);
        }
        // Esta línea sirve para guardar en el store: «user, isUploadingAvatar: false })…».
        set({ user, isUploadingAvatar: false });
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch (err) {
        // Un ApiError ya trae un mensaje pensado para mostrarse (validación,
        // "no se pudo guardar la foto", etc). Cualquier otra cosa es un fallo
        // técnico (red, archivo ilegible, etc.): se muestra un mensaje genérico
        // pero con el detalle técnico al final, así un tester puede reportar
        // exactamente qué falló en vez de solo "no anda".
        // Esta línea sirve para extraer «etai» de «err instanceof Error && err.message ? ` ».
        const detail = err instanceof Error && err.message ? ` (detalle: ${err.message})` : '';
        // Esta línea sirve para extraer «essag» de «err instanceof ApiError ? readErrorMessa».
        const message = err instanceof ApiError ? readErrorMessage(err) : `No se pudo subir la foto. Probá de nuevo.${detail}`;
        // Esta línea sirve para revisar si «!(err instanceof ApiError)».
        if (!(err instanceof ApiError)) {
          // Esta línea sirve para registrar en consola el fallo inesperado al subir el avatar.
          console.error('[updateAvatar] fallo inesperado subiendo el avatar:', err);
        }
        // Esta línea sirve para guardar en el store a partir del estado anterior: «isUploadingAvatar: false, avatarError: state.avata…».
        set((state) => ({ isUploadingAvatar: false, avatarError: state.avatarError ?? message }));
        // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
        throw err;
      }
    },

    // Esta línea sirve para declarar la propiedad «deleteAvatar» con el valor o tipo «async () => {».
    deleteAvatar: async () => {
      // Esta línea sirve para guardar en el store: «isUploadingAvatar: true, avatarError: null })…».
      set({ isUploadingAvatar: true, avatarError: null });
      // Esta línea sirve para intentar ejecutar el bloque siguiente.
      try {
        // Esta línea sirve para esperar «api.delete<User>('/auth/me/avatar')» y guardar el resultado en «user».
        const user = await api.delete<User>('/auth/me/avatar');
        // Esta línea sirve para guardar en el store: «user, isUploadingAvatar: false })…».
        set({ user, isUploadingAvatar: false });
      // Esta línea sirve para capturar cualquier error del bloque anterior.
      } catch (err) {
        // Esta línea sirve para guardar en el store: «isUploadingAvatar: false, avatarError: readErrorMessage(err)…».
        set({ isUploadingAvatar: false, avatarError: readErrorMessage(err) });
        // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
        throw err;
      }
    },

    // Esta línea sirve para declarar la propiedad «clearError» con el valor o tipo «() => set({ error: null })».
    clearError: () => set({ error: null }),
  };
});

// Esta línea sirve para declarar la función «useIsAuthenticated».
export function useIsAuthenticated() {
  // Esta línea sirve para devolver si hay sesión iniciada con token y usuario.
  return useAuthStore((s) => s.token !== null && s.user !== null);
}
