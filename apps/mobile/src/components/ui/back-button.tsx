// Esta línea sirve para importar «router, type Href» desde «expo-router».
import { router, type Href } from 'expo-router';
// Esta línea sirve para importar «Pressable, StyleSheet, View, type GestureResponderEvent» desde «react-native».
import { Pressable, StyleSheet, View, type GestureResponderEvent } from 'react-native';
// Esta línea sirve para importar «Animated» y «useAnimatedStyle, useSharedValue, withSpring» desde «react-native-reanimated».
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
// Esta línea sirve para importar «ChevronLeft» desde «lucide-react-native».
import { ChevronLeft } from 'lucide-react-native';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Icon» desde «@/components/ui/icon».
import { Icon } from '@/components/ui/icon';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «BackButtonProps».
interface BackButtonProps {
  /** Texto junto a la flecha (ej. "Tienda"). Sin label queda solo el ícono, del mismo tamaño que los botones de header (carrito). */
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label?: string;
  /**
   * A dónde ir si no hay historial (deep link / notificación que abrió la
   * pantalla directo) — mismo criterio `canGoBack() ? back() : replace()`
   * que ya usaban soporte y legal.
   */
  // Esta línea sirve para declarar la propiedad «fallbackHref» con el valor o tipo «Href».
  fallbackHref: Href;
}

/** Mismo resorte que PrimaryButton/GoogleSignInButton — toda la app "responde" igual al tocar. */
// Esta línea sirve para declarar «PRESS_SPRING» con el valor «{ damping: 16, stiffness: 320 }».
const PRESS_SPRING = { damping: 16, stiffness: 320 };

/**
 * Botón de volver de la app: chevron cian (acento de marca) dentro de un
 * chip teñido, sobre una superficie `backgroundElement` con borde sutil —
 * el mismo lenguaje que el botón de carrito y los chips de categoría. El
 * back de Android lo sigue resolviendo el Stack de expo-router; esto es la
 * affordance visible.
 */
// Esta línea sirve para declarar la función «BackButton».
export function BackButton({ label, fallbackHref }: BackButtonProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «scale» con el hook «useSharedValue».
  const scale = useSharedValue(1);
  // Esta línea sirve para obtener «animatedStyle» con el hook «useAnimatedStyle».
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Esta línea sirve para extraer «andlePressI» de «(_e: GestureResponderEvent) => {».
  const handlePressIn = (_e: GestureResponderEvent) => {
    // Esta línea sirve para asignar «withSpring(0.94, PRESS_SPRING)» a «scale.value».
    // eslint-disable-next-line react-hooks/immutability -- mutar .value es la API real de Reanimated para shared values
    scale.value = withSpring(0.94, PRESS_SPRING);
  };
  // Esta línea sirve para extraer «andlePressOu» de «(_e: GestureResponderEvent) => {».
  const handlePressOut = (_e: GestureResponderEvent) => {
    // Esta línea sirve para asignar «withSpring(1, PRESS_SPRING)» a «scale.value».
    // eslint-disable-next-line react-hooks/immutability -- mutar .value es la API real de Reanimated para shared values
    scale.value = withSpring(1, PRESS_SPRING);
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Animated.View».
    <Animated.View style={[styles.wrap, animatedStyle]}>
      {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
      <Pressable
        // Esta línea sirve para asignar el manejador del evento «onPress».
        onPress={() => (router.canGoBack() ? router.back() : router.replace(fallbackHref))}
        // Esta línea sirve para asignar el manejador del evento «onPressIn».
        onPressIn={handlePressIn}
        // Esta línea sirve para asignar el manejador del evento «onPressOut».
        onPressOut={handlePressOut}
        // Esta línea sirve para pasar la propiedad «hitSlop» con el valor «6}».
        hitSlop={6}
        // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «button».
        accessibilityRole="button"
        // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «label ? `Volver a ${label}` : 'Volver'}».
        accessibilityLabel={label ? `Volver a ${label}` : 'Volver'}
        // Esta línea sirve para pasar la propiedad «style» con el valor «[».
        style={[
          // Esta línea sirve para agregar el estilo «styles.base».
          styles.base,
          // Esta línea sirve para elegir el estilo según haya etiqueta o solo ícono.
          label ? styles.withLabel : styles.iconOnly,
          // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «theme.backgroundElement, borderColor: th…».
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={[styles.chip, { backgroundColor: `${theme.accent}1F` }]}>
          {/* Esta línea sirve para abrir el componente «Icon». */}
          <Icon icon={ChevronLeft} size={18} color={theme.accent} strokeWidth={2.6} />
        </View>
        {/* Esta línea sirve para mostrar el bloque solo si «label». */}
        {label && (
          // Esta línea sirve para abrir el componente «ThemedText».
          <ThemedText type="smallBold" style={styles.label} numberOfLines={1}>
            {/* Esta línea sirve para mostrar el valor «label». */}
            {label}
          </ThemedText>
        )}
      </Pressable>
    </Animated.View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «wrap» con el valor o tipo «{ alignSelf: 'flex-start' }».
  wrap: { alignSelf: 'flex-start' },
  // Esta línea sirve para declarar la propiedad «base» con el valor o tipo «{».
  base: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Mismo radio que el botón de carrito (Spacing.three) — los dos viven
    // en el mismo header y deben verse de la misma familia.
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
  },
  // Esta línea sirve para declarar la propiedad «withLabel» con el valor o tipo «{».
  withLabel: {
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «40».
    height: 40,
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «paddingLeft» con el valor o tipo «Spacing.one + 1».
    paddingLeft: Spacing.one + 1,
    // Esta línea sirve para declarar la propiedad «paddingRight» con el valor o tipo «Spacing.three».
    paddingRight: Spacing.three,
  },
  // 44x44: mínimo táctil y mismo tamaño que el botón de carrito.
  // Esta línea sirve para declarar la propiedad «iconOnly» con el valor o tipo «{».
  iconOnly: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «44».
    width: 44,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «44».
    height: 44,
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «chip» con el valor o tipo «{».
  chip: {
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «30».
    width: 30,
    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «30».
    height: 30,
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «10».
    borderRadius: 10,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «{ lineHeight: 18 }».
  label: { lineHeight: 18 },
});
