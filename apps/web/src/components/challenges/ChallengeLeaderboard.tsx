import { useEffect, useState } from "react"
import type { ChallengeLeaderboardEntry, ChallengeLeaderboardResponse, ChallengeProgressBroadcast } from "@sanken/core"
import { api } from "@/lib/api"
import { getEcho } from "@/lib/echo"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Carga inicial por HTTP (GET .../leaderboard) y después se suscribe al
 * canal privado `challenges.{id}` por Reverb para actualizaciones en vivo
 * (evento `progress.updated`) — la carga inicial existe porque el
 * websocket solo empuja cambios futuros, no el estado actual al conectar.
 */
export function ChallengeLeaderboard({ challengeId }: { challengeId: number }) {
  const [entries, setEntries] = useState<ChallengeLeaderboardEntry[] | null>(null)

  useEffect(() => {
    let cancelled = false

    api
      .get<ChallengeLeaderboardResponse>(`/challenges/${challengeId}/leaderboard`)
      .then((res) => {
        if (!cancelled) setEntries(res.entries)
      })
      .catch(() => {
        if (!cancelled) setEntries([])
      })

    const echo = getEcho()
    const channel = echo.private(`challenges.${challengeId}`)
    channel.listen(".progress.updated", (payload: ChallengeProgressBroadcast) => {
      setEntries(payload.leaderboard)
    })

    return () => {
      cancelled = true
      echo.leave(`challenges.${challengeId}`)
    }
  }, [challengeId])

  if (entries === null) {
    return <Skeleton className="h-20 w-full" />
  }

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía nadie tiene progreso en este reto.</p>
  }

  return (
    <ul className="divide-y divide-border">
      {entries.map((entry) => (
        <li
          key={entry.user_id}
          className={cn(
            "flex items-center justify-between py-2.5 text-sm",
            entry.is_viewer && "-mx-2 rounded-lg bg-primary/5 px-2 font-medium"
          )}
        >
          <span className="flex items-center gap-3">
            <span className="w-6 text-right text-xs text-muted-foreground">{entry.rank}</span>
            <span className="text-foreground">{entry.user_name}</span>
            {entry.completed && <span className="text-xs text-primary">✓</span>}
          </span>
          <span className="font-medium text-primary">{entry.progress_value.toLocaleString("es-AR")}</span>
        </li>
      ))}
    </ul>
  )
}
