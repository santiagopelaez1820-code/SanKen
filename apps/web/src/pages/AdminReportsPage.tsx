// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «Report, ReportStatus» desde «@sanken/core».
import type { Report, ReportStatus } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «REASON_LABELS» con el valor «{».
const REASON_LABELS: Record<Report["reason"], string> = {
  // Esta línea sirve para declarar la propiedad «abuse» con el valor o tipo «"Abuso"».
  abuse: "Abuso",
  // Esta línea sirve para declarar la propiedad «spam» con el valor o tipo «"Spam"».
  spam: "Spam",
  // Esta línea sirve para declarar la propiedad «inappropriate_content» con el valor o tipo «"Contenido inapropiado"».
  inappropriate_content: "Contenido inapropiado",
  // Esta línea sirve para declarar la propiedad «other» con el valor o tipo «"Otro"».
  other: "Otro",
}

// Esta línea sirve para declarar la función «AdminReportsPage».
export function AdminReportsPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «status» y su función «setStatus».
  const [status, setStatus] = useState<ReportStatus | "all">("pending")
  // Esta línea sirve para crear el estado «notesByReport» y su función «setNotesByReport».
  const [notesByReport, setNotesByReport] = useState<Record<number, string>>({})

  // Esta línea sirve para obtener «data: reports, isLoading» con el hook «useQuery».
  const { data: reports, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "reports", status]».
    queryKey: ["admin", "reports", status],
    // Esta línea sirve para pedir los reportes a la API según el filtro.
    queryFn: () => api.get<Report[]>(`/admin/reports?status=${status}`),
  })

  // Esta línea sirve para obtener «resolveMutation» con el hook «useMutation».
  const resolveMutation = useMutation({
    // Esta línea sirve para declarar la mutación que resuelve o descarta un reporte.
    mutationFn: ({ id, resolution }: { id: number; resolution: "resolved" | "dismissed" }) =>
      // Esta línea sirve para enviar la resolución a la API.
      api.patch(`/admin/reports/${id}/resolve`, {
        // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «resolution».
        status: resolution,
        // Esta línea sirve para declarar la propiedad «resolution_notes» con el valor o tipo «notesByReport[id] ?? ""».
        resolution_notes: notesByReport[id] ?? "",
      }),
    // Esta línea sirve para refrescar la lista de reportes al terminar.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reports"] }),
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Reportes» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Reportes</h1>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap gap-2». */}
        <div className="flex flex-wrap gap-2">
          {/* Esta línea sirve para recorrer las opciones de filtro de estado. */}
          {(["pending", "resolved", "dismissed", "all"] as const).map((option) => (
            // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
            <Button
              // Esta línea sirve para identificar el elemento de la lista con «option}».
              key={option}
              // Esta línea sirve para definir el atributo «size» con el valor «sm».
              size="sm"
              // Esta línea sirve para pasar la propiedad «variant» con el valor «status === option ? "default" : "outline"}».
              variant={status === option ? "default" : "outline"}
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => setStatus(option)}
            >
              {/* Esta línea sirve para mostrar el contenido dinámico «{option === "pending" && "Pendientes"}». */}
              {option === "pending" && "Pendientes"}
              {/* Esta línea sirve para mostrar el contenido dinámico «{option === "resolved" && "Resueltos"}». */}
              {option === "resolved" && "Resueltos"}
              {/* Esta línea sirve para mostrar el contenido dinámico «{option === "dismissed" && "Descartados"}». */}
              {option === "dismissed" && "Descartados"}
              {/* Esta línea sirve para mostrar el contenido dinámico «{option === "all" && "Todos"}». */}
              {option === "all" && "Todos"}
            </Button>
          ))}
        </div>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-20 w-full" />}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && reports?.length === 0». */}
          {!isLoading && reports?.length === 0 && (
            // Esta línea sirve para mostrar el texto «Sin reportes acá.» dentro de un «p».
            <p className="text-sm text-muted-foreground">Sin reportes acá.</p>
          )}
          {/* Esta línea sirve para abrir el elemento «ul» con las clases «flex flex-col gap-4». */}
          <ul className="flex flex-col gap-4">
            {/* Esta línea sirve para recorrer «reports?» y mostrar un bloque por elemento. */}
            {reports?.map((report) => (
              // Esta línea sirve para abrir el elemento «li».
              <li key={report.id} className="rounded-lg border border-border p-3">
                {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm». */}
                <p className="text-sm">
                  {/* Esta línea sirve para mostrar quién reportó. */}
                  <span className="font-medium">{report.reporter.name}</span> reportó{" "}
                  {/* Esta línea sirve para mostrar qué se reportó. */}
                  {report.reportable_type === "chat_message" ? "un mensaje de chat" : report.reportable_type} ·{" "}
                  {/* Esta línea sirve para mostrar el valor «REASON_LABELS[report.reason]» dentro de un «span». */}
                  <span className="text-muted-foreground">{REASON_LABELS[report.reason]}</span>
                </p>
                {/* Esta línea sirve para mostrar el bloque solo si «report.reportable_preview». */}
                {report.reportable_preview && (
                  // Esta línea sirve para abrir el elemento «p» con las clases «mt-1 rounded bg-muted px-2 py-1 text-xs ».
                  <p className="mt-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {/* Esta línea sirve para mostrar el contenido dinámico «"{report.reportable_preview}"». */}
                    "{report.reportable_preview}"
                  </p>
                )}
                {/* Esta línea sirve para mostrar el elemento solo si «report.details». */}
                {report.details && <p className="mt-1 text-xs text-muted-foreground">{report.details}</p>}

                {/* Esta línea sirve para elegir entre dos bloques según «report.status === "pending"». */}
                {report.status === "pending" ? (
                  // Esta línea sirve para abrir el elemento «div» con las clases «mt-2 flex flex-col gap-2».
                  <div className="mt-2 flex flex-col gap-2">
                    {/* Esta línea sirve para abrir el elemento «textarea» con sus atributos en varias líneas. */}
                    <textarea
                      // Esta línea sirve para definir el atributo «placeholder» con el valor «Notas de resolución (opcional)».
                      placeholder="Notas de resolución (opcional)"
                      // Esta línea sirve para pasar la propiedad «value» con el valor «notesByReport[report.id] ?? ""}».
                      value={notesByReport[report.id] ?? ""}
                      // Esta línea sirve para asignar el manejador del evento «onChange».
                      onChange={(e) => setNotesByReport({ ...notesByReport, [report.id]: e.target.value })}
                      // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
                      className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                    />
                    {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap gap-2». */}
                    <div className="flex flex-wrap gap-2">
                      {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                      <Button
                        // Esta línea sirve para definir el atributo «size» con el valor «sm».
                        size="sm"
                        // Esta línea sirve para asignar el manejador del evento «onClick».
                        onClick={() => resolveMutation.mutate({ id: report.id, resolution: "resolved" })}
                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «resolveMutation.isPending}».
                        disabled={resolveMutation.isPending}
                      >
                        {/* Esta línea sirve para mostrar el texto «Resolver». */}
                        Resolver
                      </Button>
                      {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                      <Button
                        // Esta línea sirve para definir el atributo «size» con el valor «sm».
                        size="sm"
                        // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                        variant="outline"
                        // Esta línea sirve para asignar el manejador del evento «onClick».
                        onClick={() => resolveMutation.mutate({ id: report.id, resolution: "dismissed" })}
                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «resolveMutation.isPending}».
                        disabled={resolveMutation.isPending}
                      >
                        {/* Esta línea sirve para mostrar el texto «Descartar». */}
                        Descartar
                      </Button>
                    </div>
                  </div>
                // Esta línea sirve para mostrar el bloque alternativo.
                ) : (
                  // Esta línea sirve para abrir el elemento «p» con las clases «mt-2 text-xs text-muted-foreground».
                  <p className="mt-2 text-xs text-muted-foreground">
                    {/* Esta línea sirve para mostrar si fue resuelto o descartado y por quién. */}
                    {report.status === "resolved" ? "Resuelto" : "Descartado"} por {report.resolved_by?.name}
                    {/* Esta línea sirve para mostrar las notas de resolución si existen. */}
                    {report.resolution_notes && ` — "${report.resolution_notes}"`}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
