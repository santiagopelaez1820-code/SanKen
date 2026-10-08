// Esta línea sirve para importar «ActivityIndicator, Pressable, StyleSheet, type GestureResponderEvent» desde «react-native».
import { ActivityIndicator, Pressable, StyleSheet, type GestureResponderEvent } from 'react-native';
// Esta línea sirve para importar «Svg» y «Path» desde «react-native-svg».
import Svg, { Path } from 'react-native-svg';
// Esta línea sirve para importar «Animated» y «useAnimatedStyle, useSharedValue, withSpring» desde «react-native-reanimated».
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// Esta línea sirve para importar «ThemedText» desde «@/components/themed-text».
import { ThemedText } from '@/components/themed-text';
// Esta línea sirve para importar «Spacing» desde «@/constants/theme».
import { Spacing } from '@/constants/theme';
// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar «PRESS_SPRING» con el valor «{ damping: 16, stiffness: 320 }».
const PRESS_SPRING = { damping: 16, stiffness: 320 };

/** Marca oficial de Google ("G" multicolor) — no es un ícono dibujado a mano, es el path estándar de la marca. */
// Esta línea sirve para declarar la función «GoogleLogo».
function GoogleLogo({ size = 18 }: { size?: number }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Svg».
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {/* Esta línea sirve para abrir el elemento «Path» con sus atributos en varias líneas. */}
      <Path
        // Esta línea sirve para definir el atributo «fill» con el valor «#FFC107».
        fill="#FFC107"
        // Esta línea sirve para definir el atributo «d».
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      {/* Esta línea sirve para abrir el elemento «Path» con sus atributos en varias líneas. */}
      <Path
        // Esta línea sirve para definir el atributo «fill» con el valor «#FF3D00».
        fill="#FF3D00"
        // Esta línea sirve para definir el atributo «d».
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      {/* Esta línea sirve para abrir el elemento «Path» con sus atributos en varias líneas. */}
      <Path
        // Esta línea sirve para definir el atributo «fill» con el valor «#4CAF50».
        fill="#4CAF50"
        // Esta línea sirve para definir el atributo «d».
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      {/* Esta línea sirve para abrir el elemento «Path» con sus atributos en varias líneas. */}
      <Path
        // Esta línea sirve para definir el atributo «fill» con el valor «#1976D2».
        fill="#1976D2"
        // Esta línea sirve para definir el atributo «d».
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </Svg>
  );
}

// Esta línea sirve para declarar la interfaz «GoogleSignInButtonProps».
interface GoogleSignInButtonProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string;
  // Esta línea sirve para declarar la propiedad «loading» con el valor o tipo «boolean».
  loading?: boolean;
  // Esta línea sirve para declarar la propiedad «disabled» con el valor o tipo «boolean».
  disabled?: boolean;
  // Esta línea sirve para declarar la propiedad «onPress» con el valor o tipo «() => void».
  onPress: () => void;
}

/**
 * Mismo look&feel que PrimaryButton variant="neutral" (borde, fondo,
 * animación al presionar) pero con la marca de Google en vez de un ícono de
 * lucide — PrimaryButton no tiene un slot para un logo de marca custom.
 */
// Esta línea sirve para declarar la función «GoogleSignInButton».
export function GoogleSignInButton({ label, loading, disabled, onPress }: GoogleSignInButtonProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «scale» con el hook «useSharedValue».
  const scale = useSharedValue(1);
  // Esta línea sirve para obtener «animatedStyle» con el hook «useAnimatedStyle».
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Esta línea sirve para extraer «andlePressI» de «(_e: GestureResponderEvent) => {».
  const handlePressIn = (_e: GestureResponderEvent) => {
    // react-hooks/immutability no conoce el contrato de Reanimated: asignar
    // .value de un SharedValue es la API pública sancionada para animar en
    // el hilo de UI, no un estado de React. Falso positivo documentado
    // (ver mismo caso en primary-button.tsx).
    // Esta línea sirve para asignar «withSpring(0.97, PRESS_SPRING)» a «scale.value».
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(0.97, PRESS_SPRING);
  };
  // Esta línea sirve para extraer «andlePressOu» de «(_e: GestureResponderEvent) => {».
  const handlePressOut = (_e: GestureResponderEvent) => {
    // Esta línea sirve para asignar «withSpring(1, PRESS_SPRING)» a «scale.value».
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withSpring(1, PRESS_SPRING);
  };

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Animated.View».
    <Animated.View style={animatedStyle}>
      {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
      <Pressable
        // Esta línea sirve para pasar la propiedad «disabled» con el valor «disabled || loading}».
        disabled={disabled || loading}
        // Esta línea sirve para asignar el manejador del evento «onPress».
        onPress={onPress}
        // Esta línea sirve para asignar el manejador del evento «onPressIn».
        onPressIn={handlePressIn}
        // Esta línea sirve para asignar el manejador del evento «onPressOut».
        onPressOut={handlePressOut}
        // Esta línea sirve para pasar la propiedad «style» con el valor «[».
        style={[
          // Esta línea sirve para agregar el estilo «styles.base».
          styles.base,
          // Esta línea sirve para agregar un elemento cuyo «backgroundColor» es «theme.backgroundElement, borderColor: th…».
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          // Esta línea sirve para atenuar el botón si está deshabilitado o cargando.
          (disabled || loading) && styles.disabled,
        ]}>
        {/* Esta línea sirve para elegir entre dos bloques según «loading». */}
        {loading ? (
          // Esta línea sirve para abrir el componente «ActivityIndicator».
          <ActivityIndicator color={theme.text} />
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
          <>
            {/* Esta línea sirve para abrir el componente «GoogleLogo». */}
            <GoogleLogo />
            {/* Esta línea sirve para abrir el componente «ThemedText». */}
            <ThemedText type="smallBold" style={{ color: theme.text, fontSize: 14, lineHeight: 18 }}>
              {/* Esta línea sirve para mostrar el valor «label». */}
              {label}
            </ThemedText>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «base» con el valor o tipo «{».
  base: {
    // Esta línea sirve para declarar la propiedad «flexDirection» con el valor o tipo «'row'».
    flexDirection: 'row',
    // Esta línea sirve para declarar la propiedad «gap» con el valor o tipo «Spacing.two».
    gap: Spacing.two,
    // Esta línea sirve para declarar la propiedad «alignSelf» con el valor o tipo «'stretch'».
    alignSelf: 'stretch',
    // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «Spacing.three».
    borderRadius: Spacing.three,
    // Esta línea sirve para declarar la propiedad «borderWidth» con el valor o tipo «1».
    borderWidth: 1,
    // Esta línea sirve para declarar la propiedad «paddingVertical» con el valor o tipo «Spacing.two + 5».
    paddingVertical: Spacing.two + 5,
    // Esta línea sirve para declarar la propiedad «minHeight» con el valor o tipo «44».
    minHeight: 44,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «disabled» con el valor o tipo «{».
  disabled: {
    // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «0.5».
    opacity: 0.5,
  },
});
