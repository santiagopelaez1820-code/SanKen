import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, Alert } from "react-bootstrap"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { ApiError } from "@sanken/core"
import { api } from "@/lib/api"
import { SankButton } from "@/components/ui/SankButton"
import { AuthLayout } from "@/components/layout/AuthLayout"

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Debe tener al menos 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token || !email) return
    setServerError(null)
    try {
      await api.bootstrapCsrf()
      await api.post("/auth/reset-password", { ...values, token, email })
      setDone(true)
    } catch (err) {
      const fieldError = err instanceof ApiError ? err.body.errors?.email?.[0] : undefined
      setServerError(fieldError ?? (err instanceof ApiError ? err.body.message : "No se pudo actualizar la contraseña."))
    }
  }

  if (!token || !email) {
    return (
      <AuthLayout>
        <div className="d-flex flex-column gap-3 text-center">
          <h1 className="h5 mb-0">Enlace inválido</h1>
          <p className="small text-body-secondary mb-0">
            Este enlace de recuperación no es válido o está incompleto. Pide uno nuevo.
          </p>
          <Link to="/forgot-password" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
            Solicitar enlace de recuperación
          </Link>
        </div>
      </AuthLayout>
    )
  }

  if (done) {
    return (
      <AuthLayout>
        <div className="d-flex flex-column gap-3 text-center">
          <h1 className="h5 mb-0">Contraseña actualizada</h1>
          <p className="small text-body-secondary mb-0">Ya puedes iniciar sesión con tu contraseña nueva.</p>
          <SankButton className="w-100 justify-content-center" onClick={() => navigate("/login", { replace: true })}>
            Ir a iniciar sesión
          </SankButton>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3" noValidate>
        <div className="text-center">
          <h1 className="h5 mb-1">Elige una contraseña nueva</h1>
          <p className="small text-body-secondary mb-0">Para {email}</p>
        </div>

        <Form.Group controlId="password">
          <Form.Label className="small fw-medium">Contraseña nueva</Form.Label>
          <Form.Control
            type="password"
            autoComplete="new-password"
            autoFocus
            isInvalid={!!errors.password}
            {...register("password")}
          />
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password_confirmation">
          <Form.Label className="small fw-medium">Confirma la contraseña</Form.Label>
          <Form.Control
            type="password"
            autoComplete="new-password"
            isInvalid={!!errors.password_confirmation}
            {...register("password_confirmation")}
          />
          <Form.Control.Feedback type="invalid">{errors.password_confirmation?.message}</Form.Control.Feedback>
        </Form.Group>

        {serverError && (
          <Alert variant="danger" className="py-2 small mb-0">
            {serverError}
          </Alert>
        )}

        <SankButton type="submit" disabled={isSubmitting} loading={isSubmitting} className="w-100 justify-content-center">
          {isSubmitting ? "Guardando…" : "Guardar contraseña nueva"}
        </SankButton>
      </Form>
    </AuthLayout>
  )
}
