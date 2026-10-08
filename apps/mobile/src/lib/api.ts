// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';
// Esta línea sirve para importar «ApiClient» desde «@sanken/core».
import { ApiClient } from '@sanken/core';
// Esta línea sirve para importar «useAuthStore» desde «@/store/auth-store».
import { useAuthStore } from '@/store/auth-store';

// En nativo (celular con Expo Go) no hay "host de la página" al que
// apuntar, así que ahí EXPO_PUBLIC_API_URL (la IP de LAN de la PC, ver
// scripts/start-sanken.ps1) es imprescindible. En la vista web
// (react-native-web, `expo start --web`) en cambio corre en un navegador
// real igual que apps/web: ahí siempre derivamos del host de la página,
// aunque EXPO_PUBLIC_API_URL esté seteada — si no, "localhost" terminaría
// intentando autoconectarse a la IP de LAN propia, lo que falla por NAT
// hairpin (el mismo bug que rompió el login por Google en apps/web).
// Esta línea sirve para declarar la función «resolveApiBaseUrl».
export function resolveApiBaseUrl(): string {
  // Esta línea sirve para revisar si «Platform.OS === 'web'».
  if (Platform.OS === 'web') {
    // Durante el prerender estático de `expo export` (output: "static")
    // este módulo corre en Node, donde no existe `window` — antes eso
    // rompía el export web entero. En el navegador real sigue usando el
    // host de la página.
    // Esta línea sirve para extraer «os» de «typeof window !== 'undefined' ? window.l».
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    // Esta línea sirve para devolver «`http://${host}:8000`».
    return `http://${host}:8000`;
  }
  // Esta línea sirve para devolver la URL de la API del entorno o la local por defecto.
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';
}

// Esta línea sirve para declarar «api» con el valor «new ApiClient({».
export const api = new ApiClient({
  // Esta línea sirve para declarar la propiedad «baseUrl» con el valor o tipo «resolveApiBaseUrl()».
  baseUrl: resolveApiBaseUrl(),
  // Esta línea sirve para declarar la propiedad «getToken» con el valor o tipo «() => useAuthStore.getState().token».
  getToken: () => useAuthStore.getState().token,
  // Un 401 significa que el token guardado ya no es válido en el servidor
  // (revocado, expirado, o apuntando a una fila que ya no existe). Sin
  // esto, una pantalla que dependa de una request que falla por 401 se
  // queda colgada en su loading state en vez de volver al login.
  // Esta línea sirve para definir «onUnauthorized» con «() => useAuthStore.getState().clearSessi…».
  onUnauthorized: () => useAuthStore.getState().clearSessionLocal(),
  // 403 consent_required (versión nueva de un documento publicada en medio
  // de la sesión): se marca en el usuario y LegalConsentGuard (layout raíz)
  // manda a /legal/aceptar desde cualquier pantalla.
  // Esta línea sirve para definir «onConsentRequired» con «(pending) => useAuthStore.getState().mar…».
  onConsentRequired: (pending) => useAuthStore.getState().markPendingConsents(pending),
});
