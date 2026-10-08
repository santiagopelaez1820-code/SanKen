// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «GamificationSummary» desde «@sanken/core».
import type { GamificationSummary } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «GamificationStoreState».
interface GamificationStoreState {
  // Esta línea sirve para declarar la propiedad «summary» con el valor o tipo «GamificationSummary | null».
  summary: GamificationSummary | null;
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;
  // Esta línea sirve para declarar la propiedad «loadSummary» con el valor o tipo «() => Promise<void>».
  loadSummary: () => Promise<void>;
}

// Esta línea sirve para declarar «useGamificationStore» con el valor «create<GamificationStoreState>((set) => ({».
export const useGamificationStore = create<GamificationStoreState>((set) => ({
  // Esta línea sirve para declarar la propiedad «summary» con el valor o tipo «null».
  summary: null,
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,

  // Esta línea sirve para declarar la propiedad «loadSummary» con el valor o tipo «async () => {».
  loadSummary: async () => {
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<GamificationSummary>('/gamification')» y guardar el resultado en «summary».
      const summary = await api.get<GamificationSummary>('/gamification');
      // Esta línea sirve para guardar en el store: «summary, isLoading: false })…».
      set({ summary, isLoading: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar tu progreso.' });
    }
  },
}));
