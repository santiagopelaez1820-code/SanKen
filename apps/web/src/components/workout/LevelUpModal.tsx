// Esta línea sirve para importar «AnimatePresence, motion» desde «framer-motion».
import { AnimatePresence, motion } from "framer-motion"
// Esta línea sirve para importar los tipos «GamificationEventResult» desde «@sanken/core».
import type { GamificationEventResult } from "@sanken/core"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"

// Esta línea sirve para declarar los colores del confeti.
const CONFETTI_COLORS = ["#f59e0b", "#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#ec4899"]

// Esta línea sirve para declarar la interfaz «LevelUpModalProps».
interface LevelUpModalProps {
  // Esta línea sirve para declarar la propiedad «result» con el valor o tipo «GamificationEventResult | null».
  result: GamificationEventResult | null
  // Esta línea sirve para declarar la propiedad «onClose» con el valor o tipo «() => void».
  onClose: () => void
}

// Esta línea sirve para declarar el modal que celebra la subida de nivel.
export function LevelUpModal({ result, onClose }: LevelUpModalProps) {
  // Esta línea sirve para declarar «show» con el valor «Boolean(result?.leveled_up)».
  const show = Boolean(result?.leveled_up)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «AnimatePresence».
    <AnimatePresence>
      {/* Esta línea sirve para mostrar el bloque solo si «show && result». */}
      {show && result && (
        // Esta línea sirve para abrir el contenedor animado del modal.
        <motion.div
          // Esta línea sirve para aplicar las clases de estilo «fixed inset-0 z-50 flex items-center justify-».
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 0 }}».
          initial={{ opacity: 0 }}
          // Esta línea sirve para pasar la propiedad «animate» con el valor «{ opacity: 1 }}».
          animate={{ opacity: 1 }}
          // Esta línea sirve para pasar la propiedad «exit» con el valor «{ opacity: 0 }}».
          exit={{ opacity: 0 }}
        >
          {/* Esta línea sirve para abrir la tarjeta animada del modal. */}
          <motion.div
            // Esta línea sirve para aplicar las clases de estilo «relative flex w-full max-w-sm flex-col items-».
            className="relative flex w-full max-w-sm flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 text-center"
            // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 0, scale: 0.8 }}».
            initial={{ opacity: 0, scale: 0.8 }}
            // Esta línea sirve para pasar la propiedad «animate» con el valor «{ opacity: 1, scale: 1 }}».
            animate={{ opacity: 1, scale: 1 }}
            // Esta línea sirve para pasar la propiedad «exit» con el valor «{ opacity: 0, scale: 0.8 }}».
            exit={{ opacity: 0, scale: 0.8 }}
            // Esta línea sirve para pasar la propiedad «transition» con el valor «{ type: "spring", stiffness: 260, damping: 20».
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Esta línea sirve para recorrer «Array.from({ length: 16 })» y mostrar un bloque por elemento. */}
            {Array.from({ length: 16 }).map((_, i) => (
              // Esta línea sirve para abrir cada pieza animada de confeti.
              <motion.span
                // Esta línea sirve para identificar el elemento de la lista con «i}».
                key={i}
                // Esta línea sirve para aplicar las clases de estilo «pointer-events-none absolute top-1/2 left-1/2».
                className="pointer-events-none absolute top-1/2 left-1/2 size-2 rounded-full"
                // Esta línea sirve para pasar la propiedad «style» con el valor «{ backgroundColor: CONFETTI_COLORS[i % CONFET».
                style={{ backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
                // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 1, x: 0, y: 0, rotate: 0 }}».
                initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                // Esta línea sirve para pasar la propiedad «animate» con el valor «{».
                animate={{
                  // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «0».
                  opacity: 0,
                  // Esta línea sirve para declarar la propiedad «x» con el valor o tipo «(Math.random() - 0.5) * 260».
                  x: (Math.random() - 0.5) * 260,
                  // Esta línea sirve para declarar la propiedad «y» con el valor o tipo «(Math.random() - 0.5) * 260».
                  y: (Math.random() - 0.5) * 260,
                  // Esta línea sirve para declarar la propiedad «rotate» con el valor o tipo «Math.random() * 360».
                  rotate: Math.random() * 360,
                }}
                // Esta línea sirve para pasar la propiedad «transition» con el valor «{ duration: 0.8, delay: i * 0.02, ease: "ease».
                transition={{ duration: 0.8, delay: i * 0.02, ease: "easeOut" }}
              />
            ))}

            {/* Esta línea sirve para mostrar el aviso de subida de nivel. */}
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">¡Subiste de nivel!</p>
            {/* Esta línea sirve para abrir el elemento «p» con las clases «font-heading text-4xl font-medium tracki». */}
            <p className="font-heading text-4xl font-medium tracking-tight text-primary">
              {/* Esta línea sirve para mostrar el nuevo nivel. */}
              Nivel {result.new_level}
            </p>
            {/* Esta línea sirve para mostrar la experiencia ganada. */}
            <p className="text-sm text-muted-foreground">+{result.xp_awarded} XP</p>

            {/* Esta línea sirve para mostrar el bloque solo si «result.achievements_unlocked.length > 0». */}
            {result.achievements_unlocked.length > 0 && (
              // Esta línea sirve para abrir el elemento «ul» con las clases «mt-2 w-full space-y-1.5».
              <ul className="mt-2 w-full space-y-1.5">
                {/* Esta línea sirve para recorrer «result.achievements_unlocked» y mostrar un bloque por elemento. */}
                {result.achievements_unlocked.map((achievement) => (
                  // Esta línea sirve para abrir el elemento «li» con sus atributos en varias líneas.
                  <li
                    // Esta línea sirve para identificar el elemento de la lista con «achievement.code}».
                    key={achievement.code}
                    // Esta línea sirve para aplicar las clases de estilo «flex items-center justify-between rounded-lg ».
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
                  >
                    {/* Esta línea sirve para mostrar el nombre del logro. */}
                    <span className="text-foreground">{achievement.name}</span>
                    {/* Esta línea sirve para mostrar la experiencia extra del logro. */}
                    <span className="font-medium text-primary">+{achievement.xp_bonus} XP</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button className="mt-3" onClick={onClose}>
              {/* Esta línea sirve para mostrar el texto «Continuar». */}
              Continuar
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
