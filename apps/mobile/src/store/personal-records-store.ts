import { create } from 'zustand';
import type { PersonalRecordSummary, RegisterPersonalRecordMeta, RegisterPersonalRecordPayload } from '@sanken/core';

import { api } from '@/lib/api';

interface PersonalRecordsStoreState {
  records: PersonalRecordSummary[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  submitError: string | null;
  lastIsNewBest: boolean | null;
  /**
   * Récord vigente después del último registro: el nuevo si lo superó, o
   * el que se conserva si no. La pantalla PR ya no tiene grilla de récords
   * (pedido del tester), así que la confirmación muestra este valor.
   */
  lastRecord: PersonalRecordSummary | null;

  load: () => Promise<void>;
  registerRecord: (payload: RegisterPersonalRecordPayload) => Promise<boolean>;
}

export const usePersonalRecordsStore = create<PersonalRecordsStoreState>((set, get) => ({
  records: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
  submitError: null,
  lastIsNewBest: null,
  lastRecord: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const records = await api.get<PersonalRecordSummary[]>('/stats/personal-records');
      set({ records, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar tus récords.' });
    }
  },

  registerRecord: async (payload) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const envelope = await api.postWithMeta<PersonalRecordSummary>('/stats/personal-records', payload);
      const meta = envelope.meta as RegisterPersonalRecordMeta | undefined;
      set({ isSubmitting: false, lastIsNewBest: meta?.is_new_best ?? null, lastRecord: envelope.data });
      await get().load();
      return true;
    } catch (err) {
      set({ isSubmitting: false, submitError: err instanceof Error ? err.message : 'No se pudo registrar el PR.' });
      return false;
    }
  },
}));
