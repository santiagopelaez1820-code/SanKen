// Esta línea sirve para importar «useEffect, useRef» desde «react».
import { useEffect, useRef } from "react"
// Esta línea sirve para importar «Minus, Plus» desde «lucide-react».
import { Minus, Plus } from "lucide-react"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar la interfaz «StepperProps».
interface StepperProps {
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
  // Esta línea sirve para declarar la propiedad «className» con el valor o tipo «string».
  className?: string
}

// Esta línea sirve para declarar «HOLD_REPEAT_MS» con el valor «120».
const HOLD_REPEAT_MS = 120
// Esta línea sirve para declarar «HOLD_DELAY_MS» con el valor «400».
const HOLD_DELAY_MS = 400

// Esta línea sirve para declarar el componente de selector numérico con botones de sumar y restar.
export function Stepper({ value, onChange, min = 0, max = 999, step = 1, unit, className }: StepperProps) {
  // Esta línea sirve para crear la referencia «holdTimeout».
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Esta línea sirve para crear la referencia «holdInterval».
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // Esta línea sirve para declarar «clamp» con el valor «(n: number) => Math.min(max, Math.max(min, n))».
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  // Esta línea sirve para declarar «current» con el valor «value ?? 0».
  const current = value ?? 0

  // Esta línea sirve para declarar la función que aplica un cambio al valor dentro del rango y del paso.
  const apply = (delta: number) => onChange(clamp(Math.round((current + delta) / step) * step))

  // Esta línea sirve para declarar «startHold» con el valor «(delta: number) => {».
  const startHold = (delta: number) => {
    // Esta línea sirve para llamar a «apply» con «delta».
    apply(delta)
    // Esta línea sirve para asignar «setTimeout(() => {» a «holdTimeout.current».
    holdTimeout.current = setTimeout(() => {
      // Esta línea sirve para asignar «setInterval(() => apply(delta), HOLD_REPEAT_MS)» a «holdInterval.current».
      holdInterval.current = setInterval(() => apply(delta), HOLD_REPEAT_MS)
    // Esta línea sirve para definir la espera antes de repetir el cambio al mantener pulsado.
    }, HOLD_DELAY_MS)
  }

  // Esta línea sirve para declarar «stopHold» con el valor «() => {».
  const stopHold = () => {
    // Esta línea sirve para cancelar la espera pendiente si existe.
    if (holdTimeout.current) clearTimeout(holdTimeout.current)
    // Esta línea sirve para cancelar la repetición si existe.
    if (holdInterval.current) clearInterval(holdInterval.current)
    // Esta línea sirve para asignar «null» a «holdTimeout.current».
    holdTimeout.current = null
    // Esta línea sirve para asignar «null» a «holdInterval.current».
    holdInterval.current = null
  }

  // Esta línea sirve para llamar a «useEffect» con «() => stopHold, []».
  useEffect(() => stopHold, [])

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div».
    <div className={cn("flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 sm:gap-4", className)}>
      {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
      <button
        // Esta línea sirve para definir el atributo «type» con el valor «button».
        type="button"
        // Esta línea sirve para definir el atributo «aria-label» con el valor «Restar».
        aria-label="Restar"
        // Esta línea sirve para asignar el manejador del evento «onPointerDown».
        onPointerDown={() => startHold(-step)}
        // Esta línea sirve para asignar el manejador del evento «onPointerUp».
        onPointerUp={stopHold}
        // Esta línea sirve para asignar el manejador del evento «onPointerLeave».
        onPointerLeave={stopHold}
        // Esta línea sirve para aplicar las clases de estilo «flex size-12 shrink-0 items-center justify-ce».
        className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-muted/70 active:scale-95"
      >
        {/* Esta línea sirve para abrir el componente «Minus». */}
        <Minus className="size-5" />
      </button>

      {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col items-center». */}
      <div className="flex flex-col items-center">
        {/* Esta línea sirve para mostrar el valor actual. */}
        <span className="font-heading text-3xl font-bold tabular-nums text-foreground">{current}</span>
        {/* Esta línea sirve para mostrar el elemento solo si «unit». */}
        {unit && <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{unit}</span>}
      </div>

      {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
      <button
        // Esta línea sirve para definir el atributo «type» con el valor «button».
        type="button"
        // Esta línea sirve para definir el atributo «aria-label» con el valor «Sumar».
        aria-label="Sumar"
        // Esta línea sirve para asignar el manejador del evento «onPointerDown».
        onPointerDown={() => startHold(step)}
        // Esta línea sirve para asignar el manejador del evento «onPointerUp».
        onPointerUp={stopHold}
        // Esta línea sirve para asignar el manejador del evento «onPointerLeave».
        onPointerLeave={stopHold}
        // Esta línea sirve para aplicar las clases de estilo «flex size-12 shrink-0 items-center justify-ce».
        className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95"
      >
        {/* Esta línea sirve para abrir el componente «Plus». */}
        <Plus className="size-5" />
      </button>
    </div>
  )
}
