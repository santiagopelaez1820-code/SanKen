// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar el componente de esqueleto de carga.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
    <div
      // Esta línea sirve para definir el atributo «data-slot» con el valor «skeleton».
      data-slot="skeleton"
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn("sank-skeleton", className)}».
      className={cn("sank-skeleton", className)}
      // Esta línea sirve para mostrar el valor «...props».
      {...props}
    />
  )
}

// Esta línea sirve para exportar el esqueleto.
export { Skeleton }
