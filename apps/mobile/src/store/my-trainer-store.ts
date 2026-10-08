// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «MyTrainer» desde «@sanken/core».
import type { MyTrainer } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «MyTrainerStoreState».
interface MyTrainerStoreState {
  // Esta línea sirve para declarar la propiedad «trainers» con el valor o tipo «MyTrainer[]».
  trainers: MyTrainer[];
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;
  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
}

// Esta línea sirve para declarar «useMyTrainerStore» con el valor «create<MyTrainerStoreState>((set) => ({».
export const useMyTrainerStore = create<MyTrainerStoreState>((set) => ({
  // Esta línea sirve para declarar la propiedad «trainers» con el valor o tipo «[]».
  trainers: [],
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<MyTrainer[]>('/me/trainers')» y guardar el resultado en «trainers».
      const trainers = await api.get<MyTrainer[]>('/me/trainers');
      // Esta línea sirve para guardar en el store: «trainers, isLoading: false })…».
      set({ trainers, isLoading: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
        isLoading: false,
        // Esta línea sirve para definir «error» con «err instanceof Error ? err.message : 'No…».
        error: err instanceof Error ? err.message : 'No se pudieron cargar tus entrenadores.',
      });
    }
  },
}));
