import { Lock, Trophy } from "lucide-react"
import type { Achievement } from "@sanken/core"

export function AchievementsList({ achievements }: { achievements: Achievement[] }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-medium text-foreground">Logros</h2>
        {achievements.length > 0 && (
          <span className="font-heading text-sm font-bold tabular-nums text-primary">
            {unlockedCount}/{achievements.length}
          </span>
        )}
      </div>

      {achievements.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no hay logros disponibles.</p>
      ) : (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {achievements.map((achievement) => (
            <div
              key={achievement.code}
              title={achievement.description}
              className={`flex min-w-24 shrink-0 flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center ${
                achievement.unlocked
                  ? "border-primary/25 bg-primary/8"
                  : "border-border bg-background opacity-50"
              }`}
            >
              {achievement.unlocked ? (
                <Trophy className="size-6 text-primary" />
              ) : (
                <Lock className="size-6 text-muted-foreground" />
              )}
              <p className="text-xs font-medium text-foreground">{achievement.name}</p>
              <p className="text-[10px] text-muted-foreground">+{achievement.xp_bonus} XP</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
