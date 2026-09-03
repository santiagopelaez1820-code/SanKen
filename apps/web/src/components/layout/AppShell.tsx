import { motion } from "framer-motion"
import { Outlet, useLocation } from "react-router-dom"
import { IconRail } from "@/components/layout/IconRail"
import { TopBar } from "@/components/layout/TopBar"
import { BottomNav } from "@/components/layout/BottomNav"
import { RouteProgressBar } from "@/components/layout/RouteProgressBar"
import { EASE_OUT } from "@/lib/motion"

export function AppShell() {
  const location = useLocation()

  return (
    <div className="d-flex" style={{ minHeight: "100svh", background: "var(--sanken-black)" }}>
      <RouteProgressBar />
      <IconRail />
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
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
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
