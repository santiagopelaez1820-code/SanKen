// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «AdminExercise, MuscleGroupOption» desde «@sanken/core».
import type { AdminExercise, MuscleGroupOption } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «ExerciseVideoControls» desde «@/components/admin/ExerciseVideoControls».
import { ExerciseVideoControls } from "@/components/admin/ExerciseVideoControls"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la interfaz «ExerciseFormState».
interface ExerciseFormState {
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string
  // Esta línea sirve para declarar la propiedad «primary_muscle_id» con el valor o tipo «string».
  primary_muscle_id: string
  // Esta línea sirve para declarar la propiedad «equipment» con el valor o tipo «string».
  equipment: string
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «string».
  level: string
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «string».
  type: string
  // Esta línea sirve para declarar la propiedad «instructions» con el valor o tipo «string».
  instructions: string
  // Esta línea sirve para declarar la propiedad «video_url» con el valor o tipo «string».
  video_url: string
  // Esta línea sirve para declarar la propiedad «alternative_exercise_id» con el valor o tipo «string».
  alternative_exercise_id: string
}

// Esta línea sirve para declarar «EMPTY_FORM» con el valor «{».
const EMPTY_FORM: ExerciseFormState = {
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «""».
  name: "",
  // Esta línea sirve para declarar la propiedad «primary_muscle_id» con el valor o tipo «""».
  primary_muscle_id: "",
  // Esta línea sirve para declarar la propiedad «equipment» con el valor o tipo «"barbell"».
  equipment: "barbell",
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «"beginner"».
  level: "beginner",
  // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «"compound"».
  type: "compound",
  // Esta línea sirve para declarar la propiedad «instructions» con el valor o tipo «""».
  instructions: "",
  // Esta línea sirve para declarar la propiedad «video_url» con el valor o tipo «""».
  video_url: "",
  // Esta línea sirve para declarar la propiedad «alternative_exercise_id» con el valor o tipo «""».
  alternative_exercise_id: "",
}

// Esta línea sirve para declarar «EQUIPMENT_OPTIONS» con el valor «[».
const EQUIPMENT_OPTIONS = [
  // Esta línea sirve para incluir el texto o las clases «barbell…».
  "barbell", "dumbbells", "bench", "squat_rack", "pull_up_bar",
  // Esta línea sirve para incluir el texto o las clases «cables…».
  "cables", "machines", "kettlebells", "resistance_bands", "bodyweight_only",
]
// Esta línea sirve para declarar «LEVEL_OPTIONS» con el valor «["beginner", "intermediate", "advanced"]».
const LEVEL_OPTIONS = ["beginner", "intermediate", "advanced"]
// Esta línea sirve para declarar «TYPE_OPTIONS» con el valor «["compound", "isolation", "cardio", "mobility"]».
const TYPE_OPTIONS = ["compound", "isolation", "cardio", "mobility"]

// Esta línea sirve para declarar la función «AdminExercisesPage».
export function AdminExercisesPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «form» y su función «setForm».
  const [form, setForm] = useState<ExerciseFormState>(EMPTY_FORM)
  // Esta línea sirve para crear el estado «editingId» y su función «setEditingId».
  const [editingId, setEditingId] = useState<number | null>(null)

  // Esta línea sirve para obtener «data: response, isLoading» con el hook «useQuery».
  const { data: response, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "exercises"]».
    queryKey: ["admin", "exercises"],
    // Esta línea sirve para pedir la lista de ejercicios a la API.
    queryFn: () => api.getWithMeta<AdminExercise[]>("/admin/exercises"),
  })
  // Esta línea sirve para extraer «uscleGroup» de «(response?.meta?.muscle_groups as Muscle».
  const muscleGroups = (response?.meta?.muscle_groups as MuscleGroupOption[] | undefined) ?? []

  // Esta línea sirve para extraer «nvalidat» de «() => queryClient.invalidateQueries({ qu».
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "exercises"] })

  // Esta línea sirve para extraer «uildPayloa» de «() => ({».
  const buildPayload = () => ({
    // Esta línea sirve para copiar las propiedades de «form».
    ...form,
    // Esta línea sirve para declarar la propiedad «primary_muscle_id» con el valor o tipo «Number(form.primary_muscle_id)».
    primary_muscle_id: Number(form.primary_muscle_id),
    // Esta línea sirve para declarar la propiedad «video_url» con el valor o tipo «form.video_url.trim() || null».
    video_url: form.video_url.trim() || null,
    // Esta línea sirve para convertir el ejercicio alternativo a número o null si está vacío.
    alternative_exercise_id: form.alternative_exercise_id ? Number(form.alternative_exercise_id) : null,
  })

  // Esta línea sirve para obtener «createMutation» con el hook «useMutation».
  const createMutation = useMutation({
    // Esta línea sirve para enviar el nuevo ejercicio a la API.
    mutationFn: () => api.post("/admin/exercises", buildPayload()),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «setForm» con «EMPTY_FORM».
      setForm(EMPTY_FORM)
      // Esta línea sirve para llamar a «invalidate».
      invalidate()
    },
  })

  // Esta línea sirve para obtener «updateMutation» con el hook «useMutation».
  const updateMutation = useMutation({
    // Esta línea sirve para enviar los cambios del ejercicio a la API.
    mutationFn: (id: number) => api.patch(`/admin/exercises/${id}`, buildPayload()),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «setEditingId» con «null».
      setEditingId(null)
      // Esta línea sirve para llamar a «setForm» con «EMPTY_FORM».
      setForm(EMPTY_FORM)
      // Esta línea sirve para llamar a «invalidate».
      invalidate()
    },
  })

  // Esta línea sirve para obtener «deactivateMutation» con el hook «useMutation».
  const deactivateMutation = useMutation({
    // Esta línea sirve para enviar la petición de borrado del ejercicio a la API.
    mutationFn: (id: number) => api.delete(`/admin/exercises/${id}`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para extraer «tartEdi» de «(exercise: AdminExercise) => {».
  const startEdit = (exercise: AdminExercise) => {
    // Esta línea sirve para llamar a «setEditingId» con «exercise.id».
    setEditingId(exercise.id)
    // Esta línea sirve para cargar el formulario con los datos del ejercicio.
    setForm({
      // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «exercise.name».
      name: exercise.name,
      // Esta línea sirve para declarar la propiedad «primary_muscle_id» con el valor o tipo «String(exercise.primary_muscle_id)».
      primary_muscle_id: String(exercise.primary_muscle_id),
      // Esta línea sirve para declarar la propiedad «equipment» con el valor o tipo «exercise.equipment».
      equipment: exercise.equipment,
      // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «exercise.level».
      level: exercise.level,
      // Esta línea sirve para declarar la propiedad «type» con el valor o tipo «exercise.type».
      type: exercise.type,
      // Esta línea sirve para declarar la propiedad «instructions» con el valor o tipo «exercise.instructions ?? ""».
      instructions: exercise.instructions ?? "",
      // Esta línea sirve para declarar la propiedad «video_url» con el valor o tipo «exercise.video_url ?? ""».
      video_url: exercise.video_url ?? "",
      // Esta línea sirve para usar el id de la primera alternativa o texto vacío.
      alternative_exercise_id: exercise.alternatives[0] ? String(exercise.alternatives[0].id) : "",
    })
  }

  // Esta línea sirve para extraer «ancelEdi» de «() => {».
  const cancelEdit = () => {
    // Esta línea sirve para llamar a «setEditingId» con «null».
    setEditingId(null)
    // Esta línea sirve para llamar a «setForm» con «EMPTY_FORM».
    setForm(EMPTY_FORM)
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-4xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Ejercicios» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Ejercicios</h1>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el valor «editingId ? "Editar ejercicio" : "Nuevo ejercicio"» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium">{editingId ? "Editar ejercicio" : "Nuevo ejercicio"}</h2>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 grid grid-cols-2 gap-3». */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Nombre».
              placeholder="Nombre"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.name}».
              value={form.name}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «col-span-2 rounded-lg border border-input bg-».
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.primary_muscle_id}».
              value={form.primary_muscle_id}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, primary_muscle_id: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {/* Esta línea sirve para mostrar el texto «Músculo principal…» dentro de un «option». */}
              <option value="">Músculo principal…</option>
              {/* Esta línea sirve para recorrer «muscleGroups» y mostrar un bloque por elemento. */}
              {muscleGroups.map((muscle) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={muscle.id} value={muscle.id}>
                  {/* Esta línea sirve para mostrar el valor «muscle.name». */}
                  {muscle.name}
                </option>
              ))}
            </select>
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.equipment}».
              value={form.equipment}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {/* Esta línea sirve para recorrer «EQUIPMENT_OPTIONS» y mostrar un bloque por elemento. */}
              {EQUIPMENT_OPTIONS.map((opt) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={opt} value={opt}>
                  {/* Esta línea sirve para mostrar el valor «opt». */}
                  {opt}
                </option>
              ))}
            </select>
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.level}».
              value={form.level}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {/* Esta línea sirve para recorrer «LEVEL_OPTIONS» y mostrar un bloque por elemento. */}
              {LEVEL_OPTIONS.map((opt) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={opt} value={opt}>
                  {/* Esta línea sirve para mostrar el valor «opt». */}
                  {opt}
                </option>
              ))}
            </select>
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.type}».
              value={form.type}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {/* Esta línea sirve para recorrer «TYPE_OPTIONS» y mostrar un bloque por elemento. */}
              {TYPE_OPTIONS.map((opt) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={opt} value={opt}>
                  {/* Esta línea sirve para mostrar el valor «opt». */}
                  {opt}
                </option>
              ))}
            </select>
            {/* Esta línea sirve para abrir el elemento «textarea» con sus atributos en varias líneas. */}
            <textarea
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Instrucciones (opcional)».
              placeholder="Instrucciones (opcional)"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.instructions}».
              value={form.instructions}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «col-span-2 rounded-lg border border-input bg-».
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «placeholder» con el valor «URL del video (opcional)».
              placeholder="URL del video (opcional)"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.video_url}».
              value={form.video_url}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «col-span-2 rounded-lg border border-input bg-».
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.alternative_exercise_id}».
              value={form.alternative_exercise_id}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, alternative_exercise_id: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «col-span-2 rounded-lg border border-input bg-».
              className="col-span-2 rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              {/* Esta línea sirve para mostrar el texto «Sin ejercicio alternativo (A/B)» dentro de un «option». */}
              <option value="">Sin ejercicio alternativo (A/B)</option>
              {/* Esta línea sirve para mostrar el contenido dinámico «{(response?.data ?? [])». */}
              {(response?.data ?? [])
                // Esta línea sirve para excluir de las alternativas el ejercicio que se está editando.
                .filter((exercise) => exercise.id !== editingId)
                // Esta línea sirve para recorrer los ejercicios restantes para ofrecerlos como alternativa.
                .map((exercise) => (
                  // Esta línea sirve para abrir el elemento «option».
                  <option key={exercise.id} value={exercise.id}>
                    {/* Esta línea sirve para mostrar el valor «exercise.name». */}
                    {exercise.name}
                  </option>
                ))}
            </select>
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex gap-2». */}
          <div className="mt-3 flex gap-2">
            {/* Esta línea sirve para elegir entre dos bloques según «editingId». */}
            {editingId ? (
              // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
              <>
                {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                <Button
                  // Esta línea sirve para definir el atributo «size» con el valor «sm».
                  size="sm"
                  // Esta línea sirve para asignar el manejador del evento «onClick».
                  onClick={() => updateMutation.mutate(editingId)}
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «!form.name || !form.primary_muscle_id || upda».
                  disabled={!form.name || !form.primary_muscle_id || updateMutation.isPending}
                >
                  {/* Esta línea sirve para mostrar el texto «Guardar cambios». */}
                  Guardar cambios
                </Button>
                {/* Esta línea sirve para abrir el componente «Button». */}
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  {/* Esta línea sirve para mostrar el texto «Cancelar». */}
                  Cancelar
                </Button>
              </>
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
              <Button
                // Esta línea sirve para definir el atributo «size» con el valor «sm».
                size="sm"
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => createMutation.mutate()}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «!form.name || !form.primary_muscle_id || crea».
                disabled={!form.name || !form.primary_muscle_id || createMutation.isPending}
              >
                {/* Esta línea sirve para mostrar el texto «Crear». */}
                Crear
              </Button>
            )}
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-20 w-full" />}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && response». */}
          {!isLoading && response && (
            // Esta línea sirve para abrir el elemento «ul» con las clases «divide-y divide-border».
            <ul className="divide-y divide-border">
              {/* Esta línea sirve para recorrer «response.data» y mostrar un bloque por elemento. */}
              {response.data.map((exercise) => (
                // Esta línea sirve para abrir el elemento «li».
                <li key={exercise.id} className="flex flex-col gap-2 py-2.5">
                  {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-center justify-betw». */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
                    <button
                      // Esta línea sirve para asignar el manejador del evento «onClick».
                      onClick={() => startEdit(exercise)}
                      // Esta línea sirve para aplicar las clases de estilo «min-w-0 flex-1 basis-48 text-left text-sm ${e».
                      className={`min-w-0 flex-1 basis-48 text-left text-sm ${exercise.is_active ? "" : "opacity-50"}`}
                    >
                      {/* Esta línea sirve para mostrar el valor «exercise.name». */}
                      {exercise.name}
                      {/* Esta línea sirve para abrir el elemento «span» con las clases «ml-1 text-xs text-muted-foreground». */}
                      <span className="ml-1 text-xs text-muted-foreground">
                        {/* Esta línea sirve para mostrar el músculo, el equipo y el nivel del ejercicio. */}
                        · {exercise.primary_muscle.name} · {exercise.equipment} · {exercise.level}
                        {/* Esta línea sirve para mostrar el nombre de la primera alternativa si existe. */}
                        {exercise.alternatives[0] && ` · alt: ${exercise.alternatives[0].name}`}
                        {/* Esta línea sirve para mostrar el contenido dinámico «{!exercise.is_active && " · inactivo"}». */}
                        {!exercise.is_active && " · inactivo"}
                      </span>
                    </button>
                    {/* Esta línea sirve para mostrar el bloque solo si «exercise.is_active». */}
                    {exercise.is_active && (
                      // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
                      <Button
                        // Esta línea sirve para definir el atributo «variant» con el valor «destructive».
                        variant="destructive"
                        // Esta línea sirve para definir el atributo «size» con el valor «sm».
                        size="sm"
                        // Esta línea sirve para aplicar las clases de estilo «flex-shrink-0».
                        className="flex-shrink-0"
                        // Esta línea sirve para asignar el manejador del evento «onClick».
                        onClick={() => deactivateMutation.mutate(exercise.id)}
                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «deactivateMutation.isPending}».
                        disabled={deactivateMutation.isPending}
                      >
                        {/* Esta línea sirve para mostrar el texto «Desactivar». */}
                        Desactivar
                      </Button>
                    )}
                  </div>
                  {/* Esta línea sirve para abrir el componente «ExerciseVideoControls». */}
                  <ExerciseVideoControls exercise={exercise} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
