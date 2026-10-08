// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar el error de la API y los tipos de reto.
import { ApiError, type ChallengeMetric, type ChallengeTemplate, type ChallengeType } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar «TYPE_LABEL» con el valor «{».
const TYPE_LABEL: Record<ChallengeType, string> = {
  // Esta línea sirve para declarar la propiedad «weekly» con el valor o tipo «"Semanal"».
  weekly: "Semanal",
  // Esta línea sirve para declarar la propiedad «monthly» con el valor o tipo «"Mensual"».
  monthly: "Mensual",
}

// Esta línea sirve para declarar «METRIC_LABEL» con el valor «{».
const METRIC_LABEL: Record<ChallengeMetric, string> = {
  // Esta línea sirve para declarar la propiedad «workouts_count» con el valor o tipo «"Cantidad de entrenamientos"».
  workouts_count: "Cantidad de entrenamientos",
  // Esta línea sirve para declarar la propiedad «total_volume_kg» con el valor o tipo «"Volumen total (kg)"».
  total_volume_kg: "Volumen total (kg)",
}

// Esta línea sirve para extraer «nputClas» de «"rounded-lg border border-input bg-backg».
const inputClass = "rounded-lg border border-input bg-background px-2 py-1.5 text-sm"

// Esta línea sirve para declarar la función «AdminChallengeTemplatesPage».
export function AdminChallengeTemplatesPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «code» y su función «setCode».
  const [code, setCode] = useState("")
  // Esta línea sirve para crear el estado «title» y su función «setTitle».
  const [title, setTitle] = useState("")
  // Esta línea sirve para crear el estado «description» y su función «setDescription».
  const [description, setDescription] = useState("")
  // Esta línea sirve para crear el estado «type» y su función «setType».
  const [type, setType] = useState<ChallengeType>("weekly")
  // Esta línea sirve para crear el estado «metric» y su función «setMetric».
  const [metric, setMetric] = useState<ChallengeMetric>("workouts_count")
  // Esta línea sirve para crear el estado «target» y su función «setTarget».
  const [target, setTarget] = useState("")
  // Esta línea sirve para crear el estado «formError» y su función «setFormError».
  const [formError, setFormError] = useState<string | null>(null)

  // Esta línea sirve para abrir la desestructuración de los resultados de la consulta.
  const {
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «templates».
    data: templates,
    // Esta línea sirve para incluir el valor «isLoading» en la lista.
    isLoading,
    // Esta línea sirve para declarar la propiedad «isError» con el valor o tipo «isLoadError».
    isError: isLoadError,
    // Esta línea sirve para incluir el valor «refetch» en la lista.
    refetch,
  // Esta línea sirve para cerrar la desestructuración y pedir las plantillas.
  } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "challenge-templates"]».
    queryKey: ["admin", "challenge-templates"],
    // Esta línea sirve para pedir las plantillas de reto a la API.
    queryFn: () => api.get<ChallengeTemplate[]>("/admin/challenge-templates"),
  })

  // Esta línea sirve para extraer «nvalidat» de «() => queryClient.invalidateQueries({ qu».
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "challenge-templates"] })

  // Esta línea sirve para obtener «createMutation» con el hook «useMutation».
  const createMutation = useMutation({
    // Esta línea sirve para declarar la propiedad «mutationFn» con el valor o tipo «() =>».
    mutationFn: () =>
      // Esta línea sirve para enviar la nueva plantilla a la API.
      api.post("/admin/challenge-templates", { code, title, description, type, metric, target: Number(target) }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «setCode» con «""».
      setCode("")
      // Esta línea sirve para llamar a «setTitle» con «""».
      setTitle("")
      // Esta línea sirve para llamar a «setDescription» con «""».
      setDescription("")
      // Esta línea sirve para llamar a «setTarget» con «""».
      setTarget("")
      // Esta línea sirve para llamar a «setFormError» con «null».
      setFormError(null)
      // Esta línea sirve para llamar a «invalidate».
      invalidate()
    },
    // Esta línea sirve para mostrar el mensaje de error de la API o uno genérico.
    onError: (err) => setFormError(err instanceof ApiError ? err.body.message : "No se pudo crear el reto."),
  })

  // Esta línea sirve para obtener «toggleActiveMutation» con el hook «useMutation».
  const toggleActiveMutation = useMutation({
    // Esta línea sirve para declarar la mutación que activa o desactiva una plantilla.
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      // Esta línea sirve para enviar a la API la activación o desactivación.
      api.patch(`/admin/challenge-templates/${id}/${isActive ? "deactivate" : "activate"}`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para extraer «anSubmi» de «code.trim() && title.trim() && descripti».
  const canSubmit = code.trim() && title.trim() && description.trim() && target.trim() && !createMutation.isPending

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Retos» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Retos</h1>

        {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm text-muted-foreground». */}
        <p className="text-sm text-muted-foreground">
          {/* Esta línea sirve para mostrar la explicación de cómo se generan los retos. */}
          Cada plantilla activa genera automáticamente un reto nuevo cada semana o mes (según su cadencia). Agregar
          una métrica distinta a las ya listadas todavía requiere desarrollo — acá solo se configuran instancias de
          las métricas existentes.
        </p>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Nueva plantilla» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium">Nueva plantilla</h2>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 grid grid-cols-2 gap-2». */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Código único (ej. weekly_5_sessions)».
              placeholder="Código único (ej. weekly_5_sessions)"
              // Esta línea sirve para pasar la propiedad «value» con el valor «code}».
              value={code}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setCode(e.target.value)}
              // Esta línea sirve para aplicar las clases de estilo «${inputClass} col-span-2».
              className={`${inputClass} col-span-2`}
            />
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Título».
              placeholder="Título"
              // Esta línea sirve para pasar la propiedad «value» con el valor «title}».
              value={title}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setTitle(e.target.value)}
              // Esta línea sirve para aplicar las clases de estilo «${inputClass} col-span-2».
              className={`${inputClass} col-span-2`}
            />
            {/* Esta línea sirve para abrir el elemento «textarea» con sus atributos en varias líneas. */}
            <textarea
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Descripción».
              placeholder="Descripción"
              // Esta línea sirve para pasar la propiedad «value» con el valor «description}».
              value={description}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setDescription(e.target.value)}
              // Esta línea sirve para aplicar las clases de estilo «${inputClass} col-span-2».
              className={`${inputClass} col-span-2`}
            />
            {/* Esta línea sirve para abrir el selector del tipo de reto. */}
            <select value={type} onChange={(e) => setType(e.target.value as ChallengeType)} className={inputClass}>
              {/* Esta línea sirve para recorrer «(Object.keys(TYPE_LABEL) as ChallengeType[])» y mostrar un bloque por elemento. */}
              {(Object.keys(TYPE_LABEL) as ChallengeType[]).map((t) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={t} value={t}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{TYPE_LABEL[t]}». */}
                  {TYPE_LABEL[t]}
                </option>
              ))}
            </select>
            {/* Esta línea sirve para abrir el selector de la métrica del reto. */}
            <select value={metric} onChange={(e) => setMetric(e.target.value as ChallengeMetric)} className={inputClass}>
              {/* Esta línea sirve para recorrer «(Object.keys(METRIC_LABEL) as ChallengeMetric[])» y mostrar un bloque por elemento. */}
              {(Object.keys(METRIC_LABEL) as ChallengeMetric[]).map((m) => (
                // Esta línea sirve para abrir el elemento «option».
                <option key={m} value={m}>
                  {/* Esta línea sirve para mostrar el contenido dinámico «{METRIC_LABEL[m]}». */}
                  {METRIC_LABEL[m]}
                </option>
              ))}
            </select>
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «type» con el valor «number».
              type="number"
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Objetivo».
              placeholder="Objetivo"
              // Esta línea sirve para pasar la propiedad «value» con el valor «target}».
              value={target}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setTarget(e.target.value)}
              // Esta línea sirve para aplicar las clases de estilo «${inputClass} col-span-2».
              className={`${inputClass} col-span-2`}
            />
          </div>
          {/* Esta línea sirve para mostrar el elemento solo si «formError». */}
          {formError && <p className="mt-2 text-xs text-destructive">{formError}</p>}
          {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
          <Button
            // Esta línea sirve para definir el atributo «size» con el valor «sm».
            size="sm"
            // Esta línea sirve para aplicar las clases de estilo «mt-3».
            className="mt-3"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={() => createMutation.mutate()}
            // Esta línea sirve para pasar la propiedad «disabled» con el valor «!canSubmit}».
            disabled={!canSubmit}
          >
            {/* Esta línea sirve para mostrar el texto «Crear plantilla». */}
            Crear plantilla
          </Button>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-20 w-full" />}

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadError». */}
          {isLoadError && (
            // Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col items-start gap-2».
            <div className="flex flex-col items-start gap-2">
              {/* Esta línea sirve para mostrar el texto «No se pudieron cargar las plantillas.» dentro de un «p». */}
              <p className="text-sm text-destructive">No se pudieron cargar las plantillas.</p>
              {/* Esta línea sirve para abrir el botón que reintenta la carga. */}
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {/* Esta línea sirve para mostrar el texto «Reintentar». */}
                Reintentar
              </Button>
            </div>
          )}

          {/* Esta línea sirve para mostrar el bloque solo si «toggleActiveMutation.isError». */}
          {toggleActiveMutation.isError && (
            // Esta línea sirve para mostrar el valor «toggleActiveMutation.error.message» dentro de un «p».
            <p className="mb-2 text-xs text-destructive">{toggleActiveMutation.error.message}</p>
          )}

          {/* Esta línea sirve para abrir el elemento «ul» con las clases «flex flex-col gap-3». */}
          <ul className="flex flex-col gap-3">
            {/* Esta línea sirve para recorrer «templates?» y mostrar un bloque por elemento. */}
            {templates?.map((template) => (
              // Esta línea sirve para abrir el elemento «li».
              <li key={template.id} className="rounded-lg border border-border p-3">
                {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-start justify-betwe». */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  {/* Esta línea sirve para abrir el elemento «div» con las clases «min-w-0 flex-1 basis-48». */}
                  <div className="min-w-0 flex-1 basis-48">
                    {/* Esta línea sirve para abrir el elemento «p» con las clases «text-sm font-medium». */}
                    <p className="text-sm font-medium">
                      {/* Esta línea sirve para mostrar el contenido dinámico «{template.title}{" "}». */}
                      {template.title}{" "}
                      {/* Esta línea sirve para mostrar el código de la plantilla. */}
                      <span className="text-xs font-normal text-muted-foreground">({template.code})</span>
                    </p>
                    {/* Esta línea sirve para mostrar el valor «template.description» dentro de un «p». */}
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground». */}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {/* Esta línea sirve para mostrar el tipo, la métrica y el objetivo de la plantilla. */}
                      {TYPE_LABEL[template.type]} · {METRIC_LABEL[template.metric]} · objetivo {template.target}
                    </p>
                    {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground». */}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {/* Esta línea sirve para mostrar el contenido dinámico «{template.is_active ? "Activa" : "Inactiva"}». */}
                      {template.is_active ? "Activa" : "Inactiva"}
                    </p>
                  </div>
                  {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                  <Button
                    // Esta línea sirve para definir el atributo «size» con el valor «sm».
                    size="sm"
                    // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                    variant="outline"
                    // Esta línea sirve para aplicar las clases de estilo «shrink-0».
                    className="shrink-0"
                    // Esta línea sirve para asignar el manejador del evento «onClick».
                    onClick={() => toggleActiveMutation.mutate({ id: template.id, isActive: template.is_active })}
                    // Esta línea sirve para pasar la propiedad «disabled» con el valor «toggleActiveMutation.isPending}».
                    disabled={toggleActiveMutation.isPending}
                  >
                    {/* Esta línea sirve para mostrar el contenido dinámico «{template.is_active ? "Desactivar" : "Activar"}». */}
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
