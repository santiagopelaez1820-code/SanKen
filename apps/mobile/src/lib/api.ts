import { Platform } from 'react-native';
import { ApiClient } from '@sanken/core';
import { useAuthStore } from '@/store/auth-store';

// En nativo (celular con Expo Go) no hay "host de la página" al que
// apuntar, así que ahí EXPO_PUBLIC_API_URL (la IP de LAN de la PC, ver
// scripts/start-sanken.ps1) es imprescindible. En la vista web
// (react-native-web, `expo start --web`) en cambio corre en un navegador
// real igual que apps/web: ahí siempre derivamos del host de la página,
// aunque EXPO_PUBLIC_API_URL esté seteada — si no, "localhost" terminaría
// intentando autoconectarse a la IP de LAN propia, lo que falla por NAT
// hairpin (el mismo bug que rompió el login por Google en apps/web).
function resolveApiBaseUrl(): string {
  if (Platform.OS === 'web') {
    return `http://${window.location.hostname}:8000`;
  }
  return process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';
}

export const api = new ApiClient({
  baseUrl: resolveApiBaseUrl(),
  getToken: () => useAuthStore.getState().token,
  // Un 401 significa que el token guardado ya no es válido en el servidor
  // (revocado, expirado, o apuntando a una fila que ya no existe). Sin
  // esto, una pantalla que dependa de una request que falla por 401 se
  // queda colgada en su loading state en vez de volver al login.
  onUnauthorized: () => useAuthStore.getState().clearSessionLocal(),
});
