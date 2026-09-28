import { Platform } from 'react-native';
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';
import { ApiError, type ApiErrorBody, type ApiSuccess } from '@sanken/core';

import { api, resolveApiBaseUrl } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

interface UploadFileOptions {
  /** Ruta de la API sin el prefijo /api/v1 (ej. "/auth/me/avatar"). */
  path: string;
  /** Nombre del campo que valida el FormRequest de Laravel ("avatar", "video"). */
  fieldName: string;
  /** URI local del archivo (file:// o content://). */
  uri: string;
  /** Nombre con el que llega al servidor — solo se usa en la vista web. */
  name: string;
  mimeType?: string | null;
}

/**
 * Sube un archivo local a la API como multipart/form-data y devuelve `data`
 * del envelope, igual que api.post().
 *
 * En Android/iOS NO se arma un FormData en JS: la subida la hace
 * `uploadAsync` de expo-file-system, que construye el multipart nativamente
 * (OkHttp / NSURLSession) leyendo el archivo directo desde disco. Antes el
 * archivo pasaba por el FormData en JS de expo/fetch (primero vía
 * fetch(uri).blob(), después con `File` de expo-file-system): en el APK el
 * pedido fallaba antes de salir del celular — el log del servidor no
 * mostraba ningún POST /auth/me/avatar — mientras que la web, donde el
 * navegador arma el multipart de forma nativa, funcionaba. Esta es la
 * misma idea aplicada al celular.
 *
 * En la vista web (react-native-web) la URI es un blob:/data: del navegador:
 * ahí sí se usa FormData + fetch como en apps/web.
 */
export async function uploadFileAsync<T>({ path, fieldName, uri, name, mimeType }: UploadFileOptions): Promise<T> {
  if (Platform.OS === 'web') {
    const blob = await fetch(uri).then((r) => r.blob());
    const formData = new FormData();
    formData.append(fieldName, blob, name);
    return api.post<T>(path, formData);
  }

  const token = useAuthStore.getState().token;
  const result = await uploadAsync(`${resolveApiBaseUrl()}/api/v1${path}`, uri, {
    httpMethod: 'POST',
    uploadType: FileSystemUploadType.MULTIPART,
    fieldName,
    ...(mimeType ? { mimeType } : {}),
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let json: unknown = null;
  try {
    json = result.body ? JSON.parse(result.body) : null;
  } catch {
    json = null;
  }

  if (result.status < 200 || result.status >= 300) {
    if (result.status === 401) useAuthStore.getState().clearSessionLocal();
    // 413 = el servidor cortó el archivo por tamaño antes de llegar a Laravel.
    const fallback =
      result.status === 413 ? 'El archivo es demasiado pesado para el servidor.' : `Error ${result.status} al subir el archivo.`;
    throw new ApiError(result.status, (json as ApiErrorBody | null) ?? { message: fallback });
  }

  return (json as ApiSuccess<T> | null)?.data as T;
}
