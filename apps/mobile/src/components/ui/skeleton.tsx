// Esta línea sirve para importar «useEffect» desde «react».
import { useEffect } from 'react';
// Esta línea sirve para importar «type DimensionValue, StyleSheet» desde «react-native».
import { type DimensionValue, StyleSheet } from 'react-native';
// Esta línea sirve para importar «LinearGradient» desde «expo-linear-gradient».
import { LinearGradient } from 'expo-linear-gradient';
// Esta línea sirve para abrir la importación de utilidades de animación de Reanimated.
import Animated, {
  // Esta línea sirve para incluir el valor «Easing» en la lista.
  Easing,
  // Esta línea sirve para incluir el valor «useAnimatedStyle» en la lista.
  useAnimatedStyle,
  // Esta línea sirve para incluir el valor «useSharedValue» en la lista.
  useSharedValue,
  // Esta línea sirve para incluir el valor «withRepeat» en la lista.
  withRepeat,
  // Esta línea sirve para incluir el valor «withTiming» en la lista.
  withTiming,
// Esta línea sirve para terminar la importación desde «react-native-reanimated».
} from 'react-native-reanimated';

// Esta línea sirve para importar «useTheme» desde «@/hooks/use-theme».
import { useTheme } from '@/hooks/use-theme';

// Esta línea sirve para declarar la interfaz «SkeletonProps».
interface SkeletonProps {
  // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «DimensionValue».
  width?: DimensionValue;
  // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «DimensionValue».
  height?: DimensionValue;
  // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «number».
  borderRadius?: number;
  // Esta línea sirve para declarar la propiedad «style» con el valor o tipo «object».
  style?: object;
}

// Esta línea sirve para declarar «AnimatedGradient» con el valor «Animated.createAnimatedComponent(LinearGradient)».
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

// Esta línea sirve para declarar la función «Skeleton».
export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  // Esta línea sirve para obtener «theme» con el hook «useTheme».
  const theme = useTheme();
  // Esta línea sirve para obtener «opacity» con el hook «useSharedValue».
  const opacity = useSharedValue(0.5);
  // Esta línea sirve para obtener «shimmer» con el hook «useSharedValue».
  const shimmer = useSharedValue(-1);

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para repetir la animación de opacidad.
    opacity.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true);
    // Esta línea sirve para repetir la animación del brillo.
    shimmer.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, false);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «opacity, shimmer».
  }, [opacity, shimmer]);

  // Esta línea sirve para obtener «animatedStyle» con el hook «useAnimatedStyle».
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  // Esta línea sirve para obtener «shimmerStyle» con el hook «useAnimatedStyle».
  const shimmerStyle = useAnimatedStyle(() => ({
    // Esta línea sirve para declarar la propiedad «transform» con el valor o tipo «[{ translateX: `${shimmer.value * 200}%` }]».
    transform: [{ translateX: `${shimmer.value * 200}%` }],
  }));

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el contenedor animado del esqueleto.
    <Animated.View
      // Esta línea sirve para pasar la propiedad «style» con el valor «[».
      style={[
        // Esta línea sirve para agregar el estilo «styles.base».
        styles.base,
        // Esta línea sirve para definir el ancho, el alto, el borde y el color del esqueleto.
        { width, height, borderRadius, backgroundColor: theme.backgroundElement },
        // Esta línea sirve para incluir el valor «animatedStyle» en la lista.
        animatedStyle,
        // Esta línea sirve para incluir el valor «style» en la lista.
        style,
      ]}>
      {/* Esta línea sirve para abrir el elemento «AnimatedGradient» con sus atributos en varias líneas. */}
      <AnimatedGradient
        // Esta línea sirve para pasar la propiedad «colors» con el valor «['transparent', `${theme.text}14`, 'transpare».
        colors={['transparent', `${theme.text}14`, 'transparent']}
        // Esta línea sirve para pasar la propiedad «start» con el valor «{ x: 0, y: 0 }}».
        start={{ x: 0, y: 0 }}
        // Esta línea sirve para pasar la propiedad «end» con el valor «{ x: 1, y: 0 }}».
        end={{ x: 1, y: 0 }}
        // Esta línea sirve para pasar la propiedad «style» con el valor «[styles.shimmer, shimmerStyle]}».
        style={[styles.shimmer, shimmerStyle]}
      />
    </Animated.View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «base» con el valor o tipo «{».
  base: {
    // Esta línea sirve para declarar la propiedad «overflow» con el valor o tipo «'hidden'».
    overflow: 'hidden',
  },
  // Esta línea sirve para declarar la propiedad «shimmer» con el valor o tipo «{».
  shimmer: {
    // Esta línea sirve para copiar las propiedades de «StyleSheet».
    ...StyleSheet.absoluteFill,
    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «'50%'».
    width: '50%',
  },
});
