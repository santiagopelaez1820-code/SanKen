// Esta línea sirve para importar «useEffect, useLayoutEffect, useState» desde «react».
import { useEffect, useLayoutEffect, useState } from "react"
// Esta línea sirve para importar «createPortal» desde «react-dom».
import { createPortal } from "react-dom"
// Esta línea sirve para importar «AnimatePresence, motion» desde «framer-motion».
import { AnimatePresence, motion } from "framer-motion"
// Esta línea sirve para importar los tipos «TutorialStep» desde «@/hooks/use-tutorial».
import type { TutorialStep } from "@/hooks/use-tutorial"

// Esta línea sirve para declarar la interfaz «SpotlightOverlayProps».
interface SpotlightOverlayProps {
  // Esta línea sirve para declarar la propiedad «steps» con el valor o tipo «TutorialStep[]».
  steps: TutorialStep[]
  // Esta línea sirve para declarar la propiedad «stepIndex» con el valor o tipo «number».
  stepIndex: number
  // Esta línea sirve para declarar la propiedad «onNext» con el valor o tipo «() => void».
  onNext: () => void
  // Esta línea sirve para declarar la propiedad «onPrev» con el valor o tipo «() => void».
  onPrev: () => void
  // Esta línea sirve para declarar la propiedad «onSkip» con el valor o tipo «() => void».
  onSkip: () => void
}

// Esta línea sirve para declarar la interfaz «Rect».
interface Rect {
  // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «number».
  top: number
  // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «number».
  left: number
  // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «number».
  width: number
  // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «number».
  height: number
}

// Esta línea sirve para definir el margen alrededor del elemento resaltado.
const PADDING = 8
// Esta línea sirve para definir el ancho de la tarjeta explicativa.
const CARD_WIDTH = 320

/**
 * Motor genérico de "coach marks": recuadro que ilumina un elemento real de
 * la pantalla (técnica del box-shadow gigante — un div del tamaño exacto
 * del target con `box-shadow: 0 0 0 9999px rgba(...)` alrededor, sin
 * necesidad de clip-path) + tooltip con progreso y navegación. Si el paso
 * no tiene `target` o el elemento no está montado, se muestra como tarjeta
 * centrada sin recorte (pantallas con contenido condicional, ver
 * useTutorial). Portal a document.body para no pelear con el stacking
 * context de cada página (varias usan react-bootstrap, otras Tailwind).
 */
// Esta línea sirve para declarar el componente que resalta un elemento y explica cada paso.
export function SpotlightOverlay({ steps, stepIndex, onNext, onPrev, onSkip }: SpotlightOverlayProps) {
  // Esta línea sirve para guardar la posición del elemento resaltado.
  const [rect, setRect] = useState<Rect | null>(null)
  // Esta línea sirve para guardar el tamaño de la ventana.
  const [viewport, setViewport] = useState(() => ({
    // Esta línea sirve para usar el ancho de la ventana o 1024 si no hay ventana.
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    // Esta línea sirve para usar el alto de la ventana o 768 si no hay ventana.
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  }))
  // Esta línea sirve para obtener el paso actual.
  const step = steps[stepIndex]

  // Esta línea sirve para declarar el efecto que mide el elemento antes de pintar.
  useLayoutEffect(() => {
    // Esta línea sirve para obtener el elemento del paso.
    const el = step?.target?.current
    // Esta línea sirve para revisar si no hay elemento.
    if (!el) {
      // Esta línea sirve para limpiar la posición resaltada.
      setRect(null)
      // Esta línea sirve para terminar el efecto.
      return
    }

    // Esta línea sirve para declarar la función que mide el elemento.
    const measure = () => {
      // Esta línea sirve para obtener el rectángulo del elemento.
      const r = el.getBoundingClientRect()
      // Esta línea sirve para guardar el tamaño actual de la ventana.
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      // Esta línea sirve para guardar la posición del elemento.
      setRect({
        // Esta línea sirve para declarar la propiedad «top» con el valor o tipo «r.top - PADDING».
        top: r.top - PADDING,
        // Esta línea sirve para declarar la propiedad «left» con el valor o tipo «r.left - PADDING».
        left: r.left - PADDING,
        // Esta línea sirve para declarar la propiedad «width» con el valor o tipo «r.width + PADDING * 2».
        width: r.width + PADDING * 2,
        // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «r.height + PADDING * 2».
        height: r.height + PADDING * 2,
      })
    }

    // Esta línea sirve para desplazar la página hasta centrar el elemento.
    el.scrollIntoView({ behavior: "smooth", block: "center" })
    // Esta línea sirve para volver a medir tras la animación de scroll.
    const timer = setTimeout(measure, 300)
    // Esta línea sirve para volver a medir al cambiar el tamaño de la ventana.
    window.addEventListener("resize", measure)
    // Esta línea sirve para volver a medir al hacer scroll.
    window.addEventListener("scroll", measure, true)
    // Esta línea sirve para devolver la función de limpieza.
    return () => {
      // Esta línea sirve para cancelar la medición pendiente.
      clearTimeout(timer)
      // Esta línea sirve para dejar de escuchar el cambio de tamaño.
      window.removeEventListener("resize", measure)
      // Esta línea sirve para dejar de escuchar el scroll.
      window.removeEventListener("scroll", measure, true)
    }
  // Esta línea sirve para volver a ejecutar el efecto cuando cambia el paso.
  }, [step])

  // Esta línea sirve para declarar un efecto que se ejecuta al renderizar.
  useEffect(() => {
    // Esta línea sirve para declarar el manejador del teclado.
    const onKey = (e: KeyboardEvent) => {
      // Esta línea sirve para saltar el tutorial con Escape.
      if (e.key === "Escape") onSkip()
      // Esta línea sirve para avanzar con la flecha derecha.
      else if (e.key === "ArrowRight") onNext()
      // Esta línea sirve para retroceder con la flecha izquierda.
      else if (e.key === "ArrowLeft") onPrev()
    }
    // Esta línea sirve para escuchar las teclas.
    window.addEventListener("keydown", onKey)
    // Esta línea sirve para devolver la función que deja de escuchar.
    return () => window.removeEventListener("keydown", onKey)
  // Esta línea sirve para volver a ejecutar el efecto si cambian los callbacks.
  }, [onNext, onPrev, onSkip])

  // Esta línea sirve para evitar mostrar algo si no hay paso o documento.
  if (!step || typeof document === "undefined") return null

  // Esta línea sirve para calcular el ancho de la tarjeta sin salirse de la pantalla.
  const cardWidth = Math.min(CARD_WIDTH, viewport.width - 32)

  // Esta línea sirve para declarar la posición vertical de la tarjeta.
  let cardTop: number
  // Esta línea sirve para revisar si la tarjeta cabe debajo del elemento.
  if (rect && rect.top + rect.height + 220 < viewport.height) {
    // Esta línea sirve para colocar la tarjeta debajo del elemento.
    cardTop = rect.top + rect.height + 16
  // Esta línea sirve para revisar si hay elemento aunque no quepa abajo.
  } else if (rect) {
    // Esta línea sirve para colocar la tarjeta encima del elemento.
    cardTop = Math.max(16, rect.top - 210)
  // Esta línea sirve para tratar el caso sin elemento.
  } else {
    // Esta línea sirve para centrar la tarjeta verticalmente.
    cardTop = viewport.height / 2 - 110
  }

  // Esta línea sirve para calcular la posición horizontal centrada en el elemento.
  let cardLeft = rect ? rect.left + rect.width / 2 - cardWidth / 2 : viewport.width / 2 - cardWidth / 2
  // Esta línea sirve para limitar la posición horizontal a los bordes de la pantalla.
  cardLeft = Math.min(Math.max(16, cardLeft), viewport.width - cardWidth - 16)

  // Esta línea sirve para devolver el contenido dentro de un portal.
  return createPortal(
    // Esta línea sirve para abrir el elemento «div» con las clases «fixed inset-0 z-[999]».
    <div className="fixed inset-0 z-[999]" role="dialog" aria-modal="true" aria-label={step.title}>
      {/* Esta línea sirve para abrir el recuadro animado que resalta el elemento. */}
      <motion.div
        // Esta línea sirve para aplicar las clases de estilo «absolute rounded-xl».
        className="absolute rounded-xl"
        // Esta línea sirve para pasar la propiedad «initial» con el valor «false}».
        initial={false}
        // Esta línea sirve para pasar la propiedad «animate» con el valor «».
        animate={
          // Esta línea sirve para revisar si hay elemento medido.
          rect
            // Esta línea sirve para animar hacia la posición y tamaño del elemento.
            ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height, opacity: 1 }
            // Esta línea sirve para animar hacia el centro de la pantalla si no hay elemento.
            : { top: viewport.height / 2, left: viewport.width / 2, width: 0, height: 0, opacity: 1 }
        }
        // Esta línea sirve para pasar la propiedad «transition» con el valor «{ type: "spring", stiffness: 300, damping: 30».
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        // Esta línea sirve para pasar la propiedad «style» con el valor «{ boxShadow: "0 0 0 9999px rgba(3, 7, 12, 0.7».
        style={{ boxShadow: "0 0 0 9999px rgba(3, 7, 12, 0.78)", pointerEvents: "none" }}
      />

      {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
      <button
        // Esta línea sirve para definir el atributo «type» con el valor «button».
        type="button"
        // Esta línea sirve para definir el atributo «aria-label» con el valor «Continuar tutorial».
        aria-label="Continuar tutorial"
        // Esta línea sirve para asignar el manejador del evento «onClick».
        onClick={onNext}
        // Esta línea sirve para aplicar las clases de estilo «absolute inset-0 h-full w-full cursor-default».
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
      />

      {/* Esta línea sirve para abrir el componente «AnimatePresence». */}
      <AnimatePresence mode="wait">
        {/* Esta línea sirve para abrir la tarjeta animada del paso. */}
        <motion.div
          // Esta línea sirve para identificar el elemento de la lista con «stepIndex}».
          key={stepIndex}
          // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 0, y: 8 }}».
          initial={{ opacity: 0, y: 8 }}
          // Esta línea sirve para pasar la propiedad «animate» con el valor «{ opacity: 1, y: 0 }}».
          animate={{ opacity: 1, y: 0 }}
          // Esta línea sirve para pasar la propiedad «exit» con el valor «{ opacity: 0 }}».
          exit={{ opacity: 0 }}
          // Esta línea sirve para pasar la propiedad «transition» con el valor «{ duration: 0.18 }}».
          transition={{ duration: 0.18 }}
          // Esta línea sirve para aplicar las clases de estilo «absolute rounded-2xl border border-border bg-».
          className="absolute rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-2xl"
          // Esta línea sirve para pasar la propiedad «style» con el valor «{ top: cardTop, left: cardLeft, width: cardWi».
          style={{ top: cardTop, left: cardLeft, width: cardWidth }}
        >
          {/* Esta línea sirve para mostrar el título del paso. */}
          <p className="font-heading text-sm font-semibold">{step.title}</p>
          {/* Esta línea sirve para mostrar la descripción del paso. */}
          <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

          {/* Esta línea sirve para abrir el elemento «div» con las clases «mt-3 flex items-center justify-between g». */}
          <div className="mt-3 flex items-center justify-between gap-2">
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex gap-1». */}
            <div className="flex gap-1">
              {/* Esta línea sirve para recorrer «steps» y mostrar un bloque por elemento. */}
              {steps.map((_, i) => (
                // Esta línea sirve para abrir el elemento «span».
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === stepIndex ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
            {/* Esta línea sirve para abrir el elemento «div» con las clases «flex items-center gap-3». */}
            <div className="flex items-center gap-3">
              {/* Esta línea sirve para abrir el elemento «button». */}
              <button onClick={onSkip} className="text-xs text-muted-foreground hover:text-foreground">
                {/* Esta línea sirve para mostrar el texto «Saltar». */}
                Saltar
              </button>
              {/* Esta línea sirve para mostrar el bloque solo si «stepIndex > 0». */}
              {stepIndex > 0 && (
                // Esta línea sirve para abrir el elemento «button».
                <button onClick={onPrev} className="text-xs text-muted-foreground hover:text-foreground">
                  {/* Esta línea sirve para mostrar el texto «Atrás». */}
                  Atrás
                </button>
              )}
              {/* Esta línea sirve para abrir el elemento «button» con sus atributos en varias líneas. */}
              <button
                // Esta línea sirve para asignar el manejador del evento «onClick».
                onClick={onNext}
                // Esta línea sirve para aplicar las clases de estilo «rounded-lg bg-primary px-3 py-1.5 text-xs fon».
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                {/* Esta línea sirve para mostrar «Entendido» en el último paso o «Siguiente». */}
                {stepIndex === steps.length - 1 ? "Entendido" : "Siguiente"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    // Esta línea sirve para montar el portal en el body del documento.
    document.body
  )
}
