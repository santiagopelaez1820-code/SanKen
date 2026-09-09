import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code' | 'stat';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  // `linkPrimary` siempre destaca con el acento de marca (cyan) — antes
  // tenía un naranja fijo (`#FF6A00`, resto de la paleta vieja) hardcodeado
  // en `styles.linkPrimary`, que ganaba sobre `themeColor` y no cambiaba
  // entre light/dark. Se resuelve acá para que sí lo haga.
  const resolvedColor = type === 'linkPrimary' ? theme.accent : theme[themeColor ?? 'text'];

  return (
    <Text
      style={[
        { color: resolvedColor },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        type === 'stat' && styles.stat,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
  // Números hero (peso/reps/series/volumen) — mucho más grandes y pesados
  // que subtitle, con tabular-nums para que no "salten" de ancho al cambiar
  // de valor mientras se entrena.
  stat: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: 800,
    fontVariant: ['tabular-nums'],
  },
});
