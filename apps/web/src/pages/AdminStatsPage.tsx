// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «AdminStats» desde «@sanken/core».
import type { AdminStats } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «StatTile» desde «@/components/dashboard/StatTile».
import { StatTile } from "@/components/dashboard/StatTile"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la función «AdminStatsPage».
export function AdminStatsPage() {
  // Esta línea sirve para obtener «data: stats, isLoading» con el hook «useQuery».
  const { data: stats, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "stats"]».
    queryKey: ["admin", "stats"],
    // Esta línea sirve para pedir a la API los datos de «/admin/stats».
    queryFn: () => api.get<AdminStats>("/admin/stats"),
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Métricas globales» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Métricas globales</h1>

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton className="h-20 w-full" />}

        {/* Esta línea sirve para mostrar el bloque solo si «stats». */}
        {stats && (
          // Esta línea sirve para abrir el elemento «section» con las clases «grid grid-cols-2 gap-4 sm:grid-cols-3».
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {/* Esta línea sirve para abrir el componente «StatTile». */}
            <StatTile label="Usuarios totales" value={`${stats.total_users}`} />
            {/* Esta línea sirve para abrir el componente «StatTile». */}
            <StatTile label="Nuevos (7 días)" value={`${stats.new_users_7d}`} />
            {/* Esta línea sirve para abrir el componente «StatTile». */}
            <StatTile label="Entrenadores" value={`${stats.trainers_count}`} />
            {/* Esta línea sirve para abrir el componente «StatTile». */}
            <StatTile label="Baneados" value={`${stats.banned_users_count}`} />
            {/* Esta línea sirve para abrir el componente «StatTile». */}
            <StatTile label="Reportes pendientes" value={`${stats.pending_reports_count}`} />
            {/* Esta línea sirve para abrir el componente «StatTile». */}
            <StatTile label="Retención (30d→7d)" value={`${stats.retention_pct}%`} />
            {/* Esta línea sirve para abrir el componente «StatTile». */}
            <StatTile label="DAU" value={`${stats.dau}`} hint="Activos hoy" />
            {/* Esta línea sirve para abrir el componente «StatTile». */}
            <StatTile label="WAU" value={`${stats.wau}`} hint="Activos en 7 días" />
            {/* Esta línea sirve para abrir el componente «StatTile». */}
            <StatTile label="MAU" value={`${stats.mau}`} hint="Activos en 30 días" />
          </section>
        )}
      </div>
    </main>
  )
}
