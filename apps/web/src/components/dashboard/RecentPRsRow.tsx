import { Link } from "react-router-dom"
import { Trophy } from "lucide-react"
import type { PersonalRecordSummary } from "@sanken/core"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"

export function RecentPRsRow({ records }: { records: PersonalRecordSummary[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-medium text-foreground">Récords recientes</h2>
        <Link to="/progress" className="text-xs font-medium text-primary hover:underline">
          Ver todos
        </Link>
      </div>

      {records.length === 0 ? (
        <EmptyState icon={Trophy} title="Sin récords todavía" description="Registra tu primer PR desde PR y Rankings." />
      ) : (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {records.slice(0, 6).map((record) => (
            <Card key={record.id} variant="outline" className="flex min-w-36 shrink-0 flex-col gap-1 p-3">
              <Trophy className="size-4 text-primary" />
              <p className="truncate text-xs text-muted-foreground">{record.exercise_name}</p>
              <p className="font-heading text-lg font-bold tabular-nums text-foreground">{record.value} kg</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
