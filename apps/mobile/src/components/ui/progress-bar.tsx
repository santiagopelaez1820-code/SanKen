// Esta línea sirve para importar «StyleSheet, useColorScheme, View» desde «react-native».
import { StyleSheet, useColorScheme, View } from 'react-native';

// Esta línea sirve para importar «Colors, Spacing» desde «@/constants/theme».
import { Colors, Spacing } from '@/constants/theme';

// Esta línea sirve para declarar la interfaz «ProgressBarProps».
interface ProgressBarProps {
  // Esta línea sirve para declarar la propiedad «current» con el valor o tipo «number».
  current: number;
  // Esta línea sirve para declarar la propiedad «total» con el valor o tipo «number».
  total: number;
}

// Esta línea sirve para declarar la función «ProgressBar».
export function ProgressBar({ current, total }: ProgressBarProps) {
  // Esta línea sirve para obtener «scheme» con el hook «useColorScheme».
  const scheme = useColorScheme();
  // Esta línea sirve para extraer «olor» de «Colors[scheme === 'unspecified' ? 'dark'».
  const colors = Colors[scheme === 'unspecified' ? 'dark' : (scheme ?? 'dark')];
  // Esta línea sirve para extraer «ati» de «total > 0 ? Math.min(current / total, 1)».
  const ratio = total > 0 ? Math.min(current / total, 1) : 0;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={[styles.track, { backgroundColor: colors.backgroundElement }]}>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={[styles.fill, { backgroundColor: colors.accent, width: `${ratio * 100}%` }]} />
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «track» con el valor o tipo «{».
  track: {
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «4».
    height: 4,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «2».
    borderRadius: 2,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
    // Esta línea sirve para declarar la propiedad «marginBottom» con el valor o tipo «Spacing.four».
    marginBottom: Spacing.four,
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'hidden'».
    overflow: 'hidden',
  },
  // Esta línea sirve para declarar la propiedad «fill» con el valor o tipo «{».
  fill: {
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «'100%'».
    height: '100%',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «2».
    borderRadius: 2,
  },
});
