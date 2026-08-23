import { Medal } from "lucide-react"
import type { RankingEntry } from "@sanken/core"
import { cn } from "@/lib/utils"

const MEDAL_COLORS: Record<number, string> = { 1: "#D4AF37", 2: "#A8A9AD", 3: "#B08D57" }

function RankBadge({ rank }: { rank: number }) {
  const color = MEDAL_COLORS[rank]
  if (!color) return <span className="w-7 text-right text-sm text-muted-foreground">{rank}</span>
  return (
    <span className="flex w-7 justify-end">
      <Medal className="size-4" style={{ color }} />
    </span>
  )
}

export function ExerciseRankingList({ entries, viewer }: { entries: RankingEntry[]; viewer: RankingEntry | null }) {
  const viewerOutsideEntries = viewer && !entries.some((e) => e.user_id === viewer.user_id)

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay suficientes récords públicos para este ranking.</p>
      ) : (
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
                <RankBadge rank={entry.rank} />
                <span className="text-foreground">{entry.user_name}</span>
              </span>
              <span className="font-medium text-primary">{entry.metric_value.toLocaleString("es-AR")} kg</span>
            </li>
          ))}
        </ul>
      )}

      {viewerOutsideEntries && (
        <div className="mt-3 flex items-center justify-between border-t border-dashed border-border pt-2.5 text-sm font-medium">
          <span className="flex items-center gap-3">
            <RankBadge rank={viewer.rank} />
            <span className="text-foreground">Tu posición</span>
          </span>
          <span className="text-primary">{viewer.metric_value.toLocaleString("es-AR")} kg</span>
        </div>
      )}
    </div>
  )
}
