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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden">
      <AnimatePresence>
        {isFetching && (
          <motion.div
            key="route-progress"
            className="h-full bg-primary shadow-[0_0_8px_var(--primary)]"
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
