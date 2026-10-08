// Esta línea sirve para importar los tipos «DashboardStats, GamificationSummary» desde «@sanken/core».
import type { DashboardStats, GamificationSummary } from "@sanken/core"
// Esta línea sirve para importar «MetricRing» desde «@/components/ui/metric-ring».
import { MetricRing } from "@/components/ui/metric-ring"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la interfaz «PerformanceHeroProps».
interface PerformanceHeroProps {
  // Esta línea sirve para declarar la propiedad «stats» con el valor o tipo «DashboardStats».
  stats?: DashboardStats
  // Esta línea sirve para declarar la propiedad «gamification» con el valor o tipo «GamificationSummary».
  gamification?: GamificationSummary
  // Esta línea sirve para declarar la propiedad «isLoading» con el valor o tipo «boolean».
  isLoading: boolean
}

// Esta línea sirve para declarar el componente del resumen de rendimiento.
export function PerformanceHero({ stats, gamification, isLoading }: PerformanceHeroProps) {
  // Esta línea sirve para revisar si aún se están cargando los datos.
  if (isLoading) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «div» con las clases «row g-2».
      <div className="row g-2">
        {/* Esta línea sirve para mostrar un esqueleto de la columna izquierda. */}
        <div className="col-5"><Skeleton style={{ height: 132, width: "100%" }} /></div>
        {/* Esta línea sirve para mostrar un esqueleto de la columna derecha. */}
        <div className="col-7"><Skeleton style={{ height: 132, width: "100%" }} /></div>
      </div>
    )
  }

  // Esta línea sirve para calcular el porcentaje de progreso de nivel.
  const progressPct = Math.round((gamification?.progress_pct ?? 0) * 100)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «row g-2».
    <div className="row g-2">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «col-12 col-sm-5». */}
      <div className="col-12 col-sm-5">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 h-100 p-4 d-flex ». */}
        <div className="sank-surface rounded-2 h-100 p-4 d-flex align-items-center gap-3">
          {/* Esta línea sirve para abrir el elemento «MetricRing» con sus atributos en varias líneas. */}
          <MetricRing
            // Esta línea sirve para pasar la propiedad «value» con el valor «gamification?.progress_pct ?? 0}».
            value={gamification?.progress_pct ?? 0}
            // Esta línea sirve para pasar la propiedad «max» con el valor «1}».
            max={1}
            // Esta línea sirve para pasar la propiedad «size» con el valor «72}».
            size={72}
            // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «6}».
            strokeWidth={6}
            // Esta línea sirve para definir el atributo «label» con el valor «».
            label=""
            // Esta línea sirve para pasar la propiedad «valueLabel» con el valor «`${gamification?.level ?? 1}`}».
            valueLabel={`${gamification?.level ?? 1}`}
          />
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el nivel y su porcentaje. */}
            <p className="sank-eyebrow mb-1">Nivel · {progressPct}%</p>
            {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-0». */}
            <p className="small text-body-secondary mb-0">
              {/* Esta línea sirve para mostrar la experiencia actual y la necesaria para el siguiente nivel. */}
              {gamification?.total_xp ?? 0} / {gamification?.xp_for_next_level ?? 100} XP
            </p>
          </div>
        </div>
      </div>

      {/* Esta línea sirve para abrir el elemento «div» con las clases «col-12 col-sm-7». */}
      <div className="col-12 col-sm-7">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 h-100 p-4 d-flex ». */}
        <div className="sank-surface rounded-2 h-100 p-4 d-flex align-items-center justify-content-between">
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar los días de racha actual. */}
            <div className="display-6 sank-stat">{stats?.current_streak_days ?? 0}</div>
            {/* Esta línea sirve para mostrar la etiqueta de racha. */}
            <p className="sank-eyebrow mb-0">Racha</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el total de series. */}
            <div className="display-6 sank-stat">{stats?.total_sets ?? 0}</div>
            {/* Esta línea sirve para mostrar la etiqueta de series. */}
            <p className="sank-eyebrow mb-0">Series</p>
          </div>
          {/* Esta línea sirve para abrir el elemento «div». */}
          <div>
            {/* Esta línea sirve para mostrar el total de horas. */}
            <div className="display-6 sank-stat">{stats?.total_hours ?? 0}</div>
            {/* Esta línea sirve para mostrar la etiqueta de horas. */}
            <p className="sank-eyebrow mb-0">Horas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
