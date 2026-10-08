// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"

// Esta línea sirve para declarar la interfaz «MetricRingProps».
interface MetricRingProps {
  /** Progreso actual, 0..max */
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «number».
  value: number
  // Esta línea sirve para declarar la propiedad «max» con el valor o tipo «number».
  max: number
  // Esta línea sirve para declarar la propiedad «size» con el valor o tipo «number».
  size?: number
  // Esta línea sirve para declarar la propiedad «strokeWidth» con el valor o tipo «number».
  strokeWidth?: number
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string
  // Esta línea sirve para declarar la propiedad «valueLabel» con el valor o tipo «string».
  valueLabel: string
  /** Halo sutil detrás del ring — reservado para el hero principal, no para rings secundarios */
  // Esta línea sirve para declarar la propiedad «glow» con el valor o tipo «boolean».
  glow?: boolean
  // Esta línea sirve para declarar la propiedad «className» con el valor o tipo «string».
  className?: string
}

// Esta línea sirve para declarar el componente del anillo de métrica.
export function MetricRing({
  // Esta línea sirve para incluir el valor «value» en la lista.
  value,
  // Esta línea sirve para incluir el valor «max» en la lista.
  max,
  // Esta línea sirve para incluir el valor «size» en la lista.
  size = 120,
  // Esta línea sirve para incluir el valor «strokeWidth» en la lista.
  strokeWidth = 10,
  // Esta línea sirve para incluir el valor «label» en la lista.
  label,
  // Esta línea sirve para incluir el valor «valueLabel» en la lista.
  valueLabel,
  // Esta línea sirve para incluir el valor «glow» en la lista.
  glow = false,
  // Esta línea sirve para incluir el valor «className» en la lista.
  className,
// Esta línea sirve para cerrar los parámetros del componente.
}: MetricRingProps) {
  // Esta línea sirve para calcular la fracción llenada entre 0 y 1.
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0
  // Esta línea sirve para calcular el radio del anillo.
  const radius = (size - strokeWidth) / 2
  // Esta línea sirve para calcular la circunferencia del anillo.
  const circumference = 2 * Math.PI * radius

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div».
    <div className={`d-flex flex-column align-items-center gap-2 ${className ?? ""}`}>
      {/* Esta línea sirve para abrir el elemento «div» con las clases «position-relative». */}
      <div className="position-relative" style={{ width: size, height: size }}>
        {/* Esta línea sirve para mostrar el bloque solo si «glow». */}
        {glow && (
          // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
          <div
            // Esta línea sirve para aplicar las clases de estilo «position-absolute top-0 start-0 w-100 h-100 r».
            className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
            // Esta línea sirve para pasar la propiedad «style» con el valor «{ background: "var(--sanken-cyan)", opacity: ».
            style={{ background: "var(--sanken-cyan)", opacity: 0.25, filter: "blur(20px)" }}
            // Esta línea sirve para ocultar el anillo para lectores de pantalla.
            aria-hidden
          />
        )}
        {/* Esta línea sirve para abrir el elemento «svg». */}
        <svg width={size} height={size} className="position-relative" style={{ transform: "rotate(-90deg)" }}>
          {/* Esta línea sirve para abrir el elemento «circle» con sus atributos en varias líneas. */}
          <circle
            // Esta línea sirve para pasar la propiedad «cx» con el valor «size / 2}».
            cx={size / 2}
            // Esta línea sirve para pasar la propiedad «cy» con el valor «size / 2}».
            cy={size / 2}
            // Esta línea sirve para pasar la propiedad «r» con el valor «radius}».
            r={radius}
            // Esta línea sirve para definir el atributo «fill» con el valor «none».
            fill="none"
            // Esta línea sirve para definir el atributo «stroke» con el valor «rgba(255,255,255,0.08)».
            stroke="rgba(255,255,255,0.08)"
            // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «strokeWidth}».
            strokeWidth={strokeWidth}
          />
          {/* Esta línea sirve para abrir el círculo animado de progreso. */}
          <motion.circle
            // Esta línea sirve para pasar la propiedad «cx» con el valor «size / 2}».
            cx={size / 2}
            // Esta línea sirve para pasar la propiedad «cy» con el valor «size / 2}».
            cy={size / 2}
            // Esta línea sirve para pasar la propiedad «r» con el valor «radius}».
            r={radius}
            // Esta línea sirve para definir el atributo «fill» con el valor «none».
            fill="none"
            // Esta línea sirve para definir el atributo «stroke» con el valor «var(--sanken-cyan)».
            stroke="var(--sanken-cyan)"
            // Esta línea sirve para pasar la propiedad «strokeWidth» con el valor «strokeWidth}».
            strokeWidth={strokeWidth}
            // Esta línea sirve para definir el atributo «strokeLinecap» con el valor «round».
            strokeLinecap="round"
            // Esta línea sirve para pasar la propiedad «strokeDasharray» con el valor «circumference}».
            strokeDasharray={circumference}
            // Esta línea sirve para pasar la propiedad «initial» con el valor «{ strokeDashoffset: circumference }}».
            initial={{ strokeDashoffset: circumference }}
            // Esta línea sirve para pasar la propiedad «animate» con el valor «{ strokeDashoffset: circumference * (1 - pct)».
            animate={{ strokeDashoffset: circumference * (1 - pct) }}
            // Esta línea sirve para pasar la propiedad «transition» con el valor «{ type: "spring", stiffness: 60, damping: 16 ».
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
          />
        </svg>
        {/* Esta línea sirve para abrir el elemento «div» con las clases «position-absolute top-0 start-0 w-100 h-». */}
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center">
          {/* Esta línea sirve para mostrar la etiqueta del valor. */}
          <span className="fw-bold fs-5 sank-tabular-nums">{valueLabel}</span>
        </div>
      </div>
      {/* Esta línea sirve para abrir el elemento «span» con las clases «small fw-semibold text-uppercase text-bo». */}
      <span className="small fw-semibold text-uppercase text-body-secondary" style={{ letterSpacing: "0.08em", fontSize: "0.68rem" }}>
        {/* Esta línea sirve para mostrar el valor «label». */}
        {label}
      </span>
    </div>
  )
}
