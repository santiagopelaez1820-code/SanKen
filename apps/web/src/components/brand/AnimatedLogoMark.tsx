import { useReducedMotion } from "framer-motion"
import { LOGO_BLUE, LOGO_K, LOGO_S, LOGO_S_COLOR, LOGO_VIEWBOX, type LogoStroke } from "@sanken/core"

/**
 * Isotipo SK que se redibuja en bucle sobre su contorno real (la geometría
 * vive en @sanken/core, extraída del PNG del logo) — el mismo efecto de la
 * intro de la app móvil. Usa animaciones SVG nativas (SMIL): un solo
 * reloj de documento sincroniza trazo, punta de luz y relleno, sin
 * JavaScript por frame. El logo nunca desaparece del todo: se atenúa, el
 * trazo lo vuelve a dibujar y queda quieto la mayor parte del ciclo.
 */

const CYCLE_MS = 5600
const DUR = `${CYCLE_MS / 1000}s`
const GHOST_OPACITY = 0.12
const EASE = ".65 0 .35 1"
const LINEAR = "0 0 1 1"

/** Fracción del ciclo (0..1) para un instante en ms — formato de keyTimes. */
const k = (ms: number) => (ms / CYCLE_MS).toFixed(4)

const VIEWBOX = `${LOGO_VIEWBOX.x} ${LOGO_VIEWBOX.y} ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`

interface StrokeTiming {
  draw: [number, number]
  headIn: [number, number]
}

const S_TIMING: StrokeTiming = { draw: [350, 1150], headIn: [250, 400] }
const K_TIMING: StrokeTiming = { draw: [900, 1450], headIn: [900, 960] }
const FILL_GHOST: [number, number] = [0, 350]
const FILL_BACK: [number, number] = [1350, 1750]
const STROKE_OUT: [number, number] = [1600, 1950]

const STROKE_ON_DARK = { s: "#F5F7FA", k: "#4A7DFF" }
const STROKE_ON_LIGHT = { s: "#0B0B0B", k: "#1D4FE0" }

interface AnimatedLogoMarkProps {
  /** Ancho en px; el alto sale de la proporción real del isotipo. */
  width: number
  /** Fondo claro: S con contorno oscuro y trazo oscuro, como el logo real sobre blanco. */
  onLight?: boolean
}

export function AnimatedLogoMark({ width, onLight = false }: AnimatedLogoMarkProps) {
  const reduceMotion = useReducedMotion()
  const height = (width * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width
  const colors = onLight ? STROKE_ON_LIGHT : STROKE_ON_DARK

  const fill = (
    <>
      <path
        d={LOGO_S.d}
        fill={LOGO_S_COLOR}
        stroke={onLight ? "#0B0B0B" : undefined}
        strokeWidth={onLight ? 1.6 : undefined}
        strokeLinejoin="round"
      />
      <path d={LOGO_K.d} fill={LOGO_BLUE} />
    </>
  )

  return (
    <svg width={width} height={height} viewBox={VIEWBOX} role="img" aria-label="Logo de SanKen">
      {reduceMotion ? (
        fill
      ) : (
        <>
          <g>
            {fill}
            <animate
              attributeName="opacity"
              dur={DUR}
              repeatCount="indefinite"
              values={`1;${GHOST_OPACITY};${GHOST_OPACITY};1;1`}
              keyTimes={`0;${k(FILL_GHOST[1])};${k(FILL_BACK[0])};${k(FILL_BACK[1])};1`}
            />
          </g>
          <DrawnStroke stroke={LOGO_S} color={colors.s} timing={S_TIMING} />
          <DrawnStroke stroke={LOGO_K} color={colors.k} timing={K_TIMING} />
        </>
      )}
    </svg>
  )
}

/** Halo + trazo que se escribe (stroke-dashoffset con pathLength=1) + punta de luz que recorre el contorno (animateMotion). */
function DrawnStroke({ stroke, color, timing }: { stroke: LogoStroke; color: string; timing: StrokeTiming }) {
  const [drawStart, drawEnd] = timing.draw
  const dashKeyTimes = `0;${k(drawStart)};${k(drawEnd)};1`
  const visibleKeyTimes = `0;${k(drawStart)};${k(drawStart + 1)};${k(STROKE_OUT[0])};${k(STROKE_OUT[1])};1`
  const headKeyTimes = `0;${k(timing.headIn[0])};${k(timing.headIn[1])};${k(drawEnd - 120)};${k(drawEnd + 80)};1`

  const line = (strokeWidth: number, maxOpacity: number) => (
    <path
      d={stroke.d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1}
      opacity={0}
    >
      <animate
        attributeName="stroke-dashoffset"
        dur={DUR}
        repeatCount="indefinite"
        values="1;1;0;0"
        keyTimes={dashKeyTimes}
        calcMode="spline"
        keySplines={`${LINEAR};${EASE};${LINEAR}`}
      />
      <animate
        attributeName="opacity"
        dur={DUR}
        repeatCount="indefinite"
        values={`0;0;${maxOpacity};${maxOpacity};0;0`}
        keyTimes={visibleKeyTimes}
      />
    </path>
  )

  return (
    <>
      {line(4.5, 0.35)}
      {line(1.5, 1)}
      <g opacity={0}>
        <circle r={4} fill={color} />
        <circle r={1.8} fill="#FFFFFF" />
        <animateMotion
          dur={DUR}
          repeatCount="indefinite"
          path={stroke.d}
          keyPoints="0;0;1;1"
          keyTimes={dashKeyTimes}
          calcMode="spline"
          keySplines={`${LINEAR};${EASE};${LINEAR}`}
        />
        <animate
          attributeName="opacity"
          dur={DUR}
          repeatCount="indefinite"
          values="0;0;1;1;0;0"
          keyTimes={headKeyTimes}
        />
      </g>
    </>
  )
}
