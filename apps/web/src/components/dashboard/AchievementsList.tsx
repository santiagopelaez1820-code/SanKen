// Esta línea sirve para importar «Lock, Trophy» desde «lucide-react».
import { Lock, Trophy } from "lucide-react"
// Esta línea sirve para importar los tipos «Achievement» desde «@sanken/core».
import type { Achievement } from "@sanken/core"

// Esta línea sirve para declarar el componente de lista de logros.
export function AchievementsList({ achievements }: { achievements: Achievement[] }) {
  // Esta línea sirve para contar los logros desbloqueados.
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 p-4».
    <div className="sank-surface rounded-2 p-4">
      {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center justify-conten». */}
      <div className="d-flex align-items-center justify-content-between mb-1">
        {/* Esta línea sirve para mostrar el título de la sección. */}
        <h2 className="sank-eyebrow mb-0">Logros</h2>
        {/* Esta línea sirve para mostrar el bloque solo si «achievements.length > 0». */}
        {achievements.length > 0 && (
          // Esta línea sirve para abrir el elemento «span» con las clases «fw-bold sank-tabular-nums».
          <span className="fw-bold sank-tabular-nums" style={{ color: "var(--sanken-cyan-light)" }}>
            {/* Esta línea sirve para mostrar cuántos logros están desbloqueados del total. */}
            {unlockedCount}/{achievements.length}
          </span>
        )}
      </div>

      {/* Esta línea sirve para elegir entre dos bloques según «achievements.length === 0». */}
      {achievements.length === 0 ? (
        // Esta línea sirve para mostrar el mensaje cuando no hay logros.
        <p className="small text-body-secondary mt-3 mb-0">Todavía no hay logros disponibles.</p>
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para abrir el elemento «div» con las clases «sank-scroll-x gap-3 mt-3 pb-1».
        <div className="sank-scroll-x gap-3 mt-3 pb-1">
          {/* Esta línea sirve para recorrer «achievements» y mostrar un bloque por elemento. */}
          {achievements.map((achievement) => (
            // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
            <div
              // Esta línea sirve para identificar el elemento de la lista con «achievement.code}».
              key={achievement.code}
              // Esta línea sirve para pasar la propiedad «title» con el valor «achievement.description}».
              title={achievement.description}
              // Esta línea sirve para aplicar las clases de estilo «d-flex flex-column align-items-center gap-1 r».
              className="d-flex flex-column align-items-center gap-1 rounded-3 text-center flex-shrink-0"
              // Esta línea sirve para pasar la propiedad «style» con el valor «{».
              style={{
                // Esta línea sirve para definir el ancho mínimo de la tarjeta.
                minWidth: 96,
                // Esta línea sirve para definir el espaciado interno.
                padding: "0.75rem 0.5rem",
                // Esta línea sirve para colorear el borde según si el logro está desbloqueado.
                border: achievement.unlocked ? "1px solid rgba(0, 184, 217, 0.3)" : "1px solid var(--bs-border-color)",
                // Esta línea sirve para colorear el fondo según si el logro está desbloqueado.
                background: achievement.unlocked ? "var(--sanken-cyan-dim)" : "transparent",
                // Esta línea sirve para atenuar los logros bloqueados.
                opacity: achievement.unlocked ? 1 : 0.5,
              }}
            >
              {/* Esta línea sirve para elegir entre dos bloques según «achievement.unlocked». */}
              {achievement.unlocked ? (
                // Esta línea sirve para abrir el componente «Trophy».
                <Trophy size={22} color="var(--sanken-cyan)" />
              // Esta línea sirve para mostrar el bloque alternativo.
              ) : (
                // Esta línea sirve para abrir el componente «Lock».
                <Lock size={22} className="text-body-secondary" />
              )}
              {/* Esta línea sirve para mostrar el nombre del logro. */}
              <p className="small fw-medium mb-0">{achievement.name}</p>
              {/* Esta línea sirve para abrir el elemento «p» con las clases «mb-0 text-body-secondary». */}
              <p className="mb-0 text-body-secondary" style={{ fontSize: "0.65rem" }}>
                {/* Esta línea sirve para mostrar los puntos de experiencia que otorga el logro. */}
                +{achievement.xp_bonus} XP
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
