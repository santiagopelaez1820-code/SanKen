// Esta línea sirve para importar todo el módulo como «React» desde «react».
import * as React from "react"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar la interfaz «CardProps».
interface CardProps extends React.ComponentProps<"div"> {
  // Esta línea sirve para declarar la propiedad «variant» con el valor o tipo «"default" | "outline" | "flat" | "elevated"».
  variant?: "default" | "outline" | "flat" | "elevated"
}

// Esta línea sirve para declarar el componente de tarjeta.
function Card({ className, variant = "default", ...props }: CardProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
    <div
      // Esta línea sirve para definir el atributo «data-slot» con el valor «card».
      data-slot="card"
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
      className={cn(
        // Esta línea sirve para incluir el texto o las clases «rounded-2xl p-5 transition-[transform,box-sha…».
        "rounded-2xl p-5 transition-[transform,box-shadow,border-color] duration-200",
        // Esta línea sirve para aplicar el estilo por defecto.
        variant === "default" && "border border-border bg-card hover:-translate-y-0.5",
        // Esta línea sirve para revisar si la variante es de contorno.
        variant === "outline" &&
          // Esta línea sirve para incluir el texto o las clases «border border-border bg-transparent hover:-tr…».
          "border border-border bg-transparent hover:-translate-y-0.5 hover:border-border/80 hover:bg-card/40",
        // Esta línea sirve para aplicar el estilo plano.
        variant === "flat" && "bg-card",
        // Esta línea sirve para revisar si la variante es elevada.
        variant === "elevated" &&
          // Esta línea sirve para incluir el texto o las clases «border border-primary/25 bg-card shadow-[0_1p…».
          "border border-primary/25 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.3),0_10px_32px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,184,217,0.08)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_14px_40px_-8px_rgba(0,0,0,0.65),0_0_28px_-6px_var(--primary)]",
        // Esta línea sirve para agregar las clases recibidas por parámetro.
        className
      )}
      // Esta línea sirve para mostrar el valor «...props».
      {...props}
    />
  )
}

// Esta línea sirve para exportar la tarjeta.
export { Card }
