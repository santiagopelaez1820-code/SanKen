import { ApiClient } from "@sanken/core"
import { useAuthStore } from "@/lib/auth-store"
import { readCookie } from "@/lib/cookies"

// VITE_API_URL es un override explícito (por ejemplo, para apuntar a la URL
// de un túnel). Si no está seteada, la API vive en el mismo host desde el
// que se abrió esta página, puerto 8000 — así "localhost" resuelve a
// "localhost:8000" (evita el problema de NAT hairpin al autoconectarse a la
// propia IP de LAN) y una IP de LAN resuelve a esa misma IP, sin necesidad
// de reescribir el .env cada vez que cambia la red (ver scripts/start-sanken.ps1).
export function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL
  if (configured) return configured
  return `http://${window.location.hostname}:8000`
}

export const api = new ApiClient({
  baseUrl: resolveApiBaseUrl(),
  getToken: () => useAuthStore.getState().token,
  // La SPA web usa el flujo "stateful" de Sanctum (cookies de sesión +
  // CSRF) — ver docs/03-api.md §1. Mobile sigue usando solo el Bearer token.
  withCredentials: true,
  getCsrfToken: () => readCookie("XSRF-TOKEN"),
  // Un 401 significa que la sesión local ya no es válida en el servidor
  // (token/cookie revocado o expirado). Sin esto, una página que dependa
  // de una query que falla por 401 se queda mostrando su loading state para
  // siempre (ver OnboardingPage) en vez de mandar al usuario a /login.
  onUnauthorized: () => useAuthStore.getState().clearSession(),
})
