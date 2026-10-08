// Esta línea sirve para importar «ApiClient» desde «@sanken/core».
import { ApiClient } from "@sanken/core"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «readCookie» desde «@/lib/cookies».
import { readCookie } from "@/lib/cookies"

// VITE_API_URL es un override explícito (por ejemplo, para apuntar a la URL
// de un túnel). Si no está seteada, la API vive en el mismo host desde el
// que se abrió esta página, puerto 8000 — así "localhost" resuelve a
// "localhost:8000" (evita el problema de NAT hairpin al autoconectarse a la
// propia IP de LAN) y una IP de LAN resuelve a esa misma IP, sin necesidad
// de reescribir el .env cada vez que cambia la red (ver scripts/start-sanken.ps1).
// Esta línea sirve para declarar la función que resuelve la URL base de la API.
export function resolveApiBaseUrl(): string {
  // Esta línea sirve para declarar «configured» con el valor «import.meta.env.VITE_API_URL».
  const configured = import.meta.env.VITE_API_URL
  // Esta línea sirve para devolver «configured» si «configured».
  if (configured) return configured
  // Esta línea sirve para devolver «`http://${window.location.hostname}:8000`».
  return `http://${window.location.hostname}:8000`
}

// Esta línea sirve para crear el cliente de la API compartido.
export const api = new ApiClient({
  // Esta línea sirve para declarar la propiedad «baseUrl» con el valor o tipo «resolveApiBaseUrl()».
  baseUrl: resolveApiBaseUrl(),
  // Esta línea sirve para declarar la propiedad «getToken» con el valor o tipo «() => useAuthStore.getState().token».
  getToken: () => useAuthStore.getState().token,
  // La SPA web usa el flujo "stateful" de Sanctum (cookies de sesión +
  // CSRF) — ver docs/03-api.md §1. Mobile sigue usando solo el Bearer token.
  // Esta línea sirve para declarar la propiedad «withCredentials» con el valor o tipo «true».
  withCredentials: true,
  // Esta línea sirve para declarar la propiedad «getCsrfToken» con el valor o tipo «() => readCookie("XSRF-TOKEN")».
  getCsrfToken: () => readCookie("XSRF-TOKEN"),
  // Un 401 significa que la sesión local ya no es válida en el servidor
  // (token/cookie revocado o expirado). Sin esto, una página que dependa
  // de una query que falla por 401 se queda mostrando su loading state para
  // siempre (ver OnboardingPage) en vez de mandar al usuario a /login.
  // Esta línea sirve para declarar la propiedad «onUnauthorized» con el valor o tipo «() => useAuthStore.getState().clearSession()».
  onUnauthorized: () => useAuthStore.getState().clearSession(),
  // 403 consent_required (se publicó una versión nueva de un documento en
  // medio de la sesión): se marca en el usuario y LegalConsentGate muestra
  // la re-aceptación de inmediato, sin esperar a refrescar /legal/consents.
  // Esta línea sirve para declarar la propiedad «onConsentRequired» con el valor o tipo «(pending) => {».
  onConsentRequired: (pending) => {
    // Esta línea sirve para extraer «user, setUser» de «useAuthStore.getState()».
    const { user, setUser } = useAuthStore.getState()
    // Esta línea sirve para guardar en el usuario los consentimientos pendientes.
    if (user) setUser({ ...user, pending_consents: pending })
  },
})
