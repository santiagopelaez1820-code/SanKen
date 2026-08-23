import { Flame } from "lucide-react"
import type { DashboardStats, GamificationSummary } from "@sanken/core"
import { MetricRing } from "@/components/ui/metric-ring"
import { Skeleton } from "@/components/ui/skeleton"

interface PerformanceHeroProps {
  stats?: DashboardStats
  gamification?: GamificationSummary
  isLoading: boolean
}

export function PerformanceHero({ stats, gamification, isLoading }: PerformanceHeroProps) {
  if (isLoading) {
    return <Skeleton style={{ height: 176, width: "100%" }} />
  }

  const progressPct = Math.round((gamification?.progress_pct ?? 0) * 100)

  return (
    <div
      className="sank-surface rounded-4 p-4 p-sm-5 d-flex flex-column flex-sm-row align-items-sm-center gap-4"
      style={{
        background:
          "radial-gradient(120% 160% at 0% 0%, rgba(201,162,39,0.12), transparent 55%), var(--sanken-black-2)",
        border: "1px solid rgba(201,162,39,0.12)",
      }}
    >
      <MetricRing
        value={gamification?.progress_pct ?? 0}
        max={1}
        size={104}
        strokeWidth={9}
        glow
        label="Nivel"
        valueLabel={`${gamification?.level ?? 1}`}
      />

      <div className="flex-grow-1">
        <p className="small fw-semibold text-uppercase text-body-secondary mb-1" style={{ letterSpacing: "0.08em" }}>
          Progreso de nivel
        </p>
        <p className="display-6 fw-bold sank-tabular-nums mb-0">{progressPct}%</p>
        <p className="small text-body-secondary mb-0">
          {gamification?.total_xp ?? 0} / {gamification?.xp_for_next_level ?? 100} XP
        </p>
      </div>

      <div className="d-flex gap-4 gap-sm-5">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{ width: 40, height: 40, background: "var(--sanken-gold-dim)" }}
          >
            <Flame size={20} color="var(--sanken-gold)" />
          </div>
          <div>
            <p className="fs-4 fw-bold sank-tabular-nums mb-0 lh-1">{stats?.current_streak_days ?? 0}</p>
            <p className="small text-body-secondary mb-0">días de racha</p>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-center">
          <p className="fs-4 fw-bold sank-tabular-nums mb-0 lh-1">{stats?.total_hours ?? 0} h</p>
          <p className="small text-body-secondary mb-0">entrenadas</p>
        </div>
        <div className="d-flex flex-column justify-content-center">
          <p className="fs-4 fw-bold sank-tabular-nums mb-0 lh-1">
            {((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)} t
          </p>
          <p className="small text-body-secondary mb-0">movidas</p>
        </div>
      </div>
    </div>
  )
}
