import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import type { DashboardStats, GamificationSummary } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { StatTile } from "@/components/dashboard/StatTile"
import { NextWorkoutCard } from "@/components/dashboard/NextWorkoutCard"
import { MuscleVolumeChart } from "@/components/dashboard/MuscleVolumeChart"
import { ProgressChart } from "@/components/dashboard/ProgressChart"
import { RecentPRsList } from "@/components/dashboard/RecentPRsList"
import { WorkoutHistoryList } from "@/components/dashboard/WorkoutHistoryList"
import { BodyMeasurementsPanel } from "@/components/dashboard/BodyMeasurementsPanel"
import { XpLevelCard } from "@/components/dashboard/XpLevelCard"
import { AchievementsList } from "@/components/dashboard/AchievementsList"
import { useFeed } from "@/hooks/use-feed"

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const { unreadCount } = useFeed()

  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: () => api.get<DashboardStats>("/stats/dashboard"),
  })

  const { data: gamification, isLoading: isLoadingGamification } = useQuery({
    queryKey: ["gamification"],
    queryFn: () => api.get<GamificationSummary>("/gamification"),
  })

  return (
    <main className="min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-9 w-9" />
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight">SANKEN</h1>
              <p className="text-sm text-muted-foreground">Hola, {user?.name ?? "atleta"}.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {user?.role === "trainer" && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/trainer">Mis clientes</Link>
              </Button>
            )}
            {user?.role !== "trainer" && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/my-trainer">Mi entrenador</Link>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/chat">Chat</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/prs">PR y Rankings</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/challenges">Retos</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/calendar">Calendario</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/nutrition">Nutrición</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/feed">{unreadCount > 0 ? `Novedades (${unreadCount})` : "Novedades"}</Link>
            </Button>
            {user?.role === "super_admin" && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">Super Admin</Link>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings">Configuración</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={clearSession}>
              Cerrar sesión
            </Button>
          </div>
        </header>

        <NextWorkoutCard />

        <XpLevelCard summary={gamification} isLoading={isLoadingGamification} />

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label="Horas entrenadas" value={isLoading ? "…" : `${stats?.total_hours ?? 0} h`} />
          <StatTile label="Series totales" value={isLoading ? "…" : `${stats?.total_sets ?? 0}`} />
          <StatTile
            label="Toneladas movidas"
            value={isLoading ? "…" : `${((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)} t`}
          />
          <StatTile
            label="Racha actual"
            value={isLoading ? "…" : `${stats?.current_streak_days ?? 0} días`}
            hint={stats && stats.current_streak_days > 0 ? "¡Sigue así!" : undefined}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MuscleVolumeChart />
          <ProgressChart />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <RecentPRsList records={stats?.recent_personal_records ?? []} />
          </div>
          <div className="lg:col-span-1">
            <WorkoutHistoryList />
          </div>
          <div className="lg:col-span-1">
            <BodyMeasurementsPanel />
          </div>
        </section>

        <section>
          <AchievementsList
            achievements={[
              ...(gamification?.unlocked_achievements ?? []),
              ...(gamification?.locked_achievements ?? []),
            ]}
          />
        </section>
      </div>
    </main>
  )
}
