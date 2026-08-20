import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ApiError, type PrSubmission, type PrSubmissionStatus } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

export function AdminPrSubmissionsPage() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<PrSubmissionStatus | "all">("pending")
  const [reasonBySubmission, setReasonBySubmission] = useState<Record<number, string>>({})
  const [errorBySubmission, setErrorBySubmission] = useState<Record<number, string>>({})

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin", "pr-submissions", status],
    queryFn: () => api.get<PrSubmission[]>(`/admin/pr-submissions?status=${status}`),
  })

  const reviewMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: number; status: "approved" | "rejected"; rejection_reason?: string }) =>
      api.patch(`/admin/pr-submissions/${id}/review`, payload),
    onSuccess: (_, { id }) => {
      setErrorBySubmission((prev) => ({ ...prev, [id]: "" }))
      queryClient.invalidateQueries({ queryKey: ["admin", "pr-submissions"] })
    },
    onError: (err, { id }) => {
      setErrorBySubmission((prev) => ({
        ...prev,
        [id]: err instanceof ApiError ? err.body.message : "No se pudo revisar la postulación.",
      }))
    },
  })

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">PR pendientes de revisión</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin">Volver</Link>
          </Button>
        </header>

        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map((option) => (
            <Button
              key={option}
              size="sm"
              variant={status === option ? "default" : "outline"}
              onClick={() => setStatus(option)}
            >
              {option === "pending" && "Pendientes"}
              {option === "approved" && "Aprobados"}
              {option === "rejected" && "Rechazados"}
              {option === "all" && "Todos"}
            </Button>
          ))}
        </div>

        <section className="rounded-xl border border-border bg-card p-5">
          {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
          {!isLoading && submissions?.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin postulaciones acá.</p>
          )}
          <ul className="flex flex-col gap-4">
            {submissions?.map((submission) => (
              <li key={submission.id} className="rounded-lg border border-border p-3">
                <p className="text-sm">
                  <span className="font-medium">{submission.user.name}</span> postuló{" "}
                  <span className="text-foreground">{submission.exercise.name}</span> —{" "}
                  {submission.weight_kg} kg × {submission.reps} (1RM est.: {submission.estimated_1rm} kg)
                </p>

                {submission.video_url ? (
                  <video
                    src={api.mediaUrl(submission.video_url) ?? undefined}
                    controls
                    playsInline
                    className="mt-2 aspect-video w-full max-w-sm rounded-lg border border-border bg-black"
                  />
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">Todavía no subió el video de evidencia.</p>
                )}

                {submission.status === "pending" ? (
                  <div className="mt-3 flex flex-col gap-2">
                    <textarea
                      placeholder="Motivo de rechazo (obligatorio si rechazás)"
                      value={reasonBySubmission[submission.id] ?? ""}
                      onChange={(e) =>
                        setReasonBySubmission({ ...reasonBySubmission, [submission.id]: e.target.value })
                      }
                      className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                    />
                    {errorBySubmission[submission.id] && (
                      <p className="text-xs text-destructive">{errorBySubmission[submission.id]}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={reviewMutation.isPending || !submission.video_url}
                        onClick={() => reviewMutation.mutate({ id: submission.id, status: "approved" })}
                      >
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={reviewMutation.isPending || !reasonBySubmission[submission.id]?.trim()}
                        onClick={() =>
                          reviewMutation.mutate({
                            id: submission.id,
                            status: "rejected",
                            rejection_reason: reasonBySubmission[submission.id],
                          })
                        }
                      >
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {submission.status === "approved" ? "Aprobado" : "Rechazado"} por {submission.reviewed_by?.name}
                    {submission.rejection_reason && ` — "${submission.rejection_reason}"`}
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
