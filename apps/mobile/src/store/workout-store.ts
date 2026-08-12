import { create } from 'zustand';
import type {
  GamificationEventResult,
  LoggedWorkoutSet,
  RoutineDay,
  StartWorkoutSessionPayload,
  WorkoutSession,
} from '@sanken/core';

import { api } from '@/lib/api';

interface WorkoutStoreState {
  session: WorkoutSession | null;
  routineDay: RoutineDay | null;
  currentIndex: number;
  isSubmitting: boolean;
  error: string | null;
  lastSetWasPersonalRecord: boolean;
  gamificationResult: GamificationEventResult | null;

  start: (routineDay: RoutineDay | null, precheck: StartWorkoutSessionPayload) => Promise<void>;
  logSet: (weightKg: number, reps: number) => Promise<void>;
  finishCurrentExercise: () => Promise<void>;
  goToExercise: (index: number) => void;
  complete: (durationMinutes: number) => Promise<void>;
  submitFeedback: (completedAsPlanned: boolean) => Promise<void>;
  clearGamificationResult: () => void;
  reset: () => void;
}

export const useWorkoutStore = create<WorkoutStoreState>((set, get) => ({
  session: null,
  routineDay: null,
  currentIndex: 0,
  isSubmitting: false,
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
      set({ session, routineDay, currentIndex: 0, isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo iniciar el entrenamiento.' });
      throw err;
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
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo registrar la serie.' });
      throw err;
    }
  },

  finishCurrentExercise: async () => {
    const { session, currentIndex } = get();
    if (!session) return;
    const workoutExercise = session.exercises[currentIndex];
    if (!workoutExercise) return;

    await api.patch(`/workout-sessions/${session.id}/exercises/${workoutExercise.id}`, {
      all_sets_completed: true,
    });

    set((state) => {
      if (!state.session) return state;
      const exercises = [...state.session.exercises];
      exercises[currentIndex] = { ...exercises[currentIndex], all_sets_completed: true };
      return { session: { ...state.session, exercises } };
    });
  },

  goToExercise: (index) => set({ currentIndex: index, lastSetWasPersonalRecord: false }),

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
        isSubmitting: false,
        gamificationResult: (envelope.meta?.gamification as GamificationEventResult | undefined) ?? null,
      });
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo cerrar el entrenamiento.' });
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
      set({ session: updated, isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo guardar tu respuesta.' });
      throw err;
    }
  },

  reset: () =>
    set({
      session: null,
      routineDay: null,
      currentIndex: 0,
      error: null,
      lastSetWasPersonalRecord: false,
      gamificationResult: null,
    }),
}));
