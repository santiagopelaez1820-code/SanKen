// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
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
  // Esta línea sirve para incluir el valor «AdminUserDetail» en la lista.
  AdminUserDetail,
  // Esta línea sirve para incluir el valor «AssignableRole» en la lista.
  AssignableRole,
  // Esta línea sirve para incluir el valor «AuditLogEntry» en la lista.
  AuditLogEntry,
  // Esta línea sirve para incluir el valor «ChallengeTemplate» en la lista.
  ChallengeTemplate,
  // Esta línea sirve para incluir el valor «ChallengeTemplatePayload» en la lista.
  ChallengeTemplatePayload,
  // Esta línea sirve para incluir el valor «ManualRoutinePayload» en la lista.
  ManualRoutinePayload,
  // Esta línea sirve para incluir el valor «MuscleGroupOption» en la lista.
  MuscleGroupOption,
  // Esta línea sirve para incluir el valor «NewsPromotion» en la lista.
  NewsPromotion,
  // Esta línea sirve para incluir el valor «PrSubmission» en la lista.
  PrSubmission,
  // Esta línea sirve para incluir el valor «PrSubmissionStatus» en la lista.
  PrSubmissionStatus,
  // Esta línea sirve para incluir el valor «Report» en la lista.
  Report,
  // Esta línea sirve para incluir el valor «ReportStatus» en la lista.
  ReportStatus,
  // Esta línea sirve para incluir el valor «Routine» en la lista.
  Routine,
  // Esta línea sirve para incluir el valor «RoutineTemplatePayload» en la lista.
  RoutineTemplatePayload,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';

// Esta línea sirve para declarar la interfaz «VideoPickerAsset».
interface VideoPickerAsset {
  // Esta línea sirve para declarar la propiedad «uri» con el valor o tipo «string».
  uri: string;
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string;
  // Esta línea sirve para declarar la propiedad «mimeType» con el valor o tipo «string | null».
  mimeType: string | null;
}

// Esta línea sirve para declarar la interfaz «ExerciseFormPayload».
interface ExerciseFormPayload {
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string;
  // Esta línea sirve para declarar la propiedad «primary_muscle_id» con el valor o tipo «number».
  primary_muscle_id: number;
  // Esta línea sirve para declarar la propiedad «equipment» con el valor o tipo «string».
  equipment: string;
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «string».
  level: string;
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «string».
  type: string;
  // Esta línea sirve para declarar la propiedad «instructions» con el valor o tipo «string».
  instructions?: string;
  // Esta línea sirve para declarar la propiedad «alternative_exercise_id» con el valor o tipo «number | null».
  alternative_exercise_id?: number | null;
}

// Esta línea sirve para declarar la interfaz «AdminStoreState».
interface AdminStoreState {
  // Esta línea sirve para declarar la propiedad «users» con el valor o tipo «AdminUser[]».
  users: AdminUser[];
  // Esta línea sirve para declarar la propiedad «isLoadingUsers» con el valor o tipo «boolean».
  isLoadingUsers: boolean;
  // Esta línea sirve para declarar la propiedad «loadUsers» con el valor o tipo «(filters?: {».
  loadUsers: (filters?: {
    // Esta línea sirve para declarar la propiedad «role» con el valor o tipo «string».
    role?: string;
    // Esta línea sirve para declarar la propiedad «is_banned» con el valor o tipo «boolean».
    is_banned?: boolean;
    // Esta línea sirve para declarar la propiedad «q» con el valor o tipo «string».
    q?: string;
    // Esta línea sirve para declarar la propiedad «country_id» con el valor o tipo «number».
    country_id?: number;
    // Esta línea sirve para declarar la propiedad «city_id» con el valor o tipo «number».
    city_id?: number;
  // Esta línea sirve para cerrar la declaración de la función asíncrona.
  }) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «banUser» con el valor o tipo «(id: number) => Promise<void>».
  banUser: (id: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «verifyTrainer» con el valor o tipo «(id: number) => Promise<void>».
  verifyTrainer: (id: number) => Promise<void>;

  // Esta línea sirve para declarar la propiedad «userDetail» con el valor o tipo «AdminUserDetail | null».
  userDetail: AdminUserDetail | null;
  // Esta línea sirve para declarar la propiedad «isLoadingUserDetail» con el valor o tipo «boolean».
  isLoadingUserDetail: boolean;
  // Esta línea sirve para declarar la propiedad «loadUserDetail» con el valor o tipo «(id: number) => Promise<void>».
  loadUserDetail: (id: number) => Promise<void>;
  // Esta línea sirve para definir «changeUserRole» con «(id: number, role: AssignableRole) => Pr…».
  changeUserRole: (id: number, role: AssignableRole) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «activateUser» con el valor o tipo «(id: number) => Promise<void>».
  activateUser: (id: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «deactivateUser» con el valor o tipo «(id: number) => Promise<void>».
  deactivateUser: (id: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «deleteUser» con el valor o tipo «(id: number) => Promise<void>».
  deleteUser: (id: number) => Promise<void>;

  /** Rutina personalizada (asignada por Super Admin) del usuario en `userDetail` — null si todavía no tiene una (usa la rutina general). */
  // Esta línea sirve para declarar la propiedad «adminRoutineForEdit» con el valor o tipo «Routine | null».
  adminRoutineForEdit: Routine | null;
  // Esta línea sirve para declarar la propiedad «isLoadingAdminRoutine» con el valor o tipo «boolean».
  isLoadingAdminRoutine: boolean;
  // Esta línea sirve para declarar la propiedad «isSubmittingAdminRoutine» con el valor o tipo «boolean».
  isSubmittingAdminRoutine: boolean;
  // Esta línea sirve para declarar la propiedad «adminRoutineError» con el valor o tipo «string | null».
  adminRoutineError: string | null;
  // Esta línea sirve para declarar la propiedad «loadAdminRoutineForEdit» con el valor o tipo «(userId: number) => Promise<void>».
  loadAdminRoutineForEdit: (userId: number) => Promise<void>;
  /** POST si el usuario no tenía rutina personalizada, PATCH si ya tenía una (mismo criterio que apps/web RoutineEditorPage scope="admin"). */
  // Esta línea sirve para definir «saveAdminRoutine» con «(userId: number, payload: ManualRoutineP…».
  saveAdminRoutine: (userId: number, payload: ManualRoutinePayload) => Promise<Routine | null>;
  // Esta línea sirve para declarar la propiedad «revertToGeneralRoutine» con el valor o tipo «(userId: number) => Promise<boolean>».
  revertToGeneralRoutine: (userId: number) => Promise<boolean>;

  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «AdminExercise[]».
  exercises: AdminExercise[];
  // Esta línea sirve para declarar la propiedad «muscleGroups» con el valor o tipo «MuscleGroupOption[]».
  muscleGroups: MuscleGroupOption[];
  // Esta línea sirve para declarar la propiedad «isLoadingExercises» con el valor o tipo «boolean».
  isLoadingExercises: boolean;
  // Esta línea sirve para declarar la propiedad «loadExercises» con el valor o tipo «() => Promise<void>».
  loadExercises: () => Promise<void>;
  // Esta línea sirve para definir «createExercise» con «(payload: ExerciseFormPayload) => Promis…».
  createExercise: (payload: ExerciseFormPayload) => Promise<void>;
  // Esta línea sirve para definir «updateExercise» con «(id: number, payload: Partial<ExerciseFo…».
  updateExercise: (id: number, payload: Partial<ExerciseFormPayload>) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «deactivateExercise» con el valor o tipo «(id: number) => Promise<void>».
  deactivateExercise: (id: number) => Promise<void>;
  // Esta línea sirve para definir «uploadExerciseVideo» con «(id: number, asset: VideoPickerAsset) =>…».
  uploadExerciseVideo: (id: number, asset: VideoPickerAsset) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «deleteExerciseVideo» con el valor o tipo «(id: number) => Promise<void>».
  deleteExerciseVideo: (id: number) => Promise<void>;

  // Esta línea sirve para declarar la propiedad «reports» con el valor o tipo «Report[]».
  reports: Report[];
  // Esta línea sirve para declarar la propiedad «isLoadingReports» con el valor o tipo «boolean».
  isLoadingReports: boolean;
  // Esta línea sirve para definir «loadReports» con «(status?: ReportStatus | 'all') => Promi…».
  loadReports: (status?: ReportStatus | 'all') => Promise<void>;
  // Esta línea sirve para definir «resolveReport» con «(id: number, status: 'resolved' | 'dismi…».
  resolveReport: (id: number, status: 'resolved' | 'dismissed', notes?: string) => Promise<void>;

  // Esta línea sirve para declarar la propiedad «prSubmissions» con el valor o tipo «PrSubmission[]».
  prSubmissions: PrSubmission[];
  // Esta línea sirve para declarar la propiedad «isLoadingPrSubmissions» con el valor o tipo «boolean».
  isLoadingPrSubmissions: boolean;
  // Esta línea sirve para declarar la propiedad «reviewError» con el valor o tipo «string | null».
  reviewError: string | null;
  // Esta línea sirve para definir «loadPrSubmissions» con «(status?: PrSubmissionStatus | 'all') =>…».
  loadPrSubmissions: (status?: PrSubmissionStatus | 'all') => Promise<void>;
  // Esta línea sirve para definir «reviewPrSubmission» con «(id: number, status: 'approved' | 'rejec…».
  reviewPrSubmission: (id: number, status: 'approved' | 'rejected', rejectionReason?: string) => Promise<void>;

  // Esta línea sirve para declarar la propiedad «challengeTemplates» con el valor o tipo «ChallengeTemplate[]».
  challengeTemplates: ChallengeTemplate[];
  // Esta línea sirve para declarar la propiedad «isLoadingChallengeTemplates» con el valor o tipo «boolean».
  isLoadingChallengeTemplates: boolean;
  // Esta línea sirve para declarar la propiedad «challengeTemplateError» con el valor o tipo «string | null».
  challengeTemplateError: string | null;
  // Esta línea sirve para declarar la propiedad «loadChallengeTemplates» con el valor o tipo «() => Promise<void>».
  loadChallengeTemplates: () => Promise<void>;
  // Esta línea sirve para definir «createChallengeTemplate» con «(payload: ChallengeTemplatePayload) => P…».
  createChallengeTemplate: (payload: ChallengeTemplatePayload) => Promise<void>;
  // Esta línea sirve para definir «toggleChallengeTemplateActive» con «(id: number, isActive: boolean) => Promi…».
  toggleChallengeTemplateActive: (id: number, isActive: boolean) => Promise<void>;

  // Esta línea sirve para declarar la propiedad «news» con el valor o tipo «NewsPromotion[]».
  news: NewsPromotion[];
  // Esta línea sirve para declarar la propiedad «isLoadingNews» con el valor o tipo «boolean».
  isLoadingNews: boolean;
  // Esta línea sirve para declarar la propiedad «loadNews» con el valor o tipo «() => Promise<void>».
  loadNews: () => Promise<void>;
  // Esta línea sirve para definir «createNews» con «(title: string, body: string) => Promise…».
  createNews: (title: string, body: string) => Promise<void>;
  // Esta línea sirve para definir «toggleNewsPublish» con «(id: number, published: boolean) => Prom…».
  toggleNewsPublish: (id: number, published: boolean) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «deleteNews» con el valor o tipo «(id: number) => Promise<void>».
  deleteNews: (id: number) => Promise<void>;

  // Esta línea sirve para declarar la propiedad «stats» con el valor o tipo «AdminStats | null».
  stats: AdminStats | null;
  // Esta línea sirve para declarar la propiedad «isLoadingStats» con el valor o tipo «boolean».
  isLoadingStats: boolean;
  // Esta línea sirve para declarar la propiedad «loadStats» con el valor o tipo «() => Promise<void>».
  loadStats: () => Promise<void>;

  // Esta línea sirve para declarar la propiedad «auditLog» con el valor o tipo «AuditLogEntry[]».
  auditLog: AuditLogEntry[];
  // Esta línea sirve para declarar la propiedad «isLoadingAuditLog» con el valor o tipo «boolean».
  isLoadingAuditLog: boolean;
  // Esta línea sirve para declarar la propiedad «loadAuditLog» con el valor o tipo «() => Promise<void>».
  loadAuditLog: () => Promise<void>;

  // Esta línea sirve para declarar la propiedad «routineTemplates» con el valor o tipo «AdminRoutineTemplate[]».
  routineTemplates: AdminRoutineTemplate[];
  // Esta línea sirve para declarar la propiedad «isLoadingRoutineTemplates» con el valor o tipo «boolean».
  isLoadingRoutineTemplates: boolean;
  // Esta línea sirve para declarar la propiedad «loadRoutineTemplates» con el valor o tipo «() => Promise<void>».
  loadRoutineTemplates: () => Promise<void>;
  // Esta línea sirve para definir «createRoutineTemplate» con «(payload: RoutineTemplatePayload) => Pro…».
  createRoutineTemplate: (payload: RoutineTemplatePayload) => Promise<void>;
  // Esta línea sirve para definir «updateRoutineTemplate» con «(id: number, payload: RoutineTemplatePay…».
  updateRoutineTemplate: (id: number, payload: RoutineTemplatePayload) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «duplicateRoutineTemplate» con el valor o tipo «(id: number) => Promise<void>».
  duplicateRoutineTemplate: (id: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «activateRoutineTemplate» con el valor o tipo «(id: number) => Promise<void>».
  activateRoutineTemplate: (id: number) => Promise<void>;
  // Esta línea sirve para declarar la propiedad «deactivateRoutineTemplate» con el valor o tipo «(id: number) => Promise<void>».
  deactivateRoutineTemplate: (id: number) => Promise<void>;
}

// Esta línea sirve para declarar «useAdminStore» con el valor «create<AdminStoreState>((set, get) => ({».
export const useAdminStore = create<AdminStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «users» con el valor o tipo «[]».
  users: [],
  // Esta línea sirve para declarar la propiedad «isLoadingUsers» con el valor o tipo «false».
  isLoadingUsers: false,
  // Esta línea sirve para declarar la propiedad «loadUsers» con el valor o tipo «async (filters) => {».
  loadUsers: async (filters) => {
    // Esta línea sirve para guardar en el store: «isLoadingUsers: true })…».
    set({ isLoadingUsers: true });
    // Esta línea sirve para extraer «aram» de «new URLSearchParams()».
    const params = new URLSearchParams();
    // Esta línea sirve para llamar a «params.set» si «filters?.role».
    if (filters?.role) params.set('role', filters.role);
    // Esta línea sirve para llamar a «params.set» si «filters?.is_banned».
    if (filters?.is_banned) params.set('is_banned', '1');
    // Esta línea sirve para llamar a «params.set» si «filters?.q».
    if (filters?.q) params.set('q', filters.q);
    // Esta línea sirve para llamar a «params.set» si «filters?.country_id».
    if (filters?.country_id) params.set('country_id', String(filters.country_id));
    // Esta línea sirve para llamar a «params.set» si «filters?.city_id».
    if (filters?.city_id) params.set('city_id', String(filters.city_id));
    // Esta línea sirve para esperar «api.get<AdminUser[]>(`/admin/users?${params.toStri» y guardar el resultado en «users».
    const users = await api.get<AdminUser[]>(`/admin/users?${params.toString()}`);
    // Esta línea sirve para guardar en el store: «users, isLoadingUsers: false })…».
    set({ users, isLoadingUsers: false });
  },
  // Esta línea sirve para declarar la propiedad «banUser» con el valor o tipo «async (id) => {».
  banUser: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/users/${id}/ban`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadUsers();
  },
  // Esta línea sirve para declarar la propiedad «verifyTrainer» con el valor o tipo «async (id) => {».
  verifyTrainer: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/users/${id}/verify-trainer`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadUsers();
  },

  // Esta línea sirve para declarar la propiedad «userDetail» con el valor o tipo «null».
  userDetail: null,
  // Esta línea sirve para declarar la propiedad «isLoadingUserDetail» con el valor o tipo «false».
  isLoadingUserDetail: false,
  // Esta línea sirve para declarar la propiedad «loadUserDetail» con el valor o tipo «async (id) => {».
  loadUserDetail: async (id) => {
    // Esta línea sirve para guardar en el store: «isLoadingUserDetail: true })…».
    set({ isLoadingUserDetail: true });
    // Esta línea sirve para esperar «api.get<AdminUserDetail>(`/admin/users/${id}`)» y guardar el resultado en «userDetail».
    const userDetail = await api.get<AdminUserDetail>(`/admin/users/${id}`);
    // Esta línea sirve para guardar en el store: «userDetail, isLoadingUserDetail: false })…».
    set({ userDetail, isLoadingUserDetail: false });
  },
  // Esta línea sirve para declarar la propiedad «changeUserRole» con el valor o tipo «async (id, role) => {».
  changeUserRole: async (id, role) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/users/${id}/role`, { role });
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadUserDetail(id);
  },
  // Esta línea sirve para declarar la propiedad «activateUser» con el valor o tipo «async (id) => {».
  activateUser: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/users/${id}/activate`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadUserDetail(id);
  },
  // Esta línea sirve para declarar la propiedad «deactivateUser» con el valor o tipo «async (id) => {».
  deactivateUser: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/users/${id}/deactivate`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadUserDetail(id);
  },
  // Esta línea sirve para declarar la propiedad «deleteUser» con el valor o tipo «async (id) => {».
  deleteUser: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.delete».
    await api.delete(`/admin/users/${id}`);
  },

  // Esta línea sirve para declarar la propiedad «adminRoutineForEdit» con el valor o tipo «null».
  adminRoutineForEdit: null,
  // Esta línea sirve para declarar la propiedad «isLoadingAdminRoutine» con el valor o tipo «false».
  isLoadingAdminRoutine: false,
  // Esta línea sirve para declarar la propiedad «isSubmittingAdminRoutine» con el valor o tipo «false».
  isSubmittingAdminRoutine: false,
  // Esta línea sirve para declarar la propiedad «adminRoutineError» con el valor o tipo «null».
  adminRoutineError: null,
  // Esta línea sirve para declarar la propiedad «loadAdminRoutineForEdit» con el valor o tipo «async (userId) => {».
  loadAdminRoutineForEdit: async (userId) => {
    // Esta línea sirve para guardar en el store: «isLoadingAdminRoutine: true, adminRoutineError: null })…».
    set({ isLoadingAdminRoutine: true, adminRoutineError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<Routine | null>(`/admin/users/${userId}/ro» y guardar el resultado en «routine».
      const routine = await api.get<Routine | null>(`/admin/users/${userId}/routine`);
      // Esta línea sirve para guardar en el store: «adminRoutineForEdit: routine, isLoadingAdminRoutine: false }…».
      set({ adminRoutineForEdit: routine, isLoadingAdminRoutine: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isLoadingAdminRoutine» con el valor o tipo «false».
        isLoadingAdminRoutine: false,
        // Esta línea sirve para definir «adminRoutineError» con «err instanceof Error ? err.message : 'No…».
        adminRoutineError: err instanceof Error ? err.message : 'No se pudo cargar la rutina.',
      });
    }
  },
  // Esta línea sirve para declarar la propiedad «saveAdminRoutine» con el valor o tipo «async (userId, payload) => {».
  saveAdminRoutine: async (userId, payload) => {
    // Esta línea sirve para guardar en el store: «isSubmittingAdminRoutine: true, adminRoutineError: null })…».
    set({ isSubmittingAdminRoutine: true, adminRoutineError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «xistin» de «get().adminRoutineForEdit».
      const existing = get().adminRoutineForEdit;
      // Esta línea sirve para extraer «outin» de «existing».
      const routine = existing
        // Esta línea sirve para actualizar la rutina existente en la API.
        ? await api.patch<Routine>(`/admin/routines/${existing.id}`, payload)
        // Esta línea sirve para crear la rutina del usuario en la API.
        : await api.post<Routine>(`/admin/users/${userId}/routine`, payload);
      // Esta línea sirve para guardar en el store: «isSubmittingAdminRoutine: false })…».
      set({ isSubmittingAdminRoutine: false });
      // Esta línea sirve para esperar el resultado de «get».
      await get().loadUserDetail(userId);
      // Esta línea sirve para devolver «routine».
      return routine;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isSubmittingAdminRoutine» con el valor o tipo «false».
        isSubmittingAdminRoutine: false,
        // Esta línea sirve para definir «adminRoutineError» con «err instanceof Error ? err.message : 'No…».
        adminRoutineError: err instanceof Error ? err.message : 'No se pudo guardar la rutina.',
      });
      // Esta línea sirve para devolver null.
      return null;
    }
  },
  // Esta línea sirve para declarar la propiedad «revertToGeneralRoutine» con el valor o tipo «async (userId) => {».
  revertToGeneralRoutine: async (userId) => {
    // Esta línea sirve para guardar en el store: «isSubmittingAdminRoutine: true, adminRoutineError: null })…».
    set({ isSubmittingAdminRoutine: true, adminRoutineError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.delete».
      await api.delete(`/admin/users/${userId}/routine`);
      // Esta línea sirve para guardar en el store: «isSubmittingAdminRoutine: false, adminRoutineForEdit: null }…».
      set({ isSubmittingAdminRoutine: false, adminRoutineForEdit: null });
      // Esta línea sirve para esperar el resultado de «get».
      await get().loadUserDetail(userId);
      // Esta línea sirve para devolver «true».
      return true;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «isSubmittingAdminRoutine» con el valor o tipo «false».
        isSubmittingAdminRoutine: false,
        // Esta línea sirve para definir «adminRoutineError» con «err instanceof Error ? err.message : 'No…».
        adminRoutineError: err instanceof Error ? err.message : 'No se pudo volver a la rutina general.',
      });
      // Esta línea sirve para devolver «false».
      return false;
    }
  },

  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «[]».
  exercises: [],
  // Esta línea sirve para declarar la propiedad «muscleGroups» con el valor o tipo «[]».
  muscleGroups: [],
  // Esta línea sirve para declarar la propiedad «isLoadingExercises» con el valor o tipo «false».
  isLoadingExercises: false,
  // Esta línea sirve para declarar la propiedad «loadExercises» con el valor o tipo «async () => {».
  loadExercises: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingExercises: true })…».
    set({ isLoadingExercises: true });
    // Esta línea sirve para esperar «api.getWithMeta<AdminExercise[]>('/admin/exercises» y guardar el resultado en «res».
    const res = await api.getWithMeta<AdminExercise[]>('/admin/exercises');
    // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
    set({
      // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «res.data».
      exercises: res.data,
      // Esta línea sirve para definir «muscleGroups» con «(res.meta?.muscle_groups as MuscleGroupO…».
      muscleGroups: (res.meta?.muscle_groups as MuscleGroupOption[] | undefined) ?? [],
      // Esta línea sirve para declarar la propiedad «isLoadingExercises» con el valor o tipo «false».
      isLoadingExercises: false,
    });
  },
  // Esta línea sirve para declarar la propiedad «createExercise» con el valor o tipo «async (payload) => {».
  createExercise: async (payload) => {
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post('/admin/exercises', payload);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadExercises();
  },
  // Esta línea sirve para declarar la propiedad «updateExercise» con el valor o tipo «async (id, payload) => {».
  updateExercise: async (id, payload) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/exercises/${id}`, payload);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadExercises();
  },
  // Esta línea sirve para declarar la propiedad «deactivateExercise» con el valor o tipo «async (id) => {».
  deactivateExercise: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.delete».
    await api.delete(`/admin/exercises/${id}`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadExercises();
  },
  // Esta línea sirve para declarar la propiedad «uploadExerciseVideo» con el valor o tipo «async (id, asset) => {».
  uploadExerciseVideo: async (id, asset) => {
    // Esta línea sirve para extraer «ormDat» de «new FormData()».
    const formData = new FormData();
    // El shape clásico { uri, name, type } no funciona: desde SDK 53 Expo
    // reemplaza `fetch` global por su propio runtime en todas las
    // plataformas, y su FormData solo reconoce Blob real (o string) — ver
    // el mismo comentario en auth-store.ts::updateAvatar.
    // Esta línea sirve para esperar «fetch(asset.uri).then((r) => r.blob())» y guardar el resultado en «blob».
    const blob = await fetch(asset.uri).then((r) => r.blob());
    // Esta línea sirve para llamar a «formData.append» con «'video', blob, asset.name».
    formData.append('video', blob, asset.name);
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post(`/admin/exercises/${id}/video`, formData);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadExercises();
  },
  // Esta línea sirve para declarar la propiedad «deleteExerciseVideo» con el valor o tipo «async (id) => {».
  deleteExerciseVideo: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.delete».
    await api.delete(`/admin/exercises/${id}/video`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadExercises();
  },

  // Esta línea sirve para declarar la propiedad «reports» con el valor o tipo «[]».
  reports: [],
  // Esta línea sirve para declarar la propiedad «isLoadingReports» con el valor o tipo «false».
  isLoadingReports: false,
  // Esta línea sirve para declarar la propiedad «loadReports» con el valor o tipo «async (status = 'pending') => {».
  loadReports: async (status = 'pending') => {
    // Esta línea sirve para guardar en el store: «isLoadingReports: true })…».
    set({ isLoadingReports: true });
    // Esta línea sirve para esperar «api.get<Report[]>(`/admin/reports?status=${status}» y guardar el resultado en «reports».
    const reports = await api.get<Report[]>(`/admin/reports?status=${status}`);
    // Esta línea sirve para guardar en el store: «reports, isLoadingReports: false })…».
    set({ reports, isLoadingReports: false });
  },
  // Esta línea sirve para declarar la propiedad «resolveReport» con el valor o tipo «async (id, status, notes) => {».
  resolveReport: async (id, status, notes) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/reports/${id}/resolve`, { status, resolution_notes: notes });
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadReports();
  },

  // Esta línea sirve para declarar la propiedad «prSubmissions» con el valor o tipo «[]».
  prSubmissions: [],
  // Esta línea sirve para declarar la propiedad «isLoadingPrSubmissions» con el valor o tipo «false».
  isLoadingPrSubmissions: false,
  // Esta línea sirve para declarar la propiedad «reviewError» con el valor o tipo «null».
  reviewError: null,
  // Esta línea sirve para declarar la propiedad «loadPrSubmissions» con el valor o tipo «async (status = 'pending') => {».
  loadPrSubmissions: async (status = 'pending') => {
    // Esta línea sirve para guardar en el store: «isLoadingPrSubmissions: true })…».
    set({ isLoadingPrSubmissions: true });
    // Esta línea sirve para esperar «api.get<PrSubmission[]>(`/admin/pr-submissions?sta» y guardar el resultado en «prSubmissions».
    const prSubmissions = await api.get<PrSubmission[]>(`/admin/pr-submissions?status=${status}`);
    // Esta línea sirve para guardar en el store: «prSubmissions, isLoadingPrSubmissions: false })…».
    set({ prSubmissions, isLoadingPrSubmissions: false });
  },
  // Esta línea sirve para declarar la propiedad «reviewPrSubmission» con el valor o tipo «async (id, status, rejectionReason) => {».
  reviewPrSubmission: async (id, status, rejectionReason) => {
    // Esta línea sirve para guardar en el store: «reviewError: null })…».
    set({ reviewError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.patch».
      await api.patch(`/admin/pr-submissions/${id}/review`, { status, rejection_reason: rejectionReason });
      // Esta línea sirve para esperar el resultado de «get».
      await get().loadPrSubmissions();
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «reviewError: err instanceof Error ? err.message : 'No se pud…».
      set({ reviewError: err instanceof Error ? err.message : 'No se pudo revisar la postulación.' });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },

  // Esta línea sirve para declarar la propiedad «challengeTemplates» con el valor o tipo «[]».
  challengeTemplates: [],
  // Esta línea sirve para declarar la propiedad «isLoadingChallengeTemplates» con el valor o tipo «false».
  isLoadingChallengeTemplates: false,
  // Esta línea sirve para declarar la propiedad «challengeTemplateError» con el valor o tipo «null».
  challengeTemplateError: null,
  // Esta línea sirve para declarar la propiedad «loadChallengeTemplates» con el valor o tipo «async () => {».
  loadChallengeTemplates: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingChallengeTemplates: true })…».
    set({ isLoadingChallengeTemplates: true });
    // Esta línea sirve para esperar «api.get<ChallengeTemplate[]>('/admin/challenge-tem» y guardar el resultado en «challengeTemplates».
    const challengeTemplates = await api.get<ChallengeTemplate[]>('/admin/challenge-templates');
    // Esta línea sirve para guardar en el store: «challengeTemplates, isLoadingChallengeTemplates: false })…».
    set({ challengeTemplates, isLoadingChallengeTemplates: false });
  },
  // Esta línea sirve para declarar la propiedad «createChallengeTemplate» con el valor o tipo «async (payload) => {».
  createChallengeTemplate: async (payload) => {
    // Esta línea sirve para guardar en el store: «challengeTemplateError: null })…».
    set({ challengeTemplateError: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post('/admin/challenge-templates', payload);
      // Esta línea sirve para esperar el resultado de «get».
      await get().loadChallengeTemplates();
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «challengeTemplateError: err instanceof Error ? err.message :…».
      set({ challengeTemplateError: err instanceof Error ? err.message : 'No se pudo crear la plantilla.' });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },
  // Esta línea sirve para declarar la propiedad «toggleChallengeTemplateActive» con el valor o tipo «async (id, isActive) => {».
  toggleChallengeTemplateActive: async (id, isActive) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/challenge-templates/${id}/${isActive ? 'deactivate' : 'activate'}`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadChallengeTemplates();
  },

  // Esta línea sirve para declarar la propiedad «news» con el valor o tipo «[]».
  news: [],
  // Esta línea sirve para declarar la propiedad «isLoadingNews» con el valor o tipo «false».
  isLoadingNews: false,
  // Esta línea sirve para declarar la propiedad «loadNews» con el valor o tipo «async () => {».
  loadNews: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingNews: true })…».
    set({ isLoadingNews: true });
    // Esta línea sirve para esperar «api.get<NewsPromotion[]>('/admin/news')» y guardar el resultado en «news».
    const news = await api.get<NewsPromotion[]>('/admin/news');
    // Esta línea sirve para guardar en el store: «news, isLoadingNews: false })…».
    set({ news, isLoadingNews: false });
  },
  // Esta línea sirve para declarar la propiedad «createNews» con el valor o tipo «async (title, body) => {».
  createNews: async (title, body) => {
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post('/admin/news', { title, body });
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadNews();
  },
  // Esta línea sirve para declarar la propiedad «toggleNewsPublish» con el valor o tipo «async (id, published) => {».
  toggleNewsPublish: async (id, published) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/news/${id}`, { published });
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadNews();
  },
  // Esta línea sirve para declarar la propiedad «deleteNews» con el valor o tipo «async (id) => {».
  deleteNews: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.delete».
    await api.delete(`/admin/news/${id}`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadNews();
  },

  // Esta línea sirve para declarar la propiedad «stats» con el valor o tipo «null».
  stats: null,
  // Esta línea sirve para declarar la propiedad «isLoadingStats» con el valor o tipo «false».
  isLoadingStats: false,
  // Esta línea sirve para declarar la propiedad «loadStats» con el valor o tipo «async () => {».
  loadStats: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingStats: true })…».
    set({ isLoadingStats: true });
    // Esta línea sirve para esperar «api.get<AdminStats>('/admin/stats')» y guardar el resultado en «stats».
    const stats = await api.get<AdminStats>('/admin/stats');
    // Esta línea sirve para guardar en el store: «stats, isLoadingStats: false })…».
    set({ stats, isLoadingStats: false });
  },

  // Esta línea sirve para declarar la propiedad «auditLog» con el valor o tipo «[]».
  auditLog: [],
  // Esta línea sirve para declarar la propiedad «isLoadingAuditLog» con el valor o tipo «false».
  isLoadingAuditLog: false,
  // Esta línea sirve para declarar la propiedad «loadAuditLog» con el valor o tipo «async () => {».
  loadAuditLog: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingAuditLog: true })…».
    set({ isLoadingAuditLog: true });
    // Esta línea sirve para esperar «api.get<AuditLogEntry[]>('/admin/audit-logs')» y guardar el resultado en «auditLog».
    const auditLog = await api.get<AuditLogEntry[]>('/admin/audit-logs');
    // Esta línea sirve para guardar en el store: «auditLog, isLoadingAuditLog: false })…».
    set({ auditLog, isLoadingAuditLog: false });
  },

  // Esta línea sirve para declarar la propiedad «routineTemplates» con el valor o tipo «[]».
  routineTemplates: [],
  // Esta línea sirve para declarar la propiedad «isLoadingRoutineTemplates» con el valor o tipo «false».
  isLoadingRoutineTemplates: false,
  // Esta línea sirve para declarar la propiedad «loadRoutineTemplates» con el valor o tipo «async () => {».
  loadRoutineTemplates: async () => {
    // Esta línea sirve para guardar en el store: «isLoadingRoutineTemplates: true })…».
    set({ isLoadingRoutineTemplates: true });
    // Esta línea sirve para esperar «api.get<AdminRoutineTemplate[]>('/admin/routine-te» y guardar el resultado en «routineTemplates».
    const routineTemplates = await api.get<AdminRoutineTemplate[]>('/admin/routine-templates');
    // Esta línea sirve para guardar en el store: «routineTemplates, isLoadingRoutineTemplates: false })…».
    set({ routineTemplates, isLoadingRoutineTemplates: false });
  },
  // Esta línea sirve para declarar la propiedad «createRoutineTemplate» con el valor o tipo «async (payload) => {».
  createRoutineTemplate: async (payload) => {
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post('/admin/routine-templates', payload);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadRoutineTemplates();
  },
  // Esta línea sirve para declarar la propiedad «updateRoutineTemplate» con el valor o tipo «async (id, payload) => {».
  updateRoutineTemplate: async (id, payload) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/routine-templates/${id}`, payload);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadRoutineTemplates();
  },
  // Esta línea sirve para declarar la propiedad «duplicateRoutineTemplate» con el valor o tipo «async (id) => {».
  duplicateRoutineTemplate: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post(`/admin/routine-templates/${id}/duplicate`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadRoutineTemplates();
  },
  // Esta línea sirve para declarar la propiedad «activateRoutineTemplate» con el valor o tipo «async (id) => {».
  activateRoutineTemplate: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/routine-templates/${id}/activate`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadRoutineTemplates();
  },
  // Esta línea sirve para declarar la propiedad «deactivateRoutineTemplate» con el valor o tipo «async (id) => {».
  deactivateRoutineTemplate: async (id) => {
    // Esta línea sirve para esperar el resultado de «api.patch».
    await api.patch(`/admin/routine-templates/${id}/deactivate`);
    // Esta línea sirve para esperar el resultado de «get».
    await get().loadRoutineTemplates();
  },
}));
