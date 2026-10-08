// Esta línea sirve para importar «useState» desde «react».
import { useState } from "react"
// Esta línea sirve para importar «useMutation, useQuery, useQueryClient» desde «@tanstack/react-query».
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar los tipos «NewsPromotion» desde «@sanken/core».
import type { NewsPromotion } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Button» desde «@/components/ui/button».
import { Button } from "@/components/ui/button"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la función «AdminNewsPage».
export function AdminNewsPage() {
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para crear el estado «title» y su función «setTitle».
  const [title, setTitle] = useState("")
  // Esta línea sirve para crear el estado «body» y su función «setBody».
  const [body, setBody] = useState("")

  // Esta línea sirve para abrir la desestructuración de los resultados de la consulta.
  const {
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «news».
    data: news,
    // Esta línea sirve para incluir el valor «isLoading» en la lista.
    isLoading,
    // Esta línea sirve para declarar la propiedad «isError» con el valor o tipo «isLoadError».
    isError: isLoadError,
    // Esta línea sirve para incluir el valor «refetch» en la lista.
    refetch,
  // Esta línea sirve para cerrar la desestructuración y pedir las novedades.
  } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["admin", "news"]».
    queryKey: ["admin", "news"],
    // Esta línea sirve para declarar la propiedad «queryFn» con el valor o tipo «() => api.get<NewsPromotion[]>("/admin/news")».
    queryFn: () => api.get<NewsPromotion[]>("/admin/news"),
  })

  // Esta línea sirve para extraer «nvalidat» de «() => queryClient.invalidateQueries({ qu».
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "news"] })

  // Esta línea sirve para obtener «createMutation» con el hook «useMutation».
  const createMutation = useMutation({
    // Esta línea sirve para enviar la nueva novedad a la API.
    mutationFn: () => api.post("/admin/news", { title, body }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «() => {».
    onSuccess: () => {
      // Esta línea sirve para llamar a «setTitle» con «""».
      setTitle("")
      // Esta línea sirve para llamar a «setBody» con «""».
      setBody("")
      // Esta línea sirve para llamar a «invalidate».
      invalidate()
    },
  })

  // Esta línea sirve para obtener «togglePublishMutation» con el hook «useMutation».
  const togglePublishMutation = useMutation({
    // Esta línea sirve para declarar la mutación que publica u oculta una novedad.
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      // Esta línea sirve para enviar a la API el nuevo estado de publicación.
      api.patch(`/admin/news/${id}`, { published }),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para obtener «deleteMutation» con el hook «useMutation».
  const deleteMutation = useMutation({
    // Esta línea sirve para enviar la petición de borrado de la novedad.
    mutationFn: (id: number) => api.delete(`/admin/news/${id}`),
    // Esta línea sirve para declarar la propiedad «onSuccess» con el valor o tipo «invalidate».
    onSuccess: invalidate,
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «main» con las clases «px-4 py-6 sm:px-6 sm:py-8».
    <main className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «mx-auto flex max-w-3xl flex-col gap-6». */}
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Esta línea sirve para mostrar el texto «Noticias» dentro de un «h1». */}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Noticias</h1>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el texto «Nueva noticia» dentro de un «h2». */}
          <h2 className="font-heading text-sm font-medium">Nueva noticia</h2>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex flex-col gap-2». */}
          <div className="mt-3 flex flex-col gap-2">
            {/* Esta línea sirve para abrir el elemento «input» con sus atributos en varias líneas. */}
            <input
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Título».
              placeholder="Título"
              // Esta línea sirve para pasar la propiedad «value» con el valor «title}».
              value={title}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setTitle(e.target.value)}
              // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            {/* Esta línea sirve para abrir el elemento «textarea» con sus atributos en varias líneas. */}
            <textarea
              // Esta línea sirve para definir el atributo «placeholder» con el valor «Contenido».
              placeholder="Contenido"
              // Esta línea sirve para pasar la propiedad «value» con el valor «body}».
              value={body}
              // Esta línea sirve para asignar el manejador del evento «onChange».
              onChange={(e) => setBody(e.target.value)}
              // Esta línea sirve para aplicar las clases de estilo «rounded-lg border border-input bg-background ».
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
            <Button
              // Esta línea sirve para definir el atributo «size» con el valor «sm».
              size="sm"
              // Esta línea sirve para aplicar las clases de estilo «self-start».
              className="self-start"
              // Esta línea sirve para asignar el manejador del evento «onClick».
              onClick={() => createMutation.mutate()}
              // Esta línea sirve para pasar la propiedad «disabled» con el valor «!title.trim() || !body.trim() || createMutati».
              disabled={!title.trim() || !body.trim() || createMutation.isPending}
            >
              {/* Esta línea sirve para mostrar el texto «Crear borrador». */}
              Crear borrador
            </Button>
            {/* Esta línea sirve para mostrar el bloque solo si «createMutation.isError». */}
            {createMutation.isError && (
              // Esta línea sirve para mostrar el valor «createMutation.error.message» dentro de un «p».
              <p className="text-xs text-destructive">{createMutation.error.message}</p>
            )}
          </div>
        </section>

        {/* Esta línea sirve para abrir el elemento «section» con las clases «rounded-xl border border-border bg-card ». */}
        <section className="rounded-xl border border-border bg-card p-5">
          {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
          {isLoading && <Skeleton className="h-20 w-full" />}

          {/* Esta línea sirve para mostrar el bloque solo si «isLoadError». */}
          {isLoadError && (
            // Esta línea sirve para abrir el elemento «div» con las clases «flex flex-col items-start gap-2».
            <div className="flex flex-col items-start gap-2">
              {/* Esta línea sirve para mostrar el texto «No se pudieron cargar las noticias.» dentro de un «p». */}
              <p className="text-sm text-destructive">No se pudieron cargar las noticias.</p>
              {/* Esta línea sirve para abrir el botón que reintenta la carga. */}
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                {/* Esta línea sirve para mostrar el texto «Reintentar». */}
                Reintentar
              </Button>
            </div>
          )}

          {/* Esta línea sirve para mostrar el error si falló publicar o borrar. */}
          {(togglePublishMutation.isError || deleteMutation.isError) && (
            // Esta línea sirve para abrir el elemento «p» con las clases «mb-2 text-xs text-destructive».
            <p className="mb-2 text-xs text-destructive">
              {/* Esta línea sirve para mostrar el mensaje del error ocurrido. */}
              {(togglePublishMutation.error ?? deleteMutation.error)?.message}
            </p>
          )}

          {/* Esta línea sirve para abrir el elemento «ul» con las clases «flex flex-col gap-3». */}
          <ul className="flex flex-col gap-3">
            {/* Esta línea sirve para recorrer «news?» y mostrar un bloque por elemento. */}
            {news?.map((item) => (
              // Esta línea sirve para abrir el elemento «li».
              <li key={item.id} className="rounded-lg border border-border p-3">
                {/* Esta línea sirve para abrir el elemento «div» con las clases «flex flex-wrap items-start justify-betwe». */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  {/* Esta línea sirve para abrir el elemento «div» con las clases «min-w-0 flex-1 basis-48». */}
                  <div className="min-w-0 flex-1 basis-48">
                    {/* Esta línea sirve para mostrar el valor «item.title» dentro de un «p». */}
                    <p className="text-sm font-medium">{item.title}</p>
                    {/* Esta línea sirve para mostrar el valor «item.body» dentro de un «p». */}
                    <p className="text-xs text-muted-foreground">{item.body}</p>
                    {/* Esta línea sirve para abrir el elemento «p» con las clases «mt-1 text-xs text-muted-foreground». */}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {/* Esta línea sirve para mostrar el contenido dinámico «{item.published ? "Publicada" : "Borrador"}». */}
                      {item.published ? "Publicada" : "Borrador"}
                    </p>
                  </div>
                  {/* Esta línea sirve para abrir el elemento «div» con las clases «flex shrink-0 flex-wrap gap-2». */}
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                    <Button
                      // Esta línea sirve para definir el atributo «size» con el valor «sm».
                      size="sm"
                      // Esta línea sirve para definir el atributo «variant» con el valor «outline».
                      variant="outline"
                      // Esta línea sirve para asignar el manejador del evento «onClick».
                      onClick={() => togglePublishMutation.mutate({ id: item.id, published: !item.published })}
                      // Esta línea sirve para pasar la propiedad «disabled» con el valor «togglePublishMutation.isPending}».
                      disabled={togglePublishMutation.isPending}
                    >
                      {/* Esta línea sirve para mostrar el contenido dinámico «{item.published ? "Despublicar" : "Publicar"}». */}
                      {item.published ? "Despublicar" : "Publicar"}
                    </Button>
                    {/* Esta línea sirve para abrir el elemento «Button» con sus atributos en varias líneas. */}
                    <Button
                      // Esta línea sirve para definir el atributo «size» con el valor «sm».
                      size="sm"
                      // Esta línea sirve para definir el atributo «variant» con el valor «destructive».
                      variant="destructive"
                      // Esta línea sirve para asignar el manejador del evento «onClick».
                      onClick={() => deleteMutation.mutate(item.id)}
                      // Esta línea sirve para pasar la propiedad «disabled» con el valor «deleteMutation.isPending}».
                      disabled={deleteMutation.isPending}
                    >
                      {/* Esta línea sirve para mostrar el texto «Borrar». */}
                      Borrar
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
