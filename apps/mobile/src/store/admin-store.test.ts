import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type {
  AdminExercise,
  AdminRoutineTemplate,
  AdminStats,
  AdminUser,
  AuditLogEntry,
  ManualRoutinePayload,
  NewsPromotion,
  Report,
  Routine,
} from '@sanken/core';

import { api } from '@/lib/api';
import { useAdminStore } from './admin-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn(), getWithMeta: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const user: AdminUser = {
  id: 1, name: 'Ana', email: 'ana@sanken.app', role: 'trainer',
  is_banned: false, is_deactivated: false, country: null, state: null, city: null,
  trainer_verified_at: null, last_active_at: null, created_at: '2026-08-01T00:00:00Z',
  current_routine: null,
};

const exercise: AdminExercise = {
  id: 1, name: 'Press banca', primary_muscle_id: 1, primary_muscle: { id: 1, name: 'Pecho' },
  equipment: 'barbell', level: 'beginner', type: 'compound',
  instructions: null, common_mistakes: null, tips: null, video_url: null, image_url: null, is_active: true,
  alternatives: [],
};

const report: Report = {
  id: 1, reporter: { id: 2, name: 'Beto' }, reportable_type: 'chat_message', reportable_id: 9,
  reason: 'abuse', details: null, status: 'pending', resolved_at: null, resolution_notes: null,
  created_at: '2026-08-01T00:00:00Z',
};

const news: NewsPromotion = {
  id: 1, title: 'Novedad', body: 'Contenido', image_url: null, published: false, published_at: null,
  created_at: '2026-08-01T00:00:00Z',
};

const stats: AdminStats = {
  total_users: 10, new_users_7d: 2, trainers_count: 1, banned_users_count: 0,
  pending_reports_count: 1, dau: 3, wau: 5, mau: 8, retention_pct: 50,
};

const auditEntry: AuditLogEntry = {
  id: 1, log_name: 'user', description: 'updated', event: 'updated',
  subject_type: 'App\\Models\\User', subject_id: 1, changes: {}, created_at: '2026-08-01T00:00:00Z',
};

const routineTemplate: AdminRoutineTemplate = {
  id: 1, name: 'Full Body 3 días', sex: 'male', frequency_days: 3, split_type: 'full_body', is_active: false,
  days: [],
};

const adminRoutine: Routine = {
  id: 5, source: 'trainer', goal: 'gain_muscle', split_type: 'full_body', frequency_days: 3, duration_weeks: 6,
  is_active: true, starts_at: null, ends_at: null, days: [],
};

const routinePayload: ManualRoutinePayload = {
  goal: 'gain_muscle', split_type: 'full_body', frequency_days: 3, duration_weeks: 6, days: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  useAdminStore.setState({
    users: [], isLoadingUsers: false,
    exercises: [], muscleGroups: [], isLoadingExercises: false,
    reports: [], isLoadingReports: false,
    news: [], isLoadingNews: false,
    stats: null, isLoadingStats: false,
    auditLog: [], isLoadingAuditLog: false,
    routineTemplates: [], isLoadingRoutineTemplates: false,
    userDetail: null, isLoadingUserDetail: false,
    adminRoutineForEdit: null, isLoadingAdminRoutine: false, isSubmittingAdminRoutine: false, adminRoutineError: null,
  });
});

describe('users', () => {
  it('loads users with query filters', async () => {
    mockedApi.get.mockResolvedValueOnce([user]);

    await useAdminStore.getState().loadUsers({ role: 'trainer', q: 'ana' });

    expect(mockedApi.get).toHaveBeenCalledWith('/admin/users?role=trainer&q=ana');
    expect(useAdminStore.getState().users).toEqual([user]);
  });

  it('bans a user and reloads the list', async () => {
    mockedApi.patch.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([{ ...user, is_banned: true }]);

    await useAdminStore.getState().banUser(1);

    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/users/1/ban');
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/users?');
  });

  it('toggles trainer verification and reloads the list', async () => {
    mockedApi.patch.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([user]);

    await useAdminStore.getState().verifyTrainer(1);

    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/users/1/verify-trainer');
  });
});

describe('exercises', () => {
  it('loads exercises and the muscle group options from meta', async () => {
    mockedApi.getWithMeta.mockResolvedValueOnce({
      data: [exercise],
      meta: { muscle_groups: [{ id: 1, name: 'Pecho' }] },
    });

    await useAdminStore.getState().loadExercises();

    expect(useAdminStore.getState().exercises).toEqual([exercise]);
    expect(useAdminStore.getState().muscleGroups).toEqual([{ id: 1, name: 'Pecho' }]);
  });

  it('creates an exercise and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [exercise], meta: {} });

    await useAdminStore.getState().createExercise({
      name: 'Press banca', primary_muscle_id: 1, equipment: 'barbell', level: 'beginner', type: 'compound',
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/admin/exercises', {
      name: 'Press banca', primary_muscle_id: 1, equipment: 'barbell', level: 'beginner', type: 'compound',
    });
  });

  it('deactivates an exercise and reloads', async () => {
    mockedApi.delete.mockResolvedValueOnce(undefined);
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [], meta: {} });

    await useAdminStore.getState().deactivateExercise(1);

    expect(mockedApi.delete).toHaveBeenCalledWith('/admin/exercises/1');
  });
});

describe('reports', () => {
  it('loads reports defaulting to pending', async () => {
    mockedApi.get.mockResolvedValueOnce([report]);

    await useAdminStore.getState().loadReports();

    expect(mockedApi.get).toHaveBeenCalledWith('/admin/reports?status=pending');
    expect(useAdminStore.getState().reports).toEqual([report]);
  });

  it('resolves a report and reloads', async () => {
    mockedApi.patch.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([]);

    await useAdminStore.getState().resolveReport(1, 'resolved', 'listo');

    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/reports/1/resolve', {
      status: 'resolved', resolution_notes: 'listo',
    });
  });
});

describe('news', () => {
  it('loads admin news (including drafts)', async () => {
    mockedApi.get.mockResolvedValueOnce([news]);

    await useAdminStore.getState().loadNews();

    expect(mockedApi.get).toHaveBeenCalledWith('/admin/news');
    expect(useAdminStore.getState().news).toEqual([news]);
  });

  it('creates a news draft and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([news]);

    await useAdminStore.getState().createNews('Título', 'Cuerpo');

    expect(mockedApi.post).toHaveBeenCalledWith('/admin/news', { title: 'Título', body: 'Cuerpo' });
  });

  it('toggles publish state and reloads', async () => {
    mockedApi.patch.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([{ ...news, published: true }]);

    await useAdminStore.getState().toggleNewsPublish(1, true);

    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/news/1', { published: true });
  });

  it('deletes news and reloads', async () => {
    mockedApi.delete.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([]);

    await useAdminStore.getState().deleteNews(1);

    expect(mockedApi.delete).toHaveBeenCalledWith('/admin/news/1');
  });
});

describe('stats', () => {
  it('loads global metrics', async () => {
    mockedApi.get.mockResolvedValueOnce(stats);

    await useAdminStore.getState().loadStats();

    expect(mockedApi.get).toHaveBeenCalledWith('/admin/stats');
    expect(useAdminStore.getState().stats).toEqual(stats);
  });
});

describe('audit log', () => {
  it('loads audit log entries', async () => {
    mockedApi.get.mockResolvedValueOnce([auditEntry]);

    await useAdminStore.getState().loadAuditLog();

    expect(mockedApi.get).toHaveBeenCalledWith('/admin/audit-logs');
    expect(useAdminStore.getState().auditLog).toEqual([auditEntry]);
  });
});

describe('routine templates', () => {
  it('loads routine templates', async () => {
    mockedApi.get.mockResolvedValueOnce([routineTemplate]);

    await useAdminStore.getState().loadRoutineTemplates();

    expect(mockedApi.get).toHaveBeenCalledWith('/admin/routine-templates');
    expect(useAdminStore.getState().routineTemplates).toEqual([routineTemplate]);
  });

  it('creates a routine template and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([routineTemplate]);

    await useAdminStore.getState().createRoutineTemplate({
      name: 'Full Body 3 días', sex: 'male', frequency_days: 3, split_type: 'full_body', days: [],
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/admin/routine-templates', {
      name: 'Full Body 3 días', sex: 'male', frequency_days: 3, split_type: 'full_body', days: [],
    });
  });

  it('duplicates a routine template and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([routineTemplate, { ...routineTemplate, id: 2 }]);

    await useAdminStore.getState().duplicateRoutineTemplate(1);

    expect(mockedApi.post).toHaveBeenCalledWith('/admin/routine-templates/1/duplicate');
  });

  it('activates a routine template and reloads', async () => {
    mockedApi.patch.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([{ ...routineTemplate, is_active: true }]);

    await useAdminStore.getState().activateRoutineTemplate(1);

    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/routine-templates/1/activate');
  });

  it('deactivates a routine template and reloads', async () => {
    mockedApi.patch.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([routineTemplate]);

    await useAdminStore.getState().deactivateRoutineTemplate(1);

    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/routine-templates/1/deactivate');
  });
});

describe('admin-assigned routine (super admin)', () => {
  it('loads the existing personalized routine for a user (null if it has none)', async () => {
    mockedApi.get.mockResolvedValueOnce(null);

    await useAdminStore.getState().loadAdminRoutineForEdit(1);

    expect(mockedApi.get).toHaveBeenCalledWith('/admin/users/1/routine');
    expect(useAdminStore.getState().adminRoutineForEdit).toBeNull();
  });

  it('sets an error when loading the routine fails', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('no autorizado'));

    await useAdminStore.getState().loadAdminRoutineForEdit(1);

    expect(useAdminStore.getState().adminRoutineError).toBe('no autorizado');
    expect(useAdminStore.getState().isLoadingAdminRoutine).toBe(false);
  });

  it('assigns a routine (POST) when the user had none yet, then refreshes the user detail', async () => {
    mockedApi.post.mockResolvedValueOnce(adminRoutine);
    mockedApi.get.mockResolvedValueOnce({ ...user, id: 1 });

    const result = await useAdminStore.getState().saveAdminRoutine(1, routinePayload);

    expect(mockedApi.post).toHaveBeenCalledWith('/admin/users/1/routine', routinePayload);
    expect(mockedApi.patch).not.toHaveBeenCalled();
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/users/1');
    expect(result).toEqual(adminRoutine);
  });

  it('replaces a routine (PATCH) when the user already had a personalized one loaded', async () => {
    useAdminStore.setState({ adminRoutineForEdit: adminRoutine });
    mockedApi.patch.mockResolvedValueOnce({ ...adminRoutine, frequency_days: 4 });
    mockedApi.get.mockResolvedValueOnce({ ...user, id: 1 });

    const result = await useAdminStore.getState().saveAdminRoutine(1, routinePayload);

    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/routines/5', routinePayload);
    expect(mockedApi.post).not.toHaveBeenCalled();
    expect(result?.frequency_days).toBe(4);
  });

  it('sets an error and returns null when saving fails', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('rutina inválida'));

    const result = await useAdminStore.getState().saveAdminRoutine(1, routinePayload);

    expect(result).toBeNull();
    expect(useAdminStore.getState().adminRoutineError).toBe('rutina inválida');
    expect(useAdminStore.getState().isSubmittingAdminRoutine).toBe(false);
  });

  it('reverts to the general routine and refreshes the user detail', async () => {
    useAdminStore.setState({ adminRoutineForEdit: adminRoutine });
    mockedApi.delete.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce({ ...user, id: 1 });

    const ok = await useAdminStore.getState().revertToGeneralRoutine(1);

    expect(mockedApi.delete).toHaveBeenCalledWith('/admin/users/1/routine');
    expect(ok).toBe(true);
    expect(useAdminStore.getState().adminRoutineForEdit).toBeNull();
  });

  it('returns false and sets an error when reverting fails', async () => {
    mockedApi.delete.mockRejectedValueOnce(new Error('no se pudo'));

    const ok = await useAdminStore.getState().revertToGeneralRoutine(1);

    expect(ok).toBe(false);
    expect(useAdminStore.getState().adminRoutineError).toBe('no se pudo');
  });
});

describe('challenge templates', () => {
  const challengeTemplate = {
    id: 1, code: 'weekly_5_sessions', title: 'Racha semanal', description: 'Completa 5 entrenamientos esta semana.',
    type: 'weekly' as const, metric: 'workouts_count' as const, target: 5, is_active: true, created_at: '2026-08-20T00:00:00Z',
  };

  it('loads challenge templates', async () => {
    mockedApi.get.mockResolvedValueOnce([challengeTemplate]);

    await useAdminStore.getState().loadChallengeTemplates();

    expect(mockedApi.get).toHaveBeenCalledWith('/admin/challenge-templates');
    expect(useAdminStore.getState().challengeTemplates).toEqual([challengeTemplate]);
  });

  it('creates a challenge template and reloads', async () => {
    mockedApi.post.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([challengeTemplate]);

    await useAdminStore.getState().createChallengeTemplate({
      code: 'weekly_5_sessions', title: 'Racha semanal', description: 'Completa 5 entrenamientos esta semana.',
      type: 'weekly', metric: 'workouts_count', target: 5,
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/admin/challenge-templates', {
      code: 'weekly_5_sessions', title: 'Racha semanal', description: 'Completa 5 entrenamientos esta semana.',
      type: 'weekly', metric: 'workouts_count', target: 5,
    });
  });

  it('sets an error and does not reload on failure', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('code ya existe'));

    await expect(
      useAdminStore.getState().createChallengeTemplate({
        code: 'weekly_5_sessions', title: 'x', description: 'x', type: 'weekly', metric: 'workouts_count', target: 5,
      }),
    ).rejects.toThrow();

    expect(useAdminStore.getState().challengeTemplateError).toBe('code ya existe');
  });

  it('deactivates an active template via the deactivate endpoint', async () => {
    mockedApi.patch.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([{ ...challengeTemplate, is_active: false }]);

    await useAdminStore.getState().toggleChallengeTemplateActive(1, true);

    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/challenge-templates/1/deactivate');
  });

  it('activates an inactive template via the activate endpoint', async () => {
    mockedApi.patch.mockResolvedValueOnce(undefined);
    mockedApi.get.mockResolvedValueOnce([{ ...challengeTemplate, is_active: true }]);

    await useAdminStore.getState().toggleChallengeTemplateActive(1, false);

    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/challenge-templates/1/activate');
  });
});
