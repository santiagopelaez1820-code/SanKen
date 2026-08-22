import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Trophy } from "lucide-react"
import {
  ApiError,
  type ExerciseCatalogItem,
  type ExerciseRankingResponse,
  type ExerciseRankingScope,
  type ExerciseRankingSex,
  type PersonalRecordSummary,
  type PrSubmission,
  type RegisterPersonalRecordMeta,
} from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import type { VariantProps } from "class-variance-authority"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExerciseRankingList } from "@/components/rankings/ExerciseRankingList"
import { Skeleton } from "@/components/ui/skeleton"

const STATUS_LABEL: Record<PrSubmission["status"], string> = {
  pending: "En revisión",
  approved: "Aprobado",
  rejected: "Rechazado",
}

const STATUS_VARIANT: Record<PrSubmission["status"], VariantProps<typeof badgeVariants>["variant"]> = {
  pending: "neutral",
  approved: "default",
  rejected: "error",
}

function PrSubmissionVideoUpload({ submission }: { submission: PrSubmission }) {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append("video", file)
      return api.post(`/pr-submissions/${submission.id}/video`, formData)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pr-submissions"] }),
    onError: (err) => setError(err instanceof ApiError ? err.body.message : "No se pudo subir el video."),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setError(null)
    uploadMutation.mutate(file)
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploadMutation.isPending}
        onClick={() => inputRef.current?.click()}
      >
        {uploadMutation.isPending ? "Subiendo…" : "Subir video de evidencia"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

const RANKING_SCOPES: { value: ExerciseRankingScope; label: string }[] = [
  { value: "global", label: "Global" },
  { value: "country", label: "País" },
  { value: "city", label: "Ciudad" },
]

const RANKING_SEXES: { value: ExerciseRankingSex; label: string }[] = [
  { value: "male", label: "Hombres" },
  { value: "female", label: "Mujeres" },
]

function ExerciseRankingPanel({
  exerciseId,
  scope,
  sex,
}: {
  exerciseId: number
  scope: ExerciseRankingScope
  sex: ExerciseRankingSex
}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["exercises", exerciseId, "rankings", scope, sex],
    queryFn: () => api.get<ExerciseRankingResponse>(`/exercises/${exerciseId}/rankings?scope=${scope}&sex=${sex}`),
  })

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-destructive">No se pudo cargar el ranking.</p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {data?.scope_label && <p className="text-xs text-muted-foreground">{data.scope_label}</p>}
      <ExerciseRankingList entries={data?.entries ?? []} viewer={data?.viewer ?? null} />
    </div>
  )
}

const prSchema = z.object({
  exercise_id: z.coerce.number({ message: "Elige un ejercicio" }).int().positive(),
  weight_kg: z.coerce.number({ message: "Ingresa el peso" }).positive("El peso debe ser mayor a 0"),
  reps: z.coerce.number({ message: "Ingresa las repeticiones" }).int().min(1).max(50),
})

type PrFormInput = z.input<typeof prSchema>
type PrFormValues = z.output<typeof prSchema>

export function PersonalRecordsPage() {
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const [confirmationIsNewBest, setConfirmationIsNewBest] = useState(false)
  const [rankingExerciseId, setRankingExerciseId] = useState<number | null>(null)
  const [rankingSex, setRankingSex] = useState<ExerciseRankingSex>("male")

  const { data: exerciseCatalog } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => api.get<ExerciseCatalogItem[]>("/exercises"),
  })

  const { data: records, isLoading } = useQuery({
    queryKey: ["stats", "personal-records"],
    queryFn: () => api.get<PersonalRecordSummary[]>("/stats/personal-records"),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrFormInput, unknown, PrFormValues>({ resolver: zodResolver(prSchema), defaultValues: { reps: 1 } })

  const submitMutation = useMutation({
    mutationFn: (values: PrFormValues) =>
      api.postWithMeta<PersonalRecordSummary>("/stats/personal-records", values),
    onSuccess: (envelope) => {
      const meta = envelope.meta as RegisterPersonalRecordMeta | undefined
      setConfirmationIsNewBest(Boolean(meta?.is_new_best))
      setConfirmation(
        meta?.is_new_best
          ? "¡Nuevo récord personal!"
          : "Registrado — pero no supera tu récord actual en este ejercicio, así que se conserva el anterior."
      )
      queryClient.invalidateQueries({ queryKey: ["stats", "personal-records"] })
      queryClient.invalidateQueries({ queryKey: ["stats", "dashboard"] })
      reset({ exercise_id: undefined, weight_kg: undefined, reps: 1 })
    },
  })

  const onSubmit = async (values: PrFormValues) => {
    setServerError(null)
    setConfirmation(null)
    try {
      await submitMutation.mutateAsync(values)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo registrar el PR.")
    }
  }

  const [submissionServerError, setSubmissionServerError] = useState<string | null>(null)

  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["pr-submissions"],
    queryFn: () => api.get<PrSubmission[]>("/pr-submissions"),
  })

  const {
    register: registerSubmission,
    handleSubmit: handleSubmitSubmission,
    reset: resetSubmissionForm,
    formState: { errors: submissionErrors, isSubmitting: isSubmittingSubmission },
  } = useForm<PrFormInput, unknown, PrFormValues>({ resolver: zodResolver(prSchema), defaultValues: { reps: 1 } })

  const createSubmissionMutation = useMutation({
    mutationFn: (values: PrFormValues) => api.post<PrSubmission>("/pr-submissions", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pr-submissions"] })
      resetSubmissionForm({ exercise_id: undefined, weight_kg: undefined, reps: 1 })
    },
  })

  const onSubmitSubmission = async (values: PrFormValues) => {
    setSubmissionServerError(null)
    try {
      await createSubmissionMutation.mutateAsync(values)
    } catch (err) {
      setSubmissionServerError(err instanceof ApiError ? err.body.message : "No se pudo postular el PR.")
    }
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">PR</h1>

        <p className="text-sm text-muted-foreground">
          Registra tu mejor levantamiento por ejercicio. Esto es completamente independiente de tu entrenamiento —
          no crea ni modifica ninguna sesión.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="space-y-1.5">
            <label htmlFor="exercise_id" className="text-sm font-medium">
              Ejercicio
            </label>
            <select
              id="exercise_id"
              {...register("exercise_id")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue=""
            >
              <option value="" disabled>
                Selecciona un ejercicio
              </option>
              {exerciseCatalog?.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
            {errors.exercise_id && <p className="text-xs text-destructive">{errors.exercise_id.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="weight_kg" className="text-sm font-medium">
              Peso (kg)
            </label>
            <input
              id="weight_kg"
              type="number"
              step="0.5"
              {...register("weight_kg")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {errors.weight_kg && <p className="text-xs text-destructive">{errors.weight_kg.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reps" className="text-sm font-medium">
              Repeticiones
            </label>
            <input
              id="reps"
              type="number"
              {...register("reps")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {errors.reps && <p className="text-xs text-destructive">{errors.reps.message}</p>}
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          {confirmation && confirmationIsNewBest && (
            <p className="flex items-center gap-1.5 text-sm font-bold tracking-wide text-primary uppercase">
              <Trophy className="size-4" />
              {confirmation}
            </p>
          )}
          {confirmation && !confirmationIsNewBest && <p className="text-sm text-muted-foreground">{confirmation}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Registrando…" : "Registrar PR"}
          </Button>
        </form>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium text-foreground">Tus récords</h2>

          {isLoading && <Skeleton className="mt-3 h-20 w-full" />}

          {!isLoading && (records?.length ?? 0) === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">Todavía no tienes récords registrados.</p>
          )}

          {!isLoading && (records?.length ?? 0) > 0 && (
            <ul className="mt-3 divide-y divide-border">
              {records!.map((record) => (
                <li key={record.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-foreground">{record.exercise_name}</span>
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-medium text-primary">
                      <Trophy className="size-3.5" />
                      {record.value} kg
                    </span>
                    <span className="text-xs text-muted-foreground">{record.achieved_at}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium text-foreground">Postular PR para Rankings</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Solo los PR aprobados por un administrador, con video de evidencia, aparecen en Rankings públicos. Tus
            récords de arriba son privados y no se ven afectados por esto.
          </p>

          <form onSubmit={handleSubmitSubmission(onSubmitSubmission)} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="submission_exercise_id" className="text-sm font-medium">
                Ejercicio
              </label>
              <select
                id="submission_exercise_id"
                {...registerSubmission("exercise_id")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona un ejercicio
                </option>
                {exerciseCatalog?.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
              {submissionErrors.exercise_id && (
                <p className="text-xs text-destructive">{submissionErrors.exercise_id.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="submission_weight_kg" className="text-sm font-medium">
                Peso (kg)
              </label>
              <input
                id="submission_weight_kg"
                type="number"
                step="0.5"
                {...registerSubmission("weight_kg")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {submissionErrors.weight_kg && (
                <p className="text-xs text-destructive">{submissionErrors.weight_kg.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="submission_reps" className="text-sm font-medium">
                Repeticiones
              </label>
              <input
                id="submission_reps"
                type="number"
                {...registerSubmission("reps")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {submissionErrors.reps && <p className="text-xs text-destructive">{submissionErrors.reps.message}</p>}
            </div>

            {submissionServerError && <p className="text-sm text-destructive">{submissionServerError}</p>}

            <Button type="submit" disabled={isSubmittingSubmission} className="w-full">
              {isSubmittingSubmission ? "Postulando…" : "Postular PR"}
            </Button>
          </form>

          {isLoadingSubmissions && <Skeleton className="mt-4 h-20 w-full" />}

          {!isLoadingSubmissions && (submissions?.length ?? 0) > 0 && (
            <ul className="mt-4 divide-y divide-border">
              {submissions!.map((submission) => (
                <li key={submission.id} className="flex flex-col gap-2 py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">
                      {submission.exercise.name} — {submission.weight_kg} kg × {submission.reps}
                    </span>
                    <Badge variant={STATUS_VARIANT[submission.status]}>{STATUS_LABEL[submission.status]}</Badge>
                  </div>
                  {submission.status === "rejected" && submission.rejection_reason && (
                    <p className="text-xs text-destructive">Motivo: {submission.rejection_reason}</p>
                  )}
                  {submission.status === "pending" && !submission.video_url && (
                    <PrSubmissionVideoUpload submission={submission} />
                  )}
                  {submission.video_url && (
                    <a
                      href={api.mediaUrl(submission.video_url) ?? submission.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="self-end text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Ver video
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium text-foreground">Rankings por ejercicio</h2>

          <div className="mt-3 space-y-1.5">
            <label htmlFor="ranking_exercise_id" className="text-sm font-medium">
              Ejercicio
            </label>
            <select
              id="ranking_exercise_id"
              value={rankingExerciseId ?? ""}
              onChange={(e) => setRankingExerciseId(e.target.value ? Number(e.target.value) : null)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Selecciona un ejercicio</option>
              {exerciseCatalog?.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>

          {rankingExerciseId && (
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                {RANKING_SEXES.map((s) => (
                  <Button
                    key={s.value}
                    type="button"
                    size="sm"
                    variant={rankingSex === s.value ? "default" : "outline"}
                    onClick={() => setRankingSex(s.value)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>

              <Tabs defaultValue="global">
                <TabsList>
                  {RANKING_SCOPES.map((s) => (
                    <TabsTrigger key={s.value} value={s.value}>
                      {s.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {RANKING_SCOPES.map((s) => (
                  <TabsContent key={s.value} value={s.value}>
                    <ExerciseRankingPanel exerciseId={rankingExerciseId} scope={s.value} sex={rankingSex} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
