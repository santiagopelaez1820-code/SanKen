// Esta línea sirve para importar «router, useLocalSearchParams» desde «expo-router».
import { router, useLocalSearchParams } from 'expo-router';
// Esta línea sirve para importar «StyleSheet» desde «react-native».
import { StyleSheet } from 'react-native';
// Esta línea sirve para importar «SafeAreaView» desde «react-native-safe-area-context».
import { SafeAreaView } from 'react-native-safe-area-context';
// Esta línea sirve para importar «CheckCircle2» desde «lucide-react-native».
import { CheckCircle2 } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «ThemedView» desde «@/components/themed-view».
import { ThemedView } from '@/components/themed-view';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «PrimaryButton» desde «@/components/ui/primary-button».
import { PrimaryButton } from '@/components/ui/primary-button';
// Esta línea sirve para importar «MaxContentWidth, Spacing» desde «@/constants/theme».
import { MaxContentWidth, Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la función «OrderConfirmationScreen».
export default function OrderConfirmationScreen() {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para extraer «orderId» de «useLocalSearchParams<{ orderId: string }».
  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «ThemedView».
    <ThemedView style={styles.root}>
      {/* Esta línea sirve para abrir el componente «SafeAreaView». */}
      <SafeAreaView style={styles.safeArea}>
        {/* Esta línea sirve para abrir el componente «ThemedView». */}
        <ThemedView type="backgroundElement" style={styles.iconCircle}>
          {/* Esta línea sirve para abrir el componente «Icon». */}
          <Icon icon={CheckCircle2} size={32} color={theme.accent} />
        </ThemedView>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="title" style={styles.title}>
          {/* Esta línea sirve para mostrar el texto «¡Pedido realizado!». */}
          ¡Pedido realizado!
        </ThemedText>
        {/* Esta línea sirve para abrir el componente «ThemedText». */}
        <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
          {/* Esta línea sirve para mostrar el número de pedido con ceros a la izquierda y su estado. */}
          Tu pedido #{String(orderId ?? '').padStart(6, '0')} quedó registrado y está pendiente de confirmación.
        </ThemedText>
        {/* Esta línea sirve para mostrar el componente «PrimaryButton». */}
        <PrimaryButton label="Volver a la tienda" onPress={() => router.replace('/store')} />
        {/* Esta línea sirve para abrir el elemento «PrimaryButton» con sus atributos en varias líneas. */}
        <PrimaryButton
          // Esta línea sirve para definir el atributo «label» con el valor «Ver mis pedidos».
          label="Ver mis pedidos"
          // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
          variant="ghost"
          // Esta línea sirve para asignar el manejador del evento «onPress».
          onPress={() => router.push(orderId ? `/pedidos/${orderId}` : '/pedidos')}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para definir el estilo «root» con «flex: 1, alignItems: 'center', justifyContent: 'ce…».
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // Esta línea sirve para declarar la propiedad «safeArea» con el valor o tipo «{».
  safeArea: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'100%'».
    width: '100%',
    // Esta línea sirve para declarar la propiedad «maxWidth» con el valor o tipo «MaxContentWidth».
    maxWidth: MaxContentWidth,
    // Esta línea sirve para declarar la propiedad «paddingHorizontal» con el valor o tipo «Spacing.four».
    paddingHorizontal: Spacing.four,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.three».
    gap: Spacing.three,
  },
  // Esta línea sirve para definir el estilo «iconCircle» con «width: 64, height: 64, borderRadius: 32, alignItem…».
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  // Esta línea sirve para definir el estilo «title» con «fontSize: 24, lineHeight: 30, textAlign: 'center' …».
  title: { fontSize: 24, lineHeight: 30, textAlign: 'center' },
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «{ textAlign: 'center' }».
  description: { textAlign: 'center' },
});
