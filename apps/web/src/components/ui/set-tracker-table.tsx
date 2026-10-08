// Esta línea sirve para importar «AnimatePresence, motion» desde «framer-motion».
import { AnimatePresence, motion } from "framer-motion"
// Esta línea sirve para importar «Check» desde «lucide-react».
import { Check } from "lucide-react"
// Esta línea sirve para importar los tipos «WorkoutSet» desde «@sanken/core».
import type { WorkoutSet } from "@sanken/core"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar la interfaz «SetTrackerTableProps».
interface SetTrackerTableProps {
  // Esta línea sirve para declarar la propiedad «sets» con el valor o tipo «WorkoutSet[]».
  sets: WorkoutSet[]
  // Esta línea sirve para declarar la propiedad «targetSets» con el valor o tipo «number».
  targetSets: number
  // Esta línea sirve para declarar la propiedad «suggestedWeightKg» con el valor o tipo «number | null».
  suggestedWeightKg: number | null
  // Esta línea sirve para declarar la propiedad «suggestedRepsForNextSet» con el valor o tipo «number | null».
  suggestedRepsForNextSet: number | null
  // Esta línea sirve para declarar la propiedad «className» con el valor o tipo «string».
  className?: string
}

// Esta línea sirve para declarar la tabla de series de un ejercicio.
export function SetTrackerTable({
  // Esta línea sirve para incluir el valor «sets» en la lista.
  sets,
  // Esta línea sirve para incluir el valor «targetSets» en la lista.
  targetSets,
  // Esta línea sirve para incluir el valor «suggestedWeightKg» en la lista.
  suggestedWeightKg,
  // Esta línea sirve para incluir el valor «suggestedRepsForNextSet» en la lista.
  suggestedRepsForNextSet,
  // Esta línea sirve para incluir el valor «className» en la lista.
  className,
// Esta línea sirve para cerrar los parámetros del componente.
}: SetTrackerTableProps) {
  // Esta línea sirve para calcular el número de la siguiente serie.
  const nextSetNumber = sets.length + 1
  // Esta línea sirve para calcular si quedan series por hacer.
  const hasUpcoming = sets.length < targetSets

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div».
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      {/* Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-[2.5rem_1fr_1fr_1fr_1.5re». */}
      <div className="grid grid-cols-[2.5rem_1fr_1fr_1fr_1.5rem] gap-2 border-b border-border px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {/* Esta línea sirve para mostrar el encabezado de serie. */}
        <span>Serie</span>
        {/* Esta línea sirve para mostrar el encabezado de peso. */}
        <span>Kg</span>
        {/* Esta línea sirve para mostrar el encabezado de repeticiones. */}
        <span>Reps</span>
        {/* Esta línea sirve para mostrar el encabezado de RPE. */}
        <span>RPE</span>
        {/* Esta línea sirve para abrir el elemento «span». */}
        <span />
      </div>

      {/* Esta línea sirve para abrir el componente «AnimatePresence». */}
      <AnimatePresence initial={false}>
        {/* Esta línea sirve para recorrer «sets» y mostrar un bloque por elemento. */}
        {sets.map((set) => (
          // Esta línea sirve para abrir la fila animada de la serie.
          <motion.div
            // Esta línea sirve para identificar el elemento de la lista con «set.id}».
            key={set.id}
            // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 0, y: -8 }}».
            initial={{ opacity: 0, y: -8 }}
            // Esta línea sirve para pasar la propiedad «animate» con el valor «{ opacity: 1, y: 0 }}».
            animate={{ opacity: 1, y: 0 }}
            // Esta línea sirve para pasar la propiedad «transition» con el valor «{ duration: 0.25 }}».
            transition={{ duration: 0.25 }}
            // Esta línea sirve para aplicar las clases de estilo «grid grid-cols-[2.5rem_1fr_1fr_1fr_1.5rem] it».
            className="grid grid-cols-[2.5rem_1fr_1fr_1fr_1.5rem] items-center gap-2 border-b border-border px-4 py-2.5 text-sm last:border-0"
          >
            {/* Esta línea sirve para mostrar el número de serie. */}
            <span className="text-muted-foreground tabular-nums">{set.set_number}</span>
            {/* Esta línea sirve para mostrar el peso levantado. */}
            <span className="font-medium text-foreground tabular-nums">{set.weight_kg}</span>
            {/* Esta línea sirve para mostrar las repeticiones. */}
            <span className="font-medium text-foreground tabular-nums">{set.reps}</span>
            {/* Esta línea sirve para mostrar el RPE o un guion. */}
            <span className="text-muted-foreground tabular-nums">{set.rpe ?? "—"}</span>
            {/* Esta línea sirve para abrir el elemento «span» con las clases «flex size-5 items-center justify-center ». */}
            <span className="flex size-5 items-center justify-center rounded-full bg-success/15 text-success">
              {/* Esta línea sirve para abrir el componente «Check». */}
              <Check className="size-3.5" />
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Esta línea sirve para mostrar la fila sugerida si quedan series y hay sugerencias. */}
      {hasUpcoming && (suggestedWeightKg !== null || suggestedRepsForNextSet !== null) && (
        // Esta línea sirve para abrir el elemento «div» con las clases «grid grid-cols-[2.5rem_1fr_1fr_1fr_1.5re».
        <div className="grid grid-cols-[2.5rem_1fr_1fr_1fr_1.5rem] items-center gap-2 bg-primary/5 px-4 py-2.5 text-sm">
          {/* Esta línea sirve para mostrar el número de la siguiente serie. */}
          <span className="font-semibold text-primary tabular-nums">{nextSetNumber}</span>
          {/* Esta línea sirve para mostrar el peso sugerido o un guion. */}
          <span className="font-semibold text-primary tabular-nums">{suggestedWeightKg ?? "—"}</span>
          {/* Esta línea sirve para mostrar las repeticiones sugeridas o un guion. */}
          <span className="font-semibold text-primary tabular-nums">{suggestedRepsForNextSet ?? "—"}</span>
          {/* Esta línea sirve para mostrar la etiqueta de objetivo. */}
          <span className="text-muted-foreground">objetivo</span>
          {/* Esta línea sirve para abrir el elemento «span» con las clases «size-2 justify-self-center rounded-full ». */}
          <span className="size-2 justify-self-center rounded-full bg-primary" />
        </div>
      )}
    </div>
  )
}
