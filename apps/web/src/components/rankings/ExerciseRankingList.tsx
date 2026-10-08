// Esta línea sirve para importar «Medal» desde «lucide-react».
import { Medal } from "lucide-react"
// Esta línea sirve para importar los tipos «RankingEntry» desde «@sanken/core».
import type { RankingEntry } from "@sanken/core"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar los colores de las medallas de oro, plata y bronce.
const MEDAL_COLORS: Record<number, string> = { 1: "#D4AF37", 2: "#A8A9AD", 3: "#B08D57" }

// Esta línea sirve para declarar el componente que muestra la posición en el ranking.
function RankBadge({ rank }: { rank: number }) {
  // Esta línea sirve para obtener el color de medalla de la posición.
  const color = MEDAL_COLORS[rank]
  // Esta línea sirve para mostrar solo el número si no hay medalla.
  if (!color) return <span className="w-7 text-right text-sm text-muted-foreground">{rank}</span>
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «span» con las clases «flex w-7 justify-end».
    <span className="flex w-7 justify-end">
      {/* Esta línea sirve para abrir el componente «Medal». */}
      <Medal className="size-4" style={{ color }} />
    </span>
  )
}

// Esta línea sirve para declarar el componente de la lista de ranking de un ejercicio.
export function ExerciseRankingList({ entries, viewer }: { entries: RankingEntry[]; viewer: RankingEntry | null }) {
  // Esta línea sirve para calcular si el usuario no aparece entre las entradas.
  const viewerOutsideEntries = viewer && !entries.some((e) => e.user_id === viewer.user_id)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ».
    <div className="rounded-xl border border-border bg-card p-5">
      {/* Esta línea sirve para elegir entre dos bloques según «entries.length === 0». */}
      {entries.length === 0 ? (
        // Esta línea sirve para mostrar el mensaje cuando no hay suficientes récords.
        <p className="text-sm text-muted-foreground">Todavía no hay suficientes récords públicos para este ranking.</p>
      // Esta línea sirve para mostrar el bloque alternativo.
      ) : (
        // Esta línea sirve para abrir el elemento «ul» con las clases «divide-y divide-border».
        <ul className="divide-y divide-border">
          {/* Esta línea sirve para recorrer «entries» y mostrar un bloque por elemento. */}
          {entries.map((entry) => (
            // Esta línea sirve para abrir el elemento «li» con sus atributos en varias líneas.
            <li
              // Esta línea sirve para identificar el elemento de la lista con «entry.user_id}».
              key={entry.user_id}
              // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
              className={cn(
                // Esta línea sirve para aplicar las clases base de cada fila.
                "flex items-center justify-between py-2.5 text-sm",
                // Esta línea sirve para resaltar la fila del usuario actual.
                entry.is_viewer && "-mx-2 rounded-lg bg-primary/5 px-2 font-medium"
              )}
            >
              {/* Esta línea sirve para abrir el elemento «span» con las clases «flex items-center gap-3». */}
              <span className="flex items-center gap-3">
                {/* Esta línea sirve para abrir el componente «RankBadge». */}
                <RankBadge rank={entry.rank} />
                {/* Esta línea sirve para mostrar el nombre del participante. */}
                <span className="text-foreground">{entry.user_name}</span>
              </span>
              {/* Esta línea sirve para mostrar el valor del récord en kilogramos. */}
              <span className="font-medium text-primary">{entry.metric_value.toLocaleString("es-AR")} kg</span>
            </li>
          ))}
        </ul>
      )}

      {/* Esta línea sirve para mostrar el bloque solo si «viewerOutsideEntries». */}
      {viewerOutsideEntries && (
        // Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex items-center justify-between b».
        <div className="mt-3 flex items-center justify-between border-t border-dashed border-border pt-2.5 text-sm font-medium">
          {/* Esta línea sirve para abrir el elemento «span» con las clases «flex items-center gap-3». */}
          <span className="flex items-center gap-3">
            {/* Esta línea sirve para abrir el componente «RankBadge». */}
            <RankBadge rank={viewer.rank} />
            {/* Esta línea sirve para mostrar la etiqueta de la posición del usuario. */}
            <span className="text-foreground">Tu posición</span>
          </span>
          {/* Esta línea sirve para mostrar el valor del usuario en kilogramos. */}
          <span className="text-primary">{viewer.metric_value.toLocaleString("es-AR")} kg</span>
        </div>
      )}
    </div>
  )
}
