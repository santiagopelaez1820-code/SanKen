// Esta línea sirve para importar «Animated» y «Easing, useAnimatedProps, type SharedValue» desde «react-native-reanimated».
import Animated, { Easing, useAnimatedProps, type SharedValue } from 'react-native-reanimated';
// Esta línea sirve para importar «Svg» y «Circle, Path» desde «react-native-svg».
import Svg, { Circle, Path } from 'react-native-svg';
// Esta línea sirve para importar «LOGO_BLUE, LOGO_K, LOGO_S, LOGO_S_COLOR, LOGO_VIEWBOX, type LogoStroke» desde «@sanken/core».
import { LOGO_BLUE, LOGO_K, LOGO_S, LOGO_S_COLOR, LOGO_VIEWBOX, type LogoStroke } from '@sanken/core';

/**
 * Piezas compartidas del "logo que se dibuja": las usan la intro de
 * apertura (brand-intro.tsx) y la tarjeta de marca de Inicio
 * (animated-logo-mark.tsx). Todo se deriva de un reloj en ms (SharedValue)
 * en el hilo de UI — sin renders de React por frame.
 */

/** viewBox del recorte del isotipo dentro del canvas de 256×256. */
// Esta línea sirve para construir el viewBox recortado del logo.
export const LOGO_CROP_VIEWBOX = `${LOGO_VIEWBOX.x} ${LOGO_VIEWBOX.y} ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`;

/** Trazo luminoso de cada forma sobre fondo oscuro. */
// Esta línea sirve para declarar «STROKE_ON_DARK» con el valor «{ s: '#F5F7FA', k: '#4A7DFF' } as const».
export const STROKE_ON_DARK = { s: '#F5F7FA', k: '#4A7DFF' } as const;
/** Sobre fondo claro la S se traza oscura (en el logo real lleva contorno negro). */
// Esta línea sirve para declarar «STROKE_ON_LIGHT» con el valor «{ s: '#0B0B0B', k: '#1D4FE0' } as const».
export const STROKE_ON_LIGHT = { s: '#0B0B0B', k: '#1D4FE0' } as const;

// Esta línea sirve para declarar «easeDraw» con el valor «Easing.inOut(Easing.cubic)».
export const easeDraw = Easing.inOut(Easing.cubic);
// Esta línea sirve para declarar «easeOut» con el valor «Easing.out(Easing.cubic)».
export const easeOut = Easing.out(Easing.cubic);

// Esta línea sirve para declarar la función «progress».
export function progress(t: number, [start, end]: readonly [number, number]) {
  // Esta línea sirve para incluir el texto o las clases «worklet…».
  'worklet';
  // Esta línea sirve para devolver «t >= end ? 1 : 0» si «end <= start».
  if (end <= start) return t >= end ? 1 : 0;
  // Esta línea sirve para devolver el progreso entre 0 y 1 de un intervalo.
  return Math.min(1, Math.max(0, (t - start) / (end - start)));
}

/** Punto exacto a una fracción `p` del recorrido de la polilínea — la punta de luz sigue el contorno real. */
// Esta línea sirve para declarar la función «pointAt».
export function pointAt(stroke: LogoStroke, p: number) {
  // Esta línea sirve para incluir el texto o las clases «worklet…».
  'worklet';
  // Esta línea sirve para extraer «arge» de «p * stroke.length».
  const target = p * stroke.length;
  // Esta línea sirve para extraer «points, cumulative» de «stroke».
  const { points, cumulative } = stroke;
  // Esta línea sirve para recorrer los elementos con «let i = 1; i < points.length; i++».
  for (let i = 1; i < points.length; i++) {
    // Esta línea sirve para revisar si «cumulative[i] >= target».
    if (cumulative[i] >= target) {
      // Esta línea sirve para extraer «egmen» de «cumulative[i] - cumulative[i - 1] || 1».
      const segment = cumulative[i] - cumulative[i - 1] || 1;
      // Esta línea sirve para declarar «f» con el valor «(target - cumulative[i - 1]) / segment».
      const f = (target - cumulative[i - 1]) / segment;
      // Esta línea sirve para devolver «{».
      return {
        // Esta línea sirve para definir «x» con «points[i - 1][0] + (points[i][0] - point…».
        x: points[i - 1][0] + (points[i][0] - points[i - 1][0]) * f,
        // Esta línea sirve para definir «y» con «points[i - 1][1] + (points[i][1] - point…».
        y: points[i - 1][1] + (points[i][1] - points[i - 1][1]) * f,
      };
    }
  }
  // Esta línea sirve para devolver «{ x: points[0][0], y: points[0][1] }».
  return { x: points[0][0], y: points[0][1] };
}

// Esta línea sirve para declarar «AnimatedPath» con el valor «Animated.createAnimatedComponent(Path)».
const AnimatedPath = Animated.createAnimatedComponent(Path);
// Esta línea sirve para declarar «AnimatedCircle» con el valor «Animated.createAnimatedComponent(Circle)».
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Esta línea sirve para declarar la interfaz «LogoFillProps».
interface LogoFillProps {
  // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «number».
  width: number;
  // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «number».
  height: number;
  // Esta línea sirve para declarar la propiedad «viewBox» con el valor o tipo «string».
  viewBox: string;
  /**
   * Contorno oscuro en la S — como el logo real sobre fondo claro
   * (logo-full.png). Sin él, la S blanca desaparece en modo claro.
   */
  // Esta línea sirve para declarar la propiedad «outlined» con el valor o tipo «boolean».
  outlined?: boolean;
}

/** Isotipo SK relleno con los colores del logo real (S blanca, K azul de marca). */
// Esta línea sirve para declarar la función «LogoFill».
export function LogoFill({ width, height, viewBox, outlined = false }: LogoFillProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Svg».
    <Svg width={width} height={height} viewBox={viewBox}>
      {/* Esta línea sirve para abrir el elemento «Path» con sus atributos en varias líneas. */}
      <Path
        // Esta línea sirve para pasar la propiedad «d» con el valor «LOGO_S.d}».
        d={LOGO_S.d}
        // Esta línea sirve para pasar la propiedad «fill» con el valor «LOGO_S_COLOR}».
        fill={LOGO_S_COLOR}
        // Esta línea sirve para pasar la propiedad «stroke» con el valor «outlined ? '#0B0B0B' : undefined}».
        stroke={outlined ? '#0B0B0B' : undefined}
        // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «outlined ? 1.6 : undefined}».
        strokeWidth={outlined ? 1.6 : undefined}
        // Esta línea sirve para definir el atributo «strokeLinejoin» con el valor «round».
        strokeLinejoin="round"
      />
      {/* Esta línea sirve para abrir el componente «Path». */}
      <Path d={LOGO_K.d} fill={LOGO_BLUE} />
    </Svg>
  );
}

// Esta línea sirve para declarar la interfaz «DrawnStrokeProps».
interface DrawnStrokeProps {
  // Esta línea sirve para declarar la propiedad «stroke» con el valor o tipo «LogoStroke».
  stroke: LogoStroke;
  // Esta línea sirve para declarar la propiedad «color» con el valor o tipo «string».
  color: string;
  // Esta línea sirve para declarar la propiedad «clock» con el valor o tipo «SharedValue<number>».
  clock: SharedValue<number>;
  /** Tramo del reloj en el que la forma se dibuja. */
  // Esta línea sirve para declarar la propiedad «draw» con el valor o tipo «readonly [number, number]».
  draw: readonly [number, number];
  /** Cuándo aparece la punta de luz. */
  // Esta línea sirve para declarar la propiedad «headIn» con el valor o tipo «readonly [number, number]».
  headIn: readonly [number, number];
  /** Cuándo el trazo se apaga para dejar solo el logo relleno. */
  // Esta línea sirve para declarar la propiedad «fadeOut» con el valor o tipo «readonly [number, number]».
  fadeOut: readonly [number, number];
}

/** Una forma del logo: halo suave + trazo nítido que se "escribe" con strokeDashoffset, y la punta de luz que lo va dibujando. */
// Esta línea sirve para declarar la función «DrawnStroke».
export function DrawnStroke({ stroke, color, clock, draw, headIn, fadeOut }: DrawnStrokeProps) {
  // Esta línea sirve para extraer «length» de «stroke».
  const { length } = stroke;

  // Esta línea sirve para obtener «lineProps» con el hook «useAnimatedProps».
  const lineProps = useAnimatedProps(() => {
    // Esta línea sirve para declarar «t» con el valor «clock.value».
    const t = clock.value;
    // Esta línea sirve para declarar «p» con el valor «easeDraw(progress(t, draw))».
    const p = easeDraw(progress(t, draw));
    // Esta línea sirve para devolver «{».
    return {
      // Esta línea sirve para declarar la propiedad «strokeDashoffset» con el valor o tipo «length * (1 - p)».
      strokeDashoffset: length * (1 - p),
      // Esta línea sirve para declarar la propiedad «strokeOpacity» con el valor o tipo «(p > 0 ? 1 : 0) * (1 - progress(t, fadeOut))».
      strokeOpacity: (p > 0 ? 1 : 0) * (1 - progress(t, fadeOut)),
    };
  });

  // Esta línea sirve para obtener «haloProps» con el hook «useAnimatedProps».
  const haloProps = useAnimatedProps(() => {
    // Esta línea sirve para declarar «t» con el valor «clock.value».
    const t = clock.value;
    // Esta línea sirve para declarar «p» con el valor «easeDraw(progress(t, draw))».
    const p = easeDraw(progress(t, draw));
    // Esta línea sirve para devolver «{».
    return {
      // Esta línea sirve para declarar la propiedad «strokeDashoffset» con el valor o tipo «length * (1 - p)».
      strokeDashoffset: length * (1 - p),
      // Esta línea sirve para definir «strokeOpacity» con «(p > 0 ? 0.35 : 0) * (1 - progress(t, fa…».
      strokeOpacity: (p > 0 ? 0.35 : 0) * (1 - progress(t, fadeOut)),
    };
  });

  // Esta línea sirve para obtener «headProps» con el hook «useAnimatedProps».
  const headProps = useAnimatedProps(() => {
    // Esta línea sirve para declarar «t» con el valor «clock.value».
    const t = clock.value;
    // Esta línea sirve para declarar «p» con el valor «easeDraw(progress(t, draw))».
    const p = easeDraw(progress(t, draw));
    // Esta línea sirve para extraer «x, y» de «pointAt(stroke, p)».
    const { x, y } = pointAt(stroke, p);
    // Se enciende en `headIn` y se apaga al terminar de dibujar su forma.
    // Esta línea sirve para extraer «ppea» de «progress(t, headIn)».
    const appear = progress(t, headIn);
    // Esta línea sirve para extraer «ad» de «1 - progress(t, [draw[1] - 120, draw[1] ».
    const fade = 1 - progress(t, [draw[1] - 120, draw[1] + 80]);
    // Esta línea sirve para devolver «{ cx: x, cy: y, opacity: appear * fade }».
    return { cx: x, cy: y, opacity: appear * fade };
  });

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para abrir el elemento «AnimatedPath» con sus atributos en varias líneas. */}
      <AnimatedPath
        // Esta línea sirve para pasar la propiedad «d» con el valor «stroke.d}».
        d={stroke.d}
        // Esta línea sirve para definir el atributo «fill» con el valor «none».
        fill="none"
        // Esta línea sirve para pasar la propiedad «stroke» con el valor «color}».
        stroke={color}
        // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «4.5}».
        strokeWidth={4.5}
        // Esta línea sirve para definir el atributo «strokeLinecap» con el valor «round».
        strokeLinecap="round"
        // Esta línea sirve para definir el atributo «strokeLinejoin» con el valor «round».
        strokeLinejoin="round"
        // Esta línea sirve para pasar la propiedad «strokeDasharray» con el valor «[length, length]}».
        strokeDasharray={[length, length]}
        // Esta línea sirve para pasar la propiedad «animatedProps» con el valor «haloProps}».
        animatedProps={haloProps}
      />
      {/* Esta línea sirve para abrir el elemento «AnimatedPath» con sus atributos en varias líneas. */}
      <AnimatedPath
        // Esta línea sirve para pasar la propiedad «d» con el valor «stroke.d}».
        d={stroke.d}
        // Esta línea sirve para definir el atributo «fill» con el valor «none».
        fill="none"
        // Esta línea sirve para pasar la propiedad «stroke» con el valor «color}».
        stroke={color}
        // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «1.5}».
        strokeWidth={1.5}
        // Esta línea sirve para definir el atributo «strokeLinecap» con el valor «round».
        strokeLinecap="round"
        // Esta línea sirve para definir el atributo «strokeLinejoin» con el valor «round».
        strokeLinejoin="round"
        // Esta línea sirve para pasar la propiedad «strokeDasharray» con el valor «[length, length]}».
        strokeDasharray={[length, length]}
        // Esta línea sirve para pasar la propiedad «animatedProps» con el valor «lineProps}».
        animatedProps={lineProps}
      />
      {/* Esta línea sirve para abrir el componente «AnimatedCircle». */}
      <AnimatedCircle r={4} fill={color} opacity={0} animatedProps={headProps} />
      {/* Esta línea sirve para abrir el componente «AnimatedCircle». */}
      <AnimatedCircle r={1.8} fill="#FFFFFF" opacity={0} animatedProps={headProps} />
    </>
  );
}
