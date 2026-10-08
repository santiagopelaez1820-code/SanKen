// Esta línea sirve para importar «useFieldArray, type Control, type FieldErrors, type UseFormRegister» desde «react-hook-form».
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form"
// Esta línea sirve para importar los tipos «ExerciseCatalogItem» desde «@sanken/core».
import type { ExerciseCatalogItem } from "@sanken/core"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «EMPTY_EXERCISE, type RoutineFormValues» desde «./routine-form-types».
import { EMPTY_EXERCISE, type RoutineFormValues } from "./routine-form-types"

// Esta línea sirve para declarar las clases comunes de los campos del formulario.
const fieldClass =
  // Esta línea sirve para incluir el texto o las clases «w-full rounded-lg border border-input bg-back…».
  "w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

// Esta línea sirve para declarar la interfaz «RoutineDayFieldsetProps».
interface RoutineDayFieldsetProps {
  // Esta línea sirve para declarar la propiedad «control» con el valor o tipo «Control<RoutineFormValues>».
  control: Control<RoutineFormValues>
  // Esta línea sirve para declarar la propiedad «register» con el valor o tipo «UseFormRegister<RoutineFormValues>».
  register: UseFormRegister<RoutineFormValues>
  // Esta línea sirve para declarar la propiedad «dayIndex» con el valor o tipo «number».
  dayIndex: number
  // Esta línea sirve para declarar la propiedad «onRemoveDay» con el valor o tipo «() => void».
  onRemoveDay: () => void
  // Esta línea sirve para declarar la propiedad «canRemoveDay» con el valor o tipo «boolean».
  canRemoveDay: boolean
  // Esta línea sirve para declarar la propiedad «exercises» con el valor o tipo «ExerciseCatalogItem[]».
  exercises: ExerciseCatalogItem[]
  // Esta línea sirve para declarar la propiedad «errors» con el valor o tipo «FieldErrors<RoutineFormValues>».
  errors: FieldErrors<RoutineFormValues>
}

// Esta línea sirve para declarar el componente de los campos de un día de rutina.
export function RoutineDayFieldset({
  // Esta línea sirve para incluir el valor «control» en la lista.
  control,
  // Esta línea sirve para incluir el valor «register» en la lista.
  register,
  // Esta línea sirve para incluir el valor «dayIndex» en la lista.
  dayIndex,
  // Esta línea sirve para incluir el valor «onRemoveDay» en la lista.
  onRemoveDay,
  // Esta línea sirve para incluir el valor «canRemoveDay» en la lista.
  canRemoveDay,
  // Esta línea sirve para incluir el valor «exercises» en la lista.
  exercises,
  // Esta línea sirve para incluir el valor «errors» en la lista.
  errors,
// Esta línea sirve para cerrar los parámetros del componente.
}: RoutineDayFieldsetProps) {
  // Esta línea sirve para obtener «fields, append, remove» con el hook «useFieldArray».
  const { fields, append, remove } = useFieldArray({
    // Esta línea sirve para incluir el valor «control» en la lista.
    control,
    // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «`days.${dayIndex}.exercises`».
    name: `days.${dayIndex}.exercises`,
  })

  // Esta línea sirve para obtener los errores del día actual.
  const dayErrors = errors.days?.[dayIndex]

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «rounded-lg border border-border p-4».
    <div className="rounded-lg border border-border p-4">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-start justify-between gap-2». */}
      <div className="flex items-start justify-between gap-2">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «flex-1 space-y-1.5». */}
        <div className="flex-1 space-y-1.5">
          {/* Esta línea sirve para mostrar la etiqueta del nombre del día. */}
          <label className="text-xs font-medium text-muted-foreground">Nombre del día</label>
          {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
          <input
            // Esta línea sirve para aplicar las clases de estilo calculadas: «fieldClass}».
            className={fieldClass}
            // Esta línea sirve para definir el atributo «placeholder» con el valor «Ej. Push, Pierna, Full Body A».
            placeholder="Ej. Push, Pierna, Full Body A"
            // Esta línea sirve para conectar el campo del nombre con el formulario.
            {...register(`days.${dayIndex}.label` as const)}
          />
          {/* Esta línea sirve para mostrar el elemento solo si «dayErrors?.label». */}
          {dayErrors?.label && <p className="text-xs text-destructive">{dayErrors.label.message}</p>}
        </div>
        {/* Esta línea sirve para mostrar el bloque solo si «canRemoveDay». */}
        {canRemoveDay && (
          // Esta línea sirve para abrir el componente «Button».
          <Button type="button" variant="ghost" size="sm" onClick={onRemoveDay}>
            {/* Esta línea sirve para mostrar el texto «Quitar día». */}
            Quitar día
          </Button>
        )}
      </div>

      {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 space-y-1.5». */}
      <div className="mt-3 space-y-1.5">
        {/* Esta línea sirve para abrir el elemento «label» con las clases «text-xs font-medium text-muted-foregroun». */}
        <label className="text-xs font-medium text-muted-foreground">
          {/* Esta línea sirve para mostrar el texto «Grupos musculares (separados por coma)». */}
          Grupos musculares (separados por coma)
        </label>
        {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
        <input
          // Esta línea sirve para aplicar las clases de estilo calculadas: «fieldClass}».
          className={fieldClass}
          // Esta línea sirve para definir el atributo «placeholder» con el valor «chest, back, shoulders».
          placeholder="chest, back, shoulders"
          // Esta línea sirve para conectar el campo de grupos musculares con el formulario.
          {...register(`days.${dayIndex}.target_muscle_groups` as const)}
        />
      </div>

      {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-4 space-y-3». */}
      <div className="mt-4 space-y-3">
        {/* Esta línea sirve para recorrer los ejercicios del día. */}
        {fields.map((field, exIndex) => {
          // Esta línea sirve para obtener los errores del ejercicio actual.
          const exerciseErrors = dayErrors?.exercises?.[exIndex]
          // Esta línea sirve para devolver la interfaz del componente.
          return (
            // Esta línea sirve para abrir el elemento «div».
            <div key={field.id} className="grid grid-cols-12 gap-2 rounded-lg bg-muted/50 p-3">
              {/* Esta línea sirve para abrir el elemento «div» con las clases «col-span-12 sm:col-span-4». */}
              <div className="col-span-12 sm:col-span-4">
                {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
                <select
                  // Esta línea sirve para aplicar las clases de estilo calculadas: «fieldClass}».
                  className={fieldClass}
                  // Esta línea sirve para pasar la propiedad «defaultValue» con el valor «0}».
                  defaultValue={0}
                  // Esta línea sirve para conectar el selector de ejercicio con el formulario.
                  {...register(`days.${dayIndex}.exercises.${exIndex}.exercise_id` as const, {
                    // Esta línea sirve para declarar la propiedad «valueAsNumber» con el valor o tipo «true».
                    valueAsNumber: true,
                  })}
                >
                  {/* Esta línea sirve para mostrar la opción vacía del selector. */}
                  <option value={0}>Selecciona un ejercicio…</option>
                  {/* Esta línea sirve para recorrer «exercises» y mostrar un bloque por elemento. */}
                  {exercises.map((ex) => (
                    // Esta línea sirve para abrir el elemento «option».
                    <option key={ex.id} value={ex.id}>
                      {/* Esta línea sirve para mostrar el nombre, el músculo y el equipo del ejercicio. */}
                      {ex.name} — {ex.primary_muscle.name} ({ex.equipment})
                    </option>
                  ))}
                </select>
                {/* Esta línea sirve para mostrar el bloque solo si «exerciseErrors?.exercise_id». */}
                {exerciseErrors?.exercise_id && (
                  // Esta línea sirve para mostrar el error del ejercicio.
                  <p className="mt-1 text-xs text-destructive">{exerciseErrors.exercise_id.message}</p>
                )}
              </div>

              {/* Esta línea sirve para abrir el elemento «div» con las clases «col-span-4 sm:col-span-2». */}
              <div className="col-span-4 sm:col-span-2">
                {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                <input
                  // Esta línea sirve para definir el atributo «type» con el valor «number».
                  type="number"
                  // Esta línea sirve para definir el atributo «placeholder» con el valor «Series».
                  placeholder="Series"
                  // Esta línea sirve para aplicar las clases de estilo calculadas: «fieldClass}».
                  className={fieldClass}
                  // Esta línea sirve para conectar el campo de series con el formulario.
                  {...register(`days.${dayIndex}.exercises.${exIndex}.target_sets` as const, {
                    // Esta línea sirve para declarar la propiedad «valueAsNumber» con el valor o tipo «true».
                    valueAsNumber: true,
                  })}
                />
              </div>

              {/* Esta línea sirve para abrir el elemento «div» con las clases «col-span-4 sm:col-span-2». */}
              <div className="col-span-4 sm:col-span-2">
                {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                <input
                  // Esta línea sirve para definir el atributo «type» con el valor «text».
                  type="text"
                  // Esta línea sirve para definir el atributo «placeholder» con el valor «Reps (ej. 8-12)».
                  placeholder="Reps (ej. 8-12)"
                  // Esta línea sirve para aplicar las clases de estilo calculadas: «fieldClass}».
                  className={fieldClass}
                  // Esta línea sirve para conectar el campo de repeticiones con el formulario.
                  {...register(`days.${dayIndex}.exercises.${exIndex}.target_reps` as const)}
                />
              </div>

              {/* Esta línea sirve para abrir el elemento «div» con las clases «col-span-4 sm:col-span-2». */}
              <div className="col-span-4 sm:col-span-2">
                {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                <input
                  // Esta línea sirve para definir el atributo «type» con el valor «number».
                  type="number"
                  // Esta línea sirve para definir el atributo «placeholder» con el valor «Descanso (s)».
                  placeholder="Descanso (s)"
                  // Esta línea sirve para aplicar las clases de estilo calculadas: «fieldClass}».
                  className={fieldClass}
                  // Esta línea sirve para conectar el campo de descanso con el formulario.
                  {...register(`days.${dayIndex}.exercises.${exIndex}.rest_seconds` as const, {
                    // Esta línea sirve para declarar la propiedad «valueAsNumber» con el valor o tipo «true».
                    valueAsNumber: true,
                  })}
                />
              </div>

              {/* Esta línea sirve para abrir el elemento «div» con las clases «col-span-8 sm:col-span-1». */}
              <div className="col-span-8 sm:col-span-1">
                {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                <input
                  // Esta línea sirve para definir el atributo «type» con el valor «number».
                  type="number"
                  // Esta línea sirve para definir el atributo «step» con el valor «0.5».
                  step="0.5"
                  // Esta línea sirve para definir el atributo «placeholder» con el valor «RPE».
                  placeholder="RPE"
                  // Esta línea sirve para aplicar las clases de estilo calculadas: «fieldClass}».
                  className={fieldClass}
                  // Esta línea sirve para conectar el campo de RPE con el formulario.
                  {...register(`days.${dayIndex}.exercises.${exIndex}.target_rpe` as const, {
                    // Esta línea sirve para convertir el valor vacío en null y el resto en número.
                    setValueAs: (value) => (value === "" ? null : Number(value)),
                  })}
                />
              </div>

              {/* Esta línea sirve para abrir el elemento «div» con las clases «col-span-4 sm:col-span-1 flex items-cent». */}
              <div className="col-span-4 sm:col-span-1 flex items-center justify-end">
                {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                <Button
                  // Esta línea sirve para definir el atributo «type» con el valor «button».
                  type="button"
                  // Esta línea sirve para definir el atributo «variant» con el valor «ghost».
                  variant="ghost"
                  // Esta línea sirve para definir el atributo «size» con el valor «icon-sm».
                  size="icon-sm"
                  // Esta línea sirve para asignar el manejador del evento «onClick».
                  onClick={() => remove(exIndex)}
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «fields.length <= 1}».
                  disabled={fields.length <= 1}
                  // Esta línea sirve para pasar la propiedad «aria-label» con el valor «`Eliminar ejercicio ${exIndex + 1}`}».
                  aria-label={`Eliminar ejercicio ${exIndex + 1}`}
                >
                  {/* Esta línea sirve para mostrar el símbolo de quitar ejercicio. */}
                  ✕
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Esta línea sirve para mostrar el bloque solo si «dayErrors?.exercises?.message». */}
      {dayErrors?.exercises?.message && (
        // Esta línea sirve para mostrar el error general de los ejercicios del día.
        <p className="mt-2 text-xs text-destructive">{dayErrors.exercises.message}</p>
      )}

      {/* Esta línea sirve para abrir el botón que agrega un ejercicio vacío. */}
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => append(EMPTY_EXERCISE)}>
        {/* Esta línea sirve para mostrar el texto del botón. */}
        + Agregar ejercicio
      </Button>
    </div>
  )
}
