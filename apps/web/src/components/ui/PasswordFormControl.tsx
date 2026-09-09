import { forwardRef, useState, type ComponentProps } from "react"
import { Form } from "react-bootstrap"
import { Eye, EyeOff } from "lucide-react"

type PasswordFormControlProps = Omit<ComponentProps<typeof Form.Control>, "type">

/** Form.Control de react-bootstrap con el ojito para mostrar/ocultar la contraseña, como la mayoría de apps hoy en día. Usado en las páginas de auth (login, registro, reset). */
export const PasswordFormControl = forwardRef<HTMLInputElement, PasswordFormControlProps>(
  function PasswordFormControl(props, ref) {
    const [isVisible, setIsVisible] = useState(false)

    return (
      <div className="position-relative">
        <Form.Control ref={ref} type={isVisible ? "text" : "password"} style={{ paddingRight: "2.75rem" }} {...props} />
        <button
          type="button"
          onClick={() => setIsVisible((v) => !v)}
          aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="position-absolute d-flex align-items-center justify-content-center border-0 bg-transparent p-0"
          style={{ top: 0, right: 0, bottom: 0, width: "2.75rem", color: "var(--bs-secondary-color)" }}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    )
  }
)
