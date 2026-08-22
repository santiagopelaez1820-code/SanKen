import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Bell, Eye, MapPin, ShieldCheck, UserCircle } from "lucide-react"
import {
  ApiError,
  type OnboardingCity,
  type OnboardingQuestions,
  type OnboardingState,
  type OnboardingStateOption,
  type TwoFactorEnableResponse,
  type TwoFactorConfirmResponse,
  type User,
} from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { getExistingWebPushSubscription, isWebPushSupported, subscribeToWebPush, unsubscribeFromWebPush } from "@/lib/web-push"

const ROLE_LABEL: Record<User["role"], string> = {
  user: "Atleta",
  trainer: "Entrenador",
  super_admin: "Super Admin",
}

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

  const privacyMutation = useMutation({
    mutationFn: (isPublic: boolean) => api.post(isPublic ? "/rankings/opt-in" : "/rankings/opt-out"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  })

  const { data: onboardingState } = useQuery({
    queryKey: ["onboarding", "state"],
    queryFn: () => api.get<OnboardingState>("/onboarding"),
  })

  const { data: questions } = useQuery({
    queryKey: ["onboarding", "questions"],
    queryFn: () => api.get<OnboardingQuestions>("/onboarding/questions"),
  })

  const [locationEditing, setLocationEditing] = useState(false)
  const [countryId, setCountryId] = useState<number | null>(null)
  const [stateId, setStateId] = useState<number | null>(null)
  const [cityId, setCityId] = useState<number | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Se sincroniza con lo que ya está guardado apenas carga — sirve tanto
  // para mostrar el nombre de país/depto/ciudad actuales como para
  // pre-seleccionar el formulario cuando el usuario entra a editar.
  useEffect(() => {
    if (!onboardingState || locationEditing) return
    setCountryId(onboardingState.country_id)
    setStateId(onboardingState.state_id)
    setCityId(onboardingState.city_id)
  }, [onboardingState, locationEditing])

  const { data: locationStates, isLoading: isLoadingLocationStates } = useQuery({
    queryKey: ["onboarding", "states", countryId],
    queryFn: () => api.get<OnboardingStateOption[]>(`/onboarding/countries/${countryId}/states`),
    enabled: countryId !== null,
  })

  const { data: locationCities, isLoading: isLoadingLocationCities } = useQuery({
    queryKey: ["onboarding", "cities", stateId],
    queryFn: () => api.get<OnboardingCity[]>(`/onboarding/states/${stateId}/cities`),
    enabled: stateId !== null,
  })

  const currentCountryName = questions?.countries.find((c) => c.id === onboardingState?.country_id)?.name
  const currentStateName = locationStates?.find((s) => s.id === onboardingState?.state_id)?.name
  const currentCityName = locationCities?.find((c) => c.id === onboardingState?.city_id)?.name

  const locationMutation = useMutation({
    mutationFn: () => api.patch("/onboarding", { city_id: cityId }),
    onSuccess: () => {
      setLocationEditing(false)
      queryClient.invalidateQueries({ queryKey: ["onboarding", "state"] })
    },
    onError: (err) =>
      setLocationError(err instanceof ApiError ? err.body.message : "No se pudo guardar tu ubicación."),
  })

  const [pushEnabled, setPushEnabled] = useState(false)
  const [pushError, setPushError] = useState<string | null>(null)
  useEffect(() => {
    getExistingWebPushSubscription().then((sub) => setPushEnabled(sub !== null))
  }, [])

  const pushMutation = useMutation({
    mutationFn: async (enable: boolean) => {
      if (enable) {
        await subscribeToWebPush(import.meta.env.VITE_VAPID_PUBLIC_KEY ?? "")
      } else {
        await unsubscribeFromWebPush()
      }
      return enable
    },
    onSuccess: (enabled) => {
      setPushEnabled(enabled)
      setPushError(null)
    },
    onError: (err) => setPushError(err instanceof Error ? err.message : "No se pudo cambiar la preferencia."),
  })

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Configuración</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Tu cuenta</h1>
        </div>

        <Card className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <UserCircle className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-heading text-base font-bold text-foreground">{user?.name ?? "…"}</p>
            <p className="text-xs text-muted-foreground">{user ? ROLE_LABEL[user.role] : ""}</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h2 className="font-heading text-sm font-medium text-foreground">Ubicación</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Se usa para tus rankings por país, departamento y ciudad.</p>

          {!locationEditing && (
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-foreground">
                {onboardingState?.city_id ? (
                  <>
                    {currentCityName ?? "…"}, {currentStateName ?? "…"}, {currentCountryName ?? "…"}
                  </>
                ) : (
                  <span className="text-muted-foreground">Sin configurar</span>
                )}
              </p>
              <Button variant="outline" size="sm" onClick={() => setLocationEditing(true)}>
                Editar ubicación
              </Button>
            </div>
          )}

          {locationEditing && (
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">País</label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={countryId ?? ""}
                  onChange={(e) => {
                    const id = e.target.value ? Number(e.target.value) : null
                    setCountryId(id)
                    setStateId(null)
                    setCityId(null)
                  }}
                >
                  <option value="" disabled>
                    Selecciona un país
                  </option>
                  {questions?.countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Departamento</label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                  value={stateId ?? ""}
                  disabled={!countryId || isLoadingLocationStates}
                  onChange={(e) => {
                    const id = e.target.value ? Number(e.target.value) : null
                    setStateId(id)
                    setCityId(null)
                  }}
                >
                  <option value="" disabled>
                    Selecciona un departamento
                  </option>
                  {locationStates?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Ciudad / Municipio</label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                  value={cityId ?? ""}
                  disabled={!stateId || isLoadingLocationCities}
                  onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="" disabled>
                    Selecciona una ciudad
                  </option>
                  {locationCities?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {locationError && <p className="text-xs text-destructive">{locationError}</p>}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  disabled={!cityId || locationMutation.isPending}
                  onClick={() => locationMutation.mutate()}
                >
                  Guardar
                </Button>
                <Button variant="outline" size="sm" onClick={() => setLocationEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <h2 className="font-heading text-sm font-medium text-foreground">Autenticación de dos factores</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Agrega una capa extra de seguridad pidiendo un código de tu app autenticadora al iniciar sesión.
          </p>

          {isLoading && <Skeleton className="mt-4 h-9 w-32" />}

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
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="size-4 text-primary" />
                <h2 className="font-heading text-sm font-medium text-foreground">Rankings públicos</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Si activás esto, tu volumen total aparece en los rankings de ciudad, país, gimnasio, edad, sexo y
                categoría de fuerza.
              </p>
            </div>
            <Switch
              checked={user?.is_public_profile ?? false}
              disabled={isLoading || privacyMutation.isPending}
              onCheckedChange={(checked) => privacyMutation.mutate(checked)}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-primary" />
                <h2 className="font-heading text-sm font-medium text-foreground">Notificaciones push</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Recibí un aviso en el navegador cuando te llegue un mensaje, aunque no tengas SanKen abierto.
              </p>
              {pushError && <p className="mt-1 text-xs text-destructive">{pushError}</p>}
            </div>
            {isWebPushSupported() ? (
              <Switch
                checked={pushEnabled}
                disabled={pushMutation.isPending}
                onCheckedChange={(checked) => pushMutation.mutate(checked)}
              />
            ) : (
              <p className="text-xs text-muted-foreground">No soportado en este navegador.</p>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}
