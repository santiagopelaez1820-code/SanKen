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
    <div className="flex min-h-svh bg-background text-foreground">
      <RouteProgressBar />
      <Sidebar />
      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1">
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
