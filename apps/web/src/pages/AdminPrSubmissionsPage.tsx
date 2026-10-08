// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «ApiError, type PrSubmission, type PrSubmissionStatus» desde «@sanken/core».
import { ApiError, type PrSubmission, type PrSubmissionStatus } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la función «AdminPrSubmissionsPage».
export function AdminPrSubmissionsPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «status» y su función «setStatus».
  const [status, setStatus] = useState<PrSubmissionStatus | "all">("pending")
  // Esta línea sirve para crear el estado «reasonBySubmission» y su función «setReasonBySubmission».
  const [reasonBySubmission, setReasonBySubmission] = useState<Record<number, string>>({})
  // Esta línea sirve para crear el estado «errorBySubmission» y su función «setErrorBySubmission».
  const [errorBySubmission, setErrorBySubmission] = useState<Record<number, string>>({})

  // Esta línea sirve para obtener «data: submissions, isLoading» con el hook «useQuery».
  const { data: submissions, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "pr-submissions", status]».
    queryKey: ["admin", "pr-submissions", status],
    // Esta línea sirve para pedir las postulaciones de récord a la API según el filtro.
    queryFn: () => api.get<PrSubmission[]>(`/admin/pr-submissions?status=${status}`),
  })

  // Esta línea sirve para obtener «reviewMutation» con el hook «useMutation».
  const reviewMutation = useMutation({
    // Esta línea sirve para declarar la mutación que aprueba o rechaza una postulación.
    mutationFn: ({ id, ...payload }: { id: number; status: "approved" | "rejected"; rejection_reason?: string }) =>
      // Esta línea sirve para enviar la revisión a la API.
      api.patch(`/admin/pr-submissions/${id}/review`, payload),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «(_, { id }) => {».
    onSuccess: (_, { id }) => {
      // Esta línea sirve para llamar a «setErrorBySubmission» con «(prev) => ({ ...prev, [id]: "" })».
      setErrorBySubmission((prev) => ({ ...prev, [id]: "" }))
      // Esta línea sirve para refrescar la lista de postulaciones.
      queryClient.invalidateQueries({ queryKey: ["admin", "pr-submissions"] })
    },
    // Esta línea sirve para declarar la propiedad «onError» con el valor o tipo «(err, { id }) => {».
    onError: (err, { id }) => {
      // Esta línea sirve para guardar el error de esa postulación.
      setErrorBySubmission((prev) => ({
        // Esta línea sirve para copiar las propiedades de «prev».
        ...prev,
        // Esta línea sirve para mostrar el mensaje de error de la API o uno genérico.
        [id]: err instanceof ApiError ? err.body.message : "No se pudo revisar la postulación.",
      }))
    },
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «PR pendientes de revisión» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">PR pendientes de revisión</h1>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap gap-2». */}
        <div className="flex flex-wrap gap-2">
          {/* Esta línea sirve para recorrer las opciones de filtro de estado. */}
          {(["pending", "approved", "rejected", "all"] as const).map((option) => (
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
              {/* Esta línea sirve para mostrar el contenido dinámico «{option === "approved" && "Aprobados"}». */}
              {option === "approved" && "Aprobados"}
              {/* Esta línea sirve para mostrar el contenido dinámico «{option === "rejected" && "Rechazados"}». */}
              {option === "rejected" && "Rechazados"}
              {/* Esta línea sirve para mostrar el contenido dinámico «{option === "all" && "Todos"}». */}
              {option === "all" && "Todos"}
            </Button>
          ))}
        </div>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-20 w-full" />}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && submissions?.length === 0». */}
          {!isLoading && submissions?.length === 0 && (
            // Esta línea sirve para mostrar el texto «Sin postulaciones acá.» dentro de un «p».
            <p className="text-sm text-muted-foreground">Sin postulaciones acá.</p>
          )}
          {/* Esta línea sirve para abrir el elemento «ul» con las clases «flex flex-col gap-4». */}
          <ul className="flex flex-col gap-4">
            {/* Esta línea sirve para recorrer «submissions?» y mostrar un bloque por elemento. */}
            {submissions?.map((submission) => (
              // Esta línea sirve para abrir el elemento «li».
              <li key={submission.id} className="rounded-lg border border-border p-3">
                {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm». */}
                <p className="text-sm">
                  {/* Esta línea sirve para mostrar quién postuló. */}
                  <span className="font-medium">{submission.user.name}</span> postuló{" "}
                  {/* Esta línea sirve para mostrar el ejercicio postulado. */}
                  <span className="text-foreground">{submission.exercise.name}</span> —{" "}
                  {/* Esta línea sirve para mostrar el peso, las repeticiones y el 1RM estimado. */}
                  {submission.weight_kg} kg × {submission.reps} (1RM est.: {submission.estimated_1rm} kg)
                </p>

                {/* Esta línea sirve para elegir entre dos bloques según «submission.video_url». */}
                {submission.video_url ? (
                  // Esta línea sirve para abrir el elemento «video» con sus atributos en varias líneas.
                  <video
                    // Esta línea sirve para pasar la propiedad «src» con el valor «api.mediaUrl(submission.video_url, "video") ?».
                    src={api.mediaUrl(submission.video_url, "video") ?? undefined}
                    // Esta línea sirve para mostrar los controles del video.
                    controls
                    // Esta línea sirve para reproducir en línea en móviles.
                    playsInline
                    // Esta línea sirve para aplicar las clases de estilo «mt-2 aspect-video w-full max-w-sm rounded-lg ».
                    className="mt-2 aspect-video w-full max-w-sm rounded-lg border border-border bg-black"
                  />
                // Esta línea sirve para mostrar el bloque alternativo.
                ) : (
                  // Esta línea sirve para mostrar el texto «Todavía no subió el video de evidencia.» dentro de un «p».
                  <p className="mt-2 text-xs text-muted-foreground">Todavía no subió el video de evidencia.</p>
                )}

                {/* Esta línea sirve para elegir entre dos bloques según «submission.status === "pending"». */}
                {submission.status === "pending" ? (
                  // Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex flex-col gap-2».
                  <div className="mt-3 flex flex-col gap-2">
                    {/* Esta línea sirve para abrir el elemento «textarea» con sus atributos en varias líneas. */}
                    <textarea
                      // Esta línea sirve para definir el atributo «placeholder» con el valor «Motivo de rechazo (obligatorio si rechazás)».
                      placeholder="Motivo de rechazo (obligatorio si rechazás)"
                      // Esta línea sirve para pasar la propiedad «value» con el valor «reasonBySubmission[submission.id] ?? ""}».
                      value={reasonBySubmission[submission.id] ?? ""}
                      // Esta línea sirve para asignar el manejador del evento «onChange».
                      onChange={(e) =>
                        // Esta línea sirve para guardar el motivo de rechazo escrito para esa postulación.
                        setReasonBySubmission({ ...reasonBySubmission, [submission.id]: e.target.value })
                      }
                      // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
                      className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                    />
                    {/* Esta línea sirve para mostrar el bloque solo si «errorBySubmission[submission.id]». */}
                    {errorBySubmission[submission.id] && (
                      // Esta línea sirve para mostrar el valor «errorBySubmission[submission.id]» dentro de un «p».
                      <p className="text-xs text-destructive">{errorBySubmission[submission.id]}</p>
                    )}
                    {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap gap-2». */}
                    <div className="flex flex-wrap gap-2">
                      {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                      <Button
                        // Esta línea sirve para definir el atributo «size» con el valor «sm».
                        size="sm"
                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «reviewMutation.isPending || !submission.video».
                        disabled={reviewMutation.isPending || !submission.video_url}
                        // Esta línea sirve para asignar el manejador del evento «onClick».
                        onClick={() => reviewMutation.mutate({ id: submission.id, status: "approved" })}
                      >
                        {/* Esta línea sirve para mostrar el texto «Aprobar». */}
                        Aprobar
                      </Button>
                      {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                      <Button
                        // Esta línea sirve para definir el atributo «size» con el valor «sm».
                        size="sm"
                        // Esta línea sirve para definir el atributo «variant» con el valor «destructive».
                        variant="destructive"
                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «reviewMutation.isPending || !reasonBySubmissi».
                        disabled={reviewMutation.isPending || !reasonBySubmission[submission.id]?.trim()}
                        // Esta línea sirve para asignar el manejador del evento «onClick».
                        onClick={() =>
                          // Esta línea sirve para enviar la revisión de la postulación.
                          reviewMutation.mutate({
                            // Esta línea sirve para declarar la propiedad «id» con el valor o tipo «submission.id».
                            id: submission.id,
                            // Esta línea sirve para declarar la propiedad «status» con el valor o tipo «"rejected"».
                            status: "rejected",
                            // Esta línea sirve para declarar la propiedad «rejection_reason» con el valor o tipo «reasonBySubmission[submission.id]».
                            rejection_reason: reasonBySubmission[submission.id],
                          })
                        }
                      >
                        {/* Esta línea sirve para mostrar el texto «Rechazar». */}
                        Rechazar
                      </Button>
                    </div>
                  </div>
                // Esta línea sirve para mostrar el bloque alternativo.
                ) : (
                  // Esta línea sirve para abrir el elemento «p» con las clases «mt-2 text-xs text-muted-foreground».
                  <p className="mt-2 text-xs text-muted-foreground">
                    {/* Esta línea sirve para mostrar si fue aprobado o rechazado y por quién. */}
                    {submission.status === "approved" ? "Aprobado" : "Rechazado"} por {submission.reviewed_by?.name}
                    {/* Esta línea sirve para mostrar el motivo de rechazo si existe. */}
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
