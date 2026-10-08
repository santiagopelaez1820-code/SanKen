// Esta línea sirve para importar los tipos «Challenge» desde «@sanken/core».
import type { Challenge } from "@sanken/core"
// Esta línea sirve para importar «SankButton» desde «@/components/ui/SankButton».
import { SankButton } from "@/components/ui/SankButton"
// Esta línea sirve para importar «SankProgress» desde «@/components/ui/SankProgress».
import { SankProgress } from "@/components/ui/SankProgress"
// Esta línea sirve para importar «ChallengeLeaderboard» desde «@/components/challenges/ChallengeLeaderboard».
import { ChallengeLeaderboard } from "@/components/challenges/ChallengeLeaderboard"

// Esta línea sirve para declarar la unidad de medida de cada métrica de reto.
const METRIC_LABEL: Record<Challenge["criteria"]["metric"], string> = {
  // Esta línea sirve para declarar la propiedad «workouts_count» con el valor o tipo «"entrenamientos"».
  workouts_count: "entrenamientos",
  // Esta línea sirve para declarar la propiedad «total_volume_kg» con el valor o tipo «"kg de volumen"».
  total_volume_kg: "kg de volumen",
}

// Esta línea sirve para declarar la interfaz «ChallengeCardProps».
interface ChallengeCardProps {
  // Esta línea sirve para declarar la propiedad «challenge» con el valor o tipo «Challenge».
  challenge: Challenge
  // Esta línea sirve para declarar la propiedad «expanded» con el valor o tipo «boolean».
  expanded: boolean
  // Esta línea sirve para declarar la propiedad «onToggle» con el valor o tipo «() => void».
  onToggle: () => void
  // Esta línea sirve para declarar la propiedad «onJoin» con el valor o tipo «() => void».
  onJoin: () => void
}

// Esta línea sirve para declarar el componente de tarjeta de un reto.
export function ChallengeCard({ challenge, expanded, onToggle, onJoin }: ChallengeCardProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 p-4 h-100 d-flex ».
    <div className="sank-surface rounded-2 p-4 h-100 d-flex flex-column">
      {/* Esta línea sirve para mostrar si el reto es semanal o mensual. */}
      <p className="sank-eyebrow mb-1">{challenge.type === "weekly" ? "Semanal" : "Mensual"}</p>
      {/* Esta línea sirve para mostrar el título del reto. */}
      <p className="fw-bold fs-6 mb-1">{challenge.title}</p>
      {/* Esta línea sirve para mostrar la descripción del reto. */}
      <p className="small text-body-secondary flex-grow-1">{challenge.description}</p>

      {/* Esta línea sirve para mostrar el bloque solo si «challenge.joined». */}
      {challenge.joined && (
        // Esta línea sirve para abrir un fragmento que agrupa elementos sin añadir nodo.
        <>
          {/* Esta línea sirve para abrir el elemento «SankProgress» con sus atributos en varias líneas. */}
          <SankProgress
            // Esta línea sirve para pasar la propiedad «value» con el valor «challenge.progress_value ?? 0}».
            value={challenge.progress_value ?? 0}
            // Esta línea sirve para pasar la propiedad «max» con el valor «challenge.criteria.target}».
            max={challenge.criteria.target}
            // Esta línea sirve para pasar la propiedad «label» con el valor «`${challenge.progress_value ?? 0} / ${challen».
            label={`${challenge.progress_value ?? 0} / ${challenge.criteria.target} ${METRIC_LABEL[challenge.criteria.metric]}`}
            // Esta línea sirve para pasar la propiedad «showValue» con el valor «!challenge.completed}».
            showValue={!challenge.completed}
            // Esta línea sirve para aplicar las clases de estilo «mb-1».
            className="mb-1"
          />
          {/* Esta línea sirve para mostrar el bloque solo si «challenge.completed». */}
          {challenge.completed && (
            // Esta línea sirve para mostrar el aviso de reto completado.
            <p className="small fw-bold mb-2" style={{ color: "var(--sanken-cyan)" }}>¡Completado!</p>
          )}
        </>
      )}

      {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex gap-2 mt-2». */}
      <div className="d-flex gap-2 mt-2">
        {/* Esta línea sirve para elegir entre dos bloques según «challenge.joined». */}
        {challenge.joined ? (
          // Esta línea sirve para abrir el componente «SankButton».
          <SankButton variant="outline" size="sm" onClick={onToggle} className="flex-grow-1 justify-content-center">
            {/* Esta línea sirve para mostrar el texto del botón según si la tabla está expandida. */}
            {expanded ? "Ocultar tabla" : "Ver tabla"}
          </SankButton>
        // Esta línea sirve para mostrar el bloque alternativo.
        ) : (
          // Esta línea sirve para abrir el componente «SankButton».
          <SankButton size="sm" onClick={onJoin} className="flex-grow-1 justify-content-center">
            {/* Esta línea sirve para mostrar el texto «Unirme». */}
            Unirme
          </SankButton>
        )}
      </div>

      {/* Esta línea sirve para mostrar el bloque solo si «expanded». */}
      {expanded && (
        // Esta línea sirve para abrir el elemento «div» con las clases «mt-3 pt-3».
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--bs-border-color)" }}>
          {/* Esta línea sirve para abrir el componente «ChallengeLeaderboard». */}
          <ChallengeLeaderboard challengeId={challenge.id} />
        </div>
      )}
    </div>
  )
}
