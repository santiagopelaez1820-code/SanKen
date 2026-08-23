/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  // Respeta el tema del dispositivo si está definido; si no (p. ej. web sin
  // preferencia detectada), el dark premium es la experiencia por defecto
  // de la marca — mismo criterio que apps/web/index.html.
  const theme = scheme === 'unspecified' ? 'dark' : scheme;

  return Colors[theme];
}
