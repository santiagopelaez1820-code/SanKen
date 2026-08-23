import { motion } from "framer-motion"
import { Flame } from "lucide-react"
import type { Challenge } from "@sanken/core"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
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
    <GlassCard tone="lime" className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
            <Flame className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Tu desafío actual</p>
            <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">{challenge.title}</h2>
          </div>
        </div>
        {challenge.joined ? (
          <Button variant="outline" size="sm" onClick={onToggle}>
            {expanded ? "Ocultar tabla" : "Ver tabla"}
          </Button>
        ) : (
          <Button variant="emphasis" size="sm" onClick={onJoin}>
            Unirme
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{challenge.description}</p>

      {challenge.joined && (
        <div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary shadow-[0_0_12px_rgba(207,255,54,0.6)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              {challenge.progress_value ?? 0} / {challenge.criteria.target} {METRIC_LABEL[challenge.criteria.metric]}
            </p>
            {challenge.completed ? (
              <p className="text-sm font-bold text-primary">¡Completado!</p>
            ) : (
              <p className="text-sm text-muted-foreground">{daysLeft} días restantes</p>
            )}
          </div>
        </div>
      )}

      {!challenge.joined && <p className="text-sm text-muted-foreground">{daysLeft} días restantes</p>}

      {expanded && (
        <div className="border-t border-border pt-4">
          <ChallengeLeaderboard challengeId={challenge.id} />
        </div>
      )}
    </GlassCard>
  )
}
