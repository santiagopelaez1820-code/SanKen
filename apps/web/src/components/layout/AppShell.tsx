import { useState } from "react"
import { motion } from "framer-motion"
import { Outlet, useLocation } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer"
import { RouteProgressBar } from "@/components/layout/RouteProgressBar"
import { EASE_OUT } from "@/lib/motion"

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="d-flex" style={{ minHeight: "100svh", background: "var(--sanken-black)" }}>
      <RouteProgressBar />
      <Sidebar />
      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <TopBar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-grow-1">
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
    </div>
  )
}
