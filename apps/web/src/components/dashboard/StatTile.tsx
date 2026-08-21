interface StatTileProps {
  label: string
  value: string
  hint?: string
}

export function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1.5 font-heading text-4xl font-bold tracking-tight text-foreground tabular-nums">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
