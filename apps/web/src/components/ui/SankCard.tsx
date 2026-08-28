import * as React from "react"
import { Card } from "react-bootstrap"
import { cn } from "@/lib/utils"

interface SankCardProps extends React.ComponentProps<typeof Card> {
  interactive?: boolean
}

/** Card base: superficie con sombra en dos capas, no el borde plano de Bootstrap. */
export function SankCard({ interactive = false, className, children, ...props }: SankCardProps) {
  return (
    <Card
      className={cn("sank-surface border-0", interactive && "sank-surface--interactive", className)}
      {...props}
    >
      {children}
    </Card>
  )
}

interface SankCardHeroProps {
  /** URL de imagen real; si no hay imagen disponible, se usa un degradado de marca. */
  image?: string
  overlay?: React.ReactNode
  height?: number
  children?: React.ReactNode
}

/** Zona hero de una card: imagen (o degradado de marca si no hay asset) + badge flotante. */
export function SankCardHero({ image, overlay, height = 160, children }: SankCardHeroProps) {
  return (
    <div
      className="position-relative d-flex align-items-end p-3"
      style={{
        height,
        backgroundImage: image
          ? `linear-gradient(180deg, rgba(11,11,11,0) 40%, rgba(11,11,11,0.75) 100%), url(${image})`
          : "radial-gradient(120% 140% at 15% 0%, rgba(0, 184, 217, 0.28), transparent 60%), linear-gradient(155deg, var(--sanken-charcoal), var(--sanken-black-2))",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {overlay && <div className="position-absolute top-0 end-0 m-3">{overlay}</div>}
      {children}
    </div>
  )
}

interface SankCardStatProps {
  label: string
  value: React.ReactNode
}

/** Línea de metadatos "6 ejercicios · 52 min" — separador tipográfico, no icono repetido. */
export function SankCardMeta({ items }: { items: React.ReactNode[] }) {
  return (
    <p className="small text-body-secondary mb-2 d-flex align-items-center gap-2 flex-wrap">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span aria-hidden="true">·</span>}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </p>
  )
}

export function SankCardStat({ label, value }: SankCardStatProps) {
  return (
    <div>
      <div className="fs-5 fw-bold sank-tabular-nums">{value}</div>
      <div className="small text-body-secondary">{label}</div>
    </div>
  )
}
