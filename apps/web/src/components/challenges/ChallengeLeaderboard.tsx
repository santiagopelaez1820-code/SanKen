// Esta línea sirve para importar «useEffect, useState» desde «react».
import { useEffect, useState } from "react"
// Esta línea sirve para importar los tipos de la tabla de posiciones.
import type { ChallengeLeaderboardEntry, ChallengeLeaderboardResponse, ChallengeProgressBroadcast } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «getEcho» desde «@/lib/echo».
import { getEcho } from "@/lib/echo"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Carga inicial por HTTP (GET .../leaderboard) y después se suscribe al
 * canal privado `challenges.{id}` por Reverb para actualizaciones en vivo
 * (evento `progress.updated`) — la carga inicial existe porque el
 * websocket solo empuja cambios futuros, no el estado actual al conectar.
 */
// Esta línea sirve para declarar el componente de la tabla de posiciones de un reto.
export function ChallengeLeaderboard({ challengeId }: { challengeId: number }) {
  // Esta línea sirve para guardar las posiciones, null mientras carga.
  const [entries, setEntries] = useState<ChallengeLeaderboardEntry[] | null>(null)

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para marcar si el efecto fue cancelado al desmontar.
    let cancelled = false

    // Esta línea sirve para iniciar la petición a la API.
    api
      // Esta línea sirve para pedir la tabla de posiciones del reto.
      .get<ChallengeLeaderboardResponse>(`/challenges/${challengeId}/leaderboard`)
      // Esta línea sirve para recibir la respuesta.
      .then((res) => {
        // Esta línea sirve para guardar las posiciones si el componente sigue montado.
        if (!cancelled) setEntries(res.entries)
      })
      // Esta línea sirve para manejar un fallo de la petición.
      .catch(() => {
        // Esta línea sirve para mostrar una lista vacía si el componente sigue montado.
        if (!cancelled) setEntries([])
      })

    // Esta línea sirve para obtener la conexión de tiempo real.
    const echo = getEcho()
    // Esta línea sirve para suscribirse al canal privado del reto.
    const channel = echo.private(`challenges.${challengeId}`)
    // Esta línea sirve para escuchar las actualizaciones de progreso.
    channel.listen(".progress.updated", (payload: ChallengeProgressBroadcast) => {
      // Esta línea sirve para reemplazar las posiciones con las recibidas en vivo.
      setEntries(payload.leaderboard)
    })

    // Esta línea sirve para devolver la función de limpieza.
    return () => {
      // Esta línea sirve para marcar el efecto como cancelado.
      cancelled = true
      // Esta línea sirve para abandonar el canal del reto.
      echo.leave(`challenges.${challengeId}`)
    }
  // Esta línea sirve para volver a ejecutar el efecto si cambia el reto.
  }, [challengeId])

  // Esta línea sirve para revisar si aún se están cargando las posiciones.
  if (entries === null) {
    // Esta línea sirve para mostrar un esqueleto de carga.
    return <Skeleton style={{ height: 80, width: "100%" }} />
  }

  // Esta línea sirve para revisar si no hay nadie con progreso.
  if (entries.length === 0) {
    // Esta línea sirve para mostrar el mensaje de tabla vacía.
    return <p className="small text-body-secondary mb-0">Todavía nadie tiene progreso en este reto.</p>
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «ul» con las clases «list-unstyled mb-0».
    <ul className="list-unstyled mb-0">
      {/* Esta línea sirve para recorrer «entries» y mostrar un bloque por elemento. */}
      {entries.map((entry) => (
        // Esta línea sirve para abrir el elemento «li» con sus atributos en varias líneas.
        <li
          // Esta línea sirve para identificar el elemento de la lista con «entry.user_id}».
          key={entry.user_id}
          // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
          className={cn(
            // Esta línea sirve para aplicar las clases base de cada fila.
            "d-flex align-items-center justify-content-between py-2 px-2 rounded-1",
            // Esta línea sirve para resaltar la fila del usuario actual.
            entry.is_viewer && "fw-semibold"
          )}
          // Esta línea sirve para pasar la propiedad «style» con el valor «entry.is_viewer ? { background: "var(--sanken».
          style={entry.is_viewer ? { background: "var(--sanken-cyan-dim)" } : undefined}
        >
          {/* Esta línea sirve para abrir el elemento «span» con las clases «d-flex align-items-center gap-3». */}
          <span className="d-flex align-items-center gap-3">
            {/* Esta línea sirve para abrir el elemento «span» con las clases «text-body-secondary sank-tabular-nums». */}
            <span className="text-body-secondary sank-tabular-nums" style={{ width: 20, textAlign: "right", fontSize: "0.75rem" }}>
              {/* Esta línea sirve para mostrar el valor «entry.rank». */}
              {entry.rank}
            </span>
            {/* Esta línea sirve para mostrar el nombre del participante. */}
            <span className="small">{entry.user_name}</span>
            {/* Esta línea sirve para mostrar el elemento solo si «entry.completed». */}
            {entry.completed && <span className="small" style={{ color: "var(--sanken-cyan)" }}>✓</span>}
          </span>
          {/* Esta línea sirve para abrir el elemento «span» con las clases «small fw-semibold sank-tabular-nums». */}
          <span className="small fw-semibold sank-tabular-nums" style={{ color: "var(--sanken-cyan-light)" }}>
            {/* Esta línea sirve para mostrar el progreso con formato numérico. */}
            {entry.progress_value.toLocaleString("es-AR")}
          </span>
        </li>
      ))}
    </ul>
  )
}
