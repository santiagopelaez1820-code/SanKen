// Esta línea sirve para importar «memo, useEffect, useLayoutEffect, useRef, useState» desde «react».
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react"

// Esta línea sirve para declarar la interfaz «RulerSliderProps».
interface RulerSliderProps {
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «number | null».
  value: number | null
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(value: number) => void».
  onChange: (value: number) => void
  // Esta línea sirve para declarar la propiedad «min» con el valor o tipo «number».
  min?: number
  // Esta línea sirve para declarar la propiedad «max» con el valor o tipo «number».
  max?: number
  // Esta línea sirve para declarar la propiedad «step» con el valor o tipo «number».
  step?: number
  // Esta línea sirve para declarar la propiedad «unit» con el valor o tipo «string».
  unit?: string
  /** Cada cuántos pasos va una marca larga con número (10 × 0.5 kg = cada 5 kg). */
  // Esta línea sirve para declarar la propiedad «labelEvery» con el valor o tipo «number».
  labelEvery?: number
}

/** Separación en px entre marcas — 8px por paso deja 0.5 kg fáciles de apuntar. */
// Esta línea sirve para definir la separación entre las marcas de la regla.
const TICK_SPACING = 8

// Esta línea sirve para declarar la función que redondea al múltiplo de paso más cercano.
function roundToStep(n: number, step: number) {
  // Esta línea sirve para devolver el valor redondeado.
  return Math.round(n / step) * step
}

// Esta línea sirve para declarar la función que da formato al valor.
function formatValue(n: number) {
  // Esta línea sirve para mostrar entero o con un decimal sin el .0 final.
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "")
}

/**
 * Regla horizontal deslizable para cargar el peso de la serie — reemplaza
 * los botones −/+ a pedido del tester (misma interacción que
 * apps/mobile/src/components/ui/ruler-slider.tsx). Se arrastra con el dedo
 * o la rueda/trackpad; con teclado, flechas ±0.5 y PageUp/PageDown ±5.
 */
// Esta línea sirve para declarar el componente de regla deslizante.
export function RulerSlider({
  // Esta línea sirve para incluir el valor «value» en la lista.
  value,
  // Esta línea sirve para incluir el valor «onChange» en la lista.
  onChange,
  // Esta línea sirve para incluir el valor «min» en la lista.
  min = 0,
  // Esta línea sirve para incluir el valor «max» en la lista.
  max = 300,
  // Esta línea sirve para incluir el valor «step» en la lista.
  step = 0.5,
  // Esta línea sirve para incluir el valor «unit» en la lista.
  unit,
  // Esta línea sirve para incluir el valor «labelEvery» en la lista.
  labelEvery = 10,
// Esta línea sirve para cerrar los parámetros del componente.
}: RulerSliderProps) {
  // Esta línea sirve para crear la referencia «scrollRef».
  const scrollRef = useRef<HTMLDivElement>(null)
  // Esta línea sirve para guardar el ancho del contenedor.
  const [width, setWidth] = useState(0)
  // Esta línea sirve para crear la referencia «lastEmitted».
  const lastEmitted = useRef<number | null>(value)
  // Esta línea sirve para crear la referencia «positionedForWidth».
  const positionedForWidth = useRef(0)

  // Esta línea sirve para calcular el valor actual limitado al rango y al paso.
  const current = Math.min(max, Math.max(min, roundToStep(value ?? min, step)))
  // Esta línea sirve para calcular la cantidad de marcas.
  const tickCount = Math.round((max - min) / step) + 1
  // Esta línea sirve para declarar la función que calcula la posición de un valor.
  const offsetFor = (v: number) => ((v - min) / step) * TICK_SPACING
  // Esta línea sirve para declarar la función que limita un valor al rango.
  const clamp = (v: number) => Math.min(max, Math.max(min, roundToStep(v, step)))

  // Esta línea sirve para declarar el efecto que mide el ancho antes de pintar.
  useLayoutEffect(() => {
    // Esta línea sirve para obtener el elemento de scroll.
    const el = scrollRef.current
    // Esta línea sirve para salir si no existe.
    if (!el) return
    // Esta línea sirve para crear el observador que actualiza el ancho al cambiar de tamaño.
    const observer = new ResizeObserver(() => setWidth(el.clientWidth))
    // Esta línea sirve para empezar a observar el elemento.
    observer.observe(el)
    // Esta línea sirve para guardar el ancho inicial.
    setWidth(el.clientWidth)
    // Esta línea sirve para devolver la función que deja de observar.
    return () => observer.disconnect()
  // Esta línea sirve para ejecutar el efecto una sola vez.
  }, [])

  // Valor cambiado desde afuera (sugerencia al pasar de ejercicio, teclado):
  // mover la regla. Si vino del propio scroll, no se toca.
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para obtener el elemento de scroll.
    const el = scrollRef.current
    // Esta línea sirve para salir si no existe o no hay ancho.
    if (!el || !width) return
    // Esta línea sirve para calcular si es la primera posición para este ancho.
    const firstPosition = positionedForWidth.current !== width
    // Esta línea sirve para salir si el valor no cambió desde la última emisión.
    if (!firstPosition && lastEmitted.current === current) return
    // Esta línea sirve para recordar el ancho ya posicionado.
    positionedForWidth.current = width
    // Esta línea sirve para recordar el último valor emitido.
    lastEmitted.current = current
    // Esta línea sirve para desplazar la regla hasta el valor actual.
    el.scrollLeft = offsetFor(current)
    // Esta línea sirve para volver a ejecutar el efecto si cambian el valor o el ancho.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, width])

  // Esta línea sirve para declarar la función que emite un valor nuevo.
  const emit = (next: number) => {
    // Esta línea sirve para salir si el valor ya fue emitido.
    if (next === lastEmitted.current) return
    // Esta línea sirve para recordar el valor emitido.
    lastEmitted.current = next
    // Esta línea sirve para avisar al padre del nuevo valor.
    onChange(next)
  }

  // Esta línea sirve para declarar el manejador del scroll.
  const handleScroll = () => {
    // Esta línea sirve para obtener el elemento de scroll.
    const el = scrollRef.current
    // Esta línea sirve para salir si no existe.
    if (!el) return
    // Esta línea sirve para calcular y emitir el valor según la posición de scroll.
    emit(clamp(min + Math.round(el.scrollLeft / TICK_SPACING) * step))
  }

  // Esta línea sirve para declarar la función que mueve el valor en pasos.
  const nudge = (delta: number) => {
    // Esta línea sirve para calcular el nuevo valor limitado al rango.
    const next = clamp(current + delta)
    // Esta línea sirve para forzar el reposicionamiento en el efecto.
    lastEmitted.current = null // fuerza el reposicionamiento en el efecto
    // Esta línea sirve para avisar al padre del nuevo valor.
    onChange(next)
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «overflow-hidden rounded-xl bg-muted/60 p».
    <div className="overflow-hidden rounded-xl bg-muted/60 pt-2 pb-1">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-baseline justify-center gap-1». */}
      <div className="flex items-baseline justify-center gap-1">
        {/* Esta línea sirve para mostrar el valor actual. */}
        <span className="font-heading text-3xl font-extrabold tabular-nums">{formatValue(current)}</span>
        {/* Esta línea sirve para mostrar el elemento solo si «unit». */}
        {unit && <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{unit}</span>}
      </div>

      {/* Esta línea sirve para abrir el elemento «div» con las clases «relative h-14». */}
      <div className="relative h-14">
        {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
        <div
          // Esta línea sirve para conectar la referencia «scrollRef}» con el elemento.
          ref={scrollRef}
          // Esta línea sirve para definir el atributo «role» con el valor «slider».
          role="slider"
          // Esta línea sirve para pasar la propiedad «tabIndex» con el valor «0}».
          tabIndex={0}
          // Esta línea sirve para pasar la propiedad «aria-label» con el valor «unit ? `Valor en ${unit}` : "Valor"}».
          aria-label={unit ? `Valor en ${unit}` : "Valor"}
          // Esta línea sirve para pasar la propiedad «aria-valuemin» con el valor «min}».
          aria-valuemin={min}
          // Esta línea sirve para pasar la propiedad «aria-valuemax» con el valor «max}».
          aria-valuemax={max}
          // Esta línea sirve para pasar la propiedad «aria-valuenow» con el valor «current}».
          aria-valuenow={current}
          // Esta línea sirve para pasar la propiedad «aria-valuetext» con el valor «`${formatValue(current)} ${unit ?? ""}`.trim(».
          aria-valuetext={`${formatValue(current)} ${unit ?? ""}`.trim()}
          // Esta línea sirve para asignar el manejador del evento «onScroll».
          onScroll={handleScroll}
          // Esta línea sirve para asignar el manejador del evento «onKeyDown».
          onKeyDown={(e) => {
            // Esta línea sirve para declarar el desplazamiento de cada tecla.
            const deltas: Record<string, number> = {
              // Esta línea sirve para declarar la propiedad «ArrowRight» con el valor o tipo «step».
              ArrowRight: step,
              // Esta línea sirve para declarar la propiedad «ArrowUp» con el valor o tipo «step».
              ArrowUp: step,
              // Esta línea sirve para declarar la propiedad «ArrowLeft» con el valor o tipo «-step».
              ArrowLeft: -step,
              // Esta línea sirve para declarar la propiedad «ArrowDown» con el valor o tipo «-step».
              ArrowDown: -step,
              // Esta línea sirve para declarar la propiedad «PageUp» con el valor o tipo «step * labelEvery».
              PageUp: step * labelEvery,
              // Esta línea sirve para declarar la propiedad «PageDown» con el valor o tipo «-step * labelEvery».
              PageDown: -step * labelEvery,
            }
            // Esta línea sirve para revisar si la tecla pulsada tiene un desplazamiento.
            if (e.key in deltas) {
              // Esta línea sirve para evitar el comportamiento por defecto de la tecla.
              e.preventDefault()
              // Esta línea sirve para mover el valor según la tecla.
              nudge(deltas[e.key])
            }
          }}
          // Esta línea sirve para aplicar las clases de estilo «h-full snap-x snap-mandatory overflow-x-auto ».
          className="h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-scrollbar]:hidden"
        >
          {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
          <div
            // Esta línea sirve para aplicar las clases de estilo «flex h-full items-start».
            className="flex h-full items-start"
            // Centro de la marca i bajo el indicador cuando scrollLeft = i × TICK_SPACING.
            // Esta línea sirve para pasar la propiedad «style» con el valor «{ paddingLeft: width / 2 - TICK_SPACING / 2, ».
            style={{ paddingLeft: width / 2 - TICK_SPACING / 2, paddingRight: width / 2 - TICK_SPACING / 2 }}
          >
            {/* Esta línea sirve para abrir el componente «Ticks». */}
            <Ticks count={tickCount} min={min} step={step} labelEvery={labelEvery} />
          </div>
        </div>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «pointer-events-none absolute top-0 left-». */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-7 w-[3px] -translate-x-1/2 rounded-full bg-primary" />
      </div>
    </div>
  )
}

/** Memoizado: son cientos de marcas y no dependen del valor actual. */
// Esta línea sirve para declarar el componente memoizado de las marcas.
const Ticks = memo(function Ticks({
  // Esta línea sirve para incluir el valor «count» en la lista.
  count,
  // Esta línea sirve para incluir el valor «min» en la lista.
  min,
  // Esta línea sirve para incluir el valor «step» en la lista.
  step,
  // Esta línea sirve para incluir el valor «labelEvery» en la lista.
  labelEvery,
// Esta línea sirve para abrir los tipos de las propiedades.
}: {
  // Esta línea sirve para declarar la propiedad «count» con el valor o tipo «number».
  count: number
  // Esta línea sirve para declarar la propiedad «min» con el valor o tipo «number».
  min: number
  // Esta línea sirve para declarar la propiedad «step» con el valor o tipo «number».
  step: number
  // Esta línea sirve para declarar la propiedad «labelEvery» con el valor o tipo «number».
  labelEvery: number
// Esta línea sirve para cerrar los tipos y abrir el cuerpo.
}) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para crear una marca por cada posición. */}
      {Array.from({ length: count }, (_, i) => {
        // Esta línea sirve para calcular si la marca es principal.
        const isMajor = i % labelEvery === 0
        // Esta línea sirve para calcular si la marca es intermedia.
        const isMid = !isMajor && i % (labelEvery / 2) === 0
        // Esta línea sirve para devolver la interfaz del componente.
        return (
          // Esta línea sirve para abrir el elemento «div».
          <div key={i} className="relative flex shrink-0 snap-center flex-col items-center" style={{ width: TICK_SPACING }}>
            {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
            <div
              // Esta línea sirve para aplicar las clases de estilo «w-0.5 rounded-full bg-muted-foreground».
              className="w-0.5 rounded-full bg-muted-foreground"
              // Esta línea sirve para pasar la propiedad «style» con el valor «{ height: isMajor ? 24 : isMid ? 16 : 10, opa».
              style={{ height: isMajor ? 24 : isMid ? 16 : 10, opacity: isMajor ? 0.9 : 0.45 }}
            />
            {/* Esta línea sirve para mostrar el bloque solo si «isMajor». */}
            {isMajor && (
              // Esta línea sirve para abrir el elemento «span» con las clases «absolute top-[26px] w-10 text-center tex».
              <span className="absolute top-[26px] w-10 text-center text-[11px] text-muted-foreground tabular-nums">
                {/* Esta línea sirve para mostrar el valor de la marca. */}
                {formatValue(min + i * step)}
              </span>
            )}
          </div>
        )
      })}
    </>
  )
})
