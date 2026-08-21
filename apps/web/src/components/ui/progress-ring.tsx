import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  /** Progreso actual, 0..max */
  value: number
  max: number
  /** Color del trazo — lima (progreso) o cyan (entrenamiento/actividad) */
  color?: "primary" | "secondary-accent"
  size?: number
  strokeWidth?: number
  label: string
  valueLabel: string
  className?: string
}

export function ProgressRing({
  value,
  max,
  color = "primary",
  size = 120,
  strokeWidth = 10,
  label,
  valueLabel,
  className,
}: ProgressRingProps) {
  const [animatedPct, setAnimatedPct] = useState(0)
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeColor = color === "primary" ? "var(--primary)" : "var(--secondary-accent)"

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimatedPct(pct))
    return () => cancelAnimationFrame(frame)
  }, [pct])

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - animatedPct)}
            style={{ transition: "stroke-dashoffset 700ms ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-xl font-bold tabular-nums text-foreground">{valueLabel}</span>
        </div>
      </div>
      <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{label}</span>
    </div>
  )
}
