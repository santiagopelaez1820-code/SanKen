// Esta línea sirve para importar «Platform, StyleSheet, Text, type TextProps» desde «react-native».
import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

// Esta línea sirve para importar «Fonts, ThemeColor, Typography» desde «@/constants/theme».
import { Fonts, ThemeColor, Typography } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar el tipo «ThemedTextProps» como «TextProps & {».
export type ThemedTextProps = TextProps & {
  // Esta línea sirve para declarar los tipos de texto disponibles.
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'caption' | 'subtitle' | 'link' | 'linkPrimary' | 'code' | 'stat';
  // Esta línea sirve para declarar la propiedad «themeColor» con el valor o tipo «ThemeColor».
  themeColor?: ThemeColor;
};

// Esta línea sirve para declarar la función «ThemedText».
export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // `linkPrimary` siempre destaca con el acento de marca (cyan) — antes
  // tenía un naranja fijo (`#FF6A00`, resto de la paleta vieja) hardcodeado
  // en `styles.linkPrimary`, que ganaba sobre `themeColor` y no cambiaba
  // entre light/dark. Se resuelve acá para que sí lo haga.
  // Esta línea sirve para extraer «esolvedColo» de «type === 'linkPrimary' ? theme.accent : ».
  const resolvedColor = type === 'linkPrimary' ? theme.accent : theme[themeColor ?? 'text'];

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Text» con sus atributos en varias líneas.
    <Text
      // Esta línea sirve para pasar la propiedad «style» con el valor «[».
      style={[
        // Esta línea sirve para agregar un elemento cuyo «color» es «resolvedColor },…».
        { color: resolvedColor },
        // Esta línea sirve para aplicar el estilo «styles.default» cuando «type» es 'default'.
        type === 'default' && styles.default,
        // Esta línea sirve para aplicar el estilo «styles.title» cuando «type» es 'title'.
        type === 'title' && styles.title,
        // Esta línea sirve para aplicar el estilo «styles.small» cuando «type» es 'small'.
        type === 'small' && styles.small,
        // Esta línea sirve para aplicar el estilo «styles.smallBold» cuando «type» es 'smallBold'.
        type === 'smallBold' && styles.smallBold,
        // Esta línea sirve para aplicar el estilo «styles.caption» cuando «type» es 'caption'.
        type === 'caption' && styles.caption,
        // Esta línea sirve para aplicar el estilo «styles.subtitle» cuando «type» es 'subtitle'.
        type === 'subtitle' && styles.subtitle,
        // Esta línea sirve para aplicar el estilo «styles.link» cuando «type» es 'link'.
        type === 'link' && styles.link,
        // Esta línea sirve para aplicar el estilo «styles.linkPrimary» cuando «type» es 'linkPrimary'.
        type === 'linkPrimary' && styles.linkPrimary,
        // Esta línea sirve para aplicar el estilo «styles.code» cuando «type» es 'code'.
        type === 'code' && styles.code,
        // Esta línea sirve para aplicar el estilo «styles.stat» cuando «type» es 'stat'.
        type === 'stat' && styles.stat,
        // Esta línea sirve para incluir el valor «style» en la lista.
        style,
      ]}
      // Esta línea sirve para mostrar el valor «...rest».
      allowFontScaling={false}
      {...rest}
    />
  );
}

// Los tamaños viven en `Typography` (constants/theme.ts) — una sola escala
// para toda la app; acá solo se combinan con el peso de cada variante.
// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «small» con el valor o tipo «{».
  small: {
    // Esta línea sirve para copiar las propiedades de «Typography».
    ...Typography.small,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «500».
    fontWeight: 500,
  },
  // Esta línea sirve para declarar la propiedad «smallBold» con el valor o tipo «{».
  smallBold: {
    // Esta línea sirve para copiar las propiedades de «Typography».
    ...Typography.small,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «700».
    fontWeight: 700,
  },
  // Esta línea sirve para declarar la propiedad «caption» con el valor o tipo «{».
  caption: {
    // Esta línea sirve para copiar las propiedades de «Typography».
    ...Typography.caption,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «600».
    fontWeight: 600,
  },
  // Esta línea sirve para declarar la propiedad «default» con el valor o tipo «{».
  default: {
    // Esta línea sirve para copiar las propiedades de «Typography».
    ...Typography.body,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «500».
    fontWeight: 500,
  },
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «{».
  title: {
    // Esta línea sirve para copiar las propiedades de «Typography».
    ...Typography.title,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «700».
    fontWeight: 700,
  },
  // Esta línea sirve para declarar la propiedad «subtitle» con el valor o tipo «{».
  subtitle: {
    // Esta línea sirve para copiar las propiedades de «Typography».
    ...Typography.subtitle,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «600».
    fontWeight: 600,
  },
  // Esta línea sirve para declarar la propiedad «link» con el valor o tipo «{».
  link: {
    // Esta línea sirve para copiar las propiedades de «Typography».
    ...Typography.small,
  },
  // Esta línea sirve para declarar la propiedad «linkPrimary» con el valor o tipo «{».
  linkPrimary: {
    // Esta línea sirve para copiar las propiedades de «Typography».
    ...Typography.small,
  },
  // Esta línea sirve para declarar la propiedad «code» con el valor o tipo «{».
  code: {
    // Esta línea sirve para declarar la propiedad «fontFamily» con el valor o tipo «Fonts.mono».
    fontFamily: Fonts.mono,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «Platform.select({ android: 700 }) ?? 500».
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «12».
    fontSize: 12,
  },
  // Números hero (peso/reps/series/volumen) — más grandes y pesados que
  // subtitle, con tabular-nums para que no "salten" de ancho al cambiar de
  // valor mientras se entrena.
  // Esta línea sirve para declarar la propiedad «stat» con el valor o tipo «{».
  stat: {
    // Esta línea sirve para copiar las propiedades de «Typography».
    ...Typography.stat,
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «800».
    fontWeight: 800,
    // Esta línea sirve para declarar la propiedad «fontVariant» con el valor o tipo «['tabular-nums']».
    fontVariant: ['tabular-nums'],
  },
});
