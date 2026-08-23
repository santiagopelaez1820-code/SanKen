import { Lock, Trophy } from "lucide-react"
import type { Achievement } from "@sanken/core"

export function AchievementsList({ achievements }: { achievements: Achievement[] }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <div className="sank-surface rounded-4 p-4">
      <div className="d-flex align-items-center justify-content-between mb-1">
        <h2 className="h6 fw-bold mb-0">Logros</h2>
        {achievements.length > 0 && (
          <span className="fw-bold sank-tabular-nums" style={{ color: "var(--sanken-gold-light)" }}>
            {unlockedCount}/{achievements.length}
          </span>
        )}
      </div>

      {achievements.length === 0 ? (
        <p className="small text-body-secondary mt-3 mb-0">Todavía no hay logros disponibles.</p>
      ) : (
        <div className="sank-scroll-x gap-3 mt-3 pb-1">
          {achievements.map((achievement) => (
            <div
              key={achievement.code}
              title={achievement.description}
              className="d-flex flex-column align-items-center gap-1 rounded-3 text-center flex-shrink-0"
              style={{
                minWidth: 96,
                padding: "0.75rem 0.5rem",
                border: achievement.unlocked ? "1px solid rgba(201,162,39,0.3)" : "1px solid var(--bs-border-color)",
                background: achievement.unlocked ? "var(--sanken-gold-dim)" : "transparent",
                opacity: achievement.unlocked ? 1 : 0.5,
              }}
            >
              {achievement.unlocked ? (
                <Trophy size={22} color="var(--sanken-gold)" />
              ) : (
                <Lock size={22} className="text-body-secondary" />
              )}
              <p className="small fw-medium mb-0">{achievement.name}</p>
              <p className="mb-0 text-body-secondary" style={{ fontSize: "0.65rem" }}>
                +{achievement.xp_bonus} XP
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
