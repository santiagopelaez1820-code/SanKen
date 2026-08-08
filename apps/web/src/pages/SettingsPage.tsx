import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ApiError, type TwoFactorEnableResponse, type TwoFactorConfirmResponse, type User } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

const confirmSchema = z.object({
  code: z.string().length(6, "Ingresa el código de 6 dígitos"),
})
type ConfirmFormValues = z.infer<typeof confirmSchema>

const disableSchema = z.object({
  password: z.string().min(1, "Ingresa tu contraseña"),
})
type DisableFormValues = z.infer<typeof disableSchema>

export function SettingsPage() {
  const queryClient = useQueryClient()
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api.get<User>("/auth/me"),
  })

  const [enrollment, setEnrollment] = useState<TwoFactorEnableResponse | null>(null)
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null)

  const enableMutation = useMutation({
    mutationFn: () => api.post<TwoFactorEnableResponse>("/auth/2fa/enable"),
    onSuccess: (data) => setEnrollment(data),
  })

  const confirmForm = useForm<ConfirmFormValues>({ resolver: zodResolver(confirmSchema) })
  const confirmMutation = useMutation({
    mutationFn: (values: ConfirmFormValues) =>
      api.post<TwoFactorConfirmResponse>("/auth/2fa/confirm", values),
    onSuccess: (data) => {
      setEnrollment(null)
      setRecoveryCodes(data.recovery_codes)
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })

  const disableForm = useForm<DisableFormValues>({ resolver: zodResolver(disableSchema) })
  const disableMutation = useMutation({
    mutationFn: (values: DisableFormValues) => api.post("/auth/2fa/disable", values),
    onSuccess: () => {
      disableForm.reset()
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Configuración</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Volver</Link>
          </Button>
        </header>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium text-foreground">Autenticación de dos factores</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Agrega una capa extra de seguridad pidiendo un código de tu app autenticadora al iniciar sesión.
          </p>

          {isLoading && <p className="mt-4 text-sm text-muted-foreground">Cargando…</p>}

          {!isLoading && recoveryCodes && (
            <div className="mt-4 space-y-3 rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-medium text-foreground">2FA activado. Guarda estos códigos de recuperación:</p>
              <p className="text-xs text-muted-foreground">
                Cada uno sirve una sola vez si perdés el acceso a tu app autenticadora. No se van a volver a mostrar.
              </p>
              <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
                {recoveryCodes.map((code) => (
                  <li key={code} className="rounded bg-muted px-2 py-1 text-center">
                    {code}
                  </li>
                ))}
              </ul>
              <Button size="sm" onClick={() => setRecoveryCodes(null)}>
                Ya los guardé
              </Button>
            </div>
          )}

          {!isLoading && !recoveryCodes && user && !user.two_factor_enabled && !enrollment && (
            <Button className="mt-4" size="sm" onClick={() => enableMutation.mutate()} disabled={enableMutation.isPending}>
              Activar 2FA
            </Button>
          )}

          {!isLoading && enrollment && (
            <div className="mt-4 space-y-4">
              <div
                className="mx-auto w-40 [&_svg]:mx-auto [&_svg]:h-40 [&_svg]:w-40"
                dangerouslySetInnerHTML={{ __html: enrollment.qr_svg }}
              />
              <p className="text-center text-xs text-muted-foreground">
                Escaneá el QR con tu app autenticadora, o ingresá esta clave manualmente:
              </p>
              <p className="break-all rounded bg-muted px-2 py-1 text-center font-mono text-xs">
                {enrollment.secret}
              </p>

              <form
                onSubmit={confirmForm.handleSubmit((values) => confirmMutation.mutate(values))}
                className="space-y-2"
              >
                <label htmlFor="code" className="text-xs font-medium text-muted-foreground">
                  Código de 6 dígitos
                </label>
                <input
                  id="code"
                  type="text"
                  autoComplete="one-time-code"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  {...confirmForm.register("code")}
                />
                {confirmForm.formState.errors.code && (
                  <p className="text-xs text-destructive">{confirmForm.formState.errors.code.message}</p>
                )}
                {confirmMutation.isError && (
                  <p className="text-xs text-destructive">
                    {confirmMutation.error instanceof ApiError
                      ? confirmMutation.error.body.message
                      : "No se pudo confirmar el código."}
                  </p>
                )}
                <Button type="submit" size="sm" disabled={confirmForm.formState.isSubmitting} className="w-full">
                  Confirmar
                </Button>
              </form>
            </div>
          )}

          {!isLoading && !recoveryCodes && user?.two_factor_enabled && (
            <form
              onSubmit={disableForm.handleSubmit((values) => disableMutation.mutate(values))}
              className="mt-4 space-y-2"
            >
              <p className="text-sm text-foreground">2FA está activado en tu cuenta.</p>
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                Contraseña para desactivar
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...disableForm.register("password")}
              />
              {disableForm.formState.errors.password && (
                <p className="text-xs text-destructive">{disableForm.formState.errors.password.message}</p>
              )}
              {disableMutation.isError && (
                <p className="text-xs text-destructive">
                  {disableMutation.error instanceof ApiError
                    ? disableMutation.error.body.message
                    : "No se pudo desactivar."}
                </p>
              )}
              <Button type="submit" variant="outline" size="sm" disabled={disableForm.formState.isSubmitting}>
                Desactivar 2FA
              </Button>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
