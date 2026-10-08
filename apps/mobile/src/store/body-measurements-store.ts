// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «BodyMeasurement, RecordBodyMeasurementPayload» desde «@sanken/core».
import type { BodyMeasurement, RecordBodyMeasurementPayload } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «BodyMeasurementsStoreState».
interface BodyMeasurementsStoreState {
  // Esta línea sirve para declarar la propiedad «measurements» con el valor o tipo «BodyMeasurement[]».
  measurements: BodyMeasurement[];
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «boolean».
  isSubmitting: boolean;
  // Esta línea sirve para declarar la propiedad «submitError» con el valor o tipo «string | null».
  submitError: string | null;

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
  // Esta línea sirve para definir «addMeasurement» con «(payload: RecordBodyMeasurementPayload) …».
  addMeasurement: (payload: RecordBodyMeasurementPayload) => Promise<boolean>;
}

// Esta línea sirve para crear el store de medidas corporales.
export const useBodyMeasurementsStore = create<BodyMeasurementsStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «measurements» con el valor o tipo «[]».
  measurements: [],
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
  isSubmitting: false,
  // Esta línea sirve para declarar la propiedad «submitError» con el valor o tipo «null».
  submitError: null,

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.getWithMeta<BodyMeasurement[]>('/body-measurem» y guardar el resultado en «envelope».
      const envelope = await api.getWithMeta<BodyMeasurement[]>('/body-measurements');
      // Esta línea sirve para guardar en el store: «measurements: envelope.data, isLoading: false })…».
      set({ measurements: envelope.data, isLoading: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar tus medidas.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «addMeasurement» con el valor o tipo «async (payload) => {».
  addMeasurement: async (payload) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, submitError: null })…».
    set({ isSubmitting: true, submitError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post('/body-measurements', payload);
      // Esta línea sirve para guardar en el store: «isSubmitting: false })…».
      set({ isSubmitting: false });
      // Esta línea sirve para esperar el resultado de «get».
      await get().load();
      // Esta línea sirve para devolver «true».
      return true;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, submitError: err instanceof Error ? err…».
      set({ isSubmitting: false, submitError: err instanceof Error ? err.message : 'No se pudo registrar la medida.' });
      // Esta línea sirve para devolver «false».
      return false;
    }
  },
}));
