import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { Challenge } from "@sanken/core"
import { api } from "@/lib/api"
import { ChallengeCard } from "@/components/challenges/ChallengeCard"
import { ChallengeHero } from "@/components/challenges/ChallengeHero"
import { Skeleton } from "@/components/ui/skeleton"

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
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Retos</h1>

        {isLoading && <Skeleton className="h-40 w-full" />}

        {!isLoading && sorted.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay retos activos en este momento.</p>
        )}

        {current && (
          <ChallengeHero
            challenge={current}
            expanded={expandedId === current.id}
            onToggle={() => setExpandedId((id) => (id === current.id ? null : current.id))}
            onJoin={() => join(current.id)}
          />
        )}

        {rest.length > 0 && (
          <div className="flex flex-col gap-4">
            {rest.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                expanded={expandedId === challenge.id}
                onToggle={() => setExpandedId((id) => (id === challenge.id ? null : challenge.id))}
                onJoin={() => join(challenge.id)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
