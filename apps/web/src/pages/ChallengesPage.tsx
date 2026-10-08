// Esta línea sirve para importar «useRef, useState» desde «react».
import { useRef, useState } from "react"
// Esta línea sirve para importar «useQuery, useQueryClient» desde «@tanstack/react-query».
import { useQuery, useQueryClient } from "@tanstack/react-query"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Container» desde «react-bootstrap».
import { Container } from "react-bootstrap"
// Esta línea sirve para importar «Flag» desde «lucide-react».
import { Flag } from "lucide-react"
// Esta línea sirve para importar los tipos «Challenge» desde «@sanken/core».
import type { Challenge } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «ChallengeCard» desde «@/components/challenges/ChallengeCard».
import { ChallengeCard } from "@/components/challenges/ChallengeCard"
// Esta línea sirve para importar «ChallengeHero» desde «@/components/challenges/ChallengeHero».
import { ChallengeHero } from "@/components/challenges/ChallengeHero"
// Esta línea sirve para importar «Skeleton» desde «@/components/ui/skeleton».
import { Skeleton } from "@/components/ui/skeleton"
// Esta línea sirve para importar «SankEmptyState» desde «@/components/ui/SankEmptyState».
import { SankEmptyState } from "@/components/ui/SankEmptyState"
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/TutorialOverlay».
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay"
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from "@/hooks/use-tutorial"
// Esta línea sirve para importar «fadeInUp, staggerContainer» desde «@/lib/motion».
import { fadeInUp, staggerContainer } from "@/lib/motion"

// Esta línea sirve para declarar la función «ChallengesPage».
export function ChallengesPage() {
  // Esta línea sirve para crear el estado «expandedId» y su función «setExpandedId».
  const [expandedId, setExpandedId] = useState<number | null>(null)
  // Esta línea sirve para obtener «queryClient» con el hook «useQueryClient».
  const queryClient = useQueryClient()
  // Esta línea sirve para obtener «userId» con el hook «useAuthStore».
  const userId = useAuthStore((s) => s.user?.id)

  // Esta línea sirve para obtener «data: challenges, isLoading» con el hook «useQuery».
  const { data: challenges, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["challenges"]».
    queryKey: ["challenges"],
    // Esta línea sirve para pedir a la API los datos de «/challenges».
    queryFn: () => api.get<Challenge[]>("/challenges"),
  })

  // Esta línea sirve para crear la referencia «titleRef».
  const titleRef = useRef<HTMLDivElement>(null)
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «retos…».
    "retos",
    [
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «titleRef».
        target: titleRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Retos SanKen"».
        title: "Retos SanKen",
        // Esta línea sirve para definir la propiedad «description» con «Desafíos semanales y mensuales para mant…».
        description: "Desafíos semanales y mensuales para mantenerte motivado, con tabla de posiciones en vivo.",
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Unite y trackeá tu progreso"».
        title: "Unite y trackeá tu progreso",
        // Esta línea sirve para definir la propiedad «description» con «Al unirte a un reto, tu avance se calcul…».
        description: "Al unirte a un reto, tu avance se calcula solo con cada entrenamiento que ya registrás.",
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"¡Celebralo al completarlo!"».
        title: "¡Celebralo al completarlo!",
        // Esta línea sirve para definir la propiedad «description» con «Cuando cumplas el objetivo vas a quedar …».
        description: "Cuando cumplas el objetivo vas a quedar marcado como completado y en el ranking.",
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoading,
    // Esta línea sirve para pasar el id del usuario.
    userId
  )

  // Esta línea sirve para extraer «oi» de «async (challengeId: number) => {».
  const join = async (challengeId: number) => {
    // Esta línea sirve para esperar el resultado de «api.post».
    await api.post(`/challenges/${challengeId}/join`)
    // Esta línea sirve para llamar a «queryClient.invalidateQueries» con «{ queryKey: ["challenges"] }».
    queryClient.invalidateQueries({ queryKey: ["challenges"] })
  }

  // Esta línea sirve para extraer «orte» de «[...(challenges ?? [])].sort(».
  const sorted = [...(challenges ?? [])].sort(
    // Esta línea sirve para ordenar por fecha de fin ascendente.
    (a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime()
  )
  // Esta línea sirve para extraer «urren» de «sorted.find((c) => c.joined && !c.comple».
  const current = sorted.find((c) => c.joined && !c.completed) ?? sorted[0]
  // Esta línea sirve para extraer «es» de «sorted.filter((c) => c.id !== current?.i».
  const rest = sorted.filter((c) => c.id !== current?.id)

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Container».
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 1080 }}>
      {/* Esta línea sirve para abrir el elemento «motion.div» con las clases «d-flex flex-column gap-4». */}
      <motion.div className="d-flex flex-column gap-4" variants={staggerContainer()} initial="hidden" animate="show">
        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div ref={titleRef} variants={fadeInUp}>
          {/* Esta línea sirve para mostrar el texto «Comunidad» dentro de un «p». */}
          <p className="sank-eyebrow sank-eyebrow--cyan mb-1">Comunidad</p>
          {/* Esta línea sirve para mostrar el texto «Retos» dentro de un «h1». */}
          <h1 className="display-5 sank-stat mb-0">Retos</h1>
        </motion.div>

        {/* Esta línea sirve para mostrar el elemento solo si «isLoading». */}
        {isLoading && <Skeleton style={{ height: 260, width: "100%" }} />}

        {/* Esta línea sirve para mostrar el bloque solo si «!isLoading && sorted.length === 0». */}
        {!isLoading && sorted.length === 0 && (
          // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2».
          <div className="sank-surface rounded-2">
            {/* Esta línea sirve para abrir el componente «SankEmptyState». */}
            <SankEmptyState icon={Flag} title="No hay retos activos" description="Cuando se abra un reto nuevo, va a aparecer acá." />
          </div>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «current». */}
        {current && (
          // Esta línea sirve para abrir el elemento «motion.div».
          <motion.div variants={fadeInUp}>
            {/* Esta línea sirve para abrir el elemento «ChallengeHero» con sus atributos en varias líneas. */}
            <ChallengeHero
              // Esta línea sirve para pasar la propiedad «challenge» con el valor «current}».
              challenge={current}
              // Esta línea sirve para pasar la propiedad «expanded» con el valor «expandedId === current.id}».
              expanded={expandedId === current.id}
              // Esta línea sirve para asignar el manejador del evento «onToggle».
              onToggle={() => setExpandedId((id) => (id === current.id ? null : current.id))}
              // Esta línea sirve para asignar el manejador del evento «onJoin».
              onJoin={() => join(current.id)}
            />
          </motion.div>
        )}

        {/* Esta línea sirve para mostrar el bloque solo si «rest.length > 0». */}
        {rest.length > 0 && (
          // Esta línea sirve para abrir el elemento «motion.div».
          <motion.div variants={fadeInUp}>
            {/* Esta línea sirve para mostrar el texto «Otros retos» dentro de un «p». */}
            <p className="sank-eyebrow mb-3">Otros retos</p>
            {/* Esta línea sirve para abrir el elemento «div» con las clases «row g-3». */}
            <div className="row g-3">
              {/* Esta línea sirve para recorrer «rest» y mostrar un bloque por elemento. */}
              {rest.map((challenge) => (
                // Esta línea sirve para abrir el elemento «div».
                <div key={challenge.id} className="col-12 col-sm-6 col-lg-4">
                  {/* Esta línea sirve para abrir el elemento «ChallengeCard» con sus atributos en varias líneas. */}
                  <ChallengeCard
                    // Esta línea sirve para pasar la propiedad «challenge» con el valor «challenge}».
                    challenge={challenge}
                    // Esta línea sirve para pasar la propiedad «expanded» con el valor «expandedId === challenge.id}».
                    expanded={expandedId === challenge.id}
                    // Esta línea sirve para asignar el manejador del evento «onToggle».
                    onToggle={() => setExpandedId((id) => (id === challenge.id ? null : challenge.id))}
                    // Esta línea sirve para asignar el manejador del evento «onJoin».
                    onJoin={() => join(challenge.id)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
    </Container>
  )
}
