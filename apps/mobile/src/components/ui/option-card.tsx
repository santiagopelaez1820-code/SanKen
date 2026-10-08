// Esta línea sirve para importar «Pressable, StyleSheet, useColorScheme» desde «react-native».
import { Pressable, StyleSheet, useColorScheme } from 'react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Colors, Spacing» desde «@/constants/theme».
import { Colors, Spacing } from '@/constants/theme';

// Esta línea sirve para declarar la interfaz «OptionCardProps».
interface OptionCardProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «selected» con el valor o tipo «boolean».
  selected: boolean;
  // Esta línea sirve para declarar la propiedad «onPress» con el valor o tipo «() => void».
  onPress: () => void;
}

// Esta línea sirve para declarar la función «OptionCard».
export function OptionCard({ label, selected, onPress }: OptionCardProps) {
  // Esta línea sirve para obtener «scheme» con el hook «useColorScheme».
  const scheme = useColorScheme();
  // Esta línea sirve para extraer «olor» de «Colors[scheme === 'unspecified' ? 'dark'».
  const colors = Colors[scheme === 'unspecified' ? 'dark' : (scheme ?? 'dark')];

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
    <Pressable
      // Esta línea sirve para asignar el manejador del evento «onPress».
      onPress={onPress}
      // Esta línea sirve para pasar la propiedad «style» con el valor «[».
      style={[
        // Esta línea sirve para agregar el estilo «styles.card».
        styles.card,
        {
          // Esta línea sirve para definir «backgroundColor» con «selected ? colors.accent + '1F' : colors…».
          backgroundColor: selected ? colors.accent + '1F' : colors.backgroundElement,
          // Esta línea sirve para declarar la propiedad «borderColor» con el valor o tipo «selected ? colors.accent : 'transparent'».
          borderColor: selected ? colors.accent : 'transparent',
        },
      ]}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="default" themeColor={selected ? 'text' : 'text'}>
        {/* Esta línea sirve para mostrar el valor «label». */}
        {label}
      </ThemedText>
      {/* Esta línea sirve para mostrar el bloque solo si «selected». */}
      {selected && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          {/* Esta línea sirve para mostrar el contenido dinámico «✓». */}
          ✓
        </ThemedText>
      )}
    </Pressable>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «card» con el valor o tipo «{».
  card: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1.5».
    borderWidth: 1.5,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two + 4».
    paddingVertical: Spacing.two + 4,
  },
});
