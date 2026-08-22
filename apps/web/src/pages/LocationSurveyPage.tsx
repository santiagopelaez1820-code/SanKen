import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useNavigate } from "react-router-dom"
import { ApiError, type OnboardingCity, type OnboardingQuestions, type OnboardingStateOption } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const selectClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"

/**
 * Un estado/departamento con datos reales puede tener miles de ciudades
 * (ver ImportLocationData en el backend) — nunca se cargan todas. Este
 * hook debounce evita golpear /onboarding/states/{id}/cities?search= en
 * cada tecla.
 */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

/**
 * Encuesta corta, separada del wizard de 10 pasos de onboarding a propósito:
 * OnboardingPage expulsa a cualquier usuario con onboarding_completed=true
 * (ver su guard), así que insertar este paso ahí dejaría sin ruta de escape
 * a todo usuario que ya completó onboarding mucho antes de que esta
 * ubicación jerárquica existiera. Ver RequireAuth para el gate que trae
 * hasta acá.
 */
export function LocationSurveyPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setHasLocation = useAuthStore((state) => state.setHasLocation)

  const [countryId, setCountryId] = useState<number | null>(null)
  const [stateId, setStateId] = useState<number | null>(null)
  const [cityId, setCityId] = useState<number | null>(null)
  const [citySearch, setCitySearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedCitySearch = useDebouncedValue(citySearch.trim(), 300)

  const { data: questions, isLoading } = useQuery({
    queryKey: ["onboarding", "questions"],
    queryFn: () => api.get<OnboardingQuestions>("/onboarding/questions"),
  })

  const { data: states, isLoading: isLoadingStates } = useQuery({
    queryKey: ["onboarding", "states", countryId],
    queryFn: () => api.get<OnboardingStateOption[]>(`/onboarding/countries/${countryId}/states`),
    enabled: countryId !== null,
  })

  const { data: cities, isLoading: isLoadingCities } = useQuery({
    queryKey: ["onboarding", "cities", stateId, debouncedCitySearch],
    queryFn: () => {
      const params = new URLSearchParams()
      if (debouncedCitySearch) params.set("search", debouncedCitySearch)
      const qs = params.toString()
      return api.get<OnboardingCity[]>(`/onboarding/states/${stateId}/cities${qs ? `?${qs}` : ""}`)
    },
    enabled: stateId !== null,
  })

  if (!user) return <Navigate to="/login" replace />
  if (!user.onboarding_completed) return <Navigate to="/onboarding" replace />
  if (user.has_location) return <Navigate to="/dashboard" replace />

  const handleSubmit = async () => {
    if (!cityId) return
    setIsSubmitting(true)
    setError(null)
    try {
      await api.patch("/onboarding", { city_id: cityId })
      setHasLocation()
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.body.message : "No se pudo guardar tu ubicación.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-10 text-foreground">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-2xl font-medium tracking-tight">Bienvenido a SanKen</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Antes de comenzar necesitamos saber dónde entrenas, para personalizar tu experiencia y los rankings.
        </p>

        {isLoading || !questions ? (
          <Skeleton className="mt-6 h-40 w-full" />
        ) : (
          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">País</label>
              <select
                className={selectClass}
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
                {questions.countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Departamento</label>
              <select
                className={selectClass}
                value={stateId ?? ""}
                disabled={!countryId || isLoadingStates || !states}
                onChange={(e) => {
                  const id = e.target.value ? Number(e.target.value) : null
                  setStateId(id)
                  setCityId(null)
                  setCitySearch("")
                }}
              >
                <option value="" disabled>
                  {!countryId ? "Elegí un país primero" : isLoadingStates ? "Cargando…" : "Selecciona un departamento"}
                </option>
                {states?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Ciudad / Municipio</label>
              <input
                type="text"
                className={selectClass}
                placeholder={!stateId ? "Elegí un departamento primero" : "Buscar ciudad… (ej. Medellín, Guadalajara)"}
                value={citySearch}
                disabled={!stateId}
                onChange={(e) => setCitySearch(e.target.value)}
              />
              <select
                className={selectClass}
                value={cityId ?? ""}
                disabled={!stateId || isLoadingCities || !cities}
                onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="" disabled>
                  {!stateId
                    ? "Elegí un departamento primero"
                    : isLoadingCities
                      ? "Cargando…"
                      : cities && cities.length === 0
                        ? "Sin resultados"
                        : "Selecciona una ciudad"}
                </option>
                {cities?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {cities && cities.length >= 50 && (
                <p className="text-xs text-muted-foreground">
                  Mostrando los primeros {cities.length} resultados — seguí escribiendo para acotar la búsqueda.
                </p>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button onClick={handleSubmit} disabled={!cityId || isSubmitting} className="w-full">
              {isSubmitting ? "Guardando…" : "Continuar"}
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
