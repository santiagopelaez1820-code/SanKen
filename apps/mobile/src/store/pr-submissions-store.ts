// Esta línea sirve para importar «create» desde «zustand».
import { create } from 'zustand';
// Esta línea sirve para importar los tipos «CreatePrSubmissionPayload, PrSubmission» desde «@sanken/core».
import type { CreatePrSubmissionPayload, PrSubmission } from '@sanken/core';

// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from '@/lib/api';
// Esta línea sirve para importar «uploadFileAsync» desde «@/lib/upload-file».
import { uploadFileAsync } from '@/lib/upload-file';

// Esta línea sirve para declarar la interfaz «VideoPickerAsset».
interface VideoPickerAsset {
  // Esta línea sirve para declarar la propiedad «uri» con el valor o tipo «string».
  uri: string;
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string;
  // Esta línea sirve para declarar la propiedad «mimeType» con el valor o tipo «string | null».
  mimeType: string | null;
}

// Esta línea sirve para declarar la interfaz «PrSubmissionsStoreState».
interface PrSubmissionsStoreState {
  // Esta línea sirve para declarar la propiedad «submissions» con el valor o tipo «PrSubmission[]».
  submissions: PrSubmission[];
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean;
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «boolean».
  isSubmitting: boolean;
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «string | null».
  error: string | null;
  // Esta línea sirve para declarar la propiedad «uploadingId» con el valor o tipo «number | null».
  uploadingId: number | null;
  // Esta línea sirve para declarar la propiedad «uploadError» con el valor o tipo «string | null».
  uploadError: string | null;
  /** Postulación a la que corresponde uploadError — cada fila muestra solo su propio error. */
  // Esta línea sirve para declarar la propiedad «failedUploadId» con el valor o tipo «number | null».
  failedUploadId: number | null;

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «() => Promise<void>».
  load: () => Promise<void>;
  /** Devuelve la postulación creada (para subirle el video enseguida) o null si falló. */
  // Esta línea sirve para definir «submit» con «(payload: CreatePrSubmissionPayload) => …».
  submit: (payload: CreatePrSubmissionPayload) => Promise<PrSubmission | null>;
  // Esta línea sirve para definir «uploadVideo» con «(id: number, asset: VideoPickerAsset) =>…».
  uploadVideo: (id: number, asset: VideoPickerAsset) => Promise<void>;
}

// Esta línea sirve para declarar «usePrSubmissionsStore» con el valor «create<PrSubmissionsStoreState>((set, get) => ({».
export const usePrSubmissionsStore = create<PrSubmissionsStoreState>((set, get) => ({
  // Esta línea sirve para declarar la propiedad «submissions» con el valor o tipo «[]».
  submissions: [],
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «false».
  isLoading: false,
  // Esta línea sirve para declarar la propiedad «isSubmitting» con el valor o tipo «false».
  isSubmitting: false,
  // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «null».
  error: null,
  // Esta línea sirve para declarar la propiedad «uploadingId» con el valor o tipo «null».
  uploadingId: null,
  // Esta línea sirve para declarar la propiedad «uploadError» con el valor o tipo «null».
  uploadError: null,
  // Esta línea sirve para declarar la propiedad «failedUploadId» con el valor o tipo «null».
  failedUploadId: null,

  // Esta línea sirve para declarar la propiedad «load» con el valor o tipo «async () => {».
  load: async () => {
    // Esta línea sirve para guardar en el store: «isLoading: true, error: null })…».
    set({ isLoading: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.get<PrSubmission[]>('/pr-submissions')» y guardar el resultado en «submissions».
      const submissions = await api.get<PrSubmission[]>('/pr-submissions');
      // Esta línea sirve para guardar en el store: «submissions, isLoading: false })…».
      set({ submissions, isLoading: false });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isLoading: false, error: err instanceof Error ? err.message …».
      set({ isLoading: false, error: err instanceof Error ? err.message : 'No se pudieron cargar tus postulaciones.' });
    }
  },

  // Esta línea sirve para declarar la propiedad «submit» con el valor o tipo «async (payload) => {».
  submit: async (payload) => {
    // Esta línea sirve para guardar en el store: «isSubmitting: true, error: null })…».
    set({ isSubmitting: true, error: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar «api.post<PrSubmission>('/pr-submissions', payload)» y guardar el resultado en «created».
      const created = await api.post<PrSubmission>('/pr-submissions', payload);
      // Esta línea sirve para esperar el resultado de «get».
      await get().load();
      // Esta línea sirve para guardar en el store: «isSubmitting: false })…».
      set({ isSubmitting: false });
      // Esta línea sirve para devolver «created».
      return created;
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store: «isSubmitting: false, error: err instanceof Error ? err.messa…».
      set({ isSubmitting: false, error: err instanceof Error ? err.message : 'No se pudo postular el PR.' });
      // Esta línea sirve para devolver null.
      return null;
    }
  },

  // Esta línea sirve para declarar la propiedad «uploadVideo» con el valor o tipo «async (id, asset) => {».
  uploadVideo: async (id, asset) => {
    // Esta línea sirve para guardar en el store: «uploadingId: id, uploadError: null, failedUploadId: null })…».
    set({ uploadingId: id, uploadError: null, failedUploadId: null });
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Subida multipart nativa leyendo el video desde disco — ver lib/upload-file.ts.
      // Esta línea sirve para esperar el resultado de «uploadFileAsync».
      await uploadFileAsync({
        // Esta línea sirve para declarar la propiedad «path» con el valor o tipo «`/pr-submissions/${id}/video`».
        path: `/pr-submissions/${id}/video`,
        // Esta línea sirve para declarar la propiedad «fieldName» con el valor o tipo «'video'».
        fieldName: 'video',
        // Esta línea sirve para declarar la propiedad «uri» con el valor o tipo «asset.uri».
        uri: asset.uri,
        // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «asset.name».
        name: asset.name,
        // Esta línea sirve para declarar la propiedad «mimeType» con el valor o tipo «asset.mimeType».
        mimeType: asset.mimeType,
      });
      // Esta línea sirve para esperar el resultado de «get».
      await get().load();
      // Esta línea sirve para guardar en el store: «uploadingId: null })…».
      set({ uploadingId: null });
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el store los valores de las líneas siguientes.
      set({
        // Esta línea sirve para declarar la propiedad «uploadingId» con el valor o tipo «null».
        uploadingId: null,
        // Esta línea sirve para definir «uploadError» con «err instanceof Error ? err.message : 'No…».
        uploadError: err instanceof Error ? err.message : 'No se pudo subir el video.',
        // Esta línea sirve para declarar la propiedad «failedUploadId» con el valor o tipo «id».
        failedUploadId: id,
      });
      // Esta línea sirve para relanzar el error «err» para que lo maneje quien llamó.
      throw err;
    }
  },
}));
