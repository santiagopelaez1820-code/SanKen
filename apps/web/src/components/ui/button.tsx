// Esta línea sirve para importar todo el módulo como «React» desde «react».
import * as React from "react"
// Esta línea sirve para importar «cva, type VariantProps» desde «class-variance-authority».
import { cva, type VariantProps } from "class-variance-authority"
// Esta línea sirve para importar «Slot» desde «radix-ui».
import { Slot } from "radix-ui"

// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar las variantes de estilo del botón.
const buttonVariants = cva(
  // Esta línea sirve para incluir el texto o las clases «group/button inline-flex shrink-0 items-cente…».
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    // Esta línea sirve para declarar la propiedad «variants» con el valor o tipo «{».
    variants: {
      // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «{».
      variant: {
        // Esta línea sirve para definir la propiedad «default» (valor en la línea siguiente).
        default:
          // Esta línea sirve para incluir el texto o las clases «bg-gradient-to-b from-primary to-[color-mix(i…».
          "bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),black_10%)] text-primary-foreground shadow-[0_2px_14px_-2px_var(--primary)] hover:scale-[1.015] hover:shadow-[0_4px_24px_-2px_var(--primary)]",
        // Esta línea sirve para definir la propiedad «emphasis» (valor en la línea siguiente).
        emphasis:
          // Esta línea sirve para incluir el texto o las clases «bg-gradient-to-b from-primary to-[color-mix(i…».
          "bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),black_12%)] text-primary-foreground font-bold tracking-wide uppercase shadow-[0_4px_28px_-4px_var(--primary)] hover:scale-[1.02] hover:-translate-y-px hover:shadow-[0_8px_40px_-4px_var(--primary)]",
        // Esta línea sirve para definir la propiedad «accent2» (valor en la línea siguiente).
        accent2:
          // Esta línea sirve para incluir el texto o las clases «bg-gradient-to-b from-secondary-accent to-[co…».
          "bg-gradient-to-b from-secondary-accent to-[color-mix(in_oklch,var(--secondary-accent),black_10%)] text-secondary-accent-foreground shadow-[0_2px_14px_-2px_var(--secondary-accent)] hover:scale-[1.015] hover:shadow-[0_4px_24px_-2px_var(--secondary-accent)]",
        // Esta línea sirve para definir la propiedad «outline» (valor en la línea siguiente).
        outline:
          // Esta línea sirve para incluir el texto o las clases «border-border bg-background hover:scale-[1.01…».
          "border-border bg-background hover:scale-[1.01] hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        // Esta línea sirve para definir la propiedad «secondary» (valor en la línea siguiente).
        secondary:
          // Esta línea sirve para incluir el texto o las clases «bg-secondary text-secondary-foreground hover:…».
          "bg-secondary text-secondary-foreground hover:scale-[1.01] hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        // Esta línea sirve para definir la propiedad «ghost» (valor en la línea siguiente).
        ghost:
          // Esta línea sirve para incluir el texto o las clases «hover:bg-muted hover:text-foreground aria-exp…».
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        // Esta línea sirve para definir la propiedad «destructive» (valor en la línea siguiente).
        destructive:
          // Esta línea sirve para incluir el texto o las clases «bg-destructive/10 text-destructive hover:bg-d…».
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        // Esta línea sirve para definir la propiedad «link» con «text-primary underline-offset-4 hover:un…».
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Esta línea sirve para declarar la propiedad «size» con el valor o tipo «{».
      size: {
        // Esta línea sirve para definir la propiedad «default» (valor en la línea siguiente).
        default:
          // Esta línea sirve para incluir el texto o las clases «h-9 gap-1.5 px-3 has-data-[icon=inline-end]:p…».
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        // Esta línea sirve para definir la propiedad «xs» con «h-6 gap-1 rounded-[min(var(--radius-md),…».
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        // Esta línea sirve para definir la propiedad «sm» con «h-7 gap-1 rounded-[min(var(--radius-md),…».
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        // Esta línea sirve para definir la propiedad «lg» con «h-10 gap-1.5 px-4 has-data-[icon=inline-…».
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        // Esta línea sirve para declarar la propiedad «icon» con el valor o tipo «"size-8"».
        icon: "size-8",
        // Esta línea sirve para definir la propiedad «icon-xs» (valor en la línea siguiente).
        "icon-xs":
          // Esta línea sirve para incluir el texto o las clases «size-6 rounded-[min(var(--radius-md),10px)] i…».
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        // Esta línea sirve para definir la propiedad «icon-sm» (valor en la línea siguiente).
        "icon-sm":
          // Esta línea sirve para incluir el texto o las clases «size-7 rounded-[min(var(--radius-md),12px)] i…».
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        // Esta línea sirve para definir la propiedad «icon-lg» con «size-9",…».
        "icon-lg": "size-9",
      },
    },
    // Esta línea sirve para declarar la propiedad «defaultVariants» con el valor o tipo «{».
    defaultVariants: {
      // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «"default"».
      variant: "default",
      // Esta línea sirve para declarar la propiedad «size» con el valor o tipo «"default"».
      size: "default",
    },
  }
)

// Esta línea sirve para declarar el componente de botón.
function Button({
  // Esta línea sirve para incluir el valor «className» en la lista.
  className,
  // Esta línea sirve para incluir el valor «variant» en la lista.
  variant = "default",
  // Esta línea sirve para incluir el valor «size» en la lista.
  size = "default",
  // Esta línea sirve para incluir el valor «asChild» en la lista.
  asChild = false,
  // Esta línea sirve para copiar las propiedades de «props».
  ...props
// Esta línea sirve para cerrar los parámetros y abrir sus tipos.
}: React.ComponentProps<"button"> &
  // Esta línea sirve para combinar las propiedades de las variantes.
  VariantProps<typeof buttonVariants> & {
    // Esta línea sirve para declarar la propiedad «asChild» con el valor o tipo «boolean».
    asChild?: boolean
  // Esta línea sirve para cerrar los tipos y abrir el cuerpo.
  }) {
  // Esta línea sirve para elegir el componente raíz según asChild.
  const Comp = asChild ? Slot.Root : "button"

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Comp» con sus atributos en varias líneas.
    <Comp
      // Esta línea sirve para definir el atributo «data-slot» con el valor «button».
      data-slot="button"
      // Esta línea sirve para pasar la propiedad «data-variant» con el valor «variant}».
      data-variant={variant}
      // Esta línea sirve para pasar la propiedad «data-size» con el valor «size}».
      data-size={size}
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(buttonVariants({ variant, size, className ».
      className={cn(buttonVariants({ variant, size, className }))}
      // Esta línea sirve para mostrar el valor «...props».
      {...props}
    />
  )
}

// Esta línea sirve para exportar el botón y sus variantes.
export { Button, buttonVariants }
