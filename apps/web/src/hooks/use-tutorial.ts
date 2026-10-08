// Esta línea sirve para importar «useEffect, useRef, useState, type RefObject» desde «react».
import { useEffect, useRef, useState, type RefObject } from "react"
// Esta línea sirve para importar «tutorialStorage» desde «@/lib/tutorial-storage».
import { tutorialStorage } from "@/lib/tutorial-storage"

// Esta línea sirve para declarar la interfaz «TutorialStep».
export interface TutorialStep {
  /** Ref del elemento a resaltar. Si es null/no está montado, el paso se muestra como tarjeta centrada sin recorte (útil para pantallas con contenido condicional). */
  // Esta línea sirve para declarar la propiedad «target» con el valor o tipo «RefObject<HTMLElement | null>».
  target?: RefObject<HTMLElement | null>
  // Esta línea sirve para declarar la propiedad «title» con el valor o tipo «string».
  title: string
  // Esta línea sirve para declarar la propiedad «description» con el valor o tipo «string».
  description: string
}

/**
 * Espejo de apps/mobile/src/hooks/use-tutorial.ts. Arranca automáticamente
 * (una sola vez por usuario+sección) la primera vez que `ready` es true,
 * hay un `userId` conocido, y ese usuario no lo vio antes.
 */
// Esta línea sirve para declarar el hook que gestiona un tutorial por secciones.
export function useTutorial(
  // Esta línea sirve para declarar la propiedad «section» con el valor o tipo «string».
  section: string,
  // Esta línea sirve para declarar la propiedad «steps» con el valor o tipo «TutorialStep[]».
  steps: TutorialStep[],
  // Esta línea sirve para declarar la propiedad «ready» con el valor o tipo «boolean = true».
  ready: boolean = true,
  // Esta línea sirve para declarar la propiedad «userId» con el valor o tipo «number | string | null | undefined».
  userId: number | string | null | undefined
// Esta línea sirve para cerrar los parámetros del hook.
) {
  // Esta línea sirve para guardar si el tutorial está abierto.
  const [isOpen, setIsOpen] = useState(false)
  // Esta línea sirve para guardar el índice del paso actual.
  const [stepIndex, setStepIndex] = useState(0)
  // Esta línea sirve para declarar «checkedRef» con el valor «useRef(false)».
  const checkedRef = useRef(false)

  // Esta línea sirve para declarar el efecto que abre el tutorial la primera vez.
  useEffect(() => {
    // Esta línea sirve para salir si la pantalla no está lista, no hay usuario, no hay pasos o ya se revisó.
    if (!ready || !userId || steps.length === 0 || checkedRef.current) return
    // Esta línea sirve para asignar «true» a «checkedRef.current».
    checkedRef.current = true
    // Esta línea sirve para salir de la función si «tutorialStorage.hasSeen(userId, section)».
    if (tutorialStorage.hasSeen(userId, section)) return
    // Esta línea sirve para declarar «timer» con el valor «setTimeout(() => setIsOpen(true), 500)».
    const timer = setTimeout(() => setIsOpen(true), 500)
    // Esta línea sirve para devolver «() => clearTimeout(timer)».
    return () => clearTimeout(timer)
  // Esta línea sirve para volver a ejecutar el efecto si cambian los datos del tutorial.
  }, [ready, userId, section, steps.length])

  // Esta línea sirve para declarar «finish» con el valor «() => {».
  const finish = () => {
    // Esta línea sirve para marcar el tutorial como visto si hay usuario.
    if (userId) tutorialStorage.markSeen(userId, section)
    // Esta línea sirve para llamar a «setIsOpen» con «false».
    setIsOpen(false)
    // Esta línea sirve para llamar a «setStepIndex» con «0».
    setStepIndex(0)
  }

  // Esta línea sirve para declarar «next» con el valor «() => {».
  const next = () => {
    // Esta línea sirve para revisar si «stepIndex >= steps.length - 1».
    if (stepIndex >= steps.length - 1) {
      // Esta línea sirve para llamar a «finish».
      finish()
      // Esta línea sirve para terminar la función sin devolver nada.
      return
    }
    // Esta línea sirve para llamar a «setStepIndex» con «(i) => i + 1».
    setStepIndex((i) => i + 1)
  }

  // Esta línea sirve para declarar «prev» con el valor «() => setStepIndex((i) => Math.max(0, i - 1))».
  const prev = () => setStepIndex((i) => Math.max(0, i - 1))

  // Esta línea sirve para devolver el estado y las acciones del tutorial.
  return { isOpen, stepIndex, steps, next, prev, skip: finish }
}
