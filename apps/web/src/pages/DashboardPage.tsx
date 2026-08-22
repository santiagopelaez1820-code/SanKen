import { useQuery } from "@tanstack/react-query"
import type { DashboardStats, GamificationSummary } from "@sanken/core"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"
import { NextWorkoutCard } from "@/components/dashboard/NextWorkoutCard"
import { PerformanceHero } from "@/components/dashboard/PerformanceHero"
import { RecentPRsRow } from "@/components/dashboard/RecentPRsRow"
import { AchievementsList } from "@/components/dashboard/AchievementsList"

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
    <main className="px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Dashboard</p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Hola, {user?.name?.split(" ")[0] ?? "atleta"}
          </h1>
        </div>

        <PerformanceHero stats={stats} gamification={gamification} isLoading={isLoading || isLoadingGamification} />

        <NextWorkoutCard />

        <RecentPRsRow records={stats?.recent_personal_records ?? []} />

        <AchievementsList
          achievements={[
            ...(gamification?.unlocked_achievements ?? []),
            ...(gamification?.locked_achievements ?? []),
          ]}
        />
      </div>
    </main>
  )
}
