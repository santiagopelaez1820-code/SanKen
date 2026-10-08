// Esta línea sirve para importar los tipos «LucideIcon» desde «lucide-react».
import type { LucideIcon } from "lucide-react"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar «EASE_OUT» desde «@/lib/motion».
import { EASE_OUT } from "@/lib/motion"

// Esta línea sirve para declarar la interfaz «SankEmptyStateProps».
interface SankEmptyStateProps {
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «LucideIcon».
  icon: LucideIcon
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «string».
  title: string
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «string».
  description?: string
  // Esta línea sirve para declarar la propiedad «action» con el valor o tipo «{ label: string; onClick: () => void }».
  action?: { label: string; onClick: () => void }
  // Esta línea sirve para declarar la propiedad «className» con el valor o tipo «string».
  className?: string
}

// Esta línea sirve para declarar el componente de estado vacío.
export function SankEmptyState({ icon: Icon, title, description, action, className }: SankEmptyStateProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div».
    <div className={cn("d-flex flex-column align-items-center gap-3 py-5 text-center", className)}>
      {/* Esta línea sirve para abrir el contenedor animado. */}
      <motion.div
        // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 0, scale: 0.8 }}».
        initial={{ opacity: 0, scale: 0.8 }}
        // Esta línea sirve para pasar la propiedad «animate» con el valor «{ opacity: 1, scale: 1 }}».
        animate={{ opacity: 1, scale: 1 }}
        // Esta línea sirve para pasar la propiedad «transition» con el valor «{ duration: 0.35, ease: EASE_OUT }}».
        transition={{ duration: 0.35, ease: EASE_OUT }}
        // Esta línea sirve para aplicar las clases de estilo «d-flex align-items-center justify-content-cen».
        className="d-flex align-items-center justify-content-center rounded-circle"
        // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: 56, height: 56, background: "var(--s».
        style={{ width: 56, height: 56, background: "var(--sanken-charcoal)" }}
      >
        {/* Esta línea sirve para abrir el componente «Icon». */}
        <Icon size={24} className="text-body-secondary" />
      </motion.div>
      {/* Esta línea sirve para abrir el elemento «div». */}
      <div>
        {/* Esta línea sirve para mostrar el título del estado vacío. */}
        <p className="fw-semibold mb-1">{title}</p>
        {/* Esta línea sirve para mostrar el bloque solo si «description». */}
        {description && (
          // Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mx-auto mb-0».
          <p className="small text-body-secondary mx-auto mb-0" style={{ maxWidth: 320 }}>
            {/* Esta línea sirve para mostrar el valor «description». */}
            {description}
          </p>
        )}
      </div>
      {/* Esta línea sirve para mostrar el bloque solo si «action». */}
      {action && (
        // Esta línea sirve para abrir el componente «SankButton».
        <SankButton size="sm" variant="outline" onClick={action.onClick} className="mt-1">
          {/* Esta línea sirve para mostrar el valor «action.label». */}
          {action.label}
        </SankButton>
      )}
    </div>
  )
}
