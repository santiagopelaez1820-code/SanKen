// Esta línea sirve para importar «useRef, useState» desde «react».
import { useRef, useState } from "react"
// Esta línea sirve para importar «useForm» desde «react-hook-form».
import { useForm } from "react-hook-form"
// Esta línea sirve para importar «zodResolver» desde «@hookform/resolvers/zod».
import { zodResolver } from "@hookform/resolvers/zod"
// Esta línea sirve para importar «z» desde «zod».
import { z } from "zod"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «AnimatePresence, motion» desde «framer-motion».
import { AnimatePresence, motion } from "framer-motion"
// Esta línea sirve para importar «Trophy, Video» desde «lucide-react».
import { Trophy, Video } from "lucide-react"
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ApiError» en la lista.
  ApiError,
  // Esta línea sirve para incluir el valor «formatPersonalRecord» en la lista.
  formatPersonalRecord,
  // Esta línea sirve para importar el tipo «ExerciseCatalogItem».
  type ExerciseCatalogItem,
  // Esta línea sirve para importar el tipo «ExerciseRankingResponse».
  type ExerciseRankingResponse,
  // Esta línea sirve para importar el tipo «ExerciseRankingScope».
  type ExerciseRankingScope,
  // Esta línea sirve para importar el tipo «ExerciseRankingSex».
  type ExerciseRankingSex,
  // Esta línea sirve para importar el tipo «PersonalRecordSummary».
  type PersonalRecordSummary,
  // Esta línea sirve para importar el tipo «PrSubmission».
  type PrSubmission,
  // Esta línea sirve para importar el tipo «RegisterPersonalRecordMeta».
  type RegisterPersonalRecordMeta,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Badge, type badgeVariants» desde «@/components/ui/badge».
import { Badge, type badgeVariants } from "@/components/ui/badge"
// Esta línea sirve para importar los tipos «VariantProps» desde «class-variance-authority».
import type { VariantProps } from "class-variance-authority"
// Esta línea sirve para importar «Tabs, TabsContent, TabsList, TabsTrigger» desde «@/components/ui/tabs».
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Esta línea sirve para importar «ExerciseRankingList» desde «@/components/rankings/ExerciseRankingList».
import { ExerciseRankingList } from "@/components/rankings/ExerciseRankingList"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

/** Mismo tope que UploadPrSubmissionVideoRequest (max:102400 KB). */
// Esta línea sirve para declarar «MAX_VIDEO_BYTES» con el valor «100 * 1024 * 1024».
const MAX_VIDEO_BYTES = 100 * 1024 * 1024

// Esta línea sirve para declarar «STATUS_LABEL» con el valor «{».
const STATUS_LABEL: Record<PrSubmission["status"], string> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «"En revisión"».
  pending: "En revisión",
  // Esta línea sirve para declarar la propiedad «approved» con el valor o tipo «"Aprobado"».
  approved: "Aprobado",
  // Esta línea sirve para declarar la propiedad «rejected» con el valor o tipo «"Rechazado"».
  rejected: "Rechazado",
}

// Esta línea sirve para declarar «STATUS_VARIANT» con el valor «{».
const STATUS_VARIANT: Record<PrSubmission["status"], VariantProps<typeof badgeVariants>["variant"]> = {
  // Esta línea sirve para declarar la propiedad «pending» con el valor o tipo «"neutral"».
  pending: "neutral",
  // Esta línea sirve para declarar la propiedad «approved» con el valor o tipo «"default"».
  approved: "default",
  // Esta línea sirve para declarar la propiedad «rejected» con el valor o tipo «"error"».
  rejected: "error",
}

/**
 * Reproduce el video de evidencia en la misma página (igual que la revisión
 * del admin) en vez de abrirlo en otra pestaña: detrás del túnel ngrok
 * gratuito, navegar directo al .mp4 muestra la página de advertencia de
 * ngrok en lugar del video.
 */
// Esta línea sirve para declarar la función «PrSubmissionVideo».
function PrSubmissionVideo({ videoUrl }: { videoUrl: string }) {
  // Esta línea sirve para crear el estado «isOpen» y su función «setIsOpen».
  const [isOpen, setIsOpen] = useState(false)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
    <>
      {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
      <button
        // Esta línea sirve para definir el atributo «type» con el valor «button».
        type="button"
        // Esta línea sirve para asignar el manejador del evento «onClick».
        onClick={() => setIsOpen((value) => !value)}
        // Esta línea sirve para pasar la propiedad «aria-expanded» con el valor «isOpen}».
        aria-expanded={isOpen}
        // Esta línea sirve para aplicar las clases de estilo «self-end py-1 text-xs font-medium text-primar».
        className="self-end py-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        {/* Esta línea sirve para mostrar el contenido dinámico «{isOpen ? "Ocultar video" : "Ver video"}». */}
        {isOpen ? "Ocultar video" : "Ver video"}
      </button>
      {/* Esta línea sirve para mostrar el bloque solo si «isOpen». */}
      {isOpen && (
        // Esta línea sirve para abrir el elemento «video» con sus atributos en varias líneas.
        <video
          // Esta línea sirve para pasar la propiedad «src» con el valor «api.mediaUrl(videoUrl, "video") ?? undefined}».
          src={api.mediaUrl(videoUrl, "video") ?? undefined}
          // Esta línea sirve para activar la opción «controls».
          controls
          // Esta línea sirve para activar la opción «autoPlay».
          autoPlay
          // Esta línea sirve para activar la opción «playsInline».
          playsInline
          // Esta línea sirve para aplicar las clases de estilo «aspect-video w-full rounded-lg border border-».
          className="aspect-video w-full rounded-lg border border-border bg-black"
        />
      )}
    </>
  )
}

// Esta línea sirve para declarar la función «PrSubmissionVideoUpload».
function PrSubmissionVideoUpload({ submission }: { submission: PrSubmission }) {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear la referencia «inputRef».
  const inputRef = useRef<HTMLInputElement>(null)
  // Esta línea sirve para crear el estado «error» y su función «setError».
  const [error, setError] = useState<string | null>(null)

  // Esta línea sirve para obtener «uploadMutation» con el hook «useMutation».
  const uploadMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(file: File) => {».
    mutationFn: (file: File) => {
      // Esta línea sirve para extraer «ormDat» de «new FormData()».
      const formData = new FormData()
      // Esta línea sirve para llamar a «formData.append» con «"video", file».
      formData.append("video", file)
      // Esta línea sirve para enviar el video de evidencia de la postulación a la API.
      return api.post(`/pr-submissions/${submission.id}/video`, formData)
    },
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pr-submissions"] }),
    // Esta línea sirve para definir lo que ocurre en «onError».
    onError: (err) => setError(err instanceof ApiError ? err.body.message : "No se pudo subir el video."),
  })

  // Esta línea sirve para extraer «andleFileChang» de «(e: React.ChangeEvent<HTMLInputElement>)».
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Esta línea sirve para extraer «il» de «e.target.files?.[0]».
    const file = e.target.files?.[0]
    // Esta línea sirve para asignar «""» a «e.target.value».
    e.target.value = ""
    // Esta línea sirve para salir de la función si «!file».
    if (!file) return
    // Esta línea sirve para guardar en el estado con «setError» el valor «null)…».
    setError(null)
    // Esta línea sirve para llamar a «uploadMutation.mutate» con «file».
    uploadMutation.mutate(file)
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col items-end gap-1».
    <div className="flex flex-col items-end gap-1">
      {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
      <input
        // Esta línea sirve para conectar la referencia «inputRef}» con el elemento.
        ref={inputRef}
        // Esta línea sirve para definir el atributo «type» con el valor «file».
        type="file"
        // Esta línea sirve para definir el atributo «accept» con el valor «video/mp4,video/webm,video/quicktime».
        accept="video/mp4,video/webm,video/quicktime"
        // Esta línea sirve para aplicar las clases de estilo «hidden».
        className="hidden"
        // Esta línea sirve para asignar el manejador del evento «onChange».
        onChange={handleFileChange}
      />
      {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
      <Button
        // Esta línea sirve para definir el atributo «type» con el valor «button».
        type="button"
        // Esta línea sirve para definir el atributo «variant» con el valor «outline».
        variant="outline"
        // Esta línea sirve para definir el atributo «size» con el valor «sm».
        size="sm"
        // Esta línea sirve para pasar la propiedad «disabled» con el valor «uploadMutation.isPending}».
        disabled={uploadMutation.isPending}
        // Esta línea sirve para asignar el manejador del evento «onClick».
        onClick={() => inputRef.current?.click()}
      >
        {/* Esta línea sirve para mostrar el texto según si se está subiendo el video. */}
        {uploadMutation.isPending ? "Subiendo…" : "Subir video de evidencia"}
      </Button>
      {/* Esta línea sirve para mostrar el elemento solo si «error». */}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

// Esta línea sirve para declarar «RANKING_SCOPES» con el valor «[».
const RANKING_SCOPES: { value: ExerciseRankingScope; label: string }[] = [
  // Esta línea sirve para agregar la opción «Global» con valor «global».
  { value: "global", label: "Global" },
  // Esta línea sirve para agregar la opción «País» con valor «country».
  { value: "country", label: "País" },
  // Esta línea sirve para agregar la opción «Ciudad» con valor «city».
  { value: "city", label: "Ciudad" },
]

// Esta línea sirve para declarar «RANKING_SEXES» con el valor «[».
const RANKING_SEXES: { value: ExerciseRankingSex; label: string }[] = [
  // Esta línea sirve para agregar la opción «Hombres» con valor «male».
  { value: "male", label: "Hombres" },
  // Esta línea sirve para agregar la opción «Mujeres» con valor «female».
  { value: "female", label: "Mujeres" },
]

// Esta línea sirve para declarar la función «ExerciseRankingPanel».
function ExerciseRankingPanel({
  // Esta línea sirve para incluir el valor «exerciseId» en la lista.
  exerciseId,
  // Esta línea sirve para incluir el valor «scope» en la lista.
  scope,
  // Esta línea sirve para incluir el valor «sex» en la lista.
  sex,
// Esta línea sirve para cerrar la desestructuración y abrir los tipos.
}: {
  // Esta línea sirve para declarar la propiedad «exerciseId» con el valor o tipo «number».
  exerciseId: number
  // Esta línea sirve para declarar la propiedad «scope» con el valor o tipo «ExerciseRankingScope».
  scope: ExerciseRankingScope
  // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «ExerciseRankingSex».
  sex: ExerciseRankingSex
// Esta línea sirve para cerrar los parámetros y abrir el cuerpo.
}) {
  // Esta línea sirve para obtener «data, isLoading, isError, refetch» con el hook «useQuery».
  const { data, isLoading, isError, refetch } = useQuery({
    // Esta línea sirve para definir la clave de caché con el ejercicio, el alcance y el sexo.
    queryKey: ["exercises", exerciseId, "rankings", scope, sex],
    // Esta línea sirve para pedir a la API los datos de «/exercises/${exerciseId}/rankings?scope=${scope}&sex=${sex}».
    queryFn: () => api.get<ExerciseRankingResponse>(`/exercises/${exerciseId}/rankings?scope=${scope}&sex=${sex}`),
  })

  // Esta línea sirve para revisar si «isLoading».
  if (isLoading) {
    // Esta línea sirve para devolver «<Skeleton className="h-20 w-full" />».
    return <Skeleton className="h-20 w-full" />
  }

  // Esta línea sirve para revisar si «isError».
  if (isError) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col items-start gap-2».
      <div className="flex flex-col items-start gap-2">
        {/* Esta línea sirve para mostrar el texto «No se pudo cargar el ranking.» dentro de un «p». */}
        <p className="text-sm text-destructive">No se pudo cargar el ranking.</p>
        {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          {/* Esta línea sirve para mostrar el texto «Reintentar». */}
          Reintentar
        </Button>
      </div>
    )
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el bloque animado.
    <motion.div
      // Esta línea sirve para identificar el elemento de la lista con «`${scope}-${sex}`}».
      key={`${scope}-${sex}`}
      // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 0, y: 6 }}».
      initial={{ opacity: 0, y: 6 }}
      // Esta línea sirve para pasar la propiedad «animate» con el valor «{ opacity: 1, y: 0 }}».
      animate={{ opacity: 1, y: 0 }}
      // Esta línea sirve para pasar la propiedad «transition» con el valor «{ duration: 0.25 }}».
      transition={{ duration: 0.25 }}
      // Esta línea sirve para aplicar las clases de estilo «flex flex-col gap-2».
      className="flex flex-col gap-2"
    >
      {/* Esta línea sirve para mostrar el elemento solo si «data?.scope_label». */}
      {data?.scope_label && <p className="text-xs text-muted-foreground">{data.scope_label}</p>}
      {/* Esta línea sirve para abrir el componente «ExerciseRankingList». */}
      <ExerciseRankingList entries={data?.entries ?? []} viewer={data?.viewer ?? null} />
    </motion.div>
  )
}

// Esta línea sirve para declarar «prSchema» con el valor «z.object({».
const prSchema = z.object({
  // Esta línea sirve para validar el campo «exercise_id» con el esquema de Zod.
  exercise_id: z.coerce.number({ message: "Elige un ejercicio" }).int().positive(),
  // Esta línea sirve para validar el campo «weight_kg» con el esquema de Zod.
  weight_kg: z.coerce.number({ message: "Ingresa el peso" }).positive("El peso debe ser mayor a 0"),
  // Esta línea sirve para validar el campo «reps» con el esquema de Zod.
  reps: z.coerce.number({ message: "Ingresa las repeticiones" }).int().min(1).max(50),
})

// Esta línea sirve para declarar el tipo «PrFormInput» como «z.input<typeof prSchema>».
type PrFormInput = z.input<typeof prSchema>
// Esta línea sirve para declarar el tipo «PrFormValues» como «z.output<typeof prSchema>».
type PrFormValues = z.output<typeof prSchema>

// Esta línea sirve para declarar la función «PersonalRecordsPage».
export function PersonalRecordsPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «serverError» y su función «setServerError».
  const [serverError, setServerError] = useState<string | null>(null)
  // Esta línea sirve para crear el estado «confirmation» y su función «setConfirmation».
  const [confirmation, setConfirmation] = useState<string | null>(null)
  // Esta línea sirve para crear el estado «confirmationIsNewBest» y su función «setConfirmationIsNewBest».
  const [confirmationIsNewBest, setConfirmationIsNewBest] = useState(false)
  // Esta línea sirve para crear el estado «rankingExerciseId» y su función «setRankingExerciseId».
  const [rankingExerciseId, setRankingExerciseId] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «rankingSex» y su función «setRankingSex».
  const [rankingSex, setRankingSex] = useState<ExerciseRankingSex>("male")

  // Esta línea sirve para obtener «data: exerciseCatalog» con el hook «useQuery».
  const { data: exerciseCatalog } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["exercises"]».
    queryKey: ["exercises"],
    // Esta línea sirve para pedir a la API los datos de «/exercises».
    queryFn: () => api.get<ExerciseCatalogItem[]>("/exercises"),
  })

  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «register» en la lista.
    register,
    // Esta línea sirve para incluir el valor «handleSubmit» en la lista.
    handleSubmit,
    // Esta línea sirve para incluir el valor «reset» en la lista.
    reset,
    // Esta línea sirve para declarar la propiedad «formState» con el valor o tipo «{ errors, isSubmitting }».
    formState: { errors, isSubmitting },
  // Esta línea sirve para cerrar la desestructuración y crear el formulario validado del récord.
  } = useForm<PrFormInput, unknown, PrFormValues>({ resolver: zodResolver(prSchema), defaultValues: { reps: 1 } })

  // Esta línea sirve para obtener «submitMutation» con el hook «useMutation».
  const submitMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(values: PrFormValues) =>».
    mutationFn: (values: PrFormValues) =>
      // Esta línea sirve para enviar el nuevo récord personal a la API.
      api.postWithMeta<PersonalRecordSummary>("/stats/personal-records", values),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (envelope) => {
      // Esta línea sirve para extraer «et» de «envelope.meta as RegisterPersonalRecordM».
      const meta = envelope.meta as RegisterPersonalRecordMeta | undefined
      // Esta línea sirve para guardar en el estado con «setConfirmationIsNewBest» el valor «Boolean(meta?.is_new_best))…».
      setConfirmationIsNewBest(Boolean(meta?.is_new_best))
      // La página ya no tiene grilla de récords (pedido del tester): la
      // confirmación muestra el récord vigente, nuevo o conservado.
      // Esta línea sirve para extraer «urren» de «formatPersonalRecord(envelope.data)».
      const current = formatPersonalRecord(envelope.data)
      // Esta línea sirve para extraer «xerciseNam» de «envelope.data.exercise_name».
      const exerciseName = envelope.data.exercise_name
      // Esta línea sirve para mostrar la confirmación.
      setConfirmation(
        // Esta línea sirve para elegir el mensaje según si es un nuevo mejor.
        meta?.is_new_best
          // Esta línea sirve para felicitar por el nuevo récord con el nombre del ejercicio y el valor.
          ? `¡Nuevo récord personal!${exerciseName ? ` ${exerciseName}:` : ""} ${current}`
          // Esta línea sirve para avisar que no supera el récord actual.
          : `No supera tu récord actual (${current}) — se conserva el anterior.`
      )
      // Esta línea sirve para refrescar los récords personales.
      queryClient.invalidateQueries({ queryKey: ["stats", "personal-records"] })
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["stats", "dashboard"] }».
      queryClient.invalidateQueries({ queryKey: ["stats", "dashboard"] })
      // Esta línea sirve para limpiar el formulario del récord.
      reset({ exercise_id: undefined, weight_kg: undefined, reps: 1 })
    },
  })

  // Esta línea sirve para extraer «nSubmi» de «async (values: PrFormValues) => {».
  const onSubmit = async (values: PrFormValues) => {
    // Esta línea sirve para guardar en el estado con «setServerError» el valor «null)…».
    setServerError(null)
    // Esta línea sirve para guardar en el estado con «setConfirmation» el valor «null)…».
    setConfirmation(null)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «submitMutation.mutateAsync».
      await submitMutation.mutateAsync(values)
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el estado con «setServerError» el valor «err instanceof ApiError ? err.body.message : …».
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo registrar el PR.")
    }
  }

  // Esta línea sirve para crear el estado «submissionServerError» y su función «setSubmissionServerError».
  const [submissionServerError, setSubmissionServerError] = useState<string | null>(null)
  // Esta línea sirve para crear el estado «submissionConfirmation» y su función «setSubmissionConfirmation».
  const [submissionConfirmation, setSubmissionConfirmation] = useState<string | null>(null)
  // Esta línea sirve para crear el estado «submissionVideo» y su función «setSubmissionVideo».
  const [submissionVideo, setSubmissionVideo] = useState<File | null>(null)
  // Esta línea sirve para crear la referencia «submissionVideoInputRef».
  const submissionVideoInputRef = useRef<HTMLInputElement>(null)

  // Esta línea sirve para pedir las postulaciones de récord del usuario.
  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["pr-submissions"]».
    queryKey: ["pr-submissions"],
    // Esta línea sirve para pedir a la API los datos de «/pr-submissions».
    queryFn: () => api.get<PrSubmission[]>("/pr-submissions"),
  })

  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para declarar la propiedad «register» con el valor o tipo «registerSubmission».
    register: registerSubmission,
    // Esta línea sirve para declarar la propiedad «handleSubmit» con el valor o tipo «handleSubmitSubmission».
    handleSubmit: handleSubmitSubmission,
    // Esta línea sirve para declarar la propiedad «reset» con el valor o tipo «resetSubmissionForm».
    reset: resetSubmissionForm,
    // Esta línea sirve para obtener el estado de errores y de envío del formulario.
    formState: { errors: submissionErrors, isSubmitting: isSubmittingSubmission },
  // Esta línea sirve para cerrar la desestructuración y crear el formulario de postulación.
  } = useForm<PrFormInput, unknown, PrFormValues>({ resolver: zodResolver(prSchema), defaultValues: { reps: 1 } })

  // Esta línea sirve para obtener «createSubmissionMutation» con el hook «useMutation».
  const createSubmissionMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/pr-submissions».
    mutationFn: (values: PrFormValues) => api.post<PrSubmission>("/pr-submissions", values),
  })

  // El video se elige en el mismo formulario y se sube apenas se crea la
  // postulación — antes había que postular primero y después buscar el
  // botón en la lista, y el tester no encontraba cómo cargar la evidencia.
  // Esta línea sirve para extraer «nSubmitSubmissio» de «async (values: PrFormValues) => {».
  const onSubmitSubmission = async (values: PrFormValues) => {
    // Esta línea sirve para guardar en el estado con «setSubmissionServerError» el valor «null)…».
    setSubmissionServerError(null)
    // Esta línea sirve para guardar en el estado con «setSubmissionConfirmation» el valor «null)…».
    setSubmissionConfirmation(null)
    // Esta línea sirve para revisar si «!submissionVideo».
    if (!submissionVideo) {
      // Esta línea sirve para guardar en el estado con «setSubmissionServerError» el valor «"Adjunta un video de evidencia para que pueda…».
      setSubmissionServerError("Adjunta un video de evidencia para que puedan verificar tu PR.")
      // Esta línea sirve para terminar la función sin devolver nada.
      return
    }
    // Esta línea sirve para revisar si «submissionVideo.size > MAX_VIDEO_BYTES».
    if (submissionVideo.size > MAX_VIDEO_BYTES) {
      // Esta línea sirve para guardar en el estado con «setSubmissionServerError» el valor «"El video pesa más de 100 MB — recórtalo o gr…».
      setSubmissionServerError("El video pesa más de 100 MB — recórtalo o grábalo en menor calidad.")
      // Esta línea sirve para terminar la función sin devolver nada.
      return
    }

    // Esta línea sirve para declarar la variable «created» sin valor inicial.
    let created: PrSubmission
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para asignar «await createSubmissionMutation.mutateAsync(values)» a «created».
      created = await createSubmissionMutation.mutateAsync(values)
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para guardar en el estado con «setSubmissionServerError» el valor «err instanceof ApiError ? err.body.message : …».
      setSubmissionServerError(err instanceof ApiError ? err.body.message : "No se pudo postular el PR.")
      // Esta línea sirve para terminar la función sin devolver nada.
      return
    }

    // Esta línea sirve para limpiar el formulario de postulación.
    resetSubmissionForm({ exercise_id: undefined, weight_kg: undefined, reps: 1 })
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para extraer «ormDat» de «new FormData()».
      const formData = new FormData()
      // Esta línea sirve para llamar a «formData.append» con «"video", submissionVideo».
      formData.append("video", submissionVideo)
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post(`/pr-submissions/${created.id}/video`, formData)
      // Esta línea sirve para guardar en el estado con «setSubmissionConfirmation» el valor «"¡Postulación enviada con su video! Te avisar…».
      setSubmissionConfirmation("¡Postulación enviada con su video! Te avisaremos cuando la revisen.")
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para mostrar el error de la postulación.
      setSubmissionServerError(
        // Esta línea sirve para revisar si el error vino de la API.
        err instanceof ApiError
          // Esta línea sirve para avisar que se creó la postulación pero falló el video, con el motivo.
          ? `Se creó la postulación pero el video no se pudo subir: ${err.body.message}`
          // Esta línea sirve para avisar que se creó la postulación pero falló el video, con instrucciones.
          : "Se creó la postulación pero el video no se pudo subir. Reintenta desde la lista de abajo."
      )
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para guardar en el estado con «setSubmissionVideo» el valor «null)…».
      setSubmissionVideo(null)
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["pr-submissions"] }».
      queryClient.invalidateQueries({ queryKey: ["pr-submissions"] })
    }
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-lg flex-col gap-6». */}
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        {/* Esta línea sirve para abrir el elemento «div». */}
        <div>
          {/* Esta línea sirve para mostrar el texto «Personal Records» dentro de un «h1». */}
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Personal Records</h1>
        </div>

        {/* Esta línea sirve para abrir el elemento «form» con sus atributos en varias líneas. */}
        <form
          // Esta línea sirve para asignar el manejador del evento «onSubmit».
          onSubmit={handleSubmit(onSubmit)}
          // Esta línea sirve para aplicar las clases de estilo «w-full space-y-4 rounded-xl border border-bor».
          className="w-full space-y-4 rounded-xl border border-border bg-card p-6"
        >
          {/* Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-muted-foreground». */}
          <p className="text-xs text-muted-foreground">
            {/* Esta línea sirve para aclarar que el registro no modifica ninguna sesión de entrenamiento. */}
            Independiente de tu entrenamiento — no crea ni modifica ninguna sesión.
          </p>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
          <div className="space-y-1.5">
            {/* Esta línea sirve para abrir el elemento «label». */}
            <label htmlFor="exercise_id" className="text-sm font-medium">
              {/* Esta línea sirve para mostrar el texto «Ejercicio». */}
              Ejercicio
            </label>
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para definir el atributo «id» con el valor «exercise_id».
              id="exercise_id"
              // Esta línea sirve para conectar el campo «exercise_id» con el formulario.
              {...register("exercise_id")}
              // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              // Esta línea sirve para definir el atributo «defaultValue» con el valor «».
              defaultValue=""
            >
              {/* Esta línea sirve para abrir el elemento «option». */}
              <option value="" disabled>
                {/* Esta línea sirve para mostrar el texto «Selecciona un ejercicio». */}
                Selecciona un ejercicio
              </option>
              {/* Esta línea sirve para recorrer «exerciseCatalog?» y mostrar un bloque por elemento. */}
              {exerciseCatalog?.map((exercise) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={exercise.id} value={exercise.id}>
                  {/* Esta línea sirve para mostrar el valor «exercise.name». */}
                  {exercise.name}
                </option>
              ))}
            </select>
            {/* Esta línea sirve para mostrar el elemento solo si «errors.exercise_id». */}
            {errors.exercise_id && <p className="text-xs text-destructive">{errors.exercise_id.message}</p>}
          </div>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-2 gap-3». */}
          <div className="grid grid-cols-2 gap-3">
            {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
            <div className="space-y-1.5">
              {/* Esta línea sirve para abrir el elemento «label». */}
              <label htmlFor="weight_kg" className="text-sm font-medium">
                {/* Esta línea sirve para mostrar el texto «Peso (kg)». */}
                Peso (kg)
              </label>
              {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
              <input
                // Esta línea sirve para definir el atributo «id» con el valor «weight_kg».
                id="weight_kg"
                // Esta línea sirve para definir el atributo «type» con el valor «number».
                type="number"
                // Esta línea sirve para definir el atributo «step» con el valor «0.5».
                step="0.5"
                // Esta línea sirve para conectar el campo «weight_kg» con el formulario.
                {...register("weight_kg")}
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {/* Esta línea sirve para mostrar el elemento solo si «errors.weight_kg». */}
              {errors.weight_kg && <p className="text-xs text-destructive">{errors.weight_kg.message}</p>}
            </div>

            {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
            <div className="space-y-1.5">
              {/* Esta línea sirve para abrir el elemento «label». */}
              <label htmlFor="reps" className="text-sm font-medium">
                {/* Esta línea sirve para mostrar el texto «Repeticiones». */}
                Repeticiones
              </label>
              {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
              <input
                // Esta línea sirve para definir el atributo «id» con el valor «reps».
                id="reps"
                // Esta línea sirve para definir el atributo «type» con el valor «number».
                type="number"
                // Esta línea sirve para conectar el campo «reps» con el formulario.
                {...register("reps")}
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {/* Esta línea sirve para mostrar el elemento solo si «errors.reps». */}
              {errors.reps && <p className="text-xs text-destructive">{errors.reps.message}</p>}
            </div>
          </div>

          {/* Esta línea sirve para mostrar el elemento solo si «serverError». */}
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          {/* Esta línea sirve para abrir el componente «AnimatePresence». */}
          <AnimatePresence>
            {/* Esta línea sirve para mostrar el bloque solo si «confirmation && confirmationIsNewBest». */}
            {confirmation && confirmationIsNewBest && (
              // Esta línea sirve para abrir el párrafo animado de confirmación.
              <motion.p
                // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 0, scale: 0.9 }}».
                initial={{ opacity: 0, scale: 0.9 }}
                // Esta línea sirve para pasar la propiedad «animate» con el valor «{ opacity: 1, scale: 1 }}».
                animate={{ opacity: 1, scale: 1 }}
                // Esta línea sirve para pasar la propiedad «transition» con el valor «{ type: "spring", stiffness: 400, damping: 18».
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                // Esta línea sirve para aplicar las clases de estilo «flex items-center gap-1.5 rounded-lg bg-prima».
                className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-bold tracking-wide text-primary uppercase shadow-[0_0_16px_-4px_var(--primary)]"
              >
                {/* Esta línea sirve para abrir el componente «Trophy». */}
                <Trophy className="size-4" />
                {/* Esta línea sirve para mostrar el valor «confirmation». */}
                {confirmation}
              </motion.p>
            )}
          </AnimatePresence>
          {/* Esta línea sirve para mostrar el elemento solo si «confirmation && !confirmationIsNewBest». */}
          {confirmation && !confirmationIsNewBest && <p className="text-sm text-muted-foreground">{confirmation}</p>}

          {/* Esta línea sirve para abrir el componente «Button». */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {/* Esta línea sirve para mostrar el contenido dinámico «{isSubmitting ? "Registrando…" : "Registrar PR"}». */}
            {isSubmitting ? "Registrando…" : "Registrar PR"}
          </Button>
        </form>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ». */}
        <div className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Postular PR para Rankings» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium text-foreground">Postular PR para Rankings</h2>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground». */}
          <p className="mt-1 text-xs text-muted-foreground">
            {/* Esta línea sirve para explicar que hace falta un video de evidencia para verificar el récord. */}
            Adjunta un video de evidencia para que un entrenador o administrador verifique tu PR. Solo los aprobados
            aparecen en Rankings públicos; tus récords personales siguen siendo privados.
          </p>

          {/* Esta línea sirve para abrir el elemento «form». */}
          <form onSubmit={handleSubmitSubmission(onSubmitSubmission)} className="mt-4 space-y-4">
            {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
            <div className="space-y-1.5">
              {/* Esta línea sirve para abrir el elemento «label». */}
              <label htmlFor="submission_exercise_id" className="text-sm font-medium">
                {/* Esta línea sirve para mostrar el texto «Ejercicio». */}
                Ejercicio
              </label>
              {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
              <select
                // Esta línea sirve para definir el atributo «id» con el valor «submission_exercise_id».
                id="submission_exercise_id"
                // Esta línea sirve para conectar el campo «exercise_id» con el formulario.
                {...registerSubmission("exercise_id")}
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                // Esta línea sirve para definir el atributo «defaultValue» con el valor «».
                defaultValue=""
              >
                {/* Esta línea sirve para abrir el elemento «option». */}
                <option value="" disabled>
                  {/* Esta línea sirve para mostrar el texto «Selecciona un ejercicio». */}
                  Selecciona un ejercicio
                </option>
                {/* Esta línea sirve para recorrer «exerciseCatalog?» y mostrar un bloque por elemento. */}
                {exerciseCatalog?.map((exercise) => (
                  // Esta línea sirve para abrir el elemento «option».
                  <option key={exercise.id} value={exercise.id}>
                    {/* Esta línea sirve para mostrar el valor «exercise.name». */}
                    {exercise.name}
                  </option>
                ))}
              </select>
              {/* Esta línea sirve para mostrar el bloque solo si «submissionErrors.exercise_id». */}
              {submissionErrors.exercise_id && (
                // Esta línea sirve para mostrar el valor «submissionErrors.exercise_id.message» dentro de un «p».
                <p className="text-xs text-destructive">{submissionErrors.exercise_id.message}</p>
              )}
            </div>

            {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
            <div className="space-y-1.5">
              {/* Esta línea sirve para abrir el elemento «label». */}
              <label htmlFor="submission_weight_kg" className="text-sm font-medium">
                {/* Esta línea sirve para mostrar el texto «Peso (kg)». */}
                Peso (kg)
              </label>
              {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
              <input
                // Esta línea sirve para definir el atributo «id» con el valor «submission_weight_kg».
                id="submission_weight_kg"
                // Esta línea sirve para definir el atributo «type» con el valor «number».
                type="number"
                // Esta línea sirve para definir el atributo «step» con el valor «0.5».
                step="0.5"
                // Esta línea sirve para conectar el campo «weight_kg» con el formulario.
                {...registerSubmission("weight_kg")}
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {/* Esta línea sirve para mostrar el bloque solo si «submissionErrors.weight_kg». */}
              {submissionErrors.weight_kg && (
                // Esta línea sirve para mostrar el valor «submissionErrors.weight_kg.message» dentro de un «p».
                <p className="text-xs text-destructive">{submissionErrors.weight_kg.message}</p>
              )}
            </div>

            {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
            <div className="space-y-1.5">
              {/* Esta línea sirve para abrir el elemento «label». */}
              <label htmlFor="submission_reps" className="text-sm font-medium">
                {/* Esta línea sirve para mostrar el texto «Repeticiones». */}
                Repeticiones
              </label>
              {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
              <input
                // Esta línea sirve para definir el atributo «id» con el valor «submission_reps».
                id="submission_reps"
                // Esta línea sirve para definir el atributo «type» con el valor «number».
                type="number"
                // Esta línea sirve para conectar el campo «reps» con el formulario.
                {...registerSubmission("reps")}
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {/* Esta línea sirve para mostrar el elemento solo si «submissionErrors.reps». */}
              {submissionErrors.reps && <p className="text-xs text-destructive">{submissionErrors.reps.message}</p>}
            </div>

            {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
            <div className="space-y-1.5">
              {/* Esta línea sirve para mostrar el texto «Video de evidencia» dentro de un «span». */}
              <span className="text-sm font-medium">Video de evidencia</span>
              {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
              <input
                // Esta línea sirve para conectar la referencia «submissionVideoInputRef}» con el elemento.
                ref={submissionVideoInputRef}
                // Esta línea sirve para definir el atributo «type» con el valor «file».
                type="file"
                // Esta línea sirve para definir el atributo «accept» con el valor «video/mp4,video/webm,video/quicktime».
                accept="video/mp4,video/webm,video/quicktime"
                // Esta línea sirve para aplicar las clases de estilo «hidden».
                className="hidden"
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(e) => {
                  // Esta línea sirve para guardar en el estado con «setSubmissionVideo» el valor «e.target.files?.[0] ?? null)…».
                  setSubmissionVideo(e.target.files?.[0] ?? null)
                  // Esta línea sirve para asignar «""» a «e.target.value».
                  e.target.value = ""
                }}
              />
              {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
              <button
                // Esta línea sirve para definir el atributo «type» con el valor «button».
                type="button"
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => submissionVideoInputRef.current?.click()}
                // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
                className={cn(
                  // Esta línea sirve para incluir el texto o las clases «flex w-full items-center justify-between gap-…».
                  "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm",
                  // Esta línea sirve para elegir el estilo del selector según si hay video.
                  submissionVideo ? "border-primary text-foreground" : "border-input text-muted-foreground"
                )}
              >
                {/* Esta línea sirve para abrir el elemento «span» con las clases «flex min-w-0 items-center gap-2». */}
                <span className="flex min-w-0 items-center gap-2">
                  {/* Esta línea sirve para abrir el componente «Video». */}
                  <Video className={cn("size-4 shrink-0", submissionVideo && "text-primary")} />
                  {/* Esta línea sirve para abrir el elemento «span» con sus propiedades. */}
                  <span className="truncate">{submissionVideo ? submissionVideo.name : "Adjuntar video de evidencia"}</span>
                </span>
                {/* Esta línea sirve para mostrar el valor «submissionVideo ? "Cambiar" : "Elegir"» dentro de un «span». */}
                <span className="text-primary">{submissionVideo ? "Cambiar" : "Elegir"}</span>
              </button>
            </div>

            {/* Esta línea sirve para mostrar el elemento solo si «submissionServerError». */}
            {submissionServerError && <p className="text-sm text-destructive">{submissionServerError}</p>}
            {/* Esta línea sirve para mostrar el bloque solo si «submissionConfirmation && !submissionServerError». */}
            {submissionConfirmation && !submissionServerError && (
              // Esta línea sirve para mostrar el valor «submissionConfirmation» dentro de un «p».
              <p className="text-sm text-primary">{submissionConfirmation}</p>
            )}

            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button type="submit" disabled={isSubmittingSubmission} className="w-full">
              {/* Esta línea sirve para mostrar el contenido dinámico «{isSubmittingSubmission ? "Enviando…" : "Postular PR"}». */}
              {isSubmittingSubmission ? "Enviando…" : "Postular PR"}
            </Button>
          </form>

          {/* Esta línea sirve para mostrar el elemento solo si «isLoadingSubmissions». */}
          {isLoadingSubmissions && <Skeleton className="mt-4 h-20 w-full" />}

          {/* Esta línea sirve para mostrar la lista solo si ya cargó y hay postulaciones. */}
          {!isLoadingSubmissions && (submissions?.length ?? 0) > 0 && (
            // Esta línea sirve para abrir el elemento «ul» con las clases «mt-4 divide-y divide-border».
            <ul className="mt-4 divide-y divide-border">
              {/* Esta línea sirve para recorrer «submissions!» y mostrar un bloque por elemento. */}
              {submissions!.map((submission) => (
                // Esta línea sirve para abrir el elemento «li».
                <li key={submission.id} className="flex flex-col gap-2 py-3 text-sm">
                  {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center justify-between». */}
                  <div className="flex items-center justify-between">
                    {/* Esta línea sirve para abrir el elemento «span» con las clases «text-foreground». */}
                    <span className="text-foreground">
                      {/* Esta línea sirve para mostrar el ejercicio, el peso y las repeticiones de la postulación. */}
                      {submission.exercise.name} — {submission.weight_kg} kg × {submission.reps}
                    </span>
                    {/* Esta línea sirve para mostrar el valor «STATUS_LABEL[submission.status]» dentro de «Badge». */}
                    <Badge variant={STATUS_VARIANT[submission.status]}>{STATUS_LABEL[submission.status]}</Badge>
                  </div>
                  {/* Esta línea sirve para mostrar el motivo de rechazo si fue rechazada. */}
                  {submission.status === "rejected" && submission.rejection_reason && (
                    // Esta línea sirve para abrir el elemento «p» con sus propiedades.
                    <p className="text-xs text-destructive">Motivo: {submission.rejection_reason}</p>
                  )}
                  {/* Esta línea sirve para avisar que falta subir el video si está pendiente y sin video. */}
                  {submission.status === "pending" && !submission.video_url && (
                    // Esta línea sirve para abrir el componente «PrSubmissionVideoUpload».
                    <PrSubmissionVideoUpload submission={submission} />
                  )}
                  {/* Esta línea sirve para mostrar el elemento solo si «submission.video_url». */}
                  {submission.video_url && <PrSubmissionVideo videoUrl={submission.video_url} />}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ». */}
        <div className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Rankings por ejercicio» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium text-foreground">Rankings por ejercicio</h2>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 space-y-1.5». */}
          <div className="mt-3 space-y-1.5">
            {/* Esta línea sirve para abrir el elemento «label». */}
            <label htmlFor="ranking_exercise_id" className="text-sm font-medium">
              {/* Esta línea sirve para mostrar el texto «Ejercicio». */}
              Ejercicio
            </label>
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para definir el atributo «id» con el valor «ranking_exercise_id».
              id="ranking_exercise_id"
              // Esta línea sirve para pasar la propiedad «value» con el valor «rankingExerciseId ?? ""}».
              value={rankingExerciseId ?? ""}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setRankingExerciseId(e.target.value ? Number(e.target.value) : null)}
              // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {/* Esta línea sirve para mostrar el texto «Selecciona un ejercicio» dentro de un «option». */}
              <option value="">Selecciona un ejercicio</option>
              {/* Esta línea sirve para recorrer «exerciseCatalog?» y mostrar un bloque por elemento. */}
              {exerciseCatalog?.map((exercise) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={exercise.id} value={exercise.id}>
                  {/* Esta línea sirve para mostrar el valor «exercise.name». */}
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>

          {/* Esta línea sirve para mostrar el bloque solo si «rankingExerciseId». */}
          {rankingExerciseId && (
            // Esta línea sirve para abrir el elemento «div» con las clases «mt-4 space-y-3».
            <div className="mt-4 space-y-3">
              {/* Esta línea sirve para abrir el elemento «div» con las clases «flex gap-2». */}
              <div className="flex gap-2">
                {/* Esta línea sirve para recorrer «RANKING_SEXES» y mostrar un bloque por elemento. */}
                {RANKING_SEXES.map((s) => (
                  // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
                  <Button
                    // Esta línea sirve para identificar el elemento de la lista con «s.value}».
                    key={s.value}
                    // Esta línea sirve para definir el atributo «type» con el valor «button».
                    type="button"
                    // Esta línea sirve para definir el atributo «size» con el valor «sm».
                    size="sm"
                    // Esta línea sirve para pasar la propiedad «variant» con el valor «rankingSex === s.value ? "default" : "outline».
                    variant={rankingSex === s.value ? "default" : "outline"}
                    // Esta línea sirve para asignar el manejador del evento «onClick».
                    onClick={() => setRankingSex(s.value)}
                  >
                    {/* Esta línea sirve para mostrar el valor «s.label». */}
                    {s.label}
                  </Button>
                ))}
              </div>

              {/* Esta línea sirve para abrir el componente «Tabs». */}
              <Tabs defaultValue="global">
                {/* Esta línea sirve para abrir el componente «TabsList». */}
                <TabsList>
                  {/* Esta línea sirve para recorrer «RANKING_SCOPES» y mostrar un bloque por elemento. */}
                  {RANKING_SCOPES.map((s) => (
                    // Esta línea sirve para abrir el componente «TabsTrigger».
                    <TabsTrigger key={s.value} value={s.value}>
                      {/* Esta línea sirve para mostrar el valor «s.label». */}
                      {s.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Esta línea sirve para recorrer «RANKING_SCOPES» y mostrar un bloque por elemento. */}
                {RANKING_SCOPES.map((s) => (
                  // Esta línea sirve para abrir el componente «TabsContent».
                  <TabsContent key={s.value} value={s.value}>
                    {/* Esta línea sirve para abrir el componente «ExerciseRankingPanel». */}
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
