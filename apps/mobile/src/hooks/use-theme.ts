/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

// Esta línea sirve para importar «Colors» desde «@/constants/theme».
import { Colors } from '@/constants/theme';
// Esta línea sirve para importar «useColorScheme» desde «@/hooks/use-color-scheme».
import { useColorScheme } from '@/hooks/use-color-scheme';
// Esta línea sirve para importar «useThemeStore» desde «@/store/theme-store».
import { useThemeStore } from '@/store/theme-store';

/** 'light' | 'dark' ya resuelto — el mismo cálculo que hace useTheme(), pero sin los colores, para quien solo necesita saber qué modo está activo (p. ej. elegir DarkTheme/DefaultTheme del navegador en _layout.tsx). */
// Esta línea sirve para declarar la función «useResolvedColorScheme».
export function useResolvedColorScheme(): 'light' | 'dark' {
  // Esta línea sirve para extraer «ystemSchem» de «useColorScheme()».
  const systemScheme = useColorScheme();
  // Esta línea sirve para extraer «od» de «useThemeStore((s) => s.mode)».
  const mode = useThemeStore((s) => s.mode);

  // Esta línea sirve para devolver «mode» si «mode === 'light' || mode === 'dark'».
  if (mode === 'light' || mode === 'dark') return mode;

  // mode === 'system' (o todavía no hidrató, que por defecto también es 'system').
  // Respeta el tema del dispositivo si está definido; si no (p. ej. web sin
  // preferencia detectada), el dark premium es la experiencia por defecto
  // de la marca — mismo criterio que apps/web/index.html.
  // Esta línea sirve para devolver el tema oscuro si el sistema no define esquema.
  return systemScheme === 'unspecified' || !systemScheme ? 'dark' : systemScheme;
}

// Esta línea sirve para declarar la función «useTheme».
export function useTheme() {
  // Esta línea sirve para devolver «Colors[useResolvedColorScheme()]».
  return Colors[useResolvedColorScheme()];
}
