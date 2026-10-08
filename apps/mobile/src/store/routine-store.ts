// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «DailyLock, Routine» desde «@sanken/core».
import type { DailyLock, Routine } from '@sanken/core';
// Esta línea sirve para importar «ApiError, parseDailyLock» desde «@sanken/core».
import { ApiError, parseDailyLock } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para reexportar «findNextDay» desde «@sanken/core».
export { findNextDay } from '@sanken/core';

// Esta línea sirve para declarar «UNLOCKED» con el valor «{ locked: false, unlocks_at: null, reason: null }».
const UNLOCKED: DailyLock = { locked: false, unlocks_at: null, reason: null };

// Esta línea sirve para declarar la interfaz «RoutineStoreState».
interface RoutineStoreState {
  // Esta línea sirve para declarar la propiedad «routine» con el valor o tipo «Routine | null».
  routine: Routine | null;
  // Esta línea sirve para declarar la propiedad «nextDayId» con el valor o tipo «number | null».
  nextDayId: number | null;
  /** Autoridad del backend sobre si el próximo entrenamiento está disponible hoy -- ver DetermineDailyLockStatusAction en la API. */
  // Esta línea sirve para declarar la propiedad «dailyLock» con el valor o tipo «DailyLock».
  dailyLock: DailyLock;
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;
  // Esta línea sirve para declarar la propiedad «hasNoRoutine» con el valor o tipo «boolean».
  hasNoRoutine: boolean;

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
}

// Esta línea sirve para declarar «useRoutineStore» con el valor «create<RoutineStoreState>((set) => ({».
export const useRoutineStore = create<RoutineStoreState>((set) => ({
  // Esta línea sirve para declarar la propiedad «routine» con el valor o tipo «null».
  routine: null,
  // Esta línea sirve para declarar la propiedad «nextDayId» con el valor o tipo «null».
  nextDayId: null,
  // Esta línea sirve para declarar la propiedad «dailyLock» con el valor o tipo «UNLOCKED».
  dailyLock: UNLOCKED,
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,
  // Esta línea sirve para declarar la propiedad «hasNoRoutine» con el valor o tipo «false».
  hasNoRoutine: false,

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null, hasNoRoutine: false })…».
    set({ isLoading: true, error: null, hasNoRoutine: false });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.getWithMeta<Routine>('/routines/active')» y guardar el resultado en «envelope».
      const envelope = await api.getWithMeta<Routine>('/routines/active');
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «routine» con el valor o tipo «envelope.data».
        routine: envelope.data,
        // Esta línea sirve para definir «nextDayId» con «(envelope.meta?.next_day_id as number | …».
        nextDayId: (envelope.meta?.next_day_id as number | null) ?? null,
        // Esta línea sirve para declarar la propiedad «dailyLock» con el valor o tipo «parseDailyLock(envelope.meta)».
        dailyLock: parseDailyLock(envelope.meta),
        // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
        isLoading: false,
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para revisar si «err instanceof ApiError && err.status === 404».
      if (err instanceof ApiError && err.status === 404) {
        // Esta línea sirve para guardar en el store: «isLoading: false, hasNoRoutine: true, routine: null, nextDay…».
        set({ isLoading: false, hasNoRoutine: true, routine: null, nextDayId: null, dailyLock: UNLOCKED });
        // Esta línea sirve para terminar la función sin devolver nada.
        return;
      }
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudo cargar tu rutina.' });
    }
  },
}));
