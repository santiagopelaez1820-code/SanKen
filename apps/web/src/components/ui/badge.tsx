// Esta línea sirve para importar todo el módulo como «React» desde «react».
import * as React from "react"
// Esta línea sirve para importar «cva, type VariantProps» desde «class-variance-authority».
import { cva, type VariantProps } from "class-variance-authority"

// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar las variantes de estilo de la insignia.
const badgeVariants = cva(
  // Esta línea sirve para incluir el texto o las clases «inline-flex shrink-0 items-center justify-cen…».
  "inline-flex shrink-0 items-center justify-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    // Esta línea sirve para declarar la propiedad «variants» con el valor o tipo «{».
    variants: {
      // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «{».
      variant: {
        // Esta línea sirve para declarar la propiedad «default» con el valor o tipo «"bg-primary/15 text-primary"».
        default: "bg-primary/15 text-primary",
        // Esta línea sirve para definir la propiedad «accent2» con «bg-secondary-accent/15 text-secondary-ac…».
        accent2: "bg-secondary-accent/15 text-secondary-accent",
        // Esta línea sirve para declarar la propiedad «success» con el valor o tipo «"bg-success/15 text-success"».
        success: "bg-success/15 text-success",
        // Esta línea sirve para declarar la propiedad «warning» con el valor o tipo «"bg-warning/15 text-warning"».
        warning: "bg-warning/15 text-warning",
        // Esta línea sirve para declarar la propiedad «error» con el valor o tipo «"bg-destructive/15 text-destructive"».
        error: "bg-destructive/15 text-destructive",
        // Esta línea sirve para declarar la propiedad «neutral» con el valor o tipo «"bg-muted text-muted-foreground"».
        neutral: "bg-muted text-muted-foreground",
        // Esta línea sirve para declarar la propiedad «outline» con el valor o tipo «"border border-border text-foreground"».
        outline: "border border-border text-foreground",
      },
    },
    // Esta línea sirve para declarar la propiedad «defaultVariants» con el valor o tipo «{».
    defaultVariants: {
      // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «"neutral"».
      variant: "neutral",
    },
  }
)

// Esta línea sirve para declarar el componente de insignia.
function Badge({
  // Esta línea sirve para incluir el valor «className» en la lista.
  className,
  // Esta línea sirve para incluir el valor «variant» en la lista.
  variant,
  // Esta línea sirve para copiar las propiedades de «props».
  ...props
// Esta línea sirve para cerrar los parámetros y sus tipos.
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  // Esta línea sirve para devolver un span con las clases de la variante.
  return <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
}

// Esta línea sirve para exportar la insignia y sus variantes.
export { Badge, badgeVariants }
