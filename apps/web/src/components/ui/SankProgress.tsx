// Esta línea sirve para importar «ProgressBar» desde «react-bootstrap».
import { ProgressBar } from "react-bootstrap"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar la interfaz «SankProgressProps».
interface SankProgressProps {
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «number».
  value: number
  // Esta línea sirve para declarar la propiedad «max» con el valor o tipo «number».
  max?: number
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label?: string
  // Esta línea sirve para declarar la propiedad «showValue» con el valor o tipo «boolean».
  showValue?: boolean
  // Esta línea sirve para declarar la propiedad «className» con el valor o tipo «string».
  className?: string
  // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «"primary" | "success" | "warning" | "danger"».
  variant?: "primary" | "success" | "warning" | "danger"
}

// Esta línea sirve para declarar el componente de barra de progreso.
export function SankProgress({
  // Esta línea sirve para incluir el valor «value» en la lista.
  value,
  // Esta línea sirve para incluir el valor «max» en la lista.
  max = 100,
  // Esta línea sirve para incluir el valor «label» en la lista.
  label,
  // Esta línea sirve para incluir el valor «showValue» en la lista.
  showValue = true,
  // Esta línea sirve para incluir el valor «className» en la lista.
  className,
  // Esta línea sirve para incluir el valor «variant» en la lista.
  variant = "primary",
// Esta línea sirve para cerrar los parámetros del componente.
}: SankProgressProps) {
  // Esta línea sirve para calcular el porcentaje entre 0 y 100.
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div».
    <div className={cn("d-flex flex-column gap-1", className)}>
      {/* Esta línea sirve para mostrar el bloque solo si «(label || showValue)». */}
      {(label || showValue) && (
        // Esta línea sirve para abrir el elemento «div» con las clases «d-flex justify-content-between align-ite».
        <div className="d-flex justify-content-between align-items-baseline">
          {/* Esta línea sirve para mostrar el elemento solo si «label». */}
          {label && <span className="small text-body-secondary">{label}</span>}
          {/* Esta línea sirve para mostrar el bloque solo si «showValue». */}
          {showValue && (
            // Esta línea sirve para mostrar el porcentaje redondeado.
            <span className="small fw-semibold sank-tabular-nums">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      {/* Esta línea sirve para abrir el componente «ProgressBar». */}
      <ProgressBar now={pct} variant={variant === "primary" ? undefined : variant} />
    </div>
  )
}
