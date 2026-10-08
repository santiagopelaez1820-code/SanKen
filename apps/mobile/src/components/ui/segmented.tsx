// Esta línea sirve para importar «Pressable, StyleSheet» desde «react-native».
import { Pressable, StyleSheet } from 'react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

/** Movido acá desde dashboard.tsx (única pantalla que lo tenía antes) para reusarlo en el selector de tema de Configuración. */
// Esta línea sirve para declarar la función «Segmented».
export function Segmented<T extends string>({
  // Esta línea sirve para incluir el valor «options» en la lista.
  options,
  // Esta línea sirve para incluir el valor «value» en la lista.
  value,
  // Esta línea sirve para incluir el valor «onChange» en la lista.
  onChange,
// Esta línea sirve para cerrar la desestructuración y abrir los tipos.
}: {
  // Esta línea sirve para declarar la propiedad «options» con el valor o tipo «{ label: string; value: T }[]».
  options: { label: string; value: T }[];
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «T».
  value: T;
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(value: T) => void».
  onChange: (value: T) => void;
// Esta línea sirve para cerrar los parámetros y abrir el cuerpo.
}) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView type="backgroundElement" style={styles.segmented}>
      {/* Esta línea sirve para recorrer «options» y calcular qué mostrar por elemento. */}
      {options.map((option) => {
        // Esta línea sirve para extraer «electe» de «option.value === value».
        const selected = option.value === value;
        // Esta línea sirve para devolver la interfaz del componente.
        return (
          // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
          <Pressable
            // Esta línea sirve para identificar el elemento de la lista con «option.value}».
            key={option.value}
            // Esta línea sirve para asignar el manejador del evento «onPress».
            onPress={() => onChange(option.value)}
            // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.segment, selected && { backgroundColo».
            style={[styles.segment, selected && { backgroundColor: theme.backgroundSelected }]}>
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="small" themeColor={selected ? 'text' : 'textSecondary'}>
              {/* Esta línea sirve para mostrar el valor «option.label». */}
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «segmented» con el valor o tipo «{».
  segmented: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «2».
    padding: 2,
  },
  // Esta línea sirve para declarar la propiedad «segment» con el valor o tipo «{».
  segment: {
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.one».
    paddingVertical: Spacing.one,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.two».
    paddingHorizontal: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.two».
    borderRadius: Spacing.two,
  },
});
