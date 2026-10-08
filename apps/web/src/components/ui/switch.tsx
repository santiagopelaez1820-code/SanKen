// Esta línea sirve para importar todo el módulo como «React» desde «react».
import * as React from "react"
// Esta línea sirve para importar «Switch as SwitchPrimitive» desde «radix-ui».
import { Switch as SwitchPrimitive } from "radix-ui"

// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar el componente de interruptor.
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir la raíz del interruptor.
    <SwitchPrimitive.Root
      // Esta línea sirve para definir el atributo «data-slot» con el valor «switch».
      data-slot="switch"
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
      className={cn(
        // Esta línea sirve para incluir el texto o las clases «peer inline-flex h-5 w-9 shrink-0 items-cente…».
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        // Esta línea sirve para incluir el texto o las clases «data-[state=checked]:bg-primary data-[state=u…».
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted",
        // Esta línea sirve para agregar las clases recibidas por parámetro.
        className
      )}
      // Esta línea sirve para mostrar el valor «...props».
      {...props}
    >
      {/* Esta línea sirve para abrir la perilla del interruptor. */}
      <SwitchPrimitive.Thumb
        // Esta línea sirve para definir el atributo «data-slot» con el valor «switch-thumb».
        data-slot="switch-thumb"
        // Esta línea sirve para aplicar las clases de estilo «pointer-events-none block size-4 rounded-full».
        className="pointer-events-none block size-4 rounded-full bg-background shadow transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5"
      />
    </SwitchPrimitive.Root>
  )
}

// Esta línea sirve para exportar el interruptor.
export { Switch }
