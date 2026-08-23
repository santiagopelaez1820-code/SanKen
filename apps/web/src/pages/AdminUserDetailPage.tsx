import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AdminUserDetail, AssignableRole } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Skeleton } from "@/components/ui/skeleton"

const ROLE_LABELS: Record<string, string> = {
  user: "Usuario",
  trainer: "Entrenador",
  super_admin: "Super Admin",
}

export function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: () => api.get<AdminUserDetail>(`/admin/users/${userId}`),
    enabled: Boolean(userId),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "users", userId] })
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
  }

  const roleMutation = useMutation({
    mutationFn: (role: AssignableRole) => api.patch(`/admin/users/${userId}/role`, { role }),
    onSuccess: invalidate,
  })

  const banMutation = useMutation({
    mutationFn: () => api.patch(`/admin/users/${userId}/ban`),
    onSuccess: invalidate,
  })

  const activationMutation = useMutation({
    mutationFn: () => api.patch(`/admin/users/${userId}/${user?.is_deactivated ? "activate" : "deactivate"}`),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/admin/users/${userId}`),
    onSuccess: () => navigate("/admin/users", { replace: true }),
  })

  const [confirmingRevert, setConfirmingRevert] = useState(false)
  const revertMutation = useMutation({
    mutationFn: () => api.delete(`/admin/users/${userId}/routine`),
    onSuccess: () => {
      setConfirmingRevert(false)
      invalidate()
    },
  })

  if (isLoading || !user) {
    return (
      <main className="px-6 py-8">
        <Skeleton className="h-20 w-full" />
      </main>
    )
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">{user.name}</h1>

        <section className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-5 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Correo</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rol</p>
            <p>
              {ROLE_LABELS[user.role]}
              {user.role === "trainer" && user.trainer_verified_at && (
                <span className="ml-1 text-xs text-primary">✓ Verificado</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estado</p>
            <p>
              {user.is_banned && <span className="text-destructive">Baneado</span>}
              {user.is_deactivated && <span className="text-destructive">Desactivado</span>}
              {!user.is_banned && !user.is_deactivated && <span className="text-primary">Activo</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">País / Ciudad</p>
            <p>{[user.country, user.city].filter(Boolean).join(" · ") || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Registrado</p>
            <p>{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Entrenamientos completados</p>
            <p>{user.trainings_completed}</p>
          </div>
        </section>

        {user.role !== "super_admin" && (
          <section className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-5">
            {user.role === "user" && (
              <Button size="sm" onClick={() => roleMutation.mutate("trainer")} disabled={roleMutation.isPending}>
                Promover a entrenador
              </Button>
            )}
            {user.role === "trainer" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => roleMutation.mutate("user")}
                disabled={roleMutation.isPending}
              >
                Degradar a usuario
              </Button>
            )}
            <Button
              size="sm"
              variant={user.is_banned ? "outline" : "destructive"}
              onClick={() => banMutation.mutate()}
              disabled={banMutation.isPending}
            >
              {user.is_banned ? "Desbanear" : "Banear"}
            </Button>
            <Button
              size="sm"
              variant={user.is_deactivated ? "outline" : "destructive"}
              onClick={() => activationMutation.mutate()}
              disabled={activationMutation.isPending}
            >
              {user.is_deactivated ? "Reactivar cuenta" : "Desactivar cuenta"}
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setConfirmingDelete(true)}>
              Eliminar cuenta
            </Button>
          </section>
        )}

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium text-foreground">Rutina</h2>
          <p className="mt-2 text-sm text-foreground">
            {user.current_routine ? user.current_routine.label : "Sin rutina activa"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link to={`/admin/users/${userId}/routine/new`}>
                {user.current_routine?.source === "admin" ? "Reemplazar rutina personalizada" : "Asignar rutina personalizada"}
              </Link>
            </Button>
            {user.current_routine?.source === "admin" && (
              <>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/admin/users/${userId}/routine/edit`}>Editar rutina personalizada</Link>
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setConfirmingRevert(true)}>
                  Volver a rutina general
                </Button>
              </>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium text-foreground">Récords personales</h2>
          {user.personal_records.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Sin récords registrados.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {user.personal_records.map((record) => (
                <li key={record.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span>{record.exercise_name}</span>
                  <span className="font-medium text-primary">{record.value} kg</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <ConfirmDialog
          open={confirmingDelete}
          title={`¿Eliminar la cuenta de ${user.name}?`}
          description="Esta acción es irreversible — se borran su cuenta, rutinas, entrenamientos, PRs e historial."
          confirmLabel="Sí, eliminar"
          destructive
          isLoading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setConfirmingDelete(false)}
        />

        <ConfirmDialog
          open={confirmingRevert}
          title="¿Volver a la rutina general?"
          description="Se desactiva la rutina personalizada (queda en su historial) y se le asigna la plantilla general que le corresponde según su frecuencia."
          confirmLabel="Sí, volver a la general"
          destructive
          isLoading={revertMutation.isPending}
          onConfirm={() => revertMutation.mutate()}
          onCancel={() => setConfirmingRevert(false)}
        />
      </div>
    </main>
  )
}
