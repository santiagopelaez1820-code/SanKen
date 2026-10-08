// Esta línea sirve para importar «Switch, StyleSheet» desde «react-native».
import { Switch, StyleSheet } from 'react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Icon, type LucideIcon» desde «@/components/ui/icon».
import { Icon, type LucideIcon } from '@/components/ui/icon';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «ToggleRowProps».
interface ToggleRowProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «string».
  description?: string;
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «LucideIcon».
  icon?: LucideIcon;
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «boolean».
  value: boolean;
  // Esta línea sirve para declarar la propiedad «onValueChange» con el valor o tipo «(value: boolean) => void».
  onValueChange: (value: boolean) => void;
  // Esta línea sirve para declarar la propiedad «disabled» con el valor o tipo «boolean».
  disabled?: boolean;
}

// Esta línea sirve para declarar la función «ToggleRow».
export function ToggleRow({ label, description, icon, value, onValueChange, disabled }: ToggleRowProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.row}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.text}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView style={styles.labelRow}>
          {/* Esta línea sirve para mostrar el elemento solo si «icon». */}
          {icon && <Icon icon={icon} size={16} color={theme.accent} />}
          {/* Esta línea sirve para mostrar el valor «label» dentro de «ThemedText». */}
          <ThemedText type="default">{label}</ThemedText>
        </ThemedView>
        {/* Esta línea sirve para mostrar el bloque solo si «description». */}
        {description && (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText type="small" themeColor="textSecondary">
            {/* Esta línea sirve para mostrar el valor «description». */}
            {description}
          </ThemedText>
        )}
      </ThemedView>
      {/* Esta línea sirve para abrir el elemento «Switch» con sus atributos en varias líneas. */}
      <Switch
        // Esta línea sirve para pasar la propiedad «value» con el valor «value}».
        value={value}
        // Esta línea sirve para asignar el manejador del evento «onValueChange».
        onValueChange={onValueChange}
        // Esta línea sirve para pasar la propiedad «disabled» con el valor «disabled}».
        disabled={disabled}
        // Esta línea sirve para pasar la propiedad «trackColor» con el valor «{ false: theme.backgroundSelected, true: them».
        trackColor={{ false: theme.backgroundSelected, true: theme.accent }}
      />
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // ToggleRow siempre se usa dentro de una card `backgroundElement` (ver
  // settings/index.tsx) — sin este override quedaba un recuadro del fondo
  // general de la app encima del fondo real de la card.
  // Esta línea sirve para declarar la propiedad «row» con el valor o tipo «{».
  row: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'space-between'».
    justifyContent: 'space-between',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para definir el estilo «text» con «flex: 1, gap: Spacing.half, backgroundColor: 'tran…».
  text: { flex: 1, gap: Spacing.half, backgroundColor: 'transparent' },
  // Esta línea sirve para definir el estilo «labelRow» con «flexDirection: 'row', alignItems: 'center', gap: S…».
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: 'transparent' },
});
