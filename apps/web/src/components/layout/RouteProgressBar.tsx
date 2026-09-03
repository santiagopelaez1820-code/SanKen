import { useIsFetching } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"

/**
 * Barra fina arriba del todo que se muestra mientras hay queries de
 * TanStack Query en vuelo -- lee `useIsFetching()`, que ya existe
 * globalmente, no agrega ningún estado ni lógica de fetching nueva.
 */
export function RouteProgressBar() {
  const isFetching = useIsFetching() > 0

  return (
    <div
      className="position-fixed top-0 start-0 end-0 overflow-hidden"
      style={{ height: 2, zIndex: 1060, pointerEvents: "none" }}
    >
      <AnimatePresence>
        {isFetching && (
          <motion.div
            key="route-progress"
            style={{
              height: "100%",
              background: "var(--sanken-cyan)",
              boxShadow: "0 0 8px var(--sanken-cyan)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%", transition: { duration: 0.25, ease: "easeIn" } }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
