import { ApiClient } from '@sanken/core';
import { useAuthStore } from '@/store/auth-store';

export const api = new ApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
  getToken: () => useAuthStore.getState().token,
  // Un 401 significa que el token guardado ya no es válido en el servidor
  // (revocado, expirado, o apuntando a una fila que ya no existe). Sin
  // esto, una pantalla que dependa de una request que falla por 401 se
  // queda colgada en su loading state en vez de volver al login.
  onUnauthorized: () => useAuthStore.getState().clearSessionLocal(),
});
