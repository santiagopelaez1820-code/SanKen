// Esta línea sirve para importar «useCallback» desde «react».
import { useCallback } from 'react';
// Esta línea sirve para importar «useFocusEffect» desde «expo-router».
import { useFocusEffect } from 'expo-router';
// Esta línea sirve para importar «StyleSheet, View» desde «react-native».
import { StyleSheet, View } from 'react-native';
// Esta línea sirve para abrir la importación de utilidades de animación de Reanimated.
import Animated, {
  // Esta línea sirve para incluir el valor «cancelAnimation» en la lista.
  cancelAnimation,
  // Esta línea sirve para incluir el valor «Easing» en la lista.
  Easing,
  // Esta línea sirve para incluir el valor «ReduceMotion» en la lista.
  ReduceMotion,
  // Esta línea sirve para incluir el valor «useAnimatedStyle» en la lista.
  useAnimatedStyle,
  // Esta línea sirve para incluir el valor «useReducedMotion» en la lista.
  useReducedMotion,
  // Esta línea sirve para incluir el valor «useSharedValue» en la lista.
  useSharedValue,
  // Esta línea sirve para incluir el valor «withRepeat» en la lista.
  withRepeat,
  // Esta línea sirve para incluir el valor «withTiming» en la lista.
  withTiming,
// Esta línea sirve para terminar la importación desde «react-native-reanimated».
} from 'react-native-reanimated';
// Esta línea sirve para importar «Svg» desde «react-native-svg».
import Svg from 'react-native-svg';
// Esta línea sirve para importar «LOGO_K, LOGO_S, LOGO_VIEWBOX» desde «@sanken/core».
import { LOGO_K, LOGO_S, LOGO_VIEWBOX } from '@sanken/core';

// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «DrawnStroke» en la lista.
  DrawnStroke,
  // Esta línea sirve para incluir el valor «LOGO_CROP_VIEWBOX» en la lista.
  LOGO_CROP_VIEWBOX,
  // Esta línea sirve para incluir el valor «LogoFill» en la lista.
  LogoFill,
  // Esta línea sirve para incluir el valor «progress» en la lista.
  progress,
  // Esta línea sirve para incluir el valor «STROKE_ON_DARK» en la lista.
  STROKE_ON_DARK,
  // Esta línea sirve para incluir el valor «STROKE_ON_LIGHT» en la lista.
  STROKE_ON_LIGHT,
// Esta línea sirve para terminar la importación desde «@/components/brand/logo-drawing».
} from '@/components/brand/logo-drawing';

/**
 * Ciclo en ms. El logo nunca desaparece del todo: se atenúa a un
 * "fantasma", el trazo lo vuelve a dibujar encima y recupera sus colores,
 * y después queda quieto la mayor parte del ciclo — presente, no molesto.
 */
// Esta línea sirve para declarar «CYCLE» con el valor «5600».
const CYCLE = 5600;
// Esta línea sirve para declarar «GHOST» con el valor «[0, 350]».
const GHOST: [number, number] = [0, 350];
// Esta línea sirve para declarar «DRAW_S» con el valor «[350, 1150]».
const DRAW_S: [number, number] = [350, 1150];
// Esta línea sirve para declarar «DRAW_K» con el valor «[900, 1450]».
const DRAW_K: [number, number] = [900, 1450];
// Esta línea sirve para declarar «HEAD_S» con el valor «[250, 400]».
const HEAD_S: [number, number] = [250, 400];
// Esta línea sirve para declarar «HEAD_K» con el valor «[900, 960]».
const HEAD_K: [number, number] = [900, 960];
// Esta línea sirve para declarar «FILL_BACK» con el valor «[1350, 1750]».
const FILL_BACK: [number, number] = [1350, 1750];
// Esta línea sirve para declarar «STROKE_OUT» con el valor «[1600, 1950]».
const STROKE_OUT: [number, number] = [1600, 1950];
/** Opacidad mínima del logo mientras se redibuja. */
// Esta línea sirve para declarar «GHOST_OPACITY» con el valor «0.12».
const GHOST_OPACITY = 0.12;

// Esta línea sirve para declarar la interfaz «AnimatedLogoMarkProps».
interface AnimatedLogoMarkProps {
  /** Ancho del isotipo; el alto sale de su proporción real. */
  // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «number».
  width: number;
  /** Fondo claro: S trazada oscura y con contorno, como el logo real sobre blanco. */
  // Esta línea sirve para declarar la propiedad «onLight» con el valor o tipo «boolean».
  onLight?: boolean;
}

/**
 * Isotipo SK que se redibuja en bucle sobre su contorno real — la misma
 * técnica de la intro de apertura. Se pausa cuando la pantalla pierde el
 * foco y queda estático con "reducir movimiento" activado.
 */
// Esta línea sirve para declarar la función «AnimatedLogoMark».
export function AnimatedLogoMark({ width, onLight = false }: AnimatedLogoMarkProps) {
  // Esta línea sirve para obtener «reducedMotion» con el hook «useReducedMotion».
  const reducedMotion = useReducedMotion();
  // Esta línea sirve para obtener «clock» con el hook «useSharedValue».
  const clock = useSharedValue(0);
  // Esta línea sirve para extraer «eigh» de «(width * LOGO_VIEWBOX.height) / LOGO_VIE».
  const height = (width * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width;
  // Esta línea sirve para extraer «olor» de «onLight ? STROKE_ON_LIGHT : STROKE_ON_DA».
  const colors = onLight ? STROKE_ON_LIGHT : STROKE_ON_DARK;

  // Esta línea sirve para llamar a «useFocusEffect» con los argumentos de las líneas siguientes.
  useFocusEffect(
    // Esta línea sirve para llamar a «useCallback» con una función.
    useCallback(() => {
      // Esta línea sirve para salir de la función si «reducedMotion».
      if (reducedMotion) return;
      // Esta línea sirve para asignar «0» a «clock.value».
      // eslint-disable-next-line react-hooks/immutability -- mutar .value es la API real de Reanimated para shared values
      clock.value = 0;
      // Esta línea sirve para asignar «withRepeat(» a «clock.value».
      clock.value = withRepeat(
        // Esta línea sirve para animar el reloj durante un ciclo completo con curva lineal.
        withTiming(CYCLE, { duration: CYCLE, easing: Easing.linear, reduceMotion: ReduceMotion.Never }),
        // Esta línea sirve para repetir la animación sin fin.
        -1,
        // Esta línea sirve para incluir el valor «false» en la lista.
        false,
      );
      // Esta línea sirve para devolver «() => cancelAnimation(clock)».
      return () => cancelAnimation(clock);
    // Esta línea sirve para volver a ejecutar el efecto si cambian el reloj o la preferencia de movimiento.
    }, [clock, reducedMotion]),
  );

  // Esta línea sirve para obtener «fillStyle» con el hook «useAnimatedStyle».
  const fillStyle = useAnimatedStyle(() => {
    // Esta línea sirve para declarar «t» con el valor «clock.value».
    const t = clock.value;
    // Esta línea sirve para extraer «hos» de «progress(t, GHOST)».
    const ghost = progress(t, GHOST);
    // Esta línea sirve para extraer «ac» de «progress(t, FILL_BACK)».
    const back = progress(t, FILL_BACK);
    // Esta línea sirve para devolver la opacidad del relleno según el momento del ciclo.
    return { opacity: 1 - (1 - GHOST_OPACITY) * ghost + (1 - GHOST_OPACITY) * back };
  });

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «View».
    <View style={{ width, height }} accessibilityRole="image" accessibilityLabel="Logo de SanKen">
      {/* Esta línea sirve para abrir el componente «Animated.View». */}
      <Animated.View style={[StyleSheet.absoluteFill, reducedMotion ? null : fillStyle]}>
        {/* Esta línea sirve para abrir el componente «LogoFill». */}
        <LogoFill width={width} height={height} viewBox={LOGO_CROP_VIEWBOX} outlined={onLight} />
      </Animated.View>
      {/* Esta línea sirve para mostrar el bloque solo si «!reducedMotion». */}
      {!reducedMotion && (
        // Esta línea sirve para abrir el componente «Svg».
        <Svg width={width} height={height} viewBox={LOGO_CROP_VIEWBOX} style={StyleSheet.absoluteFill}>
          {/* Esta línea sirve para abrir el componente «DrawnStroke». */}
          <DrawnStroke stroke={LOGO_S} color={colors.s} clock={clock} draw={DRAW_S} headIn={HEAD_S} fadeOut={STROKE_OUT} />
          {/* Esta línea sirve para abrir el componente «DrawnStroke». */}
          <DrawnStroke stroke={LOGO_K} color={colors.k} clock={clock} draw={DRAW_K} headIn={HEAD_K} fadeOut={STROKE_OUT} />
        </Svg>
      )}
    </View>
  );
}
