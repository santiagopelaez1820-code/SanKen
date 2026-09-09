import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThemeMode = "light" | "dark" | "system"

function systemPrefersDark(): boolean {
  // Si el navegador no soporta la media query (rarísimo hoy), cae a dark --
  // mismo criterio de marca por defecto que mobile (Colors.dark).
  if (typeof window === "undefined" || !window.matchMedia) return true
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

/** Aplica el modo resuelto al <html> -- clase `dark` (Tailwind) + `data-bs-theme` (Bootstrap), mismo elemento que ya leía apps/web/index.html antes de este cambio. Se llama desde el script inline "no-flash" en index.html Y desde React al cambiar de modo o al detectar un cambio del SO en modo 'system'. */
export function applyThemeToDocument(mode: ThemeMode): void {
  const resolved = mode === "system" ? (systemPrefersDark() ? "dark" : "light") : mode
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
  root.setAttribute("data-bs-theme", resolved)
  root.style.colorScheme = resolved
}

interface ThemeStoreState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      // Mismo default que mobile (theme-store.ts ahí): sigue el sistema si
      // está disponible, cae a dark si no -- no forzar dark siempre acá
      // rompería la paridad de comportamiento entre plataformas.
      mode: "system",
      setMode: (mode) => {
        set({ mode })
        applyThemeToDocument(mode)
      },
    }),
    { name: "sanken-theme" }
  )
)
