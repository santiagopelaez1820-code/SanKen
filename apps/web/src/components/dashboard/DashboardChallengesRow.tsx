// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «Flag» desde «lucide-react».
import { Flag } from "lucide-react"
// Esta línea sirve para importar los tipos «Challenge» desde «@sanken/core».
import type { Challenge } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «SankCarousel» desde «@/components/ui/SankCarousel».
import { SankCarousel } from "@/components/ui/SankCarousel"
// Esta línea sirve para importar «SankCard» desde «@/components/ui/SankCard».
import { SankCard } from "@/components/ui/SankCard"
// Esta línea sirve para importar «SankProgress» desde «@/components/ui/SankProgress».
import { SankProgress } from "@/components/ui/SankProgress"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"

// Esta línea sirve para declarar la función que calcula los días restantes.
function daysLeft(endsAt: string) {
  // Esta línea sirve para calcular los milisegundos que faltan.
  const diff = new Date(endsAt).getTime() - Date.now()
  // Esta línea sirve para devolver los días restantes, nunca negativos.
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

// Esta línea sirve para declarar el componente de la fila de retos del dashboard.
export function DashboardChallengesRow() {
  // Esta línea sirve para obtener «data: challenges, isLoading» con el hook «useQuery».
  const { data: challenges, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["challenges"]».
    queryKey: ["challenges"],
    // Esta línea sirve para declarar la propiedad «queryFn» con el valor o tipo «() => api.get<Challenge[]>("/challenges")».
    queryFn: () => api.get<Challenge[]>("/challenges"),
  })

  // Esta línea sirve para mostrar un esqueleto mientras carga.
  if (isLoading) return <Skeleton style={{ height: 180, width: "100%" }} />
  // Esta línea sirve para evitar mostrar algo si no hay retos.
  if (!challenges || challenges.length === 0) return null

  // Esta línea sirve para tomar hasta seis retos sin completar.
  const active = challenges.filter((c) => !c.completed).slice(0, 6)
  // Esta línea sirve para evitar mostrar algo si todos están completados.
  if (active.length === 0) return null

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «SankCarousel» con sus atributos en varias líneas.
    <SankCarousel
      // Esta línea sirve para definir el atributo «title» con el valor «Retos activos».
      title="Retos activos"
      // Esta línea sirve para definir el atributo «itemWidth» con el valor «260px».
      itemWidth="260px"
      // Esta línea sirve para pasar la propiedad «action» con el valor «».
      action={
        // Esta línea sirve para abrir el componente «Link».
        <Link to="/challenges" className="small fw-semibold text-uppercase text-decoration-none" style={{ color: "var(--sanken-cyan-light)", letterSpacing: "0.04em" }}>
          {/* Esta línea sirve para mostrar el texto «Ver todos». */}
          Ver todos
        </Link>
      }
    >
      {/* Esta línea sirve para recorrer «active» y mostrar un bloque por elemento. */}
      {active.map((challenge) => (
        // Esta línea sirve para abrir el elemento «SankCard» con sus atributos en varias líneas.
        <SankCard
          // Esta línea sirve para pasar la propiedad «as» con el valor «Link}».
          as={Link}
          // Esta línea sirve para definir el atributo «to» con el valor «/challenges».
          to="/challenges"
          // Esta línea sirve para marcar la tarjeta como clicable.
          interactive
          // Esta línea sirve para identificar el elemento de la lista con «challenge.id}».
          key={challenge.id}
          // Esta línea sirve para aplicar las clases de estilo «p-4 h-100 text-decoration-none text-reset d-b».
          className="p-4 h-100 text-decoration-none text-reset d-block"
        >
          {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center gap-2 mb-2». */}
          <div className="d-flex align-items-center gap-2 mb-2">
            {/* Esta línea sirve para abrir el componente «Flag». */}
            <Flag size={14} color="var(--sanken-cyan)" />
            {/* Esta línea sirve para mostrar el tipo del reto y los días restantes. */}
            <span className="sank-eyebrow mb-0">{challenge.type === "weekly" ? "Semanal" : "Mensual"} · {daysLeft(challenge.ends_at)}d</span>
          </div>
          {/* Esta línea sirve para mostrar el título del reto. */}
          <p className="fw-bold fs-6 mb-3 text-truncate">{challenge.title}</p>
          {/* Esta línea sirve para elegir entre dos bloques según «challenge.joined». */}
          {challenge.joined ? (
            // Esta línea sirve para abrir el elemento «SankProgress» con sus atributos en varias líneas.
            <SankProgress
              // Esta línea sirve para pasar la propiedad «value» con el valor «challenge.progress_value ?? 0}».
              value={challenge.progress_value ?? 0}
              // Esta línea sirve para pasar la propiedad «max» con el valor «challenge.criteria.target}».
              max={challenge.criteria.target}
              // Esta línea sirve para pasar la propiedad «label» con el valor «`${challenge.progress_value ?? 0} / ${challen».
              label={`${challenge.progress_value ?? 0} / ${challenge.criteria.target}`}
            />
          // Esta línea sirve para mostrar el bloque alternativo.
          ) : (
            // Esta línea sirve para mostrar el llamado a unirse al reto.
            <span className="small fw-semibold" style={{ color: "var(--sanken-cyan-light)" }}>Unirme →</span>
          )}
        </SankCard>
      ))}
    </SankCarousel>
  )
}
