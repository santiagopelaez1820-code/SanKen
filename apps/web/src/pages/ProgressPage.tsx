import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
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
import { fadeInUp, staggerContainer } from "@/lib/motion"

export function ProgressPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: () => api.get<DashboardStats>("/stats/dashboard"),
  })

  return (
    <main className="px-6 py-8">
      <motion.div
        className="mx-auto flex max-w-5xl flex-col gap-6"
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeInUp}>
          <p className="text-xs font-semibold tracking-widest text-secondary-accent uppercase">Progreso</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Tu progreso</h1>
          <p className="mt-1 text-sm text-muted-foreground">Datos acumulados y evolución por semana o mes.</p>
        </motion.div>

        <motion.section
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          variants={staggerContainer(0.05)}
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          ) : (
            <>
              <motion.div variants={fadeInUp}>
                <MetricCard icon={Clock} label="Horas entrenadas" value={`${stats?.total_hours ?? 0} h`} />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <MetricCard icon={ListChecks} label="Series totales" value={`${stats?.total_sets ?? 0}`} />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <MetricCard
                  icon={Weight}
                  label="Toneladas movidas"
                  value={`${((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)} t`}
                />
              </motion.div>
              <motion.div variants={fadeInUp}>
                <MetricCard
                  icon={Flame}
                  label="Racha actual"
                  value={`${stats?.current_streak_days ?? 0} días`}
                  tone="primary"
                />
              </motion.div>
            </>
          )}
        </motion.section>

        <motion.section className="grid grid-cols-1 gap-4 lg:grid-cols-2" variants={fadeInUp}>
          <MuscleVolumeChart />
          <ProgressChart />
        </motion.section>

        <motion.section className="grid grid-cols-1 gap-4 lg:grid-cols-3" variants={fadeInUp}>
          <RecentPRsList records={stats?.recent_personal_records ?? []} />
          <WorkoutHistoryList />
          <BodyMeasurementsPanel />
        </motion.section>
      </motion.div>
    </main>
  )
}
