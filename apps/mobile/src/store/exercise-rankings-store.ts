// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «ExerciseRankingResponse, ExerciseRankingScope, ExerciseRankingSex» desde «@sanken/core».
import type { ExerciseRankingResponse, ExerciseRankingScope, ExerciseRankingSex } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «ExerciseRankingsStoreState».
interface ExerciseRankingsStoreState {
  // Esta línea sirve para declarar la propiedad «exerciseId» con el valor o tipo «number | null».
  exerciseId: number | null;
  // Esta línea sirve para declarar la propiedad «scope» con el valor o tipo «ExerciseRankingScope».
  scope: ExerciseRankingScope;
  // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «ExerciseRankingSex».
  sex: ExerciseRankingSex;
  // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «ExerciseRankingResponse | null».
  data: ExerciseRankingResponse | null;
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;

  // Esta línea sirve para declarar la propiedad «setExercise» con el valor o tipo «(exerciseId: number) => void».
  setExercise: (exerciseId: number) => void;
  // Esta línea sirve para declarar la propiedad «setScope» con el valor o tipo «(scope: ExerciseRankingScope) => void».
  setScope: (scope: ExerciseRankingScope) => void;
  // Esta línea sirve para declarar la propiedad «setSex» con el valor o tipo «(sex: ExerciseRankingSex) => void».
  setSex: (sex: ExerciseRankingSex) => void;
  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
}

// Esta línea sirve para crear el store de rankings por ejercicio.
export const useExerciseRankingsStore = create<ExerciseRankingsStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «exerciseId» con el valor o tipo «null».
  exerciseId: null,
  // Esta línea sirve para declarar la propiedad «scope» con el valor o tipo «'global'».
  scope: 'global',
  // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «'male'».
  sex: 'male',
  // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «null».
  data: null,
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,

  // Esta línea sirve para declarar la propiedad «setExercise» con el valor o tipo «(exerciseId) => {».
  setExercise: (exerciseId) => {
    // Esta línea sirve para guardar en el store: «exerciseId, data: null })…».
    set({ exerciseId, data: null });
    // Esta línea sirve para llamar a «get» con «).load(».
    get().load();
  },

  // Esta línea sirve para declarar la propiedad «setScope» con el valor o tipo «(scope) => {».
  setScope: (scope) => {
    // Esta línea sirve para guardar en el store: «scope })…».
    set({ scope });
    // Esta línea sirve para llamar a «get» con «).load(».
    get().load();
  },

  // Esta línea sirve para declarar la propiedad «setSex» con el valor o tipo «(sex) => {».
  setSex: (sex) => {
    // Esta línea sirve para guardar en el store: «sex })…».
    set({ sex });
    // Esta línea sirve para llamar a «get» con «).load(».
    get().load();
  },

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para extraer «exerciseId, scope, sex» de «get()».
    const { exerciseId, scope, sex } = get();
    // Esta línea sirve para salir de la función si «!exerciseId».
    if (!exerciseId) return;
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<ExerciseRankingResponse>(`/exercises/${exe» y guardar el resultado en «data».
      const data = await api.get<ExerciseRankingResponse>(`/exercises/${exerciseId}/rankings?scope=${scope}&sex=${sex}`);
      // Esta línea sirve para guardar en el store: «data, isLoading: false })…».
      set({ data, isLoading: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar el ranking.' });
    }
  },
}));
