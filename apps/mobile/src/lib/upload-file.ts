// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar «FileSystemUploadType, uploadAsync» desde «expo-file-system/legacy».
import { FileSystemUploadType, uploadAsync } from 'expo-file-system/legacy';
// Esta línea sirve para importar «ApiError, type ApiErrorBody, type ApiSuccess» desde «@sanken/core».
import { ApiError, type ApiErrorBody, type ApiSuccess } from '@sanken/core';

// Esta línea sirve para importar «api, resolveApiBaseUrl» desde «@/lib/api».
import { api, resolveApiBaseUrl } from '@/lib/api';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

// Esta línea sirve para declarar la interfaz «UploadFileOptions».
interface UploadFileOptions {
  /** Ruta de la API sin el prefijo /api/v1 (ej. "/auth/me/avatar"). */
  // Esta línea sirve para declarar la propiedad «path» con el valor o tipo «string».
  path: string;
  /** Nombre del campo que valida el FormRequest de Laravel ("avatar", "video"). */
  // Esta línea sirve para declarar la propiedad «fieldName» con el valor o tipo «string».
  fieldName: string;
  /** URI local del archivo (file:// o content://). */
  // Esta línea sirve para declarar la propiedad «uri» con el valor o tipo «string».
  uri: string;
  /** Nombre con el que llega al servidor — solo se usa en la vista web. */
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string;
  // Esta línea sirve para declarar la propiedad «mimeType» con el valor o tipo «string | null».
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
// Esta línea sirve para declarar la función «uploadFileAsync».
export async function uploadFileAsync<T>({ path, fieldName, uri, name, mimeType }: UploadFileOptions): Promise<T> {
  // Esta línea sirve para revisar si «Platform.OS === 'web'».
  if (Platform.OS === 'web') {
    // Esta línea sirve para esperar «fetch(uri).then((r) => r.blob())» y guardar el resultado en «blob».
    const blob = await fetch(uri).then((r) => r.blob());
    // Esta línea sirve para extraer «ormDat» de «new FormData()».
    const formData = new FormData();
    // Esta línea sirve para llamar a «formData.append» con «fieldName, blob, name».
    formData.append(fieldName, blob, name);
    // Esta línea sirve para devolver «api.post<T>(path, formData)».
    return api.post<T>(path, formData);
  }

  // Esta línea sirve para extraer «oke» de «useAuthStore.getState().token».
  const token = useAuthStore.getState().token;
  // Esta línea sirve para esperar «uploadAsync(`${resolveApiBaseUrl()}/api/v1${path}`» y guardar el resultado en «result».
  const result = await uploadAsync(`${resolveApiBaseUrl()}/api/v1${path}`, uri, {
    // Esta línea sirve para declarar la propiedad «httpMethod» con el valor o tipo «'POST'».
    httpMethod: 'POST',
    // Esta línea sirve para declarar la propiedad «uploadType» con el valor o tipo «FileSystemUploadType.MULTIPART».
    uploadType: FileSystemUploadType.MULTIPART,
    // Esta línea sirve para incluir el valor «fieldName» en la lista.
    fieldName,
    // Esta línea sirve para incluir los elementos o propiedades de «mimeType ? { mimeType } : {}».
    ...(mimeType ? { mimeType } : {}),
    // Esta línea sirve para declarar la propiedad «headers» con el valor o tipo «{».
    headers: {
      // Esta línea sirve para declarar la propiedad «Accept» con el valor o tipo «'application/json'».
      Accept: 'application/json',
      // Esta línea sirve para incluir los elementos o propiedades de «token ? { Authorization: `Bearer ${token}` } : {}».
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Esta línea sirve para extraer «son: unknow» de «null».
  let json: unknown = null;
  // Esta línea sirve para intentar ejecutar el bloque siguiente.
  try {
    // Esta línea sirve para asignar «result.body ? JSON.parse(result.body) : null» a «json».
    json = result.body ? JSON.parse(result.body) : null;
  // Esta línea sirve para capturar cualquier error del bloque anterior.
  } catch {
    // Esta línea sirve para asignar «null» a «json».
    json = null;
  }

  // Esta línea sirve para revisar si «result.status < 200 || result.status >= 300».
  if (result.status < 200 || result.status >= 300) {
    // Esta línea sirve para llamar a «useAuthStore.getState» si «result.status === 401».
    if (result.status === 401) useAuthStore.getState().clearSessionLocal();
    // 413 = el servidor cortó el archivo por tamaño antes de llegar a Laravel.
    // Esta línea sirve para elegir el mensaje de error según la respuesta.
    const fallback =
      // Esta línea sirve para avisar que el archivo es demasiado pesado si el servidor devolvió 413.
      result.status === 413 ? 'El archivo es demasiado pesado para el servidor.' : `Error ${result.status} al subir el archivo.`;
    // Esta línea sirve para lanzar un error de tipo «ApiError».
    throw new ApiError(result.status, (json as ApiErrorBody | null) ?? { message: fallback });
  }

  // Esta línea sirve para devolver «(json as ApiSuccess<T> | null)?.data as T».
  return (json as ApiSuccess<T> | null)?.data as T;
}
