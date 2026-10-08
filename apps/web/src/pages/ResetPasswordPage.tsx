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
// Esta línea sirve para importar «Link, useNavigate, useSearchParams» desde «react-router-dom».
import { Link, useNavigate, useSearchParams } from "react-router-dom"
// Esta línea sirve para importar «ApiError» desde «@sanken/core».
import { ApiError } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «AuthLayout» desde «@/components/layout/AuthLayout».
import { AuthLayout } from "@/components/layout/AuthLayout"
// Esta línea sirve para importar «PasswordFormControl» desde «@/components/ui/PasswordFormControl».
import { PasswordFormControl } from "@/components/ui/PasswordFormControl"

// Esta línea sirve para declarar «resetPasswordSchema» con el valor «z».
const resetPasswordSchema = z
  // Esta línea sirve para abrir el esquema de validación del formulario.
  .object({
    // Esta línea sirve para validar el campo «password» con el esquema de Zod.
    password: z.string().min(8, "Debe tener al menos 8 caracteres"),
    // Esta línea sirve para validar el campo «password_confirmation» con el esquema de Zod.
    password_confirmation: z.string(),
  })
  // Esta línea sirve para validar que la confirmación coincida con la contraseña.
  .refine((values) => values.password === values.password_confirmation, {
    // Esta línea sirve para declarar la propiedad «message» con el valor o tipo «"Las contraseñas no coinciden"».
    message: "Las contraseñas no coinciden",
    // Esta línea sirve para declarar la propiedad «path» con el valor o tipo «["password_confirmation"]».
    path: ["password_confirmation"],
  })

// Esta línea sirve para declarar el tipo «ResetPasswordFormValues» como «z.infer<typeof resetPasswordSchema>».
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

// Esta línea sirve para declarar la función «ResetPasswordPage».
export function ResetPasswordPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para extraer «searchParams» de «useSearchParams()».
  const [searchParams] = useSearchParams()
  // Esta línea sirve para extraer «oke» de «searchParams.get("token")».
  const token = searchParams.get("token")
  // Esta línea sirve para extraer «mai» de «searchParams.get("email")».
  const email = searchParams.get("email")
  // Esta línea sirve para crear el estado «serverError» y su función «setServerError».
  const [serverError, setServerError] = useState<string | null>(null)
  // Esta línea sirve para crear el estado «done» y su función «setDone».
  const [done, setDone] = useState(false)

  // Esta línea sirve para abrir la desestructuración de varios valores.
  const {
    // Esta línea sirve para incluir el valor «register» en la lista.
    register,
    // Esta línea sirve para incluir el valor «handleSubmit» en la lista.
    handleSubmit,
    // Esta línea sirve para declarar la propiedad «formState» con el valor o tipo «{ errors, isSubmitting }».
    formState: { errors, isSubmitting },
  // Esta línea sirve para cerrar la desestructuración y crear el formulario validado.
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) })

  // Esta línea sirve para extraer «nSubmi» de «async (values: ResetPasswordFormValues) ».
  const onSubmit = async (values: ResetPasswordFormValues) => {
    // Esta línea sirve para salir de la función si «!token || !email».
    if (!token || !email) return
    // Esta línea sirve para guardar en el estado con «setServerError» el valor «null)…».
    setServerError(null)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.bootstrapCsrf».
      await api.bootstrapCsrf()
      // Esta línea sirve para esperar el resultado de «api.post».
      await api.post("/auth/reset-password", { ...values, token, email })
      // Esta línea sirve para guardar en el estado con «setDone» el valor «true)…».
      setDone(true)
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para extraer «ieldErro» de «err instanceof ApiError ? err.body.error».
      const fieldError = err instanceof ApiError ? err.body.errors?.email?.[0] : undefined
      // Esta línea sirve para guardar en el estado con «setServerError» el valor «fieldError ?? (err instanceof ApiError ? err.…».
      setServerError(fieldError ?? (err instanceof ApiError ? err.body.message : "No se pudo actualizar la contraseña."))
    }
  }

  // Esta línea sirve para revisar si «!token || !email».
  if (!token || !email) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «AuthLayout».
      <AuthLayout>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column gap-3 text-center». */}
        <div className="d-flex flex-column gap-3 text-center">
          {/* Esta línea sirve para mostrar el texto «Enlace inválido» dentro de un «h1». */}
          <h1 className="h5 mb-0">Enlace inválido</h1>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0». */}
          <p className="small text-body-secondary mb-0">
            {/* Esta línea sirve para avisar que el enlace de recuperación no es válido. */}
            Este enlace de recuperación no es válido o está incompleto. Pide uno nuevo.
          </p>
          {/* Esta línea sirve para abrir el componente «Link». */}
          <Link to="/forgot-password" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
            {/* Esta línea sirve para mostrar el texto «Solicitar enlace de recuperación». */}
            Solicitar enlace de recuperación
          </Link>
        </div>
      </AuthLayout>
    )
  }

  // Esta línea sirve para revisar si «done».
  if (done) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el componente «AuthLayout».
      <AuthLayout>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column gap-3 text-center». */}
        <div className="d-flex flex-column gap-3 text-center">
          {/* Esta línea sirve para mostrar el texto «Contraseña actualizada» dentro de un «h1». */}
          <h1 className="h5 mb-0">Contraseña actualizada</h1>
          {/* Esta línea sirve para mostrar el texto «Ya puedes iniciar sesión con tu contraseña nueva.» dentro de un «p». */}
          <p className="small text-body-secondary mb-0">Ya puedes iniciar sesión con tu contraseña nueva.</p>
          {/* Esta línea sirve para abrir el componente «SankButton» con sus propiedades. */}
          <SankButton className="w-100 justify-content-center" onClick={() => navigate("/login", { replace: true })}>
            {/* Esta línea sirve para mostrar el texto «Ir a iniciar sesión». */}
            Ir a iniciar sesión
          </SankButton>
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
          {/* Esta línea sirve para mostrar el texto «Elige una contraseña nueva» dentro de un «h1». */}
          <h1 className="h5 mb-1">Elige una contraseña nueva</h1>
          {/* Esta línea sirve para abrir el elemento «p» con sus propiedades. */}
          <p className="small text-body-secondary mb-0">Para {email}</p>
        </div>

        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group controlId="password">
          {/* Esta línea sirve para mostrar el texto «Contraseña nueva» dentro de «Form.Label». */}
          <Form.Label className="small fw-medium">Contraseña nueva</Form.Label>
          {/* Esta línea sirve para abrir el elemento «PasswordFormControl» con sus atributos en varias líneas. */}
          <PasswordFormControl
            // Esta línea sirve para definir el atributo «autoComplete» con el valor «new-password».
            autoComplete="new-password"
            // Esta línea sirve para activar la opción «autoFocus».
            autoFocus
            // Esta línea sirve para pasar la propiedad «isInvalid» con el valor «!!errors.password}».
            isInvalid={!!errors.password}
            // Esta línea sirve para conectar el campo «password» con el formulario.
            {...register("password")}
          />
          {/* Esta línea sirve para mostrar el valor «errors.password?.message» dentro de «Form.Control.Feedback». */}
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* Esta línea sirve para abrir el componente «Form.Group». */}
        <Form.Group controlId="password_confirmation">
          {/* Esta línea sirve para mostrar el texto «Confirma la contraseña» dentro de «Form.Label». */}
          <Form.Label className="small fw-medium">Confirma la contraseña</Form.Label>
          {/* Esta línea sirve para abrir el elemento «PasswordFormControl» con sus atributos en varias líneas. */}
          <PasswordFormControl
            // Esta línea sirve para definir el atributo «autoComplete» con el valor «new-password».
            autoComplete="new-password"
            // Esta línea sirve para pasar la propiedad «isInvalid» con el valor «!!errors.password_confirmation}».
            isInvalid={!!errors.password_confirmation}
            // Esta línea sirve para conectar el campo «password_confirmation» con el formulario.
            {...register("password_confirmation")}
          />
          {/* Esta línea sirve para mostrar el valor «errors.password_confirmation?.message» dentro de «Form.Control.Feedback». */}
          <Form.Control.Feedback type="invalid">{errors.password_confirmation?.message}</Form.Control.Feedback>
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
          {/* Esta línea sirve para mostrar el contenido dinámico «{isSubmitting ? "Guardando…" : "Guardar contraseña nueva"}». */}
          {isSubmitting ? "Guardando…" : "Guardar contraseña nueva"}
        </SankButton>
      </Form>
    </AuthLayout>
  )
}
