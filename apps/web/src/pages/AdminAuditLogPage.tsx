import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { AuditLogEntry } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

export function AdminAuditLogPage() {
  const { data: entries, isLoading } = useQuery({
    queryKey: ["admin", "audit-logs"],
    queryFn: () => api.get<AuditLogEntry[]>("/admin/audit-logs"),
  })

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Log de auditoría</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin">Volver</Link>
          </Button>
        </header>

        <section className="rounded-xl border border-border bg-card p-5">
          {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
          {!isLoading && entries?.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin actividad registrada.</p>
          )}
          <ul className="divide-y divide-border">
            {entries?.map((entry) => (
              <li key={entry.id} className="py-2.5 text-sm">
                <p>
                  <span className="font-medium">{entry.causer?.name ?? "Sistema"}</span> — {entry.description}
                  {entry.subject_type && (
                    <span className="text-muted-foreground"> ({entry.subject_type.split("\\").pop()} #{entry.subject_id})</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString("es-AR")}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
