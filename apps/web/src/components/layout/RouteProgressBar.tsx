// Esta línea sirve para importar «useIsFetching» desde «@tanstack/react-query».
import { useIsFetching } from "@tanstack/react-query"
// Esta línea sirve para importar «AnimatePresence, motion» desde «framer-motion».
import { AnimatePresence, motion } from "framer-motion"

/**
 * Barra fina arriba del todo que se muestra mientras hay queries de
 * TanStack Query en vuelo -- lee `useIsFetching()`, que ya existe
 * globalmente, no agrega ningún estado ni lógica de fetching nueva.
 */
// Esta línea sirve para declarar el componente de la barra de progreso de navegación.
export function RouteProgressBar() {
  // Esta línea sirve para obtener «isFetching» con el hook «useIsFetching».
  const isFetching = useIsFetching() > 0

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con sus atributos en varias líneas.
    <div
      // Esta línea sirve para aplicar las clases de estilo «position-fixed top-0 start-0 end-0 overflow-h».
      className="position-fixed top-0 start-0 end-0 overflow-hidden"
      // Esta línea sirve para pasar la propiedad «style» con el valor «{ height: 2, zIndex: 1060, pointerEvents: "no».
      style={{ height: 2, zIndex: 1060, pointerEvents: "none" }}
    >
      {/* Esta línea sirve para abrir el componente «AnimatePresence». */}
      <AnimatePresence>
        {/* Esta línea sirve para mostrar el bloque solo si «isFetching». */}
        {isFetching && (
          // Esta línea sirve para abrir la barra animada.
          <motion.div
            // Esta línea sirve para definir el atributo «key» con el valor «route-progress».
            key="route-progress"
            // Esta línea sirve para pasar la propiedad «style» con el valor «{».
            style={{
              // Esta línea sirve para declarar la propiedad «height» con el valor o tipo «"100%"».
              height: "100%",
              // Esta línea sirve para declarar la propiedad «background» con el valor o tipo «"var(--sanken-cyan)"».
              background: "var(--sanken-cyan)",
              // Esta línea sirve para declarar la propiedad «boxShadow» con el valor o tipo «"0 0 8px var(--sanken-cyan)"».
              boxShadow: "0 0 8px var(--sanken-cyan)",
            }}
            // Esta línea sirve para pasar la propiedad «initial» con el valor «{ x: "-100%" }}».
            initial={{ x: "-100%" }}
            // Esta línea sirve para pasar la propiedad «animate» con el valor «{ x: "0%" }}».
            animate={{ x: "0%" }}
            // Esta línea sirve para pasar la propiedad «exit» con el valor «{ x: "100%", transition: { duration: 0.25, ea».
            exit={{ x: "100%", transition: { duration: 0.25, ease: "easeIn" } }}
            // Esta línea sirve para pasar la propiedad «transition» con el valor «{ duration: 0.9, ease: "easeOut" }}».
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
