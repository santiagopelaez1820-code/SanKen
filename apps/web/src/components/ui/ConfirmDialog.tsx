import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** Modal de confirmación genérico — mismo shell visual que LevelUpModal, reutilizable para cualquier acción que necesite un "¿Seguro?" antes de ejecutarse. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-heading text-lg font-medium text-foreground">{title}</p>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
            <div className="mt-5 flex justify-center gap-3">
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                {cancelLabel}
              </Button>
              <Button variant={destructive ? "destructive" : "default"} onClick={onConfirm} disabled={isLoading}>
                {isLoading ? "…" : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
