import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface RestTimerProps {
  /** Timestamp (ms) hasta el que se descansa, o null si no hay descanso activo. */
  restingUntil: number | null
  onSkip: () => void
}

export function RestTimer({ restingUntil, onSkip }: RestTimerProps) {
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
    <div className="flex items-center justify-between rounded-lg border border-primary/25 bg-primary/8 px-4 py-3">
      <div>
        <p className="text-xs font-medium text-muted-foreground">Descanso</p>
        <p className="font-heading text-xl font-medium tabular-nums text-foreground">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </p>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onSkip}>
        Saltar descanso
      </Button>
    </div>
  )
}
