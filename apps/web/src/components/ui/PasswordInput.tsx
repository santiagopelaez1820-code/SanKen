// Esta línea sirve para importar «forwardRef, useState, type ComponentProps» desde «react».
import { forwardRef, useState, type ComponentProps } from "react"
// Esta línea sirve para importar «Eye, EyeOff» desde «lucide-react».
import { Eye, EyeOff } from "lucide-react"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar el tipo «PasswordInputProps» como «Omit<ComponentProps<"input">, "type">».
type PasswordInputProps = Omit<ComponentProps<"input">, "type">

/** Input Tailwind con el ojito para mostrar/ocultar la contraseña, como la mayoría de apps hoy en día. Espejo de PasswordFormControl.tsx para las páginas que usan Tailwind en vez de react-bootstrap. */
// Esta línea sirve para declarar el input de contraseña con referencia reenviada.
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  // Esta línea sirve para recibir la clase y el resto de propiedades.
  { className, ...props },
  // Esta línea sirve para recibir la referencia.
  ref
// Esta línea sirve para cerrar los parámetros.
) {
  // Esta línea sirve para guardar si la contraseña se ve.
  const [isVisible, setIsVisible] = useState(false)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «relative».
    <div className="relative">
      {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
      <input
        // Esta línea sirve para conectar la referencia «ref}» con el elemento.
        ref={ref}
        // Esta línea sirve para pasar la propiedad «type» con el valor «isVisible ? "text" : "password"}».
        type={isVisible ? "text" : "password"}
        // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
        className={cn(
          // Esta línea sirve para incluir el texto o las clases «w-full rounded-lg border border-input bg-back…».
          "w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          // Esta línea sirve para agregar las clases recibidas por parámetro.
          className
        )}
        // Esta línea sirve para mostrar el valor «...props».
        {...props}
      />
      {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
      <button
        // Esta línea sirve para definir el atributo «type» con el valor «button».
        type="button"
        // Esta línea sirve para asignar el manejador del evento «onClick».
        onClick={() => setIsVisible((v) => !v)}
        // Esta línea sirve para pasar la propiedad «aria-label» con el valor «isVisible ? "Ocultar contraseña" : "Mostrar c».
        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
        // Esta línea sirve para aplicar las clases de estilo «absolute inset-y-0 right-0 flex w-10 items-ce».
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
      >
        {/* Esta línea sirve para mostrar el ícono de ojo tachado o abierto según la visibilidad. */}
        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
})
