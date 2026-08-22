import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MetricRing } from "@/components/ui/metric-ring"

interface RestTimerRingProps {
  /** Timestamp (ms) hasta el que se descansa, o null si no hay descanso activo. */
  restingUntil: number | null
  /** Duración total del descanso en segundos — define el 100% del ring. */
  totalSeconds: number
  onSkip: () => void
}

export function RestTimerRing({ restingUntil, totalSeconds, onSkip }: RestTimerRingProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (restingUntil === null) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [restingUntil])

  if (restingUntil === null) return null

  const remaining = Math.max(0, Math.round((restingUntil - now) / 1000))
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
      <MetricRing
        value={remaining}
        max={totalSeconds}
        color="secondary-accent"
        size={140}
        strokeWidth={10}
        label="Descanso"
        valueLabel={`${minutes}:${seconds.toString().padStart(2, "0")}`}
      />
      <Button type="button" variant="outline" size="sm" onClick={onSkip}>
        Saltar descanso
      </Button>
    </div>
  )
}
