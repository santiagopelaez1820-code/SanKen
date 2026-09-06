import type { ProductCategory } from "@sanken/core"
import { cn } from "@/lib/utils"

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  protein: "Proteínas",
  creatine: "Creatinas",
  pre_workout: "Pre-entrenos",
  amino_acids: "Aminoácidos",
  vitamins: "Vitaminas",
  other: "Otros",
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[]

interface CategoryChipsProps {
  value: ProductCategory | null
  onChange: (value: ProductCategory | null) => void
}

export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <div className="d-flex gap-2 overflow-x-auto pb-1">
      <Chip label="Todas" active={value === null} onClick={() => onChange(null)} />
      {CATEGORIES.map((category) => (
        <Chip key={category} label={CATEGORY_LABELS[category]} active={value === category} onClick={() => onChange(category)} />
      ))}
    </div>
  )
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-shrink-0 rounded-pill border fw-semibold small px-3 py-2",
        !active && "border-secondary-subtle text-body-secondary bg-transparent"
      )}
      style={active ? { background: "var(--sanken-cyan)", color: "#050505", border: "none" } : undefined}
    >
      {label}
    </button>
  )
}
