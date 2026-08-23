import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MetricRingProps {
  /** Progreso actual, 0..max */
  value: number
  max: number
  /** Color del trazo — lima (progreso) o cyan (entrenamiento/actividad) */
  color?: "primary" | "secondary-accent"
  size?: number
  strokeWidth?: number
  label: string
  valueLabel: string
  /** Halo sutil detrás del ring — reservado para el hero principal, no para rings secundarios */
  glow?: boolean
  className?: string
}

export function MetricRing({
  value,
  max,
  color = "primary",
  size = 120,
  strokeWidth = 10,
  label,
  valueLabel,
  glow = false,
  className,
}: MetricRingProps) {
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeColor = color === "primary" ? "var(--primary)" : "var(--secondary-accent)"

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {glow && (
          <div
            className="absolute inset-0 rounded-full opacity-30 blur-xl"
            style={{ backgroundColor: strokeColor }}
            aria-hidden
          />
        )}
        <svg width={size} height={size} className="relative -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - pct) }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
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
