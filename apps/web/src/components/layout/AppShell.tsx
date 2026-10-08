// Esta línea sirve para importar «motion» desde «framer-motion».
import { motion } from "framer-motion"
// Esta línea sirve para importar «Outlet, useLocation» desde «react-router-dom».
import { Outlet, useLocation } from "react-router-dom"
// Esta línea sirve para importar «TopBar» desde «@/components/layout/TopBar».
import { TopBar } from "@/components/layout/TopBar"
// Esta línea sirve para importar «BottomNav» desde «@/components/layout/BottomNav».
import { BottomNav } from "@/components/layout/BottomNav"
// Esta línea sirve para importar «RouteProgressBar» desde «@/components/layout/RouteProgressBar».
import { RouteProgressBar } from "@/components/layout/RouteProgressBar"
// Esta línea sirve para importar «EASE_OUT» desde «@/lib/motion».
import { EASE_OUT } from "@/lib/motion"
// Esta línea sirve para importar «LegalLinks» desde «@/components/legal/LegalLinks».
import { LegalLinks } from "@/components/legal/LegalLinks"
// Esta línea sirve para importar «WeeklyCheckinPrompt» desde «@/components/support/WeeklyCheckinPrompt».
import { WeeklyCheckinPrompt } from "@/components/support/WeeklyCheckinPrompt"

// Esta línea sirve para declarar el componente del diseño general de la app.
export function AppShell() {
  // Esta línea sirve para obtener «location» con el hook «useLocation».
  const location = useLocation()

  // Esta línea sirve para devolver la interfaz del componente.
  return (
    // Esta línea sirve para abrir el elemento «div» con las clases «d-flex flex-column».
    <div className="d-flex flex-column" style={{ minHeight: "100svh", background: "var(--sanken-black)" }}>
      {/* Esta línea sirve para abrir el componente «RouteProgressBar». */}
      <RouteProgressBar />
      {/* Esta línea sirve para abrir el componente «TopBar». */}
      <TopBar />
      {/* Esta línea sirve para abrir el elemento «main» con las clases «flex-grow-1 sank-content-safe-bottom». */}
      <main className="flex-grow-1 sank-content-safe-bottom">
        {/* Esta línea sirve para abrir el contenedor animado del contenido de la página. */}
        <motion.div
          // Esta línea sirve para identificar el elemento de la lista con «location.pathname}».
          key={location.pathname}
          // Esta línea sirve para pasar la propiedad «initial» con el valor «{ opacity: 0, y: 6 }}».
          initial={{ opacity: 0, y: 6 }}
          // Esta línea sirve para pasar la propiedad «animate» con el valor «{ opacity: 1, y: 0 }}».
          animate={{ opacity: 1, y: 0 }}
          // Esta línea sirve para pasar la propiedad «transition» con el valor «{ duration: 0.22, ease: EASE_OUT }}».
          transition={{ duration: 0.22, ease: EASE_OUT }}
        >
          {/* Esta línea sirve para abrir el componente «Outlet». */}
          <Outlet />
        </motion.div>
        {/* Esta línea sirve para abrir el elemento «footer» con las clases «px-4 pt-2 pb-6». */}
        <footer className="px-4 pt-2 pb-6">
          {/* Esta línea sirve para abrir el componente «LegalLinks». */}
          <LegalLinks />
        </footer>
      </main>
      {/* Esta línea sirve para abrir el componente «BottomNav». */}
      <BottomNav />
      {/* Esta línea sirve para abrir el componente «WeeklyCheckinPrompt». */}
      <WeeklyCheckinPrompt />
    </div>
  )
}
