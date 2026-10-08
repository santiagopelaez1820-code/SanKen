// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para importar los tipos «WorkoutSession» desde «@sanken/core».
import type { WorkoutSession } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useWorkoutStore» desde «./workout-store».
import { useWorkoutStore } from './workout-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «post: jest.fn(), postWithMeta: jest.fn(), get: jes…».
  api: { post: jest.fn(), postWithMeta: jest.fn(), get: jest.fn(), patch: jest.fn() },
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;

// Esta línea sirve para declarar el dato de ejemplo «baseSession» de tipo «WorkoutSession».
const baseSession: WorkoutSession = {
  // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «1».
  id: 1,
  // Esta línea sirve para declarar la propiedad «routine_day_id» con el valor o tipo «null».
  routine_day_id: null,
  // Esta línea sirve para declarar la propiedad «routine_day_label» con el valor o tipo «null».
  routine_day_label: null,
  // Esta línea sirve para declarar la propiedad «performed_at» con el valor o tipo «'2024-01-01T00:00:00Z'».
  performed_at: '2024-01-01T00:00:00Z',
  // Esta línea sirve para declarar la propiedad «duration_minutes» con el valor o tipo «null».
  duration_minutes: null,
  // Esta línea sirve para declarar la propiedad «completed» con el valor o tipo «false».
  completed: false,
  // Esta línea sirve para declarar la propiedad «completed_as_planned» con el valor o tipo «null».
  completed_as_planned: null,
  // Esta línea sirve para declarar la propiedad «skipped» con el valor o tipo «false».
  skipped: false,
  // Esta línea sirve para declarar la propiedad «cancelled» con el valor o tipo «false».
  cancelled: false,
  // Esta línea sirve para declarar la propiedad «sleep_quality» con el valor o tipo «null».
  sleep_quality: null,
  // Esta línea sirve para declarar la propiedad «energy_level» con el valor o tipo «null».
  energy_level: null,
  // Esta línea sirve para declarar la propiedad «muscle_soreness» con el valor o tipo «null».
  muscle_soreness: null,
  // Esta línea sirve para declarar la propiedad «readiness_adjusted» con el valor o tipo «false».
  readiness_adjusted: false,
  // Esta línea sirve para declarar la propiedad «readiness_note» con el valor o tipo «null».
  readiness_note: null,
  // Esta línea sirve para declarar la propiedad «notes» con el valor o tipo «null».
  notes: null,
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «[».
  exercises: [
    {
      // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «10».
      id: 10,
      // Esta línea sirve para declarar la propiedad «order» con el valor o tipo «1».
      order: 1,
      // Esta línea sirve para declarar la propiedad «all_sets_completed» con el valor o tipo «false».
      all_sets_completed: false,
      // Esta línea sirve para declarar la propiedad «target_sets» con el valor o tipo «3».
      target_sets: 3,
      // Esta línea sirve para declarar la propiedad «target_reps» con el valor o tipo «'10'».
      target_reps: '10',
      // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «90».
      rest_seconds: 90,
      // Esta línea sirve para declarar la propiedad «target_rpe» con el valor o tipo «null».
      target_rpe: null,
      // Esta línea sirve para declarar la propiedad «suggested_weight_kg» con el valor o tipo «null».
      suggested_weight_kg: null,
      // Esta línea sirve para declarar la propiedad «suggested_reps_per_set» con el valor o tipo «null».
      suggested_reps_per_set: null,
      // Esta línea sirve para definir «exercise» con «{ id: 1, name: 'Sentadilla', primary_mus…».
      exercise: { id: 1, name: 'Sentadilla', primary_muscle: 'quads', equipment: 'barbell', video_url: null, image_url: null },
      // Esta línea sirve para declarar la propiedad «alternative» con el valor o tipo «null».
      alternative: null,
      // Esta línea sirve para declarar la propiedad «sets» con el valor o tipo «[]».
      sets: [],
    },
  ],
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useWorkoutStore.setState({
    // Esta línea sirve para declarar la propiedad «session» con el valor o tipo «null».
    session: null,
    // Esta línea sirve para declarar la propiedad «routineDay» con el valor o tipo «null».
    routineDay: null,
    // Esta línea sirve para declarar la propiedad «currentIndex» con el valor o tipo «0».
    currentIndex: 0,
    // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
    isSubmitting: false,
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
    error: null,
    // Esta línea sirve para declarar la propiedad «lastSetWasPersonalRecord» con el valor o tipo «false».
    lastSetWasPersonalRecord: false,
    // Esta línea sirve para declarar la propiedad «gamificationResult» con el valor o tipo «null».
    gamificationResult: null,
  });
});

// Esta línea sirve para agrupar las pruebas de «logSet».
describe('logSet', () => {
  // Esta línea sirve para declarar la prueba que verifica que «appends the logged set to the current exercise».
  it('appends the logged set to the current exercise', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useWorkoutStore.setState({ session: baseSession });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce({
      // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «100».
      id: 100,
      // Esta línea sirve para declarar la propiedad «set_number» con el valor o tipo «1».
      set_number: 1,
      // Esta línea sirve para declarar la propiedad «weight_kg» con el valor o tipo «50».
      weight_kg: 50,
      // Esta línea sirve para declarar la propiedad «reps» con el valor o tipo «10».
      reps: 10,
      // Esta línea sirve para declarar la propiedad «rpe» con el valor o tipo «null».
      rpe: null,
      // Esta línea sirve para declarar la propiedad «is_warmup» con el valor o tipo «false».
      is_warmup: false,
      // Esta línea sirve para declarar la propiedad «completed» con el valor o tipo «true».
      completed: true,
      // Esta línea sirve para declarar la propiedad «is_personal_record» con el valor o tipo «true».
      is_personal_record: true,
    });

    // Esta línea sirve para esperar el resultado de «useWorkoutStore.getState».
    await useWorkoutStore.getState().logSet(50, 10);

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useWorkoutStore.getState();
    // Esta línea sirve para verificar que «state.session?.exercises[0].sets» cumple «toHaveLength».
    expect(state.session?.exercises[0].sets).toHaveLength(1);
    // Esta línea sirve para verificar que «state.lastSetWasPersonalRecord» cumple «toBe».
    expect(state.lastSetWasPersonalRecord).toBe(true);
    // Esta línea sirve para verificar que «state.isSubmitting» cumple «toBe».
    expect(state.isSubmitting).toBe(false);
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error and leaves the session untouched on failure».
  it('sets an error and leaves the session untouched on failure', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useWorkoutStore.setState({ session: baseSession });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new Error('network down'));

    // Esta línea sirve para verificar que «useWorkoutStore.getState().logSet(50, 10)» falla como se espera.
    await expect(useWorkoutStore.getState().logSet(50, 10)).rejects.toThrow();

    // Esta línea sirve para leer el estado actual del store en «state».
    const state = useWorkoutStore.getState();
    // Esta línea sirve para verificar que «state.error» cumple «toBe».
    expect(state.error).toBe('network down');
    // Esta línea sirve para verificar que «state.session?.exercises[0].sets» cumple «toHaveLength».
    expect(state.session?.exercises[0].sets).toHaveLength(0);
  });
});

// Esta línea sirve para agrupar las pruebas de «complete».
describe('complete', () => {
  // Esta línea sirve para declarar la prueba que verifica que «replaces the session with the completed one returned by the API».
  it('replaces the session with the completed one returned by the API', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useWorkoutStore.setState({ session: baseSession });
    // Esta línea sirve para extraer «ompleted: WorkoutSessio» de «{ ...baseSession, completed: true, durat».
    const completed: WorkoutSession = { ...baseSession, completed: true, duration_minutes: 45 };
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.postWithMeta».
    mockedApi.postWithMeta.mockResolvedValueOnce({ data: completed });

    // Esta línea sirve para esperar el resultado de «useWorkoutStore.getState».
    await useWorkoutStore.getState().complete(45);

    // Esta línea sirve para verificar que «useWorkoutStore.getState(» cumple «session».
    expect(useWorkoutStore.getState().session).toEqual(completed);
    // Esta línea sirve para verificar que «useWorkoutStore.getState(» cumple «gamificationResult».
    expect(useWorkoutStore.getState().gamificationResult).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «stores the gamification result from meta when present».
  it('stores the gamification result from meta when present', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useWorkoutStore.setState({ session: baseSession });
    // Esta línea sirve para extraer «ompleted: WorkoutSessio» de «{ ...baseSession, completed: true, durat».
    const completed: WorkoutSession = { ...baseSession, completed: true, duration_minutes: 45 };
    // Esta línea sirve para extraer «amificatio» de «{ xp_awarded: 20, leveled_up: true, new_».
    const gamification = { xp_awarded: 20, leveled_up: true, new_level: 2, achievements_unlocked: [] };
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.postWithMeta».
    mockedApi.postWithMeta.mockResolvedValueOnce({ data: completed, meta: { gamification } });

    // Esta línea sirve para esperar el resultado de «useWorkoutStore.getState».
    await useWorkoutStore.getState().complete(45);

    // Esta línea sirve para verificar que «useWorkoutStore.getState(» cumple «gamificationResult».
    expect(useWorkoutStore.getState().gamificationResult).toEqual(gamification);
  });
});

// Esta línea sirve para agrupar las pruebas de «submitFeedback».
describe('submitFeedback', () => {
  // Esta línea sirve para declarar la prueba que verifica que «updates the session with the feedback response on success».
  it('updates the session with the feedback response on success', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useWorkoutStore.setState({ session: baseSession });
    // Esta línea sirve para extraer «pdated: WorkoutSessio» de «{ ...baseSession, completed_as_planned: ».
    const updated: WorkoutSession = { ...baseSession, completed_as_planned: true };
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(updated);

    // Esta línea sirve para esperar el resultado de «useWorkoutStore.getState».
    await useWorkoutStore.getState().submitFeedback(true);

    // Esta línea sirve para verificar que «useWorkoutStore.getState(» cumple «session».
    expect(useWorkoutStore.getState().session).toEqual(updated);
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error on failure».
  it('sets an error on failure', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useWorkoutStore.setState({ session: baseSession });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new Error('network down'));

    // Esta línea sirve para verificar que «useWorkoutStore.getState().submitFeedback(true)» falla como se espera.
    await expect(useWorkoutStore.getState().submitFeedback(true)).rejects.toThrow();

    // Esta línea sirve para verificar que «useWorkoutStore.getState(» cumple «error».
    expect(useWorkoutStore.getState().error).toBe('network down');
  });
});

// Esta línea sirve para agrupar las pruebas de «cancel».
describe('cancel', () => {
  // Esta línea sirve para declarar la prueba que verifica que «clears the session on success, without ever calling complete».
  it('clears the session on success, without ever calling complete', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useWorkoutStore.setState({ session: baseSession });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);

    // Esta línea sirve para esperar el resultado de «useWorkoutStore.getState».
    await useWorkoutStore.getState().cancel();

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith(`/workout-sessions/${baseSession.id}/cancel`);
    // Esta línea sirve para verificar que «useWorkoutStore.getState(» cumple «session».
    expect(useWorkoutStore.getState().session).toBeNull();
    // Esta línea sirve para verificar que «useWorkoutStore.getState(» cumple «isSubmitting».
    expect(useWorkoutStore.getState().isSubmitting).toBe(false);
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error and keeps the session on failure».
  it('sets an error and keeps the session on failure', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useWorkoutStore.setState({ session: baseSession });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new Error('network down'));

    // Esta línea sirve para verificar que «useWorkoutStore.getState().cancel()» falla como se espera.
    await expect(useWorkoutStore.getState().cancel()).rejects.toThrow();

    // Esta línea sirve para verificar que «useWorkoutStore.getState(» cumple «session».
    expect(useWorkoutStore.getState().session).toEqual(baseSession);
    // Esta línea sirve para verificar que «useWorkoutStore.getState(» cumple «error».
    expect(useWorkoutStore.getState().error).toBe('network down');
  });
});
