// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «AuditLogEntry» desde «@sanken/core».
import type { AuditLogEntry } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la función «AdminAuditLogPage».
export function AdminAuditLogPage() {
  // Esta línea sirve para obtener «data: entries, isLoading» con el hook «useQuery».
  const { data: entries, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "audit-logs"]».
    queryKey: ["admin", "audit-logs"],
    // Esta línea sirve para pedir el log de auditoría a la API.
    queryFn: () => api.get<AuditLogEntry[]>("/admin/audit-logs"),
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Log de auditoría» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Log de auditoría</h1>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-20 w-full" />}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && entries?.length === 0». */}
          {!isLoading && entries?.length === 0 && (
            // Esta línea sirve para mostrar el texto «Sin actividad registrada.» dentro de un «p».
            <p className="text-sm text-muted-foreground">Sin actividad registrada.</p>
          )}
          {/* Esta línea sirve para abrir el elemento «ul» con las clases «divide-y divide-border». */}
          <ul className="divide-y divide-border">
            {/* Esta línea sirve para recorrer «entries?» y mostrar un bloque por elemento. */}
            {entries?.map((entry) => (
              // Esta línea sirve para abrir el elemento «li».
              <li key={entry.id} className="py-2.5 text-sm">
                {/* Esta línea sirve para abrir el elemento «p». */}
                <p>
                  {/* Esta línea sirve para mostrar el autor (o Sistema) y la descripción de la acción. */}
                  <span className="font-medium">{entry.causer?.name ?? "Sistema"}</span> — {entry.description}
                  {/* Esta línea sirve para mostrar el bloque solo si «entry.subject_type». */}
                  {entry.subject_type && (
                    // Esta línea sirve para mostrar el tipo y el id del elemento afectado.
                    <span className="text-muted-foreground"> ({entry.subject_type.split("\\").pop()} #{entry.subject_id})</span>
                  )}
                </p>
                {/* Esta línea sirve para mostrar el valor «new Date(entry.created_at).toLocaleString("es-AR")» dentro de un «p». */}
                <p className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString("es-AR")}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
