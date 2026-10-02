import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'caption' | 'subtitle' | 'link' | 'linkPrimary' | 'code' | 'stat';
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
        type === 'caption' && styles.caption,
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

// Los tamaños viven en `Typography` (constants/theme.ts) — una sola escala
// para toda la app; acá solo se combinan con el peso de cada variante.
const styles = StyleSheet.create({
  small: {
    ...Typography.small,
    fontWeight: 500,
  },
  smallBold: {
    ...Typography.small,
    fontWeight: 700,
  },
  caption: {
    ...Typography.caption,
    fontWeight: 600,
  },
  default: {
    ...Typography.body,
    fontWeight: 500,
  },
  title: {
    ...Typography.title,
    fontWeight: 700,
  },
  subtitle: {
    ...Typography.subtitle,
    fontWeight: 600,
  },
  link: {
    ...Typography.small,
  },
  linkPrimary: {
    ...Typography.small,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
  // Números hero (peso/reps/series/volumen) — más grandes y pesados que
  // subtitle, con tabular-nums para que no "salten" de ancho al cambiar de
  // valor mientras se entrena.
  stat: {
    ...Typography.stat,
    fontWeight: 800,
    fontVariant: ['tabular-nums'],
  },
});
