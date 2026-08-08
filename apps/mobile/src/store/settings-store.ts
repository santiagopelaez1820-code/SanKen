import { create } from 'zustand';
import type { TwoFactorConfirmResponse, TwoFactorEnableResponse } from '@sanken/core';

import { api } from '@/lib/api';

interface SettingsStoreState {
  enrollment: TwoFactorEnableResponse | null;
  recoveryCodes: string[] | null;
  isSubmitting: boolean;
  submitError: string | null;

  enableTwoFactor: () => Promise<void>;
  confirmTwoFactor: (code: string) => Promise<boolean>;
  disableTwoFactor: (password: string) => Promise<boolean>;
  dismissRecoveryCodes: () => void;
}

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  enrollment: null,
  recoveryCodes: null,
  isSubmitting: false,
  submitError: null,

  enableTwoFactor: async () => {
    set({ isSubmitting: true, submitError: null });
    try {
      const enrollment = await api.post<TwoFactorEnableResponse>('/auth/2fa/enable');
      set({ enrollment, isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, submitError: err instanceof Error ? err.message : 'No se pudo activar 2FA.' });
    }
  },

  confirmTwoFactor: async (code) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const { recovery_codes } = await api.post<TwoFactorConfirmResponse>('/auth/2fa/confirm', { code });
      set({ isSubmitting: false, enrollment: null, recoveryCodes: recovery_codes });
      return true;
    } catch (err) {
      set({ isSubmitting: false, submitError: err instanceof Error ? err.message : 'Código inválido.' });
      return false;
    }
  },

  disableTwoFactor: async (password) => {
    set({ isSubmitting: true, submitError: null });
    try {
      await api.post('/auth/2fa/disable', { password });
      set({ isSubmitting: false });
      return true;
    } catch (err) {
      set({ isSubmitting: false, submitError: err instanceof Error ? err.message : 'No se pudo desactivar 2FA.' });
      return false;
    }
  },

  dismissRecoveryCodes: () => set({ recoveryCodes: null }),
}));
