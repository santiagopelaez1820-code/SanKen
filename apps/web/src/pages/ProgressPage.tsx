// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Container» desde «react-bootstrap».
import { Container } from "react-bootstrap"
// Esta línea sirve para importar los tipos «DashboardStats» desde «@sanken/core».
import type { DashboardStats } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «MuscleVolumeChart» desde «@/components/dashboard/MuscleVolumeChart».
import { MuscleVolumeChart } from "@/components/dashboard/MuscleVolumeChart"
// Esta línea sirve para importar «ProgressChart» desde «@/components/dashboard/ProgressChart».
import { ProgressChart } from "@/components/dashboard/ProgressChart"
// Esta línea sirve para importar «RecentPRsRow» desde «@/components/dashboard/RecentPRsRow».
import { RecentPRsRow } from "@/components/dashboard/RecentPRsRow"
// Esta línea sirve para importar «WorkoutHistoryList» desde «@/components/dashboard/WorkoutHistoryList».
import { WorkoutHistoryList } from "@/components/dashboard/WorkoutHistoryList"
// Esta línea sirve para importar «BodyMeasurementsPanel» desde «@/components/dashboard/BodyMeasurementsPanel».
import { BodyMeasurementsPanel } from "@/components/dashboard/BodyMeasurementsPanel"
// Esta línea sirve para importar «fadeInUp, staggerContainer» desde «@/lib/motion».
import { fadeInUp, staggerContainer } from "@/lib/motion"

// Esta línea sirve para declarar la función «ProgressPage».
export function ProgressPage() {
  // Esta línea sirve para obtener «data: stats, isLoading» con el hook «useQuery».
  const { data: stats, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["stats", "dashboard"]».
    queryKey: ["stats", "dashboard"],
    // Esta línea sirve para pedir a la API los datos de «/stats/dashboard».
    queryFn: () => api.get<DashboardStats>("/stats/dashboard"),
  })

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Container».
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 1080 }}>
      {/* Esta línea sirve para abrir el elemento «motion.div» con las clases «d-flex flex-column gap-4». */}
      <motion.div className="d-flex flex-column gap-4" variants={staggerContainer()} initial="hidden" animate="show">
        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para mostrar el texto «Progreso» dentro de un «p». */}
          <p className="sank-eyebrow sank-eyebrow--cyan mb-1">Progreso</p>
          {/* Esta línea sirve para elegir entre dos bloques según «isLoading». */}
          {isLoading ? (
            // Esta línea sirve para abrir el componente «Skeleton».
            <Skeleton style={{ height: 64, width: 220 }} />
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-baseline gap-3 flex-w».
            <div className="d-flex align-items-baseline gap-3 flex-wrap">
              {/* Esta línea sirve para abrir el elemento «span» con sus propiedades. */}
              <span className="display-2 sank-stat">{stats?.total_hours ?? 0}h</span>
              {/* Esta línea sirve para mostrar el texto «entrenadas en total» dentro de un «span». */}
              <span className="text-body-secondary">entrenadas en total</span>
            </div>
          )}
          {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex gap-4 mt-2». */}
          <div className="d-flex gap-4 mt-2">
            {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0». */}
            <p className="small text-body-secondary mb-0">
              {/* Esta línea sirve para mostrar el total de series. */}
              <span className="fw-bold sank-tabular-nums text-white">{stats?.total_sets ?? 0}</span> series
            </p>
            {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0». */}
            <p className="small text-body-secondary mb-0">
              {/* Esta línea sirve para mostrar el volumen total en toneladas. */}
              <span className="fw-bold sank-tabular-nums text-white">{((stats?.total_volume_kg ?? 0) / 1000).toFixed(1)}t</span> movidas
            </p>
            {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0». */}
            <p className="small text-body-secondary mb-0">
              {/* Esta línea sirve para mostrar los días de racha actual. */}
              <span className="fw-bold sank-tabular-nums text-white">{stats?.current_streak_days ?? 0}</span> días de racha
            </p>
          </div>
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el componente «ProgressChart». */}
          <ProgressChart />
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el componente «MuscleVolumeChart». */}
          <MuscleVolumeChart />
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el componente «RecentPRsRow». */}
          <RecentPRsRow records={stats?.recent_personal_records ?? []} />
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div» con las clases «row g-3». */}
        <motion.div className="row g-3" variants={fadeInUp}>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «col-12 col-lg-6». */}
          <div className="col-12 col-lg-6">
            {/* Esta línea sirve para abrir el componente «WorkoutHistoryList». */}
            <WorkoutHistoryList />
          </div>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «col-12 col-lg-6». */}
          <div className="col-12 col-lg-6">
            {/* Esta línea sirve para abrir el componente «BodyMeasurementsPanel». */}
            <BodyMeasurementsPanel />
          </div>
        </motion.div>
      </motion.div>
    </Container>
  )
}
