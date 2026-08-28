import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Container } from "react-bootstrap"
import { Flag } from "lucide-react"
import type { Challenge } from "@sanken/core"
import { api } from "@/lib/api"
import { ChallengeCard } from "@/components/challenges/ChallengeCard"
import { ChallengeHero } from "@/components/challenges/ChallengeHero"
import { Skeleton } from "@/components/ui/skeleton"
import { SankEmptyState } from "@/components/ui/SankEmptyState"
import { fadeInUp, staggerContainer } from "@/lib/motion"

export function ChallengesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => api.get<Challenge[]>("/challenges"),
  })

  const join = async (challengeId: number) => {
    await api.post(`/challenges/${challengeId}/join`)
    queryClient.invalidateQueries({ queryKey: ["challenges"] })
  }

  const sorted = [...(challenges ?? [])].sort(
    (a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime()
  )
  const current = sorted.find((c) => c.joined && !c.completed) ?? sorted[0]
  const rest = sorted.filter((c) => c.id !== current?.id)

  return (
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 1080 }}>
      <motion.div className="d-flex flex-column gap-4" variants={staggerContainer()} initial="hidden" animate="show">
        <motion.div variants={fadeInUp}>
          <p className="sank-eyebrow sank-eyebrow--cyan mb-1">Comunidad</p>
          <h1 className="display-5 sank-stat mb-0">Retos</h1>
        </motion.div>

        {isLoading && <Skeleton style={{ height: 260, width: "100%" }} />}

        {!isLoading && sorted.length === 0 && (
          <div className="sank-surface rounded-2">
            <SankEmptyState icon={Flag} title="No hay retos activos" description="Cuando se abra un reto nuevo, va a aparecer acá." />
          </div>
        )}

        {current && (
          <motion.div variants={fadeInUp}>
            <ChallengeHero
              challenge={current}
              expanded={expandedId === current.id}
              onToggle={() => setExpandedId((id) => (id === current.id ? null : current.id))}
              onJoin={() => join(current.id)}
            />
          </motion.div>
        )}

        {rest.length > 0 && (
          <motion.div variants={fadeInUp}>
            <p className="sank-eyebrow mb-3">Otros retos</p>
            <div className="row g-3">
              {rest.map((challenge) => (
                <div key={challenge.id} className="col-12 col-sm-6 col-lg-4">
                  <ChallengeCard
                    challenge={challenge}
                    expanded={expandedId === challenge.id}
                    onToggle={() => setExpandedId((id) => (id === challenge.id ? null : challenge.id))}
                    onJoin={() => join(challenge.id)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </Container>
  )
}
