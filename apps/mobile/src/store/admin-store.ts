import { create } from 'zustand';
import type {
  AdminExercise,
  AdminRoutineTemplate,
  AdminStats,
  AdminUser,
  AdminUserDetail,
  AssignableRole,
  AuditLogEntry,
  ChallengeTemplate,
  ChallengeTemplatePayload,
  MuscleGroupOption,
  NewsPromotion,
  PrSubmission,
  PrSubmissionStatus,
  Report,
  ReportStatus,
  RoutineTemplatePayload,
} from '@sanken/core';

import { api } from '@/lib/api';

interface VideoPickerAsset {
  uri: string;
  name: string;
  mimeType: string | null;
}

interface ExerciseFormPayload {
  name: string;
  primary_muscle_id: number;
  equipment: string;
  level: string;
  type: string;
  instructions?: string;
}

interface AdminStoreState {
  users: AdminUser[];
  isLoadingUsers: boolean;
  loadUsers: (filters?: {
    role?: string;
    is_banned?: boolean;
    q?: string;
    country_id?: number;
    city_id?: number;
  }) => Promise<void>;
  banUser: (id: number) => Promise<void>;
  verifyTrainer: (id: number) => Promise<void>;

  userDetail: AdminUserDetail | null;
  isLoadingUserDetail: boolean;
  loadUserDetail: (id: number) => Promise<void>;
  changeUserRole: (id: number, role: AssignableRole) => Promise<void>;
  activateUser: (id: number) => Promise<void>;
  deactivateUser: (id: number) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  exercises: AdminExercise[];
  muscleGroups: MuscleGroupOption[];
  isLoadingExercises: boolean;
  loadExercises: () => Promise<void>;
  createExercise: (payload: ExerciseFormPayload) => Promise<void>;
  updateExercise: (id: number, payload: Partial<ExerciseFormPayload>) => Promise<void>;
  deactivateExercise: (id: number) => Promise<void>;
  uploadExerciseVideo: (id: number, asset: VideoPickerAsset) => Promise<void>;
  deleteExerciseVideo: (id: number) => Promise<void>;

  reports: Report[];
  isLoadingReports: boolean;
  loadReports: (status?: ReportStatus | 'all') => Promise<void>;
  resolveReport: (id: number, status: 'resolved' | 'dismissed', notes?: string) => Promise<void>;

  prSubmissions: PrSubmission[];
  isLoadingPrSubmissions: boolean;
  reviewError: string | null;
  loadPrSubmissions: (status?: PrSubmissionStatus | 'all') => Promise<void>;
  reviewPrSubmission: (id: number, status: 'approved' | 'rejected', rejectionReason?: string) => Promise<void>;

  challengeTemplates: ChallengeTemplate[];
  isLoadingChallengeTemplates: boolean;
  challengeTemplateError: string | null;
  loadChallengeTemplates: () => Promise<void>;
  createChallengeTemplate: (payload: ChallengeTemplatePayload) => Promise<void>;
  toggleChallengeTemplateActive: (id: number, isActive: boolean) => Promise<void>;

  news: NewsPromotion[];
  isLoadingNews: boolean;
  loadNews: () => Promise<void>;
  createNews: (title: string, body: string) => Promise<void>;
  toggleNewsPublish: (id: number, published: boolean) => Promise<void>;
  deleteNews: (id: number) => Promise<void>;

  stats: AdminStats | null;
  isLoadingStats: boolean;
  loadStats: () => Promise<void>;

  auditLog: AuditLogEntry[];
  isLoadingAuditLog: boolean;
  loadAuditLog: () => Promise<void>;

  routineTemplates: AdminRoutineTemplate[];
  isLoadingRoutineTemplates: boolean;
  loadRoutineTemplates: () => Promise<void>;
  createRoutineTemplate: (payload: RoutineTemplatePayload) => Promise<void>;
  updateRoutineTemplate: (id: number, payload: RoutineTemplatePayload) => Promise<void>;
  duplicateRoutineTemplate: (id: number) => Promise<void>;
  activateRoutineTemplate: (id: number) => Promise<void>;
  deactivateRoutineTemplate: (id: number) => Promise<void>;
}

export const useAdminStore = create<AdminStoreState>((set, get) => ({
  users: [],
  isLoadingUsers: false,
  loadUsers: async (filters) => {
    set({ isLoadingUsers: true });
    const params = new URLSearchParams();
    if (filters?.role) params.set('role', filters.role);
    if (filters?.is_banned) params.set('is_banned', '1');
    if (filters?.q) params.set('q', filters.q);
    if (filters?.country_id) params.set('country_id', String(filters.country_id));
    if (filters?.city_id) params.set('city_id', String(filters.city_id));
    const users = await api.get<AdminUser[]>(`/admin/users?${params.toString()}`);
    set({ users, isLoadingUsers: false });
  },
  banUser: async (id) => {
    await api.patch(`/admin/users/${id}/ban`);
    await get().loadUsers();
  },
  verifyTrainer: async (id) => {
    await api.patch(`/admin/users/${id}/verify-trainer`);
    await get().loadUsers();
  },

  userDetail: null,
  isLoadingUserDetail: false,
  loadUserDetail: async (id) => {
    set({ isLoadingUserDetail: true });
    const userDetail = await api.get<AdminUserDetail>(`/admin/users/${id}`);
    set({ userDetail, isLoadingUserDetail: false });
  },
  changeUserRole: async (id, role) => {
    await api.patch(`/admin/users/${id}/role`, { role });
    await get().loadUserDetail(id);
  },
  activateUser: async (id) => {
    await api.patch(`/admin/users/${id}/activate`);
    await get().loadUserDetail(id);
  },
  deactivateUser: async (id) => {
    await api.patch(`/admin/users/${id}/deactivate`);
    await get().loadUserDetail(id);
  },
  deleteUser: async (id) => {
    await api.delete(`/admin/users/${id}`);
  },

  exercises: [],
  muscleGroups: [],
  isLoadingExercises: false,
  loadExercises: async () => {
    set({ isLoadingExercises: true });
    const res = await api.getWithMeta<AdminExercise[]>('/admin/exercises');
    set({
      exercises: res.data,
      muscleGroups: (res.meta?.muscle_groups as MuscleGroupOption[] | undefined) ?? [],
      isLoadingExercises: false,
    });
  },
  createExercise: async (payload) => {
    await api.post('/admin/exercises', payload);
    await get().loadExercises();
  },
  updateExercise: async (id, payload) => {
    await api.patch(`/admin/exercises/${id}`, payload);
    await get().loadExercises();
  },
  deactivateExercise: async (id) => {
    await api.delete(`/admin/exercises/${id}`);
    await get().loadExercises();
  },
  uploadExerciseVideo: async (id, asset) => {
    const formData = new FormData();
    // El shape clásico { uri, name, type } no funciona: desde SDK 53 Expo
    // reemplaza `fetch` global por su propio runtime en todas las
    // plataformas, y su FormData solo reconoce Blob real (o string) — ver
    // el mismo comentario en auth-store.ts::updateAvatar.
    const blob = await fetch(asset.uri).then((r) => r.blob());
    formData.append('video', blob, asset.name);
    await api.post(`/admin/exercises/${id}/video`, formData);
    await get().loadExercises();
  },
  deleteExerciseVideo: async (id) => {
    await api.delete(`/admin/exercises/${id}/video`);
    await get().loadExercises();
  },

  reports: [],
  isLoadingReports: false,
  loadReports: async (status = 'pending') => {
    set({ isLoadingReports: true });
    const reports = await api.get<Report[]>(`/admin/reports?status=${status}`);
    set({ reports, isLoadingReports: false });
  },
  resolveReport: async (id, status, notes) => {
    await api.patch(`/admin/reports/${id}/resolve`, { status, resolution_notes: notes });
    await get().loadReports();
  },

  prSubmissions: [],
  isLoadingPrSubmissions: false,
  reviewError: null,
  loadPrSubmissions: async (status = 'pending') => {
    set({ isLoadingPrSubmissions: true });
    const prSubmissions = await api.get<PrSubmission[]>(`/admin/pr-submissions?status=${status}`);
    set({ prSubmissions, isLoadingPrSubmissions: false });
  },
  reviewPrSubmission: async (id, status, rejectionReason) => {
    set({ reviewError: null });
    try {
      await api.patch(`/admin/pr-submissions/${id}/review`, { status, rejection_reason: rejectionReason });
      await get().loadPrSubmissions();
    } catch (err) {
      set({ reviewError: err instanceof Error ? err.message : 'No se pudo revisar la postulación.' });
      throw err;
    }
  },

  challengeTemplates: [],
  isLoadingChallengeTemplates: false,
  challengeTemplateError: null,
  loadChallengeTemplates: async () => {
    set({ isLoadingChallengeTemplates: true });
    const challengeTemplates = await api.get<ChallengeTemplate[]>('/admin/challenge-templates');
    set({ challengeTemplates, isLoadingChallengeTemplates: false });
  },
  createChallengeTemplate: async (payload) => {
    set({ challengeTemplateError: null });
    try {
      await api.post('/admin/challenge-templates', payload);
      await get().loadChallengeTemplates();
    } catch (err) {
      set({ challengeTemplateError: err instanceof Error ? err.message : 'No se pudo crear la plantilla.' });
      throw err;
    }
  },
  toggleChallengeTemplateActive: async (id, isActive) => {
    await api.patch(`/admin/challenge-templates/${id}/${isActive ? 'deactivate' : 'activate'}`);
    await get().loadChallengeTemplates();
  },

  news: [],
  isLoadingNews: false,
  loadNews: async () => {
    set({ isLoadingNews: true });
    const news = await api.get<NewsPromotion[]>('/admin/news');
    set({ news, isLoadingNews: false });
  },
  createNews: async (title, body) => {
    await api.post('/admin/news', { title, body });
    await get().loadNews();
  },
  toggleNewsPublish: async (id, published) => {
    await api.patch(`/admin/news/${id}`, { published });
    await get().loadNews();
  },
  deleteNews: async (id) => {
    await api.delete(`/admin/news/${id}`);
    await get().loadNews();
  },

  stats: null,
  isLoadingStats: false,
  loadStats: async () => {
    set({ isLoadingStats: true });
    const stats = await api.get<AdminStats>('/admin/stats');
    set({ stats, isLoadingStats: false });
  },

  auditLog: [],
  isLoadingAuditLog: false,
  loadAuditLog: async () => {
    set({ isLoadingAuditLog: true });
    const auditLog = await api.get<AuditLogEntry[]>('/admin/audit-logs');
    set({ auditLog, isLoadingAuditLog: false });
  },

  routineTemplates: [],
  isLoadingRoutineTemplates: false,
  loadRoutineTemplates: async () => {
    set({ isLoadingRoutineTemplates: true });
    const routineTemplates = await api.get<AdminRoutineTemplate[]>('/admin/routine-templates');
    set({ routineTemplates, isLoadingRoutineTemplates: false });
  },
  createRoutineTemplate: async (payload) => {
    await api.post('/admin/routine-templates', payload);
    await get().loadRoutineTemplates();
  },
  updateRoutineTemplate: async (id, payload) => {
    await api.patch(`/admin/routine-templates/${id}`, payload);
    await get().loadRoutineTemplates();
  },
  duplicateRoutineTemplate: async (id) => {
    await api.post(`/admin/routine-templates/${id}/duplicate`);
    await get().loadRoutineTemplates();
  },
  activateRoutineTemplate: async (id) => {
    await api.patch(`/admin/routine-templates/${id}/activate`);
    await get().loadRoutineTemplates();
  },
  deactivateRoutineTemplate: async (id) => {
    await api.patch(`/admin/routine-templates/${id}/deactivate`);
    await get().loadRoutineTemplates();
  },
}));
