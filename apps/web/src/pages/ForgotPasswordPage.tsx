// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useForm» desde «react-hook-form».
import { useForm } from "react-hook-form"
// Esta línea sirve para importar «zodResolver» desde «@hookform/resolvers/zod».
import { zodResolver } from "@hookform/resolvers/zod"
// Esta línea sirve para importar «z» desde «zod».
import { z } from "zod"
// Esta línea sirve para importar «Form, Alert» desde «react-bootstrap».
import { Form, Alert } from "react-bootstrap"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «ApiError» desde «@sanken/core».
import { ApiError } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «AuthLayout» desde «@/components/layout/AuthLayout».
import { AuthLayout } from "@/components/layout/AuthLayout"

// Esta línea sirve para declarar «forgotPasswordSchema» con el valor «z.object({».
const forgotPasswordSchema = z.object({
  // Esta línea sirve para declarar la propiedad «email» con el valor o tipo «z.string().email("Ingresa un correo válido")».
  email: z.string().email("Ingresa un correo válido"),
})

// Esta línea sirve para declarar el tipo «ForgotPasswordFormValues» como «z.infer<typeof forgotPasswordSchema>».
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

// Esta línea sirve para declarar la función «ForgotPasswordPage».
export function ForgotPasswordPage() {
  // Esta línea sirve para crear el estado «serverError» y su función «setServerError».
  const [serverError, setServerError] = useState<string | null>(null)
  // Esta línea sirve para crear el estado «sent» y su función «setSent».
  const [sent, setSent] = useState(false)

  // Esta línea sirve para abrir la desestructuración de las herramientas del formulario.
  const {
    // Esta línea sirve para incluir el valor «register» en la lista.
    register,
    // Esta línea sirve para incluir el valor «handleSubmit» en la lista.
    handleSubmit,
    // Esta línea sirve para declarar la propiedad «formState» con el valor o tipo «{ errors, isSubmitting }».
    formState: { errors, isSubmitting },
  // Esta línea sirve para cerrar la desestructuración y crear el formulario validado.
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  // Esta línea sirve para extraer «nSubmi» de «async (values: ForgotPasswordFormValues)».
  const onSubmit = async (values: ForgotPasswordFormValues) => {
    // Esta línea sirve para llamar a «setServerError» con «null».
    setServerError(null)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.bootstrapCsrf».
      await api.bootstrapCsrf()
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post("/auth/forgot-password", values)
      // El backend siempre responde igual exista o no la cuenta (para no filtrar
      // qué correos están registrados) — acá se refleja ese mismo criterio.
      // Esta línea sirve para llamar a «setSent» con «true».
      setSent(true)
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para mostrar el mensaje de error de la API o uno genérico.
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo enviar el correo.")
    }
  }

  // Esta línea sirve para revisar si «sent».
  if (sent) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «AuthLayout».
      <AuthLayout>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column gap-3 text-center». */}
        <div className="d-flex flex-column gap-3 text-center">
          {/* Esta línea sirve para mostrar el texto «Revisa tu correo» dentro de un «h1». */}
          <h1 className="h5 mb-0">Revisa tu correo</h1>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0». */}
          <p className="small text-body-secondary mb-0">
            {/* Esta línea sirve para mostrar la confirmación de que se envió el enlace. */}
            Si ese correo tiene una cuenta en SanKen, te acabamos de enviar un enlace para elegir una contraseña
            nueva. El enlace vence en 60 minutos.
          </p>
          {/* Esta línea sirve para abrir el componente «Link». */}
          <Link to="/login" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
            {/* Esta línea sirve para mostrar el texto «Volver a iniciar sesión». */}
            Volver a iniciar sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «AuthLayout».
    <AuthLayout>
      {/* Esta línea sirve para abrir el componente «Form». */}
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3" noValidate>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «text-center». */}
        <div className="text-center">
          {/* Esta línea sirve para mostrar el texto «¿Olvidaste tu contraseña?» dentro de un «h1». */}
          <h1 className="h5 mb-1">¿Olvidaste tu contraseña?</h1>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0». */}
          <p className="small text-body-secondary mb-0">
            {/* Esta línea sirve para mostrar la instrucción para pedir el enlace de recuperación. */}
            Ingresa el correo con el que te registraste y te enviamos un enlace para elegir una contraseña nueva.
          </p>
        </div>

        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group controlId="email">
          {/* Esta línea sirve para mostrar el texto «Correo» dentro de «Form.Label». */}
          <Form.Label className="small fw-medium">Correo</Form.Label>
          {/* Esta línea sirve para abrir el campo del correo. */}
          <Form.Control
            // Esta línea sirve para definir el atributo «type» con el valor «email».
            type="email"
            // Esta línea sirve para definir el atributo «autoComplete» con el valor «email».
            autoComplete="email"
            // Esta línea sirve para activar la opción «autoFocus».
            autoFocus
            // Esta línea sirve para pasar la propiedad «isInvalid» con el valor «!!errors.email}».
            isInvalid={!!errors.email}
            // Esta línea sirve para conectar el campo del correo con el formulario.
            {...register("email")}
          />
          {/* Esta línea sirve para mostrar el valor «errors.email?.message» dentro de «Form.Control.Feedback». */}
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* Esta línea sirve para mostrar el bloque solo si «serverError». */}
        {serverError && (
          // Esta línea sirve para abrir el componente «Alert».
          <Alert variant="danger" className="py-2 small mb-0">
            {/* Esta línea sirve para mostrar el valor «serverError». */}
            {serverError}
          </Alert>
        )}

        {/* Esta línea sirve para abrir el componente «SankButton». */}
        <SankButton type="submit" disabled={isSubmitting} loading={isSubmitting} className="w-100 justify-content-center">
          {/* Esta línea sirve para mostrar el texto según el estado de envío. */}
          {isSubmitting ? "Enviando…" : "Enviar enlace de recuperación"}
        </SankButton>

        {/* Esta línea sirve para abrir el elemento «p» con las clases «text-center small text-body-secondary mb». */}
        <p className="text-center small text-body-secondary mb-0">
          {/* Esta línea sirve para abrir el componente «Link». */}
          <Link to="/login" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
            {/* Esta línea sirve para mostrar el texto «Volver a iniciar sesión». */}
            Volver a iniciar sesión
          </Link>
        </p>
      </Form>
    </AuthLayout>
  )
}
