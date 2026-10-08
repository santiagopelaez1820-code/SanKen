// Esta línea sirve para importar «forwardRef» desde «react».
import { forwardRef } from 'react';
// Esta línea sirve para importar «View, type ViewProps» desde «react-native».
import { View, type ViewProps } from 'react-native';

// Esta línea sirve para importar «ThemeColor» desde «@/constants/theme».
import { ThemeColor } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar el tipo «ThemedViewProps» como «ViewProps & {».
export type ThemedViewProps = ViewProps & {
  // Esta línea sirve para declarar la propiedad «lightColor» con el valor o tipo «string».
  lightColor?: string;
  // Esta línea sirve para declarar la propiedad «darkColor» con el valor o tipo «string».
  darkColor?: string;
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «ThemeColor».
  type?: ThemeColor;
};

// forwardRef: sin esto, un `ref` (p.ej. para medir la posición del elemento
// con measureInWindow, como hace el tutorial guiado) se pierde en silencio
// -- React no lo pasa dentro de `...otherProps`.
// Esta línea sirve para declarar la vista temática con referencia reenviada.
export const ThemedView = forwardRef<View, ThemedViewProps>(function ThemedView(
  // Esta línea sirve para recibir el estilo, los colores y el resto de propiedades.
  { style, lightColor, darkColor, type, ...otherProps },
  // Esta línea sirve para incluir el valor «ref» en la lista.
  ref,
// Esta línea sirve para cerrar los parámetros de la función.
) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver una vista con el color de fondo del tema y el estilo recibido.
  return <View ref={ref} style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
});
