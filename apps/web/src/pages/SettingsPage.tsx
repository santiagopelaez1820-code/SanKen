// Esta línea sirve para importar «useEffect, useRef, useState» desde «react».
import { useEffect, useRef, useState } from "react"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «useForm» desde «react-hook-form».
import { useForm } from "react-hook-form"
// Esta línea sirve para importar «zodResolver» desde «@hookform/resolvers/zod».
import { zodResolver } from "@hookform/resolvers/zod"
// Esta línea sirve para importar «z» desde «zod».
import { z } from "zod"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar los íconos de la página de ajustes.
import { Bell, Camera, Eye, MapPin, MonitorSmartphone, Shield, ShieldCheck, Trash2, UserCircle } from "lucide-react"
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «ApiError» en la lista.
  ApiError,
  // Esta línea sirve para importar el tipo «OnboardingCity».
  type OnboardingCity,
  // Esta línea sirve para importar el tipo «OnboardingQuestions».
  type OnboardingQuestions,
  // Esta línea sirve para importar el tipo «OnboardingState».
  type OnboardingState,
  // Esta línea sirve para importar el tipo «OnboardingStateOption».
  type OnboardingStateOption,
  // Esta línea sirve para importar el tipo «TwoFactorEnableResponse».
  type TwoFactorEnableResponse,
  // Esta línea sirve para importar el tipo «TwoFactorConfirmResponse».
  type TwoFactorConfirmResponse,
  // Esta línea sirve para importar el tipo «User».
  type User,
// Esta línea sirve para terminar la importación desde «@sanken/core».
} from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «prepareAvatarFile» desde «@/lib/avatar-image».
import { prepareAvatarFile } from "@/lib/avatar-image"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Card» desde «@/components/ui/card».
import { Card } from "@/components/ui/card"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «Switch» desde «@/components/ui/switch».
import { Switch } from "@/components/ui/switch"
// Esta línea sirve para importar «Tabs, TabsList, TabsTrigger» desde «@/components/ui/tabs».
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Esta línea sirve para importar «PasswordInput» desde «@/components/ui/PasswordInput».
import { PasswordInput } from "@/components/ui/PasswordInput"
// Esta línea sirve para importar «LegalSettingsCard» desde «@/components/legal/LegalSettingsCard».
import { LegalSettingsCard } from "@/components/legal/LegalSettingsCard"
// Esta línea sirve para importar «useThemeStore, type ThemeMode» desde «@/lib/theme-store».
import { useThemeStore, type ThemeMode } from "@/lib/theme-store"
// Esta línea sirve para abrir la importación de los nombres siguientes.
import {
  // Esta línea sirve para incluir el valor «getExistingWebPushSubscription» en la lista.
  getExistingWebPushSubscription,
  // Esta línea sirve para incluir el valor «subscribeToWebPush» en la lista.
  subscribeToWebPush,
  // Esta línea sirve para incluir el valor «unsubscribeFromWebPush» en la lista.
  unsubscribeFromWebPush,
  // Esta línea sirve para incluir el valor «webPushUnavailableReason» en la lista.
  webPushUnavailableReason,
// Esta línea sirve para terminar la importación desde «@/lib/web-push».
} from "@/lib/web-push"

// Esta línea sirve para declarar «THEME_MODE_OPTIONS» con el valor «[».
const THEME_MODE_OPTIONS: { label: string; value: ThemeMode }[] = [
  // Esta línea sirve para agregar la opción de tema automático.
  { label: "Automático", value: "system" },
  // Esta línea sirve para agregar la opción de tema claro.
  { label: "Claro", value: "light" },
  // Esta línea sirve para agregar la opción de tema oscuro.
  { label: "Oscuro", value: "dark" },
]

// Esta línea sirve para declarar «ROLE_LABEL» con el valor «{».
const ROLE_LABEL: Record<User["role"], string> = {
  // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «"Atleta"».
  user: "Atleta",
  // Esta línea sirve para declarar la propiedad «trainer» con el valor o tipo «"Entrenador"».
  trainer: "Entrenador",
  // Esta línea sirve para declarar la propiedad «super_admin» con el valor o tipo «"Super Admin"».
  super_admin: "Super Admin",
}

// Esta línea sirve para declarar «confirmSchema» con el valor «z.object({».
const confirmSchema = z.object({
  // Esta línea sirve para validar el campo «code» con el esquema de Zod.
  code: z.string().length(6, "Ingresa el código de 6 dígitos"),
})
// Esta línea sirve para declarar el tipo «ConfirmFormValues» como «z.infer<typeof confirmSchema>».
type ConfirmFormValues = z.infer<typeof confirmSchema>

// Esta línea sirve para declarar «disableSchema» con el valor «z.object({».
const disableSchema = z.object({
  // Esta línea sirve para validar el campo «password» con el esquema de Zod.
  password: z.string().min(1, "Ingresa tu contraseña"),
})
// Esta línea sirve para declarar el tipo «DisableFormValues» como «z.infer<typeof disableSchema>».
type DisableFormValues = z.infer<typeof disableSchema>

// Esta línea sirve para declarar la función «SettingsPage».
export function SettingsPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para obtener «themeMode» con el hook «useThemeStore».
  const themeMode = useThemeStore((s) => s.mode)
  // Esta línea sirve para obtener «setThemeMode» con el hook «useThemeStore».
  const setThemeMode = useThemeStore((s) => s.setMode)
  // Esta línea sirve para obtener «data: user, isLoading» con el hook «useQuery».
  const { data: user, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["auth", "me"]».
    queryKey: ["auth", "me"],
    // Esta línea sirve para pedir a la API los datos de «/auth/me».
    queryFn: () => api.get<User>("/auth/me"),
  })

  // Esta línea sirve para crear la referencia «avatarInputRef».
  const avatarInputRef = useRef<HTMLInputElement>(null)
  // Esta línea sirve para obtener «setAuthUser» con el hook «useAuthStore».
  const setAuthUser = useAuthStore((s) => s.setUser)
  // Esta línea sirve para crear el estado «avatarError» y su función «setAvatarError».
  const [avatarError, setAvatarError] = useState<string | null>(null)

  // Esta línea sirve para obtener «updateAvatarMutation» con el hook «useMutation».
  const updateAvatarMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «async (file: File) => {».
    mutationFn: async (file: File) => {
      // Esta línea sirve para extraer «ormDat» de «new FormData()».
      const formData = new FormData()
      // Esta línea sirve para llamar a «formData.append» con «"avatar", await prepareAvatarFile(file)».
      formData.append("avatar", await prepareAvatarFile(file))
      // Esta línea sirve para devolver «api.post<User>("/auth/me/avatar", formData)».
      return api.post<User>("/auth/me/avatar", formData)
    },
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (updated) => {
      // Esta línea sirve para guardar en el estado con «setAvatarError» el valor «null)…».
      setAvatarError(null)
      // Esta línea sirve para llamar a «queryClient.setQueryData» con «["auth", "me"], updated».
      queryClient.setQueryData(["auth", "me"], updated)
      // El TopBar lee el usuario del auth store, no de esta query.
      // Esta línea sirve para guardar en el estado con «setAuthUser» el valor «updated)…».
      setAuthUser(updated)
    },
    // Esta línea sirve para definir lo que ocurre en «onError».
    onError: (err) =>
      // Esta línea sirve para guardar en el estado con «setAvatarError» el valor «err instanceof ApiError ? err.body.message : …».
      setAvatarError(err instanceof ApiError ? err.body.message : "No se pudo actualizar la foto."),
  })

  // Esta línea sirve para obtener «deleteAvatarMutation» con el hook «useMutation».
  const deleteAvatarMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «delete» hacia «/auth/me/avatar».
    mutationFn: () => api.delete<User>("/auth/me/avatar"),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (updated) => {
      // Esta línea sirve para guardar en el estado con «setAvatarError» el valor «null)…».
      setAvatarError(null)
      // Esta línea sirve para llamar a «queryClient.setQueryData» con «["auth", "me"], updated».
      queryClient.setQueryData(["auth", "me"], updated)
      // Esta línea sirve para guardar en el estado con «setAuthUser» el valor «updated)…».
      setAuthUser(updated)
    },
    // Esta línea sirve para definir lo que ocurre en «onError».
    onError: (err) =>
      // Esta línea sirve para guardar en el estado con «setAvatarError» el valor «err instanceof ApiError ? err.body.message : …».
      setAvatarError(err instanceof ApiError ? err.body.message : "No se pudo quitar la foto."),
  })

  // Esta línea sirve para extraer «andleAvatarFileChang» de «(e: React.ChangeEvent<HTMLInputElement>)».
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Esta línea sirve para extraer «il» de «e.target.files?.[0]».
    const file = e.target.files?.[0]
    // Esta línea sirve para asignar «""» a «e.target.value».
    e.target.value = ""
    // Esta línea sirve para subir la foto elegida si hay archivo.
    if (file) updateAvatarMutation.mutate(file)
  }

  // Esta línea sirve para crear el estado «enrollment» y su función «setEnrollment».
  const [enrollment, setEnrollment] = useState<TwoFactorEnableResponse | null>(null)
  // Esta línea sirve para crear el estado «recoveryCodes» y su función «setRecoveryCodes».
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null)

  // Esta línea sirve para obtener «enableMutation» con el hook «useMutation».
  const enableMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/auth/2fa/enable».
    mutationFn: () => api.post<TwoFactorEnableResponse>("/auth/2fa/enable"),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (data) => setEnrollment(data),
  })

  // Esta línea sirve para extraer «onfirmFor» de «useForm<ConfirmFormValues>({ resolver: z».
  const confirmForm = useForm<ConfirmFormValues>({ resolver: zodResolver(confirmSchema) })
  // Esta línea sirve para obtener «confirmMutation» con el hook «useMutation».
  const confirmMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «(values: ConfirmFormValues) =>».
    mutationFn: (values: ConfirmFormValues) =>
      // Esta línea sirve para enviar el código de confirmación de dos pasos a la API.
      api.post<TwoFactorConfirmResponse>("/auth/2fa/confirm", values),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (data) => {
      // Esta línea sirve para guardar en el estado con «setEnrollment» el valor «null)…».
      setEnrollment(null)
      // Esta línea sirve para guardar en el estado con «setRecoveryCodes» el valor «data.recovery_codes)…».
      setRecoveryCodes(data.recovery_codes)
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["auth", "me"] }».
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })

  // Esta línea sirve para extraer «isableFor» de «useForm<DisableFormValues>({ resolver: z».
  const disableForm = useForm<DisableFormValues>({ resolver: zodResolver(disableSchema) })
  // Esta línea sirve para obtener «disableMutation» con el hook «useMutation».
  const disableMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «post» hacia «/auth/2fa/disable».
    mutationFn: (values: DisableFormValues) => api.post("/auth/2fa/disable", values),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: () => {
      // Esta línea sirve para llamar a «disableForm.reset».
      disableForm.reset()
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["auth", "me"] }».
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })

  // Esta línea sirve para obtener «privacyMutation» con el hook «useMutation».
  const privacyMutation = useMutation({
    // Esta línea sirve para activar o desactivar la participación en rankings según el valor.
    mutationFn: (isPublic: boolean) => api.post(isPublic ? "/rankings/opt-in" : "/rankings/opt-out"),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  })

  // Esta línea sirve para obtener «data: onboardingState» con el hook «useQuery».
  const { data: onboardingState } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["onboarding", "state"]».
    queryKey: ["onboarding", "state"],
    // Esta línea sirve para pedir a la API los datos de «/onboarding».
    queryFn: () => api.get<OnboardingState>("/onboarding"),
  })

  // Esta línea sirve para obtener «data: questions» con el hook «useQuery».
  const { data: questions } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["onboarding", "questions"]».
    queryKey: ["onboarding", "questions"],
    // Esta línea sirve para pedir a la API los datos de «/onboarding/questions».
    queryFn: () => api.get<OnboardingQuestions>("/onboarding/questions"),
  })

  // Esta línea sirve para crear el estado «locationEditing» y su función «setLocationEditing».
  const [locationEditing, setLocationEditing] = useState(false)
  // Esta línea sirve para crear el estado «countryId» y su función «setCountryId».
  const [countryId, setCountryId] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «stateId» y su función «setStateId».
  const [stateId, setStateId] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «cityId» y su función «setCityId».
  const [cityId, setCityId] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «locationError» y su función «setLocationError».
  const [locationError, setLocationError] = useState<string | null>(null)

  // Se sincroniza con lo que ya está guardado apenas carga — sirve tanto
  // para mostrar el nombre de país/depto/ciudad actuales como para
  // pre-seleccionar el formulario cuando el usuario entra a editar.
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para salir de la función si «!onboardingState || locationEditing».
    if (!onboardingState || locationEditing) return
    // Esta línea sirve para guardar en el estado con «setCountryId» el valor «onboardingState.country_id)…».
    setCountryId(onboardingState.country_id)
    // Esta línea sirve para guardar en el estado con «setStateId» el valor «onboardingState.state_id)…».
    setStateId(onboardingState.state_id)
    // Esta línea sirve para guardar en el estado con «setCityId» el valor «onboardingState.city_id)…».
    setCityId(onboardingState.city_id)
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «onboardingState, locationEditing».
  }, [onboardingState, locationEditing])

  // Esta línea sirve para pedir los departamentos disponibles.
  const { data: locationStates, isLoading: isLoadingLocationStates } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["onboarding", "states", countryId]».
    queryKey: ["onboarding", "states", countryId],
    // Esta línea sirve para pedir a la API los datos de «/onboarding/countries/${countryId}/states».
    queryFn: () => api.get<OnboardingStateOption[]>(`/onboarding/countries/${countryId}/states`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «countryId !== null».
    enabled: countryId !== null,
  })

  // Esta línea sirve para pedir las ciudades disponibles.
  const { data: locationCities, isLoading: isLoadingLocationCities } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["onboarding", "cities", stateId]».
    queryKey: ["onboarding", "cities", stateId],
    // Esta línea sirve para pedir a la API los datos de «/onboarding/states/${stateId}/cities».
    queryFn: () => api.get<OnboardingCity[]>(`/onboarding/states/${stateId}/cities`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «stateId !== null».
    enabled: stateId !== null,
  })

  // Esta línea sirve para extraer «urrentCountryNam» de «questions?.countries.find((c) => c.id ==».
  const currentCountryName = questions?.countries.find((c) => c.id === onboardingState?.country_id)?.name
  // Esta línea sirve para extraer «urrentStateNam» de «locationStates?.find((s) => s.id === onb».
  const currentStateName = locationStates?.find((s) => s.id === onboardingState?.state_id)?.name
  // Esta línea sirve para extraer «urrentCityNam» de «locationCities?.find((c) => c.id === onb».
  const currentCityName = locationCities?.find((c) => c.id === onboardingState?.city_id)?.name

  // Esta línea sirve para obtener «locationMutation» con el hook «useMutation».
  const locationMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «patch» hacia «/onboarding».
    mutationFn: () => api.patch("/onboarding", { city_id: cityId }),
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: () => {
      // Esta línea sirve para guardar en el estado con «setLocationEditing» el valor «false)…».
      setLocationEditing(false)
      // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["onboarding", "state"] }».
      queryClient.invalidateQueries({ queryKey: ["onboarding", "state"] })
    },
    // Esta línea sirve para definir lo que ocurre en «onError».
    onError: (err) =>
      // Esta línea sirve para guardar en el estado con «setLocationError» el valor «err instanceof ApiError ? err.body.message : …».
      setLocationError(err instanceof ApiError ? err.body.message : "No se pudo guardar tu ubicación."),
  })

  // Esta línea sirve para crear el estado «pushEnabled» y su función «setPushEnabled».
  const [pushEnabled, setPushEnabled] = useState(false)
  // Esta línea sirve para crear el estado «pushError» y su función «setPushError».
  const [pushError, setPushError] = useState<string | null>(null)
  // Esta línea sirve para extraer «ushUnavailableReaso» de «webPushUnavailableReason()».
  const pushUnavailableReason = webPushUnavailableReason()
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para ver si ya existe una suscripción push y reflejarlo en el estado.
    getExistingWebPushSubscription().then((sub) => setPushEnabled(sub !== null))
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «».
  }, [])

  // Esta línea sirve para obtener «pushMutation» con el hook «useMutation».
  const pushMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «async (enable: boolean) => {».
    mutationFn: async (enable: boolean) => {
      // Esta línea sirve para revisar si «enable».
      if (enable) {
        // Esta línea sirve para esperar el resultado de «subscribeToWebPush».
        await subscribeToWebPush(import.meta.env.VITE_VAPID_PUBLIC_KEY ?? "")
      // Esta línea sirve para ejecutar este bloque en el caso contrario.
      } else {
        // Esta línea sirve para esperar el resultado de «unsubscribeFromWebPush».
        await unsubscribeFromWebPush()
      }
      // Esta línea sirve para devolver «enable».
      return enable
    },
    // Esta línea sirve para definir lo que ocurre en «onSuccess».
    onSuccess: (enabled) => {
      // Esta línea sirve para guardar en el estado con «setPushEnabled» el valor «enabled)…».
      setPushEnabled(enabled)
      // Esta línea sirve para guardar en el estado con «setPushError» el valor «null)…».
      setPushError(null)
    },
    // Esta línea sirve para definir lo que ocurre en «onError».
    onError: (err) => setPushError(err instanceof Error ? err.message : "No se pudo cambiar la preferencia."),
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-lg flex-col gap-6». */}
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        {/* Esta línea sirve para abrir el elemento «div». */}
        <div>
          {/* Esta línea sirve para mostrar el texto «Configuración» dentro de un «p». */}
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Configuración</p>
          {/* Esta línea sirve para mostrar el texto «Tu cuenta» dentro de un «h1». */}
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Tu cuenta</h1>
        </div>

        {/* Esta línea sirve para abrir el componente «Card». */}
        <Card className="flex flex-wrap items-center gap-3">
          {/* Esta línea sirve para abrir el elemento «div» con las clases «relative». */}
          <div className="relative">
            {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
            <button
              // Esta línea sirve para definir el atributo «type» con el valor «button».
              type="button"
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => avatarInputRef.current?.click()}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «updateAvatarMutation.isPending}».
              disabled={updateAvatarMutation.isPending}
              // Esta línea sirve para aplicar las clases de estilo «flex size-12 items-center justify-center over».
              className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-muted disabled:opacity-60"
              // Esta línea sirve para definir el atributo «aria-label» con el valor «Cambiar foto de perfil».
              aria-label="Cambiar foto de perfil"
            >
              {/* Esta línea sirve para elegir entre dos bloques según «user?.avatar_url». */}
              {user?.avatar_url ? (
                // Esta línea sirve para abrir el elemento «img».
                <img src={api.mediaUrl(user.avatar_url, "avatarLarge") ?? undefined} alt="" className="size-full object-cover" />
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el componente «UserCircle».
                <UserCircle className="size-6 text-muted-foreground" />
              )}
            </button>
            {/* Esta línea sirve para abrir el elemento «span» con las clases «absolute -right-1 -bottom-1 flex size-5 ». */}
            <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
              {/* Esta línea sirve para abrir el componente «Camera». */}
              <Camera className="size-2.5" />
            </span>
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para conectar la referencia «avatarInputRef}» con el elemento.
              ref={avatarInputRef}
              // Esta línea sirve para definir el atributo «type» con el valor «file».
              type="file"
              // Esta línea sirve para definir el atributo «accept» con el valor «image/*».
              accept="image/*"
              // Esta línea sirve para aplicar las clases de estilo «hidden».
              className="hidden"
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={handleAvatarFileChange}
            />
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «min-w-0 flex-1 basis-40». */}
          <div className="min-w-0 flex-1 basis-40">
            {/* Esta línea sirve para mostrar el valor «user?.name ?? "…"» dentro de un «p». */}
            <p className="font-heading text-base font-bold break-words text-foreground">{user?.name ?? "…"}</p>
            {/* Esta línea sirve para mostrar el valor «user ? ROLE_LABEL[user.role] : ""» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">{user ? ROLE_LABEL[user.role] : ""}</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-shrink-0 flex-col items-end ga». */}
          <div className="flex flex-shrink-0 flex-col items-end gap-1">
            {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
            <Button
              // Esta línea sirve para definir el atributo «variant» con el valor «outline».
              variant="outline"
              // Esta línea sirve para definir el atributo «size» con el valor «sm».
              size="sm"
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => avatarInputRef.current?.click()}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «updateAvatarMutation.isPending}».
              disabled={updateAvatarMutation.isPending}
            >
              {/* Esta línea sirve para mostrar el texto según si se está subiendo la foto. */}
              {updateAvatarMutation.isPending ? "Subiendo…" : "Cambiar foto"}
            </Button>
            {/* Esta línea sirve para mostrar el bloque solo si «user?.avatar_url». */}
            {user?.avatar_url && (
              // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
              <button
                // Esta línea sirve para definir el atributo «type» con el valor «button».
                type="button"
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => deleteAvatarMutation.mutate()}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «deleteAvatarMutation.isPending}».
                disabled={deleteAvatarMutation.isPending}
                // Esta línea sirve para aplicar las clases de estilo «flex items-center gap-1 text-xs text-muted-fo».
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive disabled:opacity-60"
              >
                {/* Esta línea sirve para abrir el componente «Trash2». */}
                <Trash2 className="size-3" />
                {/* Esta línea sirve para mostrar el texto «Quitar». */}
                Quitar
              </button>
            )}
          </div>
        </Card>
        {/* Esta línea sirve para mostrar el elemento solo si «avatarError». */}
        {avatarError && <p className="-mt-4 text-xs text-destructive">{avatarError}</p>}

        {/* Esta línea sirve para mostrar el bloque solo si «user?.role === "super_admin"». */}
        {user?.role === "super_admin" && (
          // Esta línea sirve para abrir el componente «Link».
          <Link to="/admin">
            {/* Esta línea sirve para abrir el componente «Card». */}
            <Card className="flex items-center gap-3 transition-colors hover:border-primary/40">
              {/* Esta línea sirve para abrir el elemento «div» con las clases «flex size-10 flex-shrink-0 items-center ». */}
              <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                {/* Esta línea sirve para abrir el componente «Shield». */}
                <Shield className="size-5 text-primary" />
              </div>
              {/* Esta línea sirve para abrir el elemento «div». */}
              <div>
                {/* Esta línea sirve para mostrar el texto «Panel de administración» dentro de un «p». */}
                <p className="text-sm font-medium text-foreground">Panel de administración</p>
                {/* Esta línea sirve para mostrar el texto «Usuarios, ejercicios, rutinas, reportes y más.» dentro de un «p». */}
                <p className="text-xs text-muted-foreground">Usuarios, ejercicios, rutinas, reportes y más.</p>
              </div>
            </Card>
          </Link>
        )}

        {/* Esta línea sirve para abrir el componente «Card». */}
        <Card>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center gap-2». */}
          <div className="flex items-center gap-2">
            {/* Esta línea sirve para abrir el componente «MapPin». */}
            <MapPin className="size-4 text-primary" />
            {/* Esta línea sirve para mostrar el texto «Ubicación» dentro de un «h2». */}
            <h2 className="font-heading text-sm font-medium text-foreground">Ubicación</h2>
          </div>
          {/* Esta línea sirve para abrir el elemento «p» con sus propiedades. */}
          <p className="mt-1 text-xs text-muted-foreground">Se usa para tus rankings por país, departamento y ciudad.</p>

          {/* Esta línea sirve para mostrar el bloque solo si «!locationEditing». */}
          {!locationEditing && (
            // Esta línea sirve para abrir el elemento «div» con las clases «mt-4 flex items-center justify-between g».
            <div className="mt-4 flex items-center justify-between gap-4">
              {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-foreground». */}
              <p className="text-sm text-foreground">
                {/* Esta línea sirve para elegir entre dos bloques según «onboardingState?.city_id». */}
                {onboardingState?.city_id ? (
                  // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
                  <>
                    {/* Esta línea sirve para mostrar la ciudad, el departamento y el país actuales. */}
                    {currentCityName ?? "…"}, {currentStateName ?? "…"}, {currentCountryName ?? "…"}
                  </>
                // Esta línea sirve para mostrar el bloque alternativo.
                ) : (
                  // Esta línea sirve para mostrar el texto «Sin configurar» dentro de un «span».
                  <span className="text-muted-foreground">Sin configurar</span>
                )}
              </p>
              {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
              <Button variant="outline" size="sm" onClick={() => setLocationEditing(true)}>
                {/* Esta línea sirve para mostrar el texto «Editar ubicación». */}
                Editar ubicación
              </Button>
            </div>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «locationEditing». */}
          {locationEditing && (
            // Esta línea sirve para abrir el elemento «div» con las clases «mt-4 space-y-3».
            <div className="mt-4 space-y-3">
              {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
              <div className="space-y-1.5">
                {/* Esta línea sirve para mostrar el texto «País» dentro de un «label». */}
                <label className="text-xs font-medium text-muted-foreground">País</label>
                {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
                <select
                  // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «countryId ?? ""}».
                  value={countryId ?? ""}
                  // Esta línea sirve para asignar el manejador del evento «onChange».
                  onChange={(e) => {
                    // Esta línea sirve para extraer «» de «e.target.value ? Number(e.target.value) ».
                    const id = e.target.value ? Number(e.target.value) : null
                    // Esta línea sirve para guardar en el estado con «setCountryId» el valor «id)…».
                    setCountryId(id)
                    // Esta línea sirve para guardar en el estado con «setStateId» el valor «null)…».
                    setStateId(null)
                    // Esta línea sirve para guardar en el estado con «setCityId» el valor «null)…».
                    setCityId(null)
                  }}
                >
                  {/* Esta línea sirve para abrir el elemento «option». */}
                  <option value="" disabled>
                    {/* Esta línea sirve para mostrar el texto «Selecciona un país». */}
                    Selecciona un país
                  </option>
                  {/* Esta línea sirve para recorrer «questions?.countries» y mostrar un bloque por elemento. */}
                  {questions?.countries.map((c) => (
                    // Esta línea sirve para abrir el elemento «option».
                    <option key={c.id} value={c.id}>
                      {/* Esta línea sirve para mostrar el valor «c.name». */}
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
              <div className="space-y-1.5">
                {/* Esta línea sirve para mostrar el texto «Departamento» dentro de un «label». */}
                <label className="text-xs font-medium text-muted-foreground">Departamento</label>
                {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
                <select
                  // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «stateId ?? ""}».
                  value={stateId ?? ""}
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «!countryId || isLoadingLocationStates}».
                  disabled={!countryId || isLoadingLocationStates}
                  // Esta línea sirve para asignar el manejador del evento «onChange».
                  onChange={(e) => {
                    // Esta línea sirve para extraer «» de «e.target.value ? Number(e.target.value) ».
                    const id = e.target.value ? Number(e.target.value) : null
                    // Esta línea sirve para guardar en el estado con «setStateId» el valor «id)…».
                    setStateId(id)
                    // Esta línea sirve para guardar en el estado con «setCityId» el valor «null)…».
                    setCityId(null)
                  }}
                >
                  {/* Esta línea sirve para abrir el elemento «option». */}
                  <option value="" disabled>
                    {/* Esta línea sirve para mostrar el texto «Selecciona un departamento». */}
                    Selecciona un departamento
                  </option>
                  {/* Esta línea sirve para recorrer «locationStates?» y mostrar un bloque por elemento. */}
                  {locationStates?.map((s) => (
                    // Esta línea sirve para abrir el elemento «option».
                    <option key={s.id} value={s.id}>
                      {/* Esta línea sirve para mostrar el valor «s.name». */}
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
              <div className="space-y-1.5">
                {/* Esta línea sirve para mostrar el texto «Ciudad / Municipio» dentro de un «label». */}
                <label className="text-xs font-medium text-muted-foreground">Ciudad / Municipio</label>
                {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
                <select
                  // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                  // Esta línea sirve para pasar la propiedad «value» con el valor «cityId ?? ""}».
                  value={cityId ?? ""}
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «!stateId || isLoadingLocationCities}».
                  disabled={!stateId || isLoadingLocationCities}
                  // Esta línea sirve para asignar el manejador del evento «onChange».
                  onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : null)}
                >
                  {/* Esta línea sirve para abrir el elemento «option». */}
                  <option value="" disabled>
                    {/* Esta línea sirve para mostrar el texto «Selecciona una ciudad». */}
                    Selecciona una ciudad
                  </option>
                  {/* Esta línea sirve para recorrer «locationCities?» y mostrar un bloque por elemento. */}
                  {locationCities?.map((c) => (
                    // Esta línea sirve para abrir el elemento «option».
                    <option key={c.id} value={c.id}>
                      {/* Esta línea sirve para mostrar el valor «c.name». */}
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Esta línea sirve para mostrar el elemento solo si «locationError». */}
              {locationError && <p className="text-xs text-destructive">{locationError}</p>}

              {/* Esta línea sirve para abrir el elemento «div» con las clases «flex gap-2». */}
              <div className="flex gap-2">
                {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                <Button
                  // Esta línea sirve para definir el atributo «size» con el valor «sm».
                  size="sm"
                  // Esta línea sirve para pasar la propiedad «disabled» con el valor «!cityId || locationMutation.isPending}».
                  disabled={!cityId || locationMutation.isPending}
                  // Esta línea sirve para asignar el manejador del evento «onClick».
                  onClick={() => locationMutation.mutate()}
                >
                  {/* Esta línea sirve para mostrar el texto «Guardar». */}
                  Guardar
                </Button>
                {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
                <Button variant="outline" size="sm" onClick={() => setLocationEditing(false)}>
                  {/* Esta línea sirve para mostrar el texto «Cancelar». */}
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Esta línea sirve para abrir el componente «Card». */}
        <Card>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center gap-2». */}
          <div className="flex items-center gap-2">
            {/* Esta línea sirve para abrir el componente «ShieldCheck». */}
            <ShieldCheck className="size-4 text-primary" />
            {/* Esta línea sirve para mostrar el texto «Autenticación de dos factores» dentro de un «h2». */}
            <h2 className="font-heading text-sm font-medium text-foreground">Autenticación de dos factores</h2>
          </div>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground». */}
          <p className="mt-1 text-xs text-muted-foreground">
            {/* Esta línea sirve para explicar para qué sirve la verificación en dos pasos. */}
            Agrega una capa extra de seguridad pidiendo un código de tu app autenticadora al iniciar sesión.
          </p>

          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="mt-4 h-9 w-32" />}

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && recoveryCodes». */}
          {!isLoading && recoveryCodes && (
            // Esta línea sirve para abrir el elemento «div» con las clases «mt-4 space-y-3 rounded-lg border border-».
            <div className="mt-4 space-y-3 rounded-lg border border-border bg-background p-4">
              {/* Esta línea sirve para abrir el elemento «p» con sus propiedades. */}
              <p className="text-sm font-medium text-foreground">2FA activado. Guarda estos códigos de recuperación:</p>
              {/* Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-muted-foreground». */}
              <p className="text-xs text-muted-foreground">
                {/* Esta línea sirve para explicar que cada código de recuperación sirve una sola vez. */}
                Cada uno sirve una sola vez si perdés el acceso a tu app autenticadora. No se van a volver a mostrar.
              </p>
              {/* Esta línea sirve para abrir el elemento «ul» con las clases «grid grid-cols-2 gap-2 font-mono text-sm». */}
              <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
                {/* Esta línea sirve para recorrer «recoveryCodes» y mostrar un bloque por elemento. */}
                {recoveryCodes.map((code) => (
                  // Esta línea sirve para abrir el elemento «li».
                  <li key={code} className="rounded bg-muted px-2 py-1 text-center">
                    {/* Esta línea sirve para mostrar el valor «code». */}
                    {code}
                  </li>
                ))}
              </ul>
              {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
              <Button size="sm" onClick={() => setRecoveryCodes(null)}>
                {/* Esta línea sirve para mostrar el texto «Ya los guardé». */}
                Ya los guardé
              </Button>
            </div>
          )}

          {/* Esta línea sirve para mostrar la opción de activar solo si no está activada ni en proceso. */}
          {!isLoading && !recoveryCodes && user && !user.two_factor_enabled && !enrollment && (
            // Esta línea sirve para abrir el componente «Button» con sus propiedades.
            <Button className="mt-4" size="sm" onClick={() => enableMutation.mutate()} disabled={enableMutation.isPending}>
              {/* Esta línea sirve para mostrar el texto «Activar 2FA». */}
              Activar 2FA
            </Button>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && enrollment». */}
          {!isLoading && enrollment && (
            // Esta línea sirve para abrir el elemento «div» con las clases «mt-4 space-y-4».
            <div className="mt-4 space-y-4">
              {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
              <div
                // Esta línea sirve para aplicar las clases de estilo «mx-auto w-40 [&_svg]:mx-auto [&_svg]:h-40 [&_».
                className="mx-auto w-40 [&_svg]:mx-auto [&_svg]:h-40 [&_svg]:w-40"
                // Esta línea sirve para pasar la propiedad «dangerouslySetInnerHTML» con el valor «{ __html: enrollment.qr_svg }}».
                dangerouslySetInnerHTML={{ __html: enrollment.qr_svg }}
              />
              {/* Esta línea sirve para abrir el elemento «p» con las clases «text-center text-xs text-muted-foregroun». */}
              <p className="text-center text-xs text-muted-foreground">
                {/* Esta línea sirve para explicar cómo escanear el QR o usar la clave manual. */}
                Escaneá el QR con tu app autenticadora, o ingresá esta clave manualmente:
              </p>
              {/* Esta línea sirve para abrir el elemento «p» con las clases «break-all rounded bg-muted px-2 py-1 tex». */}
              <p className="break-all rounded bg-muted px-2 py-1 text-center font-mono text-xs">
                {/* Esta línea sirve para mostrar el valor «enrollment.secret». */}
                {enrollment.secret}
              </p>

              {/* Esta línea sirve para abrir el elemento «form» con sus atributos en varias líneas. */}
              <form
                // Esta línea sirve para asignar el manejador del evento «onSubmit».
                onSubmit={confirmForm.handleSubmit((values) => confirmMutation.mutate(values))}
                // Esta línea sirve para aplicar las clases de estilo «space-y-2».
                className="space-y-2"
              >
                {/* Esta línea sirve para abrir el elemento «label». */}
                <label htmlFor="code" className="text-xs font-medium text-muted-foreground">
                  {/* Esta línea sirve para mostrar el texto «Código de 6 dígitos». */}
                  Código de 6 dígitos
                </label>
                {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
                <input
                  // Esta línea sirve para definir el atributo «id» con el valor «code».
                  id="code"
                  // Esta línea sirve para definir el atributo «type» con el valor «text».
                  type="text"
                  // Esta línea sirve para definir el atributo «autoComplete» con el valor «one-time-code».
                  autoComplete="one-time-code"
                  // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  // Esta línea sirve para conectar el campo del código con el formulario.
                  {...confirmForm.register("code")}
                />
                {/* Esta línea sirve para mostrar el bloque solo si «confirmForm.formState.errors.code». */}
                {confirmForm.formState.errors.code && (
                  // Esta línea sirve para mostrar el valor «confirmForm.formState.errors.code.message» dentro de un «p».
                  <p className="text-xs text-destructive">{confirmForm.formState.errors.code.message}</p>
                )}
                {/* Esta línea sirve para mostrar el bloque solo si «confirmMutation.isError». */}
                {confirmMutation.isError && (
                  // Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-destructive».
                  <p className="text-xs text-destructive">
                    {/* Esta línea sirve para mostrar el contenido dinámico «{confirmMutation.error instanceof ApiError». */}
                    {confirmMutation.error instanceof ApiError
                      // Esta línea sirve para mostrar el mensaje de error de la API.
                      ? confirmMutation.error.body.message
                      // Esta línea sirve para usar el mensaje genérico de confirmación.
                      : "No se pudo confirmar el código."}
                  </p>
                )}
                {/* Esta línea sirve para abrir el componente «Button». */}
                <Button type="submit" size="sm" disabled={confirmForm.formState.isSubmitting} className="w-full">
                  {/* Esta línea sirve para mostrar el texto «Confirmar». */}
                  Confirmar
                </Button>
              </form>
            </div>
          )}

          {/* Esta línea sirve para mostrar la opción de desactivar solo si está activada. */}
          {!isLoading && !recoveryCodes && user?.two_factor_enabled && (
            // Esta línea sirve para abrir el elemento «form» con sus atributos en varias líneas.
            <form
              // Esta línea sirve para asignar el manejador del evento «onSubmit».
              onSubmit={disableForm.handleSubmit((values) => disableMutation.mutate(values))}
              // Esta línea sirve para aplicar las clases de estilo «mt-4 space-y-2».
              className="mt-4 space-y-2"
            >
              {/* Esta línea sirve para mostrar el texto «2FA está activado en tu cuenta.» dentro de un «p». */}
              <p className="text-sm text-foreground">2FA está activado en tu cuenta.</p>
              {/* Esta línea sirve para abrir el elemento «label». */}
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                {/* Esta línea sirve para mostrar el texto «Contraseña para desactivar». */}
                Contraseña para desactivar
              </label>
              {/* Esta línea sirve para abrir el elemento «PasswordInput» con sus atributos en varias líneas. */}
              <PasswordInput
                // Esta línea sirve para definir el atributo «id» con el valor «password».
                id="password"
                // Esta línea sirve para definir el atributo «autoComplete» con el valor «current-password».
                autoComplete="current-password"
                // Esta línea sirve para conectar el campo de la contraseña con el formulario.
                {...disableForm.register("password")}
              />
              {/* Esta línea sirve para mostrar el bloque solo si «disableForm.formState.errors.password». */}
              {disableForm.formState.errors.password && (
                // Esta línea sirve para mostrar el valor «disableForm.formState.errors.password.message» dentro de un «p».
                <p className="text-xs text-destructive">{disableForm.formState.errors.password.message}</p>
              )}
              {/* Esta línea sirve para mostrar el bloque solo si «disableMutation.isError». */}
              {disableMutation.isError && (
                // Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-destructive».
                <p className="text-xs text-destructive">
                  {/* Esta línea sirve para mostrar el contenido dinámico «{disableMutation.error instanceof ApiError». */}
                  {disableMutation.error instanceof ApiError
                    // Esta línea sirve para mostrar el mensaje de error de la API.
                    ? disableMutation.error.body.message
                    // Esta línea sirve para usar el mensaje genérico de desactivación.
                    : "No se pudo desactivar."}
                </p>
              )}
              {/* Esta línea sirve para abrir el componente «Button». */}
              <Button type="submit" variant="outline" size="sm" disabled={disableForm.formState.isSubmitting}>
                {/* Esta línea sirve para mostrar el texto «Desactivar 2FA». */}
                Desactivar 2FA
              </Button>
            </form>
          )}
        </Card>

        {/* Esta línea sirve para abrir el componente «Card». */}
        <Card>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center gap-2». */}
          <div className="flex items-center gap-2">
            {/* Esta línea sirve para abrir el componente «MonitorSmartphone». */}
            <MonitorSmartphone className="size-4 text-primary" />
            {/* Esta línea sirve para mostrar el texto «Apariencia» dentro de un «h2». */}
            <h2 className="font-heading text-sm font-medium text-foreground">Apariencia</h2>
          </div>
          {/* Esta línea sirve para mostrar el texto «Elegí cómo se ve SanKen en este navegador.» dentro de un «p». */}
          <p className="mt-1 text-xs text-muted-foreground">Elegí cómo se ve SanKen en este navegador.</p>
          {/* Esta línea sirve para abrir el componente «Tabs» con sus propiedades. */}
          <Tabs value={themeMode} onValueChange={(value) => setThemeMode(value as ThemeMode)} className="mt-3">
            {/* Esta línea sirve para abrir el componente «TabsList». */}
            <TabsList className="h-9 w-full">
              {/* Esta línea sirve para recorrer «THEME_MODE_OPTIONS» y mostrar un bloque por elemento. */}
              {THEME_MODE_OPTIONS.map((option) => (
                // Esta línea sirve para abrir el componente «TabsTrigger».
                <TabsTrigger key={option.value} value={option.value} className="h-7">
                  {/* Esta línea sirve para mostrar el valor «option.label». */}
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </Card>

        {/* Esta línea sirve para abrir el componente «Card». */}
        <Card>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center justify-between gap-4». */}
          <div className="flex items-center justify-between gap-4">
            {/* Esta línea sirve para abrir el elemento «div» con las clases «min-w-0 flex-1». */}
            <div className="min-w-0 flex-1">
              {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center gap-2». */}
              <div className="flex items-center gap-2">
                {/* Esta línea sirve para abrir el componente «Eye». */}
                <Eye className="size-4 text-primary" />
                {/* Esta línea sirve para mostrar el texto «Rankings públicos» dentro de un «h2». */}
                <h2 className="font-heading text-sm font-medium text-foreground">Rankings públicos</h2>
              </div>
              {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground». */}
              <p className="mt-1 text-xs text-muted-foreground">
                {/* Esta línea sirve para explicar qué implica aparecer en los rankings. */}
                Si activás esto, tu volumen total aparece en los rankings de ciudad, país, gimnasio, edad, sexo y
                categoría de fuerza.
              </p>
            </div>
            {/* Esta línea sirve para abrir el elemento «Switch» con sus atributos en varias líneas. */}
            <Switch
              // Esta línea sirve para pasar la propiedad «checked» con el valor «user?.is_public_profile ?? false}».
              checked={user?.is_public_profile ?? false}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «isLoading || privacyMutation.isPending}».
              disabled={isLoading || privacyMutation.isPending}
              // Esta línea sirve para asignar el manejador del evento «onCheckedChange».
              onCheckedChange={(checked) => privacyMutation.mutate(checked)}
            />
          </div>
        </Card>

        {/* Esta línea sirve para abrir el componente «Card». */}
        <Card>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center justify-between gap-4». */}
          <div className="flex items-center justify-between gap-4">
            {/* Esta línea sirve para abrir el elemento «div» con las clases «min-w-0 flex-1». */}
            <div className="min-w-0 flex-1">
              {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center gap-2». */}
              <div className="flex items-center gap-2">
                {/* Esta línea sirve para abrir el componente «Bell». */}
                <Bell className="size-4 text-primary" />
                {/* Esta línea sirve para mostrar el texto «Notificaciones push» dentro de un «h2». */}
                <h2 className="font-heading text-sm font-medium text-foreground">Notificaciones push</h2>
              </div>
              {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground». */}
              <p className="mt-1 text-xs text-muted-foreground">
                {/* Esta línea sirve para explicar para qué sirven las notificaciones push. */}
                Recibí un aviso en el navegador cuando te llegue un mensaje, aunque no tengas SanKen abierto.
              </p>
              {/* Esta línea sirve para mostrar el elemento solo si «pushError». */}
              {pushError && <p className="mt-1 text-xs text-destructive">{pushError}</p>}
            </div>
            {/* Esta línea sirve para elegir entre dos bloques según «pushUnavailableReason». */}
            {pushUnavailableReason ? (
              // Esta línea sirve para mostrar el valor «pushUnavailableReason» dentro de un «p».
              <p className="max-w-40 text-right text-xs text-muted-foreground">{pushUnavailableReason}</p>
            // Esta línea sirve para mostrar el bloque alternativo.
            ) : (
              // Esta línea sirve para abrir el elemento «Switch» con sus atributos en varias líneas.
              <Switch
                // Esta línea sirve para pasar la propiedad «checked» con el valor «pushEnabled}».
                checked={pushEnabled}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «pushMutation.isPending}».
                disabled={pushMutation.isPending}
                // Esta línea sirve para asignar el manejador del evento «onCheckedChange».
                onCheckedChange={(checked) => {
                  // Esta línea sirve para guardar en el estado con «setPushError» el valor «null)…».
                  setPushError(null)
                  // Esta línea sirve para llamar a «pushMutation.mutate» con «checked».
                  pushMutation.mutate(checked)
                }}
              />
            )}
          </div>
        </Card>

        {/* Esta línea sirve para abrir el componente «LegalSettingsCard». */}
        <LegalSettingsCard />
      </div>
    </main>
  )
}
