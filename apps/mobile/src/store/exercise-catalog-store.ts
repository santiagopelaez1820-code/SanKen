// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «ExerciseCatalogItem» desde «@sanken/core».
import type { ExerciseCatalogItem } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «ExerciseCatalogStoreState».
interface ExerciseCatalogStoreState {
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «ExerciseCatalogItem[]».
  exercises: ExerciseCatalogItem[];
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;
  // Esta línea sirve para declarar la propiedad «loaded» con el valor o tipo «boolean».
  loaded: boolean;

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
}

// Esta línea sirve para declarar «useExerciseCatalogStore» con el valor «create<ExerciseCatalogStoreState>((set, get) => ({».
export const useExerciseCatalogStore = create<ExerciseCatalogStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «[]».
  exercises: [],
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,
  // Esta línea sirve para declarar la propiedad «loaded» con el valor o tipo «false».
  loaded: false,

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para salir de la función si «get().loaded || get().isLoading».
    if (get().loaded || get().isLoading) return;
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<ExerciseCatalogItem[]>('/exercises')» y guardar el resultado en «exercises».
      const exercises = await api.get<ExerciseCatalogItem[]>('/exercises');
      // Esta línea sirve para guardar en el store: «exercises, isLoading: false, loaded: true })…».
      set({ exercises, isLoading: false, loaded: true });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar el catálogo.' });
    }
  },
}));
