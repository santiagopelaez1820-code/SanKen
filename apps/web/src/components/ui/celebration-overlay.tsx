// Esta línea sirve para importar «AnimatePresence, motion» desde «framer-motion».
import { AnimatePresence, motion } from "framer-motion"

// Esta línea sirve para declarar los colores de las partículas de celebración.
const BURST_COLORS = ["var(--primary)", "var(--secondary-accent)", "var(--foreground)"]

// Esta línea sirve para declarar la interfaz «CelebrationOverlayProps».
interface CelebrationOverlayProps {
  // Esta línea sirve para declarar la propiedad «show» con el valor o tipo «boolean».
  show: boolean
  // Esta línea sirve para declarar la propiedad «children» con el valor o tipo «React.ReactNode».
  children: React.ReactNode
  // Esta línea sirve para declarar la propiedad «className» con el valor o tipo «string».
  className?: string
}

/**
 * Envuelve un banner inline (PR, serie completada) con una entrada de
 * celebración liviana: scale-in + un pequeño estallido de partículas en los
 * colores de marca. Para el momento "full-screen" (subir de nivel) se usa
 * LevelUpModal en su lugar, que ya tiene su propio confetti a pantalla completa.
 */
// Esta línea sirve para declarar el componente de celebración.
export function CelebrationOverlay({ show, children, className }: CelebrationOverlayProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «AnimatePresence».
    <AnimatePresence>
      {/* Esta línea sirve para mostrar el bloque solo si «show». */}
      {show && (
        // Esta línea sirve para abrir el contenedor animado de la celebración.
        <motion.div
          // Esta línea sirve para aplicar las clases de estilo «relative ${className ?? ""}».
          className={`relative ${className ?? ""}`}
          // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 0, scale: 0.9 }}».
          initial={{ opacity: 0, scale: 0.9 }}
          // Esta línea sirve para pasar la propiedad «animate» con el valor «{ opacity: 1, scale: 1 }}».
          animate={{ opacity: 1, scale: 1 }}
          // Esta línea sirve para pasar la propiedad «exit» con el valor «{ opacity: 0, scale: 0.95 }}».
          exit={{ opacity: 0, scale: 0.95 }}
          // Esta línea sirve para pasar la propiedad «transition» con el valor «{ type: "spring", stiffness: 300, damping: 20».
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Esta línea sirve para recorrer «Array.from({ length: 8 })» y mostrar un bloque por elemento. */}
          {Array.from({ length: 8 }).map((_, i) => (
            // Esta línea sirve para abrir cada partícula animada.
            <motion.span
              // Esta línea sirve para identificar el elemento de la lista con «i}».
              key={i}
              // Esta línea sirve para aplicar las clases de estilo «pointer-events-none absolute top-1/2 left-1/2».
              className="pointer-events-none absolute top-1/2 left-1/2 size-1.5 rounded-full"
              // Esta línea sirve para pasar la propiedad «style» con el valor «{ backgroundColor: BURST_COLORS[i % BURST_COL».
              style={{ backgroundColor: BURST_COLORS[i % BURST_COLORS.length] }}
              // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 1, x: 0, y: 0 }}».
              initial={{ opacity: 1, x: 0, y: 0 }}
              // Esta línea sirve para pasar la propiedad «animate» con el valor «{».
              animate={{
                // Esta línea sirve para declarar la propiedad «opacity» con el valor o tipo «0».
                opacity: 0,
                // Esta línea sirve para declarar la propiedad «x» con el valor o tipo «(Math.random() - 0.5) * 140».
                x: (Math.random() - 0.5) * 140,
                // Esta línea sirve para declarar la propiedad «y» con el valor o tipo «(Math.random() - 0.5) * 100».
                y: (Math.random() - 0.5) * 100,
              }}
              // Esta línea sirve para pasar la propiedad «transition» con el valor «{ duration: 0.6, delay: i * 0.02, ease: "ease».
              transition={{ duration: 0.6, delay: i * 0.02, ease: "easeOut" }}
            />
          ))}
          {/* Esta línea sirve para mostrar el valor «children». */}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
