// Esta línea sirve para importar «useReducedMotion» desde «framer-motion».
import { useReducedMotion } from "framer-motion"
// Esta línea sirve para importar «LOGO_BLUE, LOGO_K, LOGO_S, LOGO_S_COLOR, LOGO_VIEWBOX, type LogoStroke» desde «@sanken/core».
import { LOGO_BLUE, LOGO_K, LOGO_S, LOGO_S_COLOR, LOGO_VIEWBOX, type LogoStroke } from "@sanken/core"

/**
 * Isotipo SK que se redibuja en bucle sobre su contorno real (la geometría
 * vive en @sanken/core, extraída del PNG del logo) — el mismo efecto de la
 * intro de la app móvil. Usa animaciones SVG nativas (SMIL): un solo
 * reloj de documento sincroniza trazo, punta de luz y relleno, sin
 * JavaScript por frame. El logo nunca desaparece del todo: se atenúa, el
 * trazo lo vuelve a dibujar y queda quieto la mayor parte del ciclo.
 */

// Esta línea sirve para definir la duración del ciclo de animación en milisegundos.
const CYCLE_MS = 5600
// Esta línea sirve para convertir la duración a segundos para SVG.
const DUR = `${CYCLE_MS / 1000}s`
// Esta línea sirve para definir la opacidad del logo mientras se dibuja el trazo.
const GHOST_OPACITY = 0.12
// Esta línea sirve para definir la curva de aceleración de la animación.
const EASE = ".65 0 .35 1"
// Esta línea sirve para definir la curva lineal de la animación.
const LINEAR = "0 0 1 1"

/** Fracción del ciclo (0..1) para un instante en ms — formato de keyTimes. */
// Esta línea sirve para declarar la función que convierte milisegundos en fracción del ciclo.
const k = (ms: number) => (ms / CYCLE_MS).toFixed(4)

// Esta línea sirve para construir el viewBox del SVG con las medidas del logo.
const VIEWBOX = `${LOGO_VIEWBOX.x} ${LOGO_VIEWBOX.y} ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`

// Esta línea sirve para declarar la interfaz «StrokeTiming».
interface StrokeTiming {
  // Esta línea sirve para declarar la propiedad «draw» con el valor o tipo «[number, number]».
  draw: [number, number]
  // Esta línea sirve para declarar la propiedad «headIn» con el valor o tipo «[number, number]».
  headIn: [number, number]
}

// Esta línea sirve para definir los tiempos de dibujo del trazo de la S.
const S_TIMING: StrokeTiming = { draw: [350, 1150], headIn: [250, 400] }
// Esta línea sirve para definir los tiempos de dibujo del trazo de la K.
const K_TIMING: StrokeTiming = { draw: [900, 1450], headIn: [900, 960] }
// Esta línea sirve para definir el intervalo en que el relleno se vuelve fantasma.
const FILL_GHOST: [number, number] = [0, 350]
// Esta línea sirve para definir el intervalo en que el relleno regresa.
const FILL_BACK: [number, number] = [1350, 1750]
// Esta línea sirve para definir el intervalo en que el trazo desaparece.
const STROKE_OUT: [number, number] = [1600, 1950]

// Esta línea sirve para definir los colores del trazo sobre fondo oscuro.
const STROKE_ON_DARK = { s: "#F5F7FA", k: "#4A7DFF" }
// Esta línea sirve para definir los colores del trazo sobre fondo claro.
const STROKE_ON_LIGHT = { s: "#0B0B0B", k: "#1D4FE0" }

// Esta línea sirve para declarar la interfaz «AnimatedLogoMarkProps».
interface AnimatedLogoMarkProps {
  /** Ancho en px; el alto sale de la proporción real del isotipo. */
  // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «number».
  width: number
  /** Fondo claro: S con contorno oscuro y trazo oscuro, como el logo real sobre blanco. */
  // Esta línea sirve para declarar la propiedad «onLight» con el valor o tipo «boolean».
  onLight?: boolean
}

// Esta línea sirve para declarar el componente del logo animado.
export function AnimatedLogoMark({ width, onLight = false }: AnimatedLogoMarkProps) {
  // Esta línea sirve para obtener «reduceMotion» con el hook «useReducedMotion».
  const reduceMotion = useReducedMotion()
  // Esta línea sirve para calcular el alto manteniendo la proporción del logo.
  const height = (width * LOGO_VIEWBOX.height) / LOGO_VIEWBOX.width
  // Esta línea sirve para elegir los colores según el fondo.
  const colors = onLight ? STROKE_ON_LIGHT : STROKE_ON_DARK

  // Esta línea sirve para crear el relleno del logo, usado como logo fijo o fantasma.
  const fill = (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para abrir el elemento «path» con sus atributos en varias líneas. */}
      <path
        // Esta línea sirve para pasar la propiedad «d» con el valor «LOGO_S.d}».
        d={LOGO_S.d}
        // Esta línea sirve para pasar la propiedad «fill» con el valor «LOGO_S_COLOR}».
        fill={LOGO_S_COLOR}
        // Esta línea sirve para pasar la propiedad «stroke» con el valor «onLight ? "#0B0B0B" : undefined}».
        stroke={onLight ? "#0B0B0B" : undefined}
        // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «onLight ? 1.6 : undefined}».
        strokeWidth={onLight ? 1.6 : undefined}
        // Esta línea sirve para definir el atributo «strokeLinejoin» con el valor «round».
        strokeLinejoin="round"
      />
      {/* Esta línea sirve para abrir el elemento «path». */}
      <path d={LOGO_K.d} fill={LOGO_BLUE} />
    </>
  )

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «svg».
    <svg width={width} height={height} viewBox={VIEWBOX} role="img" aria-label="Logo de SanKen">
      {/* Esta línea sirve para elegir entre dos bloques según «reduceMotion». */}
      {reduceMotion ? (
        // Esta línea sirve para mostrar solo el relleno si el usuario prefiere menos movimiento.
        fill
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
        <>
          {/* Esta línea sirve para abrir el elemento «g». */}
          <g>
            {/* Esta línea sirve para mostrar el valor «fill». */}
            {fill}
            {/* Esta línea sirve para abrir el elemento «animate» con sus atributos en varias líneas. */}
            <animate
              // Esta línea sirve para definir el atributo «attributeName» con el valor «opacity».
              attributeName="opacity"
              // Esta línea sirve para pasar la propiedad «dur» con el valor «DUR}».
              dur={DUR}
              // Esta línea sirve para definir el atributo «repeatCount» con el valor «indefinite».
              repeatCount="indefinite"
              // Esta línea sirve para pasar la propiedad «values» con el valor «`1;${GHOST_OPACITY};${GHOST_OPACITY};1;1`}».
              values={`1;${GHOST_OPACITY};${GHOST_OPACITY};1;1`}
              // Esta línea sirve para pasar la propiedad «keyTimes» con el valor «`0;${k(FILL_GHOST[1])};${k(FILL_BACK[0])};${k».
              keyTimes={`0;${k(FILL_GHOST[1])};${k(FILL_BACK[0])};${k(FILL_BACK[1])};1`}
            />
          </g>
          {/* Esta línea sirve para abrir el componente «DrawnStroke». */}
          <DrawnStroke stroke={LOGO_S} color={colors.s} timing={S_TIMING} />
          {/* Esta línea sirve para abrir el componente «DrawnStroke». */}
          <DrawnStroke stroke={LOGO_K} color={colors.k} timing={K_TIMING} />
        </>
      )}
    </svg>
  )
}

/** Halo + trazo que se escribe (stroke-dashoffset con pathLength=1) + punta de luz que recorre el contorno (animateMotion). */
// Esta línea sirve para declarar el componente que anima el dibujo de un trazo.
function DrawnStroke({ stroke, color, timing }: { stroke: LogoStroke; color: string; timing: StrokeTiming }) {
  // Esta línea sirve para obtener el inicio y el fin del dibujo.
  const [drawStart, drawEnd] = timing.draw
  // Esta línea sirve para calcular los tiempos de la animación del trazo.
  const dashKeyTimes = `0;${k(drawStart)};${k(drawEnd)};1`
  // Esta línea sirve para calcular los tiempos de visibilidad del trazo.
  const visibleKeyTimes = `0;${k(drawStart)};${k(drawStart + 1)};${k(STROKE_OUT[0])};${k(STROKE_OUT[1])};1`
  // Esta línea sirve para calcular los tiempos de la cabeza luminosa.
  const headKeyTimes = `0;${k(timing.headIn[0])};${k(timing.headIn[1])};${k(drawEnd - 120)};${k(drawEnd + 80)};1`

  // Esta línea sirve para declarar la función que dibuja una capa del trazo.
  const line = (strokeWidth: number, maxOpacity: number) => (
    // Esta línea sirve para abrir el elemento «path» con sus atributos en varias líneas.
    <path
      // Esta línea sirve para pasar la propiedad «d» con el valor «stroke.d}».
      d={stroke.d}
      // Esta línea sirve para definir el atributo «fill» con el valor «none».
      fill="none"
      // Esta línea sirve para pasar la propiedad «stroke» con el valor «color}».
      stroke={color}
      // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «strokeWidth}».
      strokeWidth={strokeWidth}
      // Esta línea sirve para definir el atributo «strokeLinecap» con el valor «round».
      strokeLinecap="round"
      // Esta línea sirve para definir el atributo «strokeLinejoin» con el valor «round».
      strokeLinejoin="round"
      // Esta línea sirve para pasar la propiedad «pathLength» con el valor «1}».
      pathLength={1}
      // Esta línea sirve para definir el atributo «strokeDasharray» con el valor «1 1».
      strokeDasharray="1 1"
      // Esta línea sirve para pasar la propiedad «strokeDashoffset» con el valor «1}».
      strokeDashoffset={1}
      // Esta línea sirve para pasar la propiedad «opacity» con el valor «0}».
      opacity={0}
    >
      {/* Esta línea sirve para abrir el elemento «animate» con sus atributos en varias líneas. */}
      <animate
        // Esta línea sirve para definir el atributo «attributeName» con el valor «stroke-dashoffset».
        attributeName="stroke-dashoffset"
        // Esta línea sirve para pasar la propiedad «dur» con el valor «DUR}».
        dur={DUR}
        // Esta línea sirve para definir el atributo «repeatCount» con el valor «indefinite».
        repeatCount="indefinite"
        // Esta línea sirve para definir el atributo «values» con el valor «1;1;0;0».
        values="1;1;0;0"
        // Esta línea sirve para pasar la propiedad «keyTimes» con el valor «dashKeyTimes}».
        keyTimes={dashKeyTimes}
        // Esta línea sirve para definir el atributo «calcMode» con el valor «spline».
        calcMode="spline"
        // Esta línea sirve para pasar la propiedad «keySplines» con el valor «`${LINEAR};${EASE};${LINEAR}`}».
        keySplines={`${LINEAR};${EASE};${LINEAR}`}
      />
      {/* Esta línea sirve para abrir el elemento «animate» con sus atributos en varias líneas. */}
      <animate
        // Esta línea sirve para definir el atributo «attributeName» con el valor «opacity».
        attributeName="opacity"
        // Esta línea sirve para pasar la propiedad «dur» con el valor «DUR}».
        dur={DUR}
        // Esta línea sirve para definir el atributo «repeatCount» con el valor «indefinite».
        repeatCount="indefinite"
        // Esta línea sirve para pasar la propiedad «values» con el valor «`0;0;${maxOpacity};${maxOpacity};0;0`}».
        values={`0;0;${maxOpacity};${maxOpacity};0;0`}
        // Esta línea sirve para pasar la propiedad «keyTimes» con el valor «visibleKeyTimes}».
        keyTimes={visibleKeyTimes}
      />
    </path>
  )

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para dibujar la capa de brillo ancha y tenue. */}
      {line(4.5, 0.35)}
      {/* Esta línea sirve para dibujar la línea nítida del trazo. */}
      {line(1.5, 1)}
      {/* Esta línea sirve para abrir el elemento «g». */}
      <g opacity={0}>
        {/* Esta línea sirve para abrir el elemento «circle». */}
        <circle r={4} fill={color} />
        {/* Esta línea sirve para abrir el elemento «circle». */}
        <circle r={1.8} fill="#FFFFFF" />
        {/* Esta línea sirve para abrir el elemento «animateMotion» con sus atributos en varias líneas. */}
        <animateMotion
          // Esta línea sirve para pasar la propiedad «dur» con el valor «DUR}».
          dur={DUR}
          // Esta línea sirve para definir el atributo «repeatCount» con el valor «indefinite».
          repeatCount="indefinite"
          // Esta línea sirve para pasar la propiedad «path» con el valor «stroke.d}».
          path={stroke.d}
          // Esta línea sirve para definir el atributo «keyPoints» con el valor «0;0;1;1».
          keyPoints="0;0;1;1"
          // Esta línea sirve para pasar la propiedad «keyTimes» con el valor «dashKeyTimes}».
          keyTimes={dashKeyTimes}
          // Esta línea sirve para definir el atributo «calcMode» con el valor «spline».
          calcMode="spline"
          // Esta línea sirve para pasar la propiedad «keySplines» con el valor «`${LINEAR};${EASE};${LINEAR}`}».
          keySplines={`${LINEAR};${EASE};${LINEAR}`}
        />
        {/* Esta línea sirve para abrir el elemento «animate» con sus atributos en varias líneas. */}
        <animate
          // Esta línea sirve para definir el atributo «attributeName» con el valor «opacity».
          attributeName="opacity"
          // Esta línea sirve para pasar la propiedad «dur» con el valor «DUR}».
          dur={DUR}
          // Esta línea sirve para definir el atributo «repeatCount» con el valor «indefinite».
          repeatCount="indefinite"
          // Esta línea sirve para definir el atributo «values» con el valor «0;0;1;1;0;0».
          values="0;0;1;1;0;0"
          // Esta línea sirve para pasar la propiedad «keyTimes» con el valor «headKeyTimes}».
          keyTimes={headKeyTimes}
        />
      </g>
    </>
  )
}
