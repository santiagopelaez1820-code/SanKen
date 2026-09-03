import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { SankButton } from "@/components/ui/SankButton"
import { cn } from "@/lib/utils"
import { EASE_OUT } from "@/lib/motion"

interface SankEmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export function SankEmptyState({ icon: Icon, title, description, action, className }: SankEmptyStateProps) {
  return (
    <div className={cn("d-flex flex-column align-items-center gap-3 py-5 text-center", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="d-flex align-items-center justify-content-center rounded-circle"
        style={{ width: 56, height: 56, background: "var(--sanken-charcoal)" }}
      >
        <Icon size={24} className="text-body-secondary" />
      </motion.div>
      <div>
        <p className="fw-semibold mb-1">{title}</p>
        {description && (
          <p className="small text-body-secondary mx-auto mb-0" style={{ maxWidth: 320 }}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <SankButton size="sm" variant="outline" onClick={action.onClick} className="mt-1">
          {action.label}
        </SankButton>
      )}
    </div>
  )
}
