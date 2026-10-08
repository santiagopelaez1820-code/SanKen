/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Esta línea sirve para importar los efectos secundarios de «@/global.css».
import '@/global.css';

// Esta línea sirve para importar «Platform» desde «react-native».
import { Platform } from 'react-native';

// Paleta de marca SANKEN mobile — "Dark Performance": negro azulado profundo
// + cian como acento único de identidad. NO es la misma paleta que la web
// (esa quedó negro+naranja): mobile pidió explícitamente abandonar
// negro+dorado/naranja por esta nueva base. El cian se usa con moderación:
// nunca como fondo extenso, solo CTAs, progreso, logros y detalles de marca.
// Esta línea sirve para declarar «Colors» con el valor «{».
export const Colors = {
  // Esta línea sirve para declarar la propiedad «light» con el valor o tipo «{».
  light: {
    // Esta línea sirve para declarar la propiedad «text» con el valor o tipo «'#0B0B0B'».
    text: '#0B0B0B',
    // Esta línea sirve para declarar la propiedad «background» con el valor o tipo «'#F5F7FA'».
    background: '#F5F7FA',
    // Esta línea sirve para declarar la propiedad «backgroundElement» con el valor o tipo «'#E9EDF1'».
    backgroundElement: '#E9EDF1',
    // Esta línea sirve para declarar la propiedad «backgroundSelected» con el valor o tipo «'#DCE3E9'».
    backgroundSelected: '#DCE3E9',
    // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «'#FFFFFF'».
    card: '#FFFFFF',
    // Esta línea sirve para declarar la propiedad «cardElevated» con el valor o tipo «'#FFFFFF'».
    cardElevated: '#FFFFFF',
    // Esta línea sirve para declarar la propiedad «textSecondary» con el valor o tipo «'#5B6670'».
    textSecondary: '#5B6670',
    // Esta línea sirve para declarar la propiedad «accent» con el valor o tipo «'#0093AD'».
    accent: '#0093AD',
    // Esta línea sirve para declarar la propiedad «accentSecondary» con el valor o tipo «'#00B8D9'».
    accentSecondary: '#00B8D9',
    // Esta línea sirve para declarar la propiedad «border» con el valor o tipo «'rgba(0, 0, 0, 0.10)'».
    border: 'rgba(0, 0, 0, 0.10)',
    // Esta línea sirve para declarar la propiedad «success» con el valor o tipo «'#1CA97F'».
    success: '#1CA97F',
    // Esta línea sirve para declarar la propiedad «warning» con el valor o tipo «'#C97F0E'».
    warning: '#C97F0E',
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «'#E23C4C'».
    error: '#E23C4C',
  },
  // Esta línea sirve para declarar la propiedad «dark» con el valor o tipo «{».
  dark: {
    // Esta línea sirve para declarar la propiedad «text» con el valor o tipo «'#F5F7FA'».
    text: '#F5F7FA',
    // Esta línea sirve para declarar la propiedad «background» con el valor o tipo «'#080C10'».
    background: '#080C10',
    // Esta línea sirve para declarar la propiedad «backgroundElement» con el valor o tipo «'#111820'».
    backgroundElement: '#111820',
    // Esta línea sirve para declarar la propiedad «backgroundSelected» con el valor o tipo «'#1D2732'».
    backgroundSelected: '#1D2732',
    // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «'#151D26'».
    card: '#151D26',
    // Esta línea sirve para declarar la propiedad «cardElevated» con el valor o tipo «'#1D2732'».
    cardElevated: '#1D2732',
    // Esta línea sirve para declarar la propiedad «textSecondary» con el valor o tipo «'#9AA6B2'».
    textSecondary: '#9AA6B2',
    // Esta línea sirve para declarar la propiedad «accent» con el valor o tipo «'#00B8D9'».
    accent: '#00B8D9',
    // Esta línea sirve para declarar la propiedad «accentSecondary» con el valor o tipo «'#00D4FF'».
    accentSecondary: '#00D4FF',
    // Esta línea sirve para declarar la propiedad «border» con el valor o tipo «'rgba(255, 255, 255, 0.10)'».
    border: 'rgba(255, 255, 255, 0.10)',
    // Esta línea sirve para declarar la propiedad «success» con el valor o tipo «'#20C997'».
    success: '#20C997',
    // Esta línea sirve para declarar la propiedad «warning» con el valor o tipo «'#FFB020'».
    warning: '#FFB020',
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «'#FF4D5E'».
    error: '#FF4D5E',
  },
// Esta línea sirve para cerrar la paleta como constante de solo lectura.
} as const;

// Esta línea sirve para declarar el tipo «ThemeColor» como «keyof typeof Colors.light & keyof typeof Colors.dark».
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Esta línea sirve para declarar «Fonts» con el valor «Platform.select({».
export const Fonts = Platform.select({
  // Esta línea sirve para declarar la propiedad «ios» con el valor o tipo «{».
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    // Esta línea sirve para declarar la propiedad «sans» con el valor o tipo «'system-ui'».
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    // Esta línea sirve para declarar la propiedad «serif» con el valor o tipo «'ui-serif'».
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    // Esta línea sirve para declarar la propiedad «rounded» con el valor o tipo «'ui-rounded'».
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    // Esta línea sirve para declarar la propiedad «mono» con el valor o tipo «'ui-monospace'».
    mono: 'ui-monospace',
  },
  // Esta línea sirve para declarar la propiedad «default» con el valor o tipo «{».
  default: {
    // Esta línea sirve para declarar la propiedad «sans» con el valor o tipo «'normal'».
    sans: 'normal',
    // Esta línea sirve para declarar la propiedad «serif» con el valor o tipo «'serif'».
    serif: 'serif',
    // Esta línea sirve para declarar la propiedad «rounded» con el valor o tipo «'normal'».
    rounded: 'normal',
    // Esta línea sirve para declarar la propiedad «mono» con el valor o tipo «'monospace'».
    mono: 'monospace',
  },
  // Esta línea sirve para declarar la propiedad «web» con el valor o tipo «{».
  web: {
    // Esta línea sirve para declarar la propiedad «sans» con el valor o tipo «'var(--font-display)'».
    sans: 'var(--font-display)',
    // Esta línea sirve para declarar la propiedad «serif» con el valor o tipo «'var(--font-serif)'».
    serif: 'var(--font-serif)',
    // Esta línea sirve para declarar la propiedad «rounded» con el valor o tipo «'var(--font-rounded)'».
    rounded: 'var(--font-rounded)',
    // Esta línea sirve para declarar la propiedad «mono» con el valor o tipo «'var(--font-mono)'».
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
// Esta línea sirve para declarar «Spacing» con el valor «{».
export const Spacing = {
  // Esta línea sirve para declarar la propiedad «half» con el valor o tipo «2».
  half: 2,
  // Esta línea sirve para declarar la propiedad «one» con el valor o tipo «4».
  one: 4,
  // Esta línea sirve para declarar la propiedad «two» con el valor o tipo «8».
  two: 8,
  // Esta línea sirve para declarar la propiedad «three» con el valor o tipo «14».
  three: 14,
  // Esta línea sirve para declarar la propiedad «four» con el valor o tipo «20».
  four: 20,
  // Esta línea sirve para declarar la propiedad «five» con el valor o tipo «28».
  five: 28,
  // Esta línea sirve para declarar la propiedad «six» con el valor o tipo «48».
  six: 48,
// Esta línea sirve para cerrar la paleta como constante de solo lectura.
} as const;

/**
 * Escala tipográfica única de la app — `ThemedText` la consume por `type`.
 * Cada nivel conserva una diferencia clara con el siguiente (jerarquía),
 * y siempre con su `lineHeight` propio: antes varias pantallas bajaban el
 * `fontSize` de `title`/`subtitle` pero heredaban el lineHeight 52/44
 * original, que era la mayor fuente de altura "vacía" en cards y headers.
 */
// Esta línea sirve para declarar «Typography» con el valor «{».
export const Typography = {
  /** Título de pantalla / diálogo. */
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{ fontSize: 24, lineHeight: 30 }».
  title: { fontSize: 24, lineHeight: 30 },
  /** Título de sección o pregunta. */
  // Esta línea sirve para declarar la propiedad «subtitle» con el valor o tipo «{ fontSize: 19, lineHeight: 25 }».
  subtitle: { fontSize: 19, lineHeight: 25 },
  /** Cuerpo. */
  // Esta línea sirve para declarar la propiedad «body» con el valor o tipo «{ fontSize: 15, lineHeight: 21 }».
  body: { fontSize: 15, lineHeight: 21 },
  /** Texto secundario, labels, botones. */
  // Esta línea sirve para declarar la propiedad «small» con el valor o tipo «{ fontSize: 13, lineHeight: 18 }».
  small: { fontSize: 13, lineHeight: 18 },
  /** Captions, badges, eyebrows. */
  // Esta línea sirve para declarar la propiedad «caption» con el valor o tipo «{ fontSize: 11, lineHeight: 14 }».
  caption: { fontSize: 11, lineHeight: 14 },
  /** Número KPI/hero. */
  // Esta línea sirve para declarar la propiedad «stat» con el valor o tipo «{ fontSize: 32, lineHeight: 36 }».
  stat: { fontSize: 32, lineHeight: 36 },
// Esta línea sirve para cerrar la lista como constante de solo lectura.
} as const;

// Esta línea sirve para declarar «BottomTabInset» con el valor «Platform.select({ ios: 50, android: 80 }) ?? 0».
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
// Esta línea sirve para declarar «MaxContentWidth» con el valor «800».
export const MaxContentWidth = 800;
/** Ancho máximo de formularios de auth/onboarding — en tablet/web no se estiran a 800px. */
// Esta línea sirve para declarar «FormMaxWidth» con el valor «420».
export const FormMaxWidth = 420;

/** Sombra real para cards protagonistas, en vez de depender solo del contraste de fondo. */
// Esta línea sirve para declarar «CardShadow» con el valor «{».
export const CardShadow = {
  // Esta línea sirve para declarar la propiedad «shadowColor» con el valor o tipo «'#000'».
  shadowColor: '#000',
  // Esta línea sirve para declarar la propiedad «shadowOffset» con el valor o tipo «{ width: 0, height: 4 }».
  shadowOffset: { width: 0, height: 4 },
  // Esta línea sirve para declarar la propiedad «shadowOpacity» con el valor o tipo «0.35».
  shadowOpacity: 0.35,
  // Esta línea sirve para declarar la propiedad «shadowRadius» con el valor o tipo «14».
  shadowRadius: 14,
  // Esta línea sirve para declarar la propiedad «elevation» con el valor o tipo «6».
  elevation: 6,
// Esta línea sirve para cerrar la lista como constante de solo lectura.
} as const;

/**
 * Glow de color (lima/cyan) para el borde de una card destacada -- usar con
 * moderación. Solo iOS: `shadowColor` con un color (no negro) combinado con
 * `elevation` en Android no se ve como un glow suave, sale como un borde
 * sólido del color -- Android se queda solo con el tinte de borde que cada
 * pantalla ya pone inline, sin sombra extra.
 */
// Esta línea sirve para declarar la función «glowShadow».
export function glowShadow(color: string) {
  // Esta línea sirve para devolver «{} as const» si «Platform.OS === 'android'».
  if (Platform.OS === 'android') return {} as const;
  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «shadowColor» con el valor o tipo «color».
    shadowColor: color,
    // Esta línea sirve para declarar la propiedad «shadowOffset» con el valor o tipo «{ width: 0, height: 0 }».
    shadowOffset: { width: 0, height: 0 },
    // Esta línea sirve para declarar la propiedad «shadowOpacity» con el valor o tipo «0.35».
    shadowOpacity: 0.35,
    // Esta línea sirve para declarar la propiedad «shadowRadius» con el valor o tipo «16».
    shadowRadius: 16,
  // Esta línea sirve para cerrar el objeto como constante de solo lectura.
  } as const;
}
