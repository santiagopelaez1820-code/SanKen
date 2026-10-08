// Esta línea sirve para importar todo el módulo como «React» desde «react».
import * as React from "react"
// Esta línea sirve para importar «Card» desde «react-bootstrap».
import { Card } from "react-bootstrap"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar la interfaz «SankCardProps».
interface SankCardProps extends React.ComponentProps<typeof Card> {
  // Esta línea sirve para declarar la propiedad «interactive» con el valor o tipo «boolean».
  interactive?: boolean
}

/** Card base: superficie con sombra en dos capas, no el borde plano de Bootstrap. */
// Esta línea sirve para declarar el componente de tarjeta de SanKen.
export function SankCard({ interactive = false, className, children, ...props }: SankCardProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «Card» con sus atributos en varias líneas.
    <Card
      // Esta línea sirve para aplicar las clases de estilo calculadas: «cn("sank-surface border-0", interactive && "s».
      className={cn("sank-surface border-0", interactive && "sank-surface--interactive", className)}
      // Esta línea sirve para mostrar el valor «...props».
      {...props}
    >
      {/* Esta línea sirve para mostrar el valor «children». */}
      {children}
    </Card>
  )
}

// Esta línea sirve para declarar la interfaz «SankCardHeroProps».
interface SankCardHeroProps {
  /** URL de imagen real; si no hay imagen disponible, se usa un degradado de marca. */
  // Esta línea sirve para declarar la propiedad «image» con el valor o tipo «string».
  image?: string
  // Esta línea sirve para declarar la propiedad «overlay» con el valor o tipo «React.ReactNode».
  overlay?: React.ReactNode
  // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «number».
  height?: number
  // Esta línea sirve para declarar la propiedad «children» con el valor o tipo «React.ReactNode».
  children?: React.ReactNode
}

/** Zona hero de una card: imagen (o degradado de marca si no hay asset) + badge flotante. */
// Esta línea sirve para declarar la cabecera con imagen de la tarjeta.
export function SankCardHero({ image, overlay, height = 160, children }: SankCardHeroProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
    <div
      // Esta línea sirve para aplicar las clases de estilo «position-relative d-flex align-items-end p-3».
      className="position-relative d-flex align-items-end p-3"
      // Esta línea sirve para pasar la propiedad «style» con el valor «{».
      style={{
        // Esta línea sirve para incluir el valor «height» en la lista.
        height,
        // Esta línea sirve para declarar la propiedad «backgroundImage» con el valor o tipo «image».
        backgroundImage: image
          // Esta línea sirve para usar la imagen con un degradado oscuro encima.
          ? `linear-gradient(180deg, rgba(11,11,11,0) 40%, rgba(11,11,11,0.75) 100%), url(${image})`
          // Esta línea sirve para usar un degradado de la marca si no hay imagen.
          : "radial-gradient(120% 140% at 15% 0%, rgba(0, 184, 217, 0.28), transparent 60%), linear-gradient(155deg, var(--sanken-charcoal), var(--sanken-black-2))",
        // Esta línea sirve para declarar la propiedad «backgroundSize» con el valor o tipo «"cover"».
        backgroundSize: "cover",
        // Esta línea sirve para declarar la propiedad «backgroundPosition» con el valor o tipo «"center"».
        backgroundPosition: "center",
      }}
    >
      {/* Esta línea sirve para mostrar el elemento solo si «overlay». */}
      {overlay && <div className="position-absolute top-0 end-0 m-3">{overlay}</div>}
      {/* Esta línea sirve para mostrar el valor «children». */}
      {children}
    </div>
  )
}

// Esta línea sirve para declarar la interfaz «SankCardStatProps».
interface SankCardStatProps {
  // Esta línea sirve para declarar la propiedad «label» con el valor o tipo «string».
  label: string
  // Esta línea sirve para declarar la propiedad «value» con el valor o tipo «React.ReactNode».
  value: React.ReactNode
}

/** Línea de metadatos "6 ejercicios · 52 min" — separador tipográfico, no icono repetido. */
// Esta línea sirve para declarar la lista de datos de la tarjeta.
export function SankCardMeta({ items }: { items: React.ReactNode[] }) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «p» con las clases «small text-body-secondary mb-2 d-flex al».
    <p className="small text-body-secondary mb-2 d-flex align-items-center gap-2 flex-wrap">
      {/* Esta línea sirve para recorrer «items» y mostrar un bloque por elemento. */}
      {items.map((item, i) => (
        // Esta línea sirve para abrir el componente «React.Fragment».
        <React.Fragment key={i}>
          {/* Esta línea sirve para mostrar el elemento solo si «i > 0». */}
          {i > 0 && <span aria-hidden="true">·</span>}
          {/* Esta línea sirve para mostrar cada dato. */}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </p>
  )
}

// Esta línea sirve para declarar la estadística de la tarjeta.
export function SankCardStat({ label, value }: SankCardStatProps) {
  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div».
    <div>
      {/* Esta línea sirve para mostrar el valor de la estadística. */}
      <div className="fs-5 fw-bold sank-tabular-nums">{value}</div>
      {/* Esta línea sirve para mostrar la etiqueta de la estadística. */}
      <div className="small text-body-secondary">{label}</div>
    </div>
  )
}
