import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { RankingResponse, RankingScope } from "@sanken/core"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RankingList } from "@/components/rankings/RankingList"

const SCOPES: { value: RankingScope; label: string }[] = [
  { value: "global", label: "Global" },
  { value: "city", label: "Ciudad" },
  { value: "country", label: "País" },
  { value: "gym", label: "Gimnasio" },
  { value: "age_bracket", label: "Edad" },
  { value: "sex", label: "Sexo" },
  { value: "strength_category", label: "Fuerza" },
]

function RankingTabPanel({ scope }: { scope: RankingScope }) {
  const { data, isLoading } = useQuery({
    queryKey: ["rankings", scope],
    queryFn: () => api.get<RankingResponse>(`/rankings?scope=${scope}`),
  })

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando…</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {data?.scope_label && <p className="text-xs text-muted-foreground">{data.scope_label}</p>}
      <RankingList entries={data?.entries ?? []} viewer={data?.viewer ?? null} />
    </div>
  )
}

export function RankingsPage() {
  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-medium tracking-tight">Rankings</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">Volver</Link>
          </Button>
        </header>

        <Tabs defaultValue="global">
          <TabsList>
            {SCOPES.map((s) => (
              <TabsTrigger key={s.value} value={s.value}>
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {SCOPES.map((s) => (
            <TabsContent key={s.value} value={s.value}>
              <RankingTabPanel scope={s.value} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
