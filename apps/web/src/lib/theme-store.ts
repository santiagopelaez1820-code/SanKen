// Esta línea sirve para importar «create» desde «zustand».
import { create } from "zustand"
// Esta línea sirve para importar «createJSONStorage, persist» desde «zustand/middleware».
import { createJSONStorage, persist } from "zustand/middleware"
// Esta línea sirve para importar «preferenceStorage» desde «@/lib/preference-storage».
import { preferenceStorage } from "@/lib/preference-storage"

// Esta línea sirve para declarar el tipo «ThemeMode» como «"light" | "dark" | "system"».
export type ThemeMode = "light" | "dark" | "system"

// Esta línea sirve para declarar la función «systemPrefersDark».
function systemPrefersDark(): boolean {
  // Si el navegador no soporta la media query (rarísimo hoy), cae a dark --
  // mismo criterio de marca por defecto que mobile (Colors.dark).
  // Esta línea sirve para devolver tema oscuro si no hay ventana o no se puede consultar el sistema.
  if (typeof window === "undefined" || !window.matchMedia) return true
  // Esta línea sirve para devolver si el sistema prefiere el tema oscuro.
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

/** Aplica el modo resuelto al <html> -- clase `dark` (Tailwind) + `data-bs-theme` (Bootstrap), mismo elemento que ya leía apps/web/index.html antes de este cambio. Se llama desde el script inline "no-flash" en index.html Y desde React al cambiar de modo o al detectar un cambio del SO en modo 'system'. */
// Esta línea sirve para declarar la función «applyThemeToDocument».
export function applyThemeToDocument(mode: ThemeMode): void {
  // Esta línea sirve para extraer «esolve» de «mode === "system" ? (systemPrefersDark()».
  const resolved = mode === "system" ? (systemPrefersDark() ? "dark" : "light") : mode
  // Esta línea sirve para extraer «oo» de «document.documentElement».
  const root = document.documentElement
  // Esta línea sirve para llamar a «root.classList.toggle» con «"dark", resolved === "dark"».
  root.classList.toggle("dark", resolved === "dark")
  // Esta línea sirve para llamar a «root.setAttribute» con «"data-bs-theme", resolved».
  root.setAttribute("data-bs-theme", resolved)
  // Esta línea sirve para asignar «resolved» a «root.style.colorScheme».
  root.style.colorScheme = resolved
}

// Esta línea sirve para declarar la interfaz «ThemeStoreState».
interface ThemeStoreState {
  // Esta línea sirve para declarar la propiedad «mode» con el valor o tipo «ThemeMode».
  mode: ThemeMode
  // Esta línea sirve para declarar la propiedad «setMode» con el valor o tipo «(mode: ThemeMode) => void».
  setMode: (mode: ThemeMode) => void
}

// Esta línea sirve para declarar «useThemeStore» con el valor «create<ThemeStoreState>()(».
export const useThemeStore = create<ThemeStoreState>()(
  // Esta línea sirve para envolver el store con la persistencia.
  persist(
    // Esta línea sirve para declarar el estado inicial y las acciones.
    (set) => ({
      // Mismo default que mobile (theme-store.ts ahí): sigue el sistema si
      // está disponible, cae a dark si no -- no forzar dark siempre acá
      // rompería la paridad de comportamiento entre plataformas.
      // Esta línea sirve para declarar la propiedad «mode» con el valor o tipo «"system"».
      mode: "system",
      // Esta línea sirve para declarar la propiedad «setMode» con el valor o tipo «(mode) => {».
      setMode: (mode) => {
        // Esta línea sirve para llamar a «set» con «{ mode }».
        set({ mode })
        // Esta línea sirve para llamar a «applyThemeToDocument» con «mode».
        applyThemeToDocument(mode)
      },
    }),
    // Cookie de "Preferencias" (ver Política de Cookies): sin consentimiento
    // el modo elegido vale solo durante la visita.
    // Esta línea sirve para configurar el nombre y el almacenamiento de la preferencia.
    { name: "sanken-theme", storage: createJSONStorage(() => preferenceStorage) }
  )
)
