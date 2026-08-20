import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ApiError, type ChallengeMetric, type ChallengeTemplate, type ChallengeType } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

const TYPE_LABEL: Record<ChallengeType, string> = {
  weekly: "Semanal",
  monthly: "Mensual",
}

const METRIC_LABEL: Record<ChallengeMetric, string> = {
  workouts_count: "Cantidad de entrenamientos",
  total_volume_kg: "Volumen total (kg)",
}

const inputClass = "rounded-lg border border-input bg-background px-2 py-1.5 text-sm"

export function AdminChallengeTemplatesPage() {
  const queryClient = useQueryClient()
  const [code, setCode] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<ChallengeType>("weekly")
  const [metric, setMetric] = useState<ChallengeMetric>("workouts_count")
  const [target, setTarget] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  const { data: templates, isLoading } = useQuery({
    queryKey: ["admin", "challenge-templates"],
    queryFn: () => api.get<ChallengeTemplate[]>("/admin/challenge-templates"),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "challenge-templates"] })

  const createMutation = useMutation({
    mutationFn: () =>
      api.post("/admin/challenge-templates", { code, title, description, type, metric, target: Number(target) }),
    onSuccess: () => {
      setCode("")
      setTitle("")
      setDescription("")
      setTarget("")
      setFormError(null)
      invalidate()
    },
    onError: (err) => setFormError(err instanceof ApiError ? err.body.message : "No se pudo crear el reto."),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      api.patch(`/admin/challenge-templates/${id}/${isActive ? "deactivate" : "activate"}`),
    onSuccess: invalidate,
  })

  const canSubmit = code.trim() && title.trim() && description.trim() && target.trim() && !createMutation.isPending

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Retos</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin">Volver</Link>
          </Button>
        </header>

        <p className="text-sm text-muted-foreground">
          Cada plantilla activa genera automáticamente un reto nuevo cada semana o mes (según su cadencia). Agregar
          una métrica distinta a las ya listadas todavía requiere desarrollo — acá solo se configuran instancias de
          las métricas existentes.
        </p>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">Nueva plantilla</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              placeholder="Código único (ej. weekly_5_sessions)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`${inputClass} col-span-2`}
            />
            <input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${inputClass} col-span-2`}
            />
            <textarea
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} col-span-2`}
            />
            <select value={type} onChange={(e) => setType(e.target.value as ChallengeType)} className={inputClass}>
              {(Object.keys(TYPE_LABEL) as ChallengeType[]).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABEL[t]}
                </option>
              ))}
            </select>
            <select value={metric} onChange={(e) => setMetric(e.target.value as ChallengeMetric)} className={inputClass}>
              {(Object.keys(METRIC_LABEL) as ChallengeMetric[]).map((m) => (
                <option key={m} value={m}>
                  {METRIC_LABEL[m]}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Objetivo"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className={`${inputClass} col-span-2`}
            />
          </div>
          {formError && <p className="mt-2 text-xs text-destructive">{formError}</p>}
          <Button
            size="sm"
            className="mt-3"
            onClick={() => createMutation.mutate()}
            disabled={!canSubmit}
          >
            Crear plantilla
          </Button>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
          <ul className="flex flex-col gap-3">
            {templates?.map((template) => (
              <li key={template.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      {template.title}{" "}
                      <span className="text-xs font-normal text-muted-foreground">({template.code})</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {TYPE_LABEL[template.type]} · {METRIC_LABEL[template.metric]} · objetivo {template.target}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {template.is_active ? "Activa" : "Inactiva"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => toggleActiveMutation.mutate({ id: template.id, isActive: template.is_active })}
                    disabled={toggleActiveMutation.isPending}
                  >
                    {template.is_active ? "Desactivar" : "Activar"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
