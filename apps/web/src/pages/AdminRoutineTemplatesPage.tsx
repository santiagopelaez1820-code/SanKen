// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para abrir la importación de tipos del núcleo.
import type {
  // Esta línea sirve para incluir el valor «AdminRoutineTemplate» en la lista.
  AdminRoutineTemplate,
  // Esta línea sirve para incluir el valor «ExerciseCatalogItem» en la lista.
  ExerciseCatalogItem,
  // Esta línea sirve para incluir el valor «RoutineSplitType» en la lista.
  RoutineSplitType,
  // Esta línea sirve para incluir el valor «RoutineTemplateLevel» en la lista.
  RoutineTemplateLevel,
  // Esta línea sirve para incluir el valor «RoutineTemplatePayload» en la lista.
  RoutineTemplatePayload,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «ApiError, ROUTINE_TEMPLATE_LEVEL_LABELS, ROUTINE_TEMPLATE_LEVELS» desde «@sanken/core».
import { ApiError, ROUTINE_TEMPLATE_LEVEL_LABELS, ROUTINE_TEMPLATE_LEVELS } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/ConfirmDialog».
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la interfaz «ExerciseFormRow».
interface ExerciseFormRow {
  // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «string».
  exercise_id: string
  // Esta línea sirve para declarar la propiedad «default_sets» con el valor o tipo «string».
  default_sets: string
  // Esta línea sirve para declarar la propiedad «default_reps» con el valor o tipo «string».
  default_reps: string
  // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «string».
  rest_seconds: string
  // Esta línea sirve para declarar la propiedad «default_rpe» con el valor o tipo «string».
  default_rpe: string
}

// Esta línea sirve para declarar la interfaz «DayFormRow».
interface DayFormRow {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «ExerciseFormRow[]».
  exercises: ExerciseFormRow[]
}

// Esta línea sirve para declarar la interfaz «TemplateFormState».
interface TemplateFormState {
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «string».
  name: string
  // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «"male" | "female"».
  sex: "male" | "female"
  // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «string».
  frequency_days: string
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «RoutineTemplateLevel».
  level: RoutineTemplateLevel
  // Esta línea sirve para declarar la propiedad «split_type» con el valor o tipo «RoutineSplitType».
  split_type: RoutineSplitType
  // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «DayFormRow[]».
  days: DayFormRow[]
}

// Esta línea sirve para declarar «EMPTY_EXERCISE» con el valor «{».
const EMPTY_EXERCISE: ExerciseFormRow = {
  // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «""».
  exercise_id: "",
  // Esta línea sirve para declarar la propiedad «default_sets» con el valor o tipo «"3"».
  default_sets: "3",
  // Esta línea sirve para declarar la propiedad «default_reps» con el valor o tipo «"10"».
  default_reps: "10",
  // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «"90"».
  rest_seconds: "90",
  // Esta línea sirve para declarar la propiedad «default_rpe» con el valor o tipo «""».
  default_rpe: "",
}

// Esta línea sirve para declarar «EMPTY_DAY» con el valor «{ label: "", exercises: [{ ...EMPTY_EXERCISE }] }».
const EMPTY_DAY: DayFormRow = { label: "", exercises: [{ ...EMPTY_EXERCISE }] }

// Esta línea sirve para declarar «EMPTY_FORM» con el valor «{».
const EMPTY_FORM: TemplateFormState = {
  // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «""».
  name: "",
  // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «"male"».
  sex: "male",
  // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «"3"».
  frequency_days: "3",
  // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «"intermediate"».
  level: "intermediate",
  // Esta línea sirve para declarar la propiedad «split_type» con el valor o tipo «"full_body"».
  split_type: "full_body",
  // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «[{ ...EMPTY_DAY }]».
  days: [{ ...EMPTY_DAY }],
}

// Esta línea sirve para extraer «PLIT_OPTIONS: RoutineSplitType[» de «["full_body", "upper_lower", "push_pull_».
const SPLIT_OPTIONS: RoutineSplitType[] = ["full_body", "upper_lower", "push_pull_legs", "bro_split", "ppl_upper_lower"]

// Nivel: única fuente en @sanken/core (ver ROUTINE_TEMPLATE_LEVEL_LABELS) —
// antes esta lista/labels vivían retipeadas acá y en el equivalente mobile.
// Esta línea sirve para declarar «LEVEL_OPTIONS» con el valor «ROUTINE_TEMPLATE_LEVELS».
const LEVEL_OPTIONS: RoutineTemplateLevel[] = ROUTINE_TEMPLATE_LEVELS
// Esta línea sirve para declarar «LEVEL_LABELS» con el valor «ROUTINE_TEMPLATE_LEVEL_LABELS».
const LEVEL_LABELS = ROUTINE_TEMPLATE_LEVEL_LABELS

// Esta línea sirve para extraer «electClas» de «"rounded-lg border border-input bg-backg».
const selectClass = "rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
// Esta línea sirve para extraer «nputClas» de «"rounded-lg border border-input bg-backg».
const inputClass = "rounded-lg border border-input bg-background px-2 py-1.5 text-sm"

// Esta línea sirve para declarar la función «templateToForm».
function templateToForm(template: AdminRoutineTemplate): TemplateFormState {
  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «template.name ?? ""».
    name: template.name ?? "",
    // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «template.sex».
    sex: template.sex,
    // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «String(template.frequency_days)».
    frequency_days: String(template.frequency_days),
    // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «template.level».
    level: template.level,
    // Esta línea sirve para declarar la propiedad «split_type» con el valor o tipo «template.split_type».
    split_type: template.split_type,
    // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «template.days.map((day) => ({».
    days: template.days.map((day) => ({
      // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «day.label».
      label: day.label,
      // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «day.exercises.map((ex) => ({».
      exercises: day.exercises.map((ex) => ({
        // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «String(ex.exercise_id)».
        exercise_id: String(ex.exercise_id),
        // Esta línea sirve para declarar la propiedad «default_sets» con el valor o tipo «String(ex.default_sets)».
        default_sets: String(ex.default_sets),
        // Esta línea sirve para declarar la propiedad «default_reps» con el valor o tipo «ex.default_reps».
        default_reps: ex.default_reps,
        // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «String(ex.rest_seconds)».
        rest_seconds: String(ex.rest_seconds),
        // Esta línea sirve para convertir el RPE a texto o dejarlo vacío.
        default_rpe: ex.default_rpe !== null ? String(ex.default_rpe) : "",
      })),
    })),
  }
}

// Esta línea sirve para declarar la función «buildPayload».
function buildPayload(form: TemplateFormState): RoutineTemplatePayload {
  // Esta línea sirve para devolver «{».
  return {
    // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «form.name.trim() || null».
    name: form.name.trim() || null,
    // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «form.sex».
    sex: form.sex,
    // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «Number(form.frequency_days)».
    frequency_days: Number(form.frequency_days),
    // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «form.level».
    level: form.level,
    // Esta línea sirve para declarar la propiedad «split_type» con el valor o tipo «form.split_type».
    split_type: form.split_type,
    // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «form.days.map((day, dayIndex) => ({».
    days: form.days.map((day, dayIndex) => ({
      // Esta línea sirve para declarar la propiedad «day_order» con el valor o tipo «dayIndex + 1».
      day_order: dayIndex + 1,
      // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «day.label».
      label: day.label,
      // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «day.exercises.map((ex, exIndex) => ({».
      exercises: day.exercises.map((ex, exIndex) => ({
        // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «Number(ex.exercise_id)».
        exercise_id: Number(ex.exercise_id),
        // Esta línea sirve para declarar la propiedad «order» con el valor o tipo «exIndex + 1».
        order: exIndex + 1,
        // Esta línea sirve para declarar la propiedad «default_sets» con el valor o tipo «Number(ex.default_sets)».
        default_sets: Number(ex.default_sets),
        // Esta línea sirve para declarar la propiedad «default_reps» con el valor o tipo «ex.default_reps».
        default_reps: ex.default_reps,
        // Esta línea sirve para declarar la propiedad «rest_seconds» con el valor o tipo «Number(ex.rest_seconds)».
        rest_seconds: Number(ex.rest_seconds),
        // Esta línea sirve para convertir el RPE a número o null si está vacío.
        default_rpe: ex.default_rpe.trim() ? Number(ex.default_rpe) : null,
      })),
    })),
  }
}

// Esta línea sirve para declarar la función «isFormValid».
function isFormValid(form: TemplateFormState): boolean {
  // Esta línea sirve para devolver «false» si «!form.frequency_days || form.days.length === 0».
  if (!form.frequency_days || form.days.length === 0) return false
  // Esta línea sirve para devolver «form.days.every(».
  return form.days.every(
    // Esta línea sirve para revisar que cada día tenga nombre y ejercicios completos.
    (day) => day.label.trim() && day.exercises.length > 0 && day.exercises.every((ex) => ex.exercise_id),
  )
}

// Esta línea sirve para declarar la función «AdminRoutineTemplatesPage».
export function AdminRoutineTemplatesPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «form» y su función «setForm».
  const [form, setForm] = useState<TemplateFormState>(EMPTY_FORM)
  // Esta línea sirve para crear el estado «editingId» y su función «setEditingId».
  const [editingId, setEditingId] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «formError» y su función «setFormError».
  const [formError, setFormError] = useState<string | null>(null)
  // Esta línea sirve para crear el estado «confirmingDeactivateId» y su función «setConfirmingDeactivateId».
  const [confirmingDeactivateId, setConfirmingDeactivateId] = useState<number | null>(null)

  // Esta línea sirve para obtener «data: templates, isLoading» con el hook «useQuery».
  const { data: templates, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "routine-templates"]».
    queryKey: ["admin", "routine-templates"],
    // Esta línea sirve para pedir a la API los datos de «/admin/routine-templates».
    queryFn: () => api.get<AdminRoutineTemplate[]>("/admin/routine-templates"),
  })

  // Esta línea sirve para obtener «data: exerciseCatalog» con el hook «useQuery».
  const { data: exerciseCatalog } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["exercises"]».
    queryKey: ["exercises"],
    // Esta línea sirve para pedir a la API los datos de «/exercises».
    queryFn: () => api.get<ExerciseCatalogItem[]>("/exercises"),
  })

  // Esta línea sirve para extraer «nvalidat» de «() => queryClient.invalidateQueries({ qu».
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "routine-templates"] })

  // Esta línea sirve para extraer «esetFor» de «() => {».
  const resetForm = () => {
    // Esta línea sirve para llamar a «setEditingId» con «null».
    setEditingId(null)
    // Esta línea sirve para llamar a «setForm» con «EMPTY_FORM».
    setForm(EMPTY_FORM)
    // Esta línea sirve para llamar a «setFormError» con «null».
    setFormError(null)
  }

  // Esta línea sirve para extraer «andleErro» de «(err: unknown) => {».
  const handleError = (err: unknown) => {
    // Esta línea sirve para guardar el mensaje de error de la API o uno genérico.
    setFormError(err instanceof ApiError ? err.body.message : "No se pudo guardar la plantilla.")
  }

  // Esta línea sirve para obtener «createMutation» con el hook «useMutation».
  const createMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/admin/routine-templates».
    mutationFn: () => api.post("/admin/routine-templates", buildPayload(form)),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «resetForm».
      resetForm()
      // Esta línea sirve para llamar a «invalidate».
      invalidate()
    },
    // Esta línea sirve para declarar la propiedad «onError» con el valor o tipo «handleError».
    onError: handleError,
  })

  // Esta línea sirve para obtener «updateMutation» con el hook «useMutation».
  const updateMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «patch» hacia «/admin/routine-templates/${id}».
    mutationFn: (id: number) => api.patch(`/admin/routine-templates/${id}`, buildPayload(form)),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «resetForm».
      resetForm()
      // Esta línea sirve para llamar a «invalidate».
      invalidate()
    },
    // Esta línea sirve para declarar la propiedad «onError» con el valor o tipo «handleError».
    onError: handleError,
  })

  // Esta línea sirve para obtener «duplicateMutation» con el hook «useMutation».
  const duplicateMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/admin/routine-templates/${id}/duplicate».
    mutationFn: (id: number) => api.post(`/admin/routine-templates/${id}/duplicate`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para obtener «activateMutation» con el hook «useMutation».
  const activateMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «patch» hacia «/admin/routine-templates/${id}/activate».
    mutationFn: (id: number) => api.patch(`/admin/routine-templates/${id}/activate`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para obtener «deactivateMutation» con el hook «useMutation».
  const deactivateMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «patch» hacia «/admin/routine-templates/${id}/deactivate».
    mutationFn: (id: number) => api.patch(`/admin/routine-templates/${id}/deactivate`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «setConfirmingDeactivateId» con «null».
      setConfirmingDeactivateId(null)
      // Esta línea sirve para llamar a «invalidate».
      invalidate()
    },
    // Esta línea sirve para declarar la propiedad «onError» con el valor o tipo «(err) => {».
    onError: (err) => {
      // Esta línea sirve para llamar a «setConfirmingDeactivateId» con «null».
      setConfirmingDeactivateId(null)
      // Esta línea sirve para llamar a «handleError» con «err».
      handleError(err)
    },
  })

  // Esta línea sirve para extraer «tartEdi» de «(template: AdminRoutineTemplate) => {».
  const startEdit = (template: AdminRoutineTemplate) => {
    // Esta línea sirve para llamar a «setEditingId» con «template.id».
    setEditingId(template.id)
    // Esta línea sirve para llamar a «setForm» con «templateToForm(template)».
    setForm(templateToForm(template))
    // Esta línea sirve para llamar a «setFormError» con «null».
    setFormError(null)
  }

  // Esta línea sirve para extraer «pdateDa» de «(dayIndex: number, patch: Partial<DayFor».
  const updateDay = (dayIndex: number, patch: Partial<DayFormRow>) => {
    // Esta línea sirve para actualizar el formulario a partir del estado anterior.
    setForm((prev) => ({
      // Esta línea sirve para copiar las propiedades de «prev».
      ...prev,
      // Esta línea sirve para reemplazar el día indicado con los cambios recibidos.
      days: prev.days.map((day, i) => (i === dayIndex ? { ...day, ...patch } : day)),
    }))
  }

  // Esta línea sirve para extraer «pdateExercis» de «(dayIndex: number, exIndex: number, patc».
  const updateExercise = (dayIndex: number, exIndex: number, patch: Partial<ExerciseFormRow>) => {
    // Esta línea sirve para actualizar el formulario a partir del estado anterior.
    setForm((prev) => ({
      // Esta línea sirve para copiar las propiedades de «prev».
      ...prev,
      // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «prev.days.map((day, i) =>».
      days: prev.days.map((day, i) =>
        // Esta línea sirve para revisar si el día es el indicado.
        i === dayIndex
          // Esta línea sirve para reemplazar el ejercicio indicado con los cambios recibidos.
          ? { ...day, exercises: day.exercises.map((ex, j) => (j === exIndex ? { ...ex, ...patch } : ex)) }
          // Esta línea sirve para dejar los demás días sin cambios.
          : day,
      ),
    }))
  }

  // Esta línea sirve para extraer «ddDa» de «() => setForm((prev) => ({ ...prev, days».
  const addDay = () => setForm((prev) => ({ ...prev, days: [...prev.days, { ...EMPTY_DAY, exercises: [{ ...EMPTY_EXERCISE }] }] }))
  // Esta línea sirve para extraer «emoveDa» de «(dayIndex: number) =>».
  const removeDay = (dayIndex: number) =>
    // Esta línea sirve para quitar el día indicado del formulario.
    setForm((prev) => ({ ...prev, days: prev.days.filter((_, i) => i !== dayIndex) }))

  // Esta línea sirve para extraer «ddExercis» de «(dayIndex: number) =>».
  const addExercise = (dayIndex: number) =>
    // Esta línea sirve para actualizar el formulario a partir del estado anterior.
    setForm((prev) => ({
      // Esta línea sirve para copiar las propiedades de «prev».
      ...prev,
      // Esta línea sirve para agregar un ejercicio vacío al día indicado.
      days: prev.days.map((day, i) => (i === dayIndex ? { ...day, exercises: [...day.exercises, { ...EMPTY_EXERCISE }] } : day)),
    }))
  // Esta línea sirve para extraer «emoveExercis» de «(dayIndex: number, exIndex: number) =>».
  const removeExercise = (dayIndex: number, exIndex: number) =>
    // Esta línea sirve para actualizar el formulario a partir del estado anterior.
    setForm((prev) => ({
      // Esta línea sirve para copiar las propiedades de «prev».
      ...prev,
      // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «prev.days.map((day, i) =>».
      days: prev.days.map((day, i) =>
        // Esta línea sirve para quitar el ejercicio indicado del día indicado.
        i === dayIndex ? { ...day, exercises: day.exercises.filter((_, j) => j !== exIndex) } : day,
      ),
    }))

  // Esta línea sirve para extraer «oveExercis» de «(dayIndex: number, exIndex: number, dire».
  const moveExercise = (dayIndex: number, exIndex: number, direction: -1 | 1) =>
    // Esta línea sirve para actualizar el formulario a partir del estado anterior.
    setForm((prev) => ({
      // Esta línea sirve para copiar las propiedades de «prev».
      ...prev,
      // Esta línea sirve para declarar la propiedad «days» con el valor o tipo «prev.days.map((day, i) => {».
      days: prev.days.map((day, i) => {
        // Esta línea sirve para devolver «day» si «i !== dayIndex».
        if (i !== dayIndex) return day
        // Esta línea sirve para extraer «arge» de «exIndex + direction».
        const target = exIndex + direction
        // Esta línea sirve para devolver «day» si «target < 0 || target >= day.exercises.length».
        if (target < 0 || target >= day.exercises.length) return day
        // Esta línea sirve para extraer «xercise» de «[...day.exercises]».
        const exercises = [...day.exercises]
        // Esta línea sirve para intercambiar el ejercicio con el vecino para reordenarlo.
        ;[exercises[exIndex], exercises[target]] = [exercises[target], exercises[exIndex]]
        // Esta línea sirve para devolver «{ ...day, exercises }».
        return { ...day, exercises }
      }),
    }))

  // Esta línea sirve para extraer «roupe» de «new Map<string, AdminRoutineTemplate[]>(».
  const grouped = new Map<string, AdminRoutineTemplate[]>()
  // Esta línea sirve para recorrer los elementos con «const t of templates ?? []».
  for (const t of templates ?? []) {
    // Esta línea sirve para extraer «e» de «`${t.sex}-${t.frequency_days}-${t.level}».
    const key = `${t.sex}-${t.frequency_days}-${t.level}`
    // Esta línea sirve para llamar a «grouped.set» con «key, [...(grouped.get(key) ?? []), t]».
    grouped.set(key, [...(grouped.get(key) ?? []), t])
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-4xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Rutinas generales» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Rutinas generales</h1>

        {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-muted-foreground». */}
        <p className="text-sm text-muted-foreground">
          {/* Esta línea sirve para explicar que son las plantillas que el motor asigna automáticamente. */}
          Estas son las plantillas que el motor asigna automáticamente a cada usuario según su sexo, la frecuencia
          de entrenamiento y el nivel que eligió en el onboarding. Editar una plantilla no modifica el historial de
          entrenamientos ya realizados por nadie — solo afecta a quién reciba esta plantilla de ahora en adelante.
        </p>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el valor «editingId ? "Editar plantilla" : "Nueva plantilla"» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium">{editingId ? "Editar plantilla" : "Nueva plantilla"}</h2>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 grid grid-cols-2 gap-3». */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Nombre (opcional)».
              placeholder="Nombre (opcional)"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.name}».
              value={form.name}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo «col-span-2 ${inputClass}».
              className={`col-span-2 ${inputClass}`}
            />
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.sex}».
              value={form.sex}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, sex: e.target.value as "male" | "female" })}
              // Esta línea sirve para aplicar las clases de estilo calculadas: «selectClass}».
              className={selectClass}
            >
              {/* Esta línea sirve para mostrar el texto «Hombre» dentro de un «option». */}
              <option value="male">Hombre</option>
              {/* Esta línea sirve para mostrar el texto «Mujer» dentro de un «option». */}
              <option value="female">Mujer</option>
            </select>
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «type» con el valor «number».
              type="number"
              // Esta línea sirve para pasar la propiedad «min» con el valor «1}».
              min={1}
              // Esta línea sirve para pasar la propiedad «max» con el valor «7}».
              max={7}
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Días por semana».
              placeholder="Días por semana"
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.frequency_days}».
              value={form.frequency_days}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, frequency_days: e.target.value })}
              // Esta línea sirve para aplicar las clases de estilo calculadas: «inputClass}».
              className={inputClass}
            />
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.level}».
              value={form.level}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, level: e.target.value as RoutineTemplateLevel })}
              // Esta línea sirve para aplicar las clases de estilo calculadas: «selectClass}».
              className={selectClass}
            >
              {/* Esta línea sirve para recorrer «LEVEL_OPTIONS» y mostrar un bloque por elemento. */}
              {LEVEL_OPTIONS.map((opt) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={opt} value={opt}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{LEVEL_LABELS[opt]}». */}
                  {LEVEL_LABELS[opt]}
                </option>
              ))}
            </select>
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para pasar la propiedad «value» con el valor «form.split_type}».
              value={form.split_type}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setForm({ ...form, split_type: e.target.value as RoutineSplitType })}
              // Esta línea sirve para aplicar las clases de estilo calculadas: «selectClass}».
              className={selectClass}
            >
              {/* Esta línea sirve para recorrer «SPLIT_OPTIONS» y mostrar un bloque por elemento. */}
              {SPLIT_OPTIONS.map((opt) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={opt} value={opt}>
                  {/* Esta línea sirve para mostrar el valor «opt». */}
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-4 space-y-4». */}
          <div className="mt-4 space-y-4">
            {/* Esta línea sirve para recorrer «form.days» y mostrar un bloque por elemento. */}
            {form.days.map((day, dayIndex) => (
              // Esta línea sirve para abrir el elemento «div».
              <div key={dayIndex} className="rounded-lg border border-border p-3">
                {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-center gap-2». */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                  <input
                    // Esta línea sirve para pasar la propiedad «placeholder» con el valor «`Día ${dayIndex + 1} (ej. Empuje)`}».
                    placeholder={`Día ${dayIndex + 1} (ej. Empuje)`}
                    // Esta línea sirve para pasar la propiedad «value» con el valor «day.label}».
                    value={day.label}
                    // Esta línea sirve para asignar el manejador del evento «onChange».
                    onChange={(e) => updateDay(dayIndex, { label: e.target.value })}
                    // Esta línea sirve para aplicar las clases de estilo «min-w-0 flex-1 ${inputClass}».
                    className={`min-w-0 flex-1 ${inputClass}`}
                  />
                  {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
                  <Button variant="destructive" size="sm" onClick={() => removeDay(dayIndex)} disabled={form.days.length <= 1}>
                    {/* Esta línea sirve para mostrar el texto «Quitar día». */}
                    Quitar día
                  </Button>
                </div>

                {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 space-y-2». */}
                <div className="mt-3 space-y-2">
                  {/* Esta línea sirve para recorrer «day.exercises» y mostrar un bloque por elemento. */}
                  {day.exercises.map((ex, exIndex) => (
                    // Esta línea sirve para abrir el elemento «div».
                    <div key={exIndex} className="flex flex-wrap items-center gap-1.5">
                      {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
                      <select
                        // Esta línea sirve para pasar la propiedad «value» con el valor «ex.exercise_id}».
                        value={ex.exercise_id}
                        // Esta línea sirve para asignar el manejador del evento «onChange».
                        onChange={(e) => updateExercise(dayIndex, exIndex, { exercise_id: e.target.value })}
                        // Esta línea sirve para aplicar las clases de estilo «min-w-[180px] flex-1 ${selectClass}».
                        className={`min-w-[180px] flex-1 ${selectClass}`}
                      >
                        {/* Esta línea sirve para mostrar el texto «Ejercicio…» dentro de un «option». */}
                        <option value="">Ejercicio…</option>
                        {/* Esta línea sirve para recorrer «exerciseCatalog?» y mostrar un bloque por elemento. */}
                        {exerciseCatalog?.map((e) => (
                          // Esta línea sirve para abrir el elemento «option».
                          <option key={e.id} value={e.id}>
                            {/* Esta línea sirve para mostrar el valor «e.name». */}
                            {e.name}
                          </option>
                        ))}
                      </select>
                      {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                      <input
                        // Esta línea sirve para definir el atributo «type» con el valor «number».
                        type="number"
                        // Esta línea sirve para pasar la propiedad «min» con el valor «1}».
                        min={1}
                        // Esta línea sirve para pasar la propiedad «max» con el valor «10}».
                        max={10}
                        // Esta línea sirve para definir el atributo «title» con el valor «Series».
                        title="Series"
                        // Esta línea sirve para pasar la propiedad «value» con el valor «ex.default_sets}».
                        value={ex.default_sets}
                        // Esta línea sirve para asignar el manejador del evento «onChange».
                        onChange={(e) => updateExercise(dayIndex, exIndex, { default_sets: e.target.value })}
                        // Esta línea sirve para aplicar las clases de estilo «w-16 ${inputClass}».
                        className={`w-16 ${inputClass}`}
                      />
                      {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                      <input
                        // Esta línea sirve para definir el atributo «placeholder» con el valor «Reps».
                        placeholder="Reps"
                        // Esta línea sirve para definir el atributo «title» con el valor «Repeticiones».
                        title="Repeticiones"
                        // Esta línea sirve para pasar la propiedad «value» con el valor «ex.default_reps}».
                        value={ex.default_reps}
                        // Esta línea sirve para asignar el manejador del evento «onChange».
                        onChange={(e) => updateExercise(dayIndex, exIndex, { default_reps: e.target.value })}
                        // Esta línea sirve para aplicar las clases de estilo «w-16 ${inputClass}».
                        className={`w-16 ${inputClass}`}
                      />
                      {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                      <input
                        // Esta línea sirve para definir el atributo «type» con el valor «number».
                        type="number"
                        // Esta línea sirve para pasar la propiedad «min» con el valor «0}».
                        min={0}
                        // Esta línea sirve para pasar la propiedad «max» con el valor «600}».
                        max={600}
                        // Esta línea sirve para definir el atributo «title» con el valor «Descanso (seg)».
                        title="Descanso (seg)"
                        // Esta línea sirve para pasar la propiedad «value» con el valor «ex.rest_seconds}».
                        value={ex.rest_seconds}
                        // Esta línea sirve para asignar el manejador del evento «onChange».
                        onChange={(e) => updateExercise(dayIndex, exIndex, { rest_seconds: e.target.value })}
                        // Esta línea sirve para aplicar las clases de estilo «w-20 ${inputClass}».
                        className={`w-20 ${inputClass}`}
                      />
                      {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                      <input
                        // Esta línea sirve para definir el atributo «type» con el valor «number».
                        type="number"
                        // Esta línea sirve para pasar la propiedad «min» con el valor «0}».
                        min={0}
                        // Esta línea sirve para pasar la propiedad «max» con el valor «10}».
                        max={10}
                        // Esta línea sirve para pasar la propiedad «step» con el valor «0.5}».
                        step={0.5}
                        // Esta línea sirve para definir el atributo «placeholder» con el valor «RPE».
                        placeholder="RPE"
                        // Esta línea sirve para definir el atributo «title» con el valor «RPE objetivo (opcional)».
                        title="RPE objetivo (opcional)"
                        // Esta línea sirve para pasar la propiedad «value» con el valor «ex.default_rpe}».
                        value={ex.default_rpe}
                        // Esta línea sirve para asignar el manejador del evento «onChange».
                        onChange={(e) => updateExercise(dayIndex, exIndex, { default_rpe: e.target.value })}
                        // Esta línea sirve para aplicar las clases de estilo «w-16 ${inputClass}».
                        className={`w-16 ${inputClass}`}
                      />
                      {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                      <Button
                        // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                        variant="outline"
                        // Esta línea sirve para definir el atributo «size» con el valor «sm».
                        size="sm"
                        // Esta línea sirve para asignar el manejador del evento «onClick».
                        onClick={() => moveExercise(dayIndex, exIndex, -1)}
                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «exIndex === 0}».
                        disabled={exIndex === 0}
                      >
                        {/* Esta línea sirve para mostrar el contenido dinámico «↑». */}
                        ↑
                      </Button>
                      {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                      <Button
                        // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                        variant="outline"
                        // Esta línea sirve para definir el atributo «size» con el valor «sm».
                        size="sm"
                        // Esta línea sirve para asignar el manejador del evento «onClick».
                        onClick={() => moveExercise(dayIndex, exIndex, 1)}
                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «exIndex === day.exercises.length - 1}».
                        disabled={exIndex === day.exercises.length - 1}
                      >
                        {/* Esta línea sirve para mostrar el contenido dinámico «↓». */}
                        ↓
                      </Button>
                      {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                      <Button
                        // Esta línea sirve para definir el atributo «variant» con el valor «destructive».
                        variant="destructive"
                        // Esta línea sirve para definir el atributo «size» con el valor «sm».
                        size="sm"
                        // Esta línea sirve para asignar el manejador del evento «onClick».
                        onClick={() => removeExercise(dayIndex, exIndex)}
                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «day.exercises.length <= 1}».
                        disabled={day.exercises.length <= 1}
                      >
                        {/* Esta línea sirve para mostrar el texto «Quitar». */}
                        Quitar
                      </Button>
                    </div>
                  ))}
                  {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
                  <Button variant="outline" size="sm" onClick={() => addExercise(dayIndex)}>
                    {/* Esta línea sirve para mostrar el contenido dinámico «+ Agregar ejercicio». */}
                    + Agregar ejercicio
                  </Button>
                </div>
              </div>
            ))}
            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button variant="outline" size="sm" onClick={addDay}>
              {/* Esta línea sirve para mostrar el contenido dinámico «+ Agregar día». */}
              + Agregar día
            </Button>
          </div>

          {/* Esta línea sirve para mostrar el elemento solo si «formError». */}
          {formError && <p className="mt-3 text-sm text-destructive">{formError}</p>}

          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-4 flex gap-2». */}
          <div className="mt-4 flex gap-2">
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
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «!isFormValid(form) || updateMutation.isPendin».
                  disabled={!isFormValid(form) || updateMutation.isPending}
                >
                  {/* Esta línea sirve para mostrar el texto «Guardar cambios». */}
                  Guardar cambios
                </Button>
                {/* Esta línea sirve para abrir el componente «Button». */}
                <Button size="sm" variant="outline" onClick={resetForm}>
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
                // Esta línea sirve para aplicar las clases de estilo «h-auto w-full whitespace-normal py-2 text-cen».
                className="h-auto w-full whitespace-normal py-2 text-center sm:w-auto"
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => createMutation.mutate()}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «!isFormValid(form) || createMutation.isPendin».
                disabled={!isFormValid(form) || createMutation.isPending}
              >
                {/* Esta línea sirve para mostrar el texto «Crear (queda inactiva hasta que la actives)». */}
                Crear (queda inactiva hasta que la actives)
              </Button>
            )}
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-20 w-full" />}

          {/* Esta línea sirve para mostrar el contenido dinámico «{!isLoading &&». */}
          {!isLoading &&
            // Esta línea sirve para recorrer los grupos de plantillas por sexo y frecuencia.
            Array.from(grouped.entries()).map(([key, group]) => (
              // Esta línea sirve para abrir el elemento «div».
              <div key={key} className="mb-4 last:mb-0">
                {/* Esta línea sirve para abrir el elemento «p» con las clases «text-xs font-medium tracking-wide text-m». */}
                <p className="text-xs font-medium tracking-wide text-muted-foreground">
                  {/* Esta línea sirve para mostrar el sexo y la frecuencia del grupo. */}
                  {group[0].sex === "male" ? "Hombre" : "Mujer"} · {group[0].frequency_days} días ·{" "}
                  {/* Esta línea sirve para mostrar el contenido dinámico «{LEVEL_LABELS[group[0].level]}». */}
                  {LEVEL_LABELS[group[0].level]}
                </p>
                {/* Esta línea sirve para abrir el elemento «ul» con las clases «mt-1 divide-y divide-border». */}
                <ul className="mt-1 divide-y divide-border">
                  {/* Esta línea sirve para recorrer «group» y mostrar un bloque por elemento. */}
                  {group.map((template) => (
                    // Esta línea sirve para abrir el elemento «li» con sus atributos en varias líneas.
                    <li
                      // Esta línea sirve para identificar el elemento de la lista con «template.id}».
                      key={template.id}
                      // Esta línea sirve para aplicar las clases de estilo «flex flex-col gap-2 py-2.5 sm:flex-row sm:ite».
                      className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                    >
                      {/* Esta línea sirve para abrir el elemento «div» con las clases «min-w-0». */}
                      <div className="min-w-0">
                        {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-foreground». */}
                        <p className="text-sm text-foreground">
                          {/* Esta línea sirve para mostrar el contenido dinámico «{template.name ?? `Plantilla #${template.id}`}». */}
                          {template.name ?? `Plantilla #${template.id}`}
                          {/* Esta línea sirve para elegir entre dos bloques según «template.is_active». */}
                          {template.is_active ? (
                            // Esta línea sirve para mostrar el texto «● Activa» dentro de un «span».
                            <span className="ml-2 text-xs text-primary">● Activa</span>
                          // Esta línea sirve para mostrar el bloque alternativo.
                          ) : (
                            // Esta línea sirve para mostrar el texto «○ Inactiva» dentro de un «span».
                            <span className="ml-2 text-xs text-muted-foreground">○ Inactiva</span>
                          )}
                        </p>
                        {/* Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-muted-foreground». */}
                        <p className="text-xs text-muted-foreground">
                          {/* Esta línea sirve para mostrar el tipo de división y la cantidad de días de la plantilla. */}
                          {template.split_type} · {template.days.length} días · {template.days.reduce((n, d) => n + d.exercises.length, 0)} ejercicios
                        </p>
                      </div>
                      {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-shrink-0 flex-wrap gap-1.5». */}
                      <div className="flex flex-shrink-0 flex-wrap gap-1.5">
                        {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
                        <Button variant="outline" size="sm" onClick={() => startEdit(template)}>
                          {/* Esta línea sirve para mostrar el texto «Editar». */}
                          Editar
                        </Button>
                        {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                        <Button
                          // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                          variant="outline"
                          // Esta línea sirve para definir el atributo «size» con el valor «sm».
                          size="sm"
                          // Esta línea sirve para asignar el manejador del evento «onClick».
                          onClick={() => duplicateMutation.mutate(template.id)}
                          // Esta línea sirve para pasar la propiedad «disabled» con el valor «duplicateMutation.isPending}».
                          disabled={duplicateMutation.isPending}
                        >
                          {/* Esta línea sirve para mostrar el texto «Duplicar». */}
                          Duplicar
                        </Button>
                        {/* Esta línea sirve para elegir entre dos bloques según «template.is_active». */}
                        {template.is_active ? (
                          // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
                          <Button
                            // Esta línea sirve para definir el atributo «variant» con el valor «destructive».
                            variant="destructive"
                            // Esta línea sirve para definir el atributo «size» con el valor «sm».
                            size="sm"
                            // Esta línea sirve para asignar el manejador del evento «onClick».
                            onClick={() => setConfirmingDeactivateId(template.id)}
                          >
                            {/* Esta línea sirve para mostrar el texto «Desactivar». */}
                            Desactivar
                          </Button>
                        // Esta línea sirve para mostrar el bloque alternativo.
                        ) : (
                          // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
                          <Button
                            // Esta línea sirve para definir el atributo «size» con el valor «sm».
                            size="sm"
                            // Esta línea sirve para asignar el manejador del evento «onClick».
                            onClick={() => activateMutation.mutate(template.id)}
                            // Esta línea sirve para pasar la propiedad «disabled» con el valor «activateMutation.isPending}».
                            disabled={activateMutation.isPending}
                          >
                            {/* Esta línea sirve para mostrar el texto «Activar». */}
                            Activar
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </section>

        {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
        <ConfirmDialog
          // Esta línea sirve para pasar la propiedad «open» con el valor «confirmingDeactivateId !== null}».
          open={confirmingDeactivateId !== null}
          // Esta línea sirve para definir el atributo «title» con el valor «¿Desactivar esta plantilla?».
          title="¿Desactivar esta plantilla?"
          // Esta línea sirve para definir el atributo «description».
          description="Deja de asignarse a usuarios nuevos. Si es la única activa para ese sexo y frecuencia, el servidor va a rechazar la desactivación."
          // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, desactivar».
          confirmLabel="Sí, desactivar"
          // Esta línea sirve para activar la opción «destructive».
          destructive
          // Esta línea sirve para pasar la propiedad «isLoading» con el valor «deactivateMutation.isPending}».
          isLoading={deactivateMutation.isPending}
          // Esta línea sirve para asignar el manejador del evento «onConfirm».
          onConfirm={() => confirmingDeactivateId && deactivateMutation.mutate(confirmingDeactivateId)}
          // Esta línea sirve para asignar el manejador del evento «onCancel».
          onCancel={() => setConfirmingDeactivateId(null)}
        />
      </div>
    </main>
  )
}
