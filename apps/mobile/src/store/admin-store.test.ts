import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { AdminExercise, AdminStats, AdminUser, AuditLogEntry, NewsPromotion, Report } from '@sanken/core';

import { api } from '@/lib/api';
import { useAdminStore } from './admin-store';

jest.mock('@/lib/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn(), getWithMeta: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const user: AdminUser = {
  id: 1, name: 'Ana', email: 'ana@sanken.app', role: 'trainer',
  is_banned: false, trainer_verified_at: null, last_active_at: null, created_at: '2026-08-01T00:00:00Z',
};

const exercise: AdminExercise = {
  id: 1, name: 'Press banca', primary_muscle_id: 1, primary_muscle: { id: 1, name: 'Pecho' },
  equipment: 'barbell', level: 'beginner', type: 'compound',
  instructions: null, common_mistakes: null, tips: null, video_url: null, image_url: null, is_active: true,
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

beforeEach(() => {
  jest.clearAllMocks();
  useAdminStore.setState({
    users: [], isLoadingUsers: false,
    exercises: [], muscleGroups: [], isLoadingExercises: false,
    reports: [], isLoadingReports: false,
    news: [], isLoadingNews: false,
    stats: null, isLoadingStats: false,
    auditLog: [], isLoadingAuditLog: false,
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
