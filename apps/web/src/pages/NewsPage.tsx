import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { NewsPromotion } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"

export function NewsPage() {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: () => api.get<NewsPromotion[]>("/news"),
  })

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Novedades</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Volver</Link>
          </Button>
        </header>

        {isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
        {!isLoading && news?.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay novedades por ahora.</p>
        )}

        <div className="flex flex-col gap-4">
          {news?.map((item) => (
            <article key={item.id} className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-heading text-lg font-medium">{item.title}</h2>
              {item.published_at && (
                <p className="text-xs text-muted-foreground">
                  {new Date(item.published_at).toLocaleDateString("es-AR")}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
