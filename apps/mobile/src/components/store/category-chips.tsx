// Esta línea sirve para importar «Pressable, ScrollView, StyleSheet» desde «react-native».
import { Pressable, ScrollView, StyleSheet } from 'react-native';
// Esta línea sirve para importar los tipos «ProductCategory» desde «@sanken/core».
import type { ProductCategory } from '@sanken/core';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar «CATEGORY_LABELS» con el valor «{».
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  // Esta línea sirve para declarar la propiedad «protein» con el valor o tipo «'Proteínas'».
  protein: 'Proteínas',
  // Esta línea sirve para declarar la propiedad «creatine» con el valor o tipo «'Creatinas'».
  creatine: 'Creatinas',
  // Esta línea sirve para declarar la propiedad «pre_workout» con el valor o tipo «'Pre-entrenos'».
  pre_workout: 'Pre-entrenos',
  // Esta línea sirve para declarar la propiedad «amino_acids» con el valor o tipo «'Aminoácidos'».
  amino_acids: 'Aminoácidos',
  // Esta línea sirve para declarar la propiedad «vitamins» con el valor o tipo «'Vitaminas'».
  vitamins: 'Vitaminas',
  // Esta línea sirve para declarar la propiedad «other» con el valor o tipo «'Otros'».
  other: 'Otros',
};

// Esta línea sirve para declarar «CATEGORIES» con el valor «Object.keys(CATEGORY_LABELS) as ProductCategory[]».
const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];

// Esta línea sirve para declarar la interfaz «CategoryChipsProps».
interface CategoryChipsProps {
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «ProductCategory | null».
  value: ProductCategory | null;
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(value: ProductCategory | null) => void».
  onChange: (value: ProductCategory | null) => void;
}

// Esta línea sirve para declarar la función «CategoryChips».
export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ScrollView».
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {/* Esta línea sirve para mostrar el componente «Chip». */}
      <Chip label="Todas" active={value === null} onPress={() => onChange(null)} />
      {/* Esta línea sirve para recorrer «CATEGORIES» y mostrar un bloque por elemento. */}
      {CATEGORIES.map((category) => (
        // Esta línea sirve para abrir el elemento «Chip» con sus atributos en varias líneas.
        <Chip
          // Esta línea sirve para identificar el elemento de la lista con «category}».
          key={category}
          // Esta línea sirve para pasar la propiedad «label» con el valor «CATEGORY_LABELS[category]}».
          label={CATEGORY_LABELS[category]}
          // Esta línea sirve para pasar la propiedad «active» con el valor «value === category}».
          active={value === category}
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => onChange(category)}
        />
      ))}
    </ScrollView>
  );
}

// Esta línea sirve para declarar la función «Chip».
function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas.
    <Pressable
      // Esta línea sirve para asignar el manejador del evento «onPress».
      onPress={onPress}
      // Esta línea sirve para pasar la propiedad «style» con el valor «[».
      style={[
        // Esta línea sirve para agregar el estilo «styles.chip».
        styles.chip,
        {
          // Esta línea sirve para definir «backgroundColor» con «active ? theme.accent : theme.background…».
          backgroundColor: active ? theme.accent : theme.backgroundElement,
          // Esta línea sirve para declarar la propiedad «borderColor» con el valor o tipo «active ? theme.accent : theme.border».
          borderColor: active ? theme.accent : theme.border,
        },
      ]}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" style={{ color: active ? '#050505' : theme.text, fontWeight: active ? '700' : '500' }}>
        {/* Esta línea sirve para mostrar el valor «label». */}
        {label}
      </ThemedText>
    </Pressable>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para definir el estilo «row» con «gap: Spacing.two, paddingVertical: Spacing.one },…».
  row: { gap: Spacing.two, paddingVertical: Spacing.one },
  // Esta línea sirve para declarar la propiedad «chip» con el valor o tipo «{».
  chip: {
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.five».
    borderRadius: Spacing.five,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
  },
});
