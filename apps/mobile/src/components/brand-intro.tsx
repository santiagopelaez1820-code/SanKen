// Esta línea sirve para importar «useEffect, useRef, useState» desde «react».
import { useEffect, useRef, useState } from 'react';
// Esta línea sirve para importar «Image» desde «expo-image».
import { Image } from 'expo-image';
// Esta línea sirve para importar «Pressable, StyleSheet, Text, useWindowDimensions, View» desde «react-native».
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
// Esta línea sirve para abrir la importación de utilidades de animación de Reanimated.
import Animated, {
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
  // Esta línea sirve para incluir el valor «withTiming» en la lista.
  withTiming,
// Esta línea sirve para terminar la importación desde «react-native-reanimated».
} from 'react-native-reanimated';
// Esta línea sirve para importar «Svg» y «Circle, Defs, RadialGradient, Stop» desde «react-native-svg».
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
// Esta línea sirve para importar «scheduleOnRN» desde «react-native-worklets».
import { scheduleOnRN } from 'react-native-worklets';

// Esta línea sirve para importar «LOGO_K, LOGO_S, LOGO_VIEWBOX» desde «@sanken/core».
import { LOGO_K, LOGO_S, LOGO_VIEWBOX } from '@sanken/core';

// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «DrawnStroke» en la lista.
  DrawnStroke,
  // Esta línea sirve para incluir el valor «easeOut» en la lista.
  easeOut,
  // Esta línea sirve para incluir el valor «LOGO_CROP_VIEWBOX» en la lista.
  LOGO_CROP_VIEWBOX,
  // Esta línea sirve para incluir el valor «LogoFill» en la lista.
  LogoFill,
  // Esta línea sirve para incluir el valor «progress» en la lista.
  progress,
  // Esta línea sirve para incluir el valor «STROKE_ON_DARK» en la lista.
  STROKE_ON_DARK,
// Esta línea sirve para terminar la importación desde «@/components/brand/logo-drawing».
} from '@/components/brand/logo-drawing';

/**
 * Fondo del splash nativo (app.json → expo-splash-screen). El splash nativo
 * es solo este color (su imagen es un PNG transparente: sin imagen, Android
 * 12+ mostraría el ícono de la app), así que no hay ningún logo estático
 * antes de que la intro empiece a dibujarse.
 */
// Esta línea sirve para declarar «INTRO_BACKGROUND» con el valor «'#080C10'».
export const INTRO_BACKGROUND = '#080C10';
// Esta línea sirve para declarar «SLOGAN» con el valor «'Tu progreso, guiado por inteligencia.'».
const SLOGAN = 'Tu progreso, guiado por inteligencia.';
/** Proporción real de assets/images/brand-wordmark.png (recortado de logo-full.png). */
// Esta línea sirve para declarar «WORDMARK_RATIO» con el valor «865 / 127».
const WORDMARK_RATIO = 865 / 127;

// Esta línea sirve para declarar «S_STROKE» con el valor «STROKE_ON_DARK.s».
const S_STROKE = STROKE_ON_DARK.s;
// Esta línea sirve para declarar «K_STROKE» con el valor «STROKE_ON_DARK.k».
const K_STROKE = STROKE_ON_DARK.k;

/**
 * Línea de tiempo en ms. Un solo reloj (`clock`) avanza de 0 a `total` y
 * cada capa deriva su estado de él — nada se agenda con setTimeout ni
 * dispara renders de React por frame.
 */
// Esta línea sirve para declarar la interfaz «Timeline».
interface Timeline {
  // Esta línea sirve para declarar la propiedad «total» con el valor o tipo «number».
  total: number;
  // Esta línea sirve para declarar la propiedad «dotIn» con el valor o tipo «[number, number]».
  dotIn: [number, number];
  // Esta línea sirve para declarar la propiedad «drawS» con el valor o tipo «[number, number]».
  drawS: [number, number];
  // Esta línea sirve para declarar la propiedad «drawK» con el valor o tipo «[number, number]».
  drawK: [number, number];
  // Esta línea sirve para declarar la propiedad «fillIn» con el valor o tipo «[number, number]».
  fillIn: [number, number];
  // Esta línea sirve para declarar la propiedad «strokeOut» con el valor o tipo «[number, number]».
  strokeOut: [number, number];
  // Esta línea sirve para declarar la propiedad «wordmarkIn» con el valor o tipo «[number, number]».
  wordmarkIn: [number, number];
  // Esta línea sirve para declarar la propiedad «sloganIn» con el valor o tipo «[number, number]».
  sloganIn: [number, number];
  // Esta línea sirve para declarar la propiedad «emphasis» con el valor o tipo «[number, number]».
  emphasis: [number, number];
  // Esta línea sirve para declarar la propiedad «exit» con el valor o tipo «[number, number]».
  exit: [number, number];
}

/**
 * El logo completo (isotipo + SANKEN + slogan) queda en pantalla 1 s extra
 * antes de la salida: así se alcanza a ver la marca terminada.
 */
// Esta línea sirve para declarar «FINAL_HOLD» con el valor «1000».
const FINAL_HOLD = 1000;

// Esta línea sirve para declarar «FULL» con el valor «{».
const FULL: Timeline = {
  // Esta línea sirve para declarar la propiedad «total» con el valor o tipo «3300 + FINAL_HOLD».
  total: 3300 + FINAL_HOLD,
  // Esta línea sirve para definir «dotIn» con «[0, 200], // sobre el fondo vacío del sp…».
  dotIn: [0, 200], // sobre el fondo vacío del splash nace la punta de luz donde empieza la S
  // Esta línea sirve para declarar la propiedad «drawS» con el valor o tipo «[200, 930], // la luz recorre y dibuja la S».
  drawS: [200, 930], // la luz recorre y dibuja la S
  // Esta línea sirve para definir «drawK» con «[700, 1260], // la K/flecha se traza des…».
  drawK: [700, 1260], // la K/flecha se traza desde la punta de la flecha
  // Esta línea sirve para definir «fillIn» con «[1130, 1480], // aparece el logo real de…».
  fillIn: [1130, 1480], // aparece el logo real debajo del trazo
  // Esta línea sirve para definir «strokeOut» con «[1380, 1730], // el trazo se integra y s…».
  strokeOut: [1380, 1730], // el trazo se integra y se apaga
  // Esta línea sirve para declarar la propiedad «wordmarkIn» con el valor o tipo «[1530, 1980]».
  wordmarkIn: [1530, 1980],
  // Esta línea sirve para declarar la propiedad «sloganIn» con el valor o tipo «[1980, 2430]».
  sloganIn: [1980, 2430],
  // Esta línea sirve para definir «emphasis» con «[2430, 2780], // leve "respiro" de escal…».
  emphasis: [2430, 2780], // leve "respiro" de escala + brillo
  // Esta línea sirve para declarar la propiedad «exit» con el valor o tipo «[2950 + FINAL_HOLD, 3300 + FINAL_HOLD]».
  exit: [2950 + FINAL_HOLD, 3300 + FINAL_HOLD],
};

/**
 * Movimiento reducido (preferencia del sistema): sin trazo ni énfasis —
 * logo → nombre → slogan → app, solo con fundidos cortos.
 */
// Esta línea sirve para declarar «REDUCED» con el valor «{».
const REDUCED: Timeline = {
  // Esta línea sirve para declarar la propiedad «total» con el valor o tipo «1700 + FINAL_HOLD».
  total: 1700 + FINAL_HOLD,
  // Esta línea sirve para declarar la propiedad «dotIn» con el valor o tipo «[0, 0]».
  dotIn: [0, 0],
  // Esta línea sirve para declarar la propiedad «drawS» con el valor o tipo «[0, 0]».
  drawS: [0, 0],
  // Esta línea sirve para declarar la propiedad «drawK» con el valor o tipo «[0, 0]».
  drawK: [0, 0],
  // Esta línea sirve para declarar la propiedad «fillIn» con el valor o tipo «[0, 250]».
  fillIn: [0, 250],
  // Esta línea sirve para declarar la propiedad «strokeOut» con el valor o tipo «[0, 0]».
  strokeOut: [0, 0],
  // Esta línea sirve para declarar la propiedad «wordmarkIn» con el valor o tipo «[200, 500]».
  wordmarkIn: [200, 500],
  // Esta línea sirve para declarar la propiedad «sloganIn» con el valor o tipo «[450, 750]».
  sloganIn: [450, 750],
  // Esta línea sirve para declarar la propiedad «emphasis» con el valor o tipo «[0, 0]».
  emphasis: [0, 0],
  // Esta línea sirve para declarar la propiedad «exit» con el valor o tipo «[1300 + FINAL_HOLD, 1700 + FINAL_HOLD]».
  exit: [1300 + FINAL_HOLD, 1700 + FINAL_HOLD],
};


// Esta línea sirve para declarar la interfaz «BrandIntroProps».
interface BrandIntroProps {
  /** true cuando el splash nativo ya se ocultó — recién ahí arranca el reloj. */
  // Esta línea sirve para declarar la propiedad «started» con el valor o tipo «boolean».
  started: boolean;
  // Esta línea sirve para declarar la propiedad «onFinish» con el valor o tipo «() => void».
  onFinish: () => void;
}

/**
 * Intro de marca: el isotipo SK se DIBUJA sobre su contorno real (trazo SVG
 * con strokeDashoffset + una punta de luz que lo recorre), luego aparece el
 * logo real, el wordmark SANKEN y el slogan, y todo se funde hacia la app.
 */
// Esta línea sirve para declarar la función «BrandIntro».
export function BrandIntro({ started, onFinish }: BrandIntroProps) {
  // Esta línea sirve para obtener «width» con el hook «useWindowDimensions».
  const { width } = useWindowDimensions();
  // Esta línea sirve para obtener «reducedMotion» con el hook «useReducedMotion».
  const reducedMotion = useReducedMotion();
  // Esta línea sirve para extraer «imelin» de «reducedMotion ? REDUCED : FULL».
  const timeline = reducedMotion ? REDUCED : FULL;
  // Esta línea sirve para obtener «clock» con el hook «useSharedValue».
  const clock = useSharedValue(0);
  // Esta línea sirve para crear la referencia «finishedRef».
  const finishedRef = useRef(false);

  // Escala proporcional al ancho de pantalla, con topes para teléfonos
  // chicos y tablets — nunca un tamaño absoluto fijo.
  // Esta línea sirve para extraer «ymbolWidt» de «Math.min(240, Math.max(150, width * 0.46».
  const symbolWidth = Math.min(240, Math.max(150, width * 0.46));
  // Esta línea sirve para extraer «ymbolHeigh» de «(symbolWidth * LOGO_VIEWBOX.height) / LO».
  const symbolHeight = (symbolWidth * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width;
  // Esta línea sirve para extraer «ordmarkWidt» de «symbolWidth * 0.92».
  const wordmarkWidth = symbolWidth * 0.92;
  // Esta línea sirve para extraer «lowSiz» de «symbolWidth * 1.6».
  const glowSize = symbolWidth * 1.6;
  // Esta línea sirve para extraer «loganSiz» de «Math.min(15, Math.max(13, width * 0.036)».
  const sloganSize = Math.min(15, Math.max(13, width * 0.036));

  // El wordmark es el único PNG de la intro: el reloj no arranca hasta que
  // cargó (queda precargado detrás del splash nativo), para que nunca
  // aparezca "tarde" o en blanco. Tope de 1.5 s por si onLoad no llega
  // (mientras tanto se sigue viendo el mismo frame del splash nativo).
  // Esta línea sirve para crear el estado «wordmarkReady» y su función «setWordmarkReady».
  const [wordmarkReady, setWordmarkReady] = useState(false);
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para extraer «ime» de «setTimeout(() => setWordmarkReady(true),».
    const timer = setTimeout(() => setWordmarkReady(true), 1500);
    // Esta línea sirve para devolver «() => clearTimeout(timer)».
    return () => clearTimeout(timer);
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
  }, []);
  // Esta línea sirve para extraer «unnin» de «started && wordmarkReady».
  const running = started && wordmarkReady;

  // Esta línea sirve para extraer «inis» de «() => {».
  const finish = () => {
    // Esta línea sirve para salir de la función si «finishedRef.current».
    if (finishedRef.current) return;
    // Esta línea sirve para asignar «true» a «finishedRef.current».
    finishedRef.current = true;
    // Esta línea sirve para llamar a «onFinish».
    onFinish();
  };

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!running».
    if (!running) return;
    // ReduceMotion.Never: con la preferencia del sistema activa Reanimated
    // saltaría la animación al final al instante; la versión reducida ya
    // es solo fundidos cortos, así que se reproduce tal cual.
    // Esta línea sirve para asignar «withTiming(» a «clock.value».
    clock.value = withTiming(
      // Esta línea sirve para pasar la duración total de la animación.
      timeline.total,
      // Esta línea sirve para agregar un elemento cuyo «duration» es «timeline.total, easing: Easing.linear, r…».
      { duration: timeline.total, easing: Easing.linear, reduceMotion: ReduceMotion.Never },
      // Esta línea sirve para declarar lo que ocurre cuando la animación termina.
      (done) => {
        // Esta línea sirve para llamar a «scheduleOnRN» si «done».
        if (done) scheduleOnRN(finish);
      },
    );
    // Red de seguridad: pase lo que pase con la animación, la intro nunca
    // se queda en pantalla más de su duración + 1.5 s.
    // Esta línea sirve para extraer «ailSaf» de «setTimeout(finish, timeline.total + 1500».
    const failSafe = setTimeout(finish, timeline.total + 1500);
    // Esta línea sirve para devolver «() => clearTimeout(failSafe)».
    return () => clearTimeout(failSafe);
    // Esta línea sirve para volver a ejecutar el efecto cuando cambian «running».
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Tocar la pantalla adelanta la intro a su salida.
  // Esta línea sirve para extraer «ki» de «() => {».
  const skip = () => {
    // Esta línea sirve para salir de la función si «!running».
    if (!running) return;
    // Esta línea sirve para extraer «xitStar» de «timeline.exit[0]».
    const exitStart = timeline.exit[0];
    // Esta línea sirve para asignar «Math.max(clock.value, exitStart)» a «clock.value».
    // eslint-disable-next-line react-hooks/immutability -- mutar .value es la API real de Reanimated para shared values
    clock.value = Math.max(clock.value, exitStart);
    // Esta línea sirve para asignar «withTiming(» a «clock.value».
    clock.value = withTiming(
      // Esta línea sirve para pasar la duración total de la animación.
      timeline.total,
      // Esta línea sirve para agregar un elemento cuyo «duration» es «280, easing: Easing.linear, reduceMotion…».
      { duration: 280, easing: Easing.linear, reduceMotion: ReduceMotion.Never },
      // Esta línea sirve para declarar lo que ocurre cuando la animación termina.
      (done) => {
        // Esta línea sirve para llamar a «scheduleOnRN» si «done».
        if (done) scheduleOnRN(finish);
      },
    );
  };

  // Esta línea sirve para obtener «rootStyle» con el hook «useAnimatedStyle».
  const rootStyle = useAnimatedStyle(() => ({
    // Esta línea sirve para definir «opacity» con «1 - easeOut(progress(clock.value, timeli…».
    opacity: 1 - easeOut(progress(clock.value, timeline.exit)),
  }));

  // Esta línea sirve para obtener «contentStyle» con el hook «useAnimatedStyle».
  const contentStyle = useAnimatedStyle(() => {
    // Esta línea sirve para declarar «t» con el valor «clock.value».
    const t = clock.value;
    // Esta línea sirve para declarar «e» con el valor «progress(t, timeline.emphasis)».
    const e = progress(t, timeline.emphasis);
    // Sube y vuelve (seno de medio ciclo): un "respiro", no un rebote.
    // Esta línea sirve para extraer «uls» de «Math.sin(e * Math.PI)».
    const pulse = Math.sin(e * Math.PI);
    // Esta línea sirve para extraer «xi» de «easeOut(progress(t, timeline.exit))».
    const exit = easeOut(progress(t, timeline.exit));
    // Esta línea sirve para devolver la escala pulsante y el desplazamiento de salida.
    return { transform: [{ scale: 1 + pulse * 0.03 }, { translateY: -exit * 8 }] };
  });

  // Esta línea sirve para obtener «glowStyle» con el hook «useAnimatedStyle».
  const glowStyle = useAnimatedStyle(() => {
    // Esta línea sirve para declarar «t» con el valor «clock.value».
    const t = clock.value;
    // Esta línea sirve para extraer «uls» de «Math.sin(progress(t, timeline.emphasis) ».
    const pulse = Math.sin(progress(t, timeline.emphasis) * Math.PI);
    // Esta línea sirve para extraer «il» de «progress(t, timeline.fillIn)».
    const fill = progress(t, timeline.fillIn);
    // Esta línea sirve para devolver «{ opacity: fill * 0.35 + pulse * 0.4 }».
    return { opacity: fill * 0.35 + pulse * 0.4 };
  });

  // Esta línea sirve para obtener «fillStyle» con el hook «useAnimatedStyle».
  const fillStyle = useAnimatedStyle(() => ({
    // Esta línea sirve para definir «opacity» con «easeOut(progress(clock.value, timeline.f…».
    opacity: easeOut(progress(clock.value, timeline.fillIn)),
  }));

  // Esta línea sirve para obtener «wordmarkStyle» con el hook «useAnimatedStyle».
  const wordmarkStyle = useAnimatedStyle(() => {
    // Esta línea sirve para calcular el progreso de entrada del nombre de la marca.
    const p = easeOut(progress(clock.value, timeline.wordmarkIn));
    // Esta línea sirve para devolver la opacidad y el desplazamiento vertical del nombre.
    return { opacity: p, transform: [{ translateY: (1 - p) * 10 }] };
  });

  // Esta línea sirve para obtener «sloganStyle» con el hook «useAnimatedStyle».
  const sloganStyle = useAnimatedStyle(() => {
    // Esta línea sirve para declarar «p» con el valor «easeOut(progress(clock.value, timeline.sloganIn))».
    const p = easeOut(progress(clock.value, timeline.sloganIn));
    // Esta línea sirve para devolver la opacidad y el desplazamiento vertical del texto secundario.
    return { opacity: p, transform: [{ translateY: (1 - p) * 6 }] };
  });

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Animated.View».
    <Animated.View style={[styles.root, rootStyle]} pointerEvents="box-none">
      {/* Esta línea sirve para abrir el elemento «Pressable» con sus atributos en varias líneas. */}
      <Pressable
        // Esta línea sirve para pasar la propiedad «style» con el valor «StyleSheet.absoluteFill}».
        style={StyleSheet.absoluteFill}
        // Esta línea sirve para asignar el manejador del evento «onPress».
        onPress={skip}
        // Esta línea sirve para activar la opción «accessible».
        accessible
        // Esta línea sirve para definir el atributo «accessibilityRole» con el valor «image».
        accessibilityRole="image"
        // Esta línea sirve para pasar la propiedad «accessibilityLabel» con el valor «`SanKen. ${SLOGAN}`}».
        accessibilityLabel={`SanKen. ${SLOGAN}`}
        // Esta línea sirve para definir el atributo «accessibilityHint» con el valor «Toca para continuar».
        accessibilityHint="Toca para continuar">
        {/* Esta línea sirve para abrir el comentario que explica el primer frame de la intro. */}
        {/* El primer frame es solo el fondo, igual que el splash nativo:
            // Esta línea sirve para continuar el comentario sobre el cambio de etapa.
            el cambio de etapa no se nota y lo primero que se ve es el
            // Esta línea sirve para cerrar el comentario sobre el logo dibujándose.
            logo dibujándose. */}
        {/* Esta línea sirve para abrir el componente «View». */}
        <View style={styles.center} pointerEvents="none">
          {/* Esta línea sirve para abrir el componente «Animated.View». */}
          <Animated.View style={[styles.column, contentStyle]}>
            {/* Esta línea sirve para abrir el componente «View». */}
            <View style={{ width: symbolWidth, height: symbolHeight }}>
              {/* Esta línea sirve para mostrar el contenido dinámico «{/* Halo muy suave detrás del isotipo — solo acompaña el». */}
              {/* Halo muy suave detrás del isotipo — solo acompaña el
                  // Esta línea sirve para incluir el texto o las clases «respiro…».
                  "respiro" final, no es un efecto protagonista. */}
              {/* Esta línea sirve para abrir el contenedor animado del logo. */}
              <Animated.View
                // Esta línea sirve para pasar la propiedad «style» con el valor «[».
                style={[
                  // Esta línea sirve para agregar el estilo «styles.glow».
                  styles.glow,
                  {
                    // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «glowSize».
                    width: glowSize,
                    // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «glowSize».
                    height: glowSize,
                    // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «(symbolWidth - glowSize) / 2».
                    left: (symbolWidth - glowSize) / 2,
                    // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «(symbolHeight - glowSize) / 2».
                    top: (symbolHeight - glowSize) / 2,
                  },
                  // Esta línea sirve para incluir el valor «glowStyle» en la lista.
                  glowStyle,
                ]}>
                {/* Esta línea sirve para abrir el componente «Svg». */}
                <Svg width={glowSize} height={glowSize}>
                  {/* Esta línea sirve para abrir el componente «Defs». */}
                  <Defs>
                    {/* Esta línea sirve para abrir el componente «RadialGradient». */}
                    <RadialGradient id="introGlow" cx="50%" cy="50%" r="50%">
                      {/* Esta línea sirve para abrir el componente «Stop». */}
                      <Stop offset="0" stopColor={K_STROKE} stopOpacity={0.28} />
                      {/* Esta línea sirve para abrir el componente «Stop». */}
                      <Stop offset="1" stopColor={K_STROKE} stopOpacity={0} />
                    </RadialGradient>
                  </Defs>
                  {/* Esta línea sirve para abrir el componente «Circle». */}
                  <Circle cx={glowSize / 2} cy={glowSize / 2} r={glowSize / 2} fill="url(#introGlow)" />
                </Svg>
              </Animated.View>

              {/* Esta línea sirve para mostrar el contenido dinámico «{/* Logo final con sus colores reales, relleno de la MISMA». */}
              {/* Logo final con sus colores reales, relleno de la MISMA
                  // Esta línea sirve para continuar el comentario sobre el trazo y la geometría compartida.
                  geometría que el trazo (misma caja/viewBox), así el trazo
                  // Esta línea sirve para incluir el texto o las clases «se convierte…».
                  "se convierte" en el logo sin corrimientos. Vectorial: no
                  // Esta línea sirve para cerrar el comentario sobre la carga del PNG.
                  depende de que cargue un PNG (antes quedaba un hueco). */}
              {/* Esta línea sirve para abrir el componente «Animated.View». */}
              <Animated.View style={[StyleSheet.absoluteFill, fillStyle]}>
                {/* Esta línea sirve para abrir el elemento «LogoFill» con sus atributos en varias líneas. */}
                <LogoFill
                  // Esta línea sirve para pasar la propiedad «width» con el valor «symbolWidth}».
                  width={symbolWidth}
                  // Esta línea sirve para pasar la propiedad «height» con el valor «symbolHeight}».
                  height={symbolHeight}
                  // Esta línea sirve para pasar la propiedad «viewBox» con el valor «LOGO_CROP_VIEWBOX}».
                  viewBox={LOGO_CROP_VIEWBOX}
                />
              </Animated.View>

              {/* Esta línea sirve para mostrar el bloque solo si «!reducedMotion». */}
              {!reducedMotion && (
                // Esta línea sirve para abrir el elemento «Svg» con sus atributos en varias líneas.
                <Svg
                  // Esta línea sirve para pasar la propiedad «width» con el valor «symbolWidth}».
                  width={symbolWidth}
                  // Esta línea sirve para pasar la propiedad «height» con el valor «symbolHeight}».
                  height={symbolHeight}
                  // Esta línea sirve para pasar la propiedad «viewBox» con el valor «LOGO_CROP_VIEWBOX}».
                  viewBox={LOGO_CROP_VIEWBOX}
                  // Esta línea sirve para pasar la propiedad «style» con el valor «StyleSheet.absoluteFill}>».
                  style={StyleSheet.absoluteFill}>
                  {/* Esta línea sirve para abrir el componente «DrawnStroke». */}
                  <DrawnStroke stroke={LOGO_S} color={S_STROKE} clock={clock} draw={FULL.drawS} headIn={FULL.dotIn} fadeOut={FULL.strokeOut} />
                  {/* Esta línea sirve para abrir el elemento «DrawnStroke» con sus atributos en varias líneas. */}
                  <DrawnStroke
                    // Esta línea sirve para pasar la propiedad «stroke» con el valor «LOGO_K}».
                    stroke={LOGO_K}
                    // Esta línea sirve para pasar la propiedad «color» con el valor «K_STROKE}».
                    color={K_STROKE}
                    // Esta línea sirve para pasar la propiedad «clock» con el valor «clock}».
                    clock={clock}
                    // Esta línea sirve para pasar la propiedad «draw» con el valor «FULL.drawK}».
                    draw={FULL.drawK}
                    // Esta línea sirve para pasar la propiedad «headIn» con el valor «[FULL.drawK[0], FULL.drawK[0] + 60]}».
                    headIn={[FULL.drawK[0], FULL.drawK[0] + 60]}
                    // Esta línea sirve para pasar la propiedad «fadeOut» con el valor «FULL.strokeOut}».
                    fadeOut={FULL.strokeOut}
                  />
                </Svg>
              )}
            </View>

            {/* Esta línea sirve para abrir el componente «Animated.View». */}
            <Animated.View style={[styles.wordmarkWrap, wordmarkStyle]}>
              {/* Esta línea sirve para abrir el elemento «Image» con sus atributos en varias líneas. */}
              <Image
                // Esta línea sirve para pasar la propiedad «source» con el valor «require('@/assets/images/brand-wordmark.png')».
                source={require('@/assets/images/brand-wordmark.png')}
                // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: wordmarkWidth, height: wordmarkWidth».
                style={{ width: wordmarkWidth, height: wordmarkWidth / WORDMARK_RATIO }}
                // Esta línea sirve para definir el atributo «contentFit» con el valor «contain».
                contentFit="contain"
                // Esta línea sirve para asignar el manejador del evento «onLoad».
                onLoad={() => setWordmarkReady(true)}
                // Esta línea sirve para asignar el manejador del evento «onError».
                onError={() => setWordmarkReady(true)}
              />
            </Animated.View>

            {/* Esta línea sirve para abrir el componente «Animated.View». */}
            <Animated.View style={sloganStyle}>
              {/* Esta línea sirve para mostrar el valor «SLOGAN» dentro de «Text». */}
              <Text style={[styles.slogan, { fontSize: sloganSize }]}>{SLOGAN}</Text>
            </Animated.View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Esta línea sirve para declarar «styles» con el valor «StyleSheet.create({».
const styles = StyleSheet.create({
  // Esta línea sirve para declarar la propiedad «root» con el valor o tipo «{».
  root: {
    // Esta línea sirve para copiar las propiedades de «StyleSheet».
    ...StyleSheet.absoluteFill,
    // Esta línea sirve para declarar la propiedad «backgroundColor» con el valor o tipo «INTRO_BACKGROUND».
    backgroundColor: INTRO_BACKGROUND,
    // Esta línea sirve para declarar la propiedad «zIndex» con el valor o tipo «1000».
    zIndex: 1000,
  },
  // Esta línea sirve para declarar la propiedad «center» con el valor o tipo «{».
  center: {
    // Esta línea sirve para copiar las propiedades de «StyleSheet».
    ...StyleSheet.absoluteFill,
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
    // Esta línea sirve para declarar la propiedad «justifyContent» con el valor o tipo «'center'».
    justifyContent: 'center',
  },
  // Esta línea sirve para declarar la propiedad «column» con el valor o tipo «{».
  column: {
    // Esta línea sirve para declarar la propiedad «alignItems» con el valor o tipo «'center'».
    alignItems: 'center',
  },
  // Esta línea sirve para declarar la propiedad «glow» con el valor o tipo «{».
  glow: {
    // Esta línea sirve para declarar la propiedad «position» con el valor o tipo «'absolute'».
    position: 'absolute',
  },
  // Esta línea sirve para declarar la propiedad «wordmarkWrap» con el valor o tipo «{».
  wordmarkWrap: {
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «22».
    marginTop: 22,
  },
  // Esta línea sirve para declarar la propiedad «slogan» con el valor o tipo «{».
  slogan: {
    // Esta línea sirve para declarar la propiedad «marginTop» con el valor o tipo «12».
    marginTop: 12,
    // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «'#9AA6B2'».
    color: '#9AA6B2',
    // Esta línea sirve para declarar la propiedad «fontWeight» con el valor o tipo «'500'».
    fontWeight: '500',
    // Esta línea sirve para declarar la propiedad «letterSpacing» con el valor o tipo «0.3».
    letterSpacing: 0.3,
    // Esta línea sirve para declarar la propiedad «textAlign» con el valor o tipo «'center'».
    textAlign: 'center',
  },
});

