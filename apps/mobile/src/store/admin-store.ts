import { create } from 'zustand';
import type {
  AdminExercise,
  AdminStats,
  AdminUser,
  AuditLogEntry,
  MuscleGroupOption,
  NewsPromotion,
  Report,
  ReportStatus,
} from '@sanken/core';

import { api } from '@/lib/api';

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
  loadUsers: (filters?: { role?: string; is_banned?: boolean; q?: string }) => Promise<void>;
  banUser: (id: number) => Promise<void>;
  verifyTrainer: (id: number) => Promise<void>;

  exercises: AdminExercise[];
  muscleGroups: MuscleGroupOption[];
  isLoadingExercises: boolean;
  loadExercises: () => Promise<void>;
  createExercise: (payload: ExerciseFormPayload) => Promise<void>;
  updateExercise: (id: number, payload: Partial<ExerciseFormPayload>) => Promise<void>;
  deactivateExercise: (id: number) => Promise<void>;

  reports: Report[];
  isLoadingReports: boolean;
  loadReports: (status?: ReportStatus | 'all') => Promise<void>;
  resolveReport: (id: number, status: 'resolved' | 'dismissed', notes?: string) => Promise<void>;

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
}));
