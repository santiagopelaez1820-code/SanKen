import { ProgressBar } from "react-bootstrap"
import { cn } from "@/lib/utils"

interface SankProgressProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  className?: string
  variant?: "primary" | "success" | "warning" | "danger"
}

export function SankProgress({
  value,
  max = 100,
  label,
  showValue = true,
  className,
  variant = "primary",
}: SankProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={cn("d-flex flex-column gap-1", className)}>
      {(label || showValue) && (
        <div className="d-flex justify-content-between align-items-baseline">
          {label && <span className="small text-body-secondary">{label}</span>}
          {showValue && (
            <span className="small fw-semibold sank-tabular-nums">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <ProgressBar now={pct} variant={variant === "primary" ? undefined : variant} />
    </div>
  )
}
