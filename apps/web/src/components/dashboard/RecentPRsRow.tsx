// Esta línea sirve para importar «Link» desde «react-router-dom».
import { Link } from "react-router-dom"
// Esta línea sirve para importar «Trophy» desde «lucide-react».
import { Trophy } from "lucide-react"
// Esta línea sirve para importar «formatPersonalRecord, type PersonalRecordSummary» desde «@sanken/core».
import { formatPersonalRecord, type PersonalRecordSummary } from "@sanken/core"
// Esta línea sirve para importar «SankCard» desde «@/components/ui/SankCard».
import { SankCard } from "@/components/ui/SankCard"
// Esta línea sirve para importar «SankEmptyState» desde «@/components/ui/SankEmptyState».
import { SankEmptyState } from "@/components/ui/SankEmptyState"
// Esta línea sirve para importar «SankCarousel» desde «@/components/ui/SankCarousel».
import { SankCarousel } from "@/components/ui/SankCarousel"

// Esta línea sirve para declarar el componente de la fila de récords recientes.
export function RecentPRsRow({ records }: { records: PersonalRecordSummary[] }) {
  // Esta línea sirve para revisar si no hay récords.
  if (records.length === 0) {
    // Esta línea sirve para devolver la interfaz del componente.
    return (
      // Esta línea sirve para abrir el elemento «div» con las clases «sank-surface rounded-2 p-4».
      <div className="sank-surface rounded-2 p-4">
        {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center justify-conten». */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          {/* Esta línea sirve para mostrar el título de la sección. */}
          <h2 className="sank-eyebrow mb-0">Récords recientes</h2>
        </div>
        {/* Esta línea sirve para abrir el componente «SankEmptyState». */}
        <SankEmptyState icon={Trophy} title="Sin récords todavía" description="Registra tu primer PR desde PR y Rankings." />
      </div>
    )
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «SankCarousel» con sus atributos en varias líneas.
    <SankCarousel
      // Esta línea sirve para definir el atributo «title» con el valor «Récords recientes».
      title="Récords recientes"
      // Esta línea sirve para definir el atributo «itemWidth» con el valor «152px».
      itemWidth="152px"
      // Esta línea sirve para pasar la propiedad «action» con el valor «».
      action={
        // Esta línea sirve para abrir el componente «Link».
        <Link to="/progress" className="small fw-medium text-decoration-none" style={{ color: "var(--sanken-cyan-light)" }}>
          {/* Esta línea sirve para mostrar el texto «Ver todos». */}
          Ver todos
        </Link>
      }
    >
      {/* Esta línea sirve para recorrer «records.slice(0, 8)» y mostrar un bloque por elemento. */}
      {records.slice(0, 8).map((record) => (
        // Esta línea sirve para abrir el componente «SankCard».
        <SankCard key={record.id} className="p-3 h-100">
          {/* Esta línea sirve para abrir el componente «Trophy». */}
          <Trophy size={16} color="var(--sanken-cyan)" className="mb-2" />
          {/* Esta línea sirve para mostrar el nombre del ejercicio del récord. */}
          <p className="small text-body-secondary text-truncate mb-1">{record.exercise_name}</p>
          {/* Esta línea sirve para mostrar el valor del récord con formato. */}
          <p className="fs-5 fw-bold sank-tabular-nums mb-0">{formatPersonalRecord(record)}</p>
        </SankCard>
      ))}
    </SankCarousel>
  )
}
