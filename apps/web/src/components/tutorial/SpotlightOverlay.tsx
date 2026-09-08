import { useEffect, useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import type { TutorialStep } from "@/hooks/use-tutorial"

interface SpotlightOverlayProps {
  steps: TutorialStep[]
  stepIndex: number
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

const PADDING = 8
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
export function SpotlightOverlay({ steps, stepIndex, onNext, onPrev, onSkip }: SpotlightOverlayProps) {
  const [rect, setRect] = useState<Rect | null>(null)
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  }))
  const step = steps[stepIndex]

  useLayoutEffect(() => {
    const el = step?.target?.current
    if (!el) {
      setRect(null)
      return
    }

    const measure = () => {
      const r = el.getBoundingClientRect()
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      setRect({
        top: r.top - PADDING,
        left: r.left - PADDING,
        width: r.width + PADDING * 2,
        height: r.height + PADDING * 2,
      })
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" })
    const timer = setTimeout(measure, 300)
    window.addEventListener("resize", measure)
    window.addEventListener("scroll", measure, true)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", measure, true)
    }
  }, [step])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip()
      else if (e.key === "ArrowRight") onNext()
      else if (e.key === "ArrowLeft") onPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onNext, onPrev, onSkip])

  if (!step || typeof document === "undefined") return null

  const cardWidth = Math.min(CARD_WIDTH, viewport.width - 32)

  let cardTop: number
  if (rect && rect.top + rect.height + 220 < viewport.height) {
    cardTop = rect.top + rect.height + 16
  } else if (rect) {
    cardTop = Math.max(16, rect.top - 210)
  } else {
    cardTop = viewport.height / 2 - 110
  }

  let cardLeft = rect ? rect.left + rect.width / 2 - cardWidth / 2 : viewport.width / 2 - cardWidth / 2
  cardLeft = Math.min(Math.max(16, cardLeft), viewport.width - cardWidth - 16)

  return createPortal(
    <div className="fixed inset-0 z-[999]" role="dialog" aria-modal="true" aria-label={step.title}>
      <motion.div
        className="absolute rounded-xl"
        initial={false}
        animate={
          rect
            ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height, opacity: 1 }
            : { top: viewport.height / 2, left: viewport.width / 2, width: 0, height: 0, opacity: 1 }
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ boxShadow: "0 0 0 9999px rgba(3, 7, 12, 0.78)", pointerEvents: "none" }}
      />

      <button
        type="button"
        aria-label="Continuar tutorial"
        onClick={onNext}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-2xl"
          style={{ top: cardTop, left: cardLeft, width: cardWidth }}
        >
          <p className="font-heading text-sm font-semibold">{step.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === stepIndex ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onSkip} className="text-xs text-muted-foreground hover:text-foreground">
                Saltar
              </button>
              {stepIndex > 0 && (
                <button onClick={onPrev} className="text-xs text-muted-foreground hover:text-foreground">
                  Atrás
                </button>
              )}
              <button
                onClick={onNext}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                {stepIndex === steps.length - 1 ? "Entendido" : "Siguiente"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  )
}
