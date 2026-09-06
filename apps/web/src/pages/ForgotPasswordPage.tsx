import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import { ApiError } from "@sanken/core"
import { api } from "@/lib/api"
import { SankButton } from "@/components/ui/SankButton"
import { AuthLayout } from "@/components/layout/AuthLayout"

const forgotPasswordSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null)
    try {
      await api.bootstrapCsrf()
      await api.post("/auth/forgot-password", values)
      // El backend siempre responde igual exista o no la cuenta (para no filtrar
      // qué correos están registrados) — acá se refleja ese mismo criterio.
      setSent(true)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo enviar el correo.")
    }
  }

  if (sent) {
    return (
      <AuthLayout>
        <div className="d-flex flex-column gap-3 text-center">
          <h1 className="h5 mb-0">Revisa tu correo</h1>
          <p className="small text-body-secondary mb-0">
            Si ese correo tiene una cuenta en SanKen, te acabamos de enviar un enlace para elegir una contraseña
            nueva. El enlace vence en 60 minutos.
          </p>
          <Link to="/login" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
            Volver a iniciar sesión
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3" noValidate>
        <div className="text-center">
          <h1 className="h5 mb-1">¿Olvidaste tu contraseña?</h1>
          <p className="small text-body-secondary mb-0">
            Ingresa el correo con el que te registraste y te enviamos un enlace para elegir una contraseña nueva.
          </p>
        </div>

        <Form.Group controlId="email">
          <Form.Label className="small fw-medium">Correo</Form.Label>
          <Form.Control
            type="email"
            autoComplete="email"
            autoFocus
            isInvalid={!!errors.email}
            {...register("email")}
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        {serverError && (
          <Alert variant="danger" className="py-2 small mb-0">
            {serverError}
          </Alert>
        )}

        <SankButton type="submit" disabled={isSubmitting} loading={isSubmitting} className="w-100 justify-content-center">
          {isSubmitting ? "Enviando…" : "Enviar enlace de recuperación"}
        </SankButton>

        <p className="text-center small text-body-secondary mb-0">
          <Link to="/login" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
            Volver a iniciar sesión
          </Link>
        </p>
      </Form>
    </AuthLayout>
  )
}
