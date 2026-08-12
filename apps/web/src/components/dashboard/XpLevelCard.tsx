import { motion } from "framer-motion"
import type { GamificationSummary } from "@sanken/core"

interface XpLevelCardProps {
  summary?: GamificationSummary
  isLoading: boolean
}

export function XpLevelCard({ summary, isLoading }: XpLevelCardProps) {
  const progressPct = Math.round((summary?.progress_pct ?? 0) * 100)

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {isLoading ? "Nivel…" : `Nivel ${summary?.level ?? 1}`}
        </p>
        <p className="text-xs text-muted-foreground">
          {isLoading ? "" : `${summary?.total_xp ?? 0} / ${summary?.xp_for_next_level ?? 100} XP`}
        </p>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
      </div>
    </div>
  )
}
