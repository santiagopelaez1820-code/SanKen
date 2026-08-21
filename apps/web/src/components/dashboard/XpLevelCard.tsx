import type { GamificationSummary } from "@sanken/core"
import { ProgressRing } from "@/components/ui/progress-ring"

interface XpLevelCardProps {
  summary?: GamificationSummary
  isLoading: boolean
}

export function XpLevelCard({ summary, isLoading }: XpLevelCardProps) {
  const progressPct = Math.round((summary?.progress_pct ?? 0) * 100)

  return (
    <div className="flex items-center gap-5 rounded-xl border border-border bg-card px-5 py-4">
      <ProgressRing
        value={summary?.progress_pct ?? 0}
        max={1}
        size={84}
        strokeWidth={7}
        color="primary"
        label="Nivel"
        valueLabel={isLoading ? "…" : `${summary?.level ?? 1}`}
      />
      <div>
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Progreso de nivel</p>
        {!isLoading && (
          <>
            <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-foreground">{progressPct}%</p>
            <p className="text-sm text-muted-foreground">
              {`${summary?.total_xp ?? 0} / ${summary?.xp_for_next_level ?? 100} XP`}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
