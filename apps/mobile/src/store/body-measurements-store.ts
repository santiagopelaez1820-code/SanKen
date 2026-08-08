import { create } from 'zustand';
import type { BodyMeasurement, RecordBodyMeasurementPayload } from '@sanken/core';

import { api } from '@/lib/api';

interface BodyMeasurementsStoreState {
  measurements: BodyMeasurement[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  submitError: string | null;

  load: () => Promise<void>;
  addMeasurement: (payload: RecordBodyMeasurementPayload) => Promise<boolean>;
}

export const useBodyMeasurementsStore = create<BodyMeasurementsStoreState>((set, get) => ({
  measurements: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
  submitError: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const envelope = await api.getWithMeta<BodyMeasurement[]>('/body-measurements');
      set({ measurements: envelope.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar tus medidas.' });
    }
  },

  addMeasurement: async (payload) => {
    set({ isSubmitting: true, submitError: null });
    try {
      await api.post('/body-measurements', payload);
      set({ isSubmitting: false });
      await get().load();
      return true;
    } catch (err) {
      set({ isSubmitting: false, submitError: err instanceof Error ? err.message : 'No se pudo registrar la medida.' });
      return false;
    }
  },
}));
