import Animated, { Easing, useAnimatedProps, type SharedValue } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { LOGO_BLUE, LOGO_K, LOGO_S, LOGO_S_COLOR, LOGO_VIEWBOX, type LogoStroke } from '@sanken/core';

/**
 * Piezas compartidas del "logo que se dibuja": las usan la intro de
 * apertura (brand-intro.tsx) y la tarjeta de marca de Inicio
 * (animated-logo-mark.tsx). Todo se deriva de un reloj en ms (SharedValue)
 * en el hilo de UI — sin renders de React por frame.
 */

/** viewBox del recorte del isotipo dentro del canvas de 256×256. */
export const LOGO_CROP_VIEWBOX = `${LOGO_VIEWBOX.x} ${LOGO_VIEWBOX.y} ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`;

/** Trazo luminoso de cada forma sobre fondo oscuro. */
export const STROKE_ON_DARK = { s: '#F5F7FA', k: '#4A7DFF' } as const;
/** Sobre fondo claro la S se traza oscura (en el logo real lleva contorno negro). */
export const STROKE_ON_LIGHT = { s: '#0B0B0B', k: '#1D4FE0' } as const;

export const easeDraw = Easing.inOut(Easing.cubic);
export const easeOut = Easing.out(Easing.cubic);

export function progress(t: number, [start, end]: readonly [number, number]) {
  'worklet';
  if (end <= start) return t >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (t - start) / (end - start)));
}

/** Punto exacto a una fracción `p` del recorrido de la polilínea — la punta de luz sigue el contorno real. */
export function pointAt(stroke: LogoStroke, p: number) {
  'worklet';
  const target = p * stroke.length;
  const { points, cumulative } = stroke;
  for (let i = 1; i < points.length; i++) {
    if (cumulative[i] >= target) {
      const segment = cumulative[i] - cumulative[i - 1] || 1;
      const f = (target - cumulative[i - 1]) / segment;
      return {
        x: points[i - 1][0] + (points[i][0] - points[i - 1][0]) * f,
        y: points[i - 1][1] + (points[i][1] - points[i - 1][1]) * f,
      };
    }
  }
  return { x: points[0][0], y: points[0][1] };
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface LogoFillProps {
  width: number;
  height: number;
  viewBox: string;
  /**
   * Contorno oscuro en la S — como el logo real sobre fondo claro
   * (logo-full.png). Sin él, la S blanca desaparece en modo claro.
   */
  outlined?: boolean;
}

/** Isotipo SK relleno con los colores del logo real (S blanca, K azul de marca). */
export function LogoFill({ width, height, viewBox, outlined = false }: LogoFillProps) {
  return (
    <Svg width={width} height={height} viewBox={viewBox}>
      <Path
        d={LOGO_S.d}
        fill={LOGO_S_COLOR}
        stroke={outlined ? '#0B0B0B' : undefined}
        strokeWidth={outlined ? 1.6 : undefined}
        strokeLinejoin="round"
      />
      <Path d={LOGO_K.d} fill={LOGO_BLUE} />
    </Svg>
  );
}

interface DrawnStrokeProps {
  stroke: LogoStroke;
  color: string;
  clock: SharedValue<number>;
  /** Tramo del reloj en el que la forma se dibuja. */
  draw: readonly [number, number];
  /** Cuándo aparece la punta de luz. */
  headIn: readonly [number, number];
  /** Cuándo el trazo se apaga para dejar solo el logo relleno. */
  fadeOut: readonly [number, number];
}

/** Una forma del logo: halo suave + trazo nítido que se "escribe" con strokeDashoffset, y la punta de luz que lo va dibujando. */
export function DrawnStroke({ stroke, color, clock, draw, headIn, fadeOut }: DrawnStrokeProps) {
  const { length } = stroke;

  const lineProps = useAnimatedProps(() => {
    const t = clock.value;
    const p = easeDraw(progress(t, draw));
    return {
      strokeDashoffset: length * (1 - p),
      strokeOpacity: (p > 0 ? 1 : 0) * (1 - progress(t, fadeOut)),
    };
  });

  const haloProps = useAnimatedProps(() => {
    const t = clock.value;
    const p = easeDraw(progress(t, draw));
    return {
      strokeDashoffset: length * (1 - p),
      strokeOpacity: (p > 0 ? 0.35 : 0) * (1 - progress(t, fadeOut)),
    };
  });

  const headProps = useAnimatedProps(() => {
    const t = clock.value;
    const p = easeDraw(progress(t, draw));
    const { x, y } = pointAt(stroke, p);
    // Se enciende en `headIn` y se apaga al terminar de dibujar su forma.
    const appear = progress(t, headIn);
    const fade = 1 - progress(t, [draw[1] - 120, draw[1] + 80]);
    return { cx: x, cy: y, opacity: appear * fade };
  });

  return (
    <>
      <AnimatedPath
        d={stroke.d}
        fill="none"
        stroke={color}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={[length, length]}
        animatedProps={haloProps}
      />
      <AnimatedPath
        d={stroke.d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={[length, length]}
        animatedProps={lineProps}
      />
      <AnimatedCircle r={4} fill={color} opacity={0} animatedProps={headProps} />
      <AnimatedCircle r={1.8} fill="#FFFFFF" opacity={0} animatedProps={headProps} />
    </>
  );
}
