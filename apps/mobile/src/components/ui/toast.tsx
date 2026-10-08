// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «Animated» y «FadeInDown, FadeOutUp» desde «react-native-reanimated».
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
// Esta línea sirve para importar «CheckCircle2» desde «lucide-react-native».
import { CheckCircle2 } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «CardShadow, Spacing» desde «@/constants/theme».
import { CardShadow, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';
// Esta línea sirve para importar «useToastStore» desde «@/store/toast-store».
import { useToastStore } from '@/store/toast-store';

/** Montado una sola vez en el root layout — cualquier pantalla dispara un toast con `useToastStore.getState().show(...)`. */
// Esta línea sirve para declarar la función «ToastHost».
export function ToastHost() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «toast» con el hook «useToastStore».
  const toast = useToastStore((s) => s.toast);

  // Esta línea sirve para devolver null si «!toast».
  if (!toast) return null;

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «SafeAreaView».
    <SafeAreaView pointerEvents="none" style={styles.wrapper}>
      {/* Esta línea sirve para abrir el contenedor animado del aviso. */}
      <Animated.View
        // Esta línea sirve para identificar el elemento de la lista con «toast.id}».
        key={toast.id}
        // Esta línea sirve para pasar la propiedad «entering» con el valor «FadeInDown.duration(220)}».
        entering={FadeInDown.duration(220)}
        // Esta línea sirve para pasar la propiedad «exiting» con el valor «FadeOutUp.duration(180)}».
        exiting={FadeOutUp.duration(180)}
        // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.toast, { backgroundColor: theme.cardE».
        style={[styles.toast, { backgroundColor: theme.cardElevated, borderColor: theme.border }, CardShadow]}>
        {/* Esta línea sirve para mostrar el elemento solo si «toast.variant === 'success'». */}
        {toast.variant === 'success' && <CheckCircle2 size={18} color={theme.success} />}
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="small" style={styles.text}>
          {/* Esta línea sirve para mostrar el valor «toast.message». */}
          {toast.message}
        </ThemedText>
      </Animated.View>
    </SafeAreaView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «wrapper» con el valor o tipo «{».
  wrapper: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «0».
    top: 0,
    // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «0».
    left: 0,
    // Esta línea sirve para declarar la propiedad «right» con el valor o tipo «0».
    right: 0,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
  },
  // Esta línea sirve para declarar la propiedad «toast» con el valor o tipo «{».
  toast: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «Spacing.two».
    marginTop: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.three».
    paddingHorizontal: Spacing.three,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two».
    paddingVertical: Spacing.two,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «420».
    maxWidth: 420,
  },
  // Esta línea sirve para declarar la propiedad «text» con el valor o tipo «{ flexShrink: 1 }».
  text: { flexShrink: 1 },
});
