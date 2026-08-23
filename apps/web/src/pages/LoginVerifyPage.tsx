import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { ApiError, type AuthPayload } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { SankButton } from "@/components/ui/SankButton"
import { AuthLayout } from "@/components/layout/AuthLayout"

const verifySchema = z.object({
  code: z.string().min(1, "Ingresa el código"),
})

type VerifyFormValues = z.infer<typeof verifySchema>

export function LoginVerifyPage() {
  const navigate = useNavigate()
  const pendingChallenge = useAuthStore((state) => state.pendingChallenge)
  const setSession = useAuthStore((state) => state.setSession)
  const clearPendingChallenge = useAuthStore((state) => state.clearPendingChallenge)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({ resolver: zodResolver(verifySchema) })

  // Solo verificamos una vez al montar: si el usuario navega/recarga esta
  // página directamente sin haber pasado por /login, no hay challenge
  // pendiente y lo mandamos de vuelta. No debe re-evaluarse reactivamente,
  // porque un envío exitoso también limpia `pendingChallenge` y esto
  // compite con la navegación al dashboard en onSubmit.
  useEffect(() => {
    if (!useAuthStore.getState().pendingChallenge) {
      navigate("/login", { replace: true })
    }
  }, [navigate])

  const onSubmit = async (values: VerifyFormValues) => {
    if (!pendingChallenge) return
    setServerError(null)
    try {
      const { user, token } = await api.post<AuthPayload>("/auth/2fa/challenge", {
        challenge_token: pendingChallenge.challengeToken,
        code: values.code,
        device_name: "sanken-web",
      })
      setSession(token, user)
      clearPendingChallenge()
      navigate(user.role === "trainer" ? "/trainer" : "/dashboard", { replace: true })
    } catch (err) {
      setServerError(err instanceof ApiError ? err.body.message : "No se pudo verificar el código.")
    }
  }

  if (!pendingChallenge) return null

  return (
    <AuthLayout>
      <Form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3" noValidate>
        <Form.Group controlId="code">
          <Form.Label className="small fw-medium">Código de verificación</Form.Label>
          <Form.Text className="d-block mb-2 text-body-secondary">
            Ingresa el código de tu app autenticadora, o un código de recuperación.
          </Form.Text>
          <Form.Control
            type="text"
            autoComplete="one-time-code"
            autoFocus
            isInvalid={!!errors.code}
            {...register("code")}
          />
          <Form.Control.Feedback type="invalid">{errors.code?.message}</Form.Control.Feedback>
        </Form.Group>

        {serverError && (
          <Alert variant="danger" className="py-2 small mb-0">
            {serverError}
          </Alert>
        )}

        <SankButton type="submit" disabled={isSubmitting} loading={isSubmitting} className="w-100 justify-content-center">
          {isSubmitting ? "Verificando…" : "Verificar"}
        </SankButton>
      </Form>
    </AuthLayout>
  )
}
