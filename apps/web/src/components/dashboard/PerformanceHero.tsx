import { Flame } from "lucide-react"
import type { DashboardStats, GamificationSummary } from "@sanken/core"
import { GlassCard } from "@/components/ui/glass-card"
import { MetricRing } from "@/components/ui/metric-ring"
import { Skeleton } from "@/components/ui/skeleton"

interface PerformanceHeroProps {
  stats?: DashboardStats
  gamification?: GamificationSummary
  isLoading: boolean
}

export function PerformanceHero({ stats, gamification, isLoading }: PerformanceHeroProps) {
  if (isLoading) {
    return <Skeleton className="h-44 w-full" />
  }

  const progressPct = Math.round((gamification?.progress_pct ?? 0) * 100)

  return (
    <GlassCard tone="lime" className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <MetricRing
        value={gamification?.progress_pct ?? 0}
        max={1}
        size={104}
        strokeWidth={9}
        color="primary"
        glow
        label="Nivel"
        valueLabel={`${gamification?.level ?? 1}`}
      />

      <div className="flex-1">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Progreso de nivel</p>
        <p className="font-heading text-2xl font-bold tabular-nums text-foreground">{progressPct}%</p>
        <p className="text-sm text-muted-foreground">
          {gamification?.total_xp ?? 0} / {gamification?.xp_for_next_level ?? 100} XP
        </p>
      </div>

      <div className="flex gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/15">
            <Flame className="size-5 text-primary" />
          </div>
          <div>
            <p className="font-heading text-xl font-bold tabular-nums text-foreground">
              {stats?.current_streak_days ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">días de racha</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-heading text-xl font-bold tabular-nums text-foreground">{stats?.total_hours ?? 0} h</p>
          <p className="text-xs text-muted-foreground">entrenadas</p>
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-heading text-xl font-bold tabular-nums text-foreground">
            {((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)} t
          </p>
          <p className="text-xs text-muted-foreground">movidas</p>
        </div>
      </div>
    </GlassCard>
  )
}
