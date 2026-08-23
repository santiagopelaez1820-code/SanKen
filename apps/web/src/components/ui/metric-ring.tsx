import { motion } from "framer-motion"

interface MetricRingProps {
  /** Progreso actual, 0..max */
  value: number
  max: number
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

  return (
    <div className={`d-flex flex-column align-items-center gap-2 ${className ?? ""}`}>
      <div className="position-relative" style={{ width: size, height: size }}>
        {glow && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
            style={{ background: "var(--sanken-orange)", opacity: 0.25, filter: "blur(20px)" }}
            aria-hidden
          />
        )}
        <svg width={size} height={size} className="position-relative" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--sanken-orange)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - pct) }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
          />
        </svg>
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center">
          <span className="fw-bold fs-5 sank-tabular-nums">{valueLabel}</span>
        </div>
      </div>
      <span className="small fw-semibold text-uppercase text-body-secondary" style={{ letterSpacing: "0.08em", fontSize: "0.68rem" }}>
        {label}
      </span>
    </div>
  )
}
