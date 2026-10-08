// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar «AlertCircle» desde «lucide-react-native».
import { AlertCircle } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «ErrorStateProps».
interface ErrorStateProps {
  /** Mensaje ya en español y legible (los stores lo arman con un fallback humano si la API no da uno) — nunca un código HTTP crudo. */
  // Esta línea sirve para declarar la propiedad «message» con el valor o tipo «string».
  message: string;
  // Esta línea sirve para declarar la propiedad «onRetry» con el valor o tipo «() => void».
  onRetry: () => void;
}

/** Mismo lenguaje visual que EmptyState — un error de red no debería sentirse como una pantalla distinta del resto de la app. */
// Esta línea sirve para declarar la función «ErrorState».
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.container}>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView type="backgroundElement" style={styles.iconCircle}>
        {/* Esta línea sirve para abrir el componente «AlertCircle». */}
        <AlertCircle size={20} color={theme.error} />
      </ThemedView>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="smallBold" style={styles.centerText}>
        {/* Esta línea sirve para mostrar el texto «No pudimos completar esta acción». */}
        No pudimos completar esta acción
      </ThemedText>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
        {/* Esta línea sirve para mostrar el valor «message». */}
        {message}
      </ThemedText>
      {/* Esta línea sirve para abrir el componente «ThemedView». */}
      <ThemedView style={styles.actionWrap}>
        {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
        <PrimaryButton label="Reintentar" variant="neutral" onPress={onRetry} />
      </ThemedView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «container» con el valor o tipo «{».
  container: {
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.four».
    paddingVertical: Spacing.four,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
  // Esta línea sirve para declarar la propiedad «iconCircle» con el valor o tipo «{».
  iconCircle: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «44».
    width: 44,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «44».
    height: 44,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «22».
    borderRadius: 22,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «centerText» con el valor o tipo «{».
  centerText: {
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
  },
  // Esta línea sirve para declarar la propiedad «actionWrap» con el valor o tipo «{».
  actionWrap: {
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.one».
    marginTop: Spacing.one,
    // Esta línea sirve para declarar la propiedad «minWidth» con el valor o tipo «160».
    minWidth: 160,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «'transparent'».
    backgroundColor: 'transparent',
  },
});
