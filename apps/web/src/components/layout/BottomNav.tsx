import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { BarChart3, Dumbbell, Flag, LayoutDashboard, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { MoreSheet } from "@/components/layout/MoreSheet"

const TABS = [
  { label: "Inicio", path: "/dashboard", icon: LayoutDashboard },
  { label: "Progreso", path: "/progress", icon: BarChart3 },
] as const

const TABS_RIGHT = [
  { label: "Retos", path: "/challenges", icon: Flag },
] as const

/** Navegación primaria de mobile: 4 tabs + FAB central, reemplaza el patrón hamburguesa+drawer. */
export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [moreOpen, setMoreOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <nav className="sank-bottom-nav d-lg-none">
        {TABS.map((tab) => (
          <Link key={tab.path} to={tab.path} className={cn("sank-bottom-nav-link", isActive(tab.path) && "sank-bottom-nav-link-active")}>
            <tab.icon size={20} strokeWidth={isActive(tab.path) ? 2.4 : 2} />
            {tab.label}
          </Link>
        ))}

        <div className="d-flex align-items-center justify-content-center" style={{ flex: 1 }}>
          <button
            type="button"
            className="sank-bottom-nav-fab"
            onClick={() => navigate("/workout/precheck")}
            aria-label="Comenzar entrenamiento"
          >
            <Dumbbell size={22} strokeWidth={2.3} />
          </button>
        </div>

        {TABS_RIGHT.map((tab) => (
          <Link key={tab.path} to={tab.path} className={cn("sank-bottom-nav-link", isActive(tab.path) && "sank-bottom-nav-link-active")}>
            <tab.icon size={20} strokeWidth={isActive(tab.path) ? 2.4 : 2} />
            {tab.label}
          </Link>
        ))}

        <button type="button" className="sank-bottom-nav-link border-0 bg-transparent" onClick={() => setMoreOpen(true)}>
          <Menu size={20} />
          Más
        </button>
      </nav>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  )
}
