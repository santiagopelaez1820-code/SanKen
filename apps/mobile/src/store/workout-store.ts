// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import type {
  // Esta línea sirve para incluir el valor «GamificationEventResult» en la lista.
  GamificationEventResult,
  // Esta línea sirve para incluir el valor «LoggedWorkoutSet» en la lista.
  LoggedWorkoutSet,
  // Esta línea sirve para incluir el valor «RoutineDay» en la lista.
  RoutineDay,
  // Esta línea sirve para incluir el valor «StartWorkoutSessionPayload» en la lista.
  StartWorkoutSessionPayload,
  // Esta línea sirve para incluir el valor «WorkoutExercise» en la lista.
  WorkoutExercise,
  // Esta línea sirve para incluir el valor «WorkoutSession» en la lista.
  WorkoutSession,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «activeSessionStorage» desde «@/lib/active-session-storage».
import { activeSessionStorage } from '@/lib/active-session-storage';

// Esta línea sirve para declarar «ADVANCE_DELAY_MS» con el valor «900».
const ADVANCE_DELAY_MS = 900;

// Esta línea sirve para declarar la función «deriveCurrentIndex».
function deriveCurrentIndex(session: WorkoutSession | null): number {
  // Esta línea sirve para devolver «0» si «!session».
  if (!session) return 0;
  // Esta línea sirve para extraer «d» de «session.exercises.findIndex((e) => !e.al».
  const idx = session.exercises.findIndex((e) => !e.all_sets_completed);
  // Esta línea sirve para devolver el primer ejercicio sin completar o el último.
  return idx === -1 ? Math.max(0, session.exercises.length - 1) : idx;
}

// Esta línea sirve para declarar la interfaz «WorkoutStoreState».
interface WorkoutStoreState {
  // Esta línea sirve para declarar la propiedad «session» con el valor o tipo «WorkoutSession | null».
  session: WorkoutSession | null;
  // Esta línea sirve para declarar la propiedad «routineDay» con el valor o tipo «RoutineDay | null».
  routineDay: RoutineDay | null;
  /** Derivado del propio `session` (primer ejercicio sin 3 series) — nunca se setea a mano salvo junto con `session`. */
  // Esta línea sirve para declarar la propiedad «currentIndex» con el valor o tipo «number».
  currentIndex: number;
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «boolean».
  isSubmitting: boolean;
  // Esta línea sirve para declarar la propiedad «isResuming» con el valor o tipo «boolean».
  isResuming: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;
  // Esta línea sirve para declarar la propiedad «lastSetWasPersonalRecord» con el valor o tipo «boolean».
  lastSetWasPersonalRecord: boolean;
  // Esta línea sirve para declarar la propiedad «gamificationResult» con el valor o tipo «GamificationEventResult | null».
  gamificationResult: GamificationEventResult | null;

  // Esta línea sirve para definir «start» con «(routineDay: RoutineDay | null, precheck…».
  start: (routineDay: RoutineDay | null, precheck: StartWorkoutSessionPayload) => Promise<void>;
  /** Si había una sesión sin terminar (app cerrada a mitad de entrenamiento), la recupera desde el servidor. */
  // Esta línea sirve para declarar la propiedad «resume» con el valor o tipo «() => Promise<boolean>».
  resume: () => Promise<boolean>;
  // Esta línea sirve para definir «logSet» con «(weightKg: number, reps: number, rpe?: n…».
  logSet: (weightKg: number, reps: number, rpe?: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «swapCurrentExercise» con el valor o tipo «() => Promise<void>».
  swapCurrentExercise: () => Promise<void>;
  // Esta línea sirve para declarar la propiedad «complete» con el valor o tipo «(durationMinutes: number) => Promise<void>».
  complete: (durationMinutes: number) => Promise<void>;
  /** "Salir del entrenamiento" — nunca marca la sesión como completada. */
  // Esta línea sirve para declarar la propiedad «cancel» con el valor o tipo «() => Promise<void>».
  cancel: () => Promise<void>;
  // Esta línea sirve para definir «submitFeedback» con «(completedAsPlanned: boolean) => Promise…».
  submitFeedback: (completedAsPlanned: boolean) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «clearGamificationResult» con el valor o tipo «() => void».
  clearGamificationResult: () => void;
  // Esta línea sirve para declarar la propiedad «reset» con el valor o tipo «() => void».
  reset: () => void;
}

// Esta línea sirve para declarar «useWorkoutStore» con el valor «create<WorkoutStoreState>((set, get) => ({».
export const useWorkoutStore = create<WorkoutStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «session» con el valor o tipo «null».
  session: null,
  // Esta línea sirve para declarar la propiedad «routineDay» con el valor o tipo «null».
  routineDay: null,
  // Esta línea sirve para declarar la propiedad «currentIndex» con el valor o tipo «0».
  currentIndex: 0,
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
  isSubmitting: false,
  // Esta línea sirve para declarar la propiedad «isResuming» con el valor o tipo «false».
  isResuming: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,
  // Esta línea sirve para declarar la propiedad «lastSetWasPersonalRecord» con el valor o tipo «false».
  lastSetWasPersonalRecord: false,
  // Esta línea sirve para declarar la propiedad «gamificationResult» con el valor o tipo «null».
  gamificationResult: null,

  // Esta línea sirve para declarar la propiedad «start» con el valor o tipo «async (routineDay, precheck) => {».
  start: async (routineDay, precheck) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<WorkoutSession>('/workout-sessions', {» y guardar el resultado en «session».
      const session = await api.post<WorkoutSession>('/workout-sessions', {
        // Esta línea sirve para declarar la propiedad «routine_day_id» con el valor o tipo «routineDay?.id ?? null».
        routine_day_id: routineDay?.id ?? null,
        // Esta línea sirve para copiar las propiedades de «precheck».
        ...precheck,
      });
      // Esta línea sirve para esperar el resultado de «activeSessionStorage.set».
      await activeSessionStorage.set(session.id);
      // Esta línea sirve para guardar en el store: «session, routineDay, currentIndex: deriveCurrentIndex(sessio…».
      set({ session, routineDay, currentIndex: deriveCurrentIndex(session), isSubmitting: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: err instanceof Error ? err.messa…».
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo iniciar el entrenamiento.' });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «resume» con el valor o tipo «async () => {».
  resume: async () => {
    // Esta línea sirve para esperar «activeSessionStorage.get()» y guardar el resultado en «persistedId».
    const persistedId = await activeSessionStorage.get();
    // Esta línea sirve para devolver «false» si «!persistedId».
    if (!persistedId) return false;

    // Esta línea sirve para guardar en el store: «isResuming: true })…».
    set({ isResuming: true });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<WorkoutSession>(`/workout-sessions/${persi» y guardar el resultado en «session».
      const session = await api.get<WorkoutSession>(`/workout-sessions/${persistedId}`);
      // Esta línea sirve para revisar si «session.completed || session.cancelled».
      if (session.completed || session.cancelled) {
        // Esta línea sirve para esperar el resultado de «activeSessionStorage.clear».
        await activeSessionStorage.clear();
        // Esta línea sirve para guardar en el store: «isResuming: false })…».
        set({ isResuming: false });
        // Esta línea sirve para devolver «false».
        return false;
      }
      // Esta línea sirve para guardar en el store: «session, currentIndex: deriveCurrentIndex(session), isResumi…».
      set({ session, currentIndex: deriveCurrentIndex(session), isResuming: false });
      // Esta línea sirve para devolver «true».
      return true;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch {
      // Sesión ya no existe / no autorizada — no hay nada que recuperar.
      // Esta línea sirve para esperar el resultado de «activeSessionStorage.clear».
      await activeSessionStorage.clear();
      // Esta línea sirve para guardar en el store: «isResuming: false })…».
      set({ isResuming: false });
      // Esta línea sirve para devolver «false».
      return false;
    }
  },

  // Esta línea sirve para declarar la propiedad «logSet» con el valor o tipo «async (weightKg, reps, rpe) => {».
  logSet: async (weightKg, reps, rpe) => {
    // Esta línea sirve para extraer «session, currentIndex» de «get()».
    const { session, currentIndex } = get();
    // Esta línea sirve para salir de la función si «!session».
    if (!session) return;
    // Esta línea sirve para extraer «orkoutExercis» de «session.exercises[currentIndex]».
    const workoutExercise = session.exercises[currentIndex];
    // Esta línea sirve para salir de la función si «!workoutExercise».
    if (!workoutExercise) return;

    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<LoggedWorkoutSet>(» y guardar el resultado en «loggedSet».
      const loggedSet = await api.post<LoggedWorkoutSet>(
        // Esta línea sirve para incluir el texto o las clases «/workout-sessions/${session.id}/exercises/${w…».
        `/workout-sessions/${session.id}/exercises/${workoutExercise.id}/sets`,
        // Esta línea sirve para agregar un elemento cuyo «weight_kg» es «weightKg, reps, rpe },…».
        { weight_kg: weightKg, reps, rpe },
      );

      // Esta línea sirve para actualizar la sesión a partir del estado anterior.
      set((state) => {
        // Esta línea sirve para devolver «state» si «!state.session».
        if (!state.session) return state;
        // Esta línea sirve para extraer «xercise» de «[...state.session.exercises]».
        const exercises = [...state.session.exercises];
        // Esta línea sirve para agregar la serie registrada al ejercicio actual.
        exercises[currentIndex] = { ...exercises[currentIndex], sets: [...exercises[currentIndex].sets, loggedSet] };
        // Esta línea sirve para devolver «{».
        return {
          // Esta línea sirve para declarar la propiedad «session» con el valor o tipo «{ ...state.session, exercises }».
          session: { ...state.session, exercises },
          // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
          isSubmitting: false,
          // Esta línea sirve para declarar la propiedad «lastSetWasPersonalRecord» con el valor o tipo «loggedSet.is_personal_record».
          lastSetWasPersonalRecord: loggedSet.is_personal_record,
        };
      });

      // Esta línea sirve para extraer «etsSoFa» de «workoutExercise.sets.length + 1».
      const setsSoFar = workoutExercise.sets.length + 1;
      // Esta línea sirve para revisar si «setsSoFar >= workoutExercise.target_sets».
      if (setsSoFar >= workoutExercise.target_sets) {
        // Avance automático (sección 3 del pedido): al llegar a las 3 series
        // no se espera un botón manual — una pausa breve para que se vea la
        // confirmación y recién ahí se marca completo (mueve currentIndex,
        // que es derivado, al siguiente ejercicio sin las 3 series).
        // Esta línea sirve para llamar a «setTimeout» con una función.
        setTimeout(() => {
          // Esta línea sirve para actualizar la sesión a partir del estado anterior.
          set((state) => {
            // Esta línea sirve para devolver «state» si «!state.session».
            if (!state.session) return state;
            // Esta línea sirve para extraer «xercise» de «[...state.session.exercises]».
            const exercises = [...state.session.exercises];
            // Esta línea sirve para marcar el ejercicio actual como completado.
            exercises[currentIndex] = { ...exercises[currentIndex], all_sets_completed: true };
            // Esta línea sirve para extraer «extSessio» de «{ ...state.session, exercises }».
            const nextSession = { ...state.session, exercises };
            // Esta línea sirve para devolver la sesión actualizada y el nuevo ejercicio actual.
            return { session: nextSession, currentIndex: deriveCurrentIndex(nextSession) };
          });
        // Esta línea sirve para volver a ejecutar el efecto cuando cambian «DVANCE_DELAY_M».
        }, ADVANCE_DELAY_MS);
      }
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: err instanceof Error ? err.messa…».
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo registrar la serie.' });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «swapCurrentExercise» con el valor o tipo «async () => {».
  swapCurrentExercise: async () => {
    // Esta línea sirve para extraer «session, currentIndex» de «get()».
    const { session, currentIndex } = get();
    // Esta línea sirve para salir de la función si «!session».
    if (!session) return;
    // Esta línea sirve para extraer «orkoutExercis» de «session.exercises[currentIndex]».
    const workoutExercise = session.exercises[currentIndex];
    // Esta línea sirve para salir de la función si «!workoutExercise».
    if (!workoutExercise) return;

    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<WorkoutExercise>(» y guardar el resultado en «updated».
      const updated = await api.post<WorkoutExercise>(
        // Esta línea sirve para incluir el texto o las clases «/workout-sessions/${session.id}/exercises/${w…».
        `/workout-sessions/${session.id}/exercises/${workoutExercise.id}/swap`,
      );
      // Esta línea sirve para actualizar la sesión a partir del estado anterior.
      set((state) => {
        // Esta línea sirve para devolver «state» si «!state.session».
        if (!state.session) return state;
        // Esta línea sirve para extraer «xercise» de «[...state.session.exercises]».
        const exercises = [...state.session.exercises];
        // Esta línea sirve para reemplazar el ejercicio actual por su versión actualizada.
        exercises[currentIndex] = updated;
        // Esta línea sirve para devolver la sesión actualizada y terminar el envío.
        return { session: { ...state.session, exercises }, isSubmitting: false };
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: err instanceof Error ? err.messa…».
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo cambiar el ejercicio.' });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «complete» con el valor o tipo «async (durationMinutes) => {».
  complete: async (durationMinutes) => {
    // Esta línea sirve para extraer «session» de «get()».
    const { session } = get();
    // Esta línea sirve para salir de la función si «!session».
    if (!session) return;

    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.postWithMeta<WorkoutSession>(`/workout-session» y guardar el resultado en «envelope».
      const envelope = await api.postWithMeta<WorkoutSession>(`/workout-sessions/${session.id}/complete`, {
        // Esta línea sirve para declarar la propiedad «duration_minutes» con el valor o tipo «durationMinutes».
        duration_minutes: durationMinutes,
      });
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «session» con el valor o tipo «envelope.data».
        session: envelope.data,
        // Esta línea sirve para declarar la propiedad «currentIndex» con el valor o tipo «deriveCurrentIndex(envelope.data)».
        currentIndex: deriveCurrentIndex(envelope.data),
        // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
        isSubmitting: false,
        // Esta línea sirve para definir «gamificationResult» con «(envelope.meta?.gamification as Gamifica…».
        gamificationResult: (envelope.meta?.gamification as GamificationEventResult | undefined) ?? null,
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: err instanceof Error ? err.messa…».
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo cerrar el entrenamiento.' });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «cancel» con el valor o tipo «async () => {».
  cancel: async () => {
    // Esta línea sirve para extraer «session» de «get()».
    const { session } = get();
    // Esta línea sirve para salir de la función si «!session».
    if (!session) return;

    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post(`/workout-sessions/${session.id}/cancel`);
      // Esta línea sirve para esperar el resultado de «activeSessionStorage.clear».
      await activeSessionStorage.clear();
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «session» con el valor o tipo «null».
        session: null,
        // Esta línea sirve para declarar la propiedad «routineDay» con el valor o tipo «null».
        routineDay: null,
        // Esta línea sirve para declarar la propiedad «currentIndex» con el valor o tipo «0».
        currentIndex: 0,
        // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
        isSubmitting: false,
        // Esta línea sirve para declarar la propiedad «lastSetWasPersonalRecord» con el valor o tipo «false».
        lastSetWasPersonalRecord: false,
        // Esta línea sirve para declarar la propiedad «gamificationResult» con el valor o tipo «null».
        gamificationResult: null,
      });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: err instanceof Error ? err.messa…».
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo salir del entrenamiento.' });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «clearGamificationResult» con el valor o tipo «() => set({ gamificationResult: null })».
  clearGamificationResult: () => set({ gamificationResult: null }),

  // Esta línea sirve para declarar la propiedad «submitFeedback» con el valor o tipo «async (completedAsPlanned) => {».
  submitFeedback: async (completedAsPlanned) => {
    // Esta línea sirve para extraer «session» de «get()».
    const { session } = get();
    // Esta línea sirve para salir de la función si «!session».
    if (!session) return;

    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<WorkoutSession>(`/workout-sessions/${sess» y guardar el resultado en «updated».
      const updated = await api.post<WorkoutSession>(`/workout-sessions/${session.id}/feedback`, {
        // Esta línea sirve para declarar la propiedad «completed_as_planned» con el valor o tipo «completedAsPlanned».
        completed_as_planned: completedAsPlanned,
      });
      // Esta línea sirve para esperar el resultado de «activeSessionStorage.clear».
      await activeSessionStorage.clear();
      // Esta línea sirve para guardar en el store: «session: updated, isSubmitting: false })…».
      set({ session: updated, isSubmitting: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: err instanceof Error ? err.messa…».
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo guardar tu respuesta.' });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «reset» con el valor o tipo «() => {».
  reset: () => {
    // Esta línea sirve para llamar a «activeSessionStorage.clear».
    activeSessionStorage.clear();
    // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
    set({
      // Esta línea sirve para declarar la propiedad «session» con el valor o tipo «null».
      session: null,
      // Esta línea sirve para declarar la propiedad «routineDay» con el valor o tipo «null».
      routineDay: null,
      // Esta línea sirve para declarar la propiedad «currentIndex» con el valor o tipo «0».
      currentIndex: 0,
      // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
      error: null,
      // Esta línea sirve para declarar la propiedad «lastSetWasPersonalRecord» con el valor o tipo «false».
      lastSetWasPersonalRecord: false,
      // Esta línea sirve para declarar la propiedad «gamificationResult» con el valor o tipo «null».
      gamificationResult: null,
    });
  },
}));
