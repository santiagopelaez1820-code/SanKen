/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Paleta de marca SANKEN — "Power Ascend": negro + lima + cyan.
// accent (lima) = progreso/positivo/CTAs; accentSecondary (cyan) = entrenamiento/actividad.
export const Colors = {
  light: {
    text: '#0A0A0A',
    background: '#FAFAFA',
    backgroundElement: '#F0F0F0',
    backgroundSelected: '#E5E5E5',
    textSecondary: '#6B6B6B',
    accent: '#CFFF36',
    accentSecondary: '#0EA5C4',
    border: 'rgba(0, 0, 0, 0.10)',
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
  },
  dark: {
    text: '#FAFAFA',
    background: '#0A0A0A',
    backgroundElement: '#161616',
    backgroundSelected: '#242424',
    textSecondary: '#A3A3A3',
    accent: '#CFFF36',
    accentSecondary: '#20EAFF',
    border: 'rgba(255, 255, 255, 0.10)',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/** Sombra real para cards protagonistas, en vez de depender solo del contraste de fondo. */
export const CardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.35,
  shadowRadius: 14,
  elevation: 6,
} as const;

/**
 * Glow de color (lima/cyan) para el borde de una card destacada -- usar con
 * moderación. Solo iOS: `shadowColor` con un color (no negro) combinado con
 * `elevation` en Android no se ve como un glow suave, sale como un borde
 * sólido del color -- Android se queda solo con el tinte de borde que cada
 * pantalla ya pone inline, sin sombra extra.
 */
export function glowShadow(color: string) {
  if (Platform.OS === 'android') return {} as const;
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  } as const;
}
