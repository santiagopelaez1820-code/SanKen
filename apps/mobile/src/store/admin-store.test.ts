// Esta línea sirve para importar «beforeEach, describe, expect, it, jest» desde «@jest/globals».
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
// Esta línea sirve para abrir la importación de los nombres siguientes.
import type {
  // Esta línea sirve para incluir el valor «AdminExercise» en la lista.
  AdminExercise,
  // Esta línea sirve para incluir el valor «AdminRoutineTemplate» en la lista.
  AdminRoutineTemplate,
  // Esta línea sirve para incluir el valor «AdminStats» en la lista.
  AdminStats,
  // Esta línea sirve para incluir el valor «AdminUser» en la lista.
  AdminUser,
  // Esta línea sirve para incluir el valor «AuditLogEntry» en la lista.
  AuditLogEntry,
  // Esta línea sirve para incluir el valor «ManualRoutinePayload» en la lista.
  ManualRoutinePayload,
  // Esta línea sirve para incluir el valor «NewsPromotion» en la lista.
  NewsPromotion,
  // Esta línea sirve para incluir el valor «Report» en la lista.
  Report,
  // Esta línea sirve para incluir el valor «Routine» en la lista.
  Routine,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «useAdminStore» desde «./admin-store».
import { useAdminStore } from './admin-store';

// Esta línea sirve para simular el módulo «@/lib/api» en la prueba.
jest.mock('@/lib/api', () => ({
  // Esta línea sirve para definir el estilo «api» con «get: jest.fn(), post: jest.fn(), patch: jest.fn(),…».
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn(), getWithMeta: jest.fn() },
}));

// Esta línea sirve para declarar «mockedApi» con el valor «api as jest.Mocked<typeof api>».
const mockedApi = api as jest.Mocked<typeof api>;

// Esta línea sirve para declarar el dato de ejemplo «user» de tipo «AdminUser».
const user: AdminUser = {
  // Esta línea sirve para definir «id» con «1, name: 'Ana', email: 'ana@sanken.app',…».
  id: 1, name: 'Ana', email: 'ana@sanken.app', role: 'trainer',
  // Esta línea sirve para definir «is_banned» con «false, is_deactivated: false, country: n…».
  is_banned: false, is_deactivated: false, country: null, state: null, city: null,
  // Esta línea sirve para definir «trainer_verified_at» con «null, last_active_at: null, created_at: …».
  trainer_verified_at: null, last_active_at: null, created_at: '2026-08-01T00:00:00Z',
  // Esta línea sirve para declarar la propiedad «current_routine» con el valor o tipo «null».
  current_routine: null,
};

// Esta línea sirve para declarar el dato de ejemplo «exercise» de tipo «AdminExercise».
const exercise: AdminExercise = {
  // Esta línea sirve para definir «id» con «1, name: 'Press banca', primary_muscle_i…».
  id: 1, name: 'Press banca', primary_muscle_id: 1, primary_muscle: { id: 1, name: 'Pecho' },
  // Esta línea sirve para definir la propiedad «equipment» con «barbell', level: 'beginner', type: 'comp…».
  equipment: 'barbell', level: 'beginner', type: 'compound',
  // Esta línea sirve para definir «instructions» con «null, common_mistakes: null, tips: null,…».
  instructions: null, common_mistakes: null, tips: null, video_url: null, image_url: null, is_active: true,
  // Esta línea sirve para declarar la propiedad «alternatives» con el valor o tipo «[]».
  alternatives: [],
};

// Esta línea sirve para declarar el dato de ejemplo «report» de tipo «Report».
const report: Report = {
  // Esta línea sirve para definir «id» con «1, reporter: { id: 2, name: 'Beto' }, re…».
  id: 1, reporter: { id: 2, name: 'Beto' }, reportable_type: 'chat_message', reportable_id: 9,
  // Esta línea sirve para definir la propiedad «reason» con «abuse', details: null, status: 'pending'…».
  reason: 'abuse', details: null, status: 'pending', resolved_at: null, resolution_notes: null,
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2026-08-01T00:00:00Z'».
  created_at: '2026-08-01T00:00:00Z',
};

// Esta línea sirve para declarar el dato de ejemplo «news» de tipo «NewsPromotion».
const news: NewsPromotion = {
  // Esta línea sirve para definir «id» con «1, title: 'Novedad', body: 'Contenido', …».
  id: 1, title: 'Novedad', body: 'Contenido', image_url: null, published: false, published_at: null,
  // Esta línea sirve para declarar la propiedad «created_at» con el valor o tipo «'2026-08-01T00:00:00Z'».
  created_at: '2026-08-01T00:00:00Z',
};

// Esta línea sirve para declarar el dato de ejemplo «stats» de tipo «AdminStats».
const stats: AdminStats = {
  // Esta línea sirve para definir «total_users» con «10, new_users_7d: 2, trainers_count: 1, …».
  total_users: 10, new_users_7d: 2, trainers_count: 1, banned_users_count: 0,
  // Esta línea sirve para declarar la propiedad «pending_reports_count» con el valor o tipo «1, dau: 3, wau: 5, mau: 8, retention_pct: 50».
  pending_reports_count: 1, dau: 3, wau: 5, mau: 8, retention_pct: 50,
};

// Esta línea sirve para declarar el dato de ejemplo «auditEntry» de tipo «AuditLogEntry».
const auditEntry: AuditLogEntry = {
  // Esta línea sirve para definir «id» con «1, log_name: 'user', description: 'updat…».
  id: 1, log_name: 'user', description: 'updated', event: 'updated',
  // Esta línea sirve para definir la propiedad «subject_type» con «App\\Models\\User', subject_id: 1, chang…».
  subject_type: 'App\\Models\\User', subject_id: 1, changes: {}, created_at: '2026-08-01T00:00:00Z',
};

// Esta línea sirve para declarar el dato de ejemplo «routineTemplate» de tipo «AdminRoutineTemplate».
const routineTemplate: AdminRoutineTemplate = {
  // Esta línea sirve para definir «id» con «1, name: 'Full Body 3 días', sex: 'male'…».
  id: 1, name: 'Full Body 3 días', sex: 'male', frequency_days: 3, level: 'intermediate', split_type: 'full_body',
  // Esta línea sirve para declarar la propiedad «is_active» con el valor o tipo «false, days: []».
  is_active: false, days: [],
};

// Esta línea sirve para declarar el dato de ejemplo «adminRoutine» de tipo «Routine».
const adminRoutine: Routine = {
  // Esta línea sirve para definir «id» con «5, source: 'trainer', goal: 'gain_muscle…».
  id: 5, source: 'trainer', goal: 'gain_muscle', split_type: 'full_body', frequency_days: 3, duration_weeks: 6,
  // Esta línea sirve para definir «is_active» con «true, starts_at: null, ends_at: null, da…».
  is_active: true, starts_at: null, ends_at: null, days: [],
};

// Esta línea sirve para declarar el dato de ejemplo «routinePayload» de tipo «ManualRoutinePayload».
const routinePayload: ManualRoutinePayload = {
  // Esta línea sirve para definir la propiedad «goal» con «gain_muscle', split_type: 'full_body', f…».
  goal: 'gain_muscle', split_type: 'full_body', frequency_days: 3, duration_weeks: 6, days: [],
};

// Esta línea sirve para declarar lo que se ejecuta antes de cada prueba.
beforeEach(() => {
  // Esta línea sirve para llamar a «jest.clearAllMocks».
  jest.clearAllMocks();
  // Esta línea sirve para fijar el estado inicial del store para la prueba.
  useAdminStore.setState({
    // Esta línea sirve para declarar la propiedad «users» con el valor o tipo «[], isLoadingUsers: false».
    users: [], isLoadingUsers: false,
    // Esta línea sirve para definir «exercises» con «[], muscleGroups: [], isLoadingExercises…».
    exercises: [], muscleGroups: [], isLoadingExercises: false,
    // Esta línea sirve para declarar la propiedad «reports» con el valor o tipo «[], isLoadingReports: false».
    reports: [], isLoadingReports: false,
    // Esta línea sirve para declarar la propiedad «news» con el valor o tipo «[], isLoadingNews: false».
    news: [], isLoadingNews: false,
    // Esta línea sirve para declarar la propiedad «stats» con el valor o tipo «null, isLoadingStats: false».
    stats: null, isLoadingStats: false,
    // Esta línea sirve para declarar la propiedad «auditLog» con el valor o tipo «[], isLoadingAuditLog: false».
    auditLog: [], isLoadingAuditLog: false,
    // Esta línea sirve para declarar la propiedad «routineTemplates» con el valor o tipo «[], isLoadingRoutineTemplates: false».
    routineTemplates: [], isLoadingRoutineTemplates: false,
    // Esta línea sirve para declarar la propiedad «userDetail» con el valor o tipo «null, isLoadingUserDetail: false».
    userDetail: null, isLoadingUserDetail: false,
    // Esta línea sirve para definir «adminRoutineForEdit» con «null, isLoadingAdminRoutine: false, isSu…».
    adminRoutineForEdit: null, isLoadingAdminRoutine: false, isSubmittingAdminRoutine: false, adminRoutineError: null,
  });
});

// Esta línea sirve para agrupar las pruebas de «users».
describe('users', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads users with query filters».
  it('loads users with query filters', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([user]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().loadUsers({ role: 'trainer', q: 'ana' });

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/users?role=trainer&q=ana');
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «users».
    expect(useAdminStore.getState().users).toEqual([user]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «bans a user and reloads the list».
  it('bans a user and reloads the list', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.patch».
    mockedApi.patch.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([{ ...user, is_banned: true }]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().banUser(1);

    // Esta línea sirve para verificar que «mockedApi.patch» cumple «toHaveBeenCalledWith».
    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/users/1/ban');
    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/users?');
  });

  // Esta línea sirve para declarar la prueba que verifica que «toggles trainer verification and reloads the list».
  it('toggles trainer verification and reloads the list', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.patch».
    mockedApi.patch.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([user]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().verifyTrainer(1);

    // Esta línea sirve para verificar que «mockedApi.patch» cumple «toHaveBeenCalledWith».
    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/users/1/verify-trainer');
  });
});

// Esta línea sirve para agrupar las pruebas de «exercises».
describe('exercises', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads exercises and the muscle group options from meta».
  it('loads exercises and the muscle group options from meta', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.getWithMeta».
    mockedApi.getWithMeta.mockResolvedValueOnce({
      // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «[exercise]».
      data: [exercise],
      // Esta línea sirve para declarar la propiedad «meta» con el valor o tipo «{ muscle_groups: [{ id: 1, name: 'Pecho' }] }».
      meta: { muscle_groups: [{ id: 1, name: 'Pecho' }] },
    });

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().loadExercises();

    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «exercises».
    expect(useAdminStore.getState().exercises).toEqual([exercise]);
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «muscleGroups».
    expect(useAdminStore.getState().muscleGroups).toEqual([{ id: 1, name: 'Pecho' }]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «creates an exercise and reloads».
  it('creates an exercise and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.getWithMeta».
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [exercise], meta: {} });

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().createExercise({
      // Esta línea sirve para definir la propiedad «name» con «Press banca', primary_muscle_id: 1, equi…».
      name: 'Press banca', primary_muscle_id: 1, equipment: 'barbell', level: 'beginner', type: 'compound',
    });

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/admin/exercises', {
      // Esta línea sirve para definir la propiedad «name» con «Press banca', primary_muscle_id: 1, equi…».
      name: 'Press banca', primary_muscle_id: 1, equipment: 'barbell', level: 'beginner', type: 'compound',
    });
  });

  // Esta línea sirve para declarar la prueba que verifica que «deactivates an exercise and reloads».
  it('deactivates an exercise and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.delete».
    mockedApi.delete.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.getWithMeta».
    mockedApi.getWithMeta.mockResolvedValueOnce({ data: [], meta: {} });

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().deactivateExercise(1);

    // Esta línea sirve para verificar que «mockedApi.delete» cumple «toHaveBeenCalledWith».
    expect(mockedApi.delete).toHaveBeenCalledWith('/admin/exercises/1');
  });
});

// Esta línea sirve para agrupar las pruebas de «reports».
describe('reports', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads reports defaulting to pending».
  it('loads reports defaulting to pending', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([report]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().loadReports();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/reports?status=pending');
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «reports».
    expect(useAdminStore.getState().reports).toEqual([report]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «resolves a report and reloads».
  it('resolves a report and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.patch».
    mockedApi.patch.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().resolveReport(1, 'resolved', 'listo');

    // Esta línea sirve para verificar que «mockedApi.patch» cumple «toHaveBeenCalledWith».
    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/reports/1/resolve', {
      // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «'resolved', resolution_notes: 'listo'».
      status: 'resolved', resolution_notes: 'listo',
    });
  });
});

// Esta línea sirve para agrupar las pruebas de «news».
describe('news', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads admin news (including drafts)».
  it('loads admin news (including drafts)', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([news]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().loadNews();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/news');
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «news».
    expect(useAdminStore.getState().news).toEqual([news]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «creates a news draft and reloads».
  it('creates a news draft and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([news]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().createNews('Título', 'Cuerpo');

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/admin/news', { title: 'Título', body: 'Cuerpo' });
  });

  // Esta línea sirve para declarar la prueba que verifica que «toggles publish state and reloads».
  it('toggles publish state and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.patch».
    mockedApi.patch.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([{ ...news, published: true }]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().toggleNewsPublish(1, true);

    // Esta línea sirve para verificar que «mockedApi.patch» cumple «toHaveBeenCalledWith».
    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/news/1', { published: true });
  });

  // Esta línea sirve para declarar la prueba que verifica que «deletes news and reloads».
  it('deletes news and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.delete».
    mockedApi.delete.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().deleteNews(1);

    // Esta línea sirve para verificar que «mockedApi.delete» cumple «toHaveBeenCalledWith».
    expect(mockedApi.delete).toHaveBeenCalledWith('/admin/news/1');
  });
});

// Esta línea sirve para agrupar las pruebas de «stats».
describe('stats', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads global metrics».
  it('loads global metrics', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(stats);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().loadStats();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/stats');
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «stats».
    expect(useAdminStore.getState().stats).toEqual(stats);
  });
});

// Esta línea sirve para agrupar las pruebas de «audit log».
describe('audit log', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads audit log entries».
  it('loads audit log entries', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([auditEntry]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().loadAuditLog();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/audit-logs');
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «auditLog».
    expect(useAdminStore.getState().auditLog).toEqual([auditEntry]);
  });
});

// Esta línea sirve para agrupar las pruebas de «routine templates».
describe('routine templates', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads routine templates».
  it('loads routine templates', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([routineTemplate]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().loadRoutineTemplates();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/routine-templates');
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «routineTemplates».
    expect(useAdminStore.getState().routineTemplates).toEqual([routineTemplate]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «creates a routine template and reloads».
  it('creates a routine template and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([routineTemplate]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().createRoutineTemplate({
      // Esta línea sirve para definir la propiedad «name» con «Full Body 3 días', sex: 'male', frequenc…».
      name: 'Full Body 3 días', sex: 'male', frequency_days: 3, split_type: 'full_body', days: [],
    });

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/admin/routine-templates', {
      // Esta línea sirve para definir la propiedad «name» con «Full Body 3 días', sex: 'male', frequenc…».
      name: 'Full Body 3 días', sex: 'male', frequency_days: 3, split_type: 'full_body', days: [],
    });
  });

  // Esta línea sirve para declarar la prueba que verifica que «duplicates a routine template and reloads».
  it('duplicates a routine template and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([routineTemplate, { ...routineTemplate, id: 2 }]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().duplicateRoutineTemplate(1);

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/admin/routine-templates/1/duplicate');
  });

  // Esta línea sirve para declarar la prueba que verifica que «activates a routine template and reloads».
  it('activates a routine template and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.patch».
    mockedApi.patch.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([{ ...routineTemplate, is_active: true }]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().activateRoutineTemplate(1);

    // Esta línea sirve para verificar que «mockedApi.patch» cumple «toHaveBeenCalledWith».
    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/routine-templates/1/activate');
  });

  // Esta línea sirve para declarar la prueba que verifica que «deactivates a routine template and reloads».
  it('deactivates a routine template and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.patch».
    mockedApi.patch.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([routineTemplate]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().deactivateRoutineTemplate(1);

    // Esta línea sirve para verificar que «mockedApi.patch» cumple «toHaveBeenCalledWith».
    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/routine-templates/1/deactivate');
  });
});

// Esta línea sirve para agrupar las pruebas de «admin-assigned routine (super admin)».
describe('admin-assigned routine (super admin)', () => {
  // Esta línea sirve para declarar la prueba que verifica que «loads the existing personalized routine for a user (null if it has non».
  it('loads the existing personalized routine for a user (null if it has none)', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce(null);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().loadAdminRoutineForEdit(1);

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/users/1/routine');
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «adminRoutineForEdit».
    expect(useAdminStore.getState().adminRoutineForEdit).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error when loading the routine fails».
  it('sets an error when loading the routine fails', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockRejectedValueOnce(new Error('no autorizado'));

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().loadAdminRoutineForEdit(1);

    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «adminRoutineError».
    expect(useAdminStore.getState().adminRoutineError).toBe('no autorizado');
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «isLoadingAdminRoutine».
    expect(useAdminStore.getState().isLoadingAdminRoutine).toBe(false);
  });

  // Esta línea sirve para declarar la prueba que verifica que «assigns a routine (POST) when the user had none yet, then refreshes th».
  it('assigns a routine (POST) when the user had none yet, then refreshes the user detail', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(adminRoutine);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce({ ...user, id: 1 });

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «result».
    const result = await useAdminStore.getState().saveAdminRoutine(1, routinePayload);

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/admin/users/1/routine', routinePayload);
    // Esta línea sirve para verificar que «mockedApi.patch» no cumple «toHaveBeenCalled».
    expect(mockedApi.patch).not.toHaveBeenCalled();
    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/users/1');
    // Esta línea sirve para verificar que «result» cumple «toEqual».
    expect(result).toEqual(adminRoutine);
  });

  // Esta línea sirve para declarar la prueba que verifica que «replaces a routine (PATCH) when the user already had a personalized on».
  it('replaces a routine (PATCH) when the user already had a personalized one loaded', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAdminStore.setState({ adminRoutineForEdit: adminRoutine });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.patch».
    mockedApi.patch.mockResolvedValueOnce({ ...adminRoutine, frequency_days: 4 });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce({ ...user, id: 1 });

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «result».
    const result = await useAdminStore.getState().saveAdminRoutine(1, routinePayload);

    // Esta línea sirve para verificar que «mockedApi.patch» cumple «toHaveBeenCalledWith».
    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/routines/5', routinePayload);
    // Esta línea sirve para verificar que «mockedApi.post» no cumple «toHaveBeenCalled».
    expect(mockedApi.post).not.toHaveBeenCalled();
    // Esta línea sirve para verificar que «result?.frequency_days» cumple «toBe».
    expect(result?.frequency_days).toBe(4);
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error and returns null when saving fails».
  it('sets an error and returns null when saving fails', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new Error('rutina inválida'));

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «result».
    const result = await useAdminStore.getState().saveAdminRoutine(1, routinePayload);

    // Esta línea sirve para verificar que «result» cumple «toBeNull».
    expect(result).toBeNull();
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «adminRoutineError».
    expect(useAdminStore.getState().adminRoutineError).toBe('rutina inválida');
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «isSubmittingAdminRoutine».
    expect(useAdminStore.getState().isSubmittingAdminRoutine).toBe(false);
  });

  // Esta línea sirve para declarar la prueba que verifica que «reverts to the general routine and refreshes the user detail».
  it('reverts to the general routine and refreshes the user detail', async () => {
    // Esta línea sirve para fijar el estado inicial del store para la prueba.
    useAdminStore.setState({ adminRoutineForEdit: adminRoutine });
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.delete».
    mockedApi.delete.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce({ ...user, id: 1 });

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «ok».
    const ok = await useAdminStore.getState().revertToGeneralRoutine(1);

    // Esta línea sirve para verificar que «mockedApi.delete» cumple «toHaveBeenCalledWith».
    expect(mockedApi.delete).toHaveBeenCalledWith('/admin/users/1/routine');
    // Esta línea sirve para verificar que «ok» cumple «toBe».
    expect(ok).toBe(true);
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «adminRoutineForEdit».
    expect(useAdminStore.getState().adminRoutineForEdit).toBeNull();
  });

  // Esta línea sirve para declarar la prueba que verifica que «returns false and sets an error when reverting fails».
  it('returns false and sets an error when reverting fails', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.delete».
    mockedApi.delete.mockRejectedValueOnce(new Error('no se pudo'));

    // Esta línea sirve para ejecutar la acción y guardar el resultado en «ok».
    const ok = await useAdminStore.getState().revertToGeneralRoutine(1);

    // Esta línea sirve para verificar que «ok» cumple «toBe».
    expect(ok).toBe(false);
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «adminRoutineError».
    expect(useAdminStore.getState().adminRoutineError).toBe('no se pudo');
  });
});

// Esta línea sirve para agrupar las pruebas de «challenge templates».
describe('challenge templates', () => {
  // Esta línea sirve para declarar el objeto de ejemplo «challengeTemplate».
  const challengeTemplate = {
    // Esta línea sirve para definir «id» con «1, code: 'weekly_5_sessions', title: 'Ra…».
    id: 1, code: 'weekly_5_sessions', title: 'Racha semanal', description: 'Completa 5 entrenamientos esta semana.',
    // Esta línea sirve para definir la propiedad «type» con «weekly' as const, metric: 'workouts_coun…».
    type: 'weekly' as const, metric: 'workouts_count' as const, target: 5, is_active: true, created_at: '2026-08-20T00:00:00Z',
  };

  // Esta línea sirve para declarar la prueba que verifica que «loads challenge templates».
  it('loads challenge templates', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([challengeTemplate]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().loadChallengeTemplates();

    // Esta línea sirve para verificar que «mockedApi.get» cumple «toHaveBeenCalledWith».
    expect(mockedApi.get).toHaveBeenCalledWith('/admin/challenge-templates');
    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «challengeTemplates».
    expect(useAdminStore.getState().challengeTemplates).toEqual([challengeTemplate]);
  });

  // Esta línea sirve para declarar la prueba que verifica que «creates a challenge template and reloads».
  it('creates a challenge template and reloads', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([challengeTemplate]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().createChallengeTemplate({
      // Esta línea sirve para definir la propiedad «code» con «weekly_5_sessions', title: 'Racha semana…».
      code: 'weekly_5_sessions', title: 'Racha semanal', description: 'Completa 5 entrenamientos esta semana.',
      // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «'weekly', metric: 'workouts_count', target: 5».
      type: 'weekly', metric: 'workouts_count', target: 5,
    });

    // Esta línea sirve para verificar que «mockedApi.post» cumple «toHaveBeenCalledWith».
    expect(mockedApi.post).toHaveBeenCalledWith('/admin/challenge-templates', {
      // Esta línea sirve para definir la propiedad «code» con «weekly_5_sessions', title: 'Racha semana…».
      code: 'weekly_5_sessions', title: 'Racha semanal', description: 'Completa 5 entrenamientos esta semana.',
      // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «'weekly', metric: 'workouts_count', target: 5».
      type: 'weekly', metric: 'workouts_count', target: 5,
    });
  });

  // Esta línea sirve para declarar la prueba que verifica que «sets an error and does not reload on failure».
  it('sets an error and does not reload on failure', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.post».
    mockedApi.post.mockRejectedValueOnce(new Error('code ya existe'));

    // Esta línea sirve para esperar el resultado de «expect».
    await expect(
      // Esta línea sirve para invocar la acción «createChallengeTemplate» del store de «Admin».
      useAdminStore.getState().createChallengeTemplate({
        // Esta línea sirve para definir la propiedad «code» con «weekly_5_sessions', title: 'x', descript…».
        code: 'weekly_5_sessions', title: 'x', description: 'x', type: 'weekly', metric: 'workouts_count', target: 5,
      }),
    // Esta línea sirve para verificar que la llamada es rechazada con un error.
    ).rejects.toThrow();

    // Esta línea sirve para verificar que «useAdminStore.getState(» cumple «challengeTemplateError».
    expect(useAdminStore.getState().challengeTemplateError).toBe('code ya existe');
  });

  // Esta línea sirve para declarar la prueba que verifica que «deactivates an active template via the deactivate endpoint».
  it('deactivates an active template via the deactivate endpoint', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.patch».
    mockedApi.patch.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([{ ...challengeTemplate, is_active: false }]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().toggleChallengeTemplateActive(1, true);

    // Esta línea sirve para verificar que «mockedApi.patch» cumple «toHaveBeenCalledWith».
    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/challenge-templates/1/deactivate');
  });

  // Esta línea sirve para declarar la prueba que verifica que «activates an inactive template via the activate endpoint».
  it('activates an inactive template via the activate endpoint', async () => {
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.patch».
    mockedApi.patch.mockResolvedValueOnce(undefined);
    // Esta línea sirve para definir lo que devuelve el espía «mockedApi.get».
    mockedApi.get.mockResolvedValueOnce([{ ...challengeTemplate, is_active: true }]);

    // Esta línea sirve para esperar el resultado de «useAdminStore.getState».
    await useAdminStore.getState().toggleChallengeTemplateActive(1, false);

    // Esta línea sirve para verificar que «mockedApi.patch» cumple «toHaveBeenCalledWith».
    expect(mockedApi.patch).toHaveBeenCalledWith('/admin/challenge-templates/1/activate');
  });
});
