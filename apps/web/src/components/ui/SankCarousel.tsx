import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SankCarouselProps {
  title?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  /** Ancho de cada item (CSS width válido). Default: pensado para cards de workout/reto. */
  itemWidth?: string
}

/**
 * Carrusel de cards multi-item. Desktop: flechas que desplazan por página
 * visible. Móvil: scroll-snap táctil nativo con la siguiente card asomando,
 * sin flechas (no aportan en touch). No es Bootstrap's Carousel (ese es
 * single-slide full-bleed, pensado para hero banners, no para filas de cards).
 */
export function SankCarousel({
  title,
  action,
  children,
  className,
  itemWidth = "min(78vw, 300px)",
}: SankCarouselProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const updateArrows = React.useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanScrollPrev(el.scrollLeft > 4)
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  React.useEffect(() => {
    updateArrows()
    const el = trackRef.current
    if (!el) return
    el.addEventListener("scroll", updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", updateArrows)
      ro.disconnect()
    }
  }, [updateArrows])

  function scrollByPage(direction: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" })
  }

  return (
    <section className={className}>
      {(title || action) && (
        <div className="d-flex align-items-center justify-content-between mb-3">
          {title && <h2 className="sank-eyebrow mb-0">{title}</h2>}
          <div className="d-flex align-items-center gap-2">
            {action}
            <div className="d-none d-md-flex gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32 }}
                onClick={() => scrollByPage(-1)}
                disabled={!canScrollPrev}
                aria-label="Anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32 }}
                onClick={() => scrollByPage(1)}
                disabled={!canScrollNext}
                aria-label="Siguiente"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      <div ref={trackRef} className={cn("sank-scroll-x gap-3 pb-1")}>
        {React.Children.map(children, (child) => (
          <div className="flex-shrink-0" style={{ width: itemWidth }}>
            {child}
          </div>
        ))}
      </div>
    </section>
  )
}
