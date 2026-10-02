import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg from 'react-native-svg';
import { LOGO_K, LOGO_S, LOGO_VIEWBOX } from '@sanken/core';

import {
  DrawnStroke,
  LOGO_CROP_VIEWBOX,
  LogoFill,
  progress,
  STROKE_ON_DARK,
  STROKE_ON_LIGHT,
} from '@/components/brand/logo-drawing';

/**
 * Ciclo en ms. El logo nunca desaparece del todo: se atenúa a un
 * "fantasma", el trazo lo vuelve a dibujar encima y recupera sus colores,
 * y después queda quieto la mayor parte del ciclo — presente, no molesto.
 */
const CYCLE = 5600;
const GHOST: [number, number] = [0, 350];
const DRAW_S: [number, number] = [350, 1150];
const DRAW_K: [number, number] = [900, 1450];
const HEAD_S: [number, number] = [250, 400];
const HEAD_K: [number, number] = [900, 960];
const FILL_BACK: [number, number] = [1350, 1750];
const STROKE_OUT: [number, number] = [1600, 1950];
/** Opacidad mínima del logo mientras se redibuja. */
const GHOST_OPACITY = 0.12;

interface AnimatedLogoMarkProps {
  /** Ancho del isotipo; el alto sale de su proporción real. */
  width: number;
  /** Fondo claro: S trazada oscura y con contorno, como el logo real sobre blanco. */
  onLight?: boolean;
}

/**
 * Isotipo SK que se redibuja en bucle sobre su contorno real — la misma
 * técnica de la intro de apertura. Se pausa cuando la pantalla pierde el
 * foco y queda estático con "reducir movimiento" activado.
 */
export function AnimatedLogoMark({ width, onLight = false }: AnimatedLogoMarkProps) {
  const reducedMotion = useReducedMotion();
  const clock = useSharedValue(0);
  const height = (width * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width;
  const colors = onLight ? STROKE_ON_LIGHT : STROKE_ON_DARK;

  useFocusEffect(
    useCallback(() => {
      if (reducedMotion) return;
      // eslint-disable-next-line react-hooks/immutability -- mutar .value es la API real de Reanimated para shared values
      clock.value = 0;
      clock.value = withRepeat(
        withTiming(CYCLE, { duration: CYCLE, easing: Easing.linear, reduceMotion: ReduceMotion.Never }),
        -1,
        false,
      );
      return () => cancelAnimation(clock);
    }, [clock, reducedMotion]),
  );

  const fillStyle = useAnimatedStyle(() => {
    const t = clock.value;
    const ghost = progress(t, GHOST);
    const back = progress(t, FILL_BACK);
    return { opacity: 1 - (1 - GHOST_OPACITY) * ghost + (1 - GHOST_OPACITY) * back };
  });

  return (
    <View style={{ width, height }} accessibilityRole="image" accessibilityLabel="Logo de SanKen">
      <Animated.View style={[StyleSheet.absoluteFill, reducedMotion ? null : fillStyle]}>
        <LogoFill width={width} height={height} viewBox={LOGO_CROP_VIEWBOX} outlined={onLight} />
      </Animated.View>
      {!reducedMotion && (
        <Svg width={width} height={height} viewBox={LOGO_CROP_VIEWBOX} style={StyleSheet.absoluteFill}>
          <DrawnStroke stroke={LOGO_S} color={colors.s} clock={clock} draw={DRAW_S} headIn={HEAD_S} fadeOut={STROKE_OUT} />
          <DrawnStroke stroke={LOGO_K} color={colors.k} clock={clock} draw={DRAW_K} headIn={HEAD_K} fadeOut={STROKE_OUT} />
        </Svg>
      )}
    </View>
  );
}
