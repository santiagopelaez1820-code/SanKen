// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from "react"
// Esta línea sirve para importar «useFieldArray, useForm» desde «react-hook-form».
import { useFieldArray, useForm } from "react-hook-form"
// Esta línea sirve para importar «zodResolver» desde «@hookform/resolvers/zod».
import { zodResolver } from "@hookform/resolvers/zod"
// Esta línea sirve para importar «z» desde «zod».
import { z } from "zod"
// Esta línea sirve para importar «useLocation, useNavigate, useParams» desde «react-router-dom».
import { useLocation, useNavigate, useParams } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ApiError» en la lista.
  ApiError,
  // Esta línea sirve para importar el tipo «ExerciseCatalogItem».
  type ExerciseCatalogItem,
  // Esta línea sirve para importar el tipo «FitnessGoal».
  type FitnessGoal,
  // Esta línea sirve para importar el tipo «ManualRoutinePayload».
  type ManualRoutinePayload,
  // Esta línea sirve para importar el tipo «Routine».
  type Routine,
  // Esta línea sirve para importar el tipo «SplitType».
  type SplitType,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «RoutineDayFieldset» desde «@/components/trainer/RoutineDayFieldset».
import { RoutineDayFieldset } from "@/components/trainer/RoutineDayFieldset"
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «EMPTY_DAY» en la lista.
  EMPTY_DAY,
  // Esta línea sirve para incluir el valor «GOAL_OPTIONS» en la lista.
  GOAL_OPTIONS,
  // Esta línea sirve para incluir el valor «SPLIT_OPTIONS» en la lista.
  SPLIT_OPTIONS,
  // Esta línea sirve para importar el tipo «RoutineFormValues».
  type RoutineFormValues,
// Esta línea sirve para terminar la importación desde «@/components/trainer/routine-form-types».
} from "@/components/trainer/routine-form-types"

// Esta línea sirve para extraer «OAL_VALUE» de «GOAL_OPTIONS.map((o) => o.value) as [Fit».
const GOAL_VALUES = GOAL_OPTIONS.map((o) => o.value) as [FitnessGoal, ...FitnessGoal[]]
// Esta línea sirve para extraer «PLIT_VALUE» de «SPLIT_OPTIONS.map((o) => o.value) as [Sp».
const SPLIT_VALUES = SPLIT_OPTIONS.map((o) => o.value) as [SplitType, ...SplitType[]]

// Esta línea sirve para declarar «exerciseSchema» con el valor «z.object({».
const exerciseSchema = z.object({
  // Esta línea sirve para validar el campo «exercise_id» con el esquema de Zod.
  exercise_id: z.number().int().positive("Selecciona un ejercicio"),
  // Esta línea sirve para validar el campo «target_sets» con el esquema de Zod.
  target_sets: z.number().int().min(1).max(10),
  // Esta línea sirve para validar el campo «target_reps» con el esquema de Zod.
  target_reps: z.string().min(1, "Requerido").max(20),
  // Esta línea sirve para validar el campo «rest_seconds» con el esquema de Zod.
  rest_seconds: z.number().int().min(0).max(600),
  // Esta línea sirve para validar el campo «target_rpe» con el esquema de Zod.
  target_rpe: z.number().min(0).max(10).nullable(),
})

// Esta línea sirve para declarar «daySchema» con el valor «z.object({».
const daySchema = z.object({
  // Esta línea sirve para validar el campo «label» con el esquema de Zod.
  label: z.string().min(1, "Ponle un nombre al día").max(100),
  // Esta línea sirve para validar el campo «target_muscle_groups» con el esquema de Zod.
  target_muscle_groups: z.string().max(500),
  // Esta línea sirve para validar el campo «exercises» con el esquema de Zod.
  exercises: z.array(exerciseSchema).min(1, "Agrega al menos un ejercicio"),
})

// Esta línea sirve para declarar «routineSchema» con el valor «z.object({».
const routineSchema = z.object({
  // Esta línea sirve para validar el campo «goal» con el esquema de Zod.
  goal: z.enum(GOAL_VALUES),
  // Esta línea sirve para validar el campo «split_type» con el esquema de Zod.
  split_type: z.enum(SPLIT_VALUES),
  // Esta línea sirve para validar el campo «frequency_days» con el esquema de Zod.
  frequency_days: z.number().int().min(1).max(7),
  // Esta línea sirve para validar el campo «duration_weeks» con el esquema de Zod.
  duration_weeks: z.number().int().min(1).max(24),
  // Esta línea sirve para validar el campo «days» con el esquema de Zod.
  days: z.array(daySchema).min(1, "Agrega al menos un día"),
})

// Esta línea sirve para declarar «defaultValues» con el valor «{».
const defaultValues: RoutineFormValues = {
  // Esta línea sirve para declarar la propiedad «goal» con el valor o tipo «"gain_muscle"».
  goal: "gain_muscle",
  // Esta línea sirve para declarar la propiedad «split_type» con el valor o tipo «"full_body"».
  split_type: "full_body",
  // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «3».
  frequency_days: 3,
  // Esta línea sirve para declarar la propiedad «duration_weeks» con el valor o tipo «6».
  duration_weeks: 6,
  // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «[EMPTY_DAY]».
  days: [EMPTY_DAY],
}

// Esta línea sirve para declarar la función «toFormValues».
function toFormValues(routine: Routine): RoutineFormValues {
  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «goal» con el valor o tipo «routine.goal».
    goal: routine.goal,
    // Esta línea sirve para declarar la propiedad «split_type» con el valor o tipo «routine.split_type».
    split_type: routine.split_type,
    // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «routine.frequency_days».
    frequency_days: routine.frequency_days,
    // Esta línea sirve para declarar la propiedad «duration_weeks» con el valor o tipo «routine.duration_weeks».
    duration_weeks: routine.duration_weeks,
    // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «[...routine.days]».
    days: [...routine.days]
      // Esta línea sirve para ordenar los días por su orden.
      .sort((a, b) => a.day_order - b.day_order)
      // Esta línea sirve para recorrer los días para convertirlos al formato del formulario.
      .map((day) => ({
        // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «day.label».
        label: day.label,
        // Esta línea sirve para declarar la propiedad «target_muscle_groups» con el valor o tipo «(day.target_muscle_groups ?? []).join(", ")».
        target_muscle_groups: (day.target_muscle_groups ?? []).join(", "),
        // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «[...day.exercises]».
        exercises: [...day.exercises]
          // Esta línea sirve para ordenar los ejercicios por su orden.
          .sort((a, b) => a.order - b.order)
          // Esta línea sirve para recorrer los ejercicios para convertirlos al formato del formulario.
          .map((ex) => ({
            // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «ex.exercise.id».
            exercise_id: ex.exercise.id,
            // Esta línea sirve para declarar la propiedad «target_sets» con el valor o tipo «ex.target_sets».
            target_sets: ex.target_sets,
            // Esta línea sirve para declarar la propiedad «target_reps» con el valor o tipo «ex.target_reps».
            target_reps: ex.target_reps,
            // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «ex.rest_seconds».
            rest_seconds: ex.rest_seconds,
            // Esta línea sirve para declarar la propiedad «target_rpe» con el valor o tipo «ex.target_rpe».
            target_rpe: ex.target_rpe,
          })),
      })),
  }
}

// Esta línea sirve para declarar la función «toPayload».
function toPayload(values: RoutineFormValues): ManualRoutinePayload {
  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «goal» con el valor o tipo «values.goal».
    goal: values.goal,
    // Esta línea sirve para declarar la propiedad «split_type» con el valor o tipo «values.split_type».
    split_type: values.split_type,
    // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «values.frequency_days».
    frequency_days: values.frequency_days,
    // Esta línea sirve para declarar la propiedad «duration_weeks» con el valor o tipo «values.duration_weeks».
    duration_weeks: values.duration_weeks,
    // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «values.days.map((day, dayIndex) => ({».
    days: values.days.map((day, dayIndex) => ({
      // Esta línea sirve para declarar la propiedad «day_order» con el valor o tipo «dayIndex + 1».
      day_order: dayIndex + 1,
      // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «day.label».
      label: day.label,
      // Esta línea sirve para declarar la propiedad «target_muscle_groups» con el valor o tipo «day.target_muscle_groups».
      target_muscle_groups: day.target_muscle_groups
        // Esta línea sirve para separar los grupos musculares por coma.
        .split(",")
        // Esta línea sirve para quitar los espacios de cada grupo.
        .map((s) => s.trim())
        // Esta línea sirve para descartar los grupos vacíos.
        .filter(Boolean),
      // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «day.exercises.map((ex, exIndex) => ({».
      exercises: day.exercises.map((ex, exIndex) => ({
        // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «ex.exercise_id».
        exercise_id: ex.exercise_id,
        // Esta línea sirve para declarar la propiedad «order» con el valor o tipo «exIndex + 1».
        order: exIndex + 1,
        // Esta línea sirve para declarar la propiedad «target_sets» con el valor o tipo «ex.target_sets».
        target_sets: ex.target_sets,
        // Esta línea sirve para declarar la propiedad «target_reps» con el valor o tipo «ex.target_reps».
        target_reps: ex.target_reps,
        // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «ex.rest_seconds».
        rest_seconds: ex.rest_seconds,
        // Esta línea sirve para declarar la propiedad «target_rpe» con el valor o tipo «ex.target_rpe».
        target_rpe: ex.target_rpe,
      })),
    })),
  }
}

// Esta línea sirve para declarar la interfaz «RoutineEditorPageProps».
interface RoutineEditorPageProps {
  /** "admin" apunta a /admin/users/{userId}/routine — rutina personalizada asignada por Super Admin, aislada al usuario objetivo. Por defecto "trainer" (comportamiento existente, sin cambios). */
  // Esta línea sirve para declarar la propiedad «scope» con el valor o tipo «"trainer" | "admin"».
  scope?: "trainer" | "admin"
}

// Esta línea sirve para declarar la función «RoutineEditorPage».
export function RoutineEditorPage({ scope = "trainer" }: RoutineEditorPageProps) {
  // Esta línea sirve para extraer «trainerClientId, userId, routineId» de «useParams<{».
  const { trainerClientId, userId, routineId } = useParams<{
    // Esta línea sirve para declarar la propiedad «trainerClientId» con el valor o tipo «string».
    trainerClientId?: string
    // Esta línea sirve para declarar la propiedad «userId» con el valor o tipo «string».
    userId?: string
    // Esta línea sirve para declarar la propiedad «routineId» con el valor o tipo «string».
    routineId?: string
  }>()
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «location» con el hook «useLocation».
  const location = useLocation()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para extraer «sEditin» de «scope === "admin" ? location.pathname.en».
  const isEditing = scope === "admin" ? location.pathname.endsWith("/edit") : Boolean(routineId)
  // Esta línea sirve para crear el estado «serverError» y su función «setServerError».
  const [serverError, setServerError] = useState<string | null>(null)

  // Esta línea sirve para obtener «data: exerciseCatalog» con el hook «useQuery».
  const { data: exerciseCatalog } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["exercises"]».
    queryKey: ["exercises"],
    // Esta línea sirve para pedir a la API los datos de «/exercises».
    queryFn: () => api.get<ExerciseCatalogItem[]>("/exercises"),
  })

  // Esta línea sirve para obtener «data: existingRoutine» con el hook «useQuery».
  const { data: existingRoutine } = useQuery({
    // Esta línea sirve para definir la clave de caché según el ámbito (admin o entrenador).
    queryKey: scope === "admin" ? ["admin", "users", userId, "routine"] : ["trainer", "routines", routineId],
    // Esta línea sirve para declarar la propiedad «queryFn» con el valor o tipo «() =>».
    queryFn: () =>
      // Esta línea sirve para elegir la petición según el ámbito.
      scope === "admin"
        // Esta línea sirve para pedir la rutina del usuario si es administrador.
        ? api.get<Routine | null>(`/admin/users/${userId}/routine`)
        // Esta línea sirve para pedir la rutina del entrenador en caso contrario.
        : api.get<Routine>(`/trainer/routines/${routineId}`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «isEditing».
    enabled: isEditing,
  })

  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «control» en la lista.
    control,
    // Esta línea sirve para incluir el valor «register» en la lista.
    register,
    // Esta línea sirve para incluir el valor «handleSubmit» en la lista.
    handleSubmit,
    // Esta línea sirve para incluir el valor «reset» en la lista.
    reset,
    // Esta línea sirve para declarar la propiedad «formState» con el valor o tipo «{ errors, isSubmitting }».
    formState: { errors, isSubmitting },
  // Esta línea sirve para cerrar la desestructuración con «useForm<RoutineFormValues>({».
  } = useForm<RoutineFormValues>({
    // Esta línea sirve para declarar la propiedad «resolver» con el valor o tipo «zodResolver(routineSchema)».
    resolver: zodResolver(routineSchema),
    // Esta línea sirve para incluir el valor «defaultValues» en la lista.
    defaultValues,
  })

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para revisar si «existingRoutine».
    if (existingRoutine) {
      // Esta línea sirve para llamar a «reset» con «toFormValues(existingRoutine)».
      reset(toFormValues(existingRoutine))
    }
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «existingRoutine, reset».
  }, [existingRoutine, reset])

  // Esta línea sirve para obtener los días y las funciones para agregarlos y quitarlos.
  const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({ control, name: "days" })

  // Esta línea sirve para obtener «mutation» con el hook «useMutation».
  const mutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(values: RoutineFormValues) => {».
    mutationFn: (values: RoutineFormValues) => {
      // Esta línea sirve para revisar si «scope === "admin"».
      if (scope === "admin") {
        // Esta línea sirve para devolver «isEditing && existingRoutine».
        return isEditing && existingRoutine
          // Esta línea sirve para actualizar la rutina existente si es administrador.
          ? api.patch<Routine>(`/admin/routines/${existingRoutine.id}`, toPayload(values))
          // Esta línea sirve para crear la rutina del usuario si no existe.
          : api.post<Routine>(`/admin/users/${userId}/routine`, toPayload(values))
      }
      // Esta línea sirve para devolver «isEditing».
      return isEditing
        // Esta línea sirve para actualizar la rutina si el entrenador la está editando.
        ? api.patch<Routine>(`/trainer/routines/${routineId}`, toPayload(values))
        // Esta línea sirve para crear la rutina del cliente en caso contrario.
        : api.post<Routine>(`/trainer/clients/${trainerClientId}/routines`, toPayload(values))
    },
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: () => {
      // Esta línea sirve para guardar en el estado con «setServerError» el valor «null)…».
      setServerError(null)
      // Esta línea sirve para revisar si «scope === "admin"».
      if (scope === "admin") {
        // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["admin", "users"] }».
        queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
        // Esta línea sirve para llamar a «navigate» con «`/admin/users/${userId}`».
        navigate(`/admin/users/${userId}`)
        // Esta línea sirve para terminar la función sin devolver nada.
        return
      }
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["trainer", "clients"] }».
      queryClient.invalidateQueries({ queryKey: ["trainer", "clients"] })
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["trainer", "routines"] }».
      queryClient.invalidateQueries({ queryKey: ["trainer", "routines"] })
      // Esta línea sirve para revisar si «isEditing».
      if (isEditing) {
        // Esta línea sirve para llamar a «navigate» con «-1».
        navigate(-1)
      // Esta línea sirve para ejecutar este bloque en el caso contrario.
      } else {
        // Esta línea sirve para llamar a «navigate» con «`/trainer/clients/${trainerClientId}`».
        navigate(`/trainer/clients/${trainerClientId}`)
      }
    },
    // Esta línea sirve para definir lo que ocurre en «onError».
    onError: (err) => {
      // Esta línea sirve para guardar en el estado con «setServerError» el valor «err instanceof ApiError ? err.body.message : …».
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo guardar la rutina.")
    },
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para abrir el elemento «header». */}
        <header>
          {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
          <button
            // Esta línea sirve para definir el atributo «type» con el valor «button».
            type="button"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={() => navigate(-1)}
            // Esta línea sirve para aplicar las clases de estilo «text-xs text-muted-foreground hover:underline».
            className="text-xs text-muted-foreground hover:underline"
          >
            {/* Esta línea sirve para mostrar el contenido dinámico «← Volver». */}
            ← Volver
          </button>
          {/* Esta línea sirve para abrir el elemento «h1» con las clases «mt-1 font-heading text-2xl font-medium t». */}
          <h1 className="mt-1 font-heading text-2xl font-medium tracking-tight">
            {/* Esta línea sirve para mostrar el contenido dinámico «{scope === "admin"». */}
            {scope === "admin"
              // Esta línea sirve para revisar si es administrador y está editando.
              ? isEditing
                // Esta línea sirve para mostrar «Editar rutina personalizada».
                ? "Editar rutina personalizada"
                // Esta línea sirve para mostrar «Asignar rutina personalizada».
                : "Asignar rutina personalizada"
              // Esta línea sirve para revisar si el entrenador está editando.
              : isEditing
                // Esta línea sirve para mostrar «Editar rutina».
                ? "Editar rutina"
                // Esta línea sirve para mostrar «Nueva rutina manual».
                : "Nueva rutina manual"}
          </h1>
        </header>

        {/* Esta línea sirve para abrir el elemento «form» con sus propiedades. */}
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-4">
          {/* Esta línea sirve para abrir el elemento «section» con las clases «grid grid-cols-2 gap-3 rounded-xl border». */}
          <section className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-5 sm:grid-cols-4">
            {/* Esta línea sirve para abrir el elemento «div» con las clases «col-span-2 space-y-1.5». */}
            <div className="col-span-2 space-y-1.5">
              {/* Esta línea sirve para mostrar el texto «Objetivo» dentro de un «label». */}
              <label className="text-xs font-medium text-muted-foreground">Objetivo</label>
              {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
              <select
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                // Esta línea sirve para conectar el campo «goal» con el formulario.
                {...register("goal")}
              >
                {/* Esta línea sirve para recorrer «GOAL_OPTIONS» y mostrar un bloque por elemento. */}
                {GOAL_OPTIONS.map((opt) => (
                  // Esta línea sirve para abrir el elemento «option».
                  <option key={opt.value} value={opt.value}>
                    {/* Esta línea sirve para mostrar el valor «opt.label». */}
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Esta línea sirve para abrir el elemento «div» con las clases «col-span-2 space-y-1.5». */}
            <div className="col-span-2 space-y-1.5">
              {/* Esta línea sirve para mostrar el texto «Split» dentro de un «label». */}
              <label className="text-xs font-medium text-muted-foreground">Split</label>
              {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
              <select
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                // Esta línea sirve para conectar el campo «split_type» con el formulario.
                {...register("split_type")}
              >
                {/* Esta línea sirve para recorrer «SPLIT_OPTIONS» y mostrar un bloque por elemento. */}
                {SPLIT_OPTIONS.map((opt) => (
                  // Esta línea sirve para abrir el elemento «option».
                  <option key={opt.value} value={opt.value}>
                    {/* Esta línea sirve para mostrar el valor «opt.label». */}
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
            <div className="space-y-1.5">
              {/* Esta línea sirve para mostrar el texto «Días/semana» dentro de un «label». */}
              <label className="text-xs font-medium text-muted-foreground">Días/semana</label>
              {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
              <input
                // Esta línea sirve para definir el atributo «type» con el valor «number».
                type="number"
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                // Esta línea sirve para conectar el campo «frequency_days» con el formulario.
                {...register("frequency_days", { valueAsNumber: true })}
              />
              {/* Esta línea sirve para mostrar el bloque solo si «errors.frequency_days». */}
              {errors.frequency_days && (
                // Esta línea sirve para mostrar el valor «errors.frequency_days.message» dentro de un «p».
                <p className="text-xs text-destructive">{errors.frequency_days.message}</p>
              )}
            </div>

            {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
            <div className="space-y-1.5">
              {/* Esta línea sirve para mostrar el texto «Semanas» dentro de un «label». */}
              <label className="text-xs font-medium text-muted-foreground">Semanas</label>
              {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
              <input
                // Esta línea sirve para definir el atributo «type» con el valor «number».
                type="number"
                // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                // Esta línea sirve para conectar el campo «duration_weeks» con el formulario.
                {...register("duration_weeks", { valueAsNumber: true })}
              />
              {/* Esta línea sirve para mostrar el bloque solo si «errors.duration_weeks». */}
              {errors.duration_weeks && (
                // Esta línea sirve para mostrar el valor «errors.duration_weeks.message» dentro de un «p».
                <p className="text-xs text-destructive">{errors.duration_weeks.message}</p>
              )}
            </div>
          </section>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col gap-3». */}
          <div className="flex flex-col gap-3">
            {/* Esta línea sirve para recorrer «dayFields» y mostrar un bloque por elemento. */}
            {dayFields.map((field, dayIndex) => (
              // Esta línea sirve para abrir el elemento «RoutineDayFieldset» con sus atributos en varias líneas.
              <RoutineDayFieldset
                // Esta línea sirve para identificar el elemento de la lista con «field.id}».
                key={field.id}
                // Esta línea sirve para pasar la propiedad «control» con el valor «control}».
                control={control}
                // Esta línea sirve para pasar la propiedad «register» con el valor «register}».
                register={register}
                // Esta línea sirve para pasar la propiedad «dayIndex» con el valor «dayIndex}».
                dayIndex={dayIndex}
                // Esta línea sirve para pasar la propiedad «canRemoveDay» con el valor «dayFields.length > 1}».
                canRemoveDay={dayFields.length > 1}
                // Esta línea sirve para asignar el manejador del evento «onRemoveDay».
                onRemoveDay={() => removeDay(dayIndex)}
                // Esta línea sirve para pasar la propiedad «exercises» con el valor «exerciseCatalog ?? []}».
                exercises={exerciseCatalog ?? []}
                // Esta línea sirve para pasar la propiedad «errors» con el valor «errors}».
                errors={errors}
              />
            ))}
          </div>
          {/* Esta línea sirve para mostrar el elemento solo si «errors.days?.message». */}
          {errors.days?.message && <p className="text-xs text-destructive">{errors.days.message}</p>}

          {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
          <Button type="button" variant="outline" size="sm" onClick={() => appendDay(EMPTY_DAY)}>
            {/* Esta línea sirve para mostrar el contenido dinámico «+ Agregar día». */}
            + Agregar día
          </Button>

          {/* Esta línea sirve para mostrar el elemento solo si «serverError». */}
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex justify-end gap-2». */}
          <div className="flex justify-end gap-2">
            {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              {/* Esta línea sirve para mostrar el texto «Cancelar». */}
              Cancelar
            </Button>
            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button type="submit" disabled={isSubmitting || mutation.isPending}>
              {/* Esta línea sirve para mostrar el contenido dinámico «{mutation.isPending ? "Guardando…" : "Guardar rutina"}». */}
              {mutation.isPending ? "Guardando…" : "Guardar rutina"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
