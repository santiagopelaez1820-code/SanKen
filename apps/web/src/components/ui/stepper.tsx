import { useEffect, useRef } from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperProps {
  value: number | null
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  className?: string
}

const HOLD_REPEAT_MS = 120
const HOLD_DELAY_MS = 400

export function Stepper({ value, onChange, min = 0, max = 999, step = 1, unit, className }: StepperProps) {
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  const current = value ?? 0

  const apply = (delta: number) => onChange(clamp(Math.round((current + delta) / step) * step))

  const startHold = (delta: number) => {
    apply(delta)
    holdTimeout.current = setTimeout(() => {
      holdInterval.current = setInterval(() => apply(delta), HOLD_REPEAT_MS)
    }, HOLD_DELAY_MS)
  }

  const stopHold = () => {
    if (holdTimeout.current) clearTimeout(holdTimeout.current)
    if (holdInterval.current) clearInterval(holdInterval.current)
    holdTimeout.current = null
    holdInterval.current = null
  }

  useEffect(() => stopHold, [])

  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-3", className)}>
      <button
        type="button"
        aria-label="Restar"
        onPointerDown={() => startHold(-step)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-muted/70 active:scale-95"
      >
        <Minus className="size-5" />
      </button>

      <div className="flex flex-col items-center">
        <span className="font-heading text-3xl font-bold tabular-nums text-foreground">{current}</span>
        {unit && <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{unit}</span>}
      </div>

      <button
        type="button"
        aria-label="Sumar"
        onPointerDown={() => startHold(step)}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95"
      >
        <Plus className="size-5" />
      </button>
    </div>
  )
}
