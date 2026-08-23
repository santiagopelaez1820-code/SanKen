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
    return (
      <div className="row g-2">
        <div className="col-5"><Skeleton style={{ height: 132, width: "100%" }} /></div>
        <div className="col-7"><Skeleton style={{ height: 132, width: "100%" }} /></div>
      </div>
    )
  }

  const progressPct = Math.round((gamification?.progress_pct ?? 0) * 100)

  return (
    <div className="row g-2">
      <div className="col-12 col-sm-5">
        <div className="sank-surface rounded-2 h-100 p-4 d-flex align-items-center gap-3">
          <MetricRing
            value={gamification?.progress_pct ?? 0}
            max={1}
            size={72}
            strokeWidth={6}
            label=""
            valueLabel={`${gamification?.level ?? 1}`}
          />
          <div>
            <p className="sank-eyebrow mb-1">Nivel · {progressPct}%</p>
            <p className="small text-body-secondary mb-0">
              {gamification?.total_xp ?? 0} / {gamification?.xp_for_next_level ?? 100} XP
            </p>
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-7">
        <div className="sank-surface rounded-2 h-100 p-4 d-flex align-items-center justify-content-between">
          <div>
            <div className="display-6 sank-stat">{stats?.current_streak_days ?? 0}</div>
            <p className="sank-eyebrow mb-0">Racha</p>
          </div>
          <div>
            <div className="display-6 sank-stat">{stats?.total_sets ?? 0}</div>
            <p className="sank-eyebrow mb-0">Series</p>
          </div>
          <div>
            <div className="display-6 sank-stat">{stats?.total_hours ?? 0}</div>
            <p className="sank-eyebrow mb-0">Horas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
