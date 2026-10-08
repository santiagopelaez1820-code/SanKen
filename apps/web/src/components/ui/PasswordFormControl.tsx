// Esta línea sirve para importar «forwardRef, useState, type ComponentProps» desde «react».
import { forwardRef, useState, type ComponentProps } from "react"
// Esta línea sirve para importar «Form» desde «react-bootstrap».
import { Form } from "react-bootstrap"
// Esta línea sirve para importar «Eye, EyeOff» desde «lucide-react».
import { Eye, EyeOff } from "lucide-react"

// Esta línea sirve para declarar el tipo «PasswordFormControlProps» como «Omit<ComponentProps<typeof Form.Control>, "type">».
type PasswordFormControlProps = Omit<ComponentProps<typeof Form.Control>, "type">

/** Form.Control de react-bootstrap con el ojito para mostrar/ocultar la contraseña, como la mayoría de apps hoy en día. Usado en las páginas de auth (login, registro, reset). */
// Esta línea sirve para declarar el campo de contraseña con referencia reenviada.
export const PasswordFormControl = forwardRef<HTMLInputElement, PasswordFormControlProps>(
  // Esta línea sirve para declarar la función del componente.
  function PasswordFormControl(props, ref) {
    // Esta línea sirve para guardar si la contraseña se ve.
    const [isVisible, setIsVisible] = useState(false)

    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «div» con las clases «position-relative».
      <div className="position-relative">
        {/* Esta línea sirve para abrir el componente «Form.Control». */}
        <Form.Control ref={ref} type={isVisible ? "text" : "password"} style={{ paddingRight: "2.75rem" }} {...props} />
        {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
        <button
          // Esta línea sirve para definir el atributo «type» con el valor «button».
          type="button"
          // Esta línea sirve para asignar el manejador del evento «onClick».
          onClick={() => setIsVisible((v) => !v)}
          // Esta línea sirve para pasar la propiedad «aria-label» con el valor «isVisible ? "Ocultar contraseña" : "Mostrar c».
          aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
          // Esta línea sirve para aplicar las clases de estilo «position-absolute d-flex align-items-center j».
          className="position-absolute d-flex align-items-center justify-content-center border-0 bg-transparent p-0"
          // Esta línea sirve para pasar la propiedad «style» con el valor «{ top: 0, right: 0, bottom: 0, width: "2.75re».
          style={{ top: 0, right: 0, bottom: 0, width: "2.75rem", color: "var(--bs-secondary-color)" }}
        >
          {/* Esta línea sirve para mostrar el ícono de ojo tachado o abierto según la visibilidad. */}
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    )
  }
)
