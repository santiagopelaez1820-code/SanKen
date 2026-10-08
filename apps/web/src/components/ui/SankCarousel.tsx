// Esta línea sirve para importar todo el módulo como «React» desde «react».
import * as React from "react"
// Esta línea sirve para importar «ChevronLeft, ChevronRight» desde «lucide-react».
import { ChevronLeft, ChevronRight } from "lucide-react"
// Esta línea sirve para importar «cn» desde «@/lib/utils».
import { cn } from "@/lib/utils"

// Esta línea sirve para declarar la interfaz «SankCarouselProps».
interface SankCarouselProps {
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «string».
  title?: string
  // Esta línea sirve para declarar la propiedad «action» con el valor o tipo «React.ReactNode».
  action?: React.ReactNode
  // Esta línea sirve para declarar la propiedad «children» con el valor o tipo «React.ReactNode».
  children: React.ReactNode
  // Esta línea sirve para declarar la propiedad «className» con el valor o tipo «string».
  className?: string
  /** Ancho de cada item (CSS width válido). Default: pensado para cards de workout/reto. */
  // Esta línea sirve para declarar la propiedad «itemWidth» con el valor o tipo «string».
  itemWidth?: string
}

/**
 * Carrusel de cards multi-item. Desktop: flechas que desplazan por página
 * visible. Móvil: scroll-snap táctil nativo con la siguiente card asomando,
 * sin flechas (no aportan en touch). No es Bootstrap's Carousel (ese es
 * single-slide full-bleed, pensado para hero banners, no para filas de cards).
 */
// Esta línea sirve para declarar el componente del carrusel.
export function SankCarousel({
  // Esta línea sirve para incluir el valor «title» en la lista.
  title,
  // Esta línea sirve para incluir el valor «action» en la lista.
  action,
  // Esta línea sirve para incluir el valor «children» en la lista.
  children,
  // Esta línea sirve para incluir el valor «className» en la lista.
  className,
  // Esta línea sirve para definir el ancho por defecto de cada elemento.
  itemWidth = "min(78vw, 300px)",
// Esta línea sirve para cerrar los parámetros del componente.
}: SankCarouselProps) {
  // Esta línea sirve para crear la referencia a la pista del carrusel.
  const trackRef = React.useRef<HTMLDivElement>(null)
  // Esta línea sirve para guardar si se puede desplazar hacia atrás.
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  // Esta línea sirve para guardar si se puede desplazar hacia adelante.
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  // Esta línea sirve para declarar la función que actualiza las flechas.
  const updateArrows = React.useCallback(() => {
    // Esta línea sirve para obtener la pista del carrusel.
    const el = trackRef.current
    // Esta línea sirve para salir si no existe.
    if (!el) return
    // Esta línea sirve para habilitar la flecha anterior si hay desplazamiento.
    setCanScrollPrev(el.scrollLeft > 4)
    // Esta línea sirve para habilitar la flecha siguiente si queda contenido.
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  // Esta línea sirve para mantener la misma función entre renders.
  }, [])

  // Esta línea sirve para declarar el efecto que escucha el desplazamiento.
  React.useEffect(() => {
    // Esta línea sirve para actualizar las flechas de inmediato.
    updateArrows()
    // Esta línea sirve para obtener la pista del carrusel.
    const el = trackRef.current
    // Esta línea sirve para salir si no existe.
    if (!el) return
    // Esta línea sirve para escuchar el scroll de la pista.
    el.addEventListener("scroll", updateArrows, { passive: true })
    // Esta línea sirve para crear el observador de cambios de tamaño.
    const ro = new ResizeObserver(updateArrows)
    // Esta línea sirve para empezar a observar la pista.
    ro.observe(el)
    // Esta línea sirve para devolver la función de limpieza.
    return () => {
      // Esta línea sirve para dejar de escuchar el scroll.
      el.removeEventListener("scroll", updateArrows)
      // Esta línea sirve para dejar de observar el tamaño.
      ro.disconnect()
    }
  // Esta línea sirve para volver a ejecutar el efecto si cambia la función.
  }, [updateArrows])

  // Esta línea sirve para declarar la función que desplaza una página.
  function scrollByPage(direction: 1 | -1) {
    // Esta línea sirve para obtener la pista del carrusel.
    const el = trackRef.current
    // Esta línea sirve para salir si no existe.
    if (!el) return
    // Esta línea sirve para desplazar el 85% del ancho en la dirección pedida.
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" })
  }

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «section».
    <section className={className}>
      {/* Esta línea sirve para mostrar el bloque solo si «(title || action)». */}
      {(title || action) && (
        // Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center justify-conten».
        <div className="d-flex align-items-center justify-content-between mb-3">
          {/* Esta línea sirve para mostrar el elemento solo si «title». */}
          {title && <h2 className="sank-eyebrow mb-0">{title}</h2>}
          {/* Esta línea sirve para abrir el elemento «div» con las clases «d-flex align-items-center gap-2». */}
          <div className="d-flex align-items-center gap-2">
            {/* Esta línea sirve para mostrar el valor «action». */}
            {action}
            {/* Esta línea sirve para abrir el elemento «div» con las clases «d-none d-md-flex gap-1». */}
            <div className="d-none d-md-flex gap-1">
              {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
              <button
                // Esta línea sirve para definir el atributo «type» con el valor «button».
                type="button"
                // Esta línea sirve para aplicar las clases de estilo «btn btn-sm btn-outline-secondary rounded-circ».
                className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: 32, height: 32 }}».
                style={{ width: 32, height: 32 }}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => scrollByPage(-1)}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «!canScrollPrev}».
                disabled={!canScrollPrev}
                // Esta línea sirve para definir el atributo «aria-label» con el valor «Anterior».
                aria-label="Anterior"
              >
                {/* Esta línea sirve para abrir el componente «ChevronLeft». */}
                <ChevronLeft size={16} />
              </button>
              {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
              <button
                // Esta línea sirve para definir el atributo «type» con el valor «button».
                type="button"
                // Esta línea sirve para aplicar las clases de estilo «btn btn-sm btn-outline-secondary rounded-circ».
                className="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                // Esta línea sirve para pasar la propiedad «style» con el valor «{ width: 32, height: 32 }}».
                style={{ width: 32, height: 32 }}
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={() => scrollByPage(1)}
                // Esta línea sirve para pasar la propiedad «disabled» con el valor «!canScrollNext}».
                disabled={!canScrollNext}
                // Esta línea sirve para definir el atributo «aria-label» con el valor «Siguiente».
                aria-label="Siguiente"
              >
                {/* Esta línea sirve para abrir el componente «ChevronRight». */}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Esta línea sirve para abrir el elemento «div». */}
      <div ref={trackRef} className={cn("sank-scroll-x gap-3 pb-1")}>
        {/* Esta línea sirve para recorrer «React.Children» y mostrar un bloque por elemento. */}
        {React.Children.map(children, (child) => (
          // Esta línea sirve para abrir el elemento «div» con las clases «flex-shrink-0».
          <div className="flex-shrink-0" style={{ width: itemWidth }}>
            {/* Esta línea sirve para mostrar el valor «child». */}
            {child}
          </div>
        ))}
      </div>
    </section>
  )
}
