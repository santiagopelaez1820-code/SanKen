import { useQuery } from "@tanstack/react-query"
import type { AdminStats } from "@sanken/core"
import { api } from "@/lib/api"
import { StatTile } from "@/components/dashboard/StatTile"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminStatsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api.get<AdminStats>("/admin/stats"),
  })

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Métricas globales</h1>

        {isLoading && <Skeleton className="h-20 w-full" />}

        {stats && (
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatTile label="Usuarios totales" value={`${stats.total_users}`} />
            <StatTile label="Nuevos (7 días)" value={`${stats.new_users_7d}`} />
            <StatTile label="Entrenadores" value={`${stats.trainers_count}`} />
            <StatTile label="Baneados" value={`${stats.banned_users_count}`} />
            <StatTile label="Reportes pendientes" value={`${stats.pending_reports_count}`} />
            <StatTile label="Retención (30d→7d)" value={`${stats.retention_pct}%`} />
            <StatTile label="DAU" value={`${stats.dau}`} hint="Activos hoy" />
            <StatTile label="WAU" value={`${stats.wau}`} hint="Activos en 7 días" />
            <StatTile label="MAU" value={`${stats.mau}`} hint="Activos en 30 días" />
          </section>
        )}
      </div>
    </main>
  )
}
