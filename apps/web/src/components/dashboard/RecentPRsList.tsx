import type { PersonalRecordSummary } from "@sanken/core"

export function RecentPRsList({ records }: { records: PersonalRecordSummary[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-heading text-sm font-medium text-foreground">Récords personales recientes</h2>

      {records.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no hay récords registrados.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {records.map((record) => (
            <li key={record.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-foreground">{record.exercise_name}</span>
              <span className="flex items-center gap-2">
                <span className="font-medium text-primary">{record.value} kg</span>
                <span className="text-xs text-muted-foreground">{record.achieved_at}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
