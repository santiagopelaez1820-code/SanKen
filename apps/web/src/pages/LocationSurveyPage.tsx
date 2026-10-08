// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from "react"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «Navigate, useNavigate» desde «react-router-dom».
import { Navigate, useNavigate } from "react-router-dom"
// Esta línea sirve para importar el error de la API y los tipos del onboarding.
import { ApiError, type OnboardingCity, type OnboardingQuestions, type OnboardingStateOption } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar las clases comunes de los selectores.
const selectClass =
  // Esta línea sirve para incluir el texto o las clases «w-full rounded-lg border border-input bg-back…».
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"

/**
 * Un estado/departamento con datos reales puede tener miles de ciudades
 * (ver ImportLocationData en el backend) — nunca se cargan todas. Este
 * hook debounce evita golpear /onboarding/states/{id}/cities?search= en
 * cada tecla.
 */
// Esta línea sirve para declarar la función «useDebouncedValue».
function useDebouncedValue<T>(value: T, delayMs: number): T {
  // Esta línea sirve para crear el estado «debounced» y su función «setDebounced».
  const [debounced, setDebounced] = useState(value)
  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para extraer «ime» de «setTimeout(() => setDebounced(value), de».
    const timer = setTimeout(() => setDebounced(value), delayMs)
    // Esta línea sirve para devolver «() => clearTimeout(timer)».
    return () => clearTimeout(timer)
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «value, delayMs».
  }, [value, delayMs])
  // Esta línea sirve para devolver «debounced».
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
// Esta línea sirve para declarar la función «LocationSurveyPage».
export function LocationSurveyPage() {
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((state) => state.user)
  // Esta línea sirve para obtener «setHasLocation» con el hook «useAuthStore».
  const setHasLocation = useAuthStore((state) => state.setHasLocation)

  // Esta línea sirve para crear el estado «countryId» y su función «setCountryId».
  const [countryId, setCountryId] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «stateId» y su función «setStateId».
  const [stateId, setStateId] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «cityId» y su función «setCityId».
  const [cityId, setCityId] = useState<number | null>(null)
  // Esta línea sirve para crear el estado «citySearch» y su función «setCitySearch».
  const [citySearch, setCitySearch] = useState("")
  // Esta línea sirve para crear el estado «isSubmitting» y su función «setIsSubmitting».
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Esta línea sirve para crear el estado «error» y su función «setError».
  const [error, setError] = useState<string | null>(null)

  // Esta línea sirve para obtener «debouncedCitySearch» con el hook «useDebouncedValue».
  const debouncedCitySearch = useDebouncedValue(citySearch.trim(), 300)

  // Esta línea sirve para obtener «data: questions, isLoading» con el hook «useQuery».
  const { data: questions, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["onboarding", "questions"]».
    queryKey: ["onboarding", "questions"],
    // Esta línea sirve para pedir a la API los datos de «/onboarding/questions».
    queryFn: () => api.get<OnboardingQuestions>("/onboarding/questions"),
  })

  // Esta línea sirve para obtener «data: states, isLoading: isLoadingStates» con el hook «useQuery».
  const { data: states, isLoading: isLoadingStates } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["onboarding", "states", countryId]».
    queryKey: ["onboarding", "states", countryId],
    // Esta línea sirve para pedir a la API los datos de «/onboarding/countries/${countryId}/states».
    queryFn: () => api.get<OnboardingStateOption[]>(`/onboarding/countries/${countryId}/states`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «countryId !== null».
    enabled: countryId !== null,
  })

  // Esta línea sirve para obtener «data: cities, isLoading: isLoadingCities» con el hook «useQuery».
  const { data: cities, isLoading: isLoadingCities } = useQuery({
    // Esta línea sirve para definir la clave de caché con el departamento y la búsqueda.
    queryKey: ["onboarding", "cities", stateId, debouncedCitySearch],
    // Esta línea sirve para declarar la propiedad «queryFn» con el valor o tipo «() => {».
    queryFn: () => {
      // Esta línea sirve para extraer «aram» de «new URLSearchParams()».
      const params = new URLSearchParams()
      // Esta línea sirve para agregar la búsqueda de ciudad a los parámetros si existe.
      if (debouncedCitySearch) params.set("search", debouncedCitySearch)
      // Esta línea sirve para extraer «» de «params.toString()».
      const qs = params.toString()
      // Esta línea sirve para pedir las ciudades del departamento con la búsqueda.
      return api.get<OnboardingCity[]>(`/onboarding/states/${stateId}/cities${qs ? `?${qs}` : ""}`)
    },
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «stateId !== null».
    enabled: stateId !== null,
  })

  // Esta línea sirve para redirigir al login si no hay usuario.
  if (!user) return <Navigate to="/login" replace />
  // Esta línea sirve para redirigir al onboarding si no lo completó.
  if (!user.onboarding_completed) return <Navigate to="/onboarding" replace />
  // Esta línea sirve para redirigir al dashboard si ya tiene ubicación.
  if (user.has_location) return <Navigate to="/dashboard" replace />

  // Esta línea sirve para extraer «andleSubmi» de «async () => {».
  const handleSubmit = async () => {
    // Esta línea sirve para salir de la función si «!cityId».
    if (!cityId) return
    // Esta línea sirve para llamar a «setIsSubmitting» con «true».
    setIsSubmitting(true)
    // Esta línea sirve para llamar a «setError» con «null».
    setError(null)
    // Esta línea sirve para intentar ejecutar el bloque siguiente.
    try {
      // Esta línea sirve para esperar el resultado de «api.patch».
      await api.patch("/onboarding", { city_id: cityId })
      // Esta línea sirve para llamar a «setHasLocation».
      setHasLocation()
      // Esta línea sirve para llamar a «navigate» con «"/dashboard", { replace: true }».
      navigate("/dashboard", { replace: true })
    // Esta línea sirve para capturar cualquier error del bloque anterior.
    } catch (err) {
      // Esta línea sirve para mostrar el mensaje de error de la API o uno genérico.
      setError(err instanceof ApiError ? err.body.message : "No se pudo guardar tu ubicación.")
    // Esta línea sirve para ejecutar siempre al terminar el bloque anterior.
    } finally {
      // Esta línea sirve para llamar a «setIsSubmitting» con «false».
      setIsSubmitting(false)
    }
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «flex min-h-svh flex-col items-center jus».
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-10 text-foreground">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «w-full max-w-sm». */}
      <div className="w-full max-w-sm">
        {/* Esta línea sirve para mostrar el texto «Bienvenido a SanKen» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-medium tracking-tight">Bienvenido a SanKen</h1>
        {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-2 text-sm text-muted-foreground». */}
        <p className="mt-2 text-sm text-muted-foreground">
          {/* Esta línea sirve para mostrar la explicación de por qué se pide la ubicación. */}
          Antes de comenzar necesitamos saber dónde entrenas, para personalizar tu experiencia y los rankings.
        </p>

        {/* Esta línea sirve para elegir entre dos bloques según «isLoading || !questions». */}
        {isLoading || !questions ? (
          // Esta línea sirve para abrir el componente «Skeleton».
          <Skeleton className="mt-6 h-40 w-full" />
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para abrir el elemento «div» con las clases «mt-6 space-y-4».
          <div className="mt-6 space-y-4">
            {/* Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5». */}
            <div className="space-y-1.5">
              {/* Esta línea sirve para mostrar el texto «País» dentro de un «label». */}
              <label className="text-sm font-medium">País</label>
              {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
              <select
                // Esta línea sirve para aplicar las clases de estilo calculadas: «selectClass}».
                className={selectClass}
                // Esta línea sirve para pasar la propiedad «value» con el valor «countryId ?? ""}».
                value={countryId ?? ""}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(e) => {
                  // Esta línea sirve para extraer «» de «e.target.value ? Number(e.target.value) ».
                  const id = e.target.value ? Number(e.target.value) : null
                  // Esta línea sirve para llamar a «setCountryId» con «id».
                  setCountryId(id)
                  // Esta línea sirve para llamar a «setStateId» con «null».
                  setStateId(null)
                  // Esta línea sirve para llamar a «setCityId» con «null».
                  setCityId(null)
                }}
              >
                {/* Esta línea sirve para abrir el elemento «option». */}
                <option value="" disabled>
                  {/* Esta línea sirve para mostrar el texto «Selecciona un país». */}
                  Selecciona un país
                </option>
                {/* Esta línea sirve para recorrer «questions.countries» y mostrar un bloque por elemento. */}
                {questions.countries.map((c) => (
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
              <label className="text-sm font-medium">Departamento</label>
              {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
              <select
                // Esta línea sirve para aplicar las clases de estilo calculadas: «selectClass}».
                className={selectClass}
                // Esta línea sirve para pasar la propiedad «value» con el valor «stateId ?? ""}».
                value={stateId ?? ""}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «!countryId || isLoadingStates || !states}».
                disabled={!countryId || isLoadingStates || !states}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(e) => {
                  // Esta línea sirve para extraer «» de «e.target.value ? Number(e.target.value) ».
                  const id = e.target.value ? Number(e.target.value) : null
                  // Esta línea sirve para llamar a «setStateId» con «id».
                  setStateId(id)
                  // Esta línea sirve para llamar a «setCityId» con «null».
                  setCityId(null)
                  // Esta línea sirve para llamar a «setCitySearch» con «""».
                  setCitySearch("")
                }}
              >
                {/* Esta línea sirve para abrir el elemento «option». */}
                <option value="" disabled>
                  {/* Esta línea sirve para mostrar el texto del selector según el estado de la carga. */}
                  {!countryId ? "Elegí un país primero" : isLoadingStates ? "Cargando…" : "Selecciona un departamento"}
                </option>
                {/* Esta línea sirve para recorrer «states?» y mostrar un bloque por elemento. */}
                {states?.map((s) => (
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
              <label className="text-sm font-medium">Ciudad / Municipio</label>
              {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
              <input
                // Esta línea sirve para definir el atributo «type» con el valor «text».
                type="text"
                // Esta línea sirve para aplicar las clases de estilo calculadas: «selectClass}».
                className={selectClass}
                // Esta línea sirve para pasar la propiedad «placeholder» con el valor «!stateId ? "Elegí un departamento primero" : ».
                placeholder={!stateId ? "Elegí un departamento primero" : "Buscar ciudad… (ej. Medellín, Guadalajara)"}
                // Esta línea sirve para pasar la propiedad «value» con el valor «citySearch}».
                value={citySearch}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «!stateId}».
                disabled={!stateId}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(e) => setCitySearch(e.target.value)}
              />
              {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
              <select
                // Esta línea sirve para aplicar las clases de estilo calculadas: «selectClass}».
                className={selectClass}
                // Esta línea sirve para pasar la propiedad «value» con el valor «cityId ?? ""}».
                value={cityId ?? ""}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «!stateId || isLoadingCities || !cities}».
                disabled={!stateId || isLoadingCities || !cities}
                // Esta línea sirve para asignar el manejador del evento «onChange».
                onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : null)}
              >
                {/* Esta línea sirve para abrir el elemento «option». */}
                <option value="" disabled>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{!stateId». */}
                  {!stateId
                    // Esta línea sirve para mostrar que primero hay que elegir un departamento.
                    ? "Elegí un departamento primero"
                    // Esta línea sirve para revisar si están cargando las ciudades.
                    : isLoadingCities
                      // Esta línea sirve para mostrar el texto de carga.
                      ? "Cargando…"
                      // Esta línea sirve para revisar si no hay resultados.
                      : cities && cities.length === 0
                        // Esta línea sirve para mostrar el texto de sin resultados.
                        ? "Sin resultados"
                        // Esta línea sirve para mostrar el texto de seleccionar una ciudad.
                        : "Selecciona una ciudad"}
                </option>
                {/* Esta línea sirve para recorrer «cities?» y mostrar un bloque por elemento. */}
                {cities?.map((c) => (
                  // Esta línea sirve para abrir el elemento «option».
                  <option key={c.id} value={c.id}>
                    {/* Esta línea sirve para mostrar el valor «c.name». */}
                    {c.name}
                  </option>
                ))}
              </select>
              {/* Esta línea sirve para mostrar el bloque solo si «cities && cities.length >= 50». */}
              {cities && cities.length >= 50 && (
                // Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-muted-foreground».
                <p className="text-xs text-muted-foreground">
                  {/* Esta línea sirve para avisar que solo se muestran los primeros resultados. */}
                  Mostrando los primeros {cities.length} resultados — seguí escribiendo para acotar la búsqueda.
                </p>
              )}
            </div>

            {/* Esta línea sirve para mostrar el elemento solo si «error». */}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button onClick={handleSubmit} disabled={!cityId || isSubmitting} className="w-full">
              {/* Esta línea sirve para mostrar el contenido dinámico «{isSubmitting ? "Guardando…" : "Continuar"}». */}
              {isSubmitting ? "Guardando…" : "Continuar"}
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
