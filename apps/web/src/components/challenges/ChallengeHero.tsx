import { motion } from "framer-motion"
import type { Challenge } from "@sanken/core"
import { SankButton } from "@/components/ui/SankButton"
import { ChallengeLeaderboard } from "@/components/challenges/ChallengeLeaderboard"

const METRIC_LABEL: Record<Challenge["criteria"]["metric"], string> = {
  workouts_count: "entrenamientos",
  total_volume_kg: "kg de volumen",
}

function daysRemaining(endsAt: string): number {
  const ms = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

interface ChallengeHeroProps {
  challenge: Challenge
  expanded: boolean
  onToggle: () => void
  onJoin: () => void
}

export function ChallengeHero({ challenge, expanded, onToggle, onJoin }: ChallengeHeroProps) {
  const progressPct = challenge.progress_value !== null
    ? Math.min(100, Math.round((challenge.progress_value / challenge.criteria.target) * 100))
    : 0
  const daysLeft = daysRemaining(challenge.ends_at)

  return (
    <div
      className="position-relative overflow-hidden rounded-2 sank-hairline p-4 p-sm-5 text-center"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, rgba(0,184,217,0.16), transparent 60%), var(--sanken-black-2)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 28px 60px -24px rgba(0,0,0,0.7)",
      }}
    >
      <p className="sank-eyebrow sank-eyebrow--cyan mb-2">
        {challenge.type === "weekly" ? "Reto semanal" : "Reto mensual"}
      </p>
      <h1 className="display-4 sank-stat mb-2">{challenge.title}</h1>
      <p className="text-body-secondary mx-auto mb-4" style={{ maxWidth: 440 }}>
        {challenge.description}
      </p>

      <p className="sank-stat mb-1" style={{ fontSize: "1.75rem", color: challenge.completed ? "var(--sanken-cyan)" : undefined }}>
        {challenge.completed ? "¡Completado!" : `${daysLeft} días restantes`}
      </p>

      {challenge.joined && (
        <div className="mx-auto mt-3" style={{ maxWidth: 480 }}>
          <div className="rounded-pill overflow-hidden" style={{ height: 10, background: "var(--sanken-charcoal)" }}>
            <motion.div
              style={{ height: "100%", background: "linear-gradient(90deg, var(--sanken-cyan-deep), var(--sanken-cyan-light))" }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
          </div>
          <p className="small text-body-secondary mt-2 mb-0 sank-tabular-nums">
            {challenge.progress_value ?? 0} / {challenge.criteria.target} {METRIC_LABEL[challenge.criteria.metric]} · {progressPct}%
          </p>
        </div>
      )}

      <div className="mt-4">
        {challenge.joined ? (
          <SankButton variant="outline" onClick={onToggle}>
            {expanded ? "Ocultar ranking" : "Ver ranking"}
          </SankButton>
        ) : (
          <SankButton variant="primary" size="lg" onClick={onJoin}>
            Unirme al reto
          </SankButton>
        )}
      </div>

      {expanded && (
        <div className="mt-4 pt-4 text-start" style={{ borderTop: "1px solid var(--bs-border-color)" }}>
          <ChallengeLeaderboard challengeId={challenge.id} />
        </div>
      )}
    </div>
  )
}
