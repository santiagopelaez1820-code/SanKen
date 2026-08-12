import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AdminUser } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

const ROLE_LABELS: Record<AdminUser["role"], string> = {
  user: "Usuario",
  trainer: "Entrenador",
  admin: "Admin",
}

export function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [role, setRole] = useState("")
  const [bannedOnly, setBannedOnly] = useState(false)
  const [q, setQ] = useState("")

  const params = new URLSearchParams()
  if (role) params.set("role", role)
  if (bannedOnly) params.set("is_banned", "1")
  if (q.trim()) params.set("q", q.trim())

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users", role, bannedOnly, q],
    queryFn: () => api.get<AdminUser[]>(`/admin/users?${params.toString()}`),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] })

  const banMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/users/${id}/ban`),
    onSuccess: invalidate,
  })

  const verifyMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/admin/users/${id}/verify-trainer`),
    onSuccess: invalidate,
  })

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Usuarios</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin">Volver</Link>
          </Button>
        </header>

        <section className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
          <div className="space-y-1.5">
            <label htmlFor="role-filter" className="text-xs font-medium text-muted-foreground">
              Rol
            </label>
            <select
              id="role-filter"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            >
              <option value="">Todos</option>
              <option value="user">Usuario</option>
              <option value="trainer">Entrenador</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <label className="flex items-center gap-1.5 text-sm">
            <input type="checkbox" checked={bannedOnly} onChange={(e) => setBannedOnly(e.target.checked)} />
            Solo baneados
          </label>
          <div className="flex-1 space-y-1.5">
            <label htmlFor="q" className="text-xs font-medium text-muted-foreground">
              Buscar (nombre o correo)
            </label>
            <input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
          {!isLoading && users?.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin resultados.</p>
          )}
          {!isLoading && users && users.length > 0 && (
            <ul className="divide-y divide-border">
              {users.map((user) => (
                <li key={user.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="text-sm text-foreground">
                      {user.name} <span className="text-xs text-muted-foreground">· {ROLE_LABELS[user.role]}</span>
                      {user.role === "trainer" && user.trainer_verified_at && (
                        <span className="ml-1 text-xs text-primary">✓ Verificado</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.role === "trainer" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => verifyMutation.mutate(user.id)}
                        disabled={verifyMutation.isPending}
                      >
                        {user.trainer_verified_at ? "Quitar verificación" : "Verificar"}
                      </Button>
                    )}
                    <Button
                      variant={user.is_banned ? "outline" : "destructive"}
                      size="sm"
                      onClick={() => banMutation.mutate(user.id)}
                      disabled={banMutation.isPending}
                    >
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
