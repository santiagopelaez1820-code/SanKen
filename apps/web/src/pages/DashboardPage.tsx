// Esta línea sirve para importar «useRef» desde «react».
import { useRef } from "react"
// Esta línea sirve para importar «useQuery» desde «@tanstack/react-query».
import { useQuery } from "@tanstack/react-query"
// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Container» desde «react-bootstrap».
import { Container } from "react-bootstrap"
// Esta línea sirve para importar los tipos «DashboardStats, GamificationSummary» desde «@sanken/core».
import type { DashboardStats, GamificationSummary } from "@sanken/core"
// Esta línea sirve para importar «api» desde «@/lib/api».
import { api } from "@/lib/api"
// Esta línea sirve para importar «useAuthStore» desde «@/lib/auth-store».
import { useAuthStore } from "@/lib/auth-store"
// Esta línea sirve para importar «NextWorkoutCard» desde «@/components/dashboard/NextWorkoutCard».
import { NextWorkoutCard } from "@/components/dashboard/NextWorkoutCard"
// Esta línea sirve para importar «PerformanceHero» desde «@/components/dashboard/PerformanceHero».
import { PerformanceHero } from "@/components/dashboard/PerformanceHero"
// Esta línea sirve para importar «RecentPRsRow» desde «@/components/dashboard/RecentPRsRow».
import { RecentPRsRow } from "@/components/dashboard/RecentPRsRow"
// Esta línea sirve para importar «AchievementsList» desde «@/components/dashboard/AchievementsList».
import { AchievementsList } from "@/components/dashboard/AchievementsList"
// Esta línea sirve para importar «DashboardChallengesRow» desde «@/components/dashboard/DashboardChallengesRow».
import { DashboardChallengesRow } from "@/components/dashboard/DashboardChallengesRow"
// Esta línea sirve para importar «AnimatedLogoMark» desde «@/components/brand/AnimatedLogoMark».
import { AnimatedLogoMark } from "@/components/brand/AnimatedLogoMark"
// Esta línea sirve para importar «TutorialOverlay» desde «@/components/tutorial/TutorialOverlay».
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay"
// Esta línea sirve para importar «useTutorial» desde «@/hooks/use-tutorial».
import { useTutorial } from "@/hooks/use-tutorial"
// Esta línea sirve para importar «useResolvedTheme» desde «@/hooks/use-resolved-theme».
import { useResolvedTheme } from "@/hooks/use-resolved-theme"
// Esta línea sirve para importar «fadeInUp, staggerContainer» desde «@/lib/motion».
import { fadeInUp, staggerContainer } from "@/lib/motion"

// Esta línea sirve para declarar la función «greeting».
function greeting() {
  // Esta línea sirve para extraer «ou» de «new Date().getHours()».
  const hour = new Date().getHours()
  // Esta línea sirve para devolver «"Buenos días"» si «hour < 12».
  if (hour < 12) return "Buenos días"
  // Esta línea sirve para devolver «"Buenas tardes"» si «hour < 19».
  if (hour < 19) return "Buenas tardes"
  // Esta línea sirve para devolver «"Buenas noches"».
  return "Buenas noches"
}

// Esta línea sirve para declarar la función «DashboardPage».
export function DashboardPage() {
  // Esta línea sirve para obtener «user» con el hook «useAuthStore».
  const user = useAuthStore((state) => state.user)
  // Esta línea sirve para obtener «resolvedTheme» con el hook «useResolvedTheme».
  const resolvedTheme = useResolvedTheme()

  // Esta línea sirve para obtener «data: stats, isLoading» con el hook «useQuery».
  const { data: stats, isLoading } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["stats", "dashboard"]».
    queryKey: ["stats", "dashboard"],
    // Esta línea sirve para pedir a la API los datos de «/stats/dashboard».
    queryFn: () => api.get<DashboardStats>("/stats/dashboard"),
  })

  // Esta línea sirve para pedir el resumen de gamificación.
  const { data: gamification, isLoading: isLoadingGamification } = useQuery({
    // Esta línea sirve para declarar la propiedad «queryKey» con el valor o tipo «["gamification"]».
    queryKey: ["gamification"],
    // Esta línea sirve para pedir a la API los datos de «/gamification».
    queryFn: () => api.get<GamificationSummary>("/gamification"),
  })

  // Esta línea sirve para crear la referencia «brandCardRef».
  const brandCardRef = useRef<HTMLDivElement>(null)
  // Esta línea sirve para crear la referencia «nextWorkoutRef».
  const nextWorkoutRef = useRef<HTMLDivElement>(null)
  // Esta línea sirve para obtener «tutorial» con el hook «useTutorial».
  const tutorial = useTutorial(
    // Esta línea sirve para incluir el texto o las clases «inicio…».
    "inicio",
    [
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «brandCardRef».
        target: brandCardRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"¡Bienvenido a SanKen! 👋"».
        title: "¡Bienvenido a SanKen! 👋",
        // Esta línea sirve para definir la propiedad «description» con «Este es tu punto de partida: acá vas a v…».
        description: "Este es tu punto de partida: acá vas a ver tu entrenamiento del día, tu racha y tu progreso general.",
      },
      {
        // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «nextWorkoutRef».
        target: nextWorkoutRef,
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Tu entrenamiento de hoy"».
        title: "Tu entrenamiento de hoy",
        // Esta línea sirve para definir la propiedad «description» con «Acá vas a ver la rutina del día y un bot…».
        description: "Acá vas a ver la rutina del día y un botón para arrancarla directo.",
      },
      {
        // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «"Todo lo demás está en el menú"».
        title: "Todo lo demás está en el menú",
        // Esta línea sirve para definir la propiedad «description» con «Desde el menú lateral accedés a Nutrició…».
        description: "Desde el menú lateral accedés a Nutrición, Calendario, Chat, Retos, Tienda y más.",
      },
    ],
    // Esta línea sirve para indicar que la carga ya terminó.
    !isLoading,
    // Esta línea sirve para pasar el id del usuario.
    user?.id
  )

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el componente «Container».
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 1080 }}>
      {/* Esta línea sirve para abrir el elemento «motion.div» con las clases «d-flex flex-column gap-4». */}
      <motion.div className="d-flex flex-column gap-4" variants={staggerContainer()} initial="hidden" animate="show">
        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para mostrar el valor «greeting()» dentro de un «p». */}
          <p className="sank-eyebrow sank-eyebrow--cyan mb-1">{greeting()}</p>
          {/* Esta línea sirve para mostrar el valor «user?.name?.split(" ")[0] ?? "Atleta"» dentro de un «h1». */}
          <h1 className="display-3 sank-stat mb-2">{user?.name?.split(" ")[0] ?? "Atleta"}</h1>
          {/* Esta línea sirve para mostrar el texto «¿Listo para entrenar?» dentro de un «p». */}
          <p className="text-body-secondary mb-0">¿Listo para entrenar?</p>
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas. */}
          <div
            // Esta línea sirve para conectar la referencia «brandCardRef}» con el elemento.
            ref={brandCardRef}
            // Esta línea sirve para aplicar las clases de estilo «d-flex flex-column align-items-center text-ce».
            className="d-flex flex-column align-items-center text-center position-relative overflow-hidden"
            // Esta línea sirve para pasar la propiedad «style» con el valor «{».
            style={{
              // Esta línea sirve para declarar la propiedad «borderRadius» con el valor o tipo «24».
              borderRadius: 24,
              // Esta línea sirve para declarar la propiedad «border» con el valor o tipo «"1px solid rgba(0, 184, 217, 0.18)"».
              border: "1px solid rgba(0, 184, 217, 0.18)",
              // Esta línea sirve para definir la propiedad «background» (valor en la línea siguiente).
              background:
                // Esta línea sirve para incluir el texto o las clases «radial-gradient(120% 140% at 20% 0%, rgba(0, …».
                "radial-gradient(120% 140% at 20% 0%, rgba(0, 184, 217, 0.20), transparent 60%), var(--sanken-black-2)",
              // Esta línea sirve para declarar la propiedad «padding» con el valor o tipo «"2.25rem 1.5rem"».
              padding: "2.25rem 1.5rem",
              // Esta línea sirve para declarar la propiedad «boxShadow» con el valor o tipo «"0 0 32px -8px rgba(0, 184, 217, 0.25)"».
              boxShadow: "0 0 32px -8px rgba(0, 184, 217, 0.25)",
            }}
          >
            {/* Esta línea sirve para abrir el comentario que explica el isotipo animado y el wordmark. */}
            {/* Isotipo que se redibuja en bucle (mismo efecto que la intro de la
                // Esta línea sirve para continuar el comentario sobre la composición del logo.
                app) + el wordmark real debajo: la composición de logo-full.png. */}
            {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column align-items-center». */}
            <div className="d-flex flex-column align-items-center" style={{ gap: 10 }} role="img" aria-label="SanKen">
              {/* Esta línea sirve para abrir el componente «AnimatedLogoMark». */}
              <AnimatedLogoMark width={196} onLight={resolvedTheme === "light"} />
              {/* Esta línea sirve para abrir el elemento «img». */}
              <img src="/brand-wordmark.png" alt="" style={{ width: 196, height: "auto" }} />
            </div>
            {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-wrap align-items-center just». */}
            <div className="d-flex flex-wrap align-items-center justify-content-center mt-3" style={{ gap: "0.5rem" }}>
              {/* Esta línea sirve para recorrer «["ENTRENA", "PROGRESA", "SUPÉRATE"]» y mostrar un bloque por elemento. */}
              {["ENTRENA", "PROGRESA", "SUPÉRATE"].map((word, i) => (
                // Esta línea sirve para abrir el elemento «span».
                <span key={word} className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                  {/* Esta línea sirve para mostrar el bloque solo si «i > 0». */}
                  {i > 0 && (
                    // Esta línea sirve para abrir el elemento «span» con sus atributos en varias líneas.
                    <span
                      // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: 3, height: 3, borderRadius: "50%", b».
                      style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--sanken-cyan)" }}
                    />
                  )}
                  {/* Esta línea sirve para abrir el elemento «span» con sus atributos en varias líneas. */}
                  <span
                    // Esta línea sirve para aplicar las clases de estilo «fw-bold».
                    className="fw-bold"
                    // Esta línea sirve para pasar la propiedad «style» con el valor «{ color: "var(--sanken-cyan)", fontSize: "0.7».
                    style={{ color: "var(--sanken-cyan)", fontSize: "0.75rem", letterSpacing: "0.2em" }}
                  >
                    {/* Esta línea sirve para mostrar el valor «word». */}
                    {word}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp} ref={nextWorkoutRef}>
          {/* Esta línea sirve para abrir el componente «NextWorkoutCard». */}
          <NextWorkoutCard />
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el componente «PerformanceHero». */}
          <PerformanceHero stats={stats} gamification={gamification} isLoading={isLoading || isLoadingGamification} />
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el componente «DashboardChallengesRow». */}
          <DashboardChallengesRow />
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el componente «RecentPRsRow». */}
          <RecentPRsRow records={stats?.recent_personal_records ?? []} />
        </motion.div>

        {/* Esta línea sirve para abrir el elemento «motion.div». */}
        <motion.div variants={fadeInUp}>
          {/* Esta línea sirve para abrir el elemento «AchievementsList» con sus atributos en varias líneas. */}
          <AchievementsList
            // Esta línea sirve para pasar la propiedad «achievements» con el valor «[».
            achievements={[
              // Esta línea sirve para incluir los logros desbloqueados.
              ...(gamification?.unlocked_achievements ?? []),
              // Esta línea sirve para incluir los logros bloqueados.
              ...(gamification?.locked_achievements ?? []),
            ]}
          />
        </motion.div>
      </motion.div>

      {/* Esta línea sirve para abrir el componente «TutorialOverlay». */}
      <TutorialOverlay tutorial={tutorial} />
    </Container>
  )
}
