import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { ApiError, isTwoFactorChallenge, type AuthPayload, type TwoFactorChallengeResponse } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { SankButton } from "@/components/ui/SankButton"
import { GoogleIcon } from "@/components/ui/GoogleIcon"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { describeSocialAuthError, signInWithGoogle, SocialAuthCancelledError } from "@/lib/social-auth"

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const setPendingChallenge = useAuthStore((state) => state.setPendingChallenge)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false)

  const handleGoogleSubmit = async () => {
    setServerError(null)
    setIsSubmittingGoogle(true)
    try {
      const { idToken } = await signInWithGoogle()
      await api.bootstrapCsrf()
      const response = await api.post<AuthPayload | TwoFactorChallengeResponse>("/auth/social", {
        id_token: idToken,
        provider: "google",
      })

      if (isTwoFactorChallenge(response)) {
        setPendingChallenge(response.challenge_token)
        navigate("/login/verify")
        return
      }

      setSession(response.token, response.user)
      navigate(response.user.role === "trainer" ? "/trainer" : "/dashboard", { replace: true })
    } catch (err) {
      if (err instanceof SocialAuthCancelledError) {
        // El usuario cerró el popup a propósito — no es un error para mostrar.
      } else if (err instanceof ApiError) {
        setServerError(err.body.message)
      } else {
        setServerError(describeSocialAuthError(err))
      }
    } finally {
      setIsSubmittingGoogle(false)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      await api.bootstrapCsrf()
      const response = await api.post<AuthPayload | TwoFactorChallengeResponse>("/auth/login", {
        ...values,
        device_name: "sanken-web",
      })

      if (isTwoFactorChallenge(response)) {
        setPendingChallenge(response.challenge_token)
        navigate("/login/verify")
        return
      }

      setSession(response.token, response.user)
      navigate(response.user.role === "trainer" ? "/trainer" : "/dashboard", { replace: true })
    } catch (err) {
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo iniciar sesión.")
    }
  }

  return (
    <AuthLayout>
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3" noValidate>
        <Form.Group controlId="email">
          <Form.Label className="small fw-medium">Correo</Form.Label>
          <Form.Control type="email" autoComplete="email" isInvalid={!!errors.email} {...register("email")} />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label className="small fw-medium">Contraseña</Form.Label>
          <Form.Control
            type="password"
            autoComplete="current-password"
            isInvalid={!!errors.password}
            {...register("password")}
          />
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        {serverError && (
          <Alert variant="danger" className="py-2 small mb-0">
            {serverError}
          </Alert>
        )}

        <SankButton
          type="submit"
          disabled={isSubmitting || isSubmittingGoogle}
          loading={isSubmitting}
          className="w-100 justify-content-center"
        >
          {isSubmitting ? "Ingresando…" : "Ingresar"}
        </SankButton>

        <div className="d-flex align-items-center gap-2">
          <div style={{ height: 1, flex: 1, background: "var(--bs-border-color)" }} />
          <span className="small text-body-secondary">O</span>
          <div style={{ height: 1, flex: 1, background: "var(--bs-border-color)" }} />
        </div>

        <SankButton
          type="button"
          variant="secondary"
          disabled={isSubmitting || isSubmittingGoogle}
          loading={isSubmittingGoogle}
          iconStart={!isSubmittingGoogle ? <GoogleIcon /> : undefined}
          onClick={handleGoogleSubmit}
          className="w-100 justify-content-center"
        >
          {isSubmittingGoogle ? "Continuando con Google…" : "Continuar con Google"}
        </SankButton>

        <p className="text-center small text-body-secondary mb-0">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="fw-medium" style={{ color: "var(--sanken-cyan-light)" }}>
            Registrate
          </Link>
        </p>
      </Form>
    </AuthLayout>
  )
}
