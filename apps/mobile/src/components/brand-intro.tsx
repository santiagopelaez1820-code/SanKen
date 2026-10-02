import { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { LOGO_CANVAS, LOGO_K, LOGO_S, LOGO_VIEWBOX } from '@sanken/core';

import {
  DrawnStroke,
  easeOut,
  LOGO_CROP_VIEWBOX,
  LogoFill,
  progress,
  STROKE_ON_DARK,
} from '@/components/brand/logo-drawing';

/** Fondo del splash nativo (app.json → expo-splash-screen) — la intro arranca idéntica a él. */
export const INTRO_BACKGROUND = '#080C10';
/** Ancho con el que el splash nativo muestra splash-icon.png (app.json → imageWidth). */
const NATIVE_SPLASH_IMAGE_WIDTH = 76;
const SLOGAN = 'Tu progreso, guiado por inteligencia.';
/** Proporción real de assets/images/brand-wordmark.png (recortado de logo-full.png). */
const WORDMARK_RATIO = 865 / 127;

const S_STROKE = STROKE_ON_DARK.s;
const K_STROKE = STROKE_ON_DARK.k;

/**
 * Línea de tiempo en ms. Un solo reloj (`clock`) avanza de 0 a `total` y
 * cada capa deriva su estado de él — nada se agenda con setTimeout ni
 * dispara renders de React por frame.
 */
interface Timeline {
  total: number;
  nativeOut: [number, number];
  dotIn: [number, number];
  drawS: [number, number];
  drawK: [number, number];
  fillIn: [number, number];
  strokeOut: [number, number];
  wordmarkIn: [number, number];
  sloganIn: [number, number];
  emphasis: [number, number];
  exit: [number, number];
}

const FULL: Timeline = {
  total: 3300,
  nativeOut: [0, 260], // el logo del splash nativo se disuelve…
  dotIn: [120, 320], // …y nace la punta de luz donde empieza la S
  drawS: [320, 1050], // la luz recorre y dibuja la S
  drawK: [820, 1380], // la K/flecha se traza desde la punta de la flecha
  fillIn: [1250, 1600], // aparece el logo real debajo del trazo
  strokeOut: [1500, 1850], // el trazo se integra y se apaga
  wordmarkIn: [1650, 2100],
  sloganIn: [2100, 2550],
  emphasis: [2550, 2900], // leve "respiro" de escala + brillo
  exit: [2950, 3300],
};

/**
 * Movimiento reducido (preferencia del sistema): sin trazo ni énfasis —
 * logo → nombre → slogan → app, solo con fundidos cortos.
 */
const REDUCED: Timeline = {
  total: 1700,
  nativeOut: [0, 250],
  dotIn: [0, 0],
  drawS: [0, 0],
  drawK: [0, 0],
  fillIn: [0, 250],
  strokeOut: [0, 0],
  wordmarkIn: [200, 500],
  sloganIn: [450, 750],
  emphasis: [0, 0],
  exit: [1300, 1700],
};


interface BrandIntroProps {
  /** true cuando el splash nativo ya se ocultó — recién ahí arranca el reloj. */
  started: boolean;
  onFinish: () => void;
}

/**
 * Intro de marca: el isotipo SK se DIBUJA sobre su contorno real (trazo SVG
 * con strokeDashoffset + una punta de luz que lo recorre), luego aparece el
 * logo real, el wordmark SANKEN y el slogan, y todo se funde hacia la app.
 */
export function BrandIntro({ started, onFinish }: BrandIntroProps) {
  const { width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const timeline = reducedMotion ? REDUCED : FULL;
  const clock = useSharedValue(0);
  const finishedRef = useRef(false);

  // Escala proporcional al ancho de pantalla, con topes para teléfonos
  // chicos y tablets — nunca un tamaño absoluto fijo.
  const symbolWidth = Math.min(240, Math.max(150, width * 0.46));
  const symbolHeight = (symbolWidth * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width;
  const wordmarkWidth = symbolWidth * 0.92;
  const glowSize = symbolWidth * 1.6;
  const sloganSize = Math.min(15, Math.max(13, width * 0.036));

  // El wordmark es el único PNG de la intro: el reloj no arranca hasta que
  // cargó (queda precargado detrás del splash nativo), para que nunca
  // aparezca "tarde" o en blanco. Tope de 1.5 s por si onLoad no llega
  // (mientras tanto se sigue viendo el mismo frame del splash nativo).
  const [wordmarkReady, setWordmarkReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setWordmarkReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);
  const running = started && wordmarkReady;

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  };

  useEffect(() => {
    if (!running) return;
    // ReduceMotion.Never: con la preferencia del sistema activa Reanimated
    // saltaría la animación al final al instante; la versión reducida ya
    // es solo fundidos cortos, así que se reproduce tal cual.
    clock.value = withTiming(
      timeline.total,
      { duration: timeline.total, easing: Easing.linear, reduceMotion: ReduceMotion.Never },
      (done) => {
        if (done) scheduleOnRN(finish);
      },
    );
    // Red de seguridad: pase lo que pase con la animación, la intro nunca
    // se queda en pantalla más de su duración + 1.5 s.
    const failSafe = setTimeout(finish, timeline.total + 1500);
    return () => clearTimeout(failSafe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Tocar la pantalla adelanta la intro a su salida.
  const skip = () => {
    if (!running) return;
    const exitStart = timeline.exit[0];
    // eslint-disable-next-line react-hooks/immutability -- mutar .value es la API real de Reanimated para shared values
    clock.value = Math.max(clock.value, exitStart);
    clock.value = withTiming(
      timeline.total,
      { duration: 280, easing: Easing.linear, reduceMotion: ReduceMotion.Never },
      (done) => {
        if (done) scheduleOnRN(finish);
      },
    );
  };

  const rootStyle = useAnimatedStyle(() => ({
    opacity: 1 - easeOut(progress(clock.value, timeline.exit)),
  }));

  const nativeLogoStyle = useAnimatedStyle(() => {
    const p = easeOut(progress(clock.value, timeline.nativeOut));
    return { opacity: 1 - p, transform: [{ scale: 1 + p * 0.12 }] };
  });

  const contentStyle = useAnimatedStyle(() => {
    const t = clock.value;
    const e = progress(t, timeline.emphasis);
    // Sube y vuelve (seno de medio ciclo): un "respiro", no un rebote.
    const pulse = Math.sin(e * Math.PI);
    const exit = easeOut(progress(t, timeline.exit));
    return { transform: [{ scale: 1 + pulse * 0.03 }, { translateY: -exit * 8 }] };
  });

  const glowStyle = useAnimatedStyle(() => {
    const t = clock.value;
    const pulse = Math.sin(progress(t, timeline.emphasis) * Math.PI);
    const fill = progress(t, timeline.fillIn);
    return { opacity: fill * 0.35 + pulse * 0.4 };
  });

  const fillStyle = useAnimatedStyle(() => ({
    opacity: easeOut(progress(clock.value, timeline.fillIn)),
  }));

  const wordmarkStyle = useAnimatedStyle(() => {
    const p = easeOut(progress(clock.value, timeline.wordmarkIn));
    return { opacity: p, transform: [{ translateY: (1 - p) * 10 }] };
  });

  const sloganStyle = useAnimatedStyle(() => {
    const p = easeOut(progress(clock.value, timeline.sloganIn));
    return { opacity: p, transform: [{ translateY: (1 - p) * 6 }] };
  });

  return (
    <Animated.View style={[styles.root, rootStyle]} pointerEvents="box-none">
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={skip}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`SanKen. ${SLOGAN}`}
        accessibilityHint="Toca para continuar">
        {/* Mismo logo, fondo, tamaño y posición que el splash nativo: el
            primer frame es idéntico y el cambio de etapa no se nota. */}
        <View style={styles.center} pointerEvents="none">
          <Animated.View style={nativeLogoStyle}>
            {/* Vectorial (no el PNG): se pinta en el primer frame sin
                esperar a que cargue ninguna imagen. */}
            <LogoFill
              width={NATIVE_SPLASH_IMAGE_WIDTH}
              height={NATIVE_SPLASH_IMAGE_WIDTH}
              viewBox={`0 0 ${LOGO_CANVAS} ${LOGO_CANVAS}`}
            />
          </Animated.View>
        </View>

        <View style={styles.center} pointerEvents="none">
          <Animated.View style={[styles.column, contentStyle]}>
            <View style={{ width: symbolWidth, height: symbolHeight }}>
              {/* Halo muy suave detrás del isotipo — solo acompaña el
                  "respiro" final, no es un efecto protagonista. */}
              <Animated.View
                style={[
                  styles.glow,
                  {
                    width: glowSize,
                    height: glowSize,
                    left: (symbolWidth - glowSize) / 2,
                    top: (symbolHeight - glowSize) / 2,
                  },
                  glowStyle,
                ]}>
                <Svg width={glowSize} height={glowSize}>
                  <Defs>
                    <RadialGradient id="introGlow" cx="50%" cy="50%" r="50%">
                      <Stop offset="0" stopColor={K_STROKE} stopOpacity={0.28} />
                      <Stop offset="1" stopColor={K_STROKE} stopOpacity={0} />
                    </RadialGradient>
                  </Defs>
                  <Circle cx={glowSize / 2} cy={glowSize / 2} r={glowSize / 2} fill="url(#introGlow)" />
                </Svg>
              </Animated.View>

              {/* Logo final con sus colores reales, relleno de la MISMA
                  geometría que el trazo (misma caja/viewBox), así el trazo
                  "se convierte" en el logo sin corrimientos. Vectorial: no
                  depende de que cargue un PNG (antes quedaba un hueco). */}
              <Animated.View style={[StyleSheet.absoluteFill, fillStyle]}>
                <LogoFill
                  width={symbolWidth}
                  height={symbolHeight}
                  viewBox={LOGO_CROP_VIEWBOX}
                />
              </Animated.View>

              {!reducedMotion && (
                <Svg
                  width={symbolWidth}
                  height={symbolHeight}
                  viewBox={LOGO_CROP_VIEWBOX}
                  style={StyleSheet.absoluteFill}>
                  <DrawnStroke stroke={LOGO_S} color={S_STROKE} clock={clock} draw={FULL.drawS} headIn={FULL.dotIn} fadeOut={FULL.strokeOut} />
                  <DrawnStroke
                    stroke={LOGO_K}
                    color={K_STROKE}
                    clock={clock}
                    draw={FULL.drawK}
                    headIn={[FULL.drawK[0], FULL.drawK[0] + 60]}
                    fadeOut={FULL.strokeOut}
                  />
                </Svg>
              )}
            </View>

            <Animated.View style={[styles.wordmarkWrap, wordmarkStyle]}>
              <Image
                source={require('@/assets/images/brand-wordmark.png')}
                style={{ width: wordmarkWidth, height: wordmarkWidth / WORDMARK_RATIO }}
                contentFit="contain"
                onLoad={() => setWordmarkReady(true)}
                onError={() => setWordmarkReady(true)}
              />
            </Animated.View>

            <Animated.View style={sloganStyle}>
              <Text style={[styles.slogan, { fontSize: sloganSize }]}>{SLOGAN}</Text>
            </Animated.View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: INTRO_BACKGROUND,
    zIndex: 1000,
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
  },
  wordmarkWrap: {
    marginTop: 22,
  },
  slogan: {
    marginTop: 12,
    color: '#9AA6B2',
    fontWeight: '500',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});

