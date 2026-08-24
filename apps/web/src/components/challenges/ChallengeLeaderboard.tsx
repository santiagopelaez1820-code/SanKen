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
    return <Skeleton style={{ height: 80, width: "100%" }} />
  }

  if (entries.length === 0) {
    return <p className="small text-body-secondary mb-0">Todavía nadie tiene progreso en este reto.</p>
  }

  return (
    <ul className="list-unstyled mb-0">
      {entries.map((entry) => (
        <li
          key={entry.user_id}
          className={cn(
            "d-flex align-items-center justify-content-between py-2 px-2 rounded-1",
            entry.is_viewer && "fw-semibold"
          )}
          style={entry.is_viewer ? { background: "var(--sanken-orange-dim)" } : undefined}
        >
          <span className="d-flex align-items-center gap-3">
            <span className="text-body-secondary sank-tabular-nums" style={{ width: 20, textAlign: "right", fontSize: "0.75rem" }}>
              {entry.rank}
            </span>
            <span className="small">{entry.user_name}</span>
            {entry.completed && <span className="small" style={{ color: "var(--sanken-orange)" }}>✓</span>}
          </span>
          <span className="small fw-semibold sank-tabular-nums" style={{ color: "var(--sanken-orange-light)" }}>
            {entry.progress_value.toLocaleString("es-AR")}
          </span>
        </li>
      ))}
    </ul>
  )
}
