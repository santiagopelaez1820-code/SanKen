import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Container } from "react-bootstrap"
import type { DashboardStats, GamificationSummary } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { NextWorkoutCard } from "@/components/dashboard/NextWorkoutCard"
import { PerformanceHero } from "@/components/dashboard/PerformanceHero"
import { RecentPRsRow } from "@/components/dashboard/RecentPRsRow"
import { AchievementsList } from "@/components/dashboard/AchievementsList"
import { DashboardChallengesRow } from "@/components/dashboard/DashboardChallengesRow"
import { fadeInUp, staggerContainer } from "@/lib/motion"

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Buenos días"
  if (hour < 19) return "Buenas tardes"
  return "Buenas noches"
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats", "dashboard"],
    queryFn: () => api.get<DashboardStats>("/stats/dashboard"),
  })

  const { data: gamification, isLoading: isLoadingGamification } = useQuery({
    queryKey: ["gamification"],
    queryFn: () => api.get<GamificationSummary>("/gamification"),
  })

  return (
    <Container fluid className="px-3 px-md-4 py-4 py-md-5" style={{ maxWidth: 1080 }}>
      <motion.div className="d-flex flex-column gap-4" variants={staggerContainer()} initial="hidden" animate="show">
        <motion.div variants={fadeInUp}>
          <p className="sank-eyebrow sank-eyebrow--cyan mb-1">{greeting()}</p>
          <h1 className="display-3 sank-stat mb-2">{user?.name?.split(" ")[0] ?? "Atleta"}</h1>
          <p className="text-body-secondary mb-0">¿Listo para entrenar?</p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <div
            className="d-flex flex-column align-items-center text-center position-relative overflow-hidden"
            style={{
              borderRadius: 24,
              border: "1px solid rgba(0, 184, 217, 0.18)",
              background:
                "radial-gradient(120% 140% at 20% 0%, rgba(0, 184, 217, 0.20), transparent 60%), var(--sanken-black-2)",
              padding: "2.25rem 1.5rem",
              boxShadow: "0 0 32px -8px rgba(0, 184, 217, 0.25)",
            }}
          >
            <img src="/logo-full.png" alt="SanKen" style={{ width: 220, height: "auto" }} />
            <div className="d-flex flex-wrap align-items-center justify-content-center mt-3" style={{ gap: "0.5rem" }}>
              {["ENTRENA", "PROGRESA", "SUPÉRATE"].map((word, i) => (
                <span key={word} className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                  {i > 0 && (
                    <span
                      style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--sanken-cyan)" }}
                    />
                  )}
                  <span
                    className="fw-bold"
                    style={{ color: "var(--sanken-cyan)", fontSize: "0.75rem", letterSpacing: "0.2em" }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <NextWorkoutCard />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <PerformanceHero stats={stats} gamification={gamification} isLoading={isLoading || isLoadingGamification} />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <DashboardChallengesRow />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <RecentPRsRow records={stats?.recent_personal_records ?? []} />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <AchievementsList
            achievements={[
              ...(gamification?.unlocked_achievements ?? []),
              ...(gamification?.locked_achievements ?? []),
            ]}
          />
        </motion.div>
      </motion.div>
    </Container>
  )
}
