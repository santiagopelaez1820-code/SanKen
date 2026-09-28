import { create } from 'zustand';
import type { CreatePrSubmissionPayload, PrSubmission } from '@sanken/core';

import { api } from '@/lib/api';
import { uploadFileAsync } from '@/lib/upload-file';

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
  /** Postulación a la que corresponde uploadError — cada fila muestra solo su propio error. */
  failedUploadId: number | null;

  load: () => Promise<void>;
  /** Devuelve la postulación creada (para subirle el video enseguida) o null si falló. */
  submit: (payload: CreatePrSubmissionPayload) => Promise<PrSubmission | null>;
  uploadVideo: (id: number, asset: VideoPickerAsset) => Promise<void>;
}

export const usePrSubmissionsStore = create<PrSubmissionsStoreState>((set, get) => ({
  submissions: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  uploadingId: null,
  uploadError: null,
  failedUploadId: null,

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
      const created = await api.post<PrSubmission>('/pr-submissions', payload);
      await get().load();
      set({ isSubmitting: false });
      return created;
    } catch (err) {
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo postular el PR.' });
      return null;
    }
  },

  uploadVideo: async (id, asset) => {
    set({ uploadingId: id, uploadError: null, failedUploadId: null });
    try {
      // Subida multipart nativa leyendo el video desde disco — ver lib/upload-file.ts.
      await uploadFileAsync({
        path: `/pr-submissions/${id}/video`,
        fieldName: 'video',
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
      });
      await get().load();
      set({ uploadingId: null });
    } catch (err) {
      set({
        uploadingId: null,
        uploadError: err instanceof Error ? err.message : 'No se pudo subir el video.',
        failedUploadId: id,
      });
      throw err;
    }
  },
}));
