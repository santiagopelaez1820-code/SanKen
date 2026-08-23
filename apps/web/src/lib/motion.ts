import type { Transition, Variants } from "framer-motion"

/**
 * Curva y duración compartidas por toda la app -- todo lo que anima debe
 * sentirse del mismo "ritmo", no cada componente con su propio timing.
 */
export const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1]
export const DURATION = 0.35

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE_OUT } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION, ease: EASE_OUT } },
}

/** Envolver una lista con esto y cada hijo con `fadeInUp` para un stagger consistente. */
export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})
