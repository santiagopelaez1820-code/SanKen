// Esta línea sirve para importar «Pressable, StyleSheet, useColorScheme, View» desde «react-native».
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Colors, Spacing» desde «@/constants/theme».
import { Colors, Spacing } from '@/constants/theme';

// Esta línea sirve para declarar la interfaz «ScaleSelectorProps».
interface ScaleSelectorProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «number | null».
  value: number | null;
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(value: number) => void».
  onChange: (value: number) => void;
  // Esta línea sirve para declarar la propiedad «max» con el valor o tipo «number».
  max?: number;
}

// Esta línea sirve para declarar la función «ScaleSelector».
export function ScaleSelector({ label, value, onChange, max = 5 }: ScaleSelectorProps) {
  // Esta línea sirve para obtener «scheme» con el hook «useColorScheme».
  const scheme = useColorScheme();
  // Esta línea sirve para extraer «olor» de «Colors[scheme === 'unspecified' ? 'dark'».
  const colors = Colors[scheme === 'unspecified' ? 'dark' : (scheme ?? 'dark')];
  // Esta línea sirve para extraer «ption» de «Array.from({ length: max }, (_, i) => i ».
  const options = Array.from({ length: max }, (_, i) => i + 1);

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={styles.container}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary">
        {/* Esta línea sirve para mostrar el valor «label». */}
        {label}
      </ThemedText>
      {/* Esta línea sirve para abrir el componente «View». */}
      <View style={styles.row}>
        {/* Esta línea sirve para recorrer «options» y calcular qué mostrar por elemento. */}
        {options.map((option) => {
          // Esta línea sirve para extraer «electe» de «value === option».
          const selected = value === option;
          // Esta línea sirve para devolver la interfaz del componente.
          return (
            // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
            <Pressable
              // Esta línea sirve para identificar el elemento de la lista con «option}».
              key={option}
              // Esta línea sirve para asignar el manejador del evento «onPress».
              onPress={() => onChange(option)}
              // Esta línea sirve para pasar la propiedad «style» con el valor «[».
              style={[
                // Esta línea sirve para agregar el estilo «styles.dot».
                styles.dot,
                {
                  // Esta línea sirve para definir «backgroundColor» con «selected ? colors.accent : colors.backgr…».
                  backgroundColor: selected ? colors.accent : colors.backgroundElement,
                  // Esta línea sirve para declarar la propiedad «borderColor» con el valor o tipo «selected ? colors.accent : 'transparent'».
                  borderColor: selected ? colors.accent : 'transparent',
                },
              ]}>
              {/* Esta línea sirve para abrir el componente «ThemedText». */}
              <ThemedText type="smallBold" themeColor={selected ? 'background' : 'textSecondary'}>
                {/* Esta línea sirve para mostrar el valor «option». */}
                {option}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{ gap: Spacing.two }».
  container: { gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{ flexDirection: 'row', gap: Spacing.two }».
  row: { flexDirection: 'row', gap: Spacing.two },
  // Esta línea sirve para declarar la propiedad «dot» con el valor o tipo «{».
  dot: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «aspectRatio» con el valor o tipo «1».
    aspectRatio: 1,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «999».
    borderRadius: 999,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1.5».
    borderWidth: 1.5,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
});
