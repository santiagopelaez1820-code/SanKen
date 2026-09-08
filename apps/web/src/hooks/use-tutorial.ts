import { useEffect, useRef, useState, type RefObject } from "react"
import { tutorialStorage } from "@/lib/tutorial-storage"

export interface TutorialStep {
  /** Ref del elemento a resaltar. Si es null/no está montado, el paso se muestra como tarjeta centrada sin recorte (útil para pantallas con contenido condicional). */
  target?: RefObject<HTMLElement | null>
  title: string
  description: string
}

/**
 * Espejo de apps/mobile/src/hooks/use-tutorial.ts. Arranca automáticamente
 * (una sola vez por usuario+sección) la primera vez que `ready` es true,
 * hay un `userId` conocido, y ese usuario no lo vio antes.
 */
export function useTutorial(
  section: string,
  steps: TutorialStep[],
  ready: boolean = true,
  userId: number | string | null | undefined
) {
  const [isOpen, setIsOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const checkedRef = useRef(false)

  useEffect(() => {
    if (!ready || !userId || steps.length === 0 || checkedRef.current) return
    checkedRef.current = true
    if (tutorialStorage.hasSeen(userId, section)) return
    const timer = setTimeout(() => setIsOpen(true), 500)
    return () => clearTimeout(timer)
  }, [ready, userId, section, steps.length])

  const finish = () => {
    if (userId) tutorialStorage.markSeen(userId, section)
    setIsOpen(false)
    setStepIndex(0)
  }

  const next = () => {
    if (stepIndex >= steps.length - 1) {
      finish()
      return
    }
    setStepIndex((i) => i + 1)
  }

  const prev = () => setStepIndex((i) => Math.max(0, i - 1))

  return { isOpen, stepIndex, steps, next, prev, skip: finish }
}
