// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar las utilidades de animación de Reanimated.
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Icon, type LucideIcon» desde «@/components/ui/icon».
import { Icon, type LucideIcon } from '@/components/ui/icon';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «EmptyStateProps».
interface EmptyStateProps {
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «LucideIcon».
  icon: LucideIcon;
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «string».
  title: string;
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «string».
  description?: string;
  // Esta línea sirve para declarar la propiedad «action» con el valor o tipo «{ label: string; onPress: () => void }».
  action?: { label: string; onPress: () => void };
}

// Esta línea sirve para declarar la función «EmptyState».
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «progress» con el hook «useSharedValue».
  const progress = useSharedValue(0);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para animar la aparición del estado vacío en 350 milisegundos.
    progress.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «progress».
  }, [progress]);

  // Esta línea sirve para obtener «iconStyle» con el hook «useAnimatedStyle».
  const iconStyle = useAnimatedStyle(() => ({
    // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «progress.value».
    opacity: progress.value,
    // Esta línea sirve para declarar la propiedad «transform» con el valor o tipo «[{ scale: 0.8 + progress.value * 0.2 }]».
    transform: [{ scale: 0.8 + progress.value * 0.2 }],
  }));

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.container}>
      {/* Esta línea sirve para abrir el componente «Animated.View». */}
      <Animated.View style={iconStyle}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView type="backgroundElement" style={styles.iconCircle}>
          {/* Esta línea sirve para abrir el componente «Icon». */}
          <Icon icon={icon} size={20} color={theme.textSecondary} />
        </ThemedView>
      </Animated.View>
      {/* Esta línea sirve para abrir el componente «ThemedText». */}
      <ThemedText type="smallBold" style={styles.centerText}>
        {/* Esta línea sirve para mostrar el valor «title». */}
        {title}
      </ThemedText>
      {/* Esta línea sirve para mostrar el bloque solo si «description». */}
      {description && (
        // Esta línea sirve para abrir el componente «ThemedText».
        <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
          {/* Esta línea sirve para mostrar el valor «description». */}
          {description}
        </ThemedText>
      )}
      {/* Esta línea sirve para mostrar el bloque solo si «action». */}
      {action && (
        // Esta línea sirve para abrir el componente «ThemedView».
        <ThemedView style={styles.actionWrap}>
          {/* Esta línea sirve para abrir el componente «PrimaryButton». */}
          <PrimaryButton label={action.label} variant="neutral" onPress={action.onPress} />
        </ThemedView>
      )}
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // EmptyState se usa dentro de cards con fondos distintos al de la
  // página (backgroundElement, tintes de acento, etc.) — sin
  // `backgroundColor: 'transparent'` en los Views puramente de layout,
  // quedaba un rectángulo del fondo general de la app encima del fondo
  // real de la card que lo contiene.
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
