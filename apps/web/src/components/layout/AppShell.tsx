import { motion } from "framer-motion"
import { Outlet, useLocation } from "react-router-dom"
import { TopBar } from "@/components/layout/TopBar"
import { BottomNav } from "@/components/layout/BottomNav"
import { RouteProgressBar } from "@/components/layout/RouteProgressBar"
import { EASE_OUT } from "@/lib/motion"
import { LegalLinks } from "@/components/legal/LegalLinks"

export function AppShell() {
  const location = useLocation()

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100svh", background: "var(--sanken-black)" }}>
      <RouteProgressBar />
      <TopBar />
      <main className="flex-grow-1 sank-content-safe-bottom">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
        >
          <Outlet />
        </motion.div>
        <footer className="px-4 pt-2 pb-6">
          <LegalLinks />
        </footer>
      </main>
      <BottomNav />
    </div>
  )
}
