import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Report, ReportStatus } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const REASON_LABELS: Record<Report["reason"], string> = {
  abuse: "Abuso",
  spam: "Spam",
  inappropriate_content: "Contenido inapropiado",
  other: "Otro",
}

export function AdminReportsPage() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<ReportStatus | "all">("pending")
  const [notesByReport, setNotesByReport] = useState<Record<number, string>>({})

  const { data: reports, isLoading } = useQuery({
    queryKey: ["admin", "reports", status],
    queryFn: () => api.get<Report[]>(`/admin/reports?status=${status}`),
  })

  const resolveMutation = useMutation({
    mutationFn: ({ id, resolution }: { id: number; resolution: "resolved" | "dismissed" }) =>
      api.patch(`/admin/reports/${id}/resolve`, {
        status: resolution,
        resolution_notes: notesByReport[id] ?? "",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "reports"] }),
  })

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Reportes</h1>

        <div className="flex gap-2">
          {(["pending", "resolved", "dismissed", "all"] as const).map((option) => (
            <Button
              key={option}
              size="sm"
              variant={status === option ? "default" : "outline"}
              onClick={() => setStatus(option)}
            >
              {option === "pending" && "Pendientes"}
              {option === "resolved" && "Resueltos"}
              {option === "dismissed" && "Descartados"}
              {option === "all" && "Todos"}
            </Button>
          ))}
        </div>

        <section className="rounded-xl border border-border bg-card p-5">
          {isLoading && <Skeleton className="h-20 w-full" />}
          {!isLoading && reports?.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin reportes acá.</p>
          )}
          <ul className="flex flex-col gap-4">
            {reports?.map((report) => (
              <li key={report.id} className="rounded-lg border border-border p-3">
                <p className="text-sm">
                  <span className="font-medium">{report.reporter.name}</span> reportó{" "}
                  {report.reportable_type === "chat_message" ? "un mensaje de chat" : report.reportable_type} ·{" "}
                  <span className="text-muted-foreground">{REASON_LABELS[report.reason]}</span>
                </p>
                {report.reportable_preview && (
                  <p className="mt-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                    "{report.reportable_preview}"
                  </p>
                )}
                {report.details && <p className="mt-1 text-xs text-muted-foreground">{report.details}</p>}

                {report.status === "pending" ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <textarea
                      placeholder="Notas de resolución (opcional)"
                      value={notesByReport[report.id] ?? ""}
                      onChange={(e) => setNotesByReport({ ...notesByReport, [report.id]: e.target.value })}
                      className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => resolveMutation.mutate({ id: report.id, resolution: "resolved" })}
                        disabled={resolveMutation.isPending}
                      >
                        Resolver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveMutation.mutate({ id: report.id, resolution: "dismissed" })}
                        disabled={resolveMutation.isPending}
                      >
                        Descartar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {report.status === "resolved" ? "Resuelto" : "Descartado"} por {report.resolved_by?.name}
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
