// Esta línea sirve para importar todo el módulo como «React» desde «react».
import * as React from "react"
// Esta línea sirve para importar «Badge» desde «react-bootstrap».
import { Badge } from "react-bootstrap"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar las variantes de insignia disponibles.
export type SankBadgeVariant = "cyan" | "neutral" | "success" | "warning" | "danger" | "outline"

// Esta línea sirve para declarar las clases de cada variante.
const VARIANT_CLASS: Record<SankBadgeVariant, string> = {
  // Esta línea sirve para declarar la propiedad «cyan» con el valor o tipo «"text-bg-primary"».
  cyan: "text-bg-primary",
  // Esta línea sirve para declarar la propiedad «neutral» con el valor o tipo «"bg-secondary-subtle text-body"».
  neutral: "bg-secondary-subtle text-body",
  // Esta línea sirve para declarar la propiedad «success» con el valor o tipo «"text-bg-success"».
  success: "text-bg-success",
  // Esta línea sirve para declarar la propiedad «warning» con el valor o tipo «"text-bg-warning"».
  warning: "text-bg-warning",
  // Esta línea sirve para declarar la propiedad «danger» con el valor o tipo «"text-bg-danger"».
  danger: "text-bg-danger",
  // Esta línea sirve para definir la propiedad «outline» con «border border-secondary-subtle text-body…».
  outline: "border border-secondary-subtle text-body-secondary bg-transparent",
}

// Esta línea sirve para declarar la interfaz «SankBadgeProps».
interface SankBadgeProps extends React.ComponentProps<typeof Badge> {
  // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «SankBadgeVariant».
  variant?: SankBadgeVariant
  // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «React.ReactNode».
  icon?: React.ReactNode
}

// Esta línea sirve para declarar el componente de insignia de SanKen.
export function SankBadge({ variant = "neutral", icon, className, children, ...props }: SankBadgeProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Badge» con sus atributos en varias líneas.
    <Badge
      // Esta línea sirve para aplicar la forma de píldora.
      pill
      // Esta línea sirve para definir el atributo «bg» con el valor «».
      bg=""
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
      className={cn(
        // Esta línea sirve para incluir el texto o las clases «d-inline-flex align-items-center gap-1 fw-sem…».
        "d-inline-flex align-items-center gap-1 fw-semibold py-1 px-2",
        // Esta línea sirve para agregar las clases de la variante elegida.
        VARIANT_CLASS[variant],
        // Esta línea sirve para agregar las clases recibidas por parámetro.
        className
      )}
      // Esta línea sirve para mostrar el valor «...props».
      {...props}
    >
      {/* Esta línea sirve para mostrar el valor «icon». */}
      {icon}
      {/* Esta línea sirve para mostrar el valor «children». */}
      {children}
    </Badge>
  )
}
