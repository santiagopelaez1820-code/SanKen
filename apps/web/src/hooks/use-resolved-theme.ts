import { useEffect, useState } from "react"
import { useThemeStore } from "@/lib/theme-store"

function systemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

/**
 * 'light' | 'dark' ya resuelto, reactivo a cambios de preferencia del SO
 * cuando el modo es 'system'. Para el CSS (clases, var(--sanken-*)) no hace
 * falta esto -- ya reacciona solo al atributo data-bs-theme/clase `dark` del
 * <html>. Existe para lo poco que no puede leer CSS en runtime: los props
 * de color de Recharts (fill/stroke de ejes, grillas, líneas) en
 * MuscleVolumeChart/ProgressChart.
 */
export function useResolvedTheme(): "light" | "dark" {
  const mode = useThemeStore((s) => s.mode)
  const [systemDark, setSystemDark] = useState(systemPrefersDark)

  useEffect(() => {
    if (mode !== "system" || typeof window === "undefined" || !window.matchMedia) return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setSystemDark(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [mode])

  if (mode === "light" || mode === "dark") return mode
  return systemDark ? "dark" : "light"
}
