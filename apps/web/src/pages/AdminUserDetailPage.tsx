// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «Link, useNavigate, useParams» desde «react-router-dom».
import { Link, useNavigate, useParams } from "react-router-dom"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «formatPersonalRecord, type AdminUserDetail, type AssignableRole» desde «@sanken/core».
import { formatPersonalRecord, type AdminUserDetail, type AssignableRole } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «ConfirmDialog» desde «@/components/ui/ConfirmDialog».
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «ROLE_LABELS» con el valor «{».
const ROLE_LABELS: Record<string, string> = {
  // Esta línea sirve para declarar la propiedad «user» con el valor o tipo «"Usuario"».
  user: "Usuario",
  // Esta línea sirve para declarar la propiedad «trainer» con el valor o tipo «"Entrenador"».
  trainer: "Entrenador",
  // Esta línea sirve para declarar la propiedad «super_admin» con el valor o tipo «"Super Admin"».
  super_admin: "Super Admin",
}

// Esta línea sirve para declarar la función «AdminUserDetailPage».
export function AdminUserDetailPage() {
  // Esta línea sirve para extraer «userId» de «useParams<{ userId: string }>()».
  const { userId } = useParams<{ userId: string }>()
  // Esta línea sirve para obtener «navigate» con el hook «useNavigate».
  const navigate = useNavigate()
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «confirmingDelete» y su función «setConfirmingDelete».
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Esta línea sirve para obtener «data: user, isLoading» con el hook «useQuery».
  const { data: user, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "users", userId]».
    queryKey: ["admin", "users", userId],
    // Esta línea sirve para pedir a la API los datos de «/admin/users/${userId}».
    queryFn: () => api.get<AdminUserDetail>(`/admin/users/${userId}`),
    // Esta línea sirve para declarar la propiedad «enabled» con el valor o tipo «Boolean(userId)».
    enabled: Boolean(userId),
  })

  // Esta línea sirve para extraer «nvalidat» de «() => {».
  const invalidate = () => {
    // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["admin", "users", userId] }».
    queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] })
    // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["admin", "users"] }».
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
  }

  // Esta línea sirve para obtener «roleMutation» con el hook «useMutation».
  const roleMutation = useMutation({
    // Esta línea sirve para cambiar el rol del usuario a través de la API.
    mutationFn: (role: AssignableRole) => api.patch(`/admin/users/${userId}/role`, { role }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para obtener «banMutation» con el hook «useMutation».
  const banMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «patch» hacia «/admin/users/${userId}/ban».
    mutationFn: () => api.patch(`/admin/users/${userId}/ban`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para obtener «activationMutation» con el hook «useMutation».
  const activationMutation = useMutation({
    // Esta línea sirve para activar o desactivar la cuenta según su estado actual.
    mutationFn: () => api.patch(`/admin/users/${userId}/${user?.is_deactivated ? "activate" : "deactivate"}`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para obtener «deleteMutation» con el hook «useMutation».
  const deleteMutation = useMutation({
    // Esta línea sirve para enviar a la API la petición «delete» hacia «/admin/users/${userId}».
    mutationFn: () => api.delete(`/admin/users/${userId}`),
    // Esta línea sirve para volver a la lista de usuarios sin dejar historial.
    onSuccess: () => navigate("/admin/users", { replace: true }),
  })

  // Esta línea sirve para crear el estado «confirmingRevert» y su función «setConfirmingRevert».
  const [confirmingRevert, setConfirmingRevert] = useState(false)
  // Esta línea sirve para obtener «revertMutation» con el hook «useMutation».
  const revertMutation = useMutation({
    // Esta línea sirve para borrar la rutina personalizada del usuario.
    mutationFn: () => api.delete(`/admin/users/${userId}/routine`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «setConfirmingRevert» con «false».
      setConfirmingRevert(false)
      // Esta línea sirve para llamar a «invalidate».
      invalidate()
    },
  })

  // Esta línea sirve para revisar si «isLoading || !user».
  if (isLoading || !user) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        {/* Esta línea sirve para abrir el componente «Skeleton». */}
        <Skeleton className="h-20 w-full" />
      </main>
    )
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-2xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el valor «user.name» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{user.name}</h1>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «grid grid-cols-2 gap-3 rounded-xl border». */}
        <section className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-5 text-sm">
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «Correo» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">Correo</p>
            {/* Esta línea sirve para mostrar el valor «user.email» dentro de un «p». */}
            <p>{user.email}</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «Rol» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">Rol</p>
            {/* Esta línea sirve para abrir el elemento «p». */}
            <p>
              {/* Esta línea sirve para mostrar el contenido dinámico «{ROLE_LABELS[user.role]}». */}
              {ROLE_LABELS[user.role]}
              {/* Esta línea sirve para mostrar el contenido dinámico «{user.role === "trainer" && user.trainer_verified_at && (». */}
              {user.role === "trainer" && user.trainer_verified_at && (
                // Esta línea sirve para mostrar el texto «✓ Verificado» dentro de un «span».
                <span className="ml-1 text-xs text-primary">✓ Verificado</span>
              )}
            </p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «Estado» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">Estado</p>
            {/* Esta línea sirve para abrir el elemento «p». */}
            <p>
              {/* Esta línea sirve para mostrar el elemento solo si «user.is_banned». */}
              {user.is_banned && <span className="text-destructive">Baneado</span>}
              {/* Esta línea sirve para mostrar el elemento solo si «user.is_deactivated». */}
              {user.is_deactivated && <span className="text-destructive">Desactivado</span>}
              {/* Esta línea sirve para mostrar el elemento solo si «!user.is_banned && !user.is_deactivated». */}
              {!user.is_banned && !user.is_deactivated && <span className="text-primary">Activo</span>}
            </p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «País / Ciudad» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">País / Ciudad</p>
            {/* Esta línea sirve para mostrar el país y la ciudad o un guion. */}
            <p>{[user.country, user.city].filter(Boolean).join(" · ") || "—"}</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «Registrado» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">Registrado</p>
            {/* Esta línea sirve para mostrar el valor «new Date(user.created_at).toLocaleDateString()» dentro de un «p». */}
            <p>{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el texto «Entrenamientos completados» dentro de un «p». */}
            <p className="text-xs text-muted-foreground">Entrenamientos completados</p>
            {/* Esta línea sirve para mostrar el valor «user.trainings_completed» dentro de un «p». */}
            <p>{user.trainings_completed}</p>
          </div>
        </section>

        {/* Esta línea sirve para mostrar el bloque solo si «user.role !== "super_admin"». */}
        {user.role !== "super_admin" && (
          // Esta línea sirve para abrir el elemento «section» con las clases «flex flex-wrap gap-2 rounded-xl border b».
          <section className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-5">
            {/* Esta línea sirve para mostrar el bloque solo si «user.role === "user"». */}
            {user.role === "user" && (
              // Esta línea sirve para abrir el componente «Button» con sus propiedades.
              <Button size="sm" onClick={() => roleMutation.mutate("trainer")} disabled={roleMutation.isPending}>
                {/* Esta línea sirve para mostrar el texto «Promover a entrenador». */}
                Promover a entrenador
              </Button>
            )}
            {/* Esta línea sirve para mostrar el bloque solo si «user.role === "trainer"». */}
            {user.role === "trainer" && (
              // Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas.
              <Button
                // Esta línea sirve para definir el atributo «size» con el valor «sm».
                size="sm"
                // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                variant="outline"
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => roleMutation.mutate("user")}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «roleMutation.isPending}».
                disabled={roleMutation.isPending}
              >
                {/* Esta línea sirve para mostrar el texto «Degradar a usuario». */}
                Degradar a usuario
              </Button>
            )}
            {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
            <Button
              // Esta línea sirve para definir el atributo «size» con el valor «sm».
              size="sm"
              // Esta línea sirve para pasar la propiedad «variant» con el valor «user.is_banned ? "outline" : "destructive"}».
              variant={user.is_banned ? "outline" : "destructive"}
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => banMutation.mutate()}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «banMutation.isPending}».
              disabled={banMutation.isPending}
            >
              {/* Esta línea sirve para mostrar el contenido dinámico «{user.is_banned ? "Desbanear" : "Banear"}». */}
              {user.is_banned ? "Desbanear" : "Banear"}
            </Button>
            {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
            <Button
              // Esta línea sirve para definir el atributo «size» con el valor «sm».
              size="sm"
              // Esta línea sirve para pasar la propiedad «variant» con el valor «user.is_deactivated ? "outline" : "destructiv».
              variant={user.is_deactivated ? "outline" : "destructive"}
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => activationMutation.mutate()}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «activationMutation.isPending}».
              disabled={activationMutation.isPending}
            >
              {/* Esta línea sirve para mostrar el texto según si la cuenta está desactivada. */}
              {user.is_deactivated ? "Reactivar cuenta" : "Desactivar cuenta"}
            </Button>
            {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
            <Button size="sm" variant="destructive" onClick={() => setConfirmingDelete(true)}>
              {/* Esta línea sirve para mostrar el texto «Eliminar cuenta». */}
              Eliminar cuenta
            </Button>
          </section>
        )}

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Rutina» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium text-foreground">Rutina</h2>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-2 text-sm text-foreground». */}
          <p className="mt-2 text-sm text-foreground">
            {/* Esta línea sirve para mostrar la rutina actual o «Sin rutina activa». */}
            {user.current_routine ? user.current_routine.label : "Sin rutina activa"}
          </p>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex flex-wrap gap-2». */}
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Esta línea sirve para abrir el componente «Button». */}
            <Button size="sm" variant="outline" asChild>
              {/* Esta línea sirve para abrir el componente «Link». */}
              <Link to={`/admin/users/${userId}/routine/new`}>
                {/* Esta línea sirve para mostrar si se reemplaza o se asigna una rutina personalizada. */}
                {user.current_routine?.source === "admin" ? "Reemplazar rutina personalizada" : "Asignar rutina personalizada"}
              </Link>
            </Button>
            {/* Esta línea sirve para mostrar el bloque solo si «user.current_routine?.source === "admin"». */}
            {user.current_routine?.source === "admin" && (
              // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
              <>
                {/* Esta línea sirve para abrir el componente «Button». */}
                <Button size="sm" variant="outline" asChild>
                  {/* Esta línea sirve para mostrar el texto «Editar rutina personalizada» dentro de «Link». */}
                  <Link to={`/admin/users/${userId}/routine/edit`}>Editar rutina personalizada</Link>
                </Button>
                {/* Esta línea sirve para abrir el componente «Button» con sus propiedades. */}
                <Button size="sm" variant="destructive" onClick={() => setConfirmingRevert(true)}>
                  {/* Esta línea sirve para mostrar el texto «Volver a rutina general». */}
                  Volver a rutina general
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Récords personales» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium text-foreground">Récords personales</h2>
          {/* Esta línea sirve para elegir entre dos bloques según «user.personal_records.length === 0». */}
          {user.personal_records.length === 0 ? (
            // Esta línea sirve para mostrar el texto «Sin récords registrados.» dentro de un «p».
            <p className="mt-3 text-sm text-muted-foreground">Sin récords registrados.</p>
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para abrir el elemento «ul» con las clases «mt-3 divide-y divide-border».
            <ul className="mt-3 divide-y divide-border">
              {/* Esta línea sirve para recorrer «user.personal_records» y mostrar un bloque por elemento. */}
              {user.personal_records.map((record) => (
                // Esta línea sirve para abrir el elemento «li».
                <li key={record.id} className="flex items-center justify-between py-2.5 text-sm">
                  {/* Esta línea sirve para mostrar el valor «record.exercise_name» dentro de un «span». */}
                  <span>{record.exercise_name}</span>
                  {/* Esta línea sirve para mostrar el valor «formatPersonalRecord(record)» dentro de un «span». */}
                  <span className="font-medium text-primary">{formatPersonalRecord(record)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
        <ConfirmDialog
          // Esta línea sirve para pasar la propiedad «open» con el valor «confirmingDelete}».
          open={confirmingDelete}
          // Esta línea sirve para pasar la propiedad «title» con el valor «`¿Eliminar la cuenta de ${user.name}?`}».
          title={`¿Eliminar la cuenta de ${user.name}?`}
          // Esta línea sirve para definir el atributo «description».
          description="Esta acción es irreversible — se borran su cuenta, rutinas, entrenamientos, PRs e historial."
          // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, eliminar».
          confirmLabel="Sí, eliminar"
          // Esta línea sirve para activar la opción «destructive».
          destructive
          // Esta línea sirve para pasar la propiedad «isLoading» con el valor «deleteMutation.isPending}».
          isLoading={deleteMutation.isPending}
          // Esta línea sirve para asignar el manejador del evento «onConfirm».
          onConfirm={() => deleteMutation.mutate()}
          // Esta línea sirve para asignar el manejador del evento «onCancel».
          onCancel={() => setConfirmingDelete(false)}
        />

        {/* Esta línea sirve para abrir el elemento «ConfirmDialog» con sus atributos en varias líneas. */}
        <ConfirmDialog
          // Esta línea sirve para pasar la propiedad «open» con el valor «confirmingRevert}».
          open={confirmingRevert}
          // Esta línea sirve para definir el atributo «title» con el valor «¿Volver a la rutina general?».
          title="¿Volver a la rutina general?"
          // Esta línea sirve para definir el atributo «description».
          description="Se desactiva la rutina personalizada (queda en su historial) y se le asigna la plantilla general que le corresponde según su frecuencia."
          // Esta línea sirve para definir el atributo «confirmLabel» con el valor «Sí, volver a la general».
          confirmLabel="Sí, volver a la general"
          // Esta línea sirve para activar la opción «destructive».
          destructive
          // Esta línea sirve para pasar la propiedad «isLoading» con el valor «revertMutation.isPending}».
          isLoading={revertMutation.isPending}
          // Esta línea sirve para asignar el manejador del evento «onConfirm».
          onConfirm={() => revertMutation.mutate()}
          // Esta línea sirve para asignar el manejador del evento «onCancel».
          onCancel={() => setConfirmingRevert(false)}
        />
      </div>
    </main>
  )
}
