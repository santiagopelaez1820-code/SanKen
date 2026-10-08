// Esta línea sirve para importar «useState» desde «react».
import { useState } from 'react';
// Esta línea sirve para importar «Pressable, StyleSheet, TextInput, type TextInputProps, useColorScheme, View» desde «react-native».
import { Pressable, StyleSheet, TextInput, type TextInputProps, useColorScheme, View } from 'react-native';
// Esta línea sirve para importar «Eye, EyeOff» desde «lucide-react-native».
import { Eye, EyeOff } from 'lucide-react-native';

// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Colors, Spacing» desde «@/constants/theme».
import { Colors, Spacing } from '@/constants/theme';

// Esta línea sirve para declarar la interfaz «TextFieldProps».
interface TextFieldProps extends TextInputProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
}

// Esta línea sirve para declarar la función «TextField».
export function TextField({ label, style, secureTextEntry, ...props }: TextFieldProps) {
  // Esta línea sirve para obtener «scheme» con el hook «useColorScheme».
  const scheme = useColorScheme();
  // Esta línea sirve para extraer «olor» de «Colors[scheme === 'unspecified' ? 'dark'».
  const colors = Colors[scheme === 'unspecified' ? 'dark' : (scheme ?? 'dark')];
  // Esta línea sirve para crear el estado «isVisible» y su función «setIsVisible».
  const [isVisible, setIsVisible] = useState(false);
  // Esta línea sirve para extraer «sPasswordFiel» de «secureTextEntry === true».
  const isPasswordField = secureTextEntry === true;

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
      <View style={styles.inputWrap}>
        {/* Esta línea sirve para abrir el elemento «TextInput» con sus atributos en varias líneas. */}
        <TextInput
          // Esta línea sirve para pasar la propiedad «placeholderTextColor» con el valor «colors.textSecondary}».
          placeholderTextColor={colors.textSecondary}
          // Esta línea sirve para pasar la propiedad «secureTextEntry» con el valor «isPasswordField && !isVisible}».
          secureTextEntry={isPasswordField && !isVisible}
          // Esta línea sirve para pasar la propiedad «style» con el valor «[».
          style={[
            // Esta línea sirve para agregar el estilo «styles.input».
            styles.input,
            // Esta línea sirve para agregar un elemento cuyo «color» es «colors.text, backgroundColor: colors.bac…».
            { color: colors.text, backgroundColor: colors.backgroundElement, borderColor: colors.backgroundSelected },
            // Esta línea sirve para reservar espacio para el botón de mostrar la contraseña.
            isPasswordField && styles.inputWithToggle,
            // Esta línea sirve para incluir el valor «style» en la lista.
            style,
          ]}
          // Esta línea sirve para mostrar el valor «...props».
          {...props}
        />
        {/* Esta línea sirve para mostrar el bloque solo si «isPasswordField». */}
        {isPasswordField && (
          // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
          <Pressable
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => setIsVisible((v) => !v)}
            // Esta línea sirve para pasar la propiedad «hitSlop» con el valor «8}».
            hitSlop={8}
            // Esta línea sirve para pasar la propiedad «style» con el valor «styles.toggle}».
            style={styles.toggle}
            // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «isVisible ? 'Ocultar contraseña' : 'Mostrar c».
            accessibilityLabel={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            {/* Esta línea sirve para abrir el componente «Icon». */}
            <Icon icon={isVisible ? EyeOff : Eye} size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.one».
    gap: Spacing.one,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
  },
  // Esta línea sirve para declarar la propiedad «inputWrap» con el valor o tipo «{».
  inputWrap: {
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «input» con el valor o tipo «{».
  input: {
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two + 3».
    paddingVertical: Spacing.two + 3,
    // Esta línea sirve para declarar la propiedad «fontSize» con el valor o tipo «15».
    fontSize: 15,
  },
  // Esta línea sirve para declarar la propiedad «inputWithToggle» con el valor o tipo «{».
  inputWithToggle: {
    // Esta línea sirve para declarar la propiedad «paddingRight» con el valor o tipo «Spacing.three * 2 + 18».
    paddingRight: Spacing.three * 2 + 18,
  },
  // Esta línea sirve para declarar la propiedad «toggle» con el valor o tipo «{».
  toggle: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «right» con el valor o tipo «Spacing.three».
    right: Spacing.three,
  },
});
