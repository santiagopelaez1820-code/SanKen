import { AnimatePresence, motion } from "framer-motion"

const BURST_COLORS = ["var(--primary)", "var(--secondary-accent)", "var(--foreground)"]

interface CelebrationOverlayProps {
  show: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Envuelve un banner inline (PR, serie completada) con una entrada de
 * celebración liviana: scale-in + un pequeño estallido de partículas en los
 * colores de marca. Para el momento "full-screen" (subir de nivel) se usa
 * LevelUpModal en su lugar, que ya tiene su propio confetti a pantalla completa.
 */
export function CelebrationOverlay({ show, children, className }: CelebrationOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`relative ${className ?? ""}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute top-1/2 left-1/2 size-1.5 rounded-full"
              style={{ backgroundColor: BURST_COLORS[i % BURST_COLORS.length] }}
              initial={{ opacity: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                x: (Math.random() - 0.5) * 140,
                y: (Math.random() - 0.5) * 100,
              }}
              transition={{ duration: 0.6, delay: i * 0.02, ease: "easeOut" }}
            />
          ))}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
