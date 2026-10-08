// Esta línea sirve para declarar la interfaz «StatTileProps».
interface StatTileProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «string».
  value: string
  // Esta línea sirve para declarar la propiedad «hint» con el valor o tipo «string».
  hint?: string
}

// Esta línea sirve para declarar el componente de la ficha de estadística.
export function StatTile({ label, value, hint }: StatTileProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «rounded-xl border border-border bg-card ».
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      {/* Esta línea sirve para mostrar la etiqueta de la estadística. */}
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      {/* Esta línea sirve para mostrar el valor de la estadística. */}
      <p className="mt-1.5 font-heading text-4xl font-bold tracking-tight text-foreground tabular-nums">{value}</p>
      {/* Esta línea sirve para mostrar el elemento solo si «hint». */}
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
