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
      // React Native's fetch acepta este shape de objeto para archivos —
      // distinto de File/Blob (usado en web), por eso el `as unknown as Blob`.
      formData.append('video', {
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType ?? 'video/mp4',
      } as unknown as Blob);
      await api.post(`/pr-submissions/${id}/video`, formData);
      await get().load();
      set({ uploadingId: null });
    } catch (err) {
      set({ uploadingId: null, uploadError: err instanceof Error ? err.message : 'No se pudo subir el video.' });
      throw err;
    }
  },
}));
