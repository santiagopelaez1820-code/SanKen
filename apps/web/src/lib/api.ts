import { ApiClient } from "@sanken/core"
import { useAuthStore } from "@/lib/auth-store"
import { readCookie } from "@/lib/cookies"

export const api = new ApiClient({
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
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
