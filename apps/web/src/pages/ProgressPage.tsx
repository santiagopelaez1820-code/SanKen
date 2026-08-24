import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Container } from "react-bootstrap"
import type { DashboardStats } from "@sanken/core"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { MuscleVolumeChart } from "@/components/dashboard/MuscleVolumeChart"
import { ProgressChart } from "@/components/dashboard/ProgressChart"
import { RecentPRsRow } from "@/components/dashboard/RecentPRsRow"
import { WorkoutHistoryList } from "@/components/dashboard/WorkoutHistoryList"
import { BodyMeasurementsPanel } from "@/components/dashboard/BodyMeasurementsPanel"
import { fadeInUp, staggerContainer } from "@/lib/motion"

export function ProgressPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: () => api.get<DashboardStats>("/stats/dashboard"),
  })

  return (
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 1080 }}>
      <motion.div className="d-flex flex-column gap-4" variants={staggerContainer()} initial="hidden" animate="show">
        <motion.div variants={fadeInUp}>
          <p className="sank-eyebrow sank-eyebrow--orange mb-1">Progreso</p>
          {isLoading ? (
            <Skeleton style={{ height: 64, width: 220 }} />
          ) : (
            <div className="d-flex align-items-baseline gap-3 flex-wrap">
              <span className="display-2 sank-stat">{stats?.total_hours ?? 0}h</span>
              <span className="text-body-secondary">entrenadas en total</span>
            </div>
          )}
          <div className="d-flex gap-4 mt-2">
            <p className="small text-body-secondary mb-0">
              <span className="fw-bold sank-tabular-nums text-white">{stats?.total_sets ?? 0}</span> series
            </p>
            <p className="small text-body-secondary mb-0">
              <span className="fw-bold sank-tabular-nums text-white">{((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)}t</span> movidas
            </p>
            <p className="small text-body-secondary mb-0">
              <span className="fw-bold sank-tabular-nums text-white">{stats?.current_streak_days ?? 0}</span> días de racha
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <ProgressChart />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <MuscleVolumeChart />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <RecentPRsRow records={stats?.recent_personal_records ?? []} />
        </motion.div>

        <motion.div className="row g-3" variants={fadeInUp}>
          <div className="col-12 col-lg-6">
            <WorkoutHistoryList />
          </div>
          <div className="col-12 col-lg-6">
            <BodyMeasurementsPanel />
          </div>
        </motion.div>
      </motion.div>
    </Container>
  )
}
