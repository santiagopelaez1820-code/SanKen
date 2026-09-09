/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeStore } from '@/store/theme-store';

/** 'light' | 'dark' ya resuelto — el mismo cálculo que hace useTheme(), pero sin los colores, para quien solo necesita saber qué modo está activo (p. ej. elegir DarkTheme/DefaultTheme del navegador en _layout.tsx). */
export function useResolvedColorScheme(): 'light' | 'dark' {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);

  if (mode === 'light' || mode === 'dark') return mode;

  // mode === 'system' (o todavía no hidrató, que por defecto también es 'system').
  // Respeta el tema del dispositivo si está definido; si no (p. ej. web sin
  // preferencia detectada), el dark premium es la experiencia por defecto
  // de la marca — mismo criterio que apps/web/index.html.
  return systemScheme === 'unspecified' || !systemScheme ? 'dark' : systemScheme;
}

export function useTheme() {
  return Colors[useResolvedColorScheme()];
}
