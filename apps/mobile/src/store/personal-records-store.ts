// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «PersonalRecordSummary, RegisterPersonalRecordMeta, RegisterPersonalRecordPayload» desde «@sanken/core».
import type { PersonalRecordSummary, RegisterPersonalRecordMeta, RegisterPersonalRecordPayload } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «PersonalRecordsStoreState».
interface PersonalRecordsStoreState {
  // Esta línea sirve para declarar la propiedad «records» con el valor o tipo «PersonalRecordSummary[]».
  records: PersonalRecordSummary[];
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «boolean».
  isSubmitting: boolean;
  // Esta línea sirve para declarar la propiedad «submitError» con el valor o tipo «string | null».
  submitError: string | null;
  // Esta línea sirve para declarar la propiedad «lastIsNewBest» con el valor o tipo «boolean | null».
  lastIsNewBest: boolean | null;
  /**
   * Récord vigente después del último registro: el nuevo si lo superó, o
   * el que se conserva si no. La pantalla PR ya no tiene grilla de récords
   * (pedido del tester), así que la confirmación muestra este valor.
   */
  // Esta línea sirve para declarar la propiedad «lastRecord» con el valor o tipo «PersonalRecordSummary | null».
  lastRecord: PersonalRecordSummary | null;

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
  // Esta línea sirve para definir «registerRecord» con «(payload: RegisterPersonalRecordPayload)…».
  registerRecord: (payload: RegisterPersonalRecordPayload) => Promise<boolean>;
}

// Esta línea sirve para declarar «usePersonalRecordsStore» con el valor «create<PersonalRecordsStoreState>((set, get) => ({».
export const usePersonalRecordsStore = create<PersonalRecordsStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «records» con el valor o tipo «[]».
  records: [],
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
  isSubmitting: false,
  // Esta línea sirve para declarar la propiedad «submitError» con el valor o tipo «null».
  submitError: null,
  // Esta línea sirve para declarar la propiedad «lastIsNewBest» con el valor o tipo «null».
  lastIsNewBest: null,
  // Esta línea sirve para declarar la propiedad «lastRecord» con el valor o tipo «null».
  lastRecord: null,

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<PersonalRecordSummary[]>('/stats/personal-» y guardar el resultado en «records».
      const records = await api.get<PersonalRecordSummary[]>('/stats/personal-records');
      // Esta línea sirve para guardar en el store: «records, isLoading: false })…».
      set({ records, isLoading: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar tus récords.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «registerRecord» con el valor o tipo «async (payload) => {».
  registerRecord: async (payload) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, submitError: null })…».
    set({ isSubmitting: true, submitError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.postWithMeta<PersonalRecordSummary>('/stats/pe» y guardar el resultado en «envelope».
      const envelope = await api.postWithMeta<PersonalRecordSummary>('/stats/personal-records', payload);
      // Esta línea sirve para extraer «et» de «envelope.meta as RegisterPersonalRecordM».
      const meta = envelope.meta as RegisterPersonalRecordMeta | undefined;
      // Esta línea sirve para guardar en el store: «isSubmitting: false, lastIsNewBest: meta?.is_new_best ?? nul…».
      set({ isSubmitting: false, lastIsNewBest: meta?.is_new_best ?? null, lastRecord: envelope.data });
      // Esta línea sirve para esperar el resultado de «get».
      await get().load();
      // Esta línea sirve para devolver «true».
      return true;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, submitError: err instanceof Error ? err…».
      set({ isSubmitting: false, submitError: err instanceof Error ? err.message : 'No se pudo registrar el PR.' });
      // Esta línea sirve para devolver «false».
      return false;
    }
  },
}));
