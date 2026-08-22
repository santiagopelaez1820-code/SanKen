import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { NewsPromotion } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminNewsPage() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const {
    data: news,
    isLoading,
    isError: isLoadError,
    refetch,
  } = useQuery({
    queryKey: ["admin", "news"],
    queryFn: () => api.get<NewsPromotion[]>("/admin/news"),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "news"] })

  const createMutation = useMutation({
    mutationFn: () => api.post("/admin/news", { title, body }),
    onSuccess: () => {
      setTitle("")
      setBody("")
      invalidate()
    },
  })

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      api.patch(`/admin/news/${id}`, { published }),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/news/${id}`),
    onSuccess: invalidate,
  })

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Noticias</h1>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-sm font-medium">Nueva noticia</h2>
          <div className="mt-3 flex flex-col gap-2">
            <input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            <textarea
              placeholder="Contenido"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
            />
            <Button
              size="sm"
              className="self-start"
              onClick={() => createMutation.mutate()}
              disabled={!title.trim() || !body.trim() || createMutation.isPending}
            >
              Crear borrador
            </Button>
            {createMutation.isError && (
              <p className="text-xs text-destructive">{createMutation.error.message}</p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          {isLoading && <Skeleton className="h-20 w-full" />}

          {isLoadError && (
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-destructive">No se pudieron cargar las noticias.</p>
              <Button size="sm" variant="outline" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          )}

          {(togglePublishMutation.isError || deleteMutation.isError) && (
            <p className="mb-2 text-xs text-destructive">
              {(togglePublishMutation.error ?? deleteMutation.error)?.message}
            </p>
          )}

          <ul className="flex flex-col gap-3">
            {news?.map((item) => (
              <li key={item.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.published ? "Publicada" : "Borrador"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublishMutation.mutate({ id: item.id, published: !item.published })}
                      disabled={togglePublishMutation.isPending}
                    >
                      {item.published ? "Despublicar" : "Publicar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(item.id)}
                      disabled={deleteMutation.isPending}
                    >
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
