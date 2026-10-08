// Esta línea sirve para importar «StyleSheet, View, type ViewStyle» desde «react-native».
import { StyleSheet, View, type ViewStyle } from 'react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar las variantes disponibles de la insignia.
export type BadgeVariant = 'default' | 'accent2' | 'success' | 'warning' | 'error' | 'neutral';

// Esta línea sirve para declarar la interfaz «BadgeProps».
interface BadgeProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «BadgeVariant».
  variant?: BadgeVariant;
  // Esta línea sirve para declarar la propiedad «style» con el valor o tipo «ViewStyle».
  style?: ViewStyle;
}

// Esta línea sirve para declarar la función «Badge».
export function Badge({ label, variant = 'neutral', style }: BadgeProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para declarar «colorByVariant» con el valor «{».
  const colorByVariant: Record<BadgeVariant, string> = {
    // Esta línea sirve para declarar la propiedad «default» con el valor o tipo «theme.accent».
    default: theme.accent,
    // Esta línea sirve para declarar la propiedad «accent2» con el valor o tipo «theme.accentSecondary».
    accent2: theme.accentSecondary,
    // Esta línea sirve para declarar la propiedad «success» con el valor o tipo «theme.success».
    success: theme.success,
    // Esta línea sirve para declarar la propiedad «warning» con el valor o tipo «theme.warning».
    warning: theme.warning,
    // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «theme.error».
    error: theme.error,
    // Esta línea sirve para declarar la propiedad «neutral» con el valor o tipo «theme.textSecondary».
    neutral: theme.textSecondary,
  };
  // Esta línea sirve para extraer «olo» de «colorByVariant[variant]».
  const color = colorByVariant[variant];

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={[styles.badge, { backgroundColor: `${color}26` }, style]}>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" style={{ color }}>
        {/* Esta línea sirve para mostrar el valor «label». */}
        {label}
      </ThemedText>
    </View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «badge» con el valor o tipo «{».
  badge: {
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'flex-start'».
    alignSelf: 'flex-start',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «999».
    borderRadius: 999,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.two».
    paddingHorizontal: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.half».
    paddingVertical: Spacing.half,
  },
});
