// Esta línea sirve para importar los tipos «Transition, Variants» desde «framer-motion».
import type { Transition, Variants } from "framer-motion"

/**
 * Curva y duración compartidas por toda la app -- todo lo que anima debe
 * sentirse del mismo "ritmo", no cada componente con su propio timing.
 */
// Esta línea sirve para declarar «EASE_OUT» con el valor «[0.22, 1, 0.36, 1]».
export const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1]
// Esta línea sirve para declarar «DURATION» con el valor «0.35».
export const DURATION = 0.35

// Esta línea sirve para declarar «fadeInUp» con el valor «{».
export const fadeInUp: Variants = {
  // Esta línea sirve para declarar la propiedad «hidden» con el valor o tipo «{ opacity: 0, y: 12 }».
  hidden: { opacity: 0, y: 12 },
  // Esta línea sirve para definir la variante visible con opacidad total y su transición.
  show: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE_OUT } },
}

/** Envolver una lista con esto y cada hijo con `fadeInUp` para un stagger consistente. */
// Esta línea sirve para declarar la variante contenedora que escalona la aparición de sus hijos.
export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  // Esta línea sirve para declarar la propiedad «hidden» con el valor o tipo «{}».
  hidden: {},
  // Esta línea sirve para declarar la propiedad «show» con el valor o tipo «{».
  show: {
    // Esta línea sirve para declarar la propiedad «transition» con el valor o tipo «{ staggerChildren, delayChildren }».
    transition: { staggerChildren, delayChildren },
  },
})
