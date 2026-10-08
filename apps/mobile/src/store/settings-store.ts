// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «TwoFactorConfirmResponse, TwoFactorEnableResponse» desde «@sanken/core».
import type { TwoFactorConfirmResponse, TwoFactorEnableResponse } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

// Esta línea sirve para declarar la interfaz «SettingsStoreState».
interface SettingsStoreState {
  // Esta línea sirve para declarar la propiedad «enrollment» con el valor o tipo «TwoFactorEnableResponse | null».
  enrollment: TwoFactorEnableResponse | null;
  // Esta línea sirve para declarar la propiedad «recoveryCodes» con el valor o tipo «string[] | null».
  recoveryCodes: string[] | null;
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «boolean».
  isSubmitting: boolean;
  // Esta línea sirve para declarar la propiedad «submitError» con el valor o tipo «string | null».
  submitError: string | null;
  // Esta línea sirve para declarar la propiedad «isUpdatingPrivacy» con el valor o tipo «boolean».
  isUpdatingPrivacy: boolean;

  // Esta línea sirve para declarar la propiedad «enableTwoFactor» con el valor o tipo «() => Promise<void>».
  enableTwoFactor: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «confirmTwoFactor» con el valor o tipo «(code: string) => Promise<boolean>».
  confirmTwoFactor: (code: string) => Promise<boolean>;
  // Esta línea sirve para declarar la propiedad «disableTwoFactor» con el valor o tipo «(password: string) => Promise<boolean>».
  disableTwoFactor: (password: string) => Promise<boolean>;
  // Esta línea sirve para declarar la propiedad «dismissRecoveryCodes» con el valor o tipo «() => void».
  dismissRecoveryCodes: () => void;
  // Esta línea sirve para declarar la propiedad «setPublicProfile» con el valor o tipo «(isPublic: boolean) => Promise<void>».
  setPublicProfile: (isPublic: boolean) => Promise<void>;
}

// Esta línea sirve para declarar «useSettingsStore» con el valor «create<SettingsStoreState>((set) => ({».
export const useSettingsStore = create<SettingsStoreState>((set) => ({
  // Esta línea sirve para declarar la propiedad «enrollment» con el valor o tipo «null».
  enrollment: null,
  // Esta línea sirve para declarar la propiedad «recoveryCodes» con el valor o tipo «null».
  recoveryCodes: null,
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
  isSubmitting: false,
  // Esta línea sirve para declarar la propiedad «submitError» con el valor o tipo «null».
  submitError: null,
  // Esta línea sirve para declarar la propiedad «isUpdatingPrivacy» con el valor o tipo «false».
  isUpdatingPrivacy: false,

  // Esta línea sirve para declarar la propiedad «enableTwoFactor» con el valor o tipo «async () => {».
  enableTwoFactor: async () => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, submitError: null })…».
    set({ isSubmitting: true, submitError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<TwoFactorEnableResponse>('/auth/2fa/enabl» y guardar el resultado en «enrollment».
      const enrollment = await api.post<TwoFactorEnableResponse>('/auth/2fa/enable');
      // Esta línea sirve para guardar en el store: «enrollment, isSubmitting: false })…».
      set({ enrollment, isSubmitting: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, submitError: err instanceof Error ? err…».
      set({ isSubmitting: false, submitError: err instanceof Error ? err.message : 'No se pudo activar 2FA.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «confirmTwoFactor» con el valor o tipo «async (code) => {».
  confirmTwoFactor: async (code) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, submitError: null })…».
    set({ isSubmitting: true, submitError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<TwoFactorConfirmResponse>('/aut» y obtener «recovery_codes».
      const { recovery_codes } = await api.post<TwoFactorConfirmResponse>('/auth/2fa/confirm', { code });
      // Esta línea sirve para guardar en el store: «isSubmitting: false, enrollment: null, recoveryCodes: recove…».
      set({ isSubmitting: false, enrollment: null, recoveryCodes: recovery_codes });
      // Esta línea sirve para devolver «true».
      return true;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, submitError: err instanceof Error ? err…».
      set({ isSubmitting: false, submitError: err instanceof Error ? err.message : 'Código inválido.' });
      // Esta línea sirve para devolver «false».
      return false;
    }
  },

  // Esta línea sirve para declarar la propiedad «disableTwoFactor» con el valor o tipo «async (password) => {».
  disableTwoFactor: async (password) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, submitError: null })…».
    set({ isSubmitting: true, submitError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post('/auth/2fa/disable', { password });
      // Esta línea sirve para guardar en el store: «isSubmitting: false })…».
      set({ isSubmitting: false });
      // Esta línea sirve para devolver «true».
      return true;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, submitError: err instanceof Error ? err…».
      set({ isSubmitting: false, submitError: err instanceof Error ? err.message : 'No se pudo desactivar 2FA.' });
      // Esta línea sirve para devolver «false».
      return false;
    }
  },

  // Esta línea sirve para declarar la propiedad «dismissRecoveryCodes» con el valor o tipo «() => set({ recoveryCodes: null })».
  dismissRecoveryCodes: () => set({ recoveryCodes: null }),

  // Esta línea sirve para declarar la propiedad «setPublicProfile» con el valor o tipo «async (isPublic) => {».
  setPublicProfile: async (isPublic) => {
    // Esta línea sirve para guardar en el store: «isUpdatingPrivacy: true })…».
    set({ isUpdatingPrivacy: true });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post(isPublic ? '/rankings/opt-in' : '/rankings/opt-out');
      // Esta línea sirve para esperar el resultado de «useAuthStore.getState».
      await useAuthStore.getState().refreshMe();
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el store: «isUpdatingPrivacy: false })…».
      set({ isUpdatingPrivacy: false });
    }
  },
}));
