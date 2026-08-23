import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Flag } from "lucide-react"
import type { Challenge } from "@sanken/core"
import { api } from "@/lib/api"
import { SankCarousel } from "@/components/ui/SankCarousel"
import { SankCard } from "@/components/ui/SankCard"
import { SankProgress } from "@/components/ui/SankProgress"
import { Skeleton } from "@/components/ui/skeleton"

function daysLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

export function DashboardChallengesRow() {
  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => api.get<Challenge[]>("/challenges"),
  })

  if (isLoading) return <Skeleton style={{ height: 180, width: "100%" }} />
  if (!challenges || challenges.length === 0) return null

  const active = challenges.filter((c) => !c.completed).slice(0, 6)
  if (active.length === 0) return null

  return (
    <SankCarousel
      title="Retos activos"
      itemWidth="260px"
      action={
        <Link to="/challenges" className="small fw-semibold text-uppercase text-decoration-none" style={{ color: "var(--sanken-gold-light)", letterSpacing: "0.04em" }}>
          Ver todos
        </Link>
      }
    >
      {active.map((challenge) => (
        <SankCard
          as={Link}
          to="/challenges"
          interactive
          key={challenge.id}
          className="p-4 h-100 text-decoration-none text-reset d-block"
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <Flag size={14} color="var(--sanken-gold)" />
            <span className="sank-eyebrow mb-0">{challenge.type === "weekly" ? "Semanal" : "Mensual"} · {daysLeft(challenge.ends_at)}d</span>
          </div>
          <p className="fw-bold fs-6 mb-3 text-truncate">{challenge.title}</p>
          {challenge.joined ? (
            <SankProgress
              value={challenge.progress_value ?? 0}
              max={challenge.criteria.target}
              label={`${challenge.progress_value ?? 0} / ${challenge.criteria.target}`}
            />
          ) : (
            <span className="small fw-semibold" style={{ color: "var(--sanken-gold-light)" }}>Unirme →</span>
          )}
        </SankCard>
      ))}
    </SankCarousel>
  )
}
