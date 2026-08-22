import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { Challenge } from "@sanken/core"
import { api } from "@/lib/api"
import { ChallengeCard } from "@/components/challenges/ChallengeCard"
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

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Retos</h1>

        {isLoading && <Skeleton className="h-20 w-full" />}

        {!isLoading && challenges?.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay retos activos en este momento.</p>
        )}

        <div className="flex flex-col gap-4">
          {challenges?.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              expanded={expandedId === challenge.id}
              onToggle={() => setExpandedId((current) => (current === challenge.id ? null : challenge.id))}
              onJoin={() => join(challenge.id)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
