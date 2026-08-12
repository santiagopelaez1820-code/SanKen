import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { WorkoutSession } from '@sanken/core';

import { api } from '@/lib/api';
import { useWorkoutStore } from './workout-store';

jest.mock('@/lib/api', () => ({
  api: { post: jest.fn(), postWithMeta: jest.fn(), get: jest.fn(), patch: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const baseSession: WorkoutSession = {
  id: 1,
  routine_day_id: null,
  routine_day_label: null,
  performed_at: '2024-01-01T00:00:00Z',
  duration_minutes: null,
  completed: false,
  completed_as_planned: null,
  sleep_quality: null,
  energy_level: null,
  muscle_soreness: null,
  notes: null,
  exercises: [
    {
      id: 10,
      order: 1,
      all_sets_completed: false,
      exercise: { id: 1, name: 'Sentadilla', primary_muscle: 'quads', equipment: 'barbell', video_url: null, image_url: null },
      sets: [],
    },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  useWorkoutStore.setState({
    session: null,
    routineDay: null,
    currentIndex: 0,
    isSubmitting: false,
    error: null,
    lastSetWasPersonalRecord: false,
    gamificationResult: null,
  });
});

describe('logSet', () => {
  it('appends the logged set to the current exercise', async () => {
    useWorkoutStore.setState({ session: baseSession });
    mockedApi.post.mockResolvedValueOnce({
      id: 100,
      set_number: 1,
      weight_kg: 50,
      reps: 10,
      rpe: null,
      is_warmup: false,
      completed: true,
      is_personal_record: true,
    });

    await useWorkoutStore.getState().logSet(50, 10);

    const state = useWorkoutStore.getState();
    expect(state.session?.exercises[0].sets).toHaveLength(1);
    expect(state.lastSetWasPersonalRecord).toBe(true);
    expect(state.isSubmitting).toBe(false);
  });

  it('sets an error and leaves the session untouched on failure', async () => {
    useWorkoutStore.setState({ session: baseSession });
    mockedApi.post.mockRejectedValueOnce(new Error('network down'));

    await expect(useWorkoutStore.getState().logSet(50, 10)).rejects.toThrow();

    const state = useWorkoutStore.getState();
    expect(state.error).toBe('network down');
    expect(state.session?.exercises[0].sets).toHaveLength(0);
  });
});

describe('complete', () => {
  it('replaces the session with the completed one returned by the API', async () => {
    useWorkoutStore.setState({ session: baseSession });
    const completed: WorkoutSession = { ...baseSession, completed: true, duration_minutes: 45 };
    mockedApi.postWithMeta.mockResolvedValueOnce({ data: completed });

    await useWorkoutStore.getState().complete(45);

    expect(useWorkoutStore.getState().session).toEqual(completed);
    expect(useWorkoutStore.getState().gamificationResult).toBeNull();
  });

  it('stores the gamification result from meta when present', async () => {
    useWorkoutStore.setState({ session: baseSession });
    const completed: WorkoutSession = { ...baseSession, completed: true, duration_minutes: 45 };
    const gamification = { xp_awarded: 20, leveled_up: true, new_level: 2, achievements_unlocked: [] };
    mockedApi.postWithMeta.mockResolvedValueOnce({ data: completed, meta: { gamification } });

    await useWorkoutStore.getState().complete(45);

    expect(useWorkoutStore.getState().gamificationResult).toEqual(gamification);
  });
});

describe('submitFeedback', () => {
  it('updates the session with the feedback response on success', async () => {
    useWorkoutStore.setState({ session: baseSession });
    const updated: WorkoutSession = { ...baseSession, completed_as_planned: true };
    mockedApi.post.mockResolvedValueOnce(updated);

    await useWorkoutStore.getState().submitFeedback(true);

    expect(useWorkoutStore.getState().session).toEqual(updated);
  });

  it('sets an error on failure', async () => {
    useWorkoutStore.setState({ session: baseSession });
    mockedApi.post.mockRejectedValueOnce(new Error('network down'));

    await expect(useWorkoutStore.getState().submitFeedback(true)).rejects.toThrow();

    expect(useWorkoutStore.getState().error).toBe('network down');
  });
});
