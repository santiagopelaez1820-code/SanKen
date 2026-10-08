// Esta línea sirve para importar todo el módulo como «React» desde «react».
import * as React from "react"
// Esta línea sirve para importar «Tabs as TabsPrimitive» desde «radix-ui».
import { Tabs as TabsPrimitive } from "radix-ui"

// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar el contenedor de las pestañas.
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  // Esta línea sirve para devolver la raíz de las pestañas con sus clases.
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-3", className)} {...props} />
}

// Esta línea sirve para declarar la lista de pestañas.
function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir la lista de pestañas.
    <TabsPrimitive.List
      // Esta línea sirve para definir el atributo «data-slot» con el valor «tabs-list».
      data-slot="tabs-list"
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
      className={cn(
        // Esta línea sirve para incluir el texto o las clases «inline-flex h-10 w-fit max-w-full items-cente…».
        "inline-flex h-10 w-fit max-w-full items-center justify-center gap-1 rounded-lg bg-muted p-1 text-muted-foreground overflow-x-auto sm:h-8",
        // Esta línea sirve para agregar las clases recibidas por parámetro.
        className
      )}
      // Esta línea sirve para mostrar el valor «...props».
      {...props}
    />
  )
}

// Esta línea sirve para declarar el botón de cada pestaña.
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el botón de la pestaña.
    <TabsPrimitive.Trigger
      // Esta línea sirve para definir el atributo «data-slot» con el valor «tabs-trigger».
      data-slot="tabs-trigger"
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
      className={cn(
        // Esta línea sirve para incluir el texto o las clases «inline-flex h-8 flex-1 shrink-0 items-center …».
        "inline-flex h-8 flex-1 shrink-0 items-center sm:h-6.5 justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium whitespace-nowrap outline-none transition-[color,box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        // Esta línea sirve para incluir el texto o las clases «data-[state=active]:bg-background data-[state…».
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        // Esta línea sirve para agregar las clases recibidas por parámetro.
        className
      )}
      // Esta línea sirve para mostrar el valor «...props».
      {...props}
    />
  )
}

// Esta línea sirve para declarar el contenido de cada pestaña.
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  // Esta línea sirve para devolver el contenido de la pestaña con sus clases.
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("outline-none", className)} {...props} />
}

// Esta línea sirve para exportar los componentes de pestañas.
export { Tabs, TabsList, TabsTrigger, TabsContent }
