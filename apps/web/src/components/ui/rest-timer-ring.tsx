// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from "react"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «MetricRing» desde «@/components/ui/metric-ring».
import { MetricRing } from "@/components/ui/metric-ring"

// Esta línea sirve para declarar la interfaz «RestTimerRingProps».
interface RestTimerRingProps {
  /** Timestamp (ms) hasta el que se descansa, o null si no hay descanso activo. */
  // Esta línea sirve para declarar la propiedad «restingUntil» con el valor o tipo «number | null».
  restingUntil: number | null
  /** Duración total del descanso en segundos — define el 100% del ring. */
  // Esta línea sirve para declarar la propiedad «totalSeconds» con el valor o tipo «number».
  totalSeconds: number
  // Esta línea sirve para declarar la propiedad «onSkip» con el valor o tipo «() => void».
  onSkip: () => void
}

// Esta línea sirve para declarar el componente del anillo del temporizador de descanso.
export function RestTimerRing({ restingUntil, totalSeconds, onSkip }: RestTimerRingProps) {
  // Esta línea sirve para guardar la hora actual para recalcular el tiempo restante.
  const [now, setNow] = useState(() => Date.now())

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir si no hay descanso activo.
    if (restingUntil === null) return
    // Esta línea sirve para actualizar la hora actual cada segundo.
    const id = setInterval(() => setNow(Date.now()), 1000)
    // Esta línea sirve para detener el intervalo al desmontar.
    return () => clearInterval(id)
  // Esta línea sirve para volver a ejecutar el efecto cuando cambia el descanso.
  }, [restingUntil])

  // Esta línea sirve para evitar mostrar algo si no hay descanso activo.
  if (restingUntil === null) return null

  // Esta línea sirve para calcular los segundos que faltan, nunca negativos.
  const remaining = Math.max(0, Math.round((restingUntil - now) / 1000))
  // Esta línea sirve para calcular los minutos completos.
  const minutes = Math.floor(remaining / 60)
  // Esta línea sirve para calcular los segundos restantes.
  const seconds = remaining % 60

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col items-center gap-3 rounded».
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
      {/* Esta línea sirve para abrir el elemento «MetricRing» con sus atributos en varias líneas. */}
      <MetricRing
        // Esta línea sirve para pasar la propiedad «value» con el valor «remaining}».
        value={remaining}
        // Esta línea sirve para pasar la propiedad «max» con el valor «totalSeconds}».
        max={totalSeconds}
        // Esta línea sirve para pasar la propiedad «size» con el valor «140}».
        size={140}
        // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «10}».
        strokeWidth={10}
        // Esta línea sirve para definir el atributo «label» con el valor «Descanso».
        label="Descanso"
        // Esta línea sirve para pasar la propiedad «valueLabel» con el valor «`${minutes}:${seconds.toString().padStart(2, ».
        valueLabel={`${minutes}:${seconds.toString().padStart(2, "0")}`}
      />
      {/* Esta línea sirve para abrir el componente «Button». */}
      <Button type="button" variant="outline" size="sm" onClick={onSkip}>
        {/* Esta línea sirve para mostrar el texto «Saltar descanso». */}
        Saltar descanso
      </Button>
    </div>
  )
}
