import { forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

// forwardRef: sin esto, un `ref` (p.ej. para medir la posición del elemento
// con measureInWindow, como hace el tutorial guiado) se pierde en silencio
// -- React no lo pasa dentro de `...otherProps`.
export const ThemedView = forwardRef<View, ThemedViewProps>(function ThemedView(
  { style, lightColor, darkColor, type, ...otherProps },
  ref,
) {
  const theme = useTheme();

  return <View ref={ref} style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
});
