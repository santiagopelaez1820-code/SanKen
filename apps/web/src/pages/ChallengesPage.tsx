import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { Challenge } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ChallengeCard } from "@/components/challenges/ChallengeCard"

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
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Retos</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Volver</Link>
          </Button>
        </header>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}

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
