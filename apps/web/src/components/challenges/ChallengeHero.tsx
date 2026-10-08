// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar los tipos «Challenge» desde «@sanken/core».
import type { Challenge } from "@sanken/core"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «ChallengeLeaderboard» desde «@/components/challenges/ChallengeLeaderboard».
import { ChallengeLeaderboard } from "@/components/challenges/ChallengeLeaderboard"

// Esta línea sirve para declarar la unidad de medida de cada métrica de reto.
const METRIC_LABEL: Record<Challenge["criteria"]["metric"], string> = {
  // Esta línea sirve para declarar la propiedad «workouts_count» con el valor o tipo «"entrenamientos"».
  workouts_count: "entrenamientos",
  // Esta línea sirve para declarar la propiedad «total_volume_kg» con el valor o tipo «"kg de volumen"».
  total_volume_kg: "kg de volumen",
}

// Esta línea sirve para declarar la función que calcula los días que faltan para terminar.
function daysRemaining(endsAt: string): number {
  // Esta línea sirve para calcular los milisegundos que faltan.
  const ms = new Date(endsAt).getTime() - Date.now()
  // Esta línea sirve para devolver los días restantes, nunca negativos.
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

// Esta línea sirve para declarar la interfaz «ChallengeHeroProps».
interface ChallengeHeroProps {
  // Esta línea sirve para declarar la propiedad «challenge» con el valor o tipo «Challenge».
  challenge: Challenge
  // Esta línea sirve para declarar la propiedad «expanded» con el valor o tipo «boolean».
  expanded: boolean
  // Esta línea sirve para declarar la propiedad «onToggle» con el valor o tipo «() => void».
  onToggle: () => void
  // Esta línea sirve para declarar la propiedad «onJoin» con el valor o tipo «() => void».
  onJoin: () => void
}

// Esta línea sirve para declarar el componente destacado del reto principal.
export function ChallengeHero({ challenge, expanded, onToggle, onJoin }: ChallengeHeroProps) {
  // Esta línea sirve para calcular el porcentaje de progreso.
  const progressPct = challenge.progress_value !== null
    // Esta línea sirve para limitar el porcentaje a un máximo de 100.
    ? Math.min(100, Math.round((challenge.progress_value / challenge.criteria.target) * 100))
    // Esta línea sirve para usar cero si el usuario no tiene progreso.
    : 0
  // Esta línea sirve para calcular los días que faltan.
  const daysLeft = daysRemaining(challenge.ends_at)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
    <div
      // Esta línea sirve para aplicar las clases de estilo «position-relative overflow-hidden rounded-2 s».
      className="position-relative overflow-hidden rounded-2 sank-hairline p-4 p-sm-5 text-center"
      // Esta línea sirve para pasar la propiedad «style» con el valor «{».
      style={{
        // Esta línea sirve para definir el fondo del contenedor.
        background:
          // Esta línea sirve para usar un degradado radial sobre el color base.
          "radial-gradient(80% 100% at 50% 0%, rgba(0,184,217,0.16), transparent 60%), var(--sanken-black-2)",
        // Esta línea sirve para definir la sombra del contenedor.
        boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 28px 60px -24px rgba(0,0,0,0.7)",
      }}
    >
      {/* Esta línea sirve para abrir el elemento «p» con las clases «sank-eyebrow sank-eyebrow--cyan mb-2». */}
      <p className="sank-eyebrow sank-eyebrow--cyan mb-2">
        {/* Esta línea sirve para mostrar si el reto es semanal o mensual. */}
        {challenge.type === "weekly" ? "Reto semanal" : "Reto mensual"}
      </p>
      {/* Esta línea sirve para mostrar el título del reto. */}
      <h1 className="display-4 sank-stat mb-2">{challenge.title}</h1>
      {/* Esta línea sirve para abrir el elemento «p» con las clases «text-body-secondary mx-auto mb-4». */}
      <p className="text-body-secondary mx-auto mb-4" style={{ maxWidth: 440 }}>
        {/* Esta línea sirve para mostrar el valor «challenge.description». */}
        {challenge.description}
      </p>

      {/* Esta línea sirve para abrir el elemento «p» con las clases «sank-stat mb-1». */}
      <p className="sank-stat mb-1" style={{ fontSize: "1.75rem", color: challenge.completed ? "var(--sanken-cyan)" : undefined }}>
        {/* Esta línea sirve para mostrar «Completado» o los días restantes. */}
        {challenge.completed ? "¡Completado!" : `${daysLeft} días restantes`}
      </p>

      {/* Esta línea sirve para mostrar el bloque solo si «challenge.joined». */}
      {challenge.joined && (
        // Esta línea sirve para abrir el elemento «div» con las clases «mx-auto mt-3».
        <div className="mx-auto mt-3" style={{ maxWidth: 480 }}>
          {/* Esta línea sirve para abrir el elemento «div» con las clases «rounded-pill overflow-hidden». */}
          <div className="rounded-pill overflow-hidden" style={{ height: 10, background: "var(--sanken-charcoal)" }}>
            {/* Esta línea sirve para abrir la barra de progreso animada. */}
            <motion.div
              // Esta línea sirve para pasar la propiedad «style» con el valor «{ height: "100%", background: "linear-gradien».
              style={{ height: "100%", background: "linear-gradient(90deg, var(--sanken-cyan-deep), var(--sanken-cyan-light))" }}
              // Esta línea sirve para pasar la propiedad «initial» con el valor «{ width: 0 }}».
              initial={{ width: 0 }}
              // Esta línea sirve para pasar la propiedad «animate» con el valor «{ width: `${progressPct}%` }}».
              animate={{ width: `${progressPct}%` }}
              // Esta línea sirve para pasar la propiedad «transition» con el valor «{ duration: 0.8, ease: [0.22, 1, 0.36, 1], de».
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
          </div>
          {/* Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mt-2 mb-0 sank». */}
          <p className="small text-body-secondary mt-2 mb-0 sank-tabular-nums">
            {/* Esta línea sirve para mostrar el progreso, la meta, la métrica y el porcentaje. */}
            {challenge.progress_value ?? 0} / {challenge.criteria.target} {METRIC_LABEL[challenge.criteria.metric]} · {progressPct}%
          </p>
        </div>
      )}

      {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-4». */}
      <div className="mt-4">
        {/* Esta línea sirve para elegir entre dos bloques según «challenge.joined». */}
        {challenge.joined ? (
          // Esta línea sirve para abrir el componente «SankButton».
          <SankButton variant="outline" onClick={onToggle}>
            {/* Esta línea sirve para mostrar el texto del botón según si el ranking está expandido. */}
            {expanded ? "Ocultar ranking" : "Ver ranking"}
          </SankButton>
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para abrir el componente «SankButton».
          <SankButton variant="primary" size="lg" onClick={onJoin}>
            {/* Esta línea sirve para mostrar el texto «Unirme al reto». */}
            Unirme al reto
          </SankButton>
        )}
      </div>

      {/* Esta línea sirve para mostrar el bloque solo si «expanded». */}
      {expanded && (
        // Esta línea sirve para abrir el elemento «div» con las clases «mt-4 pt-4 text-start».
        <div className="mt-4 pt-4 text-start" style={{ borderTop: "1px solid var(--bs-border-color)" }}>
          {/* Esta línea sirve para abrir el componente «ChallengeLeaderboard». */}
          <ChallengeLeaderboard challengeId={challenge.id} />
        </div>
      )}
    </div>
  )
}
