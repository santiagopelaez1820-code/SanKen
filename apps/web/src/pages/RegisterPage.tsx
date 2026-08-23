import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { ApiError, type AuthPayload } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { SankButton } from "@/components/ui/SankButton"
import { AuthLayout } from "@/components/layout/AuthLayout"

const registerSchema = z
  .object({
    name: z.string().min(1, "Ingresa tu nombre"),
    email: z.string().email("Ingresa un correo válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    try {
      await api.bootstrapCsrf()
      const response = await api.post<AuthPayload>("/auth/register", values)
      setSession(response.token, response.user)
      navigate(response.user.role === "trainer" ? "/trainer" : "/dashboard", { replace: true })
    } catch (err) {
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo crear la cuenta.")
    }
  }

  return (
    <AuthLayout>
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3" noValidate>
        <Form.Group controlId="name">
          <Form.Label className="small fw-medium">Nombre</Form.Label>
          <Form.Control type="text" autoComplete="name" isInvalid={!!errors.name} {...register("name")} />
          <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label className="small fw-medium">Correo</Form.Label>
          <Form.Control type="email" autoComplete="email" isInvalid={!!errors.email} {...register("email")} />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label className="small fw-medium">Contraseña</Form.Label>
          <Form.Control
            type="password"
            autoComplete="new-password"
            isInvalid={!!errors.password}
            {...register("password")}
          />
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password_confirmation">
          <Form.Label className="small fw-medium">Confirmar contraseña</Form.Label>
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
          {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
        </SankButton>

        <p className="text-center small text-body-secondary mb-0">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="fw-medium" style={{ color: "var(--sanken-gold-light)" }}>
            Iniciá sesión
          </Link>
        </p>
      </Form>
    </AuthLayout>
  )
}
