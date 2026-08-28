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
