import { create } from 'zustand';
import type { CreatePrSubmissionPayload, PrSubmission } from '@sanken/core';

import { api } from '@/lib/api';

interface VideoPickerAsset {
  uri: string;
  name: string;
  mimeType: string | null;
}

interface PrSubmissionsStoreState {
  submissions: PrSubmission[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  uploadingId: number | null;
  uploadError: string | null;

  load: () => Promise<void>;
  submit: (payload: CreatePrSubmissionPayload) => Promise<boolean>;
  uploadVideo: (id: number, asset: VideoPickerAsset) => Promise<void>;
}

export const usePrSubmissionsStore = create<PrSubmissionsStoreState>((set, get) => ({
  submissions: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  uploadingId: null,
  uploadError: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const submissions = await api.get<PrSubmission[]>('/pr-submissions');
      set({ submissions, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar tus postulaciones.' });
    }
  },

  submit: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      await api.post<PrSubmission>('/pr-submissions', payload);
      await get().load();
      set({ isSubmitting: false });
      return true;
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo postular el PR.' });
      return false;
    }
  },

  uploadVideo: async (id, asset) => {
    set({ uploadingId: id, uploadError: null });
    try {
      const formData = new FormData();
      // El shape clásico { uri, name, type } no funciona: desde SDK 53 Expo
      // reemplaza `fetch` global por su propio runtime en todas las
      // plataformas, y su FormData solo reconoce Blob real (o string) — ver
      // el mismo comentario en auth-store.ts::updateAvatar.
      const blob = await fetch(asset.uri).then((r) => r.blob());
      formData.append('video', blob, asset.name);
      await api.post(`/pr-submissions/${id}/video`, formData);
      await get().load();
      set({ uploadingId: null });
    } catch (err) {
      set({ uploadingId: null, uploadError: err instanceof Error ? err.message : 'No se pudo subir el video.' });
      throw err;
    }
  },
}));
