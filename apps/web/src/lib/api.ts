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
})
