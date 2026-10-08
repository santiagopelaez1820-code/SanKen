// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from "react"
// Esta línea sirve para importar «useThemeStore» desde «@/lib/theme-store».
import { useThemeStore } from "@/lib/theme-store"

// Esta línea sirve para declarar la función que indica si el sistema prefiere el tema oscuro.
function systemPrefersDark(): boolean {
  // Esta línea sirve para asumir tema oscuro si no hay ventana o no se puede consultar.
  if (typeof window === "undefined" || !window.matchMedia) return true
  // Esta línea sirve para devolver si el sistema usa tema oscuro.
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
// Esta línea sirve para declarar el hook que devuelve el tema claro u oscuro efectivo.
export function useResolvedTheme(): "light" | "dark" {
  // Esta línea sirve para declarar «mode» con el valor «useThemeStore((s) => s.mode)».
  const mode = useThemeStore((s) => s.mode)
  // Esta línea sirve para guardar si el sistema prefiere el tema oscuro.
  const [systemDark, setSystemDark] = useState(systemPrefersDark)

  // Esta línea sirve para declarar el efecto que escucha cambios del sistema.
  useEffect(() => {
    // Esta línea sirve para salir si el modo no es «system» o no se puede consultar el sistema.
    if (mode !== "system" || typeof window === "undefined" || !window.matchMedia) return
    // Esta línea sirve para declarar «media» con el valor «window.matchMedia("(prefers-color-scheme: dark)")».
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    // Esta línea sirve para declarar «onChange» con el valor «() => setSystemDark(media.matches)».
    const onChange = () => setSystemDark(media.matches)
    // Esta línea sirve para llamar a «media.addEventListener» con «"change", onChange».
    media.addEventListener("change", onChange)
    // Esta línea sirve para devolver la función que deja de escuchar los cambios.
    return () => media.removeEventListener("change", onChange)
  // Esta línea sirve para volver a ejecutar el efecto cuando cambia el modo.
  }, [mode])

  // Esta línea sirve para devolver «mode» si «mode === "light" || mode === "dark"».
  if (mode === "light" || mode === "dark") return mode
  // Esta línea sirve para devolver «systemDark ? "dark" : "light"».
  return systemDark ? "dark" : "light"
}
