import { memo, useEffect, useLayoutEffect, useRef, useState } from "react"

interface RulerSliderProps {
  value: number | null
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  /** Cada cuántos pasos va una marca larga con número (10 × 0.5 kg = cada 5 kg). */
  labelEvery?: number
}

/** Separación en px entre marcas — 8px por paso deja 0.5 kg fáciles de apuntar. */
const TICK_SPACING = 8

function roundToStep(n: number, step: number) {
  return Math.round(n / step) * step
}

function formatValue(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "")
}

/**
 * Regla horizontal deslizable para cargar el peso de la serie — reemplaza
 * los botones −/+ a pedido del tester (misma interacción que
 * apps/mobile/src/components/ui/ruler-slider.tsx). Se arrastra con el dedo
 * o la rueda/trackpad; con teclado, flechas ±0.5 y PageUp/PageDown ±5.
 */
export function RulerSlider({
  value,
  onChange,
  min = 0,
  max = 300,
  step = 0.5,
  unit,
  labelEvery = 10,
}: RulerSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const lastEmitted = useRef<number | null>(value)
  const positionedForWidth = useRef(0)

  const current = Math.min(max, Math.max(min, roundToStep(value ?? min, step)))
  const tickCount = Math.round((max - min) / step) + 1
  const offsetFor = (v: number) => ((v - min) / step) * TICK_SPACING
  const clamp = (v: number) => Math.min(max, Math.max(min, roundToStep(v, step)))

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setWidth(el.clientWidth))
    observer.observe(el)
    setWidth(el.clientWidth)
    return () => observer.disconnect()
  }, [])

  // Valor cambiado desde afuera (sugerencia al pasar de ejercicio, teclado):
  // mover la regla. Si vino del propio scroll, no se toca.
  useEffect(() => {
    const el = scrollRef.current
    if (!el || !width) return
    const firstPosition = positionedForWidth.current !== width
    if (!firstPosition && lastEmitted.current === current) return
    positionedForWidth.current = width
    lastEmitted.current = current
    el.scrollLeft = offsetFor(current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, width])

  const emit = (next: number) => {
    if (next === lastEmitted.current) return
    lastEmitted.current = next
    onChange(next)
  }

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    emit(clamp(min + Math.round(el.scrollLeft / TICK_SPACING) * step))
  }

  const nudge = (delta: number) => {
    const next = clamp(current + delta)
    lastEmitted.current = null // fuerza el reposicionamiento en el efecto
    onChange(next)
  }

  return (
    <div className="overflow-hidden rounded-xl bg-muted/60 pt-2 pb-1">
      <div className="flex items-baseline justify-center gap-1">
        <span className="font-heading text-3xl font-extrabold tabular-nums">{formatValue(current)}</span>
        {unit && <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{unit}</span>}
      </div>

      <div className="relative h-14">
        <div
          ref={scrollRef}
          role="slider"
          tabIndex={0}
          aria-label={unit ? `Valor en ${unit}` : "Valor"}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-valuetext={`${formatValue(current)} ${unit ?? ""}`.trim()}
          onScroll={handleScroll}
          onKeyDown={(e) => {
            const deltas: Record<string, number> = {
              ArrowRight: step,
              ArrowUp: step,
              ArrowLeft: -step,
              ArrowDown: -step,
              PageUp: step * labelEvery,
              PageDown: -step * labelEvery,
            }
            if (e.key in deltas) {
              e.preventDefault()
              nudge(deltas[e.key])
            }
          }}
          className="h-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-scrollbar]:hidden"
        >
          <div
            className="flex h-full items-start"
            // Centro de la marca i bajo el indicador cuando scrollLeft = i × TICK_SPACING.
            style={{ paddingLeft: width / 2 - TICK_SPACING / 2, paddingRight: width / 2 - TICK_SPACING / 2 }}
          >
            <Ticks count={tickCount} min={min} step={step} labelEvery={labelEvery} />
          </div>
        </div>
        <div className="pointer-events-none absolute top-0 left-1/2 h-7 w-[3px] -translate-x-1/2 rounded-full bg-primary" />
      </div>
    </div>
  )
}

/** Memoizado: son cientos de marcas y no dependen del valor actual. */
const Ticks = memo(function Ticks({
  count,
  min,
  step,
  labelEvery,
}: {
  count: number
  min: number
  step: number
  labelEvery: number
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const isMajor = i % labelEvery === 0
        const isMid = !isMajor && i % (labelEvery / 2) === 0
        return (
          <div key={i} className="relative flex shrink-0 snap-center flex-col items-center" style={{ width: TICK_SPACING }}>
            <div
              className="w-0.5 rounded-full bg-muted-foreground"
              style={{ height: isMajor ? 24 : isMid ? 16 : 10, opacity: isMajor ? 0.9 : 0.45 }}
            />
            {isMajor && (
              <span className="absolute top-[26px] w-10 text-center text-[11px] text-muted-foreground tabular-nums">
                {formatValue(min + i * step)}
              </span>
            )}
          </div>
        )
      })}
    </>
  )
})
