import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { ApiError, type AuthPayload } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"

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
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-foreground">
      <img src="/logo-full.png" alt="SANKEN" className="h-auto w-64" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-6"
      >
        <div className="space-y-1.5">
          <label htmlFor="code" className="text-sm font-medium">
            Código de verificación
          </label>
          <p className="text-xs text-muted-foreground">
            Ingresa el código de tu app autenticadora, o un código de recuperación.
          </p>
          <input
            id="code"
            type="text"
            autoComplete="one-time-code"
            autoFocus
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register("code")}
          />
          {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Verificando…" : "Verificar"}
        </Button>
      </form>
    </main>
  )
}
