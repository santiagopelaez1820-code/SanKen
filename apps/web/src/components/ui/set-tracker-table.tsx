import { AnimatePresence, motion } from "framer-motion"
import { Check } from "lucide-react"
import type { WorkoutSet } from "@sanken/core"
import { cn } from "@/lib/utils"

interface SetTrackerTableProps {
  sets: WorkoutSet[]
  targetSets: number
  suggestedWeightKg: number | null
  suggestedRepsForNextSet: number | null
  className?: string
}

export function SetTrackerTable({
  sets,
  targetSets,
  suggestedWeightKg,
  suggestedRepsForNextSet,
  className,
}: SetTrackerTableProps) {
  const nextSetNumber = sets.length + 1
  const hasUpcoming = sets.length < targetSets

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="grid grid-cols-[2.5rem_1fr_1fr_1fr_1.5rem] gap-2 border-b border-border px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <span>Serie</span>
        <span>Kg</span>
        <span>Reps</span>
        <span>RPE</span>
        <span />
      </div>

      <AnimatePresence initial={false}>
        {sets.map((set) => (
          <motion.div
            key={set.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-[2.5rem_1fr_1fr_1fr_1.5rem] items-center gap-2 border-b border-border px-4 py-2.5 text-sm last:border-0"
          >
            <span className="text-muted-foreground tabular-nums">{set.set_number}</span>
            <span className="font-medium text-foreground tabular-nums">{set.weight_kg}</span>
            <span className="font-medium text-foreground tabular-nums">{set.reps}</span>
            <span className="text-muted-foreground tabular-nums">{set.rpe ?? "—"}</span>
            <span className="flex size-5 items-center justify-center rounded-full bg-success/15 text-success">
              <Check className="size-3.5" />
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      {hasUpcoming && (suggestedWeightKg !== null || suggestedRepsForNextSet !== null) && (
        <div className="grid grid-cols-[2.5rem_1fr_1fr_1fr_1.5rem] items-center gap-2 bg-primary/5 px-4 py-2.5 text-sm">
          <span className="font-semibold text-primary tabular-nums">{nextSetNumber}</span>
          <span className="font-semibold text-primary tabular-nums">{suggestedWeightKg ?? "—"}</span>
          <span className="font-semibold text-primary tabular-nums">{suggestedRepsForNextSet ?? "—"}</span>
          <span className="text-muted-foreground">objetivo</span>
          <span className="size-2 justify-self-center rounded-full bg-primary" />
        </div>
      )}
    </div>
  )
}
