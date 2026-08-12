import { AnimatePresence, motion } from "framer-motion"
import type { GamificationEventResult } from "@sanken/core"
import { Button } from "@/components/ui/button"

const CONFETTI_COLORS = ["#f59e0b", "#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#ec4899"]

interface LevelUpModalProps {
  result: GamificationEventResult | null
  onClose: () => void
}

export function LevelUpModal({ result, onClose }: LevelUpModalProps) {
  const show = Boolean(result?.leveled_up)

  return (
    <AnimatePresence>
      {show && result && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative flex w-full max-w-sm flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute top-1/2 left-1/2 size-2 rounded-full"
                style={{ backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
                initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: 0,
                  x: (Math.random() - 0.5) * 260,
                  y: (Math.random() - 0.5) * 260,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 0.8, delay: i * 0.02, ease: "easeOut" }}
              />
            ))}

            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">¡Subiste de nivel!</p>
            <p className="font-heading text-4xl font-medium tracking-tight text-primary">
              Nivel {result.new_level}
            </p>
            <p className="text-sm text-muted-foreground">+{result.xp_awarded} XP</p>

            {result.achievements_unlocked.length > 0 && (
              <ul className="mt-2 w-full space-y-1.5">
                {result.achievements_unlocked.map((achievement) => (
                  <li
                    key={achievement.code}
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
                  >
                    <span className="text-foreground">{achievement.name}</span>
                    <span className="font-medium text-primary">+{achievement.xp_bonus} XP</span>
                  </li>
                ))}
              </ul>
            )}

            <Button className="mt-3" onClick={onClose}>
              Continuar
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
