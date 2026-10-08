// Esta línea sirve para importar todo el módulo como «React» desde «react».
import * as React from "react"
// Esta línea sirve para importar «Button as BsButton, Spinner» desde «react-bootstrap».
import { Button as BsButton, Spinner } from "react-bootstrap"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar las variantes de botón disponibles.
export type SankButtonVariant =
  // Esta línea sirve para permitir la variante principal.
  | "primary"
  // Esta línea sirve para permitir la variante secundaria.
  | "secondary"
  // Esta línea sirve para permitir la variante de contorno.
  | "outline"
  // Esta línea sirve para permitir la variante fantasma.
  | "ghost"
  // Esta línea sirve para permitir la variante destructiva.
  | "destructive"
  // Esta línea sirve para permitir la variante de enlace.
  | "link"

// Esta línea sirve para declarar el tipo «SankButtonSize» como «"sm" | "default" | "lg" | "icon"».
export type SankButtonSize = "sm" | "default" | "lg" | "icon"

// Esta línea sirve para declarar las clases de cada variante.
const VARIANT_MAP: Record<SankButtonVariant, string> = {
  // Esta línea sirve para declarar la propiedad «primary» con el valor o tipo «"primary"».
  primary: "primary",
  // Esta línea sirve para declarar la propiedad «secondary» con el valor o tipo «"secondary"».
  secondary: "secondary",
  // Esta línea sirve para declarar la propiedad «outline» con el valor o tipo «"outline-primary"».
  outline: "outline-primary",
  // Esta línea sirve para declarar la propiedad «ghost» con el valor o tipo «"outline-secondary"».
  ghost: "outline-secondary",
  // Esta línea sirve para declarar la propiedad «destructive» con el valor o tipo «"danger"».
  destructive: "danger",
  // Esta línea sirve para declarar la propiedad «link» con el valor o tipo «"link"».
  link: "link",
}

// Esta línea sirve para declarar las clases de cada tamaño.
const SIZE_CLASS: Record<SankButtonSize, string> = {
  // Esta línea sirve para declarar la propiedad «sm» con el valor o tipo «"px-3 py-1"».
  sm: "px-3 py-1",
  // Esta línea sirve para declarar la propiedad «default» con el valor o tipo «""».
  default: "",
  // Esta línea sirve para declarar la propiedad «lg» con el valor o tipo «"px-4 py-2 fs-6"».
  lg: "px-4 py-2 fs-6",
  // Esta línea sirve para definir la propiedad «icon» con «d-inline-flex align-items-center justify…».
  icon: "d-inline-flex align-items-center justify-content-center p-0",
}

// Esta línea sirve para declarar la interfaz «SankButtonProps».
interface SankButtonProps extends Omit<React.ComponentProps<typeof BsButton>, "variant" | "size"> {
  // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «SankButtonVariant».
  variant?: SankButtonVariant
  // Esta línea sirve para declarar la propiedad «size» con el valor o tipo «SankButtonSize».
  size?: SankButtonSize
  // Esta línea sirve para declarar la propiedad «loading» con el valor o tipo «boolean».
  loading?: boolean
  // Esta línea sirve para declarar la propiedad «iconStart» con el valor o tipo «React.ReactNode».
  iconStart?: React.ReactNode
  // Esta línea sirve para declarar la propiedad «iconEnd» con el valor o tipo «React.ReactNode».
  iconEnd?: React.ReactNode
}

// Esta línea sirve para declarar el componente de botón de SanKen.
export function SankButton({
  // Esta línea sirve para incluir el valor «variant» en la lista.
  variant = "primary",
  // Esta línea sirve para incluir el valor «size» en la lista.
  size = "default",
  // Esta línea sirve para incluir el valor «loading» en la lista.
  loading = false,
  // Esta línea sirve para incluir el valor «iconStart» en la lista.
  iconStart,
  // Esta línea sirve para incluir el valor «iconEnd» en la lista.
  iconEnd,
  // Esta línea sirve para incluir el valor «className» en la lista.
  className,
  // Esta línea sirve para incluir el valor «disabled» en la lista.
  disabled,
  // Esta línea sirve para incluir el valor «children» en la lista.
  children,
  // Esta línea sirve para incluir el valor «style» en la lista.
  style,
  // Esta línea sirve para copiar las propiedades de «props».
  ...props
// Esta línea sirve para cerrar los parámetros del componente.
}: SankButtonProps) {
  // Esta línea sirve para calcular si el botón es solo ícono.
  const isIcon = size === "icon"
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «BsButton» con sus atributos en varias líneas.
    <BsButton
      // Esta línea sirve para pasar la propiedad «variant» con el valor «VARIANT_MAP[variant]}».
      variant={VARIANT_MAP[variant]}
      // Esta línea sirve para pasar la propiedad «size» con el valor «size === "sm" ? "sm" : size === "lg" ? "lg" :».
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : undefined}
      // Esta línea sirve para pasar la propiedad «disabled» con el valor «disabled || loading}».
      disabled={disabled || loading}
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
      className={cn(
        // Esta línea sirve para incluir el texto o las clases «d-inline-flex align-items-center gap-2 fw-sem…».
        "d-inline-flex align-items-center gap-2 fw-semibold",
        // Esta línea sirve para aplicar el estilo fantasma cuando corresponde.
        variant === "ghost" && "border-0 bg-transparent text-body-secondary sank-ghost-btn",
        // Esta línea sirve para agregar las clases del tamaño elegido.
        SIZE_CLASS[size],
        // Esta línea sirve para agregar las clases recibidas por parámetro.
        className
      )}
      // Esta línea sirve para pasar la propiedad «style» con el valor «isIcon ? { width: "2.25rem", height: "2.25rem».
      style={isIcon ? { width: "2.25rem", height: "2.25rem", ...style } : style}
      // Esta línea sirve para mostrar el valor «...props».
      {...props}
    >
      {/* Esta línea sirve para elegir entre dos bloques según «loading». */}
      {loading ? (
        // Esta línea sirve para abrir el componente «Spinner».
        <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para mostrar el ícono inicial.
        iconStart
      )}
      {/* Esta línea sirve para mostrar el contenido si no es botón de ícono. */}
      {!isIcon && children}
      {/* Esta línea sirve para mostrar el contenido si es de ícono y no está cargando. */}
      {isIcon && !loading ? children : null}
      {/* Esta línea sirve para mostrar el ícono final si no está cargando ni es de ícono. */}
      {!loading && !isIcon ? iconEnd : null}
    </BsButton>
  )
}
