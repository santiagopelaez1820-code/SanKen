import { Link } from "react-router-dom"
import { Trophy } from "lucide-react"
import type { PersonalRecordSummary } from "@sanken/core"
import { SankCard } from "@/components/ui/SankCard"
import { SankEmptyState } from "@/components/ui/SankEmptyState"
import { SankCarousel } from "@/components/ui/SankCarousel"

export function RecentPRsRow({ records }: { records: PersonalRecordSummary[] }) {
  if (records.length === 0) {
    return (
      <div className="sank-surface rounded-4 p-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h2 className="h6 fw-bold mb-0">Récords recientes</h2>
        </div>
        <SankEmptyState icon={Trophy} title="Sin récords todavía" description="Registra tu primer PR desde PR y Rankings." />
      </div>
    )
  }

  return (
    <SankCarousel
      title="Récords recientes"
      itemWidth="152px"
      action={
        <Link to="/progress" className="small fw-medium text-decoration-none" style={{ color: "var(--sanken-gold-light)" }}>
          Ver todos
        </Link>
      }
    >
      {records.slice(0, 8).map((record) => (
        <SankCard key={record.id} className="p-3 h-100">
          <Trophy size={16} color="var(--sanken-gold)" className="mb-2" />
          <p className="small text-body-secondary text-truncate mb-1">{record.exercise_name}</p>
          <p className="fs-5 fw-bold sank-tabular-nums mb-0">{record.value} kg</p>
        </SankCard>
      ))}
    </SankCarousel>
  )
}
