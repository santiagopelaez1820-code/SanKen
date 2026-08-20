import { create } from 'zustand';
import type {
  GamificationEventResult,
  LoggedWorkoutSet,
  RoutineDay,
  StartWorkoutSessionPayload,
  WorkoutExercise,
  WorkoutSession,
} from '@sanken/core';

import { api } from '@/lib/api';
import { activeSessionStorage } from '@/lib/active-session-storage';

const ADVANCE_DELAY_MS = 900;

function deriveCurrentIndex(session: WorkoutSession | null): number {
  if (!session) return 0;
  const idx = session.exercises.findIndex((e) => !e.all_sets_completed);
  return idx === -1 ? Math.max(0, session.exercises.length - 1) : idx;
}

interface WorkoutStoreState {
  session: WorkoutSession | null;
  routineDay: RoutineDay | null;
  /** Derivado del propio `session` (primer ejercicio sin 3 series) — nunca se setea a mano salvo junto con `session`. */
  currentIndex: number;
  isSubmitting: boolean;
  isResuming: boolean;
  error: string | null;
  lastSetWasPersonalRecord: boolean;
  gamificationResult: GamificationEventResult | null;

  start: (routineDay: RoutineDay | null, precheck: StartWorkoutSessionPayload) => Promise<void>;
  /** Si había una sesión sin terminar (app cerrada a mitad de entrenamiento), la recupera desde el servidor. */
  resume: () => Promise<boolean>;
  logSet: (weightKg: number, reps: number) => Promise<void>;
  swapCurrentExercise: () => Promise<void>;
  complete: (durationMinutes: number) => Promise<void>;
  /** "Salir del entrenamiento" — nunca marca la sesión como completada. */
  cancel: () => Promise<void>;
  submitFeedback: (completedAsPlanned: boolean) => Promise<void>;
  clearGamificationResult: () => void;
  reset: () => void;
}

export const useWorkoutStore = create<WorkoutStoreState>((set, get) => ({
  session: null,
  routineDay: null,
  currentIndex: 0,
  isSubmitting: false,
  isResuming: false,
  error: null,
  lastSetWasPersonalRecord: false,
  gamificationResult: null,

  start: async (routineDay, precheck) => {
    set({ isSubmitting: true, error: null });
    try {
      const session = await api.post<WorkoutSession>('/workout-sessions', {
        routine_day_id: routineDay?.id ?? null,
        ...precheck,
      });
      await activeSessionStorage.set(session.id);
      set({ session, routineDay, currentIndex: deriveCurrentIndex(session), isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo iniciar el entrenamiento.' });
      throw err;
    }
  },

  resume: async () => {
    const persistedId = await activeSessionStorage.get();
    if (!persistedId) return false;

    set({ isResuming: true });
    try {
      const session = await api.get<WorkoutSession>(`/workout-sessions/${persistedId}`);
      if (session.completed || session.cancelled) {
        await activeSessionStorage.clear();
        set({ isResuming: false });
        return false;
      }
      set({ session, currentIndex: deriveCurrentIndex(session), isResuming: false });
      return true;
    } catch {
      // Sesión ya no existe / no autorizada — no hay nada que recuperar.
      await activeSessionStorage.clear();
      set({ isResuming: false });
      return false;
    }
  },

  logSet: async (weightKg, reps) => {
    const { session, currentIndex } = get();
    if (!session) return;
    const workoutExercise = session.exercises[currentIndex];
    if (!workoutExercise) return;

    set({ isSubmitting: true, error: null });
    try {
      const loggedSet = await api.post<LoggedWorkoutSet>(
        `/workout-sessions/${session.id}/exercises/${workoutExercise.id}/sets`,
        { weight_kg: weightKg, reps },
      );

      set((state) => {
        if (!state.session) return state;
        const exercises = [...state.session.exercises];
        exercises[currentIndex] = { ...exercises[currentIndex], sets: [...exercises[currentIndex].sets, loggedSet] };
        return {
          session: { ...state.session, exercises },
          isSubmitting: false,
          lastSetWasPersonalRecord: loggedSet.is_personal_record,
        };
      });

      const setsSoFar = workoutExercise.sets.length + 1;
      if (setsSoFar >= workoutExercise.target_sets) {
        // Avance automático (sección 3 del pedido): al llegar a las 3 series
        // no se espera un botón manual — una pausa breve para que se vea la
        // confirmación y recién ahí se marca completo (mueve currentIndex,
        // que es derivado, al siguiente ejercicio sin las 3 series).
        setTimeout(() => {
          set((state) => {
            if (!state.session) return state;
            const exercises = [...state.session.exercises];
            exercises[currentIndex] = { ...exercises[currentIndex], all_sets_completed: true };
            const nextSession = { ...state.session, exercises };
            return { session: nextSession, currentIndex: deriveCurrentIndex(nextSession) };
          });
        }, ADVANCE_DELAY_MS);
      }
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo registrar la serie.' });
      throw err;
    }
  },

  swapCurrentExercise: async () => {
    const { session, currentIndex } = get();
    if (!session) return;
    const workoutExercise = session.exercises[currentIndex];
    if (!workoutExercise) return;

    set({ isSubmitting: true, error: null });
    try {
      const updated = await api.post<WorkoutExercise>(
        `/workout-sessions/${session.id}/exercises/${workoutExercise.id}/swap`,
      );
      set((state) => {
        if (!state.session) return state;
        const exercises = [...state.session.exercises];
        exercises[currentIndex] = updated;
        return { session: { ...state.session, exercises }, isSubmitting: false };
      });
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo cambiar el ejercicio.' });
      throw err;
    }
  },

  complete: async (durationMinutes) => {
    const { session } = get();
    if (!session) return;

    set({ isSubmitting: true, error: null });
    try {
      const envelope = await api.postWithMeta<WorkoutSession>(`/workout-sessions/${session.id}/complete`, {
        duration_minutes: durationMinutes,
      });
      set({
        session: envelope.data,
        currentIndex: deriveCurrentIndex(envelope.data),
        isSubmitting: false,
        gamificationResult: (envelope.meta?.gamification as GamificationEventResult | undefined) ?? null,
      });
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo cerrar el entrenamiento.' });
      throw err;
    }
  },

  cancel: async () => {
    const { session } = get();
    if (!session) return;

    set({ isSubmitting: true, error: null });
    try {
      await api.post(`/workout-sessions/${session.id}/cancel`);
      await activeSessionStorage.clear();
      set({
        session: null,
        routineDay: null,
        currentIndex: 0,
        isSubmitting: false,
        lastSetWasPersonalRecord: false,
        gamificationResult: null,
      });
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo salir del entrenamiento.' });
      throw err;
    }
  },

  clearGamificationResult: () => set({ gamificationResult: null }),

  submitFeedback: async (completedAsPlanned) => {
    const { session } = get();
    if (!session) return;

    set({ isSubmitting: true, error: null });
    try {
      const updated = await api.post<WorkoutSession>(`/workout-sessions/${session.id}/feedback`, {
        completed_as_planned: completedAsPlanned,
      });
      await activeSessionStorage.clear();
      set({ session: updated, isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo guardar tu respuesta.' });
      throw err;
    }
  },

  reset: () => {
    activeSessionStorage.clear();
    set({
      session: null,
      routineDay: null,
      currentIndex: 0,
      error: null,
      lastSetWasPersonalRecord: false,
      gamificationResult: null,
    });
  },
}));
