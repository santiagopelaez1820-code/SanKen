// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «AdminUser, OnboardingCity, OnboardingQuestions» desde «@sanken/core».
import type { AdminUser, OnboardingCity, OnboardingQuestions } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «ROLE_LABELS» con el valor «{».
const ROLE_LABELS: Record<AdminUser["role"], string> = {
  // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «"Usuario"».
  user: "Usuario",
  // Esta línea sirve para declarar la propiedad «trainer» con el valor o tipo «"Entrenador"».
  trainer: "Entrenador",
  // Esta línea sirve para declarar la propiedad «super_admin» con el valor o tipo «"Super Admin"».
  super_admin: "Super Admin",
}

// Esta línea sirve para declarar la función «AdminUsersPage».
export function AdminUsersPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «role» y su función «setRole».
  const [role, setRole] = useState("")
  // Esta línea sirve para crear el estado «bannedOnly» y su función «setBannedOnly».
  const [bannedOnly, setBannedOnly] = useState(false)
  // Esta línea sirve para crear el estado «q» y su función «setQ».
  const [q, setQ] = useState("")
  // Esta línea sirve para crear el estado «countryId» y su función «setCountryId».
  const [countryId, setCountryId] = useState("")
  // Esta línea sirve para crear el estado «cityId» y su función «setCityId».
  const [cityId, setCityId] = useState("")

  // Esta línea sirve para obtener «data: questions» con el hook «useQuery».
  const { data: questions } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["onboarding", "questions"]».
    queryKey: ["onboarding", "questions"],
    // Esta línea sirve para pedir a la API los datos de «/onboarding/questions».
    queryFn: () => api.get<OnboardingQuestions>("/onboarding/questions"),
  })

  // Esta línea sirve para obtener «data: cities» con el hook «useQuery».
  const { data: cities } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["onboarding", "cities", countryId]».
    queryKey: ["onboarding", "cities", countryId],
    // Esta línea sirve para pedir a la API los datos de «/onboarding/countries/${countryId}/cities».
    queryFn: () => api.get<OnboardingCity[]>(`/onboarding/countries/${countryId}/cities`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «Boolean(countryId)».
    enabled: Boolean(countryId),
  })

  // Esta línea sirve para extraer «aram» de «new URLSearchParams()».
  const params = new URLSearchParams()
  // Esta línea sirve para agregar el filtro de rol a los parámetros si se eligió.
  if (role) params.set("role", role)
  // Esta línea sirve para agregar el filtro de baneados si está activo.
  if (bannedOnly) params.set("is_banned", "1")
  // Esta línea sirve para agregar el texto de búsqueda a los parámetros si no está vacío.
  if (q.trim()) params.set("q", q.trim())
  // Esta línea sirve para agregar el filtro de país si se eligió.
  if (countryId) params.set("country_id", countryId)
  // Esta línea sirve para agregar el filtro de ciudad si se eligió.
  if (cityId) params.set("city_id", cityId)

  // Esta línea sirve para obtener «data: users, isLoading» con el hook «useQuery».
  const { data: users, isLoading } = useQuery({
    // Esta línea sirve para definir la clave de caché con todos los filtros.
    queryKey: ["admin", "users", role, bannedOnly, q, countryId, cityId],
    // Esta línea sirve para pedir a la API los datos de «/admin/users?${params.toString()}».
    queryFn: () => api.get<AdminUser[]>(`/admin/users?${params.toString()}`),
  })

  // Esta línea sirve para extraer «nvalidat» de «() => queryClient.invalidateQueries({ qu».
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] })

  // Esta línea sirve para obtener «banMutation» con el hook «useMutation».
  const banMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «patch» hacia «/admin/users/${id}/ban».
    mutationFn: (id: number) => api.patch(`/admin/users/${id}/ban`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para obtener «verifyMutation» con el hook «useMutation».
  const verifyMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «patch» hacia «/admin/users/${id}/verify-trainer».
    mutationFn: (id: number) => api.patch(`/admin/users/${id}/verify-trainer`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-4xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Usuarios» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Usuarios</h1>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «flex flex-wrap items-end gap-3 rounded-x». */}
        <section className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex w-full flex-col gap-1.5 sm:w-auto». */}
          <div className="flex w-full flex-col gap-1.5 sm:w-auto">
            {/* Esta línea sirve para abrir el elemento «label». */}
            <label htmlFor="role-filter" className="text-xs font-medium text-muted-foreground">
              {/* Esta línea sirve para mostrar el texto «Rol». */}
              Rol
            </label>
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para definir el atributo «id» con el valor «role-filter».
              id="role-filter"
              // Esta línea sirve para pasar la propiedad «value» con el valor «role}».
              value={role}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setRole(e.target.value)}
              // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
              className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm sm:w-auto"
            >
              {/* Esta línea sirve para mostrar el texto «Todos» dentro de un «option». */}
              <option value="">Todos</option>
              {/* Esta línea sirve para mostrar el texto «Usuario» dentro de un «option». */}
              <option value="user">Usuario</option>
              {/* Esta línea sirve para mostrar el texto «Entrenador» dentro de un «option». */}
              <option value="trainer">Entrenador</option>
              {/* Esta línea sirve para mostrar el texto «Super Admin» dentro de un «option». */}
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex w-full flex-col gap-1.5 sm:w-auto». */}
          <div className="flex w-full flex-col gap-1.5 sm:w-auto">
            {/* Esta línea sirve para abrir el elemento «label». */}
            <label htmlFor="country-filter" className="text-xs font-medium text-muted-foreground">
              {/* Esta línea sirve para mostrar el texto «País». */}
              País
            </label>
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para definir el atributo «id» con el valor «country-filter».
              id="country-filter"
              // Esta línea sirve para pasar la propiedad «value» con el valor «countryId}».
              value={countryId}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => {
                // Esta línea sirve para llamar a «setCountryId» con «e.target.value».
                setCountryId(e.target.value)
                // Esta línea sirve para llamar a «setCityId» con «""».
                setCityId("")
              }}
              // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
              className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm sm:w-auto"
            >
              {/* Esta línea sirve para mostrar el texto «Todos» dentro de un «option». */}
              <option value="">Todos</option>
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
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex w-full flex-col gap-1.5 sm:w-auto». */}
          <div className="flex w-full flex-col gap-1.5 sm:w-auto">
            {/* Esta línea sirve para abrir el elemento «label». */}
            <label htmlFor="city-filter" className="text-xs font-medium text-muted-foreground">
              {/* Esta línea sirve para mostrar el texto «Ciudad». */}
              Ciudad
            </label>
            {/* Esta línea sirve para abrir el elemento «select» con sus atributos en varias líneas. */}
            <select
              // Esta línea sirve para definir el atributo «id» con el valor «city-filter».
              id="city-filter"
              // Esta línea sirve para pasar la propiedad «value» con el valor «cityId}».
              value={cityId}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setCityId(e.target.value)}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «!countryId}».
              disabled={!countryId}
              // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
              className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm sm:w-auto"
            >
              {/* Esta línea sirve para mostrar el texto «Todas» dentro de un «option». */}
              <option value="">Todas</option>
              {/* Esta línea sirve para recorrer «cities?» y mostrar un bloque por elemento. */}
              {cities?.map((c) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={c.id} value={c.id}>
                  {/* Esta línea sirve para mostrar el valor «c.name». */}
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {/* Esta línea sirve para abrir el elemento «label» con las clases «flex w-full items-center gap-1.5 text-sm». */}
          <label className="flex w-full items-center gap-1.5 text-sm sm:w-auto">
            {/* Esta línea sirve para mostrar el elemento «input». */}
            <input type="checkbox" checked={bannedOnly} onChange={(e) => setBannedOnly(e.target.checked)} />
            {/* Esta línea sirve para mostrar el texto «Solo baneados». */}
            Solo baneados
          </label>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «flex w-full flex-col gap-1.5 sm:w-auto s». */}
          <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:flex-1">
            {/* Esta línea sirve para abrir el elemento «label». */}
            <label htmlFor="q" className="text-xs font-medium text-muted-foreground">
              {/* Esta línea sirve para mostrar el texto «Buscar (nombre o correo)». */}
              Buscar (nombre o correo)
            </label>
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «id» con el valor «q».
              id="q"
              // Esta línea sirve para pasar la propiedad «value» con el valor «q}».
              value={q}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setQ(e.target.value)}
              // Esta línea sirve para aplicar las clases de estilo «w-full rounded-lg border border-input bg-back».
              className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-20 w-full" />}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && users?.length === 0». */}
          {!isLoading && users?.length === 0 && (
            // Esta línea sirve para mostrar el texto «Sin resultados.» dentro de un «p».
            <p className="text-sm text-muted-foreground">Sin resultados.</p>
          )}
          {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && users && users.length > 0». */}
          {!isLoading && users && users.length > 0 && (
            // Esta línea sirve para abrir el elemento «ul» con las clases «divide-y divide-border».
            <ul className="divide-y divide-border">
              {/* Esta línea sirve para recorrer «users» y mostrar un bloque por elemento. */}
              {users.map((user) => (
                // Esta línea sirve para abrir el elemento «li» con sus atributos en varias líneas.
                <li
                  // Esta línea sirve para identificar el elemento de la lista con «user.id}».
                  key={user.id}
                  // Esta línea sirve para aplicar las clases de estilo «flex flex-col gap-2 py-2.5 sm:flex-row sm:ite».
                  className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  {/* Esta línea sirve para abrir el componente «Link». */}
                  <Link to={`/admin/users/${user.id}`} className="min-w-0">
                    {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-foreground». */}
                    <p className="text-sm text-foreground">
                      {/* Esta línea sirve para mostrar el nombre y el rol del usuario. */}
                      {user.name} <span className="text-xs text-muted-foreground">· {ROLE_LABELS[user.role]}</span>
                      {/* Esta línea sirve para mostrar el contenido dinámico «{user.role === "trainer" && user.trainer_verified_at && (». */}
                      {user.role === "trainer" && user.trainer_verified_at && (
                        // Esta línea sirve para mostrar el texto «✓ Verificado» dentro de un «span».
                        <span className="ml-1 text-xs text-primary">✓ Verificado</span>
                      )}
                      {/* Esta línea sirve para mostrar el elemento solo si «user.is_deactivated». */}
                      {user.is_deactivated && <span className="ml-1 text-xs text-destructive">Desactivado</span>}
                    </p>
                    {/* Esta línea sirve para abrir el elemento «p» con las clases «text-xs text-muted-foreground». */}
                    <p className="text-xs text-muted-foreground">
                      {/* Esta línea sirve para mostrar el valor «user.email». */}
                      {user.email}
                      {/* Esta línea sirve para mostrar el bloque solo si «(user.country || user.city)». */}
                      {(user.country || user.city) && (
                        // Esta línea sirve para mostrar la ciudad y el país del usuario.
                        <> · {[user.city, user.country].filter(Boolean).join(", ")}</>
                      )}
                    </p>
                  </Link>
                  {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-shrink-0 items-center gap-2». */}
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {/* Esta línea sirve para mostrar el bloque solo si «user.role === "trainer"». */}
                    {user.role === "trainer" && (
                      // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
                      <Button
                        // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                        variant="outline"
                        // Esta línea sirve para definir el atributo «size» con el valor «sm».
                        size="sm"
                        // Esta línea sirve para asignar el manejador del evento «onClick».
                        onClick={() => verifyMutation.mutate(user.id)}
                        // Esta línea sirve para pasar la propiedad «disabled» con el valor «verifyMutation.isPending}».
                        disabled={verifyMutation.isPending}
                      >
                        {/* Esta línea sirve para mostrar el texto según si el entrenador está verificado. */}
                        {user.trainer_verified_at ? "Quitar verificación" : "Verificar"}
                      </Button>
                    )}
                    {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                    <Button
                      // Esta línea sirve para pasar la propiedad «variant» con el valor «user.is_banned ? "outline" : "destructive"}».
                      variant={user.is_banned ? "outline" : "destructive"}
                      // Esta línea sirve para definir el atributo «size» con el valor «sm».
                      size="sm"
                      // Esta línea sirve para asignar el manejador del evento «onClick».
                      onClick={() => banMutation.mutate(user.id)}
                      // Esta línea sirve para pasar la propiedad «disabled» con el valor «banMutation.isPending}».
                      disabled={banMutation.isPending}
                    >
                      {/* Esta línea sirve para mostrar el contenido dinámico «{user.is_banned ? "Desbanear" : "Banear"}». */}
                      {user.is_banned ? "Desbanear" : "Banear"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
