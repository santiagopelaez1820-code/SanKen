import { useQuery } from "@tanstack/react-query"
import { Clock, Flame, ListChecks, Weight } from "lucide-react"
import type { DashboardStats } from "@sanken/core"
import { api } from "@/lib/api"
import { MetricCard } from "@/components/ui/metric-card"
import { Skeleton } from "@/components/ui/skeleton"
import { MuscleVolumeChart } from "@/components/dashboard/MuscleVolumeChart"
import { ProgressChart } from "@/components/dashboard/ProgressChart"
import { RecentPRsList } from "@/components/dashboard/RecentPRsList"
import { WorkoutHistoryList } from "@/components/dashboard/WorkoutHistoryList"
import { BodyMeasurementsPanel } from "@/components/dashboard/BodyMeasurementsPanel"

export function ProgressPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: () => api.get<DashboardStats>("/stats/dashboard"),
  })

  return (
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-secondary-accent uppercase">Progreso</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Tu progreso</h1>
          <p className="mt-1 text-sm text-muted-foreground">Datos acumulados y evolución por semana o mes.</p>
        </div>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          ) : (
            <>
              <MetricCard icon={Clock} label="Horas entrenadas" value={`${stats?.total_hours ?? 0} h`} />
              <MetricCard icon={ListChecks} label="Series totales" value={`${stats?.total_sets ?? 0}`} />
              <MetricCard
                icon={Weight}
                label="Toneladas movidas"
                value={`${((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)} t`}
              />
              <MetricCard
                icon={Flame}
                label="Racha actual"
                value={`${stats?.current_streak_days ?? 0} días`}
                tone="primary"
              />
            </>
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MuscleVolumeChart />
          <ProgressChart />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <RecentPRsList records={stats?.recent_personal_records ?? []} />
          <WorkoutHistoryList />
          <BodyMeasurementsPanel />
        </section>
      </div>
    </main>
  )
}
