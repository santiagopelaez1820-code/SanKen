import type { LucideIcon } from "lucide-react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: string
  hint?: string
  trend?: { delta: string; direction: "up" | "down" }
  tone?: "primary" | "secondary-accent" | "neutral"
  className?: string
}

const TONE_ICON: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  primary: "text-primary",
  "secondary-accent": "text-secondary-accent",
  neutral: "text-muted-foreground",
}

function MetricCard({ icon: Icon, label, value, hint, trend, tone = "neutral", className }: MetricCardProps) {
  return (
    <Card className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <Icon className={cn("size-5", TONE_ICON[tone])} />
        {trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold tabular-nums",
              trend.direction === "up" ? "text-success" : "text-muted-foreground"
            )}
          >
            {trend.direction === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {trend.delta}
          </span>
        )}
      </div>
      <div>
        <p className="font-heading text-3xl font-bold tracking-tight text-foreground tabular-nums">{value}</p>
        <p className="mt-0.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  )
}

export { MetricCard }
