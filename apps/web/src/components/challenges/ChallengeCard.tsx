import type { Challenge } from "@sanken/core"
import { Button } from "@/components/ui/button"
import { ChallengeLeaderboard } from "@/components/challenges/ChallengeLeaderboard"

const METRIC_LABEL: Record<Challenge["criteria"]["metric"], string> = {
  workouts_count: "entrenamientos",
  total_volume_kg: "kg de volumen",
}

interface ChallengeCardProps {
  challenge: Challenge
  expanded: boolean
  onToggle: () => void
  onJoin: () => void
}

export function ChallengeCard({ challenge, expanded, onToggle, onJoin }: ChallengeCardProps) {
  const progressPct = challenge.progress_value !== null
    ? Math.min(100, Math.round((challenge.progress_value / challenge.criteria.target) * 100))
    : 0

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            {challenge.type === "weekly" ? "Semanal" : "Mensual"}
          </p>
          <h3 className="font-heading text-lg font-medium">{challenge.title}</h3>
          <p className="text-sm text-muted-foreground">{challenge.description}</p>
        </div>
        {challenge.joined ? (
          <Button variant="outline" size="sm" onClick={onToggle}>
            {expanded ? "Ocultar tabla" : "Ver tabla"}
          </Button>
        ) : (
          <Button size="sm" onClick={onJoin}>
            Unirme
          </Button>
        )}
      </div>

      {challenge.joined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {challenge.progress_value ?? 0} / {challenge.criteria.target} {METRIC_LABEL[challenge.criteria.metric]}
            </span>
            {challenge.completed && <span className="font-medium text-primary">¡Completado!</span>}
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {expanded && (
        <div className="mt-4 border-t border-border pt-4">
          <ChallengeLeaderboard challengeId={challenge.id} />
        </div>
      )}
    </div>
  )
}
