import type { Challenge } from "@sanken/core"
import { SankButton } from "@/components/ui/SankButton"
import { SankProgress } from "@/components/ui/SankProgress"
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
  return (
    <div className="sank-surface rounded-2 p-4 h-100 d-flex flex-column">
      <p className="sank-eyebrow mb-1">{challenge.type === "weekly" ? "Semanal" : "Mensual"}</p>
      <p className="fw-bold fs-6 mb-1">{challenge.title}</p>
      <p className="small text-body-secondary flex-grow-1">{challenge.description}</p>

      {challenge.joined && (
        <>
          <SankProgress
            value={challenge.progress_value ?? 0}
            max={challenge.criteria.target}
            label={`${challenge.progress_value ?? 0} / ${challenge.criteria.target} ${METRIC_LABEL[challenge.criteria.metric]}`}
            showValue={!challenge.completed}
            className="mb-1"
          />
          {challenge.completed && (
            <p className="small fw-bold mb-2" style={{ color: "var(--sanken-orange)" }}>¡Completado!</p>
          )}
        </>
      )}

      <div className="d-flex gap-2 mt-2">
        {challenge.joined ? (
          <SankButton variant="outline" size="sm" onClick={onToggle} className="flex-grow-1 justify-content-center">
            {expanded ? "Ocultar tabla" : "Ver tabla"}
          </SankButton>
        ) : (
          <SankButton size="sm" onClick={onJoin} className="flex-grow-1 justify-content-center">
            Unirme
          </SankButton>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--bs-border-color)" }}>
          <ChallengeLeaderboard challengeId={challenge.id} />
        </div>
      )}
    </div>
  )
}
