// Esta línea sirve para importar los tipos «ProductCategory» desde «@sanken/core».
import type { ProductCategory } from "@sanken/core"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar el nombre visible de cada categoría de producto.
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  // Esta línea sirve para declarar la propiedad «protein» con el valor o tipo «"Proteínas"».
  protein: "Proteínas",
  // Esta línea sirve para declarar la propiedad «creatine» con el valor o tipo «"Creatinas"».
  creatine: "Creatinas",
  // Esta línea sirve para declarar la propiedad «pre_workout» con el valor o tipo «"Pre-entrenos"».
  pre_workout: "Pre-entrenos",
  // Esta línea sirve para declarar la propiedad «amino_acids» con el valor o tipo «"Aminoácidos"».
  amino_acids: "Aminoácidos",
  // Esta línea sirve para declarar la propiedad «vitamins» con el valor o tipo «"Vitaminas"».
  vitamins: "Vitaminas",
  // Esta línea sirve para declarar la propiedad «other» con el valor o tipo «"Otros"».
  other: "Otros",
}

// Esta línea sirve para obtener la lista de categorías.
const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[]

// Esta línea sirve para declarar la interfaz «CategoryChipsProps».
interface CategoryChipsProps {
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «ProductCategory | null».
  value: ProductCategory | null
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(value: ProductCategory | null) => void».
  onChange: (value: ProductCategory | null) => void
}

// Esta línea sirve para declarar el componente de chips de categoría.
export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «d-flex gap-2 overflow-x-auto pb-1».
    <div className="d-flex gap-2 overflow-x-auto pb-1">
      {/* Esta línea sirve para mostrar el componente «Chip». */}
      <Chip label="Todas" active={value === null} onClick={() => onChange(null)} />
      {/* Esta línea sirve para recorrer «CATEGORIES» y mostrar un bloque por elemento. */}
      {CATEGORIES.map((category) => (
        // Esta línea sirve para mostrar el componente «Chip».
        <Chip key={category} label={CATEGORY_LABELS[category]} active={value === category} onClick={() => onChange(category)} />
      ))}
    </div>
  )
}

// Esta línea sirve para declarar el chip de una categoría.
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
    <button
      // Esta línea sirve para definir el atributo «type» con el valor «button».
      type="button"
      // Esta línea sirve para asignar el manejador del evento «onClick».
      onClick={onClick}
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn(».
      className={cn(
        // Esta línea sirve para aplicar las clases base del chip.
        "flex-shrink-0 rounded-pill border fw-semibold small px-3 py-2",
        // Esta línea sirve para aplicar el estilo apagado cuando no está activo.
        !active && "border-secondary-subtle text-body-secondary bg-transparent"
      )}
      // Esta línea sirve para pasar la propiedad «style» con el valor «active ? { background: "var(--sanken-cyan)", ».
      style={active ? { background: "var(--sanken-cyan)", color: "#050505", border: "none" } : undefined}
    >
      {/* Esta línea sirve para mostrar el valor «label». */}
      {label}
    </button>
  )
}
