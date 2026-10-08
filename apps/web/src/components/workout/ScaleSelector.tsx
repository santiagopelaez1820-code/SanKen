// Esta línea sirve para declarar la interfaz «ScaleSelectorProps».
interface ScaleSelectorProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «number | null».
  value: number | null
  // Esta línea sirve para declarar la propiedad «onChange» con el valor o tipo «(value: number) => void».
  onChange: (value: number) => void
  // Esta línea sirve para declarar la propiedad «max» con el valor o tipo «number».
  max?: number
}

// Esta línea sirve para declarar el selector de escala numérica.
export function ScaleSelector({ label, value, onChange, max = 5 }: ScaleSelectorProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «space-y-1.5».
    <div className="space-y-1.5">
      {/* Esta línea sirve para mostrar la etiqueta del selector. */}
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {/* Esta línea sirve para abrir el elemento «div» con las clases «flex gap-2». */}
      <div className="flex gap-2">
        {/* Esta línea sirve para recorrer «Array.from({ length: max }, (_, i) => i + 1)» y mostrar un bloque por elemento. */}
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          // Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas.
          <button
            // Esta línea sirve para identificar el elemento de la lista con «n}».
            key={n}
            // Esta línea sirve para definir el atributo «type» con el valor «button».
            type="button"
            // Esta línea sirve para asignar el manejador del evento «onClick».
            onClick={() => onChange(n)}
            // Esta línea sirve para pasar la propiedad «aria-pressed» con el valor «value === n}».
            aria-pressed={value === n}
            // Esta línea sirve para aplicar las clases de estilo «flex h-9 w-9 items-center justify-center roun».
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
              // Esta línea sirve para revisar si el valor es el número seleccionado.
              value === n
                // Esta línea sirve para pintar el botón seleccionado con el color primario.
                ? "border-primary bg-primary text-primary-foreground"
                // Esta línea sirve para pintar el resto con el color neutro.
                : "border-input bg-background text-foreground hover:bg-muted"
            // Esta línea sirve para cerrar las clases del botón.
            }`}
          >
            {/* Esta línea sirve para mostrar el valor «n». */}
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
