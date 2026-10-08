// Esta línea sirve para importar «Platform, Pressable, StyleSheet, TextInput, View, type TextInputProps» desde «react-native».
import { Platform, Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
// Esta línea sirve para importar «Search, X» desde «lucide-react-native».
import { Search, X } from 'lucide-react-native';

// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «Spacing, Typography» desde «@/constants/theme».
import { Spacing, Typography } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «SearchFieldProps».
interface SearchFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText' | 'style'> {
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «string».
  value: string;
  // Esta línea sirve para declarar la propiedad «onChangeText» con el valor o tipo «(value: string) => void».
  onChangeText: (value: string) => void;
}

/** Campo de búsqueda compacto: lupa + input + botón para limpiar (solo cuando hay texto). */
// Esta línea sirve para declarar la función «SearchField».
export function SearchField({ value, onChangeText, placeholder = 'Buscar…', ...props }: SearchFieldProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={[styles.wrap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      {/* Esta línea sirve para abrir el componente «Icon». */}
      <Icon icon={Search} size={16} color={theme.textSecondary} />
      {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
      <TextInput
        // Esta línea sirve para pasar la propiedad «value» con el valor «value}».
        value={value}
        // Esta línea sirve para asignar el manejador del evento «onChangeText».
        onChangeText={onChangeText}
        // Esta línea sirve para pasar la propiedad «placeholder» con el valor «placeholder}».
        placeholder={placeholder}
        // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «theme.textSecondary}».
        placeholderTextColor={theme.textSecondary}
        // Esta línea sirve para definir el atributo «returnKeyType» con el valor «search».
        returnKeyType="search"
        // Esta línea sirve para pasar la propiedad «autoCorrect» con el valor «false}».
        autoCorrect={false}
        // Esta línea sirve para definir el atributo «autoCapitalize» con el valor «none».
        autoCapitalize="none"
        // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «placeholder}».
        accessibilityLabel={placeholder}
        // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.input, { color: theme.text }]}».
        style={[styles.input, { color: theme.text }]}
        // Esta línea sirve para mostrar el valor «...props».
        {...props}
      />
      {/* Esta línea sirve para mostrar el bloque solo si «value.length > 0». */}
      {value.length > 0 && (
        // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
        <Pressable
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => onChangeText('')}
          // Esta línea sirve para pasar la propiedad «hitSlop» con el valor «10}».
          hitSlop={10}
          // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «button».
          accessibilityRole="button"
          // Esta línea sirve para definir el atributo «accessibilityLabel» con el valor «Limpiar búsqueda».
          accessibilityLabel="Limpiar búsqueda"
          // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.clear, { backgroundColor: theme.backg».
          style={[styles.clear, { backgroundColor: theme.backgroundSelected }]}>
          {/* Esta línea sirve para abrir el componente «Icon». */}
          <Icon icon={X} size={12} color={theme.text} strokeWidth={2.5} />
        </Pressable>
      )}
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «wrap» con el valor o tipo «{».
  wrap: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «minHeight» con el valor o tipo «42».
    minHeight: 42,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «input» con el valor o tipo «{».
  input: {
    // Esta línea sirve para declarar la propiedad «flex» con el valor o tipo «1».
    flex: 1,
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «Typography.body.fontSize».
    fontSize: Typography.body.fontSize,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // En web el <input> dibujaba su propio recuadro de foco dentro de la
    // pastilla; el contenedor ya marca el campo, así que se quita.
    // Esta línea sirve para incluir los elementos o propiedades de «Platform.OS === 'web' ? { outlineWidth: 0 } : null».
    ...(Platform.OS === 'web' ? { outlineWidth: 0 } : null),
  },
  // Esta línea sirve para declarar la propiedad «clear» con el valor o tipo «{».
  clear: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «20».
    width: 20,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «20».
    height: 20,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «10».
    borderRadius: 10,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
});
