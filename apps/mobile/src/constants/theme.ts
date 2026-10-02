/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Paleta de marca SANKEN mobile — "Dark Performance": negro azulado profundo
// + cian como acento único de identidad. NO es la misma paleta que la web
// (esa quedó negro+naranja): mobile pidió explícitamente abandonar
// negro+dorado/naranja por esta nueva base. El cian se usa con moderación:
// nunca como fondo extenso, solo CTAs, progreso, logros y detalles de marca.
export const Colors = {
  light: {
    text: '#0B0B0B',
    background: '#F5F7FA',
    backgroundElement: '#E9EDF1',
    backgroundSelected: '#DCE3E9',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    textSecondary: '#5B6670',
    accent: '#0093AD',
    accentSecondary: '#00B8D9',
    border: 'rgba(0, 0, 0, 0.10)',
    success: '#1CA97F',
    warning: '#C97F0E',
    error: '#E23C4C',
  },
  dark: {
    text: '#F5F7FA',
    background: '#080C10',
    backgroundElement: '#111820',
    backgroundSelected: '#1D2732',
    card: '#151D26',
    cardElevated: '#1D2732',
    textSecondary: '#9AA6B2',
    accent: '#00B8D9',
    accentSecondary: '#00D4FF',
    border: 'rgba(255, 255, 255, 0.10)',
    success: '#20C997',
    warning: '#FFB020',
    error: '#FF4D5E',
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

/**
 * Escala de espaciado "compacta" (SanKen 2.0): three/four/five bajaron de
 * 16/24/32 a 14/20/28 para aprovechar mejor la altura en todas las
 * pantallas a la vez — mismo sistema, misma proporción entre niveles, sin
 * tocar cada padding a mano. `one`/`two` no cambian: son los mínimos
 * táctiles/de respiración y bajarlos se sentía apretado.
 */
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 14,
  four: 20,
  five: 28,
  six: 48,
} as const;

/**
 * Escala tipográfica única de la app — `ThemedText` la consume por `type`.
 * Cada nivel conserva una diferencia clara con el siguiente (jerarquía),
 * y siempre con su `lineHeight` propio: antes varias pantallas bajaban el
 * `fontSize` de `title`/`subtitle` pero heredaban el lineHeight 52/44
 * original, que era la mayor fuente de altura "vacía" en cards y headers.
 */
export const Typography = {
  /** Título de pantalla / diálogo. */
  title: { fontSize: 24, lineHeight: 30 },
  /** Título de sección o pregunta. */
  subtitle: { fontSize: 19, lineHeight: 25 },
  /** Cuerpo. */
  body: { fontSize: 15, lineHeight: 21 },
  /** Texto secundario, labels, botones. */
  small: { fontSize: 13, lineHeight: 18 },
  /** Captions, badges, eyebrows. */
  caption: { fontSize: 11, lineHeight: 14 },
  /** Número KPI/hero. */
  stat: { fontSize: 32, lineHeight: 36 },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
/** Ancho máximo de formularios de auth/onboarding — en tablet/web no se estiran a 800px. */
export const FormMaxWidth = 420;

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
